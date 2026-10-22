---
name: reverse-engineer
description: >
  Reverse-engineer the design of a reference website so its structural ideas can
  be borrowed without copying it. Captures a live URL at desktop (1440x900) and
  mobile (390x844) with a headless browser, extracts fonts, type scale, palette,
  CSS variables, motion libraries, fixed and scroll-driven chrome, section pacing
  and a 10-step scroll strip of screenshots, then turns that into a "borrow list"
  that feeds the scroll-craft skill. Use for "reverse engineer <url>", "steal the
  design of", "steal designs from sites we like", "how does this site do its
  scroll", "what is this site built with", "clone the feel of", or any request to
  learn from a reference site's layout, type, color, or scroll behavior.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# reverse-engineer

Take a site we admire apart, keep the ideas, leave the property. The output is
not a clone. It is a one-page borrow list of structural decisions (how the page
is paced, what the hero does, how type and color are assigned roles) that a
fresh, original page can reuse. Facts come from a scripted capture so the
borrow list is grounded in measurements, not memory.

## Setup (once)

The capture script needs `playwright-core` and a Chromium binary.

```
npm i playwright-core
```

Run that in the project or any parent directory of the skill; the script
resolves `playwright-core` from the nearest `node_modules` (or `NODE_PATH`). It
finds Chromium in this order: `--chrome <path>`, the `SCROLLCRAFT_CHROME` env
var, a scan of `PLAYWRIGHT_BROWSERS_PATH`, `/opt/pw-browsers/chromium*/chrome-linux/chrome`,
then `chromium` on `PATH`. If none exists it reports that and exits 1.

## Step 1: Capture both viewports

Pick an output folder inside the build workspace, for example
`recon/<host>/`. Run the script from anywhere:

```
node .claude/skills/reverse-engineer/scripts/capture.mjs \
  --url https://example.com --out recon/example
```

By default it captures 1440x900 and 390x844 in one run. It writes
`<out>/DESIGN-NOTES.md`, `<out>/raw.json`, and ten screenshots per width at
`<out>/1440/step-01.png` through `step-10.png` and `<out>/390/...`. Use
`--viewports 1440x900,390x844` to change sizes. The capture loads the page,
waits for it to settle, scrolls in ten even steps (400 ms each, first step at
the top, last at the bottom), and records which fixed or sticky elements change
box or opacity between steps. That is the scroll-driven chrome.

If the host is blocked by the network policy, the script says so, names the host,
and exits with code 2. Do not try to route around it. Tell the user to allow
that domain in the environment settings, then re-run. Other flags:
`--ignore-https-errors` (only when a trusted intercepting proxy breaks TLS) and
`--no-proxy`.

## Step 2: Read the evidence

Read `DESIGN-NOTES.md` end to end first. Then open the screenshots, desktop
strip before mobile, in order, using the Read tool on each PNG. The notes tell
you what exists; the screenshots tell you what it feels like. Look for:

- What changes between step 01 and step 10 besides the content: does the header
  shrink or hide, does a fixed layer fade, does a section stay pinned?
- Pacing: the Sections table gives each block's height in viewport-heights. A
  rhythm of one tall pinned scene, then two short text blocks, then a tall
  scene is a decision worth naming.
- Whether mobile is a separate composition or the desktop page squeezed.
- Motion stack: lenis, gsap and ScrollTrigger, locomotive, three, framer-motion,
  barba. Treat a detection as evidence, not proof; the table says how it was
  detected, and "inline script text" is weak.

Mark what the capture could not see (canvas or WebGL internals, scroll-linked
video, hover states, cursor effects) and say so in the borrow list rather than
guessing. When a question needs the source, grep the `raw.json` or fetch the
listed script with `curl` only if the host is reachable.

## Step 3: Write the borrow list

Write one page, `<out>/BORROW-LIST.md`, in plain prose with short lists. It has
two halves.

Take (structural ideas, described in our own words):

- Grammar: the sequence and heights of sections, which are pinned and which flow.
- Navigation model: fixed bar, hide-on-scroll, side rail, or none, and what it does on mobile.
- Hero device: what the first screen does and how many planes or layers it uses.
- Pacing: where the long scenes and the short breaths fall, in viewport-heights.
- Type scale: the ratio between h1, h2, p and small text, weight contrast, case, tracking. Record the ratios and roles, not the licensed typeface; name a free substitute or a classification.
- Palette roles: which color is ground, ink, accent, and where accent is rationed. Use roles and relationships, not the exact hex values as a brand.
- Signature interactions: the one or two scroll behaviors that define the feel, and the mechanism if it is visible.

Refuse (stated explicitly so nobody drifts back into copying):

- Anything that would make our page recognizable as theirs on a quick look: the same layout skeleton in the same order with the same device in each slot.
- Brand assets: logos, marks, illustration, photography, video, icons, custom fonts, 3D models, and any file hotlinked from their host.
- Copy text, headlines, microcopy, and section naming.
- Their exact color values as a set, and their exact easing and timing constants if they are distinctive.

End the page with three lines: the single idea most worth borrowing, the single
thing deliberately different in our version, and open questions the capture
could not answer. If the borrow list reads like a description of a page we could
screenshot-trace, rewrite it until it describes decisions instead of pixels.

## Step 4: Hand off to scroll-craft

Open `.claude/skills/scroll-craft/SKILL.md` and follow it. Give it
`BORROW-LIST.md` as input to its Step 0 brief: quote the Take half under the
brief's inspiration and constraints, put the Refuse half under what must not
appear, and cite the path to the screenshots as reference only. scroll-craft's
own rules still decide the page: variety of devices, a different structure from
the reference, and the brand's own world and assets. If the brand has not been
chosen yet, ask the user before proceeding.

## Guardrails

- Capture only pages the user named. One URL per run; no crawling.
- Keep screenshots and notes in the workspace as private reference. Do not ship
  them, embed them in the new page, or paste the reference's text into it.
- If the capture looks wrong (cookie wall, error page, age gate, blank), the
  notes will show a warning or an HTTP status. Say so and ask the user how to proceed rather than analysing an error page.
