# MYTHWROUGHT — Manual Four Biomes M2 isolated runtime bridge (draft only)

**Parent accepted M0/M1**: PR #231, SHA `a8d878633eef9c94f64ba225c80a19ac1f2216ea`. Exact-head Actions #44216254537 completed SUCCESS: 12/12 CI contracts, 966/966 native, full 20/20 genuine Chromium WebGL2 scripts; independent zipped artifacts audited (88 valid PNGs/86 unique hashes). M0/M1 accepted as source+save PROFILE contract, **NOT** live published biomes. Source candidate PR #172 `19db446458a61075be5103e1490fb16637ce641a` and main `104e57ff678a0c58593d1e3c85c13c6c112da992` untouched.

## Exact ownership and functionality

This M2 implementation PR is a SEPARATE, DRAFT, unmerged and undeployed child of the accepted M0/M1 branch. It adds ONLY:
- `src/manual-biomes/m2-runtime-bridge.mjs`: new-world intent planner; profile-aware `FourRegionWorld` wrapped by the **real production `Pack2LiveWorld`**, reuse of verified base and Pack 2 save/journal handlers, explicit failure/partial-write reporting, and profile-inclusive portable export inspection.
- `tests/manual-biomes/m2-runtime-bridge.test.mjs`: source-backed tests on `VoxelWorld`, `FourRegionWorld`, `Pack2LiveWorld`, four biome centers, mined terrain and sidecar persistence, legacy seeds, duplicate-creation refusal, malformed profile, explicit export inspection, cross-seed isolation and corrupt Pack 2 journal.
- `tests/manual-four-biomes-m2-preparation.test.mjs`: root-level native acceptance so generic full CI cannot silently skip M2.
- This handoff document.

**No production files are changed**: `src/main.mjs`, `src/voxel.mjs`, `src/persistence.mjs`, `src/pack2-world.mjs`, `index.html`, `styles.css`, `src/exploration-map.mjs` or any existing automation, builder or cave code.

## How the later real integration must work (not done by this draft)

1. In existing `src/main.mjs`, the old `loadWorldSafe(localStorage,seed)` → `loadPack2LiveWorld(localStorage,base)` chain may only be replaced by `openM2World(storage,approvedChoice)` after separate explicit creator approval, full M2 CI and hardware review. Never use `createSurfaceBiomeWorldView` for player editing; gameplay must hold the same authoritative `Pack2LiveWorld` on a `FourRegionWorld` base for get/set/mesh/collision/raycast.
2. Seed selection UI must offer an explicit **CREATE NEW FOUR-BIOME WORLD** action with separate confirmation; ordinary **LOAD/CREATE WORLD** and old seed selection MUST NOT switch a legacy seed to new generator. A new profile requires **no prior canonical record, journal, sidecar, previous selection, explored map**. `planM2WorldChoice` can prepare intent but does not write records; actual `openM2World` does durable activation only with exact approval.
3. The game's original `save()` path currently calls `savePack2LiveWorld` and `saveWorldSafe`. The candidate `saveM2World` preserves that order and adds checked generator profile, canonical schema-1 profile-specific base restore and a full read-back. It marks possible partial sidecar write instead of claiming atomic success. **Transactional cross-sidecar rollback and independent safe backups remain important before public release**. Other manual Pack1/3/4/5 sidecar save coordination must remain unchanged and must be audited against the new baseline.
4. **Block default EXPORT/IMPORT, mirror and vault restore** on profiled worlds until they can preserve a versioned generator identity. Ordinary old-world export cannot be used for new biomes: it would recreate different natural terrain on import. `exportM2World` + `inspectM2WorldExport` demonstrate a non-destructive profile+Pack2 envelope. There is NO production import commit yet; do not present the parser as implemented UI import/export.
5. Explore/map minimap `src/exploration-map.mjs` currently uses `terrainHeight` rather than profiled surface height. The actual M2 runtime integration will require read-only biome-aware surface sampling AFTER the user explores a tile; never reveal fogged regions. Spawn/respawn, landmarks, caves/entrances, geometry cleanup, the :48 non-block objects lane, PWA offline and controls must be inspected before shipping.
6. Physical terrain and water support for shaped blocks, 130 registry physical AABBs, source-exact chunks and GPU workload must be validated in genuine Chromium on the **runtime-enabled** world; existing 20-script green browser verification is only the unchanged legacy game. Capture four region exteriors + cutaways + transitions at 667×375/844×390/932×430, inspect screenshots and distinct hashes, then physical iPhone Gate A testing. No v0.11 unlock or forced deployment.

## Acceptance criteria / next continue

- At exact M2 preparation SHA, the normal root Node suite must execute every new bridge test AND preserve all M1 and legacy tests. Run pinned browser full regression against unchanged main runtime to protect old players; do **not** label that as actual four-biome live test.
- This PR is M2 **preparation**, not the fully accepted M2 runtime milestone. Continue separately with a controlled integration candidate, narrow shared-code review, actual game UI and profile-safe export/vault/mirror flows, direct source-accurate WebGL2 captures of the four biomes, and real on-phone checks. Full plan remains roadmap #229 through M8 public deploy.
- Keep M0/M1 PR #231 and source PR #172 draft, unchanged; preserve automations :24 shallow caves, :36 deep caves, :12 interface support and :48 objects, all builders and save schema-1. No merge, deploy, saved data changes or version unlock.
