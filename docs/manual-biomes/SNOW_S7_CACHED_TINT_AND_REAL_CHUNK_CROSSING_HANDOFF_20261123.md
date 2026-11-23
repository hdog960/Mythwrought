# MYTHWROUGHT Snow S7 — bounded cached winter tint and genuine original cross-chunk player routes
## Detached original-source checkpoint — 2026-11-23

### Source ownership / protections

- Parent verified Snow S6 branch: `research/snow-s6-post-desert-visual-and-six-chunk-source-isolated-20261123` exact `7709e11f4af07031c36472328f7a829c26ca4f9b`.
- Independently released, protected production `main` expected/current at inception `db4bbcc32156e5df311f733bcaa53d559c17313b`, Desert Phase 3 release PR #463. Snow must **NEVER rebase, revert, move, overwrite or cherry-pick its original `src/voxel.mjs` / `environment-v7.mjs` / `profile-world.mjs` / `main.mjs` / PWA changes** without source-aware owner approval.
- Protected OPEN DRAFT PR #358 expected exact HEAD `59e449be7e73b25f259c4c72855cfb638a056517`. Do not change/merge/close.
- This S7 sequence lives entirely in independent branches, never imported by live M7:
  - `research/snow-s7-original-cached-winter-tint-20261123`: code/native CI exact `10a5b86e8b48e1eb6906cfa504f1a370c0b62157`;
  - `research/snow-s7-original-chunk-crossing-20261123`: source-native crossing test exact `20a82d11cc72d1a264eee9e2022c72bf4548318e`;
  - `research/snow-s7-cached-real-webgl2-isolated-20261123`: one browser-only cached S7 real-game experiment, original implementation checkpoint `b3d51f63a001758ba44bd616ad98ed2efaad0560`.
- The proposed V8 profile marker `mythwrought-five-surface-regions-v8-snow-optin-research` remains **UNREGISTERED**, no active generator, no existing world migrations, no terrain/geometry/block-ID edits, no cave/legacy WOOD/LEAVES/STONE overwrite, no material registry changes, no merges/deployments, no modifications to any other developer/automation branch.

### New source: one bounded cache PER mesh build

`src/manual-biomes/snowy-s7-mesh-tint-source-cache.mjs` Git blob `f5a538405085d994d52c1f68bafd587edf182e30`.

- Only accepts authentic original `mythwrought-five-surface-regions-v7` `_columnPlan` / source `get` / original cave reader and exact integer source coordinates. The only supported consumer is a **single 16×16 original owner chunk** (or optional 1-block halo: exactly 18×18 maximum). No global, cross-world or per-frame retention. Creates a new instance on any regenerated mesh.
- A tinted cell must be original *authored* natural cap ID 272/276/279, at the highest source plan Y, physically present, supported, no overhead original occupancy, untouched player edit at cap/support, and not replaced by a cave override. It will not tint old retained grass, caves/AIR, STONE, WOOD/LEAVES, unsupported snow or anything outside authentic snow climate.
- Expensive original `v6BiomeAt` and original S6 `previewSnowS6WinterTone` run **at most ONCE per eligible original column**. Every subsequent repeated color request rechecks the real source cap, original cave reader and schema-1 edits before reusing the immutable RGB: stale edits cannot cause tinted player objects. No source writes.
- Neighbor owner halo calls for the SAME absolute voxel produce identical RGB, including negative chunk coordinates. No per-chunk salt, random checker/hash or discontinuous palette rows.
- These algorithms are proposed source-only integration references, **NOT a production mesh optimization proven on iPhone**. In particular, the cheapness of repeated climate queries is measured by *call counts*, not actual mesh wall-clock/p95; the repeated source safety reads may have independent costs.

### Authentic current post-Desert original M7 source evidence

**GitHub Actions #45242164112, exact authored HEAD `10a5b86e8b48e1eb6906cfa504f1a370c0b62157`, COMPLETED SUCCESS**. It independently checked out the exact real production Desert main `db4bbcc...` without changing it, Node22 original real M7 world for seeds179 and2026.

- New focused safety/cache/halo tests: **11/11 PASS**.
- Real pinned Desert main native tests: **2/2 PASS**.
- Seed179 original snow interior 16×16 at chunk (-10,32): **256** original source columns, **251** approved natural winter caps, **5** protected; across **1536** color calls only **251** original biome evaluations, **1285 repeated evaluations avoided**.
- Seed2026 original snow interior 16×16 at chunk (-10,30): **256** original source columns, **244** approved, **12** protected; **1536** color calls, **244** biome evaluations, **1292 repeated evaluations avoided**.
- Both original source glacier witnesses remain exact original ID276 at seed179 (-144,8,528) and seed2026 (-144,9,504), halo RGB exact between adjacent negative owner chunks. Historical original grass (-104,360) stays grass and never tints; original Desert (256,-192) source / Mountain (-320,-256) source / plains remain unchanged and untinted. Both original world saves restored byte-equivalent.
- No runtime frame-time or iPhone claims from native tests.

### ACTUAL original stepPlayer walks ACROSS world chunk boundaries

**GitHub Actions #45242553138, exact HEAD `20a82d11cc72d1a264eee9e2022c72bf4548318e`, COMPLETED SUCCESS, original complete M7, Node22**. One new source-authentic two-seed test **1/1 PASS**, none of the older native S6 suites rerun.

The test assembles the EXACT six accepted canonical S3 conifer-consumer slices from original M7 seed179 and seed2026 at chunks (-2,32),(-1,32),(0,32),(-2,33),(-1,33),(0,33), in an unsaved, read-only original-world overlay; the original `voxel.collides`, `src/physics.mjs:stepPlayer` blob `199cab89fc1e6ab67d12a56c62795ef0ac4b50d7` and authentic world data are used. Six tree owner consumer slices, old AIR cave protection and all player edits preserved.

- **Seed179: 4/4 actual originally passable routes still cross original chunk X boundaries -16 and 0 with the physically staged forest.**
- **Seed2026: 4/4 actual originally passable routes still cross both boundaries**; five other attempted original starts did not pass the original baseline, and are NOT claimed as trees blocking them.
- Each of the eight successfully defended routes runs **132 frames** of native physics in original baseline and again with all six conifer consumer slices. The baseline crosses at original frame49; the staged forest crosses at frame49 in all eight recorded routes. Some eventual end positions differ where the new physical trees are real obstacles; no lost original boundary passage or AABB penetration.
- Original 132-frame route count: **8 x 132 = 1056 frames baseline, 1056 additional frames against staged forest**; previous native short local tree-adjacent `stepPlayer` evidence is separate (135 original frames, Actions #45224574152).
- This is now real crossing in ONE identified six-chunk area, NOT infinite-world long routes, iPhone performance, a production-added conifer, or all biomes; no actual terrain edits or cave mutations made.

### Real browser and remaining essential gates

The browser-only cached tint test on isolated `research/snow-s7-cached-real-webgl2-isolated-20261123` was created as a new exact-pinned post-Desert `src/voxel.mjs` Playwright route. It is a one-seed focused original M7 WebGL2 test comparing original with temporally injected **cached** source tint, real 956×440 viewport, plus original player-placed glacier ice parity in disposable browser state. **Its exact outcome must be separately recorded from the actual GitHub Actions run; do not claim it passed merely because the file exists.** The previous S6 naïve winter-tone browser Actions #45225795580 was accepted for both seeds, but is NOT a substitute for cache integration acceptance.

Prior to any release: reconcile current Desert production seam rendering and original biome source; test Snow/Desert/Mountain original color seams and negative-chunk mesh budget, original save/edit/restore and all cave/old landmark vetoes; prove a real longer walking journey and physical source editability; verify actual 956×440 installed **iPhone Home Screen PWA shortcut** remains on current release, WebGL2 no errors, old M7 saves/edits, original GPU chunk counts, median and p95 frame times in snow and rapid mining; compare snow sun/night visuals and glacier player-place/mining; never weaken mandatory branch protection. No approval exists to register/merge/deploy S7.


### Newly completed ORIGINAL WebGL2 cached-S7 browser gate

**GitHub Actions #45243175770 — COMPLETED SUCCESS**, exact real browser test commit `b3d51f63a001758ba44bd616ad98ed2efaad0560`. This is a **NEW targeted** cached-S7 correctness and visual test; original previous S6 browser and native CI were not repeated. It checked out a separate read-only production Desert Phase 3 HEAD `db4bbcc32156e5df311f733bcaa53d559c17313b`, verified the original `src/main.mjs` and `src/voxel.mjs` HTTP contents match their pinned on-disk SHA256, then booted the actual game in Chromium WebGL2 using a 956×440 mobile viewport, original M7 profile, original seed179 and glacier ID276 at (-144,8,528), exact original camera (-143.5, feet17.01, 516.5), real WebGL2 canvas 612×379, 25 loaded original chunks, 0 pending chunks, and zero JavaScript errors.

- Baseline page: actual untouched original post-Desert voxel mesh source.
- Candidate page: browser-only `/src/voxel.mjs` one-time in-memory route that injects an original 16×16 **per-mesh** `createSnowS7MeshTintReview(world,cx,cz,{biomeAt:v6BiomeAt})` reference, replacing only the local natural winter ground RGB choice by `sourceCache.colorFor(x,y,z,id)??existingOriginalColor`. It fulfilled exact original Snow source modules `snowy-s7-mesh-tint-source-cache.mjs` and `snowy-s6-winter-tone-proposal.mjs` from the isolated branch. No production source, shader, runtime import, cached PWA, M7 generator, or save was edited.
- Both original and candidate pages used the SAME local-only main-module introspection; after screenshot, each placed genuine edited ID276 glacier ice at (-146,16,522) into its disposable browser's world and called real original `meshChunk`. **All 36 original edited-ice mesh vertices matched exactly**, proving that this tested player-placed ice retains its original visual material geometry and RGB.
- Original post-Desert snow strongly-blue fraction: **99.8112126657%**; cached S7: **0.2200348931%**, same 153,612 ground-heavy ROI and `blue - red > 18` metric. This exactly reproduces the accepted S6 visual-color result in the tested 956×440 seed179 scene, but with the new original-source bounded cache. It is NOT a new tile texture system or universal snow biome result.
- Original screenshot SHA256 `c1442803621eb793463b9ec5ab07845158d472032feb03e66f98ed662ebee476`; S7 cached-candidate screenshot SHA256 `2f2fdc6b55f63c6c86a6d216350697a4dae7ee83ee0a64c9558a43ec0aa95723`.
- New real PNG/manifest GitHub Actions artifact **#14851659718**, name `snow-s7-cached-956-original-webgl2-b3d51f63a001758ba44bd616ad98ed2efaad0560`. Independently downloaded ZIP CRC **PASS**; ZIP SHA256 `f044d0c19a09c205348b20c330e4576aebdcf0fc94160aef1ce599cab239b469`, both PNG bytes exactly match their recorded SHA256. Test-source file Git blob `scripts/ci/snow-s7-cached-post-desert-webgl2.mjs` = `74cea8a109fb06a6a556515b7343c5fe14d7db1d`; cached-source Git blob `f5a538405085d994d52c1f68bafd587edf182e30`.
- Actual rendered image inspection finds a near-neutral winter ground instead of saturated blue; **repetitive underlying tile texture remains visible**. This is an improvement in color *only*, not yet the creator's complete natural snow/forest art goal. No timing of `meshChunk`, p50/p95, mining GPU uploads, device battery cost or actual iPhone Home Screen PWA use was performed here.

### Future on-device Home Screen release acceptance checklist (NOT EXECUTED)

Keep S7 research-only, disabled for saved profiles; do not register the proposed V8 marker. For a separately authorized future integration candidate, inspect original production owner diff before any Snow renderer changes and preserve Desert Phase 3 color seams and cave/legacy guard semantics. Test source-authentic Snow/Desert/Mountain triple boundary, old player-placed glacier ice, original snow roads/legacy groves/cave voids and all original saved edits. Before considering merge, capture original and candidate render at the identical original world seed and camera for snowy interior, ice patches, daytime/nighttime and mixed-biome shoulders. Validate the deployed installed iPhone Home Screen shortcut (not merely Safari): current version/cache coherency, non-stale source script and offline reopen, WebGL2 GPU restore, tap/play, mining and placing, actual original walking over S3 trees and snow edges, saved edit restore, no new chunk/GPU buffer leaks. Record actual iPhone p50/p95 frame time and stutter during 10-second stationary, continuous walking and repeated mining; release only after performance/regression budget and all required official CI pass and creator explicitly authorizes the game update. These are plans, **not completed device tests**.
