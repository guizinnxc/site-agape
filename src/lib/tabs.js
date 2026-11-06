export function initTabs(root = document) {
  const cleanups = [];
  root.querySelectorAll('[data-tabs]').forEach((box) => {
    const list = box.querySelector('[role="tablist"]');
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    if (!list || !tabs.length) return;
    list.hidden = false;
    const panelOf = (t) => box.querySelector('[id="' + t.getAttribute('aria-controls') + '"]');
    const activate = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        const p = panelOf(x);
        if (p) p.hidden = !on;
      });
      if (focus) t.focus();
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
    activate(tabs[0], false);
  });
  return () => cleanups.forEach((f) => f());
}
