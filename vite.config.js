import { defineConfig } from 'vite';

// Troca o script de módulo por um script clássico com defer,
// para que dist/index.html funcione também via file://.
function classicScript() {
  return {
    name: 'script-classico',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace('<script type="module" crossorigin', '<script defer');
      },
    },
  };
}

export default defineConfig({
  base: './',
  server: { port: 5173, strictPort: true },
  test: { environment: 'node' },
  build: {
    modulePreload: false,
    rollupOptions: {
      input: 'index.html',
      output: { format: 'iife' },
    },
  },
  plugins: [classicScript()],
});
