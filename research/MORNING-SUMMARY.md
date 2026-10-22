# Morning summary, 2026-10-22 (overnight build)

## What exists now
- Preview of the rebuilt site: https://claude.ai/artifact/FJ67vxrdnSe5RPvY7iiFtV (private to you; drag the seam on the hero).
- Branch `claude/festive-hopper-yx3zi0` in `jamarimyers/jamarimyers`, source in `site/`.
  Pages: `index.html` (the split stage), `resume.html`, `connect.html`, `404.html`.
- A GitHub Pages workflow (`.github/workflows/deploy-pages.yml`) deploys `site/` from `main`.
  Nothing is live. Netlify and DNS for jamarimyers.com are untouched.
- Research: `research/JAMARI.md` (public dossier), `research/POSITIONING.md` (brand strategy,
  LinkedIn headline and About, 50-word bio, outreach opener), `research/REFERENCE_SCORECARD.md`.
- Skills in the repo: `.claude/skills/scroll-craft` (Nate Herk's, MIT, vendored),
  `.claude/skills/reverse-engineer` (Playwright capture of any reference site), your six agent
  specs in `.claude/agents/`.
- Build records: `scrollcraft/builds/jamarimyers/{BRIEF,CONTENT,COPY}.md`, `scrollcraft/FINGERPRINTS.md`.

## The design, in one paragraph
Split stage. The page is two grounds held side by side the whole way down: the Field (dark,
your red-lit football portrait, condensed heavy type) and the Desk (light, your headshot, wide
type), with your name set once across the seam. The seam is a draggable handle on desktop and a
swipe on phones. Act 2 is a two-column ledger of real figures. Act 3 goes quiet: a "41 recovery"
figure and your own sentences about the morning score. Act 4 is the peak: the seam slides across,
the dark side takes the frame, the portrait blooms to full colour, and the page says "Osmo". Act 5
is the Osmo facts and a three-photo "Elsewhere" strip. Act 6 is "Write to me." with one button.

## Decisions I made on your behalf (reverse any of them)
1. Built in `jamarimyers/jamarimyers` as you asked today. Your October package said to use a new
   private `jamari-portfolio` repo and keep this one for the profile README. Only the images that
   appear on the site are committed (optimized webp); the originals and unused photos are not.
2. Positioning: "Founder of Osmo, building what comes after the recovery score for college
   athletes." Osmo leads, football follows, finance is a stated fact. "Finance professional" and
   "content creator" are retired from the tagline. Reasoning in POSITIONING.md section 1 and 3.
3. No creator statistics on the site (the 2.1M views, 980K reach, 6.6%, 16 countries were an
   undated 60-day snapshot). The only creator number kept is "four brand partnerships".
4. No jersey number in copy (roster says 32, your photos show 21 and 22). The photos are untouched.
5. J.P. Morgan is stated only as "investment banking, New York, summers 2025 and 2026". No sector,
   deal or process words. The full-time return offer is not mentioned until you confirm it is public.
6. Email is jamari@osmoperformance.com everywhere (the old site's contact@jamarimyers.com is unverified).
7. "First-gen" (on the old site) is not used until you approve the phrasing. No LLC in the footer.
8. The GitHub profile README was rewritten around Osmo with the approved wording.

## Things only you can resolve
- Photo rights: the red-lit studio portrait and the catch photo are probably Brown athletics
  media; confirm you can publish them. The nail-salon group photo and the St. Paul's graduation
  photo were not used.
- Osmo founding date on the resume page (left blank), "expected May 2027" vs "Class of 2027".
- Whether to add a line about being first-gen, and whether to name the four brands.
- The Status row on the home page is dated "October 2026" (`site/index.html`, the `<time>` in the
  Osmo facts). Update that month whenever the status line changes, so it never reads as stale.
- GitHub Pages: enable it in the repo settings (Source: GitHub Actions) and merge to `main` when
  you want a staging URL at jamarimyers.github.io/jamarimyers. The 404 page uses root paths, so
  it only works once the site is at the domain root (jamarimyers.com). Point DNS only when ready.
- Network policy in this cloud environment blocks wodniack.dev, awwwards.com, jamarimyers.com,
  osmoperformance.com and brownbears.com. Allow them under the environment's Network access if
  you want the reverse-engineer skill run against your references.

## What was verified
- scroll-craft harness at 1440x900, 390x844 and reduced motion: no dead scroll, every cue
  reaches full opacity, all text over media clears 4.5:1. 47 review findings from six lenses,
  39 confirmed by skeptics and applied, 8 refuted with reasons (in the workflow journal).
- No-JavaScript fallback, keyboard slider for the seam, forced-colours mode, 320 to 1920 widths,
  short phones, print stylesheet on the resume, Open Graph image.
- Not verified: a real iPhone (Safari masks, touch feel), a screen reader pass, Lighthouse.

## Next loops (running while you sleep, in order)
1. Fresh-eyes polish pass (athletic director on a phone, investor on a desktop), handle
   discoverability, resume and connect copy pass, Lighthouse.
2. Anything the polish pass finds, then a final commit.
