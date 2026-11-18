# Mythwrought — MANUAL FOUR-BIOME M0/M1 implementation checkpoint

**Owner**: manual chat only. **State**: candidate code, draft/unmerged/undeployed. **Version**: v0.10 Gate A; v0.11 locked.

## Exact-source M0 intake

- Current-main source baseline at M0 creation: `104e57ff678a0c58593d1e3c85c13c6c112da992`; recheck before every new implementation slice.
- Canonical preserved old candidate is **draft PR #172** HEAD `19db446458a61075be5103e1490fb16637ce641a`, never modified by this development.
- The seven files below were copied from the EXACT candidate commit, byte-for-byte, into a SEPARATE manual M0/M1 implementation branch based on main:
  - `src/surface-regions/regions.mjs` blob `49123252eb65193c589ef542a148827894d3a179`
  - `tests/surface-regions/edit-persistence-acceptance.test.mjs` blob `b344cd2baff7c304367e79c15289c3a7a8912520`
  - `tests/surface-regions/four-region-engine-acceptance.test.mjs` blob `503c26f95a214c93f82523473f2964444f38bea3`
  - `tests/surface-regions/geological-bands.test.mjs` blob `159bd40ecb4165f4328d4cc377443f91328e5fd8`
  - `tests/surface-regions/multichunk-acceptance.test.mjs` blob `dcfba41954bba3465b4aba301e8c7539235ca4e3`
  - `tests/surface-regions/regions.test.mjs` blob `465224faf7d29fbaa3c7ea1ac730b5d941bb4173`
  - `tests/surface-regions/relief-profiles.test.mjs` blob `4dc5097236ecc4db9b51b4646184d011d1a665d0`
- Production main still uses `VoxelWorld` through `Pack2LiveWorld` in `src/main.mjs`. Nothing automatically enables this new world or touches existing seeds/saves. Seed 179 expected centers: Desert (512,0), Snow (0,512), Mountains (-512,0), Enchanted (0,-512). Y-depth contract remains -210..19; legacy surface -3..19.
- Previously #172 passed a GENERIC workflow; focused nested candidate tests were NOT proven there. This manual branch includes a root-level `tests/manual-four-biomes-m0-m1.test.mjs` that imports **all six candidate focused suites plus the new manual M1 suite**, making them run under the existing `npm test` command. CI success is not the same as live gameplay acceptance.

## M1 implementation decisions (no production startup change)

1. `src/manual-biomes/profile-world.mjs` defines an exact versioned per-seed generation-profile identifier and `FourRegionWorld extends VoxelWorld`. Its overridden **authoritative `naturalAndLandmarkBlock`** uses the candidate whole-column safety plan only for newly enabled worlds. Inherited actual `get/set/save` compare edits against the new natural biome baseline. This avoids the read-only view's blanket edited-column fallbacks and ghost terrain. Surface plan cached in bounded LRU; deep sections bypass the surface scan. Valid source registries, legacy landmarks, AIR and old-world generator remain intact.
2. `src/manual-biomes/profile-storage.mjs` handles explicit **new-world-only** opt in, immutable generator version, per-seed checked metadata, verified profile journal, safe refusal of previously selected/explored or sidecar-bearing seeds, canonical schema-1 edit savings through existing `saveWorldSafe`, a profile-aware raw save loader and separately versioned portable biome export. Non-biome saves continue to load via unchanged `loadWorldSafe`.
3. **Critical save correctness**: the ordinary `VoxelWorld.restore` interprets a schema-1 edit against OLD legacy terrain and can strip an edit that equals the legacy natural block. The new `restoreFourRegionWorld` instead validates and replays the ORIGINAL canonical rows against the immutable profiled natural baseline. It preserves AIR edits in raised shelves and user restoration of old-natural blocks. Metadata loss/corruption fails closed rather than producing a different landscape.
4. Tests include actual production class API use, seed-179/7/2201 legacy voxel and schema-1 byte parity, all four profile centers, changes to raised shelves, edited neighbors, old-natural block restoration, profile save/reload, malformed rows and metadata, journal recovery, opt-in refusal, portable export inspection, actual Pack2 wrapper compatibility and `meshChunk`.
5. **Known M2 gate**: `src/main.mjs` still calls legacy `loadWorldSafe`. No live UI/profile selection, game save/export/integration, pack sidecar migration, or public biome placement has been activated. M2 must replace the world-construction path in a narrow reviewed shared-code integration and assure all raycast/physics/mesh/save flows share the profiled world. Portable export parser exists but production import/export hookup is not yet approved.

## Required verification record and next development

- Run `npm test` at EXACT implementation PR HEAD; the root-level manual acceptance test imports all focused suites. Read the *actual* GitHub Actions job logs for failures, repair only manual-owned files and reverify new exact HEAD. Run dedicated `node --test tests/manual-biomes/profile-world.test.mjs tests/surface-regions/*.test.mjs` when a genuine checkout is available, not just claim it from green full CI.
- Run all existing full 20 Chromium/WebGL2 scripts to confirm main world regression. These currently exercise **legacy game** because M2 runtime activation has not happened. Genuine active-four-biome browser captures, saved profile through browser, iPhone hardware performance and editor paths remain **NOT VERIFIED**.
- User-facing exit M1: source-exact focused candidates pass, profiled world is authoritatively editable and persists in test, legacy saves stay unchanged, generator identity is versioned and durable. Not yet ready to merge or deploy.
- Next: M2 narrow `loadFourRegionWorld` + `Pack2LiveWorld` + game export/import + create-new-profile selection integration; M3 genuine Desert runtime. Coordinate read-only with automations :24/:36, never edit their branches. No unauthorized v0.11 unlock.
