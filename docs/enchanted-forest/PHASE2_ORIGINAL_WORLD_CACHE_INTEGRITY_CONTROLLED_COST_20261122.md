# MYTHWROUGHT — Enchanted Forest Phase 2: Immutable Cache Integrity and Controlled Original-World Source Cost

**Isolated source-only checkpoint, 2026-11-22. Not a release, production change, save migration, original WebGL2 acceptance, or physical iPhone measurement.**

## Exact protected baseline and acceptance

- Entry isolated branch `research/enchanted-p2-physical-root-safety-20261121`, exact HEAD `a73fdaa5dc0fea13e2b97e4585bdd04083bdbb19`.
- Production `main` verified `7016e14cd6289f45eaf7fc6a79a362b47996df65`, unchanged.
- Protected Enchanted parent `dev/enchanted-forest-overhaul-20261121-phase0` verified `db8cad02387050579c75cbdcdea3e94a9f6d6bee`, unchanged.
- Previous immutable V6 metadata cache acceptance [Actions #45076884318](https://github.com/hdog960/Mythwrought/actions/runs/45076884318) tested source `f641f14c96536c9ecb81e16606af32d1e88ae173`: 6/6 native, 288 original-world chunk builds, 17,877 ordered tree voxels, 724 cache hits, 308 cross-chunk face pairs.
- **New exact native-tested source commit `f5378687bcd4d8b03fa929b5927ca8aca6902d18`**, focused [Actions #45078536456](https://github.com/hdog960/Mythwrought/actions/runs/45078536456), job `137381134131`: **SUCCESS, 6/6 genuine Node 22 native tests PASS, zero failures.**
- Prior unchanged Moonwillow visual [Actions #45057456018](https://github.com/hdog960/Mythwrought/actions/runs/45057456018) and earlier 288-chunk density admission proof reused where source bodies were untouched.

## Real source bug fixed: mutable cached classifications

The `EnchantedSiteBiomeCache` previously checked whether a biome object was frozen when created through `getOrRead`, but **direct inherited `Map.set` accepted mutable or malformed objects**. A shallow-frozen object with a mutable nested `center` array could also be retained and subsequently changed. That contradicts the explicit invariant that only immutable seed/x/z-dependent V6 biome metadata may persist between tree-chunk rebuilds.

Changed `src/manual-biomes/enchanted-tree-site-biome-cache.mjs`:
- Validate all inserts **before mutating or evicting the existing bounded FIFO**.
- Accept a valid canonical seed/x/z key and only `null` (the real Plains classification) or a frozen, source-compatible V6 classification with a frozen two-number `center` array, finite bounded weight and one of `mountain`, `desert`, `snow`, `enchanted`.
- Validate safe coordinate integers at the `getOrRead` boundary; reject mutable, malformed or unbounded values without evicting good entries.
- Keep original hard maximum **128 site-biome entries**; no global singleton, no persistence, no cached terrain/caves/landmarks/edits/tree shapes or changed original gameplay source reads.
- Historical M7 remains on the original classifier and allocates **no** new cache. Experimental candidate generation remains explicitly opt-in and cannot be saved under historical M7 generator identity.

Changed the focused integrity test to cover direct invalid writes, bad nested mutable centers, invalid classification names, invalid keys, unsafe coordinate integers, valid deeply frozen entries, hard FIFO eviction and zero mutations on rejected entries.

## Controlled original-world workload: matched denominators

New `tests/manual-biomes/enchanted-site-biome-controlled-cost-real-m7.test.mjs` constructs independent real `FourRegionWorld` instances with the **same original source, seed and ordered connected chunk requests**, differing **only** by the optional experimental site-classification memo. It uses actual `_environmentTreeAt`, not a mocked forest mesher. Four 32-chunk tracks cross real V6 Enchanted, Plains, Snow and Desert climate areas at seeds 179 and 7919.

Each of 128 steps alternates which world is generated first (AB/BA), compares **every ordered (x,y,z,ID) voxel** from both real tree-chunk Maps, verifies authentic original cave/landmark AIR source, real 16-chunk ownership, 64 resident chunk bound, 128 metadata entry bound and original historical/experimental save behavior.

Exact measured source values on current source:
- **128 real original-world chunk builds, 11,490 tree voxels, zero differences**, 210 physical cross-chunk face pairs; **11,490 native authoritative source AIR checks**, all passed.
- **996** matched eligible site classifications **without** a memo vs **685 original V6 classifications** with it: **311 actual V6 classifications avoided (31.2249%)**. New bounded cache logged **311 hits, 685 misses, 429 safe evictions**, 128 peak entries.
- Cache residency bounded at **128** classification entries, original resident tree-chunk Maps bounded at **64**.
- Cumulative CPU, **Ubuntu Node 22 test runner only**: with memo **681.5031 ms**, without memo **688.7166 ms**. Cached p50 **0.734 ms**, p95 **19.5884 ms**; no-memo p50 **0.7843 ms**, p95 **18.4151 ms**. Long-tail samples vary and the total measured difference is small compared with the original terrain source workload. **Do NOT claim improved iPhone FPS/p95, actual iPhone memory, or a guaranteed speedup from these timings.** These are observational measurements, not CI pass thresholds or controlled microbenchmarks in a production browser.
- Existing 288-chunk original-world source resident test also passed: **17,877 ordered voxels, 308 cross-chunk face pairs, 724 metadata hits**, all six original 64-chunk FIFO reload checks and cave/landmark provenance veto.
- Original `stepPlayer` native mobility proof passed again on this changed cache: 9 original-to-candidate connected 3-leg diagonal walks and 3 four-leg loops, each combining ascent/descent and 2 diagonals near the authentic three tree species. No teleporting between legs, no physics source changes.

## Focused CI and boundaries

- **Executed:** exactly one focused source-native job on the changed cache and tests: 6/6 PASS. No broad original repository tests or new Chromium runs.
- **Reused:** prior density gate, Moonwillow original-engine visual and native GPU/physical root evidence for unchanged source.
- **Avoided:** redundant native tests, repeated queue audits, unrelated developer jobs, full Chromium screenshots, merges, deployments and cancellations.
- **Outstanding:** genuine live browser/PWA original WebGL2 chunk-generation and resident GPU measurements, physical iPhone 17 Pro Max installed Home Screen PWA FPS/p95, JS heap and thermal behavior; more broad cave- and biome-transition pedestrian journeys; separately approved generator-version migration and historical save preservation before any production enablement.
- Other developers, builders, five hourly automations, Codex, all other biomes, caves, settlements, production `main`, protected parent and user saves remain untouched.

**Result:** The source-immutable cache contract is now enforced even through direct Map writes. Its benefit is **311 fewer real V6 classification calls per 128 matched original-world chunks without changing a single source tree voxel**; the CPU observations are too small/noisy to establish user-device performance.
