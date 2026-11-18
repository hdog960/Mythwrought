# Builder 1A — M2 third authored housing wave

**Strict branch isolation:** All new code belongs to Builder 1A PR #180; main, original legacy PR #121, siblings 1B–4B, manual five-pack registry, automated biome130, five automations, shared world runtime, saves, Gate A and v0.11 lock are unmodified.

## Authoring facts
Third wave contains **15 genuinely source-coordinate-authored houses**, exactly one per each Temperate/Desert/Snow/Enchanted Forest/Mountain × Small/Medium/Large combination. Houses vary in dimensions, topology, connected routes, private wing arrangement, room graph, roof profile, roof backing and five-pack material placement, not merely color/palette or rotation. **43,330 actual authored placements**, including supported gabled and tiered roof massing, two-cell physically reserved Pack5 beds, stowed Pack2 door props, real wall/window openings, exterior foundations, and true open-air sky courtyards. These are one-floor buildings by design; no unnecessary or non-existent stairs are claimed.

**Full-pool counters:** 84/450 actually authored (63 Houses, 17 Taverns, 4 Inns). 30 exact-source inherited + 54 genuinely new, **366 remaining** (237 Houses, 58 Taverns, 71 Inns). M2 150-house milestone **63/150**, 87 more to author. **0 creator-final-approved, 0 integrated, 0 live placed or deployed**.

## Evidence and acceptance
- All 84 full 3D objects replayed against unchanged 1A schema, identity, D4 mirror/rotation fingerprints, and physical portal/room/walkable collision rules.
- Added native unit tests for every new house's 3D structure, full entrance-connected walking paths, 2-high door headroom, authored roof support and weather-approval false, two-cell bed reservations, true courtyard sky gaps, and producer-authentic Pack1–5 physical source references.
- Separate normalized 16×16 partition overlap test flags suspicious nearly identical floorplans among all 45 houses in the three new M2 home-only waves.
- Source-specific Chromium software-WebGL2 original coordinate diagnostics expanded to **56 actual candidate buildings × exterior/cutaway × 3 landscape sizes = 336 cube-envelope screenshots**; physical AABB mode is expanded to **10 house source IDs × exterior/cutaway × 3 landscape sizes = 60 actual Pack source visibleBoxes screenshots**.
- Before exact-head workflow completion, those are targets, **not certified outcomes**. Prior exact-head Actions #43779494437 passed 12/12 CI-contract, 735/735 root native, 111/111 1A native, 246/246 cube, 30/30 source-AABB captures. Previous evidence was visually inspected and exported into a labeled contact sheet; no final artwork claims.

## Production gates still unresolved
The pack family resolver is a **read-only candidate source**, not production registration or playable world building. No Pack2 door swept arc/save codec, Pack3 roof strength/waterproofing, Pack4 glass optical transparency/seal, Pack5 bed actual collision/save orientation, physically-tested iPhone controls, or creator art approval. Live world placement, manual block pack changes, integration and deployment explicitly forbidden.


### Source-evidenced near-duplicate remedy
A normalized 16×16 partition-grid review found new wave 3 houses too similar to previously authored houses despite different roof families. Replaced four complete wave 3 room/door/partition arrangements (Temperate small, Snow medium, Enchanted Forest small and large) without touching any of the 69 previous blueprint sources. Native tests now reject very high cross-wave 1A partition overlap regardless of biome, roof style or material color.
