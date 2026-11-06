export function initHero(root = document, { reducedMotion = false } = {}) {
  const hero = root.querySelector('[data-hero]');
  if (!hero) return () => {};
  if (reducedMotion) {
    hero.style.setProperty('--hero-progress', '1');
    return () => {};
  }
  let queued = false;
  const paint = () => {
    queued = false;
    const h = hero.offsetHeight || window.innerHeight;
    const top = hero.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, -top / h));
    hero.style.setProperty('--hero-progress', p.toFixed(4));
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
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}
