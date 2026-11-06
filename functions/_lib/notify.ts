// Utilidades compartidas por las Pages Functions que avisan a Farid por WhatsApp
// (/api/appointment y /api/lead). Los archivos de carpetas con "_" no son rutas.
//
// El aviso lo envía el servidor del bot (rembrandt-agent) por su ruta
// POST /api/notify-lead, publicada solo a través de Cloudflare Tunnel con HTTPS.
// Variables (Cloudflare Pages > rembrandtstudio > Settings > Variables, Production):
//   NOTIFY_LEAD_URL     URL completa de la ruta (p. ej. https://notify.rembrandtstudio.co/api/notify-lead)
//   NOTIFY_LEAD_SECRET  secreto compartido con la VM (tipo Secret). Nunca en el código.

export interface NotifyEnv {
  NOTIFY_LEAD_URL?: string;
  NOTIFY_LEAD_SECRET?: string;
}

/** Contrato con rembrandt-agent/src/notify/notifyLead.ts (parseNotifyPayload). */
export interface NotifyPayload {
  event: 'appointment' | 'contact';
  source: 'web';
  name: string;
  contact: string;
  service?: string;
  date?: string;
  time?: string;
  note?: string;
}

const MAX_FIELD_LENGTH = 200;
const MAX_BODY_BYTES = 4096;
const NOTIFY_TIMEOUT_MS = 8000;

export const json = (body: unknown, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/** Texto recortado; '' si no es string. */
export const field = (value: unknown, max = MAX_FIELD_LENGTH): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

/** true si el Origin del navegador coincide con el host que atiende la petición. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

/**
 * Valida origen y tamaño y devuelve el JSON del cuerpo, o una Response de error
 * lista para devolver.
 */
export async function readJsonBody(request: Request): Promise<unknown | Response> {
  if (!isSameOrigin(request)) return json({ error: 'Origen no permitido' }, 403);
  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) return json({ error: 'Solicitud demasiado grande' }, 413);
  try {
    return JSON.parse(body);
  } catch {
    return json({ error: 'Solicitud inválida' }, 400);
  }
}

/**
 * Pide al servidor del bot que avise a Farid. Nunca lanza: si falla, lo deja en
 * el log de Cloudflare (visible con "wrangler pages deployment tail") y devuelve
 * false. El registro del lead no depende de esto (lo guarda Web3Forms).
 */
export async function notifyFarid(
  env: NotifyEnv,
  payload: NotifyPayload,
  tag: string,
): Promise<boolean> {
  const { NOTIFY_LEAD_URL: url, NOTIFY_LEAD_SECRET: secret } = env;
  if (!url || !secret) {
    console.error(`[${tag}] AVISO NO ENVIADO: faltan NOTIFY_LEAD_URL o NOTIFY_LEAD_SECRET`);
    return false;
  }
  if (!url.startsWith('https://')) {
    console.error(`[${tag}] AVISO NO ENVIADO: NOTIFY_LEAD_URL debe usar HTTPS`);
    return false;
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`[${tag}] AVISO NO ENVIADO: el servidor respondió ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[${tag}] AVISO NO ENVIADO: error de red`, err);
    return false;
  }
}
