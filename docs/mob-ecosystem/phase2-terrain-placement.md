# Bounded terrain-aware physical placement — isolated Phase 2

Experimental only: src/mobs/ecosystem-terrain-placement.mjs and tests/mob-ecosystem-terrain-placement.test.mjs are not imported by original live-game/ecology or runtime. Zero save, cache, PWA, mob injection, player edit or terrain mutation.

The original production spawn window searches 2.5 blocks from feet+1 to feet-1.5. Mountain heights vary within a chunk, so valid ground may be out of range even for habitat-matching species. This source-only proposal retains that exact original window as first choice, then tries a *fixed five-window maximum* with offsets [0,+2,-2,+4,-4]. Each window retains the unmodified supportedPosition, grounded, spawnEligible, observer distance, habitat/light/depth, section and loaded world query.

Deep caves retain only the original single vertical window. Unknown geometry stays unknown, so the planner cannot fake ground; no cave widening, zero-sky workaround, save modifications or special teleport behavior. Native tests use a bounded, deterministic physical floor query to show failure of the original window and recovery only at an authentic grounded voxel, plus original-first stability, cave parity, and fail-closed unknown/distance/habitat protection.

CI has not run this detached proposal. Do not present it as an observed M7 birth or functioning live fix. The existing protected branch retains its independent 3-seed/21-site collision comparison pending Actions. After authentic new-head logs, decide which strict real M7 evidence to add and whether to advance this proposal. No merge or deploy.


## Extended same-source, nonduplicate three-seed measurement

Rather than running a second redundant M7 full-region native comparison, `tests/mob-ecosystem-m7-multiseed.test.mjs` now records `terrainAwareEligible` as a **third** measurement in its existing 21 source-authentic observations (3 seeds x 5 surface biomes + 2 authored cave floors, 24 candidates per site). Each deterministic candidate is identical across original, compatible and compatible-plus-bounded-vertical placement. The third option uses the real `proposeTerrainAwarePosition` in the same source original world. It asserts it never removes an originally valid placement, always passes `grounded` and `spawnEligible`, stays in the same depth section, and keeps deep cave eligibility strictly unchanged. Counts represent physically eligible proposals, never simulated births or live integration. This detached test addition is not an exact-head CI success until authentically run.


## Same-candidate voxel-query optimization (detached research)

The five bounded surface windows reuse some vertical body-volume samples. The isolated planner now memoizes only actual original `world.volume` statuses (`clear`, `solid`, `unknown`) for identical X/Z, body object and Y **during one synchronous candidate evaluation**, capped at 128 vertical samples. The memo never outlives the candidate, and never changes `grounded`, `spawnEligible`, residency, cave height constraints or world saves. A separate safe horizontal-distance guard rejects candidate X/Z more than the original ecology 26-block maximum from the observer before any voxel scans. Exact-position parity and lower source volume reads are exercised in focused deterministic tests; original M7/integration result remains unexecuted until focused native validation.


## Source Y=19 headroom clipping

A source-proven edge case exists at the authentic M7 surface world maximum Y=19. The previous experimental planner discarded a height window if its initial probe plus full creature height extended above Y=19, even when a lower legal floor within that same window was clear. The detached source planner now clips only the **upper body probe of surface candidates** to `WORLD_MAX_Y + 1 - species.body.height - EPS`, preserving every original valid window, keeping the original lower bound, refusing inverted windows, and leaving deep cave windows unchanged. The real original `supportedPosition`, `world.volume`, `world.grounded` and `spawnEligible` checks still determine admissibility. Two focused tests cover recovery of genuinely supported floor at Y=18 and refusal to invent headroom at Y=19 for taller creatures. No actual original M7 terrain census has executed this new revision.
