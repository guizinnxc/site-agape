// Revelação ao rolar: blocos [data-reveal] e todas as fotos ampliáveis (a.shot) ganham
// .is-visible uma vez, ao entrar na tela. O hero não usa a.shot: já nasce visível.
export const REVEAL_SELECTOR = '[data-reveal], a.shot';

export function initReveal(root = document, { reducedMotion = false } = {}) {
  const els = [...root.querySelectorAll(REVEAL_SELECTOR)];
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
