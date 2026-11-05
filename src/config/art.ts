// ────────────────────────────────────────────────────────────
// Catálogo de obras de Rembrandt por página (public/art/).
// Cada página muestra 4 obras por lado en PC y 4 en móvil, que se
// relevan al hacer scroll. Las variantes .avif/.webp las genera
// scripts/optimize-art.mjs a partir del .jpg.
// ────────────────────────────────────────────────────────────

export interface Artwork {
  /** Ruta del JPG original en /public; las variantes se derivan de ella. */
  src: string;
  title: string;
  year: number;
  /** Punto focal para object-position (la figura iluminada del cuadro). */
  focus?: string;
}

export interface PageArt {
  left: Artwork[];
  right: Artwork[];
}

export type ArtPageKey = 'inicio' | 'planes' | 'portafolio' | 'proceso' | 'contacto' | 'legal';

const art = (file: string, title: string, year: number, focus?: string): Artwork => ({
  src: `/art/${file}.jpg`,
  title,
  year,
  focus,
});

export const artCatalog: Record<ArtPageKey, PageArt> = {
  inicio: {
    left: [
      art('storm', 'Tormenta en el Mar de Galilea', 1633, '50% 30%'),
      art('jeremiah', 'Jeremías Llorando la Ruina de Jerusalén', 1630),
      art('europa', 'El Rapto de Europa', 1632),
      art('lazarus', 'La Resurrección de Lázaro', 1632),
    ],
    right: [
      art('nightwatch', 'La Ronda de Noche', 1642, '45% 50%'),
      art('claudius', 'La Conspiración de Claudius Civilis', 1661),
      art('goldenhelmet', 'El Hombre del Casco de Oro', 1650, '50% 25%'),
      art('polishnobleman', 'Noble Polaco', 1637, '50% 25%'),
    ],
  },
  planes: {
    left: [
      art('aristotle', 'Aristóteles con el Busto de Homero', 1653, '40% 30%'),
      art('syndics', 'Los Síndicos de los Pañeros', 1662),
      art('scholar', 'Erudito en su Gabinete', 1631),
      art('tobit', 'Tobías y su Esposa', 1659),
    ],
    right: [
      art('mill', 'El Molino', 1645),
      art('jansix', 'Retrato de Jan Six', 1654, '50% 25%'),
      art('doomer', 'Retrato de Harmen Doomer', 1640, '50% 25%'),
      art('ladyfan', 'Dama con Abanico de Plumas', 1656, '50% 25%'),
    ],
  },
  portafolio: {
    left: [
      art('prodigalson', 'El Retorno del Hijo Pródigo', 1669),
      art('samson', 'El Banquete de Bodas de Sansón', 1638),
      art('jacob', 'Jacob Bendiciendo a los Hijos de José', 1656),
      art('susanna', 'Susana y los Ancianos', 1647),
    ],
    right: [
      art('anatomy', 'Lección de Anatomía del Dr. Tulp', 1632),
      art('belshazzar', 'El Festín de Baltasar', 1635),
      art('peterprison', 'San Pedro en Prisión', 1631),
      art('manhat', 'Caballero con Sombrero Alto', 1656, '50% 25%'),
    ],
  },
  proceso: {
    left: [
      art('philosopher', 'Filósofo en Meditación', 1632),
      art('bellona', 'Bellona, Diosa de la Guerra', 1633, '50% 25%'),
      art('stpaulinprison', 'San Pablo en Prisión', 1627),
      art('bathsheba', 'Betsabé en su Baño', 1654),
    ],
    right: [
      art('isaac', 'El Sacrificio de Isaac', 1635),
      art('judith', 'Judith en el Banquete de Holofernes', 1634),
      art('simeon', 'Simeón en el Templo', 1631),
      art('lucretia', 'Lucrecia', 1666, '50% 30%'),
    ],
  },
  contacto: {
    left: [
      art('jewishbride', 'La Novia Judía', 1667),
      art('flora', 'Saskia como Flora', 1634, '50% 25%'),
      art('hendrickje', 'Retrato de Hendrickje Stoffels', 1654, '50% 25%'),
      art('rembrandtsmother', 'La Madre de Rembrandt', 1630, '50% 30%'),
    ],
    right: [
      art('selfportrait', 'Autorretrato con Dos Círculos', 1665, '50% 25%'),
      art('selfportrait1640', 'Autorretrato a los 34 Años', 1640, '50% 25%'),
      art('selfportrait1669', 'Autorretrato', 1669, '50% 25%'),
      art('selfportrait1632', 'Autorretrato de Juventud', 1632, '50% 25%'),
    ],
  },
  // Legales: obras de estudio, contabilidad y juicio. Reutiliza piezas de
  // otras páginas hasta que se añadan obras nuevas a public/art/.
  legal: {
    left: [
      art('syndics', 'Los Síndicos de los Pañeros', 1662),
      art('scholar', 'Erudito en su Gabinete', 1631),
      art('philosopher', 'Filósofo en Meditación', 1632),
      art('stpaulinprison', 'San Pablo en Prisión', 1627),
    ],
    right: [
      art('aristotle', 'Aristóteles con el Busto de Homero', 1653, '40% 30%'),
      art('jansix', 'Retrato de Jan Six', 1654, '50% 25%'),
      art('simeon', 'Simeón en el Templo', 1631),
      art('anatomy', 'Lección de Anatomía del Dr. Tulp', 1632),
    ],
  },
};

/** Rutas que comparten catálogo: el primer prefijo que coincide gana. */
const routeMap: [prefix: string, key: ArtPageKey][] = [
  ['/planes', 'planes'],
  ['/express', 'planes'],
  ['/portafolio', 'portafolio'],
  ['/proceso', 'proceso'],
  ['/contacto', 'contacto'],
  ['/agendar', 'contacto'],
  ['/gracias', 'contacto'],
  ['/terminos-y-condiciones', 'legal'],
  ['/politica-de-privacidad', 'legal'],
  ['/privacidad', 'legal'],
  ['/aviso-legal', 'legal'],
];

export function artForPath(pathname: string): PageArt {
  const path = pathname.toLowerCase().replace(/\/$/, '') || '/';
  const match = routeMap.find(([prefix]) => path.startsWith(prefix));
  return artCatalog[match ? match[1] : 'inicio'];
}

/** Variante ligera (AVIF/WebP) de una obra. */
export const artVariant = (src: string, ext: 'avif' | 'webp') => src.replace(/\.jpg$/i, `.${ext}`);
