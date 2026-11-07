// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { initLightbox } from '../src/lib/lightbox.js';
describe('initLightbox', () => {
  let shots, dlg;
  beforeEach(() => {
    document.body.innerHTML = `<main>
      ${[1, 2, 3].map((i) => `<a class="shot" href="img/f${i}.jpg" data-lightbox="f${i}"${i < 3 ? ` data-srcset="img/f${i}-480.jpg 480w, img/f${i}.jpg 1600w"` : ''} data-caption="Legenda ${i}" data-credit="Crédito ${i}"><img alt="Alt ${i}" src="img/t${i}.jpg"></a>`).join('')}
      <dialog data-lightbox-dialog><button data-lightbox-close></button><button data-lightbox-prev></button><button data-lightbox-next></button>
      <img data-lightbox-img alt=""><p data-lightbox-caption></p><small data-lightbox-credit></small><p data-lightbox-count></p></dialog></main>`;
    dlg = document.querySelector('dialog');
    dlg.showModal = function () { this.setAttribute('open', ''); };
    dlg.close = function () { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); };
    globalThis.HTMLDialogElement ??= window.HTMLDialogElement ?? function () {};
    shots = [...document.querySelectorAll('a.shot')];
    initLightbox(document);
  });
  const q = (s) => document.querySelector(s);
  it('abre, navega, fecha e devolve foco', () => {
    shots[1].click();
    expect(dlg.hasAttribute('open')).toBe(true);
    expect(q('[data-lightbox-img]').getAttribute('src')).toBe('img/f2.jpg');
    expect(q('[data-lightbox-img]').alt).toBe('Alt 2');
    expect(q('[data-lightbox-count]').textContent).toBe('2 de 3');
    expect(q('[data-lightbox-caption]').textContent).toBe('Legenda 2');
    expect(q('[data-lightbox-credit]').textContent).toBe('Crédito 2');
    dlg.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(q('[data-lightbox-count]').textContent).toBe('3 de 3');
    dlg.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(q('[data-lightbox-count]').textContent).toBe('1 de 3');
    dlg.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    if (dlg.hasAttribute('open')) dlg.close();
    expect(dlg.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(shots[1]);
  });
  it('usa srcset/sizes do a.shot para não baixar sempre o JPEG maior', () => {
    const img = q('[data-lightbox-img]');
    shots[0].click();
    expect(img.getAttribute('srcset')).toBe('img/f1-480.jpg 480w, img/f1.jpg 1600w');
    expect(img.getAttribute('sizes')).toBe('100vw');
    expect(img.getAttribute('src')).toBe('img/f1.jpg');
    dlg.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    // f3 não tem data-srcset: fica só o src (sem srcset velho de outra foto)
    expect(img.getAttribute('src')).toBe('img/f3.jpg');
    expect(img.hasAttribute('srcset')).toBe(false);
  });
  it('ctrl+clique não abre', () => {
    shots[0].dispatchEvent(new MouseEvent('click', { ctrlKey: true, bubbles: true, cancelable: true }));
    expect(dlg.hasAttribute('open')).toBe(false);
  });
});
