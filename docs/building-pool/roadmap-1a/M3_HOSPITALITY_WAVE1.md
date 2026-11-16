# Builder 1A M3 — Hospitality Wave 1: Ten taverns and ten inns

**Scope:** [Mythwrought draft PR #180](https://github.com/hdog960/Mythwrought/pull/180); Builder 1A-owned sources, tests and docs only. Source base main `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`, checkpoint 009. Current main has advanced by a separate automation/intake commit `bd35f1d9f64780a92d99cc9c59aad7aad1806fc2`, which does not overlap 1A-owned paths. All other building lanes, manual Block Packs, biome130, game runtime, save schema1, automations, v0.10 Gate A and v0.11 lock are preserved.

## New full-coordinate original architecture

Twenty individually original candidate sources are authored as **complete literal integer source coordinate tables** in `src/building-pool/roadmap-1a/m3-hospitality-wave1.mjs`. Each specifies genuine absent exterior foundation/wall/roof columns, authored partition endpoints, separate rooms and explicit portal edges, functional kitchen/storage/seating/guest spaces, multiple physically backed and asymmetrically raised roof wings, exact Pack1–5 symbolic source dependencies and producer `visibleBoxes` AABB evidence. These are not recolored cubes, runtime templates, mirrored footprints, cosmetic rotations or final production art.

| Region | Taverns | Inns |
|---|---|---|
| Temperate | Briarbridge Hearth & Cider Tavern (small), Mistford Canalside Ale Hall (medium) | Rillgate Pilgrims Rest (small), Willowbrook Grand Lodging Court (large) |
| Desert | Copper Dune Shaded Tea House (small), Sunhammer Caravan Brewers Hall (large) | Amber Oasis Caravanserai (medium), Solhaven Merchant Caravan Inn (large) |
| Snow | Frostpine Winterfire Public House (medium), Whitecairn Glacier Festival Hall (large) | Snowdrop Hearthstone Inn (small), Frostwick Sledders Lodge (medium) |
| Enchanted Forest | Firefly Fernwood Gathering Hut (small), Moonwillow Storysong Tavern (medium) | Starlace Nightbloom Guesthouse (medium), Lunawood Starlight Inn (large) |
| Mountain | Stoneforge Pass Alehouse (medium), Ironbell Summit Feast Hall (large) | Peakstone Wayfarers Cabin Inn (small), Highcairn Skybridge Lodging Hall (large) |

**Actual authored placements:** **144,733** 3D source cells, **10,849** physically nonexistent exterior footprint columns (all heights absent), **105** distinct functional/walkable rooms and **43** reserved Pack5:082 two-cell beds. Taverns contain separate public tavern seating/taproom, cooking/service, stock/gallery and staff-sleeping rooms; inns include check-in/reception, shared halls, accessible multi-guest lodging and linen/gallery circulation. Bed reservations are genuine two-cell producer physical footprints and not visual proxy furniture.

Original U/L/T and multi-recess outlines were compared to the full prior 171 objects and to each other on **normalized 16×16 partition masks (strict IoU below 0.88)** and **normalized real physical exterior silhouettes (strict IoU below 0.975)**; several first drafts were rejected and substantially redesigned, rather than loosening duplicate criteria. Additional D4 full 3D mirror and all-four-rotation uniqueness is a mandatory native test gate.

## Inventory and independent source preservation

- Builder 1A has **191 of 450** completely authored 3D candidate objects, **150 houses**, **27 taverns**, **14 inns**. The previously completed 150-house source M2 milestone is preserved without change.
- The original 171 source blueprints are fully protected by `tests/building-pool/roadmap-1a/m3-hospitality-baseline171.json` and dedicated complete-object JSON length/FNV regression tests. This includes all earlier 149 source fixture records plus the 22 final-house-wave source records.
- Remaining 1A design quota: **259**, specifically **150 houses, 48 taverns and 61 inns**. There are still **0 creator-final-approved, 0 registered, 0 world-placed, 0 integrated** and **0 deployments** from this PR.
- No central world prefab or save schema has been altered; future structure assembly/integration is governed separately.

## Honest technical acceptance gates

The exact-head GitHub Actions workflow must verify:
1. **191/191** source schemas and IDs, no D4 duplicates, full 171-object source-conservation signatures, and strict normalized floor/silhouette uniqueness against every protected design and every new peer.
2. Physical 4-high notch-facing exterior walls, fully void exterior columns without any ghost foundations or roofs, supported multi-level/region roofs, real two-high passable door throats, accessible walkable rooms, valid fixture-room occupancy and fully clear Pack5 bed second cells.
3. Actual source Pack1–5 **96-family / 106-numeric-variant** producer `visibleBoxes`, AABB occupancy/support and source symbolic dependency audit, explicitly not production certification.
4. **978 genuine Chromium software-WebGL2 source CELL-CUBE** exterior/cutaway captures (163 real source IDs × two views × 667×375, 844×390, 932×430) and **702 genuine Chromium software-WebGL2 Pack visibleBox-derived AABB** captures (117 source IDs × two views × same three sizes). Both are separate renderer/candidate diagnostic sets, not final textured in-game art or physical-iPhone tests.

**Unresolved production gates:** Pack2 door hinge/swing/rotation + schema1 codec, Pack3 load-bearing/weatherproof roofs, Pack4 pane optics/weather, Pack5 physical collision and saved bed occupancy, final creature/architecture art, physical iPhone control validation, creator approval and separate authorized integration. Keep this **DRAFT**, **unmerged**, **undeployed**, candidate-only; v0.11 remains locked.
