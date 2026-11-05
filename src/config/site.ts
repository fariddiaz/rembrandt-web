// ────────────────────────────────────────────────────────────
// Fuente única de verdad: precios, WhatsApp, planes y casos de éxito.
// Cambia aquí y se actualiza toda la web.
// ────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBER = '573147714202'; // +57 314 771 4202, sin "+" ni espacios
export const CONTACT_EMAIL = 'hola@rembrandtstudio.co';
/** Agenda propia de videollamadas (src/pages/agendar.astro). */
export const CALENDLY_LINK = '/agendar';

export const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** Escena Spline del robot 3D interactivo del Hero. */
export const HERO_ROBOT_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

/** Lo que muestra el botón flotante según la sección visible. */
export const waSections = {
  hero: {
    label: 'Cuéntanos tu idea',
    message: 'Hola Rembrandt Studio, vi su web y quiero una página para mi negocio.',
  },
  showcase: {
    label: 'Iniciar proyecto',
    message: 'Hola Rembrandt Studio, quiero cotizar un proyecto web para mi marca.',
  },
  planes: {
    label: '¿Qué plan me conviene?',
    message: 'Hola, estoy viendo los planes y quiero que me recomienden el ideal para mi negocio.',
  },
  trabajo: {
    label: 'Quiero algo así',
    message: 'Hola, vi sus casos de éxito y quiero algo parecido para mi marca.',
  },
  proceso: {
    label: 'Empezar hoy',
    message: 'Hola, quiero empezar mi proyecto. ¿Qué necesitan de mi parte?',
  },
  cuidado: {
    label: 'Activar Plan Cuidado',
    message: 'Hola, me interesa el Plan Cuidado de $15 USD/mes para mi web.',
  },
  contacto: {
    label: 'Escríbenos ahora',
    message: 'Hola Rembrandt Studio, quiero cotizar mi proyecto.',
  },
} as const;

export type WaSectionKey = keyof typeof waSections;

// ── Planes Claros para Empresarios ──────────────────────────

export interface Plan {
  id: string;
  name: string;
  /** Aclaración corta junto al nombre: plazo o tipo de proyecto. */
  badge: string;
  /** Para quién es, en una frase clara para cualquier emprendedor. */
  audience: string;
  /** Versión corta de `audience` para móvil (< 640px). */
  audienceShort?: string;
  priceUsd: string;
  priceCop?: string;
  delivery: string;
  features: string[];
  /** Versión corta de `features` para móvil (< 640px), mismo orden y datos. */
  featuresShort?: string[];
  cta: string;
  message: string;
  featured?: boolean;
}

export const plans: Plan[] = [
  {
    id: 'express',
    name: 'Página Web Express',
    badge: 'Entrega 4–6 días',
    audience:
      'Para emprendedores y negocios de servicios que necesitan una web profesional, lista para recibir clientes por WhatsApp en 4–6 días hábiles.',
    audienceShort: 'Web profesional para emprendedores, lista para recibir clientes por WhatsApp.',
    priceUsd: '$249 USD',
    priceCop: '~$990.000 COP',
    delivery: 'Entrega garantizada en 4–6 días hábiles',
    features: [
      'Landing page de alto impacto y conversión probada',
      'Diseño de autor con los colores y la personalidad de tu marca',
      'Botón a WhatsApp y formulario conectado a tu correo',
      'Carga ultrarrápida (0.7s) en celulares',
      'Dominio propio, SSL y alta en Google',
      'Sin costos ocultos: web y código 100% tuyos',
    ],
    featuresShort: [
      'Landing de alta conversión',
      'Diseño de autor con tu marca',
      'WhatsApp + formulario a tu correo',
      'Carga en 0.7s en celular',
      'Dominio, SSL y alta en Google',
      'Sin costos ocultos: código 100% tuyo',
    ],
    cta: 'Elegir Plan Express',
    message:
      'Hola Rembrandt Studio, quiero la Página Web Express ($249 USD / ~$990.000 COP). Mi negocio es: ',
  },
  {
    id: 'empresarial',
    name: 'Web Corporativa & Autoridad',
    badge: 'Multi-Página (3–5 secciones)',
    audience:
      'Para empresas y firmas con varios servicios que necesitan autoridad, confianza institucional y visibilidad en Google.',
    audienceShort:
      'Para empresas con varios servicios: autoridad, confianza y visibilidad en Google.',
    priceUsd: '$399 USD',
    priceCop: '~$1.590.000 COP',
    delivery: 'Entrega en 8–12 días hábiles',
    features: [
      'Multi-página: Inicio, Servicios, Nosotros, Portafolio y Contacto',
      'Diseño editorial en claroscuro con Liquid Glass',
      'SEO avanzado para posicionar tus palabras clave en Google',
      'Correos con tu dominio (contacto@tuempresa.com)',
      'Formulario de cotización validado y analítica de visitas',
      'Panel autoadministrable para editar textos y fotos',
    ],
    featuresShort: [
      'Inicio, Servicios, Nosotros, Portafolio y Contacto',
      'Diseño editorial claroscuro',
      'SEO avanzado en Google',
      'Correos con tu dominio',
      'Formulario validado + analítica',
      'Panel para editar textos y fotos',
    ],
    cta: 'Elegir Plan Corporativo',
    message:
      'Hola Rembrandt Studio, me interesa la Web Corporativa ($399 USD / ~$1.590.000 COP). Mi empresa es: ',
  },
  {
    id: 'automatizacion',
    name: 'Web + Automatización WhatsApp',
    badge: 'Web + Chatbot Inteligente 24/7',
    audience:
      'El favorito de empresarios ocupados: tu web capta prospectos y WhatsApp responde al instante, califica al cliente y agenda citas 24/7.',
    audienceShort: 'Tu web capta prospectos; WhatsApp responde, califica y agenda 24/7.',
    priceUsd: '$490 USD',
    priceCop: '~$1.950.000 COP',
    delivery: 'Entrega en 12–15 días hábiles',
    features: [
      'Todo lo de la Web Corporativa',
      'Bienvenida y respuesta inmediata en WhatsApp 24/7',
      'Calificación automática: filtra curiosos y detecta compradores listos',
      'Envío automático de catálogos, precios y enlaces de pago',
      'Agendamiento automático de citas o videollamadas en tu calendario',
      'Alerta a tu celular cuando un cliente calificado pide atención humana',
    ],
    featuresShort: [
      'Todo lo de la Web Corporativa',
      'Respuesta inmediata en WhatsApp 24/7',
      'Filtra curiosos y detecta compradores',
      'Envía catálogos, precios y pagos',
      'Agenda citas en tu calendario',
      'Te alerta cuando un cliente pide atención',
    ],
    cta: 'Elegir Web + Automatización',
    message:
      'Hola Rembrandt Studio, me interesa el Plan Web + Automatización WhatsApp ($490 USD / ~$1.950.000 COP). Mi negocio es: ',
    featured: true,
  },
  {
    id: 'tienda-agil',
    name: 'Catálogo & Tienda Ágil',
    badge: 'E-commerce & Catálogo',
    audience:
      'Para marcas que venden productos físicos o digitales con pagos en línea automáticos, compra fluida y sin comisiones abusivas.',
    audienceShort: 'Vende productos con pagos en línea automáticos y sin comisiones abusivas.',
    priceUsd: '$590 USD',
    priceCop: '~$2.390.000 COP',
    delivery: 'Entrega en 15–20 días hábiles',
    features: [
      'Catálogo con carrito y ficha técnica por producto',
      'Pagos en línea: Stripe, Wompi, PSE y tarjetas crédito/débito',
      'Confirmación automática de pedidos por WhatsApp y correo',
      'Panel para gestionar inventario, precios y pedidos en segundos',
      'Cálculo automático de envíos y cupones de descuento',
      'Capacitación en video para administrar tu tienda',
    ],
    featuresShort: [
      'Catálogo con carrito y fichas',
      'Stripe, Wompi, PSE y tarjetas',
      'Pedidos confirmados por WhatsApp y correo',
      'Panel de inventario, precios y pedidos',
      'Envíos y cupones automáticos',
      'Capacitación en video',
    ],
    cta: 'Elegir Tienda Ágil',
    message:
      'Hola Rembrandt Studio, quiero cotizar el Plan Catálogo & Tienda Ágil ($590 USD / ~$2.390.000 COP). Vendo: ',
  },
  {
    id: 'signature-3d',
    name: 'Obra Signature & 3D Craft',
    badge: 'A Medida · 3D Interactivo',
    audience:
      'Para marcas de lujo, arquitectura y startups que buscan una presencia única con 3D interactivo (Spline/WebGL) y diseño de autor sin plantillas.',
    audienceShort: 'Presencia única con 3D interactivo para marcas de lujo y startups.',
    priceUsd: 'Desde $950 USD',
    delivery: 'Entrega en 3–5 semanas (20–25 días hábiles)',
    features: [
      'Modelado e integración 3D interactiva en tiempo real',
      'Animaciones cinemáticas al scroll y dirección de arte exclusiva',
      'Arquitectura a medida con Astro, React o Next.js',
      'Sonido ambiental de autor o interactividad inmersiva',
      'Estrategia de posicionamiento de marca premium',
      'Soporte directo de los fundadores en todo el desarrollo',
    ],
    featuresShort: [
      '3D interactivo en tiempo real',
      'Animaciones cinemáticas al scroll',
      'Astro, React o Next.js a medida',
      'Sonido e interactividad inmersiva',
      'Estrategia de marca premium',
      'Soporte directo de los fundadores',
    ],
    cta: 'Cotizar Proyecto Signature',
    message:
      'Hola Rembrandt Studio, quiero cotizar un Proyecto Signature a medida con 3D. Mi idea es: ',
  },
];

// ── Servicios de Mantenimiento Mensual en Paquetes & Opción a Demanda ───

export interface MaintenancePackage {
  id: string;
  name: string;
  badge?: string;
  audience: string;
  priceUsd: string;
  priceCop: string;
  period: string;
  annualDiscount?: string;
  features: string[];
  cta: string;
  message: string;
  featured?: boolean;
}

export const maintenancePackages: MaintenancePackage[] = [
  {
    id: 'esencial',
    name: 'Cuidado Esencial',
    badge: 'Servidor & Uptime 99.9%',
    audience:
      'Para landings y webs informativas: siempre activas, rápidas y seguras, sin preocupaciones técnicas.',
    priceUsd: '$15 USD',
    priceCop: '~$59.000 COP',
    period: '/mes',
    annualDiscount: '$149 USD/año (Ahorras 2 meses)',
    features: [
      'Hosting cloud ultrarrápido con CDN global',
      'SSL (HTTPS) con renovación automática',
      'Copias de seguridad semanales en la nube',
      'Monitoreo 24/7: si la web cae, se levanta de inmediato',
      'Parches de seguridad y compatibilidad móvil',
    ],
    cta: 'Elegir Cuidado Esencial',
    message:
      'Hola Rembrandt Studio, me interesa el Plan Cuidado Esencial ($15 USD/mes) para mi web.',
  },
  {
    id: 'activo',
    name: 'Cuidado Activo',
    badge: 'El Más Elegido por Negocios',
    audience:
      'Para empresas en crecimiento que actualizan promociones, fotos, precios o servicios cada mes.',
    priceUsd: '$29 USD',
    priceCop: '~$115.000 COP',
    period: '/mes',
    annualDiscount: '$290 USD/año (Ahorras 2 meses)',
    features: [
      'Todo lo de Cuidado Esencial',
      'Hasta 2 h/mes de cambios (textos, fotos, banners, precios)',
      'Soporte prioritario por WhatsApp (respuesta < 2 h hábiles)',
      'Chequeo mensual de velocidad (carga < 1 s)',
      'SEO básico en nuevas publicaciones y servicios',
    ],
    cta: 'Elegir Cuidado Activo',
    message: 'Hola Rembrandt Studio, me interesa el Plan Cuidado Activo ($29 USD/mes) para mi web.',
    featured: true,
  },
  {
    id: 'pro-auto',
    name: 'Cuidado Pro & Automatizaciones',
    badge: 'Empresas, Tiendas & Chatbots',
    audience: 'Para tiendas y webs con automatización WhatsApp que captan y venden a diario.',
    priceUsd: '$49 USD',
    priceCop: '~$195.000 COP',
    period: '/mes',
    annualDiscount: '$490 USD/año (Ahorras 2 meses)',
    features: [
      'Todo lo de Cuidado Activo',
      'Supervisión del chatbot de WhatsApp y ajuste de flujos',
      'Monitoreo de pasarelas de pago (Stripe, Bold, Wompi, PSE)',
      'Hasta 4 h/mes de cambios prioritarios',
      'Informe mensual de visitas y contactos',
      'Atención VIP los 7 días de la semana',
    ],
    cta: 'Elegir Cuidado Pro',
    message:
      'Hola Rembrandt Studio, me interesa el Plan Cuidado Pro & Automatizaciones ($49 USD/mes) para mi web.',
  },
];

export const onDemandMaintenance = {
  title: '¿Sin mensualidades? Opción a demanda (pago único)',
  desc: 'Tu web y su código son 100% tuyos. Sin plan mensual, te la entregamos con hosting configurado; cuando necesites un cambio, nos escribes por WhatsApp y pagas una tarifa fija solo por ese trabajo.',
  rates: [
    {
      task: 'Ajuste simple (teléfono, correo, precios o textos breves)',
      price: '$15 USD',
      cop: '~$59.000 COP',
    },
    {
      task: 'Nuevo banner, fotos de galería o servicio publicado',
      price: '$29 USD',
      cop: '~$115.000 COP',
    },
    {
      task: 'Optimización técnica integral o ajuste de flujos del chatbot',
      price: '$45 USD',
      cop: '~$180.000 COP',
    },
  ],
};

export const carePlan = {
  name: 'Planes de Mantenimiento & Tranquilidad',
  subtitle: 'Desde $15 USD/mes o pago único a demanda',
  priceUsd: '$15 USD',
  unit: '/mes',
  features: [
    'Hosting cloud ultrarrápido y SSL incluidos',
    'Copias de seguridad y monitoreo 24/7 (99.9% de actividad)',
    'Soporte prioritario por WhatsApp para cambios de textos, fotos y precios',
    'Sin permanencia: pausa, cancela o cambia de plan cuando quieras',
  ],
  featuresShort: [
    'Hosting cloud y SSL incluidos',
    'Backups y monitoreo 24/7 (99.9%)',
    'Cambios de textos, fotos y precios por WhatsApp',
    'Sin permanencia: pausa o cancela cuando quieras',
  ],
  cta: 'Ver Paquetes de Mantenimiento',
  message: waSections.cuidado.message,
};

// ── Preguntas Frecuentes para Empresarios ────────────────────

export const plansFaq = [
  {
    q: '¿Qué necesito entregar para comenzar?',
    a: 'Tu logo (si lo tienes), información de tus servicios o productos y fotos de tu trabajo. ¿Sin fotos profesionales ni textos? Te ayudamos a estructurarlos para que tu web venda desde el primer día.',
  },
  {
    q: '¿Cómo funciona la entrega en 4 a 6 días del Plan Express?',
    a: 'Con un proceso ágil y directo: en 4 a 6 días hábiles redactamos los textos comerciales, diseñamos la propuesta de autor, programamos en código limpio y conectamos tu dominio.',
  },
  {
    q: '¿Cómo funciona la automatización de WhatsApp?',
    a: 'Conectamos un flujo inteligente a tu WhatsApp Business. Cuando un cliente te contacta desde la web, responde en segundos, identifica qué necesita, muestra tus opciones y agenda la cita en tu calendario, sin que pauses tu trabajo.',
  },
  {
    q: '¿La página web es 100% de mi propiedad?',
    a: 'Sí. A diferencia de plataformas que cobran alquiler mensual de por vida, el código, el diseño y el dominio son 100% tuyos. Acceso total, sin ataduras.',
  },
  {
    q: '¿Cómo se realizan los pagos?',
    a: '50% de anticipo para iniciar y 50% al finalizar, con tu sitio probado y aprobado. En Colombia: Bancolombia, Nequi o PSE. Internacional: USD vía Stripe y tarjetas.',
  },
];

// ── Casos de éxito ──────────────────────────────────────────

export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  sector: string;
  /** URL pública. Sin URL se ocultan los botones de preview y "visitar". */
  url?: string;
  /** Sitio real en producción para "Abrir en vivo" / "Visitar sitio en vivo" (si falta, se usa url). */
  liveUrl?: string;
  /** Captura opcional (ruta en /public) para el marco del navegador. */
  image?: string;
  /** El reto: ¿qué necesitaba el cliente? */
  challenge: string;
  /** La solución: ¿qué le construimos? */
  solution: string;
  /** El impacto: ¿qué logramos? */
  impact: string;
  /** Versiones cortas para móvil (< 640px). */
  short?: { challenge: string; solution: string; impact: string };
  metrics: CaseMetric[];
  /** Dos tonos para el póster del marco del navegador. */
  tint: [string, string];
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'leymar',
    client: 'Eventos Leymar',
    sector: 'Wedding Planner & Eventos · Cartagena',
    url: '/preview/eventosleymar',
    liveUrl: 'https://eventosleymar.com',
    challenge:
      'Captar parejas internacionales que planean su boda en Cartagena y recibir cotizaciones directas por WhatsApp, sin intermediarios.',
    solution:
      'Web de autor con catálogo nupcial, galería inmersiva de bodas reales y un flujo de cotización que lleva a cada cliente directo a WhatsApp.',
    impact:
      'Carga en 0.7 segundos y las cotizaciones directas crecieron un 45% en los dos primeros meses.',
    short: {
      challenge: 'Captar parejas internacionales y cotizar directo por WhatsApp.',
      solution: 'Web de autor con galería de bodas reales y cotización directa a WhatsApp.',
      impact: 'Carga en 0.7 s y +45% de cotizaciones en 2 meses.',
    },
    metrics: [
      { value: '0.7 s', label: 'Tiempo de carga' },
      { value: '+45%', label: 'Más cotizaciones' },
    ],
    tint: ['#c9a27a', '#8b5cf6'],
  },
];
