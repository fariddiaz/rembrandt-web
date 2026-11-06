// Proxy de previews en `astro dev`.
//
// En producción /preview/eventosleymar/* lo atiende la Cloudflare Pages Function
// functions/preview/eventosleymar/[[path]].ts. El servidor de desarrollo de Astro
// no ejecuta functions/, así que esas rutas caían en 404.astro dentro del iframe.
// Este plugin (solo `serve`, no afecta al build) carga esa MISMA función con
// ssrLoadModule y le pasa las peticiones: una sola implementación del proxy.

/** Prefijo → archivo de la Pages Function que lo atiende. */
const ROUTES = [
  {
    prefix: '/preview/eventosleymar',
    module: '/functions/preview/eventosleymar/[[path]].ts',
  },
];

/** Lee el cuerpo de una petición de Node (solo para métodos con cuerpo). */
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/** IncomingMessage de Node → Request de la Fetch API (lo que espera la función). */
async function toRequest(req) {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined || key.startsWith(':')) continue;
    headers.set(key, Array.isArray(value) ? value.join(', ') : value);
  }
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  return new Request(url, {
    method: req.method,
    headers,
    body: hasBody ? await readBody(req) : undefined,
  });
}

/** Response de la Fetch API → ServerResponse de Node. */
async function sendResponse(res, response) {
  res.statusCode = response.status;
  const cookies = response.headers.getSetCookie?.() ?? [];
  response.headers.forEach((value, key) => {
    if (key !== 'set-cookie') res.setHeader(key, value);
  });
  if (cookies.length) res.setHeader('set-cookie', cookies);
  res.end(Buffer.from(await response.arrayBuffer()));
}

export function devPreviewProxy() {
  return {
    name: 'rembrandt:dev-preview-proxy',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url ?? '').split('?')[0];
        const route = ROUTES.find((r) => path === r.prefix || path.startsWith(`${r.prefix}/`));
        if (!route) return next();
        try {
          const { onRequest } = await server.ssrLoadModule(route.module);
          await sendResponse(res, await onRequest({ request: await toRequest(req) }));
        } catch (err) {
          server.config.logger.error(`[preview-proxy] ${route.prefix}: ${err?.message ?? err}`);
          if (!res.headersSent) {
            res.statusCode = 502;
            res.end('Preview no disponible');
          }
        }
      });
    },
  };
}
