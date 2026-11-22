# MYTHWROUGHT — Enchanted Forest Phase 2: Uneven-Edge Walking and Chunk-Local Probe Cache

**Development-only checkpoint — November 22, 2026.** Protected source child branch `research/enchanted-p2-physical-root-safety-20261121`; entry HEAD `47ad1587f811b6ecf896aecce00a1e9910c94db0`. Production `main` verified unchanged `7016e14cd6289f45eaf7fc6a79a362b47996df65`; protected parent `dev/enchanted-forest-overhaul-20261121-phase0` unchanged `db8cad02387050579c75cbdcdea3e94a9f6d6bee`.

This is **NOT** a merge, deployment, default-generator update or save migration. No other developer, cave, biome, settlement, Codex, five-automation, PWA or user-save files modified.

## Exact-source engine and development

Original `src/voxel.mjs` collision uses full-cube `BODY_RADIUS=.28` and `BODY_HEIGHT=1.78`. Because the player can straddle an x/z voxel edge or corner, foliage at body layer 1 or 2 **adjacent to** a raised natural ground cap can obstruct pedestrian access. The previous experimental clearing filter inspected the single vertical column directly below the leaf; that was not enough at a diagonal or an uneven biome edge.

- Updated `src/manual-biomes/enchanted-tree-walking-clearance.mjs` to examine the leaf column and all eight cardinal/diagonal **3×3 original terrain/cave/landmark columns**, for solid authoritative voxels exactly one or two below a proposed *experimental* leaf. Preserves source AIR, original cap geometry, caves/landmarks, solid candidate bark and existing user edits. Only leaves are discarded. Invalid/unknown solid source provenance fails closed rather than placing foliage in potentially occupied player space.
- A short-lived `Map` memoizes actual immutable original-source lookups within each tree, and `src/manual-biomes/environment-v7.mjs` now shares the same memo **only between multiple experimental candidate trees in the same transient chunk plan**. It is lazy, never stored in world data, never reused across seeds/chunks/edits, and never invoked on historical nonexperimental M7 or other biome generators. Copy-on-first-removal still avoids allocating leaf arrays for unmodified trees.
- No changes to `src/physics.mjs`, `src/voxel.mjs`, WORLD_MAX_Y=19, generator names or actual persistent saves. Four-root Giant authenticity, bark-first collision resolution and all face-connected nine-style bark shape guarantees remain enforced.

## Authentic exact-source native acceptance

New child-branch-only focused run [GitHub Actions #45038344114](https://github.com/hdog960/Mythwrought/actions/runs/45038344114), job `137256988869`, **exact source HEAD `bf138762b4dada28039972bd1146b379d3ee722f`: completed SUCCESS, 38/38 Node native tests PASS, 0 FAIL**. Full relevant original logs read.

- **1,689 actual previous-history walkable player standing positions** around source-authentic Starspire/Moonwillow/Ancient Giant sample locations still have collision-free AABB, **700 with unequal heights in neighboring original terrain columns**. Existing real bark excluded (22 body positions) because trunks are intentionally solid. Real ground support remains detectable.
- **2,502 actual natural source leaf voxels** over three seeds, six original chunks per seed, each required **all nine x/z support columns** to be real source AIR at both body layers; **2,921 natural tree voxels** total, with the original `FourRegionWorld` per-voxel reader agreeing with direct chunk planning.
- Genuine seed counts: **12 Ancient Giants** (seed 179: 5; seed 7919: 1; seed -88: 6), **48 authentic supported root corners**, no high-world Y19 breaches; **465 chunk-border voxels and 62 physical cross-chunk adjacent voxel pairs**; nine representative style variants retain **256 face-connected structural bark voxels**.
- Original six-chunk native `meshChunk` upload bytes: **963,360 historical vs 1,012,392 experimental** (~+5.1%). All actual chunk meshes pass unchanged **8,388,608-byte per-chunk cap**.
- Direct tests include the genuine original `collides` body plus ground-probe at every cardinal/diagonal neighboring location, a raised-cap-1 and cap-2 body overlap test, and original `stepPlayer` standing/corridor behavior. No production movement/physics code was changed.
- Existing preserved `FourRegionWorld.save()` refuses experimental candidate serialization under historical M7 generator identity; default M7 saves remain compatible.

## Measured source generation and efficiency — Node 22, NOT iPhone FPS

Exact preceding **uncached-across-tree** run [#45038128242](https://github.com/hdog960/Mythwrought/actions/runs/45038128242), source `5136db0a81cb70698436a9bfe9987a5167bc6912`, measured **106,516** real original-source callback reads on the same 3 seeds × 6 chunks × cold/warm passes = **36 chunk-generation passes**.

With the new ephemeral chunk-shared cache, current exact-head run measured **104,112 original-source callbacks** for the identical 36 passes: **2,404 fewer, 2.26% reduction**. All trees/source voxel parity still passes.
- Seed 179: 17,237 calls/pass, cold 419.398ms, warm 67.755ms; 684 candidate voxels.
- Seed 7919: 16,639 calls/pass, cold 158.251ms, warm 45.122ms; 1,032 candidate voxels.
- Seed -88: 18,180 calls/pass, cold 206.310ms, warm 71.244ms; 1,205 candidate voxels.
- Separate focused test with overlapping same-chunk mock crowns: shared cache **448→336 genuine baseline reads** (25% fewer) without changing either result. A 192-leaf all-AIR memoization case uses **400 actual source reads** vs **3,456 naive reads** (88.4% fewer).
- The timings above measure **Ubuntu Node 22 runner**, include cold source caching and testing overhead and are noisy. No FPS, frame-p95, device-memory or thermal claim is made. Verified cost improvement is **source callback reduction**.
- Only **five** sample native tree voxels were trimmed by 3×3 edge clearance in the three-seed/six-chunk sample versus its prior one-column clearance result (2,926→2,921), preserving nearly all sampled canopy geometry.

## CI-efficient development report

- Executed: two meaningful source revisions with **focused native** evidence, first #45038128242 **37/37**, then final #45038344114 **38/38**, rather than broad browser or full repository suites. The second run is genuinely necessary because shared-cache source and an affected regression test changed.
- Reused: prior exact historical source defaults, physical roots and original-game visual evidence where related code did not change. Never claim old screenshots prove the new canopy silhouettes.
- Avoided: duplicated complete CI runs, repeated GitHub Actions queue audits, unneeded Chromium/WebGL2 screenshots, other developer workflows, cancellations, protected branch updates or release gates prematurely.
- Outstanding: actual current-source original-game WebGL2 image and physical walking review across more uneven enchanted biome shoulders; physical iPhone 17 Pro Max Home Screen PWA long-walk FPS/p95 and chunk/frame budgets; separately approved versioned generator identity, compatible saves/reloads, and all required full-release safety checks. Experimental trees still opt-in and **unsaveable under historical M7**.

**Result:** original-source walking clearance, bark connection, M7 3-seed census, chunk seams and native GPU upload caps are source-accepted for the exact commit above. No release or physical-device acceptance is implied.
