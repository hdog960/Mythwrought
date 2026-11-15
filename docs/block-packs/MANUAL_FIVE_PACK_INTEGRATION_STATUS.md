# Manual Block Packs 1–5 — coordinated integration checkpoint (2026-11-15)

**Status: IN PROGRESS / NOT INTEGRATION-READY.** This is an engineering checkpoint, not a release approval.

## Source-exact intake
- Base: main at `6ba2a85e7985da50a0f627af255e5112e43b3635` (Incorporation 013).
- Draft combined PR: #174; source-intake commit `836015eb212e78c3a0400e7a8ae830aa8950a30f`.
- 178 previously absent files imported with original Git blob SHAs from Pack 1 #113, Pack 2 #146, Pack 3 #153, Pack 4 #115, Pack 5 #148. No original source PRs merged or changed by the initial intake.
- Existing Pack 3 and Pack 5 producer asset files from previously merged source PRs were not duplicated.
- Added `src/builder-assets/manual-five-pack.mjs` and `tests/manual-five-pack-builder.test.mjs`: 96 symbolic roster families, 106 distinct numeric variants, exact physical source resolvers, fail-closed family ambiguity, multi-cell and source pack dry-run checks.
- Builder mapping: Pack 1 IDs 9–38 (30), Pack 2 IDs 59–76 (18), Pack 3 IDs 109–125 (17), Pack 4 IDs 159–181 (23), Pack 5 *proposed* IDs 209–226 (18). These are not all registered in the actual game; Pack 5 source manifest retains symbolic-only status.
- The shared production files `src/main.mjs`, `src/blocks.mjs`, `src/voxel.mjs`, `src/depth-mesh.mjs`, `index.html` were **not** overwritten by source intake. Shared-engine reconciliation is still essential.

## Authentic latest verification
GitHub Actions #43744421065 and #43744421124 against combined draft: **710 Node test cases, 704 pass, 6 fail**. The new combined manual five-pack builder catalog's physically authored 106-asset resolver test was observed **PASS**, but the *full* CI has not passed.

Failures are integration defects or unintegrated feature expectations, not evidence that existing main has these defects:
1. Two legacy basic-building assertions fail because Pack 2 runtime registration/behavior is not yet reconciled with the existing public interaction API.
2. Two Pack 3 integration tests fail (one stale 60 vs 70 biome130 count assumption and one passability with the Pack 3 physical collision runtime not wired into the combined world).
3. Two Pack 5 live-game tests fail (opt-in physical furnishing collision and explicit builder mode not yet hooked into shared main/voxel/index).

Focused exact-head Actions #43744421069 Pack 3 and #43744421173 Pack 5 both failed at the native preflight; Chromium/WebGL2 stages were skipped. Pack 2 outdated 60-biome count assumption was corrected separately on this branch at `046849664499eb416230a018d20e9f3e3565ea6a`; do not assume that correction clears any other gate.

## Before merge/deployment
1. Reconcile Pack 2, Pack 3 and Pack 5 runtime changes into **one coherent** shared engine without replacing latest main's automated biome130 registry, blocks, game saves, two-thumb controls or deep-world streaming.
2. Integrate Pack 1 and Pack 4 actual physical appearance/selection/collision and persist rotation, mounted supports and variants without corrupting existing schema-1 worlds.
3. Make all 106 variants available for builder-generated structures through physical symbol resolution and live place/remove/save/restore. Preserve Pack 2 fluid passability and Pack 3 overlay behavior; Pack 5 multi-cell furnishing atomicity and support constraints.
4. Prove mixed five-pack placement, 512+ structural/furnishing density, multi-cell collision/support, readback/rollback/backup, authored geometry in genuine WebGL2, deep-world performance and mobile landscape controls.
5. Run exact-head full-game, depth and each pack's acceptance workflows to success. Physical-iPhone performance, creator artwork approval and Gate A are separate checks, not silently assumed.

## Ownership restriction
**Do not edit** `src/biome130-registry.mjs`, any `src/auto-block-catalog/biome130/**`, the automation-owned 130-family roadmap/manifests, or five automation definitions/branches. The biome130 70 currently registered IDs 256–325 remain entirely separate and live. No changes to eight theoretical building roadmaps. No v0.11 unlock.

**Do not merge PR #174 or deploy from it until the above checks are actually green.**
