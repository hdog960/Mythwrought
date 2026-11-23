# MYTHWROUGHT Living Ecosystem — explicit original source-revision authority bridge and native M7 save dual gate

Date: 2026-11-23. **UNREFERENCED DETACHED ORIGINAL-SOURCE ENGINEERING; RELEASE HOLD**. No release, main/PR branch movement, GitHub Actions, original browser, generated M7 or iPhone acceptance this session.

## Starting protected state and immutable provenance

Exact starting unreferenced detached commit **`de45beae3bfbf89359f45901e31eeb3a55e154df`**, parent `39457c966ae42a5f1cf6306b9bf03e325a0e58cc`, verified Git tree `cb5be3a1e4d878062cc9929a16d3f6f386961e46`. The protected production main was externally advanced to **`db4bbcc32156e5df311f733bcaa53d559c17313b`**, verified this session; previous main `7016e14cd6289f45eaf7fc6a79a362b47996df65` is a *historical baseline only*. PR #380 remains **OPEN DRAFT**, unmerged and independently verified at `508209c5473d3d78668dd394eb6bcdf9e6bcff84` (its own base metadata still references the previous main). Do not reset/rebase/cherry-pick or modify external main or that draft. MSI desktop OFFLINE 672+ hours; local Node 22.16.0 and git available but direct `git ls-remote` fails github.com DNS.

## Source-derived authority gap — reproduced, not inferred

Exact original `src/voxel.mjs` blob `543677a61aff7f54c0111f2485be79fbbbd560c6` (the detached world-source baseline) and `src/pack2-world.mjs` blob `e8326c3ddb264a1e44985cd6d265ff0970b86467` were read directly: neither declares or forwards a monotonically incrementing `editRevision`. Latest externally updated production `src/voxel.mjs` blob `a475ba9c195e6dd4bc5a97284dbff5f2c37936a4` also has no `editRevision` member. Existing exact detached `src/mobs/live-game.mjs` blob `ef38f87603eb3247c22d183afc12c7ad5bbc28ac` provides `revision:()=>world.editRevision||0` to original MobHost. On authentic original VoxelWorld/Pack2LiveWorld this is only a constant-zero *fallback*, **NOT** edit authority. The previous host post-callback fence and spawn-final-source gate can prevent chunk-unload/coordinate changes but **cannot conclude that original live-world writes are version-detectable** from that callback. Any previous claim of full game mutation fencing without an authentic edit authority would be incorrect.

## Narrow owner-scoped source change: injectable trusted authority

Change only the `createLiveMobSession` optional argument interface and revision selector in `src/mobs/live-game.mjs` from previous exact blob `ef38f87603eb3247c22d183afc12c7ad5bbc28ac` to **`a973ef3bf5acb7b6a3c9a818e7e368cbd34bd641`**.

- New optional `sourceRevision` argument, **a trusted synchronous monotonic function** returning authoritative original physical-world revision. Invalid supplied values are rejected `TypeError('Invalid live mob source revision authority')`.
- When provided, forward that exact callback to original `createMobHostView`, so already-committed host and spawn admission source read fences receive a changing revision. A change during original biome, cave, sky, or physical-world queries fails closed through existing source eligibility checks.
- When omitted, preserve existing `()=>world.editRevision||0` byte-semantically, keeping current legacy, new M7 opt-in, save, mob rendering and caller behavior unchanged. **The current production caller `src/main.mjs` does not provide this hook, and this commit does NOT wire one. The live game still lacks authoritative world-edit revision.** Exposing a parameter is only a safe integration prerequisite: separately coordinate true edit authority with world/save owners, without patching `world.set`, modifying the game main, or assuming the test-only M7 mutation witness is production-safe.
- No mutation of world/Schema-1/Pack2, no edits to existing original MobEngine, PopulationManager private `#away`, renderer, world-query, M7 geometry or external developer lanes.

## Exact 13-case original-import test and controlled V8 reproduction

New `tests/mob-ecosystem-original-live-source-revision-authority.test.mjs` Git blob **`c4c398a3de368087db36d0d8fa2cb7491c1bb90d`**, 6019 UTF-8 source bytes, **13 native `node:test`-format cases**:
1. real imported original `VoxelWorld` and `Pack2LiveWorld` have no `editRevision` (requires authentic original native Node imports; **UNRUN**);
2. legacy zero fallback remains, explicitly labeled nonauthoritative;
3. supplied sourceRevision reflects changing source state;
4. bad supplied authority values throw;
5-7. biome/cave/sky source callbacks increment the version; original live MobHost refuses those environments;
8. source revision increment during physical support makes original spawnEligible refuse a deer;
9. stable original M7 physical habitat retains eligibility;
10. non-M7 source remains on the original physical reader;
11. prior `editRevision` getter fallback remains supported;
12. actual original PopulationManager refuses a natural first-tick stale-world admission when a trusted callback changes during sky;
13. read-only callback does not write terrain or mob saves.

The exact authored source was evaluated in controlled V8 with **unchanged original** `MobEngine` blob `57721eb659b154ad93fd45182cc2bc70eb961d9c`, original corrected ecology `939de7cb5f39307a7da13a327e894d71d6510756`, authentic HostView `4aaaadbc437cf38dbb31ce379325fde6a15aa60f`, world-query `a1c7548f636dc85381789a209199f14e2638606d`, M7 collision reader `f8cbef4a7868246f7bb11eec0bca1d40f83eab72`, original species registry `2b49e5e053051fda760b264895785b75c855c7b4` and wildlife/tactics, movement `72671c1340c63984581128ba585eec72d5875acc`, depth `b54b7fd8c422699a328b60135178f97508e277c8`. Only in-memory module linkage, terrain `get` and unrelated session-service mocks were replaced. **12 of the 13 cases were actually run in controlled V8**; first genuine original-world constructor/import test was explicitly DEFERRED. Old live code: **5/12 PASS, 7/12 expected RED**; new callback code: **12/12 PASS**. This is **NOT a 13/13 native Node run**, NOT actual M7 world testing, and cannot prove production edit authority.

## Existing 3-seed/21-site REAL M7 test strengthened — still UNRUN

`tests/mob-ecosystem-original-m7-three-seed-real-births.test.mjs` changed from blob `c6baad172eccbe429e9597101811400b655ca45a` to new blob **`ca55529ae610637da8507f2e3d9ab6a22b8bb313`**. Its source-native test remains **UNRUN**. It still creates actual original `FourRegionWorld` + `Pack2LiveWorld` at seeds 179, 379, 1001, genuine canonical 5 surface biome sites + two deep historical cave sites per seed, genuine MobEngine and original PopulationManager 40-half-second ticks/site, records measured newborn IDs/physical fit and section ownership without inventing birth counts.

Previously it checked only source Schema-1 saved bytes at the end of each complete seven-site seed tour. It now also compares the **original `Pack2LiveWorld.pack2Snapshot()` before/after each entire seven-site seed tour**, documenting that save snapshots at seed boundaries are safe; it avoids computationally expensive per-candidate/iframe serialization. Explicitly labels lack of original `editRevision` as a test limitation; **does not inject fake constant-zero authority**. Real tests may legitimately record zero births at a site; no thresholds assumed.

## Mandatory next steps and CI safety

First obtain authentic full repository checkout. Then run targeted native `node --test tests/mob-ecosystem-original-live-source-revision-authority.test.mjs tests/mob-ecosystem-original-m7-live-collision-optin.test.mjs tests/mob-ecosystem-original-m7-three-seed-real-births.test.mjs`, including earlier changed-source host/spawn and original six-second away cases as warranted. Reuse exact-head results; coordinate original generated 21-site M7 with other developers to avoid repeated costly CI. On real source worlds, verify actual physical M7 mountain/enchanted support, cave AIR, original direct births, residency, source classifier and save+Pack2 unchanged. A genuine production edit-revision authority must be introduced by owner-approved integration and wired into the caller in a separate approved lane. Never monkey-patch world source mutation methods or substitute test-only expensive Schema-1/Pack2 snapshot witness into iPhone hot paths. Measure iPhone landscape WebGL2 p95/perf, original mob target counts and installed offline Home Screen PWA before any release.

No Git refs, merges, deployments, redundant Actions, cancellations, Codex, builders, settlements, caves/biome owners or five hourly automations modified. **Release HOLD.**
