/* ==========================================================================
   handle.js: the seam, and the handle that lets you pull it.

   Writes --split (0..1, 3 decimals) on <html> every frame it changes, derived
   from the engine's per-act --sc-p:
     act 1  holds 0.5
     act 2  leans 0.45..0.55 toward whichever ledger column is landing
     act 3  holds 0.5
     act 4  travels 0.5 -> 1.0 (fast first half, slow settle), scroll owns it
     act 5+ stays at 1.0
   The handle (acts 1 to 3): drag the seam on a fine pointer, swipe across the
   hero on touch, or focus it and use the arrow keys (Home and End go to the
   limits). On release it springs
   back to wherever the scroll says it should be. Disabled under reduced motion.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var smallMQ = matchMedia('(max-width: 860px)');
  var fineMQ = matchMedia('(hover: hover) and (pointer: fine)');

  var acts = [].slice.call(document.querySelectorAll('[data-sc-act]'));
  var hero = acts[0], ledger = acts[1], gap = acts[3];
  var seam = document.querySelector('.seam');
  var grip = document.querySelector('.seam__grip');
  var ticks = [].slice.call(document.querySelectorAll('.seam__ticks i'));
  var colF = ledger.querySelector('.col--field');
  var colD = ledger.querySelector('.col--desk');

  var MIN = 0.08, MAX = 0.92;

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function smooth(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
  function prog(el) { return parseFloat(el.style.getPropertyValue('--sc-p')) || 0; }
  function win(el) {
    var a = (el.getAttribute('data-sc-reveal-at') || '0 1').trim().split(/\s+/).map(parseFloat);
    return [a[0] || 0, Math.max(a[1] || 1, (a[0] || 0) + 0.001)];
  }

  // cubic-bezier(x1, y1, x2, y2) as a function of t, solved by bisection.
  function bezier(x1, y1, x2, y2) {
    function c(a, b, t) { var u = 1 - t; return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t; }
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 24; i++) { t = (lo + hi) / 2; if (c(x1, x2, t) < x) lo = t; else hi = t; }
      return c(y1, y2, t);
    };
  }
  // Fast through the first half of the travel, a long slow settle in the last third.
  var collapse = bezier(0.42, 0, 0.18, 1);
  var TRAVEL = 0.74;           // fraction of act 4 the seam travel occupies

  // ---- state ---------------------------------------------------------------
  var mode = 'scroll';          // scroll | drag | key | spring
  var d = 0.5, vel = 0, manual = 0.5;
  var lastT = performance.now();
  var idx = 0, lastIdx = -1;

  function put(el, k, v) {
    var w = el.__w || (el.__w = {});
    if (w[k] === v) return;
    w[k] = v;
    el.style.setProperty(k, v);
  }

  function currentAct() {
    var mid = innerHeight / 2, i, r, found = 0;
    for (i = 0; i < acts.length; i++) {
      r = acts[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) { found = i; break; }
      if (r.top > mid) { found = Math.max(0, i - 1); break; }
      found = i;
    }
    return found;
  }

  function handleAllowed() { return !reduce && idx <= 2; }

  function scrollTarget() {
    var lean = 0;
    if (!smallMQ.matches) {
      var p2 = prog(ledger), wf = win(colF), wd = win(colD);
      var rf = smooth((p2 - wf[0]) / (wf[1] - wf[0]));
      var rd = smooth((p2 - wd[0]) / (wd[1] - wd[0]));
      lean = 0.05 * (Math.sin(Math.PI * rf) - Math.sin(Math.PI * rd));
    }
    var p4 = prog(gap);
    var x = clamp(p4 / TRAVEL, 0, 1);
    var c = reduce ? x : collapse(x);
    return { t: 0.5 + lean + 0.5 * c, lean: lean, c: c, p4: p4 };
  }

  function release() { if (mode === 'drag' || mode === 'key') { mode = reduce ? 'scroll' : 'spring'; } }

  // ---- frame ---------------------------------------------------------------
  function frame(now) {
    var dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
    lastT = now;

    idx = currentAct();
    if (!handleAllowed()) release();

    var T = scrollTarget();
    var t = T.t;

    if (mode === 'scroll') { d = t; vel = 0; }
    else if (mode === 'drag' || mode === 'key') { d = manual; vel = 0; }
    else if (mode === 'spring') {
      // Critically damped: no overshoot, settles in about 400ms.
      var w = 17;
      var acc = -w * w * (d - t) - 2 * w * vel;
      vel += acc * dt;
      var nd = d + vel * dt;
      if ((d - t) * (nd - t) < 0) { nd = t; vel = 0; }
      d = nd;
      if (Math.abs(d - t) < 0.0008 && Math.abs(vel) < 0.01) { d = t; mode = 'scroll'; }
    }

    var dev = d - t;
    var follow = dev + T.lean;
    put(root, '--split', d.toFixed(3));
    var pct = Math.round(clamp(d, MIN, MAX) * 100);
    if (grip && grip.__v !== pct) {
      grip.__v = pct;
      grip.setAttribute('aria-valuenow', pct);
      grip.setAttribute('aria-valuetext', 'Field ' + pct + ' percent, desk ' + (100 - pct) + ' percent');
    }
    put(root, '--follow', follow.toFixed(4));
    put(root, '--fsf', clamp(76 + (d - 0.5) * 48, 62, 125).toFixed(1));
    put(root, '--fsd', clamp(112 - (d - 0.5) * 40, 62, 125).toFixed(1));
    put(root, '--seam-o', (1 - smooth((d - 0.9) / 0.08)).toFixed(3));
    // The side labels belong to the comparison; they leave as soon as the collapse starts.
    put(root, '--label-o', (1 - smooth(T.c / 0.12)).toFixed(3));
    // Acts 1 to 3 are off screen once the collapse has begun; hold them at their act-3 values.
    var held = T.p4 > 0;
    put(ledger, '--split', (held ? 0.5 : d).toFixed(3));
    put(ledger, '--follow', (held ? 0 : follow).toFixed(4));
    put(ledger, '--fsf', (held ? 76 : clamp(76 + (d - 0.5) * 48, 62, 125)).toFixed(1));
    put(ledger, '--fsd', (held ? 112 : clamp(112 - (d - 0.5) * 40, 62, 125)).toFixed(1));

    var bloom = smooth((T.p4 - 0.5) / 0.3);
    put(gap, '--bloom', bloom.toFixed(3));
    put(gap, '--c4', T.c.toFixed(3));

    // What the verification harness sees as this page's own visual state.
    var hold = idx === 2 && prog(acts[2]) < 0.3;
    if (seam.__s !== d.toFixed(3) + '|' + bloom.toFixed(2)) {
      seam.__s = d.toFixed(3) + '|' + bloom.toFixed(2);
      seam.setAttribute('data-sc-verify-state', seam.__s);
    }
    if (seam.__h !== hold) { seam.__h = hold; seam.setAttribute('data-sc-verify-hold', hold ? 'true' : 'false'); }

    if (idx !== lastIdx) {
      lastIdx = idx;
      // Progress ruler: every act up to the one in view is filled.
      ticks.forEach(function (t, i) { t.classList.toggle('is-on', i <= idx); });
      if (grip) grip.classList.toggle('is-off', !handleAllowed() || !fineMQ.matches);
    }

    requestAnimationFrame(frame);
  }

  // ---- pointer: the grip ---------------------------------------------------
  function fromX(x) { return clamp(x / innerWidth, MIN, MAX); }

  if (grip && !reduce) {
    grip.classList.toggle('is-off', !fineMQ.matches);
    grip.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || !handleAllowed()) return;
      e.preventDefault();
      grip.focus({ preventScroll: true });
      mode = 'drag'; manual = fromX(e.clientX);
      root.classList.add('is-dragging');
      try { grip.setPointerCapture(e.pointerId); } catch (err) {}
    });
    addEventListener('pointermove', function (e) {
      if (mode !== 'drag' || e.pointerType === 'touch') return;
      manual = fromX(e.clientX);
    });
    var up = function () {
      if (mode === 'drag' && root.classList.contains('is-dragging')) { root.classList.remove('is-dragging'); release(); }
    };
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);

    // Keyboard: arrows move the seam in 5% steps, Home and End go to the limits, Escape lets go.
    grip.addEventListener('keydown', function (e) {
      if (!handleAllowed()) return;
      var step = 0;
      if (e.key === 'ArrowLeft') step = -0.05;
      else if (e.key === 'ArrowRight') step = 0.05;
      else if (e.key === 'Home') step = MIN - 2;
      else if (e.key === 'End') step = 2;
      else if (e.key === 'Escape') { release(); return; }
      if (!step) return;
      e.preventDefault();
      manual = clamp((mode === 'key' || mode === 'drag' ? manual : d) + step, MIN, MAX);
      mode = 'key';
    });
    grip.addEventListener('blur', function () { if (mode === 'key') release(); });
  }

  // ---- touch: a horizontal swipe across the hero moves the seam -----------
  var heroStage = hero.querySelector('[data-sc-stage]');
  if (heroStage && !reduce) {
    var tId = null, x0 = 0, y0 = 0, d0 = 0.5, live = false;
    heroStage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' || !handleAllowed()) return;
      tId = e.pointerId; x0 = e.clientX; y0 = e.clientY; d0 = d; live = false;
    });
    heroStage.addEventListener('pointermove', function (e) {
      if (e.pointerId !== tId) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      if (!live) {
        if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { tId = null; return; }
        if (Math.abs(dx) < 10) return;
        live = true; mode = 'drag';
      }
      manual = clamp(d0 + dx / innerWidth, MIN, MAX);
    });
    var end = function (e) {
      if (e.pointerId !== tId) return;
      tId = null;
      if (live) { live = false; release(); }
    };
    heroStage.addEventListener('pointerup', end);
    heroStage.addEventListener('pointercancel', end);
  }

  requestAnimationFrame(frame);
})();
