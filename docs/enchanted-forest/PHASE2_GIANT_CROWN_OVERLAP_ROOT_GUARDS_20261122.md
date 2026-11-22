# MYTHWROUGHT — Enchanted Forest Phase 2: Giant Grounding + Crown Collision Hardening

**Isolated source-only engineering checkpoint (November 22, 2026).** Development branch `research/enchanted-p2-physical-root-safety-20261121`, based on protected parent `db8cad02387050579c75cbdcdea3e94a9f6d6bee`. At session start, protected parent and production main verified unchanged (main `7016e14cd6289f45eaf7fc6a79a362b47996df65`). No merges, deployments, cancellations, user-world migrations, automations or other owner changes.

## Actual new code

1. **Four-root geometry and material validation:** `enchantedTreeFootingsSupported` now requires the canonical unique Ancient Giant 2×2 offsets `[[0,0],[1,0],[0,1],[1,1]]` without duplicate/missing corners. All four original source M7 cap entries must be integer block IDs matching the real world reader; underlying subsoil must also be an integer real block, never AIR/undefined/NaN. The existing real-world cave void, landmark obstruction, and headroom checks remain fail closed. Every root is checked across normal chunk boundaries, so a fake/missing fourth footing cannot bypass a cave.
2. **Deterministic candidate crown conflict ownership:** New `src/manual-biomes/enchanted-tree-overlap.mjs` defines order-independent ownership among overlapping **experimental** enchanted voxels: actual bark (408) outranks moonleaf (410), which outranks aether leaf (409). This prevents foliage from later source tree sites overwriting the structural bark of another candidate. Both valid tree-site iteration orders yield identical material at a shared voxel. Original non-enchanted tree materials retain the historical order.
3. **Original-gen exact path preserved:** `src/manual-biomes/environment-v7.mjs` uses the conflict helper **only** when `experimentalEnchantedTrees` is opted in and the cell is already occupied. It does not run the rank function for unique cells, avoiding unnecessary per-voxel work under iPhone budgets. Default M7/other-biome paths still write the same authored materials using their original site, density roll, and primitive cell IDs. Nothing changes `src/main.mjs`, WORLD_MAX_Y=19, cave generation or source save/profile identity.
4. **Historical world safety:** The experimental tree profile remains disabled by default; attempted persistence of opted-in historical M7 tree baseline still fails closed pending separate reviewed versioned migration.

## Native test execution and evidence

**10/10 focused Node native unit tests PASS locally**, syntax checks for both pure source helpers PASS. Tested exact byte-identical GitHub source and test files (verified `git hash-object` of local files equals GitHub Git blob):
- `src/manual-biomes/enchanted-tree-footings.mjs`: `bbfc071d853281159c8945ce6d6b901675dedbdb`
- `src/manual-biomes/enchanted-tree-overlap.mjs`: `c1e675777d57b52508b13322cc07e4976f2f92c2`
- `tests/manual-biomes/enchanted-tree-footings.test.mjs`: `b623795e5ddd56913dd4c7a0fd71731f2a82f704`
- `tests/manual-biomes/enchanted-tree-overlap.test.mjs`: `1d7ecfe618048966bbbe83a30688dfc45b68f499`
- Root tests include real-geometry 16-block seam, all four cave/subsoil corners, ground cap mismatches, protected landmarks, invalid/duplicate 2×2 offsets, missing/NaN and non-integer readings.
- Overlap tests include both bark/leaf iteration orders, moonleaf/aetherleaf ordering, all 27 three-cell permutations, and explicit no-alteration for unrelated/material collision values.

These are **native tests of the exact source helpers and associated unit tests** using an isolated local environment with byte-identical `src/environment-ground.mjs`. They are **not** a claim that the complete Mythwrought game or the committed real M7 integration tests ran in this local environment.

## Previous exact-source evidence legitimately reused

- The completed 34/34 native feasibility suite: [GitHub run 44965659979](https://github.com/hdog960/Mythwrought/actions/runs/44965659979), prior original Phase 2 source. Previous 3-seed distribution 12 Ancient Giant / 85 Starspire / 77 Moonwillow eligible sites; prior six-chunk GPU mesh aggregate +4.9% / 8 MiB per chunk. **Not a pass claim for these modified files.**
- Historical, unaffected Phase 1 original-game / cave material evidence remains valid for its unchanged code.
- Completed earlier instrumented original-game tree renders [#44972193017](https://github.com/hdog960/Mythwrought/actions/runs/44972193017) and camera-corrected Giant [#44980183092](https://github.com/hdog960/Mythwrought/actions/runs/44980183092) are reusable as **visual baselines for the older candidate code only**. New opt-in candidate conflict and root support changes may affect exact current visuals.

## Explicitly avoided / outstanding

- Avoided all duplicate broad native suites, twelve-screenshot Chromium jobs, unrelated owner CI, repeated queue inspections or shared infrastructure changes. **No GitHub Actions run was launched by this isolated child-branch work.** Runner congestion does not block pure local development.
- **Outstanding:** execute `tests/manual-biomes/enchanted-tree-footings-real-m7.test.mjs` against the **current exact child-branch** native original-game modules, plus `tests/manual-biomes/enchanted-trees-phase2.test.mjs` if the new tree placement materially alters test expectations; measure actual Ancient Giant census after root hardening. Analyze overlapping candidate crowns with genuine original `FourRegionWorld` and source reader across chunk seams; no release claim before that check.
- At visual milestone, compare representative changed Giant/crown scenes in original-engine WebGL2 at affected phone viewport; do not repeat unchanged Starspire/Moonwillow screenshots unnecessarily. Physical iPhone installed Home Screen PWA performance/p95 and separately approved versioned-save/generator release gates remain pending.

**Engineering result is provisional source development, not accepted production code.**
