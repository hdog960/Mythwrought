# Mythwrought Block Pack 5 — isolated interiors and specialty architecture

**Draft-only isolated pack.** No production registration or world placement; no numeric ID assigned.
The creator reserved 18 roster entries `pack5:079`–`pack5:096`. These are **symbolic**, not game block IDs.
Latest checked main: `ac263720b60641c65b02330348dd76d0ef9cb75e`, checkpoint 008 (branch historically based on checkpoint 006). Read Issues
#109 and #117 every session. Never touch the four other manual packs or biome130 catalog.

## Milestone 1 — physical architectural surfaces (CANDIDATE)
`architectural-surfaces.mjs` authors six ORIGINAL physical box-part variants across three symbolic
families, each with an explicit material palette, actual selectable 3D box volumes, bounded typed
mesh vertices/triangles, appropriate support and *partial-volume* collision where applicable.

| Symbolic | Family | Distinct variants | Support |
| --- | --- | --- | --- |
| pack5:079 | Plaster & Stucco | chalk-lime; hand-troweled | wall behind negative local Z |
| pack5:080 | Fired Brick Masonry | hearth-running-bond; kiln-soldier-course | free/standalone |
| pack5:081 | Ceramic Interior Floor Tiles | sunburst-encaustic; moonwoven-glaze | floor below negative Y |

All variants are currently **CANDIDATE**, not integrated. A variant is authored geometric material
state under the same symbolic family, not a separately allocated numeric game ID. There is no desert
adobe duplicate, exterior paving clone, original STONE 3 alias or worldgen-generated placement.

`fixture.mjs` remains a test-only, multi-cell occupancy, shape raycast, partial collider,
four-way rotation, support, and reversible **fixture-specific** snapshot adapter. Tests can supply
variant names to `place(symbolicId,cell,rotation,variant)` and roundtrip a 6-column candidate-only
snapshot; original 5-column fixture rows still work. Neither envelope is Mythwrought schema 1.

Test natively from repository root:
`node --test tests/block-packs/pack-5/*.test.mjs`
The default CI `npm test` only discovers `tests/*.test.mjs` and does **not** run these nested tests.

For a genuine browser art check after Chromium access is repaired, serve the isolated tree and
open `tests/block-packs/pack-5/architectural-gallery.html`: it renders actual physical box
triangle meshes with WebGL2. Its source alone is not screenshot evidence. Never claim actual
mobile performance, physical iPhone controls, or premium art acceptance without direct evidence.

Future shared registry, engine shape/collision, attachment support, persistent variant state,
save compatibility and world-placements belong to central creator-authorized integration.
Read `PROGRESS.md` and `manifest.json` for true candidate/verification statuses and handoff.

## Latest Milestone 1 candidate acceptance review

- Genuine Node 22.16.0 dedicated suite: **44/44 PASS**, exact checked-in source and tests matched Git blob hashes.
- Physical fired brick now wraps original manufactured running/soldier courses around all four lateral faces; both have real solid collision, not plain reverse-face paint. Source-box budgets are 504 and 636 triangles, respectively, under the existing preview bounds.
- `canvas-gallery.mjs` uses the same source-derived physical mesh triangles and a CPU depth buffer, avoiding previously mis-sorted painter-order artifacts. This is **genuine Chromium Canvas2D** only, not WebGL2.
- `tests/block-packs/pack-5/capture-canvas.py` reproducibly captures six screenshots across 667×375, 844×390, 932×430 and rotations 0/1; it verifies six unique asset-panel pixel hashes per image and meaningful rotation changes.
- Authentic source-served WebGL2 is **NOT VERIFIED** in this environment. Pixel fingerprints and candidate snapshots cannot substitute for actual engine integration, premium-art approval, in-game target/collision, or backward-safe schema-1 save tests.
- `M1_ACCEPTANCE.md` contains full verified evidence; **M1 acceptance remains open** and M2 residential furniture is not authorized to begin merely because the source was authored.

## Reproducible landscape WebGL2 preview

Run in a Chromium/Xvfb environment with Mesa software OpenGL:

`LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python tests/block-packs/pack-5/gallery-webgl-browser.py <output-dir>`

This Pack 5-only Python Playwright runner verifies six *genuine* WebGL2 draws at 667×375, 844×390 and 932×430, for 0° and 90° shape rotations; it writes screenshots and requires unique nonblank pixel readback for all six candidates. Browser navigation to localhost is blocked in the current test sandbox, so the runner assembles the exact checked-out JavaScript sources inline in an offline `about:blank` page. This is **not** proof that the original served HTML/module graph loads correctly. Do not describe this as physical iPhone testing, deployed renderer output, premium art approval or live schema-1 state support. See `M1_ACCEPTANCE.md`.

## Milestone 2 — isolated physical residential candidate pool

`residential-furnishings.mjs` defines four **CANDIDATE** physical families, each with two distinct original geometric variants: 82 Beds (genuine two-cell head/foot with per-cell floor support and canopy), 83 Chairs & Stools (single-person seat silhouettes, no sitting), 84 Bookshelves (modeled books/scrolls with rear/side joinery, not retail display shelving), and 85 Cabinets & Wardrobes (closed paneled furniture, not gameplay inventory). No housing, room assembly, NPCs or new gameplay.

`residential-gallery.html` previews the eight candidates in a responsive WebGL2 4×2 grid. Native Node: `node --test tests/block-packs/pack-5/*.test.mjs` (**66/66** currently pass). Reproducible genuine Chromium WebGL2 **with actual native ES module execution** for both M1 and M2:
`LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python tests/block-packs/pack-5/esm-webgl-browser.py m2 <output-directory>`
(use `m1` for previous architectural surfaces).

The runner changes relative imports to absolute `data:` module URLs for offline about:blank because the environment prevents localhost HTTP navigation; it **does not certify source-served module loading**, real iPhone GPU performance, live registry/collision/save state, or creator visual approval. Review `M2_ACCEPTANCE.md` and `M1_ACCEPTANCE.md`. Latest checked `main` is checkpoint **008**; Pack 5 is still unmerged/development-only.

**Latest candidate-only QA:** 68/68 native Node cases pass (44 M0/M1 + 24 M2), including precise authored body-part collision unions for beds, seats and shelves. Eight M2 variants were rendered via genuine WebGL2 native ES-module data-URL loader at three iPhone landscape resolutions and both preview rotations. No persistent IDs, production saves, live placement or actual iPhone controls were tested.

**Current isolated M2 refinement QA:** 69/69 native Node cases PASS, including a new assertion that both physical bookshelf variants show at least twelve modeled book/scroll spines past their wooden shelf lips. Genuine Chromium native ES-module WebGL2 review passed at all three mobile landscape sizes and both orientations. Browser-admin localhost HTTP navigation is STILL blocked; no source-served gallery, real mobile GPU or creator visual signoff. All 7 developed families stay symbolic CANDIDATES.

## Milestone 3 — initial commercial shop and display source candidates

`shop-workshop.mjs` contains **two** new symbolically named **CANDIDATE** physical reusable voxel families: 86 Shop Counters (ledger-service; festival-fascia) and 87 Display Shelves (stepped-market-tray; curio-arcade). These are genuine independent selectable and collider-bearing part unions; neither defines trading, inventory contents, crafting, shop NPCs, buildings or world placement.

`shop-gallery.html` renders all 4 candidates as actual WebGL2 source meshes. Reproduce six browser views through `LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python tests/block-packs/pack-5/esm-webgl-browser.py m3 <output-directory>`. Native Node `node --test tests/block-packs/pack-5/*.test.mjs` currently **83/83 PASS**. All source/test blobs were compared with the exact remote draft PR version. See `M3_ACCEPTANCE.md`.

**Status:** nine of eighteen physical families are authored **CANDIDATES**, nine remain **NOT STARTED**, zero are integrated. Families 88–90 still require source authoring. Milestones 1/2 creator artwork and production acceptance stay OPEN; preview screenshots are not deployed gameplay and no physical iPhone device was tested. Latest inspected main checkpoint **008**; v0.11 locked.

## Milestone 3 workshop fixture source candidates (88–90)

`workshop-fixtures.mjs` contains six further physically authored independent voxel shape variants: 88 Blackiron Horn / Moonsteel Stake anvils; 89 hollow Iron Tripod Cauldron / Alchemist's Spiral Stand; 90 Ashstone Bake Oven / Copper Range Top. They use exact box-union collisions, floor backing, real ray target/removal and isolated snapshot roundtrips, with **NO heat, liquid, potion, forging, cooking, storage or crafting logic**.

Reproduce genuine native ES-module Chromium WebGL2 for the six new workshop variants at all three mobile landscape viewport sizes and both rotations:

`LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python tests/block-packs/pack-5/esm-webgl-browser.py m3b <output-dir>`

Original M3 86–87 commercial fixtures remain in separate `m3` gallery mode. Native source-exact tests: `node --test tests/block-packs/pack-5/*.test.mjs` (**102/102 PASS**). Source mesher upper bound 276 unculled triangles for each new model, not real device GPU timing. Both local data-URL ES modules and actual WebGL2 rendering are verified, NOT HTTP-served app module loading or playable-world integration.

**Candidate roster: 12 authored, 6 unstarted (M4/M5), 0 integrated.** All IDs are symbolic. M1, M2 and M3 creator visual, physical-iPhone and integration approvals are still separately OPEN. See `M3_ACCEPTANCE.md` for the actual source/test Git blob evidence and remaining art deficiencies.

## M3 silhouette refinement and isolated M4 civic furnishings

Physical M3 source repair: `workshop-fixtures.mjs` now has longer visibly tapered anvil horns and an **actually hollow stepped-octagonal iron cauldron**, backed by native collision/raycast regressions. No production physics changed; view `M3_ACCEPTANCE.md` for exact Git hashes, six real Chromium captures, per-cell budgets and open creator acceptance.

**M4 (CANDIDATE only)**: `civic-interiors.mjs` authors `pack5:091` cartographer desk + high stone lectern, `pack5:092` two-cell physical woven runner + shallow patterned single-cell rug, and `pack5:093` inlaid indoor altar + slender reliquary pedestal. No gameplay, writing, inventory, magic, NPCs, town assembly or world placement. Accurate physical shapes, front/rear openings, floor support, rotations, ray select/remove and candidate-only variant snapshots tested.

To reproduce honest native Chromium ES-module/WebGL2 M4 screenshots with virtual X software GL:
`LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python tests/block-packs/pack-5/esm-webgl-browser.py m4 <output-dir>`

For earlier groups use `m1`, `m2`, `m3`, or `m3b`. Historical M4 focused run `node --test tests/block-packs/pack-5/*.test.mjs` **120/120 PASS**; the latest full M5 run below now covers 156 tests. Direct localhost HTTP remains blocked; these genuine WebGL2 renders use offline native `data:` ES-module imports and cannot certify production pages, Safari or iPhone GPU. See `M4_ACCEPTANCE.md`.

**Historical M4 snapshot:** 15 symbolic candidates / 3 not started / 0 integrated. M5 94–96 are now also source-authored CANDIDATES; current roster 18/18 candidates, 0 integrated. No persistent numeric IDs assigned, no Gate A/v0.11 approval; draft PR only.

## Milestone 5 original physical fortified / stable specialties (candidate source only)

`fortified-specialties.mjs` authors all six original candidate variants for symbolic `pack5:094`–`pack5:096`: two side-by-side physical gate panels (ironbound heavy planks vs. an open-slot portcullis), two actual ceiling-supported chandeliers (nonfunctional unlit candles/crystal arms), and two distinct stable fixtures (two-cell post/rail divider with physically opaque lower privacy kickboards vs. hollow dry feeding trough with real timber weatherboards). No opening animation, lighting engine changes, livestock/feeding, fluid simulation, world placement, persistent numeric block IDs or production schema-1 writes.

The new candidate gallery `tests/block-packs/pack-5/specialty-gallery.html` is authentic original-source WebGL2 preview; reproduce with:
`LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python tests/block-packs/pack-5/esm-webgl-browser.py m5 <output-dir>`.
The browser runs native JS ES-module semantics through offline `data:` imports because real localhost HTTP navigation is blocked; **not** published app or Safari performance.

**Final current-branch source-exact focused test rerun:** `node --test tests/block-packs/pack-5/*.test.mjs` **156/156 genuine native Node 22.16.0 PASS**, 0 skips/failures (original 120 M0–M4 + 12 M5 fixture + 24 separately committed deep M5 tests). Earlier 132 and 144 test counts are superseded; the 24 dedicated deep M5 cases are now committed at Git blob `1eb17969764c5672bc4567da252d5d1509e384b2`. All focused source/test files were Git blob matched. The staged manifest metadata was behind the current PR manifest, but 18 CANDIDATE / 0 integrated / 0 persistent numeric ID invariants matched. Reexecuted **36/36 genuine native ES-module Chromium WebGL2 screenshots** in the latest session across all six modes `m1,m2,m3,m3b,m4,m5`, each at 667×375 / 844×390 / 932×430 CSS landscape and two rotations. This is Xvfb/software-GL offline `data:` module rendering, not HTTP-served Pages or physical iPhone performance. Source/QA and outstanding approval details: `M5_ACCEPTANCE.md`.

**Full 18-family Pack 5 roster authored as CANDIDATES; 0 INTEGRATED, zero persistent numeric IDs.** M6 next is only a technical/creator **readiness audit**, not permission to merge or unlock v0.11. Final creator art and physical iPhone acceptance remain open, as do schema-1 and centralized registered-asset integration approvals.

**Latest Milestone 5 acceptance:** see `M5_ACCEPTANCE.md` for exact verified 156 focused cases, 36 screenshot captures, source-only geometry and remaining creator/served-HTTP/real-iPhone/integration gates. All 18 symbolic physical candidates exist in the isolated draft branch; M6 is a separately authorized acceptance/readiness stage, not permission to merge or register assets.


## M6 — mixed-family source-only acceptance (not integration)

The new `tests/block-packs/pack-5/m6-cross-family.test.mjs` adds 22 substantive *native Node* cases that combine the authored 18 symbolic physical families (36 variants) in the same isolated candidate fixture. Assertions check cell-boundary adjacency, overlapping two-cell footprint rejection without residual occupancy, wall/ceiling/floor support, physically shaped subcell collision, targeting/removal isolation, deterministic mixed-variant snapshots and corrupted-restore rollback, and original source preview budgets.

**Latest Pack 5 dedicated suite: `node --test tests/block-packs/pack-5/*.test.mjs` — genuine Node 22.16.0 178/178 PASS, zero skipped/failed.** The M6 source test file's exact Git blob is `5395171b45d86dc28c56c0c40b534526d4b2eb57`, matching executed local bytes. This is *not* root Actions, real production renderer/collision, or schema-1 save proof.

All six original-source browser galleries `m1,m2,m3,m3b,m4,m5` were rerun on Chromium native ES-module + real WebGL2 via offline `data:` imports: **36/36 captures PASS** at 667×375 / 844×390 / 932×430 × 0/1 rotations. The browser's localhost HTTP restriction remains unresolved; no physical iPhone hardware or creator art approval claim.

See `M6_ACCEPTANCE.md` for exact ownership, tests and external dependency gates. **18/18 symbolic families authored as CANDIDATE, 0 INTEGRATED, 0 persistent numeric IDs.** Candidate-source M6 readiness PASS **does not grant** merge/deploy, live placement, schema-1 engine changes, integration approval, Gate A signoff or v0.11 unlock.

## Post-M6 verified candidate fixture reach correction

At the latest source-only post-M6 review, the original 178 tests uncovered a real selection/reach defect not covered by unit-direction rays. The isolated `fixture.mjs` now normalizes arbitrary finite nonzero targeting direction vectors, preserving a true world-unit `maxDistance` for both `raycast` and `removeRay`. Four additional focused regressions prove that scaled directions cannot reach/remove distant fixtures and that mixed stacked targets preserve nearest-hit ordering. These changes affect **only the Pack 5 candidate test fixture**, not the production game renderer, raycast or save schema.

**Current source-exact native Node v22.16.0: 182/182 PASS** (0 fails/skips); `node --test tests/block-packs/pack-5/*.test.mjs`. Genuine Chromium native ES-module/WebGL2 gallery checks **36/36 PASS** across six gallery groups, 3 iPhone-landscape proxy sizes and two rotations, on the updated fixture. Source blob `cf7baf90555d81ddd4dcba496f2d3ea469b12a41`; test blob `de5ee4ae2ad0b17165a13245b874e407725aa6da`. Historical 178 count was pre-fix. Exact root GitHub Actions may remain queued and is not replaced by these locally executed focused tests.

All **18/18 original physical families remain only CANDIDATE**, with **zero live numeric IDs/zero integrated**. Creator art and actual physical-iPhone approval, real HTTP Pages serving, gameplay/registry shape contract and schema-1 safe integration are still separate open gates. Nothing deployed/merged/world-placed. See `M6_ACCEPTANCE.md` for reproducible evidence and limits.
