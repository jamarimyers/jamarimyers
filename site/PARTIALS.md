# PARTIALS: shared markup for jamarimyers.com v2

The shared files are frozen: `site.css`, `nav.js`, `doors.js`, `smoke.js`, `scrollcraft.js`, `scrollcraft.css`. A page is built from the classes below and needs no CSS of its own. `home.css` is for `index.html` only. Every visible string comes from `scrollcraft/builds/jamarimyers-v2/COPY-v2.md`. That means no em or en dashes, no jersey number and no "cornerback".

Breakpoints: the desktop layout is `(min-width: 860px) and (min-aspect-ratio: 1/1)`, and everything else gets the phone layout, portrait tablets included. The nav alone switches at a width of 860px.

## 1. The `<head>` block (every page)

Copy this as is. Change only the four marked lines (title, description, canonical, og:url), and drop `og:image:alt` if you change the image.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Building Osmo, Jamari Myers</title>                                    <!-- per page -->
<meta name="description" content="...">                                       <!-- per page, under 160 characters -->
<link rel="canonical" href="https://jamarimyers.com/osmo.html">               <!-- per page -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Jamari Myers">
<meta property="og:title" content="Building Osmo, Jamari Myers">              <!-- same as title -->
<meta property="og:description" content="...">                                <!-- same as description -->
<meta property="og:url" content="https://jamarimyers.com/osmo.html">          <!-- per page -->
<meta property="og:image" content="https://jamarimyers.com/assets/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Jamari Myers">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0d1117">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path d='M0 0H32L0 32Z' fill='%230d1117'/><path d='M32 0V32H0Z' fill='%239db8d6'/></svg>">
<link rel="preload" href="assets/fonts/instrument-serif-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/instrument-serif-latin-400-italic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="scrollcraft.css">
<link rel="stylesheet" href="site.css">
<script src="doors.js"></script>
<script src="scrollcraft.js" defer></script>
<script src="nav.js" defer></script>
<noscript><style>[data-sc-cue],[data-sc-in],[data-sc-stagger]>*{opacity:1!important;transform:none!important}[data-sc-stage]{position:relative;min-height:100svh}</style></noscript>
</head>
```

At the very end of `<body>`:

```html
<script>addEventListener('DOMContentLoaded',function(){if(window.ScrollCraft)ScrollCraft.mount(document.body);});</script>
```

Why the order matters:
- `doors.js` is a plain script in `<head>`. It has to be render-blocking so its `pageswap` and `pagereveal` listeners exist before the first render. Its DOM prep runs on `DOMContentLoaded` on `document`, so it always runs before the mount, which listens on `window`.
- `scrollcraft.js` and `nav.js` are `defer`. Pages with smoke (the 404) also add `<script src="smoke.js" defer></script>`.
- Keep the `<noscript>` rule. Pages with no pinned acts can leave the `[data-sc-stage]` part in, because it does nothing there.
- Do not use Google Fonts and do not add other stylesheets, apart from `pages.css` for resume, connect and 404.

## 2. Nav (every page)

Put this first in `<body>`. Set `aria-current="page"` on the link for the current page, in both the bar and the menu. Pillar, resume, connect and 404 pages ship the nav already solid: add `is-solid` and `data-nav-solid`, which tells `nav.js` to keep it solid at the top of the page. Home leaves both off.

```html
<a class="skip" href="#main">Skip to content</a>

<header class="nav is-solid" data-nav-solid>
  <a class="nav__mark" href="index.html">Jamari Myers</a>
  <div class="nav__right">
    <nav class="nav__links" aria-label="Primary">
      <a href="osmo.html" aria-current="page">Building</a>
      <a href="finance.html">Finance</a>
      <a href="creative.html">Creative</a>
      <a href="journey.html">Journey</a>
      <a href="resume.html">Resume</a>
    </nav>
    <a class="nav__cta" href="connect.html">Connect</a>
    <details class="menu">
      <summary aria-label="Open the menu"><span class="menu__bars" aria-hidden="true"></span></summary>
      <div class="menu__panel">
        <nav aria-label="Menu">
          <ul class="menu__list">
            <li><a href="osmo.html" aria-current="page">Building</a></li>
            <li><a href="finance.html">Finance</a></li>
            <li><a href="creative.html">Creative</a></li>
            <li><a href="journey.html">Journey</a></li>
            <li><a href="resume.html">Resume</a></li>
            <li><a href="connect.html">Connect</a></li>
          </ul>
        </nav>
        <a class="menu__email t-body" href="mailto:jamari@osmoperformance.com">jamari@osmoperformance.com</a>
      </div>
    </details>
  </div>
</header>
```

On connect.html, put `aria-current="page"` on `.nav__cta` and on the menu's Connect link. On home it goes on `.nav__mark`. Then open `<main id="main">`.

The menu works without JS (details/summary). `nav.js` adds the following: the "Close the menu" label, closing on Escape (focus returns to the summary), closing on a link click, closing when focus leaves the menu, closing when the window widens to 860px, and `html.is-locked` (scroll lock) while the menu is open.

## 3. Footer (every page except home)

Put this after `</main>`. Home uses the same `.footer` row inside its running-text `.close`.

```html
<footer class="site-footer">
  <div class="footer">
    <a class="footer__mark" href="index.html">Jamari Myers</a>
    <nav aria-label="Footer">
      <ul class="footer__links t-label">
        <li><a href="resume.html">Resume</a></li>
        <li><a href="connect.html">Connect</a></li>
        <li><a href="https://github.com/jamarimyers">GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/jamari-myers/">LinkedIn</a></li>
      </ul>
    </nav>
    <p class="footer__line t-label">Jamari Myers, Brown University ’27, 2026</p>
  </div>
</footer>
```

The running-text close is available to any page (connect.html leads with it):

```html
<section class="close"><div class="close__inner">
  <p class="t-label">Write to me</p>
  <a class="close__email" href="mailto:jamari@osmoperformance.com">jamari@<wbr>osmoperformance.com</a>
</div></section>
```

## 4. View-transition names per pillar

| Pillar page | Name | Photo | Header object-position, desktop / phone |
|---|---|---|---|
| osmo.html | `door-osmo` | portrait-blazer | 50% 30% / 48% 50% |
| finance.html | `door-finance` | headshot | 50% 25% / 50% 50% |
| creative.html | `door-creative` | rome | 50% 42% / 50% 40% |
| journey.html | `door-journey` | field-red-lit | 55% 12% / 50% 10% |

Do not write `view-transition-name` yourself. `site.css` sets it from attributes:
- `[data-pillar="<pillar>"] .pillar-head__img` sets the header image name (and its object-position).
- `[data-door="<pillar>"] .door__img` sets the name on any door image, including the next-door row.

On a given page, each name may appear at most once. In practice that means at most one door per pillar. `doors.js` strips names that are offscreen or not being navigated to. Groups animate for 560ms on `--ease` and the root crossfades in 320ms. All of it is off under reduced motion, and the door is a plain link where view transitions are unsupported.

## 5. Pillar components (all in site.css)

### Pillar header
```html
<header class="pillar-head" data-pillar="osmo">
  <div class="pillar-head__band">
    <img class="pillar-head__img" src="assets/photos/portrait-blazer-1000.webp"
         srcset="assets/photos/portrait-blazer-600.webp 600w, assets/photos/portrait-blazer-1000.webp 1000w, assets/photos/portrait-blazer-1492.webp 1492w"
         sizes="100vw" width="1000" height="1000" alt="(pillar header ALT from COPY-v2.md)" fetchpriority="high" decoding="async">
  </div>
  <div class="pillar-head__copy wrap">
    <p class="t-label">Building · Osmo</p>
    <h1 class="t-chapter">The move after the <em>number</em>.</h1>
    <p class="t-lede">One-line descriptor.</p>
  </div>
</header>
```
The header copy is visible by default. During a view-transition arrival, `doors.js` sets `html.is-arriving`, and `.pillar-head__copy` fades in with a 12px rise (420ms, 200ms delay) once `.is-arrived` lands. Photo srcsets: each photo in `assets/photos/manifest.json` comes at `-600`, `-1000` and full width (`headshot-1229`, `rome-1152`, `field-red-lit-1026`, `portrait-blazer-1492`).

### Sections
```html
<section class="section section--first" aria-labelledby="origin">   <!-- first one only gets --first -->
  <div class="wrap">
    <div class="section__head"><h2 class="t-section" id="origin">Origin</h2></div>
    <div class="prose t-body"><p>...</p><p>...</p></div>
  </div>
</section>
```
Add `data-sc-in` to any block that should fade in once on entry. Add `data-sc-in data-sc-stagger="60"` to a parent to stagger its children. A counter in prose: `<span class="count" data-final="48" aria-hidden="true"><span data-sc-count="0 48">48</span></span><span class="vh">48</span>`. Outside a pinned act it ticks once on entry.

### Ledger (role and fact pairs)
```html
<dl class="ledger">
  <dt class="t-label">Role</dt><dd class="t-body">Founder, Stateframe Technologies, Inc.</dd>
  <dt class="t-label">Stack</dt><dd class="t-body">TypeScript, React Native, Expo, Node.js, Supabase.</dd>
</dl>
```

### "What it taught me" plate
```html
<section class="taught" aria-labelledby="taught">
  <div class="wrap"><div class="taught__inner">
    <h2 class="t-label" id="taught">What it taught me</h2>
    <blockquote><p>His words, untouched.</p></blockquote>
  </div></div>
</section>
```

### Next-door row (the end of each pillar)
```html
<section aria-labelledby="next-title">
  <h2 class="vh" id="next-title">Keep going</h2>
  <div class="next">
    <a class="next__door" href="finance.html" data-door="finance">
      <img class="door__img" src="assets/photos/headshot-1000.webp" srcset="..." sizes="(min-width: 860px) 60vw, 100vw" width="1000" height="1250" alt="" loading="lazy" decoding="async">
      <span class="next__scrim" aria-hidden="true"></span>
      <span class="next__copy"><span class="t-label">Next</span><span class="t-section">Finance</span></span>
    </a>
    <a class="next__connect" href="connect.html">
      <span class="t-label">Connect</span>
      <span><span class="t-section">Title from COPY</span><span class="next__email t-body">jamari@osmoperformance.com</span></span>
    </a>
  </div>
</section>
```
Use only the class `door__img` on the next-door image, because that is what carries the morph. Its object-position is set to the target header's desktop crop.

### Timeline (journey)
```html
<ol class="timeline">
  <li class="tl">
    <p class="tl__date t-label">August 2023 to January 2025</p>
    <span class="tl__rail" aria-hidden="true"></span>
    <div class="tl__body"><h3>Brown football</h3><p class="t-body">...</p></div>
    <div class="tl__media tl__media--pair">
      <div><img class="pos-field-catch" src="..." alt="..." loading="lazy"></div>
      <div><img class="pos-field-red-lit" src="..." alt="..." loading="lazy"></div>
    </div>
  </li>
  <li class="tl">  <!-- type plate, no photo -->
    <p class="tl__date t-label">...</p><span class="tl__rail" aria-hidden="true"></span>
    <div class="tl__body">...</div>
    <div class="plate" aria-hidden="true"><span class="plate__place">Allen, Texas</span><span class="plate__label t-label">Hometown</span></div>
  </li>
  <li class="tl tl--quiet">  <!-- quiet plate: no media -->
    <p class="tl__date t-label">...</p><span class="tl__rail" aria-hidden="true"></span>
    <div class="tl__body"><h3>Stopping</h3><blockquote><p>Voice anchor 1.</p></blockquote></div>
  </li>
</ol>
```
Single photo: `<div class="tl__media"><img class="pos-rome" ...></div>`. Crop classes: `pos-field-catch` (75% 40%), `pos-field-red-lit` (50% 20%), `pos-rome` (50% 45%), `pos-portrait-blazer` (48% 50%), `pos-bansko` (50% 88%).

### Partner cards (creative)
```html
<div class="partners" data-sc-spotlight>
  <article class="partner partner--feature">   <!-- E-Boats Sardinia, spans both rows -->
    <p class="partner__type t-label">Boat rental, Sardinia</p>
    <h3>E-Boats Sardinia</h3>
    <blockquote>Quote, no em dashes.</blockquote>
    <p class="partner__cite t-label">Name, role</p>
    <a class="tlink" href="https://www.instagram.com/...">Instagram</a>
  </article>
  <article class="partner">...Crown Tours...</article>
  <article class="partner">...Nailbar Gamax...</article>
</div>
```

### Gallery of eight (creative)
```html
<ul class="gallery">
  <li><figure class="gallery__item">
    <div class="gallery__media"><img src="assets/photos/rome-600.webp" srcset="assets/photos/rome-600.webp 600w, assets/photos/rome-1000.webp 1000w" sizes="(min-width: 860px) 25vw, 50vw" width="600" height="800" alt="..." loading="lazy" decoding="async"></div>
    <figcaption><span class="gallery__place">Rome</span><span class="gallery__country t-label">Italy</span></figcaption>
  </figure></li>
</ul>
```
Bansko takes `class="pos-bansko"` on its img.

### Stats row (home and creative, same figures and date)
Copy the `<section class="stats">` block from `index.html` as is, including the visible "as of [DATE]" label.

### Smoke (404, one layer)
Copy `.ethereal` from `index.html` without `svg.smoke--b`, inside a `position:relative; overflow:hidden` container, and load `smoke.js`.

## 6. Utilities
- `.wrap` gives the centred column (`--maxw`, `--gutter`). `.vh` is visually hidden.
- Type: `.t-hero`, `.t-chapter`, `.t-section`, `.t-lede`, `.t-body`, `.t-label`, `.t-figure`. Headings end on `<em>` (italic, `--accent-2`). Inside a `data-sc-kinetic` heading the `<em>` survives the split (doors.js puts it back).
- `.btn .btn--primary`, `.btn .btn--ghost` (48px), `.tlink` (44px uppercase text link), `.prose a`.
- `.count` (ghost-sized counter) and `.unit` (accent unit after a figure).

## 7. Run and verify (no build step)

The site is static HTML, CSS and vanilla JS. There is no framework and no bundler, and `site/` is deployed as is. That was a deliberate choice. The engine is a zero-dependency runtime that reads hand-authored `data-sc-*` markup, so a framework would add hydration cost and a toolchain without adding anything a five-page site needs. What it costs: the nav, head and footer partials are copied by hand (this file is the source of truth), and nothing type-checks the markup. Instead, the harness and the smoke checks below catch regressions.

```
export NODE_PATH=<scratchpad>/tools/node_modules            # playwright-core, lighthouse
export SCROLLCRAFT_CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
node .claude/skills/scroll-craft/scripts/serve.mjs --root site --port 4610 &
S=.claude/skills/scroll-craft/scripts/shoot.mjs; U=http://127.0.0.1:4610/index.html
node $S --url $U --out scrollcraft/lab/v2/index
node $S --url $U --out scrollcraft/lab/v2/index-m --width 390 --height 844
node $S --url $U --out scrollcraft/lab/v2/index-rm --reduced-motion
grep -nE "—|–|cornerback" site/*.html                       # must print nothing
```
Each run must report "no dead scroll detected" and "all cues clear 4.5:1". The scroll positions in a check script must use `scrollTo({top, behavior: 'instant'})`, because `scrollcraft.css` sets smooth scrolling and a plain `scrollTo` only starts an animation.
