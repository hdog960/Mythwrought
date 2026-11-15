# MYTHWROUGHT — Building Roadmap 2: Commerce & Culture

Exclusive paths: src/building-pool/roadmap-2/, tests/building-pool/roadmap-2/, docs/building-pool/roadmap-2/. Never merge or deploy. v0.10 Gate A OPEN; v0.11 LOCKED.

## 840-target accounting

13 categories, five biomes, three sizes, three-to-five distinct plans per category = 840 design slots. Milestone totals: M2 first five shops 375, M3 markets and specialists 300, M4 banks/temples/theaters 165. The 840 IDs are PLANNED, not authored. M0 has ONE coordinate-authored candidate, ZERO accepted and ZERO world-placed.

## Reference architecture

Hearthlane Two-Room Provisioner: Temperate small general store, 13 × 11 conceptual grid with 685 occupied xyz cells. Physical coordinate foundation, timber floor, walls, steep roof, street and side windows, entry opening, customer-facing counter, shelving, storage partition, offset doorway, storage crates and lantern placements. Conceptual circulation from entrance to both rooms is tested. This is a theoretical model: actual asset dimensions, orientation, support, glazing and door behavior remain unresolved.

The catalog preserves all 840 slots and category-required room uses. Schema validation checks occupancy, full shell, rooms, entrances, circulation and valid symbolic roster references. The geometry fingerprint rejects material-only, reflection and rotation duplicate architecture. It does not prove aesthetic uniqueness; human review remains mandatory.

## Dependencies and scope

Pack 1-5 material symbols such as pack5:086 and biome130 symbols represent ROSTER positions, not live persistent block IDs. All physical interfaces and candidate assets must be checked before any possible future handoff. Read GitHub main, incorporation checkpoints, Issues #109/#117, Pack PRs #113/#114/#112/#115/#119 and biome PR #118 on every session. At M0 PR #120 checkpoint 007 was pending and excluded. No touches to any other roadmap, automation, packs, engine, saves, UI, renderer, world generation, seed, offline PWA, control rails or gameplay.

## Validation

Dedicated native command from a complete checkout: node --test tests/building-pool/roadmap-2/schema.test.mjs.

Standalone conceptual browser source: tests/building-pool/roadmap-2/preview.html. It uses Canvas2D, NOT playable-game WebGL2. Genuine Chromium screenshots should be attempted at 667×375, 844×390, 932×430 and inspected. Never count nonexistent screenshots.

### Category-specific circulation acceptance
The M0 schema now requires each named room to be reachable from the exterior via a graph of its declared room uses, rather than assuming every category contains a shop storeroom. Test-only temple schema fixtures are NOT authored temple blueprints. Entrance clearance verifies all declared vertical cells; window apertures must exist as actual `window` geometry.

For genuine screenshots after the browser environment is operational, run `python3 tests/building-pool/roadmap-2/gallery-browser.py` with free Playwright Chromium installed. Six actual canvas screenshots (exterior/cutaway at three iPhone landscape widths) must be manually inspected before M0 approval. This is conceptual Canvas2D, not native game WebGL2.

### No-network Chromium fallback (genuine browser rendering)
Where localhost navigation is blocked, `python3 tests/building-pool/roadmap-2/gallery-offline-browser.py` runs the original concept-gallery materials inside actual headless Chromium using browser `set_content` and inline module bundling, without HTTP or alternate fake image generation. Produces three full-frame landscape screenshots at 667×375, 844×390, 932×430 plus six focused exterior/cutaway canvases. These do **not** certify production-game WebGL2 or iPhone hardware.

## M0/M1 update (2026-11-14)
M0 technically accepted after exact-head Actions #43644864326 SUCCESS. M1 authored 30 concept blueprints—15 general stores and 15 temples across five biomes and three sizes—inside `m1-representatives.mjs`, including the original Hearthlane fixture. All are CANDIDATE, not creator accepted or live. Each has structural xyz voxel occupancy with floor, shell, roof, windows, entrance and inner doorway, fixtures, room requirements and corridor. Temples have actual altar/columns/towers/spires; stores have shelves/counter/stockroom. Biome roof/footprint changes are not recolors.

Genuine native Node: `node --test tests/building-pool/roadmap-2/*.test.mjs` (18/18 PASS). Free Playwright Chromium `python3 tests/building-pool/roadmap-2/m1-gallery-browser.py` captures 30 × 3 = 90 true no-network standalone Canvas2D screenshots in three landscape sizes; this is not a production WebGL2 or physical iPhone test. Symbolic asset ABIs remain unresolved. See M1_ACCEPTANCE.md. Never merge/deploy from this draft.

### M1 temple silhouette remedy
The M1 geometry generator was revised after viewing authentic candidate PNGs: every temple now includes a massed, roof-exceeding pair of belfries, a triple-wide processional arch and a raised two-row altar dais placed behind the open sanctuary passage. New dedicated Node tests preserve those architectural, geometric and circulation invariants. These are conceptual voxel structures using symbolic assets; not production-confirmed shape ABI or creator-approved art.

### M1 load-bearing belfry and raised-dais access review
The previous 21-case tests allowed a tower to have zero foundations if its regional beveled footprint excluded that location. The corrected temple builder now adds complete four-cell pier foundations and floors beneath BOTH 2x2 belfries even at beveled Mountain, Desert and Enchanted Forest corners. Tests assert every footing, not merely already-existing ones. Two symbolic Pack 1 stone stair cells (`pack1:008`) are added next to the raised altar dais; slope orientation, actual collision/climb behavior and save-compatible shape states are **not approved**. M1 remains candidate-only until creator art review; the standalone Chromium viewer is not game WebGL2.

### Session 6: supported roof-span concept geometry
Twenty-three generated non-Desert M1 models now model high truss ribs every four interior longitudinal cells: uninterrupted wall-to-wall tie beams at top-of-wall height (above y2–4 circulation) and posts rising to stepped roof cells. This fixes an earlier structural sketch omission where sloped and terraced roofs visually spanned empty interior with no authored load-path members. Desert courtyard skylights are intentionally NOT crossed. These are symbolic voxel coordinates, not real partial-shape or live physics verification; the hand-authored M0 Temperate Small store is unchanged.

### Session 7 — structural support connectivity gate
New dedicated `structural-connectivity.test.mjs` validates that **every actual structural cell** (foundation/floor/wall/window/roof) can reach an authored ground-level foundation through face-sharing adjacency, across all 30 M1 candidate buildings. Fixes five previously floating roof/lantern sections: rear gable supports for Mountain stepped terraces and covered porch position for Desert temple lanterns, without blocking the open Desert courtyard. It does not represent certified game-world load physics, stair/roof slope or real renderer shape ABI.

### M1 Session 8: sealed stepped-roof envelope
Connectivity tests alone do not prove exterior enclosures are weather-tight: the 12 Mountain and Enchanted Forest representative shops/temples had 248 empty perimeter cells between top wall plates and roof terraces. The candidate geometry now fills those exposed side eaves with symbolic `wall` cells only, while separate Node tests enforce complete outer roof-edge closure and preservation of physical window cells, street door openings and intentionally uncovered Desert courtyards. All physical shape/air/water/collision claims remain conditional on future actual block integration.

### M1 Session 9: meaningful size-specific interior layouts
Medium shops and temples have separate side counting/meditation rooms behind actual 3-high walls with a traverseable lateral doorway. Large shops have fully divided rear loading bays; large temples have two side votive chapels with actual nave doors and altars. These 20 plans are now substantially differentiated from 10 smaller buildings beyond dimensions. Four dedicated Node tests check physical wall/door/fixture coordinates, entrance-to-extra-room pathfinding, explicit semantic room circulation, and intended symbolic stair landings. Gallery status is calculated from the real authored room count (2 small, 3 medium/large shops, 4 large temples), not a hardcoded '2'. Packed asset shapes, slope alignment, collision, rotation persistence and creator artwork approval remain unverified and out of scope for M1 production release.

### M1 Session 10: actual room isolation, not graph-only access
A negative floor-path test (closing the supposed door while leaving all other geometry unchanged) showed that 10 medium counting/meditation rooms and five large temples' side-chapel pairs were just three-high side screens with open ends. Modeled actual three-high end caps to make every auxiliary room accessible exclusively through a specific door; the previously registered five large-store loading bays were already correct. Real physical door positions now appear in `openings` (25 markers across 20 medium/large models), not only in descriptive `circulation` strings. Four medium temples also had a pew across their intended lateral doorway approach; relocated it without deleting chapel seating. Tests assert both doors-open reachability and doors-blocked isolation for all 25 doors, plus real three-high end wall voxels. Blueprint validation now rejects falsely declared blocked internal doors. Partial-shape slopes/rotations, real game collisions, schema-1 production persistence and creator artwork approval remain unresolved; the models are M1 candidates only.

### M1 Session 11: verified symbolic material role correctness
A physical candidate's roster name matters even before integration. Cross-checking manual Pack 1–5 candidate manifests exposed a false temple altar assignment to `pack3:075` (decorative stone relief) instead of the intended `pack5:093` (Altars & Pedestals). The 15 temple designs now reference the proper unmerged Pack5 symbolic family in each of their 30 relevant altar cells. This is NOT a production ABI confirmation. The original M0 hand-authored store also received five missing unresolved material references while retaining identical geometry. `schema.mjs` now validates that every actually placed symbolic voxel material and declared door symbol occurs in the blueprint's unresolved-dependency ledger. Dedicated native tests guard all verified fixture roles, real altar positions, and material-list coverage.

### M1 Session 12 — biome material symbols must match physical-role semantics
The Issue #117 official 130-block roster distinguishes attachment pieces (`biome130:044` woven branch lattices; `biome130:098` mountain cliff-anchor fittings) from genuine building supports. The original 12 Enchanted Forest and Mountain conceptual candidates used these attachment references across 4,958 full-coordinate wall/roof cells. Those structural trim references now point to verified **symbolic roster names** from Pack 2 #015 (timber beams) and Pack 1 #005 (polished masonry), respectively. These are still **candidate assets, not confirmed full-cell or load-bearing production shapes**. Two dedicated native Node regressions protect actual material-use and biome distinction. The Canvas2D gallery colors by `kind` rather than specific material, so stable previews do not verify eventual texture/mesher performance. No production game or persistent IDs changed.
