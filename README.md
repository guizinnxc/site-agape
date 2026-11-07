# Padaria e Confeitaria Ágape — site

Site de uma página, estático e imersivo, da Padaria e Confeitaria Ágape (desde 2012), com as duas lojas:
Arcozelo (Paty do Alferes) e centro de Miguel Pereira, RJ. A visita é contada em seis capítulos —
*A vitrine acende*, *A fornada*, *Confeitaria*, *De perto*, *Duas casas* e *Visite e encomende* — com
navegação fixa por capítulos, galeria ampliada, carrossel da confeitaria e abas das duas casas.
Encomendas e dúvidas vão para o WhatsApp; não há carrinho, preços nem pagamento.

## Como rodar

Requisitos: Node 20 ou mais novo (testado com Node 24).

```bash
npm install        # dependências (Vite, Vitest, sharp, fontes @fontsource)
npm run dev        # servidor de desenvolvimento em http://localhost:5173
npm test           # testes unitários (Vitest)
npm run build      # gera o site final em dist/
npm run preview    # serve dist/ em http://localhost:4173
npm run e2e        # verificação ponta a ponta no navegador (precisa de npm run build antes)
npm run images     # regenera as fotos otimizadas a partir de assets/originais/
```

O `dist/` funciona de dois jeitos: publicado em qualquer hospedagem estática (caminhos relativos) **ou**
aberto com duplo clique em `dist/index.html`, sem servidor (o JS é um script clássico, sem módulos,
e não há `fetch` em tempo de execução).

**Ao publicar:** a tag `og:image` aponta para `img/og-vitrine.jpg`, um caminho relativo. Redes sociais e
mensageiros só leem URL absoluta, então troque-a pelo endereço completo do site (ex.:
`https://seu-dominio/img/og-vitrine.jpg`) em `src/render/page.js` quando houver domínio.

`npm run e2e` usa o [agent-browser](https://www.npmjs.com/package/agent-browser) instalado globalmente
(`npm i -g agent-browser && agent-browser install`). O script sobe o `vite preview` na porta 4173 (ela
precisa estar livre), roda os cenários, grava as capturas em `test-results/` e imprime `PASS`/`FAIL`
por cenário.

## Escolhas visuais

- **"Vitrine noturna"**: fundo quase preto com tijolinho desenhado em CSS, fotos como janelas de luz
  quente e filetes dourados — a padaria à noite com a vitrine acesa.
- **Tipografia**: Cormorant Garamond nos títulos (o tom do selo da casa) e Manrope no texto, servidas
  pelo próprio site, sem chamadas externas.
- **Cada capítulo tem uma composição própria**: o hero nasce numa moldura em arco (eco da porta de
  Miguel Pereira) e se abre ao rolar; a fornada é uma colagem assimétrica; a confeitaria é uma
  prateleira horizontal; "De perto" usa recortes em arco; as casas têm cores próprias (preto/dourado
  em Arcozelo, pêssego/terracota em Miguel Pereira).
- **Movimento contido**: uma curva só, revelações de 600 ms, apenas `transform`/`opacity`/`clip-path`;
  com "reduzir movimento" ativado tudo aparece no estado final.

## Como trocar ou acrescentar fotos

1. Coloque o arquivo original em `assets/originais/<pasta>/`. A pasta define o crédito:
   `instagram/` → "Foto: Instagram @padariaagape25"; qualquer outra (ex.: `maps-arcozelo/`,
   `maps-miguel/`) → "Foto: cliente no Google Maps".
2. Em `scripts/images.config.mjs`, troque o `src` do item existente ou acrescente um novo:
   `item('nome-da-foto', 'instagram/arquivo.jpg')`. Opcionais: `crop` (frações de 0 a 1:
   `{ left, top, width, height }`) e `widths` (larguras geradas).
3. Rode `npm run images`: gera AVIF, WebP e JPEG em `public/img/` e atualiza `public/img/manifest.json`.
4. Em `src/content.js`, aponte o produto ou a casa para o novo `id` (`image: 'nome-da-foto'`) e
   escreva um `alt` fiel ao que aparece na foto e uma legenda curta (`caption`).
5. Rode `npm test` (confere que toda foto citada no conteúdo está configurada e foi gerada em todos
   os formatos) e `npm run build`.

Não use fotos com crianças nem fotos de visitantes identificáveis sem autorização.

## Pendências de conteúdo

Vêm de `pending` em `src/content.js` e dependem da padaria:

- **Horário completo por dia**: o Google Maps só confirma a sexta-feira (06:00–21:00), então o site não
  mostra horário — apenas "Confirme o horário do dia pelo WhatsApp antes de vir". Falta a padaria informar
  o horário de cada dia da semana, por loja.
- **Preços**: não exibidos (as etiquetas nas fotos de clientes são antigas).
- **WhatsApp e delivery**: falta confirmar qual loja atende o número e qual é a área de entrega; o site
  usa o texto genérico "Encomendas e delivery".
- **Autorização das fotos de clientes do Google Maps** (ver abaixo).
- **Torta Pudim ainda é novidade?** O post é de junho de 2026; o site deixou de usar a etiqueta
  "Novidade" até a padaria confirmar.

## Créditos e aviso sobre as fotos

- Fotos do Instagram oficial [@padariaagape25](https://www.instagram.com/padariaagape25/).
- Fotos de clientes publicadas no Google Maps (Arcozelo e Miguel Pereira).

Cada foto mostra o crédito da origem na galeria ampliada, e o rodapé lista as duas fontes.
**A autorização formal de uso das fotos de clientes do Google Maps ainda não foi obtida.** Antes de
publicar o site, a padaria deve conseguir essa autorização ou substituir essas fotos por fotos próprias
(o passo a passo acima).

## O que foi testado — e o que não foi

**Testado** (`npm run e2e`, Chromium headless controlado pelo agent-browser, com emulação de tela):

- Desktop 1440×900: os 6 capítulos rolando para baixo e para cima, capítulo atual correto na
  navegação, console sem erros; link do capítulo V leva a `#cap-5` com `aria-current`.
- Carrossel (botão "Próximo" e seta do teclado), galeria ampliada (abrir, setas, Esc, foco volta à
  foto e a rolagem não muda), abas das duas casas.
- Links: WhatsApp, "Como chegar" das duas lojas, nenhum link vazio; todas as imagens carregam.
- Emulação de celular 390×844 e 320×640: sem rolagem lateral, barra de capítulos visível e com o nome
  inteiro, botão do WhatsApp do hero não fica coberto.
- "Reduzir movimento" emulado: tudo visível sem rolar e o hero no estado final.
- Sem JS (arquivos `.js` bloqueados): capítulos, painéis das duas casas e fotos como links continuam
  acessíveis e legíveis.
- Abrindo `dist/index.html` direto do disco (`file://`): CSS, fotos e JS funcionam.
- Peso da primeira tela no celular (cache vazio): cerca de 125 KB (limite adotado: 500 KB). Medido no
  `vite preview`, que serve os arquivos **sem gzip/brotli**: é um teto; numa hospedagem com compressão o
  HTML, o CSS e o JS pesam menos (as fotos AVIF/WebP/JPEG quase não mudam).
- Testes unitários (Vitest) da renderização, do conteúdo, das imagens e dos módulos de interação.

**Não testado:**

- Aparelhos reais (celulares e tablets físicos) — só emulação de tamanho de tela no Chromium.
- Safari / iOS e Firefox.
- Conexão lenta real (o peso foi medido, mas não houve teste em rede 3G/4G de verdade).
- Leitores de tela reais (a estrutura acessível foi verificada no código e por atributos, não com
  NVDA/VoiceOver).
