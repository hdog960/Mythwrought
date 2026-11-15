# Incorporation 010 — playable automation activation candidate (UNMERGED)

Creator request: make eligible 009 automation assets **physically visible and usable** during exploration, without sacrificing saves, current world content or iPhone controls.

**Base:** latest main `3f5c08edf7e1b384884b8d3a1849a59f58a49f43` (includes merged 009 `8ee1c097...` and separately authorized 10× underground depth). **Branch:** `incorporate-010-playable-auto-world-20261114`. Never assume this branch is published.

## Playable activation
- **:24 south gallery:** The existing two district caves retain their checkpoint-008 north wings. New gallery/throat cells are read from the actual :24 `southGalleryCaveWorld` module, activated only when existing seeded tree/court columns do not overlap the new gallery. The old seeded landmark reader retains priority. No terrain ownership or depth-engine edits.
- **:36 court survey:** Keep the original deterministic court search/result unchanged. In districts where that search found no court, invoke the bounded seeded `surveyPilgrimCourtSites` with terrain/district/cave/spawn guards and place returned stone cells as pure baseline voxels, not persisted edits.
- **:36 rotunda:** At most one stone rotunda in eligible districts, using the exact `planStoneRotunda` cells and strict natural, unoccupied 9×9 clearance. Preserve courts, cave paths, the 008 grove and spawn. Four openings and central walkability.
- **:48 twinwood:** At most one real wood/leaf arch in complementary eligible districts. Use `planTwinwood` with both axes and existing scenery as a physical occupancy reader. No save writes, no new persistent IDs.
- All new cells are visible through the **same `VoxelWorld.get`** as collisions, raycasts, meshing, mining and schema-1 serialization. Player edits remain the final override; no separate decorative mesh overlay.

## Invariants and tests
- No edits to `src/voxel.mjs`, `src/depth*.mjs`, gameplay controls, `src/blocks.mjs`, graphics pipeline, saves, CI, automations, manual Block Packs 1–5, building roadmaps or independent depth PR.
- Preserve 10× depth Y=-210..19, unchanged 0..8 IDs, schema-1 old-save round trips, 25 surface-chunk baseline and bounded live district cache. Avoid changing checkpoint-008 court/tree layout except the explicitly documented court fallback in previously empty districts.
- Native acceptance: `tests/live-world-010.test.mjs`; existing `tests/live-world-incorporation.test.mjs`; full `npm test`.
- Source-authentic Chromium: extend existing `tests/live-world-browser.mjs` to take three additional screenshots (new stone rotunda, twinwood forest arch, new gallery) after asserting live engine block queries, plus existing landscape grip and save/reload checks. Other browser scripts unchanged.
- Keep draft PR; require successful **exact-head** GitHub Actions Node + genuine Chromium/WebGL2, inspect images; do not merge/deploy without separate creator authorization.

## Biome registry / terrain gate (explicitly NOT activated)
- `src/voxel.mjs` still supports only physical IDs 0–8, stores surface mesh cells in Uint8Array with sentinel 255, and validates saves, selection, materials and placement against legacy IDs. New 009 biome130 symbolic candidates `013–027` and prior `001–012` are **not installed** as physical runtime blocks.
- Projected numeric IDs above 255 cannot enter that old representation without a widened safe ABI; ice additionally requires genuine translucency and transparent sorting, and non-cube shapes require correct raycast/collision. New desert/snow region generation also requires authored :24 terrain rules. It is unsafe to re-color existing blocks and call that a functioning biome.
- Full biome activation needs a separately tested, shape-aware registry/mesh/selection/save migration and authentic terrain/visual acceptance. No claims of biome readiness or physical-iPhone testing.

**Gate A:** v0.10 remains OPEN, v0.11 LOCKED. No deployments, approval or automation edits.
