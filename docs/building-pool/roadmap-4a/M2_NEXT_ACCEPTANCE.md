# Builder 4A — Eight original civic/guild buildings (next M2 cohort)

## Architectural inventory and scope
The eight new complete 3D voxel-coordinate blueprints are:

- `r4:civic-hall:temperate:large:02` — five-wing temperate senate, petition tribunal, clerk annex and seal gallery
- `r4:civic-hall:desert:medium:03` — desert ordinance court, tax appeals, registry and eastern records
- `r4:civic-hall:enchanted-forest:large:02` — five-room forest elder council with witness pavilion, treaty archive and clerks wing
- `r4:civic-hall:mountain:small:02` — small fortified highland council with land-rights office and ridge hearing
- `r4:guildhall:temperate:small:02` — temperate joiners guild, western skill study, eastern workshop and rear ledgers
- `r4:guildhall:snow:small:01` — compact snow timber guild with repair benches, membership and west registration
- `r4:guildhall:desert:large:01` — large desert dyers exchange, escrow depot, work court and fiscal registers
- `r4:guildhall:enchanted-forest:small:01` — small forest woodworkers guild with weavers, glyph carving and leaf-ledger wing

Every design has independent explicitly authored building footprints/wings, exterior window sockets, open door and partition entries, supporting floors and ridge purlins, actual occupied fixture voxels, meaningful interior rooms and two-cell clear traversable paths. Exact new source Git blob: `1ee1790c4b4ec0bd56ceebd4f49e248c69284fca`. Structural preflight: **24,399 occupied voxels, 5,893 navigable coordinates, 35 rooms**; full **60/60** distinct D4 rotation/reflection/translation geometry fingerprints. Numeric production IDs and world placement remain forbidden.

**Draft counts:** 60/315 theoretical source-authored = 30 inherited unchanged from legacy PR #123 + 30 originally authored M2; 255 still unauthored. Categories: 30/75 civic halls, 15/60 guildhalls, 15/45 inherited castles/palaces, remaining three 0/45 each. Creator approved 0, live integrated 0. Main/shared saves/runtime, seven sibling PRs, five manual packs, separate biome130 and five automations unchanged.

## Required exact-head technical acceptance (not yet performed)
Native 4A tests compile actual sources and exercise full D4 geometry, unique IDs, deterministic serialization, roof and doorway support, room reachability, real external facade sockets and read-only physical catalog dependencies. New CDP gallery runs **48 genuinely drawn Chromium WebGL2 software views** (8 buildings × exterior/cutaway × 667×375, 844×390, 932×430) and pins the exact new source blob, PNG dimensions/hash, gl.finish, no context loss/GL errors, draw counts. The earlier **312/312** candidate diagnostic views must also remain preserved. Inspect contact sheets after CI and state evidence faithfully.

**Explicit open gates:** five-pack physical partial/multicell AABB and orientation, window transparency, roof joint support, actual live world height, schema-1 save compatibility, performance on a physical iPhone and creator premium-art approval. Candidate proxy screenshots do not certify these. PR stays draft, unmerged and undeployed.
