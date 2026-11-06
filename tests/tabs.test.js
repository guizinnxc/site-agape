// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { initTabs } from '../src/lib/tabs.js';
const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
describe('initTabs', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div data-tabs><div role="tablist" hidden>
      <button role="tab" id="tab-arcozelo" aria-controls="panel-arcozelo" data-tab="arcozelo">A</button>
      <button role="tab" id="tab-miguel-pereira" aria-controls="panel-miguel-pereira" data-tab="miguel-pereira">M</button></div>
      <div role="tabpanel" id="panel-arcozelo"></div><div role="tabpanel" id="panel-miguel-pereira"></div></div>`;
    initTabs(document);
  });
  it('ativa a primeira aba', () => {
    expect(document.querySelector('[role=tablist]').hidden).toBe(false);
    expect(document.getElementById('tab-arcozelo').getAttribute('aria-selected')).toBe('true');
    expect(document.getElementById('panel-miguel-pereira').hidden).toBe(true);
    expect(document.getElementById('panel-arcozelo').hidden).toBe(false);
  });
  it('setas, End e Home', () => {
    key(document.getElementById('tab-arcozelo'), 'ArrowRight');
    expect(document.activeElement.id).toBe('tab-miguel-pereira');
    expect(document.getElementById('tab-miguel-pereira').getAttribute('aria-selected')).toBe('true');
    expect(document.getElementById('panel-arcozelo').hidden).toBe(true);
    key(document.getElementById('tab-miguel-pereira'), 'Home');
    expect(document.activeElement.id).toBe('tab-arcozelo');
    key(document.getElementById('tab-arcozelo'), 'End');
    expect(document.activeElement.id).toBe('tab-miguel-pereira');
  });
});
