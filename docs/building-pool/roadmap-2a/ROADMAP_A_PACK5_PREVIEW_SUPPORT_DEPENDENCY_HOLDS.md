# Roadmap A — source-only Pack5 attachment dependency and hypothetical batching

This is a **non-gameplay, non-structural** engineering handoff in the isolated Roadmap A development branch. It builds on the original source-authentic Manual Five-Pack preview-support preflight. It does **not** choose any variant or yaw for the 79 original commerce sources, place a settlement, split a real building, create real physical blocks, write saves, touch automations, or modify existing producers.

## Concrete engineering contribution

The original Pack5 `resolveManualFivePackAsset` accepts a maximum of 4,096 **physical instances** in the opt-in dry-run planner; that number does *not* equal the number of source voxels or rendering triangles. The new dependency audit allows an engineer to give a bounded **explicitly authored PREVIEW fixture** collection, then examines the already source-bound support preflight and reports which fixture could depend on which neighboring candidate collider, which candidate chains end at a preview asset with no *attachment requirement*, and which are blocked by missing/partial support. It tracks synthetic cycles conservatively, and partitions preview-index order into **hypothetical** max-instance batches of size 1–4,096 to reveal cross-batch support candidates.

**A no-attachment Pack5 brick test asset is NOT a proven foundation, load-bearing wall or certified world anchor.** The result is labelled `NO_REQUIRED_PREVIEW_ATTACHMENT_NOT_WORLD_ANCHOR_PROOF`, and all chains that eventually depend on it say `PREVIEW_CHAIN_ENDS_AT_UNCERTIFIED_NO_ATTACHMENT_ROOT`. A full-face collider candidate does not imply physical or structural approval. The planner never returns a real construction plan.

### Files

- `src/building-pool/roadmap-2a/roadmap-a-physical-preview-dependency-core.mjs`: strict pure evaluator for the existing source-only support report, validating each classification, numerical integrity and non-approval flags; analyzes conditional dependency arcs, cycles and cross-hypothetical-batch arcs; all approvals false
- `src/building-pool/roadmap-2a/roadmap-a-physical-preview-dependency-producer.mjs`: binds to the unmodified original source `auditOriginalPack5PreviewPhysicalSupports`, requiring authentic original Manual Pack5 geometry and caller-explicit isolated preview variants/yaws
- `tests/building-pool/roadmap-2a/roadmap-a-physical-preview-dependency-core.test.mjs`: six focused native source-only tests: original-shape brick/plaster candidate chain, a two-instance cross-batch split, thin-surface incomplete backing, nonexistent neighbor, synthetic cycle rejection, malformed/spoofed report and forbidden instance limits
- `tests/building-pool/roadmap-2a/roadmap-a-physical-preview-dependency-producer.test.mjs`: four more focused full-repository original Pack5 tests for explicit variants, authentic backing candidates, cross-batch exposure and fail-closed source ID / guessed variant / yaw / illegal instance cap

### Genuine focused evidence

The pure source-core **6/6 Node tests passed locally**, including a synthetic full-cell wall-to-wall cycle, and its **exact complete source blob** matches GitHub blob `dde9fcc25a4ca649d1ea7b1cd4c23b1d4fa7fa9d`. The locally executed test used the same original preview-support pure core already verified at GitHub blob `70ba932a94c1dc236671ec61008e8edf57bda6ba`.

In addition, the original, unchanged Pack5 fixture, six family files, catalog, and physical blueprint resolver were executed in isolated V8 against the six authored variants × four orientations **24/24 cases passed**, and the actual original Manual Five-Pack Pack5 resolution branch plus newly added support and seam adapters passed **58/58** controlled V8 assertions. Only unrelated Packs 1–4 were substituted with non-executed registry stubs to satisfy the import graph. **These V8 results are not native Node execution of the complete repository or GitHub Actions CI.** They were run for focused, exact-original-source provenance and do not prove the new dependency adapter's repository-native tests passed.

New four original-repository dependency-producer tests, prior four support producer tests, four seam producer tests, plus prior geometry-envelope and physical-hold tests remain **unexecuted in original Node CI**. Full release iPhone landscape, GPU uploads/FPS, original-game WebGL2, collision, true wall/floor/roof support and creator-art approval remain on hold.

No new PR was opened or GitHub Actions/Chromium/full-suite tests started; no runner queue audits, workflow cancellations, merges or deployment. Preserve production `main` `7016e14cd6289f45eaf7fc6a79a362b47996df65`, protected OPEN DRAFT PR406 HEAD `1d71f5e37891280a21c777e5189f0762014ed8a9`, the original 207/420 source-only A5 with 213 unwritten, 128 historical commerce, 345 industrial, 315 government, five hourly automations, all other developer lanes, original Pack producers, schema1 and installed PWA/v0.11.
