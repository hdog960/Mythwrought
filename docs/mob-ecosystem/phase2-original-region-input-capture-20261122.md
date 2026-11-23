# Living Ecosystem Phase 2 — original regional input capture consistency

Date: 2026-11-22. Isolated detached Mob Dev research; NO changes to live PopulationManager, MobEngine, voxel world, saves, PWA or other developer lanes.

## Exact source and reproduced defect

Parent unreferenced detached commit `8e50886852f5ff262117da2520671f280a34e65c`; original regional input helper Git blob `67616a1ac50a926e0320beedb6ef90b5fb44fc92` was copied byte-exact and authenticated using local `git hash-object`, then executed with real native Node 22.16.0. The earlier `captureOriginalRegionalInputs` validated mutable source getters *before* copying them, then treated the later copy as its true baseline. A getter returning region.cx 0 on validation and 1 on copy returned an apparently valid region ticket for chunk 1. Another getter returned observer X=8 on initial validation and 100 on copy; the helper returned an apparently unchanged observer ticket for X=100. In both cases `assertOriginalRegionalInputsUnchanged` returned true. Two genuine original-helper source RED cases were reproduced; they are not observed original-game natural births or genuine M7 terrain data.

## Isolated repair

The same helper now captures the caller's source coordinates and all three observer values exactly once into frozen copies, then validates *the captured values* and checks the source values still equal the copy before issuing the ticket. Each field uses `Object.is` to distinguish signed zero changes; malformed or drifting getters fail closed. The original outward `ticket.region` and `ticket.observer` properties remain frozen, preserving the original source research interface. A private WeakSet brands issued tickets so a fabricated object with `Object.freeze` cannot be used to manufacture a source-input certificate. `assertOriginalRegionalInputsUnchanged` still checks caller values at later census / terrain stages. This helper neither spawns mobs nor mutates engine, world, saves or ecology schedules.

## Actually executed checks

- **10/10 native Node 22.16.0 direct-module regression tests passed** on exact new helper, including stable fields, chunk/height/observer mutation during capture, cross-field mutation, signed-zero drift, post-capture mutation, forged ticket, malformed input and stable getter read budget. Original unchanged exported function names and result shape preserved.
- New helper tested Git blob `3bf012cd7b79481403de0fae39e56017f4ed6cf6` and its new native test blob `48db121f3c9d763fc57408fbf35d89de6a73853d`, independently computed with local `git hash-object`. Two older source RED cases documented separately and not counted as green tests.
- Added actual-original-import test `tests/mob-ecosystem-region-input-original-engine.test.mjs` (Git blob `5575323043b43124128f396c5877de0fc0dfd5fe`) with three original MobEngine / prepareOriginalMobPoll integration cases. **Syntax checked but UNRUN**, because complete original MYTHWROUGHT checkout unavailable: container cannot resolve `github.com`, MSI remote Desktop Commander offline.
- Historical parent 16/16 direct selection native tests and earlier 22/22 controlled census source tests are not rerun or represented as testing this new detached commit.

## Remaining acceptance gates

Original full-repository `node --test` including new 3 engine tests plus existing regional poll/observer/census tests; genuine original 3-seed / 21-site M7 biome/cave physical reader; actual original PopulationManager natural births and private six-second `#away` wake/dormancy/removal; authoritative production voxel edit revision, Schema-1 + Pack2 save invariants, iPhone landscape WebGL2/performance and installed Home Screen offline PWA; existing worker-version gate remain mandatory. Source getter write-and-revert ABA cannot be excluded by read-only snapshots. No GitHub Actions launched, no duplicate browser runs, no CI or branch-protection changes. No merge/deploy/PR push; source research only.
