// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest';
import { initReveal } from '../src/lib/reveal.js';

const realIO = globalThis.IntersectionObserver;
afterEach(() => {
  globalThis.IntersectionObserver = realIO;
});

describe('reveal', () => {
  it('reduced motion mostra tudo', () => {
    document.body.innerHTML = '<p data-reveal></p><p data-reveal></p>';
    initReveal(document, { reducedMotion: true });
    expect(document.querySelectorAll('.is-visible').length).toBe(2);
  });

  it('reduced motion mostra as fotos (a.shot) na hora', () => {
    document.body.innerHTML = '<a class="shot" href="img/a.jpg"><picture></picture></a><a class="shot" href="img/b.jpg"></a>';
    initReveal(document, { reducedMotion: true });
    expect(document.querySelectorAll('a.shot.is-visible').length).toBe(2);
  });

  it('fotos entram uma vez, quando cruzam a tela', () => {
    let cb;
    const observed = [];
    const unobserved = [];
    globalThis.IntersectionObserver = class {
      constructor(fn) {
        cb = fn;
      }
      observe(el) {
        observed.push(el);
      }
      unobserve(el) {
        unobserved.push(el);
      }
      disconnect() {}
    };
    document.body.innerHTML = '<a class="shot" href="img/a.jpg"></a><figure data-reveal></figure>';
    initReveal(document);
    const shot = document.querySelector('a.shot');
    expect(observed).toContain(shot);
    expect(shot.classList.contains('is-visible')).toBe(false);
    cb([{ target: shot, isIntersecting: true }]);
    expect(shot.classList.contains('is-visible')).toBe(true);
    expect(unobserved).toContain(shot);
  });
});
