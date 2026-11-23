# MYTHWROUGHT Desert Phase 3 — original M7 oasis source-provenance gate and physical iPhone PWA acceptance protocol

**Checkpoint:** 2026-11-23 America/Chicago (original GitHub Actions source timestamps UTC).
**Branch:** `research/desert-p3-oasis-provenance-gate-20261123`
**Exact preserved parent:** `d0e1e42e5965a69c664fbcd9baefd595cbaea22e` (`research/desert-p3-authentic-protected-climates-20261122`).
**Accepted original gameplay ancestor, unchanged:** `2bd0395d3ef163e9fdc491ab5119b1ee80844194`.

## Freeze, ownership, and evidence scope

- **READ-ONLY ENGINEERING**: this new isolated branch adds only `tests/desert-p3-original-oasis-source-gate.test.mjs`, its **branch-only, self-path CI workflow** `.github/workflows/desert-p3-original-oasis-source.yml`, and this checkpoint. **No `src/` gameplay files changed.** No main, production PR, other developer, Mountain/Snow/Enchanted/cave generator, shared workflow, hourly automation, saved world, PWA, deployment, merge or CI cancellation was touched.
- CI pinning holds source `src/main.mjs` `3768eb68bc2951dd7e6f41490720a9b4c6616a87`; `src/voxel.mjs` `a475ba9c195e6dd4bc5a97284dbff5f2c37936a4`; `src/gpu-recovery.mjs` `422ef73e383bda78ff94607abb858e3c8a57c2d1`; `src/manual-biomes/profile-world.mjs` `ffad7e10c07e9252bfaaf8381962443ce658abff`; and `src/manual-biomes/desert-seam-invalidation.mjs` `5c40d34eadf683613f6746e456e885087d168627`. Rejected tag40 shader source remains **absent**.
- New original runtime evidence is genuine `FourRegionWorld` **M7** and its own `oasisSites` / `planOasis`, `environmentWaterState`, `environmentOasisWaterEntries`, `Pack2LiveWorld`, `pack2WaterSectionVertices` and `restoreFourRegionWorld`. No artificial oasis source or water override is constructed. This audits exact M7 original-world behavior; it is not iPhone evidence.

## New original-source oases discovered — four distinct original seeds

The test sampled actual V6-classified Desert tile centers and then genuine four-candidate `oasisSites` positions. The original protected source planner accepted the following **four real independent oases**, one per seed; each generated **49** source water-plan cells and **48** shoreline positions:

| Original seed | Authentic generated oasis center (x,y,z) | Water source cells | Shore positions |
|---|---|---:|---:|
| 179 | (-1542,9,2) | 49 | 48 |
| 2026 | (-1633,6,-973) | 49 | 48 |
| 4099 | (-1563,9,-539) | 49 | 48 |
| 701 | (-1587,7,-1506) | 49 | 48 |
| **Total source plans** | Four authentic source oases | **196** | **192** |

This is a **bounded initial-source witness**, NOT a representative Oasis frequency, worldwide occupancy or all-water GPU mesh census. Each site's actual source `_oasisNear`, `plan.columns`, genuine `OASIS_WATER.id=76`, real `world.get` and `environmentWaterState` were required to agree; source-cache occupancy remained bounded. All four independent seeds kept empty schema-1 edit rows.

Initial focused Actions [#45169842285](https://github.com/hdog960/Mythwrought/actions/runs/45169842285), exact source commit `c61cd5c06b114329c7d84a93355ba786ff90d0fc`, authenticated this **oasis discovery subtest 1/1**. The *other* test failed because its fixture mistakenly tried to restore natural water with `FourRegionWorld.set(x,y,z,76)`, which the canonical terrain registry intentionally rejects: ID76 is a **Pack2 water sidecar**, not an ordinary placeable terrain block. That is an original source-ownership restriction, NOT a Desert P3 game regression; do not weaken original water validation.

## Focused real oasis provenance, fluid composer, save and source restoration

The corrected second test is independent and pins a **source-discovered** seed179 water cell `(-1546,9,2)` adjacent to actual oasis center `(-1542,9,2)`. It rechecks the exact original source record and does not invent any water.

- The genuine source `_columnPlan`, `world.get`, `environmentWaterState` and chunk `environmentOasisWaterEntries` agree that the natural cell is **ID76**.
- Original `canBlendNaturalDesertSurface` rejects pretending this water is natural hardpan **258**; original `canWarmSourceScree` rejects pretending it is scree **401**; original `canUseDesertHardpanCue` rejects the non-hardpan source. `desertSeamEditAffectedChunks` returns the **original geometry-only** set, so a water edit does not trigger extra Desert RGB halo rebuilds.
- Authentic seed179 source chunk **(-97,0)** emitted **160,920 bytes** of opaque Float32 original terrain, **byte-identical to original accepted-gameplay `2bd0395d...`**. Original `Pack2LiveWorld` source-water chunk emitted **52,272 bytes** of genuine water Float32 vertices and indexed **43** source water entries *in that one chunk* (not all 49 site-wide water-plan cells).
- Mining source water to AIR using authoritative `FourRegionWorld.set` creates **one canonical schema-1 row**; water-state and original source-water entry disappear as required. `restoreFourRegionWorld(save, profile)` restores the same persisted edited AIR and real fluid geometry.
- `FourRegionWorld.set(x,y,z,76)` correctly returns **false**, since placing ID76 through the base terrain setter is forbidden. Undoing this source water requires a restored **unmodified original-world state**, not an invented block placement. `restoreFourRegionWorld({schema:1,seed,edits:[]},profile)` restores true source water ID76, the exact original opaque mesh, exact original Pack2 water mesh, and **zero saved edit rows**. No test modified a real saved game.
- [Actions #45170085516](https://github.com/hdog960/Mythwrought/actions/runs/45170085516) **SUCCESS 1/1** after the corrected fixture. This narrow workflow pinned identical original engine Git blobs and used `--test-name-pattern` to **reuse** the previously passed four-seed discovery; no redundant broad CI, WebGL2 or source-vertex suites.
- Outcome: **No Desert-specific rendering, natural-water provenance, or schema-1 corruption was reproduced.** The Pack2 water base-set limitation is an existing source contract, not a recommended Desert runtime modification. If source-water restorative editing is ever desired, coordinate with Pack2/water owner separately; do NOT bypass its registry in Desert work.

## Prior authenticated evidence — reused, not rerun

- Original cave override, 12 named source entrances, 900 true cave cells and 301 protected junction columns; genuine fake 258/401 edits and canonical save/restore: latest parent checkpoint `PHASE3_ORIGINAL_CAVE_CLIMATE_PROTECTION_20261122.md`, focused Actions #45113947971 and #45114182460.
- Full **10 original unrelated biome/cave chunks** compared between accepted gameplay and clean Desert candidate: **37,020 vertices, 1,332,720 original GPU vertex bytes, all nine floats byte-exact** in Actions #45114062710.
- Actual successful original-game Chromium WebGL2 live edit with controlled second-upload rollback and retry: Actions #45089215300; authenticated ZIP artifact #14780263350. Original composed real Pack2+Pack3+Manual14 loaded chunk source GPU upload rollback source Actions #45109430297 **3/3**. Real bilateral two-site visual comparison Actions #45076942160. These have **not** been rerun because Oasis tests change no production code.

## Explicit-authority-only nonproduction iPhone Home Screen PWA field acceptance

**Not authorized and NOT executed.** No branch was merged/deployed. The user's currently installed Home Screen shortcut may point to live production and **must not** be assumed to contain the candidate. Apple Home Screen PWA scope/service-worker cache may retain old content. Never use apparent visual similarity as build identity evidence.

### A. Preflight — only after explicit user approval of a separate test delivery

1. Select an **isolated, nonproduction, disposable candidate test URL or PWA scope** that does not overwrite `https://hdog960.github.io/Mythwrought/`, its service-worker/cache namespace, or user saves; no paid service required. The exact delivery mechanism requires creator approval and normal repository/Pages security gates.
2. Pin the **specific candidate HEAD**, accepted comparison SHA, artifact digest, all files and any test instrumentation. Expose a **read-only, exact-build identity visible in the running test UI or exported diagnostic**. Require exact SHA match before testing. Do not add a production test hook or alter original profile selection silently.
3. On the user's actual iPhone, record iPhone model, iOS/WebKit version, landscape CSS viewport, Home Screen PWA vs Safari, airplane/network status if relevant, battery and heat at start, sky/daylight preset, seed/profile, cache/update identity, saves/recording settings. Clearly label any browser-only tests separately from installed Home Screen results.
4. Use **fresh disposable original M7 worlds** at the identified seeds and never the user's live world save. If seed/profile test selection is unavailable in the PWA, do not invent a menu or overwrite the default save; obtain an approved isolated fixture first. Verify exact candidate build and test seed in the real UI.

### B. Matched comparison sessions (same phone, same conditions)

Record at least **three independent matched baseline and candidate runs**, each with explicit start/end, frame/sample count and cold/warm distinction. Include a meaningful 60-second stabilized window per case where available; report raw per-run values and variation, not just a handpicked average.

1. **Baseline** accepted game / current protected production for a reproducible junction; **candidate** exact isolated clean Desert P3. Match original seed179 and/or seed2026, location, world profile, sky/time, 25 resident chunks or actual measured chunk load state, camera orientation, route, view distance and edit sequence.
2. Record FPS, frame-time p50/p95 (milliseconds), longest frame, loaded/pending chunks, GPU buffer uploads/bytes/errors and GL context loss only **when the real on-device recorder exposes them**. Also record visible frame stalls, navigation responsiveness, thermals and battery trend; if a metric is absent label **unavailable**, never infer it from desktop CI or source array byte counts.
3. Perform repeatable **surface original 258/401 near-border edits** at x-local 0/1/2/13/14/15 including a physically genuine north/east/corner/diagonal, plus edits at chunk interiors, deep digging under legacy Y=-3 and a protected cave AIR cell. Inspect whether adjacent loaded RGB updates immediately, whether only intended affected chunks are refreshed, and whether normal schema-1 save/undo retains the original terrain.
4. Exercise **authentic Pack2 water, Pack3 structure, Manual14 furnishing** near a disposable Desert border, and natural Oasis water source ID76. Do not try to restore ID76 with the base terrain setter; compare natural-world reset and edited-world save/restore separately. Observe actual GPU upload/driver allocation behavior rather than equating Float32 byte length with GPU memory.
5. Verify installed-PWA **offline reopen**, exact-build identity after service-worker update, test-save isolation, re-entry through the original Home Screen shortcut, context-loss symptoms and multi-minute sustained walking/digging heat. An old cached build invalidates the candidate run; retry only after an explicitly approved refresh path.

### C. Reporting, fail-closed, and release boundary

- Store for each run: tested exact SHA, original screenshot/video REC diagnostic where exposed, iPhone OS/device/viewport, source seed/profile, sample counts, FPS and p50/p95, memory/upload diagnostics if available, actions performed, edits, passed/failures, visual differences and build-identity proof. If an Apple-specific performance measurement is missing, say so.
- **No unilateral performance pass claim.** Compare distributions against the accepted baseline with matched conditions, report any regression, and retain all existing release safety/branch required gates. Source-only Node22 and Chromium SwiftShader are useful prior proofs but **not on-device acceptance**.
- Before any merge or deployment, creator must separately approve integration target, release checks, PWA delivery and save compatibility. No branch merge, deployment, protected PR movement, CI cancellation, service-worker rewrite, other developer/automation edit or saved-world mutation occurred in this research continuation.

## Final decision

**Original-source Oasis landmark/water protections validated in isolation. No Desert gameplay code change warranted.** The visible bilateral fade still needs final creator visual acceptance and actual iPhone PWA p95/GPU/thermal evidence before any potential release. Keep the current verified isolated research and the conservative original circular three-block color halo; protect all other world systems.
