<!-- Historic first M2 housing wave handoff: 54/450 at commit 60509268, superseded in latest counts by M2_HOUSING_WAVE2.md. -->
# Builder 1A M2 — Fifteen genuine cross-biome house blueprints

**Scope:** Only Builder 1A owned source/test/docs in draft PR #180. Main and checkpoint 009 unchanged; legacy original PR #121 remains unmodified; seven sibling builders, five manual packs, independent biome130 and automations isolated. Gate A open, v0.11 locked; no merge, deploy, live build or creator-approved art.

## Exact progress
15 additional independently specified houses, exactly one each of Temperate/Desert/Snow/Enchanted Forest/Mountain × Small/Medium/Large, source module `m2-housing-tranche.mjs`. Each has literal whole-number 3D grid placement coordinates compiled from explicit cross-wing or linear room layout, room rectangles, partitions and portals, bed foot reservations, family symbols, regional roof mass and authored underlay. 32,859 additional voxel placement records, with 4 truly open sky courtyards (where indicated), zero random or placeholder catalog records. An exterior front porch route collision in Desert Large was identified during local source evaluation and repaired **before** the commit (posts [5,21] rather than [6,21] on the entrance axis).

Current pool **54/450**: 30 source-exact inherited + 24 new (1 earlier Inn, 8 earlier M2 candidates, 15 new houses). **33/300 houses, 17/75 taverns, 4/75 inns**; **396 remaining** (267 houses, 58 taverns, 71 inns). M2 domestic homes goal: 33/150. **0 creator approved, 0 live integrated**.

## Source-specific acceptance and limits
The new 1A native tests independently load all 54 originals for exact ID and D4 mirror/rotation uniqueness, real 2-high portal/headroom, full access from the entrance, true multiblock bed reservations, continuous foundation and per-roof-cell backing, open-air courtyard shafts and strict unresolved dependency ledgers. Physical family dry-run uses current main's exact `resolveManualFivePackAsset` adapter including Pack 3 roof yaw, Pack 4 panes, Pack 5 2-cell beds, Pack 2 doors and material symbol IDs.

This is physical **candidate** geometry, not approved world building, structural bearing, rain sealing or save-codec acceptance. Pack5:080 is source-confirmed full-cell fired-brick masonry with solid authored collision; its load-bearing integration, roof interface, construction support, and all glass/door sweeps still require explicit acceptance.

Chromium source cube WebGL2 visual test is expanded to **26 true source candidates × 2 views × 3 landscape sizes = 156** screenshot targets; no acceptance can be claimed until a new exact-head Actions run succeeds. The rendered cubes are **not** true Pack physical AABBs or live world art, nor physical iPhone captures.

Original 30-source objects and previous first Inn remain unchanged. No new schemas, runtime, sibling or centralized integrations.
