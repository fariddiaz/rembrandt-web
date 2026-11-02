// ─────────────────────────────────────────────────────────────
// Fuente única de verdad: precios, WhatsApp y textos por sección.
// Cambia aquí y se actualiza toda la web.
// ─────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBER = '573147714202'; // +57 314 771 4202, sin "+" ni espacios

export const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** Lo que muestra el botón flotante según la sección visible. */
export const waSections = {
  hero: {
    label: 'Cuéntanos tu idea',
    message: 'Hola Rembrandt Studio 👋 Vi su web y quiero una página para mi negocio.',
  },
  planes: {
    label: '¿Qué plan me conviene?',
    message: 'Hola, estoy viendo los planes y quiero que me recomienden el ideal para mi negocio.',
  },
  trabajo: {
    label: 'Quiero algo así',
    message: 'Hola, vi su trabajo reciente y quiero algo parecido para mi marca.',
  },
  proceso: {
    label: 'Empezar hoy',
    message: 'Hola, quiero empezar mi proyecto. ¿Qué necesitan de mi parte?',
  },
  cuidado: {
    label: 'Activar Plan Cuidado',
    message: 'Hola, me interesa el Plan Cuidado de $19 USD/mes para mi web.',
  },
  contacto: {
    label: 'Escríbenos ahora',
    message: 'Hola Rembrandt Studio, quiero cotizar mi proyecto.',
  },
} as const;

export type WaSectionKey = keyof typeof waSections;

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  priceUsd: string;
  priceCop?: string;
  unit?: string;
  delivery: string;
  features: string[];
  cta: string;
  message: string;
  featured?: boolean;
}

// ⚠️ Revisa las listas "features": son una propuesta de alcance, ajústalas a lo que realmente entregas.
export const plans: Plan[] = [
  {
    id: 'boceto',
    name: 'Boceto Express',
    tagline: 'Tu landing publicada en 24–48 horas.',
    priceUsd: '$249 USD',
    priceCop: '~$990.000 COP',
    delivery: 'Entrega en 24–48 h',
    features: [
      'Una página diseñada a la medida de tu marca',
      'Botón de WhatsApp y formulario de contacto',
      'Adaptada a celular, rápida y con SEO base',
      'Publicación en tu dominio',
    ],
    cta: 'Pedir mi boceto',
    message: 'Hola, quiero el Boceto Express ($249 USD). Mi negocio es: ',
  },
  {
    id: 'corporativa',
    name: 'Web Corporativa Multi-Sección',
    tagline: 'Toda tu empresa explicada con claridad, en varias páginas.',
    priceUsd: '$399 USD',
    priceCop: '~$1.590.000 COP',
    delivery: 'Entrega en 5–7 días hábiles',
    features: [
      'Inicio, servicios, nosotros, contacto y más',
      'Textos organizados para que te encuentren en Google',
      'Animaciones suaves y diseño de marca',
      'Integración con WhatsApp, mapas y redes',
    ],
    cta: 'Cotizar mi web corporativa',
    message: 'Hola, quiero la Web Corporativa Multi-Sección ($399 USD). Mi empresa es: ',
    featured: true,
  },
  {
    id: 'tienda',
    name: 'Catálogo & Tienda Ágil / 3D',
    tagline: 'Vende en línea, con productos que se pueden girar y explorar en 3D.',
    priceUsd: '$590 – $1.490 USD',
    delivery: 'Según catálogo y nivel de 3D',
    features: [
      'Catálogo o tienda con carrito y pagos',
      'Productos en 3D interactivo (opcional)',
      'Panel para editar productos y precios',
      'Pedidos directos a tu WhatsApp',
    ],
    cta: 'Cotizar mi tienda',
    message: 'Hola, quiero cotizar el Catálogo & Tienda Ágil / 3D. Vendo: ',
  },
];

export const carePlan = {
  name: 'Plan Cuidado',
  priceUsd: '$19 USD',
  unit: '/mes',
  features: [
    'Hosting, SSL y copias de seguridad',
    'Cambios pequeños de texto e imágenes',
    'Monitoreo para que tu web nunca se caiga',
  ],
  cta: 'Activar Plan Cuidado',
  message: waSections.cuidado.message,
};
