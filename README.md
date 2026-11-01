# Rembrandt Astro Starter

Plantilla base para webs de cliente. Astro + Tailwind, estática, con SEO, formulario y páginas
legales.

## Requisitos

- Node 20 o superior
- Cuenta gratuita en Web3Forms

## Puesta en marcha

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Editar `.env` y añadir la clave de Web3Forms:

```
PUBLIC_WEB3FORMS_KEY=tu-clave
```

## Comandos

```powershell
npm run dev          # desarrollo en http://localhost:4321
npm run build        # build en dist/
npm run qa           # formato + tipos + build
npm run format:write # aplicar formato
```

## Personalización por cliente

1. `astro.config.mjs`: cambiar `site` por el dominio real.
2. `public/robots.txt`: cambiar la URL del sitemap.
3. `src/components/Header.astro` y `Footer.astro`: nombre y enlaces.
4. `src/pages/index.astro`: textos y secciones.
5. `src/pages/aviso-legal.astro` y `privacidad.astro`: datos fiscales reales.
6. `src/styles/global.css`: colores y tipografías de la marca.
7. `public/favicon.svg`: logotipo.

## Deploy en Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Variable de entorno: `PUBLIC_WEB3FORMS_KEY`

## Estructura

```
public/            estáticos (favicon, robots, headers)
src/components/    Header, Footer, ContactForm
src/layouts/       BaseLayout con SEO y JSON-LD
src/pages/         index, gracias, 404, legales
src/styles/        tokens y estilos globales
```

## Notas

- No incluir secretos en el repositorio. Solo variables `PUBLIC_`.
- El formulario usa Web3Forms: 250 envíos gratuitos al mes.
- Las fuentes son del sistema para evitar peticiones externas y mejorar el rendimiento.
