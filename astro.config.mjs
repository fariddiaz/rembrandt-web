import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

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
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 600,
    },
  },
});
