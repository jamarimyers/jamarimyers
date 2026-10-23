/* nav.js: the shared nav. Solid state after 30px (pages that ship
   data-nav-solid stay solid), and the details/summary menu: accessible name,
   Escape, link-click and focus-leave close, body scroll lock. The menu opens
   and closes without this file; this only adds the niceties. */
(function () {
  'use strict';
  var html = document.documentElement;
  var nav = document.querySelector('.nav');
  if (!nav) return;

  var always = nav.hasAttribute('data-nav-solid');
  var ticking = false;
  function paint() {
    ticking = false;
    nav.classList.toggle('is-solid', always || (window.scrollY || 0) > 30);
  }
  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(paint); }
  }, { passive: true });
  paint();

  var menu = nav.querySelector('details.menu');
  if (!menu) return;
  var summary = menu.querySelector('summary');

  function sync() {
    var open = menu.open;
    html.classList.toggle('is-locked', open);
    nav.classList.toggle('is-menu-open', open);
    if (summary) summary.setAttribute('aria-label', open ? 'Close the menu' : 'Open the menu');
  }
  menu.addEventListener('toggle', sync);

  function close(refocus) {
    if (!menu.open) return;
    menu.open = false;
    sync();
    if (refocus && summary) summary.focus();
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') close(true);
  });
  Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) {
    a.addEventListener('click', function () { close(false); });
  });
  menu.addEventListener('focusout', function (e) {
    var to = e.relatedTarget;
    if (to && !menu.contains(to)) close(false);
  });
  var wide = matchMedia('(min-width: 860px)');
  var onWide = function (e) { if (e.matches) close(false); };
  if (wide.addEventListener) wide.addEventListener('change', onWide);
  else if (wide.addListener) wide.addListener(onWide);
  // bfcache restore: never come back with the page locked
  addEventListener('pageshow', function () { sync(); paint(); });
  sync();
})();
