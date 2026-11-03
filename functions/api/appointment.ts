export async function onRequestPost(context: { request: Request }): Promise<Response> {
  try {
    const data = await context.request.json() as any;
    const { clientName, clientPhone, clientEmail, companyName, serviceInterested, dateStr, timeSlot } = data;

    if (!clientName || !clientPhone || !dateStr) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const botToken = '9208097026:AAFo6boufBMctQwRr6abV2H5yqho2-AzdmU';
    const chatId = '7079500158';

    const text = `📅 *¡Nueva Cita Agendada desde la Web!*\n\n` +
      `👤 *Contacto:* ${clientName}\n` +
      `🏢 *Empresa:* ${companyName || 'No especificada'}\n` +
      `📱 *WhatsApp:* +${clientPhone}\n` +
      `📧 *Email:* ${clientEmail || 'No especificado'}\n` +
      `🎯 *Servicio:* ${serviceInterested || 'Página Web Express'}\n` +
      `🗓 *Fecha:* ${dateStr} a las ${timeSlot || '10:00 AM'}\n\n` +
      `📲 *Chatear de inmediato:* https://wa.me/${clientPhone.replace(/[^0-9]/g, '')}`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
