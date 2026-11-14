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

**Central-engine requirements:** generic :00 shape collision/raycast and placement validation; :12 compatible shape mesh/render registration; selection palette for IDs 59–75; backwards-safe schema-1 orientation/variant metadata strategy; correct neighbor culling, player safety and chunk mesh updates; iPhone landscape GPU performance; eventual explicit creator manual incorporation. Neither infrastructure source nor the preview triggers world generation, placement, construction, fluid or other systems.

## Transition contract, not an engine interaction implementation
- IDs 66, 67, and 68 are independently selectable *hinged candidate pieces*. `joineryCell` has `open:boolean`, defaults false. Pure function `nextJoineryState` returns a validated toggled cell record.
- The physical AABB set is recomputed from `open` and `rotation`, so a closed gate intercepts rays differently from an open gate; door and trapdoor similarly physically change occupancy.
- The fixture can toggle selected/placed items. This does **not** implement real-game click/tap handling, animation, multiplayer, sound, protection zones or production state transitions.
- Central :00 engine owner must reject toggles obstructed by the player/other solids, prevent cross-cell clipping/overlap, handle atomic save/apply/rollback and refresh neighboring chunk meshes. Do **not** blindly apply fixture toggles directly to the live world.

## Dependencies on generic engineering
- :00 generic interactions: proposed `raycastShapes` / `validateShape` in candidate PR #106. Our `{boxes}` exports are compatible in shape. Exposed selection hit and `canPlaceShape` must be jointly validated after incorporation.
- :12 generic shape system: opt-in prototype `shapeDescriptor` and `prototypeSurfaceMesh` in PR #108. This pack's preview mesher is deliberately local; production renderer must use the integrated shape-aware/UV/material pipeline and verify culling/tint/face normals before activation.
- Live `src/voxel.mjs` currently rejects IDs greater than 8 and live material palette only has those legacy IDs. This pack **must not** edit the registry; centralized incorporation must validate 59–75, legacy IDs and sentinel 255.
- `src/blocks.mjs` selectable list is still legacy-only. Central integration owns inventory-free material choice and placement UI if authorized.
- Saved schema-1 rows hold `[x,y,z,id]` and no rotation/state. The fixture snapshot remains strictly separate: `mythwrought-pack-2-fixture`, version 1; old ID 59–62 rows keep 5 values, new ID 63–68 rows have 7 values including `variant,open`. This does **not** prove production save compatibility. Central engineering needs an opt-in state sidecar or equivalent round-trip approach that does not mutate existing saves, keys, seeds or schema-1 readers. Reject unknown IDs and state before applying, and test rollback across partial failures.
- Slab/stair collision requires physical body vs union-of-boxes; gate/door/trapdoor when open remain physical, rather than becoming intangible fake decorations.
- Generated world placement/roads/bridges/houses is forbidden for this pack. No world generator, shader, UI, CI or shared engine changes in this PR.

## Test/preview limitations
- `tests/block-packs/pack-2/pack-2.test.mjs` covers the four timber materials.
- `tests/block-packs/pack-2/joinery.test.mjs` covers all 6 new joinery candidates (shape/mesh/state/targeting/corruption/legacy fixture recovery).
- `tests/block-packs/pack-2/ground.test.mjs` covers all four shallow ground/path components: ray targeting, true physical top relief, shape rotation, distinct visuals, corruption defense, save-fixture round trips and bounded triangle counts.
- `tests/block-packs/pack-2/infrastructure.test.mjs` adds 17 cases for reinforced rail gaps, physical drain-slot, boardwalk voids, variant orientation, safe targeting/removal, exposed triangle winding and backwards-compatible fixture state.
- Optional `node tests/block-packs/pack-2/browser-verify.mjs` requires real Playwright Chromium and serves the isolated inspector to 667×375, 844×390 and 932×430 browser viewports, checking ID selection, state controls and authentic candidate canvas pixels. Run only where Playwright is installed; it does not certify in-game WebGL2 or physical iPhone performance.
- Run `node --test tests/block-packs/pack-2/*.test.mjs` in a local repository checkout. Existing root `npm test` uses `tests/*.test.mjs` and therefore DOES NOT execute these nested tests automatically.
- Optional preview `tests/block-packs/pack-2/preview.html` is not deployed; open via a local HTTP server from a checkout. It uses browser Canvas 2D rendering of genuine generated mesh triangles, NOT original game WebGL2, and is not phone certification.
- Gate A open; v0.11 locked. Keep separate grip controls, offline PWA, legacy save schema and user world edits unaffected.
