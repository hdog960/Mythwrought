# MYTHWROUGHT — Pack 3 Milestone 6 independent acceptance handoff
**2026-11-14 · FINAL CANDIDATE ACCEPTANCE REFINEMENT: READY FOR CREATOR REVIEW ONLY. NEVER MERGED/DEPLOYED.**

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
