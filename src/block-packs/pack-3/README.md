# MYTHWROUGHT — Pack 3 isolated asset work

**UNMERGED CANDIDATE — NOT IN LIVE GAME.** v0.10 Gate A only. No map generation, structure assembly, central registry changes, shared engine edits, saves migration, crafting, NPCs, or deployment.

**LATEST STATUS (Milestone 6):** [Read the dedicated 17-family candidate acceptance and integration handoff](./ACCEPTANCE.md). All 17 families are authored as candidates, and the six committed nested Pack 3 suites (53 original + 11 acceptance checks) passed **64/64 in genuine Node.js v22.16.0** against GitHub-blob-matched files. Chromium 144 isolated gallery: 17 cards, 13 functioning rotations at 667×375 / 844×390 / 932×430, zero JS exceptions. The prior Milestone 5 testing notes below are historical; its 14 committed Node tests have **now been executed directly**. Creator approval, live integration, actual WebGL2 and physical iPhone certification are STILL PENDING.

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
| 76 | 123 | Greywater Aqueduct Channel | Isolated physical candidate | 4 rotations, 11 boxes, hollow dry trough and raised banks | :00 placement/save; future fluid engine for water only |
| 77 | 124 | Aethercrown Crystal Spire | Isolated physical candidate | 4 rotations, 10 boxes, tapered stone neck and faceted inlay crystal | :00 placement/save; optional light engine |
| 78 | 125 | Sentinel of the Dawn Statue | Isolated physical candidate | 4 rotations, 11 boxes, legs/arms/helmet/shield figure | :00 placement/save; no NPC or assembly |

**All 17 roster families now have unique candidate IDs 109–125.** No unassigned ID is promised or counted as completed. Each roofing family has multiple genuine raised/layered box parts; its collision and selection boxes are *the exact same occupied volumes* as preview geometry. Box count remains below the :00 32-box contract. Color palettes are candidate material metadata only, not installed shader code.

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
- `monumental-pieces.mjs`: open dry aqueduct channel (123), inactive nonemissive crystal spire finial (124), and freestanding guardian statue (125), with 4 rotated precise box-union contracts each.
- `monumental-fixture.mjs`: isolated place/remove/target/rotation state, candidate format (NEVER production schema-1 save).
- `tests/block-packs/pack-3/monumental-pieces.test.mjs`: 14 additional targeted physical/regression cases.
- `tests/block-packs/pack-3/ornamental-pieces.test.mjs`: 12 independently authored geometry, ray/occupancy, rotation, and candidate restore regressions.
- `tests/block-packs/pack-3/fortified-pieces.test.mjs`: 11 physical profile, rotation, ID, placement/removal and fail-closed candidate restore regressions.
- New test suite: `node --test tests/block-packs/pack-3/roof-geometry.test.mjs` (nested; not in current default CI glob).
- `preview.html`: optional **14-asset** gallery of actual physical box unions, with 10 rotating roof/fortified/ornamental variants (not the live game).
- Reproducible isolated regression: `node --test tests/block-packs/pack-3/roofing.test.mjs`.
- The existing `npm test` script only globs `tests/*.test.mjs`; this nested suite needs an explicit invocation. Do not claim CI exercised it without evidence.

**Honest integration boundary:** the legacy material and rotated roof fixtures have been FIXED in Milestone 6: snapshots now use distinct `mythwrought-pack3-*-preview-v1` markers with **no `schema` field** and refuse schema-stamped candidate restores. The live `VoxelWorld.restore` still **rejects candidate IDs 109–125**. Rotation is locked at 0 for the first four surface candidates. The three shaped profiles support four rotations only inside a separate opt-in preview fixture, **not** in the current game's schema-1 save system. For non-cube roof stairs/corners/ridges, require merged :12 meshing and :00 selection/collision/save handling plus a creator-approved backward-compatible rotation persistence contract before promising live rotation persistence. Do not use these fixture snapshots as player saves. Integration must preserve existing player data and fail closed for unsupported states.

## Session handoff

Milestone 0: verified authorities/contracts, dedicated manifest and isolated fixture; candidate module authored. Milestone 1: **four isolated original material/physical geometry candidates authored**, previous exact-source local Node 7/7 passed. Milestone 2: **three original physically occupied roof profiles and all 12 rotations authored**, :00 raycast/canPlace and :12 surface-mesh source contract V8-tested with 7 rays/12 shape variants; 324–420 surface triangles per candidate under opt-in :12 prototype. Separate rotation sidecar fixture authored. Local Node 22 source-matched Pack 3 suites **16/16 passed**; genuine Chromium inline-gallery smoke at 667×375, 844×390, 932×430 rendered all seven candidates and successfully rotated all three new profiles with no page errors. These screens are opt-in previews, NOT live game screenshots. Milestone 3: **three isolated independently physical fortified pieces authored**, all four rotations for each (IDs 116–118), with an independent placement/removal/orientation fixture, 11 new Node regressions and opt-in previews. **Not integrated**. That was the historical Milestone 3 status. See the latest Milestone 6 acceptance section and PR for the now-completed candidate development; never infer a later HEAD from an earlier audit.

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

**Status:** Milestones 0–3 have authored isolated candidates, NOT creator acceptance or live installation. Milestone 4 is authored in isolated candidate form, not integrated; Milestones 5–6 remain open. The next milestone is four individual ornament pieces (72–75): columns, cornices, arch surrounds (Pack 4 owns glazing), and relief panels. No generation/assembly/merge/deploy occurred.

## Milestone 4 — ornamental architecture work (2026-11-14)

**Audit:** main remains `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, checkpoint 006, live persistent IDs 0–8, 255 sentinel. Both [Issue #109](https://github.com/hdog960/Mythwrought/issues/109) and [Issue #117](https://github.com/hdog960/Mythwrought/issues/117) preserve the manual Pack 3 ownership of 72–75; existing stone pillars, carved cube shaders, and Pack 4 window frames/glazing are **not** these physical definitions.

| Roster | Candidate ID | Physical geometry and distinctive art | Shape boxes | 4-rotation boundary-mesh triangles |
|---|---:|---|---:|---:|
| 72 | 119 | Stargrove gilded-flute column, shaft, plinth, projecting capital volutes | 11 | 1896 |
| 73 | 120 | Twilight three-bracket cantilevered dentil cornice, deep raised front crown | 13 | 1276 |
| 74 | 121 | Dawnward tall masonry arch surround, two jambs, clear through-opening, raised keystone, **no glass** | 13 | 1204 |
| 75 | 122 | Sunleaf relief face-mounted shallow plaque, physical raised central sun/rays, NOT a cube | 12 | 1740 |

The initial column/relief geometric complexity was reduced by removing redundant raised detail while preserving meaningful 3D silhouette. **Actual :00/:12 interface compatibility**: all 16 rotating shapes validate with pending `validateShape`, `rotateShape`, `canPlaceShape`, `prototypeSurfaceMesh`; **9** positive/negative `raycastShapes` probes include the unobstructed arch void and protruding relief. All meshes remain under 2,000 boundary-only triangles at the current prototype implementation; these counts are not iPhone GPU measurements.

**Isolated regression suite:** `tests/block-packs/pack-3/ornamental-pieces.test.mjs` covers 12 regression cases, all 12 evaluated successfully using exact committed source in an isolated JavaScript V8 assertion harness (not a substitute for a genuine Node process). All **39 committed test bodies** (7 roofing, 9 roof geometry, 11 fortified, 12 ornamental) passed in both an isolated source-exact JavaScript harness **AND genuine Node.js v22.16.0** with `node --test tests/block-packs/pack-3/*.test.mjs`: **39 PASS, 0 FAIL**. The locally executed source, fixture, manifest, and nested test file Git blob hashes were checked against their exact GitHub versions; they match. Root `npm test` excludes nested Pack 3 tests, so a green default workflow alone does not validate this pack.

**Saves:** `ornamental-fixture.mjs` writes only `mythwrought-pack3-ornamental-preview-v1` format with explicit per-cell rotation and no `schema:1` field, NOT a production save. Live `VoxelWorld.set/restore` rejects IDs 119–122. Dynamic live orientation persistence is still a :00/central-integration dependency.

**Authentic Chromium preview check:** local Playwright launched system Chromium at 667×375, 844×390, 932×430 CSS px. All **14** distinct asset model cards rendered from source-faithful box geometry; **10** rotate controls each completed two 90° turns; **zero** JavaScript page exceptions. Three real PNG screenshots were captured and visually inspected. The local gallery HTML and the four original/updated physical source modules were Git-blob-matched to GitHub. The browser fixture inlines those **exact** module sources to bypass the environment's localhost restriction; this verifies authentic client-side presentation/rotation but is **not** production WebGL, HTTP-module loading, Safari or actual iPhone proof.

**Status:** Milestones 0–4 have authored isolated candidates; user approval and live integration pending. The three final monumental families were subsequently authored in Milestone 5; acceptance/integration remains an independent Milestone 6 process. Nothing added to world generation, no completed structures, no shared engine edits, merge, or deployment.


## Milestone 5 — monument component candidates (2026-11-14)

**Audited:** unchanged main `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84` / checkpoint **006** / Issues [#109](https://github.com/hdog960/Mythwrought/issues/109), [#117](https://github.com/hdog960/Mythwrought/issues/117). Other pack ownership checked; the new components differ from Pack 2's proposed *water block*, Pack 1's decorative stone cubes, automation :12's natural crystal outcrops, and :36's already-authored *assembled* stone monuments. Existing `BLOCK.CRYSTAL=5` is a full voxel and is NOT the narrow stone-backed spire.

| Roster | Candidate ID | Isolated one-cell physical component | Rotations | AABB parts | :12 surface-mesh triangles |
|---:|---:|---|---:|---:|---:|
| 76 | 123 | Greywater open channel: two raised banks, open sky/ends, actual empty center over solid floor | 4 | 11 | 924 |
| 77 | 124 | Aethercrown spire: masonry plinth and tapering stone neck, separate narrow stacked crystal crown | 4 | 10 | 1932 |
| 78 | 125 | Sentinel carved statue: two legs with gap, torso/arms, helmet, projecting shield | 4 | 11 | 2464 |

The statue's initial 17-sub-box art produced 5,140 triangles in the opt-in :12 surface mesher; removed redundant micro-detail while retaining physical silhouette, reducing to **2,464**. Crystal crown similarly reduced from 2,468 to **1,932** triangles. Source geometry is the *actual collision/selection union*, not cosmetic box art on a full cube. All twelve orientations verified with the actual unmerged :00 `validateShape`, `rotateShape`, `canPlaceShape` and :12 `prototypeSurfaceMesh` source contract (geometry-only compatibility, **not live integration**).

**Water boundary:** aqueduct has explicit `waterEngineRequired:true`, `flowSimulation:false`, `fluidLevelSupported:false`, `currentContents:'empty'`. It **does not carry real water today**, and does not create or modify a separate fluid system. The later central engine owns fluid levels, flow and save compatibility. **Light boundary:** spire inlay has `lightEngineRequired:true`, `emitsLight:false`, `lightRadius:null`; no fake functional glow or hidden CRYSTAL 5 reuse. **Statue boundary:** static component, not an NPC, animation or assembled monument.

`monumental-fixture.mjs` uses explicit `mythwrought-pack3-monumental-preview-v1` and stores ID/rotation in a candidate-only `parts` list with **no `schema:1` key**, rejecting unsupported IDs, rotations and duplicate placements. Production `VoxelWorld.set/restore` still permits only 0–8; neither these candidates nor their local snapshots may be loaded as a real player save. :00 engine integration, backward-safe orientation persistence and 255 sentinel preservation remain required.

**Testing completed, with exact scope:** All 5 committed Pack 3 regression test suites (7 roofing, 9 roof geometry, 11 fortification, 12 ornament, 14 monumental) were evaluated against the **exact remote GitHub source** in an isolated V8 JavaScript harness: **53/53 PASS**. Actual Node.js v22.16.0 also executed **53/53 local checks**, consisting of the 39 previously downloaded source-matched Pack 3 regression cases plus 14 additional tests against monumental **box/palette data extracted from the committed module**. The 14 *new committed* Node-test bodies were **not** run directly as Node modules in this environment; do not conflate the data-level Node checks with that result. Root `npm test` excludes the nested Pack 3 suite. All 12 M5 rotations passed the actual unmerged :00 and :12 `validateShape/rotateShape/canPlaceShape/prototypeSurfaceMesh` source compatibility probes; **9** raycast hit/miss cases passed, confirming dry empty channel, stepped banks, narrow crystal tip, statue shield and leg gap.

**Genuine Chromium gallery:** Local headless Chromium via Playwright rendered 17 total candidate cards with **13 working rotation controls** at **667×375**, **844×390**, and **932×430** CSS px, with **zero JS page errors**. Genuine full-page PNGs captured and visually inspected. The browser used source-derived candidate physical box/palette data and inlined earlier exact source modules because network/localhost navigation is blocked; it does **not** test HTTP module loading, production WebGL2 frame times, PWA, or physical iPhone Safari.

**Acceptance boundary:** Full Milestone 6 acceptance is **not** approved or complete merely because 17/17 candidates have been authored. Their IDs must not enter actual saves before centrally approved integration, and actual player interaction/rendering/rotation/collision, save regressions and hardware controls require separate checks. The user retains manual integration approval.


## Milestone 6 acceptance — reviewable draft PR handoff

- **Candidate tech QA:** 17/17 distinct authored shapes and dedicated regression tests pass, but creator approval and all production integration gates remain OPEN; see [ACCEPTANCE.md](./ACCEPTANCE.md).
- **New exclusive files:** `catalog.mjs` (readonly, opt-in unified candidate resolver), `tests/block-packs/pack-3/acceptance.test.mjs` (11 all-family and save-safety regression tests), and this `ACCEPTANCE.md`. No shared paths changed.
- **Real Node v22.16.0:** exact-source committed suite `node --test tests/block-packs/pack-3/{roofing,roof-geometry,fortified-pieces,ornamental-pieces,monumental-pieces,acceptance}.test.mjs`: **64 PASS / 0 FAIL**. All 17 families 109–125 enumerated, all candidate IDs guarded, all 56 supported orientation descriptors have identical collision/selection/mesh boxes, no accidental full-cube replacement, and candidate preview formats separated from production saves.
- **Unmerged :00/:12 source contract:** 68 rotation shapes checked, no mesher bounds or Uint16 overflow; max 2,464 prototype triangles for the standalone stone guardian. **Actual mobile GPU/FPS not certified.**
- **Chromium:** genuine browser gallery inlined from Git-blob-matched exact source because sandbox blocks HTTP and file URLs. Three landscape sizes, 17 canvases with painted unique pixels, 13 rotation buttons exercised twice each, zero page exceptions. It cannot certify deployed WebGL, Safari or offline.
- **Production:** current main `VoxelWorld.set/restore` still only handles IDs 0–8, with sentinel 255 and schema-1 saves preserved. No live registry, placement, render, upgrade, water flow, light source or NPC features were enabled.
- **No merge, deploy or default-world placement** in this candidate review. The next step, only after explicit creator direction, is separate authorized integration planning against all four manual packs, :00 shape/save and :12 rendering dependencies; v0.11 stays LOCKED.


### Milestone 6 follow-up — preview/save boundary correction (2026-11-14)

- Identified a real **candidate-only serialization hazard**: original roof-material `fixture.mjs` and `roof-geometry-fixture.mjs` emitted objects bearing the live `schema:1` marker. Although current main's registry rejected 109–115, that marker could be misinterpreted after future registered IDs were expanded. **Corrected both fixtures to use unique preview-only `format` markers and omit `schema`**, with fail-closed refusal to accept schema-stamped input.
- Expanded owned Node acceptance tests to check all **five** fixture formats are distinct, their schema field is absent, candidate formats are not cross-restorable, and all 13 rotational families preserve physical occupancy under quarter-turns at interior sample points. Revalidated the actual six committed Node suites: **64 tests passed, 0 failed**. Cross-family material/roof tests were updated to the new preview formats.
- The source and tests were committed only under `src/block-packs/pack-3/` and `tests/block-packs/pack-3/`, with blob SHA comparisons to local byte-identical Node-tested files; the shared save implementation was not accessed or edited.
- **Actual Chromium 144** source-inlined gallery again passed at 667×375, 844×390, and 932×430: 17 drawn cards, 13 controls rotated twice each, zero JavaScript page errors. No claim of production WebGL2, offline PWA, Safari, FPS, or physical-iPhone approval.
- Full candidate technical review remains **READY FOR CREATOR REVIEW, NOT APPROVED FOR INTEGRATION**. Actual schema-1 backward-compatibility migration, production physics/meshing/rotation state, asset art acceptance and real iPhone controls still require a separate creator-authorized engine integration handoff. Do **not** merge/deploy/auto-place, and keep Gate A OPEN and v0.11 LOCKED.


### Milestone 6 repeatable Chromium visual acceptance (2026-11-14)

- Added `tests/block-packs/pack-3/gallery-browser.py` as an **optional, Pack 3-only** Chromium/Playwright test (Python Playwright and local Chromium needed; does not modify central CI). Run `python tests/block-packs/pack-3/gallery-browser.py`; optional `PACK3_SCREENSHOT_DIR=/tmp/pack3-review` captures genuine PNG evidence.
- Executed actual Chromium 144 on three landscape CSS viewports **667×375, 844×390, 932×430** with exact authored Pack 3 module data inlined because sandbox HTTP/file module navigation is blocked. **17 / 17 unique canvas pixel hashes**, 13 quarter-turn buttons with full four-step exact-pixel reset, 7 directional shapes visibly changing upon rotation, no JavaScript page errors, three full-page screenshots reviewed.
- **WebGL2 test unresolved:** attempted genuine browser WebGL2 rendering, but headless Chromium in this sandbox refused both WebGL1 and WebGL2 context creation. No untested 3D viewer shipped, no false claim about production GPU acceleration. Current gallery remains 2D geometry preview, not the live game's WebGL2 renderer.
- **Node acceptance unchanged:** all six direct committed nested suites **64 / 64 PASS** after source/hash verification. No new asset IDs, textures, rotations, shared files, CI workflow, world-generation placement, save fields, merge, deploy or Gate A unlock. The repeatable browser runner expands evidence, not permission to integrate.
