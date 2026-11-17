# Builder 4A M2 — Eight region-specific skyline architectures

This cohort adds 8 independently coordinate-authored theoretical 3D structures (4 civic halls, 4 guildhalls), using new `m2-silhouettes.mjs` source Git blob `ee4886e188b0139704dde1ee339ad9c4f61c9a7b`. Distinct small/medium/large footprints contain 24,607 occupied cells, 5,565 conceptual navigation locations, 34 actual functional rooms, 6 windows per building, supported porches and raised roof lanterns at height 8–9. Two/three roof lanterns per plan use separately authored rectangles, base beams, tiered piers and top purlins; there is no access route to these roof lanterns and **no second occupied story**. Source-only structural preflight verified all 68 whole-volume geometries unique under D4 rotations/reflections/translations and source 3D occupancy, door/headroom/roof support.

- `r4:civic-hall:temperate:small:03` — temperate borough council with a belfry and north seal cupola
- `r4:civic-hall:desert:large:02` — desert senate with triple-height sunshade lanterns and east tax offices
- `r4:civic-hall:snow:small:03` — snow public hearing with secondary ice watch roof
- `r4:civic-hall:mountain:medium:03` — mountain survey council with high cartography lantern
- `r4:guildhall:desert:small:02` — desert caravan dyers guild with two offset sunshade roofs
- `r4:guildhall:snow:large:01` — snow large carpentry guild with three sawtooth-tier roof lanterns
- `r4:guildhall:enchanted-forest:medium:02` — forest guild with unequal canopy cups over makers and archives
- `r4:guildhall:mountain:small:02` — mountain quarry guild with cliff-side stonecutter/watch cupolas

Candidate totals: **68/315 authored** (30 unchanged legacy originals and 38 original M2), **247 unauthored**, civic 34/75, guild 19/60, castle 15/45; 0 creator-approved and 0 game-integrated. Actual native + Chromium exact-head CI and 48 new WebGL2 screenshots are **pending**. The source-linked 48-view gallery must check the source Git blob, eight IDs, both cuts at 667×375, 844×390, and 932×430, gl.finish / no GL errors/lost context, draw calls, screenshots and hashes. Previous 360 views unchanged.

**Explicit blockers:** partial candidate shape and full-cell proxy visualization is not source-real final Pack1–5 physical-family rendering. Real roof joints, oriented AABBs, multisolid supports, transparency and durable saved orientation, live world-height and actual iPhone performance, creator art and placement approval all remain open. Only 4A source/tests/docs changed; all other builder lanes, five packs, biome130, automations, saves, runtime, Gate A and locked v0.11 untouched; draft PR unmerged and undeployed.
