import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://fariddiaz.github.io',
  base: '/rembrandt-web',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});

