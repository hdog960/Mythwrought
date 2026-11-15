# Pack 2 — candidate-only shape and state integration contract

**Owner:** Manual Timber & Infrastructure Pack 2. **Authority:** issue #109. **Status:** proposals and isolated test adapters only; live game remains IDs 0–8.

## Material catalog and physical shapes
- `definitions.mjs` exports original materials IDs **59–62**, `pack2Shape(id,rotation)`, `pack2PreviewMesh`, and color/finish metadata.
- `joinery.mjs` exports ID **63 slab, 64 stairs, 65 split-rail fence, 66 hinged fence gate, 67 timber door, 68 trapdoor**, `joineryCell`, `joineryShape(id,state)`, `nextJoineryState`, and `joineryPreviewMesh`.
- `shape.boxes` is the authoritative **voxel-cell-local** collision and ray-selection volume, with axis-aligned boxes `[x0,y0,z0,x1,y1,z1]` bounded by [0,1].
- Shaders and grain overlays are always on triangles of real occupied box surfaces, never a substitute for block occupancy. The stand-alone browser inspector uses original candidate mesh triangles.
- Cell orientation `rotation=0..3` is a discrete quarter-turn around Y, **not a new block ID**. Plank cubes, support posts and half-slabs have no meaningful compass rotation. Shape 63 and 64 use `upper`/`lower` metadata; 68 supports both hatch mounts.

## Ground/path physical candidate contract (Milestone 3)

- `ground.mjs` provides new physical candidates **69 gravel, 70 compacted earthen path, 71 low cobblestone walking surface, 72 original suncompass inlaid pavement**. None is a duplicate of legacy DIRT 2 / STONE 3 or Pack 1's rough full-cube masonry.
- These are **single-cell component blocks only**, not a completed road or a generated structure. `groundShape(id,rotation)` exposes 6–11 local, bounded real collision/selection AABB boxes per piece. Raised stones, mortar gaps, lower wheel ruts and the inlaid tile have their own physical top profiles and distinct colors.
- `groundPreviewMesh` renders a deterministic, authentic colored triangle mesh made from the externally exposed box-union surfaces plus fine face-anchored scratch/grain overlays. Per-face local occlusion partitions avoid bloating intact base walls into hundreds of extra triangles; counts in the isolated fixture are 576/140/404/422 respectively for 69/70/71/72. These are fixture triangle counts, **not mobile FPS certification**.
- 69 is a granular material with `physics.gravity:'engine-required'`, `simulateLocally:false`. The pack DOES NOT simulate falling gravel, change terrain or install physics; engine :00 must separately establish what happens when gravel loses support, including no save loss / out-of-bounds behavior. :24 owns biome placement if later authorized.
- 70–72 are explicitly independent, static paved surfaces. 71 is a *shallow walkable floor* with mortar-backed laid stones, NOT Pack 1's irregular full-voxel masonry cobblestone; 72 is a deliberate decorative raised inlay.
- Valid compass orientation is part of fixture state (69 fixed, 70–72 four turns). `[x,y,z,id,rotation]` remains compatible with the old Pack 2 fixture snapshot envelope; **neither that envelope nor the source candidate IDs is production save compatibility**. Central integration owns collision, material/color atlas, real selection, and optional metadata persistence.

## Infrastructure physical components (Milestone 4)

The new `infrastructure.mjs` module owns three **individual placeable candidate pieces**, not assembled structures:

- **73 / roster 43 — bridge-specific reinforced guardrail**. Two deep structural oak posts, broad coping handrail, real crossed iron bracing and lower bearing rail. The optional `terminal` variant adds a physical end-plate, while `through` remains open. This does NOT duplicate ID 65's lightweight split-rail fence, Pack 1's thin stone railings or any existing assembled bridge.
- **74 / roster 44 — solid protective dressed-stone parapet**. Thick limestone body with an overhanging coping and lower course, rather than open balusters. Optional `drain-slot` has a **real void in collision/selection volume** through the middle of the lower stone body; it is NOT a cosmetic dark decal or a water simulation. Two distinct perpendicular axes, not four redundant half-turns.
- **75 / roster 46 — elevated larch boardwalk piece**. Five independently spaced physical deck slats, real open gaps, paired support joists below deck level and optional low `edge-trim` variant. This is neither the original WOOD 4 cube nor candidate 59's fully solid planed plank block; no actual crossing or bridge is assembled.

Each `infrastructureCell(id,{rotation,variant})` owns one stable candidate ID with strict validated orientation and variant metadata. Each `infrastructureShape` returns 5–15 authoritative unit-cell AABB occupancy boxes for selection and future collision; `infrastructurePreviewMesh` produces deterministic face-culled colored triangles from those same boxes. Triangle counts from isolated mesh functions, including material detail, are **610–740** for rail variants/rotations, **100–196** for stone parapets, and **444–672** for boardwalks. These are candidate complexity measurements, **not** iPhone GPU timings.

The independent fixture treats infrastructure as a separate 6-column state record `[x,y,z,id,rotation,variant]` and supports rotation, variant change, local target-by-ray, removal, snapshot restore and rejection of malformed states. Existing 5-column timber/ground and 7-column joinery rows remain unchanged. The fixture format `mythwrought-pack-2-fixture` is **NOT** production world schema 1.

**Central-engine requirements:** generic :00 shape collision/raycast and placement validation; :12 compatible shape mesh/render registration; selection palette for IDs 59–76; backwards-safe schema-1 orientation/variant metadata strategy; correct neighbor culling, player safety and chunk mesh updates; iPhone landscape GPU performance; eventual explicit creator manual incorporation. Neither infrastructure source nor the preview triggers world generation, placement, construction, fluid or other systems.

## Checkpoint 007 reconciliation (2026-11-14)

Integration [PR #120](https://github.com/hdog960/Mythwrought/pull/120) incorporated only automation-owned changes into `main` at `caf47776b723a36684edc1a72749e49268ccc688` as checkpoint **007**. **Manual Block Packs 1–5 remain draft and untouched.** Base-main changed during Pack 2 M6 QA, so the original branch is now behind main; do not silently merge or rebase through this candidate PR.

- **Solid physical candidates IDs 59–75:** 85 authored shape-state variants match new main's opt-in `{boxes}` contract. The real checkpoint-007 `validateShape`, `raycastShapes`, `canPlaceShape` and `prototypeSurfaceMesh` implementations accepted each state in a standalone V8 interface test: 85/85 shape, ray and overlap tests, 85/85 prototype meshes, max 380 prototype triangles. This is source compatibility only, not a live world/Native Node test.
- **Water ID 76:** `waterShape` deliberately has `boxes:[]` and is **rejected by the shared solid-shape validator**; that is correct because liquid uses a non-solid, sloped fluid prism, not a cube. Central integration must add a **fluid-specific narrow-phase selection/render adapter** and not coerce water into a fake solid. The existing exact water triangle raycast remains separate.
- **Save state:** checkpoint 007 supplies an optional `makeOrientationSidecar` and envelope, but does not persist candidate 59–76 orientation, hinge or fluid state in schema-1 game saves. Separate creator authorization and round-trip/rollback validation remain required.
- **Back-face correctness:** Pack 2 physical previews keep their repaired outward winding. Newly integrated `prototypeSurfaceMesh` is another renderer candidate and does not replace production material/transparent passes.

## Water candidate ID 76 — real fluid geometry, not working fluid gameplay (Milestone 5)

**Status:** roster 45 is now an independently targetable, removable **fluid-volume candidate** in `water.mjs`, but it is **BLOCKED BY ENGINE**. Candidate ID 76 is neither in the main production block registry nor placed in generated water. Do not mistake the preview for working in-game liquid.

### Physical and state semantics

- `waterCell({level,flow,source})` emits immutable strict canonical `{id:76,level:0..7,flow:'still'|'north'|'east'|'south'|'west',source:boolean}`. Level 0 is the full-height, still **source**; levels 1–7 are non-source, with 5 valid flow descriptors. This is **one physical family / one persistent ID / 36 candidate states**, not 36 new block IDs.
- Water is **not a solid cube**. `waterShape` returns a closed, cell-local physically occupied *sloped liquid prism*, with bottom at y=0 and four top-corner heights computed from level and cardinal flow. Flow directions move the physically selectable slope downwards in that direction; there are no negative/out-of-cell heights, and deepest is 1.0 while shallowest is > 0.
- `waterVolumeContains` checks exact filled volume. `waterRaycast` uses a two-sided, **exact triangle narrow-phase test** against all 12 physical boundary triangles to target/remove at the actual water surface and on vertical faces. An enclosing `broadPhaseBox` is only a coarse optional accelerator: **`shape.boxes=[]` deliberately forbids treating water as a solid-box union**. Ray hits can select the volume, but the player's physical body must not collide as if with stone.
- `waterPreviewMesh` creates an authentic colored and alpha-carrying triangle mesh derived from the same 8 physical boundary vertices plus 3 surface-anchored current ripples (6 decorative triangles). **18 total triangles**, typed positions/normals/colors/alphas/UV channels, and a flowVector descriptor. It is a static authored preview, **not a running water shader, moving UV, flood fill or fluid-tick simulator**.

### Engine-specific blockers (deliberately NOT implemented by this pack)

1. **Registry/rendering** — :00 / integration must register ID 76 safely; :12 / generic renderer must accept physical liquid-prism meshes, a transparent draw pass, depthTest on, depthWrite off, alpha blending, distance sorting/bucketing and correct natural material shading. `renderContract` states optional refraction, required underwater fog, optional time-driven flow UV. The M5 module does not animate pixels.
2. **Neighbor edge rules** — engine mesh planner owns same-water concealed-face culling, cross-cell different-level seams, mixing with solids, cutout shoreline faces, water visibility at caves and overdraw reductions. The current candidate previews all surface/side triangles in isolation; 18 triangles per fluid cell are not production costs for large oceans.
3. **Fluid behavior** — :00 owns water source rules, level/flow propagation, neighbor updates, retaining edits, out-of-bounds handling, deterministic simulation and optional safe underwater movement/buoyancy. :24 owns waterway generation only after explicit creator integration. **No gravity/flowing liquid gameplay is implemented here.**
4. **Collision/targeting** — keep `collision:'passable-fluid-volume'` distinct from solid box intersection. Engine targeting must use exact triangle geometry or an equivalently precise fluid-level query, with consistent nearest-hit rules when solids overlap a ray. The fixture demonstrates exact water surface targeting and removal without modifying the production raycast.
5. **Backwards-safe persistence** — schema-1 world save currently preserves legacy rows `[x,y,z,id]` only and rejects ID 76. The isolated Pack 2 fixture stores water as `[x,y,z,76,level,flow,source]` **in its own test-only envelope**. This is *NOT* production save compatibility. A central opt-in sidecar/versioned state table must be designed by :00/integration: preserve existing unchanged schema-1 data, reject invalid flow/level/source combinations before applying, commit atomically or roll back on failure, protect preexisting player edits and seeds, and confirm offline PWA round-trips. Never silently coerce water state to an opaque solid cube.
6. **Acceptance** — run direct Pack 2 native Node suites, true Chromium inspector and integrated WebGL2/landscape/offline checks once a manually authorized integration branch supports them. Do not claim physical-iPhone approval, fluid FPS or production save support from an isolated V8 compatibility harness.

### Optional isolated inspector and tests

- `tests/block-packs/pack-2/water.test.mjs` includes 21 dedicated Node-compatible test cases for all 8 levels, 4 flows, still/source consistency, actual fluid membership, exact sloped top/side/bottom ray intersections, transparent mesh attributes/winding, material policies, no-simulation flags, old fixture saves and corruption rejection.
- `tests/block-packs/pack-2/preview.html` now offers a water-level and current-direction inspector; the canvas uses authored alpha from the candidate preview mesh. Canvas 2D is not the game's WebGL2 water rendering.
- Optional `tests/block-packs/pack-2/browser-verify.mjs` checks all 18 candidate dropdown entries and water selection/flow/alpha in Playwright on the three landscape sizes **when manually executed**. This script exists, but a screenshot/Chromium pass must not be claimed without a real execution.

## Transition contract, not an engine interaction implementation
- IDs 66, 67, and 68 are independently selectable *hinged candidate pieces*. `joineryCell` has `open:boolean`, defaults false. Pure function `nextJoineryState` returns a validated toggled cell record.
- The physical AABB set is recomputed from `open` and `rotation`, so a closed gate intercepts rays differently from an open gate; door and trapdoor similarly physically change occupancy.
- The fixture can toggle selected/placed items. This does **not** implement real-game click/tap handling, animation, multiplayer, sound, protection zones or production state transitions.
- Central :00 engine owner must reject toggles obstructed by the player/other solids, prevent cross-cell clipping/overlap, handle atomic save/apply/rollback and refresh neighboring chunk meshes. Do **not** blindly apply fixture toggles directly to the live world.

## Dependencies on generic engineering
- Checkpoint 007 (:00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106)) now includes **opt-in** `validateShape`, `raycastShapes`, `canPlaceShape`, body-fit checks and a separately staged orientation sidecar on `main`. These are NOT connected to production VoxelWorld registry or controls. An isolated V8 check executed the actual checkpoint-007 implementations against all **85 solid Pack 2 state configurations**: 85/85 validation, ray targeting and same-cell placement-overlap decisions passed. No native Node or playable integration implied.
- Checkpoint 007 (:12 [PR #108](https://github.com/hdog960/Mythwrought/pull/108)) now includes opt-in `shapeDescriptor` and greedy-exposed-face `prototypeSurfaceMesh` on `main`. The exact source prototype mesher consumed all **85 Pack 2 solid shapes** without errors in isolated V8, reaching at most **380 prototype triangles** (independent of Pack 2's colored inspection meshes). This remains a separate prototype with **NO production renderer hookup**; real material, tint, alpha, normals, culling and phone GPU performance are still integration gates.
- Live `src/voxel.mjs` currently rejects IDs greater than 8 and live material palette only has those legacy IDs. This pack **must not** edit the registry; centralized incorporation must validate 59–76, legacy IDs and sentinel 255.
- `src/blocks.mjs` selectable list is still legacy-only. Central integration owns inventory-free material choice and placement UI if authorized.
- Saved schema-1 rows hold `[x,y,z,id]` and no rotation/state. The fixture snapshot remains strictly separate: `mythwrought-pack-2-fixture`, version 1; old ID 59–62 rows keep 5 values, new ID 63–68 rows have 7 values including `variant,open`. This does **not** prove production save compatibility. Central engineering needs an opt-in state sidecar or equivalent round-trip approach that does not mutate existing saves, keys, seeds or schema-1 readers. Reject unknown IDs and state before applying, and test rollback across partial failures.
- Slab/stair collision requires physical body vs union-of-boxes; gate/door/trapdoor when open remain physical, rather than becoming intangible fake decorations.
- Generated world placement/roads/bridges/houses is forbidden for this pack. No world generator, shader, UI, CI or shared engine changes in this PR.

## Test/preview limitations
- `tests/block-packs/pack-2/pack-2.test.mjs` covers the four timber materials.
- `tests/block-packs/pack-2/joinery.test.mjs` covers all 6 new joinery candidates (shape/mesh/state/targeting/corruption/legacy fixture recovery).
- `tests/block-packs/pack-2/ground.test.mjs` covers all four shallow ground/path components: ray targeting, true physical top relief, shape rotation, distinct visuals, corruption defense, save-fixture round trips and bounded triangle counts.
- `tests/block-packs/pack-2/infrastructure.test.mjs` adds 17 cases for reinforced rail gaps, physical drain-slot, boardwalk voids, variant orientation, safe targeting/removal, exposed triangle winding and backwards-compatible fixture state.
- `tests/block-packs/pack-2/water.test.mjs` adds 21 water-prism and fluid contract tests. Fluid target/collision is strictly separate from solid box targeting; the fixture sample is not a live save.
- Optional `node tests/block-packs/pack-2/browser-verify.mjs` requires real Playwright Chromium and serves the isolated inspector to 667×375, 844×390 and 932×430 browser viewports, checking ID selection, state controls and authentic candidate canvas pixels. Run only where Playwright is installed; it does not certify in-game WebGL2 or physical iPhone performance.
- Run `node --test tests/block-packs/pack-2/*.test.mjs` in a local repository checkout. Existing root `npm test` uses `tests/*.test.mjs` and therefore DOES NOT execute these nested tests automatically.
- Optional preview `tests/block-packs/pack-2/preview.html` is not deployed; open via a local HTTP server from a checkout. It uses browser Canvas 2D rendering of genuine generated mesh triangles, NOT original game WebGL2, and is not phone certification.
- Gate A open; v0.11 locked. Keep separate grip controls, offline PWA, legacy save schema and user world edits unaffected.
