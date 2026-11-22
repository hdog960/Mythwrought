# MYTHWROUGHT — Enchanted Forest Phase 2: Physical caps, biome-edge and three-seed census

**Protected, isolated source development only; no merge, deployment or user-save changes.** Date 2026-11-22. Base child HEAD at entry `1b3f7d413c179bb2fa04a8e3f03c5ff944a49edf`. Production `main=7016e14cd6289f45eaf7fc6a79a362b47996df65`, protected enchanted parent `db8cad02387050579c75cbdcdea3e94a9f6d6bee` verified unchanged once.

## New actual code changes

- Ancient Giant four-root cap check now **rejects a buried subsoil entry below a higher authored M7 column**. A valid-looking non-AIR cell at FLOOR is not necessarily the highest real surface. This rejects cave-hidden raised slopes and future malformed column elevations. Existing four distinct 2×2 corners, root subsoil, headroom and landmark preservation remain enforced.
- Experimental enchanted canopy overlap now **preserves already-placed non-enchanted grove/conifer or other protected source voxel** at a mixed-biome edge. Candidate-only overlaps retain the deterministic bark-first ranking `aetherBark > moonLeaves > aetherLeaves`. The original noncandidate M7 write path remains untouched.
- Actual original-source native `tests/manual-biomes/enchanted-tree-physical-census-seams.test.mjs` now enumerates **three authentic seeded worlds** (179, 7919, −88), applying original 8×8 tree site/density and real source cave/landmark/terrain readers to compare former vs stricter Giant eligibility. It validates all four supports, Y19 limits, actual world tree cells and source chunk parity; a second test compares six exact 16×16 chunks per seed with separate world caches, checks world reader vs chunk planner, and requires actual connected tree geometry across chunk seams.
- Existing focused real-M7 root test and 8 prior Phase2 source regressions remain included for the newly modified source. This is NOT a browser suite or an updated historical M7 generator identity.

## Test evidence and runner efficiency

- **10/10 local native source-unit tests PASS** on exact files verified against their GitHub blob SHA: helper `enchanted-tree-footings.mjs` `3d278a44070719ac9154d128f271ffa9939baaa5`; its unit tests `80283d04e233c90430da62c0d94375b9d842845d`; overlap helper `6677365a7f18c6f7c4de78f5925d07dc68f56aa5`; overlap tests `0c5e78fa554ce3a9eaad243f773a5847be471888`. Syntax checked in Node 22; these are real local native tests of the two small helpers, **not full-game integration**.
- **One and only one new focused GitHub Actions native job** triggered by adding child-branch-only `.github/workflows/enchanted-phase2-physical-native.yml`. [Run #45028995700](https://github.com/hdog960/Mythwrought/actions/runs/45028995700) at exact current source revision `7e76a19f856434113c8f1d1804d15a4ce4e71ec6` was **QUEUED** at the first/only check. It runs only the root, overlap, real-M7, new source census/seam and previous Phase2 native regression tests on Node 22 (no npm install, browser, WebGL2, screenshots, PWA or repository-wide suite).
- Prior exact-source Phase2 [native run #44965659979](https://github.com/hdog960/Mythwrought/actions/runs/44965659979) 34/34 PASS and [original-engine run #44972193017](https://github.com/hdog960/Mythwrought/actions/runs/44972193017) SUCCESS remain accepted **only for earlier unchanged code/visual design**. Giant census of 12 and +4.9% six-chunk GPU aggregate are prior-source numbers, **not claims about this latest footing/canopy code**.
- No repeated queue checks, duplicate native suite, Chromium/WebGL2, other developer CI, cancellations or shared workflows modified.

## Outstanding source acceptance

1. Read **one exact-source native job** `#45028995700` when complete. Obtain real `oldEligible/newEligible/blockedByStrictRoots` census and actual chunk seam adjacency counts from logs. If it fails, investigate the real cause and fix; do not weaken source tests.
2. If any Giant population drops to zero or near-zero, design **source-backed natural root growth on actual M7 terrain without altering original geometry, cave AIR or saved-world identities**. Do not simply waive the four-root protection.
3. Genuine current-branch original-game WebGL2 at a meaningful visual milestone, only affected Giant/mixed-biome locations; iPhone Home Screen PWA streaming/physics/framerate p95; separately approved versioned generator/save migration before any release. No claim that current experimental tree code is shipping.
