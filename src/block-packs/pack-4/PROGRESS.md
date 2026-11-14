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

### Milestone 5 review — source complete, acceptance still OPEN
- **Main / integration:** Independently verified current `main f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84` and creator incorporation checkpoint **006**, live physical registry 0–8 and sentinel 255. Issues [#109](https://github.com/hdog960/Mythwrought/issues/109) / [#117](https://github.com/hdog960/Mythwrought/issues/117) inspected, and separate draft pack PRs [#113](https://github.com/hdog960/Mythwrought/pull/113), [#114](https://github.com/hdog960/Mythwrought/pull/114), [#112](https://github.com/hdog960/Mythwrought/pull/112) currently allocate other nonoverlapping bands 9–38, 59–76 and 109–125.
- **Candidate source:** 22 original families/23 distinct IDs **159–181**. IDs **182–208 unassigned**; no full structures or world placement. All 22 ledger rows remain provisional. No production engine changes.
- **Exact source-based V8 test harness: 161/161 PASS** across windows 29, lighting 19, furniture 31, civic 28, original fixture 11, furnishings fixture 10, civic fixture 10, preview-utils 5, manifest 4, cross-family acceptance 5, mesh-budget 4. These exercise existing branch source definitions, 23 IDs, 4 rotations, sub-cell occupancy and selection, mesh attributes and vertex budgets, mounting, deterministic isolated fixture saving/removal, variant distinctiveness and engine-disabled effect metadata. This evidence is **NOT actual Node test-runner execution**.
- **Genuine Node 22, 5/5 PASS:** Direct native execution of `tests/block-packs/pack-4/preview-utils.test.mjs` against `preview-utils.mjs`, after checking their exact local Git blob hashes matched GitHub (`a469b2f1...` and `dbb9a47a...`). The full other Pack 4 suites were **not** executed by native Node. Repository checkout/raw download from the local sandbox is still blocked by GitHub DNS/network access; normal Actions' root test glob excludes these nested tests.
- **Existing baseline GitHub Node/Chromium CI:** Pre-M5 candidate commit `c7dfee578523f3a1c3ac91f9c4f2ce38c7ce34fb` succeeded [run #43634712543](https://github.com/hdog960/Mythwrought/actions/runs/43634712543). It does **not** check the new gallery utility or Pack 4's nested tests. Inspect and report new exact review HEAD CI separately.
- **M5 gallery defects fixed:** Temporary WebGL shader/program/VAO/buffer objects are released after each preview; a separately tested preview-only transparent triangle sorter draws back-to-front for the fixed camera; perspective-fit scale reduced to avoid cropping at extreme angles. 23-asset `gallery-browser.mjs` now requests three phone landscape viewport screenshots, validates 23 nonblank **distinct pixel fingerprints**, and tests an asymmetric rotation. This remains **gallery-only**, not an engine transparent depth fix.
- **Genuine Pack 4 Chromium/WebGL2 gallery:** **BLOCKED / NOT VERIFIED**. Actual local Chromium launched but page navigation returned `net::ERR_BLOCKED_BY_ADMINISTRATOR` even on a basic `data:` URL, so no authentic 23-asset browser gallery screenshot can be claimed; no actual physical iPhone test or art/control sign-off.
- **Files and boundaries:** All changes restricted to `src/block-packs/pack-4/` and `tests/block-packs/pack-4/`. No merge, Pages deploy, registry/edit integration, world generation, player schema-1 saves, CI workflow, shared renderer, other packs or independent controller rails altered.

### Unresolved requirements before M5 can be accepted
1. Run `node --test tests/block-packs/pack-4/*.test.mjs` from the verified exact GitHub branch HEAD in actual Node; fix any source-specific failures. Root `npm test` is not equivalent.
2. Run `node tests/block-packs/pack-4/gallery-browser.mjs` with Chromium at 667×375, 844×390, 932×430 on a permitted local web host. Inspect all source-derived screenshot cards for distinct original silhouettes, correct rotation, hollow openings, transparent alpha and mobile readability. Screenshots must say **UNMERGED CANDIDATE — NOT IN LIVE GAME**.
3. At creator-authorized **manual** incorporation only, reconcile unmerged [shape contract #108](https://github.com/hdog960/Mythwrought/pull/108), [interaction/save contract #106](https://github.com/hdog960/Mythwrought/pull/106), physical registry, partial collision and schema-1 rotation state. Current main engine still handles only 0–8 IDs and full-cube geometry.
4. Creator independently evaluates art and two-thumb landscape controls on a physical iPhone; explicitly approves Gate A before any later milestone. No lighting, flame, smoke, water, pulley mechanics or UI interactions were built by this pack.

**Status: M0–M4 SOURCE COMPLETE; M5 ACCEPTANCE OPEN.** See `M5_ACCEPTANCE.md` for the detailed per-family final review matrix and blocked gates. Next development task is resolving real native/browser verification and Pack 4-only defects, not generating or placing new world structures. No merge/deploy or auto-integration.

**M5 subsequent QA:** A browser acceptance defect was corrected: a uniformly colored, nonblack WebGL clear background must not count as a successfully rendered model. `gallery-browser.mjs` now demands at least 700 foreground pixels that differ by 24 RGB units from the image's corner background, alongside 23 unique image hashes and a 270-degree asymmetric rotation change. Exact current-source `mesh-budget.test.mjs` adds four passing V8 tests across 23 candidate meshes × four orientations, including a cumulative 16,000-vertex and 1,300-peak-vertex budget, deterministic data and alpha separation. Native WebGL2 gallery still not verified: local Chromium returns `ERR_BLOCKED_BY_ADMINISTRATOR` for navigation and WebGL2 contexts are unavailable even with injected static page content. No screenshots are approved.


### Shared :00/:12 source compatibility review — November 14, 2026
- **Real Pack 4-only defect fixed:** crate candidate **170** had **34 selectable AABB volumes**, exceeding the unmerged :00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106) `validateShape` maximum of **32**. Eight ornamental corner ferrules/front battens now have `selection:false`; original visuals **34 rendered sub-parts** and **1,224 preview vertices** are preserved while selection/collision use **26** bounding boxes. It remains a single independent targetable crate.
- New isolated `src/block-packs/pack-4/interaction-handoff.mjs` exports `pack4ShapeHandoff`, `pack4SidecarHandoff`, and `pack4ReviewSidecar`. It generates candidate-only `{boxes}` descriptors within the exact :00 shape cap and converts fixture `{id,rotation}` to staged `{blockId,turns}` sidecar entries. It **does not import, activate or modify any shared module**, registry, game save or renderer.
- **161/161 exact current Pack 4 test bodies PASS in V8 compatibility evaluation**, adding five tests for the 32-AABB limit, crate render-versus-selection count, hollow structures, real sidecar field formats and malformed-state rejection. **Not native Node.**
- Evaluated the **actual unmerged :00 source at head `2054e00ead30736726d53d5aed8a1f9dc4e080a0`**, including `validateShape`, `raycastShapes`, `canPlaceShape`, `rotateShape`, `inspectBodyFit` and `makeOrientationSidecar`. Across all **23 IDs × four orientations**, every collision and selection descriptor, empty placement, precise selected-box raycast, interior-body collision, rotation parity and real sidecar snapshot passed: **644/644 independent cross-source V8 probes**. This is **not integrated gameplay or native Node testing**.
- Reviewed actual :12 [PR #108](https://github.com/hdog960/Mythwrought/pull/108) head `31be6f32adcfbb461b7a57e7db2e1567f8c1891a`. Its opt-in boundary-only `prototypeSurfaceMesh` tessellates unions more heavily than the Pack 4 preview meshes; sample **fireplace 177 produced 8,336 boundary-mesh vertices** and **pulley 180 produced 8,136**, compared with Pack 4's self-contained preview limits of 1,500 vertices per candidate. This is a **mobile-mesh integration budget warning**, not a runtime acceptance pass or a reason to edit shared mesher sources.
- Existing live world still has only persistent IDs **0–8**. Pack 4 candidate IDs **159–181** remain **not registered**; no creator integration permission. M5 is still OPEN pending full native exact-HEAD Node suite, authentic Chromium WebGL2 gallery/screenshots and explicit art/physical iPhone Gate A approval.
