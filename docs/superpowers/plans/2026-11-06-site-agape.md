# Site imersivo Ágape — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Página única, estática e imersiva da Padaria e Confeitaria Ágape (Arcozelo + Miguel Pereira), com navegação por capítulos, galeria ampliada e CTAs de WhatsApp e "Como chegar".

**Architecture:** Vite (vanilla). O HTML é **gerado no build/dev** por funções puras (`src/render/*.js`) a partir de `src/content.js` e do manifest de imagens, injetado em `index.html` por um plugin Vite (`transformIndexHtml`) — o site funciona sem JS; módulos em `src/lib/` só aprimoram (capítulos, carrossel, lightbox, abas, revelação, hero). Imagens responsivas geradas por `sharp` a partir de `assets/originais`.

**Tech Stack:** Node 24, Vite 6, sharp, vitest + happy-dom, @fontsource/cormorant-garamond + @fontsource/manrope, agent-browser 0.41 (E2E).

**Spec:** `docs/superpowers/specs/2026-11-06-site-agape-design.md` (leia junto; dados em `BRIEFING-padaria-agape.md`; skill em `.claude/skills/criar-site-padaria-imersivo/SKILL.md`).

## Global Constraints

- Idioma `pt-BR` em todo texto visível; nada em inglês na interface.
- **Nunca** exibir preço, horário além de "Abre às 6h · confirme o horário do dia pelo WhatsApp", ingrediente não citado, ou `openingHours` no JSON-LD.
- WhatsApp: `https://wa.me/5524981100190` (com `?text=` URL-encoded opcional). Instagram: `https://www.instagram.com/padariaagape25/`.
- Endereços exatos: "R. Dr. Mario Kroeff, 95 – Arcozelo, Paty do Alferes – RJ, 26950-000" (−22.4071627, −43.4226476) e "R. Francisco Alves, 57 – Lj 3 – Centro, Miguel Pereira – RJ, 26900-000" (−22.4545576, −43.4712167).
- Rotas: `https://www.google.com/maps/dir/?api=1&destination=<lat>,<lng>`.
- `dist/` funciona por servidor **e** por duplo clique em `dist/index.html` (`file://`): `base: './'`, caminhos de imagem relativos `img/<arquivo>` (sem `/` inicial), JS final em IIFE clássico (sem `type="module"`), nenhum `fetch` em runtime.
- Créditos por origem: `instagram` → "Foto: Instagram @padariaagape25"; `maps` → "Foto: cliente no Google Maps".
- Tokens: `--ink #0F0D0B`, `--brick #1A1613`, `--gold #C9A45C`, `--gold-soft #E2C98F`, `--cream #F3EADB`, `--muted #B8AC98`, `--terracotta #C98B4A`, `--peach #F2DCC4`. Easing `cubic-bezier(.2,.7,.2,1)`; 600ms revelar, 300ms UI.
- Fontes: Cormorant Garamond (600, 600 italic) display; Manrope (400, 600) texto; só via @fontsource (nenhuma requisição externa).
- Só `transform`, `opacity`, `clip-path` em animações; `prefers-reduced-motion: reduce` desliga revelação e expansão do hero.
- JS do cliente < 30 KB gzip; sem bibliotecas de animação.
- Sem fotos com crianças nem do visitante famoso (ver spec §4 "Excluídas").
- Commits pequenos, mensagem em português, terminando com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **JS desligado/falhou** → todo conteúdo visível na ordem, links da galeria abrem a imagem grande, as duas casas aparecem empilhadas. (Task 3: `render.test` verifica `hidden` na tablist e painéis sem `hidden`; Task 6 E2E com JS desabilitado.)
2. **Lightbox no celular/teclado** → Esc fecha, foco volta à miniatura, scroll não pula. (Task 5 `lightbox.test`; Task 6 E2E.)
3. **Foto com etiqueta de preço legível** → recortes no config removem etiquetas. (Task 1: verificação visual obrigatória dos recortes; Task 2 `content.test` sem `R$`.)
4. **Tela estreita 320–390px** → sem rolagem horizontal da página, barra de capítulos não cobre CTAs. (Task 4 regra CSS; Task 6 E2E mede `scrollWidth <= innerWidth` em 320 e 390.)
5. **Movimento reduzido** → hero sem expansão, `[data-reveal]` visível imediatamente. (Task 5 `reveal.test`; Task 6 E2E com `set media reduced-motion`.)

---

## File Structure

```
package.json, vite.config.js, index.html, README.md
scripts/images.config.mjs      # lista das imagens (id, origem, recorte, larguras, ponto focal)
scripts/build-images.mjs       # gera public/img/* + public/img/manifest.json
public/img/                    # gerado (commitado, para o site rodar sem rebuild)
src/content.js                 # todo texto, produtos, casas, créditos, pendências
src/lib/links.js               # whatsappUrl, directionsUrl
src/render/picture.js          # renderPicture
src/render/page.js             # renderPage + renderX de cada capítulo + JSON-LD
src/render/selo.js             # SVG do selo
src/styles/{tokens,base,hero,sections,components}.css
src/main.js                    # importa CSS/fontes e inicia módulos
src/lib/{chapters,carousel,lightbox,tabs,reveal,hero}.js
tests/{images,content,render,chapters,carousel,lightbox,tabs,reveal}.test.js
tests/e2e/e2e.mjs              # agent-browser
```

## Markup contract (usado por Tasks 3, 4, 5 — não mudar nomes)

- `<html lang="pt-BR">`; script inline no `<head>`: `document.documentElement.classList.add('js')`.
- Link `a.skip-link[href="#conteudo"]`; `<main id="conteudo">`.
- Capítulos: `<section id="cap-N" class="chapter chapter--<slug>" data-chapter="N" aria-labelledby="cap-N-title">` com `<h2 id="cap-N-title">` (hero usa `<h1 id="cap-1-title">`). N=1..6, slugs: `vitrine, fornada, confeitaria, perto, casas, visite`. O capítulo IV "De perto" é uma seção curta de transição que explica o detalhe ampliado e contém um mosaico de 3 fotos de textura (abre o lightbox).
- Nav: `<nav class="chapters" aria-label="Capítulos">` → `<ol>` de `<a class="chapters__link" href="#cap-N" data-chapter-link="N"><span class="chapters__num">I</span><span class="chapters__name">A vitrine acende</span></a>`; `<span class="chapters__progress" data-progress aria-hidden="true">`.
- Hero: `section.hero[data-hero]` contém `.hero__frame[data-hero-frame]` (picture) e `.hero__content`.
- Foto ampliável: `<a class="shot" href="img/<id>-<maior>.jpg" data-lightbox="<id>" data-caption="<legenda>" data-credit="<texto do crédito>">` envolvendo o `<picture>`.
- Lightbox (renderizado uma vez, fim do `<main>`): `<dialog class="lightbox" data-lightbox-dialog aria-label="Foto ampliada">` com `button[data-lightbox-close]` ("Fechar"), `button[data-lightbox-prev]` ("Foto anterior"), `button[data-lightbox-next]` ("Próxima foto"), `<img data-lightbox-img alt="">`, `<p data-lightbox-caption>`, `<small data-lightbox-credit>`, `<p data-lightbox-count aria-live="polite">` ("3 de 12").
- Carrossel: `div.strip[data-carousel]` → `ul.strip__track[data-carousel-track][tabindex="0"][aria-label="Confeitaria"]`, `button[data-carousel-prev]` ("Anterior"), `button[data-carousel-next]` ("Próximo").
- Abas: `div.houses[data-tabs]` → `div[role="tablist"][hidden]` com `button[role="tab"][id="tab-<slug>"][aria-controls="panel-<slug>"][data-tab="<slug>"]`; painéis `div[role="tabpanel"][id="panel-<slug>"][aria-labelledby="tab-<slug>"][data-house="<slug>"]`. Slugs: `arcozelo`, `miguel-pereira`.
- Revelação: qualquer elemento com `data-reveal`; JS adiciona `.is-visible`.

---

### Task 1: Base do projeto + pipeline de imagens

**Files:**
- Create: `package.json`, `vite.config.js` (por ora sem plugin), `index.html` (mínimo com `<!--app-->`), `scripts/images.config.mjs`, `scripts/build-images.mjs`, `tests/images.test.js`, `public/img/*`

**Interfaces:**
- Produces: `export const IMAGES: Array<{id:string, src:string, credit:'instagram'|'maps', crop?:{left:number,top:number,width:number,height:number}, widths:number[], focal?:string}>` (`credit` = `instagram` se `src` começa com `instagram/`, senão `maps`) (frações 0–1 no recorte; `focal` = valor CSS de `object-position`). Arquivos `public/img/<id>-<w>.{avif,webp,jpg}`. `public/img/manifest.json`: `{ "<id>": { "width":W, "height":H, "widths":[...], "focal":"50% 50%", "credit":"maps" } }` (W/H após recorte, da maior versão). Scripts npm: `dev`, `build`, `preview`, `images`, `test`, `e2e`.

- [ ] **Step 1:** `npm init -y`; instalar `vite@6 vitest happy-dom sharp @fontsource/cormorant-garamond @fontsource/manrope` (dev). `"type":"module"`. Scripts: `"dev":"vite"`, `"build":"vite build"`, `"preview":"vite preview --port 4173 --strictPort"`, `"images":"node scripts/build-images.mjs"`, `"test":"vitest run"`, `"e2e":"node tests/e2e/e2e.mjs"`. `vite.config.js`: `base: './'`, `server.port 5173`, `strictPort: true`, `test.environment 'node'`, `build.modulePreload: false`, `build.rollupOptions.output.format: 'iife'` (entrada única `src/main.js`); um pequeno plugin `transformIndexHtml` (enforce `post`, só no build) troca `<script type="module" crossorigin` por `<script defer` no HTML final.

- [ ] **Step 2: `scripts/images.config.mjs`** com exatamente estes ids (origem relativa a `assets/originais/`, larguras padrão `[480, 960, 1600]`, nunca maiores que a largura recortada):

| id | src | crop | nota |
|---|---|---|---|
| vitrine-arcozelo | maps-arcozelo/maps-arc-01.jpg | — | hero desktop, `widths [640,1200,1600]` |
| paes-estante | maps-arcozelo/maps-arc-07.jpg | — | hero celular |
| pao-frances | maps-arcozelo/maps-arc-06.jpg | — | `widths [480,600]` |
| sonhos | maps-arcozelo/maps-arc-03.jpg | — | |
| bolos-chocolate | maps-arcozelo/maps-arc-02.jpg | — | |
| doces-chocolate | maps-arcozelo/maps-arc-04.jpg | — | |
| ilha-paes | maps-arcozelo/maps-arc-05.jpg | — | |
| cafe-neon | maps-arcozelo/maps-arc-08.jpg | — | |
| mercearia | maps-arcozelo/maps-arc-10.jpg | — | |
| fachada-miguel | maps-miguel/maps-mig-01.jpg | — | |
| bolo-cerejas | maps-miguel/maps-mig-02.jpg | — | |
| vitrine-miguel | maps-miguel/maps-mig-03.jpg | — | |
| torta-surpresa | maps-miguel/maps-mig-04.jpg | `{left:.25,top:0,width:.75,height:.55}` | remover etiqueta de preço |
| rocambole | maps-miguel/maps-mig-05.jpg | `{left:.35,top:0,width:.65,height:.65}` | remover etiqueta |
| salao-miguel | maps-miguel/maps-mig-06.jpg | — | |
| balcao-miguel | maps-miguel/maps-mig-07.jpg | — | |
| tranca-coco | maps-miguel/maps-mig-08.jpg | `{left:0,top:0,width:1,height:.62}` | remover etiqueta |
| cafe-manha | maps-miguel/maps-mig-10.jpg | — | |
| torta-pudim | instagram/post-DZz82hDEUnh-2.jpg | — | |
| torta-pudim-duo | instagram/post-DZz82hDEUnh-1.jpg | `{left:0,top:.28,width:1,height:.72}` | remover texto manuscrito |
| bolo-festa | instagram/post-De5L3iXRbiT-1.jpg | — | |
| padeiros | instagram/post-DakqP89Fzo--1.jpg | `{left:0,top:0,width:1,height:.56}` | só a foto, sem a arte |

  Também gerar `og-vitrine.jpg` (1200×630, cover) de `vitrine-arcozelo` em `public/img/`.

- [ ] **Step 3: Write failing `tests/images.test.js`**: importa `IMAGES` e lê `public/img/manifest.json`; para cada id: está no manifest; `widths` crescente e `max(widths) <= manifest.width`; existem `public/img/<id>-<w>.avif|webp|jpg` para cada largura; ids são únicos e casam `/^[a-z0-9-]+$/`; `public/img/og-vitrine.jpg` existe. Run `npm test` → FAIL (sem manifest).

- [ ] **Step 4: Implement `scripts/build-images.mjs`**: para cada item, `sharp(src).rotate()` (EXIF), aplica `extract` a partir das frações do crop, redimensiona para cada largura (`withoutEnlargement`), salva AVIF (q 50), WebP (q 72), JPEG (q 78, mozjpeg, progressive); escreve manifest. Rodar `npm run images`.

- [ ] **Step 5: Verificação visual** — gerar e abrir (Read) as versões 960 de `torta-surpresa`, `rocambole`, `tranca-coco`, `torta-pudim-duo`, `padeiros`: nenhuma etiqueta de preço/texto de arte legível e o produto inteiro visível. Ajustar frações se preciso.

- [ ] **Step 6:** `npm test` → PASS. Commit `feat: base Vite e pipeline de imagens responsivas`.

### Task 2: Conteúdo e links

**Files:** Create `src/content.js`, `src/lib/links.js`, `tests/content.test.js`

**Interfaces:**
- Consumes: `IMAGES` ids (Task 1, só os ids).
- Produces:
  - `whatsappUrl(message?: string): string` → `https://wa.me/5524981100190` ou `...?text=<encodeURIComponent(message)>`.
  - `directionsUrl({lat, lng}): string`.
  - `site = { name:'Padaria e Confeitaria Ágape', since:2012, tagline:'Delícias artesanais todos os dias', motto:'A vida começa depois do café', instagram, whatsappDisplay:'(24) 98110-0190', hoursNote:'Abre às 6h · confirme o horário do dia pelo WhatsApp' }`
  - `houses: Array<{slug, name, shortName, address, postalCode, locality, lat, lng, note, accent:'gold'|'terracotta', images: Array<{id, alt}>}>` — Arcozelo `note: 'Casa reinaugurada em 2 de outubro de 2026'`; Miguel Pereira `name:'Padaria Ágape Gourmet'`, `note:'A casa de Miguel Pereira'`.
  - `chapters: Array<{n:number, roman:string, slug:string, name:string}>` (I A vitrine acende, II A fornada, III Confeitaria, IV De perto, V Duas casas, VI Visite e encomende).
  - `products: Array<{id:string, name:string, chapter:'fornada'|'confeitaria'|'perto', image:string, alt:string, caption:string, tag?:'Novidade'|'Sob encomenda'}>` — fornada: pao-frances "Pão francês", sonhos "Sonho", tranca-coco "Trança recheada de coco", paes-estante "Pães da casa", padeiros "Nossos padeiros"; confeitaria: torta-pudim "Torta Pudim" (Novidade), torta-pudim-duo "Torta Pudim", rocambole "Rocambole", torta-surpresa "Torta surpresa de morango com chocolate", bolo-cerejas "Bolos da vitrine", bolos-chocolate "Bolos de chocolate", doces-chocolate "Doces de chocolate", bolo-festa "Bolos sob encomenda" (Sob encomenda); perto: vitrine-miguel "Vitrine de doces", ilha-paes "Pães na ilha", cafe-manha "Café da manhã".
  - `alsoMade = ['Lasanha no pão', 'Pão de queijo', 'Bolo de aipim', 'Chocolate quente', 'Café']`
  - `credits: string[]` (["Fotos: Instagram @padariaagape25", "Fotos de clientes publicadas no Google Maps"]).
  - `pending: string[]` — as 4 pendências do spec §3 (não renderizadas na página; documentação).
  - `houses[n].images`: Arcozelo `ilha-paes, cafe-neon, mercearia`; Miguel `fachada-miguel, salao-miguel, balcao-miguel`.

- [ ] **Step 1: failing `tests/content.test.js`**: `whatsappUrl()` === `'https://wa.me/5524981100190'`; `whatsappUrl('Olá, Ágape!')` === `'https://wa.me/5524981100190?text=Ol%C3%A1%2C%20%C3%81gape!'`; `directionsUrl(houses[0])` === `'https://www.google.com/maps/dir/?api=1&destination=-22.4071627,-43.4226476'`; todo `image`/`images[].id` existe em `IMAGES`; todo `alt` tem ≥ 15 caracteres; `JSON.stringify({site,houses,products,alsoMade})` não casa `/R\$\s?\d/` nem `/\b\d{1,2}h\s?(às|-|–)\s?\d{1,2}h\b/`; `chapters.length === 6`; endereços exatamente os do Global Constraints.
- [ ] **Step 2:** `npm test -- content` → FAIL. **Step 3:** implementar. **Step 4:** PASS. **Step 5:** commit `feat: conteúdo confirmado e links`.

### Task 3: Renderização do HTML (sem JS no cliente)

**Files:** Create `src/render/picture.js`, `src/render/selo.js`, `src/render/page.js`, `tests/render.test.js`; Modify `vite.config.js` (plugin), `index.html`.

**Interfaces:**
- Consumes: `content.js`, `links.js`, `public/img/manifest.json`.
- Produces:
  - `renderPicture(id: string, opts: {alt: string, sizes: string, className?: string, priority?: boolean, mobileId?: string, mobileMedia?: string}) : string` — `<picture>` com `<source type="image/avif">`, `<source type="image/webp">` (e, com `mobileId`, fontes AVIF/WebP/JPEG para `mobileMedia` default `(max-width: 699px)` antes), `<img src="img/<id>-<meio>.jpg" srcset sizes width height alt style="object-position:<focal>">`; `priority` → `fetchpriority="high"` sem `loading`; senão `loading="lazy" decoding="async"`. Lança erro se o id não está no manifest.
  - `renderSelo({className?: string, title?: string}): string` — SVG inline: dois círculos dourados, "PADARIA E CONFEITARIA" em `textPath` no arco superior, "Ágape" ao centro (Cormorant), "Desde 2012" embaixo, duas espigas simples; `role="img"` + `<title>`.
  - `renderPage(): string` — conteúdo de `<body>` (skip link, header com selo pequeno + CTA WhatsApp, nav de capítulos, `<main id="conteudo">` com os 6 capítulos, lightbox, footer).
  - `renderHead(): string` — title "Padaria e Confeitaria Ágape · Arcozelo e Miguel Pereira", meta description, OG (`og:image` `img/og-vitrine.jpg`), JSON-LD `@graph` com dois `Bakery` (name, address `PostalAddress`, `geo`, `url` do Instagram, `telephone` "+55-24-98110-0190") **sem** `openingHours`/`priceRange`.
  - Plugin em `vite.config.js`: `transformIndexHtml` troca `<!--head-->` e `<!--app-->` por `renderHead()`/`renderPage()` (reimportando os módulos a cada request em dev via `server.ssrLoadModule` ou import com cache-busting).
- Conteúdo por capítulo segue spec §7 e o Markup contract: hero com `renderPicture('vitrine-arcozelo', {priority:true, mobileId:'paes-estante', sizes:'100vw'})`, botões "Explorar" (`#cap-2`) e "Encomendar pelo WhatsApp" (`whatsappUrl('Olá, Ágape! Quero fazer uma encomenda.')`, `target="_blank" rel="noopener"`); fornada em composição assimétrica (1 grande + 2 deslocadas + faixa padeiros) + lista `alsoMade`; confeitaria em carrossel; "De perto" com mosaico; casas com abas e, entre elas, a ponte `cafe-neon` com o lema; visite com 2 cartões de casa (endereço, `site.hoursNote`, "Como chegar" → `directionsUrl`, "WhatsApp"); footer com selo, Instagram, `credits`, "Desde 2012". Toda foto de produto/ambiente é `a.shot`. Textos de legenda: curtos, sem afirmar ingredientes além do nome.

- [ ] **Step 1: failing `tests/render.test.js`** (happy-dom `Window`, parse `renderPage()`): 6 `section.chapter` com ids `cap-1..cap-6` e `aria-labelledby` válido; exatamente 1 `h1`; a primeira `img` tem `fetchpriority="high"` e não tem `loading`; todas as outras `img` (exceto dentro do `dialog`) têm `loading="lazy"`, `width`, `height` e `alt` não vazio; todo `a.shot` tem `href` `^img/.+\.jpg$` existente em `public/img`, `data-caption` e `data-credit` ∈ {"Foto: Instagram @padariaagape25", "Foto: cliente no Google Maps"}; nenhum `src`/`srcset`/`href` interno começa com `/`; `[role=tablist]` tem `hidden`; nenhum `[role=tabpanel]` tem `hidden`; existem 6 `[data-chapter-link]`; há ≥ 3 links `wa.me` e 2 links `google.com/maps/dir`; texto do body não casa `/R\$/`; `renderHead()` contém os dois endereços e não contém `openingHours`; `renderPicture('nao-existe', …)` lança.
- [ ] **Step 2:** FAIL. **Step 3:** implementar. **Step 4:** `npm test` PASS e `npm run build` gera `dist/index.html` contendo `id="cap-6"`. **Step 5:** commit `feat: HTML estático gerado a partir do conteúdo`.

### Task 4: Estilos — "Vitrine noturna"

**Files:** Create `src/styles/tokens.css`, `base.css`, `hero.css`, `sections.css`, `components.css`; Modify `src/main.js` (imports de CSS e fontes `@fontsource/cormorant-garamond/600.css`, `600-italic.css`, `@fontsource/manrope/400.css`, `600.css`).

**Interfaces:** Consumes o Markup contract (classes e data-attributes). Produces nada para outras tasks.

- [ ] **Step 1:** tokens do Global Constraints + escala tipográfica fluida (`clamp`), espaçamentos, `--ease`, `--dur-reveal: 600ms`, `--dur-ui: 300ms`. Fundo `--ink` com tijolinho via `repeating-linear-gradient` sutil (opacidade ≤ .06) em `body`. `.skip-link` visível no foco. Foco: `outline: 2px solid var(--gold); outline-offset: 3px`.
- [ ] **Step 2: hero** — `.hero__frame` começa como arco (border-radius superior 50% da largura, ~78vw desktop / 88vw celular) e usa `--hero-progress` (0→1, definido pelo JS) para `transform: scale(calc(.82 + .18 * var(--hero-progress)))` e `border-radius` → 0; sem JS/reduced-motion, frame fica no estado final legível. Título com selo grande, contraste AA sobre foto via gradiente escuro.
- [ ] **Step 3: seções** — fornada: grid assimétrico (1 retrato grande, 2 menores deslocadas verticalmente, padeiros em faixa larga); confeitaria: `.strip__track` com `overflow-x:auto; scroll-snap-type:x mandatory`, cartões de alturas variadas, botões visíveis; perto: mosaico de recortes em arco; casas: painel Arcozelo preto/dourado, Miguel Pereira com fundo `--peach`/texto `--brick` e acento `--terracotta`; ponte `cafe-neon` com o lema em itálico grande; visite: dois cartões lado a lado (empilhados < 700px). Nunca a mesma grade em duas seções.
- [ ] **Step 4: componentes** — nav de capítulos: desktop (≥ 1024px) faixa vertical fixa à direita com números romanos e linha de progresso dourada (`transform: scaleY(var(--progress))`); celular: barra inferior fixa compacta (número + nome do atual, 56px), e `main` com `padding-bottom` para não cobrir CTAs. `.chapters__link[aria-current="true"]` em dourado. Lightbox tela cheia escura, imagem `object-fit: contain`, botões ≥ 44px. `html.js [data-reveal]:not(.is-visible)` com `opacity:0; transform: translateY(24px)`; dentro de `@media (prefers-reduced-motion: reduce)` sem esse estado oculto e sem transições.
- [ ] **Step 5:** sem overflow horizontal: `html, body { overflow-x: clip }` só como rede de segurança — layouts devem caber em 320px. Verificar com `npm run dev` + agent-browser screenshot desktop 1440×900 e celular 390×844 do topo, fornada, confeitaria e casas (salvar em `test-results/task4-*.png`, ver as imagens). Commit `feat: direção de arte Vitrine noturna`.

### Task 5: Interações (aprimoramento progressivo)

**Files:** Create `src/lib/chapters.js`, `carousel.js`, `lightbox.js`, `tabs.js`, `reveal.js`, `hero.js`; tests `tests/{chapters,carousel,lightbox,tabs,reveal}.test.js` (environment `happy-dom` via `// @vitest-environment happy-dom`); Modify `src/main.js`.

**Interfaces:**
- Consumes: Markup contract.
- Produces (cada um `export function initX(root: ParentNode = document, opts?) : () => void` retornando cleanup):
  - `initChapters(root, {observerFactory?})` — IntersectionObserver nas `section[data-chapter]`; o capítulo mais visível recebe `aria-current="true"` no link correspondente (demais removem); `--progress` (0–1) no `.chapters` conforme `scrollY / (scrollHeight - innerHeight)` via rAF; exporta também `setCurrentChapter(root, n)`.
  - `initCarousel(root)` — prev/next rolam `track` por largura de um item (`scrollBy({left, behavior})`, `behavior:'auto'` com reduced motion); ←/→ no track fazem o mesmo; botões ficam `disabled` nas pontas (verificado em `scroll`).
  - `initLightbox(root)` — clique em `a.shot` (sem modificador/ctrl/meta) → `preventDefault`, abre `dialog.showModal()` com a imagem do `href` e `data-caption`, conta "i de N" na ordem do DOM; ←/→ e botões navegam (circular); Esc/fechar → `close()`, foco volta ao `a.shot` de origem; `document.body` mantém o scroll (sem saltos). Se `HTMLDialogElement` não existir, não intercepta (link segue).
  - `initTabs(root)` — remove `hidden` da tablist, ativa a primeira aba (`aria-selected="true"`, `tabindex=0`), esconde painéis inativos com `hidden`; ←/→/Home/End movem foco e ativam (roving tabindex).
  - `initReveal(root, {reducedMotion?: boolean})` — reduced motion ou sem IntersectionObserver → adiciona `.is-visible` a todos imediatamente; senão observa e adiciona ao entrar (threshold .15), uma vez.
  - `initHero(root)` — define `--hero-progress` no `[data-hero]` de 0 a 1 enquanto o hero sai da tela (rAF, passive scroll); reduced motion → fixa 1 e não escuta scroll.
  - `main.js`: `const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;` inicia todos.

- [ ] **Step 1: failing tests**:
  - `tabs.test`: após `initTabs`, tablist sem `hidden`; `tab-arcozelo` `aria-selected="true"`, `panel-miguel-pereira` `hidden`; `keydown ArrowRight` na aba ativa → `tab-miguel-pereira` focado e selecionado, `panel-arcozelo` `hidden`; `End`/`Home` funcionam.
  - `lightbox.test`: DOM com 3 `a.shot` + dialog (stub `showModal`/`close` se happy-dom não tiver); clique no 2º → dialog aberto, img `src` = href do 2º, count "2 de 3", caption = `data-caption`, credit = `data-credit`; `ArrowRight` → "3 de 3"; de novo → "1 de 3"; Esc → fechado e `document.activeElement` é o 2º `a.shot`; clique com `ctrlKey` não abre.
  - `carousel.test`: `scrollBy` é chamado com `left > 0` em next e `< 0` em prev; `ArrowRight` no track chama `scrollBy`.
  - `chapters.test`: `setCurrentChapter(document, 3)` → só o link `data-chapter-link="3"` tem `aria-current="true"`.
  - `reveal.test`: com `{reducedMotion:true}` todos `[data-reveal]` têm `.is-visible` imediatamente.
- [ ] **Step 2:** FAIL. **Step 3:** implementar. **Step 4:** PASS; `npm run build` e conferir `dist/assets/*.js` gzip < 30 KB (`gzip -c | wc -c`). **Step 5:** commit `feat: capítulos, carrossel, galeria ampliada e abas`.

### Task 6: Verificação E2E com agent-browser + README

**Files:** Create `tests/e2e/e2e.mjs`, `README.md`.

**Interfaces:** Consumes o site construído (`npm run build && npm run preview` em `http://localhost:4173`).

- [ ] **Step 1: `tests/e2e/e2e.mjs`** — Node script que chama `agent-browser --session agape-e2e <cmd>` via `execFileSync` (shell no Windows: `agent-browser.cmd`), sobe `vite preview` como processo filho, espera a porta, executa os cenários, grava screenshots em `test-results/` e imprime `PASS/FAIL` por cenário; exit code 1 se algum falhar. Cenários:
  1. Desktop 1440×900: abre `/`; `eval` sem erros no console (`agent-browser console` / `errors`); 6 capítulos; screenshot de cada capítulo (`scrollintoview #cap-N`), rolando para baixo e depois para cima.
  2. Navegação: clique no link do capítulo V → URL termina em `#cap-5` e link V tem `aria-current="true"` após scroll.
  3. Carrossel: clicar "Próximo" muda `scrollLeft` do track (> 0); teclado ArrowRight no track idem.
  4. Lightbox: clicar no primeiro `a.shot` da fornada → `dialog[open]`; `press ArrowRight` → contagem muda; `press Escape` → fechado e `document.activeElement` é o `a.shot` clicado; `scrollY` igual ao de antes (±2px).
  5. Abas: clicar "Miguel Pereira" → `panel-miguel-pereira` visível, `panel-arcozelo` hidden.
  6. Links: todos `a[href*="wa.me/5524981100190"]` ≥ 3; 2 `a[href^="https://www.google.com/maps/dir/?api=1&destination="]`; nenhum `href="#"` vazio; todas as imagens `img` carregadas (após rolar até o fim) têm `naturalWidth > 0`.
  7. Celular 390×844 e 320×640: `document.documentElement.scrollWidth <= innerWidth`; barra de capítulos visível; screenshots do hero e das casas; o botão WhatsApp do hero não está coberto pela barra (`elementFromPoint` no centro do botão retorna o próprio botão ou filho).
  8. Movimento reduzido (`set media dark reduced-motion` ou `set media light reduced-motion`): reload; todos `[data-reveal]` com `.is-visible` sem rolar; `--hero-progress` = 1.
  9. Sem JS: abrir `dist/index.html` servido com JS bloqueado (`network route "**/*.js" --abort`), reload: 6 capítulos presentes, dois painéis das casas visíveis, `a.shot` com href de imagem.
  10. Duplo clique: abrir `file:///<caminho absoluto>/dist/index.html` → imagens do hero carregadas (`naturalWidth > 0`), `html.js` presente e lightbox abre (JS rodou), sem erros de console.
  11. Peso da primeira tela (celular, sem rolar): soma `performance.getEntriesByType('resource')` `transferSize` + navegação < 500 KB; registrar o valor.
- [ ] **Step 2:** `npm run e2e` → corrigir até tudo PASS. Ver os screenshots (Read) e corrigir problemas visuais (recortes, sobreposições, texto ilegível, espaços vazios).
- [ ] **Step 3: README.md** (pt-BR): como rodar (`npm install`, `npm run dev`, `npm test`, `npm run e2e`, `npm run build`), escolhas visuais (3–5 linhas), **como trocar fotos** (colocar original em `assets/originais/…`, editar `scripts/images.config.mjs`, `npm run images`, ajustar `src/content.js`), lista de pendências de conteúdo (de `pending`), créditos e aviso sobre autorização das fotos de clientes do Google Maps, o que foi testado (navegador headless via agent-browser, emulação de celular) e o que não foi (aparelhos reais, Safari/iOS, conexão lenta real).
- [ ] **Step 4:** `npm test && npm run build && npm run e2e` tudo verde. Commit `test: E2E com agent-browser e README`.
