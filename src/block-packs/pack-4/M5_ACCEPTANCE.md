# Pack 4 — Milestone 5 acceptance dossier

> **UNMERGED CANDIDATE — NOT IN LIVE GAME.** This is a final review
> checklist, not a creator art/control approval, merge permission or
> live-game certification. v0.10 Gate A open; v0.11 locked.

## Current state
- Project: `hdog960/Mythwrought`, GitHub Pages game unchanged.
- Exclusive draft: [PR #115](https://github.com/hdog960/Mythwrought/pull/115).
- Authoritative exact HEAD: **use PR #115 head SHA**, not a cached release
  checkpoint; final HEAD changes as the acceptance dossier is committed.
- Pack 4 branch originally forked at `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`.
  **Current verified main** `ac263720b60641c65b02330348dd76d0ef9cb75e`, creator incorporation checkpoint **008** (automation-only; excludes Pack 4). At the 2026-11-14 review baseline the Pack 4 branch was four commits behind main, with no conflicting Pack 4-owned paths. Reverify divergence each session.
- Issue [#109](https://github.com/hdog960/Mythwrought/issues/109)
  manual exclusive ID band 159–208 and Issue
  [#117](https://github.com/hdog960/Mythwrought/issues/117) separate
  symbolic 130-biome catalog examined. Other draft packs use IDs
  9–38 (#113), 59–76 (#114), 109–125 (#112), no collisions.
- 22 authored physical candidate families, 23 persistent candidate IDs
  **159–181**, remaining Pack 4 IDs **182–208 unassigned**.
  Live IDs 0–8 / sentinel 255 remain protected.
- All changed files are within `src/block-packs/pack-4/` and
  `tests/block-packs/pack-4/`; nothing was merged into main or placed.

## Family acceptance matrix

| Roster | Asset family | Candidate ID | Independent physical source | Acceptance |
|---:|---|---:|---|---|
| 30 | Clear glass | 159 | Thin transparent plane, selection/collision slab | Candidate; gallery unverified |
| 31 | Stained glass | 160–161 | Two leaded patterns and material shapes | Candidate; alpha depth integration blocked |
| 32 | Wooden window frames | 162 | Open carved oak frame and mullions | Candidate; selection integration blocked |
| 33 | Wooden shutters | 163 | Separate slatted leaves, wall support | Candidate; state/placement integration blocked |
| 34 | Iron bars | 164 | Four rods, gaps and lateral braces | Candidate; collision integration blocked |
| 35 | Lantern blocks | 165 | Floor copper lantern, independently bounded | Candidate; functional lighting blocked |
| 36 | Wall lanterns | 166 | Wall sconce and raised bracket | Candidate; functional lighting blocked |
| 37 | Crystal lanterns | 167 | Caged physical crystal, not CRYSTAL ID 5 | Candidate; functional lighting blocked |
| 38 | Torches | 168 | Wall torch and separate noncolliding flame | Candidate; functional lighting blocked |
| 56 | Barrels | 169 | Tapered staves, hoops, lid and bung | Candidate; not a container |
| 57 | Crates | 170 | Independent planks and corner braces | Candidate; not a container |
| 58 | Benches | 171 | Open leg gaps and raised back | Candidate; no sitting interaction |
| 59 | Tables | 172 | Open underframe and separate legs | Candidate; no interaction |
| 60 | Wooden signs | 173 | Narrow post and framed signboard | Candidate; no text editor |
| 61 | Hanging banners | 174 | Ceiling-hung cloth, split swallowtail | Candidate; no wind simulation |
| 62 | Market canopy blocks | 175 | Single cloth panel with ribs/rope | Candidate; NOT a stall |
| 63 | Chimney blocks | 176 | Hollow open vertical flue, quoin and rim | Candidate; no smoke engine |
| 64 | Fireplace blocks | 177 | Open-front dry hearth and grate | Candidate; no fire/heat engine |
| 65 | Well rim blocks | 178 | True L-shaped quarter rim | Candidate; NOT a complete well |
| 66 | Well roof blocks | 179 | Wall-corbel/copper eave, not generic shingles | Candidate; roof assembly unimplemented |
| 67 | Well pulley blocks | 180 | Physical static ring/spokes/axle | Candidate; no rope mechanics |
| 68 | Fountain blocks | 181 | One dry carved basin and spout | Candidate; no water engine |

## Evidence actually established
1. **161/161** authored JavaScript test bodies passed when evaluating
   exact branch sources under a V8 compatibility harness. This includes
   23 candidate definitions, IDs/manifest, four orientations, accurate
   multi-box geometry, fixed supports, ray targeting, partial collisions,
   deterministic fixture-only saving/removal, preview vertex bounds, all-asset mobile mesh budgets,
   transparent triangle ordering and cross-family differences.
   This is **NOT the Node built-in test runner**.
2. **5/5 native Node 22 tests passed** for the isolated
   `preview-utils.mjs` translucent sort utility. The exact local
   source blob SHA `dbb9a47a6474fbc3461e006530d6dbaffbea42b2`
   and exact test blob SHA
   `a469b2f1a1648b1f18b51291b3ab0103701321b7`
   matched the GitHub blobs before native execution.
3. Prior pre-M5 candidate GitHub Actions baseline [run
   #43634712543](https://github.com/hdog960/Mythwrought/actions/runs/43634712543)
   must be checked separately. It covers the unchanged game's
   standard Node/Chromium suite but **does not run Pack 4's nested
   `tests/block-packs/pack-4/*.test.mjs`**.
4. Candidate reviewer gallery now uses a single reused WebGL2
   context, deletes temporary GPU buffers/programs/VAOs, sorts
   translucent triangles back-to-front for the fixed preview
   camera, and displays one-cell models at a non-clipping scale.
   A dedicated genuine Chromium script checks all 23 canvas
   fingerprints/rotation and requests screenshot artifacts
   in three landscape viewports **667×375, 844×390, 932×430**.
   This browser script has **NOT** successfully completed.

## Mandatory unpassed final acceptance gates
- [ ] Checkout exact review HEAD and run **real native Node** across
  the full suite:
  `node --test tests/block-packs/pack-4/*.test.mjs`.
  Local runner cannot obtain the remote checkout due blocked GitHub DNS.
  The native subset above does not certify the whole pack.
- [ ] Run `node tests/block-packs/pack-4/gallery-browser.mjs`
  with free `playwright` and genuine Chromium on a host that permits
  local HTTP navigation. Chromium here returned
  `net::ERR_BLOCKED_BY_ADMINISTRATOR` even for simple data URLs.
- [ ] Inspect authentic **UNMERGED CANDIDATE — NOT IN LIVE GAME**
  screenshot results for all 23 IDs, rotated variants, physically
  empty pane/frame/well/flue spaces, alpha layering and original art
  parity at three phone landscape widths. Do not substitute
  generated concept art or a static mocked gallery for this check.
- [ ] Reconcile manually with unmerged :12 general shape contract
  [#108](https://github.com/hdog960/Mythwrought/pull/108)
  and unmerged :00 collision/selection/save contract
  [#106](https://github.com/hdog960/Mythwrought/pull/106).
- [ ] Demonstrate **real engine** independent cell targeting,
  accurate partial collisions, support-on-neighbor validation,
  four-way rotation, transparent depth pass, bounded lighting
  budget if ever implemented, and backward-safe schema-1 saving.
  This pack only provides isolated fixture tests; it never edits
  the production player save or registry.
- [ ] Creator reviews art in actual iPhone landscape and explicitly
  approves Gate A. Physical iPhone testing has not been performed
  by this session.

## How to reproduce independently

From an authorized checkout at the exact PR HEAD:

```sh
node --test tests/block-packs/pack-4/*.test.mjs
npm install --no-save --no-audit --no-fund playwright@1.58.2
npx playwright install chromium
node tests/block-packs/pack-4/gallery-browser.mjs
```

The installed root CI currently runs `node --test tests/*.test.mjs`
and does not include the nested Pack 4 tests. Do **not** edit shared
workflows from the Pack 4 lane; report this to the integration owner.

No creator authorization to integrate has been given. **The next task
is to resolve the true native/visual test blockers and present the
result for manual, creator-controlled integration—not to start another
set of blocks or auto-merge.**

## Additional M5 QA evidence
- **Four new cross-family mesh-budget cases PASS in the V8 source harness**, raising the total to **161/161 V8 checks**. Per candidate the peak original preview is 1,224 vertices, below 1,300; cumulative 23 candidate shapes total 14,436 vertices, below 16,000 (only one is uploaded to shared WebGL2 at a time). Each of 23 meshes remains deterministic and finite across four 90-degree rotations. This does not prove actual GPU performance or production world mesh integration.
- **Fixed a false-positive browser visual assertion**: nonblack GL clear pixels previously counted as nonblank rendered geometry. Now the 23-card browser acceptance script requires genuine foreground RGB contrast against each canvas corner, distinct image hashes, and a changed rotation image. The browser remains blocked by environment policy; these corrected assertions are authored, **not passed in Chromium**.
- Final artifacts still require exact HEAD full native Node tests, genuine WebGL2 screenshots and creator approval. `M5` remains **NOT ACCEPTED**.


### Shared :00/:12 source compatibility review — November 14, 2026
- **Real Pack 4-only defect fixed:** crate candidate **170** had **34 selectable AABB volumes**, exceeding the unmerged :00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106) `validateShape` maximum of **32**. Eight ornamental corner ferrules/front battens now have `selection:false`; original visuals **34 rendered sub-parts** and **1,224 preview vertices** are preserved while selection/collision use **26** bounding boxes. It remains a single independent targetable crate.
- New isolated `src/block-packs/pack-4/interaction-handoff.mjs` exports `pack4ShapeHandoff`, `pack4SidecarHandoff`, and `pack4ReviewSidecar`. It generates candidate-only `{boxes}` descriptors within the exact :00 shape cap and converts fixture `{id,rotation}` to staged `{blockId,turns}` sidecar entries. It **does not import, activate or modify any shared module**, registry, game save or renderer.
- **161/161 exact current Pack 4 test bodies PASS in V8 compatibility evaluation**, adding five tests for the 32-AABB limit, crate render-versus-selection count, hollow structures, real sidecar field formats and malformed-state rejection. **Not native Node.**
- Evaluated the **actual unmerged :00 source at head `2054e00ead30736726d53d5aed8a1f9dc4e080a0`**, including `validateShape`, `raycastShapes`, `canPlaceShape`, `rotateShape`, `inspectBodyFit` and `makeOrientationSidecar`. Across all **23 IDs × four orientations**, every collision and selection descriptor, empty placement, precise selected-box raycast, interior-body collision, rotation parity and real sidecar snapshot passed: **644/644 independent cross-source V8 probes**. This is **not integrated gameplay or native Node testing**.
- Reviewed actual :12 [PR #108](https://github.com/hdog960/Mythwrought/pull/108) head `31be6f32adcfbb461b7a57e7db2e1567f8c1891a`. Its opt-in boundary-only `prototypeSurfaceMesh` tessellates unions more heavily than the Pack 4 preview meshes; sample **fireplace 177 produced 8,336 boundary-mesh vertices** and **pulley 180 produced 8,136**, compared with Pack 4's self-contained preview limits of 1,500 vertices per candidate. This is a **mobile-mesh integration budget warning**, not a runtime acceptance pass or a reason to edit shared mesher sources.
- Existing live world still has only persistent IDs **0–8**. Pack 4 candidate IDs **159–181** remain **not registered**; no creator integration permission. M5 is still OPEN pending full native exact-HEAD Node suite, authentic Chromium WebGL2 gallery/screenshots and explicit art/physical iPhone Gate A approval.


### Latest M5 technical acceptance check — November 14, 2026
- All **22 roster families / 23 physical candidate variants (IDs 159–181)** are still source-authored and isolated. IDs 182–208 remain unassigned; live 0–8 and sentinel 255 are unchanged. Manual Packs #113/#114/#112 have independent ranges 9–38, 59–76, 109–125; Pack 5 [#119](https://github.com/hdog960/Mythwrought/pull/119) still uses symbolic `pack5:079..096` keys and **no numeric block allocation**; automated :12 Issue #117 remains separate.
- The new `tests/block-packs/pack-4/mesh-winding.test.mjs` verifies **19,248 genuine source-mesh triangles** over 23 models × four orientations: **zero inward-facing triangles, zero degenerate triangles**, unit face normals, consistent transparent alpha, and unique per-asset preview meshes. Three test bodies pass via V8 exact-source evaluation, **not native Node**.
- **Pack 4's previously arbitrary ±65,536-cell orientation sidecar restriction was removed.** The staging adapter now matches the actual :00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106) `cellKey` contract: arbitrary safe-integer coordinates. A sixth `interaction-handoff.test.mjs` case verifies distant positive/negative cells, `Number.MAX_SAFE_INTEGER`, and sorted replay, without changing schema-1 player saves.
- **168/168 current Pack 4 test bodies PASS in V8 compatibility evaluation** against the exact current draft PR patch files. This includes all 23 IDs, all support categories and orientations, partial collision/select, atomic fixture saves, 32-box shared interaction handoff (including the crate fix), mesh budgets, all-source winding and visual uniqueness. **This is not the entire native Node runner.**
- **Actual Node v22.16.0 5/5 PASS** for `preview-utils.test.mjs`, with local source and test Git blob hashes matching GitHub: `dbb9a47a6474fbc3461e006530d6dbaffbea42b2`, `a469b2f1a1648b1f18b51291b3ab0103701321b7`. The remaining nested test modules are not present in the local clone because GitHub DNS is blocked; do not claim 165 native passes.
- **Genuine Chromium/WebGL2 remains BLOCKED:** system Chromium navigation fails `ERR_BLOCKED_BY_ADMINISTRATOR` on even a minimal test page, and Playwright's `page.set_content` creates no WebGL/WebGL2 context with available software flags. Therefore **no** actual 23-model Chromium screenshots at 667×375, 844×390 or 932×430 were accepted. The browser script is authored and must run on an approved free tooling host/checkout.
- **M5 FINAL ACCEPTANCE STILL OPEN; v0.10 Gate A not approved; v0.11 LOCKED.** Future integration owner must test the 23 model screenshots, source-to-live alpha sorting, partial shapes, mounted supports, saved orientations and :12 prototype mesher performance (fireplace sample 8,336 generated vertices / pulley sample 8,136 versus lower Pack 4 preview budgets). No merge, Pages deploy, registration, shared-system code edits or world-generation placements.


### Latest M5 acceptance update — fixture and sidecar interoperability (2026-11-14)
- Reverified latest integrated `main` `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, checkpoint **006**, coordination Issues [#109](https://github.com/hdog960/Mythwrought/issues/109) and [#117](https://github.com/hdog960/Mythwrought/issues/117), Pack 1 [#113](https://github.com/hdog960/Mythwrought/pull/113), Pack 2 [#114](https://github.com/hdog960/Mythwrought/pull/114), Pack 3 [#112](https://github.com/hdog960/Mythwrought/pull/112), symbolic Pack 5 [#119](https://github.com/hdog960/Mythwrought/pull/119). Pack 4 remains **22 original families / 23 IDs 159–181**, unmerged and not in live game.
- Fixed a Pack 4-only fixture inconsistency: `fixture.mjs` still capped valid world coordinates at ±65,536 after the orientation adapter had been fixed. It now accepts **safe integers**, rejects overflowing support offsets before writing a candidate cell, and preserves atomic restore. Added a fixture test with coordinates at ±1,000,000 and near `Number.MAX_SAFE_INTEGER`.
- Added `pack4FixtureToSidecarSnapshot` and `pack4SidecarToFixtureSnapshot` to the **Pack 4-only** test adapter. Two new isolated tests cover 23 simultaneous candidate cells with floor/wall/ceiling supports, distant coordinates, exact fixture save → staged sidecar → fixture replay and rejection of duplicate/malformed entries. The original 22-family roster and box counts are unchanged; no production save or placement modifications.
- **168/168 exact current PR-head authored tests PASS in source-backed V8 compatibility evaluation** (13 nested suites). The direct, separate unmerged :00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106) `makeOrientationSidecar`, `snapshot` and `restoreOrientationSidecar` routines were also evaluated with **all 23 candidate identities**: 23/23 fixture snapshots replayed, and one stale ID was correctly filtered. This is **not actual Node test-runner execution and not a live game save**.
- **Native Node v22.16.0 remains verified only for `preview-utils.test.mjs` (5/5 pass).** Full source checkout is not obtainable from the local terminal because DNS resolution fails for `github.com` and `raw.githubusercontent.com`. Do not infer all 168 cases passed in Node from the V8 run.
- A minimal headless Chromium data-page smoke command also timed out in this environment; **no genuine WebGL2 23-asset screenshots** were produced at 667×375, 844×390 or 932×430. The isolated gallery-browser runner requires a browser-enabled checkout elsewhere. No physical-iPhone or creator art/control approval is claimed.
- **M5 acceptance remains OPEN, v0.10 Gate A OPEN and v0.11 LOCKED.** Only Pack 4 source/tests changed; no shared CI, engine, world generation, registry, other packs, merge, GitHub Pages deploy or production schema-1 save edits. The previous :00 32-box crate fix and :12 prototype-mesh budget warning remain applicable.


### Updated main reconciliation — automation integration 007 (2026-11-14)
- **MAIN MOVED WHILE THIS REVIEW WAS UNDERWAY.** Exact current main is `b62728e1756140ab189b006dab85da091b0eeedc`, a new commit titled **“Gate A integration 007: automation-only voxel and biome130 candidates”**. It adds approved opt-in :00/:12/:24/:36/:48 code and tests but **does NOT include any manual Block Pack 1–5 sources or persistent IDs**. The authoritative `docs/INTEGRATION_CHECKPOINTS.md` file has not yet been updated beyond **006**; distinguish the new commit label from the ledger's last recorded checkpoint. The prior main `f27a887b...` is no longer the latest HEAD.
- New-main registry was inspected and is still exactly block IDs **0–8**, with **255** protected. Pack 4 IDs **159–181** remain **candidate-only, UNMERGED**; IDs **182–208** remain available, with no manual pack overlap.
- Current-main opt-in `src/voxel-shape-interactions.mjs`, `src/voxel-shape-fit.mjs`, and `src/voxel-orientation-sidecar.mjs` match the actual SHA variants previously reviewed from the :00 PR; they now exist in main. Repeated **552/552 V8 source-to-source compatibility probes** across all 23 Pack 4 IDs × four rotations × six facets (shape validation, rotation, precise ray targeting, collision body fit, empty placement, orientation sidecar). A 23-cell distant-coordinate isolated Pack4 fixture snapshot also roundtripped through current-main `makeOrientationSidecar` and `restoreOrientationSidecar` with no errors. These are **candidate-level V8 source probes, not engine activation, not a production save or native Node tests**.
- All **168/168 exact Pack 4 authored test cases pass under JS V8** after adding the distant-cell fixture, bidirectional staged sidecar conversion and malformed state tests. Genuine native Node is limited to the earlier exact-blob **5/5 preview-utils** subset; container GitHub DNS still fails, so the entire nested test suite cannot be represented as natively passed.
- Local headless Chromium minimal `data:` navigation **timed out** and earlier browser checks were administrator-blocked/no WebGL2. No authentic 23-asset screenshots at 667×375, 844×390 or 932×430 are available; screenshot and physical iPhone visual review remain mandatory before approval.
- The Pack 4 draft now trails main by **one automation-only commit** and will need a safe future integrator-controlled reconciliation. **Do not rebase/merge this branch or modify main, shared renderer/collision/save code, unrelated packs, PWA or world generation.** v0.10 Gate A OPEN, v0.11 LOCKED, M5 acceptance OPEN.


### Checkpoint 007 definitive reconciliation — 2026-11-14
- The **latest main is `caf47776b723a36684edc1a72749e49268ccc688`**, containing automation-only code commit `b62728e1756140ab189b006dab85da091b0eeedc` and a subsequent docs update. The authoritative `docs/INTEGRATION_CHECKPOINTS.md` **NOW records checkpoint 007**, explicitly excluding manual Packs 1–5 and building-pool projects. Prior descriptions above referring to `006` as the latest checkpoint or `b62728e` as the latest main are superseded by this section. Pack 4 PR #115 is behind main by these two automation-related commits; this lane did not merge/rebase.
- Live `src/voxel.mjs` still defines **IDs 0–8** only. Current-main :00 generic shape targeting, body fit, orientation sidecar and envelope are **opt-in** and do not register Pack 4 IDs. A full current-main V8 compatibility probe confirmed **552/552** shape/rotation/raycast/collision/placement/sidecar cases across 23 Pack 4 IDs × 4 rotations × six checks, plus **23/23** distant fixture-to-real-sidecar-to-fixture snapshots. **No production saves were altered** and no in-world integration is claimed.
- **Prior :12 surface mesher integration warning is improved by the newly integrated optimized greedy mesher.** Re-ran `prototypeSurfaceMesh` from exact current main against all 23 Pack4 collision box unions at all four orientations: **92/92** produced bounded geometry, maximum **836 position vertices** (crate ID 170 at rotations 1/3), within Pack4's existing 1,500-vertex candidate preview threshold. The prior pre-007 prototype mesh's 8,336/8,136 vertex examples above are **STALE for the currently integrated mesher**, not a current failure. These tests are exact-source V8 model checks, **NOT real WebGL2 GPU performance** or a production renderer hookup.
- Full `node --test tests/block-packs/pack-4/*.test.mjs` from a genuine source checkout remains **UNVERIFIED** because the local shell cannot resolve GitHub/raw hosts. The only verified native Node subset is 5/5 `preview-utils.test.mjs`; **168/168** authored suite bodies pass in the V8 harness. Headless Chromium smoke page still times out/administrator-blocks navigation; there are no genuine 23-asset screenshots or physical iPhone certification.
- **M5 STILL OPEN** until exact-head full native Node, actual Chromium screenshots at 667×375, 844×390, 932×430, and creator physical iPhone/art approval. No merge, deploy, shared files, live registry or generated-world placement.


### Current checkpoint 007 acceptance review — 2026-11-14 (supersedes older checkpoint 006 / pre-007 notes)
- **Verified integrated main:** `caf47776b723a36684edc1a72749e49268ccc688`; **checkpoint 007** is the automation-only integration and explicitly excludes ALL manual Block Pack PRs, including Pack 4 [draft #115](https://github.com/hdog960/Mythwrought/pull/115). Main added opt-in :00 shape/raycast/body-fit/orientation-sidecar modules and the optimized :12 `prototypeSurfaceMesh`; these are **available on main**, but Pack 4 IDs **159–181 remain unregistered/unmerged**, with no live world placements. The Pack 4 branch is two commits behind main with **no overlapping owned paths**. No automatic rebase, merge, or deployment was performed.
- **Current-main contract regression suite added:** `tests/block-packs/pack-4/integrated-main-contract.test.mjs` checks all **23 candidates × four rotations** against the actual current-main `validateShape`, `rotateShape`, `raycastShapes`, `canPlaceShape`, `inspectBodyFit` and orientation sidecar snapshot/restore (including distant cells and stale-ID suppression). Six exact-source V8 test bodies passed. This is NOT native Node or production placement.
- **Current-main surface suite added:** `tests/block-packs/pack-4/integrated-main-surface.test.mjs` checks actual current-main opt-in boundary-only meshing across **92 orientations**, triangle winding/normals, hollow civic geometry and explicit mobile geometry budgets; **3/3 exact-source V8 tests PASS**. Across 92 model/rotation instances, largest output is **836 position vertices** (ID 170 rotation 1), total **37,800 vertices**, below the review maximum of 1,500 per orientation. **This does not certify physical iPhone GPU performance or the production WebGL renderer.**
- A newly authored first version of the surface budget check incorrectly assumed boundary tessellation must always use fewer than twice the naive primitive triangles. Actual exposed-face subdivisions can legitimately exceed that naive count (iron bars ID 164), so the *test assumption*, not production geometry, was corrected to an evidence-based cap of 450 triangles for selected detailed models. All three corrected cases pass.
- **Full source-backed V8 acceptance now 177/177 authored test cases PASS**, using exact GitHub Pack 4 PR source and checkpoint 007 shared source. **Real native Node v22.16.0 remains 5/5 PASS only for exact-Git-blob preview-utils subset** (source SHA `dbb9a47a...`, test SHA `a469b2f1...`), NOT the full nested suite. GitHub clone/raw access is DNS-disabled in the available container; existing root GitHub Actions `tests/*.test.mjs` does not discover `tests/block-packs/pack-4/*.test.mjs`.
- **Genuine Chromium/WebGL2 gallery still NOT VERIFIED.** This host's Chromium ANGLE/EGL software renderer fails initialization; no authentic 23-card gallery screenshots at **667×375, 844×390, 932×430** are available. No substitute illustration or static mock is counted as test evidence.
- Coordination: Issue [#109](https://github.com/hdog960/Mythwrought/issues/109) reserves Pack 4's **159–208** band, with 159–181 candidate-assigned and **182–208 free**. Issue [#117](https://github.com/hdog960/Mythwrought/issues/117) remains separate from the 130-family automated symbolic catalog. Manual PRs #113 (Pack 1), #114 (Pack 2), #112 (Pack 3) and #119 (Pack 5) retain their own rosters and paths. No cross-pack edits.
- **M5 final acceptance remains OPEN / NOT APPROVED.** Full checkout-backed `node --test tests/block-packs/pack-4/*.test.mjs`, genuine Chromium WebGL2 screenshots, mobile performance and explicit creator art/physical-iPhone controls approval must be completed separately. v0.10 Gate A OPEN, v0.11 LOCKED. **DO NOT MERGE, DEPLOY, REGISTER IDs, MODIFY SHARED CODE, ALTER SAVES OR PLACE WORLD OBJECTS.**


### M5 checkout-context and real Node evidence — final review update
- **Raw branch vs latest main:** PR #115's draft branch still forks from checkpoint 006 and is **two commits behind** checkpoint 007 `caf47776b723a36684edc1a72749e49268ccc688`; those later commits introduce the shared shape/sidecar/mesher modules but touch **no Pack 4-owned paths**. No rebase or merge was authorized or performed.
- **Corrected acceptance harness:** `tests/block-packs/pack-4/current-main-loader.mjs` now checks for the exact checkpoint 007 module files before import. On a raw pre-007 Pack 4 HEAD checkout, the **nine integrated-main tests report explicit SKIP**, not a misleading `ERR_MODULE_NOT_FOUND` failure or fake pass. On a current-main plus Pack 4 candidate combined checkout, those nine tests execute the actual shared modules. If a module exists but its import fails, the error is a **real failing acceptance test** and is never suppressed.
- **Source-backed V8 evidence:** All **177/177 existing core authored test bodies** PASS when evaluated against exact GitHub Pack 4 sources + checkpoint 007 main APIs, including the **6 current-main interaction tests and 3 current-main surface-mesher tests**. These are NOT native Node results. The newly added native-loader behavior suite adds **two further authored tests** (179 total authored tests), whose verification is reported separately.
- **Actual native Node v22.16.0:** **7/7 PASS** across `preview-utils.test.mjs` (5) and `current-main-loader.test.mjs` (2) using files whose local `git hash-object` results exactly match GitHub blobs: preview source `dbb9a47a6474fbc3461e006530d6dbaffbea42b2`, preview tests `a469b2f1a1648b1f18b51291b3ab0103701321b7`, loader source `2ce3374326e91376cd93dd022a1ddd9e97e6cf59`, loader tests `5d6b62385379c7992ae979b06090746eeb061eba`. This proves raw-fork missing-module handling but NOT the nine combined-checkout tests nor the complete 179-case native suite.
- **Mandatory outstanding technical gates:** exact-current-main combined source + all Pack 4 candidate files on a permitted Node runner, `node --test tests/block-packs/pack-4/*.test.mjs` with **no skipped integrated-contract cases**; genuine WebGL2 **23-image gallery** at **667×375, 844×390, 932×430** with reviewable authentic screenshots; shared rendering/alpha and real iPhone performance. Headless Chromium in this environment rejects all three minimal viewport probes with `ERR_BLOCKED_BY_ADMINISTRATOR` and software ANGLE/EGL fails initialization. There are **no genuine Pack 4 screenshots**; do not substitute game baseline screenshots.
- **Gate A remains OPEN; v0.11 remains LOCKED.** No candidate ID registered, no worldgen placement, no shared code modification, no merge or deploy. The creator must approve art and physical-iPhone controls.

### Latest Milestone 5 technical verification — strict runner and newer main
- **Latest main SHA verified:** `f416a2b26c4c00b5944f3bd37e9360030a247cc9` (one commit after `caf47776`). Main added automation-only `src/live-voxel-world.mjs`, browser/Node checks and adjusted shared CI. Its source labels the playable district as "Checkpoint 008", but `docs/INTEGRATION_CHECKPOINTS.md` still ends with **documented checkpoint 007** at this check. Both exclude manual Pack 4 ID registrations or placements. The two earlier checkpoint 007 shared APIs remain unchanged. Draft Pack 4 is now **three commits behind main** with **zero owned-path conflicts**.
- Added `tests/block-packs/pack-4/verify-final.mjs`: a strict, opt-in, **native** acceptance runner on an authorized *combined* latest-main and Pack 4 checkout. It refuses to run without all required shared modules, rejects missing OR unexpected dedicated test suites, demands exactly **179 passing genuine Node 22 tests, zero skips and zero failures**, and (unless `--node-only`) requires the actual 23-card Chromium/WebGL2 gallery with screenshot outputs at 667×375, 844×390 and 932×430. The runner is **not** an engine change and cannot merge, deploy, or install blocks into world generation.
- **Verified the runner itself with genuine local Node 22**: exact Git blob `1162fa6501ae07218721a7a1e180675d65c9539b` matched, JavaScript syntax check PASS, then `node tests/block-packs/pack-4/verify-final.mjs --node-only` correctly exited **code 1** with an explicit missing-combined-checkout error. That is a **fail-closed smoke**, not a full native-suite pass.
- **Previously established test evidence remains scoped:** 177/177 source-backed V8 cases PASS against checkpoint 007 shape APIs; 7/7 actual native Node preview/loader subset PASS. The complete 179-case native suite has not yet been executed from a combined checkout because outbound GitHub checkout/raw access is DNS-blocked. Chromium remains blocked at `127.0.0.1` by administrator page policy and EGL/ANGLE initialization. Therefore **zero genuine candidate screenshots are accepted**; do not substitute baseline game screenshots.
- Current root CI (updated for the new live-world checks) still does **NOT** execute nested `tests/block-packs/pack-4/*.test.mjs`. Exact Pack 4 PR-head standard CI conclusion must be checked separately and cannot substitute the two acceptance gates.
- **M5 ACCEPTANCE OPEN.** No candidate IDs registered, no main/CI/shared-system modifications, no merge, deploy, world placement, schema-1 save change or physical iPhone/art/control approval. v0.10 Gate A OPEN; v0.11 LOCKED.


**Checkpoint 008 follow-up (latest main):** Verified `main ac263720b60641c65b02330348dd76d0ef9cb75e`; `docs/INTEGRATION_CHECKPOINTS.md` now **officially records checkpoint 008**, following `f416a2b` automation-only live-voxel district activation. Its source and ledger **explicitly exclude all five manual Block Packs**, including Pack 4 PR #115. The Pack 4 review branch is four commits behind current main, with zero Pack 4-owned path conflicts. The new live-world root CI tests remain separate from Pack 4's 179-case native acceptance. **Do not confuse this automatic world activation with any incorporation of Pack 4 candidate IDs 159–181.**


### M5 native preview-failure hardening and full visual rotation audit — 2026-11-14
- **Real Pack 4-only preview defect repaired:** `gallery.mjs` formerly allocated GPU shaders/program/VAO/buffer partly outside its `try/finally` and left blending/depth mask unsafe if a translucent pass or resource allocation threw. Now shader compile/link failures release allocated shader/program objects, rendering acquires all resources under `try/finally`, every new candidate clears with `depthMask(true)`, and `releasePack4PreviewGpu` resets depth writes/blending/bindings before deleting resources. The **live renderer was not touched**.
- **Genuine native Node v22.16.0 9/9 PASS**, independently checking exact Git blob hashes for four local source/test files (preview-utils SHA `723f1e4c87d87e97aede6fea1272a4201b87e336`, preview tests `7b4b2e597e2fdf92f580e161b2844770e8f04211`, main loader `2ce3374326e91376cd93dd022a1ddd9e97e6cf59`, main loader tests `5d6b62385379c7992ae979b06090746eeb061eba`). These include **two new native GPU teardown regression cases**. This **does not establish full native acceptance**.
- **Strict native runner now requires 181/181 genuine Node tests** (16 dedicated nested suites, zero skips/failures). The added two GPU cleanup cases increase the prior authored total from 179 to 181. It still must run on a **combined checkpoint 008 main plus Pack 4** isolated checkout. The local runner cannot fetch the remaining GitHub files because DNS is blocked; no full native pass is claimed.
- **Gallery QA enlarged materially:** `gallery-browser.mjs` now requires **23 models × all four rotations × all three requested mobile landscape viewports = 276 actual WebGL2 rendered card states**, 23 nonblank high-contrast card images per rotation, distinct initial asset images, visible changes for asymmetric fireplace/fountain, no swallowed render errors, and **12 source-derived PNG screenshots** (one for each rotation × viewport). This script **has not successfully executed in genuine Chromium**; local browser yields `ERR_BLOCKED_BY_ADMINISTRATOR`, and Python Playwright with available ANGLE/SwiftShader software options returns `webgl2:false` and `webgl:false`. No source-derived visual quality can be approved yet.
- **Previous 177/177 source-backed V8 cases** remain historical evidence but were not rerun here as a substitute for the missing full native and genuine browser gates. The 23 candidate IDs 159–181, roster families, independent geometry, mount and isolated save contracts remain unchanged.
- **Final state:** v0.10 Gate A **OPEN**, v0.11 **LOCKED**, M5 acceptance **OPEN**. No merge, Pages deployment, candidate registry insertion, shared engine/CI edits, other Pack/roadmap modification or worldgen placement.

### M5 continuation: WebGL replay regression and accurate acceptance evidence — 2026-11-14
- Rechecked exact PR #115 head `c3e9152593fdf5dd2bcea4e1625329331702a4c7` **before this session's Pack 4-only commits**, `main ac263720b60641c65b02330348dd76d0ef9cb75e`, integration checkpoint **008**, Issues #109/#117, and 32 changed Pack 4-only paths. PR remained open, draft and unmerged. **Use the latest live PR HEAD** after this documentation update.
- Existing exact-head standard GitHub Actions run [#43648383654](https://github.com/hdog960/Mythwrought/actions/runs/43648383654) was **QUEUED** on inspection; the existing baseline workflow does not run the 16 nested Pack 4 suites. This is **not a successful CI result** and is not visual or native Pack 4 acceptance.
- Added one real browser-harness regression to `gallery-browser.mjs`: after the **23 assets × four rotations** are checked at each landscape viewport, rotate all 23 canvases back to zero and require **pixel-for-pixel fingerprint parity** with their original images. This specifically detects state leakage, nondeterministic rerenders, and stale WebGL buffers that the earlier GPU-cleanup fix might otherwise leave hidden. Fail closed on blank or error-labeled reset renders. There are 69 additional re-render comparisons across three widths, not 69 extra approved screenshots.
- Investigated the older ~8k-vertex :12 prototype-mesher warning before changing the strict mesh tests. An independent algorithm/geometry reconstruction for selected complex Pack 4 collision shapes returned much smaller **boundary-only** counts (fireplace 177: 500, pulley 180: 828, crate 170: 760, chimney 176: 616 vertices). **These are diagnostic reconstructions, not exact checked-out native Node test results**, and do not justify weakening the existing 1,500-vertex/1,000-peak test limits. The full 92-rotation integration test remains unverified.
- Local real Chromium/Playwright smoke with system Chromium in **three software/default GL configurations** produced `webgl2:false` and `webgl:false` every time; **zero genuine Pack 4 gallery screenshots passed**. Local GitHub clone remains DNS-blocked, so the **181/181 native Pack 4 acceptance suite was not executed**. Do not substitute V8 compatibility checks or previous 9/9 native subset for this requirement.
- **M5 still OPEN.** 22 families, 23 provisional IDs (159–181), creator art/physical-iPhone sign-off and v0.10 Gate A status unchanged. No merge, deploy, live registry, production saves, shared engine/CI, other packs, automation lanes, or world placement were modified.

### M5 continuation: headed Chromium WebGL2 capability — 2026-11-14
- Reverified main `ac263720b60641c65b02330348dd76d0ef9cb75e` and checkpoint **008**, Issues #109/#117, draft PR #115 ownership (all 32 changed paths Pack 4 only), and draft/unmerged heads for manual Packs #113/#114/#112/#119, the :12 biome catalog candidate #118, and independent building-roadmap PRs #121/#122/#123/#124.
- **Environment discovery, not asset certification:** native Node v22.16.0 executing an actual Playwright Chromium v144.0.7559.96 process under `xvfb-run -a`, using `headless:false`, `executablePath:'/usr/bin/chromium'` and SwiftShader/ANGLE software GL args, obtained a **real `webgl2` context** with version `WebGL 2.0 (OpenGL ES 3.0 Chromium)`. This removes the prior blanket claim that all WebGL2 execution is impossible on this host. Headless Chromium in three configurations still returned `webgl2:false`; headed Chromium needs the virtual display.
- **Actionable Pack 4-only harness fix:** `gallery-browser.mjs` now honors `PACK4_CHROMIUM_HEADFUL=1` and optional `PACK4_CHROMIUM_PATH=/usr/bin/chromium`. It performs a *real* WebGL2 readiness check and fails explicitly if the context is unavailable. Existing strict 23-asset × 4-turn × 3-viewport rendering, 12 PNG outputs, foreground contrast, initial uniqueness and zero-rotation replay checks remain unchanged.
- Reproduce full candidate gallery on a complete checkout that includes installed Node Playwright and a Chromium binary:
  ```sh
  xvfb-run -a env PACK4_CHROMIUM_HEADFUL=1 PACK4_CHROMIUM_PATH=/usr/bin/chromium \\
    node tests/block-packs/pack-4/gallery-browser.mjs
  ```
- **Still not passed:** obtaining the combined exact GitHub main+Pack4 source checkout is blocked by local GitHub DNS/HTTP policy, so the **181-case native Node suite** and the real **23-candidate Chromium gallery** have **not executed** in this session; **0 genuine Pack4 gallery PNGs inspected or approved**. The standalone actual Chromium/WebGL2 preflight does not render any candidate and is *not* substituted for that gate. The regular exact-head [Actions run #43649969149](https://github.com/hdog960/Mythwrought/actions/runs/43649969149) was queued when checked and does not execute nested Pack4 acceptance tests.
- **M5 OPEN**, Gate A OPEN, v0.11 LOCKED. No merge, deployment, live ID registration, schema-1 production save modification, other pack or shared-engine changes.

### M5 native source-reconstruction recovery — 2026-11-14
- Added **Pack 4-only** `tests/block-packs/pack-4/rebuild-review-checkout.mjs`, a temporary local combined-checkout builder, and `tests/block-packs/pack-4/fixtures/rebuild-review-checkout.test.mjs`, five standalone native Node tests. This does **not** modify GitHub workflows, game/shared-engine code, registries, existing main, or other packs.
- Builder requires **explicit, immutable 40-hex** main and draft-PR Git SHAs. It reads both Git trees from GitHub, rejects truncated or incomplete Pack 4 inventories, requires the exact 16 native suite filenames and the four integrated main shape modules, downloads only Pack 4-owned files and these four main modules, and verifies **byte count and Git blob SHA-1** before writing each path to a fresh isolated checkout. Rejects path traversal and nonempty output destinations; has bounded concurrency and per-file size limits. The 16-suite/181-case strict verifier is untouched.
- Native `node --test tests/block-packs/pack-4/fixtures/rebuild-review-checkout.test.mjs`: **5/5 PASS**, zero skipped/failed, Node v22.16.0, using deterministic mock Git API/raw endpoints. Covered correct reconstruction of 32 simulated Pack 4 paths plus four main dependencies; SHA1 blob framing; truncated/unsafe trees; byte tampering; incomplete main dependencies and invalid floating refs. **These five helper tests are nested and separate from (not added to) the 16-suite, 181-case acceptance count.**
- Both committed source blobs match exact local `git hash-object` results: `rebuild-review-checkout.mjs` `261a2010dbdb4798056b7af0c166b7d3f1de6509`; nested recovery tests `ebdfc301010910a77b71ddcd337d925854c9310b`.
- Real checkout attempt at main `ac263720b60641c65b02330348dd76d0ef9cb75e` and PR head `54329c6a271629f3010d1006a4368dacdeb4d3a4` returned native Node `TypeError: fetch failed` during GitHub tree retrieval (DNS/network restrictions). No full source checkout or actual asset suites were produced. **Do not call the 181-case native suite passed.**
- Reproduction on a GitHub-network-accessible host (requires Node 22):
  ```sh
  node tests/block-packs/pack-4/rebuild-review-checkout.mjs \\
    --main ac263720b60641c65b02330348dd76d0ef9cb75e \\
    --pack 54329c6a271629f3010d1006a4368dacdeb4d3a4 \\
    --run-node
  ```
  For genuine Chromium/WebGL2, install Playwright and Chromium and run the same with `--run-gallery`; virtual-display Linux hosts can wrap the invocation in `xvfb-run -a env PACK4_CHROMIUM_HEADFUL=1 PACK4_CHROMIUM_PATH=/usr/bin/chromium`. The main/pack SHAs must be rechecked for newer changes before repeating. No mocked candidate galleries or images may be accepted.
- **M5 ACCEPTANCE OPEN.** Full 181 native Node cases and all 276 genuine candidate WebGL2 rotation states/12 screenshots still await execution and visual inspection. Creator art/physical iPhone signoff outstanding; Gate A open; v0.11 locked. The new utility is not integration, registration, deployment or merge authorization.

### M5 recovery fail-closed integrity follow-up
- Fixed a **Pack 4-owned local checkout safety defect**: concurrent source downloads formerly could leave a partial temporary checkout after any failed hash, network, or file write. Recovery now waits for all in-flight workers to settle, deletes any incomplete scratch output, restores a user-specified empty destination if applicable, and propagates the original error without declaring acceptance.
- Extended the tampered-file native test to assert that failed source reconstruction leaves an **empty output directory**. **5/5 genuine Node 22.16.0 tests PASS again**, zero skips/failures. Verified exact new code/test Git blobs: `19851f40b4dd503183ce6ac79c3219fb7d8d7617` and `d8422726c2694ace3c7a425bd9d080714dd7d8ed`. These are helper-only tests outside the 181 core acceptance cases.
- Retried the actual code at pin `8da4bb724c5cd94dcba46f0e73cd4180a084b4f7` plus main `ac263720b60641c65b02330348dd76d0ef9cb75e`: native checkout still failed at GitHub tree fetch with `TypeError: fetch failed` due this host's outbound access restriction. No asset source checkout was completed. **181-case core native test and authentic 23-asset Chromium gallery remain NOT RUN; 0 gallery screenshot approvals.** No other lane/files modified, no merge/deploy.

### M5 no-navigation WebGL2 gallery fallback — 2026-11-14
- Reverified current `main ac263720b60641c65b02330348dd76d0ef9cb75e` and documented checkpoint **008**, coordinator Issues #109/#117, Pack4 draft PR #115, all competing manual-pack, biome130 and building-roadmap ownership. All changed paths remain within `src/block-packs/pack-4/**` and `tests/block-packs/pack-4/**`; no creator incorporation authorization.
- **Substantiated execution-environment problem:** genuine headed Chromium/SwiftShader under Xvfb can create a real WebGL2 context, but even local HTTP `page.goto('http://127.0.0.1:port/...')` fails `net::ERR_BLOCKED_BY_ADMINISTRATOR`. This is a browser navigation policy, not proof of defective Pack4 asset geometry.
- **Pack4-only fix committed** to `tests/block-packs/pack-4/gallery-browser.mjs`: opt-in `PACK4_INJECT_SOURCE=1` reads the **exact checked-out** `gallery.html`, `gallery.mjs` and all five Pack4 source modules (windows, lighting, furnishings, hearth-civic, preview-utils). It removes the one original module script tag at runtime, installs the same page via Playwright `page.setContent`, exposes each exact JS source as a browser Blob ES module, rewrites only the five known relative import specifiers to those Blob URLs, imports the unchanged gallery logic, and revokes URLs after evaluation. Missing/extra imports fail closed; **no model geometry or raster pixels are mocked, simplified or substituted**.
- The existing strict candidate checks remain active in either mode: **23 IDs 159–181 × four rotations × all three landscape viewport sizes = 276 source-rendered card states**, foreground/uniqueness, asymmetric rotation changes, zero-reset replay fingerprint parity, **12 PNG fullpage screenshots**, browser errors and real WebGL2 readiness. The transport does not change the 181-case strict native acceptance suite.
- **Genuine browser-transport proof on this host:** native Node 22.16.0, Playwright Chromium with `xvfb-run -a`, `headless:false`, system Chromium and SwiftShader succeeded at **667×375, 844×390, 932×430**. Each test used `page.setContent`, imported a real Blob ES module with a static Blob dependency, performed `gl.clear` to a 340×296 WebGL2 canvas, read the actual pixel bytes `[102,51,179,255]`, got `gl.getError()===0`, and encoded an authentic PNG. **This was a synthetic transport probe, NOT a Pack4 asset render or accepted candidate screenshot.**
- **Remaining blocker:** local GitHub clone/raw and recovery-helper tree download still fail due DNS/outbound access; the full combined Git-blob-verified checkout could not be constructed. Therefore **full 181/181 native suite NOT EXECUTED; 0/276 candidate WebGL2 states accepted; 0/12 authentic Pack4 screenshots inspected.** Prior 5/5 native helper tests still pass with exact source blob hashes `19851f40b4dd503183ce6ac79c3219fb7d8d7617` / `d8422726c2694ace3c7a425bd9d080714dd7d8ed`.
- To run after obtaining the source-exact checkout with Playwright available:
  ```sh
  xvfb-run -a env PACK4_CHROMIUM_HEADFUL=1 PACK4_CHROMIUM_PATH=/usr/bin/chromium PACK4_INJECT_SOURCE=1 \\
    node tests/block-packs/pack-4/gallery-browser.mjs
  ```
  Read all generated genuine candidate images before art signoff. **M5 OPEN; Gate A OPEN; v0.11 LOCKED.** No merge, deployment, live ID registry, shared systems, other roadmaps or production saves touched.
