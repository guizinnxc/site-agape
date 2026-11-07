// Verificação ponta a ponta do site construído (dist/) com agent-browser (Chromium headless).
// Uso: npm run build && npm run e2e
// Sobe `vite preview` (http://localhost:4173), roda os cenários, grava capturas em
// test-results/ e imprime PASS/FAIL por cenário. Sai com código 1 se algum falhar.
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const DIST_INDEX = join(ROOT, 'dist', 'index.html');
const OUT = join(ROOT, 'test-results');
const PORT = 4173;
const BASE = `http://localhost:${PORT}/`;
const FILE_URL = pathToFileURL(DIST_INDEX).href;
const SESSION = 'agape-e2e';
const WA = 'wa.me/5524981100190';
const MAPS = 'https://www.google.com/maps/dir/?api=1&destination=';

/* ---------- agent-browser ---------- */

// No Windows o .cmd do npm só roda com shell; chamar o .exe direto evita problemas de aspas.
function resolveAgentBrowser() {
  if (process.env.AGENT_BROWSER_BIN) return { bin: process.env.AGENT_BROWSER_BIN, shell: false };
  if (process.platform !== 'win32') return { bin: 'agent-browser', shell: false };
  try {
    const cmd = execFileSync('where', ['agent-browser.cmd'], { encoding: 'utf8' }).split(/\r?\n/)[0].trim();
    const exe = join(dirname(cmd), 'node_modules', 'agent-browser', 'bin', 'agent-browser-win32-x64.exe');
    if (existsSync(exe)) return { bin: exe, shell: false };
  } catch {
    /* cai no .cmd abaixo */
  }
  return { bin: 'agent-browser.cmd', shell: true };
}
const AB = resolveAgentBrowser();
const quote = (a) => (AB.shell && /[\s"&|<>^]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a);

function ab(...args) {
  const full = ['--session', SESSION, '--json', ...args].map(quote);
  let out;
  try {
    out = execFileSync(AB.bin, full, { encoding: 'utf8', shell: AB.shell, timeout: 90_000, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (err) {
    out = String(err.stdout || '');
    if (!out.trim()) throw new Error(`agent-browser ${args.join(' ')}: ${String(err.stderr || err.message).trim()}`);
  }
  const line = out
    .split(/\r?\n/)
    .reverse()
    .find((l) => l.trim().startsWith('{'));
  if (!line) throw new Error(`agent-browser ${args.join(' ')}: saída inesperada: ${out.slice(0, 300)}`);
  const res = JSON.parse(line);
  if (!res.success) throw new Error(`agent-browser ${args.join(' ')}: ${JSON.stringify(res.error)}`);
  return res.data || {};
}

/** Executa JS na página. O código deve ser uma expressão; o resultado volta como valor JS. */
function js(code) {
  const wrapped = `(async () => JSON.stringify(await (${code})))()`;
  const data = ab('eval', '-b', Buffer.from(wrapped, 'utf8').toString('base64'));
  return data.result == null ? undefined : JSON.parse(data.result);
}

const waitFn = (expr, timeout = 10_000) => ab('wait', '--fn', expr, '--timeout', String(timeout));
const pause = (ms) => ab('wait', String(ms));
const shot = (name) => {
  ab('screenshot', join(OUT, name));
  shots.push(name);
};

function clearLogs() {
  ab('console', '--clear');
  ab('errors', '--clear');
}

/** Erros de página e mensagens de console do tipo error/warning. */
function pageProblems() {
  const errors = (ab('errors').errors || []).map((e) => `erro: ${e.text || e.message || JSON.stringify(e)}`);
  const msgs = (ab('console').messages || [])
    .filter((m) => /error|warn/i.test(m.type || m.level || ''))
    .map((m) => `console.${m.type || m.level}: ${m.text || JSON.stringify(m)}`);
  return [...errors, ...msgs];
}

// Rola até o topo do capítulo sem animação (o CSS usa scroll-behavior: smooth).
const scrollToChapter = (n) =>
  js(`(() => {
    const el = document.getElementById('cap-${n}');
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
    return window.scrollY;
  })()`);

/** Rola a página inteira em passos (para disparar loading="lazy" e as revelações). */
const sweepPage = () =>
  js(`(async () => {
    const tick = () => new Promise((r) => setTimeout(r, 120));
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.round(innerHeight * 0.6)) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await tick();
    }
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
    await tick();
    return window.scrollY;
  })()`);

/* ---------- servidor de preview ---------- */

async function startPreview() {
  if (await isUp()) throw new Error(`a porta ${PORT} já está em uso; encerre o outro servidor e rode de novo`);
  const vite = join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
  const child = spawn(process.execPath, [vite, 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  child.stdout.on('data', (d) => (log += d));
  child.stderr.on('data', (d) => (log += d));
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`vite preview saiu (código ${child.exitCode}):\n${log}`);
    if (await isUp()) return child;
    await new Promise((r) => setTimeout(r, 250));
  }
  child.kill();
  throw new Error(`vite preview não respondeu em 20 s:\n${log}`);
}

async function isUp() {
  try {
    const res = await fetch(BASE, { signal: AbortSignal.timeout(1000) });
    return res.ok;
  } catch {
    return false;
  }
}

/* ---------- cenários ---------- */

const shots = [];
const results = [];
const metrics = {};

function check(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function scenario(name, fn) {
  const t0 = Date.now();
  try {
    const detail = await fn();
    results.push({ name, ok: true, detail });
    console.log(`PASS  ${name}${detail ? ` — ${detail}` : ''} (${Date.now() - t0} ms)`);
  } catch (err) {
    results.push({ name, ok: false, detail: err.message });
    console.log(`FAIL  ${name} — ${err.message}`);
  }
}

// O Chromium headless pode herdar "reduzir animações" do sistema: fixa a preferência explicitamente.
const motionOn = () => ab('set', 'media', 'dark', 'no-preference');

function openDesktop() {
  ab('set', 'viewport', '1440', '900');
  motionOn();
  clearLogs();
  ab('open', BASE);
  ab('wait', '--load', 'load');
}

const s1 = () => {
  openDesktop();
  check(js(`matchMedia('(prefers-reduced-motion: reduce)').matches`) === false, 'movimento reduzido ainda emulado');
  const n = js(`document.querySelectorAll('section.chapter[data-chapter]').length`);
  check(n === 6, `esperava 6 capítulos, achou ${n}`);
  const ids = js(`[...document.querySelectorAll('section[data-chapter]')].map((s) => s.id).join(',')`);
  check(ids === 'cap-1,cap-2,cap-3,cap-4,cap-5,cap-6', `ordem dos capítulos: ${ids}`);
  for (let i = 1; i <= 6; i++) {
    scrollToChapter(i);
    pause(800);
    const cur = js(`document.querySelector('.chapters__link[aria-current="true"]')?.dataset.chapterLink`);
    check(cur === String(i), `descendo: capítulo ${i} visível mas o atual é ${cur}`);
    shot(`desktop-1440-cap-${i}-descendo.png`);
  }
  for (let i = 6; i >= 1; i--) {
    scrollToChapter(i);
    pause(600);
    const cur = js(`document.querySelector('.chapters__link[aria-current="true"]')?.dataset.chapterLink`);
    check(cur === String(i), `subindo: capítulo ${i} visível mas o atual é ${cur}`);
    if (i === 3 || i === 1) shot(`desktop-1440-cap-${i}-subindo.png`);
  }
  const hp = js(`getComputedStyle(document.querySelector('[data-hero]')).getPropertyValue('--hero-progress').trim()`);
  check(Number(hp) === 0, `no topo --hero-progress deveria ser 0, é ${hp}`);
  // Capítulo que já passou do meio da tela é o atual, mesmo com o anterior ainda à vista.
  const at30 = [];
  for (const n of [5, 2]) {
    const top = js(`(() => {
      const el = document.getElementById('cap-${n}');
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - innerHeight * 0.3, behavior: 'instant' });
      return Math.round(el.getBoundingClientRect().top);
    })()`);
    pause(600);
    const cur = js(`document.querySelector('.chapters__link[aria-current="true"]')?.dataset.chapterLink`);
    check(cur === String(n), `cap-${n} com o topo a ${top}px (30% da tela): o atual é ${cur}`);
    at30.push(`cap-${n} topo ${top}px → ${cur}`);
  }
  const problems = pageProblems();
  check(problems.length === 0, problems.join(' | '));
  return `6 capítulos, capítulo atual correto descendo e subindo (${at30.join(', ')}), sem erros no console`;
};

const s2 = () => {
  scrollToChapter(1);
  pause(300);
  ab('click', '.chapters__link[data-chapter-link="5"]');
  waitFn(`location.hash === '#cap-5' && document.querySelector('[data-chapter-link="5"]').getAttribute('aria-current') === 'true'`);
  pause(900); // fim da rolagem suave
  const st = js(`({
    hash: location.hash,
    current: document.querySelector('[data-chapter-link="5"]').getAttribute('aria-current'),
    others: document.querySelectorAll('.chapters__link[aria-current]').length,
    top: Math.round(document.getElementById('cap-5').getBoundingClientRect().top),
  })`);
  check(st.hash === '#cap-5', `hash ${st.hash}`);
  check(st.current === 'true' && st.others === 1, `aria-current: ${JSON.stringify(st)}`);
  check(Math.abs(st.top) <= 2, `capítulo V não ficou no topo (top=${st.top})`);
  shot('desktop-1440-nav-cap-5.png');
  return `URL #cap-5, link V aria-current="true", seção no topo (top=${st.top}px)`;
};

const s3 = () => {
  ab('scrollintoview', '[data-carousel-track]');
  pause(500);
  js(`(document.querySelector('[data-carousel-track]').scrollLeft = 0, 0)`);
  const prevDisabled = js(`document.querySelector('[data-carousel-prev]').disabled`);
  check(prevDisabled === true, 'no início o botão Anterior deveria estar desativado');
  ab('click', '[data-carousel-next]');
  waitFn(`document.querySelector('[data-carousel-track]').scrollLeft > 0`, 5000);
  pause(700);
  const afterClick = js(`document.querySelector('[data-carousel-track]').scrollLeft`);
  const prevEnabled = js(`!document.querySelector('[data-carousel-prev]').disabled`);
  check(prevEnabled, 'depois de avançar, Anterior deveria estar ativo');
  shot('desktop-1440-carrossel.png');
  js(`(document.querySelector('[data-carousel-track]').scrollTo({ left: 0, behavior: 'instant' }), 0)`);
  pause(200);
  ab('focus', '[data-carousel-track]');
  ab('press', 'ArrowRight');
  waitFn(`document.querySelector('[data-carousel-track]').scrollLeft > 0`, 5000);
  pause(700);
  const afterKey = js(`document.querySelector('[data-carousel-track]').scrollLeft`);
  // A prateleira termina antes da faixa de capítulos (desktop), em 1440 e em 1024 px.
  const gaps = [];
  for (const [w, h] of [[1440, 900], [1024, 768]]) {
    ab('set', 'viewport', String(w), String(h));
    pause(400);
    const gap = js(`(() => {
      const strip = document.querySelector('.strip').getBoundingClientRect();
      const rail = Math.min(...[...document.querySelectorAll('.chapters__num')].map((n) => n.getBoundingClientRect().left));
      return Math.round(rail - strip.right);
    })()`);
    check(gap >= 8, `${w}px: a prateleira chega a ${gap}px da faixa de capítulos`);
    gaps.push(`${w}px: ${gap}px`);
  }
  return `Próximo → scrollLeft ${Math.round(afterClick)}px; ArrowRight → ${Math.round(afterKey)}px; folga prateleira→faixa ${gaps.join(', ')}`;
};

const s4 = () => {
  ab('scrollintoview', '#cap-2 a.shot');
  pause(900);
  const before = js(`window.scrollY`);
  const total = js(`document.querySelectorAll('a.shot').length`);
  ab('click', '#cap-2 a.shot');
  waitFn(`document.querySelector('[data-lightbox-dialog]').open`, 5000);
  const c1 = js(`document.querySelector('[data-lightbox-count]').textContent`);
  check(c1 === `1 de ${total}`, `contagem inicial "${c1}", esperava "1 de ${total}"`);
  waitFn(`(() => { const i = document.querySelector('[data-lightbox-img]'); return i.complete && i.naturalWidth > 0; })()`, 10_000);
  pause(400);
  shot('desktop-1440-lightbox.png');
  ab('press', 'ArrowRight');
  const c2 = js(`document.querySelector('[data-lightbox-count]').textContent`);
  check(c2 === `2 de ${total}`, `após ArrowRight "${c2}"`);
  ab('press', 'Escape');
  waitFn(`!document.querySelector('[data-lightbox-dialog]').open`, 5000);
  const st = js(`({
    focusOk: document.activeElement === document.querySelector('#cap-2 a.shot'),
    y: window.scrollY,
  })`);
  check(st.focusOk, 'o foco não voltou para a foto clicada');
  check(Math.abs(st.y - before) <= 2, `scrollY mudou: antes ${before}, depois ${st.y}`);
  return `aberto "${c1}" → "${c2}"; Escape fecha, foco volta ao a.shot, scrollY ${before}→${st.y}`;
};

const s5 = () => {
  ab('scrollintoview', '#tab-miguel-pereira');
  pause(600);
  check(js(`document.querySelector('[role="tablist"]').hidden`) === false, 'tablist continua oculto');
  ab('click', '#tab-miguel-pereira');
  const st = js(`(() => {
    const mp = document.getElementById('panel-miguel-pereira');
    const ar = document.getElementById('panel-arcozelo');
    return {
      mpHidden: mp.hidden,
      mpVisible: mp.getClientRects().length > 0 && mp.offsetHeight > 0,
      arHidden: ar.hidden,
      arRendered: ar.getClientRects().length > 0,
      selected: document.getElementById('tab-miguel-pereira').getAttribute('aria-selected'),
    };
  })()`);
  check(!st.mpHidden && st.mpVisible, `painel Miguel Pereira não visível: ${JSON.stringify(st)}`);
  check(st.arHidden && !st.arRendered, `painel Arcozelo não ficou oculto: ${JSON.stringify(st)}`);
  check(st.selected === 'true', 'aba Miguel Pereira sem aria-selected="true"');
  pause(700);
  shot('desktop-1440-casas-miguel-pereira.png');
  return 'Miguel Pereira visível, Arcozelo hidden, aria-selected correto';
};

const s6 = () => {
  const links = js(`({
    wa: document.querySelectorAll('a[href*="${WA}"]').length,
    maps: [...document.querySelectorAll('a[href^="${MAPS}"]')].map((a) => a.href),
    empty: document.querySelectorAll('a[href="#"], a[href=""], a:not([href])').length,
  })`);
  check(links.wa >= 3, `só ${links.wa} links de WhatsApp`);
  check(links.maps.length === 2, `esperava 2 rotas do Maps, achou ${links.maps.length}`);
  check(links.empty === 0, `${links.empty} links vazios (href="#" ou sem href)`);
  // Carrega as imagens das duas casas (a aba oculta não carrega lazy) e as do carrossel.
  const imgs = [];
  for (const slug of ['arcozelo', 'miguel-pereira']) {
    ab('click', `#tab-${slug}`);
    sweepPage();
    ab('scrollintoview', '[data-carousel-track]');
    js(`(async () => {
      const t = document.querySelector('[data-carousel-track]');
      for (let x = 0; x <= t.scrollWidth; x += t.clientWidth / 2) {
        t.scrollTo({ left: x, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 120));
      }
      return true;
    })()`);
    const rendered = `[...document.images].filter((i) => !i.matches('[data-lightbox-img]') && i.getClientRects().length > 0)`;
    waitFn(`${rendered}.every((i) => i.complete)`, 30_000);
    imgs.push(
      ...js(`${rendered}.map((i) => ({ src: i.currentSrc || i.src, w: i.naturalWidth }))`),
    );
  }
  ab('click', '#tab-arcozelo');
  ab('screenshot', '--full', join(OUT, 'desktop-1440-pagina-inteira.png'));
  shots.push('desktop-1440-pagina-inteira.png');
  const unique = new Map(imgs.map((i) => [i.src, i]));
  const broken = [...unique.values()].filter((i) => !(i.w > 0));
  check(broken.length === 0, `imagens sem carregar: ${broken.map((b) => b.src).join(', ')}`);
  const total = js(`document.querySelectorAll('img:not([data-lightbox-img])').length`);
  return `${links.wa} links WhatsApp, 2 rotas do Maps, 0 vazios; ${unique.size} arquivos de imagem carregados (${total} <img> no HTML), todos com naturalWidth > 0`;
};

function mobileChecks(w, h) {
  ab('set', 'viewport', String(w), String(h));
  motionOn();
  clearLogs();
  ab('open', BASE);
  ab('wait', '--load', 'load');
  pause(500);
  const st = js(`(() => {
    const nav = document.querySelector('.chapters');
    const r = nav.getBoundingClientRect();
    const btn = document.querySelector('.hero .btn--primary');
    const b = btn.getBoundingClientRect();
    const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    const name = document.querySelector('.chapters__link[aria-current="true"] .chapters__name');
    return {
      sw: document.documentElement.scrollWidth,
      iw: window.innerWidth,
      navVisible: getComputedStyle(nav).display !== 'none' && r.height > 0 && Math.round(r.bottom) === window.innerHeight,
      btnOk: !!hit && (hit === btn || btn.contains(hit)),
      btnBottom: Math.round(b.bottom),
      navTop: Math.round(r.top),
      hit: hit ? hit.tagName + '.' + hit.className : null,
      nameFits: name ? name.scrollWidth <= name.clientWidth + 1 && name.scrollHeight <= name.clientHeight + 1 : false,
      name: name ? name.textContent : null,
    };
  })()`);
  check(st.sw <= st.iw, `rolagem horizontal: scrollWidth ${st.sw} > innerWidth ${st.iw}`);
  check(st.navVisible, 'barra de capítulos não visível no rodapé da tela');
  check(st.btnOk, `botão WhatsApp do hero coberto por ${st.hit} (botão até y=${st.btnBottom}, barra em y=${st.navTop})`);
  check(st.nameFits, `nome do capítulo atual cortado na barra ("${st.name}")`);
  shot(`celular-${w}-hero.png`);
  // Abaixo de 700 px as casas empilham: sem abas, os dois painéis visíveis.
  const houses = js(`(() => {
    const vis = (id) => { const p = document.getElementById(id); return !p.hidden && p.getClientRects().length > 0 && p.offsetHeight > 0; };
    const list = document.querySelector('[role="tablist"]');
    return { listHidden: list.hidden && list.getClientRects().length === 0, ar: vis('panel-arcozelo'), mp: vis('panel-miguel-pereira') };
  })()`);
  check(houses.listHidden && houses.ar && houses.mp, `${w}px: casas não empilhadas ${JSON.stringify(houses)}`);
  const chaptersToShoot = w === 390 ? [2, 3, 4, 5, 6] : [3, 5, 6];
  for (const n of chaptersToShoot) {
    scrollToChapter(n);
    pause(900);
    const sw = js(`document.documentElement.scrollWidth`);
    check(sw <= w, `capítulo ${n}: scrollWidth ${sw} > ${w}`);
    const name = js(`(() => { const n = document.querySelector('.chapters__link[aria-current="true"] .chapters__name'); return n ? [n.textContent, n.scrollWidth <= n.clientWidth + 1 && n.scrollHeight <= n.clientHeight + 1] : null; })()`);
    check(name && name[1], `capítulo ${n}: nome na barra cortado (${name && name[0]})`);
    shot(`celular-${w}-cap-${n}${n === 5 ? '-casas' : ''}.png`);
  }
  sweepPage();
  ab('screenshot', '--full', join(OUT, `celular-${w}-pagina-inteira.png`));
  shots.push(`celular-${w}-pagina-inteira.png`);
  const problems = pageProblems();
  check(problems.length === 0, problems.join(' | '));
  return `${w}×${h}: casas empilhadas (sem abas, 2 painéis), scrollWidth ${st.sw} ≤ ${st.iw}, barra visível, botão WhatsApp livre (fundo y=${st.btnBottom} < barra y=${st.navTop}), nome "${st.name}" inteiro`;
}

const s7 = () => [mobileChecks(390, 844), mobileChecks(320, 640)].join('; ');

const s8 = () => {
  ab('set', 'viewport', '1440', '900');
  ab('set', 'media', 'dark', 'reduced-motion');
  clearLogs();
  ab('open', BASE);
  ab('wait', '--load', 'load');
  ab('reload');
  ab('wait', '--load', 'load');
  pause(300);
  const st = js(`(() => {
    const els = [...document.querySelectorAll('[data-reveal]')];
    return {
      reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      y: window.scrollY,
      total: els.length,
      visible: els.filter((e) => e.classList.contains('is-visible')).length,
      opaque: els.filter((e) => getComputedStyle(e).opacity === '1').length,
      hp: getComputedStyle(document.querySelector('[data-hero]')).getPropertyValue('--hero-progress').trim(),
    };
  })()`);
  check(st.reduced, 'prefers-reduced-motion não foi emulado');
  check(st.y === 0, `a página rolou (scrollY=${st.y})`);
  check(st.visible === st.total, `${st.visible}/${st.total} [data-reveal] com .is-visible`);
  check(st.opaque === st.total, `${st.opaque}/${st.total} [data-reveal] com opacidade 1`);
  check(Number(st.hp) === 1, `--hero-progress = ${st.hp}`);
  shot('reduzido-1440-hero.png');
  return `${st.visible}/${st.total} [data-reveal] visíveis sem rolar, --hero-progress = ${st.hp}`;
};

const s11 = () => {
  ab('set', 'viewport', '390', '844');
  motionOn();
  clearLogs();
  ab('open', BASE);
  ab('wait', '--load', 'load');
  pause(2000);
  const st = js(`(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const res = performance.getEntriesByType('resource');
    const items = res.map((r) => ({ name: r.name.replace(location.origin + '/', ''), kb: +(r.transferSize / 1024).toFixed(1) }));
    const total = (nav ? nav.transferSize : 0) + res.reduce((s, r) => s + r.transferSize, 0);
    return { y: window.scrollY, navKb: nav ? +(nav.transferSize / 1024).toFixed(1) : 0, items, kb: +(total / 1024).toFixed(1) };
  })()`);
  check(st.y === 0, `a página rolou (scrollY=${st.y})`);
  metrics.firstScreen = st;
  check(st.kb < 500, `primeira tela pesa ${st.kb} KB (limite 500 KB)`);
  const top = [...st.items].sort((a, b) => b.kb - a.kb).slice(0, 4).map((i) => `${i.name} ${i.kb} KB`);
  return `${st.kb} KB transferidos (HTML ${st.navKb} KB + ${st.items.length} recursos; maiores: ${top.join(', ')})`;
};

const s9 = () => {
  ab('set', 'viewport', '1440', '900');
  motionOn();
  ab('open');
  ab('network', 'route', '**/*.js', '--abort');
  try {
    return s9body();
  } finally {
    ab('network', 'unroute');
  }
};

const s9body = () => {
  clearLogs();
  ab('open', BASE);
  ab('wait', '--load', 'load');
  ab('reload');
  ab('wait', '--load', 'load');
  pause(500);
  const st = js(`(() => {
    const panels = ['arcozelo', 'miguel-pereira'].map((s) => {
      const p = document.getElementById('panel-' + s);
      return p && !p.hidden && p.getClientRects().length > 0 && p.offsetHeight > 0;
    });
    const shots = [...document.querySelectorAll('a.shot')];
    const reveal = [...document.querySelectorAll('[data-reveal]')];
    return {
      jsRan: !document.querySelector('[role="tablist"]').hidden || !!document.querySelector('.chapters__link[aria-current]'),
      chapters: document.querySelectorAll('section.chapter[data-chapter]').length,
      panels,
      shots: shots.length,
      badShots: shots.filter((a) => !/^img\\/[\\w-]+\\.(jpe?g|webp|avif)$/.test(a.getAttribute('href'))).map((a) => a.getAttribute('href')),
      hiddenReveal: reveal.filter((e) => getComputedStyle(e).opacity !== '1').length,
      controls: getComputedStyle(document.querySelector('.strip__controls')).display,
    };
  })()`);
  check(!st.jsRan, 'o JS rodou mesmo com os .js bloqueados');
  check(st.chapters === 6, `${st.chapters} capítulos`);
  check(st.panels.every(Boolean), `painéis das casas: ${JSON.stringify(st.panels)}`);
  check(st.shots > 0 && st.badShots.length === 0, `a.shot com href inválido: ${st.badShots.join(', ')}`);
  check(st.hiddenReveal === 0, `${st.hiddenReveal} blocos [data-reveal] invisíveis sem JS`);
  check(st.controls === 'none', 'botões do carrossel aparecem sem JS (não funcionariam)');
  shot('sem-js-1440-topo.png');
  scrollToChapter(5);
  pause(400);
  shot('sem-js-1440-casas.png');
  return `6 capítulos, 2 painéis visíveis, ${st.shots} a.shot com href img/…, conteúdo legível (0 blocos ocultos), sem botões mortos`;
};

const s10 = () => {
  ab('set', 'viewport', '1440', '900');
  motionOn();
  clearLogs();
  ab('open', FILE_URL);
  ab('wait', '--load', 'load');
  waitFn(`[...document.querySelectorAll('.hero__picture img')].every((i) => i.complete)`, 10_000);
  const st = js(`({
    url: location.protocol,
    hero: [...document.querySelectorAll('.hero__picture img')].map((i) => i.naturalWidth),
    jsClass: document.documentElement.classList.contains('js'),
    tabs: !document.querySelector('[role="tablist"]').hidden,
    css: getComputedStyle(document.body).backgroundColor,
  })`);
  check(st.url === 'file:', `protocolo ${st.url}`);
  check(st.hero.length > 0 && st.hero.every((w) => w > 0), `imagens do hero: ${JSON.stringify(st.hero)}`);
  check(st.jsClass && st.tabs, 'o JS não rodou via file://');
  check(st.css === 'rgb(15, 13, 11)', `CSS não aplicado (fundo ${st.css})`);
  ab('scrollintoview', '#cap-2 a.shot');
  pause(600);
  ab('click', '#cap-2 a.shot');
  waitFn(`document.querySelector('[data-lightbox-dialog]').open`, 5000);
  ab('press', 'Escape');
  const problems = pageProblems();
  check(problems.length === 0, problems.join(' | '));
  return `${FILE_URL} — hero ${st.hero.join('/')}px, html.js, CSS aplicado, lightbox abre, sem erros`;
};

/* ---------- execução ---------- */

async function main() {
  if (!existsSync(DIST_INDEX)) {
    console.error('dist/index.html não existe: rode `npm run build` antes.');
    process.exit(1);
  }
  mkdirSync(OUT, { recursive: true });
  let server;
  try {
    server = await startPreview();
    console.log(`vite preview em ${BASE} · agent-browser --session ${SESSION} · capturas em test-results/\n`);
    try {
      ab('close');
    } catch {
      /* sessão não existia */
    }
    await scenario('1. Desktop 1440×900: capítulos, console limpo, capturas', s1);
    await scenario('2. Navegação pelo link do capítulo V', s2);
    await scenario('3. Carrossel: Próximo e ArrowRight', s3);
    await scenario('4. Lightbox: abrir, ArrowRight, Escape, foco e rolagem', s4);
    await scenario('5. Abas das casas', s5);
    await scenario('6. Links e imagens', s6);
    await scenario('7. Celular 390×844 e 320×640', s7);
    await scenario('8. Movimento reduzido', s8);
    ab('close'); // navegador novo: cache frio para medir o peso e mídia sem emulação
    await scenario('11. Peso da primeira tela (celular, cache frio)', s11);
    await scenario('9. Sem JS (scripts .js bloqueados)', s9);
    await scenario('10. Duplo clique (file://)', s10);
  } catch (err) {
    results.push({ name: 'infraestrutura', ok: false, detail: err.message });
    console.log(`FAIL  infraestrutura — ${err.message}`);
  } finally {
    try {
      ab('close');
    } catch {
      /* já fechado */
    }
    if (server) server.kill();
  }
  const failed = results.filter((r) => !r.ok);
  console.log(`\nCapturas (${shots.length}): ${shots.join(', ')}`);
  console.log(`\n${results.length - failed.length}/${results.length} cenários PASS${failed.length ? ` · ${failed.length} FAIL` : ''}`);
  process.exitCode = failed.length ? 1 : 0;
}

main();
