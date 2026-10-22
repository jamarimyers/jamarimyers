# Jamari Myers

Founder of [Osmo](https://osmoperformance.com), an emotional performance platform for college athletes, sold to athletic departments. App built; in release testing with early athletes.

I played defensive back at Brown until I stopped after my sophomore year. What stayed with me was a morning routine: a recovery score arrived every day, and nobody gave me anything to do with it. Osmo is the missing step. A short morning check-in, optional wearable context, one next move for today.

### Now
- **Osmo** (Stateframe Technologies, Inc.): product and engineering. TypeScript, React Native, Expo, Node.js, Supabase.
- **Brown University '27**, Business Economics and Entrepreneurship.
- Two summers in investment banking at J.P. Morgan (2025, 2026), healthcare and industrials.

### This repository
The source for [jamarimyers.com](https://jamarimyers.com) lives in `site/`, built on the [scroll-craft](https://github.com/nateherkai/scroll-craft) engine (MIT). Deployed with GitHub Pages from `main`.

### Reach me
- jamari@osmoperformance.com
- [osmoperformance.com](https://osmoperformance.com)
- [LinkedIn](https://www.linkedin.com/in/jamari-myers/)

### Maintaining the site
- Copy and facts: `scrollcraft/builds/jamarimyers/CONTENT.md` is the source of truth; `COPY.md` holds the final lines.
- The status line in `site/index.html` carries a month ("Status, October 2026"). Update it whenever the status changes.
- Verify after any change (needs Node, a Chromium binary and `npm i playwright-core`):
  ```bash
  node .claude/skills/scroll-craft/scripts/serve.mjs --root site --port 4500 &
  node .claude/skills/scroll-craft/scripts/shoot.mjs --url http://127.0.0.1:4500 --out scrollcraft/lab/desktop
  node .claude/skills/scroll-craft/scripts/shoot.mjs --url http://127.0.0.1:4500 --out scrollcraft/lab/mobile --width 390 --height 844
  node .claude/skills/scroll-craft/scripts/shoot.mjs --url http://127.0.0.1:4500 --out scrollcraft/lab/reduced --reduced-motion
  ```
  Then read `sheet.png` in each folder. The harness reports dead scroll, cues that never reach full opacity, and contrast.
- Deploy: enable GitHub Pages (Settings, Pages, Source: GitHub Actions) and merge to `main`. The workflow publishes `site/`.
- Reference sites: `.claude/skills/reverse-engineer` captures any URL into design notes and a scroll strip.
