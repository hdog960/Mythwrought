# MYTHWROUGHT — Pack 3 isolated asset work

**UNMERGED CANDIDATE — NOT IN LIVE GAME.** v0.10 Gate A only. No map generation, structure assembly, central registry changes, shared engine edits, saves migration, crafting, NPCs, or deployment.

## Source-of-truth audit (2026-11-14)

- GitHub main: `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84` (integration checkpoint **006**).
- Issue [#109](https://github.com/hdog960/Mythwrought/issues/109) reserves Pack 3 candidate IDs **109–158**. Immutable existing IDs **0–8**. ID **255** is the unvisited sentinel.
- Read seven authorities `docs/01`…`docs/07`, `docs/INTEGRATION_CHECKPOINTS.md`, `docs/RELEASE_LEDGER.md`, `src/voxel.mjs`, `src/blocks.mjs`, existing `src/storybook-roof.mjs`, `src/physical-construction-kit.mjs`, and open shape PRs [#106](https://github.com/hdog960/Mythwrought/pull/106) / [#108](https://github.com/hdog960/Mythwrought/pull/108).
- Main's `storybook-roof.mjs` is **render-only**; live `VoxelWorld.set` refuses IDs above 8. Existing waystone/ruin/watchtower templates use existing IDs, not these independent roof parts.
- Exclusive dirs: `src/block-packs/pack-3/` and `tests/block-packs/pack-3/`. Check fresh main, other pack PRs and Issue #109 before further work.

## Asset-by-asset progress and unique persistent candidate IDs

| Roster | Candidate ID | Name | Status | Variants | Next/dependency |
|---:|---:|---|---|---|---|
| 23 | 109 | Wooden shingles | Isolated physical candidate | cedar scale surface | :00 registry/raycast/save integration |
| 24 | 110 | Clay roof tiles | Isolated physical candidate | fired barrel-tile surface | :00 registry/raycast/save integration |
| 25 | 111 | Slate roof tiles | Isolated physical candidate | cleft blue-grey slate surface | :00 registry/raycast/save integration |
| 26 | 112 | Thatched roofing | Isolated physical candidate | thick golden straw surface | :00 registry/raycast/save integration |
| 27 | 113 | Pitched roof stair/slope | Isolated physical candidate | four quarter-turns, 16 box parts | :00 stateful rotation and :12 mesher |
| 28 | 114 | Hip roof corner | Isolated physical candidate | four diagonal hip orientations, 9 box parts | :00 stateful rotation and :12 mesher |
| 29 | 115 | Crown roof ridge | Isolated physical candidate | four rotations, 6 box parts (180° symmetric) | :00 stateful rotation and :12 mesher |
| 69 | — | Castle wall sections | Not started | — | own distinct fortified unit |
| 70 | — | Battlements | Not started | — | not Pack 2 parapet |
| 71 | — | Stone buttresses | Not started | — | anchored physical projection |
| 72 | — | Ornamental columns | Not started | — | not Pack 1 pillar |
| 73 | — | Decorative cornices | Not started | — | protruding separate trim |
| 74 | — | Large arched windows | Not started | — | surround only; Pack 4 glazing |
| 75 | — | Carved stone reliefs | Not started | — | face-mounted physical panel |
| 76 | — | Aqueduct channels | Not started | — | physical containment only, no fluid engine |
| 77 | — | Crystal spires | Not started | — | separate from CRYSTAL 5 |
| 78 | — | Carved statues | Not started | — | selection/removal per piece |

**Ten remaining families (69–78) have no assigned IDs.** No unassigned ID is promised or counted as completed. Each roofing family has multiple genuine raised/layered box parts; its collision and selection boxes are *the exact same occupied volumes* as preview geometry. Box count remains below the :00 32-box contract. Color palettes are candidate material metadata only, not installed shader code.

## Opt-in preview and test fixture

- `roofing-materials.mjs`: four stable ID/geometry/material definitions.
- `manifest.mjs`: 17-family ownership/duplicate-audit ledger.
- `fixture.mjs`: isolated manual place, remove, inspect geometry, and save/restore demonstration for IDs 109–112.
- `roof-geometry.mjs`: separate physical roof-pitch, hip-corner, and ridge-cap shape profiles (IDs 113–115) with four cached quarter-turn box descriptors each; same boxes used for selection and collision; original hearthclay visual material metadata.
- `roof-geometry-fixture.mjs`: independent placement/removal/shape-target callback and candidate **orientation-sidecar** snapshot/restore. NOT a game save, NOT live runtime wiring.
- New test suite: `node --test tests/block-packs/pack-3/roof-geometry.test.mjs` (nested; not in current default CI glob).
- `preview.html`: optional **seven-asset** gallery depicting actual box parts, with 90-degree interactive rotation for pitch/hip/ridge (not a screenshot of live WebGL).
- Reproducible isolated regression: `node --test tests/block-packs/pack-3/roofing.test.mjs`.
- The existing `npm test` script only globs `tests/*.test.mjs`; this nested suite needs an explicit invocation. Do not claim CI exercised it without evidence.

**Honest integration boundary:** the fixture writes `{schema:1,seed,edits}`-shaped candidate samples, but the live `VoxelWorld.restore` currently **rejects candidate IDs 109–115**. Rotation is locked at 0 for the first four surface candidates. The three shaped profiles support four rotations only inside a separate opt-in preview fixture, **not** in the current game's schema-1 save system. For non-cube roof stairs/corners/ridges, require merged :12 meshing and :00 selection/collision/save handling plus a creator-approved backward-compatible rotation persistence contract before promising live rotation persistence. Do not use these fixture snapshots as player saves. Integration must preserve existing player data and fail closed for unsupported states.

## Session handoff

Milestone 0: verified authorities/contracts, dedicated manifest and isolated fixture; candidate module authored. Milestone 1: **four isolated original material/physical geometry candidates authored**, previous exact-source local Node 7/7 passed. Milestone 2: **three original physically occupied roof profiles and all 12 rotations authored**, :00 raycast/canPlace and :12 surface-mesh source contract V8-tested with 7 rays/12 shape variants; 324–420 surface triangles per candidate under opt-in :12 prototype. Separate rotation sidecar fixture authored. Local Node 22 source-matched Pack 3 suites **16/16 passed**; genuine Chromium inline-gallery smoke at 667×375, 844×390, 932×430 rendered all seven candidates and successfully rotated all three new profiles with no page errors. These screens are opt-in previews, NOT live game screenshots. Milestones 3–6 remain open. Branch and exact PR HEAD live in the reviewable PR; never infer a later HEAD from this initial audit.

No actual iPhone or live-world verification. Manual creator incorporation only, after independent tests and explicit approval.


## Milestone 2 compatibility and acceptance evidence (2026-11-14)

- :00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106) unmerged source blob `01be82e6c308e47a35fa6588cc6ed1ebeafca307`: its actual `validateShape`, `rotateShape`, `raycastShapes`, and `canPlaceShape` functions accepted all **12** Pack 3 oriented descriptors in a one-off isolated V8 source-harness run. Positive/negative ray targets verified front/back pitch, diagonal hip, ridge spine/empty margins; same-cell overlap disallowed, empty-cell insertion allowed.
- :12 [PR #108](https://github.com/hdog960/Mythwrought/pull/108) unmerged source blob `cedf79c201d6fb2b18465893d62d867e5a991220`: actual `prototypeSurfaceMesh` accepted all **12** rotated descriptors; 324 triangles (pitch), 384 (hip), 420 (ridge), finite unit bounds. No extra generic shape engine authored here.
- These checks validate prototype adapter behavior, **not production runtime registration, live player collision, canonical schema-1 save support, phone screenshot fidelity, or FPS**. Ran `node --test tests/block-packs/pack-3/*.test.mjs` locally (Node v22.16.0): **16 pass, 0 fail**. The roof-geometry module, fixture, manifest, and new tests were verified as byte-identical to the exact GitHub blob hashes. The pre-existing roofing-material regression suite also passed. `npm test` on main excludes these nested tests until a centrally authorized CI change.
- Old integrated physical temples, ruins, waystones, and render-only roof shader remain distinct from these standalone asset IDs. No world placement or architected structures are included.


### Opt-in gallery Chromium verification

On 2026-11-14, a self-contained rendition of `preview.html` using the exact committed `roofing-materials.mjs`, `roof-geometry.mjs` and gallery JavaScript was opened in genuine headless Chromium via Playwright at **667×375, 844×390, and 932×430 CSS pixels**. All seven candidate cards and three working 90° rotation buttons were exercised; no JavaScript page exceptions. Three authentic full-page PNGs were captured and visually inspected in the conversation runtime. The environment blocked localhost navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`, so the script was inlined for the browser fixture; this is not proof of static module HTTP loading, deployed GitHub Pages or live WebGL integration. No physical-iPhone or GPU/FPS claims.
