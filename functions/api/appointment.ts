// POST /api/appointment (Cloudflare Pages Function)
// Recibe una cita agendada desde /agendar y avisa al equipo por Telegram.
// Secretos: TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID se leen del entorno
// (Cloudflare Pages > Settings > Environment variables; en local, .dev.vars).
// Nunca deben escribirse en el código.

interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

interface AppointmentInput {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  companyName: string;
  serviceInterested: string;
  dateStr: string;
  timeSlot: string;
}

const MAX_FIELD_LENGTH = 200;
const MAX_BODY_BYTES = 4096;
const TELEGRAM_TIMEOUT_MS = 8000;
const PHONE_PATTERN = /^\+?[0-9\s()-]{7,20}$/;

const json = (body: unknown, status: number): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Texto recortado; '' si no es string. */
const field = (value: unknown): string =>
  typeof value === 'string' ? value.trim().slice(0, MAX_FIELD_LENGTH) : '';

/** Escapa los caracteres de control del Markdown de Telegram para que el visitante no inyecte formato. */
const escapeMarkdown = (value: string): string => value.replace(/[_*`[\]]/g, '\\$&');

/** true si el Origin del navegador coincide con el host que atiende la petición ("null" o ausente = no). */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function parseInput(raw: unknown): AppointmentInput | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const input: AppointmentInput = {
    clientName: field(r.clientName),
    clientPhone: field(r.clientPhone),
    clientEmail: field(r.clientEmail),
    companyName: field(r.companyName),
    serviceInterested: field(r.serviceInterested),
    dateStr: field(r.dateStr),
    timeSlot: field(r.timeSlot),
  };
  if (!input.clientName || !input.dateStr || !PHONE_PATTERN.test(input.clientPhone)) return null;
  return input;
}

function buildMessage(a: AppointmentInput): string {
  const e = escapeMarkdown;
  const digits = a.clientPhone.replace(/[^0-9]/g, '');
  return (
    `*Nueva cita agendada desde la web*\n\n` +
    `*Contacto:* ${e(a.clientName)}\n` +
    `*Empresa:* ${e(a.companyName || 'No especificada')}\n` +
    `*WhatsApp:* +${digits}\n` +
    `*Email:* ${e(a.clientEmail || 'No especificado')}\n` +
    `*Servicio:* ${e(a.serviceInterested || 'Página Web Express')}\n` +
    `*Fecha:* ${e(a.dateStr)} a las ${e(a.timeSlot || '10:00 AM')}\n\n` +
    `Chatear: https://wa.me/${digits}`
  );
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { TELEGRAM_BOT_TOKEN: botToken, TELEGRAM_CHAT_ID: chatId } = context.env;
  if (!botToken || !chatId) {
    console.error('[appointment] Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID en el entorno');
    return json({ error: 'Servicio de agenda no disponible' }, 503);
  }

  const { request } = context;

  // Solo se aceptan envíos desde el propio sitio (el navegador fija Origin en un POST).
  if (!isSameOrigin(request)) {
    return json({ error: 'Origen no permitido' }, 403);
  }

  // Cuerpo acotado antes de parsear: una cita real ocupa menos de 2 KB.
  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) return json({ error: 'Solicitud demasiado grande' }, 413);

  let raw: unknown;
  try {
    raw = JSON.parse(body);
  } catch {
    return json({ error: 'Solicitud inválida' }, 400);
  }

  const input = parseInput(raw);
  if (!input) return json({ error: 'Faltan campos requeridos o el teléfono no es válido' }, 400);

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(input),
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.error('[appointment] Telegram respondió', res.status, await res.text());
      return json({ error: 'No pudimos registrar la cita. Escríbenos por WhatsApp.' }, 502);
    }
    return json({ ok: true }, 200);
  } catch (err) {
    console.error('[appointment] Error al enviar a Telegram:', err);
    return json({ error: 'No pudimos registrar la cita. Escríbenos por WhatsApp.' }, 502);
  }
}
