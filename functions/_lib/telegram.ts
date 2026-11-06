// Utilidades compartidas por las Pages Functions que avisan al equipo por Telegram
// (/api/appointment y /api/lead). Los archivos de carpetas con "_" no son rutas.
// Secretos: TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID (Cloudflare Pages > Settings >
// Environment variables; en local, .dev.vars). Nunca en el código.

export interface TelegramEnv {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

const MAX_FIELD_LENGTH = 200;
const MAX_BODY_BYTES = 4096;
const TELEGRAM_TIMEOUT_MS = 8000;

export const json = (body: unknown, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/** Texto recortado; '' si no es string. */
export const field = (value: unknown, max = MAX_FIELD_LENGTH): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

/** Escapa el Markdown de Telegram para que el visitante no inyecte formato. */
export const escapeMarkdown = (value: string): string => value.replace(/[\\_*`[\]]/g, '\\$&');

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

/** Envía el aviso; devuelve null si salió bien o la Response de error. */
export async function sendTelegram(
  env: TelegramEnv,
  text: string,
  tag: string,
): Promise<Response | null> {
  const { TELEGRAM_BOT_TOKEN: botToken, TELEGRAM_CHAT_ID: chatId } = env;
  if (!botToken || !chatId) {
    console.error(`[${tag}] Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID en el entorno`);
    return json({ error: 'Servicio no disponible' }, 503);
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.error(`[${tag}] Telegram respondió`, res.status, await res.text());
      return json({ error: 'No pudimos enviar el aviso' }, 502);
    }
    return null;
  } catch (err) {
    console.error(`[${tag}] Error al enviar a Telegram:`, err);
    return json({ error: 'No pudimos enviar el aviso' }, 502);
  }
}
