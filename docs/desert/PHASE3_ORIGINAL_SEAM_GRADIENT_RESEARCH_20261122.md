# Desert Phase 3 — original-source seam-gradient research checkpoint (2026-11-22)

## Exact inherited evidence
Base: authenticated original-game WebGL2 acceptance checkpoint `641726d815172abcde7417b22c71e9df250fcd4b`. Original gameplay child `2bd0395d3ef163e9fdc491ab5119b1ee80844194` remains unchanged. Original five-seed audit #45036277170 and 20/20 native #45036500012 are reused; before/after original WebGL2 #45044303938 and ZIP artifact #14762653721 remain authentic evidence and were not repeated.

## New source research
- Isolated research branch `research/desert-p3-seam-gradient-audit-20261122` inherited the verified checkpoint and adds **only** `scripts/ci/desert-p3-authentic-seam-audit.mjs`, this checkpoint, and a narrow branch-scoped workflow.
- Source-authentic survey constructs genuine `FourRegionWorld` and V6 biome selectors, using original guarded `_columnPlan` and actual material IDs. Around both known source-backed sites (seed179 -786,-1774 Desert/Mountain/Enchanted; seed2026 -2848,-774 Desert/Mountain/Snow), it surveys **17×17 = 289 sample positions each** at two-block spacing, retaining low-weight Desert columns and original protected veto decisions.
- Counts eligible vs protected Desert columns, scree 401 vs hardpan 258 vs other cap, adjacent sampled two-block cap changes, hardpan/scree sharp boundaries, max adjacent top-height difference, and up to 12 actual witness pairs per site.
- Explicit assertion verifies `world.save().edits` remains empty. No original environment logic, gameplay, voxel editing, saves, Mountain, Snow, Enchanted, cave, sky, builder or shared workflow source is modified.
- Dedicated workflow `.github/workflows/desert-p3-seam-census-isolated.yml` uses exact push HEAD, checks branch diff scope, runs only source-authentic two-site survey on native Node 22, and retains a small text artifact. No browser tests/full suite or old tests rerun.

## Interpretation and acceptance
The previously authenticated images show a broad gray scree region adjacent to tan sand at seed179. Original `sharedShoulder` returns a categorical scree 401 at any low-weight Desert column that finds an offset Mountain before considering later material alternatives; therefore an abrupt material change is possible even if physical heights stay smooth. This new audit **measures** original source transitions; it does **not** justify changing terrain until actual counts and witness columns have been obtained and interpreted.

The new branch-scoped workflow was committed, but at checkpoint authoring the GitHub Actions run listing did not yet expose a job. **No new survey success/counts, PNGs, native pass or visual acceptance is claimed.** Existing original WebGL2 two-site material-priority success remains valid.

## Next step
Obtain exact run ID/status/log for the new isolated workflow, review authentic scree/hardpan boundary counts and witness pairs, and decide whether an optional constrained **Desert-only** material transition can be justified without weakening Mountain scree priority, anti-salt Plains fix or protected cave/landmark veto. Any proposed gameplay change requires separate isolated child and small genuine visual check; preserve protected main and other developer lanes. No merges/deployments/cancellations are authorized.

## Actual first run and narrow CI correction
- First focused run #45046469631, at `e8dfdd2ae44f877446a2c990c9e6f8b545557822`, completed **failure before audit execution**. The exact log reports `fatal: Not a valid commit name 641726d815172abcde7417b22c71e9df250fcd4b` during ancestry check after shallow default checkout. This is a workflow setup failure, **not** a terrain, test, or material failure.
- Corrective isolated workflow commit `412755ba76ec7e76364a54b11ba67352ef7721b7` adds `fetch-depth: 0` for real ancestor access and includes this own checkpoint document in the allowed branch path list; preserves the safety assertion that any unauthorized gameplay change fails. No shared CI was touched.
- The corrected workflow is intended to run once on its own branch push; **do not claim its result until the exact run is observed**. Existing WebGL2 success #45044303938 and original native 20/20 are unchanged and reused.
