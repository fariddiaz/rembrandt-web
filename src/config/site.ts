// ────────────────────────────────────────────────────────────
// Fuente única de verdad: precios, WhatsApp, planes y casos de éxito.
// Cambia aquí y se actualiza toda la web.
// ────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBER = '573147714202'; // +57 314 771 4202, sin "+" ni espacios
export const CONTACT_EMAIL = 'hola@rembrandtstudio.co';
export const CALENDLY_LINK = 'https://cal.com'; // O enlace a videollamada personalizada

export const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** Escena Spline del robot 3D interactivo del Hero. */
export const HERO_ROBOT_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

/** Lo que muestra el botón flotante según la sección visible. */
export const waSections = {
  hero: {
    label: 'Cuéntanos tu idea',
    message: 'Hola Rembrandt Studio 👋 Vi su web y quiero una página para mi negocio.',
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
    message: 'Hola, me interesa el Plan Cuidado de $19 USD/mes para mi web.',
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
  priceUsd: string;
  priceCop?: string;
  delivery: string;
  features: string[];
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
      'Para emprendedores y negocios de servicios que necesitan una página web moderna, profesional y lista para recibir clientes por WhatsApp en 4 a 6 días hábiles.',
    priceUsd: '$249 USD',
    priceCop: '~$990.000 COP',
    delivery: 'Garantía de entrega en 4 a 6 días hábiles',
    features: [
      'Página de aterrizaje (Landing Page) de alto impacto y conversión probada',
      'Diseño de autor a medida con los colores y la personalidad de tu marca',
      'Botón directo a WhatsApp y formulario express conectado a tu correo',
      'Carga ultrarrápida (0.7 segundos) optimizada para teléfonos móviles',
      'Dominio propio, certificado de seguridad SSL y alta en Google',
      'Sin costos ocultos: la web y su código te pertenecen al 100%',
    ],
    cta: 'Elegir Plan Express',
    message: 'Hola Rembrandt Studio, quiero la Página Web Express ($249 USD / ~$990.000 COP). Mi negocio es: ',
  },
  {
    id: 'empresarial',
    name: 'Web Corporativa & Autoridad',
    badge: 'Multi-Página (3–5 secciones)',
    audience:
      'Para empresas constituidas y firmas que ofrecen múltiples servicios y necesitan posicionarse con máxima autoridad, confianza institucional y visibilidad en Google.',
    priceUsd: '$399 USD',
    priceCop: '~$1.590.000 COP',
    delivery: 'Entrega en 8 a 12 días hábiles',
    features: [
      'Estructura multi-página: Inicio, Servicios, Nosotros, Portafolio y Contacto',
      'Diseño editorial exclusivo en claroscuro con Liquid Glass',
      'Optimización SEO avanzada para posicionar palabras clave en Google',
      'Correos corporativos con tu dominio (ej: contacto@tuempresa.com)',
      'Formulario de cotización con validación y analítica de visitas',
      'Panel autoadministrable intuitivo para editar textos y fotografías',
    ],
    cta: 'Elegir Plan Corporativo',
    message: 'Hola Rembrandt Studio, me interesa la Web Corporativa ($399 USD / ~$1.590.000 COP). Mi empresa es: ',
  },
  {
    id: 'automatizacion',
    name: 'Web + Automatización WhatsApp',
    badge: 'Web + Chatbot Inteligente 24/7',
    audience:
      'El plan favorito de empresarios ocupados: tu página web capta prospectos y un sistema automatizado en WhatsApp responde al instante, califica al cliente y agenda citas las 24 horas.',
    priceUsd: '$490 USD',
    priceCop: '~$1.950.000 COP',
    delivery: 'Entrega en 12 a 15 días hábiles',
    features: [
      'Todo lo incluido en la Web Corporativa de alto rendimiento',
      'Automatización de bienvenida y respuesta inmediata en WhatsApp 24/7',
      'Calificación automática de prospectos (filtra curiosos y detecta clientes listos para comprar)',
      'Envío automático de catálogos, listas de precios y enlaces de pago',
      'Integración con calendario para agendar citas o videollamadas automáticamente',
      'Notificaciones instantáneas a tu teléfono cuando un cliente calificado solicita atención humana',
    ],
    cta: 'Elegir Web + Automatización',
    message: 'Hola Rembrandt Studio, me interesa el Plan Web + Automatización WhatsApp ($490 USD / ~$1.950.000 COP). Mi negocio es: ',
    featured: true,
  },
  {
    id: 'tienda-agil',
    name: 'Catálogo & Tienda Ágil',
    badge: 'E-commerce & Catálogo',
    audience:
      'Para marcas y comercios que quieren vender productos físicos o digitales con pagos en línea automáticos y una experiencia de compra fluida sin comisiones abusivas.',
    priceUsd: '$590 USD',
    priceCop: '~$2.390.000 COP',
    delivery: 'Entrega en 15 a 20 días hábiles',
    features: [
      'Catálogo interactivo con carrito de compras y ficha técnica por producto',
      'Pasarela de pagos en línea integrada: Stripe, Wompi, PSE, Tarjetas de crédito/débito',
      'Confirmación automática de pedidos con comprobante por WhatsApp y correo',
      'Panel de control ágil para gestionar inventario, precios y pedidos en segundos',
      'Cálculo automático de envíos y cupones de descuento promocionales',
      'Capacitación personalizada en video para que administres tu tienda fácilmente',
    ],
    cta: 'Elegir Tienda Ágil',
    message: 'Hola Rembrandt Studio, quiero cotizar el Plan Catálogo & Tienda Ágil ($590 USD / ~$2.390.000 COP). Vendo: ',
  },
  {
    id: 'signature-3d',
    name: 'Obra Signature & 3D Craft',
    badge: 'A Medida · 3D Interactivo',
    audience:
      'Para marcas de lujo, estudios de arquitectura, startups y empresas que buscan una presencia digital única en el mundo con interactividad 3D (Spline/WebGL) y diseño de autor sin plantillas.',
    priceUsd: 'Desde $950 USD',
    delivery: 'Entrega en 3 a 5 semanas (20 a 25 días hábiles)',
    features: [
      'Modelado e integración de elementos 3D interactivos en tiempo real',
      'Animaciones cinemáticas al scroll y dirección de arte exclusiva',
      'Arquitectura de software a medida con Astro, React o Next.js',
      'Sonido ambiental de autor o interactividad inmersiva',
      'Estrategia de posicionamiento de marca de máximo prestigio',
      'Soporte directo de nivel fundadores durante todo el desarrollo',
    ],
    cta: 'Cotizar Proyecto Signature',
    message: 'Hola Rembrandt Studio, quiero cotizar un Proyecto Signature a medida con 3D. Mi idea es: ',
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
    audience: 'Para landing pages y webs informativas que necesitan estar siempre activas, rápidas y seguras sin preocupaciones técnicas.',
    priceUsd: '$15 USD',
    priceCop: '~$59.000 COP',
    period: '/mes',
    annualDiscount: '$149 USD/año (Ahorras 2 meses)',
    features: [
      'Alojamiento en Servidores Cloud ultrarrápidos con CDN global',
      'Certificado de seguridad SSL (HTTPS) renovado automáticamente',
      'Copias de seguridad semanales automáticas en la nube',
      'Monitoreo de actividad 24/7 (si la web cae, se levanta de inmediato)',
      'Actualizaciones de seguridad y parches de compatibilidad móvil',
    ],
    cta: 'Elegir Cuidado Esencial',
    message: 'Hola Rembrandt Studio, me interesa el Plan Cuidado Esencial ($15 USD/mes) para mi web.',
  },
  {
    id: 'activo',
    name: 'Cuidado Activo',
    badge: 'El Más Elegido por Negocios',
    audience: 'Para empresas en crecimiento que actualizan promociones, fotos de proyectos, precios o servicios cada mes sin perder tiempo.',
    priceUsd: '$29 USD',
    priceCop: '~$115.000 COP',
    period: '/mes',
    annualDiscount: '$290 USD/año (Ahorras 2 meses)',
    features: [
      'Todo lo incluido en el Plan Cuidado Esencial',
      'Hasta 2 horas de modificaciones mensuales (textos, fotos, banners, precios)',
      'Soporte prioritario directo por WhatsApp (< 2 horas de respuesta hábil)',
      'Chequeo mensual de velocidad de carga (< 1 segundo)',
      'Ajustes de SEO básico en nuevas publicaciones y servicios',
    ],
    cta: 'Elegir Cuidado Activo',
    message: 'Hola Rembrandt Studio, me interesa el Plan Cuidado Activo ($29 USD/mes) para mi web.',
    featured: true,
  },
  {
    id: 'pro-auto',
    name: 'Cuidado Pro & Automatizaciones',
    badge: 'Empresas, Tiendas & Chatbots',
    audience: 'Para negocios con Web + Automatización WhatsApp o E-commerce que dependen de su plataforma para captar y vender a diario.',
    priceUsd: '$49 USD',
    priceCop: '~$195.000 COP',
    period: '/mes',
    annualDiscount: '$490 USD/año (Ahorras 2 meses)',
    features: [
      'Todo lo incluido en el Plan Cuidado Activo',
      'Supervisión continua del Chatbot de WhatsApp y ajuste de flujos',
      'Monitoreo técnico de pasarelas de pago (Stripe, Bold, Wompi, PSE)',
      'Hasta 4 horas de cambios y ajustes mensuales prioritarios',
      'Informe mensual simplificado de visitas y contactos recibidos',
      'Atención VIP preferencial los 7 días de la semana',
    ],
    cta: 'Elegir Cuidado Pro',
    message: 'Hola Rembrandt Studio, me interesa el Plan Cuidado Pro & Automatizaciones ($49 USD/mes) para mi web.',
  },
];

export const onDemandMaintenance = {
  title: '¿Prefieres no pagar mensualidades? Opción a Demanda (Pago Único)',
  desc: 'En Rembrandt Studio el código y la web son 100% de tu propiedad. Si prefieres no tener un plan mensual recurrente, no hay ningún problema: te entregamos tu sitio con su hosting configurado. Cuando necesites un cambio puntual en el futuro, simplemente nos escribes por WhatsApp y pagas una tarifa fija única solo por el trabajo realizado.',
  rates: [
    { task: 'Ajuste puntual simple (cambio de teléfono, correo, precios o textos breves)', price: '$15 USD', cop: '~$59.000 COP' },
    { task: 'Actualización de banner, fotos de galería o publicación de nuevo servicio', price: '$29 USD', cop: '~$115.000 COP' },
    { task: 'Optimización técnica integral o ajuste de árbol en Chatbot WhatsApp', price: '$45 USD', cop: '~$180.000 COP' },
  ],
};

export const carePlan = {
  name: 'Planes de Mantenimiento & Tranquilidad',
  subtitle: 'Desde $15 USD/mes o pago único a demanda',
  priceUsd: '$15 USD',
  unit: '/mes',
  features: [
    'Alojamiento en Servidores Cloud ultrarrápidos y certificado de seguridad SSL incluido',
    'Copias de seguridad continuas y monitoreo 24/7 para garantizar 99.9% de actividad',
    'Soporte prioritario por WhatsApp para cambios de textos, fotos, precios y actualizaciones',
    'Sin contratos de permanencia: puedes pausar, cancelar o cambiar de plan cuando quieras',
  ],
  cta: 'Ver Paquetes de Mantenimiento',
  message: waSections.cuidado.message,
};

// ── Preguntas Frecuentes para Empresarios ────────────────────

export const plansFaq = [
  {
    q: '¿Qué necesito entregar para comenzar?',
    a: 'Solo el logo de tu empresa (si lo tienes), información básica de tus servicios o productos y fotos de tu trabajo. Si no tienes fotos profesionales o textos redactados, nosotros te ayudamos a estructurarlos para que tu web venda desde el primer día.',
  },
  {
    q: '¿Cómo funciona la entrega en 4 a 6 días del Plan Express?',
    a: 'Es el plazo exacto para lograr una web rápida y perfecta. Trabajamos con un proceso de ingeniería ágil y directo: en 4 a 6 días hábiles redactamos los textos comerciales, diseñamos la propuesta visual de autor, programamos en código limpio y conectamos tu dominio propio sin demoras.',
  },
  {
    q: '¿Cómo funciona la automatización de WhatsApp?',
    a: 'Integramos un flujo inteligente conectado a tu WhatsApp Business. Cuando un cliente visita tu web y da clic en contactar, el sistema le responde en segundos, le pregunta qué necesita, le muestra tus opciones y agenda una cita en tu calendario sin que tengas que pausar tu trabajo.',
  },
  {
    q: '¿La página web es 100% de mi propiedad?',
    a: 'Totalmente. A diferencia de plataformas cerradas que te cobran alquiler mensual de por vida, en Rembrandt Studio el código fuente, el diseño y el dominio te pertenecen al 100%. Te entregamos acceso total y sin ataduras.',
  },
  {
    q: '¿Cómo se realizan los pagos?',
    a: 'Manejamos un esquema seguro: 50% de anticipo para iniciar el diseño y desarrollo, y el 50% restante al finalizar cuando tu sitio esté probado a tu entera satisfacción. Aceptamos transferencias en Colombia (Bancolombia, Nequi, PSE) y pagos internacionales en USD vía Stripe y tarjetas.',
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
  metrics: CaseMetric[];
  /** Dos tonos para el póster del marco del navegador. */
  tint: [string, string];
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'leymar',
    client: 'Eventos Leymar',
    sector: 'Wedding Planner & Eventos · Cartagena',
    url: 'https://www.eventosleymar.com',
    liveUrl: 'https://eventosleymar.com',
    challenge:
      'Captar novias y parejas internacionales que planean su boda de ensueño en Cartagena y recibir solicitudes de cotización directas por WhatsApp sin intermediarios.',
    solution:
      'Una web de autor sumamente elegante con catálogo de servicios nupciales, galería inmersiva de bodas reales y un flujo de cotización que canaliza a cada cliente directo a WhatsApp.',
    impact:
      'La página carga en apenas 0.7 segundos y las solicitudes directas de cotización crecieron un 45% en los primeros dos meses de lanzamiento.',
    metrics: [
      { value: '0.7 s', label: 'Tiempo de carga ultra rápido' },
      { value: '+45%', label: 'Aumento en cotizaciones' },
    ],
    tint: ['#c9a27a', '#8b5cf6'],
  },
];
