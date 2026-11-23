# MYTHWROUGHT Mob Dev — original 40-species deterministic physical-spawn oracle

Date 2026-11-22. This is DETACHED, read-only original-source test engineering, NOT a gameplay integration or real M7 test.

## Protected ownership and lineage

Starting detached, unreferenced parent commit: `25e746ee23873795db9f7001994728341559a684`, tree `19857fd9582855a76b125dec934e73ea045fd0f7`. Independently verified production main `7016e14cd6289f45eaf7fc6a79a362b47996df65` and PR #380 OPEN DRAFT, unmerged, head `508209c5473d3d78668dd394eb6bcdf9e6bcff84`. No refs touched. Local git clone of GitHub still blocked by DNS; MSI remote desktop remains offline.

## Exact original-source dependencies executed

Eight byte-authenticated GitHub blobs executed as unchanged original class/function bodies with ES import/export syntax adapted for a controlled V8 test harness:
- `species.mjs` `2b49e5e053051fda760b264895785b75c855c7b4`;
- `familiar-wildlife.mjs` `64f7e9a4dad79523201d7646572f65fd93dda9ea`;
- `original-wildlife.mjs` `c04543445e73e0b21ea35c54d3901363a21be462`;
- `hostile-tactics.mjs` `46ea5d437db2c2ff615cc9a61d8058e85de7c3e2`;
- original `engine.mjs` `57721eb659b154ad93fd45182cc2bc70eb961d9c`;
- original `ecology.mjs` `b145ab48d5a993f0796b1b321ce2b0ba0a7e1b23`;
- original `movement.mjs` `72671c1340c63984581128ba585eec72d5875acc` for real `supportedPosition`;
- original `depth.mjs` `b54b7fd8c422699a328b60135178f97508e277c8` for real `sectionForY`.

Original `voxel.mjs` `543677a61aff7f54c0111f2485be79fbbbd560c6` verifies chunk size 16. Physical terrain and residency were controlled: flat solid below a known floor, air above, real `supportedPosition` and `spawnEligible`, explicit hazard/light/biome, safe air medium. `validPoint` matched original `world-query.mjs` `a1c7548f636dc85381789a209199f14e2638606d`. This did NOT import true voxel collisions, M7 `FourRegionWorld`, chunks, overlays, cave protection or real weather. No original engine or world source was edited.

## Actual source-native V8 first due tick / birth evidence

For each of eight habitat fixtures, seeds 1..64 ran a new original `MobEngine` and original `PopulationManager.advance(.5,observer,[region])` with `spawnOnFirstVisit=true`. Source hash, 6-attempt budget, 40-species rarity/habitat, exact real movement-ground support, `MobEngine.spawn`, actual engine snapshots and vertical section ownership were checked.

| Habitat | Floor / light | Births/64 | Passive | Hostile | Distinct species |
|---|---|---:|---:|---:|---:|
| Meadow | 4 / .8 | 28 | 28 | 0 | 9 |
| Forest | 4 / .8 | 44 | 30 | 14 | 18 |
| Desert | 4 / .8 | 13 | 3 | 10 | 3 |
| Snow | 4 / .8 | 19 | 15 | 4 | 5 |
| Alpine | 4 / .8 | 32 | 22 | 10 | 9 |
| Cave | -34 / .25, source section -2 | 43 | 2 | 41 | 16 |
| Wetland | 4 / .8 | 19 | 8 | 11 | 5 |
| Volcanic | 4 / .8 | 6 | 1 | 5 | 2 |

Sum **204 genuine original-engine natural newborns of 512 controlled habitat/seed cases**; 109 passive, 95 hostile. This is NOT a production or generated-M7 spawn rate. An independent 128-seed meadow fixture produced 54 newborns. Each newborn had correct physical support in the controlled ground, habitat, light, 5–26-block observer distance, original source homeChunk, section and transient newborn identity. Sixteen hazard-flagged meadow seeds had zero births.

Full actual original 40-species registry validated 20 passive + 20 hostile, all `implementation='preview'`; original bonding-eligible IDs `wolf` and `glownewt`. In a real original 128-cap MobEngine all forty distinct species admitted under a controlled flat-world source; `maxActive=32`. After `protectIdentity(glownewt)` and 13 half-second far-away original `PopulationManager` ticks, exactly the important dormant glownewt remained. This is a controlled six-second source behavior check, not live M7.

## Exact new native test file

`tests/mob-ecosystem-original-flat-habitat-matrix.test.mjs` blob `c5c0e54ba0d4cd41d03a7c503472d6018de22ecc` contains **13 original-import Node `node:test` cases**: complete 40-registry; eight 64-seed habitat matrices; hazard veto; unsupported-ground veto; default first-visit cooldown; and 40-original-mob six-second away/important lifecycle. Local Node 22.16.0 `node --check` PASS and `git hash-object` SHA matched the GitHub blob exactly. **13/13 exact authored cases PASS in controlled V8 using unchanged original source modules.** The complete original-repository Node import graph was NOT executed. Do not report 13/13 as CI/native full-repository acceptance.

## Required next gates and safety

Acquire the authentic full repository checkout. First run targeted `node --test tests/mob-ecosystem-original-flat-habitat-matrix.test.mjs` plus the previous original regional observer/census/away suites without redundant broad CI. Then real 3-seed/21-site original M7 generation using actual `FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR))`, the original `createWorldQuery` and `createMobHostView`, actual voxel collision, cave AIR and truthful residency/biome/light conditions. Measure original natural newborns, section ownership and protected far creature persistence with generated geometry; do not infer M7 counts from this flat fixture. Still mandatory: schema-1/Pack2 save invariants, original game player/world revision authority, iPhone landscape WebGL2/performance, installed offline Home Screen PWA, and staged-worker root acceptance. No new GitHub Actions, branch pushes, merges, deployments, settlements, builders, five hourly automations, other developer changes or protected-PR modifications. RELEASE HOLD.
