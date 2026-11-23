# Living Ecosystem Phase 2 — final reconcile world/roster readback fence

Date: 2026-11-22 (America/Indiana/Indianapolis). Scope: research-only original-source reconciliation inspection; no live PopulationManager replacement, natural-birth engine, world, save or PWA changes.

## Exact immutable lineage

Source parent: unreferenced detached Git commit `19c9de3ba9d2381c9554ebf9dd9851b5cadeca2e`, Git tree `30d293bada7f5f75e621c5aef0b82fda611d7ac2`; its original inspector Git blob is `b2b0449be9588c2d9f5fa10a1cb2d41f85ea4f7e`.

Protected refs independently verified once: production main `7016e14cd6289f45eaf7fc6a79a362b47996df65`; PR #380 OPEN DRAFT, unmerged HEAD `508209c5473d3d78668dd394eb6bcdf9e6bcff84`. No branch ref was touched. The exact original MobEngine Git blob `57721eb659b154ad93fd45182cc2bc70eb961d9c`, original PopulationManager blob `b145ab48d5a993f0796b1b321ce2b0ba0a7e1b23`, original full-roster integrity helper `cde835d0475abd1e82c973ebe853ee8d134665af`, and original read-only observer helper `1f97465f6ec296f88cb70c6854348d9a600a6f99` were used for controlled original-source checks.

## Actual old-source failures reproduced (not hypothetical M7 births)

The prior `inspectOriginalReconcileReadiness` checks `world.revision()` after residency/protection callbacks, then invokes `assertOriginalMobRosterUnchanged(rosterCertificate,engine.all())` and returns without checking world revision again. Native controlled V8 execution using the unchanged original MobEngine and inspector class bodies exposed:
1. A source `engine.all()` callback on the second roster read increments the world revision 0 -> 1 after returning snapshots. The old inspector **incorrectly returns `ready:true`, revision 0**, although the actual world is revision 1.
2. The same late edit with a far dormant creature incorrectly returns stale `ready:false` / `unprotected-away-ledger` instead of refusing the invalid source read.
3. A source `engine.all()` callback on the second roster read can materialize an unchanged roster snapshot and then mutate a real MobEngine creature, fooling a single roster comparison. This was exposed during focused regression execution, after initial two RED demonstrations.

These are source-level callback/inspection bugs in DETACHED research code. No actual M7-world, native full-repository import graph, or natural creature-birth rate was tested.

## Repair — exact original MobEngine semantics preserved

`src/mobs/ecosystem-reconcile-readiness.mjs` is changed only in its final read-only fence after the original residency/protection decision loop. It now:
- Asserts the exact original MobEngine roster against `engine.all()` once.
- Performs **one additional bounded independent source roster readback** against the same privately certified snapshot, catching a one-shot post-snapshot MobEngine mutation on the preceding read.
- Rechecks authoritative `world.revision()` after BOTH roster reads, rejecting late world edits with the existing `World revision changed during reconcile inspection` exception.
- Rechecks the observer under its existing source certificate after all those callbacks, before returning the frozen readonly result.

The source `PopulationManager.#away` remains private; this helper NEVER transitions mobs or computes/invents six-second timers. No edits to the original MobEngine, PopulationManager, spawn positions, species, voxel world, rendering, saves or developer automations. The extra bounded inspect costs **one extra `MobEngine.all()` readback of at most the original 128-entity maximum and one extra world-revision read per inspected due tick**. This is **not iPhone performance-tested** and must be profiled before live integration. Arbitrarily malicious or nonterminating host callbacks can still mutate after the final observation; complete ABA (write/revert) cannot be proved away without authoritative engine and world mutation revision ownership. Never describe this as full transactional atomicity or grant release approval solely because focused tests passed.

## Evidence and test provenance

- NEW `tests/mob-ecosystem-reconcile-final-revision-fence.test.mjs`: 9 authored Node `node:test` cases. Real source MobEngine near/far/empty roster, late edits on second and third source roster reads, unchanged 3-revision/3-roster call budget, world-revision getter side effects, observer changed during last revision callback, real state transition after a snapshot, and independently admitted extra source mob after a snapshot.
- Executed the **exact new Git blob** for the inspector `087897f8e68a00c5e7388dcf2c330b5186d853d2` and test `f3dd7661a5eac925885bcfd2cf8b10eb127a39d6`, alongside exact original engine and helper source bodies in a controlled JavaScript V8 evaluation (only ES module import/export syntax substituted for in-memory evaluation; original MobEngine and roster logic unchanged). Result: **9/9 new direct inspector test cases PASS**.
- Also reran **4/4 archived original-repository reconciliation tests** (`fed7f69eceb31c55c3214002d2f93a9af982d8cc`) on this same updated inspector and unchanged original MobEngine/PopulationManager class bodies, with controlled species/world/depth/physics dependencies. All pass.
- In the SAME session, exact unchanged original MobEngine + PopulationManager executed the prior 10 archived six-second `#away` tests (`cfa3dcbeea15b386d509da2da1cd7255e037a5fd`) **10/10 PASS**, with controlled dependencies. These are authentic unmodified source class bodies, NOT a complete original Node import graph. Count each distinct test once.
- Nine full-original-repository integration cases are AUTHORED and compilable but **NOT executed with the actual complete MYTHWROUGHT imports**. Native complete original source checkout not accessible: local `git ls-remote https://github.com/hdog960/Mythwrought.git HEAD` still cannot resolve github.com; connected MSI remote desktop was OFFLINE. No GitHub Actions job run, no Chromium browser, no M7 worlds generated. No claim that production MobEngine tests or PWA passed.

## Release HOLD and next work

Run the exact new nine-case Node file plus historical 14 case suite with a real complete original repository checkout, then remaining original Mob Dev global source/census/regional settlement tests. Verify actual original M7 3-seed/21-site physical placement, biome/cave natural spawning and real MobEngine newborn counts; schema-1/Pack2 saves; independent important companion/downed behaviors; original player 3D observer and world revision ownership; iPhone WebGL2/PWA performance. Existing staged PWA worker-version root gate remains unwaived. Do not merge/deploy or touch main, draft PR #380 HEAD, builder/manual lanes, automations or other developers. Do not rerun identical expensive CI without code/artifact changes and explicit integration coordination.
