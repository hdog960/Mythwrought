# Mythwrought Block Pack 5 — isolated foundation

**Status:** Milestone 0; 0/18 physical families authored. **NOT INSTALLED IN GAME.**

Source and tests are exclusively owned by Pack 5. No numeric IDs allocated. Symbolic roster
identifiers `pack5:079` through `pack5:096` are **not** game block IDs. Follow the creator's
Milestones 1–6 in order. Recheck live `main`, checkpoint and coordination Issues #109/#117
before writing assets or proposing any numeric candidate IDs.

`fixture.mjs` supplies a test-only, multi-cell occupancy, rotation, partial-box collision, precise
shape selection, wall/floor/ceiling support and reversible snapshot adapter. It is not a runtime
registry, general physics engine or production schema-1 save adapter. Descriptor geometry
uses per-cell `[x0,y0,z0,x1,y1,z1]` unit-box unions as in the separate :12 prototype.
`parts[].boxes` are selectable while `parts[].collisionBoxes` may be empty for a thin rug.

Run: `node --test tests/block-packs/pack-5/*.test.mjs` from repo root. Root `npm test`
only discovers `tests/*.test.mjs` and does not run this nested suite.

No assets should be described as candidate/tested/integrated until their own source and
actual evidence exist. Future shared-engine shape, support, rotation, multiple-cell state,
raycast and save integration belongs to :00/:12 and creator-authorized incorporation.
