# Builder 3A — M0 preservation and M1 diagnostic preview handoff

**Status: 15/15 legacy blacksmith designs selectively migrated into 3A-owned source.** M0 final CI at the new commit must be checked independently. **Not merged, deployed, creator-approved, or in the live game.**

## Exact original source and identity
- Current audited main: `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`, integration checkpoint 009, infra PR #178 merged; its candidate CI #43762245025 succeeded.
- Original PR #122 stays draft/unmerged, source head `e35b8eca644f6de06e76ab946103ce64a6b7fb91`. Imported original blacksmith build function byte-for-byte except local import path rewrites, excluding the entire watchtower generator.
- Original `m1.mjs` source Git blob `189ac4deb11042534743045b5087a7a7525e3bf1`, assets `a61597a9c5209edd1c78fe10567711107f9a0b5a`, validator `d87c47896f53e6ae7e7efd0b7503236607669caf`, manifest `deab2505c5be9ad752ab9f01c0f6cc776b19fc66`.
- Same 15 immutable IDs `r3:blacksmith:<biome>:<size>:1`, all 5 biomes and 3 sizes. No new IDs allocated to the 15; non-legacy slots use `r3a`.
- `legacy-blacksmiths.mjs` contains the source-exact original blacksmith construction and isolated 3A exported adapter. `legacy-assets.mjs` and `legacy-validation.mjs` are exact old source inputs. `LEGACY_BLACKSMITHS.json` is the provenance and migration manifest; `LEGACY_M1_SOURCE_MANIFEST.json` carries the 15 source-only original expected records.

## Native evidence and exact-head gate
- Initial after-import PR #183 head `650c11ef2d872f10d4a61345fb5c14a84045af13` Actions [#43768474174](https://github.com/hdog960/Mythwrought/actions/runs/43768474174) completed **FAILURE**: **735/735 root Node tests PASS** and the two NEW native migration tests PASS, including all 15 byte-exact original-vs-migrated full-object and independent geometry-fingerprint comparisons; one obsolete M0 assertion still expected `geometryCopied:false` and failed. No browser acceptance from that failed run.
- This correction updates the stale assertion, preserves true `geometryCopied` and source-proven `fingerprintVerified`, and adds a 15-row SHA-256 original/migrated geometry and canonical design record written to `artifacts/building-roadmap-3a-m0/source-exact-parity.json` during nested native CI. **Check the NEXT exact-head run before declaring whole CI green.**
- New isolated M1 diagnostic source: blacksmith-only WebGL2 preview and 90-view optional Playwright browser runner (15 designs × exterior/cutaway × 3 viewport sizes). Existing source-parity tests and new preview mesh/camera native tests should run automatically with isolated CI. **The optional Playwright runner is NOT included in root CI and has NOT been executed here**; no candidate Chromium/WebGL2 captures, hardware iPhone screenshots, or physical-family render approval are claimed.
- Preview envelopes are synthetic *unit cubes at actual source-authored voxel coordinates*; their genuine WebGL2 screenshots, if later captured, would NOT prove final manual Pack block shapes, oriented collision, support, or player-access performance.

## Next M1 work
1. Verify new exact-head isolated CI fully green, including emitted 15 SHA-256 evidence artifact.
2. Execute the optional real Chromium blacksmith-only browser runner on source-authentic `preview.html` at 667×375, 844×390, 932×430; inspect exterior/cutaway and fix only 3A defects. Do not equate root production browser smoke with candidate visual review.
3. Resolve actual integrated 96-family/106-variant manual builder ABI per exact symbol, orientation, variant, occupancy and support. Inherited planned-asset metadata is preserved only for parity and **not** authoritative physical shape certification. Unverified biome130 entries remain symbolic dependencies.
4. Author representative new armorer, carpenter, stonemason and mining-workshop designs in the 3A subtree, with genuinely distinct coordinate geometry and real routes. Total target 345, 15 original authors, 330 new still required.
5. Central integrator alone owns eventual mixed settlements, schema-1 save/write approval and deployment. Preserve Gate A v0.10 OPEN, v0.11 LOCKED.

## Boundary evidence
Seven sibling PRs #179, #180, #181, #182, #184, #185 and #187 were inspected for file ownership and all had **zero** 3A path overlaps. Original PRs #121–124 remain read-only. No modification to any shared engine, gameplay, automations, saves, other builder, original roadmap, workflow, checkpoint, main or Pages deployment.
