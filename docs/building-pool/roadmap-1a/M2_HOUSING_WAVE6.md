# Builder 1A M2 — sixth wave, 15 new original nonrectangular house blueprints

**Source checkpoint**: legacy PR #121 and source main `e6bd7c1`/009 unchanged. Work isolated in draft PR #180, no sibling/manual pack/automations/shared runtime/CI/saves changes. v0.10 Gate A open and v0.11 locked.

## Independent coordinate-authored work
New wave: 15 actual original nonrectangular houses, one for each of the five biomes × three sizes. Exactly **54,239 integer-coordinate authored voxel anchors** with **3,069 full-depth/full-height absent exterior footprint cells**. Literal masks create L-left, L-right, open-back U, and *two separately notched rear-shoulder* T houses, rather than palette reskins, random seeds, or flat rectangular shelters. Roof wings have actual supported riser voxels, four-high notch-facing walls, real foundation cuts, exterior window cutouts, source door leaf stowage, individually specified interconnected rooms and Pack5 multi-cell bed anchors/footprint reservations. One-storey buildings by design; no fabricated stairs.

The Desert Small U trial had genuinely disconnected walking cells; it was replaced before its first commit with an independent deep side-aisle L-house. A later review found silhouette collisions despite unique interior plans; five new physical notch profiles were deliberately changed, leaving every earlier structure unchanged. Source audit of all 129 found **zero D4 fingerprints duplicated, no detached routes, unsupported roofs or blocked bed reservation**. Maximum direct normalized 16×16 plan IoU against all 114 prior + 15 new = **0.600**, maximum direct exterior silhouette IoU = **0.9689441**, below explicit strict 0.88 / 0.975 reject thresholds.

## Honest source inventory
Total **129/450** fully coordinate-authored candidates: **108 houses, 17 taverns, 4 inns**. **30** original source-exact legacy plus **99** independent originals. **321** more to author (192 houses, 58 taverns, 71 inns). M2 domestic 150-house milestone **108/150**, 42 additional houses. **Zero creator accepted, zero centrally integrated, zero world-placed or deployed**.

Prior **114 complete authored blueprint objects** are protected by a frozen full-source serialization hash/length regression test. No source, geometry, position, IDs, saved games or artwork from earlier blueprints were touched.

## Verifiable acceptance conditions
Real Node source test suite must verify exactly preserved original 114 source objects, full 129 authored records, D4 and strict normalized source floorplan **and silhouette** comparisons, actual notch exterior walls and missing physical roof/foundation/world cells, clear walkable entrances, 2-high portals, supported roof risers and exact Pack5 two-cell reservations with integrated five-pack source physical AABB/variant review.

Browser is explicitly **candidate only**: 101 authored models × exterior/cutaway × 667×375, 844×390, 932×430 = **606 source-cell cube WebGL2 views**; 55 actual producer Pack1–5 visibleBoxes physical AABB candidates × 2 × 3 = **330 genuine source-family AABB WebGL2 views**. Both must be real Chromium captures and artifacts, NEVER label cube proxies as producer physical assets or producer AABBs as live premium game art. Those numbers remain **TARGETS until latest exact-head Actions confirms success**.

Final physical family acceptance remains blocked: Pack2 swung door collision/save codec, Pack3 roof structural load and waterproofing, Pack4 optical glass and seals, Pack5 bed collider and schema1 variant/orientation restoration, hardware iPhone and creator artwork approval, final central integration.

## Exact-head CI defect remediation
Actions #43801646205 exposed two genuine source-authoring flaws, not a tool flake: three unsupported partition voxels crossed the Snow Small rear notch, and nine crossed the Enchanted Forest Large right notch across three wall segments. Corrected four authored partition endpoints only, removing **12 phantom voxels**, and added a fail-closed source compiler placement guard for every concave exterior void. Wave-five's 15 prior concave candidates compile unchanged; the other thirteen wave-six candidates serialize unchanged. Real Node/Chromium exact-head re-certification remains required.
