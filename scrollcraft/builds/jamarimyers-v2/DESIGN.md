# jamarimyers.com v2: design spec

Values for the approved plan, which owns direction. Desktop = `(min-width:860px) and (min-aspect-ratio:1/1)`; all else, portrait tablets included, is phone. Short phone = `(max-height:699px)`.

## 1. Tokens

```css
@font-face{font-family:"Instrument Serif";src:url(assets/fonts/instrument-serif-latin-400-normal.woff2) format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"Instrument Serif";src:url(assets/fonts/instrument-serif-latin-400-italic.woff2) format("woff2");font-weight:400;font-style:italic;font-display:swap}
@font-face{font-family:"Inter Variable";src:url(assets/fonts/inter-latin-wght-normal.woff2) format("woff2");font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:"Instrument Serif Fallback";src:local("Georgia");size-adjust:75.96%;ascent-override:130.33%;descent-override:40.81%;line-gap-override:0%}
@font-face{font-family:"Inter Fallback";src:local("Arial");size-adjust:107.48%;ascent-override:90.13%;descent-override:22.44%;line-gap-override:0%}
:root{
  --bg:#0d1117; --surface:#131920; --surface-2:#1a222e; --deep:#0a0d12;
  --border:rgba(255,255,255,.06); --border-strong:rgba(232,237,242,.22);
  --text:#e8edf2; --white:#f0f4f8; --text-2:#a7aeb6; --text-3:#8b9299;
  --accent:#7c9cbf; --accent-2:#9db8d6; --nav-solid:rgba(13,17,23,.92);
  --serif:"Instrument Serif","Instrument Serif Fallback",Georgia,serif;
  --sans:"Inter Variable","Inter Fallback",Arial,system-ui,sans-serif;
  --s-1:.25rem; --s-2:.5rem; --s-3:.75rem; --s-4:1rem; --s-5:1.5rem; --s-6:2rem; --s-7:3rem; --s-8:4rem; --s-9:6rem;
  --section:clamp(4rem,9vw,9rem); --gutter:clamp(1.25rem,5vw,5rem); --gap:clamp(1rem,2vw,1.5rem);
  --measure:62ch; --maxw:90rem; --r:2px; --ease:cubic-bezier(.22,1,.36,1);
  --z-frame:2; --z-copy:4; --z-door:10; --z-folio:50; --z-nav:300; --z-menu:310; --z-skip:400;
  --sc-canvas:var(--bg); --sc-surface:var(--surface); --sc-ink:var(--text); --sc-ink-soft:var(--text-2);
  --sc-accent:var(--accent); --sc-accent-ink:var(--bg); --sc-hairline:var(--border); --sc-hairline-strong:var(--border-strong);
  --sc-font-display:var(--serif); --sc-font-text:var(--sans); --sc-ease-out:var(--ease);
  --sc-r-sm:var(--r); --sc-r-md:var(--r); --sc-r-lg:var(--r); --sc-gutter:var(--gutter); --sc-section:var(--section);
}
body{background:var(--bg);color:var(--text);font:400 1.0625rem/1.65 var(--sans)}
.t-hero{font:400 clamp(4rem,11vw,10rem)/.92 var(--serif);letter-spacing:-.02em;color:var(--white)}
@media (max-width:639px){.t-hero{font-size:clamp(3rem,15vw,4rem)}}
.t-chapter{font:400 clamp(2.6rem,5.5vw,5.25rem)/1 var(--serif);letter-spacing:-.02em;color:var(--white);text-wrap:balance}
.t-section{font:400 clamp(1.8rem,3vw,2.75rem)/1.1 var(--serif);letter-spacing:-.01em;color:var(--white);text-wrap:balance}
.t-lede{font:400 1.25rem/1.5 var(--sans);letter-spacing:-.005em;color:var(--text-2)}
.t-body{font:400 1.0625rem/1.65 var(--sans);letter-spacing:.005em;color:var(--text-2);max-width:var(--measure);text-wrap:pretty}
.t-label{font:500 .6875rem/1.4 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--text-2)}
.t-figure{font:400 clamp(2.5rem,1.6rem + 3.6vw,4.5rem)/1 var(--serif);letter-spacing:-.02em;color:var(--white)}
:is(.t-hero,.t-chapter,.t-section) em{font-style:italic;color:var(--accent-2)}
```

Instrument Serif has no `tnum`, so each counter is `display:inline-grid` with a hidden `::before{content:attr(data-final);grid-area:1/1}` ghost sizing the box. `--border-strong` rises from .14 to .22 to hold over smoke. At 1440 / 390: chapter 79.2 / 41.6px, section 43.2 / 28.8, figure 72 / 40. Grid: 12 columns, `--gap` between, `--gutter` sides, centred at `--maxw`.

## 2. Nav

Desktop: `position:fixed; inset:0 0 auto; height:56px; padding-inline:var(--gutter); display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid transparent; z-index:var(--z-nav)`. Wordmark: serif italic 1.05rem, `--white`, 44px tall. Right cluster, gap 2rem: five links (.7rem, 500, .1em, uppercase, `--text-2`, 44px tall), then Connect (.68rem, 500, .08em, `height:32px; padding:0 1.1rem; border:1px solid var(--border-strong); border-radius:2px`). `aria-current`: `--text` with a 1px `--accent-2` underline at .6em offset.

Solid: `.is-solid{background:var(--nav-solid);backdrop-filter:blur(16px);border-bottom-color:var(--border)}` after 30px. Pillar, resume, connect and 404 ship it solid; solid without blur while the menu is open.

Phone: padding-inline 20px; right side Connect (36px, 44px hit area), 8px, `<summary>` 44x44 with two 20px bars, 1.5px, 6px apart, turning to an X when open. Panel: `position:fixed; inset:56px 0 0; background:var(--bg); padding:32px 20px 48px; overflow-y:auto; z-index:var(--z-menu)`. Six links (Building, Finance, Creative, Journey, Resume, Connect): serif 2.5rem/1.1, 72px rows, hairline below; current page italic `--accent-2`. Email `.t-body` 32px below. `html.is-locked{overflow:hidden}` while open.

Folio (home): `position:fixed; top:68px; left:5vw` (phone: gutter), `.t-label`, number `--accent-2`, 12px, name `--text-2`, `aria-hidden`. Hidden outside chapters and after p .72.

## 3. Hero

`.hero{min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;padding:0 var(--gutter) clamp(3rem,8svh,6rem);position:relative;overflow:hidden;isolation:isolate}`. Layers, back to front, inside `.ethereal{position:absolute;inset:0;contain:paint;pointer-events:none}`:

1. Glow: `top:28%; left:42%; 760x520px; translate:-50% -50%; radial-gradient(ellipse,rgba(124,156,191,.10) 0%,rgba(124,156,191,.04) 40%,transparent 72%)`.
2. Smoke A, `<svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">`: `inset:-15%; width:130%; height:130%; opacity:.9; mix-blend-mode:screen; will-change:transform`. Filter (x/y -30%, 160%): `feTurbulence fractalNoise baseFrequency="0.006 0.011" numOctaves="3" seed="7" stitchTiles="stitch"`; `feColorMatrix "0 0 0 0 .20  0 0 0 0 .30  0 0 0 0 .45  0 0 0 .9 0"`; `feGaussianBlur 14`; `feFuncA linear slope 1.4 intercept -.15`. Mask: radial `cx 55% cy 45% r 60%`, white at 1, .5 (55%), 0.
3. Smoke B: `inset:-20%; 140%; opacity:.5`, same blend. `baseFrequency="0.009 0.005" numOctaves="2" seed="22"`, matrix `.28 .38 .55`, alpha .7, blur 22. Mask `cx 40% cy 60% r 65%`, .9 to 0. Hidden below 640px.
4. Noise: `opacity:.05`, the current 200x200 fractalNoise .85 data URI, static.
5. Fade: `linear-gradient(180deg,rgba(13,17,23,.4),transparent 30%,transparent 60%,var(--bg))`.
6. `.hero__scrim`, sibling of the copy: from 640px `radial-gradient(110% 110% at 0% 100%,rgba(13,17,23,.78),rgba(13,17,23,.6) 45%,transparent)`; below, `linear-gradient(to top,rgba(13,17,23,.82),rgba(13,17,23,.6) 60%,transparent 90%)`. At least .45 alpha under every copy pixel.
7. Copy, `z-index:var(--z-copy); max-width:52rem`.

```css
@keyframes smokeDrift{0%{transform:none}50%{transform:translate(3%,-2%) scale(1.06) rotate(2deg)}100%{transform:translate(-2%,2%) scale(1.03) rotate(-1.5deg)}}
@keyframes smokeDrift2{0%{transform:scale(1.05)}100%{transform:translate(4%,3%) scale(1.12) rotate(3deg)}}
@keyframes glowPulse{0%,100%{opacity:.7}50%{opacity:1}}
.smoke--a{animation:smokeDrift 28s ease-in-out infinite alternate}
.smoke--b{animation:smokeDrift2 36s ease-in-out infinite alternate}
.ethereal__glow{animation:glowPulse 12s ease-in-out infinite}
.hero.is-paused :is(.smoke--a,.smoke--b,.ethereal__glow){animation-play-state:paused}
```

Copy: label (`.t-label`, `--accent-2`); `h1.t-hero` "Jamari" then `<em>Myers</em>` block; lede `.t-lede` in `--text`, `max-width:30rem`; CTA row, gap 12px. Gaps 24 / 24 / 48px (below 640px: 16 / 16 / 32).

Name, lede lines, block height, block top: 1440x900 158.4px, 2, 511px, 317px; 1024x768 112.6px, 2, 427px, 280px; 390x844 58.5px, 3, 333px, 444px; 320x568 48px, 4, 336px, 184px.

Label toggle: `<span data-v="gated">First-gen. D1 athlete. Builder.</span><span data-v="fallback">Brown University ’27</span>`; gated hidden unless `html[data-identity="on"]`, which also hides the fallback. No JS.

Buttons: 48px tall, `padding:0 24px` (16px under 360px), .75rem, 500, .1em, uppercase, nowrap, 2px radius. Primary "Enter Building": `--accent-2` ground, `--bg` text, hover `--white`. Secondary "Connect": `1px solid var(--border-strong)`, `--text`; hover ground `rgba(232,237,242,.06)`, border `.4`. Active `translateY(1px)`; focus-visible per section 8.

## 4. Chapters

Pinned acts; desktop stages pad 5vw; frames sized in vw and svh make each door scale a constant.

Door (scale moves to the media wrapper so the label never grows):
```html
<a class="door" href="osmo.html" data-door="osmo"><span class="door__media"><img class="door__img"></span><span class="door__scrim"></span><span class="door__label t-label">Enter Building</span></a>
```
```css
.chapter{--door:clamp(0,calc((var(--sc-p,0) - .72) / .26),1)}
.door{position:absolute;z-index:var(--z-door)}
.door__media{position:absolute;inset:0;overflow:hidden;border-radius:2px;transform-origin:var(--door-origin);transform:scale(calc(1 + var(--door) * var(--door-grow)))}
.door__img{width:100%;height:100%;object-fit:cover;view-transition-name:door-osmo;view-transition-class:door}
.door__scrim{position:absolute;left:0;bottom:0;width:min(100%,18rem);height:7rem;background:linear-gradient(to top,rgba(10,13,18,.8),transparent);opacity:var(--door)}
.door__label{position:absolute;left:16px;bottom:16px;color:var(--white);opacity:var(--door)}
```
No `will-change` on `.door__media`; door images `sizes="100vw"`.

Desktop copy column: `top:15svh; height:70svh; display:flex; flex-direction:column; justify-content:space-between`. Top: h2 `.t-chapter`, `data-sc-kinetic="lines"`. Bottom: lines (`li.t-body`, `max-width:34ch`, `border-top:1px solid var(--border); padding-top:12px`, 12px apart), then 24px, figure (`.t-figure`, unit `--accent-2`, caption `.t-label` 8px under).

Phone: title `top:96px` (short 88px); frame inset gutter, `top:28svh; height:40svh` (short `40svh` / `24svh`); text group `top:calc(68svh + 20px)` (short `calc(64svh + 16px)`). Lines share one grid cell and take turns: `doors.js`, loaded before `scrollcraft.js`, copies each `data-cue-phone` into `data-sc-cue` on phones. Two lines: `.14 .46 .2 .2`, `.42 1 .1 .28`; three: `.12 .36 .2 .2`, `.32 .56 .2 .2`, `.52 1 .1 .28`. Figure row 16px below (short 12px), number and caption side by side, caption `max-width:18ch`.

Per chapter (ground; desktop frame x, w, top, h; photo object-position desktop / phone / short; device):
- Ch1: `--surface`; 60vw, 35vw, 15svh, 70svh; text 5 to 51vw; portrait-blazer 48% 50% / 50% 30% / 50% 30%; img parallax -0.8, img `top:-40px; height:calc(100% + 80px)`.
- Ch2: `--bg`; 5vw, 35vw, 15svh, 70svh; text 46 to 95vw; headshot 50% 15% / 50% 12% / 50% 25%; `data-sc-reveal="left" data-sc-reveal-at="-0.25 0.3"` on `.door__media`.
- Ch3: `--surface-2`; Rome 39vw, 24vw, 21svh, 58svh; hillside 65, 17, 14, 40; NYC 84, 11, 52, 30; text 5 to 35vw; rome 50% 50% / 50% 50% / 50% 70%; hillside 85% 50%; nyc 22% 50%; Rome img parallax -1.2 (+120px); hillside and NYC frames -0.6 and 0.3.
- Ch4: `--deep`; 35vw, 30vw, 13svh, 74svh; title bottom-left 5 to 33vw; lines top-right, figure bottom-right, 67 to 95vw; field-red-lit 55% 50% / 50% 16% / 50% 12%; silence, then duotone to colour.

Phone ch3: Rome is 64% of `(100% - 12px)`, hillside and NYC stack right.

Chapter 4 media: `img.door__duo` (`filter:grayscale(1) contrast(1.08) brightness(.82)`, static), `span.door__tint` (`background:var(--accent); mix-blend-mode:color; opacity:.9`), then `img.door__img` at `opacity:clamp(0,calc((var(--sc-p,0) - .38) / .3),1)`; wrapper `isolation:isolate`.

`--door-grow` / `--door-origin`, set on each chapter's `.door` per layout:

- Ch1: desktop 1.886 / 92.31% 32.79%; phone 1.525 / 48% 46.67%; short 3.208 / 48% 52.63%
- Ch2: desktop 1.886 / 7.69% 22.08%; phone 1.525 / 50% 46.67%; short 3.208 / 50% 52.63%
- Ch3: desktop 3.208 / 51.32% 50.64%; phone 1.525 / 45% 46.67%; short 3.208 / 45% 52.63%
- Ch4: desktop 2.367 / 50% 17.38%; phone 1.525 / 55% 46.67%; short 3.208 / 55% 52.63%

Scale = 1.01 x max(100/w, 100/h); dominant-axis origin `x0 / (100 - w)`, the other chosen so full bleed lands on the face (frame rows 14 to 64%, 7 to 57%, 30 to 71%, 7 to 47%). Verified 320x568 to 1920x1080.

Desktop cues: title `0.02 1 0.2 0.28`; lines from `0.18`, `0.26`, `0.34` (each `x 1 0.2 0.28`); figure `0.34 1 0.15 0.28` (ch2 `0.42`), count at `0.36 0.6`. Chapter 4: centred hush label `0 0.3 0 0.35`; media cue on `.door` (never on the scaled wrapper) `0.28 1 0.12 0`; title `0.4 1 0.15 0.25`; lines `0.5`, `0.56`; figure `0.6`, count `0.6 0.7`.

States, ch1 to 3: p 0 ground and photo present (ch2 wipe 43%), title unrevealed; p .35 title set, two lines in; p .72 copy full, count settled, door at scale 1; p 1 full bleed, label on, folio off. Chapter 4: p 0 ground and hush label; p .35 duotone photo; p .72 full colour, copy set; p 1 full bleed.

## 5. Home flow sections

Stats row: `padding-block:clamp(3rem,6vw,6rem)`; `repeat(3,1fr)` hairline grid; cells 32px 40px (phone 20px 12px), hover `--surface`; `.t-figure` counter (`data-sc-count-ms="1200"`), caption `.t-label` 8px below; "As of [DATE]" `.t-label` `--text-3` right-aligned 12px under. Below 380px: one column, figure left, caption right.

What I am building now: `padding-block:var(--section)`; h2 `.t-section` columns 1 to 6, 48px above the grid (phone 32). Grid `1.6fr 1fr 1fr; gap:1px; background:var(--border); border:1px solid var(--border)`, `data-sc-spotlight`, `data-sc-stagger="60"`. A (platform line in `.t-section`, mechanism `.t-body`, osmoperformance.com link) spans rows 1 and 2; B honest answers; C status with date; D stack (hairline rows) across columns 2 and 3 of row 2. Cells `--bg`, padding 48px (phone 24), row 1 `min-height:16rem`, h3 `.t-label` `--accent-2` then 16px. Phone: one column.

Close: `min-height:80svh; display:flex; flex-direction:column; justify-content:flex-end; padding:var(--section) var(--gutter) 0`. `.t-label`, 24px, email in serif italic `clamp(2rem,6vw,5rem)/1.05`, `-.02em`, `--white`, 1px `--accent` underline at .16em, `<wbr>` after "@". Footer row: `margin-top:var(--section); border-top:1px solid var(--border); padding:24px 0 32px`, space-between: wordmark (serif italic .85rem, `--text-3`), links Resume, Connect, GitHub, LinkedIn (`.t-label`, gap 24px, 44px tall), footer line `.t-label` `--text-3`. Phone: stacked, gap 16px, links 2x2.

## 6. Pillar pages

Header: band `height:60svh; min-height:22rem`, full bleed; img cover, `mask-image:linear-gradient(to bottom,#000 62%,transparent)`, and its door's view-transition name. object-position desktop / phone: osmo 50% 30% / 48% 50%; finance 50% 25% / 50% 50%; creative 50% 42% / 50% 40%; journey 55% 12% / 50% 10%. Below, columns 1 to 8, `padding-top:40px` (phone 28): `.t-label` `--accent-2`, 16px, h1 `.t-chapter`, 20px, `.t-lede` `max-width:40ch`. First section top padding `calc(var(--section) * .6)`.

Sections: `padding-block:var(--section); border-top:1px solid var(--border)`; h2 `.t-section`, 32px (phone 24) to `.t-body`.

Timeline: rows `grid-template-columns:9rem 1.5rem minmax(0,34rem) minmax(0,1fr); column-gap:32px; padding-block:48px`, hairline between. Date `.t-label` `--accent-2`; rail 1px `--border-strong` with a 7px `--accent` dot at 8px; h3 `.t-lede` 500 `--text`, 8px, `.t-body`. Media 4:5, `max-width:22rem`, right-aligned; football row pairs two 16rem frames, 12px gap. object-position: field-catch 75% 40%, field-red-lit 50% 20%, rome 50% 45%, portrait-blazer 48% 50%. Type plate (Allen, St. Paul's): same slot, `--surface`, hairline border, 24px padding, place name bottom-left in serif italic `.t-section` size `--accent-2` over a `.t-label` `--text-3`. Quiet plate (Stopping): no media, `padding-block:96px`, quote serif `.t-section` size `--text`, `max-width:30ch`. Phone: `1rem 1fr`, gap 16px, rows 32px; date above h3; media below body (`max-width:20rem`, pair gap 8px); plates `max-width:14rem`.

Partner cards: `1.35fr 1fr; gap:1px; background:var(--border); border:1px solid var(--border)`, spotlight. E-Boats Sardinia spans both rows left; Crown Tours and Nailbar Gamax stack right. Card `--bg`, padding 48px (phone 24): `.t-label` type, 12px, h3 Inter 500 1.0625rem, 24px, quote serif italic 1.375rem/1.45 `--text` `max-width:38ch` (E-Boats 1.625rem), 24px, cite `.t-label` `--text-3`, Instagram link 44px tall. Phone: one column, E-Boats first, quotes 1.25rem (E-Boats 1.375rem).

Gallery of 8: `repeat(4,1fr)` (phone 2), `gap:1px` hairline grid. Image box `aspect-ratio:3/4; overflow:hidden`, cover, lazy, `sizes="(min-width:860px) 25vw, 50vw"`; object-position 50% 50% except Bansko 50% 88%. Figcaption `12px 16px 20px` (phone `10px 12px 14px`): place Inter 500 .9375rem `--text`, country `.t-label` `--text-3`. 

Ledger: `dl` grid `minmax(10rem,14rem) 1fr; column-gap:32px; align-items:baseline; max-width:52rem`; `dt` and `dd` take `border-top:1px solid var(--border); padding-block:20px`, last pair a bottom hairline; `dt` `.t-label`, `dd` `.t-body` `--text`. Phone: one column, `dt` `16px 0 4px`, `dd` `0 0 16px` without border.

What it taught me: full-bleed `--surface` band, hairlines top and bottom, `padding-block:var(--section)`, inner `margin-left:8.333%` on desktop. `.t-label` `--accent-2`, 24px, blockquote serif at `.t-section` size, lh 1.2, `--text`, `max-width:26ch`, his words untouched.

Next-door row: `1.5fr 1fr; gap:1px; height:clamp(20rem,52svh,32rem)`. Next door: image at the target header's desktop object-position, carrying its view-transition name; sibling scrim `radial-gradient(90% 80% at 0% 100%,rgba(10,13,18,.82),transparent 70%)`; inset 32px bottom-left `.t-label` "Next" over `.t-section` pillar name. Connect door: `--surface-2` (hover `#1f2836`), 32px padding, label top, `.t-section` title and email bottom. Phone: stacked, next door `aspect-ratio:4/3`, connect `min-height:11rem`.

## 7. Motion inventory

Transform and opacity only (clip-path for the wipe), no `transition:all`, hover gated to `(hover:hover) and (pointer:fine)`.

- Smoke A / B: loop; 28s / 36s ease-in-out alternate; transform. Reduced: stopped on first frame.
- Glow: loop; 12s ease-in-out; opacity. Reduced: static .85.
- Hero label, lede, CTAs: load; 640ms `--ease`, delays 80/160/240ms; opacity, translateY 10px. Reduced: opacity 220ms.
- Hero name: greet cue `0 0.78 0`, kinetic words; scroll; opacity, translate. Reduced: opacity.
- Chapter copy: cues, kinetic lines; scroll; opacity, translate. Reduced: opacity.
- Counters: cue / entry 1200ms; scroll; text. Reduced: final value.
- Parallax: `--sc-p`; rate x (p - .5) x 100px; translateY. Reduced: none.
- Ch2 wipe / ch4 grade: `--sc-p`; scroll; clip-path / opacity. Reduced: settled / full colour.
- Door: p .72 to .98; scroll; scale. Reduced: no scale, label fades.
- Folio: act change; 240ms; opacity. Reduced: same.
- View transition: navigation; group 560ms `--ease`, root 320ms; morph, crossfade. Reduced: off.
- Pillar title: `pagereveal`; 420ms, 200ms delay; opacity, translateY 12px. Reduced: opacity.
- Flow reveals: `data-sc-in`, 60ms stagger; 620ms `--ease`; opacity, translateY 14px. Reduced: opacity 220ms.
- Nav solid: 30px scroll; 240ms `--ease`; background-color, border-color. Reduced: same.
- Menu: `[open]`; panel 240ms, links +30ms each, icon 200ms; opacity, translateY -8px, rotate. Reduced: opacity 160ms.
- Links: hover; 160ms; color, text-decoration-color. Reduced: same.
- Buttons: hover / active; 160ms / 100ms; background, border / translateY 1px. Reduced: no translate.
- Cards, cells: hover; 180ms; background-color. Reduced: same.
- Gallery, next-door images: hover; 280ms `--ease`; scale(1.02). Reduced: none.
- Spotlight (Osmo, partner grids): pointer; 420ms; opacity, position from `--sc-mx/--sc-my`. Reduced: hidden.

```css
@view-transition{navigation:auto}
::view-transition-group(*.door){animation-duration:560ms;animation-timing-function:var(--ease)}
::view-transition-old(*.door),::view-transition-new(*.door){height:100%;object-fit:cover}
::view-transition-old(root),::view-transition-new(root){animation-duration:320ms}
```
Pillar title visible by default; `doors.js` adds `html.is-arriving` only when `pagereveal` has a `viewTransition`, then `.is-arrived` on `ready`.

## 8. Accessibility floor

Ratios on `--bg`, `--surface`, `--surface-2`, `--deep`:
- `--white`: 17.12, 16.00, 14.48, 17.61
- `--text`: 16.07, 15.01, 13.59, 16.52
- `--accent-2`: 9.25, 8.64, 7.82, 9.51
- `--text-2`: 8.45, 7.89, 7.14, 8.69
- `--accent`: 6.64, 6.20, 5.61, 6.82
- `--text-3`: 6.01, 5.62, 5.08, 6.18

`--bg` text on `--accent-2` 9.25, on `--white` 17.12. Solid nav over `--surface-2`: lowest 5.96. Hero, over the brightest smoke measured under the current copy (rgb 81,96,115) at the .45 scrim floor: `--text` 9.43, `--accent-2` 5.43, `--text-2` 4.96 (2.87 unscrimmed, so the lede uses `--text`). Door labels over a white pixel through their scrims: 9.85.

Focus: `:focus-visible{outline:2px solid var(--accent-2);outline-offset:3px;border-radius:2px}`, doors 4px offset, grid cells and doors raise `z-index:1` on focus; no transition.

Tap targets: 44x44 minimum, buttons 48px, inline links 24px.

Skip link: first focusable, to `#main`, `position:fixed; top:8px; left:8px; z-index:var(--z-skip); padding:12px 16px`, `--accent-2` ground, `--bg` text, `translateY(-150%)` until focused.

Headings: home h1 name; h2 per chapter, stats (hidden), building now, close (hidden); h3 cells. Pillars: h1 header, h2 sections and next-door row (hidden), h3 timeline items and partners. Resume h1, h2 sections, h3 roles; connect h1, h2 per inquiry row; 404 h1. Door images `alt=""`; gallery and timeline images real alt.

## 9. Carry and drop

Drop: SVG blur re-rasterized every frame (promote and pause; blur stays only on the solid nav); weight 300 body (400, labels 500); alpha text at .5 and .28 (solid `--text-2`, `--text-3`); the autoplay slider; emoji flags; the scroll cue; glowing dots and drop-shadow glows; `transition:all` and bare `ease`.

Keep exactly: the italic accent word in `--accent-2`; hairline grids (`gap:1px` over `--border`); 2px radii; uppercase labels at .6875rem, .12em; the wordmark (serif italic 1.05rem, `--white`); the navy hex values; the 56px nav and its .92 solid state.

Flags: rights for field-red-lit, field-catch and travel photos; field-red-lit exists only at 1026px and upscales 1.4x at full bleed.
