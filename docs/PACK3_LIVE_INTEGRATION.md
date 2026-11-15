# Mythwrought Block Pack 3: live shaped construction (draft runtime stage B)

Creator-approved physical IDs 109–125 are now accessible to gameplay through a **separate, seed-bound, verified construction overlay**. All 17 ID identities, 56 supported physical orientations and original Pack 3 sources are preserved.

The actual runtime (not just a static preview) integrates:
- Physical source-true oriented colored AABB surface meshes appended to existing 9-float WebGL2 section/chunk buffers. No extra GPU chunks or parallel scene pipeline.
- Shape-accurate targeting and full-body player collision while existing 0–8 worlds retain their original collision path.
- Additional 17-item selector in settings, leaving both iPhone landscape touch-grip rails untouched. Roof-surface IDs 109–112 are north-only. Other 13 physical assets rotate four ways.
- Placement and mining through the existing PLACE/MINE controls; veto protected terrain/player-edited voxels and player intersections.
- Serialized independent sidecar key `mythwrought-pack3-construction-v1:<seed>` contains exact ID symbol, coordinate and yaw, strict validation and readback; **the legacy `VoxelWorld.save()` remains schema 1 and its 0–8 identity range is unchanged**.
- On storage write or GPU rebuild failure the operation is rolled back, retaining the previous construction state. Corrupt saved overlay bytes fail closed without deletion or automatic repair.
- Across seed switch / vault restore / mirror restore / import, read each seed-specific overlay anew and preserve original saved edits. Browser proof remains necessary for exact reload, controls, rendering and reduced-resolution GPU budgets.

**Engineering limitation:** This is a *live gameplay overlay registration* for physical IDs 109–125. `VoxelWorld.set` itself remains 0–8 by design; no schema-1 migration is performed. Existing settlement blueprint libraries can use `pack3:023–029` and `pack3:069–078` through the merged builder adapter, while the actual settlement-assembly phase remains separate. No water simulation, light emitter, NPCs or harvesting is added. Pending: true iPhone performance testing, saved-overlay export/backup workflow, and final compatibility certification.

Draft and unmerged. Do not deploy until exact-head source native tests, full production CI and genuine in-game Chromium WebGL2 interaction/screenshots pass. Gate A open; v0.11 locked.
