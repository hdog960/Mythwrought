# MYTHWROUGHT Mob Dev — source-authentic M7 mob host biome admission fence

Date: 2026-11-23. Status: **ISOLATED CANDIDATE / RELEASE HOLD**. This report describes exact original source functions with a controlled synthetic floor, **not** genuine generated M7 geometry, a full native repository import graph, or iPhone/PWA acceptance.

## Ref ownership and immutable starting point

Start from detached unreferenced commit `48eb682cdf43a8bb875c460e40f8c96b62753149` (direct parent `25e746ee23873795db9f7001994728341559a684`, Git tree `b8c095577826b5c9c1dc95440687b6ac7db254ea`). At session start, independently verified protected main `7016e14cd6289f45eaf7fc6a79a362b47996df65` and OPEN DRAFT/unmerged PR #380 HEAD `508209c5473d3d78668dd394eb6bcdf9e6bcff84`. Neither is modified by this source-only research. Local `github.com` DNS prevents an authentic repository clone; the connected MSI desktop reports OFFLINE.

## Actual original-source RED issue

Original `src/mobs/live-game.mjs` Git blob `51bb65928f3ba98213d531c4f2d38b79dc78cf37` defines `classifyLiveBiome(name,feet,cave)` with a fallback `TERRAIN_BIOMES[name] || 'meadow'`. This **turns unknown, null, and undefined source terrain classifications into an accepted meadow**, despite source-generated M7 ownership being unconfirmed. Its `createLiveMobSession()` passes the result as `biome.id` with `hazard:false` to original `createMobHostView()`.

The byte-authenticated original `host-view.mjs` `1a9585dd4afb12a0de47febcda5e5dd072d1f876` and `world-query.mjs` `a1c7548f636dc85381789a209199f14e2638606d` were executed with controlled solid-under-floor / air-above cells and the authentic original `sectionForY`. In that setup, a missing terrain biome originally produced `environment.biome='meadow', hazard=false`. The original real `spawnEligible()` would admit a supported meadow deer under otherwise eligible light/range. **This is a reproduced SOURCE classification weakness; no actual M7 world or production birth was inspected.**

## Detached source-only correction

Single-function edit in `src/mobs/live-game.mjs` (new Git blob `84f69492a722b03ef0714b2ec246cf5afe22f78a`): `classifyLiveBiome` now returns `null` for missing/unrecognized terrain names, instead of manufacturing meadow; it uses own-property membership on the existing exact approved five-V6-surface plus cave mapping. Underground cave override still requires source boolean `true` and a finite depth below -3.5. Known `plains->meadow`, `mountain->alpine`, `desert->desert`, `snow->snow`, `enchanted->forest`, and original cave stay unchanged. No additional preview-only biome gets activated. `createMobHostView` and original `createWorldQuery` already reject `null` with unknown/hazardous environment; original `spawnEligible` then disallows natural births. No changes to voxel/world/M7 generator, mob birth code, roster/saves, original `PopulationManager` private away ledger, UI or other developers.

## Exact reproducible tests

New test file `tests/mob-ecosystem-original-live-biome-admission.test.mjs` is Git blob `57a76d7e6fd5ee89647fb52eac119a266a9eac50`. It contains **16 native `node:test`-format cases**: eight canonical surface/cave names, strict cave/depth identity, missing/unknown/prototype inputs, original MobHostView + world-query blocked environment, original `spawnEligible` rejected deer with ground support, known plains eligibility, unloaded chunk rejection, certified deep cave host, and `createLiveMobSession` returning a hazardous environment for missing terrain. The test file passed local `node --check` under Node 22.16.0 and local `git hash-object` matched the GitHub blob SHA **exactly**.

**16/16 authored cases passed** when executed against the exact original function bodies from `live-game.mjs`, `host-view.mjs`, `world-query.mjs`, `ecology.mjs`, `engine.mjs`, `species.mjs`, familiar/original wildlife and hostile tactics registry, and `depth.mjs`, in a controlled V8 harness. ES module link syntax was adapted for in-memory evaluation. Test fixture terrain is synthetic; Pack2/biome shape dispatch and unrelated live-session service constructors were controlled stubs. The actual `createLiveMobSession()` function body, host query, and world-query function bodies remained byte-identical apart from the specified classifier change. **This is not complete native Node import-graph execution and not actual original M7 generated-world coverage.**

## Required native and iPhone gates

Once an authentic full checkout becomes reachable, execute the focused native test above plus earlier targeted MobEngine/global-census and original away-ledger cases, reusing prior exact-HEAD evidence to avoid redundant broad CI. Require genuine `FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR))` samples across three seeds and 21 actual world locations, with original `createMobHostView`/`createWorldQuery` and source-authoritative chunk residency/sky/terrain/cave data. Record physical AIR/collision/grounded samples, actual MobEngine natural admissions, unknown biome/depth rejection and player proximity. Verify original six-second `PopulationManager.#away` transitions, 40-species reachability, Schema-1+Pack2 save compatibility, WebGL2/iPhone performance, installed offline Home Screen PWA and worker-update acceptance. The classifier patch has not been profiled on iPhone and is **not activated** in the original production game.

**No merges, deployments, pushes to protected branches, new GitHub Actions jobs, CI cancellations, changes to five automations, settlements, other developers, Codex or builders.** All changes are isolated Git objects. Release remains on HOLD pending explicit integration authorization.
