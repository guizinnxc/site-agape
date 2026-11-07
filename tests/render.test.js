import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { renderPage, renderHead } from '../src/render/page.js';
import { renderPicture } from '../src/render/picture.js';
import { renderSelo } from '../src/render/selo.js';
import { houses, chapters, site } from '../src/content.js';

const manifest = JSON.parse(readFileSync('public/img/manifest.json', 'utf8'));
const CREDITS = ['Foto: Instagram @padariaagape25', 'Foto: cliente no Google Maps'];

let window;
let document;

beforeAll(() => {
  window = new Window({
    settings: { disableJavaScriptEvaluation: true, disableJavaScriptFileLoading: true, disableCSSFileLoading: true },
  });
  document = window.document;
  document.body.innerHTML = renderPage();
});

afterAll(async () => {
  await window.happyDOM.close();
});

const all = (sel) => [...document.querySelectorAll(sel)];

describe('renderPage — estrutura', () => {
  it('tem 6 capítulos cap-1..cap-6 com aria-labelledby válido', () => {
    const sections = all('section.chapter');
    expect(sections.map((s) => s.id)).toEqual(['cap-1', 'cap-2', 'cap-3', 'cap-4', 'cap-5', 'cap-6']);
    sections.forEach((s, i) => {
      const n = i + 1;
      expect(s.getAttribute('data-chapter')).toBe(String(n));
      expect(s.classList.contains(`chapter--${chapters[i].slug}`)).toBe(true);
      expect(s.getAttribute('aria-labelledby')).toBe(`cap-${n}-title`);
      const title = document.getElementById(`cap-${n}-title`);
      expect(title, `cap-${n}-title`).not.toBeNull();
      expect(title.tagName).toBe(n === 1 ? 'H1' : 'H2');
      expect(title.textContent.trim().length).toBeGreaterThan(0);
    });
  });

  it('tem exatamente 1 h1', () => {
    expect(all('h1').length).toBe(1);
  });

  it('skip link, main#conteudo e hero conforme o contrato', () => {
    expect(document.querySelector('a.skip-link[href="#conteudo"]')).not.toBeNull();
    expect(document.querySelector('main#conteudo')).not.toBeNull();
    const hero = document.querySelector('section.hero[data-hero]');
    expect(hero?.id).toBe('cap-1');
    expect(hero.querySelector('.hero__frame[data-hero-frame] picture')).not.toBeNull();
    expect(hero.querySelector('.hero__content')).not.toBeNull();
  });

  it('nav de capítulos com 6 links e barra de progresso', () => {
    const nav = document.querySelector('nav.chapters[aria-label="Capítulos"]');
    expect(nav).not.toBeNull();
    const links = all('[data-chapter-link]');
    expect(links.length).toBe(6);
    links.forEach((a, i) => {
      expect(a.classList.contains('chapters__link')).toBe(true);
      expect(a.getAttribute('href')).toBe(`#cap-${i + 1}`);
      expect(a.querySelector('.chapters__num').textContent).toBe(chapters[i].roman);
      expect(a.querySelector('.chapters__name').textContent).toBe(chapters[i].name);
    });
    expect(nav.querySelector('ol')).not.toBeNull();
    expect(nav.querySelector('.chapters__progress[data-progress][aria-hidden="true"]')).not.toBeNull();
  });

  it('hero: botões Explorar e WhatsApp', () => {
    const hero = document.getElementById('cap-1');
    const explorar = [...hero.querySelectorAll('a')].find((a) => a.textContent.trim() === 'Explorar');
    expect(explorar?.getAttribute('href')).toBe('#cap-2');
    const wa = [...hero.querySelectorAll('a')].find((a) => a.textContent.trim() === 'Encomendar pelo WhatsApp');
    expect(wa?.getAttribute('href')).toBe(
      'https://wa.me/5524981100190?text=' + encodeURIComponent('Olá, Ágape! Quero fazer uma encomenda.')
    );
    expect(wa.getAttribute('target')).toBe('_blank');
    expect(wa.getAttribute('rel')).toBe('noopener');
  });
});

describe('renderPage — imagens', () => {
  it('a primeira img é prioritária e não tem loading', () => {
    const first = document.querySelector('img');
    expect(first.getAttribute('fetchpriority')).toBe('high');
    expect(first.hasAttribute('loading')).toBe(false);
  });

  it('as demais img (fora do dialog) são lazy, com width, height e alt', () => {
    const imgs = all('img').slice(1).filter((img) => !img.closest('dialog'));
    expect(imgs.length).toBeGreaterThan(10);
    for (const img of imgs) {
      const src = img.getAttribute('src');
      expect(img.getAttribute('loading'), src).toBe('lazy');
      expect(Number(img.getAttribute('width')), src).toBeGreaterThan(0);
      expect(Number(img.getAttribute('height')), src).toBeGreaterThan(0);
      expect((img.getAttribute('alt') || '').trim().length, src).toBeGreaterThan(0);
    }
  });

  it('todo a.shot aponta para um JPEG existente e tem legenda e crédito', () => {
    const shots = all('a.shot');
    expect(shots.length).toBeGreaterThan(10);
    for (const a of shots) {
      const href = a.getAttribute('href');
      expect(href).toMatch(/^img\/.+\.jpg$/);
      expect(existsSync(`public/${href}`), href).toBe(true);
      expect((a.getAttribute('data-caption') || '').trim().length, href).toBeGreaterThan(0);
      expect(CREDITS).toContain(a.getAttribute('data-credit'));
      const id = a.getAttribute('data-lightbox');
      expect(manifest[id], href).toBeDefined();
      expect(a.getAttribute('data-credit')).toBe(
        manifest[id].credit === 'instagram' ? CREDITS[0] : CREDITS[1]
      );
      expect(href).toBe(`img/${id}-${manifest[id].widths.at(-1)}.jpg`);
    }
  });

  it('nenhum src/srcset/href interno começa com /', () => {
    for (const el of all('[src], [srcset], [href]')) {
      for (const attr of ['src', 'href']) {
        const v = el.getAttribute(attr);
        if (v != null) expect(v.startsWith('/'), `${attr}=${v}`).toBe(false);
      }
      const srcset = el.getAttribute('srcset');
      if (srcset != null) {
        for (const part of srcset.split(',')) expect(part.trim().startsWith('/'), srcset).toBe(false);
      }
    }
  });
});

describe('renderPage — componentes', () => {
  it('abas das casas: tablist oculta, painéis visíveis', () => {
    const tabs = document.querySelector('div.houses[data-tabs]');
    expect(tabs).not.toBeNull();
    const tablist = tabs.querySelector('[role=tablist]');
    expect(tablist.hasAttribute('hidden')).toBe(true);
    const panels = all('[role=tabpanel]');
    expect(panels.length).toBe(2);
    for (const p of panels) expect(p.hasAttribute('hidden')).toBe(false);
    for (const slug of ['arcozelo', 'miguel-pereira']) {
      const tab = document.getElementById(`tab-${slug}`);
      expect(tab.getAttribute('role')).toBe('tab');
      expect(tab.getAttribute('aria-controls')).toBe(`panel-${slug}`);
      expect(tab.getAttribute('data-tab')).toBe(slug);
      const panel = document.getElementById(`panel-${slug}`);
      expect(panel.getAttribute('aria-labelledby')).toBe(`tab-${slug}`);
      expect(panel.getAttribute('data-house')).toBe(slug);
    }
  });

  it('carrossel da confeitaria conforme o contrato', () => {
    const strip = document.querySelector('#cap-3 div.strip[data-carousel]');
    expect(strip).not.toBeNull();
    const track = strip.querySelector('ul.strip__track[data-carousel-track]');
    expect(track.getAttribute('tabindex')).toBe('0');
    expect(track.getAttribute('aria-label')).toBe('Confeitaria');
    expect(strip.querySelector('button[data-carousel-prev]').textContent.trim()).toBe('Anterior');
    expect(strip.querySelector('button[data-carousel-next]').textContent.trim()).toBe('Próximo');
    expect(track.querySelectorAll('a.shot').length).toBeGreaterThanOrEqual(4);
  });

  it('fornada: ordem do DOM = ordem visual (destaque primeiro)', () => {
    const ids = all('#cap-2 .fornada a.shot').map((a) => a.getAttribute('data-lightbox'));
    expect(ids).toEqual(['paes-estante', 'sonhos', 'tranca-coco', 'pao-frances']);
  });

  it('legendas das fotos das casas são os nomes curtos do conteúdo', () => {
    for (const h of houses)
      for (const im of h.images) {
        const a = document.querySelector(`a.shot[data-lightbox="${im.id}"]`);
        if (im.id === 'cafe-neon') continue; // ponte: legenda é o lema
        expect(a.getAttribute('data-caption'), im.id).toBe(im.caption);
      }
  });

  it('eyebrow dos capítulos: "Capítulo II"', () => {
    const eb = document.querySelector('#cap-2 .chapter__eyebrow');
    expect(eb.textContent.trim()).toBe('Capítulo II');
    expect(eb.querySelector('.chapter__roman').textContent).toBe('II');
  });

  it('selo anunciado uma vez só: hero e rodapé ficam aria-hidden', () => {
    for (const sel of ['.hero__content svg.selo', 'footer svg.selo']) {
      const svg = document.querySelector(sel);
      expect(svg.getAttribute('aria-hidden'), sel).toBe('true');
      expect(svg.hasAttribute('role'), sel).toBe(false);
      expect(svg.querySelector('title'), sel).toBeNull();
    }
    const top = document.querySelector('.site-header svg.selo');
    expect(top.getAttribute('role')).toBe('img');
    expect(top.querySelector('title').textContent.length).toBeGreaterThan(5);
  });

  it('a.shot leva o srcset do JPEG para a galeria ampliada', () => {
    for (const a of all('a.shot')) {
      const m = manifest[a.getAttribute('data-lightbox')];
      const srcset = a.getAttribute('data-srcset');
      expect(srcset).toBe(m.widths.map((w) => `img/${a.getAttribute('data-lightbox')}-${w}.jpg ${w}w`).join(', '));
    }
  });

  it('De perto: mosaico com 3 fotos ampliáveis', () => {
    expect(all('#cap-4 a.shot').length).toBe(3);
  });

  it('lightbox único no fim do main', () => {
    const dialogs = all('dialog');
    expect(dialogs.length).toBe(1);
    const d = dialogs[0];
    expect(d.classList.contains('lightbox')).toBe(true);
    expect(d.hasAttribute('data-lightbox-dialog')).toBe(true);
    expect(d.getAttribute('aria-label')).toBe('Foto ampliada');
    expect(d.parentElement.tagName).toBe('MAIN');
    expect(d.parentElement.lastElementChild).toBe(d);
    expect(d.querySelector('button[data-lightbox-close]').textContent.trim()).toBe('Fechar');
    expect(d.querySelector('button[data-lightbox-prev]').textContent.trim()).toBe('Foto anterior');
    expect(d.querySelector('button[data-lightbox-next]').textContent.trim()).toBe('Próxima foto');
    expect(d.querySelector('img[data-lightbox-img]').getAttribute('alt')).toBe('');
    expect(d.querySelector('p[data-lightbox-caption]')).not.toBeNull();
    expect(d.querySelector('small[data-lightbox-credit]')).not.toBeNull();
    expect(d.querySelector('p[data-lightbox-count][aria-live="polite"]')).not.toBeNull();
  });

  it('links de WhatsApp e de rotas', () => {
    const wa = all('a[href^="https://wa.me/5524981100190"]');
    expect(wa.length).toBeGreaterThanOrEqual(3);
    const dir = all('a[href^="https://www.google.com/maps/dir/?api=1&destination="]');
    expect(dir.length).toBe(2);
    expect(dir.map((a) => a.getAttribute('href'))).toEqual(
      houses.map((h) => `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`)
    );
    for (const a of [...wa, ...dir]) {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toBe('noopener');
    }
  });

  it('visite: endereços e aviso de horário', () => {
    const visite = document.getElementById('cap-6').textContent;
    for (const h of houses) expect(visite).toContain(h.address);
    expect(visite).toContain(site.hoursNote);
  });

  it('elementos com data-reveal existem', () => {
    expect(all('[data-reveal]').length).toBeGreaterThanOrEqual(6);
  });

  it('sem preço, sem horário inventado e sem links vazios', () => {
    const text = document.body.textContent;
    expect(text).not.toMatch(/R\$/);
    expect(text.split(site.hoursNote).join('')).not.toMatch(/\b\d{1,2}\s?h\b|\d{1,2}:\d{2}/);
    expect(all('a[href="#"]').length).toBe(0);
  });

  it('rodapé com selo, Instagram, créditos e Desde 2012', () => {
    const footer = document.querySelector('footer');
    expect(footer.querySelector('svg.selo[aria-hidden="true"]')).not.toBeNull();
    expect(footer.querySelector(`a[href="${site.instagram}"]`)).not.toBeNull();
    expect(footer.textContent).toContain('Desde 2012');
    expect(footer.textContent).toContain('Instagram @padariaagape25');
    expect(footer.textContent).toContain('Google Maps');
  });

  it('ids únicos no documento', () => {
    const ids = all('[id]').map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('renderHead', () => {
  const head = renderHead();

  it('title, description e Open Graph', () => {
    expect(head).toContain('<title>Padaria e Confeitaria Ágape · Arcozelo e Miguel Pereira</title>');
    expect(head).toMatch(/<meta name="description" content="[^"]{50,}"/);
    expect(head).toContain('<meta property="og:image" content="img/og-vitrine.jpg"');
    expect(existsSync('public/img/og-vitrine.jpg')).toBe(true);
  });

  it('JSON-LD com duas Bakery, endereços e sem horário/preço', () => {
    expect(head).toContain('R. Dr. Mario Kroeff, 95');
    expect(head).toContain('R. Francisco Alves, 57');
    expect(head).not.toContain('openingHours');
    expect(head).not.toContain('priceRange');
    const json = head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
    const data = JSON.parse(json);
    const bakeries = data['@graph'];
    expect(bakeries.length).toBe(2);
    bakeries.forEach((b, i) => {
      expect(b['@type']).toBe('Bakery');
      expect(b.telephone).toBe('+55-24-98110-0190');
      expect(b.url).toBe(site.instagram);
      expect(b.address['@type']).toBe('PostalAddress');
      expect(b.address.postalCode).toBe(houses[i].postalCode);
      expect(b.address.addressLocality).toBe(houses[i].locality);
      expect(b.geo).toEqual({ '@type': 'GeoCoordinates', latitude: houses[i].lat, longitude: houses[i].lng });
    });
  });
});

describe('renderPicture', () => {
  it('lança erro para id fora do manifest', () => {
    expect(() => renderPicture('nao-existe', { alt: 'x', sizes: '100vw' })).toThrow();
  });

  it('gera AVIF, WebP e JPEG com larguras do manifest', () => {
    const m = manifest['vitrine-arcozelo'];
    const html = renderPicture('vitrine-arcozelo', { alt: 'Vitrine', sizes: '50vw' });
    expect(html).toMatch(/^<picture[\s>]/);
    expect(html).toContain('type="image/avif"');
    expect(html).toContain('type="image/webp"');
    for (const w of m.widths) {
      expect(html).toContain(`img/vitrine-arcozelo-${w}.avif ${w}w`);
      expect(html).toContain(`img/vitrine-arcozelo-${w}.jpg ${w}w`);
    }
    expect(html).toContain('src="img/vitrine-arcozelo-1200.jpg"');
    expect(html).toContain(`width="${m.width}" height="${m.height}"`);
    expect(html).toContain('style="object-position:50% 50%"');
    expect(html).toContain('loading="lazy" decoding="async"');
    expect(html).not.toContain('fetchpriority');
  });

  it('usa a maior largura quando não há uma ≥ 960', () => {
    const html = renderPicture('fachada-miguel', { alt: 'Fachada', sizes: '50vw' });
    expect(html).toContain('src="img/fachada-miguel-738.jpg"');
  });

  it('priority e fonte para celular', () => {
    const html = renderPicture('vitrine-arcozelo', {
      alt: 'Vitrine',
      sizes: '100vw',
      priority: true,
      mobileId: 'paes-estante',
    });
    expect(html).toContain('fetchpriority="high"');
    expect(html).not.toContain('loading=');
    const firstSource = html.match(/<source[^>]*>/)[0];
    expect(firstSource).toContain('media="(max-width: 699px)"');
    expect(firstSource).toContain('img/paes-estante-480.avif 480w');
    expect(html).toContain('type="image/jpeg"');
    // fontes de celular vêm antes das fontes padrão
    expect(html.indexOf('paes-estante')).toBeLessThan(html.indexOf('vitrine-arcozelo-640.avif'));
  });

  it('escapa o alt', () => {
    const html = renderPicture('sonhos', { alt: 'a "b" <c> & d', sizes: '1px' });
    expect(html).toContain('alt="a &quot;b&quot; &lt;c&gt; &amp; d"');
  });
});

describe('renderSelo', () => {
  it('SVG acessível, leve e com os textos do selo', () => {
    const svg = renderSelo({ className: 'selo--x', title: 'Selo Ágape' });
    expect(svg).toMatch(/^<svg[^>]*role="img"/);
    expect(svg).toMatch(/<title[^>]*>Selo Ágape<\/title>/);
    expect(svg).toContain('selo--x');
    expect(svg).toContain('textPath');
    expect(svg).toContain('PADARIA E CONFEITARIA');
    expect(svg).toContain('Ágape');
    expect(svg).toContain('Desde 2012');
    expect(svg).toContain('currentColor');
    expect(Buffer.byteLength(svg, 'utf8')).toBeLessThan(3072);
  });
});
