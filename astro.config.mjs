import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://chrischuck.github.io',
  base: '/ancient-numbers',
  trailingSlash: 'always',
  output: 'static',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});
