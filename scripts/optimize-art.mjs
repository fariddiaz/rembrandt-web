// Genera versiones AVIF y WebP de las obras de public/art/*.jpg.
// Uso: node scripts/optimize-art.mjs
// Las obras se muestran como máximo a ~430 px CSS de ancho (bordes en PC o
// telón en móvil), así que 960 px cubre pantallas 2x sin desperdicio.
import { readdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const ART_DIR = 'public/art';
const MAX_WIDTH = 960;
const AVIF_QUALITY = 50;
const WEBP_QUALITY = 72;

const kb = (bytes) => Math.round(bytes / 1024);

const files = (await readdir(ART_DIR)).filter((f) => f.toLowerCase().endsWith('.jpg'));
let before = 0;
let afterAvif = 0;
let afterWebp = 0;

for (const file of files) {
  const src = join(ART_DIR, file);
  const { name } = parse(file);
  const base = sharp(src).resize({ width: MAX_WIDTH, withoutEnlargement: true });

  const avifPath = join(ART_DIR, `${name}.avif`);
  const webpPath = join(ART_DIR, `${name}.webp`);
  await base.clone().avif({ quality: AVIF_QUALITY, effort: 6 }).toFile(avifPath);
  await base.clone().webp({ quality: WEBP_QUALITY }).toFile(webpPath);

  before += (await stat(src)).size;
  afterAvif += (await stat(avifPath)).size;
  afterWebp += (await stat(webpPath)).size;
}

console.log(
  `${files.length} obras: JPG ${kb(before)} KB -> AVIF ${kb(afterAvif)} KB / WebP ${kb(afterWebp)} KB`,
);
