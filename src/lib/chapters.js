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
    const ratios = new Map();
    const io = make(
      (entries) => {
        entries.forEach((en) =>
          ratios.set(en.target.dataset.chapter, en.isIntersecting ? en.intersectionRatio : 0),
        );
        let best = null;
        let max = 0;
        ratios.forEach((r, n) => {
          if (r > max) {
            max = r;
            best = n;
          }
        });
        if (best) setCurrentChapter(root, best);
      },
      { threshold: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1] },
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
