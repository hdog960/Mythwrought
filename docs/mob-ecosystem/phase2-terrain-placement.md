# Bounded terrain-aware physical placement — isolated Phase 2

Experimental only: src/mobs/ecosystem-terrain-placement.mjs and tests/mob-ecosystem-terrain-placement.test.mjs are not imported by original live-game/ecology or runtime. Zero save, cache, PWA, mob injection, player edit or terrain mutation.

The original production spawn window searches 2.5 blocks from feet+1 to feet-1.5. Mountain heights vary within a chunk, so valid ground may be out of range even for habitat-matching species. This source-only proposal retains that exact original window as first choice, then tries a *fixed five-window maximum* with offsets [0,+2,-2,+4,-4]. Each window retains the unmodified supportedPosition, grounded, spawnEligible, observer distance, habitat/light/depth, section and loaded world query.

Deep caves retain only the original single vertical window. Unknown geometry stays unknown, so the planner cannot fake ground; no cave widening, zero-sky workaround, save modifications or special teleport behavior. Native tests use a bounded, deterministic physical floor query to show failure of the original window and recovery only at an authentic grounded voxel, plus original-first stability, cave parity, and fail-closed unknown/distance/habitat protection.

CI has not run this detached proposal. Do not present it as an observed M7 birth or functioning live fix. The existing protected branch retains its independent 3-seed/21-site collision comparison pending Actions. After authentic new-head logs, decide which strict real M7 evidence to add and whether to advance this proposal. No merge or deploy.


## Extended same-source, nonduplicate three-seed measurement

Rather than running a second redundant M7 full-region native comparison, `tests/mob-ecosystem-m7-multiseed.test.mjs` now records `terrainAwareEligible` as a **third** measurement in its existing 21 source-authentic observations (3 seeds x 5 surface biomes + 2 authored cave floors, 24 candidates per site). Each deterministic candidate is identical across original, compatible and compatible-plus-bounded-vertical placement. The third option uses the real `proposeTerrainAwarePosition` in the same source original world. It asserts it never removes an originally valid placement, always passes `grounded` and `spawnEligible`, stays in the same depth section, and keeps deep cave eligibility strictly unchanged. Counts represent physically eligible proposals, never simulated births or live integration. This detached test addition is not an exact-head CI success until authentically run.
