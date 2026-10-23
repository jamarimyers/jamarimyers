/* doors.js: the doors, the folio and the page prep the engine depends on.
   Load it in <head> as a plain (render-blocking, ~3KB) script so the
   pageswap / pagereveal listeners exist before the first render. Its DOM
   prep runs on DOMContentLoaded, on `document`, which is before the page's
   ScrollCraft.mount() call (registered on `window`), so every attribute it
   rewrites is in place when the engine reads them.

   1. View transitions. On pageswap every door image loses its
      view-transition-name except the one whose door links to the navigation
      target, and only if it is on screen (the hero CTA also opens osmo.html,
      and an offscreen photo must not fly in from below the fold). On
      pagereveal names that are offscreen drop out, and <html> gets
      .is-arriving then .is-arrived so a pillar title can fade in after the
      morph. Without support nothing here runs and the doors are plain links.
   2. Phone cues. Off the desktop layout, each [data-cue-phone] (or, on short
      phones, [data-cue-short]) is copied into data-sc-cue, so chapter lines
      share one slot and take turns.
   3. Reduced motion. Act counters start at their final value.
   4. Accent words. The engine's kinetic split rebuilds a heading from its
      text, which drops the <em> accent; this puts it back after each split.
   5. The folio: "01 Building" under the nav, from each act's --sc-p. */
(function () {
  'use strict';
  var html = document.documentElement;
  var DESK = '(min-width: 860px) and (min-aspect-ratio: 1/1)';
  var SHORT = '(max-height: 699px)';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var each = function (sel, fn, root) { Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn); };

  // ---- 1. view transitions -------------------------------------------------
  function norm(u) {
    var p;
    try { p = new URL(u, location.href).pathname; } catch (e) { return String(u); }
    return p.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '');
  }
  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 &&
           r.top < innerHeight && r.left < innerWidth;
  }
  var NAMED = '.door__img, .pillar-head__img';

  addEventListener('pageswap', function (e) {
    if (!e.viewTransition) return;
    var act = e.activation, url = act && act.entry && act.entry.url;
    var target = url ? norm(url) : null;
    each(NAMED, function (img) {
      var door = img.closest('a[data-door]');
      var keep = inView(img) && (door ? target !== null && norm(door.href) === target : true);
      img.style.viewTransitionName = keep ? '' : 'none';
    });
  });

  addEventListener('pagereveal', function (e) {
    var vt = e.viewTransition;
    each(NAMED, function (img) {
      img.style.viewTransitionName = (!vt || inView(img)) ? '' : 'none';
    });
    var arrive = function () { html.classList.add('is-arrived'); };
    if (vt) { html.classList.add('is-arriving'); vt.ready.then(arrive, arrive); }
    else arrive();
  });

  // ---- 4. accent words survive the kinetic split -----------------------------
  function tokens(el) {
    var chars = [];
    (function walk(n, em) {
      for (var c = n.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) for (var i = 0; i < c.data.length; i++) chars.push([c.data[i], em]);
        else if (c.nodeType === 1) walk(c, em || c.tagName === 'EM');
      }
    })(el, false);
    var out = [], cur = null;
    chars.forEach(function (ch) {
      if (/\s/.test(ch[0])) { cur = null; return; }
      if (!cur) { cur = []; out.push(cur); }
      cur.push(ch);
    });
    return out;
  }
  var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  function rewrap(el, toks) {
    var units = el.querySelectorAll('.sc-split__i');
    if (!units.length) return;
    var k = 0;
    Array.prototype.forEach.call(units, function (u) {
      var words = u.textContent.split(/\s+/).filter(Boolean);
      var mine = toks.slice(k, k + words.length);
      k += words.length;
      if (mine.length !== words.length || !mine.some(function (t) { return t.some(function (c) { return c[1]; }); })) return;
      // flatten to characters with the joining spaces, a space is accented
      // only when both neighbours are
      var flat = [];
      mine.forEach(function (t, i) {
        if (i) flat.push([' ', !!(mine[i - 1][mine[i - 1].length - 1][1] && t[0][1])]);
        flat.push.apply(flat, t);
      });
      var s = '', open = false;
      flat.forEach(function (c) {
        if (c[1] && !open) { s += '<em>'; open = true; }
        if (!c[1] && open) { s += '</em>'; open = false; }
        s += esc(c[0]);
      });
      if (open) s += '</em>';
      u.innerHTML = s;
    });
  }
  function accents() {
    if (!('MutationObserver' in window)) return;
    each('[data-sc-kinetic]', function (el) {
      if (!el.querySelector('em')) return;
      var toks = tokens(el);
      new MutationObserver(function () { rewrap(el, toks); }).observe(el, { childList: true });
    });
  }

  // ---- 5. folio ------------------------------------------------------------
  function folio() {
    var box = document.querySelector('.folio');
    var acts = document.querySelectorAll('[data-folio]');
    if (!box || !acts.length) return;
    var num = box.querySelector('.folio__n'), name = box.querySelector('.folio__name');
    var cur = null, ticking = false;
    function update() {
      ticking = false;
      var next = null;
      for (var i = 0; i < acts.length; i++) {
        var a = acts[i];
        var p = parseFloat(a.style.getPropertyValue('--sc-p')) || 0;
        var from = parseFloat(a.getAttribute('data-folio-from')) || 0;
        if (p > Math.max(from, 0.001) && p < 0.72) { next = a; break; }
      }
      if (next === cur) return;
      if (next) {
        num.textContent = next.getAttribute('data-folio');
        name.textContent = next.getAttribute('data-folio-name');
      }
      box.classList.toggle('is-on', !!next);
      cur = next;
    }
    var queue = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    // Registered after the engine's own listener, so this frame's rAF runs
    // after the engine has written --sc-p.
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue, { passive: true });
    queue();
  }

  // ---- prep, before the engine mounts -------------------------------------
  function prep() {
    var desk = matchMedia(DESK).matches;
    var short = !desk && matchMedia(SHORT).matches;
    if (!desk) {
      each('[data-cue-phone],[data-cue-short]', function (el) {
        var v = (short && el.getAttribute('data-cue-short')) || el.getAttribute('data-cue-phone');
        if (v) el.setAttribute('data-sc-cue', v);
      });
    }
    if (reduce) {
      each('[data-sc-act] [data-sc-count]', function (el) {
        var n = (el.getAttribute('data-sc-count') || '').trim().split(/\s+/);
        if (n.length > 1) el.setAttribute('data-sc-count', n[1] + ' ' + n[1]);
      });
    }
    accents();
    setTimeout(folio, 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prep);
  else prep();
})();
