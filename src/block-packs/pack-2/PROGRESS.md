# Pack 2 — isolated candidate progress ledger

**Status:** candidate-only, unmerged, not deployed, not installed in the playable palette.
**Pack authority:** [Issue #109](https://github.com/hdog960/Mythwrought/issues/109).
**Verification base:** main `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`.
**Newest incorporation at branch creation:** 006; no persistent IDs beyond 0–8 in main.
**Current candidate branch:** `manual-pack-2-timber-foundation-20261114`.
**One source of truth for allocations:** `manifest.json`, 59–62 only; 63–108 unallocated.

## Completed foundation and first timber batch

- [x] Milestone 0: inspect all seven governing docs, ledger, checkpoint 006, current block registry, existing crafted-timber shader, related open PRs, and other pack paths (not present at branch creation).
- [x] Isolation: only pack-2 source and pack-2 tests were edited; no new world generation, gameplay changes, automation changes or global texture replacements.
- [x] Candidate ID 59 — roster 13, planed oak plank block; distinct dressed 4-board course visuals, dark staggered joints, full-cube collision/selection.
- [x] Candidate ID 60 — roster 14, peeled ash log; pale horizontal faceted cross-section, grain and end treatment, x/z rotation, 2-box physical union.
- [x] Candidate ID 61 — roster 15, ironbound heartwood beam; smoked brown slender core, wider end collars, joint-pins, x/z rotation, 3-box physical union.
- [x] Candidate ID 62 — roster 22, dovetailed support post; vertical load-bearing shaft with distinct cap/foot, 3-box physical union, no redundant rotational ID.

Each record has independent color recipes, true selection/collision AABBs and separately generated preview triangles; surface marks are decoration ON the actual physical shape, never simulated placeable voxel material. Only distinct block types consume IDs; orientation is stored as state.

## Acceptance/evidence

- Test source: `tests/block-packs/pack-2/pack-2.test.mjs` (Node test runner; run explicitly with `node --test tests/block-packs/pack-2/pack-2.test.mjs`).
- Interactive fixture: `tests/block-packs/pack-2/fixture.mjs`; optional browser inspector `preview.html`.
- Fixture supports 4 candidates, selection, 90° orientation where meaningful, placement, shape-aware ray targeting, removal and deterministic separate snapshot recovery. Fixture snapshots are NOT live `VoxelWorld.save()` schema-1 saves.
- Actual playable integration remains BLOCKED. Main `VoxelWorld.set` rejects candidate IDs above 8; main rendering only knows legacy materials; oriented state requires a separate validated save-compatible persistence strategy. Shared :00 targeting and :12 shape mesher were open candidates in PRs #106 and #108, not production contracts at start. Real iPhone testing and Chromium review not claimed.
- Preview performance acceptance remains open until genuine Chromium/WebGL2 tests on an integrated opt-in candidate are possible.
- Full test results and exact PR head to be updated as verified in PR handoff; do not interpret the presence of test code as proof that tests passed.

## Remaining 14 roster families / next work

**Milestone 2 (next):** 16 slabs, 17 stairs, 18 fences, 19 gates, 20 doors, 21 trapdoors.
**Milestone 3:** 39 gravel, 40 packed dirt, 41 cobblestone paving, 42 decorative paving.
**Milestone 4:** 43 bridge railings, 44 stone parapets, 46 elevated boardwalks.
**Milestone 5:** 45 true water voxel candidate; declare shared-engine fluid/lighting/selection requirements.
**Milestone 6:** all 18 acceptance tests, visual and mobile evidence, dependencies.

## Coordination contract and next-session checks

Read newest main + `docs/INTEGRATION_CHECKPOINTS.md` + Issue #109 + other manual pack manifests and PRs **again** before allocating 63+. Do not duplicate WOOD 4 or any newly integrated independent block, do not claim current candidates are in-world. If main now contains an equivalent physical block, mark already-in-main, reconcile and do not allocate duplicate IDs. Do not merge, deploy, change main, or update this checkpoint ledger during manual pack development.
