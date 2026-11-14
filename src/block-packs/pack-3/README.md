# MYTHWROUGHT — Pack 3 isolated asset work

**UNMERGED CANDIDATE — NOT IN LIVE GAME.** v0.10 Gate A only. No map generation, structure assembly, central registry changes, shared engine edits, saves migration, crafting, NPCs, or deployment.

## Source-of-truth audit (2026-11-14)

- GitHub main: `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84` (integration checkpoint **006**).
- Issue [#109](https://github.com/hdog960/Mythwrought/issues/109) reserves Pack 3 candidate IDs **109–158**. Immutable existing IDs **0–8**. ID **255** is the unvisited sentinel.
- Read seven authorities `docs/01`…`docs/07`, `docs/INTEGRATION_CHECKPOINTS.md`, `docs/RELEASE_LEDGER.md`, `src/voxel.mjs`, `src/blocks.mjs`, existing `src/storybook-roof.mjs`, `src/physical-construction-kit.mjs`, and open shape PRs [#106](https://github.com/hdog960/Mythwrought/pull/106) / [#108](https://github.com/hdog960/Mythwrought/pull/108).
- Main's `storybook-roof.mjs` is **render-only**; live `VoxelWorld.set` refuses IDs above 8. Existing waystone/ruin/watchtower templates use existing IDs, not these independent roof parts.
- Exclusive dirs: `src/block-packs/pack-3/` and `tests/block-packs/pack-3/`. Check fresh main, other pack PRs, Issue #109 and new [Issue #117](https://github.com/hdog960/Mythwrought/issues/117). Issue #117 reserves a separate 130-family catalog for :12 and expressly preserves all manual pack IDs/ownership.

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
| 69 | 116 | Glimmerwatch Fortress Wall | Isolated physical candidate | 4 rotations, 11 physical box volumes, through-arrow slit | :00 shape targeting/stateful save integration |
| 70 | 117 | Sunward Crenel Battlement | Isolated physical candidate | 4 rotations, 10 volumes, two merlons with opening | :00 shape targeting/stateful save integration |
| 71 | 118 | Moonward Stone Buttress | Isolated physical candidate | 4 rotations, 8 tapered box volumes | :00 shape targeting/stateful save integration |
| 72 | 119 | Stargrove Ornamental Column | Isolated physical candidate | 4 rotations, 11 volumes, fluted shaft and gilded capital | :00 targeting/rotation save, :12 mesh |
| 73 | 120 | Twilight Dentil Cornice | Isolated physical candidate | 4 rotations, 13 volumes, projecting crown and three brackets | :00 targeting/rotation save, :12 mesh |
| 74 | 121 | Dawnward Arch Window Surround | Isolated physical candidate | 4 rotations, 13 volumes, hollow arch and keystone, NO glazing | :00 targeting/rotation save; Pack 4 owns glass |
| 75 | 122 | Sunleaf Carved Relief | Isolated physical candidate | 4 rotations, 12 volumes, raised front-facing relief | :00 targeting/rotation save, :12 mesh |
| 76 | — | Aqueduct channels | Not started | — | physical containment only, no fluid engine |
| 77 | — | Crystal spires | Not started | — | separate from CRYSTAL 5 |
| 78 | — | Carved statues | Not started | — | selection/removal per piece |

**Three remaining families (76–78) have no assigned IDs.** No unassigned ID is promised or counted as completed. Each roofing family has multiple genuine raised/layered box parts; its collision and selection boxes are *the exact same occupied volumes* as preview geometry. Box count remains below the :00 32-box contract. Color palettes are candidate material metadata only, not installed shader code.

## Opt-in preview and test fixture

- `roofing-materials.mjs`: four stable ID/geometry/material definitions.
- `manifest.mjs`: 17-family ownership/duplicate-audit ledger.
- `fixture.mjs`: isolated manual place, remove, inspect geometry, and save/restore demonstration for IDs 109–112.
- `roof-geometry.mjs`: separate physical roof-pitch, hip-corner, and ridge-cap shape profiles (IDs 113–115) with four cached quarter-turn box descriptors each; same boxes used for selection and collision; original hearthclay visual material metadata.
- `roof-geometry-fixture.mjs`: independent placement/removal/shape-target callback and candidate **orientation-sidecar** snapshot/restore. NOT a game save, NOT live runtime wiring.
- `fortified-pieces.mjs`: physical 116 fortress slit wall, 117 merlon battlement and 118 tapered buttress definitions with 4 rotations each.
- `fortified-fixture.mjs`: separate candidate-only per-cell placement/rotation, selection-shape callback, removal, and state round-trip; **not** the live save codec.
- `ornamental-pieces.mjs`: four sculpted geometry/material families 119–122 with four Y rotations, raised depth and true arch void.
- `ornamental-fixture.mjs`: isolated candidate-only place/rotate/target/remove/snapshot; intentionally not schema-1.
- `tests/block-packs/pack-3/ornamental-pieces.test.mjs`: 12 independently authored geometry, ray/occupancy, rotation, and candidate restore regressions.
- `tests/block-packs/pack-3/fortified-pieces.test.mjs`: 11 physical profile, rotation, ID, placement/removal and fail-closed candidate restore regressions.
- New test suite: `node --test tests/block-packs/pack-3/roof-geometry.test.mjs` (nested; not in current default CI glob).
- `preview.html`: optional **14-asset** gallery of actual physical box unions, with 10 rotating roof/fortified/ornamental variants (not the live game).
- Reproducible isolated regression: `node --test tests/block-packs/pack-3/roofing.test.mjs`.
- The existing `npm test` script only globs `tests/*.test.mjs`; this nested suite needs an explicit invocation. Do not claim CI exercised it without evidence.

**Honest integration boundary:** the fixture writes `{schema:1,seed,edits}`-shaped candidate samples, but the live `VoxelWorld.restore` currently **rejects candidate IDs 109–122**. Rotation is locked at 0 for the first four surface candidates. The three shaped profiles support four rotations only inside a separate opt-in preview fixture, **not** in the current game's schema-1 save system. For non-cube roof stairs/corners/ridges, require merged :12 meshing and :00 selection/collision/save handling plus a creator-approved backward-compatible rotation persistence contract before promising live rotation persistence. Do not use these fixture snapshots as player saves. Integration must preserve existing player data and fail closed for unsupported states.

## Session handoff

Milestone 0: verified authorities/contracts, dedicated manifest and isolated fixture; candidate module authored. Milestone 1: **four isolated original material/physical geometry candidates authored**, previous exact-source local Node 7/7 passed. Milestone 2: **three original physically occupied roof profiles and all 12 rotations authored**, :00 raycast/canPlace and :12 surface-mesh source contract V8-tested with 7 rays/12 shape variants; 324–420 surface triangles per candidate under opt-in :12 prototype. Separate rotation sidecar fixture authored. Local Node 22 source-matched Pack 3 suites **16/16 passed**; genuine Chromium inline-gallery smoke at 667×375, 844×390, 932×430 rendered all seven candidates and successfully rotated all three new profiles with no page errors. These screens are opt-in previews, NOT live game screenshots. Milestone 3: **three isolated independently physical fortified pieces authored**, all four rotations for each (IDs 116–118), with an independent placement/removal/orientation fixture, 11 new Node regressions and opt-in previews. **Not integrated**. Milestones 4–6 remain open. Branch and exact PR HEAD live in the reviewable PR; never infer a later HEAD from this initial audit.

No actual iPhone or live-world verification. Manual creator incorporation only, after independent tests and explicit approval.


## Milestone 2 compatibility and acceptance evidence (2026-11-14)

- :00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106) unmerged source blob `01be82e6c308e47a35fa6588cc6ed1ebeafca307`: its actual `validateShape`, `rotateShape`, `raycastShapes`, and `canPlaceShape` functions accepted all **12** Pack 3 oriented descriptors in a one-off isolated V8 source-harness run. Positive/negative ray targets verified front/back pitch, diagonal hip, ridge spine/empty margins; same-cell overlap disallowed, empty-cell insertion allowed.
- :12 [PR #108](https://github.com/hdog960/Mythwrought/pull/108) unmerged source blob `cedf79c201d6fb2b18465893d62d867e5a991220`: actual `prototypeSurfaceMesh` accepted all **12** rotated descriptors; 324 triangles (pitch), 384 (hip), 420 (ridge), finite unit bounds. No extra generic shape engine authored here.
- These checks validate prototype adapter behavior, **not production runtime registration, live player collision, canonical schema-1 save support, phone screenshot fidelity, or FPS**. Ran `node --test tests/block-packs/pack-3/*.test.mjs` locally (Node v22.16.0): **16 pass, 0 fail**. The roof-geometry module, fixture, manifest, and new tests were verified as byte-identical to the exact GitHub blob hashes. The pre-existing roofing-material regression suite also passed. `npm test` on main excludes these nested tests until a centrally authorized CI change.
- Old integrated physical temples, ruins, waystones, and render-only roof shader remain distinct from these standalone asset IDs. No world placement or architected structures are included.


### Opt-in gallery Chromium verification

On 2026-11-14, a self-contained rendition of `preview.html` using the exact committed `roofing-materials.mjs`, `roof-geometry.mjs` and gallery JavaScript was opened in genuine headless Chromium via Playwright at **667×375, 844×390, and 932×430 CSS pixels**. All seven candidate cards and three working 90° rotation buttons were exercised; no JavaScript page exceptions. Three authentic full-page PNGs were captured and visually inspected in the conversation runtime. The environment blocked localhost navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`, so the script was inlined for the browser fixture; this is not proof of static module HTTP loading, deployed GitHub Pages or live WebGL integration. No physical-iPhone or GPU/FPS claims.

## Milestone 3 — fortified architecture verification (2026-11-14)

**Duplicate audit:** current merged main `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84` / checkpoint **006** still exposes only persistent 0–8. Pack 3 physical candidate IDs **116–118** are distinct from Pack 1 modest wall shapes, Pack 2 low parapets, and :12 Issue #117's separate nature/ruin catalog. These are THREE individually selectable, breakable-ready unit-cell components, not placed or assembled castle templates.

| Roster | ID | Occupancy boxes | Quarter turns | :12 surface triangles/turn |
|---|---:|---:|---:|---:|
| 69 Armored wall, real arrow-slit gap | 116 | 11 | 4 | 1088 |
| 70 Defensive merlons, real central crenel gap | 117 | 10 | 4 | 1068 |
| 71 Tapered wall-facing buttress | 118 | 8 | 4 | 1100 |

An initial trim-heavy buttress candidate generated 1968 triangles and was reduced to 1100 while preserving its tapered outline and runic detail. All **12** fortified rotations are accepted by the actual unmerged :00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106) `validateShape`, `rotateShape`, `canPlaceShape` interfaces and :12 [PR #108](https://github.com/hdog960/Mythwrought/pull/108) `prototypeSurfaceMesh` interface. Seven real candidate-code hit/miss ray checks pass. These are candidate source-contract checks, not production GPU/FPS measurements.

**Node:** genuine Node.js v22.16.0 `node --test tests/block-packs/pack-3/*.test.mjs`: **27 pass, 0 fail** (7 material, 9 roof profile, 11 fortified). The committed GitHub blob SHA of the fortified source, fixture, and tests matched their exact locally executed copies. Root `npm test` does not run nested Pack 3 tests.

**Chromium:** genuine headless Chromium 144 at **667×375, 844×390 and 932×430 CSS px** displayed all 10 physical box-model cards, and the 6 rotate controls worked through two quarter-turns with zero JS page errors. Full-page screenshots captured and visually inspected. The container blocks localhost and external navigation, so the *same committed module code and gallery script* were inlined into an isolated browser fixture. Thus module loading from GitHub Pages, live WebGL, actual iPhone Safari, gameplay collision and FPS were **not tested**.

**Save compatibility boundary:** `fortified-fixture.mjs` serializes only `mythwrought-pack3-fortified-candidate-v1` with `parts:[{cell,id,rotation}]`. There is **no production `schema:1` save signature**; this candidate snapshot is never fed to the existing player world. Live `VoxelWorld.restore` still rejects IDs 109–118. Future central integration alone must authorize/validate the ID codec and backward-safe rotation persistence.

**Status:** Milestones 0–3 have authored isolated candidates, NOT creator acceptance or live installation. Milestones 4–6 are open. The next milestone is four individual ornament pieces (72–75): columns, cornices, arch surrounds (Pack 4 owns glazing), and relief panels. No generation/assembly/merge/deploy occurred.

## Milestone 4 — ornamental architecture work (2026-11-14)

**Audit:** main remains `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, checkpoint 006, live persistent IDs 0–8, 255 sentinel. Both [Issue #109](https://github.com/hdog960/Mythwrought/issues/109) and [Issue #117](https://github.com/hdog960/Mythwrought/issues/117) preserve the manual Pack 3 ownership of 72–75; existing stone pillars, carved cube shaders, and Pack 4 window frames/glazing are **not** these physical definitions.

| Roster | Candidate ID | Physical geometry and distinctive art | Shape boxes | 4-rotation boundary-mesh triangles |
|---|---:|---|---:|---:|
| 72 | 119 | Stargrove gilded-flute column, shaft, plinth, projecting capital volutes | 11 | 1896 |
| 73 | 120 | Twilight three-bracket cantilevered dentil cornice, deep raised front crown | 13 | 1276 |
| 74 | 121 | Dawnward tall masonry arch surround, two jambs, clear through-opening, raised keystone, **no glass** | 13 | 1204 |
| 75 | 122 | Sunleaf relief face-mounted shallow plaque, physical raised central sun/rays, NOT a cube | 12 | 1740 |

The initial column/relief geometric complexity was reduced by removing redundant raised detail while preserving meaningful 3D silhouette. **Actual :00/:12 interface compatibility**: all 16 rotating shapes validate with pending `validateShape`, `rotateShape`, `canPlaceShape`, `prototypeSurfaceMesh`; **9** positive/negative `raycastShapes` probes include the unobstructed arch void and protruding relief. All meshes remain under 2,000 boundary-only triangles at the current prototype implementation; these counts are not iPhone GPU measurements.

**Isolated regression suite:** `tests/block-packs/pack-3/ornamental-pieces.test.mjs` covers 12 regression cases, all 12 evaluated successfully using exact committed source in an isolated JavaScript V8 assertion harness (not a substitute for a genuine Node process). Earlier Pack 3 27-case suite has already passed local Node v22.16.0 before this change. **Root `npm test` excludes the nested Pack 3 tests**; do not claim the CI runner validates these new tests automatically. Further actual Node and Chromium evidence should be attached only when executed.

**Saves:** `ornamental-fixture.mjs` writes only `mythwrought-pack3-ornamental-preview-v1` format with explicit per-cell rotation and no `schema:1` field, NOT a production save. Live `VoxelWorld.set/restore` rejects IDs 119–122. Dynamic live orientation persistence is still a :00/central-integration dependency.

**Status:** Milestone 4 physical source candidates authored; creator approval and live integration pending. **Three** final monumental families 76–78 remain to be developed under Milestone 5. Nothing added to world generation, no completed structures, no shared engine edits, merge, or deployment.
