# Desert Phase 3 — research-only existing-rock feather candidate (2026-11-22)

## Inheritance and immutable gameplay
- Parent original source research checkpoint `a02b0100c7b9521d758591343314bafd7c6ce5d7`.
- Original mountain-priority gameplay child remains `2bd0395d3ef163e9fdc491ab5119b1ee80844194`, visually accepted specifically at seed179 and 2026 by authentic browser run #45044303938.
- Genuine two-region seam survey #45046523512 SUCCESS: 206 eligible Desert columns, 20 sharp 2-block sample hardpan/scree contacts, max height delta 1. Historical native 20/20 and five-seed audit reused.
- Branch `research/desert-p3-hardpan-rock-feather-20261122` introduces research-only proposal, new focused authentic V7 test and one isolated workflow; no edits to `src/`, builds, saves, other developers or published gameplay.

## Proposed material feather, not activated
Existing material 258 hardpan adjacent to original scree 401 at a **one-block cardinal neighboring Desert column** may be proposed as **existing Desert rock 261** in one deterministic hash fraction (approximately one third). This is a preview of material mixing, not a guarantee of prettier screenshots. Its goal is to reduce direct flat hardpan-to-scree contacts with occasional Desert rock intermediary; it never changes scree 401 or Mountain / Snow / Enchanted original generators. Original guard/veto is checked by real `FourRegionWorld._columnPlan` before any candidate can be eligible.

No new material IDs, height edits, world edits, sidecar writes, workflow modifications outside this branch or gameplay changes. The hash uses only original integer x,z and seed, avoiding runtime randomness and preserving chunk-order determinism.

## Exact targeted test contract
`scripts/ci/desert-p3-rock-feather-original-source.test.mjs` uses original V6 source selectors and original guarded V7 column planner in 35x35 positions (a 33x33 target region with one-cell halo) around the authentic seed179 Desert/Mountain/Enchanted and seed2026 Desert/Mountain/Snow screenshot locations. It counts changed original hardpan 258 -> existing Desert rock 261, actual one-block cardinals before/after, original scree unchanged, protected veto, deterministic hash, and `world.save().edits=[]`. The strict negative tests fail closed on non-hardpan and missing scree neighbor. All changed cells must be originally eligible Desert columns. Prior visual screens are **not** proof of visual acceptance for this unrendered proposal.

An isolated `.github/workflows/desert-p3-rock-feather-focused.yml` runs only those new tests under Node22, verifies exact ancestor and a narrow four-file research-only diff scope; no broad browser/native/ten-scene jobs or duplicate original source census. The workflow result and actual proposal counts must be obtained from exact GitHub Actions run/logs before treating it as source-passing.

## Acceptance boundary
**Do not integrate or deploy** this material-feather proposal just from categorical contact counts. Existing Desert rock 261 may still look too dark/red, and deterministic spots can increase some other cap boundaries even while reducing the 258/401 count. Requires an isolated gameplay child, exact source tests and minimal genuine original-game before/after screenshots at both known sites, careful visual inspection, cave/landmark veto and original Mountain priority. A failure or visual regression means discard or revise the proposal, never change neighboring biome policies or protected branches.
