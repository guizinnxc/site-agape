// Gera <picture> responsivos a partir de public/img/manifest.json.
// Roda só no Node (build/dev): o cliente nunca busca o manifest.
import { readFileSync } from 'node:fs';
import { creditText } from '../content.js';

const MANIFEST_URL = new URL('../../public/img/manifest.json', import.meta.url);

// Lido a cada chamada para refletir `npm run images` sem reiniciar o dev server.
export function loadManifest() {
  return JSON.parse(readFileSync(MANIFEST_URL, 'utf8'));
}

export function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function getImage(id, manifest = loadManifest()) {
  const m = manifest[id];
  if (!m) throw new Error(`Imagem "${id}" não está em public/img/manifest.json`);
  return m;
}

const srcset = (id, widths, ext) => widths.map((w) => `img/${id}-${w}.${ext} ${w}w`).join(', ');

// Largura usada no src de fallback: a primeira ≥ 960, ou a maior disponível.
const middleWidth = (widths) => widths.find((w) => w >= 960) ?? widths.at(-1);

export const largestSrc = (id, m) => `img/${id}-${m.widths.at(-1)}.jpg`;

/**
 * @param {string} id
 * @param {{alt: string, sizes: string, className?: string, priority?: boolean, mobileId?: string, mobileMedia?: string}} opts
 */
export function renderPicture(id, { alt, sizes, className, priority = false, mobileId, mobileMedia = '(max-width: 699px)' }) {
  const manifest = loadManifest();
  const m = getImage(id, manifest);
  const sz = esc(sizes);
  const sources = [];

  if (mobileId) {
    const mm = getImage(mobileId, manifest);
    const media = esc(mobileMedia);
    const dims = `width="${mm.width}" height="${mm.height}"`;
    for (const [ext, type] of [['avif', 'image/avif'], ['webp', 'image/webp'], ['jpg', 'image/jpeg']]) {
      sources.push(
        `<source media="${media}" type="${type}" srcset="${srcset(mobileId, mm.widths, ext)}" sizes="${sz}" ${dims}>`
      );
    }
  }
  sources.push(`<source type="image/avif" srcset="${srcset(id, m.widths, 'avif')}" sizes="${sz}">`);
  sources.push(`<source type="image/webp" srcset="${srcset(id, m.widths, 'webp')}" sizes="${sz}">`);

  const loading = priority ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
  const img =
    `<img src="img/${id}-${middleWidth(m.widths)}.jpg" srcset="${srcset(id, m.widths, 'jpg')}" sizes="${sz}"` +
    ` width="${m.width}" height="${m.height}" alt="${esc(alt)}" ${loading}` +
    ` style="object-position:${esc(m.focal || '50% 50%')}">`;

  const cls = className ? ` class="${esc(className)}"` : '';
  return `<picture${cls}>${sources.join('')}${img}</picture>`;
}

/**
 * Foto ampliável: link para o JPEG maior envolvendo o <picture> (vira galeria com JS).
 * @param {string} id
 * @param {{alt: string, caption: string, sizes: string, className?: string, pictureClass?: string}} opts
 */
export function renderShot(id, { alt, caption, sizes, className, pictureClass }) {
  const m = getImage(id);
  const credit = creditText[m.credit];
  if (!credit) throw new Error(`Crédito desconhecido para "${id}": ${m.credit}`);
  const cls = className ? `shot ${className}` : 'shot';
  return (
    `<a class="${esc(cls)}" href="${largestSrc(id, m)}" data-lightbox="${esc(id)}"` +
    ` data-srcset="${srcset(id, m.widths, 'jpg')}"` +
    ` data-caption="${esc(caption)}" data-credit="${esc(credit)}">` +
    renderPicture(id, { alt, sizes, className: pictureClass }) +
    `</a>`
  );
}
