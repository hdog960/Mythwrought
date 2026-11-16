# Builder 2B — M1 six new original irregular architectures (101 authored)

**Scope:** draft PR #187, Builder 2B-only src/tests/docs. Nothing merges, deploys, integrates, writes schema-1 saves, registers pack runtime assets, approves artwork, touches biome130 or v0.11.

The source modules `m1-bespoke-courts.mjs` (3), `m1-ritual-trades.mjs` (2) and `m1-shadowstage.mjs` (1) contain new fixed-coordinate, deterministic full occupied voxel plans. All six were independently authored in specifically reserved M1 IDs and contain genuine missing floor/foundation footprints, weather walls, 3-cell air doors, named actual accessible rooms, non-placeholder fixtures, different elevated supported roof masses and unresolved Pack1–5 family dependencies.

| Type / biome / size | Unique source ID | Physically missing columns | Final authored occupied voxels |
|---|---|---:|---:|
| Amberleaf Three-Ledger Lapidary / Temperate Medium | `r2:jeweler:temperate:medium:02` | 227 | 4,938 |
| Fernsunder Four-Fork Gem Conservatory / Enchanted Forest Large | `r2:jeweler:enchanted-forest:large:02` | 314 | 7,557 |
| Gorgewatch Five-Coldworks / Mountain Large | `r2:butcher:mountain:large:02` | 255 | 8,084 |
| Sirocco Six-Room Loom Exchange / Desert Medium | `r2:tailor:desert:medium:02` | 286 | 4,974 |
| Elderbloom Five-Sanctum Moonroot / Enchanted Forest Large | `r2:temple:enchanted-forest:large:02` | 567 | 6,681 |
| Dustglass Tapered Shadowstage / Desert Small | `r2:theater:desert:small:02` | 294 | 3,172 |

**Physical source fixes made before authoring acceptance:** Fernsunder rear consultation route relocated off a blocking desk. Sirocco's front awning corrected to actually supported roof cells; its private side rooms now use continuous x11/x26 structural partitions with the only authorized air doors, eliminating a real bypass. Elderbloom's east lamp moved off a literal wall. Dustglass's 36-cell raised stage was given a publicly passable side-aisle approach to backstage, four correctly founded canopy posts and full side workshop weather partitions, including its own genuinely controlled access portal. None of these were test exemptions; all were source occupancy corrections.

**Current ledger:** 101/420 authored (15 inherited exact temples + 86 independent originals), 319 remaining, 0 creator-final-approved, 0 production-integrated and 0 world-placed. Historical 95 authored bodies unchanged, including 4,355-cell Ironridge. Corrected biome/size distribution is generated from actual source IDs rather than stale historical snapshots.

**Native QA:** new `m1-six-bespoke.test.mjs` verifies exact full-source 101 architectural D4 uniqueness, normalized 8-way same-category/size occupied-cell Jaccard under 0.85, true empty footprint, 3-high ports, grid BFS and closed-room protection, physical stage posts, roof support, read-only producer Pack-family ABIs and exact Git source blob parity.

**Chromium QA:** 12 new source-imported actual SwiftShader/WebGL2 exterior/cutaway full-cube proxy screenshots at 667×375, 844×390 and 932×430. **154 cumulative expected**. These source-driven proxy cubes are NOT a physical producer AABB mesh, final-glazed materials, approved art, playable integration, or physical iPhone evidence. CI and image artifact must be inspected before technical acceptance.

**Future blocker:** pack5 explicit variants/yaw plus shape AABB, occupied offsets, collisions, transparent glazing, support and schema-1 serialization; premium silhouette and final art review; no world placement until independent user approval.
