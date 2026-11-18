# Roadmap 9 — M2 detached flight foundation acceptance

**Prerequisite:** PR #186 M1 HEAD `aaa913f1f2ba0806bb2d1df7a62d5040e525f076` passed exact-head GitHub Actions #43771171510 (including full production WebGL2 gate), and all 13 changed paths belonged to Creative Mode. `main` remained unchanged at M2 start. **M2 is feature-local only, not game-integrated.**

## Implemented

- `src/creative-mode/flight-model.mjs`: pure and immutable flight state, hover, ascent, descent, horizontal movement with yaw, speed profiles (precision 1.4, normal 4, fast 8, travel 15 units/second), normalized diagonals and a 50-ms frame-step cap. Motion path checks loaded-safe locations at quarter-unit intervals; non-ready/height-unsafe destination blocks movement rather than tunneling through unloaded world space.
- Bounded **prefetch plans only**, not real chunk fetches: at most two new requests per update, six pending, duplicate regions suppressed. Host must explicitly provide readiness/settlement and own actual queue throttling; no performance guarantees can be extrapolated from this fixture.
- `returnToGround` requires an explicit safe landing candidate and region readiness. If absent, invalid, above the flyer, below height bounds or unready, it refuses exit and remains in hover. This is not collision or terrain validation of the production world.
- Standalone preview `preview.html`/`.mjs`/`.css`: working FLY ON/OFF, LAND, held UP/DOWN, profile picker, left-pad directional flight, right-pad yaw, keyboard WASD/Q/E; telemetry of XYZ and blocked status. Sample environment has finite fixture readiness, not generated biome or cave chunks. Opening inventory pauses movement; entering Explore lands; loss of focus, pointer cancellation and hidden-page state clear controls. The upper-right minimap reservation and separate two-thumb rails remain visible. All existing sample catalog entries are **not real placeables**.

## Verification and limits

- Native Node 22: `node --test tests/creative-mode-m0.test.mjs tests/creative-mode-m1.test.mjs tests/creative-mode-m2.test.mjs` — 28 passing test cases (8 M0 + 8 M1 + 12 M2), no failures.
- Actual system Chromium/Playwright browser tests, using original source injected into `about:blank` because localhost browser navigation is restricted: `python3 tests/creative-mode/preview-browser.py` (220 M1 assertions) and `python3 tests/creative-mode/flight-browser.py` (160 M2 assertions) across landscape 568×320, 667×375, 844×390, 932×430, 956×440 and 1180×520, plus pointer/keyboard/portrait. Screenshots at 568×320 and 956×440 are isolated fixture proof, **not real WebGL2 game screenshots or real iPhone testing**.
- Exact-head GitHub Actions for this M2 commit still requires independent recheck; never claim green from local tests. CI selector classifies unknown Creative files as shared/unrecognized and therefore runs the full 20-script game WebGL2 gate; do not change shared CI to bypass it.

## M2 remaining / M3 entry

- No real player physics, collision, block updates, terrain, cave streaming or actual chunk prefetch; future approved adapter must validate segment movement in full 3D and supply robust airborne/grounded transition; no physical device measurements.
- No edits to `index.html`, `src/main.mjs`, core controls, renderer, worldgen, saves, service worker, main, other builder lanes, block packs, automations, schema 1 or locked v0.11.
- M3 next (only on explicit Continue Development and green exact-head CI): isolated, virtualized and searchable inventory backed by an **authorized runtime-registered-placeables adapter**, without fabricating IDs or consuming draft PR assets.
