// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://rembrandtdigital.com',
  vite: {
    plugins: [tailwindcss()],
    build: {
      // three.js ya va en su propio chunk (import() dinámico en HeroOrb.astro)
      chunkSizeWarningLimit: 600,
    },
  },
});
