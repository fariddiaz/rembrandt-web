// POST /api/appointment (Cloudflare Pages Function)
// Aviso a Farid por WhatsApp cuando un cliente agenda una videollamada en /agendar.
// El registro de la cita lo hace Web3Forms desde el navegador (correo a
// hola@rembrandtstudio.co); este aviso es adicional y nunca bloquea al cliente:
// responde de inmediato y envía el aviso en segundo plano (waitUntil).
import { field, json, notifyFarid, readJsonBody, type NotifyEnv } from '../_lib/notify';

const PHONE_PATTERN = /^\+?[0-9\s()-]{7,20}$/;

interface PagesContext {
  request: Request;
  env: NotifyEnv;
  waitUntil: (promise: Promise<unknown>) => void;
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const raw = await readJsonBody(context.request);
  if (raw instanceof Response) return raw;
  if (typeof raw !== 'object' || raw === null) return json({ error: 'Solicitud inválida' }, 400);

  const r = raw as Record<string, unknown>;
  const name = field(r.clientName);
  const phone = field(r.clientPhone);
  const email = field(r.clientEmail);
  const company = field(r.companyName);
  const dateStr = field(r.dateStr);
  if (!name || !dateStr || !PHONE_PATTERN.test(phone)) {
    return json({ error: 'Faltan campos requeridos o el teléfono no es válido' }, 400);
  }

  const contact = [phone, email].filter(Boolean).join(' · ');
  context.waitUntil(
    notifyFarid(
      context.env,
      {
        event: 'appointment',
        source: 'web',
        name: company ? `${name} (${company})` : name,
        contact,
        service: field(r.serviceInterested) || 'Videollamada de diagnóstico',
        date: dateStr,
        time: field(r.timeSlot),
      },
      'appointment',
    ),
  );
  return json({ ok: true }, 202);
}
