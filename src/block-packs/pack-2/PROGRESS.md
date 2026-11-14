# Mythwrought Pack 2 — Timber & Infrastructure candidate ledger

**Governance:** [coordination Issue #109](https://github.com/hdog960/Mythwrought/issues/109) / seven authoritative docs / v0.10 Gate A, v0.11 locked.
**Status:** **17/18 distinct physical candidate families authored** (not integrated, merged, deployed or playable). 1 family remains.
**Latest checked main:** `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`; incorporation checkpoint **006**. Live IDs 0–8 only. Wood ID 4 is not a substitute for these independent candidate shapes.
**Draft PR:** https://github.com/hdog960/Mythwrought/pull/114
**Dedicated branch:** `manual-pack-2-timber-foundation-20261114`; see PR for live exact HEAD / CI.
**Exclusive provisional ID range:** 59–108. Only **59–75** allocated, and those IDs are not installed in the game. 255 reserved. No per-rotation/upper/lower/open/closed ID inflation.

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
| M5 | 45 | — | True water voxel requiring shared transparent fluid rules; NOT a static cyan cube | — | Not started |

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

## Outstanding engine integration (manual incorporation only)

1. Live VoxelWorld ID limit still 0–8; extend only when centrally authorized and save-compatible.
2. Generic :00 shape-target/raycast/collision (opt-in [PR #106](https://github.com/hdog960/Mythwrought/pull/106)) and :12 shape descriptor/mesher ([PR #108](https://github.com/hdog960/Mythwrought/pull/108)) are separate engineering; Pack 2 may not edit or merge them.
3. Production shape mesh/collision/targeting must respect exposed surfaces, rotation, upper/lower, actual hinge position and player intersection.
4. Save schema-1 stores legacy `[x,y,z,id]`, no rotation/hinge state. Need central, opt-in metadata storage and atomic rollback, no migration of existing saves.
5. Hinges need engine-owned input, obstruction checks, animation and safe transitions. Standalone fixture state swaps are not production interaction implementation.
6. No world generation placement, roads, bridges, houses, settlements, inventories, mobs, harvesting, crafting or paid services.

## Session 3 / next incomplete milestone

**Milestone 5** — genuine water voxel candidate (roster 45), only after a new duplicate-prevention audit of latest main/checkpoint/Issues #109/#117 and other packs. ID 76 is the earliest *potential* allocation, NOT allocated. Define real water voxel occupancy/material targeting and explicit compatibility requirements for transparent rendering, fluid updates, level/flow state, collision and schema-1 safety. **Never** create a static cyan fake-water cube or independently implement a generic fluid simulation. Milestone 6 final acceptance follows, with all 18 families, dedicated Node + real Chromium proofs as possible, no merge/deploy.
