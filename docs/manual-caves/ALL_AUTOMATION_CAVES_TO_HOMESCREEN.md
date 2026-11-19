# Mythwrought — All Automation Caves to Home Screen (C0–C9)

**Canonical permanent checklist:** [Issue #240](https://github.com/hdog960/Mythwrought/issues/240)  
**Integration staging:** [Draft PR #243](https://github.com/hdog960/Mythwrought/pull/243)  
**Creator objective:** every distinct cave feature ever started or completed by the automation developers must reach playable, published iPhone Home Screen acceptance. Do not close the issue merely for source intake, CI success, merge, or a desktop screenshot.

## Current source-intake checkpoint (2026-11-17)

The dedicated integration branch `integration/caves-all-to-homescreen-20261117` was created from independently verified main `104e57ff678a0c58593d1e3c85c13c6c112da992`. Main advanced to `e9223217ef1e91d282900c3fc13a21eeda316b63` while this intake was being assembled; require a fresh baseline/diff before any future merge or production edit.

### Already incorporated vs still absent

| Source | Verified place in main | Remaining unique work |
|---|---|---|
| #27 grotto art | merged | Verify visible, not a false cave-traversal claim |
| #75 cave thresholds | source/test identical in main at C0 snapshot | No stale `src/voxel.mjs` replay; manual geometry cleanup #232 remains separate |
| #95 experimental route, #102 validation | modules present in main | prove actual physical entrance/path; route helper alone not gameplay |
| #110 north wing, #126 actual activation | modules/world integration present | verify source-exact public Pages, fixed seeds and return path |
| #130 south gallery, #140 live activation | present in main | verify eligible sites and physical visit |
| #147 east gallery | source/test absent from main | source-exact 2 files staged; three altered older shared files NOT overwritten |
| #156 three-chamber west gallery | earlier portion incorporated via checkpoint 009 and live world | compare source-exact cutoff, do not install duplicates |
| #156 four-band `deep-cave-network` | absent from main | source-exact source/test staged, not wired into runtime |
| #170 four deep-vault lateral galleries | absent from main | source-exact source/test staged; no proven x104/z84 floor junction |
| #173 :36 all-depth switchback and named chambers | absent from main | 21 files staged; genuine recent Y=-200 floor collision identified and isolated repair in progress |
| #228 :24 Windcut/Hollowbend upper networks | absent from main | 2 files staged; fake reservation fixture not cross-producer proof |
| #206 cave-specific adapters | absent from main | source-exact selected cave interfaces still pending intake; do not copy unrelated object/biome modules |

All source candidates remain separately preserved; the :24/:36 automations have been reassigned to BREAKABLE OBJECTS and **must not be re-tasked** for cave integration. Manual Cave Program exclusively owns this integration branch.

### Source authenticity

First integration commit `b8a286746d66d7635501fa041e00ee5bb131e058` imported exactly **27** prior blob objects without changing their contents:
- #173 exact HEAD `81e6526d5e1c4f2277bf087539dd28ac7e64eec6` — 21 files.
- #228 exact HEAD `cb027888557d9d931a42701f5a2b7692ce7b7f3f` — 2 files.
- #156 exact HEAD `0065213413746d1ddc8fd76daf74a807d0b58d1a` — 2 *new* deep-only files.
- #170 exact HEAD `2662e773b2b56f72e13e184496ec37f5dd0e33fb` — 2 files.

Second intake `a46b6b2f41408d73962f7c76f74225b1d750a853` added two exact original #147 east-gallery source/test blobs; the main's newer cave validators and experimental route were not overwritten.

**C1 live diagnosis:** Canonical #173 last `81e6526d` Actions #44224376800 failed **1119/1123** root Node tests, 4 seeds because its -202 Bedrock Whisper Gallery AIR carved through prior -200 labyrinth support at relative d=25,t=-8. On isolated integration branch commit `cafe4f7d`, moved new -202 gallery sideways into its own corridor/lobes, keeping BOTH cave regions; `372510d` moved its own geometry regression witnesses and retained per-seed saved-edit checks. These are **NOT YET VERIFIED** until exact-head CI and dedicated tests run. A new root `tests/cave-roadmap-nested.test.mjs` imports real nested :24/:36 tests which otherwise could be skipped in generic full mode.

## Mandatory milestones

- **C0 — Audit**: enumerate every cave feature/PR/source callback, exact commit and main/Pages parity; unreviewed features remain open.
- **C1 — Repair**: green exact-head root + all nested cave tests for each producer; never weaken failure tests to hide a geometry defect.
- **C2 — Source integration**: source-exact imports of all unique cave code/tests and read-only adapter contracts. No stale engine/renderer/shared-source overwrite.
- **C3 — Geometry**: prove source-exact AIR/support/headroom collision-safe composition and actual player traversal through each historical network; no false connectors. Accept separate discoverable cave entrances where networks are geographically independent.
- **C4 — Save-safe activation**: older schema-1 worlds and existing edited structures retain their exact seeded landscape. Add explicit opt-in/new cave-world profile or equally safe compatibility-gated entrance system; never silently punch legacy Y=-3 floor.
- **C5 — Real gameplay**: actual `VoxelWorld.get`, meshDepthSection, body collision and raycast, mining/editing, floor and climb, support and save/reload; no throwaway preview only.
- **C6 — Browser and performance**: genuine exterior→all depths→exit Chromium WebGL2 at 667x375, 844x390 and 932x430, current depth section GPU budgets, 25 surface chunks, two-thumb controls, offline/PWA, backup recovery, frame/memory evidence. Record file hashes and source head.
- **C7 — Publish**: creator-authorized verified merge(s), merged-main CI, Pages build success and public byte provenance. Each distinct destination visible and physically reachable in the published version.
- **C8 — Physical iPhone**: creator-installed Home Screen app smoke, manual mine/build, save/reload/force-quit/offline, creative controls if applicable. No desktop screenshot substitutes for actual device.
- **C9 — Closure**: every historical unique cave source is playable with receipt, or creator explicitly reviews a major blocker and authorizes a documented exception. Issue #240 remains open until then.

## Nonnegotiable safety

No automatic staging into main, deploy before verification, destructive saved-world migrations, reassignment of breakable-object automations, unilateral removal of cave features, unbreakable decorative cave junk, new numeric block IDs, mobs/loot/crafting, manual pack/builder PR edits or v0.11 unlock. Fix one real collision/source conflict at a time, compare with latest main and preserve old worlds and PWA stability.

### Current isolated draft acceptance — November 18, 2026

This historical intake audit remains unchanged above for provenance. **The 2026-11-17 readiness paragraph is superseded by this source-exact later checkpoint; do not mistake the preserved initial diagnosis for current implementation status.**

- **Last completely green accepted snapshot:** draft PR #243 HEAD `3d9d76f46bdf10e1ec3943c62dfa8a7d16fb5300`; eight exact-head GitHub Actions SUCCESS, including 12/12 CI contracts, **1,274/1,274 native tests**, full **20/20 WebGL2 scripts**, 10× depth, Pack3 and manual five-pack. Main remained `e9223217ef1e91d282900c3fc13a21eeda316b63`, not merged.
- **Authenticated physical movement at that snapshot:** the original deep spiral was walked down to ~Y=-208 and back with **29,416 production `stepPlayer` frames over 849 route positions / 1,696 legs**. Four historic vault levels (-30/-75/-130/-185) have source-safe connected voxels and verified body clearance. East/South retains the original PR #147 authored geometry with protected per-seed relocation where the old South tunnel would be sealed.
- **Real game:** original `index.html` and `src/main.mjs` have separate explicit CREATE/LOAD CAVE WORLD, 12 original-game Chromium WebGL2 screenshot witnesses (four distinct cave views × 3 mobile landscape resolutions), save/edit/reload, and unmodified default-world bytes; 21 distinct cave-source preview PNGs separately test seven authored scenes. These are **staging** rather than published Pages or physical iPhone images.
- **Offline:** real network-off Chromium game reloaded and restored a separate Cave World from a versioned source cache with 219 static assets, 217 Git blob SHA-1 checks, and verified previous-good fallback. This does not claim Safari Home Screen acceptance or consent to activate service workers in production.
- **Builder safety:** existing Pack1/4, Pack3, Pack5 and Pack2 saved seed sidecars refuse accidental cave-world adoption; ordinary-world vault/mirror and shaped construction writes are blocked while inside the separate cave profile. All regular worlds, unrelated builders and the five non-block automation lanes remain independent.
- **New development checkpoint after the green baseline:** draft PR now has a dedicated real-controller four-seed test for all four individual surface entrances, all four vault corridor branches, and original East/South round trips. At HEAD `1d46a5e1799804370a52d2fc1425dbddcfca5747`, the exact-head **focused cave-native workflow passed 72/72 tests**; full/depth checks for this newer head must be checked separately before calling it fully green.
- **Named switchback cave features still awaiting individual access witnesses:** even though authored geometry and whole-volume source tests pass, controller proofs for every **separate** eroded grotto, echo hall, Crescent Refuge, erosion vault, mineral branch, fault cathedral, rift terraces, labyrinths, basalt sanctuary, folded amphitheater and Bedrock Whisper chamber have not all been collected. Never silently count an entire network as proof for each named room. Record remaining work in GitHub issue #240.
- **Open-to-sky East Gallery is an authentic source design:** the original PR #147 constructs a 7×5 supported chamber and an AIR standing envelope without a roof. Its staged screenshot shows sky/terrain above the shallow room. No automatic stylistic rewrite should be made; seek creator visual acceptance or a separately gated opt-in cosmetic variation.
- **No approval to release:** C7 requires a creator-approved exact final HEAD, completed exact-head CI, source-match GitHub Pages deployment and reversible/byte-preserving rollback. C8 requires actual iPhone Home Screen portrait/landscape/two-thumb controls, mine/place, online/offline force-quit/reload and real Safari GPU/frame measurements. The dedicated procedure is `docs/manual-caves/C7_C8_IPHONE_RELEASE_ACCEPTANCE.md`. Keep Issue #240 open until actual on-device C9 acceptance.

