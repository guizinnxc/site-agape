export function initCarousel(root = document, { reducedMotion = false } = {}) {
  const cleanups = [];
  const behavior = reducedMotion ? 'auto' : 'smooth';
  root.querySelectorAll('[data-carousel]').forEach((box) => {
    const track = box.querySelector('[data-carousel-track]');
    const prev = box.querySelector('[data-carousel-prev]');
    const next = box.querySelector('[data-carousel-next]');
    if (!track) return;
    const step = () => {
      const item = track.firstElementChild;
      return (item && item.offsetWidth) || track.clientWidth || 1;
    };
    const go = (dir) => track.scrollBy({ left: dir * step(), behavior });
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (prev) prev.disabled = track.scrollLeft <= 1;
      if (next) next.disabled = max > 0 && track.scrollLeft >= max - 1;
    };
    const onPrev = () => go(-1);
    const onNext = () => go(1);
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
    };
    if (prev) prev.addEventListener('click', onPrev);
    if (next) next.addEventListener('click', onNext);
    track.addEventListener('keydown', onKey);
    track.addEventListener('scroll', update, { passive: true });
    // A largura rolável muda com a janela e quando as fotos (lazy) chegam: recalcula os botões.
    // `load` não borbulha, por isso é ouvido na captura.
    window.addEventListener('resize', update, { passive: true });
    track.addEventListener('load', update, true);
    update();
    cleanups.push(() => {
      if (prev) prev.removeEventListener('click', onPrev);
      if (next) next.removeEventListener('click', onNext);
      track.removeEventListener('keydown', onKey);
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      track.removeEventListener('load', update, true);
    });
  });
  return () => cleanups.forEach((f) => f());
}
