// POST /api/appointment (Cloudflare Pages Function)
// Recibe una cita agendada desde /agendar y avisa al equipo por Telegram.
// Validación de origen, tamaño y envío en ../_lib/telegram.ts.
import {
  escapeMarkdown as e,
  field,
  json,
  readJsonBody,
  sendTelegram,
  type TelegramEnv,
} from '../_lib/telegram';

interface AppointmentInput {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  companyName: string;
  serviceInterested: string;
  dateStr: string;
  timeSlot: string;
}

const PHONE_PATTERN = /^\+?[0-9\s()-]{7,20}$/;

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

export async function onRequestPost(context: {
  request: Request;
  env: TelegramEnv;
}): Promise<Response> {
  const raw = await readJsonBody(context.request);
  if (raw instanceof Response) return raw;

  const input = parseInput(raw);
  if (!input) {
    return json({ error: 'Faltan campos requeridos o el teléfono no es válido' }, 400);
  }

  const failure = await sendTelegram(context.env, buildMessage(input), 'appointment');
  return failure ?? json({ ok: true }, 200);
}
