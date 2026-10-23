# v2 summary, 2026-10-23: chaptered index with doors

Preview: https://claude.ai/artifact/FJ67vxrdnSe5RPvY7iiFtV (private to you). Branch `claude/festive-hopper-yx3zi0`, source in `site/`. Nothing deployed; Netlify and DNS untouched; GitHub Pages not enabled. v1 (split stage) stays in history at commit 15523c2.

## What changed from v1
- Look: your current site's DNA, evolved. Navy #0d1117, Instrument Serif with the italic accent word, the smoke hero (now paused offscreen, one layer on phones, still under reduced motion), hairline grids, uppercase labels, fixed nav with a real phone menu.
- Structure: home is an index of four pillar chapters, each a pinned scene with a photo that grows to fill the screen (the door); clicking it morphs the photo into the pillar page's header (cross-document view transitions in Chrome and Safari, plain link elsewhere).
- Substance: `osmo.html`, `finance.html`, `creative.html`, `journey.html`, each ending with "What it taught me" in your own words, plus a restyled resume (prints to one page), connect, and 404.
- Creative pillar: Rome and the four partnerships, Crown Tours, Nailbar Gamax and E-Boats Sardinia with their full quotes, the dated stats row (figures shown with "as of [DATE]"), an inquiry path instead of a price list, a gallery of eight travel photos.

## Verified
- scroll-craft harness on home at 1440, 390 and reduced motion: no dead scroll, all cues clear 4.5:1.
- All eight pages: no console errors, no failed requests, no horizontal overflow at 320/390/1440, every link resolves, every image has alt and dimensions, one h1 per page, keyboard path (skip link, nav, menu open and close), door morph test from home to osmo.html, no-JS fallback.
- Lighthouse: home mobile 93 / 100 / 100 / 100; creative mobile 85 / 100 / 100 / 100; home desktop 71 performance only because this machine renders the SVG smoke without a GPU (the same filter runs on your live site today).
- Copy bans: no em dashes, no jersey number in text, no banned Osmo claim words, no deal names.

## Decisions you need to make
1. **Repo visibility.** `jamarimyers/jamarimyers` is public. This branch now holds research notes, the copy file with open questions, and photos whose rights are unconfirmed. Make the repo private, or move the branch to a private `jamari-portfolio` repo (your October package wanted that), before anyone else looks.
2. **Stats row.** 2.1M+ views, 980K reached, 6.6% engagement and 16 countries ship only with a real as-of date and screenshots from you. Until then the pages say "as of [DATE]".
3. **"First-gen. D1 athlete. Builder."** is in the hero markup but hidden; the page shows "Brown University '27". Say yes to switch it on.
4. **Partner permission** to name, link and quote Crown Tours, Nailbar Gamax and E-Boats Sardinia (their quotes lost their em dashes).
5. **Photo rights**: the red-lit studio portrait, the catch photo, and the blazer portrait on the Brown backdrop.
6. **Osmo status date** ("App built; in release testing with early athletes, as of [DATE]").
7. Small copy questions marked [CONFIRM] in `scrollcraft/builds/jamarimyers-v2/COPY-v2.md`: the Rome term, 2026 as Osmo's founding year, the fellowship URLs, whether you are still BLK Sponsorship Chair.

## Known limits
- The preview's 404 page uses root paths and only works once the site is at a domain root.
- The red-lit photo exists only at 1026px wide and upscales slightly at full bleed; a larger original would help.
- Not tested on a real iPhone or in Firefox; the morph falls back to a plain link where unsupported.

## How to work on it
See `site/PARTIALS.md` (shared markup and classes) and the README's maintenance section. Fonts, photos and the engine are in place; every page is static HTML.
