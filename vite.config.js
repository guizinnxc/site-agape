import { defineConfig } from 'vite';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RENDER_ENTRY = fileURLToPath(new URL('./src/render/page.js', import.meta.url));
// Arquivos que alteram o HTML gerado (fora do grafo do cliente): recarregam a página no dev.
const RENDER_DEPS = /\/src\/(render\/|content\.js$|lib\/links\.js$)|\/public\/img\/manifest\.json$/;

// Gera o HTML estático a partir de src/content.js: troca <!--head--> e <!--app-->.
// Ordem normal (não 'pre'): o HTML injetado não passa pelo processamento de assets do Vite,
// então os caminhos relativos img/... chegam intactos ao dist/ e ao dev (public/ na raiz).
function renderHtml() {
  let server;
  return {
    name: 'render-html',
    configureServer(s) {
      server = s;
    },
    handleHotUpdate({ file, server: s }) {
      if (RENDER_DEPS.test(file.replace(/\\/g, '/'))) s.ws.send({ type: 'full-reload' });
    },
    transformIndexHtml: {
      async handler(html) {
        const mod = server
          ? await server.ssrLoadModule(RENDER_ENTRY)
          : await import(`${pathToFileURL(RENDER_ENTRY).href}?t=${Date.now()}`);
        return html.replace('<!--head-->', () => mod.renderHead()).replace('<!--app-->', () => mod.renderPage());
      },
    },
  };
}

// Troca o script de módulo por um script clássico com defer e remove `crossorigin`
// (script e folha de estilo): via file:// o Chrome bloqueia pedidos CORS e o CSS não carregaria.
function classicScript() {
  return {
    name: 'script-classico',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html
          .replace('<script type="module" crossorigin', '<script defer')
          .replace(/(<(?:script|link)\b[^>]*?)\s+crossorigin(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/g, '$1');
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
    // Com saída iife o Vite embutiria o CSS no JS; sem split ele sai num .css com <link>,
    // então a página tem estilo mesmo sem JS.
    cssCodeSplit: false,
    rollupOptions: {
      input: 'index.html',
      output: { format: 'iife' },
    },
  },
  plugins: [renderHtml(), classicScript()],
});
