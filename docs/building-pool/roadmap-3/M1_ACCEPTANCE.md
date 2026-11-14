# Mythwrought Building Roadmap 3 — Milestone 1 technical acceptance candidate

**Status:** 30 / 30 M1 representative theoretical buildings authored in isolated source. **REVIEW CANDIDATE, NOT APPROVED, NOT MERGED, NOT DEPLOYED.** The full 705-building roadmap is **30 / 705** authored; these thirty are one variation per type × biome × size for blacksmiths and watchtowers, not the full M2/M4 quotas.

## Repository coordination

- Ownership: `src/building-pool/roadmap-3/`, `tests/building-pool/roadmap-3/`, `docs/building-pool/roadmap-3/` only.
- Baseline: initial branch `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`; latest separately incorporated main during M1 review `caf47776b723a36684edc1a72749e49268ccc688`, checkpoint **007**. The only intervening main changes since `b62728e` are checkpoint/release documentation.
- Cross-lane: Issues [#109](https://github.com/hdog960/Mythwrought/issues/109) and [#117](https://github.com/hdog960/Mythwrought/issues/117), manual pack PRs #112–#115/#119, biome130 PR #118, automated #120 and building PRs #121/#123/#124 checked. No owned-path overlap.
- [M0 exact-head GitHub Actions #43643210989](https://github.com/hdog960/Mythwrought/actions/runs/43643210989) **SUCCESS**; its configured root tests/browser smoke do *not* separately execute the nested Roadmap 3 suite.

## Concurrent-main compatibility checkpoint (latest session)

During this review, a separately authorized world activation PR [#126](https://github.com/hdog960/Mythwrought/pull/126) merged and advanced `main` to `f416a2b26c4c00b5944f3bd37e9360030a247cc9`. Its changed paths are `.github/workflows/ci.yml`, `src/live-voxel-world.mjs`, `src/voxel.mjs`, `tests/live-world-browser.mjs`, and `tests/live-world-incorporation.test.mjs`. **No Roadmap 3 paths overlap**, and PR #122 remains draft/mergeable. Its expanded CI browser smoke is baseline live-world verification and does **not** execute the nested Roadmap 3 tests or render unintegrated M1 candidates. No M1 building may be activated based on this separate merge.

## Authored design pool

The generator in `src/building-pool/roadmap-3/m1.mjs` exports `createM1Blueprint(type,biome,size)` and `createM1Pool()`, producing 30 complete theoretical serialized structures with **70,921 total integral voxel-coordinate slots**. They contain authored foundation, floor, wall, roof, optional stair, battlement, fixture and buttress modules. Every occupied coordinate references a named already-existing built-in physical block or an exact symbolic planned family; no engine IDs are assigned. The engine does not yet activate or physically render these buildings.

| Biome | Blacksmith architectural direction | Watchtower architectural direction |
| --- | --- | --- |
| Temperate | gabled stone/timber workshop with exterior beam details | corner buttresses and open crenellated observation deck |
| Desert | low shaded roof, broad wind-screen supports, interior cross-divider | reinforced wind-facing buttresses and roof terrace shade |
| Snow | high snow-shedding roof, insulated walls, sheltered approach | reinforced enclosure, raised steep upper cover |
| Enchanted Forest | off-center canopy roofline and livingwood ribs | livingwood support bays and magic-timber upperwork |
| Mountain | stepped stone roof and cliff-facing masonry supports | cliff-anchor reinforcement with high stone observation terrace |

Each biome has **one unique small, medium and large blacksmith** and **one unique small, medium and large watchtower**; all thirty produce distinct geometry fingerprints even after excluding material, labels and empty envelope padding. Watchtowers include 10/12/14 authored two-wide stair tread sequences for small/medium/large. Blacksmiths provide forge-mouth, anvil, storage, chimney ventilation and fuel-separation location data. These are **static assembly/fixture positions**, not operational equipment.

## Verification evidence

- **Native Node 22.16.0:** `node --test tests/building-pool/roadmap-3/*.test.mjs` — **33/33 PASS** locally on source matching the committed GitHub file blob hashes for the six M0 files and exact M1 source/test/manifest modules; includes three additional manifest/JSON-roundtrip cases. No surrogate browser or V8-shim tests counted.
- Independent voxel-grid flood traversal: checks two-wide unobstructed, floor-supported paths from entrance to blacksmith work/storage nodes and through stair steps to watchtower observation deck on all 30 structural proposals. This is theoretical cell-occupancy QA, **not production player collision verification**.
- Reversible serialization / uniqueness: stable canonical generator output; 30 distinct design identities and geometry fingerprints; duplicate occupancy, unknown family references, malformed clearances, invalid type/size and missing routes rejected by tests.
- Authored snapshot is reproducible from `createM1Pool()` and was independently materialized as local `M1_SNAPSHOT.json` (30 enumerated layouts, previously 1,846,816 bytes; regenerate after M1 roof/support revision). Snapshot is a local transfer/verification artifact, **not committed** to keep the draft PR source-driven and lightweight.
- **Genuine Chromium/WebGL2 candidate screenshots:** **NOT CAPTURED.** Local Chromium on a trivial navigation returned `net::ERR_BLOCKED_BY_ADMINISTRATOR`; no browser simulation or rendered image is treated as acceptance evidence. New PR-head GitHub CI remains a separate gate.
- **Physical iPhone/creator art signoff:** NOT RUN / NOT APPROVED.

## Known dependencies and restrictions

Manual/future block shapes are currently **symbolic voxel positions**, not certified finished shapes. Candidate material dimensions and orientation metadata remain unresolved; real full engine collision, raycast, support, stairs, roof and selection must be retested *after* centralized block incorporation. The two-cell corridor policy is a design constraint, not a verified physical player-body dimension. No industrial machinery, smoke, fires, lights, AI guards, crafting, functioning mills, harvesting or combat was implemented. No changes to seeded world, persistent IDs, save schema 1, runtime performance, PWA, UI, thumb rails, other roadmaps, or integration checkpoint.

**Next:** Verify exact latest PR #122 head CI; pursue authentic WebGL2 visualization at 667×375, 844×390 and 932×430 where an approved browser environment works, resolve M1-only architectural defects, then proceed to the remaining blacksmith variations and the M2 armorer/carpenter designs only after the review gates are addressed. Gate A remains open and v0.11 locked.

## Physical roof and fortification corrections (subsequent M1 review)

A dedicated structural audit found that original blacksmith roof profiles contained **up to 5 overlapping roof layers**, creating implausibly thick solid masses, and that some upper fortification decorative roofs, stair treads and canopies were unsupported. The corrected 30 source blueprints now have:

- Blacksmiths: **one-voxel-thick roof shells**, closed masonry gable ends where required, below-roof rafters, and a roof flue opening vertically aligned with the forge. The physical hollowness and ventilation of future symbolic `pack4:063` chimney pieces is **NOT certified**.
- Watchtowers: piers under every 2-wide ascending stair tread, upper posts beneath desert/snow/enchanted/mountain roof details, uninterrupted player-sized theoretical approach and observation routes.
- Updated 30-design manifest: **70,921 actual structural cell-coordinate records** (down from 76,376). Still **30 designs**, with unchanged IDs, no production block IDs or gameplay activation.
- New isolated source-backed exposed-face 3D diagnostic mesh; **all 30** have valid exterior and cutaway triangles, finite bounds, hidden-face rejection and less than 25,000 diagnostic triangles per view. These render **cube envelopes of symbolic future block families**, not their finished meshes. No real-asset dimension assumptions.
- Added `tests/building-pool/roadmap-3/preview.html`, `preview.mjs`, `preview-mesh.mjs`, `preview-mesh.test.mjs` and explicit `preview-browser.mjs`. The runner is written to capture **180 authentic** WebGL2 image files (30 distinct buildings × exterior/cutaway × landscape 667×375, 844×390, 932×430), but it has **not executed** in this environment.
- Local native Node 22.16.0 on Git blob-exact candidate source: **33/33 PASS**. Native Node and full-bundle source verification are separate from queued generic GitHub CI.

A standard local Python Playwright Chromium navigation to even `data:text/html` failed with `net::ERR_BLOCKED_BY_ADMINISTRATOR`; screenshot images were **not** fabricated. Internal Python/Pillow orthographic coordinate projections were inspected for a medium snow blacksmith and desert watchtower as **nonbrowser geometric diagnostics only**. Their silhouettes remain structural placeholders rather than approved premium game art. A real Chromium/WebGL2 render and future candidate-shape collision tests remain blockers before creator approval.

Current main later advanced through checkpoint **008**, which concerns automation-world visibility; it did not incorporate Roadmap 3. Never merge, deploy, activate or register these designs without separate creator instruction.

## M1 genuine browser acceptance and face-winding audit (follow-up)

During source-exact diagnostic mesh review, all six preview cube-face templates were discovered to be **inward-wound**, previously concealed by disabled back-face culling. Only the **Roadmap 3 isolated diagnostic preview** was corrected: two vertex indices are exchanged in each generated triangle and the WebGL2 diagnostic page now enables CCW front faces with back-face culling. **No production game engine mesher or manual block pack was modified.**

- New exact-source native Node tests in `tests/building-pool/roadmap-3/preview-winding.test.mjs`: verify **outward normals and genuinely empty neighbor voxels** for all 30 exterior meshes; validate nondegenerate cutaway normals for all 30.
- **Native Node 22.16.0: 33/33 PASS**, zero skips, after correction, with all owned source files committed. Dedicated nested suites do not run from default `npm test` in current project CI.
- Isolated optional `preview-browser.mjs` checks **all 30 × exterior/cutaway × 3 landscape viewports = 180 expected authentic PNGs**. It now refuses success on page exceptions, missing WebGL2 context, wrong building identity, wrong view mode, GPU errors, or an essentially blank read-back framebuffer. Source-only; not executed successfully.
- Actual local Python Playwright Chromium attempt on a trivial `data:text/html` page failed with **`net::ERR_BLOCKED_BY_ADMINISTRATOR`** again. **0 authentic candidate Chromium/WebGL2 screenshots generated or reviewed.** Winding and projected geometry diagnostics are not substitutes for visual acceptance.
- Earlier generic GitHub CI run [#43648465110](https://github.com/hdog960/Mythwrought/actions/runs/43648465110) remained **queued** at the last status check. New exact-head [#43649109500](https://github.com/hdog960/Mythwrought/actions/runs/43649109500) was also **queued**; do not mark CI or M1 browser gate passed without examining final result and actual images.

**M1 remains technically authored but not visually accepted.** Preserve all 30 source blueprints, their 70,921 coordinate cells and source-owned test evidence. No merge, deployment, engine wiring, block-ID registration, world placement or Gate A/v0.11 change.

## Latest M1 integrity audit — disconnected roof and chimney repairs (2026-11-14)

**Authoritative current source-based count: 30/705 designs, 71,293 physical coordinate slots.** The earlier 70,921 count was a valid historical pre-repair figure; 372 genuinely authored support cells were added (12 chimney corbels + 360 roof-joining risers). Existing 30 IDs, exterior volumes, navigation and 705-slot allocation are unchanged. No future symbolic asset is claimed integrated, and no engine/system/world placement is authorized.

The previous 33/33 tests missed 6-neighbor structural continuity. An independent exact-grid audit exposed **12 floating three-cell chimney assemblies** (desert, snow, enchanted forest and mountain blacksmiths, all sizes) and **3 snow watchtowers with multiple isolated overhead roof tiers**. The repaired designs use one lateral chimney bearing corbel while keeping the forge shaft coordinate empty; snow-tower stepped upper roofs use sparse bearing risers rather than solid roof infill. Corrected snow towers are each one face-connected assembly, as are all 30 structures. Their unintegrated symbolic roof and chimney physical profile/ventilation remains uncertified.

- **36/36 native Node 22.16.0 tests PASSED, zero skips**, on local files matching committed Git blob SHAs. Three new strict connectivity tests independently flood all structural cells; removing the corbels or snow roof risers triggers failures and reproduces the disconnected masses. Tests still cover two-wide walking circulation, roof shell profiles, flue coordinates, M1 manifest serialization, uniqueness and diagnostic mesh bounds/winding.
- Latest isolated manifest `M1_MANIFEST.json` totals **71,293** occupied coordinate slots and preserves all 30 design IDs; no persistent IDs were assigned.
- **Genuine browser attempt:** A local HTTP server served the actual `tests/building-pool/roadmap-3/preview.html`. Chromium/Playwright attempted **667×375, 844×390, 932×430** individually and received `Page.goto: net::ERR_BLOCKED_BY_ADMINISTRATOR` at every size. **Zero genuine WebGL2 screenshots** captured or inspected. No screenshot exists to certify visual M1 acceptance. Previously inspected static coordinate projections are explicitly nonbrowser diagnostics.
- GitHub workflow run #43649194504 at the preceding PR head was still **queued** when checked. The newest M1 commit requires separate exact-head Actions verification. Existing root CI does not execute the nested 36-case Roadmap 3 suite. Never treat generic green Node/Chromium baseline CI as candidate M1 acceptance.

**Next M1 gates:** genuine source-loaded WebGL2 exterior/cutaway gallery evidence for all 30 designs at three sizes, inspection and Roadmap 3-only visual repairs as warranted, and future engine-shape collision/selection/integration checks only in an authorized centralized integration. Continue M1 review; v0.10 Gate A remains OPEN, v0.11 LOCKED.

## M1 three-viewport source-geometry browser audit and camera repair — 2026-11-14

**Source baseline:** `main` `ac263720b60641c65b02330348dd76d0ef9cb75e`, integration checkpoint **008**. Creator coordination Issues #109/#117, independent Block Packs 1–5 manifests and biome130 branch, and building PRs #121/#123/#124 were rechecked. All source changes remain inside Roadmap 3 exclusive directories. **Design count remains 30/705 and physical-coordinate slots remain 71,293.**

**Two different rendering evidence levels are explicitly distinguished:**

1. **Genuine Chromium Canvas2D diagnostics — 180 screenshots CAPTURED locally:** 30 exact authored candidate shapes × exterior and cutaway × **667×375, 844×390, 932×430**. They were rendered by real Chromium 144 Canvas2D using voxel geometry generated by the current byte-verified Roadmap 3 source. All 180 had nonempty painted faces (observed **498–3,700 visible quads** per view); local manifest `r3_chromium_canvas2d_qa_manifest.json` and ZIP archive `roadmap3_M1_Chromium_Canvas2D_QA_180.zip` are supplied as chat artifacts, not committed to the game. All five biomes, both building types, three sizes, and both views were reviewed in contact sheets. These **are NOT WebGL2**, not future physical-family meshes, not in-game screenshots and **do not satisfy creator visual acceptance**. Architecturally distinct roofs/regions are visible, but silhouettes remain basic cube envelopes rather than finished regional art.
2. **Genuine source-served WebGL2 preview — BLOCKED:** Chromium `page.goto` rejects the localhost gallery even for unrelated `data:` and `file:` navigations with `ERR_BLOCKED_BY_ADMINISTRATOR`. Under the permitted in-memory Canvas2D page, WebGL2 context creation also returned false, including software-GL attempts. **0 actual WebGL2 candidate screenshots**. No device/browser approval or GPU-performance claims.

**Meaningful QA defect fixed:** The existing orthographic WebGL2 gallery camera framed the *whole* theoretical envelope, leaving excessive empty space around many smaller structures and cutaways. Roadmap 3-only `preview-camera.mjs` computes min/max of **the actual exposed diagnostic mesh vertices**, uses the same south-east elevated view and dynamically fits the orthographic scale to the live canvas aspect ratio. `preview.mjs` now imports this helper rather than using its former hard-coded static span.

**Verification:** New `preview-camera.test.mjs` adds three genuine native Node tests. Every actual mesh vertex is checked in camera clip coordinates over **180 type/biome/size/view/landscape combinations**; all fit inside the canvas with antialiasing margins, and the projected geometry occupies meaningful screen area. Cutaway views are reframed without inventing voxel shapes. The tests reject invalid viewport sizes and corrupt/empty mesh data. Complete dedicated command `node --test tests/building-pool/roadmap-3/*.test.mjs` now achieves **39/39 native Node 22.16.0 PASS, zero skips**, using exact source that matches the GitHub file blobs. Existing root `npm test` continues to omit these nested tests; a generic CI green status must not be misrepresented as dedicated acceptance.

**Still open:** real source-served WebGL2 screenshots, finished candidate asset shapes (symbolic IDs only), shape-aware player collision/selection, creator artwork sign-off, physical iPhone controls, and any manual incorporation. Gate A stays open; v0.11 locked; draft PR must not be merged, deployed or activated.
