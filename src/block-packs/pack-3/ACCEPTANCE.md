# MYTHWROUGHT — Pack 3 Milestone 6 independent acceptance handoff
**2026-11-14 · CHECKPOINT 007 SOURCE-COMPATIBILITY REVERIFIED. CANDIDATES ONLY; NEVER MERGED/DEPLOYED.**

**CURRENT AUTHORITATIVE BASELINE:** integrated main `caf47776b723a36684edc1a72749e49268ccc688`, checkpoint **007** (creator-requested **automation-only** incorporation); Pack 3 remains isolated in draft PR #112. This replaces the formerly current checkpoint 006 baseline and the older, pre-007 non-greedy 17,140-triangle mesh estimates below. Historical M0–M6 test notes are retained for provenance. Current candidate geometry, names, IDs and save fixtures are unchanged; latest merged generic mesher significantly reduces prototype faces. Actual player/gameplay certification is still open.

This document is a review checklist and integration request, not live player-game certification or creator Gate A approval.

## Baseline, ownership, and duplication
- Verified GitHub `main`: `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`; checkpoint **006**; v0.10 Gate A OPEN and v0.11 LOCKED.
- Verified manual coordination [Issue #109](https://github.com/hdog960/Mythwrought/issues/109) and separate automated :12 biome catalog [Issue #117](https://github.com/hdog960/Mythwrought/issues/117).
- Pack 3 controls ONLY `src/block-packs/pack-3/` and `tests/block-packs/pack-3/`; no other manual pack IDs, shared engine, storage, UI, shader, worldgen, production CI or governance files touched.
- All **17/17** authored family IDs **109–125** are unique, exclusive and candidate-only. Reserve band 109–158 intact; original 0–8 unchanged and cache sentinel 255 untouched. Roster numbers are *not* block IDs.
- All Pack 3 shapes are independent small architectural components; Pack 2's proposed water *volume* is not Pack 3's dry *channel*. Pack 4 retains glass and window frames. Existing CRYSTAL 5 is a solid voxel, not our decorative crystal-topped spire. Automation :36 owns assembled monuments.

## Latest artifact: one narrow candidate-only adapter
- `catalog.mjs` reexports all five previously authored asset modules as one immutable `PACK3_CANDIDATE_ASSETS` array and `PACK3_CANDIDATE_IDS`.
- `pack3CandidateById(id,rotation)` resolves one of 17 unique candidates; 109–112 accept only rotation **0** (their current material surfaces have no orientation save), while 113–125 support quarter-turns **0–3**. Invalid IDs, the 255 sentinel and unsupported orientations fail closed.
- `pack3CandidateShape` supplies the exact occupied box union consumed by the unmerged :00 target/collision API; `pack3CandidateMeshDescriptor` supplies only opt-in `{prototypeOnly:true,placeable:false,boxes}` for the unmerged :12 mesher.
- `pack3CandidateReviewManifest` returns immutable `integrated:false/liveRegistered:false` review rows. **This is not a global block registry or production placement API.**

## Exact tests performed
| Item | Result | What it DOES NOT certify |
|---|---|---|
| All 5 original Pack 3 nested Node suites (7 + 9 + 11 + 12 + 14) | **53 PASS, 0 FAIL** in real Node.js v22.16.0, with exact GitHub blob source/test files | No live gameplay or schema migration |
| Direct Pack 3 `acceptance.test.mjs` (11 cases) | **11 PASS**, so **64/64 total** with `node --test tests/block-packs/pack-3/{roofing,roof-geometry,fortified-pieces,ornamental-pieces,monumental-pieces,acceptance}.test.mjs` | Root `npm test` does NOT auto-include the nested path |
| Latest unmerged :00 `validateShape/rotateShape/canPlaceShape` and :12 `prototypeSurfaceMesh` source contracts | **68/68 asset × four-turn descriptors** valid/bounded, no Uint16 overflow. Only 56 ID/turn combinations are offered by the adapter: 4 roofs locked at 0 + 13 shaped families ×4 | These are *pending engine APIs*, not a proven production integration |
| Original isolated target/collision regression fixtures | Tested sparse occupancy (arrow slit, crenel, arch, aqueduct, statue legs), positive/negative hit rays, candidate place/remove/rotate/restore, unsupported IDs and duplicate edits | Does not exercise actual player body collision or production selection |
| Genuine Chromium 144 (Playwright) opt-in gallery | 667×375, 844×390 and 932×430 CSS px; **17 actual model cards, 13 functioning rotation buttons**, zero JS page exceptions; screenshots visually inspected | Environment blocks direct file/HTTP navigation. Original module source and gallery script were inlined. NOT production WebGL2, FPS, Safari, offline or hardware iPhone |

Actual source/test files were reconstructed in the independent test container and compared by `git hash-object` against the corresponding PR branch file blobs before the Node run. The latest acceptance suite's own module/test files are likewise source-identical.

**Additional technical acceptance hardening:** checked all five independent candidate fixture formats are mutually distinct, each contains no production `schema:1` field, malformed production-stamped candidate snapshots are rejected, and 90° rotation preserves actual physical occupancy across eight interior samples per axis for 13 orientation-aware families. Two existing preview-only fixture implementations and three owned regression files were corrected; no shared save codec or registry was changed. **Genuine local Node tests: 64 PASS / 0 FAIL**. The original 62-case suite passed before this refinement.

### Repeatable Chromium visual-proof acceptance (M6 follow-up)

An optional dedicated Pack 3-owned runner now exists at `tests/block-packs/pack-3/gallery-browser.py`. It requires Python Playwright and a local Chromium executable (via `PACK3_CHROMIUM`, default `/usr/bin/chromium`). It uses the committed `preview.html` and the same five immutable authored source modules, inlined in-memory only because sandbox file/localhost navigation is blocked; it reads NO production world or saves. `PACK3_SCREENSHOT_DIR` optionally enables authentic full-page PNG outputs.

**Executed in actual headless Chromium 144 at all three required landscape sizes** (667×375, 844×390, 932×430): **17 distinct pixel hashes across 17 physical candidates**, minimum 12,410 non-background pixels per model, **13 working 90° rotation buttons**, each returning to its exact starting image after **four turns**. Seven intentionally directional pieces (IDs 113, 114, 116, 118, 121, 123, 125) all changed their rendered pixel signatures when rotated. **Zero JS page exceptions**. Screenshots were captured and visually inspected at all three sizes.

This is **genuine Chromium, but still a 2D canvas review of the actual occupied geometry**, not production WebGL2. An attempted separate 3D/WebGL2 review was **blocked by this container's Chromium returning null for both WebGL1 and WebGL2**, even with software-render flags; no WebGL-only result is claimed, and no unverified viewer was shipped. No physical iPhone/Safari test or production mesh/renderer performance claim. The runner is opt-in, not wired into the central CI workflow without explicit authorization.

### M6 creator-review framing repair — verified against committed source

**Pack 3-owned presentation defect discovered and repaired:** the earlier fixed perspective anchor `[160+(x-z)*98, 90+(x+z)*40-y*140]` could place high masonry/capital corners above the 320×200 review canvas (e.g. the 121 arched surround and 116 fortress wall), effectively cutting off the top of shapes in creator screenshots. The `preview.html` reviewer now uses a deterministic *per-candidate/per-rotation* fit projection calculated from all **eight corners of every source AABB**. Its scale is bounded to 1.18 and fits to a 288×172 inner area with a centered 320×200 canvas. The **collision, selection, canonical boxes, material palettes, ID roster, and production renderer are unchanged**. This fixes screenshot presentation, not gameplay.

**Reproducible real Chromium 144**: reran the exact committed `tests/block-packs/pack-3/gallery-browser.py` (local `git hash-object` matched GitHub blob SHA) against the updated preview (also blob-matched) at **667×375**, **844×390**, **932×430** CSS px. At **each** viewport, every one of the **17 initial candidates** and **all 52 images produced by 13 controls × four 90° turns** passed painted-pixel-bounding checks (minimum ten pixels clear on top and left, and ten from bottom/right), all 17 initial hashes remain distinct, all 13 controls return to the exact initial pixel hash after 4 turns, 7 required directional models visibly change, and no JS errors occur. **207 distinct frame-bound checks** across three viewport runs (69 per viewport) passed; this is review-canvas coverage, not production WebGL2.

**Native Node v22.16.0** rerun of the **six actual committed test files**: **64/64 PASS**; the physical definitions did not change. Rechecked the exact unmerged :00 shape targeting/placement contract and :12 mesher source on **all 68 candidate×quarter-turn descriptors**: 68 pass, zero errors; per-asset 332–2464 surface triangles, **17,140** for one of each archetype, max **4,928 vertices**. There is no production FPS measurement or WebGL certification, and the browser sandbox still cannot produce a reliable WebGL2 context.

**Final classification:** review preview is fully framed and source-congruent for creator inspection; **NOT a live-game rendering certification, visual approval, safe migration proof or permission to merge**. PR #112 stays DRAFT, checkpoint 006/main unchanged, v0.10 Gate A OPEN, v0.11 LOCKED. Integration remains an explicit separate creator action.

**Prototype triangle budget (one piece each, surface-only mesh):** 17,140 triangles total across the 17 archetypes; maximum **2,464 triangles / 4,928 vertices** on the guardian statue at any of its four rotations. No out-of-cell vertices, 32-box-limit violations, or unsigned 16-bit index overflow seen. These are synthetic prototype counts, **not measured production mobile GPU utilization**. Do not mass-place pieces without benchmark and performance acceptance.

## Production engine boundaries; NOT authorized changes
- Current `src/voxel.mjs` on main defines **BLOCK IDs 0–8 only**. `VoxelWorld.set` and `VoxelWorld.restore` reject candidate IDs 109–125. Current chunk cache uses 255 as the unvisited sentinel. Nothing in this PR changes it.
- The live `schema:1` save record only persists `[x,y,z,id]`; it has no per-cell yaw or candidate wider-ID registry. **Milestone 6 correction:** the two legacy Pack 3 roof-material/roof-geometry fixtures **no longer emit `schema:1`**; all five Pack 3 preview fixture formats now have distinct marker strings and **no `schema` field at all**. Both repaired decoders reject any payload with a `schema` field. Candidate IDs 109–125 and their preview snapshots must NEVER be written to production player saves.
- Integration will require centrally approved safe ID mapping, compatible rendering/mesh generation, shape-aware raycast and collision, body/placement checks, backward-safe orientation save codec, old save-reload regressions, offline PWA verification, and actual physical iPhone two-thumb/visual/performance approval.
- Aqueduct **has no water** (flow/levels unsupported), spire **emits no game light**, statue **is not an NPC**; no generated villages/towns/cities/monuments are present. Static shape data must never be marketed as these gameplay systems.

## Decision & explicit future sequence
1. Milestones 0–5: **17/17 independent candidate families authored; isolated candidate regression acceptance verified.**
2. Milestone 6: **TECHNICAL CANDIDATE REVIEW READY**. Not a certification of game integration or the creator's art/control approval.
3. Creator must explicitly approve visual designs/controls and separately order incorporation. Gate A stays open and v0.11 stays locked. Do not merge PR #112, deploy GitHub Pages, register IDs, migrate saves, or place assets in generated terrain under this review.
4. Integration owner should first reconcile the pending unmerged :00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106) and :12 [PR #108](https://github.com/hdog960/Mythwrought/pull/108) contracts with all four manual packs and automated :12 catalog. Then implement and validate any migration/registration in a separate, authorized review.

### Milestone 6 exact-source recheck — 2026-11-14 (no new geometry defects)

Reverified latest integrated main `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84` / incorporation checkpoint **006**, coordination Issues [#109](https://github.com/hdog960/Mythwrought/issues/109) and [#117](https://github.com/hdog960/Mythwrought/issues/117), independent manual Pack 1/2/4/5 PRs and unmerged :00/:12 interfaces. All 17 Pack 3 IDs **109–125** retain exclusive ownership in the draft branch. Compared the 20 local Pack 3 code/test files used in this run with exact GitHub PR HEAD blob SHAs (using `git hash-object` and the PR tree API): **20/20 match**. Documentation is updated here only after tests; there is no source-shape mutation.

**Native committed Node suites, rerun (not a simulation):** Node v22.16.0 `node --test tests/block-packs/pack-3/{roofing,roof-geometry,fortified-pieces,ornamental-pieces,monumental-pieces,acceptance}.test.mjs` produced **64 PASS / 0 FAIL**, exit status zero. Exercises all candidate manifests/IDs, distinct physical box unions, selection/collision, 4-turn placement snapshots, non-game preview formats with no player `schema`, invalid IDs/rotations and deterministic restores. Production `VoxelWorld.set/restore` still rejects IDs 109–125, so this is **candidate save-format isolation**, not a migration certification.

**Committed optional Chromium runner, rerun unchanged:** Chromium 144.0.7559.96, `python tests/block-packs/pack-3/gallery-browser.py`, authentic screenshots at **667×375**, **844×390** and **932×430** CSS pixels. Each of three runs produced all 17 distinct rendered canvas hashes, 13 working rotation controls, exact original image after four turns, seven expected directional pieces visibly different when rotated, **zero JS errors**, at least **12,959 painted pixels/model**, and all 17 starting plus all 52 rotated silhouette bounding boxes safely within the canvas. This is **69 framed images per viewport × 3 = 207 successful frame-bounds checks**. Captured full-page PNG screenshots, inspected 932×430; no representative image is fabricated. The browser harness inlines the exact authored JS into the review HTML due sandbox HTTP restrictions; still **not** WebGL2/Safari production verification.

**New independent, source-exact mesh/contract audit (actual pending source from :00 PR #106 and :12 PR #108):** all **68 quarter-turn trial meshes** (17 physical families × four trial orientations; the exported review catalog supports only **56** combinations because the four unrotated surface materials remain yaw-zero) passed `validateShape`, `rotateShape`, `canPlaceShape` isolation, within-cell position bounds, buffer-length and Uint16 index checks. Checked the **actual cross-product of the 68,560 triangle faces** against their emitted normals; **zero reversed-winding or degenerate faces**. Maximum per-piece mesh **2,464 triangles / 4,928 vertices** (statue); one of each archetype totals **17,140 triangles**. These are synthetic :12 candidate prototype costs, not iPhone FPS, memory, draw-call or live GPU measurements.

**QA decision:** no new Pack 3-only source/art defect was found; therefore no speculative modifications to candidate physical geometry, engines, registry, player saves, workflows or other packs. Previous reviewer framing and preview-save guard repairs remain intact. Draft PR and candidate acceptance remain review-ready, not incorporated. Recheck **exact PR HEAD CI** separately: a successful older workflow must not be represented as the latest head's result. All actual creator art/control approval and production registry/save/renderer/offline/iPhone gates remain OPEN; v0.11 stays LOCKED. This round is **acceptance verification, not gameplay integration**.


## Checkpoint 007 compatibility addendum — current authoritative acceptance

**Change origin:** checkpoint 007 merged only approved :00 and :12 opt-in automation contributions (and three other automation lanes) into main through PR #120; manual Packs 1–5 and the independent building PRs were explicitly excluded. The Pack 3 branch remains **two main commits behind**. Do **not** rebase, merge, register or auto-place in this isolated review. PR #106/#108 remain listed as open while approved portions of their code are now on `main`; use **actual merged main** for compatibility, not the old pending-source triangle metrics. Live registry still accepts **only IDs 0–8**; schema-1 edits and 255 unvisited sentinel remain unchanged.

**Updated Pack 3-owned manifest:** `PACK3_COORDINATION.auditedMain` now records `caf47776b723a36684edc1a72749e49268ccc688`, `integratedCheckpoint:'007'`, and all 17 row `duplicateAudit` statuses `new-vs-main-007`. Tests in `roofing.test.mjs` and `monumental-pieces.test.mjs` assert the new audit baseline. Exact-GitHub-blob local copies of these three edited files were checked after commit.

**Genuine native Node** v22.16.0, exact six committed nested suites: **64 passed, 0 failed** after checkpoint manifest update. The current exact committed Chromium `gallery-browser.py` also passed on **667×375**, **844×390**, **932×430**: 17 distinct models, 13 working four-turn-reset controls, seven directional signatures changing, **207 framed initial/rotated canvas images**, zero JS page errors. Three authentic full-page screenshots captured.

**Current merged-main interface compatibility**, source files `src/voxel-shape-interactions.mjs` blob `01be82e6c308e47a35fa6588cc6ed1ebeafca307` and `src/shape-prototypes.mjs` blob `868bbb9372b09e321f8db38b54c4ca52fabb7bc6`: **68/68** authored candidate × 4 quarter-turn shape/rotation/placement/prototype-mesh trials passed. The new greedy surface mesh emits only **9,250 triangles across all 68 trial orientations**, zero reversed-winding or degenerate triangles, all indices/bounds valid. An independent *six-normal exposed-area* reference algorithm compared all mesh face areas to the exact original AABB union for **68/68** rotations: maximum absolute discrepancy `4.66e-9`, no missing/extra exterior area detected. The 17 default orientations now contain **2,326 triangles in total**, **86.4% fewer** than the old 17,140 non-greedy output. The largest single piece is **238 triangles** (ID 121 arch window at turns 1/3), down from the old 2,464-triangle maximum (**90.3% fewer**). No Pack 3 geometry change caused the reduction; it is shared mesher work from checkpoint 007. These are **prototype triangle/vertex counts only**, NOT FPS/GPU measurements.

| Candidate ID | Family | Merged greedy prototype triangles (orientations 0–3) |
|---:|---|---|
|109|Honeywood shingles|118 / 118 / 118 / 118|
|110|Hearthclay roof tiles|98 / 98 / 98 / 98|
|111|Moonshale slate|92 / 92 / 92 / 92|
|112|Sunfield thatch|140 / 140 / 140 / 140|
|113|Pitched roof stair|88 / 88 / 88 / 88|
|114|Hip roof corner|72 / 72 / 72 / 72|
|115|Crown ridge|88 / 94 / 88 / 94|
|116|Fortress wall|190 / 188 / 190 / 188|
|117|Crenel battlement|142 / 136 / 134 / 136|
|118|Stone buttress|128 / 128 / 128 / 128|
|119|Ornamental column|174 / 170 / 174 / 170|
|120|Dentil cornice|194 / 178 / 184 / 178|
|121|Arched surround|230 / 238 / 230 / 238|
|122|Carved relief|180 / 180 / 180 / 180|
|123|Dry aqueduct channel|60 / 60 / 60 / 60|
|124|Crystal spire (nonemissive)|164 / 164 / 164 / 164|
|125|Static carved statue|168 / 164 / 168 / 164|

**Merged :00 staged orientation and body-fit compatibility**: tested **52/52** candidate IDs 113–125 × turns 0–3 through merged `src/voxel-orientation-sidecar.mjs` blob `69d7cabb7cb16fec19a69496f02bc358f424a447`, confirming safe round-trip, identity matching and ignoring stale edits; this does **not persist** anything into production schema-1 saves. Six independent `src/voxel-shape-fit.mjs` blob `ec5adc274d8b45c91d3dade81c3d9c2830380849` body fit/miss probes confirmed correct empty arrow-slit, crenel, arch, dry aqueduct and statue leg-gap volumes plus solid channel bank. All passed in a source-exact isolated JavaScript harness; they are **not** connected to current player physics.

**Still blocked before creator-approved integration:** full player-driven WebGL2, iPhone landscape two-thumb controls/art review, old schema-1 save migration, rotation sidecar persistence and stale-edit handling through a live player, live registration of candidate IDs, actual construction/collision, mass placement FPS, real offline reload, and any water/lighting/NPC behavior. Root CI's green status does not run the nested Pack 3 tests; exact-head CI and dedicated Node/Chromium evidence are distinct. No approval to merge, deploy, generate world placements, edit shared systems, unlock v0.11 or presume physical device certification.


## M6 final-gap audit — checkpoint 007, 2026-11-14

**Verified GitHub baseline:** integrated `main=caf47776b723a36684edc1a72749e49268ccc688`, checkpoint **007**, Issues #109/#117 unchanged; draft PR #112 was `24f3a965ab8eaad3e271046d6b9cae591012230b` before this documentation-only update. Branch remains separate and **two commits behind main**, not rebased/merged. Candidate ownership and IDs 109–125 are intact.

**Exact committed execution, repeated without altering source:** actual Node.js **v22.16.0** ran exactly the six committed nested Pack 3 suites (7 + 9 + 11 + 12 + 14 + 11): **64 PASS, 0 FAIL**. Extra local `monumental-data-smoke.test.mjs` is historical and NOT committed, so it is intentionally excluded from this count. Actual Chromium **144.0.7559.96** ran the committed `gallery-browser.py` with `PACK3_SCREENSHOT_DIR` at **667×375**, **844×390**, **932×430**; all three reported **17 unique pixel signatures**, **13 functioning four-turn rotation resets**, **7 directional image changes**, and **zero JavaScript exceptions**. Per viewport, 17 initial + 52 rotated silhouette-bound checks = 69; **207 successful frames** total. Screenshots inspected (including tall/cutaway structures); no new clipping detected. All 20 source/test Git blob SHAs matched the committed PR file tree.

**WebGL2 attempt and limitation:** Actual local headless Chromium was tried with three configurations including ANGLE/SwiftShader and sandbox overrides. In each case, `canvas.getContext('webgl2')` and `canvas.getContext('webgl')` returned `null`. Therefore **NO actual candidate WebGL2 visual certification** can be claimed in this session; the successful gallery evidence is authentic Canvas2D painting of the authored 3D AABB geometry, not the live WebGL2 renderer. No unverified renderer was committed.

**Checkpoint 007 production boundary, verified from current `main` blobs:**
- `src/voxel.mjs` `956348f721665d8d6aebb4c10b0dc130845552d5` still explicitly refuses IDs greater than **8**, serializes **schema:1** edits, and reserves cache sentinel **255**. Candidate blocks 109–125 are NOT accepted in production saves or the world.
- `src/shape-prototypes.mjs` `868bbb9372b09e321f8db38b54c4ca52fabb7bc6` contains checkpoint 007's **greedy** surface mesher; existing independent 68/68 compatibility tests and 2,326-triangle default-family budget remain current. These are prototype counts, not mobile FPS.
- `src/voxel-orientation-sidecar.mjs` `69d7cabb7cb16fec19a69496f02bc358f424a447` filters mismatched/stale IDs and reserves 255. `src/voxel-orientation-envelope.mjs` `a8587eb9c9d4e617161f79ea33975203587fc63f` uses a separate `mythwrought-orientation-v1` record without touching player schema 1. This is **staged infrastructure**, not deployed persistence of Pack 3 rotations.
- `src/voxel-shape-fit.mjs` `ec5adc274d8b45c91d3dade81c3d9c2830380849` is the opt-in body overlap contract; no direct player body collision or live world registration was tested.

**Actionable next gate, NOT automatically authorized:** creator visual review of all 17 candidates, then a separate explicit request for integration planning/engineering that reconciles Pack 1/2/4/5 plus :12 catalog ID allocations, a versioned rotated-block state path compatible with schema-1 player data, the real renderer's shape integration, physical iPhone two-thumb/visual QA, offline PWA and measurable mobile performance. This acceptance-only PR intentionally changes **no physical geometry, engine, registry, UI, shared CI, live saves, world generation, or deployment**, and v0.10 Gate A remains OPEN with v0.11 LOCKED.

