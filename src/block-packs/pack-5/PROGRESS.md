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

## M5 completion of source CANDIDATE roster — November 14, 2026

- Reverified live `main` `ac263720b60641c65b02330348dd76d0ef9cb75e`, checkpoint **008**, coordination Issues #109/#117, latest independent manual Pack 1–4 and biome130 PR heads/manifests. All Pack 5 changes exclusively in draft PR #119's `src/block-packs/pack-5/**` and `tests/block-packs/pack-5/**`; no merge/deploy/integration.
- All three remaining M5 symbolic families physically authored: `pack5:094` Citadel Ironbound Leaves + Falling Portcullis Grille (actual 2-cell gates, open physical gaps in portcullis); `pack5:095` Suncrown Eight-Arm + Prismatic Starrack (ceiling-attached real suspended geometry, no lighting); `pack5:096` Oak Stall Divider + Stone Feed Trough (physically supported atomic 2-cell privacy stall wall, true hollow dry feed basin, no animals/water).
- Authentic 667–932px mobile landscape WebGL2 review exposed the M5 stall divider initially too similar to Pack 2 fences and an unrecognizable plain stone trough. Repaired the actual material box geometry: solid low kickboards/bracing, distinctive exterior feed-trough timber and rivets, still retaining upper-open and hollow-cavity partial physics.
- New **actual degenerate M5 underside quad** was caught by two-triangle face winding audit, and fixed in the preview mesh source only; no production renderer altered.
- **Final verified current-branch 156/156 genuine native Node v22.16.0 tests PASS**, zero skipped/failed: original 120 M0–M4, 12 M5 fixture cases, 24 separately committed in-depth `fortified-specialties.test.mjs` cases. Previous 132/144 staged counts are superseded; all 24 deep M5 cases are now committed and source/test blobs were compared to GitHub. Exact M5 source blob `06a4a5893761b1cc4cd3f4381630d6d17f7c72f8`, fixture test blob `0a9c8660340079d287b9fb805ea8ad9d4b07ceb5`, dedicated M5 test blob `1eb17969764c5672bc4567da252d5d1509e384b2`. The locally staged manifest metadata predated the branch manifest, but the tested invariant of 18 candidates and zero numeric registrations matched.
- Reran five older original galleries M1,M2,M3,M3b,M4 = **30/30 genuine source-driven Chromium WebGL2 captures**; newly added M5 = **6/6**. **36/36 total authentic native ES-module/WebGL2 screenshot views**, 667×375, 844×390, 932×430 each at 0/1 quarter-turn. Screenshots inspected and preserved locally; actual HTTP-served page remains browser-admin BLOCKED, physical iPhone never tested.
- Prototype-only geometry budgets: 94 gates 46/44 total source boxes over two cells, 95 hanging lights 25/19 source boxes, 96 stall/trough 44 over two cells / 34 in one; never above 64 boxes or 768 unculled triangles **per occupied cell**. No real production draw-call/GPU/thermal measurements.
- All **18/18** Pack 5 families are now original CANDIDATE sources, 0 integrated and zero live numeric IDs. **Next step M6 isolated cross-family final acceptance/readiness**, not merge. M1–M5 creator art, real-iPhone controls, actual served Pages and production schema-1 save/ID/shape integration remain OPEN, Gate A not approved, v0.11 LOCKED.

## Final M5 independent recheck / GitHub handoff — 2026-11-14

- GitHub main `ac263720b60641c65b02330348dd76d0ef9cb75e`, checkpoint **008**, Issues #109/#117, separate manual Packs 1–4 and symbolic biome130 ownership verified again; all changed PR paths remain Pack 5-exclusive.
- Executed real **156/156 native Node PASS, zero failures/skips** on byte-matched source and focused test blobs from draft PR #119. All 18 symbolic candidate families remain source-authored, zero integrated and zero persistent numeric IDs. This is isolated candidate fixture QA, not production save/world tests.
- Executed **36/36 real Chromium native ES-module WebGL2 screenshot captures PASS** on all six Pack 5 galleries (M1, M2, M3, M3b, M4, M5), each at 667×375 / 844×390 / 932×430 CSS landscape and two rotations. All six M5 variants nonblank and visually distinguishable. Review images saved as local uncommitted evidence, not deployed assets.
- Current M5 gate, chandelier, stable divider and trough review found **no new reproducible source-geometry defect** after prior kickboard, trough weatherboard and preview underside-winding fixes; no further candidate model edits this cycle. Real HTTP-served navigation, physical-iPhone measurements, final creator artwork and central runtime integration remain OPEN.
- M5 isolated source technical acceptance is PASS; **next M6 is an isolated cross-family readiness audit only**, not automatic incorporation. PR remains DRAFT/unmerged/undeployed, Gate A OPEN and v0.11 LOCKED.


## Milestone 6 — cross-family source-only readiness acceptance (2026-11-14)

- Latest reverified main `ac263720b60641c65b02330348dd76d0ef9cb75e` / checkpoint **008**, current Issues **#109/#117**, competing manual Pack 1–4 draft branches and :12 biome130 catalog. All Pack 5 changes remain only in draft PR #119 and exclusively within source/tests Pack 5 paths.
- Implemented **22 genuinely new native cross-family source QA cases** in `tests/block-packs/pack-5/m6-cross-family.test.mjs` (Git blob **`5395171b45d86dc28c56c0c40b534526d4b2eb57`**, matched exact locally executed bytes). Covers all 18 physical families with 36 variants in one fixture, adjacency and occupied-cell boundaries, two-cell overlap rejection/atomic rollback, ceiling/wall/floor support distinctions, mixed-family collision/target/removal, deterministic variant snapshots and schema rejection, source-only geometric preview budgets.
- Full focused genuine **Node 22.16.0 178/178 PASS**, zero skipped/failed = prior 156 + 22 M6. All seven candidate source modules and previous test blobs verified against GitHub; local manifest metadata lagged, but exact candidate/zero-ID invariants matched. Do NOT equate candidate fixture QA with the real engine.
- Reexecuted all six original galleries `m1,m2,m3,m3b,m4,m5` using native ES-module Chromium/WebGL2 offline data URLs: **36/36 screenshots PASS** at 667×375, 844×390, 932×430 at 0/1 rotations. Actual authored candidate objects appear distinct and nonblank; no newly proven clipping/shape issue. HTTP-served Pages navigation remains administrator-blocked.
- **18/18 CANDIDATE, 0 integrated, 0 persistent numeric IDs.** M6 isolated technical cross-family readiness PASS. All M1–M5 creator premium artwork approvals, real iPhone control/GPU measurements, production schema-1 save/registered ID constraints, actual world placement and Pages served-browser verification remain **OPEN**. Gate A OPEN; v0.11 LOCKED.
- M6 final source acceptance detailed in `M6_ACCEPTANCE.md`. Do not merge/deploy/world-place or edit shared engine/registry/CI/automations/other lanes without independent explicit authorization.

## Post-M6 final readiness refinement — 2026-11-14

- **Demonstrated actual Pack 5 fixture selection defect** with a physical counter: multiplying a ray direction `[0,-1,0]` by 3 let `raycast/removeRay` bypass the same world-distance reach cap and remove an object farther than the permitted distance. This is a real geometric selection issue in the *isolated test fixture*, not a claim about the production renderer.
- Fixed `src/block-packs/pack-5/fixture.mjs` **only**: normalize valid finite ray directions before AABB slab intersection, reject overflowing norms, return genuine world-unit hit.distance and respect maxDistance consistently. Source Git blob `cf7baf90555d81ddd4dcba496f2d3ea469b12a41`.
- Added **four genuine M6 cross-family native regressions** for scale-invariant range, safe overreach removal, mixed stacked chandelier/counter nearest targeting, and finite-component but invalid infinite-length vectors; Git test blob `de5ee4ae2ad0b17165a13245b874e407725aa6da`.
- **182/182 native Node 22.16.0 PASS, 0 failed/skipped** after patch (156 original M0–M5, 22 original M6, four added). Same source-exact Pack 5 modules and dedicated suites; candidate geometry unaffected.
- **36/36 genuine Chromium native ES-module WebGL2 captures PASS** after fixture correction: m1/m2/m3/m3b/m4/m5 at 667×375 / 844×390 / 932×430 CSS landscape and rotation 0/1. No blank panel/clip regression observed in physically authored M5 shapes; offline WebGL2 only, NOT source-served HTTP or physical iPhone GPU.
- Rechecked latest main `ac263720b60641c65b02330348dd76d0ef9cb75e`, checkpoint **008**, Issues #109/#117, other four manual packs and biome130 ownership. No other source directories touched; no workflow rerun/cancel.
- All **18 source-only family entries CANDIDATE**, 0 integrated and 0 registered persistent numeric IDs. M6 isolated source technical readiness **PASS after targeted repair**, with creator art, Pages-served verification, real iPhone controls/performance and central schema-1/ID shape integration still OPEN. Keep PR DRAFT, v0.10 Gate A OPEN, v0.11 LOCKED. See `M6_ACCEPTANCE.md`.
