# MYTHWROUGHT — Pack 3 Milestone 6 independent acceptance handoff
**2026-11-14 · CANDIDATE ACCEPTED FOR CREATOR REVIEW ONLY. NEVER MERGED/DEPLOYED.**

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
| New direct Pack 3 `acceptance.test.mjs` (9 cases) | **9 PASS**, so **62/62 total** with `node --test tests/block-packs/pack-3/{roofing,roof-geometry,fortified-pieces,ornamental-pieces,monumental-pieces,acceptance}.test.mjs` | Root `npm test` does NOT auto-include the nested path |
| Latest unmerged :00 `validateShape/rotateShape/canPlaceShape` and :12 `prototypeSurfaceMesh` source contracts | **68/68 asset × four-turn descriptors** valid/bounded, no Uint16 overflow. Only 56 ID/turn combinations are offered by the adapter: 4 roofs locked at 0 + 13 shaped families ×4 | These are *pending engine APIs*, not a proven production integration |
| Original isolated target/collision regression fixtures | Tested sparse occupancy (arrow slit, crenel, arch, aqueduct, statue legs), positive/negative hit rays, candidate place/remove/rotate/restore, unsupported IDs and duplicate edits | Does not exercise actual player body collision or production selection |
| Genuine Chromium 144 (Playwright) opt-in gallery | 667×375, 844×390 and 932×430 CSS px; **17 actual model cards, 13 functioning rotation buttons**, zero JS page exceptions; screenshots visually inspected | Environment blocks direct file/HTTP navigation. Original module source and gallery script were inlined. NOT production WebGL2, FPS, Safari, offline or hardware iPhone |

Actual source/test files were reconstructed in the independent test container and compared by `git hash-object` against the corresponding PR branch file blobs before the Node run. The latest acceptance suite's own module/test files are likewise source-identical.

**Prototype triangle budget (one piece each, surface-only mesh):** 17,140 triangles total across the 17 archetypes; maximum **2,464 triangles / 4,928 vertices** on the guardian statue at any of its four rotations. No out-of-cell vertices, 32-box-limit violations, or unsigned 16-bit index overflow seen. These are synthetic prototype counts, **not measured production mobile GPU utilization**. Do not mass-place pieces without benchmark and performance acceptance.

## Production engine boundaries; NOT authorized changes
- Current `src/voxel.mjs` on main defines **BLOCK IDs 0–8 only**. `VoxelWorld.set` and `VoxelWorld.restore` reject candidate IDs 109–125. Current chunk cache uses 255 as the unvisited sentinel. Nothing in this PR changes it.
- The live `schema:1` save record only persists `[x,y,z,id]`; it has no per-cell yaw or candidate wider-ID registry. New candidate fixtures save to explicitly separate preview-only formats. **Exception:** the initial roof-material fixture intentionally mimics a schema-1-shaped record containing IDs 109–112 for test purposes; production restore rejects these IDs. NEVER pass a candidate fixture snapshot into player saves.
- Integration will require centrally approved safe ID mapping, compatible rendering/mesh generation, shape-aware raycast and collision, body/placement checks, backward-safe orientation save codec, old save-reload regressions, offline PWA verification, and actual physical iPhone two-thumb/visual/performance approval.
- Aqueduct **has no water** (flow/levels unsupported), spire **emits no game light**, statue **is not an NPC**; no generated villages/towns/cities/monuments are present. Static shape data must never be marketed as these gameplay systems.

## Decision & explicit future sequence
1. Milestones 0–5: **17/17 independent candidate families authored; isolated candidate regression acceptance verified.**
2. Milestone 6: **TECHNICAL CANDIDATE REVIEW READY**. Not a certification of game integration or the creator's art/control approval.
3. Creator must explicitly approve visual designs/controls and separately order incorporation. Gate A stays open and v0.11 stays locked. Do not merge PR #112, deploy GitHub Pages, register IDs, migrate saves, or place assets in generated terrain under this review.
4. Integration owner should first reconcile the pending unmerged :00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106) and :12 [PR #108](https://github.com/hdog960/Mythwrought/pull/108) contracts with all four manual packs and automated :12 catalog. Then implement and validate any migration/registration in a separate, authorized review.
