# Desert Phase 3 — isolated guarded gameplay rock feather candidate (2026-11-22)

## Exact branch and protected boundaries
- Research parent `7d4f5893746c518d96dfac9b20ca9565b0dbe363` on `research/desert-p3-hardpan-rock-feather-20261122`.
- Isolated gameplay candidate branch `dev/desert-p3-rock-feather-candidate-20261122`, **unmerged and undeployed**.
- Immutable original comparison gameplay child `2bd0395d3ef163e9fdc491ab5119b1ee80844194` remains protected. No production main, Phase1/2/3, mountain, snow, enchanted, cave/sky, saves, builders, automations, other developer branches or shared workflows changed.

## Source engineering
- New `src/manual-biomes/desert-rock-feather-candidate.mjs`: pure deterministic existing hardpan258→existing Desert rock261 hash proposal, copied from validated source-only research helper.
- Candidate-only modification to `src/manual-biomes/profile-world.mjs` inside **M7 `_columnPlan`**: after original source plan and real protected cave/landmark veto, for low-weight Desert hardpan only, first evaluate deterministic hash, then check one-block four cardinal ORIGINAL neighboring Desert column plans via direct original `planEnvironmentalColumn` and original oasis ownership. Never call `_columnPlan` recursively for the neighbor; never modify original scree401, source shape, subsoil, top height or non-Desert code. The entire candidate logic is in a newly isolated branch only.
- New genuine source test `tests/desert-p3-rock-feather-gameplay.test.mjs`: compares every candidate output with original untouched M7 source and verified deterministic research formula across two **35×35** genuine original-world sample regions; asserts actual game reader, top/height/depth invariance, expected five/eight modified caps, original scree and saves preserved, and negative cases.
- One branch-scoped workflow `.github/workflows/desert-p3-rock-feather-gameplay-isolated.yml` first enforces exact source SHA/scope and runs new focused source test; only then executes the original main.mjs real WebGL2 existing two-scene browser script in identical 932×430 viewport / daylight1 on immutable baseline vs candidate, validates actual PNG dimensions/hash and uploads four screenshots/manifests. No broad CI suite.

## Reused acceptance evidence
Original game source-only #45048842936 2/2, original V7 screenshot #45044303938 SUCCESS, genuine two-site seam audit #45046523512 SUCCESS, original Phase3 native #45036500012 20/20 and five-seed #45036277170 are reused, never redundantly executed.

## Remaining acceptance
The candidate must pass real source tests and produce actual screenshots. Even if gameplay checks succeed, Desert rock 261 could make unsightly dark/red speckles and new 261↔401 boundaries. Inspect actual same-framing screenshots, especially original witness cells at seed179 (-785,-1775) and seed2026 (-2840,-784). Reject material candidate if it looks worse; don't merge, deploy or claim existing-save or physical iPhone performance acceptance.

**Workflow execution and image aesthetics are pending at this checkpoint.**

## Executed exact-source gameplay candidate proof and isolated browser setup correction
- First isolated gameplay candidate Actions [#45049286946](https://github.com/hdog960/Mythwrought/actions/runs/45049286946) at exact workflow HEAD `e17ea060756955a3f7484ade5c6d43eb21b763b5` ran its source part **successfully**: **2/2 focused native tests passed**, verified exact ancestor/scope, original V7 source plan versus candidate across both 35×35 regions.
- Original V7 actual source counts in source log: seed179 `modified=5, screePreserved=220, originalEligible=1074, protectedVeto=151, sharpBefore=24, sharpAfter=18`; seed2026 `modified=8, screePreserved=747, originalEligible=1216, protectedVeto=9, sharpBefore=20, sharpAfter=10`. Total 13 actual game cap changes, **967 unchanged original scree caps** in the full sampled 35×35 area, and 160 original protected vetoes. These larger counts include all actual plans within the 35×35 region, not only low-weight Desert edge caps. Both source examples match the earlier research 5/8 split and 44→28 direct hardpan/scree contacts.
- **Browser stage did not execute**, due to missing test harness in the immutable original gameplay source checkout: `Cannot find module 'baseline/tests/desert-phase3-triple-junction-browser.mjs'`. This is a CI test setup error, not a gameplay/regression failure.
- Isolated workflow correction `c97e2a95dd6d066e113b697b338a02f118ffdfb4` copies the exact same test script from candidate into the temporary baseline tests directory before browser execution; it compares bytes with `cmp` and does not commit to or modify the protected baseline ref. The workflow is configured for one new push-triggered focused comparison; actual second run and image evidence must be verified before claiming visual acceptance.
- No prior browser, native 20/20, five-seed, or broad testing was redundantly rerun. No merge/deployment/CI cancellations/shared workflow changes performed.
