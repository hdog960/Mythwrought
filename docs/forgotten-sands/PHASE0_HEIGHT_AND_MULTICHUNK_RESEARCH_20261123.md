# MYTHWROUGHT — The Forgotten Sands, Phase 0 source research

**State:** Isolated feasibility research ONLY; no production integration or deployment.
**Source baseline:** main db4bbcc32156e5df311f733bcaa53d559c17313b, released Desert V7 Phase 3.
**Creative direction:** Approved Forgotten Sands 12-phase roadmap. Settlements and hourly automations strictly outside scope.

## Original source verified

- src/depth.mjs: actual world limits -210 through +19. Section 0 covers -3 through +19, and 16-block sections are negative only. sectionForY, sectionBounds, sectionWindow and verticalEditSections exclude positive sections. Existing normal surface budget 5x5 = 25 GPU chunks; deep 3x3x3 = 27; a nearby mined floor breach may use 34.
- src/voxel.mjs: baseBlock and naturalAndLandmarkBlock return AIR above Y=19; set rejects edits above 19; meshChunk loops legacy -3 through +19. Existing voxelLandmarksForChunk keeps its footprint inside one 16x16 chunk.
- src/depth-mesh.mjs: meshDepthSection rejects nonnegative sections. A positive-section mesher must not change the original surface RGB terrain renderer.
- src/main.mjs: stream uses sectionWindow, sectionChunkRadius and depthMeshKey. Current Creative flight allows empty air above Y=19 but aliases it to surface section 0 and has no physical upper blocks.
- src/physics.mjs, src/blocks.mjs: spawn, mine and place use the global upper bound; collision samples real world.get cells.
- src/manual-biomes/environment-v7.mjs and desert-m3.mjs: natural terrain and cactus height are clipped by the existing limit; blindly raising a global constant would alter biome generation behavior.
- src/manual-biomes/profile-world.mjs and src/persistence.mjs: schema-1 saves, original generator profiles and authored edits must retain their original meaning and be protected.

## Isolated prototype delivered

src/manual-biomes/forgotten-sands-monument-prototype.mjs is an unimported pure research module that emits proposed integer-coordinate block cells using only existing STONE=3 and ORE=6 IDs. Each 16x16 chunk computes its own slice from a single world-space spec, independently of load order. An example 63-wide, 54-high stepped pyramid contains an empty chamber and entrance. A 111-wide variant also exercises local chunk bounds. The research can represent voxels above current world Y=19 but does NOT make them playable or renderable.

tests/forgotten-sands-monument-prototype.test.mjs passed 6/6 isolated local Node tests on 2026-11-23: validation, three-seed reverse chunk-order parity across negative coordinates, cell-by-cell parity, hollow interior, no world writes, bounded 111-wide per-chunk sampling. These are NOT original-game engine or WebGL2 integration tests. No broad GitHub Actions run requested.

## Non-destructive engineering proposal

1. Keep the legacy surface section 0 (-3 through +19) byte-compatible. Research positive sections starting with +1 (Y=20..35), +2 (Y=36..51), etc., in a separate opt-in engine branch. Do NOT change production WORLD_MAX_Y before original-engine and iPhone acceptance.
2. Use a single authoritative world.get and player edits. Determine whole-site placement eligibility before any chunk emits cells. Veto protected cave AIR, old landmarks, oasis/tree footprints, settlement reservations and player modifications. Never make site-admission decisions based on local chunk load order.
3. Integrate a bounded world-space site index only after proof, with compatible above-ground section meshing, Y=19/20 halo faces, cross-chunk edit invalidation, controlled GPU uploads, physics, raycast, block placement, save/export and Creative flight.
4. Do not increase the original 25-chunk surface scene budget merely because distant tall structures exist. Test scene budgets, memory/frame times and Home Screen iPhone PWA against actual generated worlds, including seed179 and seed2026.
5. Preserve existing M7 and historical generation profiles, caves, builder ownership, mountain/snow/enchanted changes, hourly automations and all existing draft PRs.

## Acceptance gate

**Demonstrated:** inspected exact original source; stateless multi-chunk sliced prototype; 6/6 isolated Node tests.

**Not demonstrated:** real positive-section rendering; original M7 source-native integration; real save/edit durability; cave/landmark vetoes; world-gen determinism after persistent edits; iPhone WebGL2 performance; Home Screen PWA.

Next: positive-section opt-in engine proof with original-source tests, measured resident/upload budgets and explicit creator-approved integration decision. No merges, deployments or migrations automatically.
