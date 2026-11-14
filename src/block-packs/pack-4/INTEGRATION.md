# Pack 4 — isolated physical window candidate contract
**Status: UNMERGED CANDIDATE — NOT IN LIVE GAME. v0.10 Gate A only.**

## Scope and strict boundary
Read \`src/block-packs/pack-4/manifest.json\` for the exact 22-family roster and
reservations. This branch adds only Pack 4 sources, tests, and an opt-in gallery.
Do not import this pack into main, register new block IDs, modify world generation,
or put candidate structures into the seeded world without the creator's explicit
manual incorporation command. No game files, CI workflows, existing saves or
current on-device UI are altered.

Verified base: \`main f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84\`
and integration checkpoint 006. Main at that cutoff has persistent IDs 0–8,
not these candidates. IDs 159–164 are PROVISIONAL, exclusive to Pack 4.

## Source surface
\`windows.mjs\` exports \`PACK4_WINDOW_ASSETS\`, \`PACK4_WINDOW_IDS\`,
\`windowAsset(id)\`, \`windowShape(id,rotation)\`,
\`windowSaveState(id,rotation)\`, \`restoreWindowSaveState(value)\`,
\`windowMountOffset(id,rotation)\`, and
\`windowPreviewMesh(id,rotation)\`. Rotation is **integer 0..3** and a
clockwise quarter-turn around Y within one cell, with front toward local -Z
at rotation zero. Orientation is **one state value**, never a new block ID.

Every candidate has separately specified:
- visible material/sub-boxes, with original geometry and palette;
- positive non-full-cube selection and collision box collections;
- independent persistent block ID and orientation, never an existing 0–8 alias;
- mount rule \`opening\` or \`wall-face\`;
- \`occludesWholeCell:false\`, because full-cube occlusion is wrong for panes,
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
   \`windowMountOffset(id,rotation)\`; other panes, frames and bars use
   opening placement semantics, with the engine's normal adjacency guards.
3. Central renderer: separate **opaque** faces from **translucent** faces;
   translucent panels need correctly sorted depth-aware blending and usually
   \`depthMask(false)\` for the glass pass. The opt-in preview demonstrates
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
\`node --test tests/block-packs/pack-4/*.test.mjs\`

For the optional WebGL2 gallery: launch an ephemeral static HTTP server from
repository root and open \`/tests/block-packs/pack-4/gallery.html\` in Chromium
with WebGL2 enabled. The gallery exposes
\`window.__PACK4_GALLERY_RESULT\` and bears a conspicuous UNMERGED warning.

The root \`npm test\` currently expands \`tests/*.test.mjs\` only. It does
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
