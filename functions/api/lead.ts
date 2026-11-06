// POST /api/lead (Cloudflare Pages Function)
// Aviso a Farid por WhatsApp cuando alguien envía el formulario de contacto.
// El correo completo ya lo entregó Web3Forms a hola@rembrandtstudio.co; este
// aviso es adicional y nunca bloquea al cliente (waitUntil).
import { field, json, notifyFarid, readJsonBody, type NotifyEnv } from '../_lib/notify';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTE_MAX = 280;

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
  const name = field(r.name);
  const email = field(r.email);
  if (!name || !EMAIL_PATTERN.test(email)) {
    return json({ error: 'Faltan nombre o correo válido' }, 400);
  }

  const budget = field(r.budget);
  const message = field(r.message, NOTE_MAX);
  context.waitUntil(
    notifyFarid(
      context.env,
      {
        event: 'contact',
        source: 'web',
        name,
        contact: email,
        service: field(r.plan) || 'Sin plan indicado',
        note: [budget && `Presupuesto ${budget}`, message].filter(Boolean).join(' · '),
      },
      'lead',
    ),
  );
  return json({ ok: true }, 202);
}
