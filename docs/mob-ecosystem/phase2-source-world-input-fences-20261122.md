# Phase 2 — Original regional preflight mutation and input fences
Date: 2026-11-22
Status: ISOLATED SOURCE RESEARCH, UNPUSHED DETACHED; NO LIVE INTEGRATION

## Source defect 1 — revision baseline taken after protection census

Earlier detached `prepareOriginalMobPoll` called `engine.all()` and `deriveRegionalMobState(...,{isProtected})` BEFORE its initial `world.revision()` capture. A user-supplied `isProtected` callback could change the original world revision from 0 to 1 while counting residents, and the old function would silently record revision 1 as if it were an unchanged baseline. This was reproduced RED with the genuine original source `MobEngine` class (protected Git blob `57721eb659b154ad93fd45182cc2bc70eb961d9c`) plus the old exact regional code (blob `7f02906fcf62eb23d7c3ebe2a2fee8fce8cdec7c`) and controlled source census inputs.

The new independent `ecosystem-world-revision-fence.mjs` provides `captureOriginalWorldRevision` and `assertOriginalWorldRevisionUnchanged`. Exact original world revision is sampled BEFORE original engine/census/protection callbacks, asserted immediately AFTER the census, and asserted again after the bounded original terrain/habitat proposal. Invalid/nonfinite/negative revision counters fail closed before a census callback runs. The helper only observes the original world: no edits, saves, mobs or original engine/PopulationManager modifications.

## Source defect 2 — caller region/observer changed during a poll

Previously direct `prepareOriginalMobPoll` reused caller-owned mutable `region` and `observer` objects. A protection callback could change `region.cx` from 0 to 1 after the original regional census computed a `0,0,0` record, while the subsequent physical proposal was evaluated for chunk 1. This mismatch was reproduced RED on the exact earlier source blob `262b32a36f447a6d64623b68593b015622d7d28d`, again using the real original `MobEngine` plus controlled source functions.

New independent `ecosystem-region-input-fence.mjs` freezes a snapshot of the four source regional fields (cx,cz,section,feet) and the full 3D observer. The actual census and original physical proposal now use ONLY those frozen values. Before/after callback barriers also reject caller-side changes to the original inputs; source world-revision guard remains in force. No new proposal loop, no change to original species, cave shape, voxel data, save format or natural-birth probabilities. Changing inputs and restoring them entirely between observations (ABA) cannot be detected; this is a conservative read-only source safety measure, not authoritative ownership of the player's position.

## Exact detached commits and evidence

Parent detached `6ad36b6004332499340935d1b7203049c26b9e9f`:
- `827dc13013084b7afba46f31f5501f064e300f55` — world-revision fence + native tests.
- `ac750b3b7b80f832e247829f7e1a8ac8a65da339` — move revision capture ahead of original roster/census with two new authored regional native-repo test cases.
- `f537b15b24b92fe148e10936e2e4e0e73b8b3bcb` — immutable source region/observer fence + native tests.
- `2337d4133cc6d4150a84ff932fdb06a0ff26c95a` — integrate frozen source region/observer into original-engine preflight; add two further authored source tests.

Genuine local Node v22.16.0 `node --test`:
- **6/6 PASS** exact world-revision standalone source/test, verified Git blobs `1f3944b2185403aca163e56105e6aa37b49d08e6`, `2babaa6880bb7624a92494881e4abb5330fc779a`.
- **6/6 PASS** exact regional-input standalone source/test, verified Git blobs `67616a1ac50a926e0320beedb6ef90b5fb44fc92`, `ffa8f747b700c4abedf1743a0159e3c6bd458d90`.
- These are native stand-alone utility tests, NOT native execution of the whole original MYTHWROUGHT import graph.

Focused V8 execution of exact original `MobEngine`, source roster and natural-birth modules, committed old/new detached regional source and controlled local habitat/cadence:
- Early original-world-revision mutation **RED before**, **GREEN after** in 6/6 focused comparisons.
- Changing chunk during census, changing observer during census, changing chunk during terrain proposal, source-world revision mutation, unaffected no-birth, and a genuine separately `MobEngine.spawn`-admitted unchanged newborn: **8/8 PASS** on latest detached integrated source. The earlier code's region/record mismatch was reproduced RED.
- This is source-backed V8 with controlled dependencies, NOT native `node --test` of the full original project or authentic source-generated M7.

## Unchanged original ownership and required gates

Full original repository checkout remains unavailable to the local Node environment because github.com DNS fails; prior connected desktop was unavailable. Latest source-native `tests/mob-ecosystem-region-poll.test.mjs`, original M7 three-seed/21-site world measurements and whole dependent native module graph are authored but **NOT EXECUTED**. Old-head M7 161/504 original vs 227/504 M7-compatible are eligible *positions*, not births. Historical original seed179 true births were 18 of 1308 attempts (mountain and enchanted 240/0 each), not evidence for this research head. No new natural-birth rates are claimed.

Original PopulationManager private `#away` six-second remove/reconcile ownership is not reproduced. A caller-provided constant revision, or writes+rollbacks between polls, are not made authoritative by this code; the original live host must supply a genuine monotonic revision. Full original gameplay native tests, natural birth proofs, caves, Schema-1/Pack2 saved-data acceptance, iPhone landscape GPU/performance and the existing separate staged offline PWA worker-version failure remain mandatory release blockers.

No main/PR ref pushes, merges/deployments, CI jobs/actions, cancellations, workflow edits, live world/ecology/M7/cave/save/PWA changes, settlements, other builders/developers/Codex/five hourly automations touched.
