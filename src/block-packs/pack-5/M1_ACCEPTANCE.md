# MYTHWROUGHT — Pack 5 / Milestone 1 candidate acceptance dossier

**Decision: M1 remains OPEN. Three original physical candidate families, six variants. No playable integration, no final creator artwork approval, no true WebGL2 certification.**

## Reverification — 2026-11-14

- Main: `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`; latest incorporation checkpoint **006**.
- Read [manual coordination #109](https://github.com/hdog960/Mythwrought/issues/109), [biome130 #117](https://github.com/hdog960/Mythwrought/issues/117); rechecked independent Pack 1–4 manifests/PRs #113, #114, #112, #115 and automated catalog PR #118.
- This candidate stays on Pack 5 draft [PR #119](https://github.com/hdog960/Mythwrought/pull/119). Only `src/block-packs/pack-5/` and `tests/block-packs/pack-5/` may change.
- Live block IDs **0–8** unchanged; 209–254 unassigned, 255 internal sentinel, biome130 256–385 *future-only*; `pack5:079`–`pack5:096` are symbolic roster identifiers, **not persistent numeric block IDs**.
- v0.10 Gate A **OPEN**, v0.11 **LOCKED**. No merge, deploy, changes to shared engine/worldgen/save/UI/CI/controller/minimap or automation.

## All six authored physical material variants

| Symbolic | Family | Variants | Attachment / physical behavior |
| --- | --- | --- | --- |
| `pack5:079` | Plaster & Stucco | chalk-lime; hand-troweled | thin physically selectable wall-facing cladding, partial collision, requires wall backing |
| `pack5:080` | Fired Brick Masonry | hearth-running-bond; kiln-soldier-course | solid manufactured masonry with raised physical courses on **all four lateral faces** |
| `pack5:081` | Ceramic Interior Floor Tiles | sunburst-encaustic; moonwoven-glaze | shallow embossed patterned flooring, floor support and headroom-preserving collider |

Not aliases of Pack 1 stone brick, Pack 2 outdoor paving, Pack 3 clay roofing, Pack 4 fireplaces/chimneys or biome130 desert adobe / underground calcite mosaics. Variants change authored geometry, not only colors. No NPC, building or world placement work.

## Visual defect found and repaired this session

Prior six real Chromium Canvas2D captures correctly exposed a **brick-shape defect**: back and side faces of both manufactured-brick variants were almost undecorated and resembled a featureless brown cube when rotated.

1. `architectural-surfaces.mjs` now models independent mortared running-bond and soldier-course brick relief on back (-Z), left (-X) and right (+X), in addition to the existing front (+Z). Keeps the true solid collision cell; no fake full-cube decoration aliases.
2. The old Canvas fallback sorted overlapping cuboid polygons incorrectly and could portray the repaired solid brick as a **hollow open-topped object**. Replaced it with a minimal source-mesh-derived Canvas2D CPU depth buffer. The new screenshots show solid tops and properly occluded brickwork on both visible sides.
3. Added a 44th native Node regression requiring independently visible brick courses after every quarter-turn for both variants, and adjusted the preview mesh caps within the existing 64-box / 1536-vertex source limits.
4. The preview screenshot runner now rejects blank images and nonunique six-panel pixel fingerprints, and confirms rotation produces a changed visual hash set.

**True asset costs (original, uncullled source-box preview triangles; not integrated mesh or GPU timings):**

| Variant | Physical boxes | Source triangles | Source vertices |
| --- | ---: | ---: | ---: |
| 079 chalk-lime | 8 | 96 | 192 |
| 079 hand-troweled | 12 | 144 | 288 |
| 080 hearth-running-bond | 42 | 504 | 1008 |
| 080 kiln-soldier-course | 53 | 636 | 1272 |
| 081 sunburst-encaustic | 17 | 204 | 408 |
| 081 moonwoven-glaze | 15 | 180 | 360 |

All under the isolated 64-box / 768-triangle / 1536-vertex preview contract. They are not optimized production draw calls or measured iPhone GPU performance.

## Reproducible verification

- **Genuine native Node 22.16.0, 44/44 PASS:** `node --test tests/block-packs/pack-5/*.test.mjs`. This includes 16 foundational fixture cases, 19 architectural-surface cases and 9 additional acceptance cases. Tests cover geometry uniqueness, source materials, all 24 six-variant/four-rotation meshes, outward triangle winding, exact AABB bounds, wall attachment directions, floor clearance, solid brick occupancy, ray selection/removal, deterministic variant snapshots, and atomic rollback.
- Exact committed Git blob parity verified after local Node execution:
  - `architectural-surfaces.mjs`: `e22b14a54bf565e46afb64c0dff3a0d252228905`
  - `fixture.mjs`: `1956e096ba9b3c13ab20aac596c87c493eda1d52`
  - `architectural-surfaces.test.mjs`: `6d80c006cbd51cbb67666e397dfd463ae67056a7`
  - `acceptance-m1.test.mjs`: `7f2dac420b903501cf3dcacb4f3aa67f66fe59ff`
  - `fixture.test.mjs`: `4a463281212fa2ce04e8afe1727f227a512cb6a0`
  - `canvas-gallery.mjs`: `19d11ff18242a186c5c5ba81ed77780baa1271ac`
  - `capture-canvas.py`: `57783e33ef79d6f1171253bc152df62916d7f971`
- **Genuine Chromium 144, Canvas2D (NOT WebGL2):** generated and inspected six revised images at viewport **667×375, 844×390, 932×430**, each for rotations 0 and 1, using the exact authored source in an offline about:blank document. All six panel pixel fingerprints differed in every capture; 0 and 1 rotation hash sets differed at every viewport. All screenshots were nonblank; no candidate was clipped in inspected contact sheet. Source: `tests/block-packs/pack-5/capture-canvas.py`. PNGs and contact sheet available separately for creator review; not committed to GitHub.
- **Earlier WebGL2 attempt (superseded by subsequent software-OpenGL WebGL2 confirmation):** local Chromium context creation returned null with regular and multiple software-GPU configurations. Local served-page navigation previously returned `net::ERR_BLOCKED_BY_ADMINISTRATOR`. Neither actual WebGL2 renderer output nor deployed-game screenshots nor mobile GPU timing were obtained.
- **GitHub Actions:** default root workflow does not discover nested `tests/block-packs/pack-5/*.test.mjs`. Its outcome does not certify these native Pack 5 regressions; check the *latest exact-head CI* separately before later handoff.
- **Not performed:** real physical iPhone checks, creator art approval, production schema-1 candidate restore, production lighting/physics/selection, and creator-authorized incorporation.

## Outstanding decisions / next development session

1. Keep 079–081 status **CANDIDATE**, not `INTEGRATED` or `TESTED CANDIDATE` certification.
2. Execute the real served six-variant WebGL2 preview at all three required viewports and inspect output; run dedicated native Node suites against latest PR head. Reassess if environment access becomes available.
3. Creator visual review has not occurred. Do not infer approval from authored geometry or Canvas2D fallback images.
4. Production shape-aware collision/raycast, support, registered numeric IDs, variant persistence and backward-safe schema-1 save compatibility are centralized :00/:12 and manual-incorporation concerns; document dependencies, never edit shared modules from Pack 5.
5. **Milestone 2 residential furnishings is NOT STARTED** pending adequate Milestone 1 acceptance. Keep existing independent manual packs, biome130 lane, automations, game version and Pages deployment unchanged.

## Later central incorporation 007 coordination recheck (same day)
- Newest merged `main` is `caf47776b723a36684edc1a72749e49268ccc688` and the newest checkpoint is **007**. The original Pack 5 branch was created from `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84` / checkpoint 006; do not mistake that historical base for current main.
- Creator-authorized incorporation [PR #120](https://github.com/hdog960/Mythwrought/pull/120) explicitly **excluded** manual Pack 1–5 projects, their draft PRs and all building-pool projects. No Pack 5 paths were merged; 0–8 are still the only runtime block IDs.
- Checkpoint 007 integrated generic opt-in :00 shape interactions, :12 shape prototypes and 12 biome130 desert candidate source assets **without** live block IDs or generated placements. These do **not** constitute Pack 5's production registry, shape/collision/save integration, or creator artwork approval.
- Comparison of new main to Pack 5 PR shows two newer central commits, 28 Pack 5-only branch commits and **no overlapping changed paths**. Keep Pack 5 draft unmerged and avoid an unnecessary branch rewrite.
- Future creator-authorized incorporation must compare Pack 5 against 007 or newer and re-run full native/Chromium/production save verification on the final integration head.

## Latest genuine WebGL2 acceptance follow-up — 2026-11-14

**Technical candidate validation improved; M1 FINAL creator/served-gallery acceptance remains OPEN.** Earlier headless attempts yielded no WebGL2 context, but genuine Chromium WebGL2 is now reproducible with a virtual X display and software OpenGL. This supersedes the earlier statement that no WebGL2 screenshots were available.

- Using native Chromium under Xvfb with `LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11` and `--use-gl=angle --use-angle=gl`, the real WebGL2 context identified itself as `WebGL 2.0 (OpenGL ES 3.0 Chromium)`. No WebGL errors on actual draw/readback.
- Six Pack 5-owned WebGL2 screenshot captures passed: **667×375, 844×390 and 932×430**, with rotations **0 and 1** at every size. Six authored physical candidate variants were visibly rendered in each screenshot. Per-panel WebGL readback produced six distinct non-background fingerprints at each size/rotation, and rotation visibly changed the asymmetric candidate geometry. All six screenshots were inspected; no clipping after repair.
- A genuine visual problem was discovered in the original WebGL2 gallery: fixed 900×600 square render panels plus an oversized camera made multiple candidates run off the bottom of iPhone landscape screenshots, with wall faces appearing edge-on. Corrected **only** `tests/block-packs/pack-5/architectural-gallery.html` and `architectural-gallery.mjs` with a responsive, in-viewport 3×2 layout, front-readable camera, shape-preserving aspect fit, source-mesh rotation, and explicit failure status.
- Exact authored mesh source `architectural-surfaces.mjs` and fixture remain unchanged by this WebGL2 visual repair. All 44 native Node candidate tests continued to PASS.
- Reproduce genuine Chromium WebGL2 via: `LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python tests/block-packs/pack-5/gallery-webgl-browser.py <output-directory>`. Test harness reads exact local Pack 5 source modules, assembles their import/export boundaries into an **offline about:blank page**, draws with real WebGL2, verifies per-panel pixel hashes and screenshot dimensions, and saves six PNGs. This is authentic **WebGL2 rendering**, but **not a source-served module-loader test**: local HTTP navigation still returns `ERR_BLOCKED_BY_ADMINISTRATOR`.
- The renderer uses software OpenGL in a virtual display; these results **do not measure physical iPhone GPU/thermal performance** and do not constitute gameplay, production schema-1 saves, persistent numeric-ID registration, creator visual approval, or deployment.
- All M1 families `pack5:079`, `pack5:080`, `pack5:081` remain **CANDIDATE**; other 15 are **NOT STARTED**, 0 **INTEGRATED**. M2 residential furnishings are not started because source-served/gallery verification and explicit creator artwork approval remain outstanding.

**Current main compatibility:** `caf47776b723a36684edc1a72749e49268ccc688`, checkpoint **007**. That automation-only incorporation excludes Pack 5. All new changes stay under exclusive Pack 5 source/test paths, with no merge, ID assignment, shared-engine mutation, or deployment.

## Latest recheck after checkpoint 008 — technical candidate review only

- Newest main `ac263720b60641c65b02330348dd76d0ef9cb75e`; checkpoint **008** only activated existing automation-owned physical voxel trees, caves and stone court. Ledger explicitly excludes manual Packs 1–5, including this PR.
- Genuine native Node: original M0/M1 **44/44 PASS**; full Pack 5 including new M2 tests **66/66 PASS** against exact source/test Git blobs.
- New `tests/block-packs/pack-5/esm-webgl-browser.py m1 <out>` verified **native ES module import/export graph execution**, real Chromium WebGL2 GPU rendering, pixel readback and six unique source-authored panels at all 3 landscape viewports × two rotations. It uses absolute `data:` URLs to replace *only relative import specifiers*; local HTTP-served navigation remains blocked (`ERR_BLOCKED_BY_ADMINISTRATOR`), so HTTP/served loader is still **not tested**.
- All six source-derived M1 visual screenshots reviewed; no new candidate geometry defect detected. No physical-iPhone measurements or creator artwork approval.
- M1 **creator final acceptance remains OPEN**. Creator's conditional direction allowed M2 **separate source-only candidate development**, not integration, approval of M1, or v0.11 unlock.

## Final M1 status when M2 candidate work reached 68 native tests
- M1 original **44/44** isolated native Node tests remain passing; current combined M0/M1/M2 Pack 5 suite **68/68** passes (24 independent M2 cases). Native ES module WebGL2 tests for M1 and M2 passed; HTTP-served gallery and creator art/live gameplay acceptance remain separate and open.
