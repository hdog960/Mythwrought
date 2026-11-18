# Mythwrought — manual M5 real overland, fog, and cave safety

**STATUS: ISOLATED DRAFT, not automatically accepted.**
Parent M4 draft #263 exact accepted head `75f6f1eff51b33ac53d7dec0f3001f4be5601900`. Accepted M4 evidence: exact-head 12/12 CI contracts; 1005/1005 native; all 20 genuine Chromium WebGL2 scripts; 18 Snow/Mountain/Enchanted, 15 Desert and 12 four-biome source-specific PNGs; all 100 chunks below original 8 MiB GPU cap; six landscape G2B flight controls and physical deep/cave acceptance. Do not alter parent PRs #172, #231, #238, #244, #251, #262, #263 or automations, builders, cave owners, profile-save files. Main at `e9223217ef1e91d282900c3fc13a21eeda316b63` at M5 creation. No merge, deploy, rebase or v0.11 unlock.

## What this M5 candidate adds

1. **`src/manual-biomes/overland-walk-m5.mjs`:** a bounded read-only 3D AABB source-traversal search from the ACTUAL `newPlayer` legacy spawn to the centers of all four naturally generated biomes in a fresh versioned v4 world. Each one-block route edge demands real player headroom, floor contact, safe neighbor step and exact source-region weight. No fake four-way straight line, debug teleport, road construction, caves being sealed or world edits. If a route doesn't exist or search budget runs out, it says **FAILED** and records samples/visited counts.
2. **`scripts/ci/manual-biomes-m5-overland-audit.mjs`:** a separate FAIL-CLOSED hard gate which attempts all four routes, replays each found path with the actual production `stepPlayer` controller every frame (without direct position mutation), reveals map cells only as the player moves, and writes a JSON manifest even when any biome is not naturally reachable. It deliberately refuses to mark M5 travel accepted if even one route fails or the saved world changes.
3. **`src/manual-biomes/exploration-ink.mjs` + narrowly scoped `src/exploration-map.mjs` update:** draw accurate biome terrain colors only for tiles already present in the seed-specific discovery set. The undiscovered-tile check remains before **all voxel/map source queries**; ordinary legacy ink and the original schema-1 save are unchanged. Protected legacy features are not given fake biome paint.

## Required verification before declaring M5 complete

- Native source tests for strict fog (zero voxel reads before discovered), profile v2/v3/v4, corrupt read-only map protection, physical AABB cell route semantics, no edits and real `stepPlayer`.
- Dedicated **hard** route workflow: source-true full walking from fresh legacy spawn near 0,0 to all four interiors near ±512 X/Z. **A failure is a real gameplay blocker.** A successful geometric path alone is insufficient unless every step successfully replays through production physics. Neither a seeded debug teleport nor a static map rendering counts as travel.
- Genuine Chromium actual-game movement from initial spawn and map revelation with visible screenshots at **667×375, 844×390 and 932×430**. Distinguish a *short untouched player-input segment* from completed 512-block travel; do not claim latter until the hard gate and genuine long-route browser verification both pass.
- Preserve real cave entrances, old landmarks, shape-aware collision and Pack2. Deep-world 10× cave generation and schema-1 saving must not be altered. Preserve all four core GPU 25-chunk windows and immutable generation v2/v3/v4.
- Full repository native 12 contracts and 20 genuine Chromium WebGL2 scripts, depth/Creative/iPhone controls, 18/15/12 image regressions, real physical frame/hash audits required before any **new** milestone accepted.

## Outstanding non-M5 source conflicts

Profiled worlds' separate vault/mirror remain intentionally fail-closed until a generator-safe backup envelope is available; WORLD EXPORT includes profile. Fogged minimap currently colors discoveries from genuine physical geology; zoom-level and large-route UX may need separate review. Existing detached Snow/Enchanted flora is owned by the non-block automation lanes: do not duplicate, absorb or overwrite it. Dedicated real iPhone Safari/Home Screen/offline PWA playtest, real 60 FPS performance and source-exact reconcile with newer production geometry-removal remain open. No production release or saved-world migration without explicit creator approval.
