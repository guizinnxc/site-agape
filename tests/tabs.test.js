// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initTabs } from '../src/lib/tabs.js';

const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
const $ = (id) => document.getElementById(id);

// matchMedia falso: `mq.set(true|false)` simula a tela cruzando 700 px.
function fakeMatchMedia(initial) {
  const listeners = new Set();
  const mq = {
    media: '',
    matches: initial,
    addEventListener: (type, fn) => type === 'change' && listeners.add(fn),
    removeEventListener: (type, fn) => listeners.delete(fn),
    set(v) {
      mq.matches = v;
      listeners.forEach((fn) => fn({ matches: v, media: mq.media }));
    },
    listeners,
  };
  const fn = (query) => {
    mq.media = query;
    return mq;
  };
  return { fn, mq };
}

const MARKUP = `<div data-tabs><div role="tablist" hidden>
  <button role="tab" id="tab-arcozelo" aria-controls="panel-arcozelo" data-tab="arcozelo">A</button>
  <button role="tab" id="tab-miguel-pereira" aria-controls="panel-miguel-pereira" data-tab="miguel-pereira">M</button></div>
  <div role="tabpanel" id="panel-arcozelo"></div><div role="tabpanel" id="panel-miguel-pereira"></div></div>`;

let original;
let media;
let cleanup;

function setup(wide) {
  document.body.innerHTML = MARKUP;
  media = fakeMatchMedia(wide);
  window.matchMedia = media.fn;
  cleanup = initTabs(document);
}

beforeEach(() => {
  original = window.matchMedia;
});

afterEach(() => {
  cleanup?.();
  window.matchMedia = original;
});

describe('initTabs — tela larga (≥ 700 px)', () => {
  beforeEach(() => setup(true));

  it('consulta (min-width: 700px) e ativa a primeira aba', () => {
    expect(media.mq.media).toBe('(min-width: 700px)');
    expect(document.querySelector('[role=tablist]').hidden).toBe(false);
    expect($('tab-arcozelo').getAttribute('aria-selected')).toBe('true');
    expect($('panel-miguel-pereira').hidden).toBe(true);
    expect($('panel-arcozelo').hidden).toBe(false);
  });

  it('setas, End e Home', () => {
    key($('tab-arcozelo'), 'ArrowRight');
    expect(document.activeElement.id).toBe('tab-miguel-pereira');
    expect($('tab-miguel-pereira').getAttribute('aria-selected')).toBe('true');
    expect($('panel-arcozelo').hidden).toBe(true);
    key($('tab-miguel-pereira'), 'Home');
    expect(document.activeElement.id).toBe('tab-arcozelo');
    key($('tab-arcozelo'), 'End');
    expect(document.activeElement.id).toBe('tab-miguel-pereira');
  });
});

describe('initTabs — celular (< 700 px): as casas empilham', () => {
  beforeEach(() => setup(false));

  it('tablist oculta e os dois painéis visíveis', () => {
    expect(document.querySelector('[role=tablist]').hidden).toBe(true);
    expect($('panel-arcozelo').hidden).toBe(false);
    expect($('panel-miguel-pereira').hidden).toBe(false);
  });

  it('acompanha a mudança de largura nos dois sentidos e lembra a aba escolhida', () => {
    media.mq.set(true);
    expect(document.querySelector('[role=tablist]').hidden).toBe(false);
    expect($('panel-miguel-pereira').hidden).toBe(true);
    $('tab-miguel-pereira').click();
    expect($('panel-arcozelo').hidden).toBe(true);

    media.mq.set(false);
    expect(document.querySelector('[role=tablist]').hidden).toBe(true);
    expect($('panel-arcozelo').hidden).toBe(false);
    expect($('panel-miguel-pereira').hidden).toBe(false);

    media.mq.set(true);
    expect($('tab-miguel-pereira').getAttribute('aria-selected')).toBe('true');
    expect($('panel-arcozelo').hidden).toBe(true);
    expect($('panel-miguel-pereira').hidden).toBe(false);
  });

  it('cleanup remove o ouvinte de mídia', () => {
    expect(media.mq.listeners.size).toBe(1);
    cleanup();
    cleanup = null;
    expect(media.mq.listeners.size).toBe(0);
  });
});
