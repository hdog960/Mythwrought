# Mythwrought Pack 5 — production-bound builder adapter (draft M0)

**Creator authorization:** all 18 source asset families merged via PR #119 at `54ac417ec13055a6a87d21c6f3a506509a751e71`. This dedicated integration draft isolates the next engineering step.

## Exactly what this change does

- Imports **the original 18 authored physical Pack 5 descriptors** and **36 original geometry variants** from `src/block-packs/pack-5/`; no duplicate artwork, numeric-ID aliases or recreated furnishings.
- Exposes a deterministic `PACK5_BUILDER_CATALOG` and `createPack5ConstructionLayer(world)` for future village, town and city blueprint modules.
- Supports shape- and rotation-aware multi-cell placement, floor/wall/ceiling attachments, occupied-legacy-cell blocking, player AABB rejection, precise per-part collisions, real shape ray-picking with legacy-world occlusion, removal and original source-authored colored GPU triangle buffers for independent builders/renderers.
- Supplies reversible, **atomic** JSON sidecar `mythwrought.pack5.builder-layer.v1` keyed to the world seed. It is **NOT** Mythwrought schema 1; the layer does not write localStorage, `VoxelWorld.set()`, production block IDs or the world save. Host code must provide explicit sidecar storage/backups/consent later.
- Is **opt-in only**: the playable game's current Build palette, chunk mesher, touch controls, live physics, live save and world-generation paths are not modified in this PR.

## Builder usage (once imported by an authorized host)

```js
import {createPack5ConstructionLayer}
  from './src/pack5-integration/construction-layer.mjs';
const layer=createPack5ConstructionLayer(world);
const result=layer.place('pack5:095',[10,7,10],0,'suncrown-eightarm');
// Provide an existing ceiling backing voxel first; otherwise placement fails.
if(result.ok){
  const gpu=layer.meshAt([10,7,10]); // positions, RGBA colors, indices
  // Host owns the GPU upload, streaming window, lighting and screenshot tests.
}
const savedSidecar=layer.snapshot(); // NEVER feed this to VoxelWorld.restore()
```

## Verification

- `node --test tests/pack5-integration.test.mjs` — dedicated integration coverage for catalog identities, 36 original variants × 4 rotations, supports, 18-family mixed construction, occupancy, shape picking, world occlusion, collisions, atomic invalid restore, real schema-1 world preservation.
- `node tests/pack5-integration-browser.mjs [artifact-dir]` — **genuine HTTP-served Chromium WebGL2** visualization of all 18 original physical meshes at 667×375, 844×390 and 932×430; writes PNG evidence. Requires free Playwright/Chromium already installed. This must be **actually executed** before reporting a browser PASS.
- Existing original Pack 5 exact-head #43670517314 passed **186/186** dedicated native tests. A new integration-PR run must pass independently before the adapter can be considered accepted.

## Still required before live construction or settlement deployment

1. Central main-game renderer/streamer hook to upload/unload these shaped meshes, integrate scene lighting and preserve the chunk GPU budgets.
2. Live player and builder input/UI, chunk/world-space collision/selection integration and world-edit coordination (do not invent functionality for beds, gates, ovens or chandeliers).
3. Persistent registry/ID strategy across all four other manual packs and the 130 biome catalog. The legacy world accepts only IDs 0–8, the one-byte chunk cache uses 255 as sentinel, and the save envelope remains **schema 1**. This adapter deliberately stores symbols in a separate envelope rather than assuming unsupported numeric IDs.
4. Durable per-seed sidecar storage, backups, atomic cross-save recovery, corruption tests, load/unload/culling, full-game HTTP Chromium and **real physical-iPhone** creator testing. No paid services.
5. Explicit green integration PR review and distinct creator-authorized **merge/deploy**. Do not claim any draft adapter is installed in the playable game.

**Gate A remains OPEN; v0.11 remains LOCKED.** No other packs, automation output, builder-roadmap source, game controls or save schema changed by this isolated PR.
