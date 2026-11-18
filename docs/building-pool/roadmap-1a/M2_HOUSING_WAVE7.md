# Builder 1A M2 — Wave 7: Fifteen new coordinate-authored nonrectangular homes

**Repository provenance:** draft PR #180, source main `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`, checkpoint 009, original draft PR #121 `88a9e410a0eda7cf961cb6b624241666eb3a48a1`. Seven sibling builders, five manual block packs, five automations, independent biome130, game runtime, save schema 1, CI configuration, v0.10 Gate A and locked v0.11 remain untouched.

## Real source geometry
Wave 7 contains **15 original hand-authored houses**, one per five biomes and three size classes, with **71,243 literal local XYZ voxel placements**, **2,463 genuinely void exterior footprint columns** and **79 individually authored rooms**. All comprise actual L-left, L-right, open U and asymmetrically double-notched T shapes, with complete independent room graphs, two-high portals, supported roof profiles, true foundation and perimeter gaps, Pack1–5 source physical family dependencies, source numeric variants for two-cell beds, and window/door jamb authoring. Buildings are deliberately single floor; no invented stairs.

A stricter comparison found that several first-try outlines resembled older houses. Every new notch mask was source-refined, including an original Mountain Small change to rear-room geometry instead of weakening acceptance checks. Independent exact-source replay across all 144 blueprint objects certified unique IDs, no D4 mirrored/rotated source structural fingerprints, real reachable walking spaces, roof backing and nonoccupied Pack5 bed extra cells. Maximum cross-wave/previous-pool normalized partition-plan Jaccard **0.654** and literal silhouette Jaccard **0.949**; the new source tests reject >=0.88 and >=0.975 respectively.

## Honest inventory
**144/450 coordinate-authored candidates:** **123 houses, 17 taverns and 4 inns**. Exactly **30 inherited source-exact** + **114 distinct new 1A**. **306 unauthored**: 177 houses, 58 taverns, 71 inns. M2 domestic first milestone **123/150 houses**, **27 more**. **0 creator-approved, 0 integrated, 0 world-placed, 0 deployed**.

## Test proof targets, NOT acceptance yet
All **129 preexisting full blueprint objects** are protected by source-exact complete serialization hashes and regression tests. The new native suite must check source IDs, D4 reflections and rotations, full 144 source pool, every wave7 room/door/walkable region, actual full-height exterior voids and their notch-facing 4-high walls, roof-cell backing, source Pack1–5 physical AABB/dependency validation, real Pack5 two-cell bed extra-cell reservations and normalized floorplan+silhouette rejection.

Actual Chromium WebGL2 diagnostic targets: **116 source candidates × exterior/cutaway × three landscape viewports = 696 genuine authored SOURCE-CELL CUBE PROXY screenshots** and **70 producer Pack1–5 visibleBox AABB source candidates × exterior/cutaway × three viewports = 420 producer-derived physical AABB screenshots**. These are technical candidate geometry, never final premium art, true in-game block registration or physical iPhone testing. The source and tests are pending latest exact-head GitHub Actions acceptance.

**Remaining gates:** Pack2 door hinge sweep/rotation/schema1 codec, Pack3 roof load/weatherproof support, Pack4 optical glass and weather fit, Pack5 bed collision and saved occupancy/orientation, creator art approval, actual phone controls and authorized combined central integration. Draft PR only, no merge or deployment.
