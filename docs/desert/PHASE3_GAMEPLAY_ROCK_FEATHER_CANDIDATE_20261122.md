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
