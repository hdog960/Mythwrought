# Living Underworld Phase 6 — horizontal-gallery walking clearance

## Source-backed gap and new acceptance gate
The isolated Phase 5 network code correctly prevents a proposed stair SUPPORT from crossing another proposed stair's three-high HEADROOM. It does not by itself prove that those supports avoid the already planned horizontal network galleries. Such a support could obstruct normal horizontal passage even though all inter-level stairs pass their mutual collision checks.

A source-level 24-region sample (six seeds × four distant regions) using the previously fixed unrotated radius-14 proposals found **22/24 regions** with at least one support entering a planned horizontal pedestrian clearance, **359** such support cells in total across that raw sample. These are detached proposals, not actual terrain edits or installed stairs.

`auditProposedSupportsAgainstMainGalleries` now reconstructs each of the 16 original horizontal *two-capsule* walking galleries using the same strict 3-wide and 3-high source footprint code as the stair auditor. For every proposed stair (including the initial surface gallery) it checks whether any proposed floor SUPPORT would occupy the required gallery CLEARANCE. It fails closed on crossing, original horizontal grade failure, malformed source inputs, or query-budget exhaustion. It never carves or modifies the original M7 world.

The full four-stage `auditProtectedUnderworldWalkingChain` now requires this **additional strict horizontal-gallery clearance gate**. Existing 96/96 earlier source-proposed inter-level ramps still count as inter-ramp-compatible research, **not as an approved complete walking network**. For the previous seed179/region(0,0) all-stone synthetic surface-to-deep sample, the new gate found **18** horizontal-gallery support/clearance obstructions, so full-chain acceptance is now correctly RED. Targeted original-source function tests independently confirmed an unobstructed four-deep-ramp-only candidate in seed179 (0,0), and **17** obstructions for a source-only 4-ramp candidate in seed179 (-7,13). The remaining 18 obstructions in the full synthetic chain include the surface entrance: future surface mouth selection must account for planned galleries before any global walkability claim.

This is a stricter correctness contract, not weaker tests. The old source tests were updated to expect explicit `MAIN_GALLERY_CLEARANCE_BLOCKED` while retaining their 4/4 individually source-vetted ramp counts, original ore/landmark/AIR refusals, and no world edits.

## Testing and evidence boundaries
- The new gallery checker source-function preflight passed on two source-backed sample configurations, including 16 horizontal galleries and 18,396 distinct clearance cells in seed179 (0,0).
- Native Node tests for the child SHA and genuine old-M7 full-depth five-biome walking survey remain unexecuted.
- Previous exact-head protected PR #367 root WebGL2 success and M7 two failing positive seeds 8675309/13579 remain untouched; reuse them only for their exact original revision.
- Avoid redundant GitHub Actions, root Chromium and repeated queue audits. Only targeted new-source tests are registered in the isolated dedicated workflow.
- These are theoretical three-wide stairway clearance checks; actual authored M7 caves, original terrain material, player collision, real GPU chunks, and iPhone installed PWA still require proof before acceptance.

No merges, deployments, main/other-branch changes, or CI cancellations.
