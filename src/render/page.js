// Gera o HTML estático da página a partir de src/content.js + manifest de imagens.
// Funções puras, executadas no build/dev (plugin em vite.config.js). Sem JS no cliente.
import { site, houses, chapters, products, alsoMade, credits } from '../content.js';
import { whatsappUrl, directionsUrl } from '../lib/links.js';
import { renderPicture, renderShot, esc } from './picture.js';
import { renderSelo } from './selo.js';

const TELEPHONE = '+55-24-98110-0190';
const TITLE = 'Padaria e Confeitaria Ágape · Arcozelo e Miguel Pereira';
const DESCRIPTION =
  'Padaria e confeitaria artesanal desde 2012, com lojas em Arcozelo (Paty do Alferes) e no centro de ' +
  'Miguel Pereira, RJ. Pães, doces e bolos sob encomenda pelo WhatsApp.';
const HERO_ALT = 'Vitrine iluminada de doces e bolos da Padaria Ágape em Arcozelo';
const BRIDGE_ID = 'cafe-neon';

const ext = (href) => `href="${esc(href)}" target="_blank" rel="noopener"`;
const chapter = (slug) => chapters.find((c) => c.slug === slug);
const byChapter = (slug) => products.filter((p) => p.chapter === slug);

function chapterHead(slug, intro) {
  const c = chapter(slug);
  return (
    `<header class="chapter__head" data-reveal>` +
    `<p class="chapter__eyebrow">Capítulo <span class="chapter__roman">${c.roman}</span></p>` +
    `<h2 id="cap-${c.n}-title" class="chapter__title">${esc(c.name)}</h2>` +
    `<p class="chapter__intro">${esc(intro)}</p>` +
    `</header>`
  );
}

function section(slug, inner, extra = {}) {
  const c = chapter(slug);
  const cls = ['chapter', `chapter--${slug}`, extra.className].filter(Boolean).join(' ');
  const attrs = extra.attrs ? ` ${extra.attrs}` : '';
  return (
    `<section id="cap-${c.n}" class="${cls}" data-chapter="${c.n}"${attrs} aria-labelledby="cap-${c.n}-title">` +
    inner +
    `</section>`
  );
}

// Figura de produto: foto ampliável + legenda curta (só o nome / legenda do conteúdo).
function productFigure(p, { className, sizes, reveal = true, caption = true }) {
  const tag = p.tag ? `<span class="tag">${esc(p.tag)}</span> ` : '';
  return (
    `<figure class="${esc(className)}"${reveal ? ' data-reveal' : ''}>` +
    renderShot(p.image, { alt: p.alt, caption: p.caption, sizes }) +
    (caption ? `<figcaption>${tag}${esc(p.caption)}</figcaption>` : '') +
    `</figure>`
  );
}

/* ---------- Cabeçalho e navegação ---------- */

function renderHeader() {
  return (
    `<header class="site-header">` +
    `<a class="site-header__brand" href="#cap-1">` +
    renderSelo({ className: 'selo--small', id: 'selo-topo', title: 'Padaria e Confeitaria Ágape — início' }) +
    `</a>` +
    `<a class="btn btn--whatsapp site-header__cta" ${ext(whatsappUrl('Olá, Ágape! Quero fazer uma encomenda.'))}>` +
    `Encomendar</a>` +
    `</header>`
  );
}

function renderNav() {
  const items = chapters
    .map(
      (c) =>
        `<li><a class="chapters__link" href="#cap-${c.n}" data-chapter-link="${c.n}">` +
        `<span class="chapters__num">${c.roman}</span><span class="chapters__name">${esc(c.name)}</span></a></li>`
    )
    .join('');
  return (
    `<nav class="chapters" aria-label="Capítulos">` +
    `<ol class="chapters__list">${items}</ol>` +
    `<span class="chapters__progress" data-progress aria-hidden="true"></span>` +
    `</nav>`
  );
}

/* ---------- Capítulos ---------- */

function renderVitrine() {
  const inner =
    `<div class="hero__frame" data-hero-frame>` +
    renderPicture('vitrine-arcozelo', {
      alt: HERO_ALT,
      sizes: '100vw',
      priority: true,
      mobileId: 'paes-estante',
      className: 'hero__picture',
    }) +
    `</div>` +
    `<div class="hero__content">` +
    renderSelo({ className: 'selo--hero', id: 'selo-hero', decorative: true }) +
    // Duas partes: no celular "desde 2012" desce para a 2ª linha sem o ponto, e o nome
    // "Miguel Pereira" nunca se parte (espaço inseparável).
    `<p class="hero__kicker"><span class="hero__places">Arcozelo · Miguel&nbsp;Pereira</span>` +
    `<span class="hero__sep"> · </span><span class="hero__since">desde&nbsp;${site.since}</span></p>` +
    `<h1 id="cap-1-title" class="hero__title">${esc(site.name)}</h1>` +
    `<p class="hero__tagline">${esc(site.tagline)}</p>` +
    `<div class="hero__actions">` +
    `<a class="btn btn--ghost" href="#cap-2">Explorar</a>` +
    `<a class="btn btn--primary" ${ext(whatsappUrl('Olá, Ágape! Quero fazer uma encomenda.'))}>Encomendar pelo WhatsApp</a>` +
    `</div>` +
    `</div>`;
  return section('vitrine', inner, { className: 'hero', attrs: 'data-hero' });
}

// Papéis na composição assimétrica da fornada; produtos novos caem em "extra".
const FORNADA_ROLES = {
  'paes-estante': { role: 'lead', sizes: '(min-width: 1024px) 46vw, 100vw' },
  sonhos: { role: 'offset-a', sizes: '(min-width: 1024px) 30vw, (min-width: 700px) 45vw, 100vw' },
  'tranca-coco': { role: 'offset-b', sizes: '(min-width: 1024px) 30vw, (min-width: 700px) 45vw, 100vw' },
  'pao-frances': { role: 'detail', sizes: '(min-width: 700px) 24vw, 70vw' },
};

function renderFornada() {
  const items = byChapter('fornada');
  const grid = items
    .map((p) => {
      const r = FORNADA_ROLES[p.id] || { role: 'extra', sizes: '(min-width: 700px) 45vw, 100vw' };
      return productFigure(p, { className: `fornada__item fornada__item--${r.role}`, sizes: r.sizes });
    })
    .join('');
  const also = alsoMade.map((name) => `<li>${esc(name)}</li>`).join('');
  const inner =
    chapterHead(
      'fornada',
      'Pão francês, sonho, trança recheada de coco e os pães da casa: delícias artesanais todos os dias, direto da fornada para o balcão.'
    ) +
    `<div class="fornada">${grid}</div>` +
    `<div class="also-made" data-reveal>` +
    `<h3 class="also-made__title">Também no balcão</h3>` +
    `<ul class="also-made__list">${also}</ul>` +
    `</div>`;
  return section('fornada', inner);
}

const ORDER_ID = 'bolo-festa';

function renderConfeitaria() {
  const items = byChapter('confeitaria');
  const order = items.find((p) => p.id === ORDER_ID);
  const cards = items
    .filter((p) => p !== order)
    .map((p, i) => {
      const m = i % 3 === 0 ? ' strip__item--tall' : '';
      return (
        `<li class="strip__item${m}">` +
        productFigure(p, { className: 'strip__figure', sizes: '(min-width: 1024px) 34vw, (min-width: 700px) 50vw, 80vw', reveal: false }) +
        `</li>`
      );
    })
    .join('');
  const orderBlock = order
    ? `<div class="encomenda" data-reveal>` +
      productFigure(order, { className: 'encomenda__figure', sizes: '(min-width: 700px) 40vw, 100vw', reveal: false, caption: false }) +
      `<div class="encomenda__text">` +
      `<p class="encomenda__tag">${esc(order.tag || 'Sob encomenda')}</p>` +
      `<h3 class="encomenda__title">${esc(order.name)}</h3>` +
      `<p class="encomenda__motto">Transformamos sonhos em bolo.</p>` +
      `<p>Aceitamos encomendas. Conte para a gente a ocasião e combine os detalhes pelo WhatsApp.</p>` +
      `<a class="btn btn--primary" ${ext(whatsappUrl('Olá, Ágape! Quero encomendar um bolo.'))}>Encomendar um bolo</a>` +
      `</div>` +
      `</div>`
    : '';
  const inner =
    chapterHead(
      'confeitaria',
      'Na vitrine de doces, a Torta Pudim divide espaço com rocambole, torta surpresa de morango com chocolate e bolos que pedem um café.'
    ) +
    `<div class="strip" data-carousel>` +
    `<ul class="strip__track" data-carousel-track tabindex="0" aria-label="Confeitaria">${cards}</ul>` +
    `<div class="strip__controls">` +
    `<button type="button" class="strip__btn strip__btn--prev" data-carousel-prev>Anterior</button>` +
    `<button type="button" class="strip__btn strip__btn--next" data-carousel-next>Próximo</button>` +
    `</div>` +
    `</div>` +
    orderBlock;
  return section('confeitaria', inner);
}

function renderPerto() {
  const tiles = byChapter('perto')
    .map(
      (p, i) =>
        `<li class="mosaic__item mosaic__item--${i + 1}" data-reveal>` +
        renderShot(p.image, { alt: p.alt, caption: p.caption, sizes: '(min-width: 700px) 33vw, 100vw' }) +
        `<span class="mosaic__label">${esc(p.caption)}</span>` +
        `</li>`
    )
    .join('');
  const inner =
    chapterHead(
      'perto',
      'Chegue mais perto, como quem encosta no vidro da vitrine. Toque em qualquer foto do site para vê-la ampliada.'
    ) +
    `<ul class="mosaic">${tiles}</ul>`;
  return section('perto', inner);
}

function housePanel(h) {
  const shots = h.images
    .filter((im) => im.id !== BRIDGE_ID)
    .map(
      (im, i) =>
        `<li class="house__shot house__shot--${i + 1}">` +
        renderShot(im.id, { alt: im.alt, caption: im.caption, sizes: '(min-width: 1024px) 30vw, (min-width: 700px) 45vw, 90vw' }) +
        `</li>`
    )
    .join('');
  return (
    `<div role="tabpanel" id="panel-${h.slug}" aria-labelledby="tab-${h.slug}" data-house="${h.slug}"` +
    ` class="house house--${h.slug} house--${esc(h.accent)}">` +
    `<div class="house__intro" data-reveal>` +
    `<p class="house__place">${esc(h.locality)}</p>` +
    `<h3 class="house__name">${esc(h.name)}</h3>` +
    `<p class="house__note">${esc(h.note)}</p>` +
    `</div>` +
    `<ul class="house__gallery">${shots}</ul>` +
    `</div>`
  );
}

function renderCasas() {
  const bridgeImage = houses.flatMap((h) => h.images).find((im) => im.id === BRIDGE_ID);
  const tabs = houses
    .map(
      (h, i) =>
        `<button type="button" role="tab" id="tab-${h.slug}" aria-controls="panel-${h.slug}" data-tab="${h.slug}"` +
        ` aria-selected="${i === 0}">${esc(h.shortName)}</button>`
    )
    .join('');
  const bridge = bridgeImage
    ? `<figure class="bridge" data-reveal>` +
      renderShot(BRIDGE_ID, { alt: bridgeImage.alt, caption: site.motto, sizes: '100vw', className: 'bridge__shot' }) +
      `<figcaption class="bridge__motto">${esc(site.motto)}</figcaption>` +
      `</figure>`
    : '';
  const [first, ...rest] = houses;
  const inner =
    chapterHead(
      'casas',
      'Duas lojas, a mesma Ágape: uma em Arcozelo, em Paty do Alferes, e outra no centro de Miguel Pereira.'
    ) +
    `<div class="houses" data-tabs>` +
    `<div role="tablist" aria-label="Escolha a casa" class="houses__tabs" hidden>${tabs}</div>` +
    housePanel(first) +
    bridge +
    rest.map(housePanel).join('') +
    `</div>`;
  return section('casas', inner);
}

function renderVisite() {
  const cards = houses
    .map(
      (h) =>
        `<article class="visit__card visit__card--${h.slug}" data-reveal>` +
        `<h3 class="visit__title">${esc(h.shortName)}</h3>` +
        `<p class="visit__name">${esc(h.name)}</p>` +
        `<address class="visit__address">${esc(h.address)}</address>` +
        `<p class="visit__hours">${esc(site.hoursNote)}</p>` +
        `<div class="visit__actions">` +
        `<a class="btn btn--primary" ${ext(directionsUrl(h))}>Como chegar</a>` +
        `<a class="btn btn--ghost" ${ext(whatsappUrl(`Olá, Ágape! Tenho uma dúvida sobre a loja de ${h.shortName}.`))}>WhatsApp</a>` +
        `</div>` +
        `</article>`
    )
    .join('');
  const inner =
    chapterHead('visite', 'Passe para um café em uma das casas ou faça sua encomenda pelo WhatsApp.') +
    `<div class="visit">${cards}</div>` +
    `<p class="visit__whatsapp" data-reveal>Encomendas e delivery: ` +
    `<a ${ext(whatsappUrl())}>WhatsApp ${esc(site.whatsappDisplay)}</a></p>`;
  return section('visite', inner);
}

function renderLightbox() {
  return (
    `<dialog class="lightbox" data-lightbox-dialog aria-label="Foto ampliada">` +
    `<figure class="lightbox__figure">` +
    `<img class="lightbox__img" data-lightbox-img alt="">` +
    `<figcaption class="lightbox__caption"><p data-lightbox-caption></p><small data-lightbox-credit></small></figcaption>` +
    `</figure>` +
    `<p class="lightbox__count" data-lightbox-count aria-live="polite"></p>` +
    `<button type="button" class="lightbox__btn lightbox__btn--prev" data-lightbox-prev>Foto anterior</button>` +
    `<button type="button" class="lightbox__btn lightbox__btn--next" data-lightbox-next>Próxima foto</button>` +
    `<button type="button" class="lightbox__btn lightbox__btn--close" data-lightbox-close>Fechar</button>` +
    `</dialog>`
  );
}

// Logo do Instagram (quadrado arredondado, círculo e ponto), na cor do texto.
const INSTAGRAM_ICON =
  '<svg class="icon-instagram" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false"' +
  ' fill="none" xmlns="http://www.w3.org/2000/svg">' +
  '<rect x="3" y="3" width="18" height="18" rx="5.2" stroke="currentColor" stroke-width="1.8"/>' +
  '<circle cx="12" cy="12" r="4.1" stroke="currentColor" stroke-width="1.8"/>' +
  '<circle cx="17.3" cy="6.7" r="1.15" fill="currentColor"/>' +
  '</svg>';
const INSTAGRAM_LABEL = 'Instagram da Padaria Ágape (@padariaagape25)';

function renderFooter() {
  const list = credits.map((c) => `<li>${esc(c)}</li>`).join('');
  return (
    `<footer class="site-footer">` +
    renderSelo({ className: 'selo--footer', id: 'selo-rodape', decorative: true }) +
    `<p class="site-footer__since">${esc(site.name)} · Desde ${site.since}</p>` +
    `<p class="site-footer__motto">${esc(site.motto)}</p>` +
    `<p class="site-footer__social"><a class="site-footer__instagram" ${ext(site.instagram)} aria-label="${esc(INSTAGRAM_LABEL)}">` +
    `${INSTAGRAM_ICON}</a></p>` +
    `<ul class="site-footer__credits">${list}</ul>` +
    `</footer>`
  );
}

/** Conteúdo de <body> (o script do cliente fica no index.html). */
export function renderPage() {
  return (
    `<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>` +
    renderHeader() +
    renderNav() +
    `<main id="conteudo" tabindex="-1">` +
    renderVitrine() +
    renderFornada() +
    renderConfeitaria() +
    renderPerto() +
    renderCasas() +
    renderVisite() +
    renderLightbox() +
    `</main>` +
    renderFooter()
  );
}

const streetOf = (h) => {
  const i = h.address.indexOf(`, ${h.locality}`);
  return i > 0 ? h.address.slice(0, i) : h.address;
};

function jsonLd() {
  const graph = houses.map((h) => ({
    '@type': 'Bakery',
    name: h.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: streetOf(h),
      addressLocality: h.locality,
      addressRegion: 'RJ',
      postalCode: h.postalCode,
      addressCountry: 'BR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: h.lat, longitude: h.lng },
    url: site.instagram,
    telephone: TELEPHONE,
  }));
  // < impede que "</script>" dentro de um texto feche a tag.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E" +
  "%3Ccircle cx='16' cy='16' r='15' fill='%230F0D0B' stroke='%23C9A45C' stroke-width='2'/%3E" +
  "%3Ctext x='16' y='22' text-anchor='middle' font-family='Georgia,serif' font-size='17' fill='%23C9A45C'%3E%C3%81%3C/text%3E%3C/svg%3E";

/** Conteúdo extra do <head>: título, descrição, Open Graph e JSON-LD. */
export function renderHead() {
  return [
    `<title>${esc(TITLE)}</title>`,
    `<meta name="description" content="${esc(DESCRIPTION)}">`,
    `<meta name="theme-color" content="#0F0D0B">`,
    `<link rel="icon" href="${FAVICON}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:locale" content="pt_BR">`,
    `<meta property="og:site_name" content="${esc(site.name)}">`,
    `<meta property="og:title" content="${esc(TITLE)}">`,
    `<meta property="og:description" content="${esc(DESCRIPTION)}">`,
    `<meta property="og:image" content="img/og-vitrine.jpg">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(HERO_ALT)}">`,
    `<script type="application/ld+json">${jsonLd()}</script>`,
  ].join('\n    ');
}
