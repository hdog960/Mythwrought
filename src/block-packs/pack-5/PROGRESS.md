# MYTHWROUGHT — Pack 5 Interiors & Specialty Architecture progress ledger

## Authority / owner
- Main reverified at `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`; incorporation checkpoint **006**; [Issues #109](https://github.com/hdog960/Mythwrought/issues/109) and [#117](https://github.com/hdog960/Mythwrought/issues/117) read, with latest Pack 1–4 manifests and biome130 catalog.
- Exclusive branch `manual-pack-5-interiors-foundations-20261114`, [draft PR #119](https://github.com/hdog960/Mythwrought/pull/119).
- Only permitted changes: `src/block-packs/pack-5/` and `tests/block-packs/pack-5/`. All shared engine, registry, save, interaction, collision, UI/controller/minimap, worldgen, automation, CI and checkpoint files untouched.
- **NO persistent numeric IDs assigned.** Only `pack5:079` through `pack5:096` symbolic roster identifiers. Live IDs 0–8; 255 internal sentinel; 209–254 unassigned; future biome130 256–385 are not current-byte-compatible.
- v0.10 Gate A **OPEN**, v0.11 **LOCKED**. No merges, deployments, worldgen placement, buildings, or gameplay systems.

## Milestone 0 — source foundation COMPLETE
- 18 symbolic entries and isolated reproducible physical fixture.
- Shape metadata, quarter-turn rotation, multi-cell occupancy, partial collision and ray target, wall/floor/ceiling support, reversible isolated snapshots; **not production schema-1 save integration**.
- Dedicated browser smoke source, default root CI does **not** discover nested Pack 5 tests.

## Milestone 1 — source CANDIDATES complete; acceptance OPEN
- **3/18 CANDIDATE**, **15/18 NOT STARTED**, **0/18 INTEGRATED**, **0 accepted as production**.
- **079 Plaster & Stucco:** two original front-facing wall cladding variants with shallow physical attachment and backing support.
- **080 Fired Brick Masonry:** two distinct kiln-fired brick-course arrangements, now covering *all four lateral sides* with physical box relief and solid structural collision. Plain reverse/side faces in original screenshot review were an authored-source defect, corrected.
- **081 Ceramic Interior Floor Tiles:** two decorative shallow walkable tile variants with distinct 2×2 and 3×3 raised panels, not exterior paving.
- Tested 6 source variants over all four rotation states: **44/44 native Node 22.16.0 PASS** (16 foundation + 19 M1 + 9 acceptance cases), with exact GitHub blob parity. Key shape/material/rotation/collision/snapshot/mesh/visual-uniqueness assertions documented in `M1_ACCEPTANCE.md`.
- Preview-only budgets: 079 96/144 triangles; 080 504/636; 081 204/180. Max **636 triangles and 1272 vertices**, below the existing per-cell 768 triangles / 1536 vertices prototype limits. **Not measured production GPU performance**.
- Replaced misleading Canvas2D polygon sorting with authored-triangle software depth buffering. **Six genuine Chromium 144 Canvas2D screenshot captures** generated and visually inspected at 667×375, 844×390 and 932×430, rotations 0 and 1. Each of six panels has a unique sampled pixel fingerprint in every capture. Corrected screenshots show solid brick tops with visible side courses and readable floor tiles without clipping.
- **Not WebGL2 evidence.** Real WebGL2 context creation returns null here under regular and software configurations; served gallery previously blocked by `net::ERR_BLOCKED_BY_ADMINISTRATOR`. The original six-asset WebGL2 gallery remains committed for later testing. No physical iPhone art approval.
- Original and updated native Node suite: `node --test tests/block-packs/pack-5/*.test.mjs`. Actual Chromium fallback capture: `python tests/block-packs/pack-5/capture-canvas.py <output-directory>` (requires Chromium and Playwright). Root GitHub CI does not include nested Pack 5 tests; inspect its exact-head result separately.

## Remaining gates
1. Genuine source-served WebGL2 with three viewport screenshot review, and creator-approved visual art.
2. Independent central-engine expanded-ID/shape support, physical raycast/collision, variant/support save metadata, schema-1 backward compatibility, performance and physical-iPhone tests before incorporation.
3. Until those gates are verified, keep **M1 final acceptance OPEN** and **M2 Beds/Chairs/Bookshelves/Cabinets NOT STARTED**. No additional development session unless user explicitly says/clicks Continue Development.

**Full evidence/metrics:** `M1_ACCEPTANCE.md`. **Asset-level statuses:** `manifest.json`.

## Post-incorporation 007 lane safety recheck
- New main `caf47776b723a36684edc1a72749e49268ccc688` resulted from creator-authorized automation-only PR #120. **Manual Pack 5 PR #119 explicitly excluded.** Original branch base `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`/checkpoint 006 remains its historical source point.
- Shared opt-in :00/:12 geometry prototypes and 12 biome130 candidates have entered main, **but not new runtime registered block IDs, Pack 5 assets, or production schema-1 variant support**. Pack 5-owned paths remain disjoint from the two intervening main commits.
- No rebase, merge, deployment, source overlap or change to acceptance decision. Reverify checkpoint before any later new work.

## Genuine WebGL2 visual review after checkpoint 007
- **44/44 native Node tests PASS** on exact source/test blobs, after the Pack 5-only browser gallery repair.
- Chromium Xvfb + software OpenGL established an **actual WebGL2 2.0 context**. Six source-derived WebGL2 screenshots across 667×375, 844×390, 932×430 and rotations 0/1 inspected, all six candidates visible with nonblank unique panel GPU readback fingerprints at every size.
- Real defect fixed: the old fixed-height mobile WebGL2 gallery cropped its bottom row and oriented wall faces edge-on. Source gallery HTML/JS now fits the available landscape viewport, preserves tile scale and exposes physical wall material faces.
- Reproducible: `LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python tests/block-packs/pack-5/gallery-webgl-browser.py <output-dir>`.
- **Not a source-served test**: local HTTP navigation is blocked by administrator; exact Pack 5 JS modules are concatenated for an offline about:blank genuine WebGL2 run. **Not iPhone hardware** or production renderer/game acceptance.
- M1 final acceptance still OPEN for actual source-served browser module loading, creator visual review and future central registry/shape/save integration. M2 NOT STARTED; 3 CANDIDATE, 15 NOT STARTED, 0 INTEGRATED. PR remains draft and unmerged.

## Follow-on technical QA and conditional Milestone 2 candidate work — November 14, 2026

- Newest main `ac263720b60641c65b02330348dd76d0ef9cb75e` / checkpoint **008**. Checkpoint 008 includes **automation-only live visibility** and explicitly excludes all manual Pack 5 assets and independent building roadmaps.
- M1 isolated technical gates rerun: original **44/44 native Node PASS**, **6/6 authentic Chromium WebGL2 screenshot views PASS**, plus native ES module parsing/execution via offline `data:` imports. Localhost HTTP-served page still blocked; creator artwork and production integration acceptance still OPEN.
- Creator conditional authorization permitted **M2 isolated source-only candidates**. Four authored physical families 82–85 (eight geometric variants), see `residential-furnishings.mjs`, `M2_ACCEPTANCE.md`, and `residential-gallery.html`.
- Fixed genuine test-only multi-cell bed support defect (foot cell must have solid floor backing) and visually weak bookshelf/cabinet reverse/side silhouettes (physically modeled joinery).
- **66/66 native Node tests PASS** across 4 dedicated Pack 5 suites (44 M0/M1 + 22 M2); all source/test blobs compared to GitHub. `node --test tests/block-packs/pack-5/*.test.mjs`.
- **12/12 authentic Chromium WebGL2 PNGs** inspected across M1 (6 assets) and M2 (8 assets), 3 landscape sizes × 2 rotations each; native ES module source-runner `tests/block-packs/pack-5/esm-webgl-browser.py m1|m2 <output-dir>`. Unique panel GPU pixel hashes and nonblank coverage pass. NOT production renderer, localhost-served page or physical iPhone test.
- Manifest now: **7 CANDIDATE / 11 NOT STARTED / 0 INTEGRATED**; persistent numeric IDs **none**. All 16+ changes remain exclusive to Pack 5 files in draft PR #119.
- M2 next: creator artwork review and more geometry/support/mobile-budget QA; M3 Shop & Workshop candidates 86–90 **NOT STARTED**. Do not merge, deploy, update shared modules, or unlock v0.11.

## M2 final collision-quality rerun
- Fixed actual source-defined collision overstatement: M2 beds, chairs/stools and bookshelves now collide with their precise authored physical piece unions instead of coarse box approximations. Verified actual collision of tall bed posts/headboard and correct empty space between components.
- **68/68 native Node 22.16.0 PASS** (44 M0/M1 + 24 M2). Six fresh real Chromium native ES-module/WebGL2 M2 screenshots pass again after the fix; no mobile hardware timing inferred.
- Pack 5 remains **7 candidate / 11 not started / 0 integrated**, M1 creator final approval open, M2 candidate acceptance open; next scope M2 art/refinement and later M3 only on new explicit Continue Development.

## M2 art and acceptance recheck — latest session, 2026-11-14
- Reverified current main `ac263720b60641c65b02330348dd76d0ef9cb75e` and checkpoint **008**, Issues #109/#117, Packs 1–4 current manifests/draft PRs, and the incorporated-but-symbolic biome130 catalog. No ownership or numeric ID conflicts with Pack 5.
- Executed genuine Node 22.16.0 **69/69 PASS**, 0 skipped/failures; original M0/M1 44 cases and 25 M2 cases. Updated candidate source and dedicated test Git hashes match executed files.
- Visually substantiated **asset 84** shelf defect (books hidden by projecting front shelf lips). Adjusted the actual source volumes and modeled brass spine marks for both bookshelf variants. New test checks physical collision/selection volume and at least 12 visible spines per variant. Other six M2 candidates' 844×390 source-rendered pixels unchanged.
- Executed source-authentic native ES-module Chromium **WebGL2 M1 six PNGs and M2 six PNGs** with software OpenGL/Xvfb at 667×375, 844×390, 932×430 and rotations 0/1; real WebGL2 drawing/pixel fingerprints pass. Local HTTP-served gallery still denied by browser administrator; no iPhone device/production renderer result.
- Preview budgets unchanged (M2 max 636 source triangles / 1272 vertices per variant; max per-cell <=64 authored AABB parts), no claim of live GPU performance.
- Manifest remains **7 CANDIDATE / 11 NOT STARTED / 0 INTEGRATED**; M1/M2 creator final artwork and saved-game/runtime checks OPEN. No merger, deployment, worldgen placement, changes to shared systems or other packs, or v0.11 unlock.

## Milestone 2 isolated technical closeout and Milestone 3 source candidate start — 2026-11-14

- Reverified main `ac263720b60641c65b02330348dd76d0ef9cb75e` / checkpoint 008, Issues #109/#117, current Packs 1–4 manifests/draft PR heads and :12 biome130 reservation. Entire Pack 5 remains an unmerged, exclusive draft.
- Milestone 2: **69/69 original dedicated Node tests passed**; six **genuine native ES-module Chromium WebGL2** captures at 667×375, 844×390, 932×430 and rotations 0,1 passed. All eight residential variants visually inspected. No new material technical defect discovered; M2 isolated *technical* review acceptable to proceed to source-only M3. **Creator art/physical-iPhone and production engine integration are NOT accepted**.
- Milestone 1 WebGL2 six-preview rerun also PASS; creator art and original HTTP-served load remain OPEN. Local browser administrator blocks localhost navigation.
- Began **Milestone 3** with symbolic `pack5:086` Shop Counters (ledger-service; festival-fascia) and `pack5:087` Display Shelves (stepped-market-tray; curio-arcade): four source-authored physical box-union variants, floor backing, real selection/removal/colliders and fixture-only snapshot restore, no trade or inventory systems.
- Genuine native Node 22.16.0 suite **83/83 PASS** (69 inherited + 14 M3), exact local source/test Git blob parity. New fixture preview costs 26/31/23/26 source boxes (312/372/276/312 unculled triangles) per 1-cell candidate, within existing box budgets; no mobile GPU benchmark claimed.
- Six real Chromium WebGL2 native ES-module M3 screenshots passed with four distinct nonblank candidate cards and 0/1 rotation change per viewport; actual source-served HTTP still blocked. `esm-webgl-browser.py m3 <output-directory>` reproduces evidence.
- Pack 5 statuses **9 CANDIDATE / 9 NOT STARTED / 0 INTEGRATED**. M3 remaining 88 Anvils & Forge Fixtures, 89 Cauldrons & Alchemy Stations, and 90 Ovens & Cooking Ranges are **NOT STARTED**. See `M3_ACCEPTANCE.md`.
- No assignment of production IDs, changes to main/schema-1, shared systems, other developer paths, automated work, world placement, merge, deployment or v0.11 unlock.

## Full M3 source-candidate roster authored — November 14, 2026

- Kept original source candidates 79–87 byte-unchanged; added `workshop-fixtures.mjs` for 88 Anvils & Forge Fixtures, 89 Cauldrons & Alchemy Stations, 90 Ovens & Cooking Ranges, with **six original physical geometry variants**. No crafting, heating, alchemy liquids, trading, cooking, inventory or in-world placement.
- Concrete physical models have 18–23 boxes / 216–276 uncullled triangles each; precise original authored subcell selection/collision; true empty cauldron middle and oven mouth, modeled anvil horn. All support and rotation/variant fixture behaviors are tested, never production schema-1.
- Verified all six new models in **six genuine native ES-module Chromium/WebGL2 screenshots**, 667×375, 844×390, 932×430 and rotations 0/1, with nonblank unique GPU pixel fingerprints. Reproduce `esm-webgl-browser.py m3b <out-dir>`; gallery is `workshop-gallery.html`. HTTP-served gallery still blocked by administrator; no real iPhone GPU or creator art approval.
- **102/102 genuine native Node 22.16.0 PASS**, 0 skips: 83 original Pack 5 cases + 19 new workshop regressions including outward-face winding of every physical source box in all four rotations. Source and test byte identity verified with GitHub blobs. Full details: `M3_ACCEPTANCE.md`.
- All M3 source families 86–90 are now **CANDIDATE**. Full Pack 5: **12/18 CANDIDATE**, **6 NOT STARTED** (91–96), **0 INTEGRATED**, numeric IDs none. Creator visual and production acceptance remain OPEN. Current main rechecked checkpoint 008 `ac263720b60641c65b02330348dd76d0ef9cb75e`.
- Remaining M3 art concerns: anvil horn subdued at screenshot scale; square cauldron silhouette visually trough-like. These candidates are not creator-approved. Do not proceed to M4 until a subsequent explicit Continue Development cycle and review, and never alter other pack, engine, automation, worldgen, schema or CI files from this lane.

## M3 true physical silhouette repair, M4 candidate expansion — 2026-11-14

- Current checked integration main remains `ac263720b60641c65b02330348dd76d0ef9cb75e` / checkpoint **008**, Issues #109/#117 and current manual Packs 1–4 and automated biome130 manifests reverified. PR #119 stays DRAFT; no shared or other lane changes.
- Substantiated in genuine Chromium screenshots: anvil 88 horn too visually small; cauldron 89 a boxy trough. Rebuilt **actual selectable/collidable box geometry** with five tapered anvil horn tiers and three physical octagonal cauldron shell rings (true hollow interior, solid base, physically bracketed side handles). Three new focused tests verify real horn extent and cauldron hollow raycast.
- **105/105 native Node 22.16.0 M0–M3 tests PASS**, separately 6/6 genuine Chromium WebGL2 native ES module `m3b` captures passed at 667×375 / 844×390 / 932×430, 0/1 rotations; screenshot comparison retained as local visual artifact.
- Conditional advancement to isolated **M4 physical candidate authoring**: 91 Desks & Lecterns (cartographer oak desk / moonstone lectern), 92 Carpets & Rugs (two-cell hearthwoven runner / one-cell starlace sigil rug), 93 Altars & Pedestals (runesworn stone altar / sunspire reliquary plinth). Six distinct geometry/material variants, actual source-part collision and selectability. Long woven runner requires floor support beneath **both** rotated cells and removes atomically; floor textiles are shallow true relief, not flat painted textures.
- Added 15 native M4 regressions; full **120/120 native Node PASS** (0 failed/skipped), exact committed geometry source/test Git blobs match executed copies. **M4 native ES-module Chromium WebGL2 6/6 PASS** at all three landscape sizes and both preview rotations; returned unique nonblank physical-candidate GPU pixels, screenshots visually reviewed.
- Re-ran unchanged M1/M2/M3 source galleries: **18 additional real Chromium WebGL2 screenshots PASS** on the same current checkout. Current five gallery modes `m1,m2,m3,m3b,m4`: total **30/30 source-exact Chromium WebGL2 views PASS**, independent of production HTTP served loading.
- Pack 5 ledger **15 of 18 CANDIDATE**, 3 NOT STARTED (**94 heavy gates, 95 chandeliers, 96 stable partitions/troughs**), 0 integrated; permanent numeric IDs 0 allocated. M1–M4 creator artwork, physical iPhone performance, HTTP-served gallery and safe production schema-1 integration remain OPEN.
- Next dedicated cycle: creator-level M3/M4 art/readability improvements and then M5 only with another explicit Continue Development; no merges/deployments/world placements/other pack or engine changes.
