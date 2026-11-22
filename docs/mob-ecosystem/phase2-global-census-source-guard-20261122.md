# Living Ecosystem Phase 2 — global source census mutation gate

Date: 2026-11-22. Detached research only. No production MobEngine, PopulationManager, voxel world, biomes, saves, PWA, Creative, builders, automation, main, or protected PR changes.

## Verified parent and authentic original source

Parent exact unreferenced commit `2dae61fd408933f0ac359bb14bf7bf6367c46b8a` and Git tree `3a58d826a6d23bbbef02f281e77aed562984b83d`. Its global preflight blob is `a54f2d013532a9f63e01c3b1f8ed47f92dfed475`; previous global clock blob `65756e1e1c39b1876e0c49f5bcf917ace089b905`; original selection reader `d3dc62ee8ff11b12b228828fe7b9f49b2027410f` (unchanged). Existing original MobEngine roster-fence blob `cde835d0475abd1e82c973ebe853ee8d134665af`, authoritative revision helper `1f3944b2185403aca163e56105e6aa37b49d08e6`, and observer helper `1f97465f6ec296f88cb70c6854348d9a600a6f99`. Locally run source hashes checked using `git hash-object`; no full original checkout was available (github.com DNS failed).

## Reproduced source boundary defect

Earlier source only took revision/roster checks inside `inspectOriginalReconcileReadiness` and `prepareOriginalMobPoll`, but three global region-selection passes ran outside one shared revision/roster fence. The real original `previewSourceEcologyRegion` reads caller region.cx repeatedly, and an accessor or external callback may edit the source world or MobEngine roster on the second global preview, **after reconcile but before regional poll's own baseline**. The old global preflight then silently returns a selected result and consumes its original certified clock.

Controlled native Node v22.16.0 local fixtures against the **byte-exact parent global clock and preflight** reproduced 2/2 real control-flow defects: a fifth getter read incremented original-shaped `world.revision` 0 -> 1, and a fifth getter changed a previously counted original-shape MobEngine deer snapshot `health:10 -> health:2`, both without changing selected region, observer or source cadence. The old global preflight accepted both and consumed the clock. These are controlled read-only SOURCE-level fixtures; they are **not authentic full-repository MobEngine/M7 integration, nor measured creature births**.

## New detached engineering

- New pure `src/mobs/ecosystem-global-census-fence.mjs` composes the *unchanged original-source* read-only roster integrity and world revision helpers. Capture source roster before the external world revision callback; verify source roster after revision read and revision after roster read; return private WeakMap-branded frozen ticket. Reject forged, cross-engine/world, malformed, mutated or over-128-entity source rosters and invalid/revised world counters. At subsequent barriers, bracket a source roster read between two authoritative world revision reads. Both remain read-only and cannot undo world/engine edits made by external callbacks.
- `src/mobs/ecosystem-global-preflight.mjs` now previews source due-ness with the existing `previewGlobalEcologyTick` **without invoking a region callback**. It captures one global source roster/revision ticket BEFORE the **first** global region selection for due ticks only, then verifies that ticket after the first preview, after reconcile/reselection and after regional poll/reselection, alongside the existing observer snapshot and unchanged-selection checks. A refusal takes place before `advanceGlobalEcologyClock`, so the source clock can be retried, not rewound or forged. On original not-due interval ticks, no extra MobEngine or world revision scan is performed. The existing single-use final selection certificate remains unchanged.
- New standalone tests `tests/mob-ecosystem-global-census-fence-native.test.mjs` plus new actual-repository import tests `tests/mob-ecosystem-global-census-source.test.mjs`. The latter exercises real `MobEngine.spawn` deer, original source reconcile, world edits and MobEngine transitions in first/second selection callbacks, first-visit cooldown and interval scans; its full dependency graph **has not run yet**.

## Actual tests and provenance

- Native Node v22.16.0 local `node --test` on exact new pure module, exact existing original Git helper blobs and controlled source world/engine fixtures: **9/9 PASS**. Stable ticket, world revision refusal, roster changes, callbacks mutating each other's source state, forged/cross-owner refusal, malformed and 128-cap source roster rejection.
- New global integration controlled original selection/clock/preflight with no fake world or engine writes: **6/6 PASS**: first/second region source edit; roster change after reconcile; stable first-visit result; no not-due scans; world revision callback roster mutation. Controlled reconcile, region poll and depth remain explicit test fixtures.
- Previously executed native original observer controlled comparison rerun against new exact source: **7/7 PASS**. Total focused native local Node **22/22 PASS**. These counts are **not native Node execution of the complete original MYTHWROUGHT repository**.
- **2/2 parent-source RED cases** reproduced separately before applying the fix. Changed source and two new tests parsed with Node v22.16.0.
- No GitHub Actions jobs, duplicate WebGL2/Chromium, 3-seed M7 generation, shared queue polling, workflow modification or full-suite rerun.

## Limitations and mandatory gates

The research-fence is a read-only guard; it requires a *real authoritative* world edit revision, not `revision:()=>0` in production. It cannot detect a write/revert ABA cycle between observations or guarantee that a source getter is pure. Original `PopulationManager.#away` remains the private authoritative six-second removal/wake/sleep ledger. No new actual natural births, M7 3-seed/21-site physical placement counts, native complete original import graph, genuine schema-1 + Pack2 saved-world mutation, iPhone landscape WebGL2/performance, or installed Home Screen offline PWA have been tested at this detached commit. The separate old-head offline staged PWA worker-version failed acceptance gate remains mandatory and unwaived. Do not merge or deploy; research-only HOLD.
