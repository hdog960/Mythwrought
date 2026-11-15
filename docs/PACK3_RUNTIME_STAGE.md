# Pack 3 physical runtime integration — isolated Stage A

This folder contains an **opt-in, not-yet-live** candidate that moves approved Block Pack 3 beyond static builder catalog data. It is deliberately NOT imported by `src/main.mjs`, `src/voxel.mjs`, `src/depth-mesh.mjs`, `src/blocks.mjs` or the active save/palette system.

## Actual new engineering
- `meshPack3PhysicalAsset(symbol,rotation)` builds **physically exposed faces of the exact source parts** rather than full-cube placeholders; hidden internal faces are omitted and each exposed face inherits its source palette tone. It emits the renderer-compatible 9-float vertex layout. This is a CPU mesh adapter, not a claim that production WebGL has drawn it.
- `createPack3RuntimeStage(world,{worldId,maxCells})` provides bounded atomic construction overlay placement that refuses overwritten world edits and existing terrain. It uses the exact same shaped box union for selection/raycast, body-fit collision, and deterministic chunk-local mesh generation.
- The overlay's separate `mythwrought.pack3-construction-overlay.v1` JSON preserves orientation and checks world seed and identity while **leaving schema-1 save bytes untouched**.
- Dedicated root Node tests exercise all **56** approved block/yaw cases, world-space targeting, clearance through an arrow slit, occupied-cell rejection/atomic rollback, ID and orientation roundtrip, depth section meshing and legacy save nonmutation.

## Necessary live-game gates — not complete
The production game still accepts only block IDs 0–8 in `VoxelWorld.set`. The main and depth chunk meshers, WebGL2 upload path, collision/physics, player-target outline, UI selector, protected editing, live redraw invalidation, seed-bound overlay storage, orientation reconciliation, and saved-world recovery are not wired to this stage.

Do **not** merge this PR as proof that IDs 109–125 are live-placeable. Passing its tests would certify only the isolated bridge; game wiring requires a further design and exact-head Chromium/WebGL2 plus physical-iPhone budget validation. No world placement, villages, towns or cities are generated at this stage. Gate A and v0.11 lock remain unchanged.
