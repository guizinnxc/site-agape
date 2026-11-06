// Selo da Ágape recriado em SVG (círculo duplo, arco, nome, ano e espigas).
// Cor via currentColor: o CSS define a cor dourada em .selo.
import { esc } from './picture.js';

let counter = 0;

// Uma espiga: haste curva e grãos em folha. A segunda é espelhada no eixo x=100.
const EAR =
  '<path d="M97 179C86 175 77 167 71 156" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
  '<path d="M75 164c-7 0-11-4-12-9 6 0 10 3 12 9zM81 171c-7 1-11-2-13-7 6-1 10 2 13 7z' +
  'M89 176c-6 2-11 0-13-5 6-1 10 1 13 5zM74 160c-2-6 0-11 4-13 2 6 0 10-4 13z' +
  'M80 168c-1-6 2-11 6-12 1 6-1 10-6 12zM88 174c0-6 3-10 8-11 0 6-3 10-8 11z"/>';

/**
 * @param {{className?: string, title?: string, id?: string}} [opts]
 */
export function renderSelo({ className = '', title = 'Padaria e Confeitaria Ágape, desde 2012', id } = {}) {
  const uid = id || `selo-${++counter}`;
  const cls = ['selo', className].filter(Boolean).join(' ');
  return (
    `<svg class="${esc(cls)}" viewBox="0 0 200 200" role="img" aria-labelledby="${uid}-t"` +
    ` xmlns="http://www.w3.org/2000/svg" fill="currentColor">` +
    `<title id="${uid}-t">${esc(title)}</title>` +
    `<defs><path id="${uid}-arc" d="M27 100a73 73 0 0 1 146 0"/></defs>` +
    `<circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" stroke-width="2.5"/>` +
    `<circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="1"/>` +
    `<text class="selo__arc" font-family="Manrope, Arial, sans-serif" font-size="11.5" font-weight="600" letter-spacing="1.6">` +
    `<textPath href="#${uid}-arc" startOffset="50%" text-anchor="middle">PADARIA E CONFEITARIA</textPath></text>` +
    `<text class="selo__name" x="100" y="120" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif"` +
    ` font-size="44" font-weight="600" font-style="italic">Ágape</text>` +
    `<text class="selo__since" x="100" y="141" text-anchor="middle" font-family="Manrope, Arial, sans-serif"` +
    ` font-size="9.5" font-weight="600" letter-spacing="2.4">Desde 2012</text>` +
    `<g class="selo__ears">${EAR}<g transform="matrix(-1 0 0 1 200 0)">${EAR}</g></g>` +
    `</svg>`
  );
}
