# MYTHWROUGHT — Enchanted Forest Phase 2: 288-Chunk Original-M7 Density Admission Fast Path

**Isolated original-source development checkpoint — November 22, 2026. Not production, PWA deployment, browser FPS acceptance, or save migration.**

## Protected refs and source identity

- Entry isolated child `research/enchanted-p2-physical-root-safety-20261121` HEAD `ee84a2d9a231d1009ed3ac1a96cfc02699260fb6`.
- Protected `main` unchanged at `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Protected parent `dev/enchanted-forest-overhaul-20261121-phase0` unchanged at `db8cad02387050579c75cbdcdea3e94a9f6d6bee`.
- Reused predecessor exact original-M7 source `db9146bbdf9fd4b4f6a3e4d0abf1fddc98091bff`, [Actions #45061197356](https://github.com/hdog960/Mythwrought/actions/runs/45061197356), **14/14 native** original-site reach and 48-chunk source proof.
- Reused previous `6ab95a8b0477c47beba3b1390f67cb65b240be52`, [Actions #45057456018](https://github.com/hdog960/Mythwrought/actions/runs/45057456018) **30/30 native and Moonwillow matched original-engine WebGL2** where unchanged geometry/renderer applies.
- **Current exact native-tested source HEAD `7e672dad469f4355fe746c52e36c9930786c9f8b`**, [Actions #45073175109](https://github.com/hdog960/Mythwrought/actions/runs/45073175109), job `137364489376`, **SUCCESS, 6/6 targeted genuine Node 22 tests, zero failures**.

## Substantive original-world source change

In `src/manual-biomes/environment-v7.mjs`, the original Enchanted admission threshold is `.52 + undulation(...)*.34`, and `undulation` is bounded between zero and one. Other tree thresholds are no higher than `.52` (Snow) and `.13` (remaining allowed biomes). Therefore, when an explicit opt-in Phase 2 candidate root site's density roll is greater than or equal to the maximum Enchanted threshold, no original biome could have admitted a tree there.

The new fast path **rejects only provably ineligible density rolls before calling the expensive, warped `v6BiomeAt` biome selector**. It runs AFTER the previously source-proven physical ±4 reach cull and BEFORE any original biome or ground/footing/landmark/cave source read. It does **not** change the deterministic source `treeRoll` sequence, thresholds, tree candidate shape/style, overlap ownership, root physics, Y19, Moonwillow foliage, source cache, player collision, saves, or other biomes.

A meaningful precision defect was found during first native validation: JS decimal literal `.86` is not exactly the same representable floating-point result as the ORIGINAL source expression `.52+.34`. The final source constant `ENCHANTED_TREE_MAX_DENSITY_THRESHOLD=.52+.34` uses the exact native arithmetic maximum, avoiding a rounding boundary. A native test samples 4,097 phases and requires the maximum observed threshold to equal this constant. The original biome admission expression itself is unchanged.

Instrumentation adds the opt-in, read-only `densityCulledSites` to the existing frozen per-chunk source-site diagnostic object. `disableCandidateDensityCulling` exists only as an explicit controlled comparison flag, **false by default**. This allows the same exact original-world code to act as its uncancelled baseline in tests. Historical nonexperimental M7 never executes this fast path. No new background/global cache, persistent world state or changed save schema.

## Authenticated 288-chunk original M7 sequential generation acceptance

`tests/manual-biomes/enchanted-tree-long-stream-density-real-m7.test.mjs` executes **9 consecutive 32-chunk horizontal tracks**: three original seeds `[179,7919,-88]`, along latitude rows `cz=-34,-16,0`, `cx=-16..15`, using independent genuine `FourRegionWorld` instances with the same original cave/landmark and soil readers. The test compares every ordered candidate `Map` key and ID between fast and density-fast-path-disabled source. It is sequential native chunk planning and *not* an actual original browser-streaming/PWA/FPS measurement.

Exact current test results:
- **288** individual chunk plans, **4,608** original root grid sites; **2,000** rejected by the already-accepted geometric chunk-reach cull.
- Of the remaining candidate root positions, **388** further rejected by the new mathematically safe density bound. Actual original `v6BiomeAt` lookups **2,608 → 2,220**, i.e. **388 fewer / 14.88% fewer of those biome lookups**.
- Original source terrain/cave/landmark callback reads **133,248 → 133,248 (unchanged)**: this optimization reduces the biome selector's work, not the baseline reader's work. Do not report it as fewer terrain reads.
- Exact **17,877 original-source candidate tree voxels**, zero changed IDs or coordinates or map insertion order, **1,175** border tree voxels, **308** real across-boundary six-face neighbor pairs.
- Real V6 climates sampled by original source at chunk centers: **169 Plains, 105 Enchanted, 6 Snow, 3 Mountain and 5 Desert**. No edits to those biomes, their proportions or boundaries.
- Every tested candidate voxel used its authentic original terrain/cave/landmark AIR preflight and original M7 world reader, with no observed original source-air veto violation; historical production/default schema-1 save remains available and the opted-in prototype still refuses `save()`.
- Timing measurements fluctuate substantially by seed/track and include original-world caching. **Do not claim an iPhone generation-time, frame-p95 or FPS speedup**.

The same focused run also repeated just the affected earlier **48-chunk original source reach comparison**, showing prior geometry cull still preserves its **8,059** original voxels and **61,514 vs 107,216** baseline reads; **334** original geometrically off-chunk sites remain skipped, with density bookkeeping adjusted correctly in the old regression. The 36-pass unchanged original source-cost test returned **44,246** authentic source callback reads and **2,771** sample voxels on current source. This reuse is not a new mesher or browser acceptance.

## CI failure/recovery and global anti-clog policy

- Initial targeted [Actions #45073098676](https://github.com/hdog960/Mythwrought/actions/runs/45073098676) had **5/6 native tests PASS**. The entire 288-chunk voxel/climate/seam/source parity test passed, but a precision assertion of maximum tree threshold against literal `.86` failed. This source precision issue was corrected; the failed run is not misrepresented as accepted.
- Final corrected [Actions #45073175109](https://github.com/hdog960/Mythwrought/actions/runs/45073175109) **6/6 PASS** on exact source `7e672dad469f4355fe746c52e36c9930786c9f8b`.
- No duplicate full suites, Chromium screenshots, PWA installs, other developer test runs, repeated queue audits, Actions cancellation, branch-protection changes, production merges or deployments. The workflow is isolated to this exact child branch and tracks only its own changes.
- **Outstanding:** physical iPhone 17 Pro Max Safari and installed Home Screen PWA generation/long-walk frame p95, original WebGL2 resident GPU/heap/thermal measurements, actual cumulative live streaming (not merely sequential native planning), deeper climate transition/cave/landmark walk acceptance if source changes, and separately approved generator-version/save migration before experimental trees can ship.
- Main, parent, other developer branches, five automations, Codex, settlements, caves, other biome implementations, historical M7 defaults and user saves remain untouched.

**Source acceptance:** a sound additional 14.88% reduction in actual candidate-range biome lookups over nine connected native original-M7 chunk tracks with zero voxel drift, while correctly reporting unchanged terrain reads and unmeasured device performance.
