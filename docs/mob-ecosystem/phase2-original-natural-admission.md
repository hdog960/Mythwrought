# Original MobEngine natural newborn admission — isolated Phase 2

## Exact original source contract

The protected original `src/mobs/ecology.mjs` `PopulationManager.advance` performs up to six bounded trials, and on a successful candidate calls the authentic `MobEngine.spawn(species.id, point, {homeChunk:name, dormant:distanceTo(observer,point)>18})`. It never requests `juvenile:true`. The original `src/mobs/engine.mjs` sets the newborn's `origin` and `position` to the spawn point; velocity `[0,0,0]`; yaw zero; health `species.combat.health`; `juvenile:false`; `important:false`; `motionMode:'walk'`; and state `idle` or `dormant`. A distant (>18 Euclidean blocks) naturally spawned creature must be dormant. An otherwise valid near newborn may also be dormant when the original engine's maximum-active budget is already filled. `grounded` is a boolean from the actual source world; naturally admitted swimming creatures need not be on solid ground.

The previous detached regional source transaction only required an independently admitted source-engine ID, species identity, home chunk, important flag and physical position. That could **incorrectly count** (a) a juvenile created with an explicit `juvenile:true`; (b) a newly admitted adult subsequently injured or moved; (c) a distant creature created `dormant:false`, even though original PopulationManager always passes `dormant:true` at that distance. Those are genuine disparities with original natural-birth semantics, not new mob species.

## Read-only engineering

New isolated `src/mobs/ecosystem-natural-admission.mjs` exports `verifyOriginalNaturalMobAdmission`. It is pure and bounded (fixed field/vector checks) and never spawns, heals, moves or removes a mob. The detached `prepareOriginalMobPoll` now rejects invalid observers even during a cooldown and captures an immutable 3D observer copy in a private per-plan WeakMap, so caller-side array mutation cannot change the natural-birth distance rule. `settleOriginalMobPoll` still requires the authentic independent `MobEngine` snapshot, original strict source-world identity/revision, one-shot plan ownership and unchanged prior original roster, then checks this **newborn's original source initial state** before considering any confirmed birth/cooldown. Failed settlement remains consumed. No production original source, world, saves, cave physics, M7 generator, offline PWA, or other development lane changed.

## Evidence and remaining gates

- The exact new independent source/test Git blobs passed **8/8 genuine local Node v22.16.0 node:test**; the local executed Git object hashes match the detached committed source and test blobs.
- In addition, **8/8 controlled V8 integration checks** loaded the actual unchanged original `MobEngine` implementation, exact new admission/roster/regional source blobs and bounded mock regional habitat/cadence functions. Tests confirmed original near idle and distant dormant admission, near dormant at original awake cap, genuine original-engine juvenile and injured newborn rejection, far awake rejection, invalid direct observer refusal, and one-shot rejection. These are NOT native execution of the complete repository or generated M7 worlds, and do not measure any actual new natural births.
- This is an **admission verification helper**, not a complete natural spawning engine. The original `PopulationManager` private `#away` grace/removal owner must remain untouched; source authoritative live edit revisions remain mandatory; original-world three-seed/21-site M7 focused native suite, caves/saves, iPhone WebGL2/performance, Home Screen offline worker acceptance and old unrelated staged worker-version failure remain release gates.
- Existing old-head 161/504 original vs 227/504 compatible M7 physically eligible points are **proposals, NOT births**. The historical seed179 PopulationManager 1308 attempts/18 births and mountain/enchanted 240/0 each are unchanged background evidence, not new-head acceptance.

## Scope

Research-only, UNPUSHED and UNREFERENCED detached commit lineage. No merges, deployments, GitHub Actions launches/cancellations, force pushes, edits to main/PR #380, original live ecological manager, other developer lanes, builders, Codex, settlements, or five automations.
