# MYTHWROUGHT — Enchanted Forest Phase 2: Immutable Site-Biome Reuse in Original World

**Standalone experimental source checkpoint — November 22, 2026. NO production merge/deployment, save migration, browser/device acceptance or other developer changes.**

## Exact inputs and protected refs

- Isolated child `research/enchanted-p2-physical-root-safety-20261121`, entry HEAD `ab95c4e0978ffd748e22b1e0a390dfe73e2d9947`.
- Protected `main` unchanged `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Protected parent `dev/enchanted-forest-overhaul-20261121-phase0` unchanged `db8cad02387050579c75cbdcdea3e94a9f6d6bee`.
- Prior exact source `7e672dad469f4355fe746c52e36c9930786c9f8b` passed focused [native Actions #45073175109](https://github.com/hdog960/Mythwrought/actions/runs/45073175109), 6/6 original 288-chunk density/climate checks; unchanged source assertions retained.
- Prior current geometry and original-game WebGL2 evidence: accepted Moonwillow [#45057456018](https://github.com/hdog960/Mythwrought/actions/runs/45057456018), 30/30 native, exactly one matched-camera original-engine Moonwillow screenshot pair. No screenshots or renderer tree geometry needed repeating in this session.
- **Current exact tested source HEAD `f641f14c96536c9ecb81e16606af32d1e88ae173`**, [focused Actions #45076884318](https://github.com/hdog960/Mythwrought/actions/runs/45076884318), job `137375995331`: **SUCCESS, 6/6 focused original Node 22 tests, 0 fails**. The exact original Actions job logs and measured counters were inspected.

## Substantive actual original-world engineering

The source-authentic `FourRegionWorld._environmentTreeAt` path already keeps at most 64 generated tree-chunk Maps. Adjacent chunk creation, and regeneration after eviction, can re-evaluate the same expensive immutable warped V6 site biome classifications even though the classification depends only on `(seed,x,z)`.

- New `src/manual-biomes/enchanted-tree-site-biome-cache.mjs`: **128-entry strict bounded FIFO** `EnchantedSiteBiomeCache`, with keys including exact seed and x/z. Stores **only immutable, frozen V6 biome classification or the real `null` Plains classification**; never stores source terrain, cave AIR, root footing, landmark, voxel or edit data. Both `set()` and `getOrRead()` enforce the same hard cap. Evicted entries must be re-read from the genuine original V6 classifier, never guessed. No global singleton or save serialization. Read-only native diagnostics count hits, misses, evictions and maximum entry occupancy.
- Updated `src/manual-biomes/environment-v7.mjs`: optional `candidateSiteBiomeCache` accepted **only** when `experimentalEnchantedTrees:true` and only as a valid bounded site cache. The existing candidate site reach and `.52+.34` safe density short circuits still run BEFORE a possible cached V6 read. The original `v6BiomeAt` function is unchanged. Every per-chunk terrain, cave/landmark, root support, branch/leaf-air preflight and original 3×3 player headroom check is still performed against the unchanged authoritative original-world callbacks.
- Updated `src/manual-biomes/profile-world.mjs`: allocates an instance-scoped site cache **only** when `experimentalEnchantedTrees:true` and M7 profile is explicitly selected; passes it through the real `_environmentTreeAt` path. Historical M7 and every nonexperimental world allocate no new metadata cache, retain all original generation logic and saves. The original 64-tree-chunk FIFO and original column-cache bounds are unchanged. No changes to `src/main.mjs`, PWA, cave/biome/world generator IDs, nonexperimental maps, physics or rendering.

## Exact native original-world acceptance

New `tests/manual-biomes/enchanted-site-biome-stream-real-m7.test.mjs` has three focused tests:
1. Bounded cache: seed-key identity, frozen immutable V6 classification, real cached `null` Plains, explicit rejection of mutable values, exceptions from real readers, both direct Map writes and `getOrRead` remaining within 128 entries.
2. **288 original `FourRegionWorld._environmentTreeAt` chunk builds**, exactly 96 sequential builds per seed across `179,7919,-88` and three connected 32-chunk latitude tracks `cz=-34,-16,0`, `cx=-16..15`. Compared the **entire ordered original tree-chunk Map** in each case against an independent real original M7 planner using uncached site lookups, preserving **17,877 genuine source voxels and IDs**, all original cave/landmark AIR source checks, ownership, Y19 ceiling, physical original-world tree reader and **308** proven cross-chunk face-adjacency pairs. The original 64-entry tree chunk cache reached exactly 64; the newly introduced site classification cache peaked at exactly **128 entries**. The test then forces and checks **six genuine evicted tree-chunk reloads**, verifying byte-identical coordinates and IDs after rehydration. There were **40 direct original-world reader comparisons**; all passed.
3. Protected-source provenance change: a test-only authoritative cave/landmark cell is changed to occupied between two planner calls while its V6 biome classification remains cached. The candidate is vetoed, and its result is identical to an uncached source planning pass. This proves immutable biome metadata never masks dynamic protection. No player-save mutation; prototype `save()` remains fail-closed under historical M7 identity. Historical M7 `save()` continues to produce exact schema-1 saved-world shape without a candidate site cache.

**Same-run measured bounded reuse** across the above 288 real chunk builds plus six reloads:
- Site classification lookups observed: **2,263**; **724 true metadata cache hits** (31.99% of cached-site lookups) and **1,539 fresh original classifier reads**; **1,155 safe FIFO evictions**; peak **128 entries**.
- The separate uncached 288-chunk baseline planned 2,220 site lookups (additional cached counts reflect six real tree-chunk reloads and source-view checks). **Do not directly subtract 1,539 from 2,220 and claim a matched workload speedup**; the denominators differ. The true cache hit count 724 directly proves reduced repeat classification work in the real original-world path.
- 288 originally generated chunk Maps and six reloads, exact **17,877** real tree voxels; original tree-chunk resident max **64**; 308 real seam face pairs.
- Original source callback reads in the independent reference planner **133,248**; this optimization intentionally does **not** cache terrain/cave/landmark reads across chunks, so it is a V6 classification-work optimization only.
- Per-seed sample: seed179 255 hits / 531 misses / 403 evictions; seed7919 226/513/385; seed-88 243/495/367.
- Runner CPU elapsed timing depends on cold terrain world caches and includes test instrumentation. **No iPhone 17 Pro Max Safari / installed Home Screen PWA framerate, frame-p95, JS heap bytes, GPU resident bytes, battery or thermal claims.** Entry-count 128 is not a measured byte-size heap cap.
- The preceding source-native three-seed Giant physical census (12), six-chunk native GPU budget, exact long-route biome/density and Moonwillow visuals remain independently accepted for unchanged relevant source and are not re-run wholesale.

## Focused CI recovery and no-clogging

- Initial [focused Actions #45076823045](https://github.com/hdog960/Mythwrought/actions/runs/45076823045) had **5/6 PASS**; the new world-cache test incorrectly assumed that generating **exactly 64** chunks would evict the first entry of an original **64-entry** cache. Source voxel parity and the protected-source test were already green. This was a test-boundary defect: a full cache does not evict until the 65th insertion.
- Corrected test generates **96 original chunk builds per seed**, exceeding the authentic bound and observing true eviction. [#45076884318](https://github.com/hdog960/Mythwrought/actions/runs/45076884318), exact source `f641f14c96536c9ecb81e16606af32d1e88ae173`, completed **6/6 SUCCESS**.
- Only one corrected, changed-source focused native gate was rerun. Reused previously green original-source checks where unchanged. Avoided full-repository suites, Chrome/other browser acceptance, repeated queue audits, other developer jobs, cancellations, merges, deployment, shared infrastructure changes and production/PWA edits.

## Remaining release work

Measured actual iPhone 17 Pro Max installed Home Screen PWA source streaming and frame p95, WebGL2 chunk-residency/GPU/JS heap/thermal behavior, longer world walking near caves/landmarks across biome seams, and **separately authorized versioned generator identity + saved-world migration** are outstanding. Experimental trees stay **opt-in and fail-closed on historical M7 saves**; this remains research code on a protected isolated child only.

**Conclusion: actual original-world generator now reuses bounded immutable site metadata across sequential chunk creation while retaining source-authentic per-chunk physical safety. This is native-source acceptance, not production/device acceptance.**
