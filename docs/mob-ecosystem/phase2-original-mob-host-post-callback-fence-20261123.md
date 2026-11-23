# MYTHWROUGHT Mob Dev — original host environment post-callback revision and residency fence

Date: 2026-11-23. **ISOLATED ORIGINAL-SOURCE CANDIDATE; NO LIVE INTEGRATION; RELEASE HOLD.**

## Exact protected refs and parent

Starting **unreferenced detached commit** `1ea325e7e9c8a79a69f0d30614461ba2faca7de0`, direct parent `48eb682cdf43a8bb875c460e40f8c96b62753149`, verified tree `196ae6edc6de7f9c295d31301b8fd2636314b619`. Session-start checked main `7016e14cd6289f45eaf7fc6a79a362b47996df65`; OPEN DRAFT/unmerged PR #380 HEAD `508209c5473d3d78668dd394eb6bcdf9e6bcff84`. No protected references touched. The original `src/mobs/host-view.mjs` at the exact starting detached ref was individually verified as source blob `1a9585dd4afb12a0de47febcda5e5dd072d1f876`.

The connected MSI Desktop Commander was OFFLINE, and direct `git ls-remote https://github.com/hdog960/Mythwrought.git HEAD` failed DNS locally. **Complete original checkout and native ESM Node import tests are NOT available**. No GitHub Actions were started.

## Reproduced original-world boundary failure

Original `src/mobs/world-query.mjs` blob `a1c7548f636dc85381789a209199f14e2638606d` checks residency **before** calling the MobHost environment observer. Original `createMobHostView` (`src/mobs/host-view.mjs`, blob above) then obtains biome, cave, sky and object supplier results and returns `hazard:false` for a valid-looking sample **without checking residency, world revision or position after those callbacks**.

With unchanged original `createWorldQuery` and `createMobHostView` function bodies, a controlled synthetic solid-under-floor voxel world, real source `sectionForY` from `src/depth.mjs` `b54b7fd8c422699a328b60135178f97508e277c8` and explicit caller callbacks:
- biome, cave, sky or objects callback incremented the source revision 0 -> 1; the old host still returned `environment.biome='meadow',hazard=false`.
- sky or objects callback unloaded the source chunk; old host still returned safe meadow.
- biome, sky or objects callback mutated the sampled point array after initial section read; old host accepted mixed coordinates.
- With the actual original `MobEngine` `57721eb659b154ad93fd45182cc2bc70eb961d9c`, `PopulationManager` `b145ab48d5a993f0796b1b321ce2b0ba0a7e1b23`, `supportedPosition` `72671c1340c63984581128ba585eec72d5875acc` and complete original 40-species registry, a seed-1 first tick admitted a mob in the controlled world **after the sky callback advanced its world revision**. The bug is in source time-of-check/read consistency; this is **not a witnessed M7 generation failure or production creature birth**.

## Narrow, read-only source correction

`src/mobs/host-view.mjs` new source blob `4aaaadbc437cf38dbb31ce379325fde6a15aa60f`. Preserve original accepted biome/cave/sky/object validation, object whitelist, shape collision and render/physics API. Own a private local `query` returned by `createWorldQuery` (no module import changed). During each original environment observe:
1. Freeze the caller sample's 3D coordinates and read available source `revision()` **before** calling biome, cave, sky and object suppliers.
2. After existing permitted-object copying, ensure the sampled point coordinates were not rewritten (`Object.is` including -0).
3. Recheck actual original `query.residentAt(originalPoint)` **after** all supplier callbacks.
4. Compare the post-residency world revision with the initial value if a revision callback was supplied. Refuse mismatches by returning `null`; the unchanged original `createWorldQuery.environment` then reports `biome:null,hazard:true`, so `spawnEligible` refuses births.

No read-only guard can prove complete atomicity against a malicious callback changing and reverting before checks, side effects after final checks, or missing revision authority. One extra authoritative `residentAt` call and up to two `revision()` calls per completed host environment query are required; source callback cost and original iPhone WebGL2 performance MUST be independently profiled. No new entity/voxel mutations, biome registry changes, schema-1 writes or six-second `PopulationManager.#away` edits.

## Focused exact original-source evidence

Authored `tests/mob-ecosystem-original-host-world-residency-after-callback.test.mjs` Git blob `995420b0f838b87669ed91919a92c8e9c475a9e6` (16 native-`node:test` format cases). Byte-exact file and original function bodies were interpreted with import/export linkage adapted only in controlled JavaScript V8; original engine, ecology, species, movement, depth, host-world query, specimen collision logic unchanged. The synthetic voxel reader, residency/edit revision, biome/cave/sky/objects and shape registry dependencies are **controlled fixtures**, not full M7 physical worlds.

**Old original host on exact tests: 4/16 PASS, 12/16 RED**. **Corrected host on the same tests: 16/16 PASS**. Cases include stable permitted-object retention, edits during each of four suppliers, unloads during sky/objects, point mutation during biome/sky/objects, certified physical deep cave (-34), initial missing resident, strict original spawnEligible rejection/acceptance, and original MobEngine/PopulationManager seed-1 birth on stable vs sky-edited source.

**Separate, additional evidence:** the old and corrected original MobHost functions were compared with the same authentic original MobEngine, original PopulationManager, 40-species registry, movement and sectionForY bodies across **six actual V6/cave *categories*** on controlled original flat voxel ground: meadow, forest, desert, snow, alpine, cave. **384/384 seed/habitat cases match exactly** for first-tick result, species, position, homeChunk, state and six-attempt count. Counts per habitat (old == corrected): 28 meadow, 44 forest, 13 desert, 19 snow, 32 alpine, 43 cave, total **179 natural births in each controlled 384-case sample**. This comparison DOES NOT mean the test ran 384 physically generated M7 sites or original browser scenes.

## Nonwaivable next gates

Original complete-repository native `node --test tests/mob-ecosystem-original-host-world-residency-after-callback.test.mjs` and earlier targeted MobEngine/PopulationManager/roster/region/away/global suites remain **UNRUN**; no root CI job or broad redundant testing was queued. Run only when a true checkout is accessible. Genuine M7 three seeds/21-sites via actual `FourRegionWorld(...,M7_ENVIRONMENT_GENERATOR)`, real `createMobHostView`/`createWorldQuery`, authoritative surface/cave/sky residency, physical collisions, AIR preservation, real newborn admission counts and source-six-second away history still need native execution. Preserve Schema-1+Pack2 saves, protected landmarks, iPhone landscape WebGL2 frame budget, installed offline Home Screen PWA and staged-worker root gate. Separate creator authorization required for any release/integration/merge/deployment. No builders, settlements, five automations, Codex, other developer branches or protected refs modified.
