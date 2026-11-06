// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { setCurrentChapter } from '../src/lib/chapters.js';
describe('chapters', () => {
  it('só o capítulo atual tem aria-current', () => {
    document.body.innerHTML = [1, 2, 3, 4].map((n) => `<a data-chapter-link="${n}" aria-current="${n === 1 ? 'true' : 'false'}"></a>`).join('');
    setCurrentChapter(document, 3);
    const cur = [...document.querySelectorAll('[aria-current="true"]')];
    expect(cur.length).toBe(1);
    expect(cur[0].dataset.chapterLink).toBe('3');
  });
});
