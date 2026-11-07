import { describe, it, expect } from 'vitest';
import { IMAGES } from '../scripts/images.config.mjs';
import { whatsappUrl, directionsUrl } from '../src/lib/links.js';
import { site, houses, chapters, products, alsoMade, credits, creditText, pending } from '../src/content.js';

const ids = new Set(IMAGES.map((i) => i.id));

describe('links', () => {
  it('whatsappUrl sem mensagem', () => {
    expect(whatsappUrl()).toBe('https://wa.me/5524981100190');
  });
  it('whatsappUrl com mensagem codificada', () => {
    expect(whatsappUrl('Olá, Ágape!')).toBe('https://wa.me/5524981100190?text=Ol%C3%A1%2C%20%C3%81gape!');
  });
  it('directionsUrl', () => {
    expect(directionsUrl(houses[0])).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=-22.4071627,-43.4226476'
    );
  });
});

describe('conteúdo', () => {
  it('imagens existem em IMAGES', () => {
    for (const p of products) expect(ids.has(p.image), p.id).toBe(true);
    for (const h of houses) for (const im of h.images) expect(ids.has(im.id), im.id).toBe(true);
  });
  it('alt com pelo menos 15 caracteres e legendas curtas', () => {
    for (const p of products) {
      expect(p.alt.length, p.id).toBeGreaterThanOrEqual(15);
      expect(p.caption.length, p.id).toBeLessThanOrEqual(70);
    }
    for (const h of houses) for (const im of h.images) expect(im.alt.length, im.id).toBeGreaterThanOrEqual(15);
  });
  it('sem preço nem horário', () => {
    const s = JSON.stringify({ site, houses, products, alsoMade });
    expect(s).not.toMatch(/R\$\s?\d/);
    expect(s).not.toMatch(/\b\d{1,2}h\s?(às|-|–)\s?\d{1,2}h\b/);
  });
  it('aviso de horário não generaliza a abertura (só sexta confirmada no Maps)', () => {
    expect(site.hoursNote).toBe('Confirme o horário do dia pelo WhatsApp antes de vir');
    expect(JSON.stringify({ site, houses, products })).not.toMatch(/Abre às|\b\d{1,2}h\b/);
  });
  it('Torta Pudim sem a etiqueta "Novidade" (post de junho/2026 pode estar velho)', () => {
    const s = JSON.stringify(products);
    expect(s.toLowerCase()).not.toContain('novidade');
    expect(pending.some((t) => /Torta Pudim/.test(t) && /novidade/i.test(t))).toBe(true);
  });
  it('fotos das casas com legenda curta própria', () => {
    for (const h of houses)
      for (const im of h.images) {
        expect(typeof im.caption, im.id).toBe('string');
        expect(im.caption.length, im.id).toBeGreaterThan(2);
        expect(im.caption.length, im.id).toBeLessThanOrEqual(40);
      }
  });
  it('sem a seção dos padeiros (pedido da padaria)', () => {
    expect(products.some((p) => p.id === 'padeiros' || p.image === 'padeiros')).toBe(false);
    expect(ids.has('padeiros')).toBe(false);
  });
  it('De perto: 3 texturas próprias, recortadas, sem repetir fotos de outros capítulos ou das casas', () => {
    const perto = products.filter((p) => p.chapter === 'perto');
    expect(perto.map((p) => p.image)).toEqual(['sonho-acucar', 'bolo-farofa', 'pao-na-chapa']);
    const others = new Set([
      ...products.filter((p) => p.chapter !== 'perto').map((p) => p.image),
      ...houses.flatMap((h) => h.images.map((im) => im.id)),
    ]);
    for (const p of perto) {
      expect(others.has(p.image), p.image).toBe(false);
      const cfg = IMAGES.find((i) => i.id === p.image);
      expect(cfg.crop, p.image).toBeDefined();
    }
  });
  it('cada foto aparece uma vez só entre produtos e casas', () => {
    const all = [...products.map((p) => p.image), ...houses.flatMap((h) => h.images.map((im) => im.id))];
    expect(new Set(all).size).toBe(all.length);
  });
  it('capítulos e endereços', () => {
    expect(chapters.length).toBe(6);
    expect(houses[0].address).toBe('R. Dr. Mario Kroeff, 95 – Arcozelo, Paty do Alferes – RJ, 26950-000');
    expect(houses[1].address).toBe('R. Francisco Alves, 57 – Lj 3 – Centro, Miguel Pereira – RJ, 26900-000');
  });
  it('demais exports', () => {
    expect(products.length).toBe(15);
    expect(alsoMade.length).toBe(5);
    expect(credits.length).toBe(2);
    expect(pending.length).toBe(5);
    expect(creditText.instagram).toBe('Foto: Instagram @padariaagape25');
    expect(creditText.maps).toBe('Foto: cliente no Google Maps');
  });
});
