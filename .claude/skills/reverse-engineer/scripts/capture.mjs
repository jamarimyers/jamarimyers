#!/usr/bin/env node
// capture.mjs - reconnaissance for the reverse-engineer skill.
// Loads a URL in headless Chromium at desktop and mobile sizes, extracts design
// facts, scrolls in 10 steps with a screenshot each, and writes DESIGN-NOTES.md
// plus raw.json. Requires playwright-core (npm i playwright-core).
//
// Usage: node capture.mjs --url https://example.com --out ./recon/example
//        [--chrome /path/to/chrome] [--viewports 1440x900,390x844]
//        [--ignore-https-errors] [--no-proxy]
// Exit codes: 0 ok, 1 setup/usage error, 2 navigation error.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const NAV_TIMEOUT = 45000;
const STEPS = 10;
const STEP_WAIT = 400;
const warnings = [];
const warn = (m) => { warnings.push(m); console.warn('warn: ' + m); };

// ---------- args ----------
function parseArgs(argv) {
  const a = { viewports: '1440x900,390x844' };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const val = () => argv[++i];
    if (k === '--url') a.url = val();
    else if (k === '--out') a.out = val();
    else if (k === '--chrome') a.chrome = val();
    else if (k === '--viewports') a.viewports = val();
    else if (k === '--ignore-https-errors') a.ignoreHttps = true;
    else if (k === '--no-proxy') a.noProxy = true;
    else if (k === '--help' || k === '-h') a.help = true;
    else if (k.startsWith('--url=')) a.url = k.slice(6);
    else if (k.startsWith('--out=')) a.out = k.slice(6);
    else if (k.startsWith('--chrome=')) a.chrome = k.slice(9);
    else if (k.startsWith('--viewports=')) a.viewports = k.slice(12);
    else { console.error('Unknown argument: ' + k); process.exit(1); }
  }
  return a;
}
const args = parseArgs(process.argv.slice(2));
if (args.help || !args.url || !args.out) {
  console.error('Usage: node capture.mjs --url <url> --out <dir> [--chrome <path>] [--viewports 1440x900,390x844] [--ignore-https-errors] [--no-proxy]');
  process.exit(args.help ? 0 : 1);
}
let targetUrl = args.url;
if (!/^[a-z][a-z0-9+.-]*:/i.test(targetUrl)) targetUrl = 'https://' + targetUrl;
let host;
try { host = new URL(targetUrl).host; } catch { console.error('Invalid URL: ' + args.url); process.exit(1); }
const viewports = args.viewports.split(',').map((s) => {
  const m = s.trim().match(/^(\d+)x(\d+)$/);
  if (!m) { console.error('Bad viewport: ' + s); process.exit(1); }
  return { w: +m[1], h: +m[2] };
});
const outDir = path.resolve(args.out);
fs.mkdirSync(outDir, { recursive: true });

// ---------- playwright-core ----------
function loadPlaywright() {
  const bases = [path.join(process.cwd(), 'noop.js'), import.meta.url];
  let lastErr;
  for (const b of bases) {
    try { return createRequire(b)('playwright-core'); } catch (e) { lastErr = e; }
  }
  console.error('Cannot load playwright-core (' + (lastErr && lastErr.code) + '). Run: npm i playwright-core  (in or above the working directory), or set NODE_PATH to its node_modules.');
  process.exit(1);
}
const { chromium } = loadPlaywright();

// ---------- chrome discovery ----------
const isExe = (p) => { try { fs.accessSync(p, fs.constants.X_OK); return fs.statSync(p).isFile(); } catch { return false; } };
function scanBrowsersDir(dir) {
  let entries;
  try { entries = fs.readdirSync(dir); } catch { return null; }
  // Full chromium-NNNN builds first (newest first), headless-shell builds after.
  const byVersion = (a, b) => b.localeCompare(a, undefined, { numeric: true });
  const full = entries.filter((e) => /^chromium-\d/.test(e)).sort(byVersion);
  const rest = entries.filter((e) => /^chromium/.test(e) && !full.includes(e)).sort(byVersion);
  const dirs = [...full, ...rest];
  const rel = ['chrome-linux/chrome', 'chrome-linux64/chrome', 'chrome-linux/headless_shell',
    'chrome-headless-shell-linux64/chrome-headless-shell', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-win/chrome.exe'];
  for (const d of dirs) for (const r of rel) {
    const p = path.join(dir, d, r);
    if (isExe(p)) return p;
  }
  return null;
}
function findChrome(cli) {
  if (cli) { if (isExe(cli)) return cli; warn('--chrome path not executable: ' + cli); }
  const env = process.env.SCROLLCRAFT_CHROME;
  if (env) { if (isExe(env)) return env; warn('SCROLLCRAFT_CHROME not executable: ' + env); }
  const pbp = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (pbp && pbp !== '0') { const p = scanBrowsersDir(pbp); if (p) return p; }
  for (const d of ['/opt/pw-browsers', path.join(os.homedir(), '.cache/ms-playwright')]) {
    const p = scanBrowsersDir(d); if (p) return p;
  }
  for (const name of ['chromium', 'chromium-browser', 'google-chrome', 'chrome']) {
    try {
      const p = execFileSync('which', [name], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      if (p && isExe(p)) return p;
    } catch { /* not on PATH */ }
  }
  return null;
}

function proxyFromEnv() {
  if (args.noProxy) return undefined;
  const raw = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy || process.env.ALL_PROXY || process.env.all_proxy;
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    const p = { server: `${u.protocol}//${u.host}` };
    if (u.username) p.username = decodeURIComponent(u.username);
    if (u.password) p.password = decodeURIComponent(u.password);
    const np = process.env.NO_PROXY || process.env.no_proxy;
    if (np) p.bypass = np;
    return p;
  } catch { warn('Could not parse proxy env var; launching without proxy'); return undefined; }
}

// ---------- page-side collectors (must be self-contained) ----------
const evMeta = () => ({
  title: document.title || '',
  metaDescription: (document.querySelector('meta[name="description" i]') || {}).content || '',
  themeColor: (document.querySelector('meta[name="theme-color"]') || {}).content || '',
  lang: document.documentElement.lang || '',
});

const evAssets = () => ({
  scripts: [...document.querySelectorAll('script[src]')].map((s) => s.src),
  stylesheets: [...document.querySelectorAll('link[rel~="stylesheet" i]')].map((l) => l.href),
  inlineScriptHits: (() => {
    const names = { lenis: /lenis/i, gsap: /gsap/i, ScrollTrigger: /scrolltrigger/i, locomotive: /locomotive/i, three: /new\s+THREE\./, 'framer-motion': /framer-motion/i, barba: /barba/i };
    const hits = {};
    for (const s of document.querySelectorAll('script:not([src])')) {
      const t = (s.textContent || '').slice(0, 400000);
      for (const [k, re] of Object.entries(names)) if (re.test(t)) hits[k] = true;
    }
    return hits;
  })(),
});

const evFonts = () => {
  const out = { faces: [], loaded: [], crossOriginSheets: 0 };
  const walk = (rules) => {
    for (const r of rules) {
      if (r.type === 5 /* FONT_FACE */) {
        const s = r.style;
        const src = s.getPropertyValue('src') || '';
        const url = (src.match(/url\(["']?([^"')]+)["']?\)/) || [])[1] || '';
        out.faces.push({
          family: (s.getPropertyValue('font-family') || '').replace(/^["']|["']$/g, ''),
          weight: s.getPropertyValue('font-weight') || '', style: s.getPropertyValue('font-style') || '',
          display: s.getPropertyValue('font-display') || '', src: url,
        });
      } else if (r.cssRules) { try { walk(r.cssRules); } catch (e) { /* ignore */ } }
    }
  };
  for (const sh of document.styleSheets) {
    try { walk(sh.cssRules); } catch (e) { out.crossOriginSheets++; }
  }
  try {
    document.fonts.forEach((f) => out.loaded.push({ family: f.family.replace(/^["']|["']$/g, ''), weight: f.weight, style: f.style, status: f.status }));
  } catch (e) { /* ignore */ }
  return out;
};

const evTypography = () => {
  const sels = ['body', 'h1', 'h2', 'h3', 'p', 'a', 'button', 'nav'];
  const res = {};
  for (const sel of sels) {
    const all = [...document.querySelectorAll(sel)];
    if (!all.length) { res[sel] = null; continue; }
    const el = all.find((e) => e.getClientRects().length > 0) || all[0];
    const cs = getComputedStyle(el);
    res[sel] = {
      count: all.length, family: cs.fontFamily, size: cs.fontSize, weight: cs.fontWeight,
      lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, textTransform: cs.textTransform,
      color: cs.color, sample: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
    };
  }
  return res;
};

const evColors = () => {
  const cache = new Map();
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const parse = (c) => {
    if (cache.has(c)) return cache.get(c);
    let out = null;
    const m = c.match(/^rgba?\(([^)]+)\)$/);
    if (m) {
      const p = m[1].split(/[,\s/]+/).filter(Boolean).map(parseFloat);
      out = [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
    } else {
      try {
        ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000'; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1);
        const d = ctx.getImageData(0, 0, 1, 1).data; out = [d[0], d[1], d[2], d[3] / 255];
      } catch (e) { out = null; }
    }
    cache.set(c, out); return out;
  };
  const hex = (a) => '#' + [0, 1, 2].map((i) => Math.round(a[i]).toString(16).padStart(2, '0')).join('') + (a[3] < 0.995 ? Math.round(a[3] * 255).toString(16).padStart(2, '0') : '');
  const bg = new Map(), fg = new Map();
  const bump = (m, c) => { const p = parse(c); if (!p || p[3] === 0) return; const h = hex(p); m.set(h, (m.get(h) || 0) + 1); };
  for (const el of document.querySelectorAll('body, body *')) {
    if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)) continue;
    if (!el.getClientRects().length) continue;
    const cs = getComputedStyle(el);
    bump(bg, cs.backgroundColor);
    bump(fg, cs.color);
  }
  const top = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([hexv, count]) => ({ hex: hexv, count }));
  return { background: top(bg), text: top(fg) };
};

const evVars = () => {
  const names = new Set();
  const rootRe = /(^|[\s,])(:root|html)(?![\w-])/;
  let blocked = 0;
  const walk = (rules) => {
    for (const r of rules) {
      if (r.type === 1 && rootRe.test(r.selectorText || '')) {
        for (let i = 0; i < r.style.length; i++) if (r.style[i].startsWith('--')) names.add(r.style[i]);
      } else if (r.cssRules) { try { walk(r.cssRules); } catch (e) { /* ignore */ } }
    }
  };
  for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch (e) { blocked++; } }
  const st = document.documentElement.style;
  for (let i = 0; i < st.length; i++) if (st[i].startsWith('--')) names.add(st[i]);
  const cs = getComputedStyle(document.documentElement);
  return { blockedSheets: blocked, vars: [...names].sort().map((n) => ({ name: n, value: cs.getPropertyValue(n).trim() })) };
};

const evLibs = () => {
  const w = window;
  const q = (s) => { try { return !!document.querySelector(s); } catch (e) { return false; } };
  return {
    globals: {
      lenis: !!(w.Lenis || w.lenis),
      gsap: !!w.gsap,
      ScrollTrigger: !!w.ScrollTrigger,
      locomotive: !!(w.LocomotiveScroll || w.locomotive),
      three: !!w.THREE,
      'framer-motion': !!(w.Motion || w.FramerMotion || q('[data-framer-name],[data-framer-component-type]')),
      barba: !!(w.barba || w.Barba),
    },
    domHints: {
      'html.lenis': document.documentElement.classList.contains('lenis') || q('[data-lenis-prevent],[data-lenis-root]'),
      'locomotive container': q('[data-scroll-container],.locomotive-scroll,[data-scroll-section]'),
      'barba containers': q('[data-barba]'),
      'canvas elements': document.querySelectorAll('canvas').length,
      video: document.querySelectorAll('video').length,
      'css scroll-timeline / view-timeline': (() => {
        try { return CSS.supports('animation-timeline: scroll()') && [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => /animation-timeline|scroll-timeline|view-timeline/.test(r.cssText)); } catch (e) { return false; } }); } catch (e) { return false; }
      })(),
      'scroll-snap': q('[style*="scroll-snap"]') || [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => /scroll-snap-type/.test(r.cssText)); } catch (e) { return false; } }),
    },
  };
};

const evFixed = () => {
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    const r = el.getBoundingClientRect();
    out.push({
      tag: el.tagName.toLowerCase(), id: el.id || '', cls: (typeof el.className === 'string' ? el.className : '').trim().replace(/\s+/g, ' ').slice(0, 80),
      position: cs.position, zIndex: cs.zIndex,
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30),
    });
    if (out.length >= 60) break;
  }
  return out;
};

// Snapshot used at every scroll step; elements get a stable id via a WeakMap.
const evFixedSnap = () => {
  if (!window.__revIds) { window.__revIds = new WeakMap(); window.__revN = 0; }
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    const r = el.getBoundingClientRect();
    if (!window.__revIds.has(el)) window.__revIds.set(el, ++window.__revN);
    out.push({
      id: window.__revIds.get(el), tag: el.tagName.toLowerCase(), idAttr: el.id || '',
      cls: (typeof el.className === 'string' ? el.className : '').trim().replace(/\s+/g, ' ').slice(0, 60),
      position: cs.position, opacity: parseFloat(cs.opacity), visibility: cs.visibility, transform: cs.transform,
      x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
    });
    if (out.length >= 60) break;
  }
  return out;
};

const evSections = () => {
  const sel = 'section, main > div, article';
  const vh = window.innerHeight;
  const sy = window.scrollY;
  const all = [...document.querySelectorAll(sel)];
  const rows = [];
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.height < 1) continue;
    let depth = 0;
    for (let p = el.parentElement; p; p = p.parentElement) if (p.matches(sel)) depth++;
    const hd = el.querySelector('h1, h2, h3');
    rows.push({
      tag: el.tagName.toLowerCase(), id: el.id || '', cls: (typeof el.className === 'string' ? el.className : '').trim().replace(/\s+/g, ' ').slice(0, 60),
      depth, topVh: +((r.top + sy) / vh).toFixed(2), heightVh: +(r.height / vh).toFixed(2),
      bg: getComputedStyle(el).backgroundColor, position: getComputedStyle(el).position,
      heading: hd ? (hd.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40) : '',
    });
    if (rows.length >= 80) break;
  }
  return { total: all.length, rows };
};

const evScrollInfo = () => ({
  scrollHeight: Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0),
  innerHeight: window.innerHeight, innerWidth: window.innerWidth,
  scrollY: window.scrollY,
});

// ---------- helpers ----------
async function safe(page, fn, arg, fallback, label) {
  try { return await page.evaluate(fn, arg); }
  catch (e) { warn(`${label} failed: ${String(e.message || e).split('\n')[0]}`); return fallback; }
}
class NavError extends Error {}

async function navigate(page) {
  const attempt = async (waitUntil) => page.goto(targetUrl, { waitUntil, timeout: NAV_TIMEOUT });
  let resp;
  try { resp = await attempt('networkidle'); }
  catch (e) {
    if (/Timeout/i.test(String(e.message))) {
      warn('networkidle timed out after 45s; retrying with waitUntil=load');
      try { resp = await attempt('load'); } catch (e2) { throw new NavError(String(e2.message || e2).split('\n')[0]); }
    } else throw new NavError(String(e.message || e).split('\n')[0]);
  }
  if (resp && resp.status() >= 400) warn(`HTTP ${resp.status()} from ${host}; the capture may be an error page`);
}

function navFail(msg) {
  console.error(`\nNavigation error: could not load ${targetUrl} (host: ${host})`);
  console.error('  ' + msg);
  const netLike = /ERR_TUNNEL|ERR_PROXY|ERR_NAME_NOT_RESOLVED|ERR_CONNECTION|ERR_INTERNET|403|Forbidden/i.test(msg);
  console.error(netLike
    ? `  This looks like a network block. If the sandbox network policy blocks ${host}, allow that domain in the environment settings (network access / allowed domains) and re-run.`
    : `  If ${host} is blocked by the sandbox network policy, allow that domain in the environment settings and re-run.`);
}

const esc = (v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ');
const code = (v) => (v === '' || v == null ? '' : '`' + esc(v).replace(/`/g, "'") + '`');
function table(headers, rows) {
  if (!rows.length) return '_none found_\n';
  return `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n` + rows.map((r) => `| ${r.map(esc).join(' | ')} |`).join('\n') + '\n';
}

// ---------- scroll-driven chrome summary ----------
function summarizeChrome(steps) {
  const byId = new Map();
  steps.forEach((s, si) => {
    for (const f of s.fixed) {
      if (!byId.has(f.id)) byId.set(f.id, { first: f, series: new Array(steps.length).fill(null) });
      byId.get(f.id).series[si] = f;
    }
  });
  const out = [];
  for (const [id, { first, series }] of byId) {
    const present = series.map((s, i) => (s ? i : -1)).filter((i) => i >= 0);
    const changes = [];
    const label = `${first.tag}${first.idAttr ? '#' + first.idAttr : ''}${first.cls ? '.' + first.cls.split(' ')[0] : ''}`;
    if (present.length < steps.length) changes.push(`present only at steps ${present.map((i) => i + 1).join(',')}`);
    const range = (key, tol, fmt = (v) => v) => {
      const vals = present.map((i) => series[i][key]);
      const min = Math.min(...vals), max = Math.max(...vals);
      if (max - min > tol) {
        const firstChange = present.find((i) => Math.abs(series[i][key] - series[present[0]][key]) > tol);
        changes.push(`${key} ${fmt(vals[0])} -> ${fmt(vals[vals.length - 1])} (range ${fmt(min)}..${fmt(max)}, first at step ${firstChange + 1})`);
      }
    };
    range('opacity', 0.02, (v) => +(+v).toFixed(2));
    range('y', 1); range('x', 1); range('h', 1); range('w', 1);
    const tf = new Set(present.map((i) => series[i].transform));
    if (tf.size > 1) changes.push(`transform changes (${tf.size} distinct values)`);
    const vis = new Set(present.map((i) => series[i].visibility));
    if (vis.size > 1) changes.push('visibility toggles');
    out.push({ id, label, position: first.position, changes, changed: changes.length > 0 });
  }
  return out;
}

// ---------- capture one viewport ----------
async function captureViewport(browser, vp, isFirst) {
  const mobile = vp.w < 700;
  const contextOpts = {
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: 1,
    isMobile: mobile, hasTouch: mobile,
    ignoreHTTPSErrors: !!args.ignoreHttps,
  };
  if (mobile) contextOpts.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
  const context = await browser.newContext(contextOpts);
  const page = await context.newPage();
  // Pointer lock disabled: pages that request it must not capture the cursor.
  await page.addInitScript(() => {
    try {
      Element.prototype.requestPointerLock = function () { return undefined; };
      Document.prototype.exitPointerLock = function () {};
    } catch (e) { /* ignore */ }
  });
  const dir = path.join(outDir, String(vp.w));
  fs.mkdirSync(dir, { recursive: true });
  const rec = { viewport: vp, dir };
  try {
    await navigate(page);
    await page.waitForTimeout(1200); // let hero intros settle
    rec.meta = await safe(page, evMeta, undefined, {}, 'meta');
    rec.assets = await safe(page, evAssets, undefined, { scripts: [], stylesheets: [], inlineScriptHits: {} }, 'assets');
    rec.fonts = await safe(page, evFonts, undefined, { faces: [], loaded: [], crossOriginSheets: 0 }, 'fonts');
    rec.typography = await safe(page, evTypography, undefined, {}, 'typography');
    rec.colors = await safe(page, evColors, undefined, { background: [], text: [] }, 'colors');
    rec.vars = await safe(page, evVars, undefined, { blockedSheets: 0, vars: [] }, 'css vars');
    rec.libsPage = await safe(page, evLibs, undefined, { globals: {}, domHints: {} }, 'libraries');
    rec.fixed = await safe(page, evFixed, undefined, [], 'fixed elements');
    rec.sections = await safe(page, evSections, undefined, { total: 0, rows: [] }, 'sections');
    rec.scroll = await safe(page, evScrollInfo, undefined, { scrollHeight: 0, innerHeight: vp.h, innerWidth: vp.w, scrollY: 0 }, 'scroll info');
    if (rec.scroll.innerWidth && rec.scroll.innerWidth !== vp.w) warn(`${vp.w}px capture: page laid out at ${rec.scroll.innerWidth}px wide (likely no <meta name="viewport">); mobile numbers reflect that layout viewport`);
    rec.totalScrollVh = rec.scroll.innerHeight ? +(rec.scroll.scrollHeight / rec.scroll.innerHeight).toFixed(2) : 0;

    // 10-step scroll with screenshot at each step
    rec.steps = [];
    await safe(page, () => window.scrollTo({ top: 0, behavior: 'instant' }), undefined, null, 'scroll reset');
    await page.waitForTimeout(STEP_WAIT);
    for (let i = 0; i < STEPS; i++) {
      const info = await safe(page, evScrollInfo, undefined, rec.scroll, 'scroll info');
      const max = Math.max(0, info.scrollHeight - info.innerHeight);
      const target = Math.round((max * i) / (STEPS - 1));
      await safe(page, (y) => window.scrollTo({ top: y, behavior: 'instant' }), target, null, `scroll step ${i + 1}`);
      await page.waitForTimeout(STEP_WAIT);
      const fixed = await safe(page, evFixedSnap, undefined, [], `fixed snapshot step ${i + 1}`);
      const after = await safe(page, evScrollInfo, undefined, info, 'scroll info');
      const file = path.join(dir, `step-${String(i + 1).padStart(2, '0')}.png`);
      try { await page.screenshot({ path: file }); }
      catch (e) { warn(`screenshot step ${i + 1} (${vp.w}) failed: ${String(e.message).split('\n')[0]}`); }
      rec.steps.push({ n: i + 1, target, scrollY: after.scrollY, scrollHeight: after.scrollHeight, file: path.relative(outDir, file), fixed });
    }
    rec.chrome = summarizeChrome(rec.steps);
  } finally {
    await context.close().catch(() => {});
  }
  return rec;
}

// ---------- markdown ----------
function libsReport(results) {
  const first = results[0];
  const scripts = first.assets.scripts.map((s) => s.toLowerCase());
  const pats = {
    lenis: /lenis/, gsap: /gsap|greensock/, ScrollTrigger: /scrolltrigger/, locomotive: /locomotive/,
    three: /three(\.min|\.module)?\.js|three@|\/three\//, 'framer-motion': /framer-motion|framerusercontent|framer\.com/, barba: /barba/,
  };
  const rows = [];
  for (const name of Object.keys(pats)) {
    const ev = [];
    if (first.libsPage.globals[name]) ev.push('window global / DOM marker');
    const urlHit = scripts.find((s) => pats[name].test(s));
    if (urlHit) ev.push('script URL');
    if (first.assets.inlineScriptHits[name]) ev.push('inline script text (weak)');
    rows.push([name, ev.length ? 'yes' : 'no', ev.join(', ')]);
  }
  return rows;
}

function buildNotes(results, navErr) {
  const f = results[0];
  const L = [];
  L.push(`# DESIGN-NOTES: ${host}`, '');
  L.push(`- URL: ${targetUrl}`);
  L.push(`- Captured: ${new Date().toISOString()}`);
  L.push(`- Viewports: ${results.map((r) => `${r.viewport.w}x${r.viewport.h}`).join(', ')}`);
  if (navErr) L.push(`- INCOMPLETE: a later viewport failed to load (${navErr})`);
  L.push('', '## Page', '');
  L.push(`- Title: ${f.meta.title || '(none)'}`);
  L.push(`- Meta description: ${f.meta.metaDescription || '(none)'}`);
  if (f.meta.themeColor) L.push(`- theme-color: ${f.meta.themeColor}`);
  L.push(`- Scripts: ${f.assets.scripts.length}, stylesheets: ${f.assets.stylesheets.length}`);
  L.push('', '## Motion and scroll libraries', '');
  L.push(table(['Library', 'Detected', 'Evidence'], libsReport(results)));
  const hints = Object.entries(f.libsPage.domHints).map(([k, v]) => `${k}: ${v}`);
  L.push('DOM hints: ' + (hints.join('; ') || 'none'), '');
  L.push('## Fonts', '');
  L.push('### @font-face rules', '');
  L.push(table(['Family', 'Weight', 'Style', 'Display', 'Source'], f.fonts.faces.map((x) => [code(x.family), x.weight, x.style, x.display, code(x.src.slice(0, 90))])));
  if (f.fonts.crossOriginSheets) L.push(`_${f.fonts.crossOriginSheets} cross-origin stylesheet(s) could not be read; see the loaded-fonts list below._`, '');
  const loaded = f.fonts.loaded.filter((x) => x.status === 'loaded');
  L.push('### Fonts actually loaded (document.fonts)', '');
  L.push(table(['Family', 'Weight', 'Style'], loaded.map((x) => [code(x.family), x.weight, x.style])));
  L.push('## Colors (12 most frequent, by element count)', '');
  const n = Math.max(f.colors.background.length, f.colors.text.length);
  const crows = [];
  for (let i = 0; i < n; i++) {
    const b = f.colors.background[i], t = f.colors.text[i];
    crows.push([i + 1, b ? code(b.hex) : '', b ? b.count : '', t ? code(t.hex) : '', t ? t.count : '']);
  }
  L.push(table(['#', 'background-color', 'count', 'color', 'count'], crows));
  L.push('## CSS custom properties on :root', '');
  L.push(table(['Name', 'Value'], f.vars.vars.map((v) => [code(v.name), code(v.value.slice(0, 100))])));
  if (f.vars.blockedSheets) L.push(`_${f.vars.blockedSheets} cross-origin stylesheet(s) could not be read; variables declared there are missing._`, '');
  L.push('## Script and stylesheet URLs', '');
  L.push('Scripts:', '', ...(f.assets.scripts.length ? f.assets.scripts.map((s) => '- ' + s) : ['- none']), '');
  L.push('Stylesheets:', '', ...(f.assets.stylesheets.length ? f.assets.stylesheets.map((s) => '- ' + s) : ['- none']), '');

  for (const r of results) {
    const tag = `${r.viewport.w}x${r.viewport.h}`;
    L.push(`## Viewport ${tag}`, '');
    L.push(`Total scroll height: **${r.totalScrollVh} viewport-heights** (${r.scroll.scrollHeight}px at ${r.scroll.innerHeight}px viewport).`, '');
    L.push('### Type scale (first visible instance of each)', '');
    L.push(table(['Element', 'Count', 'Family', 'Size', 'Weight', 'Line height', 'Letter spacing', 'Transform', 'Color'],
      Object.entries(r.typography).filter(([, v]) => v).map(([k, v]) => [k, v.count, code(v.family.slice(0, 60)), v.size, v.weight, v.lineHeight, v.letterSpacing, v.textTransform, code(v.color)])));
    const missing = Object.entries(r.typography).filter(([, v]) => !v).map(([k]) => k);
    if (missing.length) L.push(`Not present: ${missing.join(', ')}`, '');
    L.push('### Fixed and sticky elements (at scroll 0)', '');
    L.push(table(['Tag', 'Class / id', 'Position', 'z', 'x,y', 'w x h'], r.fixed.map((x) => [x.tag, code(((x.id ? '#' + x.id + ' ' : '') + x.cls).trim()), x.position, x.zIndex, `${x.rect.x},${x.rect.y}`, `${x.rect.w} x ${x.rect.h}`])));
    L.push(`### Sections (${r.sections.rows.length} of ${r.sections.total} listed; depth 0 = top level)`, '');
    L.push(table(['#', 'Tag', 'Class / id', 'Depth', 'Top (vh)', 'Height (vh)', 'Background', 'Position', 'Heading'],
      r.sections.rows.map((s, i) => [i + 1, s.tag, code(((s.id ? '#' + s.id + ' ' : '') + s.cls).trim()), s.depth, s.topVh, s.heightVh, code(s.bg), s.position, s.heading])));
    L.push('### Scroll-driven chrome', '');
    const changed = r.chrome.filter((c) => c.changed);
    const still = r.chrome.filter((c) => !c.changed);
    L.push(changed.length ? table(['Element', 'Position', 'What changed across the 10 steps'], changed.map((c) => [code(c.label), c.position, c.changes.join('; ')]))
      : '_No fixed or sticky element changed box or opacity._\n');
    if (still.length) L.push(`Stable throughout: ${still.map((c) => '`' + c.label + '`').join(', ')}`, '');
    L.push('Note: sticky elements legitimately move until they stick; read those rows as pin ranges.', '');
    L.push('### Screenshots', '');
    L.push(r.steps.map((s) => `- step ${String(s.n).padStart(2, '0')} (scrollY ${s.scrollY}px): ${s.file}`).join('\n'), '');
  }
  if (warnings.length) L.push('## Warnings', '', ...warnings.map((w) => '- ' + w), '');
  return L.join('\n');
}

// ---------- main ----------
async function main() {
  const chrome = findChrome(args.chrome);
  const launchOpts = {
    headless: true,
    args: ['--disable-features=PointerLock', '--no-sandbox', '--hide-scrollbars'],
  };
  if (chrome) launchOpts.executablePath = chrome; else warn('No Chrome found via --chrome, SCROLLCRAFT_CHROME, PLAYWRIGHT_BROWSERS_PATH, /opt/pw-browsers or PATH; using playwright default');
  const proxy = proxyFromEnv();
  if (proxy) launchOpts.proxy = proxy;
  let browser;
  try { browser = await chromium.launch(launchOpts); }
  catch (e) { console.error('Could not launch Chromium: ' + String(e.message).split('\n')[0]); process.exit(1); }
  console.log(`Using ${chrome || 'playwright default browser'}`);

  const results = [];
  let navErr = null;
  try {
    for (let i = 0; i < viewports.length; i++) {
      const vp = viewports[i];
      console.log(`Capturing ${vp.w}x${vp.h} ...`);
      try { results.push(await captureViewport(browser, vp, i === 0)); }
      catch (e) {
        if (e instanceof NavError) { navErr = e.message; navFail(e.message); break; }
        warn(`viewport ${vp.w}x${vp.h} failed: ${String(e.message || e).split('\n')[0]}`);
      }
    }
  } finally { await browser.close().catch(() => {}); }

  if (!results.length) {
    if (!navErr) console.error('Capture produced no results.');
    process.exit(navErr ? 2 : 1);
  }
  fs.writeFileSync(path.join(outDir, 'raw.json'), JSON.stringify({ url: targetUrl, host, capturedAt: new Date().toISOString(), warnings, results }, null, 2));
  fs.writeFileSync(path.join(outDir, 'DESIGN-NOTES.md'), buildNotes(results, navErr));
  console.log(`Wrote ${path.join(outDir, 'DESIGN-NOTES.md')} and raw.json (${results.length} viewport(s)).`);
  if (navErr) process.exit(2);
}
main().catch((e) => { console.error('Unexpected failure: ' + (e && e.stack || e)); process.exit(1); });
