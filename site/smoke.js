/* smoke.js: pause the hero smoke when it cannot be seen. The SVG filters are
   promoted (will-change: transform) so they rasterize once and only the
   transform animates; offscreen or in a hidden tab even that stops.
   Reduced motion is handled in CSS (first frame held). */
(function () {
  'use strict';
  var els = document.querySelectorAll('.ethereal');
  if (!els.length) return;
  Array.prototype.forEach.call(els, function (el) {
    var off = false;
    function apply() { el.classList.toggle('is-paused', off || document.hidden); }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        off = !entries[entries.length - 1].isIntersecting;
        apply();
      }).observe(el);
    }
    document.addEventListener('visibilitychange', apply);
    apply();
  });
})();
