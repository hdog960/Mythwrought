# Snow S4 — original M7 grass-column preservation-veto attribution (isolated, 2026-11-22)

## Exact ownership and source refs

- Research base: `research/snow-s4-legacy-grass-topology-isolated-20261122` at `cd0807ff46ef51403101d98d3769bbeff06fd266`.
- New isolated branch: `research/snow-s4-original-grass-veto-attribution-isolated-20261122`, descended from the exact research base.
- Production `main`: protected at `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Protected OPEN DRAFT PR #358: `59e449be7e73b25f259c4c72855cfb638a056517`.
- No merges, deploys, edits to the protected draft, hourly automation, settlement work, or other developers' branches.

## Why grass islands can survive in snow

The actual original M7 `FourRegionWorld._columnPlan` delegates to `planEnvironmentalColumn` in `src/manual-biomes/environment-v7.mjs` (original Git blob `d7b93c0a687afe7bbb8cf169c0b318fd1dc593af`). Its source preservation guard scans every column from `oldTop-2` to `WORLD_MAX_Y=19` and **returns an empty plan** if any block above the old top is not AIR or any block at/below it is not one of GRASS, DIRT, STONE. This protects existing landmarks, historical groves and caves. Even if that guard passes, a very low biome blend without a shoulder can still intentionally leave the column unchanged. Thus green terrain within snow cannot safely be mass-painted without classifying original provenance.

The actual original `src/voxel.mjs` registry assigns `AIR=0`, `GRASS=1`, `DIRT=2`, `STONE=3`, `WOOD=4`, `CRYSTAL=5`, `LEAVES=7`. Original `FourRegionWorld._environmentBaseline` selectively masks old WOOD and LEAVES, never automatically all landmarks. The new guard attribution uses **4 and 7** for old-tree masking, not crystal ID 5.

## Source-only implementation

- `src/manual-biomes/snowy-s4-grass-source-attribution.mjs` reuses the prior bounded, read-only `surveySnowS4LegacyGrassIslands`; it does not create a terrain generator, alter save data, or paint any voxel.
- For up to 128 observed retained-grass columns, inspect the original `_environmentBaseline`, supplied `VoxelWorld.prototype.naturalAndLandmarkBlock` read callback, cave overrides and edited-cell presence over the exact original preservation-guard Y envelope.
- Record **only the first source guard veto** in source order, distinguishing unsuppressed original WOOD/LEAVES from other elevated solids and invalid original subsurface. Also count masked legacy foliage, cave overrides and edit intersections. If no veto is found, say `no-original-preservation-guard-veto-observed` instead of claiming a safe-to-replace column.
- Save and sampled cave witnesses plus an after-scan repeat check of baseline/legacy values refuse mutated original data. The diagnosis is strictly read-only; no source API updates, no world sets, no meshes and no M7 activation.
- `tests/snowy-s3-s5-real-m7-gate.test.mjs` gained a small, additive original-world assertion for the already selected two seeds (179 and 2026) and original 36-column S4 rectangle. This test is **authored, not executed** because the direct container cannot resolve GitHub for a complete repository checkout.

## Verified focused evidence

Local `node v22.16.0`, synthetic original-source-contract fixtures: `node --test tests/snowy-s4-grass-source-attribution.test.mjs`: **12/12 PASS**. Tests include preservation of old WOOD/LEAVES, masked old foliage, elevated original rocks and CRYSTAL=5, cave AIR below the original top, ignored saved edits, negative 16x16 chunk coordinates, mutation detection, invalid ID fail-closed, empty snow sample and max 128-column envelope. Worst permitted synthetic baseline sampling is bounded at 128×20×2. No broad GitHub Actions CI was started. The source and test file GitHub blob hashes were independently verified byte-for-byte against the tested local Node files.

Prior 6/6 original S4 topology fixture tests are inherited from the base and not falsely reported as new executions. No authentic original full M7 `FourRegionWorld`/cave/physics scene acceptance, WebGL2, iPhone, Home Screen PWA or visual snow parity has been proven by this new branch.

## Next steps

1. In a complete original source checkout, run the existing focused `node --test tests/snowy-s3-s5-real-m7-gate.test.mjs` once at this exact branch HEAD. Its authentic `legacyNatural` delegate uses `VoxelWorld.prototype.naturalAndLandmarkBlock.call(world,x,y,z)`. Reuse verified exact-commit results, do not launch duplicate broad CI.
2. Classify genuine snow-area legacy grass in authentic seed regions. Only after strict cave, landmark, edited-surface, old-tree and seam acceptance should any versioned new-world terrain change be proposed.
3. Natural snow cap and biome transitions should be visually graded instead of turning glacier snow or rock into per-cell checkerboard. Preserve original save/physics and iPhone frame-time budgets. Request explicit creator authorization before merging, deploying, or enabling a generator change.

**Status: research/source evidence, NOT a production snowy biome fix.**
