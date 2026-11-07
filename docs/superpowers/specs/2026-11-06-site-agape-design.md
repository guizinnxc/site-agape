# Site imersivo — Padaria e Confeitaria Ágape · Design

Data: 06/11/2026 · Skill de referência: `.claude/skills/criar-site-padaria-imersivo/SKILL.md` · Dados: `BRIEFING-padaria-agape.md`

## 1. Intenção

Uma vitrine digital da Padaria e Confeitaria Ágape (desde 2012), com as duas casas — **Arcozelo** (matriz, reinaugurada em 02/10/2026) e **Miguel Pereira** ("Padaria Ágape Gourmet"). Navegar deve ser como entrar na loja à noite com a vitrine acesa: produtos, texturas, o espaço e, no fim, como chegar. A pessoa sai do site com duas vontades: **encomendar pelo WhatsApp** ou **ir até uma das lojas**.

Decisões do usuário (06/11/2026):
- Imagens: **usar as fotos do Instagram da Ágape e do Google Maps**.
- Direção de arte: **"Vitrine noturna"** — preto profundo, dourado do selo, creme; serifa elegante.
- Ação principal: **WhatsApp (encomendas) + Como chegar** às duas lojas. Sem carrinho/pagamento.
- Entrega: **somente local** (pasta do projeto), nada publicado.
- O usuário delegou o resto e pediu execução sem novas perguntas.

## 2. Metas, não-metas, anti-metas

**Metas**
- Experiência fotográfica e editorial, com uma interação principal clara (capítulos com progresso).
- Funciona por toque, teclado e com movimento reduzido; celular recomposto em vertical.
- Carregamento leve: hero priorizado, demais imagens sob demanda, versões responsivas (AVIF/WebP/JPEG).
- Conteúdo e imagens em um arquivo de dados para trocar fácil.

**Não-metas**: carrinho, pedidos online, cadastro, CMS, blog, publicação/deploy, vídeo/3D.

**Anti-metas (seria falha mesmo funcionando)**
- Inventar preço, horário, ingrediente ou característica não confirmada.
- Mostrar rostos de crianças ou o post com visitante famoso.
- Uma grade de cards idênticos repetida em todas as seções.
- Animação que trava o scroll, esconde conteúdo se o JS falhar, ou depende de hover/arrastar.

## 3. Conteúdo confirmado (única fonte permitida)

| Item | Valor | Fonte |
| --- | --- | --- |
| Nome | Padaria e Confeitaria Ágape | Instagram |
| Fundação | Desde 2012 | selo/logo |
| Slogan de marca | "Delícias artesanais todos os dias" | bio IG |
| Letreiro nas lojas | "A vida começa depois do café" | fotos Maps (as duas lojas) |
| WhatsApp encomendas/delivery | +55 24 98110-0190 → `https://wa.me/5524981100190` | bio IG |
| Instagram | `https://www.instagram.com/padariaagape25/` | — |
| Arcozelo | R. Dr. Mario Kroeff, 95 – Arcozelo, Paty do Alferes – RJ, 26950-000 · lat −22.4071627, lng −43.4226476 | Maps + convite reinauguração |
| Miguel Pereira | R. Francisco Alves, 57 – Lj 3 – Centro, Miguel Pereira – RJ, 26900-000 · lat −22.4545576, lng −43.4712167 | Maps |
| Horários | Maps só confirma **sexta 06:00–21:00** nas duas lojas | Maps |
| Avaliações | Arcozelo 4,5★ (91) · Miguel 4,8★ (22) | Maps |

**Produtos com nome confirmado**: Torta Pudim (novidade, IG 20/06/2026), bolos sob encomenda ("Transformamos sonhos em bolo… Aceitamos encomendas"), pão francês, sonho, rocambole, torta surpresa de morango com chocolate, trança recheada de coco, bolo cocada da casa, bolo de aipim, lasanha no pão, pão de queijo, chocolate quente, café.

**Pendências de conteúdo** (não aparecem como fato; ficam marcadas em `src/content.js` com `pendente`):
- Horário completo por dia → o site mostra "Confirme o horário do dia pelo WhatsApp antes de vir". *(Revisão final, 2026-11-06: o Maps só confirma sexta 06:00–21:00, então "Abre às 6h" generalizava; trocado pelo aviso sem horário.)*
- Preços → não exibidos (etiquetas nas fotos de clientes são antigas).
- Qual loja atende o WhatsApp / área de delivery → texto genérico "Encomendas e delivery".
- Autorização formal de uso das fotos de clientes do Maps → créditos no rodapé + nota no README.

## 4. Acervo (catalogado)

Originais em `assets/originais/{instagram,maps-arcozelo,maps-miguel}`. Catálogo resumido:

| Arquivo | Assunto | Orientação / tamanho | Uso sugerido |
| --- | --- | --- | --- |
| maps-arc-01 | vitrine iluminada com doces (Arcozelo) | paisagem 1599×899 | hero (desktop) |
| maps-mig-03 | vitrine cheia de doces, 3 andares (Miguel) | paisagem 1600×1200 | hero alternativo / produtos |
| maps-arc-07 | estante de pães sobre tijolinho preto | retrato 1200×1600 | hero (celular) / fornada |
| maps-arc-06 | pão francês na cesta (close) | 600×400 (baixa) | detalhe pequeno |
| maps-arc-03 | sonhos com açúcar | paisagem 1280×720 | fornada |
| maps-arc-02 | bolos de chocolate tipo caneca | paisagem 1170×855 | confeitaria |
| maps-arc-04 | chocotones/panetones de chocolate | retrato 1170×1510 | confeitaria (sem nome confirmado → legenda genérica) |
| maps-arc-09 | trança doce na vitrine | retrato 1200×1600 | fornada |
| maps-arc-05 | ilha de pães, madeira e luz | retrato | espaço Arcozelo |
| maps-arc-08 | letreiro neon "A vida começa depois do café" + mesa | retrato | espaço Arcozelo / ponte de capítulo |
| maps-arc-10 | mercearia / prateleiras | retrato | espaço Arcozelo |
| maps-mig-01 | fachada com logo "padaria ágape" | retrato 738×1600 | casa Miguel Pereira |
| maps-mig-06, -07 | interior com tijolinho e letreiro | retrato | espaço Miguel |
| maps-mig-02 | bolo com cerejas e farofa | paisagem | confeitaria (detalhe) |
| maps-mig-04 | torta surpresa morango/chocolate | paisagem | confeitaria |
| maps-mig-05 | rocambole | paisagem | confeitaria |
| maps-mig-08 | trança recheada de coco (etiqueta) | retrato | fornada |
| maps-mig-09 | bolo cocada da casa (etiqueta) | retrato | confeitaria |
| maps-mig-10 | pão na chapa + suco na mesa | paisagem | café da manhã |
| post-DZz82hDEUnh-1/2 | Torta Pudim | retrato 1080×1350 | destaque "novidade" |
| post-De5L3iXRbiT-1 | bolo de festa (natal) | retrato 3024×4032 | encomendas |
| post-DakqP89Fzo- | padeiros (adultos) + arte Dia do Padeiro | retrato 1350×1687 | ~~equipe~~ — removida a pedido da padaria (revisão final) |
| post-Dd88EzQRB1z | convite reinauguração (preto/dourado) | retrato | referência visual, não usar como foto |
| ig-perfil-01 | selo "Ágape Arcozelo – Desde 2012" | 150×150 | **recriar em SVG** (não ampliar o JPEG) |
| ig-destaque-04 | logo "padaria ágape gourmet – Miguel Pereira" | 150×150 | referência para o selo da casa Miguel (tipográfico) |

**Excluídas**: posts com crianças (DYKTIZ0Ecol, DeDDas_REsq), visitante famoso (DZnuOWlxXf1), memes/reels de baixa resolução (DeKtCflA6Wz, DdMQhWQhovU, Dd6rcd3xtLK, DZ974BQR6ZG).

## 5. Abordagens consideradas

1. **Página única estática com Vite (HTML/CSS/JS sem framework) + script de imagens com `sharp`** — *escolhida*. Proporcional: um percurso único, sem rotas nem estado complexo; controle total de animação e acessibilidade; build gera arquivos estáticos que abrem em qualquer servidor.
2. Astro com componentes — bom para várias páginas e otimização de imagem embutida, mas adiciona camada de framework sem ganho real para uma página.
3. React/Next.js — excessivo; mais JS no cliente para uma vitrine, pior para o desempenho que a skill pede.

## 6. Direção de arte — "Vitrine noturna"

- **Atmosfera**: noite na padaria, vitrine acesa. Fundo quase preto com textura sutil de tijolinho (CSS, não imagem), fotos como janelas de luz quente, filetes dourados.
- **Paleta (tokens)**: `--ink #0F0D0B`, `--brick #1A1613`, `--gold #C9A45C`, `--gold-soft #E2C98F`, `--cream #F3EADB`, `--muted #B8AC98`. Casa Miguel Pereira ganha acento próprio do seu logo: `--terracotta #C98B4A` / `--peach #F2DCC4`.
- **Tipografia**: display `Cormorant Garamond` (600/italic), texto `Manrope` (400/600). Auto-hospedadas via `@fontsource` (sem chamada externa). Números/etiquetas em versalete com tracking largo, como no selo.
- **Selo**: recriado em SVG — círculo duplo dourado, "PADARIA E CONFEITARIA" em arco, "Ágape", "Desde 2012", espigas. Usado no topo e como marcador de capítulo.
- **Ritmo de imagens**: alterna uma foto grande sangrando com composições assimétricas (1 grande + 2 pequenas deslocadas), recortes em arco (eco da porta em arco da fachada de Miguel Pereira) e tiras horizontais. Nunca a mesma grade duas vezes.
- **Movimento**: uma curva única `cubic-bezier(.2,.7,.2,1)`, durações 600ms (revelar) / 300ms (UI). Só `transform`, `opacity` e `clip-path` simples.

## 7. Jornada (capítulos)

Navegação fixa por capítulos com progresso (interação principal): faixa lateral no desktop / barra inferior no celular com o número romano do capítulo atual, nome e linha de progresso dourada; cada item é link âncora (teclado e leitor de tela), `aria-current` no ativo.

| # | Capítulo | Conteúdo | Interação |
| --- | --- | --- | --- |
| I | **A vitrine acende** (hero) | Selo SVG, "Padaria e Confeitaria Ágape · desde 2012", "Delícias artesanais todos os dias", botões *Explorar* e *Encomendar pelo WhatsApp*. Foto: vitrine (desktop maps-arc-01, celular maps-arc-07 via `<picture>`). | Ao rolar, a foto sai de uma moldura em arco e se expande para tela cheia (scale/clip), revelando o próximo capítulo. |
| II | **A fornada** | Pães e salgados: pão francês, sonho, tranças, lasanha no pão, pão de queijo. Composição editorial assimétrica. | Clicar/tocar em qualquer foto abre o detalhe (capítulo IV). |
| III | **Confeitaria** | Torta Pudim (novidade), rocambole, torta surpresa, bolo cocada, bolos de chocolate; bloco "Bolos sob encomenda" com CTA WhatsApp. | Tira horizontal com botões anterior/próximo visíveis, rolagem por toque e setas do teclado; scroll-snap. |
| IV | **De perto** (detalhe) | Seção curta real: mosaico de 3 texturas em recortes de arco (vitrine de doces, pães na ilha, café da manhã) + frase convidando a tocar nas fotos. Todas as fotos do site abrem a galeria ampliada em `<dialog>`: foto grande, nome curto, crédito da origem. | Abre de qualquer foto; Esc/botão fecha; ←/→ navega; foco volta à miniatura de origem; posição de scroll preservada. |
| V | **Duas casas** | Arcozelo (preto/dourado, reinaugurada 02/10/2026) e Miguel Pereira (creme/terracota, "Ágape Gourmet"). Sequência de ambientes de cada uma + ponte com o letreiro "A vida começa depois do café". | Abas acessíveis (role=tablist) alternando a casa; no celular, empilha. |
| VI | **Visite / Encomende** | Para cada casa: endereço, "Confirme o horário do dia pelo WhatsApp antes de vir" (revisão final: sem "Abre às 6h"), botões *Como chegar* (Google Maps directions com lat/lng) e *WhatsApp*. Rodapé: Instagram, créditos de fotos, "Desde 2012". | Encerramento visual: a vitrine "apaga" para o selo dourado. |

Sem JS: todas as seções aparecem em ordem, imagens visíveis, galeria vira links para as imagens grandes, abas viram duas seções empilhadas.

## 8. Requisitos técnicos

- **Estrutura** *(chamada do builder após revisão)*: o HTML é **gerado no build/dev** por funções puras a partir de `src/content.js` + manifest de imagens (plugin Vite `transformIndexHtml`), então o HTML final é estático e completo sem JS e há uma só fonte de verdade. JS do cliente só aprimora.
- **Abertura local** *(chamada do builder)*: o `dist/` deve funcionar **tanto por servidor (`npm run preview`) quanto abrindo `dist/index.html` com duplo clique** — `base: './'`, caminhos de imagem relativos (`img/...`), bundle JS em formato clássico (IIFE, sem `type="module"`), nenhum `fetch` em tempo de execução.
- **Créditos** *(chamada do builder)*: genéricos por origem — "Foto: Instagram @padariaagape25" ou "Foto: cliente no Google Maps" — exibidos na legenda da galeria e no rodapé.
- **Imagens**: `scripts/build-images.mjs` com `sharp` gera, a partir de `assets/originais`, versões em `public/img/` com larguras 480/960/1600 (sem upscale além do original) em AVIF, WebP e JPEG, e um `public/img/manifest.json` com dimensões. Cada `<img>` tem `width`/`height`, `srcset`/`sizes`, `loading="lazy"` e `decoding="async"` (exceto hero: `fetchpriority="high"`, sem lazy). Recortes por tela via `<picture>` + `object-position` por imagem.
- **Acessibilidade**: idioma `pt-BR`, link "Pular para o conteúdo", landmarks, contraste AA (texto creme/dourado sobre preto), foco visível dourado, alt descritivo em fotos informativas e alt vazio em decorativas, `prefers-reduced-motion` desliga revelações/expansão do hero.
- **Desempenho**: JS total < 30 KB gzip; sem bibliotecas de animação (IntersectionObserver + CSS). Peso da primeira tela < 500 KB no celular.
- **SEO/compartilhamento**: title, description, Open Graph com foto da vitrine, JSON-LD `Bakery` para as duas lojas (só campos confirmados; sem `openingHours`).
- **Testes**: `vitest` para dados (toda imagem referenciada existe no manifest; todo produto tem alt; links wa.me/maps bem formados; nenhum preço no conteúdo). `agent-browser` para E2E em desktop (1440×900) e celular (390×844): carregamento sem erros de console, navegação por capítulos e `aria-current`, carrossel por botões/teclado, lightbox (abrir, ←/→, Esc, foco de volta), abas das casas, links de WhatsApp/rotas, modo movimento reduzido, rolagem para cima e para baixo, screenshots de cada capítulo como evidência; checagem de bytes da primeira tela.

## 9. Fica a critério do builder

Textos curtos de legenda (sem afirmar ingrediente além do nome), recortes exatos, ordem fina das fotos dentro de cada capítulo, detalhes do SVG do selo, nomes de classes/arquivos.
