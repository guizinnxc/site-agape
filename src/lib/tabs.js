// Abas das casas só a partir de 700 px; no celular (e sem JS) as duas casas ficam empilhadas.
export const TABS_MEDIA = '(min-width: 700px)';

export function initTabs(root = document) {
  const cleanups = [];
  const boxes = [];
  root.querySelectorAll('[data-tabs]').forEach((box) => {
    const list = box.querySelector('[role="tablist"]');
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    if (!list || !tabs.length) return;
    const panelOf = (t) => box.querySelector('[id="' + t.getAttribute('aria-controls') + '"]');
    let selected = tabs[0];
    const activate = (t, focus) => {
      selected = t;
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        const p = panelOf(x);
        if (p) p.hidden = !on;
      });
      if (focus) t.focus();
    };
    const sync = (wide) => {
      list.hidden = !wide;
      if (wide) activate(selected, false);
      else
        tabs.forEach((x) => {
          const p = panelOf(x);
          if (p) p.hidden = false;
        });
    };
    const onKey = (e) => {
      const i = tabs.indexOf(e.currentTarget);
      let n = -1;
      if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = tabs.length - 1;
      if (n < 0) return;
      e.preventDefault();
      activate(tabs[n], true);
    };
    tabs.forEach((t) => {
      const click = () => activate(t, false);
      t.addEventListener('click', click);
      t.addEventListener('keydown', onKey);
      cleanups.push(() => {
        t.removeEventListener('click', click);
        t.removeEventListener('keydown', onKey);
      });
    });
    boxes.push(sync);
  });
  if (!boxes.length) return () => {};

  const mq = typeof window.matchMedia === 'function' ? window.matchMedia(TABS_MEDIA) : null;
  const apply = () => boxes.forEach((sync) => sync(mq ? mq.matches : true));
  apply();
  if (mq) {
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else if (mq.addListener) mq.addListener(apply);
    cleanups.push(() => {
      if (mq.removeEventListener) mq.removeEventListener('change', apply);
      else if (mq.removeListener) mq.removeListener(apply);
    });
  }
  return () => cleanups.forEach((f) => f());
}
