# Mythwrought Pack 2 — Timber & Infrastructure candidate ledger

**Governance:** [coordination Issue #109](https://github.com/hdog960/Mythwrought/issues/109) / seven authoritative docs / v0.10 Gate A, v0.11 locked.
**Status:** **18/18 distinct physical candidate families authored** (not integrated, merged, deployed or playable). 0 families remain to author; native acceptance and live integration are still blocked.
**Latest checked main:** `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`; incorporation checkpoint **006**. Live IDs 0–8 only. Wood ID 4 is not a substitute for these independent candidate shapes.
**Draft PR:** https://github.com/hdog960/Mythwrought/pull/114
**Dedicated branch:** `manual-pack-2-timber-foundation-20261114`; see PR for live exact HEAD / CI.
**Exclusive provisional ID range:** 59–108. Only **59–76** allocated, and those IDs are not installed in the game. 255 reserved. No per-rotation/upper/lower/open/closed ID inflation.

## Roster-level asset progress

| Milestone | Roster | Candidate ID | Family / original visual and physical distinction | States | Status |
|---|---:|---:|---|---|---|
| M1 | 13 | 59 | Planed honey-oak planks with actual course seam triangles, full cube | 1 | Candidate |
| M1 | 14 | 60 | Peeled ash log, two-box rounded horizontal profile, pale long grain and end rings | 4 rotations | Candidate |
| M1 | 15 | 61 | Dark heartwood beam, slim core, expanded ironbound shoulders, physical collars | 4 rotations | Candidate |
| M1 | 22 | 62 | Vertical dovetailed support post with wide bearing collar and flared foot | 1 | Candidate |
| M2 | 16 | 63 | Oak half-slab, true lower or upper half-cell shape, horizontal planed seam art | lower/upper | Candidate |
| M2 | 17 | 64 | Genuine two-step stair with riser + upper tread | 4 rotations × 2 half-states | Candidate |
| M2 | 18 | 65 | Open two-rail timber fence, two vertical stakes and spaced rails, NOT bridge guardrail | 4 rotations | Candidate |
| M2 | 19 | 66 | Hinged latticed fence gate with physically different open vs closed rail AABBs | 4 rotations × 2 hinge states | Candidate |
| M2 | 20 | 67 | Single-cell carved hinged timber door leaf with actual swung-open collision shape | 4 rotations × 2 hinge states | Candidate |
| M2 | 21 | 68 | Hinge-mounted horizontal trapdoor that swings into a vertical physical panel | 4 rotations × 2 mounts × 2 hinge states | Candidate |
| M3 | 39 | 69 | Mixed warm-grey river shingle gravel: physical uneven aggregate cap over compact base | 1; falling **engine dependency only** | Candidate |
| M3 | 40 | 70 | Trampled umber packed dirt path with genuinely depressed double ruts and raised side shoulders | 4 rotations | Candidate |
| M3 | 41 | 71 | Shallow staggered, flattop limestone walking cobbles above distinct recessed mortar | 4 rotations | Candidate |
| M3 | 42 | 72 | Sculpted ivory/slate suncompass paving with tangible blue raised inlay and asymmetrical orientation | 4 rotations | Candidate |
| M4 | 43 | 73 | Riveted double-post structural guardrail with broad protective handrail, iron diagonal bracing and optional terminal plate; not light wooden fence | 4 rotations × through/terminal | Candidate |
| M4 | 44 | 74 | Full protective limestone parapet with heavy cap, broad coping and optional physical scupper through middle of wall; not Pack 1 balustrade | 2 axes × solid/drain-slot | Candidate |
| M4 | 46 | 75 | Elevated larch deck with separated raised plank slats, twin real lower joists and optional flush edge trim; not full-cube wooden plank | 2 axes × open-deck/edge-trim | Candidate |
| M5 | 45 | 76 | Clear rill water: genuine nonblocking *fluid-volume* prism with exact surface triangle targeting, tinted alpha geometry, 8 physical heights and 4 cardinal sloping currents; engine flow/transparent rendering/saves BLOCKED | source 1 + seven levels × five flow directions = 36 metadata states | Candidate — ENGINE BLOCKED |

**Physical evidence:** `definitions.mjs` and `joinery.mjs` expose genuine occupied local AABB unions that are independently ray-targetable/collidable when connected. Each exports original palette and actual triangle meshes, with surface details anchored to physical geometry. `fixture.mjs` can select, rotate, choose upper/lower, toggle hinges, place, ray-select, mine/remove, serialize and restore isolated candidate cells. Fixture snapshots preserve the old five-number record rows and use seven fields for new stateful joinery.

## Session 2 — Milestone 2 delivery (2026-11-14)

- [x] Rechecked newest main, source registry, checkpoint 006, Issue #109 and four coordination comments, same Pack 2 draft PR, and competing ownership/IDs in other 3 manual pack PRs.
- [x] All six joinery families (63–68), independent physical shapes and true state-dependent shapes. Rotations share IDs.
- [x] Safe pure state transition helper for gate/door/trapdoor without changing actual game interaction or engine.
- [x] Standalone fixture updated with stateful targeting, placement, open/close and backwards-compatible isolated fixture snapshots.
- [x] Original face-shaded physical triangle meshes and joint/grain highlights for all six.
- [x] Interactive browser gallery extended to all 10 assets, quarter-turn, half-variant, state toggle and placed-piece toggle.
- [x] 15 new dedicated joinery test cases, plus existing 12 material tests: **27/27 previous checked-in test functions passed in an isolated V8 compatibility harness**. This is not Node/Chromium certification and tests must be run directly under Node.
- [x] Candidate-specific engine handoff documented in `INTEGRATION_CONTRACT.md`; no changes to generic shared files.
- [ ] Genuine dedicated `node --test tests/block-packs/pack-2/*.test.mjs` execution in a checkout: not yet available through GitHub API; existing root CI glob does not include these nested tests.
- [ ] Actual integrated browser WebGL2 screenshot/performance/offline testing: blocked pending authorized engine integration. Isolated preview is Canvas 2D and not playable game proof.
- [ ] Real iPhone inspection and creator art/control approval: not claimed.

## Session 3 — Milestone 3 ground and paving components (2026-11-14)

- [x] Audited latest `main`, physical registry and palette: only 0–8; checkpoint 006; Issue #109 plus newly created 130-family Issue #117 (separate automation namespace), other three manual packs and draft PR #114. New paving candidates do not duplicate Pack 1's rough, full-cube masonry cobblestone or the automated lane's natural rock varieties.
- [x] Provisional IDs **69–72**, allocated exclusively within the Pack 2 band, for physical gravel, compacted dirt path, low-profile cobbled walking surface and decorative inlaid pavement. No new ID for rotation.
- [x] `ground.mjs`: four independent original material recipes, 6–11 bounded physical box unions per component, different exposed top surfaces, typed triangle meshes and true shape-aware fixture targeting. Decorative joints/inlays are anchored in **physical** surfaces; none is render-only scenery standing in for a block.
- [x] Optimized visible-surface mesh generation with **face-local occlusion partition** instead of a global X/Y/Z split. Observed triangle counts via the actual candidate mesh functions: gravel **576** (previous draft 2,032), packed path **140**, cobble paving **404**, suncompass paving **422** (orientation preserves triangle budgets). This is fixture mesh complexity evidence, **not** a live WebGL frame-rate measurement.
- [x] `fixture.mjs`: all fourteen IDs selectable, shallow shapes ray-targetable and removable, meaningful quarter-turns and deterministic snapshot restore. Ground material uses existing `[x,y,z,id,rotation]` fixture row width; previous timber/joinery snapshots remain accepted.
- [x] `ground.test.mjs`: **14 new test cases** for ID uniqueness, outward triangle winding, physical height/pattern differences, graveled top facets, depressed paths, cobble mortar gaps, distinct inlays, geometry budgets, orientation, target removal and corrupt snapshot rejection. Together with twelve M1 and fifteen M2 cases, **41/41 test function bodies passed** in local isolated V8 with assertion shim (NOT genuine Node or Chromium verification).
- [x] Expanded authentic opt-in Canvas 2D preview from 10 to 14 candidates. Never claim it is an actual integrated-world screenshot.
- [ ] Actual dedicated Node invocation `node --test tests/block-packs/pack-2/*.test.mjs` still required; the standard root `npm test` glob excludes these three nested suites. Local GitHub clone failed because internet DNS was unavailable in the isolated runtime; do not misrepresent V8 checks as Node.
- [ ] Genuine WebGL2/offline/mobile rendering and production save tests remain separate integration gates, unclaimed.
- [ ] Falling gravel **not implemented**. `physics.gravity:'engine-required'` declares shared-engine ownership; no fake simulation, particle gravity or world placement.

## Session 4 — Milestone 4 standalone infrastructure (2026-11-14)

- [x] Current main SHA `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, latest checkpoint 006, coordination Issues #109/#117, PR #114, and other three manual packs rechecked. Live remains IDs 0–8, new candidates 73–75 distinct from prior packs and existing voxel-assembled bridges/arches.
- [x] Exclusive provisional IDs **73 reinforced bridge guardrail**, **74 solid stone parapet**, **75 raised boardwalk slat tile**, all individually reusable physical cell components without assembled structures/world placement.
- [x] `infrastructure.mjs` provides original palettes and face-anchored grain/stone cuts, physically spaced guard posts and iron bracing, actual 3D drain-slot void variant, real gapped deck planks over supporting joists, canonical rotations/variants and 5–15 cell-local collision/selection AABB boxes per asset.
- [x] Candidate mesh uses per-face hidden-area culling, physically backed triangles and outward normals. Isolated measured mesh complexity: **610–740 triangles guardrails, 100–196 stone parapets, 444–672 boardwalk tiles** (variant + axis differences; not iPhone runtime FPS).
- [x] Fixture extended to all **17 IDs** for select/rotate/cycle variant/place/target/mine/remove; original five-column timber/ground and seven-column joinery saved fixtures still restore exactly, alongside six-column infrastructure state. This does NOT certify live schema-1 save compatibility.
- [x] `infrastructure.test.mjs` adds **17 dedicated cases** for original physical profiles, open gaps, scupper ray pass-through, boardwalk spaces, corrupt state, mesh winding, triangle budgets, fixture targeting/removal and serialization.
- [x] Four Pack 2 test suites now contain **58/58 test cases passed when their checked-in test bodies were executed in an isolated V8 assertion harness** (12 M1 + 15 M2 + 14 M3 + 17 M4). This evidence is **not the native Node runner**.
- [x] `preview.html` expanded to select 17 authentic candidate triangle meshes including infrastructure variant/rotation controls; `browser-verify.mjs` creates a local HTTP preview server and an optional **real Playwright Chromium** regression at 667×375, 844×390, 932×430 if an authorized runtime has the browser library. Browser test source exists but **has not been run**; no fabricated screenshots.
- [ ] Exact-head standard GitHub Actions Node + Chromium to be checked independently; the root suite `npm test` **does not include nested Pack 2 tests** (its glob is `tests/*.test.mjs`).
- [ ] Native `node --test tests/block-packs/pack-2/*.test.mjs` in an authorized checkout outstanding. Local container has Node 22 and Chromium, but GitHub DNS resolution blocks obtaining the exact branch files for a faithful execution. Do not misrepresent V8 results as Node.
- [ ] Production collision/render/save integration, browser render/performance, physical iPhone approval remain blocked until explicit creator authorization. **Main/PWA/gameplay/seed/saves untouched.**

## Session 5 — Milestone 5 water candidate (2026-11-14)

- [x] Audited exact main `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, latest checkpoint **006**, both coordination Issues #109/#117, new-other-pack candidate allocations and existing draft PR #114. No overlapping candidate ID 76 (exclusive Pack 2 59–108).
- [x] Reserved candidate **ID 76 / roster 45** only. All **18/18 family source candidates** now defined; 59–76 inclusive reserved, 255 untouched, no extra ID per level/flow.
- [x] `water.mjs` implements a *genuine non-solid fluid volume*, with eight discrete heights (source level 0 and flowing/resting levels 1–7), four cardinal slope directions plus still, strict immutable source/level/flow states, exact analytic volume membership, actual 12-triangle closed prism shell, exact two-sided triangle ray targeting on upper/side/bottom surfaces and a cheap coarse broad-phase volume. Fluid deliberately exposes **zero solid collision boxes**; do not treat the water as a stone cube.
- [x] Transparent static candidate material geometry: 12 physically backed prism boundary triangles plus six surface-anchored current ripple triangles, typed UV/colors/alpha/normals, explicit alpha blend/sort/depth-write/fog engine contract. The candidate has physical selection geometry even when transparent; no fake cyan decorative cube.
- [x] Standalone Pack 2 fixture can now select ID 76, explicitly edit level/flow, target and remove the *actual sloped surface*, reject mixed or malformed states and restore water as seven fields `[x,y,z,76,level,flow,source]` without altering earlier 5-field timber/ground, 6-field infrastructure, and 7-field hinged joinery fixture records. This is **NOT** live schema-1 persistence.
- [x] Original isolated `preview.html` extended to **18 items** with water level/flow controls and genuine canvas alpha compositing; optional Playwright inspector now checks water and all 18 entries on three mobile landscape viewports **when executed**.
- [x] `water.test.mjs` adds **21 cases**, bringing **79/79** checked-in test function bodies passing in local V8 execution with portable assertions (12 M1, 15 M2, 14 M3, 17 M4, 21 M5). **These are not native Node-runner or Chromium claims.**
- [x] Previous PR-head M4 GitHub Actions [#43633243649](https://github.com/hdog960/Mythwrought/actions/runs/43633243649) **SUCCESS** for configured root Node and genuine Chromium WebGL2 baseline (nested Pack 2 suites excluded by CI glob).
- [ ] Native Pack 2 `node --test tests/block-packs/pack-2/*.test.mjs` and genuine `browser-verify.mjs` still not executed in exact repo checkout; local git clone remains blocked by DNS. Root CI runs `tests/*.test.mjs`, not the Pack 2 nested tests; their coverage must be separately verified before incorporation.
- [ ] M5 exact branch HEAD standard GitHub CI Node/Chromium completion (check the latest PR run rather than earlier green runs).
- [ ] Shared engineering is required for registering ID 76, transparent WebGL2 pass, water neighbor seams/visibility, true fluid updates, source flow propagation, swimming/buoyancy, save sidecar and offline integrity. **No playable fluid physics, animated water or world placement implemented.**
- [ ] Real iPhone control/art testing and v0.10 Gate A creator approval remain unclaimed; v0.11 stays locked.

## Session 6 — exhaustive candidate acceptance and corrected mesh winding (2026-11-14)

- [x] Reverified production main `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, checkpoint **006**, Issues #109/#117 and current open manual Packs 1/3/4 PRs. No candidate ID overlaps or unexpected shared-file modifications. Pack 2 remains draft PR #114, 18/18 authored, IDs 59–76 only.
- [x] Rechecked the *previous* exact candidate HEAD `8a91b19c6fb7f1b966a0b6b236d081f0e5ea665d`: GitHub Actions [#43634960361](https://github.com/hdog960/Mythwrought/actions/runs/43634960361) **SUCCESS** for the **standard root Node + genuine landscape Chromium baseline**, which does NOT execute nested Pack 2 tests or show the candidate gallery in the game.
- [x] Found and FIXED a substantial authentic rendering defect: `definitions.mjs` and `joinery.mjs` emitted *inward-facing triangles* despite correctly outward-facing normals, breaking normal parity and future back-face culling. Reversed the index winding on both physical and surface-detail quads. No shape, ID, physical geometry or fixture data were changed by this fix.
- [x] Independent exhaustive triangle-normal audit of **121 authored states across all 18 families and 25,742 triangles**. Before fix, **12,430 triangles** in timber/joinery had incorrect winding. After the fix, **zero inverted / degenerate normal-triangle pairs**, all 121 variants in local [0,1] bounds and no single state exceeding **740 triangles**. This proves source geometry consistency, NOT iPhone WebGL acceptance.
- [x] New `tests/block-packs/pack-2/acceptance.test.mjs` adds **9 strict regression cases** covering all 121 states, normals/winding, mobile preview triangle budgets, collision bounds, exact fluid ray targeting, complete 18-ID inventory, 18 independent fixture selection/removal and mixed format snapshots.
- [x] All **88/88 checked-in test function bodies** (12 M1 + 15 M2 + 14 M3 + 17 M4 + 21 M5 + 9 M6) passed when executed in an isolated V8 JS harness with portable assertions against actual branch source; native `node --test` was NOT executed. Prior 79/79 had missed normal winding, which is now explicitly guarded.
- [x] `M6_ACCEPTANCE.md` documents full roster, native and browser tests, exhaustive repairs and unfulfilled production integration gates. Candidate-only acceptance SOURCE REVIEW COMPLETE; final production acceptance **NOT APPROVED**.
- [ ] Native direct Node `node --test tests/block-packs/pack-2/*.test.mjs` on this exact head: sandbox's GitHub DNS is blocked and exact source cannot be mounted from the connector into the Node container. **Not passed/unrun.**
- [ ] Real local Chromium inspector screenshots via `node tests/block-packs/pack-2/browser-verify.mjs`: same checkout limitation, Playwright runtime unavailable locally. **Not passed/unrun** (standard root GitHub Chromium game checks are separate).
- [ ] Recheck **new exact-head** GitHub Actions after these two render fixes + M6 tests/docs; no claim of green until GitHub reports success.
- [ ] Central shape registry, transparent water renderer, level/flow simulation, backward-safe production schema-1 state sidecar and integrated iPhone landscape/offline performance remain separate creator-authorized integration gates.
- [ ] No claim of physical iPhone testing, Gate A owner approval or v0.11 release.

## Session 7 — Milestone 6 follow-up (2026-11-14)

- [x] Reaudited main, checkpoint 006, Issues #109/#117, Packs 1/3/4 current draft PR heads, Pack 2 ID 59–76 manifest, all exclusive PR paths and earlier exact-head standard CI.
- [x] Added **900** physically accurate source-level water ray height checks across 36 canonical fluid states and 25 `[x,z]` sample points per state; **9 M6 cases / 88 total authored cases** pass in exact-source V8 assertions (not Node).
- [x] Improved optional genuine Chromium inspector harness to render all **18** candidates across 667×375, 844×390, 932×430 and, when run with screenshots enabled, save **authentic full-page water and focused water/gate/parapet canvas screenshots**, plus check layout overflow. It remains *unrun* because checkout/runtime availability is blocked.
- [ ] Native `node --test tests/block-packs/pack-2/*.test.mjs` and real Playwright verification/screenshots remain unexecuted locally due GitHub DNS and missing Node Playwright module, **not green**.
- [ ] Exact-head GitHub standard Node/Chromium must be verified for the current PR commit. This root workflow does not include nested Pack 2 suites.
- [ ] Central engine registry, shape collision, water alpha/flow/neighbor updates, per-cell schema-1 sidecar, offline iPhone control/art approval remain blocked. No merge/deploy/world placement.

## Session 8 — Milestone 6 technical acceptance follow-up — 2026-11-14

- **Verified exact prior PR HEAD** `8da5931d5e82b0fbcb2f557d897382846aa3a969`: standard GitHub Actions [#43639594993](https://github.com/hdog960/Mythwrought/actions/runs/43639594993) **SUCCESS** (root Node tests and real Chromium landscape WebGL2 baseline). This workflow's `npm test` glob `tests/*.test.mjs` excludes every nested Pack 2 test file, and its browser smoke does not visit Pack 2 preview. Do **not** infer candidate acceptance.
- Reconfirmed main `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, incorporation checkpoint 006, Issues #109 and #117, competing manual pack ownership, and draft PR #114. No ID range overlaps; source files owned solely by Pack 2.
- Local exact-checkout attempt remains **BLOCKED**: Node 22.16.0, Chromium 144 and the Python Playwright package are present, but GitHub DNS/network access prevents obtaining the full exact PR files; no complete checkout was available. Node Playwright is not installed locally. Accordingly, neither `node --test tests/block-packs/pack-2/*.test.mjs` nor the dedicated browser inspector was executed.
- **Expanded the committed optional Chromium test**: all 18 candidate meshes must render with **distinct geometry-only pixel hashes** and nonempty painted regions at 667×375, 844×390 and 932×430. When screenshots are enabled, it now writes **54 individual asset gallery canvases** (18 × 3) plus original water, open-gate, drain-slot and full-page views. The script's JavaScript syntax was checked; **no actual screenshots were captured**.
- The last isolated, source-level results remain **88/88 checked-in test bodies passed under V8**, including 121 full-state mesh/normal configurations (25,742 triangles, zero inverted or degenerate after Pack 2-only winding fix) and 900 water surface-ray comparison samples. Those checks are **not native Node or browser evidence**.
- Exact new commit root CI must be checked independently once reported; source candidate review is complete, but full native/visual/production acceptance and creator Gate A approval remain **OPEN**.

## Session 9 — Python Playwright in-memory gallery fallback (2026-11-14)

- [x] Reconfirmed previous exact-head [standard CI #43641062727](https://github.com/hdog960/Mythwrought/actions/runs/43641062727) **SUCCESS** for root Node/real landscape Chromium baseline, still excluding nested Pack 2 tests.
- [x] Authored Pack 2-exclusive `tests/block-packs/pack-2/gallery-browser.py`: free Chromium via Python Playwright, rewriting original source imports to in-memory base64 ES modules so browser checks do not depend on localhost access or the missing Node Playwright package.
- [x] Verified **genuine Chromium 144** can load simple and nested in-memory JavaScript modules via Python Playwright. This tests the browser loader only, **not** any Pack 2 source/candidate.
- [x] The new runner checks all 18 candidate meshes for unique painted pixel hashes at 667×375, 844×390 and 932×430, fluid translucent pixels, controls/variants, exact fixture snapshot recovery, and optionally produces 54 authentic candidate screenshots with water/gate/parapet details **when actually executed**. No screenshots have been generated.
- [ ] Exact checkout is unavailable in the restricted local runtime (GitHub DNS/direct HTTPS failure), so all six native Node suites and both candidate Chromium runners remain unexecuted. Source-level 88/88 V8 tests, 121-state winding audit, and 900 water rays do **not** substitute for them.
- [ ] Check the new exact PR HEAD GitHub Actions result; keep Gate A open, v0.11 locked, no merge/deployment/shared code or world placement.

## Outstanding engine integration (manual incorporation only)

1. Live VoxelWorld ID limit still 0–8; extend only when centrally authorized and save-compatible.
2. Generic :00 shape-target/raycast/collision (opt-in [PR #106](https://github.com/hdog960/Mythwrought/pull/106)) and :12 shape descriptor/mesher ([PR #108](https://github.com/hdog960/Mythwrought/pull/108)) are separate engineering; Pack 2 may not edit or merge them.
3. Production shape mesh/collision/targeting must respect exposed surfaces, rotation, upper/lower, actual hinge position and player intersection.
4. Save schema-1 stores legacy `[x,y,z,id]`, no rotation/hinge state. Need central, opt-in metadata storage and atomic rollback, no migration of existing saves.
5. Hinges need engine-owned input, obstruction checks, animation and safe transitions. Standalone fixture state swaps are not production interaction implementation.
6. Water ID 76 has exact fluid-volume selection but deliberately non-solid collision. Its transparent renderer and source/level updates are engine responsibilities, not validated by fixture screenshots.
7. No world generation placement, roads, bridges, houses, settlements, inventories, mobs, harvesting, crafting or paid services.

## Next acceptance requirements

**Milestone 6 — source review complete, acceptance gates remain open.** All 18 physical candidate families have authoring/geometry/fixtures, and the cross-state triangle winding defect is repaired and regression-tested. The native Node nested suites, authentic local Chromium candidate screenshots, production integration save/renderer/interaction and physical iPhone Gate A approval are **still unverified**. See `M6_ACCEPTANCE.md`. The next authorized session should run the exact-head real native tests from a valid checkout if available and fix any Pack 2-only acceptance defects. Do not merge/deploy/modify main without the separate creator incorporation and Gate A decision.
