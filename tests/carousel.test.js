// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initCarousel } from '../src/lib/carousel.js';
describe('initCarousel', () => {
  let track;
  beforeEach(() => {
    document.body.innerHTML = `<div data-carousel><ul data-carousel-track tabindex="0"><li>a</li><li>b</li></ul>
      <button data-carousel-prev></button><button data-carousel-next></button></div>`;
    track = document.querySelector('[data-carousel-track]');
    Object.defineProperty(track.firstElementChild, 'offsetWidth', { value: 200 });
    track.scrollBy = vi.fn();
    initCarousel(document, { reducedMotion: false });
  });
  it('next/prev', () => {
    document.querySelector('[data-carousel-next]').click();
    expect(track.scrollBy.mock.calls[0][0].left).toBeGreaterThan(0);
    const prev = document.querySelector('[data-carousel-prev]');
    prev.disabled = false;
    prev.click();
    expect(track.scrollBy.mock.calls[1][0].left).toBeLessThan(0);
  });
  it('seta no track', () => {
    track.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(track.scrollBy).toHaveBeenCalled();
  });
});

describe('initCarousel: estado dos botões', () => {
  it('recalcula no resize e quando uma imagem carrega; a limpeza remove os ouvintes', () => {
    document.body.innerHTML = `<div data-carousel><ul data-carousel-track tabindex="0"><li><img alt=""></li><li>b</li></ul>
      <button data-carousel-prev></button><button data-carousel-next></button></div>`;
    const track = document.querySelector('[data-carousel-track]');
    const next = document.querySelector('[data-carousel-next]');
    let sw = 200;
    Object.defineProperty(track, 'scrollWidth', { get: () => sw, configurable: true });
    Object.defineProperty(track, 'clientWidth', { get: () => 200, configurable: true });
    Object.defineProperty(track, 'scrollLeft', { value: 200, writable: true, configurable: true });
    const cleanup = initCarousel(document);
    expect(next.disabled).toBe(false); // sem estouro: nada a rolar, botão não trava
    sw = 600;
    track.scrollLeft = 400;
    window.dispatchEvent(new Event('resize'));
    expect(next.disabled).toBe(true);
    track.scrollLeft = 0;
    track.querySelector('img').dispatchEvent(new Event('load'));
    expect(next.disabled).toBe(false);
    cleanup();
    track.scrollLeft = 400;
    window.dispatchEvent(new Event('resize'));
    expect(next.disabled).toBe(false);
  });
});
