# Creative Builder Mode — independent Roadmap 9

Creator-authorized draft-only development, Mythwrought v0.10 Gate A; v0.11 remains locked. The eight builder lanes, all manual Block Packs, five hourly automations, main and live deployment remain independently owned and untouched.

**M0 — passed** at `a2ee61d8e07c97a6d087a9ced7655094ea26cfde`, GitHub run #43767145743. See [M0_ARCHITECTURE.md](M0_ARCHITECTURE.md) for source audit, exclusive file scopes and versioned adapter contract.

**M1 — isolated UX preview only.** Open `src/creative-mode/preview.html` in a static server (or the test harness); standalone Explore/Creative switching, two-thumb-safe landscape UI, sample-search inventory, selectable 6-slot hotbar, preview thumb input and reserved upper-right minimap. This is NOT mounted into the game, has no flight, actual placeable asset registry, world edits or saves. All samples are clearly labeled and never registered/placeable. See [M1_ACCEPTANCE.md](M1_ACCEPTANCE.md).

Focused Node 22: `node --test tests/creative-mode-m0.test.mjs tests/creative-mode-m1.test.mjs`.
Actual Chromium DOM tests (Playwright + system Chromium): `python3 tests/creative-mode/preview-browser.py`. This test injects the exact feature files because localhost browser navigation is restricted in the test environment.

Next: M2 safe flight; M3 authoritative runtime-placeables inventory; M4 bounded building; M5 save/undo/recovery; M8 exact-head WebGL2/mobile/offline integration evidence. Optional M6 building tools and M7 accepted blueprints never block first usable core. Future production attachment requires a separate creator-authorized integration window.
