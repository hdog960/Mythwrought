# MYTHWROUGHT Living Ecosystem — original spawn admission post-support source witness

Date: 2026-11-23. Status: **detached source engineering; release HOLD**. This is not a native full-repository M7 test or a deployed gameplay update.

## Exact immutable starting point and ownership

Start at unreferenced detached commit `7b51180759c3c00a68b82d9f06fd12477bf1bc39`, parent `1ea325e7e9c8a79a69f0d30614461ba2faca7de0`, independently verified source tree `9909ed78505bb78a4d0aec2e862d21aa5aea203e`. The exact starting source `src/mobs/ecology.mjs` Git blob was verified by path at that commit as `b145ab48d5a993f0796b1b321ce2b0ba0a7e1b23`.

Protected refs verified once at session beginning: production main `7016e14cd6289f45eaf7fc6a79a362b47996df65`, OPEN DRAFT/unmerged PR #380 HEAD `508209c5473d3d78668dd394eb6bcdf9e6bcff84`. Neither ref was moved. Connected MSI desktop is OFFLINE and direct `git ls-remote` cannot resolve `github.com` DNS; original complete repository checkout is unavailable.

## Authenticated original-source failure — after habitat or support reads

Original `spawnEligible(world,species,point,observer)` computes a 5–26-block observer range, obtains `world.environment(point)`, validates biome/light/depth/hazard and then calls the source physical `world.grounded` (or swim `world.volume`/`world.medium`). It has no final recheck of original world revision, source 3D point, observer position or residency. A callback can change any of those inputs while returning otherwise eligible habitat/ground, and old source still returns **true**.

Exact original source bodies used: `ecology.mjs` `b145ab48d5a993f0796b1b321ce2b0ba0a7e1b23`, `engine.mjs` `57721eb659b154ad93fd45182cc2bc70eb961d9c`, `movement.mjs` `72671c1340c63984581128ba585eec72d5875acc` (real `supportedPosition`), `depth.mjs` `b54b7fd8c422699a328b60135178f97508e277c8`, original 40-species `species.mjs` `2b49e5e053051fda760b264895785b75c855c7b4`, plus familiar `64f7e9a4dad79523201d7646572f65fd93dda9ea`, original wildlife `c04543445e73e0b21ea35c54d3901363a21be462`, hostile `46ea5d437db2c2ff615cc9a61d8058e85de7c3e2`.

In controlled V8 with those exact original class bodies (ES module linkage substituted in memory; synthetic physical floor/sky/terrain callbacks), the original `spawnEligible` returned `true` after either `environment` or `grounded` callbacks (a) incremented world revision, (b) moved the sample point, (c) moved the player/observer, or (d) unloaded the source chunk. In a separate first-due-tick `PopulationManager.advance(.5,...)` for meadow seed 1, a world environment callback incremented revision during eligibility: original `MobEngine` nevertheless admitted a real source `cow` at `[0.5,4,10.5]`. This is **source-interface controlled-fixture evidence**, not an observed M7 world corruption.

## Narrow correction — no production activation

Change only original `src/mobs/ecology.mjs` inside `spawnEligible` (new candidate Git blob `939de7cb5f39307a7da13a327e894d71d6510756`). Before the habitat/support checks, privately capture exact point/observer vectors and the optional `world.revision()` value. Retain all original habitat, rarity, light, depth, support, swim, proximity and range decisions. After the support checks, reject altered point/observer coordinates using `Object.is`, reject a resident check other than `true` when `residentAt` is available, and reject a changed authoritative revision when available. Finally recheck the source coordinate identities to reject changes made by the revision callback itself. These are **read-only** checks; do not compute or replace private `PopulationManager.#away`, do not change spawning budgets or original species order.

Worlds without a `revision` hook retain legacy compatibility, but cannot obtain authoritative world-version certification. The protection is bounded and NOT transactional: it does not prevent mutation after the final check, engine-side edits inside `MobEngine.spawn`, malicious change-and-revert (ABA), callbacks with hidden external state, or a missing/forged revision authority. Actual original game host provides a revision callback, but this has not been tested in a full native M7 world.

## Reproducible focused evidence — exact native-format test

New `tests/mob-ecosystem-original-spawn-final-source-fence.test.mjs`, Git blob `98c5833bea61bf374b06ae10a0b802ac7f67be4e`. It has **14 actual `node:test`-format cases**: stable source admission, eight changed input cases across environment and ground callbacks, backward compatibility without revision, unresident source rejection, original manager source-edited first-tick veto, original stable meadow seed-1 cow, and a six-habitat × 64-seed = **384** controlled source baseline. Baseline 1-tick births: meadow 28, forest 44, desert 13, snow 19, alpine 32, cave depth -34 / section -2 43; total **179**. The original 40-species order, `MobEngine`, supportedPosition and sectionForY bodies were not modified.

**Controlled exact-source V8 comparison:** original ecology **4/14 PASS; 10/14 expected RED**, corrected ecology **14/14 PASS** on exactly the authored test functions. The local Node 22.16.0 `node --check` succeeded on the exact source file, and local `git hash-object` matched the created GitHub test blob **`98c5833bea61bf374b06ae10a0b802ac7f67be4e`** (5220 UTF-8 bytes). The full native Node ESM import graph was **NOT** executed; no root GitHub Actions job or browser job was started. These tests use controlled synthetic flat terrain, **NOT genuine source-generated M7 geometry**.

## Next mandatory gates and CI coordination

Reacquire an authentic original full repository checkout, then run targeted `node --test tests/mob-ecosystem-original-spawn-final-source-fence.test.mjs` along with prior changed-source Mob Dev tests (original host-after-callback, live-biome fail-closed, region observer/census, six-second private away) with no duplicate full CI for unchanged revisions. Run actual `FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR))` across 3 seeds/21 physically generated sites using the real MobHost/world-query, original cave AIR, residency, biome and light; capture genuine natural MobEngine newborns and original six-second away/important state. Then enforce original Schema-1 and Pack2 compatibility, iPhone landscape WebGL2/p95/performance, installed offline Home Screen PWA and mandatory staged-worker acceptance.

Every accepted original poll can check up to six candidates. The patch adds small per-candidate vector copies plus optional one source resident and up to two revision reads for potentially eligible candidates. Measure real iPhone performance; no simulated benchmark can waive that gate. **Never merge, deploy, move protected refs, cancel jobs, weaken checks, alter other developers/Codex/builders/settlements/biomes/caves, or change the five hourly automations.** Release stays on HOLD pending separate creator approval.
