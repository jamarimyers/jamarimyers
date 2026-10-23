# jamarimyers.com v2: design spec

Composition spec for the approved plan (`/root/.claude/plans/twinkly-tickling-hellman.md`). The plan decides direction; this file fixes values. Reference viewports: 1440x900, 1024x768, 390x844, 320x568. "Desktop" means `(min-width: 860px) and (min-aspect-ratio: 1/1)`; everything else, portrait tablets included, gets the phone composition. Phone "short" means `(max-height: 699px)`.

## 1. Tokens

```css
@font-face{font-family:"Instrument Serif";src:url(assets/fonts/instrument-serif-latin-400-normal.woff2) format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"Instrument Serif";src:url(assets/fonts/instrument-serif-latin-400-italic.woff2) format("woff2");font-weight:400;font-style:italic;font-display:swap}
@font-face{font-family:"Inter Variable";src:url(assets/fonts/inter-latin-wght-normal.woff2) format("woff2-variations"),url(assets/fonts/inter-latin-wght-normal.woff2) format("woff2");font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:"Instrument Serif Fallback";src:local("Georgia");size-adjust:75.96%;ascent-override:130.33%;descent-override:40.81%;line-gap-override:0%}
@font-face{font-family:"Inter Fallback";src:local("Arial");size-adjust:107.48%;ascent-override:90.13%;descent-override:22.44%;line-gap-override:0%}

:root{
  --bg:#0d1117; --surface:#131920; --surface-2:#1a222e; --deep:#0a0d12;
  --border:rgba(255,255,255,.06); --border-strong:rgba(232,237,242,.22);
  --text:#e8edf2; --white:#f0f4f8; --text-2:#a7aeb6; --text-3:#8b9299;
  --accent:#7c9cbf; --accent-2:#9db8d6; --nav-solid:rgba(13,17,23,.92);
  --serif:"Instrument Serif","Instrument Serif Fallback",Georgia,serif;
  --sans:"Inter Variable","Inter Fallback",Arial,system-ui,sans-serif;
  --s-1:.25rem; --s-2:.5rem; --s-3:.75rem; --s-4:1rem; --s-5:1.5rem; --s-6:2rem;
  --s-7:3rem; --s-8:4rem; --s-9:6rem; --s-10:8rem;
  --section:clamp(4rem,9vw,9rem); --gutter:clamp(1.25rem,5vw,5rem);
  --gap:clamp(1rem,2vw,1.5rem); --measure:62ch; --nav-h:56px; --maxw:90rem;
  --r:2px; --ease:cubic-bezier(.22,1,.36,1);
  --d-press:100ms; --d-ui:160ms; --d-card:180ms; --d-nav:240ms; --d-slow:420ms;
  --z-frame:2; --z-copy:4; --z-door:10; --z-folio:50; --z-nav:300; --z-menu:310; --z-skip:400;
  /* engine mapping */
  --sc-canvas:var(--bg); --sc-surface:var(--surface); --sc-ink:var(--text); --sc-ink-soft:var(--text-2);
  --sc-accent:var(--accent); --sc-accent-ink:var(--bg); --sc-hairline:var(--border);
  --sc-hairline-strong:var(--border-strong); --sc-font-display:var(--serif); --sc-font-text:var(--sans);
  --sc-ease-out:var(--ease); --sc-r-sm:var(--r); --sc-r-md:var(--r); --sc-r-lg:var(--r);
  --sc-gutter:var(--gutter); --sc-section:var(--section); --sc-measure:var(--measure);
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

Notes. Fallback metrics are width-matched on letter-frequency-weighted average advance (Inter .4804em, Arial .447em, Instrument Serif .3429em, Georgia .4514em). Instrument Serif has no `tnum` (digit advances run .249em to .460em), so every counter is `display:inline-grid` with a `::before{content:attr(data-final);visibility:hidden;grid-area:1/1}` ghost of the final value and the live number in `grid-area:1/1`; the box never changes width. `--border-strong` rises from .14 to .22 so outlined buttons survive over smoke. `--deep` is chapter 4's ground. Rendered sizes: hero 158.4px at 1440, 112.6 at 1024, 58.5 at 390, 48 at 320; chapter 79.2 / 56.3 / 41.6; section 43.2 / 30.7 / 28.8; figure 72 / 62.5 / 40. Grid: 12 columns, `--gap` column gap (24px at 1440, 20.5 at 1024, 16 on phones), `--gutter` sides (72px at 1440), content capped at `--maxw` and centred above 1600px.

## 2. Nav

Desktop: `position:fixed; inset:0 0 auto; height:56px; padding-inline:var(--gutter); display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid transparent; z-index:var(--z-nav)`. Wordmark "Jamari Myers": serif italic 1.05rem, `--white`, `min-height:44px` inline-flex. Right cluster gap 2rem: five links (.7rem, weight 500, .1em, uppercase, `--text-2`, `min-height:44px`), then Connect: .68rem/500/.08em uppercase, `height:32px; padding:0 1.1rem; border:1px solid var(--border-strong); border-radius:2px`. `aria-current="page"`: `--text` plus 1px underline in `--accent-2`, offset .6em.

Solid: `.nav.is-solid{background:var(--nav-solid);backdrop-filter:blur(16px);border-bottom-color:var(--border)}` after 30px. Pillar, resume, connect and 404 ship `class="nav is-solid"` (pillar bands start under the nav). Nav is also solid while the menu is open (`.nav:has(.menu[open])`, no blur).

Phone: same bar, padding-inline 20px. Right: Connect button (36px tall, 44px hit via `::after{inset:-4px 0}`), 8px gap, then `<summary>` 44x44 showing two 20px bars, 1.5px thick, 6px apart; open state rotates them to an X (±45deg, translateY ±3.75px). Panel `.menu__panel`: `position:fixed; inset:56px 0 0; background:var(--bg); padding:var(--s-6) 20px var(--s-7); overflow-y:auto; z-index:var(--z-menu)`. List of six (Building, Finance, Creative, Journey, Resume, Connect): serif 2.5rem/1.1, `--text`, each row `padding-block:14px` (72px rows), hairline below; current page italic in `--accent-2`. Under the list, the email in `.t-body`, margin-top 32px. `html.is-locked{overflow:hidden}` while open.

Folio (home only): `position:fixed; top:68px; left:var(--gutter)` (5vw on desktop stages), `.t-label`, number in `--accent-2` then 12px gap then name in `--text-2`; `aria-hidden="true"`; opacity 0 outside chapters and while the active act has p > .72.

## 3. Hero

Section `.hero`: `min-height:100svh; display:flex; flex-direction:column; justify-content:flex-end; padding:0 var(--gutter) clamp(3rem,8svh,6rem); position:relative; overflow:hidden; isolation:isolate; background:var(--bg)`.

Layer stack, back to front, all `position:absolute; pointer-events:none`, inside `.ethereal{inset:0;contain:paint}` (`aria-hidden`):

1. `.ethereal__glow`: `top:28%; left:42%; width:760px; height:520px; translate:-50% -50%; background:radial-gradient(ellipse at center,rgba(124,156,191,.10) 0%,rgba(124,156,191,.04) 40%,transparent 72%)`.
2. `svg.smoke--a` (`viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"`): `inset:-15%; width:130%; height:130%; opacity:.9; mix-blend-mode:screen; will-change:transform`. Filter `x=-30% y=-30% width=160% height=160%`: `feTurbulence type=fractalNoise baseFrequency="0.006 0.011" numOctaves=3 seed=7 stitchTiles=stitch` then `feColorMatrix values="0 0 0 0 .20  0 0 0 0 .30  0 0 0 0 .45  0 0 0 .9 0"` then `feGaussianBlur stdDeviation=14` then `feComponentTransfer > feFuncA type=linear slope=1.4 intercept=-.15`. Mask: `radialGradient cx=55% cy=45% r=60%`, stops 0% white 1, 55% white .5, 100% white 0, on a 1200x800 rect.
3. `svg.smoke--b`: `inset:-20%; width:140%; height:140%; opacity:.5`, same blend and promotion. `baseFrequency="0.009 0.005" numOctaves=2 seed=22`; matrix `0 0 0 0 .28  0 0 0 0 .38  0 0 0 0 .55  0 0 0 .7 0`; blur 22. Mask `cx=40% cy=60% r=65%`, stops 0% white .9, 100% white 0. `display:none` below 640px.
4. `.ethereal__noise`: `inset:0; opacity:.05`; the current site's 200x200 SVG data URI (fractalNoise .85, 3 octaves). Static.
5. `.ethereal__fade`: `linear-gradient(180deg,rgba(13,17,23,.4) 0%,transparent 30%,transparent 60%,var(--bg) 100%)`.
6. `.hero__scrim` (sibling of the copy): from 640px `radial-gradient(110% 110% at 0% 100%,rgba(13,17,23,.78) 0%,rgba(13,17,23,.6) 45%,rgba(13,17,23,0) 100%)`; below 640px `linear-gradient(to top,rgba(13,17,23,.82) 0%,rgba(13,17,23,.6) 60%,rgba(13,17,23,0) 90%)`. Minimum scrim alpha under any copy pixel is .45 at all four viewports.
7. `.hero__copy`: `position:relative; z-index:var(--z-copy); max-width:52rem`.

```css
@keyframes smokeDrift{0%{transform:translate(0,0) scale(1) rotate(0)}50%{transform:translate(3%,-2%) scale(1.06) rotate(2deg)}100%{transform:translate(-2%,2%) scale(1.03) rotate(-1.5deg)}}
@keyframes smokeDrift2{0%{transform:translate(0,0) scale(1.05) rotate(0)}100%{transform:translate(4%,3%) scale(1.12) rotate(3deg)}}
@keyframes glowPulse{0%,100%{opacity:.7}50%{opacity:1}}
.smoke--a{animation:smokeDrift 28s ease-in-out infinite alternate}
.smoke--b{animation:smokeDrift2 36s ease-in-out infinite alternate}
.ethereal__glow{animation:glowPulse 12s ease-in-out infinite}
.hero.is-paused :is(.smoke--a,.smoke--b,.ethereal__glow){animation-play-state:paused}
```

Copy, top to bottom: label line (`.t-label`, `--accent-2`), name (`h1.t-hero`, "Jamari" then `<em>Myers</em>` as `display:block`), lede (`.t-lede`, colour `--text`, `max-width:30rem`), CTA row (`display:flex; gap:12px; flex-wrap:wrap`). Gaps label to name, name to lede, lede to CTAs: 24 / 24 / 48px from 640px; 16 / 16 / 32px below.

| Viewport | Name | Lede lines | Block height | Block top | Bottom pad |
|---|---|---|---|---|---|
| 1440x900 | 158.4px, 2 lines | 2 | 511px | 317px | 72px |
| 1024x768 | 112.6px | 2 | 427px | 280px | 61px |
| 390x844 | 58.5px | 3 | 333px | 444px | 67px |
| 320x568 | 48px | 4 | 336px | 184px | 48px |

Label toggle: `<p class="hero__label t-label"><span data-v="gated">First-gen. D1 athlete. Builder.</span><span data-v="fallback">Brown University ’27</span></p>`; `[data-v="gated"]{display:none}`; `html[data-identity="on"] [data-v="gated"]{display:inline}` and `html[data-identity="on"] [data-v="fallback"]{display:none}`. One attribute on `<html>` flips it; no JS.

Buttons: `height:48px; padding:0 24px` (16px below 360px wide); .75rem/1, weight 500, .1em, uppercase; radius 2px; one line always (`white-space:nowrap`). Primary "Enter Building": `--accent-2` ground, `--bg` text; hover `--white` ground. Secondary "Connect": transparent, `1px solid var(--border-strong)`, `--text`; hover ground `rgba(232,237,242,.06)`, border `rgba(232,237,242,.4)`. Both: `:active{transform:translateY(1px)}`; `:focus-visible{outline:2px solid var(--accent-2);outline-offset:3px}`. At 390 the row is 167 + 12 + 110px; at 320, 151 + 12 + 94px.

## 4. Chapters

Each act: `data-sc-act="pin"`, stage `.sc-stage` (100svh, `overflow:clip`), ground on the stage. Desktop stages use 5vw side padding (not `--gutter`) so frames and text share one unit system. All frame geometry is in vw and svh, which makes the door scale a constant per layout.

Door markup (one change from the plan: the scale moves from `.door` to its media wrapper so the label does not scale):
```html
<a class="door" href="osmo.html" data-door="osmo">
  <span class="door__media"><img class="door__img" ...></span>
  <span class="door__scrim"></span><span class="door__label t-label">Enter Building</span></a>
```
```css
.chapter{--door:clamp(0,calc((var(--sc-p,0) - .72) / .26),1)}
.door{position:absolute;z-index:var(--z-door);display:block}
.door__media{position:absolute;inset:0;overflow:hidden;border-radius:2px;transform-origin:var(--door-origin);
  transform:scale(calc(1 + var(--door) * var(--door-grow)))}
.door__img{width:100%;height:100%;object-fit:cover;view-transition-name:door-osmo;view-transition-class:door}
.door__scrim{position:absolute;left:0;bottom:0;width:min(100%,18rem);height:7rem;
  background:linear-gradient(to top,rgba(10,13,18,.8),rgba(10,13,18,0));opacity:var(--door)}
.door__label{position:absolute;left:16px;bottom:16px;color:var(--white);opacity:var(--door)}
```
Do not put `will-change` on `.door__media`; Chrome must re-raster at the grown scale. Images in doors use `sizes="100vw"`.

Desktop text: an absolute column `top:15svh; height:70svh; display:flex; flex-direction:column; justify-content:space-between`; title (h2 `.t-chapter`, `data-sc-kinetic="lines"`) at the top, lines plus figure at the bottom. Lines: `ul`, each `li.t-body` in `--text-2`, `max-width:34ch`, `border-top:1px solid var(--border); padding-top:12px`, 12px apart. Figure 24px below the last line: `.t-figure` number, unit in `--accent-2`, caption `.t-label` 8px under.

Phone stack (`padding-inline:var(--gutter)`): title `top:96px` (short: 88px); frame `left:gutter; right:gutter; top:28svh; height:40svh` (short: `top:40svh; height:24svh`); text group `top:calc(68svh + 20px)` (short: `calc(64svh + 16px)`). Lines share one grid cell (`grid-area:1/1`) and take turns; figure row below at 16px (short: 12px), number and caption side by side (`gap:12px; align-items:center`, caption `max-width:18ch`). Turn-taking needs different cue windows, so each line carries `data-cue-phone`; `doors.js` (loaded before `scrollcraft.js`) copies it into `data-sc-cue` when `matchMedia('(max-width:859px), (max-aspect-ratio:1/1)')` matches. Phone windows, 2 lines: `.14 .46 .2 .2`, `.42 1 .1 .28`; 3 lines: `.12 .36 .2 .2`, `.32 .56 .2 .2`, `.52 1 .1 .28`.

| Chapter | Ground | Desktop frame (x, w, top, h) | Photo, object-position desktop / phone / short | Inner device |
|---|---|---|---|---|
| 1 Building | `--surface` | 60vw, 35vw, 15svh, 70svh. Text 5vw to 51vw | portrait-blazer: 48% 50% / 50% 30% / 50% 30% | `data-sc-parallax="-0.8"` on the img, img `height:calc(100% + 80px); top:-40px` |
| 2 Finance | `--bg` | 5vw, 35vw, 15svh, 70svh. Text 46vw to 95vw | headshot: 50% 15% / 50% 12% / 50% 25% | `data-sc-reveal="left" data-sc-reveal-at="-0.25 0.3"` on `.door__media` |
| 3 Creative | `--surface-2` | Rome door 39vw, 24vw, 21svh, 58svh. Hillside 65vw, 17vw, 14svh, 40svh. NYC 84vw, 11vw, 52svh, 30svh. Text 5vw to 35vw | rome: 50% 50% / 50% 50% / 50% 70%. hillside 85% 50%; nyc 22% 50% (phone 25% 50%) | Rome img parallax -1.2 (img +120px). Hillside and NYC frames parallax -0.6 and 0.3 at `--z-frame` |
| 4 Journey | `--deep` | 35vw, 30vw, 13svh, 74svh. Title bottom-left 5vw to 33vw; lines top-right and figure bottom-right 67vw to 95vw | field-red-lit: 55% 50% / 50% 16% / 50% 12% | Silence, then duotone to colour |

Phone chapter 3: Rome door takes 64% of `(100% - 12px)`; hillside and NYC stack in the right column, 12px gaps, each `(40svh - 12px) / 2` tall.

Chapter 4 grade: `.door__media` holds `img.door__duo` (`filter:grayscale(1) contrast(1.08) brightness(.82)`, static), `span.door__tint` (`background:var(--accent); mix-blend-mode:color; opacity:.9`), then the colour `img.door__img` with `opacity:clamp(0,calc((var(--sc-p,0) - .38) / .3),1)`. `isolation:isolate` on the wrapper. Only the colour image carries the view-transition name.

Door grow and origin (`--door-grow` / `--door-origin`), exact by construction, 1% overshoot included:

| Chapter | Desktop | Phone tall | Phone short |
|---|---|---|---|
| 1 | 1.886 / 92.31% 32.79% | 1.525 / 48% 46.67% | 3.208 / 48% 52.63% |
| 2 | 1.886 / 7.69% 22.08% | 1.525 / 50% 46.67% | 3.208 / 50% 52.63% |
| 3 | 3.208 / 51.32% 50.64% | 1.525 / 45% 46.67% | 3.208 / 45% 52.63% |
| 4 | 2.367 / 50% 17.38% | 1.525 / 55% 46.67% | 3.208 / 55% 52.63% |

Derivation: scale s = 1.01 x max(100/w, 100/h). In the dominant axis the origin is forced to `x0 / (100 - w)`; in the other it is chosen so the full-bleed crop lands on the face: chapter 1 shows frame rows 14% to 64%, chapter 2 7% to 57%, chapter 3 30% to 71%, chapter 4 7% to 47% (helmet to number). Coverage checked at 1440x900, 1024x768, 1920x1080, 430x932, 390x844, 390x700, 360x780, 375x667 and 320x568.

Desktop cues: title `0.02 1 0.2 0.28`; lines `0.18`, `0.26`, `0.34` (each `x 1 0.2 0.28`); figure `0.34 1 0.15 0.28` (ch2 `0.42`), `data-sc-count-at="0.36 0.6"`. Chapter 4: hush label `0 0.3 0 0.35`; media `0.28 1 0.12 0`; title `0.4 1 0.15 0.25`; lines `0.5`, `0.56`; figure `0.6`, count `0.6 0.7`.

States (chapters 1 to 3):
- p = 0: ground, frame and photo already present (ch2 wipe at 43%), image offset +40px, title unrevealed, folio on.
- p = .35: title set, two lines in, figure fading in at 0.
- p = .72: everything full, counter settled, door at scale 1, copy starting to fade.
- p = 1.0: door full bleed since .98, label and scrim at full opacity, folio hidden.

Chapter 4: p = 0 ground and the centred hush label only; p = .35 photo arrived in duotone, label gone; p = .72 full colour, all copy set; p = 1.0 full bleed.

## 5. Home flow sections

Creator stats row: `padding-block:clamp(3rem,6vw,6rem)`. Grid `repeat(3,1fr)`, hairline top and bottom, `border-right` hairline between cells, cell padding 32px 40px (phone 20px 12px), hover ground `--surface`. Figure `.t-figure` with `data-sc-count` and `data-sc-count-ms="1200"`, caption `.t-label` 8px below. "As of [DATE]" `.t-label` `--text-3`, right-aligned, 12px under the row. Below 380px: one column, figure left and caption right, hairlines between rows.

What I am building now: `padding-block:var(--section)`; h2 `.t-section` in columns 1 to 6, 48px above the grid (phone 32px). Grid `grid-template-columns:1.6fr 1fr 1fr; gap:1px; background:var(--border); border:1px solid var(--border)` with `data-sc-spotlight` and `data-sc-stagger="60"`. A (platform line in `.t-section` serif, mechanism `.t-body`, then "osmoperformance.com" `.t-label` link) spans rows 1 and 2 of column 1; B (honest answers) column 2; C (status plus date) column 3; D (stack as hairline rows) columns 2 and 3 of row 2. Cells: ground `--bg`, padding 48px (phone 24px), `min-height:16rem` on row 1; cell titles h3 `.t-label` `--accent-2`, 16px gap. Phone: one column, A to D.

Close: `min-height:80svh; display:flex; flex-direction:column; justify-content:flex-end; padding:var(--section) var(--gutter) 0`. `.t-label` then 24px then the email: serif italic `clamp(2rem,6vw,5rem)/1.05`, `-.02em`, `--white`, underline 1px `--accent` at .16em offset, `<wbr>` after "@" (one line at 1440 (814px) and 390 (301px), two at 320). Optional `.t-lede` 24px below. Footer row: `margin-top:var(--section); border-top:1px solid var(--border); padding:24px 0 32px; display:flex; justify-content:space-between; align-items:center`: wordmark (serif italic .85rem, `--text-3`), links Resume, Connect, GitHub, LinkedIn (`.t-label`, gap 24px, 44px tall), footer line `.t-label` `--text-3`. Phone: column, gap 16px, links in a 2x2 grid.

## 6. Pillar pages

Header: band `height:60svh; min-height:22rem` full bleed from the top (under the solid nav). Img cover, `mask-image:linear-gradient(to bottom,#000 62%,transparent)`, same view-transition name and class as its door. object-position desktop / phone: osmo (portrait-blazer) 50% 30% / 48% 50%; finance (headshot) 50% 25% / 50% 50%; creative (rome) 50% 42% / 50% 40%; journey (field-red-lit) 55% 12% / 50% 10%. Text below the band, columns 1 to 8, `padding-top:40px` (phone 28px): `.t-label` `--accent-2`, 16px, h1 `.t-chapter`, 20px, descriptor `.t-lede` `max-width:40ch`. First section `padding-top:calc(var(--section) * .6)`.

Sections: `padding-block:var(--section); border-top:1px solid var(--border)`; h2 `.t-section`, 32px to body (phone 24px); prose `.t-body`.

Timeline (journey): rows `grid-template-columns:9rem 1.5rem minmax(0,34rem) minmax(0,1fr); column-gap:32px; padding-block:48px`, hairline between rows. Date `.t-label` `--accent-2`; rail 1px `--border-strong` full row height with a 7px `--accent` dot at 8px; h3 `.t-lede` weight 500 `--text`, 8px, body `.t-body`. Media: 4:5 frame `max-width:22rem`, right-aligned; the football row holds two frames side by side (`16rem` each, 12px gap). object-position: field-catch 75% 40% (crops the bystander), field-red-lit 50% 20%, rome 50% 45%, portrait-blazer 48% 50%. Type plate (Allen; St. Paul's): same 4:5 slot, `--surface`, hairline border, padding 24px, bottom-left place name serif italic at `.t-section` size in `--accent-2` over a `.t-label` `--text-3`. Quiet plate (Stopping): no media, `padding-block:96px`, quote serif `.t-section` size in `--text`, `max-width:30ch`, columns 3 to 4. Phone: `grid-template-columns:1rem 1fr; column-gap:16px; padding-block:32px`; date above the h3; media full width below body (`max-width:20rem`, pair gap 8px), plates `max-width:14rem`.

Partner cards (creative): `grid-template-columns:1.35fr 1fr; gap:1px; background:var(--border); border:1px solid var(--border); data-sc-spotlight`. E-Boats Sardinia spans both rows on the left; Crown Tours and Nailbar Gamax stack right. Card: `--bg`, padding 48px (phone 24px), hover `--surface`. Order: `.t-label` type, 12px, h3 Inter 500 1.0625rem, 24px, quote serif italic 1.375rem/1.45 `--text` `max-width:38ch` (E-Boats 1.625rem/1.4), 24px, cite `.t-label` `--text-3`, Instagram link `.t-label` 44px tall. Phone: one column, E-Boats first, quotes 1.25rem (E-Boats 1.375rem).

Gallery of 8: `grid-template-columns:repeat(4,1fr)` (phone `repeat(2,1fr)`), `gap:1px; background:var(--border); border:1px solid var(--border)`. Figure ground `--bg`; image wrapper `aspect-ratio:3/4; overflow:hidden`, img `width:100%; height:100%; object-fit:cover`, `loading="lazy"`, `sizes="(min-width:860px) 25vw, 50vw"`. object-position 50% 50% except Bansko snowboard 50% 88%. Figcaption padding 12px 16px 20px (phone 10px 12px 14px): place Inter 500 .9375rem `--text` (phone .875rem), country `.t-label` `--text-3`. Cells 323x431px at 1440, 174x233px at 390.

Ledger: `dl` `grid-template-columns:minmax(10rem,14rem) minmax(0,1fr); column-gap:32px; align-items:baseline; max-width:52rem`. `dt` and `dd` each `border-top:1px solid var(--border); padding-block:20px`; last pair also `border-bottom`. `dt` `.t-label`; `dd` `.t-body` `--text`, tabular numerals. Phone: one column; `dt` `padding:16px 0 4px`, `dd` `padding:0 0 16px; border-top:0`.

What it taught me: full-bleed band, ground `--surface`, hairline top and bottom, `padding-block:var(--section)`. Inner offset one column (`margin-left:8.333%`) on desktop. `.t-label` `--accent-2`, 24px, blockquote serif 400 at `.t-section` size, line-height 1.2, `--text`, `max-width:26ch`, balanced, words untouched (no accent italic). Phone: no offset.

Next-door row: `grid-template-columns:1.5fr 1fr; gap:1px; background:var(--border); height:clamp(20rem,52svh,32rem)`. Next door: image cover at the target page's desktop header object-position, with its view-transition name (it morphs into the next header), sibling scrim `radial-gradient(90% 80% at 0% 100%,rgba(10,13,18,.82),rgba(10,13,18,0) 70%)`, text inset 32px bottom-left: `.t-label` "Next" then the pillar name in `.t-section` `--white`. Connect door: ground `--surface-2` (hover `#1f2836`), padding 32px, label top, `.t-section` title and email `.t-body` bottom. Phone: stacked, next door `aspect-ratio:4/3`, connect door `min-height:11rem`.

## 7. Motion inventory

Animate `transform` and `opacity` only (`clip-path` for the wipe). Never `transition:all`. Hover rules sit inside `@media (hover:hover) and (pointer:fine)`.

| Element | Trigger | Duration, easing | Properties | Reduced motion |
|---|---|---|---|---|
| Smoke A / B | load, loop | 28s / 36s ease-in-out alternate | transform | none; first frame holds |
| Glow | load, loop | 12s ease-in-out | opacity .7 to 1 | static .85 |
| Smoke pause | IntersectionObserver, `visibilitychange` | instant | play-state | n/a |
| Hero label, lede, CTAs | load | 640ms `--ease`, delays 80 / 160 / 240ms | opacity, translateY 10px | opacity 220ms |
| Hero name | engine greet cue `0 0.78 0` | scroll | opacity, kinetic words | opacity only |
| Chapter title | cue, `data-sc-kinetic="lines"` | scroll | opacity, translateY per line | opacity only |
| Chapter lines, figure | cues | scroll | opacity, rise | opacity only |
| Counters | cue window / entry 1200ms | scroll / engine | text | final value |
| Parallax | `--sc-p` | scroll | translateY, rate x (p - .5) x 100px | none |
| Ch2 wipe | `--sc-p` | scroll | clip-path | shown settled |
| Ch4 grade | `--sc-p` .38 to .68 | scroll | opacity | full colour |
| Door | `--sc-p` .72 to .98 | scroll | scale | no scale; label fades in |
| Folio | act change | 240ms `--ease` | opacity | same |
| View transition | navigation | group 560ms `--ease`, root 320ms | morph, crossfade | animations off |
| Pillar title | `pagereveal` | 420ms `--ease`, 200ms delay | opacity, translateY 12px | opacity 220ms |
| Flow reveals | `data-sc-in`, stagger 60ms | 620ms `--ease` | opacity, translateY 14px | opacity 220ms |
| Nav solid | scroll 30px | 240ms `--ease` | background-color, border-color (blur toggles) | same |
| Menu panel | `[open]` | 240ms `--ease`, links stagger 30ms | opacity, translateY -8px | opacity 160ms |
| Menu icon | `[open]` | 200ms `--ease` | rotate, translate | instant |
| Links (nav, footer, inline) | hover | 160ms | color, text-decoration-color | same |
| Buttons | hover / active | 160ms / 100ms | background-color, border-color / translateY 1px | no translate |
| Cards, cells, stat cells | hover | 180ms | background-color | same |
| Gallery and next-door images | hover | 280ms `--ease` | scale 1.02 | none |
| Spotlight (Osmo grid, partner grid) | pointer | 420ms | opacity, follows `--sc-mx/--sc-my` | hidden |

View transitions: `@view-transition{navigation:auto}`; `::view-transition-group(*.door){animation-duration:560ms;animation-timing-function:var(--ease)}`; `::view-transition-old(*.door),::view-transition-new(*.door){height:100%;object-fit:cover}`; `::view-transition-old(root),::view-transition-new(root){animation-duration:320ms}`. The pillar title is visible by default; `doors.js` adds `html.is-arriving` (opacity 0) only when `pagereveal` carries a `viewTransition`, then swaps to `.is-arrived` on `viewTransition.ready`.

## 8. Accessibility floor

Contrast (WCAG ratio):

| Text | `--bg` | `--surface` | `--surface-2` | `--deep` |
|---|---|---|---|---|
| `--white` | 17.12 | 16.00 | 14.48 | 17.61 |
| `--text` | 16.07 | 15.01 | 13.59 | 16.52 |
| `--accent-2` | 9.25 | 8.64 | 7.82 | 9.51 |
| `--text-2` | 8.45 | 7.89 | 7.14 | 8.69 |
| `--accent` | 6.64 | 6.20 | 5.61 | 6.82 |
| `--text-3` | 6.01 | 5.62 | 5.08 | 6.18 |

Also: `--bg` on `--accent-2` button 9.25, on `--white` hover 17.12. Solid nav over `--surface-2` behaves like `--bg` (lowest 5.96). Hero, against the brightest smoke measured under the current copy column (rgb 81,96,115) with the .45 minimum scrim: `--text` 9.2, `--accent-2` 5.3, `--text-2` 4.8; with no scrim `--text-2` falls to 2.87, so the lede is `--text` and the label `--accent-2`. Door and next-door labels over a pure white pixel through their scrims: 9.85. Hairlines are decorative (1.13); the Connect border (1.84) is not the button's only identifier.

Focus: `:focus-visible{outline:2px solid var(--accent-2);outline-offset:3px;border-radius:2px}` (9.25 on `--bg`, 7.82 on `--surface-2`); doors offset 4px; next-door and grid cells get `position:relative; z-index:1` on focus so the ring paints over neighbours. No transition on focus.

Tap targets: 44x44 minimum (nav links, summary, Connect hit area, footer links, card links); buttons 48px; inline prose links exempt but at least 24px tall.

Skip link: first focusable element, "Skip to content" to `#main`; `position:fixed; top:8px; left:8px; z-index:var(--z-skip); padding:12px 16px`; `--accent-2` ground, `--bg` text, `.t-label` metrics; `translateY(-150%)` until focused.

Heading order: home h1 name; h2 for each chapter title, the stats row (visually hidden), "What I am building now" and the close (visually hidden); h3 for grid cells. Pillar pages: h1 header title; h2 per section and for the next-door row (visually hidden); h3 timeline items and partner names. Resume: h1 name, h2 sections, h3 roles. Connect: h1, h2 per inquiry row. 404: h1 only. Every image in a door has `alt=""` (the label names the link); gallery and timeline images carry real alt text.

## 9. Carry and drop

Do not carry: animated SVG blur that re-rasterizes every frame (promote with `will-change:transform` and pause offscreen; blur stays on the solid nav only); body at weight 300 (400 everywhere, 500 for labels); alpha text (`.5` and `.28`, now solid `--text-2` and `--text-3`); the autoplay testimonial slider (static partner cards); emoji flags; the scroll cue line; the glowing badge dot and flag drop-shadow glows; `transition:all` and bare `ease`.

Keep exactly: the italic accent word in `--accent-2` ending each heading; hairline grids (`gap:1px` over `--border`); 2px radii everywhere; uppercase labels at .6875rem, .12em; the wordmark (serif italic 1.05rem, `--white`); the navy palette hex values; the 56px nav with its .92 solid state.

Rights and source flags: field-red-lit and field-catch need photo-rights confirmation, as do the travel photos (plan gate). field-red-lit exists only at 1026px wide, so its full-bleed door and header upscale about 1.4x at 1440; grain and the grade hide it, but a larger original would help. The jersey number in field-red-lit stays visible (photographs are not claims). Excluded: nailbar group, lineup, play, graduation.
