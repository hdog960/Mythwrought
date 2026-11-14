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

## Transition contract, not an engine interaction implementation
- IDs 66, 67, and 68 are independently selectable *hinged candidate pieces*. `joineryCell` has `open:boolean`, defaults false. Pure function `nextJoineryState` returns a validated toggled cell record.
- The physical AABB set is recomputed from `open` and `rotation`, so a closed gate intercepts rays differently from an open gate; door and trapdoor similarly physically change occupancy.
- The fixture can toggle selected/placed items. This does **not** implement real-game click/tap handling, animation, multiplayer, sound, protection zones or production state transitions.
- Central :00 engine owner must reject toggles obstructed by the player/other solids, prevent cross-cell clipping/overlap, handle atomic save/apply/rollback and refresh neighboring chunk meshes. Do **not** blindly apply fixture toggles directly to the live world.

## Dependencies on generic engineering
- :00 generic interactions: proposed `raycastShapes` / `validateShape` in candidate PR #106. Our `{boxes}` exports are compatible in shape. Exposed selection hit and `canPlaceShape` must be jointly validated after incorporation.
- :12 generic shape system: opt-in prototype `shapeDescriptor` and `prototypeSurfaceMesh` in PR #108. This pack's preview mesher is deliberately local; production renderer must use the integrated shape-aware/UV/material pipeline and verify culling/tint/face normals before activation.
- Live `src/voxel.mjs` currently rejects IDs greater than 8 and live material palette only has those legacy IDs. This pack **must not** edit the registry; centralized incorporation must validate 59–72, legacy IDs and sentinel 255.
- `src/blocks.mjs` selectable list is still legacy-only. Central integration owns inventory-free material choice and placement UI if authorized.
- Saved schema-1 rows hold `[x,y,z,id]` and no rotation/state. The fixture snapshot remains strictly separate: `mythwrought-pack-2-fixture`, version 1; old ID 59–62 rows keep 5 values, new ID 63–68 rows have 7 values including `variant,open`. This does **not** prove production save compatibility. Central engineering needs an opt-in state sidecar or equivalent round-trip approach that does not mutate existing saves, keys, seeds or schema-1 readers. Reject unknown IDs and state before applying, and test rollback across partial failures.
- Slab/stair collision requires physical body vs union-of-boxes; gate/door/trapdoor when open remain physical, rather than becoming intangible fake decorations.
- Generated world placement/roads/bridges/houses is forbidden for this pack. No world generator, shader, UI, CI or shared engine changes in this PR.

## Test/preview limitations
- `tests/block-packs/pack-2/pack-2.test.mjs` covers the four timber materials.
- `tests/block-packs/pack-2/joinery.test.mjs` covers all 6 new joinery candidates (shape/mesh/state/targeting/corruption/legacy fixture recovery).
- `tests/block-packs/pack-2/ground.test.mjs` covers all four shallow ground/path components: ray targeting, true physical top relief, shape rotation, distinct visuals, corruption defense, save-fixture round trips and bounded triangle counts.
- Run `node --test tests/block-packs/pack-2/*.test.mjs` in a local repository checkout. Existing root `npm test` uses `tests/*.test.mjs` and therefore DOES NOT execute these nested tests automatically.
- Optional preview `tests/block-packs/pack-2/preview.html` is not deployed; open via a local HTTP server from a checkout. It uses browser Canvas 2D rendering of genuine generated mesh triangles, NOT original game WebGL2, and is not phone certification.
- Gate A open; v0.11 locked. Keep separate grip controls, offline PWA, legacy save schema and user world edits unaffected.
