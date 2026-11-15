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

---

## Coordinated integration continuation — source and acceptance evidence, 2026-11-15
Previous unmerged intake remains protected. Source-only Pack 1/4 adapter and latest live gameplay
are now staged **on draft PR #174**; the older six combined-test failures and two newer
manual14 tests were corrected and a verified all-green baseline established at `556b0de`:
full game #43748238064, depth #43748238134, Pack3 #43748238066 and Pack5 #43748238083.

### Source-owned live runtime changes staged
- Pack1 30 numeric variants (IDs 9–38) and Pack4 23 (159–181) use distinct
  seed-bound `createManual14SavedBridge` storage; neither uses schema-1 voxel IDs.
- `src/builder-assets/manual14-mesh.mjs` assembles source-authored partial geometry
  into the existing nine-float WebGL2 terrain buffer; Pack1 original 24-pixel face
  textures are color-sampled at bounded 4×4 subtriangle resolution (NOT a claim of
  full-resolution sprite parity), and Pack4 authored alpha/opaque parts enter the
  original source-alpha blend and opaque passes with an added vertex cap.
- Live UI selection lives in the existing scrollable settings, not the iPhone thumb
  rails. Live MINE/PLACE, collision/target rays, deep-section streaming, backup and
  independent save restores use actual physical overlays.
- `src/builder-assets/manual-five-pack-live.mjs` exposes the single future
  Builder AI **per-asset live placement** contract for all five source owners.
  `placeManual14Batch` is atomic for Packs 1/4; **cross-owner atomic building
  batches are NOT available**, even though `dryRun` resolves all five catalogs.
- Host-side explicit occupancy blocks Pack3/Pack5 from placing onto Pack1/4 cells.
  Support requirements fail closed rather than silently inventing wall/floor backing.
- Never touch automation-owned biome130 catalogs, IDs, branches or tasks.

### Focused genuine browser evidence (not physical iPhone)
Pack1/4 dedicated browser run #43750377319 PASS, 11/11 focused native tests,
original-source 53 IDs × 4 rotations = 212 geometry acceptance combinations,
real app Builder AI placement of Pack1 ID 9 and Pack4 ID 159, 756 resident authored
mesh vertices, reload/readback, three landscape screenshots (956×440, 844×390,
667×375), separate thumb rails and zero browser exceptions.

### Exact-head release gate not claimed
A later unified facade, cross-pack collision and latest UI changes need full
exact-head full-game, depth, Pack3, Pack5 and Pack1/4 CI success. Check those
run IDs before claiming the **latest PR head** green. Physical iPhone, creator
art approval, cross-owner atomic settlement transactions, large settlement GPU
budget and actual release/deployment approval remain separate, open gates.

**PR #174 stays draft/unmerged/undeployed; v0.11 stays locked.**


## Mixed-pack performance / source-owned save validation (2026-11-15)
- Verified Pack 1/4 *unloaded* chunk GPU vertex preflight is enforced before save/import; rejects an oversized 128-object single section before altering the original schema-1 save, and accepts 512 appropriately distributed objects with readback/reload. Packed 53 variants continue to use original source geometry; no biome130 ownership changed.
- Pack 2's lower-level physical setter now checks Pack 1/4, Pack 3 and Pack 5 source-owned sidecars, so a caller bypassing the higher-level builder facade cannot directly overwrite an occupied physical cell.
- Added real five-owner 584-object native acceptance: 512 Pack 1/4 + 24 Pack 2 + 24 Pack 3 + 24 Pack 5 across independent save owners, including overlap rejection and exact reloading. This was included in successful depth native acceptance #43751998025; dedicated Pack 1/4 acceptance #43751997999 also passed. Neither constitutes a physical-iPhone performance measurement.
- Follow-up *real in-game* Chromium WebGL2 acceptance now exercises a 512-piece Pack 1/4 batch at 956×440, GPU-resident source meshes and reload. Do **not** claim this particular browser pass or latest-head acceptance until its own workflow is green.
- Combined builder API remains deliberately **per-asset** across all five owners; only Pack 1/4 same-sidecar batches are atomic. Cross-owner all-or-none settlement transactions and creator-owned hardware/art/release acceptance are outstanding. No merging or deployment.
