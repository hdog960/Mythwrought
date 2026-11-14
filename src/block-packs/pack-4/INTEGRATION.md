# Pack 4 — isolated physical windows and lighting candidate contract
**Status: UNMERGED CANDIDATE — NOT IN LIVE GAME. v0.10 Gate A only.**

## Scope and strict boundary
Read `src/block-packs/pack-4/manifest.json` for the exact 22-family roster and
reservations. This branch adds only Pack 4 sources, tests, and an opt-in gallery.
Do not import this pack into main, register new block IDs, modify world generation,
or put candidate structures into the seeded world without the creator's explicit
manual incorporation command. No game files, CI workflows, existing saves or
current on-device UI are altered.

Verified base: `main f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`
and integration checkpoint 006. Main at that cutoff has persistent IDs 0–8,
not these candidates. IDs 159–181 are PROVISIONAL, exclusive to Pack 4.

## Source surface
`windows.mjs` exports `PACK4_WINDOW_ASSETS`, `PACK4_WINDOW_IDS`,
`windowAsset(id)`, `windowShape(id,rotation)`,
`windowSaveState(id,rotation)`, `restoreWindowSaveState(value)`,
`windowMountOffset(id,rotation)`, and
`windowPreviewMesh(id,rotation)`. Rotation is **integer 0..3** and a
clockwise quarter-turn around Y within one cell, with front toward local -Z
at rotation zero. Orientation is **one state value**, never a new block ID.

Every candidate has separately specified:
- visible material/sub-boxes, with original geometry and palette;
- positive non-full-cube selection and collision box collections;
- independent persistent block ID and orientation, never an existing 0–8 alias;
- mount rule `opening` or `wall-face`;
- `occludesWholeCell:false`, because full-cube occlusion is wrong for panes,
  hollow frames, shutters and open-spaced bars.

**Do not substitute the preview mesh for the engine's physical voxel registry.**
The engine must atomically register cell IDs, rotate geometry and use each
shape's selection and collision sub-boxes through the shared shape-aware
contracts. On mining/selection the entire source cell and its state should
be removed as one independent physical target.

## Explicit integration dependencies — NOT solved by this PR
1. Automated :12 shape/mesh API [PR #108](https://github.com/hdog960/Mythwrought/pull/108):
   adapt the rotated unions of boxes to the versioned generic shape descriptor.
   No full cube fallback for selection or collision.
2. Automated :00 partial-cell targeting/placement [PR #106](https://github.com/hdog960/Mythwrought/pull/106):
   respect individual selection hitboxes and reject blocked/unsupported
   placements. Shutter mount needs a stable neighboring wall at
   `windowMountOffset(id,rotation)`; other panes, frames and bars use
   opening placement semantics, with the engine's normal adjacency guards.
3. Central renderer: separate **opaque** faces from **translucent** faces;
   translucent panels need correctly sorted depth-aware blending and usually
   `depthMask(false)` for the glass pass. The opt-in preview demonstrates
   material groups but is NOT proof of translucent world rendering.
   Do not let a transparent window occlude entire opaque neighbor faces.
4. Save integration: keep schema 1 and existing IDs unchanged. Persist each
   cell's candidate ID in the existing edit delta *only after registry support*,
   and store optional 0..3 rotation in a backward-compatible state sidecar
   keyed to the cell. On restore validate ID+orientation together; reject
   invalid/truncated state and keep unknown future IDs quarantined.
5. No opening/closing animation, destructible leaf sub-parts, light emitter,
   fire/smoke, water or inventory behavior has been added.
   Sunfire/Moonveil stain is colored translucent material, not emitted light.

## Reproducible checks
Run from repository root:
`node --test tests/block-packs/pack-4/*.test.mjs`

For the optional WebGL2 gallery: launch an ephemeral static HTTP server from
repository root and open `/tests/block-packs/pack-4/gallery.html` in Chromium
with WebGL2 enabled. The gallery exposes
`window.__PACK4_GALLERY_RESULT` and bears a conspicuous UNMERGED warning.

The root `npm test` currently expands `tests/*.test.mjs` only. It does
**not** discover these isolated nested tests; no CI workflow or root package
script was modified because Pack 4 is forbidden to touch shared files.
Manual integration owner must add these tests to the approved test matrix.

## Review/acceptance gates
M1 source design and geometric invariants can be checked in isolation.
Do NOT mark M1 accepted for live play until exact-head Node, authentic Chromium
WebGL2 transparency + orientation screenshots, shape-aware player
selection/collision, save replay and real iPhone layout are reviewed.
Physical iPhone approval, art approval, v0.11 and Pages deployment remain
unclaimed. Neither world generation nor prefab placement is in this pack.

## Milestone 2: physically separate lighting fixtures (ID 165–168)
The isolated `lighting.mjs` exports `PACK4_LIGHT_ASSETS`,
`PACK4_LIGHT_IDS`, `lightingAsset`, `lightingShape`,
`lightingMountOffset`, `lightingSaveState`,
`restoreLightingSaveState` and `lightingPreviewMesh`.
- **165 Hearthbound lantern**: independent floor-supported iron/copper lamp
  with warm glass, physical cage/posts/feet and cap;
- **166 Hawthorn wall lantern**: forward-projecting solid mounting bracket,
  physical plate, warm sconce and 4-way wall supports;
- **167 Aetherglass crystal lantern**: four-sided iron rune cage with a
  separate turquoise/sapphire inner crystal, NOT CRYSTAL block ID 5;
- **168 Wayfarer torch**: solid metal wall plate and timber shaft, with
  decorative, explicitly non-colliding orange flame layers.

All four provide stable individual candidate IDs and complete geometry boxes
for target/selection, collision, rendering and 0..3 rotations. Their lighting
metadata is bounded `{rgb,radius,intensity,engineEnabled:false}`.
**There is NO dynamic light source, heat damage, fire spread, flames simulation,
GPU glow, or functional flicker implementation.** Any perceived brightness in
the gallery is pigment. The central rendering/lighting developer must build
actual bounded emitters, prioritize the mobile GPU budget, and validate light
perception separately. Wall lantern and torch need a real support block behind
their plate; floor fixtures need a solid occupied cell immediately below.

## Isolated placement/removal fixture — not a world save
`fixture.mjs` exposes `createPack4Fixture(initialSupports)`, which can
simulate independent cell placement, rotation, whole-cell removal,
ray-selected occupied sub-boxes, partial collision, support checks, and
atomic fixture-local save/replay. The adapter never reads/writes the real
seeded map, central registry, localStorage or schema-1 player saves.
Its `{fixture:'mythwrought.pack4.fixture',schemaVersion:1,cells:[...]}`
snapshot is FOR TESTING ONLY, not the production world edit format.

## Updated isolated testing and review truth
- `node --test tests/block-packs/pack-4/*.test.mjs`: execute all three
  nested tests on a real checkout; the standard root `npm test` does not
  discover them. This command has NOT been executed here against exact PR
  source; V8-compatible test evaluation passed 59/59.
- A separate **source-derived geometry snapshot** of all ten candidates
  was decoded locally at 0.0001 box-coordinate precision; Node 22
  validated 33/33 snapshot geometry/material invariants. This does not
  validate direct module imports.
- The extended opt-in gallery shows all 10 asset candidate meshes and
  0/90/180/270° selectors, with an explicit UNMERGED label. Headless Chromium
  WebGL2/EGL software initialization failed in the available local host, so
  no source-gallery screenshot pass is claimed. Device art review remains open.
- Earlier PR HEAD `3a09f18e4338bbf61674f72dffaf7abc93c2d245` had a
  green existing root GitHub Actions suite ([run 43628322485](https://github.com/hdog960/Mythwrought/actions/runs/43628322485)).
  Future exact M2 PR HEAD CI is a distinct check, never assume prior green
  equals new-head approval.

This pack must not be installed into the live world until the creator
authorizes manual integration. Issue #117 is the separate :12 automated
130-item catalog; Pack 4 retains only original Issue #109 families.

## Milestone 3 — Seven independent furniture / market pieces, not assembled structures

Physical reusable candidate block identities **169–175** in
`furnishings.mjs`. These correspond to original Issue #109 roster
**56–62** and have no overlap with automated biome130 Issue #117:

| ID | Physical family | Exact distinct silhouette | Placement |
|---:|---|---|---|
| 169 | Barrel | Eight tapered timber staves, horizontal iron hoops, inset lid and bung | Stable floor |
| 170 | Crate | Timber plank courses, raised top, iron corner straps and battens | Stable floor |
| 171 | Bench | Open below-seat space, four feet, gapped slats and raised backrest | Stable floor |
| 172 | Table | Open underside, raised tabletop, four corner legs and carved edge | Stable floor |
| 173 | Sign | Single narrow floor post, double-sided blank signboard, trim and nail heads | Stable floor |
| 174 | Banner | Suspended crossbar, cloth panels with twin cut tails and central heraldry | Fixed ceiling |
| 175 | Canopy panel | One striped/scalloped fabric tile with separate structural ribs and rope | Fixed wall |

Each family has a separate ID and immutable box parts. All parts are
occupiable local unit-cell geometry, physical hit/collision sub-boxes and
selection volumes; ambient/edge detail that should not obstruct movement
is separately flagged `collision:false`. Each has four right-angle
orientations, stable `{id,rotation}` fixture state, material-specific
palette and bounded preview mesh. The sign is **blank** and has no text
editing; the banner has no wind animation. The canopy is a **single
piece**; no completed stall/building is authored. Barrels and crates
are NOT inventory containers and cannot be harvested or crafted.

The original Pack 4 `fixture.mjs` is extended from IDs 159–168 to
**all IDs 159–175**. It enforces floor/ceiling/wall support cells,
unique occupancy, independent whole-cell removal, AABB raycast,
partial collision and fail-closed, atomic fixture snapshot restore.
This is a fixture-local test format only. **Do not reuse its snapshot
object as an unreviewed live schema-1 world-save migration.**

## Real execution commands and acceptance gates

On an authorized checkout with Node v22+:
```sh
node --test tests/block-packs/pack-4/*.test.mjs
```
When Playwright + genuine Chromium are installed:
```sh
node tests/block-packs/pack-4/gallery-browser.mjs
```
The isolated browser script starts an ephemeral local-only HTTP
server, loads precisely its own three source modules and gallery, and
checks 17 WebGL2 candidate cards at **667×375, 844×390, 932×430**.
It writes authentic screenshots under
`artifacts/pack-4/pack4-UNMERGED-*.png`. The gallery has a
permanent visible **UNMERGED CANDIDATE — NOT IN LIVE GAME** heading.
A single shared WebGL2 surface is reused for all 17 image previews
to avoid creating 17 independent graphics contexts on iPhone.
Do not misrepresent preview geometry or drawn lights as in-engine
functionality.

**Verified in this session:** exact source/manifest test bodies 104/104 PASS
through JavaScript V8 compatibility harness; this is NOT native
Node test execution. Prior PR HEAD `6fc1b21d...` passed the
existing root GitHub CI baseline [Actions #43630645050](https://github.com/hdog960/Mythwrought/actions/runs/43630645050),
before this M3 work was added. Local checkout Git fetch blocked by
network/DNS, and prior local Chromium preview command timed out
during software graphics initialization. **Native new-head Node,
new-head browser gallery and physical iPhone screenshots are
NOT VERIFIED.** The reviewer must run both above commands and
inspect 17 distinct candidate silhouettes and rotations before
requesting any integration. Central renderer alpha/depth, rotated
collision and actual schema-1 saves still require owner-controlled
integration testing.

**Never merge, push to main, deploy Pages, construct a building,
spawn a well/fountain or place Pack 4 assets into world generation.**
Gate A remains open; v0.11 remains locked.

## M4 — Six independent hearth & civic component families (ID 176–181)

All are **ONE physical cell each** and have their own immutable
unit-cell collision, selection and material sub-box union. `hearth-civic.mjs`
exposes `PACK4_CIVIC_IDS`, `PACK4_CIVIC_ASSETS`, `civicAsset`,
`civicShape`, `civicMountOffset`, `civicSaveState`,
`restoreCivicSaveState`, and `civicPreviewMesh`.

| ID / Roster | Single reusable element | Geometry and support |
|---|---|---|
| **176 / 63** | Ashenwatch hollow chimney throat | Four independent masonry sides; open vertical flue, cap band and soot details; **floor** support |
| **177 / 64** | Hearthstone fireplace insert | Open front (-Z), 2 jambs, stone hearth slab/mantle, separate iron grate; **rotated wall** support |
| **178 / 65** | Wellside rim quadrant | Genuine **L-shaped** stone rim course with open central quadrant; **floor** support |
| **179 / 66** | Wellhouse rope-hooked eave bracket | One short wood corbel & roof covering with metal rope hook, not a Pack 3 generic roofing tile; **rotated wall** support |
| **180 / 67** | Old brass pulley bracket | Physical open-spaced 12-stud wheel and axle, wall plate and visual rope tail; **rotated wall** support |
| **181 / 68** | Dry Dawnward fountain basin segment | Low carved hollow basin piece with separate spout, empty dry cavity; **floor** support |

**No completed chimney, fireplace installation, well, well roof, fountain,
house, stall, village or city was created.** These are independent component
cells. IDs 176–181 are not registered in main. Current Pack 4
ID **159–181** reservations cover all 22 families/23 material/shape variants;
**182–208 remain unallocated**. ID 255 remains reserved, main IDs 0–8 are
protected. Packs 1–3 and :12's Issue #117 catalog are untouched.

`civicShape` returns non-full-cell render parts, positive selection and
collision boxes and local Y-axis rotation 0–3. `civicMountOffset`
returns `[0,-1,0]` for floor components or the appropriate rotated
neighbor for wall components. `fixture.mjs` was updated to opt-in
place/remove, partial collision, ray targeting and fully atomic local
save/replay across **all 23 IDs 159–181**. Test snapshot persistence is
NOT a change to production schema-1 saves.

Each M4 asset declares `engines.fire = false`, `smoke = false`,
`water = false`, `lighting = false`, and
`animation = false`. Decorative soot, coal, rope and fountain spout
must never be presented as working fire, fluid or pulley gameplay.
The live engine owner must independently design light budgeting,
fluid/smoke/heat effects (if ever approved) and real registry/save
integration. **There are no simulated effects in Pack 4.**

### M5 acceptance status (2026-11-14)
- **M0–M4 source implemented**: all 22 families, 23 provisional IDs.
- **7 Pack 4 source/test suites**: 138/138 exact authored Node-style
  test bodies **passed in a V8 compatibility harness**, PLUS 4/4
  read-only source/manifest checks = **142/142 V8 checks**.
  This is NOT native Node `node --test` execution.
- **Earlier exact PR HEAD** `c674b94dedd4b274c97114dbb8dbce46f45553d4`
  passed its standard GitHub Node and Chromium *game baseline*
  [Action #43632520917](https://github.com/hdog960/Mythwrought/actions/runs/43632520917),
  **before M4**. It does not test the new nested M4 candidates.
- **Current M4 exact PR HEAD CI** requires separately verifying the
  full exact SHA once it is committed. The existing GitHub CI
  root test glob excludes nested Pack 4 suites.
- **Native Node suite and genuine gallery** remain blocked:
  repository clone/raw fetch fails DNS from the container;
  Chromium rejects local file and 127.0.0.1 browser URLs with
  `ERR_BLOCKED_BY_ADMINISTRATOR`. No successful real candidate
  screenshot, real physical-iPhone test, mobile controls/art approval,
  or live schema-1 save integration is claimed.
- The isolated `gallery-browser.mjs` script expects 23
  independent cards, one shared WebGL2 preview canvas, 4-way rotation,
  and true screenshots at 667×375, 844×390 and 932×430. Execute it
  where browser navigation is permitted. Screenshots must retain
  **UNMERGED CANDIDATE — NOT IN LIVE GAME** warnings.

**M5 is NOT approved.** Creator alone may authorize manual
incorporation after exact-head checks, collision/selection integration,
transparent depth correctness, schema-1 compatibility, physical-iPhone
controls review and art approval. Never merge or deploy autonomously.


## M5 verification addendum — current reviewer truth (supersedes earlier counts)

- **All 22/22 assigned family definitions remain candidate-only**, with
  23 independent persistent prospective IDs **159–181**, 182–208 free.
- Exact authored source and tests from this review branch were checked:
  **161/161 JS V8 compatibility test bodies PASS** (including new
  cross-family shape/mesh/physical fixture/save tests and 5 alpha-sort
  tests). Do NOT call these 156 full native Node results.
- **Real Node 22: 5/5 PASS**, specifically
  `tests/block-packs/pack-4/preview-utils.test.mjs` with
  `src/block-packs/pack-4/preview-utils.mjs`. Both were reconstructed
  locally and their Git blob hashes checked against exact GitHub content
  before the native run. The rest of the nested Pack 4 suite was not run
  natively because this runner cannot clone/fetch the GitHub branch.
- Pre-M5 candidate `c7dfee578523f3a1c3ac91f9c4f2ce38c7ce34fb`
  passed standard GitHub Node/browser baseline CI
  [run 43634712543](https://github.com/hdog960/Mythwrought/actions/runs/43634712543).
  This baseline did not execute nested Pack 4 tests, so it does not
  certify candidate rendering/physics. New exact-head CI requires
  separate review.
- Isolated WebGL2 gallery was hardened: reusable GPU context with
  program/shader/VAO/buffer teardown after every asset, a standalone
  preview-only back-to-front alpha triangle sorter, a non-clipping
  camera fit scale, 23 nonblank distinct canvas-image fingerprint
  checks and a true rotation-pixel comparison. No change was made to
  the live renderer. Actual Chromium navigation in this environment
  is denied by administrator policy; zero genuine 23-card screenshots
  are accepted.
- **M5 remains open.** `M5_ACCEPTANCE.md` is the canonical final
  checklist including per-family provisional status and exact commands
  for the native Node and Chromium reviewer. The creator has not
  approved art or physical iPhone controls, and no world-save registry
  integration or deployment is authorized.

All six M4 civic components remain **static dry/ornamental geometry**;
no simulated fire/heat/smoke/fluid/light/pulley state may be claimed.

## Subsequent M5 mesh and screenshot validation amendments
- Exact source-backed V8 checks **161/161 PASS** following four all-asset mesh-budget/determinism/alpha tests in `tests/block-packs/pack-4/mesh-budget.test.mjs`. Native Node remains **5/5 only for preview-utils**; no general native Node pass can be inferred.
- The stand-alone Chromium gallery browser script now rejects mere nonblack frame clears by measuring per-card foreground RGB difference from the image corner (minimum 700 pixels, contrast at least 24 across RGB). This is a test-harness correction, not evidence that the browser passed. Local Chromium WebGL2 remains unavailable and page navigation administrator-blocked.
- Exact HEAD CI remains subject to separate verification; `M5` approval still withheld. No production renderer, registry, shared files or world generation touched.


### Shared :00/:12 source compatibility review — November 14, 2026
- **Real Pack 4-only defect fixed:** crate candidate **170** had **34 selectable AABB volumes**, exceeding the unmerged :00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106) `validateShape` maximum of **32**. Eight ornamental corner ferrules/front battens now have `selection:false`; original visuals **34 rendered sub-parts** and **1,224 preview vertices** are preserved while selection/collision use **26** bounding boxes. It remains a single independent targetable crate.
- New isolated `src/block-packs/pack-4/interaction-handoff.mjs` exports `pack4ShapeHandoff`, `pack4SidecarHandoff`, and `pack4ReviewSidecar`. It generates candidate-only `{boxes}` descriptors within the exact :00 shape cap and converts fixture `{id,rotation}` to staged `{blockId,turns}` sidecar entries. It **does not import, activate or modify any shared module**, registry, game save or renderer.
- **161/161 exact current Pack 4 test bodies PASS in V8 compatibility evaluation**, adding five tests for the 32-AABB limit, crate render-versus-selection count, hollow structures, real sidecar field formats and malformed-state rejection. **Not native Node.**
- Evaluated the **actual unmerged :00 source at head `2054e00ead30736726d53d5aed8a1f9dc4e080a0`**, including `validateShape`, `raycastShapes`, `canPlaceShape`, `rotateShape`, `inspectBodyFit` and `makeOrientationSidecar`. Across all **23 IDs × four orientations**, every collision and selection descriptor, empty placement, precise selected-box raycast, interior-body collision, rotation parity and real sidecar snapshot passed: **644/644 independent cross-source V8 probes**. This is **not integrated gameplay or native Node testing**.
- Reviewed actual :12 [PR #108](https://github.com/hdog960/Mythwrought/pull/108) head `31be6f32adcfbb461b7a57e7db2e1567f8c1891a`. Its opt-in boundary-only `prototypeSurfaceMesh` tessellates unions more heavily than the Pack 4 preview meshes; sample **fireplace 177 produced 8,336 boundary-mesh vertices** and **pulley 180 produced 8,136**, compared with Pack 4's self-contained preview limits of 1,500 vertices per candidate. This is a **mobile-mesh integration budget warning**, not a runtime acceptance pass or a reason to edit shared mesher sources.
- Existing live world still has only persistent IDs **0–8**. Pack 4 candidate IDs **159–181** remain **not registered**; no creator integration permission. M5 is still OPEN pending full native exact-HEAD Node suite, authentic Chromium WebGL2 gallery/screenshots and explicit art/physical iPhone Gate A approval.


### Latest M5 technical acceptance check — November 14, 2026
- All **22 roster families / 23 physical candidate variants (IDs 159–181)** are still source-authored and isolated. IDs 182–208 remain unassigned; live 0–8 and sentinel 255 are unchanged. Manual Packs #113/#114/#112 have independent ranges 9–38, 59–76, 109–125; Pack 5 [#119](https://github.com/hdog960/Mythwrought/pull/119) still uses symbolic `pack5:079..096` keys and **no numeric block allocation**; automated :12 Issue #117 remains separate.
- The new `tests/block-packs/pack-4/mesh-winding.test.mjs` verifies **19,248 genuine source-mesh triangles** over 23 models × four orientations: **zero inward-facing triangles, zero degenerate triangles**, unit face normals, consistent transparent alpha, and unique per-asset preview meshes. Three test bodies pass via V8 exact-source evaluation, **not native Node**.
- **Pack 4's previously arbitrary ±65,536-cell orientation sidecar restriction was removed.** The staging adapter now matches the actual :00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106) `cellKey` contract: arbitrary safe-integer coordinates. A sixth `interaction-handoff.test.mjs` case verifies distant positive/negative cells, `Number.MAX_SAFE_INTEGER`, and sorted replay, without changing schema-1 player saves.
- **168/168 current Pack 4 test bodies PASS in V8 compatibility evaluation** against the exact current draft PR patch files. This includes all 23 IDs, all support categories and orientations, partial collision/select, atomic fixture saves, 32-box shared interaction handoff (including the crate fix), mesh budgets, all-source winding and visual uniqueness. **This is not the entire native Node runner.**
- **Actual Node v22.16.0 5/5 PASS** for `preview-utils.test.mjs`, with local source and test Git blob hashes matching GitHub: `dbb9a47a6474fbc3461e006530d6dbaffbea42b2`, `a469b2f1a1648b1f18b51291b3ab0103701321b7`. The remaining nested test modules are not present in the local clone because GitHub DNS is blocked; do not claim 165 native passes.
- **Genuine Chromium/WebGL2 remains BLOCKED:** system Chromium navigation fails `ERR_BLOCKED_BY_ADMINISTRATOR` on even a minimal test page, and Playwright's `page.set_content` creates no WebGL/WebGL2 context with available software flags. Therefore **no** actual 23-model Chromium screenshots at 667×375, 844×390 or 932×430 were accepted. The browser script is authored and must run on an approved free tooling host/checkout.
- **M5 FINAL ACCEPTANCE STILL OPEN; v0.10 Gate A not approved; v0.11 LOCKED.** Future integration owner must test the 23 model screenshots, source-to-live alpha sorting, partial shapes, mounted supports, saved orientations and :12 prototype mesher performance (fireplace sample 8,336 generated vertices / pulley sample 8,136 versus lower Pack 4 preview budgets). No merge, Pages deploy, registration, shared-system code edits or world-generation placements.


### Latest M5 acceptance update — fixture and sidecar interoperability (2026-11-14)
- Reverified latest integrated `main` `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, checkpoint **006**, coordination Issues [#109](https://github.com/hdog960/Mythwrought/issues/109) and [#117](https://github.com/hdog960/Mythwrought/issues/117), Pack 1 [#113](https://github.com/hdog960/Mythwrought/pull/113), Pack 2 [#114](https://github.com/hdog960/Mythwrought/pull/114), Pack 3 [#112](https://github.com/hdog960/Mythwrought/pull/112), symbolic Pack 5 [#119](https://github.com/hdog960/Mythwrought/pull/119). Pack 4 remains **22 original families / 23 IDs 159–181**, unmerged and not in live game.
- Fixed a Pack 4-only fixture inconsistency: `fixture.mjs` still capped valid world coordinates at ±65,536 after the orientation adapter had been fixed. It now accepts **safe integers**, rejects overflowing support offsets before writing a candidate cell, and preserves atomic restore. Added a fixture test with coordinates at ±1,000,000 and near `Number.MAX_SAFE_INTEGER`.
- Added `pack4FixtureToSidecarSnapshot` and `pack4SidecarToFixtureSnapshot` to the **Pack 4-only** test adapter. Two new isolated tests cover 23 simultaneous candidate cells with floor/wall/ceiling supports, distant coordinates, exact fixture save → staged sidecar → fixture replay and rejection of duplicate/malformed entries. The original 22-family roster and box counts are unchanged; no production save or placement modifications.
- **168/168 exact current PR-head authored tests PASS in source-backed V8 compatibility evaluation** (13 nested suites). The direct, separate unmerged :00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106) `makeOrientationSidecar`, `snapshot` and `restoreOrientationSidecar` routines were also evaluated with **all 23 candidate identities**: 23/23 fixture snapshots replayed, and one stale ID was correctly filtered. This is **not actual Node test-runner execution and not a live game save**.
- **Native Node v22.16.0 remains verified only for `preview-utils.test.mjs` (5/5 pass).** Full source checkout is not obtainable from the local terminal because DNS resolution fails for `github.com` and `raw.githubusercontent.com`. Do not infer all 168 cases passed in Node from the V8 run.
- A minimal headless Chromium data-page smoke command also timed out in this environment; **no genuine WebGL2 23-asset screenshots** were produced at 667×375, 844×390 or 932×430. The isolated gallery-browser runner requires a browser-enabled checkout elsewhere. No physical-iPhone or creator art/control approval is claimed.
- **M5 acceptance remains OPEN, v0.10 Gate A OPEN and v0.11 LOCKED.** Only Pack 4 source/tests changed; no shared CI, engine, world generation, registry, other packs, merge, GitHub Pages deploy or production schema-1 save edits. The previous :00 32-box crate fix and :12 prototype-mesh budget warning remain applicable.
