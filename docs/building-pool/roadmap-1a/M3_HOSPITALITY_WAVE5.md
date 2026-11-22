# Builder 1A M3 Hospitality Wave5 — eight original source-authored buildings

**Repository:** [hdog960/Mythwrought](https://github.com/hdog960/Mythwrought) · **Draft-only PR:** [#180](https://github.com/hdog960/Mythwrought/pull/180). Source limited to `src/building-pool/roadmap-1a/`, `tests/building-pool/roadmap-1a/`, `docs/building-pool/roadmap-1a/`.

**Accepted initial Wave5 preflight:** 8 complete original literal coordinate-source 3D building blueprints — **5 taverns and 3 inns** — authored in `src/building-pool/roadmap-1a/m3-hospitality-wave5.mjs`. Of the 27 attempted original design specifications, 19 failed preliminary uniqueness/physical/slot validations, were excluded without thresholds being weakened, and must **never be counted as created buildings**.

| New category / size / region | Individual building | Architectural arrangement |
|---|---|---|
| Tavern / small / temperate | Thornwell Ember Orchard Ale Room | Six separate rooms in true U-shaped central open-air court; hearth, staff bunk, serving hall and western/eastern branches |
| Tavern / medium / temperate | Willowford Three Bridges Tavern | Asymmetric T pavilion with opposed public/cookhouse front rooms and long, supported timber-cask rear spine |
| Tavern / small / enchanted forest | Glowmoth Singing Fern Pub | Small T-shaped singing hall with distinct cooking wing, private staff bed, and exterior voids |
| Tavern / large / enchanted forest | Starshade Nightbloom Dance Tavern | Large T-shaped festival hall with different front gable heights, isolated public rooms and rear serving axis |
| Tavern / small / mountain | Cairnstep Dragon Copper Pub | Open middle U courtyard with stone-lined opposed drinking and kitchen wings, separate roof profiles |
| Inn / small / temperate | Dapplebrook Silver Birch Inn | Irregular T-shaped reception and three independent guest/sleeping rooms |
| Inn / small / snow | Frostfall Sleigh Lantern Inn | Snow-resistant T-shaped guesthouse with long roof backing, distinct reception and rear family suite |
| Inn / small / mountain | Ridgewood Echoes Traveler House | T-shaped mountain traveling inn with side sleeping wings and separate linen and rear suite rooms |

**Physical source totals:** **64,299** placement voxels, **5,974** genuinely absent outdoor footprint columns from full-height foundation/wall/roof geometry, **42** functional independent room volumes, and **14** Pack5 two-cell reserved bed footprints. Each new design stores its own exact source integers for exterior-notch rectangles, bounded rooms, wall/partition segments, real two-high portals, Pack1–5 fixture symbols, and separately raised roofs; the 1A-only compiler materializes them without changing any historical designs.

**Uniqueness:** All eight new candidates passed preflight source-schema compilation, source room ownership for furniture, normalized 16×16 physically occupied partition IoU **strictly below 0.88**, and normalized genuine nonrectangular exterior occupied-cell silhouette IoU **strictly below 0.975**, against all **224** previously green sources and every newly accepted peer. Subsequent exact-head native tests enforce zero D4 duplicates, exterior wall backing, walkable room-portal network and source physical Pack1–5 visibleBox AABB contracts.

**Source conservation:** Full 224-object length + FNV serialization hashes protected by `tests/building-pool/roadmap-1a/m3-hospitality-baseline224.json`; all earlier frozen 214/205/191/171 source baselines remain. New isolated acceptance at `tests/building-pool/roadmap-1a/m3-hospitality-wave5.test.mjs`. The entire 1A pool now totals **232/450 candidates: 150 houses, 47 taverns, 35 inns**, with **218 remaining = 150 additional house designs, 28 taverns and 40 inns**. The initial 150-house M2 design milestone remains preserved.

**Chromium exact-source proof requirement:** **1,224** real Chromium WebGL2 source-cell cuboid exterior/cutaway diagnostic screenshots = 204 physically sourced unique gallery IDs × 2 views × 3 viewports. Separately **948** real Chromium WebGL2 producer Pack1–5 source `visibleBoxes` physical AABB diagnostic screenshots = 158 IDs × 2 views × 3 viewports. Exact viewport sizes **667×375, 844×390, 932×430**. Native source tests, browser counts and artifacts must pass for the exact PR HEAD; do not infer production art approval from diagnostic geometry.

**Production boundaries:** PR draft, no merge, no deployment, no registration, no source assets world-placed, no main changes, no shared CI changes, no other roadmaps, manual Packs or 130-block ownership changes. All 232 objects remain **creator candidate-only, 0 approved, 0 integrated**. Pack2 hinge yaw/door schema1, Pack3 structural/weather roof, Pack4 optical/weather glazing, Pack5 actual two-cell bed collision/persistent occupancy, final premium art, physical iPhone two-thumb controls and separate authorized incorporation are unresolved. Keep **v0.10 Gate A and v0.11 locked**.
