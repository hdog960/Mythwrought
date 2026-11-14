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
not these candidates. IDs 159–168 are PROVISIONAL, exclusive to Pack 4.

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
