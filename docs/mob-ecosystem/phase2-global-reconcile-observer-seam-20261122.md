# Living Ecosystem Phase 2 — global reconcile/region observer seam

Date: 2026-11-22. Status: detached original-source RESEARCH only; no live MobEngine/PopulationManager/terrain/save changes, no production authorization or release acceptance.

## Proven original-source defect

Parent detached source commit `c5bd88a96b8b93b68d3cc7a3708c7290926371b1` had already protected the observer **inside** `inspectOriginalReconcileReadiness` and **inside** regional `prepareOriginalMobPoll`. The enclosing `prepareGlobalMobTick` did not preserve the same observer identity BETWEEN those boundaries. Original `previewSourceEcologyRegion` reads caller-controlled `region.cx` repeatedly. A getter on the second of three global selection previews can change caller `observer=[8,4,8]` to `[100,4,8]`, while the selected region, world revision and engine roster remain unchanged. The original global preflight returned a selected result after reconciling the nearby source animal against x=8, then planning its region against x=100, without the original manager's private far-away/dormancy transition.

Exact parent source Git blobs used in a local Node 22.16.0 reproduction: global preflight `67d9a7c540c1f5376a15486b71f851bf818a943e`, global clock `d661da52e56775f385c7ec7c8fadbf099157f331`, and original selection reader `d3dc62ee8ff11b12b228828fe7b9f49b2027410f`. Two controlled tests on these byte-exact modules showed old behavior: (1) reconcile saw [8,4,8] while later region poll saw [100,4,8], and (2) a fourth region getter after the last preflight check could move observer while original clock had already been consumed. These tests use controlled MobEngine/reconcile/region/cadence/depth dependencies, not full original engine or generated M7.

## Isolated source changes

`src/mobs/ecosystem-global-preflight.mjs` now captures an authentic privately branded immutable observer at the start of the global preflight, before any source selection or reconciliation. It requires that caller observer remain unchanged after the first selection, reconcile/reselection, regional poll/reselection and before advancing global clock. The existing native original observer helper is reused, not duplicated. Both original reconcile inspector and regional poll retain their own independent guards.

`src/mobs/ecosystem-global-clock.mjs` now retains a WeakMap-certified preview for an EXACT clock-state/seconds/region-array identity. After the final verified global preview, the global preflight passes that one-use certificate into `advanceGlobalEcologyClock`, rather than invoking user-controlled region getters a fourth time after safety barriers. Forged, mismatched, cross-clock or replayed certificates fail closed before consuming the clock. The existing direct `advanceGlobalEcologyClock(state,{seconds,regions})` API retains its old re-preview behavior for other callers; the optimization is only used inside the synchronous preflight after both selection equivalence and observer barriers pass. This is **not** authorization to cache the certificate across frames or external world edits.

New native original-repository test file `tests/mob-ecosystem-global-observer-boundary.test.mjs` covers second and first selected-preview mutation, unconsumed clock reuse, no fourth selection, forged/mismatched/replayed certificate, actual unchanged original MobEngine deer state and direct real global/region source wiring. Its full original import graph is not executed here.

## Actually executed / not executed

- Local Node v22.16.0, controlled original-source preview/clock/preflight module graph: **7/7 PASS** (first and second preview mutation refusal, regional callback guard, stable three-pass selection, forged/mismatched/replayed certificate, original direct advance, original interval semantics). Exact original known Git blob content was copied locally and checked with `git hash-object` before modification. Non-original dependencies are clearly controlled.
- Local Node v22.16.0, byte-exact old original global preflight/clock and real original selected-region reader with controlled dependency modules: **2/2 vulnerability reproductions confirmed**.
- Syntax checks on changed source and new original-repository test: PASS.
- **NOT RUN:** new original-repository native file and complete original dependency graph; genuine original M7 three-seed/21-site generated worlds, PopulationManager private six-second away-ledger behavior, source-authoritative player/region/world mutation integration, actual natural births, iPhone WebGL2, installed Home Screen offline PWA and separate staged-worker version gate. Historical native/Chromium Actions from protected older head do not validate this detached source.

## Ownership / release HOLD

Do not treat a candidate as an actual natural birth. `PopulationManager` continues to own waking, sleeping and the private six-second away ledger. Authoritative production player position and world revision still require independent proof; write/revert (ABA) between observations remains outside the observation-only fence. This research changes only isolated Mob Dev files. No branch ref, PR draft head, production main, live ecology/world, biome, caves, saves, PWA, builders, five hourly automations, CI or other developers are altered. No merge/deploy. Genuine original full-repository tests and protected release checks remain mandatory.
