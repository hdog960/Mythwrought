# MYTHWROUGHT — Enchanted Forest Phase 2: Bounded Source Cache and Continuous Hillside Walking

**Standalone, protected, source-only engineering checkpoint — November 22, 2026.**
No merge, deployment, cancellation, shared workflow changes, historical M7 generator/save version changes, user-world writes or physical iPhone release assertion.

## Exact protected refs and source revision

- Entry isolated child `research/enchanted-p2-physical-root-safety-20261121`: `797adf6de8769025551605216abb6e6de36073b6`.
- Production main, verified once at entry: `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Protected parent `dev/enchanted-forest-overhaul-20261121-phase0`, verified once at entry: `db8cad02387050579c75cbdcdea3e94a9f6d6bee`.
- **Exact tested source HEAD:** `15f7521f92954d1861163d2a295712c8483b5975`.
- The original experimental trees remain opt-in only. `FourRegionWorld.save()` still refuses the experiment under historical M7 generator identity; every source/default/save regression passed at the exact source commit.

## Actual code engineering (not a CI-only change)

1. **Strict mobile-oriented memory bound.** New `src/manual-biomes/enchanted-tree-source-cache.mjs` exports an original-source `Map` subclass with **MAX_ENTRIES = 2048**. A new unique key evicts the oldest original-source reading when the cache is full (FIFO), using O(1) insertion. A cached key keeps its original insertion order; evicted original-source AIR, solid cave/landmark, or undefined states are re-read from the authoritative original M7 reader and never guessed. The bound is in entries, **not a measured or guaranteed byte-size memory budget**. Instance lifetime is one synchronous, experimental enchanted-tree **chunk plan only**, not a persistent world or save cache.
2. **Integrate without modifying historical gameplay.** `src/manual-biomes/environment-v7.mjs` constructs the bounded source cache lazily for opted-in Enchanted candidate generation only. It shares the same hard-cap cache among real root support, AIR/protected-landmark preflight and 3×3 AABB leaf-walking clearance. The historical/default M7 and all other biome write paths are unchanged; no changes to `physics.mjs`, `voxel.mjs`, `main.mjs`, cave source, seed/density rolls, protected settlements, world height or saved edits.
3. **Optional native diagnostics.** A per-call `onCandidateCacheSummary` callback reports only an immutable `{entries,peakEntries,evictions,limit}` object to focused source tests. It is not used in gameplay, does not retain a cache reference or expose world mutation.
4. **Authentic continuous multi-step walking.** New `tests/manual-biomes/enchanted-tree-multistep-diagonal-real-m7.test.mjs` uses original `FourRegionWorld`, unchanged `stepPlayer` and real M7 cave/landmark/terrain, with **one moving player object retained across three legs** (no resetting position or velocity between legs). It samples naturally grounded routes near genuine Starspire, Moonwillow and Ancient Giant source sites, requires a diagonal leg and terrain elevation change, admits paths only when historical M7 actually traverses them, and excludes intentionally solid new mineable bark. It then proves experimental foliage does not block these same historical routes. This is a native simulation, not a screenshot, synthesized geometry or physical iPhone test.

## Authenticated exact-source native proof

**One focused** [GitHub Actions run #45044463467](https://github.com/hdog960/Mythwrought/actions/runs/45044463467), job `137275905749`, source `15f7521f92954d1861163d2a295712c8483b5975`: **SUCCESS, 44/44 native Node 22 tests, 0 failed.** The original job logs were inspected. The existing child-branch-only focused workflow ran 12 affected Enchanted Forest source test files, no browser, installation, unrelated suites, or workflow cancellations.

New exact-source evidence:
- **48 actual M7 densely sampled chunk plans** (three seeds 179/7919/-88 × 4×4 region), **8,474 actual naturally authored tree voxels**, original world source parity with independent cold-reader world instances, preservation of original cave/landmark AIR, all saved-world restrictions intact.
- Peak cache occupancy **exactly 2,048 entries**, never exceeded in any sample. **14,172 genuine FIFO evictions** across the 48 sample chunk plans, with original-source regeneration producing exactly the same voxel/material maps despite evictions (seed179=2,410 source cells and 4,844 evictions; seed7919=3,040 and 4,077; seed-88=3,024 and 5,251). This verifies a hard entry-count limit and determinism, not a bytes-per-chunk heap bound or safe iPhone FPS.
- **Nine genuine continuous 3-leg pedestrian routes** with actual original `stepPlayer` and no inter-leg teleport: 3 Starspire, 3 Moonwillow, 3 Ancient Giant; **six routes contain an uphill leg, three a downhill leg, nine contain a diagonal leg**, and no corresponding previously walkable route was blocked. Test deliberately does **not** claim a single route with both up and down (current `mixedRoutes=0`), nor whole-forest pathfinding acceptance.
- Previous 48 individually traversed real one-step M7 uphill/downhill routes remain green (24 ascent, 24 descent); **1,689 original source AABB standing positions**, 700 uneven-ground comparisons, and authentic `BODY_RADIUS=.28`, `BODY_HEIGHT=1.78` remain green.
- **12 naturally eligible Ancient Giants**, 48 authentic supported footing corners, 2,921 sampled candidate tree voxels, 465 chunk-border voxels, 62 physical cross-chunk adjacency pairs; nine style variants remain face-connected, Y19 ceiling stays unchanged.
- The previous exact 36-pass original source-read comparison remains **79,456 callback reads** versus pre-optimization 104,112 (**23.68% fewer**) on identical 3 seeds × 6 chunks × cold/warm Node 22 sample. The bounded cache passed that source parity and cost test with **no added reader callbacks on this sample**. The independent denser 48-chunk stress has many evictions and **was not benchmarked for per-chunk native CPU latency relative to an uncapped version**. Avoid claiming speedups there.
- Six-chunk original `meshChunk` sample still passes unchanged 8,388,608-byte per-chunk GPU upload bound; aggregate historic 963,360 vs experimental 1,012,392 bytes (~5.1% increase). This is mesh upload size, NOT physical iPhone framerate, thermal or p95.

## Shared CI efficiency

- **Executed:** exactly one new source-focused native job #45044463467 on meaningful changes, 44/44.
- **Reused:** previous original-source 39/39 run #45041987785 and earlier baseline evidence only for still identical underlying code. No repeat GitHub Actions queue audits, full-repository suites, Chromium 12-image captures, or other developers' tests.
- **Outstanding:** dense-forest **measured per-chunk native CPU/source callbacks under eviction** and actual JavaScript heap/peak memory on a physical iPhone, broad genuine continuous routes including mixed ascent+descent and diagonal uneven cliffs, original-game changed-tree WebGL2 visuals, installed Home Screen PWA FPS/p95/streaming, and separately approved generator identity + version-safe saved-world migration before any production release.
- No merges, deployments, CI cancellations, changes to production main/parent, builders, settlements, automations, other biomes, Codex or PWA.

**Engineering conclusion:** the source-level 2048-entry cap and original-game continuous three-leg diagonal hillside route regression are native-accepted on the exact tested commit; production release is still blocked by the explicitly outstanding original-game/iPhone/versioning gates.
