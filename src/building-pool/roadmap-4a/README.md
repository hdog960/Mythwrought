# Mythwrought — Builder 4A M0 (Government & State Knowledge)

**Draft theoretical building lane only.** Source base `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db` (merged infrastructure PR #178). Legacy PR #123 at `564330635f18e10215a3bf93901923fbf5af528d` is **read-only**, draft and unmerged.

This isolated lane has **315** proposed fully authored voxel-coordinate designs across six exclusive categories, five biomes and three sizes. The original **30 coordinate-authored candidates** (15 civic halls, 15 castle-palaces) are source-exactly inherited. **285 still to author**, **0 creator accepted**, **0 deployed**.

## M0 preservation strategy
- `m1-blueprints.mjs` is a byte-identical copy of `src/building-pool/roadmap-4/m1-blueprints.mjs` from exact PR #123 head; Git blob SHA `14ecb6fcfbe5cfeea97976670d14afb93bc6fe45`. This preserves the latest lightweight braced roof, windows, stairs, landings, routes, structural details and all source profile tuples.
- `schema.mjs` retains original `r4:` identity and versioned wire schema to avoid silent mutations; only the five 4B-owned category records are **removed from 4A's local validation program** and the target is 315. No changes to original files.
- `provenance.json` maps each original stable ID, new owned module, original Git source blob and exact legacy plan profile. Native `m0.test.mjs` checks original content hash and generated candidate identity/geometry.
- Category quotas are in `manifest.json`, not inferred from original 600-design scope. The original 30 are counted ONCE, not again as new designs.

## Important asset-status distinctions
All five **manual** block packs have been integrated through PR #174; `src/builder-assets/manual-five-pack.mjs` exposes **96 family symbols/106 physical numeric variants**, but its own catalog explicitly says `productionRegistered:false` and is not a world-writing API. The inherited M1 generator's `candidate` text is preserved historical metadata; **it must not be interpreted as meaning the manual packs are still unmerged.** Before physical integration, map each `packN:NNN` ref through source-exact `resolveManualFivePackAsset` with variant/orientation/state/support/AABB. Biome130 remains an independently managed source and unverified refs stay symbolic. Never invent IDs or erase unresolved mounting/collision/height/save constraints.

## Owned source / test / docs only
`src/building-pool/roadmap-4a/`, `tests/building-pool/roadmap-4a/`, `docs/building-pool/roadmap-4a/`. No shared gameplay, CI, engine, block packs, automation lanes, saves, original Roadmap 4 source, other seven builder lanes, merging or Pages edits.

## Verification
Run `node --test tests/building-pool/roadmap-4a/*.test.mjs` on exact committed head, and inspect its PR Actions focused CI plus mobile landscape Chromium smoke. This M0 handoff **does not claim** independent inherited WebGL2 gallery reproduction, hardware-iPhone testing, creator visual approval, or production readiness. M1 will inspect material ABI and produce new source-exact visual evidence.


## M2 civic works addendum (2026-11-16)
Eight isolated original geometry plans introduced in `m2-civic-works.mjs`; see `docs/building-pool/roadmap-4a/M2_CIVIC_WORKS_ACCEPTANCE.md`. These raise the authored candidate count from 92 to **100** (70 new M2, 30 source-exact inherited); **215** remain. All world and creator gates remain closed. The original M0 counts above document the initial handoff, not today's tranche.


## M2 public works addendum (2026-11-16)
Eight new original coordinate designs in `m2-public-works.mjs` raise totals to **108/315** (30 inherited, 78 new, 207 remaining). See `docs/building-pool/roadmap-4a/M2_PUBLIC_WORKS_ACCEPTANCE.md`. All historical M0 counts above are a frozen handoff snapshot. No world placement or creator acceptance.


## M2 Guild & Civic tranche (2026-11-16)
Eight more coordinate-authored candidate designs in `m2-guild-civic.mjs` bring the catalog to **116/315** theoretical (30 inherited, 86 newly authored), 199 remaining. Four civic halls and four guildhalls, each distinct by biome/size profile with natural roof mass and connected internal routes. See `docs/building-pool/roadmap-4a/M2_GUILD_CIVIC_ACCEPTANCE.md`. The earlier M0 and M2 counts above are historical checkpoints, not current totals. No live integration, developer asset registration or creator acceptance.
