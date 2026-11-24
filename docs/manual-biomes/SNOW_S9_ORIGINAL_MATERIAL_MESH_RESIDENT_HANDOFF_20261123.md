# MYTHWROUGHT Snow S9 — original material routes and mesh-resident RGB source
## Exact isolated source / original-world handoff — 2026-11-23

### Start refs, protected constraints and CI reuse

- FIRST exact protected source ref verified: `research/snow-s8-seed2026-mesh-seam-combined-isolated-20261123` at `58ee5530f91fa7d4e80ac7aec4b6833f7c578f49`. The full previous source handoff `docs/manual-biomes/SNOW_S8_ORIGINAL_SEAM_GEOMETRY_PERF_HANDOFF_20261123.md` was read before code authoring.
- Independent production original Desert Phase 3 `main` observed exact `db4bbcc32156e5df311f733bcaa53d559c17313b`; separate OPEN DRAFT Snow PR #358 exact `59e449be7e73b25f259c4c72855cfb638a056517`, not merged. Do not alter, rebase, reset, deploy or change those or other developers' branches/automations.
- Reuse original exact successful S7/S8 focused evidence without broad reruns: cached S7 source Node #45242164112 SUCCESS, original six-chunk real stepPlayer #45242553138 SUCCESS, original S7 cached WebGL2 seed179 #45243175770 SUCCESS, original real Snow/Desert/Mountain seam #45275821157 SUCCESS (4 exact source boundaries, 576 protected samples), real exact seed2026 S8 #45276407209 overall FAILURE (pigment-only geometry and edited ice matched but texture material41 could not visibly change glacier material0, and original mesh speed better than S7).
- New source native branch `research/snow-s9-original-material-and-mesh-resident-20261123` original tested implementation HEAD `82b80a540f08a5237e4a67af360bf39b5f6d4ef2`.
- New separate test/browser branch `research/snow-s9-exact-mesh-resident-webgl2-20261123` original browser implementation source HEAD `6805aad4cdfa2ed82b684732a527bbc3c3632b9c`. The exact browser Actions #45302372048 must be checked for its actual conclusion; its test has a non-regression research guard (<=15% for p50 and p95). No browser success may be inferred from the existence of source or workflow.
- The proposed `mythwrought-five-surface-regions-v8-snow-optin-research` generator stays **UNREGISTERED**. No existing M7 save, edit, cave, landmark/grove, original TREE, WOOD/LEAVES/STONE, player-placed ice, current shader/mesh, landscape, PWA, branch-protection or live gameplay change.

### Fundamental original source material-path census — SUCCESS

**Exact authentic GitHub Actions #45301925558, checkout source HEAD `82b80a540f08a5237e4a67af360bf39b5f6d4ef2`, COMPLETED SUCCESS**: strict Node22 source safety witness fixtures **6/6 PASS** plus genuine complete post-Desert original two-seed `FourRegionWorld + meshChunk` material-route integration **1/1 PASS**.

Native material census iterated real source-authored column plans, actual `world.get` top-face physical witness, original `v6BiomeAt`, and physically emitted original `meshChunk` triangle material tags. It did **not** infer material tags from biome names or artificial texture mockups. All original saved worlds were unchanged.

| Genuine visible M7 source at 32x32 sampling | Snow 272, **material tag41** | Glacier 276, **material tag0** | Rime 279 |
|---|---:|---:|---|
| Seed179 x[-160,-129],z[512,543] | 388 top faces | 614 top faces | None observed |
| Seed2026 x[-160,-129],z[480,511] | 265 top faces | 736 top faces | None observed |
| Combined | 653 snow source cells | 1350 glacier source cells | No native 279 witness yet |

Two physical top triangles per visible source block were authenticated for representative sites. Source-backed actual seed2026 snow material41 target: **(-154, 7, 480)** and neighboring (-153,7,480), (-152,7,480), (-151,7,480). Source-backed seed179 snow material41 target: (-158,8,512) and neighboring. Original glacier material0 source target remains seed2026 (-144,9,504), seed179 (-144,8,528). A physically safe original player view and actual screenshot still require separate genuine WebGL2 verification; **do not claim the code-only material census is a rendered browser camera**. There is no basis to claim a physically sampled 279 rime visual acceptance yet.

### Genuine optimization engineering: one mesh-resident column / block read path

New `src/manual-biomes/snowy-s9-mesh-resident-pigment.mjs` exact Git blob `2a93d327e6613083633f19d8f32799e9347b4f9b`: pure, no side effects, bounded to original source material cap IDs [272,276,279], physically admissible actual top Y, source-original `originalSurface(x,z)` plan and `blockAt(x,y,z)` mesh caches. It accepts only concrete source witness primitives: original source top/id, physical observed cap, support and overhead reads, original edits on cap/support, cave AIR overrides cap/support, and genuine `v6BiomeAt` snow weight. It evaluates climate and original deterministic S6 RGB **once per eligible visible original cap**; it never allocates a second 16×16 column cache nor rescans `_columnPlan` or calls real `world.get` inside the helper. Old M7 world/profile, original material UV/shape, cave/landmark, and saved edits retain precedence. Disallowed/unknown witness values must refuse tint; callback mutations cannot authorize a prior illegal cell.

Focused source tests `tests/snowy-s9-mesh-resident-pigment.test.mjs` exact blob `228df9d9e1246a27e5c216642f03a1ec61ca7358` verify all three IDs match S6 RGB exactly, cave/legacy WOOD/LEAVES/GRASS, unsupported cap, world edits, material, sky overlap, bad coordinates and non-snow climate fail closed.

Source integration is a **browser-only transformation** of pinned original `src/voxel.mjs` checked against exact string anchors; it substitutes a new per-voxel `snowS9Rgb` only into the original face **RGB** expression after a face survives the original cull, and keeps original `groundColor`, original light/tint logic, original UV, original shader material tag, vertex count and GPU buffer semantics. It reads the existing original `sourceWorld`, `originalSurface`, `blockAt`, and `hasEdit` closures; no production source is modified. This changes at most one witness evaluation per original visible snow/ice/rime voxel, unlike S7's repeated per-visible-face `_columnPlan`, `get`, cave reader checks. This is a source optimization rationale; actual measured p50/p95 and geometry parity are still required before performance acceptance.

### Real browser/time acceptance — exact separate gate

New `scripts/ci/snow-s9-original-mesh-resident-browser.mjs` Git blob `bf0ec26d2e21fe6bdc7202229e48df27ca22128c` and narrow branch-isolated `.github/workflows/snow-s9-original-webgl2.yml` blob `0fb4e8f44f8abb41dbe8697b0c93cc1b2f69c626`. This authentic post-Desert game test loads the independent original production checkout at exact SHA, compares untouched vs browser-only S9 source via Playwright WebGL2 956x440 in seed2026, checks:
- original source glacier ID276 (-144,9,504) camera, plus previously verified original **source** snow272 material41 (-154,7,480) camera selected through real `teleportCave` rather than an invented image;
- exact original real 10,536-vertex / 379,296-byte `meshChunk(-9,31)` material/UV/position hash against candidate, and player-placed ID276 original mesh 36/36 vertex parity;
- eight original and eight candidate synchronous `meshChunk` builds, concrete original versus candidate p50/p95, with explicit **15%** research no-regression budget. Exceeding it fails the browser acceptance without claiming FPS/iPhone results;
- original, candidate glacier and source-authenticated snow272 PNG screenshot SHA256, served original source SHA, zero page errors, 25 resident chunks and no pending original chunks; only browser-loaded modules are temporarily replaced, no source/write/caches installed into PWA.

Do not silently weaken threshold, ignore a failed step, invent snow272 visible pixel evidence without authentic screenshot, or infer this browser result from previous S7/S8 accepted subtests. If a run fails, preserve exact failure log and original images in new handoff; report only supported sub-gates.

### Remaining blocking release gates

The installed iPhone Home Screen PWA, its cache refresh and offline reopen, actual GPU native frame p50/p95 during snow walking and rapid mining, three moons/night sky, cave/legacy preservation after installing a future authorized candidate, mesh GPU and resident chunk memory, real fresh-world opt-in controls, and settlement/automation isolation are **UNRUN**. Even if Chromium source mesh p50/p95 passes, physical device and original whole-world release gates remain required. No merges or deployments are authorized. Historical hardpan/scree seam (IDs258/401) lacks eligible winter source caps; do NOT blanket tint or paint away protected border geology to simulate a snow fade. Actual snow/rime texture improvement is not proven by changing a snow shader while the target camera displays mostly glacier material0.
