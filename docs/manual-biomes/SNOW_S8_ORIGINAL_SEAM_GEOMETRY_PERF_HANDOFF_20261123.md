# MYTHWROUGHT — Snow S8 isolated original shader, seed2026 mesh timing, and real biome seams
## Source handoff, 2026-11-23

### Strict exact source and preservation

- Original verified incoming branch `research/snow-s7-cached-real-webgl2-isolated-20261123` at `d896f87454c1ca58e6b2f91c7fe39642b399e052`. FIRST read `docs/manual-biomes/SNOW_S7_CACHED_TINT_AND_REAL_CHUNK_CROSSING_HANDOFF_20261123.md`.
- Independent production `main` at verification `db4bbcc32156e5df311f733bcaa53d559c17313b`, existing authorized Desert Phase 3 PR #463. **This Snow line does not move, reset, rebase, modify, cherry-pick, overwrite or deploy current main.**
- Protected OPEN DRAFT Snow PR #358 `59e449be7e73b25f259c4c72855cfb638a056517` open/unmerged/unchanged.
- Previous authentic original pinned evidence REUSED, not re-run: cached S7 native #45242164112 SUCCESS, genuine 8/8 six-chunk walk routes #45242553138 SUCCESS, real seed179 cached WebGL2 #45243175770 SUCCESS, historical two-seed S6 #45225795580 SUCCESS. All original Caves AIR, WOOD/LEAVES, source rock, original grass, saved edits, no migrations, M7 and PWA preserved.
- New detached `research/snow-s8-seed2026-drift-mesh-isolated-20261123`, source prototype initial commit `88421fee1393dd2bb4ef4ed0051986764d49c065`, corrected browser helper relative import `744a4412c6b40014e7b153af5b77cee7d1031894`, later pigment-only restoration `24f0a7f7cea76dff0e9117b0b2501acd87fa03fb` and exact corrected JS escape `452e290dd6d8a6398783f07e3402755a1763f1d0`.
- Separate real original-seam authoring branch `research/snow-s8-post-desert-real-seams-isolated-20261123`, exact native-tested source `a3c33afbdf35427494b39c7d594c7bbf80c6a99d`.
- Consolidated detached branch `research/snow-s8-seed2026-mesh-seam-combined-isolated-20261123` source commit `ccffe16d81b0f9e75e72e84d05315267686c3b6e`, strictly reuses the exact corrected shader/test source and original-seam test blobs. No production source/test changes or new combined-workflow CI was necessary. A final documentation-only commit may advance this branch without requiring retests.

### New non-repetitive snow surface candidate

`src/manual-biomes/snowy-s8-natural-drift-material-research.mjs`, exact Git blob `d6321aa780e435d41fb058f30a3fd7fa3a325c8c`, is a **pure in-memory source transformer**. It accepts ONLY the exact existing full original Desert-main `STORYBOOK_MATERIAL_FRAGMENT_SHADER` vMat41 branch `else if(vMat==41) shade=1.0+.025*sweep+.065*(grit-.5);`, ensures one match and unchanged original shader remainder, and returns a NEW shader-source string, not a committed renderer change.

- Experimental vMat41 snow material replaces the high-contrast 15x15 grit coefficient `.065` by `.012`, with smooth deterministic world-space low-frequency long snowdrift modulation `sin(vUv.x*.115+vUv.y*.081+.72*sweep)`. One extra sinusoid, no new image/texture/GPU draw buffers, no bloom, new alpha, block-ID or save format. Original Desert, Mountain, Plains, old architecture, sky, shader quality toggles and fog branches remain byte-for-byte intact.
- Original-source shader contract `tests/snowy-s8-drift-source-contract.test.mjs` exact Git blob `253d33425372fba7f200e094857e04c9209f6994`. Authentic Node22 full-repository workflow initially passed all three dedicated source-contract tests **3/3** on Actions #45275371504. That run did **not** pass its WebGL2 stage because the brand-new browser helper imported the local detached shader from the wrong relative path. Subsequent run(s) preserve the same source-contract tests unchanged; use their actual conclusion for any browser claim.
- **Not activated in gameplay**: browser-only response substitution to `/src/storybook-materials.mjs`, gated by exact original HTTP/working-copy SHA256, only when candidate stage explicitly selected. Other terrain shader tags are unchanged; user-made ID276 glacier ice is under original source material and not retagged by S8.

### Exact original biome transition evidence — one-cell real climate boundaries

**GitHub Actions #45275821157 at exact source HEAD `a3c33afbdf35427494b39c7d594c7bbf80c6a99d` COMPLETED SUCCESS, 1/1 genuine complete original-source M7 two-seed test**, pinned separate production Desert P3 checkout. `tests/snowy-s8-post-desert-original-climate-seams.test.mjs` exact Git blob `9ad67e9635f326848dcc6e6cad204c8d05442394`.

The bounded V6 source search found true **adjacent one-voxel** Snow/Desert and Snow/Mountain pairs, not interpolated fake map points:
- Seed179 Snow↔Desert between (640,-1284) and (640,-1283); Snow↔Mountain between (-1812,-768) and (-1811,-768).
- Seed2026 Snow↔Desert between (320,-1805) and (320,-1804); Snow↔Mountain between (280,-2048) and (281,-2048).
- Four authentic 12x12 source windows sampled **576** original physical columns, original `_columnPlan`, original `v6BiomeAt`, physical `get`, and independent bounded S7 cache per source owner.
- **Zero** protected neighboring Desert / Mountain / Plains columns tinted. Native original Desert hardpan ID258 and Mountain scree ID401 were preserved, caves and original saves unchanged.
- **Important nuance:** every 12x12 immediate seam sample had **zero actual authored winter caps eligible to tint** — source IDs were transition hardpan or scree, so color-caching must not claim to soften the physical Snow/Desert/Mountain boundary. This is a strict source-protection gate only. A separate future visually safe transition mechanism with original terrain/material ownership and original caves/edits admission remains unsolved.

### Exact original seed2026 mesh timing: serious observed blocker

The first genuine full-game three-stage `956x440` WebGL2 experiment `scripts/ci/snow-s8-real-seed2026-drift-mesh-probe.mjs` at original implementation `88421fee1393dd2bb4ef4ed0051986764d49c065` compiled source-contract 3/3 but failed its browser stage at local relative import (no game acceptance).
- The corrected import code `744a441...` exposed a **real geometry metadata bug** in the former S7 browser injector: it made naturally authored original glacier ID276 use a terrain ground-color/material UV path instead of the original voxel's unchanged material/UV classification. Original `meshChunk` geometry fingerprint (positions, UV, material) was `2535267973`; the S7 candidate fingerprint was `3313344133`, even while vertex count remained **10536** and GPU array **379296 bytes**. The test refused to call this full material/geometry acceptance, correctly failing.
- That rejected benchmark sample measured **original mesh p50=14.4ms, p95=23.1ms** versus initial S7-cached p50=39.3ms, p95=63.7ms (8 actual original full `meshChunk` builds each, Chromium software WebGL2). This is a **performance regression**, not a performance win. It is one non-iPhone, one-chunk, synchronous sample; not an overall game FPS estimate.
- The corrected detached integration changes ONLY the shader input RGB `color` expression by `snowS8Pigment??groundColor??biome130Color(...)` while retaining the EXACT original `groundColor` value for original face lighting, UV and `terrainArtMaterial` path. Browser-only code is NOT written into `src/voxel.mjs`. All prior source protections and player-edited ID276 tests are preserved. A post-fix browser run must demonstrate true geometry SHA/signature parity and capture p50/p95 before considering acceptance; a successful shader render alone is insufficient.
- Crucially, the S7 source itself still calls source and cave readers repeatedly for pigmented surface cells, potentially outweighing the climate-cache saving. Before integration, optimize source hot path without weakening fail-closed cave/edit contracts and test actual Chromium and iPhone p50/p95 against exact original same chunk/seed. A plausible target is no p50 or p95 regression, not an unsupported claim of frame-rate improvement.

### Remaining safety and physical device gates

- Do not register `mythwrought-five-surface-regions-v8-snow-optin-research`, change schema-1 saves, paint original protected green/STONE/WOOD/LEAVES, modify natural caves, enable S3 prototypes, or alter protected main/PR358/hourly automations. No authority exists to merge or deploy S8.
- Future true visual acceptance must show identical-camera before/after natural snow plus real original `ID276` player-placed ice per source source/vertex parity, authentic shader compile WebGL2, and **measured** original versus cached mesh costs. A prettier image cannot override regression.
- Required on-device **installed iPhone Home Screen PWA** test remains **UNRUN**: verify current version/installed cache update, offline reopen, original world save restore, palette only on authentic caps, all three sky moons/night scene, native WebGL2, GPU resident chunks and buffer bytes, 10-second stationary/long walk/rapid mining p50 and p95, no slow-frame digging spikes, tap/creative controls, no new visual-only objects, and authentic player collision. Run only against a separately creator-authorized and CI-approved update to production.

### Current result status

Native source shader-contract PASS and original Desert/Snow/Mountain seam PASS. Original cached-S7 first mesh timing showed a performance regression and glacier material metadata mismatch, so **there is NO release-ready winter shader or cache yet**. The geometry-preserving correction must be validated by its own exact-head genuine game WebGL2 run. Do not claim iPhone/device, cross-biome *visual* smoothness, or frame-rate benefit from this record.


### Exact corrected post-Desert seed2026 browser experiment — partial gate, NOT green

The final pigment-only browser harness `scripts/ci/snow-s8-real-seed2026-drift-mesh-probe.mjs` exact Git blob `a2ab5e34fdae7ff3df6264ceab77234caea8b772` was authenticated by **Actions #45276407209**, exact source HEAD `452e290dd6d8a6398783f07e3402755a1763f1d0`. The overall job **COMPLETED FAILURE**, deliberately due to the separate natural-snowdrift visible-difference assertion. Do NOT call this run SUCCESS. The source-contract 3/3 and strict original game screenshot/mesh/edited-ice subchecks below completed before that assertion.

The test started actual original full Desert Phase 3 game through Chromium WebGL2, 956×440 mobile viewport, seed2026, original snow glacier source ID276 at (-144,9,504), exact original camera (-143.5, feet17.01,492.5), **25 loaded / zero pending chunks**, original M7 profile and WebGL 2.0 renderer; all three contexts had **zero JavaScript page errors**. Only source-original local browser module routes were temporarily replaced; original repo `src/voxel.mjs` and `src/storybook-materials.mjs` and game worlds were not edited.

The corrected candidate specifically distinguishes `groundColor` (used by ORIGINAL UV/material/face lighting) from the new `snowS8Pigment` used ONLY in the original face `color` expression; thus original natural and user-placed ID276 preserve the original shader-material path, and only candidate winter RGB changes. The additional `drift` stage injects exact `vMat==41` variant in memory but leaves all others unchanged.

| Authentic seed2026 original mesh observations | Untouched Desert-original | S7 pigment-only cached | S7 pigment + S8 drift shader |
|---|---:|---:|---:|
| Real `meshChunk(-9,31)` vertices | 10,536 | **10,536** | **10,536** |
| Same mesh bytes | 379,296 | **379,296** | **379,296** |
| ORIGINAL position, UV and material-bit fingerprint | 2535267973 | **2535267973** | **2535267973** |
| Actual synchronous 8-build p50 | 15.0 ms | **18.9 ms** | **32.3 ms** |
| Actual synchronous 8-build p95 | 21.4 ms | **48.7 ms** | **50.1 ms** |
| Edited ice original `meshChunk` vertices | 36/36 | **36/36 exact** | **36/36 exact** |

The original/edited-ice parity and original physical geometry checks are **passed sub-gates**, not a successful overall workflow. Timings are Chromium/GitHub Actions synchronous mesh-build times on ONE chunk, not Safari/iPhone game FPS or statistically stable render latencies. The cached original-source path still has **materially worse worst-run mesh cost**, a mandatory release blocker. A lower climate-evaluation count did NOT guarantee better wall time.

Actual screenshots at this camera are byte-hash verified:
- Original SHA256 `2c237d87fc26deaa38b7798c04a2b5c4eeca938aa414be647dbcada3e23cadfa`
- Cached-pigment SHA256 `42e7d53634346ab6fba42ed4538cb3a1878b7e6a3b4a7d71b63433007cd31103`
- Experimental low-grit shader SHA256 `ecb30e585c76d74a22d66e5d616e353962eae9a81f7c3d151c2d3ace560b2828`
- Original ZIP workflow artifact #14868721455, CRC PASS; three authentic PNG screenshots. Independent image-byte ROI check x≈18..82%, y≈33..90% gives strong `blue-red > 18` fraction **73.022% original -> 11.483% cached pigment-only**, showing a genuine, natural-glacier source-color change while ORIGINAL geometry, UV and material tags stay intact.
- The experimental S8 low-grit shader changed only **0.0241%** of this ROI by max-RGB-channel >=3 compared with cached-pigment alone. The strict test demanded >1%, so **S8 natural texture visual acceptance FAILED**. Do not weaken this threshold or claim texture success. The scene is dominated by material-path `vMat==0` original authored glacier ID276, rather than material-path `vMat==41` natural snow, and the S8 shader changes ONLY material 41. Before another browser job, source-authenticate a visible authored original snow/rime cap using exact natural material tag, or design a separately validated natural-glacier appearance strategy with explicit player-edited ice protection. Do not accidentally retag glacier UV/material just to pass visuals.

**Earlier failure provenance:** #45275371504 stopped before browser due local import path; #45275699511 ran with exact source but caught invalid natural glacier UV/material hash; #45276331214 had a double-escaped temporary injected module newline and is NOT visual acceptance; only #45276407209 proved the final exact pigment-only geometry correction, though its overall low-grit image gate failed. Keep failures visible; reuse all verified exact SHA sub-gates instead of duplicate broad CI.

### Next original-source engineering actions

1. ORIGINAL native material-path census, especially ID272/279 (original terrain tag41) versus natural glacier ID276 (original non-terrain tag0), both original seeds and real source locations. Source-authenticate an original snow surface and physically safe camera before rerunning costly Chromium WebGL2 shader research. Do not blindly target the glacier again.
2. Optimize S7 `stillSafe` synchronous hot path: current per-original-visible-surface checks still require repeated `_columnPlan` and multiple original `get`/cave reads even after the climate memo. A candidate may exploit the guaranteed single-threaded, one-mesh-build read-only source lifetime but MUST continue to fail closed on edited cap/support/overhead and cave override. Use measured original-versus-candidate exact source mesh p50/p95 and geometry/UV/material parity as hard gates; improve before adoption, never accept only a decrease in V6 lookup counts.
3. For true Snow/Desert/Mountain visual transition improvement, existing one-voxel source boundary terrain is legitimately scree ID401 and hardpan ID258 with no authored winter cap to recolor. Preserve these original protected physical voxels. Real gradual source terrain + appearance requires distinct future-world profile and its own physics/cave/biome/scene/memory acceptance; S8 caching is **not** a bridge generator.
4. Physical **iPhone installed Home Screen shortcut** acceptance remains UNRUN. Verify correct future release version only when creator authorizes deployment; compare unchanged live current M7 with any future candidate for shaders, save/restores, cave air, three moons, chunk/buffer budget and 10s stationarity/walking/mining p50/p95. Do not claim an acceptance or schedule without actual device evidence.

**Final S8 status:** material 41 source transformer is authored and isolated; real biome boundary native guard SUCCESS; stricter 2026 shader/mesh overall browser FAIL as expected because invisible drift and slow cached mesh. No live-game visual change, no main/PR358 movement, no authorized V8 generator.
