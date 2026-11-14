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
| 63 | Chimney blocks | 176 | Hollow Ashenwatch flue course with stone quoins | Candidate built, tests authored |
| 64 | Fireplace blocks | 177 | Open-front Hearthstone fireplace insert and iron grate | Candidate built, tests authored |
| 65 | Well rim blocks | 178 | L-shaped Wellside quarter-rim, truly hollow corner | Candidate built, tests authored |
| 66 | Well roof blocks | 179 | Wellhouse wall-supported carved eave bracket and rope hook | Candidate built, tests authored |
| 67 | Well pulley blocks | 180 | Static brass wall pulley, open-studded rim and rope | Candidate built, tests authored |
| 68 | Fountain blocks | 181 | Dry Dawnward basin segment with carved spout | Candidate built, tests authored |

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
- **M4 Hearth and civic components:** all six roster families 63–68 implemented as independent candidates ID 176–181 in `hearth-civic.mjs`. Physically open chimney flue, fireplace mouth, well-rim quadrant, corbel roof, pulley wheel and dry fountain basin with real box-union selection/collision, four right-angle rotations and stable support/save contract. No completed structure, no functioning fire, smoke, mechanics, light or water. Candidate source and isolated tests authored; **native Node/Chromium, actual engine integration and art acceptance are still pending**.
- **M5 Final acceptance:** all 22 families and 23 provisional variants authored; final native Node, genuine Chromium isolated gallery, real shape-engine integration, mobile art review and creator-controlled live acceptance **OPEN / NOT APPROVED**.

### Verification status — all 23 candidate IDs (M4 source complete)
- Verified integrated main `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, latest checkpoint **006**, physical main IDs 0–8. Issue [#109](https://github.com/hdog960/Mythwrought/issues/109) reserves exclusive Pack 4 IDs 159–208. Issue [#117](https://github.com/hdog960/Mythwrought/issues/117) is the separate symbolic 130-biome catalog, not duplicated. Other manual pack PRs untouched.
- Candidate ID roster **159–181**, 23 unique physical identities covering **22/22 assigned families**; 182–208 unallocated; ID 255 reserved. No changes to main.
- Exact source + test bodies evaluated through JavaScript V8 compatibility harness **138/138 PASS** across seven Pack 4 source/test suites: windows 29, lighting 19, furnishings 31, M4 hearth/civic 28, original fixture 11, furniture fixture 10, civic fixture 10. Additional read-only source/manifest contract suite **4 tests** must be revalidated after this manifest update to state combined 142/142. V8 is **NOT Node**; no claim of native Node for all suites.
- **Pre-M4 exact candidate PR HEAD** `c674b94dedd4b274c97114dbb8dbce46f45553d4` passed standard GitHub Actions Node + Chromium *live baseline* checks, [run 43632520917](https://github.com/hdog960/Mythwrought/actions/runs/43632520917) **SUCCESS**. These workflows exclude nested Pack 4 tests, and do NOT establish in-world support for Pack 4. Re-run and inspect CI for this new M4 PR HEAD.
- Native complete checkout-based `node --test tests/block-packs/pack-4/*.test.mjs`: **NOT VERIFIED**. Git clone/raw GitHub access from local Node container fails with DNS error. Previous Node 22 **33/33** checks ran only on a source-derived first-ten-asset geometry snapshot, not actual module imports; they are not evidence of 23-asset acceptance.
- Genuine Chromium/WebGL2 review for 23 gallery items and rotation remains **NOT VERIFIED**. Browser executable is installed but navigation to local file and loopback test HTTP URL is blocked with `ERR_BLOCKED_BY_ADMINISTRATOR`, so no genuine 23-asset screenshots or passing transparency/lighting review. The `gallery-browser.mjs` isolated test is updated to expect 23 source-derived cards and three 667×375, 844×390, 932×430 mobile viewports; it must be executed on an allowed host.
- **No physical iPhone testing, no Gate A art/control approval, no new persistent live block IDs, no world placements, no auto merging or Pages deployment.** All source edits limited to Pack 4's exclusive directories.

### Physical integration and M5 acceptance blockers
- Current main remains a *full-cube* voxel registry; generic :12 shapes [#108](https://github.com/hdog960/Mythwrought/pull/108) and generic :00 collisions/save targeting [#106](https://github.com/hdog960/Mythwrought/pull/106) require separate approved integration. All Pack 4 shapes are independent candidate IDs with physical AABB unions in isolated tests, not live gameplay.
- Transparent glass needs a sorted multi-material depth pass. Lanterns/torches offer engine-disabled light metadata only. Civic fire, smoke, water, pulley/wind, fountain behavior and inventories are NOT implemented.
- Placement metadata requires floor for chimney, rim and basin; wall behind for fireplace, wellhouse eave and pulley; preserve floor/wall/ceiling rules of earlier Pack 4 families. Hollow flue, open hearth, quarter rim and empty dry basin must not regress to full-cube collision.
- Preserve schema-1 saves and deterministic seed, offline PWA, independent two-thumb iPhone landscape rails and asset art direction. **Gate A remains OPEN, v0.11 LOCKED.**

**Next task (M5 acceptance):** Verify exact PR #115 HEAD/main/issues and CI, execute all nested Node suites and authentic WebGL2 gallery screenshots on a host that permits browser navigation, inspect all 23 silhouette/orientation results, validate reserved-ID registry mapping and backward-safe schema-1 rotation storage against automated :00/:12 interfaces, fix any Pack4-only defects, then prepare creator-only manual integration handoff. Do NOT merge or deploy or automatically put pieces into the world.
