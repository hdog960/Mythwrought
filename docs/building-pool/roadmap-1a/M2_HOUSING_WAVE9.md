# Builder 1A M2 — Wave 9: First 150 source-authored houses

**Draft and isolated:** PR #180; parent main/checkpoint 009 `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`. No runtime registration, sibling builder, five manual packs, biome130, automation, world/save, deployment or Gate A changes.

## Original authored wave9 inventory (22)

All 22 designs have individual **literal source-coordinate** exterior cut masks, partition segments, distinct room bounds, individual portal throats, support-bearing roof-wing rectangles, furniture anchors and source Pack physical dependencies. The records are persisted as complete `SPECS` objects; **they do not depend on procedural building generators, material swaps, mirror/rotate clones or differing titles**. Every candidate resolves to a full deterministic 3D voxel placement and circulation table from Builder 1A's already audited compiler.

| Biome | New authored homes |
| --- | --- |
| Temperate | Briarford Riverfork Cottage (small); Bellhollow West Orchard Hall (medium); Highmere Three-Bell Homestead (large); Oakglass Lantern Corner House (small); Wrenwater Canal Merchant House (large) |
| Desert | Suncleft Masons' Dwelling (small); Namarra Twin-Mirage Family House (medium); Saffrondune Caravan Family Hall (large); Dunescar Twin-Pylon Manor (large) |
| Snow | Winterhook Heated Porch Hut (small); Whitepine Three-Gable Resthouse (medium); Frostglass Narrow-Court Lodge (large); Icemere Snowcourt Family Cabin (small) |
| Enchanted Forest | Twilighthollow Wishingwell Croft (small); Mirthroot Woodland Study Home (medium); Sylvanspire Moonwatch Hall (large); Whisperfern Crescent Glade House (medium) |
| Mountain | Stonewhistle Switchback Cabin (small); Ironroost Lower Terrace Villa (medium); Cairnspire High Pass Residence (large); Redstone Splitridge Refuge (small); Thornpeak Hanging Court Manor (large) |

Exterior silhouette is physically concave: **6,759 columns removed with absent foundations, perimeter, interior and roofs**, not a recolored full rectangle. The 22 source designs contain **108,715 voxel placement anchors**, **93 walkable rooms** and **22 distinct Pack5 two-cell occupied-bed reservations**. Buildings span one, two and three separate roof masses with varying pitched/stepped, fully backed source cells; no unsourced floating roof layer. Doors are physically open two-level clearances with stowed leaves on neighboring jambs.

A strict complete-pool D4 (rotations and mirrors) scan of all 171 authored candidate 3D sources found **zero equivalent geometry fingerprints**; additional normalized 16×16 overlap limits reject any new floor partition IoU >=0.88 or exterior-silhouette IoU >=0.975 versus every one of the prior 149 blueprints and the other 21 new homes. These tests are checked in and **must pass at exact latest HEAD**; do not equate source preflight with GitHub Actions acceptance. Some first-draft source geometry was rejected/refined rather than weakening uniqueness.

## Full authoring count and gates

- **171/450** fully source-authored candidate blueprints: **150 houses**, **17 taverns**, **4 inns**.
- Prior **149 full source blueprint objects** are protected by exact complete JSON-length and FNV fingerprint fixture `tests/building-pool/roadmap-1a/m2-wave9-baseline149.json`.
- **30 inherited source candidates** + **141 new independently 1A-authored candidate designs**; **279 still unauthored**: 150 future houses to complete eventual 300, 58 taverns, 71 inns.
- First source housing milestone **150/150**, but **0 creator accepted, 0 registered, 0 world placed, 0 integrated, 0 deployed**.

## Required independent technical evidence

- Node native: preserve all 149 old candidate source-object hashes, validate complete 171 candidate schema/IDs/source uniqueness/strict D4, reject normalized footprint and partition near-duplicates, verify every physical gap across full height, four-high notch-facing walls, reachability of all rooms, empty portal throats, valid per-role placement, reserved Pack5 bed feet with real floor backing, source grounded multilevel roofs, and actual Pack1–5 96-family/106-variant visibleBox AABB physical QA.
- Chromium WebGL2 true authored-cell-cube proxy: **143 selected distinct source IDs × exterior/cutaway × 667×375, 844×390, 932×430 = 858 captures**.
- Chromium WebGL2 true producer Pack1–5 `visibleBoxes` physical family AABB diagnostic: **97 selected source IDs × exterior/cutaway × same three landscape sizes = 582 captures**.
- **These are source geometry acceptance diagnostics, not final premium textured game art or physical-iPhone tests.** Review source cutaways for silhouette, roof seam, bed and passage legibility before creator final art approval.

## Explicit production blockers

Pack2 hinged door sweep/rotation/schema1 restoration, Pack3 roof load/weather-seal, Pack4 translucent pane optical fit and weather seal, Pack5 bed collision/save occupancy, actual hardware iPhone playability, final creature-art/architecture approval, runtime registration and authorized settlement placement are not certified. Preserve Gate A v0.10; **v0.11 remains locked**. No merges, deployments or shared-file integrations in this lane.
