/**
 * Proxy en vivo de https://www.eventosleymar.com para la preview interactiva.
 *
 * El sitio real envía `X-Frame-Options: DENY` y `frame-ancestors`, así que no
 * puede embeberse directamente. Esta Pages Function lo sirve bajo
 * /preview/eventosleymar/* desde nuestro propio dominio:
 *  - Quita las cabeceras anti-iframe e inyecta un pequeño script que mantiene
 *    la navegación dentro del proxy (los enlaces externos, como WhatsApp, se
 *    abren en una pestaña nueva).
 *  - /_next/* se reescribe a /preview/eventosleymar/_next/* (mismo origen): las
 *    fuentes de Next.js no envían CORS y fallarían cargadas desde otro dominio.
 *    Debe ser una ruta relativa a la raíz, no absoluta: Next.js deduce su
 *    assetPrefix del pathname de sus <script>.
 *  - Los fetch() a media.eventosleymar.com (videos del hero) pasan por
 *    /preview/eventosleymar/__media/*: ese bucket no envía CORS.
 *  - El resto de archivos estáticos (/brand/*.svg, favicon, /cdn-cgi/) apuntan
 *    directo al sitio real. No se usa <base href> al sitio real porque haría
 *    que las rutas /preview/... resolvieran contra su dominio.
 */

const UPSTREAM = 'https://www.eventosleymar.com';
const MEDIA = 'https://media.eventosleymar.com';
const PREFIX = '/preview/eventosleymar';
const MEDIA_PATH = '/__media';

// Solo se reescribe el texto; binarios (imágenes, fuentes) pasan tal cual.
const TEXT_TYPES = /text\/html|javascript|text\/css|text\/x-component|application\/json/i;

// Cabeceras de la petición que no deben llegar al sitio real.
const DROP_REQUEST =
  /^(host|origin|referer|cf-|x-forwarded-|x-real-ip|true-client-ip|accept-encoding)/i;

// Cabeceras de la respuesta que bloquean el iframe o dejan de ser válidas al reescribir.
const DROP_RESPONSE = [
  'x-frame-options',
  'content-security-policy',
  'content-security-policy-report-only',
  'strict-transport-security',
  'content-encoding',
  'content-length',
  'link',
  'report-to',
  'nel',
];

// Rutas relativas a la raíz de archivos estáticos (con extensión) o de /cdn-cgi/.
const STATIC_ASSET =
  /(?<![\w.\-\/])(?:\/cdn-cgi\/|\/(?!\/|_next\/|preview\/)(?:[\w\-%]+\/)*[\w\-%.]+\.(?:svg|png|jpe?g|webp|avif|gif|ico|mp4|webm|webmanifest)(?=[?"'\s)\\,]))/g;

interface Context {
  request: Request;
}

/** Script inyectado antes que Next.js: alinea la URL y enruta peticiones por el proxy. */
const bootScript = (upstreamPath: string) => `<script>(function(){
var P=${JSON.stringify(PREFIX)},U=${JSON.stringify(UPSTREAM)},M=${JSON.stringify(MEDIA)},O=location.origin;
try{history.replaceState(history.state,"",O+${JSON.stringify(upstreamPath)})}catch(e){}
function toProxy(u){try{var x=new URL(u,O+location.pathname);if((x.origin===O&&x.pathname.indexOf(P)!==0&&x.pathname.indexOf("/cdn-cgi/")!==0)||x.origin===U||x.origin==="https://eventosleymar.com")return O+P+x.pathname+x.search+x.hash}catch(e){}return null}
function toMedia(u){try{var x=new URL(u,O);if(x.origin===M)return O+P+${JSON.stringify(MEDIA_PATH)}+x.pathname+x.search}catch(e){}return null}
var f=window.fetch;window.fetch=function(i,o){var u=typeof i==="string"?i:i instanceof URL?i.href:i&&i.url,p=u&&(toProxy(u)||toMedia(u));if(p){i=typeof i==="string"||i instanceof URL?p:new Request(p,i)}return f.call(this,i,o)};
window.addEventListener("click",function(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target&&e.target.closest&&e.target.closest("a[href]");if(!a||(a.target&&a.target!=="_self")||a.hasAttribute("download"))return;var h=a.getAttribute("href");if(!h||h.charAt(0)==="#")return;var p=toProxy(a.href);if(p){e.preventDefault();location.assign(p)}else if(/^https?:/.test(a.href)){e.preventDefault();window.open(a.href,"_blank","noopener")}});
})();</script>`;

export async function onRequest({ request }: Context): Promise<Response> {
  const url = new URL(request.url);
  // next/image recibe rutas ya reescritas (?url=%2Fpreview%2Feventosleymar%2F_next...); se restauran.
  const search = url.search.split(encodeURIComponent(`${PREFIX}/`)).join('%2F');
  const path = url.pathname.slice(PREFIX.length) || '/';
  const target = path.startsWith(`${MEDIA_PATH}/`)
    ? `${MEDIA}${path.slice(MEDIA_PATH.length)}${search}`
    : `${UPSTREAM}${path}${search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!DROP_REQUEST.test(key)) headers.set(key, value);
  });
  // Next.js valida Origin en Server Actions (formularios); debe coincidir con el host real.
  if (request.method !== 'GET' && request.method !== 'HEAD') headers.set('origin', UPSTREAM);
  headers.set('referer', `${UPSTREAM}/`);

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
      redirect: 'follow',
    });
  } catch {
    return Response.redirect(UPSTREAM, 302);
  }

  const resHeaders = new Headers(upstream.headers);
  DROP_RESPONSE.forEach((h) => resHeaders.delete(h));
  resHeaders.delete('x-frame-options');
  resHeaders.set(
    'content-security-policy',
    "frame-ancestors 'self' https://rembrandtstudio.co https://www.rembrandtstudio.co http://localhost:*",
  );
  resHeaders.set('x-robots-tag', 'noindex, nofollow');
  // Las cookies del sitio real quedan limitadas a la ruta del proxy en nuestro dominio.
  const cookies = upstream.headers.getSetCookie?.() ?? [];
  if (cookies.length) {
    resHeaders.delete('set-cookie');
    cookies.forEach((c) =>
      resHeaders.append(
        'set-cookie',
        c.replace(/;\s*domain=[^;]*/gi, '').replace(/;\s*path=[^;]*/gi, `; Path=${PREFIX}`),
      ),
    );
  }

  const type = upstream.headers.get('content-type') ?? '';
  if (!TEXT_TYPES.test(type)) {
    return new Response(upstream.body, { status: upstream.status, headers: resHeaders });
  }

  // /_next/ pasa por el proxy; el resto de estáticos se cargan del sitio real.
  // Se aplica igual a HTML, RSC y JS para que el render del servidor y el cliente coincidan.
  let body = (await upstream.text())
    .replace(/(?<![\w.\-])\/_next\//g, `${PREFIX}/_next/`)
    .replace(STATIC_ASSET, `${UPSTREAM}$&`);
  // El texto reescrito depende de este proxy: caché corta en vez de "immutable".
  resHeaders.set('cache-control', 'public, max-age=300, s-maxage=3600');

  if (/text\/html/i.test(type)) {
    const upstreamPath = new URL(upstream.url || target).pathname;
    body = body.replace(
      /<head[^>]*>/i,
      (head) =>
        `${head}<meta name="robots" content="noindex, nofollow">${bootScript(upstreamPath)}`,
    );
  }

  return new Response(body, { status: upstream.status, headers: resHeaders });
}
