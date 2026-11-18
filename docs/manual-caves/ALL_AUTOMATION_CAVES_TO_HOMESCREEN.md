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

### This PR's readiness now

**Only source staging and a proposed isolated C1 collision fix have been performed. No new cave network is live.** Need exact CI for this PR, root/nested test confirmation, real cross-network collision checks, runtime wiring, opt-in world-safety, WebGL2, Pages and physical Home Screen acceptance. Refer to Issue #240 for live milestone checkboxes.
