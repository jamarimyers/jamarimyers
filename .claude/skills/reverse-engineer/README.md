# reverse-engineer

Capture a reference site and turn it into a borrow list for scroll-craft.

1. `npm i playwright-core` in the project (or any parent folder).
2. `node scripts/capture.mjs --url https://example.com --out recon/example`
3. Output: `DESIGN-NOTES.md`, `raw.json`, and `<out>/1440/step-01..10.png`, `<out>/390/step-01..10.png`.
4. Chrome lookup: `--chrome`, env `SCROLLCRAFT_CHROME`, `PLAYWRIGHT_BROWSERS_PATH`, `/opt/pw-browsers`, then `chromium` on PATH.
5. Exit 2 means the page did not load; the message names the host. If the network policy blocks it, allow the domain in the environment settings.
6. Flags: `--viewports 1440x900,390x844`, `--ignore-https-errors`, `--no-proxy`.
7. Then follow SKILL.md: read the notes and screenshots, write `BORROW-LIST.md`, hand it to scroll-craft.
8. The capture is private reference. Do not ship its screenshots, assets, or copy.
9. Use only on pages you were asked to study; one URL per run.
10. Smoke test: serve any local HTML with `python3 -m http.server` and capture `http://127.0.0.1:<port>/`.
