// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { initReveal } from '../src/lib/reveal.js';
describe('reveal', () => {
  it('reduced motion mostra tudo', () => {
    document.body.innerHTML = '<p data-reveal></p><p data-reveal></p>';
    initReveal(document, { reducedMotion: true });
    expect(document.querySelectorAll('.is-visible').length).toBe(2);
  });
});
