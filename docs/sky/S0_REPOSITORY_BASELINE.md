# MYTHWROUGHT SKY ROADMAP — S0 BASELINE AND ISOLATION

**Scope:** audit and evidence only. No sky, renderer, menu, clock, gameplay, save, biome, cave, builder, Creative Mode, automation or production changes.
**Pinned production base:** `e9223217ef1e91d282900c3fc13a21eeda316b63` (main at branch creation, 2026-11-18).
**Isolated staging branch:** `sky/roadmap-s0-baseline-20261118`. Draft PR required; never merge, rebase, deploy or unlock v0.11 without the creator's explicit approval.

## Verified exact-production baseline

- GitHub Actions [#44226606966](https://github.com/hdog960/Mythwrought/actions/runs/44226606966) completed SUCCESS on `e9223217ef1e91d282900c3fc13a21eeda316b63`. Full native test suite **925/925 pass**; full 20-script original-game Chromium WebGL2 gate passed. The exact-run browser artifact is **#14393453325** (97 files: 96 PNG and one JSON manifest).
- The exact artifact ZIP SHA-256 is `c78c0eabdf79c2978770effa45246c7c468b32140661c0524d0e41d72d5d1c9b`. Independently audited: 96 PNG files, 93 distinct PNG byte SHA-256 values (three intentional or repeated captures), valid dimensions; the original fantasy sky, game frame, two-thumb rails, and scene were visually inspected. This is **automated Chromium evidence, not physical iPhone acceptance**.
- Existing `src/sky.mjs` renders a fullscreen-triangle procedural daytime sky using `uResolution`, `uYaw`, `uPitch`, static stylized sun, clouds, ridge layers, and constant `DISTANCE_FOG_COLOR`.
- Existing `src/gpu-pipeline.mjs` compiles separate sky and terrain programs; GPU resources are recreated after WebGL context restoration. The shader uses the existing terrain depth-buffer path.
- Existing `src/main.mjs` draws sky before voxels, clears with fixed fog color, and passes the same fixed fog to voxel materials. It uses a foreground RAF driver and `FrameHistory(360)` with built-in p50/p95/worst FPS diagnostics.
- Existing `index.html` settings sheet is `#help`, opened by `#menu`, closed by `#closeHelp`. Creative control, save, seed selection, render resolution, and diagnostics share the sheet; new day/night buttons must not steal the iPhone two-thumb rails.
- Existing `src/persistence.mjs` protects schema-1 per-seed edit deltas with verified journal and backup. Sky time/settings must not modify or migrate `world.save()`, canonical keys, journal/backup, or unapproved seed profiles.
- The `src/render-budget.mjs` preset changes frame-buffer workload; sky should remain inexpensive in Balanced/Battery/Economy, and context recovery must rebuild uniforms/programs.
- CI scope classifier treats new/unrecognized shared sky files as full integration: sky PRs must pass existing root native, CI contracts, full Chromium WebGL2, and dedicated sky-browser gates rather than claiming isolated-builder acceptance.
- `.github/workflows/pages.yml` only publishes on `main` pushes (or manually dispatched). This branch has no authorization to publish.

## S0 baseline capture

`tests/sky/s0-baseline-browser.mjs` and `.github/workflows/sky-s0-baseline.yml` are **S0-only, read-only original-game measurement**. They create fresh, isolated Chromium SwiftShader contexts at 667x375, 844x390, 932x430 and:
1. Confirm real WebGL2, 25 loaded chunks, full-screen sky pass, no fatal notice and intact side grips.
2. Capture full-screen and composed-canvas real-game PNGs with SHA-256 and dimensions.
3. Collect the game's own `FrameHistory` p50/p95/worst/FPS via `RUN DEVICE CHECK` after foreground runtime; never fabricate FPS from CI SUCCESS alone.
4. Verify no page/HTTP errors, no GL error, and no changed storage keys by the diagnostic.
5. Upload screenshots plus `baseline.json` with exact source SHA, browser metadata and metrics.

Measurements in software Chromium/SwiftShader are *not* hardware-equivalent iPhone measurements. Do not claim S0 completed until these dedicated exact-head measurements have passed and artifacts are independently audited.

## Protected S1–S7 design handoff (not implemented)

S1: deterministic 1440-second clock. Two separate menu buttons **SET DAY** and **SET NIGHT** jump to chosen cycle phase but do **not** pause the running clock. Decide clock scoping and persistence strategy under an explicit save-compatibility test; never write to legacy world schema or use nondeterministic wall-clock animations.

S2: move sun with camera-relative sky coordinates, blended atmosphere/terrain fog/lighting and night legibility. S3: exactly three visually distinct moons with independent deterministic orbital phases. S4: bright constellations, dense starfield and low-cost moving stylized clouds. S5: seeded rare sky events without gameplay/save mutation. S6: selective biome coloration with the default sky unchanged outside approved regions. S7: exhaustive original-game Chromium gates, offline PWA, exact-source visual perf, save and physical iPhone Safari/Home Screen acceptance.

Each feature stage must receive its own exact-head native and real WebGL2 checks, screenshots and performance delta against S0; no feature implementation or production merging during S0.