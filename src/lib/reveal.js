export function initReveal(root = document, { reducedMotion = false } = {}) {
  const els = [...root.querySelectorAll('[data-reveal]')];
  if (reducedMotion || typeof IntersectionObserver === 'undefined') {
    els.forEach((el) => el.classList.add('is-visible'));
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}
