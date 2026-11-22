# Bounded terrain-aware physical placement — isolated Phase 2

Experimental only: src/mobs/ecosystem-terrain-placement.mjs and tests/mob-ecosystem-terrain-placement.test.mjs are not imported by original live-game/ecology or runtime. Zero save, cache, PWA, mob injection, player edit or terrain mutation.

The original production spawn window searches 2.5 blocks from feet+1 to feet-1.5. Mountain heights vary within a chunk, so valid ground may be out of range even for habitat-matching species. This source-only proposal retains that exact original window as first choice, then tries a *fixed five-window maximum* with offsets [0,+2,-2,+4,-4]. Each window retains the unmodified supportedPosition, grounded, spawnEligible, observer distance, habitat/light/depth, section and loaded world query.

Deep caves retain only the original single vertical window. Unknown geometry stays unknown, so the planner cannot fake ground; no cave widening, zero-sky workaround, save modifications or special teleport behavior. Native tests use a bounded, deterministic physical floor query to show failure of the original window and recovery only at an authentic grounded voxel, plus original-first stability, cave parity, and fail-closed unknown/distance/habitat protection.

CI has not run this detached proposal. Do not present it as an observed M7 birth or functioning live fix. The existing protected branch retains its independent 3-seed/21-site collision comparison pending Actions. After authentic new-head logs, decide which strict real M7 evidence to add and whether to advance this proposal. No merge or deploy.
