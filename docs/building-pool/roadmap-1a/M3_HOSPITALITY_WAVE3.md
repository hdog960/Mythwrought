# Builder 1A — M3 hospitality wave 3: nine original physical source-coordinate candidates

**Draft PR #180**, exclusively Builder 1A-owned files. Prior exact-head green `032c4e91200fb605ca9f90e6711bf138d1a8e5e1`, Actions #43920970569 SUCCESS; current source base `1f67efc9805e83866549515ffdad4dc7e225b234`. All 205 formerly accepted complete source objects are locked by `tests/building-pool/roadmap-1a/m3-hospitality-baseline205.json`; previous 191-,171-,149-object fixtures remain untouched.

## Source architecture, not palette swaps

Nine independently drafted 3D building candidates in `src/building-pool/roadmap-1a/m3-hospitality-wave3.mjs`: four taverns and five inns. Each contains individual immutable integer coordinate tables for real external cutout voids and notch-facing perimeter walls, room bounds and orthogonal partitions, physical open two-high portals, guest rooms or tavern hearth/serving areas, and individually differentiated roofs with actual bearing cells. These are 3D source candidates, not generated recolors or approved production art.

| Regional use | Original named building | Geometry and room purpose |
|---|---|---|
| Temperate large tavern | Mossfield Orchard Feast Barn | West-cut L-shaped civic feast hall; main brewing space, dedicated storage, performance aisle and staff lodging; offset gable peaks |
| Desert small tavern | Copper Sun Sundial Tavern | Open central U-shaped rear sun court; side kitchens and performance nook with connected public service rooms |
| Snow large tavern | Glacierhollow Firewatch Banquet | Asymmetric long T-shaped winter feast hall and cask-gallery rear stem; separated weatherward roof wings |
| Mountain medium tavern | Cloudbreak Switchback Tavern | Actual T-plan with distinct forward drinking/kitchen rooms and rear staff/cask spine |
| Temperate large inn | Rosewind Orchard Courtyard Inn | L-shaped offset public arrival hall, two front guest suites and return sleeping gallery |
| Desert large inn | Amberglass Starfall Caravan Inn | Widened asymmetric L plan; central reception, separate guest rooms and full rear family suites |
| Snow small inn | Frostbirch Sled Trail Bunkhouse | East-recessed winter guest lodge, separate bedrooms, linen passage and rear sleeping hall |
| Enchanted forest medium inn | Moonfern Woven Lantern Inn | T-plan traveler reception and independent front and rear guest rooms |
| Enchanted forest large inn | Elderstar Starlace Sanctuary Inn | West-cut long return wing, central reception, multiple guest spaces, asymmetrically supported roof |

**Actual physical source footprint:** **110,037** 3D local voxel placements, **6,126** truly absent exterior cells through all height levels, **46** reachable distinct functional room volumes and **19** genuinely reserved Pack5 two-cell bed footprints. All nine compiled against exact source schema and passed preliminary strict normalized 16×16 partition floorplan IoU **<0.88** and exterior footprint IoU **<0.975** versus all 205 previous records and each other. Failed drafts (eleven) were rejected, not counted or permitted to weaken criteria.

**Full roster:** **214/450 candidates: 150 houses, 38 taverns, 26 inns**, with **236 remaining: 150 houses, 37 taverns, 49 inns**. Per-biome/size strict maximum five taverns or inns; unique `r1:` source IDs. The source-design M2 150-house goal remains protected.

## Exact-head acceptance tests and genuine Chromium requirements

- `tests/building-pool/roadmap-1a/m3-hospitality-wave3.test.mjs`: all 205 formerly green objects' complete serialized data hashes and lengths, all nine compiled full-geometry source originals, 214 D4 mirror/rotation structural uniqueness, strict two independent IoU gates, producer-backed Pack1–5 physical AABB source audits, full-height absent outdoor columns, exterior walls, supported raised roof tiles, reachable walkable interior/portal graph and Pack5 bed reservations.
- **1,116 genuine WebGL2 source-authored cell-cube diagnostic exterior and cutaway screenshots**: 186 source ID gallery candidates × 2 views × 3 landscape sizes.
- **840 genuine WebGL2 Pack1–5 producer visibleBox AABB exterior and cutaway screenshots**: 140 source ID gallery candidates × 2 views × 3 sizes.
- Exact viewport sizes **667×375, 844×390, 932×430**; screenshot manifest and artifact to be checked against exact-head CI. Screenshots are diagnostic source geometry, not final textured premium building models nor physical device certification.

**No production release or authority change:** All 214 are source candidates, **zero creator-approved, zero registered, zero world placed, zero integrated and zero deployed**. PR remains draft/unmerged; no shared CI, engine, input, saves, siblings, Block Packs, automations or production main change, and v0.11 remains locked. Production Pack2 hinges/saves, Pack3 roof load/weather, Pack4 glazing/weather, Pack5 bed occupancy/collision, creator final art, on-device phone controls and authorized world registration remain unresolved separate gates.
