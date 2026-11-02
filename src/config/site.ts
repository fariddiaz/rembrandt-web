// ────────────────────────────────────────────────────────────
// Fuente única de verdad: precios, WhatsApp, planes y casos de éxito.
// Cambia aquí y se actualiza toda la web.
// ────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBER = '573147714202'; // +57 314 771 4202, sin "+" ni espacios

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

// ── Planes ──────────────────────────────────────────────────

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
    badge: '24–48 horas',
    audience:
      'Para emprendedores y negocios que necesitan una página moderna, lista para recibir clientes por WhatsApp en 1 a 2 días.',
    priceUsd: '$249 USD',
    priceCop: '~$990.000 COP',
    delivery: 'Entrega en 24 a 48 horas',
    features: [
      'Una página moderna con la identidad de tu marca',
      'Botón directo a WhatsApp y formulario de contacto',
      'Se ve perfecta en celulares y carga en menos de 1 segundo',
      'Publicada en tu dominio propio y registrada en Google',
      'Sin suscripciones raras: la página es 100% tuya',
    ],
    cta: 'Quiero mi página express',
    message: 'Hola, quiero la Página Web Express ($249 USD). Mi negocio es: ',
  },
  {
    id: 'empresarial',
    name: 'Página Web Empresarial',
    badge: 'Multi-página',
    audience:
      'Para empresas que ofrecen varios servicios o productos y necesitan explicar cada uno a fondo con autoridad y estatus.',
    priceUsd: '$399 USD',
    priceCop: '~$1.590.000 COP',
    delivery: 'Entrega en 5 a 7 días hábiles',
    features: [
      'De 3 a 5 secciones/páginas (Inicio, Servicios, Nosotros, Casos, Contacto)',
      'Diseño visual exclusivo y personalizado para tu empresa',
      'Optimización SEO completa para posicionar en Google',
      'Integración con WhatsApp, correo corporativo y analítica',
      'Panel autoadministrable fácil de actualizar',
    ],
    cta: 'Quiero la web empresarial',
    message: 'Hola, me interesa la Página Web Empresarial ($399 USD). Mi empresa es: ',
    featured: true,
  },
  {
    id: 'tienda-3d',
    name: 'Tienda Online & Catálogo 3D',
    badge: 'E-commerce & 3D',
    audience:
      'Para marcas y proyectos que quieren vender productos físicos o digitales con pagos en línea o sorprender con experiencias interactivas en 3D.',
    priceUsd: '$590 – $1.490 USD',
    delivery: 'Entrega en 2 a 3 semanas',
    features: [
      'Pasarela de pagos en línea (tarjetas, PSE, MercadoPago o Stripe)',
      'Catálogo interactivo con carrito de compras y control de stock',
      'Modelos 3D interactivos en tiempo real o animaciones a medida',
      'Diseño de autor premium de máxima distinción',
      'Capacitación para que gestiones tus ventas sin depender de nadie',
    ],
    cta: 'Cotizar tienda o 3D',
    message: 'Hola, quiero cotizar la Tienda Online o Catálogo 3D. Vendo: ',
  },
];

export const carePlan = {
  name: 'Plan Cuidado',
  subtitle: 'Mantenimiento mensual',
  priceUsd: '$19 USD',
  unit: '/mes',
  features: [
    'Hosting ultrarrápido y certificado de seguridad (SSL) incluido',
    'Copias de seguridad semanales y monitoreo 24/7',
    'Soporte directo por WhatsApp y cambios de texto o fotos cada mes',
  ],
  cta: 'Activar Plan Cuidado',
  message: waSections.cuidado.message,
};

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
    url: 'https://eventosleymar.com',
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
  {
    id: 'atlanta',
    client: 'Atlanta Insurance Services',
    sector: 'Agencia de Seguros · Bilingüe (USA / Latam)',
    challenge:
      'Proyectar autoridad y confianza institucional para que clientes angloparlantes e hispanos pudieran comparar y cotizar pólizas en línea con rapidez y sencillez.',
    solution:
      'Un sitio corporativo bilingüe (ES / EN) con desglose de pólizas comerciales, señales visuales de confianza y formularios dinámicos conectados a WhatsApp y CRM.',
    impact:
      'Una presencia digital sólida y confiable que genera prospectos calificados a diario y atiende por igual a clientes en inglés y español.',
    metrics: [
      { value: 'ES / EN', label: 'Plataforma 100% bilingüe' },
      { value: '3x', label: 'Más prospectos calificados' },
    ],
    tint: ['#3b82f6', '#8b5cf6'],
  },
  {
    id: 'kroma',
    client: 'Kroma Advisory',
    sector: 'Fintech & Consultoría de Inversión',
    challenge:
      'Proyectar prestigio y solidez tecnológica ante inversionistas institucionales para apoyar una ronda de capitalización.',
    solution:
      'Una experiencia digital vanguardista con gráficos 3D interactivos en tiempo real, arquitectura de información pulcra y una narrativa financiera contundente.',
    impact:
      'Una presencia digital de alto estatus que acompaña presentaciones ejecutivas y distingue de forma inmediata a la firma frente a sus competidores.',
    metrics: [
      { value: '3D', label: 'Visualización interactiva' },
      { value: '100/100', label: 'Rendimiento en Lighthouse' },
    ],
    tint: ['#10b981', '#8b5cf6'],
  },
];
