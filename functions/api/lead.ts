// POST /api/lead (Cloudflare Pages Function)
// Aviso inmediato por Telegram cuando alguien envía el formulario de contacto.
// El correo completo lo entrega Web3Forms a hola@rembrandtstudio.co; este aviso
// es solo la alerta instantánea con lo esencial y un enlace para responder.
import {
  escapeMarkdown as e,
  field,
  json,
  readJsonBody,
  sendTelegram,
  type TelegramEnv,
} from '../_lib/telegram';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 600;

export async function onRequestPost(context: {
  request: Request;
  env: TelegramEnv;
}): Promise<Response> {
  const raw = await readJsonBody(context.request);
  if (raw instanceof Response) return raw;
  if (typeof raw !== 'object' || raw === null) return json({ error: 'Solicitud inválida' }, 400);

  const r = raw as Record<string, unknown>;
  const name = field(r.name);
  const email = field(r.email);
  const plan = field(r.plan);
  const budget = field(r.budget);
  const message = field(r.message, MAX_MESSAGE_LENGTH);
  if (!name || !EMAIL_PATTERN.test(email)) {
    return json({ error: 'Faltan nombre o correo válido' }, 400);
  }

  const text =
    `*Nueva solicitud desde el formulario web*\n\n` +
    `*Nombre:* ${e(name)}\n` +
    `*Email:* ${e(email)}\n` +
    `*Plan:* ${e(plan || 'No indicado')}\n` +
    `*Presupuesto:* ${e(budget || 'No indicado')}\n\n` +
    (message ? `${e(message)}\n\n` : '') +
    `Responder: mailto:${e(email)}`;

  const failure = await sendTelegram(context.env, text, 'lead');
  return failure ?? json({ ok: true }, 200);
}
