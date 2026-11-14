# Pack 4 — Windows & Furnishings progress ledger
**UNMERGED CANDIDATE — NOT IN LIVE GAME • Gate A v0.10**

**Branch:** `pack-4-m0-m1-windows-openings-20261114`
**Base main:** `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`
**Latest creator incorporation:** checkpoint 006, game code `1006e5cd5fd44e5696943d2651e63fb30a393003`.
**Exact PR HEAD:** GitHub PR `head.sha` and PR description provide the
final immutable review SHA after the last commit. Do not embed a commit's
own SHA inside itself. New commits require updating PR handoff and re-testing.
**Ownership:** Pack 4 source/tests ONLY; ID band 159–208. Protected 0–8 / 255.

| Roster | Family | Candidate persistent IDs | Variants | State |
|---:|---|---|---|---|
| 30 | Clear glass | 159 | Clear beveled pane | Candidate built, tests authored |
| 31 | Stained glass | 160,161 | Sunfire; Moonveil | Candidate built, tests authored |
| 32 | Wooden window frames | 162 | Open carved oak sash | Candidate built, tests authored |
| 33 | Wooden shutters | 163 | Closed double-leaf oak | Candidate built, tests authored |
| 34 | Iron bars | 164 | Four-rod wrought grille | Candidate built, tests authored |
| 35 | Lantern blocks | 165 | Hearthbound iron/copper floor lantern | Candidate built, tests authored |
| 36 | Wall-mounted lanterns | 166 | Hawthorn wall sconce | Candidate built, tests authored |
| 37 | Crystal lanterns | 167 | Aetherglass caged blue crystal | Candidate built, tests authored |
| 38 | Torch blocks | 168 | Wayfarer bracket wall torch | Candidate built, tests authored |
| 56 | Barrels | 169 | Eight-stave copperhoop barrel with iron hoops and lid | Candidate built, tests authored |
| 57 | Wooden crates | 170 | Ironbound crate with separate slats and corner ferrules | Candidate built, tests authored |
| 58 | Wooden benches | 171 | Four-legged oak bench with open seat underside and raised back | Candidate built, tests authored |
| 59 | Wooden tables | 172 | Four-legged table, open underframe and decorated top | Candidate built, tests authored |
| 60 | Wooden signs | 173 | Standing waymark sign, post, framed blank and fasteners | Candidate built, tests authored |
| 61 | Hanging banners | 174 | Ceiling-hung burgundy banner with split swallowtail | Candidate built, tests authored |
| 62 | Market canopy blocks | 175 | Single wall-mounted scalloped Seaglass canopy segment | Candidate built, tests authored |
| 63 | Chimney blocks | — | — | Planned, M4 |
| 64 | Fireplace blocks | — | — | Planned, M4 |
| 65 | Well rim blocks | — | — | Planned, M4 |
| 66 | Well roof blocks | — | — | Planned, M4 |
| 67 | Well pulley blocks | — | — | Planned, M4 |
| 68 | Fountain blocks | — | — | Planned, M4 |

### Milestones
- **M0 Foundation:** base/checkpoint/Issue #109/registry and open PRs
  inspected; dedicated branch, unique namespace, explicit manifest and
  isolated test directory created. Other manual packs and automated lanes
  remain untouched.
- **M1 Windows/openings:** six visual/physical variants across five
  exclusively owned families implemented in `windows.mjs`, with actual
  partial selection/collision boxes, four-way Y rotations, transparent
  material separation and strict state serialization. **Candidate only,
  awaiting Node + browser and integration acceptance.**
- **M2 Lighting:** Four physically independent candidate families (35–38) authored in `lighting.mjs`, with distinct iron/copper/wood/crystal/fire material silhouettes, floor or wall mounting requirements, four-way orientation, partial collision/selection and strict candidate state. Light color/intensity/radius metadata is recorded, but engine emission is explicitly `engineEnabled:false`. **Candidate source implemented; live integration and visual acceptance pending.**
- **Isolated interactions:** `fixture.mjs` adds isolated place/remove, sub-box raycast, partial collision and fail-closed atomic schema-1-style fixture snapshot replay. This is NOT a production save format or a generated-world change.
- **M3 Furniture & market components:** seven physically individual assets across 56–62 authored as candidate IDs 169–175 in `furnishings.mjs` (barrel, crate, bench, table, sign, banner, canopy **component only**). All include distinct box-union silhouettes, material profiles, 4-way rotation, per-cell selection/collision, supported placement and strict state. `fixture.mjs` extended to 17 IDs including ceiling-hung banner and wall-supported canopy, with focused tests. **Candidate implementation done, native isolated Node / Chromium / live integration acceptance pending.**
- **M4** six hearth/civic families (63–68) not started.
- **M5** full 22-family review and manual handoff pending.

### Verification status — 17-asset M3 candidate
- Current main independently checked at `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, integration checkpoint **006** (`1006e5cd...`), `src/voxel.mjs` and `src/blocks.mjs` registry still limited to persistent IDs 0–8. Compared Issues [#109](https://github.com/hdog960/Mythwrought/issues/109) and [#117](https://github.com/hdog960/Mythwrought/issues/117); auto :12's biome130 roster is exclusive and does not duplicate the seven generic furniture entries. Other manual pack IDs remain untouched.
- **Pack 4 IDs 159–175** are provisional, 17 **different physical candidates** covering **16/22 families**; IDs 176–208 remain unallocated; protected 0–8 / 255 preserved.
- Exact GitHub source and five nested Pack 4 Node-style test bodies executed in V8 JavaScript compatibility harness: **100/100 PASS** (29 windows, 19 lighting, 31 furniture, 11 original fixture, 10 furnishing fixture). This runs real source logic under V8 but **NOT native Node's test runner**; all failure reports remain honest.
- **GitHub Actions standard Node and Chromium baseline SUCCESS** at prior PR HEAD `6fc1b21d1f878b4908c95e264a8965a7ab1670f2`: [run 43630645050](https://github.com/hdog960/Mythwrought/actions/runs/43630645050). This run is **pre-M3**, the root CI glob excludes Pack 4's nested tests, and it does not prove candidate gallery rendering.
- Existing source-derived ten-ID geometry snapshot previously exercised with local native Node 22, **33/33 PASS**, but NOT direct source import. It does not cover the newly authored M3 IDs.
- **Native Node for entire exact Pack 4 branch:** NOT VERIFIED. Local git checkout cannot fetch GitHub (DNS/network unavailable), and shared CI workflows are off-limits. Required manual command: `node --test tests/block-packs/pack-4/*.test.mjs`.
- **Genuine Chromium gallery:** an isolated 17-candidate WebGL2 test script is authored at `tests/block-packs/pack-4/gallery-browser.mjs`, with 667×375 / 844×390 / 932×430 viewports and UNMERGED screenshot labels. A local headless Chromium attempt against earlier source-derived preview **timed out in software WebGL startup**. Therefore NO new authentic 17-candidate WebGL screenshot, no accepted shader depth/transparency proof and NO physical iPhone certification.
- Candidate gallery reworked to use **one** shared WebGL2 canvas and 17 separate 2D preview cards to avoid exhausting WebGL contexts on mobile. This is authored but not browser-approved.
- All changes isolated to `src/block-packs/pack-4/` and `tests/block-packs/pack-4/`. **No merge, deployment, world placement, renderer/regional mesher, saves, central registry, CI workflow or iPhone control edit.**

### Dependencies and integration contract
- Generic opt-in shape/mesh [#108](https://github.com/hdog960/Mythwrought/pull/108) and partial-cell targeting/collision/save [#106](https://github.com/hdog960/Mythwrought/pull/106) are separately owned. Pack 4 geometry must be mapped to those *when integrated*; no false full-cube collisions.
- Lighting: candidate color/radius/intensity metadata ONLY, no dynamic light sources. Glass: candidate alpha, no proof of production transparent depth ordering.
- Furniture: sign is a blank physical panel, NOT a functional text editor. Banner has no wind motion. Market canopy is **one** segment, not a built market. Barrel/crate do not add inventory or harvesting, bench/table do not implement sitting/use interactions.
- Fixed floor supports for barrels, crates, benches, tables and signs; fixed ceiling support for banner; rotated fixed wall support for canopy. Integration must validate support survival and safe deletion, backwards-compatible orientation persistence and independent selection/removal.
- Preserve schema-1 saves, deterministic world seed, original artwork, offline PWA, landscape side grips, no paid tooling; Gate A OPEN / v0.11 LOCKED.

**Next task — Milestone 4:** Before allocating IDs 176+, recheck latest main/checkpoint, Issues #109/#117 and exact-head PR #115 CI. Develop individually targetable **chimney, fireplace, well rim, well roof, well pulley and fountain** candidates (roster 63–68) within Pack 4 only. They are discrete reusable pieces, NOT assembled wells, fountains, houses or structures; declare fire/smoke/water engine dependencies without building simulation. Finish M5 acceptance only after actual Node and genuine Chromium proof.
