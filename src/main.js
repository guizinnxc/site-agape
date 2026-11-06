import './styles/index.css';
import { initChapters } from './lib/chapters.js';
import { initCarousel } from './lib/carousel.js';
import { initLightbox } from './lib/lightbox.js';
import { initTabs } from './lib/tabs.js';
import { initReveal } from './lib/reveal.js';
import { initHero } from './lib/hero.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function boot() {
  const mods = [
    () => initTabs(document),
    () => initChapters(document),
    () => initCarousel(document, { reducedMotion: reduced }),
    () => initLightbox(document),
    () => initReveal(document, { reducedMotion: reduced }),
    () => initHero(document, { reducedMotion: reduced }),
  ];
  mods.forEach((m) => {
    try {
      m();
    } catch (err) {
      console.error(err);
    }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
