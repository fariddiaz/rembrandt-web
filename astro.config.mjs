import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { devPreviewProxy } from './integrations/dev-preview-proxy.mjs';

export default defineConfig({
  site: 'https://rembrandtstudio.co',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/404') && !page.includes('/gracias') && !page.includes('/preview/'),
    }),
  ],
  vite: {
    // @ts-ignore
    // devPreviewProxy: solo en `astro dev` (en producción lo hace la Pages Function).
    plugins: [tailwindcss(), devPreviewProxy()],
    build: {
      chunkSizeWarningLimit: 600,
    },
  },
});
