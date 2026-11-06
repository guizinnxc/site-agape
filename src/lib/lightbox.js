export function initLightbox(root = document) {
  const dlg = root.querySelector('[data-lightbox-dialog]');
  if (!dlg || typeof HTMLDialogElement === 'undefined' || typeof dlg.showModal !== 'function') {
    return () => {};
  }
  const shots = [...root.querySelectorAll('a.shot')];
  if (!shots.length) return () => {};
  const $ = (s) => dlg.querySelector(s);
  const img = $('[data-lightbox-img]');
  const cap = $('[data-lightbox-caption]');
  const cred = $('[data-lightbox-credit]');
  const count = $('[data-lightbox-count]');
  let idx = 0;
  let origin = null;
  let savedY = 0;

  const show = (i) => {
    idx = (i + shots.length) % shots.length;
    const a = shots[idx];
    const thumb = a.querySelector('img');
    img.setAttribute('src', a.getAttribute('href'));
    img.alt = (thumb && thumb.alt) || '';
    cap.textContent = a.dataset.caption || '';
    cred.textContent = a.dataset.credit || '';
    count.textContent = `${idx + 1} de ${shots.length}`;
  };
  const open = (a) => {
    savedY = window.scrollY;
    origin = a;
    show(shots.indexOf(a));
    dlg.showModal();
    if (window.scrollY !== savedY) window.scrollTo(0, savedY);
  };
  const onClick = (e) => {
    if (e.defaultPrevented || e.button > 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a.shot');
    if (!a || !shots.includes(a)) return;
    e.preventDefault();
    open(a);
  };
  const onKey = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      show(idx + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      show(idx - 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      dlg.close();
    }
  };
  const onClose = () => {
    if (origin) origin.focus({ preventScroll: true });
    if (window.scrollY !== savedY) window.scrollTo(0, savedY);
  };
  const onBackdrop = (e) => {
    if (e.target === dlg) dlg.close();
  };
  const prev = $('[data-lightbox-prev]');
  const next = $('[data-lightbox-next]');
  const close = $('[data-lightbox-close]');
  const fp = () => show(idx - 1);
  const fn = () => show(idx + 1);
  const fc = () => dlg.close();
  root.addEventListener('click', onClick);
  dlg.addEventListener('keydown', onKey);
  dlg.addEventListener('close', onClose);
  dlg.addEventListener('click', onBackdrop);
  if (prev) prev.addEventListener('click', fp);
  if (next) next.addEventListener('click', fn);
  if (close) close.addEventListener('click', fc);
  return () => {
    root.removeEventListener('click', onClick);
    dlg.removeEventListener('keydown', onKey);
    dlg.removeEventListener('close', onClose);
    dlg.removeEventListener('click', onBackdrop);
    if (prev) prev.removeEventListener('click', fp);
    if (next) next.removeEventListener('click', fn);
    if (close) close.removeEventListener('click', fc);
  };
}
