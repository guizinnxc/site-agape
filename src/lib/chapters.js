export function setCurrentChapter(root, n) {
  root.querySelectorAll('[data-chapter-link]').forEach((a) => {
    if (a.dataset.chapterLink === String(n)) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
}

export function initChapters(root = document, { observerFactory } = {}) {
  const sections = [...root.querySelectorAll('section[data-chapter]')];
  const cleanups = [];
  const make =
    observerFactory ||
    (typeof IntersectionObserver !== 'undefined' ? (cb, o) => new IntersectionObserver(cb, o) : null);
  if (make && sections.length) {
    // Linha no meio da tela: o capítulo atual é a seção que a cruza, curta ou longa.
    const io = make(
      (entries) => {
        const hit = entries.find((en) => en.isIntersecting);
        if (hit) setCurrentChapter(root, hit.target.dataset.chapter);
      },
      { rootMargin: '-50% 0px -49.9% 0px', threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    cleanups.push(() => io.disconnect());
  }
  const nav = root.querySelector('.chapters');
  if (nav) {
    let queued = false;
    const paint = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      nav.style.setProperty('--progress', p.toFixed(4));
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    paint();
    cleanups.push(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    });
  }
  return () => cleanups.forEach((f) => f());
}
