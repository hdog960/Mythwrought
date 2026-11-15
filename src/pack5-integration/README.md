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


## M2 integration candidate — actual gameplay hook, NOT deployed
- This draft now adds a **default-off** Pack 5 toggle in the existing scrollable
  settings panel. It reuses the original two-thumb movement/look and MINE/PLACE
  actions; the old ID 0–8 material palette is not widened or renumbered.
- When enabled, the game dynamically imports the 18-family physical catalog,
  verifies the seed-specific checksummed sidecar, renders original authored
  triangle colors through the **actual nine-float terrain shader** with existing
  depth/fog, and stages at most 16 nearby instances in one extra GPU draw.
- Player AABB collisions use occupied-cell spatial queries and original per-part
  boxes, not phantom full-cube hits. A new guard prevents mining legacy backing
  under placed floor/wall/ceiling Pack 5 objects; legacy edits cannot overwrite
  the same occupied cell or select through a nearer shaped object.
- Pack 5 edits persist synchronously in a separate journaled/backup sidecar,
  never the schema-1 terrain record. Corrupt sidecars fail closed. When changing
  or importing worlds the active Pack 5 adapter is cleared; enabling again
  loads only the currently selected seed.
- Root native regression and dedicated true **actual-game** WebGL2 Chromium
  screenshots are required as separate acceptance, not assumed green.
- Known remaining gates: verify all exact-head CI, screenshot and mobile
  performance; multi-thousand-place streaming and external sidecar
  export/import/backup consistency; actual iPhone controls and visuals;
  creator-authorized PR merge/deployment. No Gate A or v0.11 change.


## M3 — Automatic world-sidecar scene restoration (draft)
Saved Pack 5 furnishings now load automatically when a valid separate per-seed sidecar
already exists, even though the editor toggle defaults OFF. The authored shapes
are rendered and physically solid; importing or switching worlds clears the old
GPU/physics adapter and loads only the new seed's sidecar. A corrupt sidecar is
neither repaired nor overwritten automatically. Duplicate concurrent setup is
guarded by a shared, seed-checked initialization promise.

The real-game Chromium acceptance now verifies a page reload retains shaped GPU
geometry with the editor OFF. Full-world export remains schema-1 only; **off-device
Pack 5 export/import and coordinated backup are still separate open tasks**.


## Optional separate JSON export (M3)
A user-initiated settings button exports the exact current Pack 5 symbolic/variant
sidecar as a stand-alone JSON download. The normal world EXPORT remains a
schema-1 terrain file and does **not** include furnishings. An import/restore
UI for this separate file has not yet passed acceptance and is not advertised.


## M4 — Explicit separate JSON import and interrupted-write protection
The Pack 5 editor now accepts an explicit user-selected independent Pack 5
JSON file under settings. It validates the seed, physical fixture and support,
rejects player overlap and malformed data, and asks for confirmation before
replacing furnishings. Accepted imports use the existing per-seed journal and
previous-good sidecar backup; schema-1 terrain files and all other pack IDs
remain untouched. Rejected imports preserve the current scene. A failed
canonical write now attempts to restore and independently verify the previous
journal, primary and backup bytes before reporting an in-memory rollback.
A failure that cannot be compensated is identified as an interrupted-write
recovery blocker and must not be represented as a successful rollback.


## M5 — Shape-exact construction handoff and bounded stress testing
- `blueprint-handoff.mjs` resolves original Pack 5 symbolic dependencies to
  world-coordinate occupied cells, visual/selection/collision boxes, exact
  rotations, variants and required support cells without assigning a numeric
  block ID or writing a structure to the game. It is an independent handoff:
  Packs 1–4 and biome130 remain unresolved within this Pack 5 resolver.
- Tests cover 18 families x 2 variants x 4 turns, multi-cell footprints,
  duplicate rejection, foreign namespace rejection, 2048 placed physical
  objects, bounded 16-instance single-draw streaming and saved scene restore.
- Dense-world picking queries only nearby occupied cells, not every distant
  furnishing. Small scenes retain canonical fixture behavior.
- Browser CI also includes an **emulated touch-enabled Chromium landscape**
  smoke. This is not evidence of a physical-iPhone GPU or Safari acceptance.


## M6 — Paged furnishings: removing the hard 16-instance ceiling
- The actual game renderer now stages **spatially grouped authored furniture** in
  independently cached buffers, up to 256 nearby candidates and eight pages/draws.
  There is NO hard cap of 16 visible pieces; actual residency depends on genuine
  geometry size and an enforced **2 MiB total GPU resident budget**. Every buffer
  comes from the original Pack 5 indexed meshes, not a proxy cube.
- GPU uploads are incremental: at most one page per refresh (normally <=384 KiB),
  with retries/backoff and stale-geometry suppression on failure. The game
  drains pending pages every third frame; scenes with no pending pages return
  to a 20-frame refresh cadence. Unselected pages are evicted.
- The 4096-instance sidecar and physical collisions are unchanged. Pieces beyond
  the visible byte/page budget remain safely stored and collidable; a diagnostic
  budgetExcluded count makes those clipped assets explicit.
- A dense 64-piece actual-game Chromium fixture asserts **more than 16** rendered
  with <=2 MiB resident GPU data and <=8 added draws. The 2048-placement Node
  regression and context recovery checks remain in place. Software-Chromium
  timing is NOT physical iPhone hardware evidence or a 60 FPS guarantee.
- Replacing a live buffer may temporarily require the old and new buffer to
  coexist until upload succeeds (bounded transient peak: resident budget plus
  one page). Never infer on-device performance from software WebGL alone.
