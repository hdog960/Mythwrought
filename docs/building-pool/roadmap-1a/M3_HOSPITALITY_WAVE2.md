# Builder 1A M3 Hospitality — Wave 2, fourteen original candidate buildings

## Isolated ownership and unchanged production gates

Repository [hdog960/Mythwrought](https://github.com/hdog960/Mythwrought) · [draft PR #180](https://github.com/hdog960/Mythwrought/pull/180) · branch `building-roadmap-1a-m0-20261115`.

Wave 2 adds fourteen original complete 3D blueprint source records to the source-only building pool, **seven taverns and seven inns**. Source resides in `src/building-pool/roadmap-1a/m3-hospitality-wave2.mjs`. As with previous 1A waves, source coordinates and floorplans are explicit per-building authored input; centralized architectural emitter `compileM2ArchitecturalSpec` only materializes occupied integer 3D cells from those coordinate tables. **No world placement, new game art, save ABI, runtime registry, integration or deployment** is included.

## The fourteen authored plans

| Region | Category and size | Individual blueprint name | Actual architectural massing |
|---|---|---|---|
| Temperate | Medium tavern | Riverwheel Orchard Tap House | Irregular T-shaped cross-hall, private return gallery, double front roofs and elevated rear roof |
| Desert | Medium tavern | Duskwell Shaded Brewers Retreat | West-recessed L-shaped guest/stock wing, transverse public hall, exterior sun court |
| Snow | Small tavern | Tinderpine Meltwater Alehouse | East-recessed L-shaped public hall, winter service wing and pitched roof |
| Snow | Medium tavern | Embercrag Alpine Hearth Hall | Long T-shaped winter hall with divergent gable wings and rear sleeping gallery |
| Enchanted forest | Small tavern | Thistledusk Firefly Brew Room | Actual open central U-shaped rear courtyard, opposed kitchen/performance wings |
| Enchanted forest | Large tavern | Starbough Festival Mead Hall | Multiple concave western recesses and an asymmetric vaulted feast wing |
| Mountain | Large tavern | Highforge Cairn Festival House | East-recessed L-shaped festival hall with extra exterior steps and supported roofs |
| Temperate | Medium inn | Foxglove Brook Traveler Lodge | East-recessed arrival frontage with linen gallery and full rear guest suite |
| Desert | Small inn | Saffron Passway Caravan Shelter | U-shaped recessed open courtyard with guest wings and check-in hall |
| Desert | Medium inn | Ocher Dune Starwatch Inn | T-shaped central hall with three independent reachable guest rooms |
| Snow | Medium inn | Icemeadow Wayfarer Hearth Lodge | West-recessed cross hall with multi-room rear guest wing |
| Enchanted forest | Small inn | Glowcap Elderroot Guesthouse | L-shaped lodging with two front sleeping rooms and another rear guest suite |
| Enchanted forest | Large inn | Moonspire Lantern Guest Court | T-shaped three-room sleeping front and long rear service/guest stem |
| Mountain | Small inn | Stonepath Summit Waystation | Stepped western L-recess, full front guest rooms and returned lodging wing |

Every candidate has independently authored 3D coordinate input for exterior massing including fully absent cutout columns, distinct rooms and wall endpoints, two-high portal openings, interior circulation, physical source fixture/beds, and supported raised/asymmetric regional roofs. Original source geometry after compilation: **107,370 3D voxel placement anchors**, **6,998 genuinely absent exterior footprint columns**, **72 walkable rooms**, **29 reserved Pack5 two-cell beds**. All 14 passed preliminary compilation, source fixture room ownership, strict normalized interior partition IoU **<0.88**, and strict physically absent exterior silhouette IoU **<0.975** compared with all 191 previous buildings and new peers. Additional mandatory exact-head CI asserts D4 complete structural uniqueness, foundations, external wall closure, portal reachability, Pack1–5 source physical producer AABB manifest support, bed second-cell clearance and roof backing. Six attempted designs were excluded at the strict near-duplicate/validation gate and are NOT counted as authored.

## Complete inventory and regression protection

**205 of 450** fully coordinate-authored candidates: **150 houses**, **34 taverns**, **21 inns**. The initial M2 housing goal (150 houses) remains preserved. The **191 previous complete original source objects** (all 171 before hospitality wave 1 + all 20 wave 1 source blueprints) are frozen by `tests/building-pool/roadmap-1a/m3-hospitality-baseline191.json` with canonical complete-object serialized byte-length and FNV source fingerprints. Source rules disallow local IDs exceeding the per-biome/size quota of 5 inns or taverns.

Remaining in Builder 1A overall: **245** — **150 houses, 41 taverns, 54 inns**. All candidate only; **0 creator-final-approved, 0 game registered, 0 world placed, 0 integrated, 0 deployed**.

## Strict isolated exact-HEAD CI, before acceptance

1. `tests/building-pool/roadmap-1a/m3-hospitality-wave2.test.mjs` enforces exactly 14 new designs, protected 191 full objects, exact source geometry counts, D4 uniqueness and all 14 individual physical structural/room and Pack1–5 source producer checks.
2. Existing source gallery is extended to 177 distinct real source-authored candidate IDs, requiring **1,062** genuine headless Chromium WebGL2 exterior/cutaway *cell-proxy* screenshots: 177 × 2 views × three viewport sizes.
3. Physical Pack1–5 source `visibleBoxes` AABB gallery extends to 131 distinct candidate IDs, requiring **786** genuine Chromium WebGL2 physical-producer exterior/cutaway screenshots: 131 × 2 × three sizes.
4. Both suites use **667×375**, **844×390** and **932×430**. A 96-family/106-numeric-variant producer catalog is checked symbolically and physically at source AABB level, **not final production geometry/weather/save state**.
5. Require exact-head `CI_LANES: roadmap-1a`, focused native and screenshot test logs, complete artifact and strict ownership. No bypass of cross-builder or shared CI lanes.

**Outstanding outside-scope gates** are unchanged: Pack2 hinged door swing/rotation/schema1, Pack3 weather/load-bearing roof approval, Pack4 weather/optical glazing, Pack5 two-cell collisions/occupancy persistence, real iPhone two-thumb controls validation, premium finalized art and explicit creator-approved world integration. Preserve v0.10 Gate A and v0.11 lock; keep PR draft, unmerged, undeployed, and no sibling or shared files changed.
