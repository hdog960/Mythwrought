# MYTHWROUGHT — Clean Desert Phase 3 MAIN Release Integration

**User request:** finish Desert Phase 3 and update the playable game after safe release checks. The creator's November 23 instruction authorizes pursuing eventual game update; avoid imposing additional research approvals, but do not fabricate physical iPhone acceptance or override another developer's protected work.

## Exact lineage and minimal file composition
- Prepared separate **release candidate** `release/desert-p3-clean-main-integration-20261123` **directly from current protected `main` SHA `7016e14cd6289f45eaf7fc6a79a362b47996df65`**, rather than merging the 78-commit research history.
- Earlier independently verified accepted Desert original gameplay `2bd0395d3ef163e9fdc491ab5119b1ee80844194` is **24 Desert-specific commits ahead of main**. Carry only its exact accepted `src/manual-biomes/environment-v7.mjs`, `src/manual-biomes/profile-world.mjs`, `nonblock-stage-assets.json` blobs; the original repo's `src/main.mjs`, `src/voxel.mjs`, shader and other source were otherwise unchanged between accepted and protected main.
- Exact optimized bilateral original source blobs are copied from isolated verified research `3e5bcefdf1492ad334c1ed51cec5f3b32ccfcddf` and its identical clean source ancestors:
  - `src/voxel.mjs`: `a475ba9c195e6dd4bc5a97284dbff5f2c37936a4`
  - `src/main.mjs`: `3768eb68bc2951dd7e6f41490720a9b4c6616a87`
  - `src/manual-biomes/desert-seam-vertex-tint.mjs`: `023bc3bad89cc524c68d675b3ed8e724d3f3fed8`
  - `src/manual-biomes/desert-bilateral-rgb.mjs`: `5605d19064c216736d69e4422481637989110718`
  - `src/manual-biomes/desert-seam-invalidation.mjs`: `5c40d34eadf683613f6746e456e885087d168627`
  - accepted `src/manual-biomes/environment-v7.mjs`: `7fa5be721d8597baa22df8c45fb9b10536a7c155`
  - accepted `src/manual-biomes/profile-world.mjs`: `ffad7e10c07e9252bfaaf8381962443ce658abff`
  - accepted `nonblock-stage-assets.json`: `3eba34080353818b60232a10bd416edd4b96e990`
- Rejected tag40 shader file `src/manual-biomes/desert-seam-shader.mjs` is **absent**. Original global fragment shader and GL uploader, modern editor and saves, other Snow/Mountain/Enchanted/cave generators untouched. No need to carry old phase-specific branch CI workflow history.
- Added four **exact accepted native regression test files** for Desert grass shoulder, Plains feather edge, V7 triple junction and original tree exclusion, plus one new original-source release-composition test. Only one isolated workflow `.github/workflows/desert-p3-main-release-gate.yml`, with source SHA fence and narrow original Node22 tests. No unrelated branch, developer or automation is touched.

## New authentic release source evidence
- Focused [Actions #45181706199](https://github.com/hdog960/Mythwrought/actions/runs/45181706199) **SUCCESS, 17/17** original source native tests. Exact-source / own-file diff / rejected shader absence checks passed.
- The release-composition test ran the genuine accepted M7 original `meshChunk` and the clean candidate `meshChunk` on five real loaded chunks at seed179 and five at seed2026. The candidate changed color on **715 source vertices** (seed179) and **718** (seed2026), but **every XYZ, UV and material field stayed byte-for-byte identical**, across **21,810 original vertices** in those two junction neighborhoods.
- Five genuine Snow, Enchanted, Plains, far Mountain and cave-entrance source chunks (**16,926 vertices**) remained **all nine Float32 channels byte-identical** to accepted original gameplay. Old natural world save rows stayed empty.
- Real original source edited scree401 at seed179 (-786,4,-1774) changes **six RGB vertices** of adjacent chunk (-50,-112), a previously unrefreshed chunk under legacy geometry-only editing; the new bounded circular visual invalidation includes it without changing geometry or saved edits. Original cave AIR at (40,9,63) retains its empty protected source plan and original refresh.
- Accepted original source tests independently passed preserving grass-free Desert shoulder, Plains greenery, Snow/Enchanted/Mountain material priority, user edits, legacy M6, protected caves and legacy tree suppression. This release branch stages precisely the previously verified source bytes, not a new experimental algorithm.
- Inherited **genuine** original Chromium WebGL2 Actions #45089215300 SUCCESS source-byte-identical original-game WebGL2 edit and rollback with 25 loaded chunks; real composed Pack2 water/Pack3/Manual14 original function-body recovery Actions #45109430297 SUCCESS 3/3. Additional original accepted-vs-Desert background chunks #45114062710 bit-exact for **1,332,720 bytes** over 37,020 vertices, and original oases #45170085516 verified ID76 water source ownership, canonical save restore. Those suites are not redundantly rerun.

## Required release gate and deployment status
- This integration PR must pass relevant GitHub native required checks / branch rules and must not conflict with any protected `main` head changes. Verify `main` exact expected SHA again before merge.
- **Physical iPhone installed Home Screen PWA performance is NOT verified.** This branch does not provide device-side p95, heat, true GPU OOM, offline cache/sync or user visual acceptance. Do not claim those metrics. Creator wants playable update and can test actual installed shortcut after an authorized release, but clearly disclose residual risk and do not silently manipulate user worlds or service worker/cache scope.
- A production merge or publication must be checked with GitHub job result and live site build/content identity; do not conflate GitHub PR merge with a verified iPhone Home Screen shortcut update. If required checks fail, main drifts, or any protected developer work conflicts, **do not force merge**.
- Release-ready check list: exact main sha; controlled file diff; protected source SHA/own-lane; 17/17 native integration and required PR CI; no unsanctioned branch file; live public Pages source revision if published; original iPhone Home Screen shortcut tested *by the actual device user* before announcing full device acceptance.

## Status
**Clean release candidate staged; not yet merged/deployed at checkpoint writing.** Earlier independent research branches and protected original gameplay remain intact.
