# MYTHWROUGHT — Enchanted Forest Phase 2: Original M7 Chunk-Reach Early Cull

**Isolated experimental engineering checkpoint, November 22, 2026. No production merge/deploy, old-world save/version migration, iPhone PWA change, shared CI cancellation or developer lane modification.**

## Exact refs and source acceptance

- Entry isolated child `research/enchanted-p2-physical-root-safety-20261121` HEAD `00be0ec26835ce6a709535db72fb3d08b5a8b6fb`.
- Production `main` confirmed unchanged at `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Protected Enchanted parent `dev/enchanted-forest-overhaul-20261121-phase0` confirmed unchanged at `db8cad02387050579c75cbdcdea3e94a9f6d6bee`.
- Prior accepted Moonwillow staggered-curtain source `6ab95a8b0477c47beba3b1390f67cb65b240be52`, [native and original-engine WebGL2 Actions #45057456018](https://github.com/hdog960/Mythwrought/actions/runs/45057456018), **30/30** focused tests and matched original-engine 932×430 Moonwillow images. Tree geometry and all original renderer modules remain unchanged in this session, so no repeat Chromium run.
- New **exact native-tested source HEAD `db9146bbdf9fd4b4f6a3e4d0abf1fddc98091bff`**, [focused native Actions #45061197356](https://github.com/hdog960/Mythwrought/actions/runs/45061197356), job `137327286441`, **SUCCESS, 14/14 native Node 22 tests PASS, 0 FAIL**. Actual job logs inspected.

## Substantive original-source change

The explicitly opt-in `environmentalTreesForChunk` planner enumerates a deterministic grid of possible tree root positions around each requested 16×16 chunk. Earlier it evaluated `v6BiomeAt` and sometimes original terrain/footing/AIR readers for candidate sites whose center was farther than the maximum physical tree crown reach. Those sites could never contribute a real cube to this chunk, but still triggered costly world computations and, in some cases, cache activity.

Modified **only** `src/manual-biomes/environment-v7.mjs`:
1. After calculating exactly the same seed-dependent root coordinates, reject a site in experimental mode if its **existing proven maximum ±4-voxel horizontal envelope cannot intersect this chunk**. The check is inclusive at touching edges: `x+4<minX`, `x-4>maxX`, `z+4<minZ`, `z-4>maxZ`. Rejection happens **before** original biome and terrain lookups.
2. Do not alter any tree-roll values, site/density thresholds, species selector, Moonwillow source cells, mineable bark/leaf IDs, root footing requirements, cave/landmark vetoes, overlap precedence, 3×3 original player standing clearance, Y19 ceiling, 1,024-entry per-chunk source cache or 8 MiB per-chunk GPU limit.
3. **Historical/default M7 never enters the fast rejection path.** Existing conifer/wood neighbors are already narrower than the four-voxel experimental envelope, so the opt-in planner cannot drop legitimate old-climate tree voxels at a border.
4. Added **opt-in read-only source diagnostics** `onCandidateSiteSummary` with frozen counts of sites sampled, geometrically culled and sent to the original biome reader; not installed in gameplay. A boolean `disableCandidateSiteCulling` exists for isolated source comparison, making the former exact site scan available without copying or changing old production files. These are off by default, and the original world/save path does not persist any data from them.

## Genuine original-world native checks

New `tests/manual-biomes/enchanted-tree-source-site-reach.test.mjs` has three tests:
- Source-authentic five-chunk bounds proof: **2,240 geometrically rejected root positions**, **929,600 original candidate cube positions** across three species/floor variants; **every rejected cube is physically outside the requested chunk**.
- 3 seeds `[179,7919,-88]`, 16 original source chunks per seed (4×4 at negative seam coordinates), **48 total**: independently built real `FourRegionWorld` instances, unchanged source-read functions, new fast scan vs explicitly uncancelled former scan. Exact **ordered Map key/value arrays of all 8,059 real candidate tree voxels** are identical; **zero changed voxel IDs, coordinates or insertion ordering**. Actual world `naturalAndLandmarkBlock`, original AIR clearance, hard Y19 and chunk ownership checks green. Opt-in generator saves still fail closed under historical M7 identity.
- Historical explicit-off M7 and six genuine original terrain/chunk probes retain exact unaltered tree map and schema-1 saved-world shape. Invalid diagnostics and comparison flags reject.
- Reused original native three-seed Giant footprint, physical chunk-seam and original native mesh regressions on this **same changed planner source**.

### Same-run measured source savings

Across the same 48 real chunk plans, the exact prior unculled path vs new fast path, in the **same native Actions run**:
- **768** authentic candidate site positions; **334 rejected early** (43.49%).
- Actual original biome lookups: **768 → 434** (**334 / 43.49% fewer**).
- Original authoritative source baseline callback reads: **107,216 → 61,514** (**45,702 / 42.63% fewer**).
- **8,059 source tree voxels**, unchanged in bytes/order and with original cave/landmark world-reader parity; 46 chunk plans carried tree geometry.
- Separate pre-existing 36-pass original source-cost test on this exact commit: **44,246 native original-source callback reads**, **2,771 prototype tree voxels**, 2,300 leaves; historical default and experimental saves properly handled. This result is **not a controlled FPS measurement**.
- Same exact source native mesh sample: 6 chunks, **963,360 historical / 1,033,344 experimental bytes**, ratio ~1.073; all individual native chunk GPU uploads below **8,388,608 bytes**. There were **12 naturally eligible Ancient Giants** (5/1/6 by seed), 48 authentic supporting corners and 60 continuous cross-chunk pairs in the new Moonwillow source sampled seam audit.
- Node 22 source timings in the diagnostic are noisy and mix original-world cold cache construction, terrain planning and test time. **Do not infer an iPhone Safari FPS, p95, resident JS heap, battery or GPU speedup from them**.

## Anti-clogging and remaining gates

- **Executed:** one isolated child-branch focused native job after actual planner source changed, 14/14 PASS. Source geometry, ordering, save safety and unchanged mesher were directly verified.
- **Reused:** previous exact-source Moonwillow 30/30 and original-engine screenshot evidence for **unchanged tree/art/renderer modules**, rather than running Chromium again.
- **Avoided:** duplicate full suites, unrelated CI, repeated GitHub queue audits, shared workflow changes/cancellations, merges/deployments, parent/main edits, and PWA/production changes.
- **Outstanding:** meaningful physical iPhone 17 Pro Max installed Home Screen PWA proof of streaming generation/FPS/p95, real browser heap/GPU use and thermals; additional original source biome-border long-walk acceptance if material changes; separately authorized generator/save version and safe old-world conversion before enabling any tree candidate by default. Moonwillow's remaining artistic curtain blockiness is documented, but small further art edits alone do not justify another expensive browser run.

**Result:** conservatively bounded site early rejection is accepted on isolated original-source M7: a **42.63% measured authoritative terrain-read reduction** for identical ordered tree geometry in the tested dense region, with the previous same-source real collision/GPU/save guardrails unchanged. This is *not* production/iPhone acceptance.
