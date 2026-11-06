// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { setCurrentChapter, initChapters } from '../src/lib/chapters.js';

const current = () => document.querySelector('[aria-current="true"]')?.dataset.chapterLink;

describe('chapters', () => {
  it('só o capítulo atual tem aria-current', () => {
    document.body.innerHTML = [1, 2, 3, 4].map((n) => `<a data-chapter-link="${n}" aria-current="${n === 1 ? 'true' : 'false'}"></a>`).join('');
    setCurrentChapter(document, 3);
    const cur = [...document.querySelectorAll('[aria-current="true"]')];
    expect(cur.length).toBe(1);
    expect(cur[0].dataset.chapterLink).toBe('3');
  });

  it('capítulo atual = seção que cruza a linha do meio da tela', () => {
    document.body.innerHTML =
      [1, 2, 3].map((n) => `<a data-chapter-link="${n}"></a>`).join('') +
      [1, 2, 3].map((n) => `<section data-chapter="${n}"></section>`).join('');
    const [s1, s2, s3] = document.querySelectorAll('section');
    let cb;
    let opts;
    const observed = [];
    initChapters(document, {
      observerFactory: (fn, o) => {
        cb = fn;
        opts = o;
        return { observe: (el) => observed.push(el), disconnect() {} };
      },
    });
    expect(observed).toEqual([s1, s2, s3]);
    // Faixa fina no meio da viewport: só uma seção a cruza por vez, seja ela curta ou longa.
    expect(opts.rootMargin).toBe('-50% 0px -49.9% 0px');
    expect(opts.threshold).toBe(0);

    cb([{ target: s1, isIntersecting: true }]);
    expect(current()).toBe('1');
    cb([
      { target: s1, isIntersecting: false },
      { target: s2, isIntersecting: true },
    ]);
    expect(current()).toBe('2');
    // Saída sem nova entrada (ex.: rodapé no meio da tela) mantém o último capítulo.
    cb([{ target: s2, isIntersecting: false }]);
    expect(current()).toBe('2');
    cb([{ target: s3, isIntersecting: true }]);
    expect(current()).toBe('3');
    expect(document.querySelectorAll('[aria-current="true"]').length).toBe(1);
  });
});
