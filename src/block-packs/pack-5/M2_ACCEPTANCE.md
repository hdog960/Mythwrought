# Pack 5 — Milestone 2 residential candidate QA (source-only, unmerged)

## Authority and coordination — November 14, 2026
- Newest main audited: `ac263720b60641c65b02330348dd76d0ef9cb75e`, integration checkpoint **008**.
- Checkpoint 007 automation-only incorporation and subsequent 008 activation explicitly exclude manual Packs 1–5 and all independent building roadmaps; **no Pack 5 assets are live**.
- Rechecked [coordination Issue #109](https://github.com/hdog960/Mythwrought/issues/109), [biome130 Issue #117](https://github.com/hdog960/Mythwrought/issues/117), all four manual pack manifests on current draft branches, and separate incorporated biome130 + unmerged PR #118.
- Pack 5 draft [PR #119](https://github.com/hdog960/Mythwrought/pull/119), exclusively in `src/block-packs/pack-5/` and `tests/block-packs/pack-5/`. No source edits in main, generic engine, block registry, shaders, CI, game UI/controller/minimap, PWA, worldgen, other packs or automation branches.
- **Zero new persistent numeric block IDs**. Symbols `pack5:079..096` only. Runtime IDs 0–8 and 255 sentinel protected; future widening remains centrally owned by :00/:12 and manual incorporation.
- v0.10 Gate A OPEN, v0.11 LOCKED. No creator visual/physical-iPhone certification or PR merge/deployment.

## Why source-only Milestone 2 was opened
M1's 3 architectural-surface families and 6 variants passed genuine **44/44 native Node** tests and original-source WebGL2 screenshot + native data-URL **ES module import** testing at 667×375, 844×390 and 932×430, rotations 0/1. Actual localhost HTTP served-gallery navigation is denied by browser administrator policy and remains **UNVERIFIED**; creator visual approval and production engine integration remain OPEN. In accordance with the creator's conditional instruction, this permitted *isolated M2 candidate authoring only*, **not M1 final creator approval**.

## M2: 4 distinct physical families, 8 original variants

| Symbol | Reusable physical family | Authored variants | Geometry / physical behavior |
| --- | --- | --- | --- |
| `pack5:082` | Beds | wanderer-quilt / moonwatch-canopy | Actual two-cell head+foot footprint, separate mattresses/quilts/headboard/bedframe; canopy has tall physical corner posts and rails. All occupied floor cells must have support; atomic selection/removal |
| `pack5:083` | Chairs & Stools | hearthside-highback / riveted-round-stool | Single-person high-backed chair versus short backless workshop stool, distinct physically modeled legs/seats, truthful partial collision, no sitting |
| `pack5:084` | Bookshelves | scholar-oak-stack / starbound-scrollcase | Three shelving tiers with separately modeled books or scrolls, physically authored frame and side/rear joinery, not retail display shelves |
| `pack5:085` | Cabinets & Wardrobes | pantry-cupboard / heritage-wardrobe | Distinct short/tall enclosed single-cell furniture, physically modeled door leaves and hardware, three rear/side timber bracing courses, no inventory |

All material variants have physically different geometry. This work creates **no bedrooms, rooms, buildings, citizens, shops, crafting/storage/sleeping gameplay or world generation**.

## Genuine execution and artifact evidence
- **66/66 native Node 22.16.0 tests PASS**: original 44 Pack 5 source/fixture cases and **22 new M2 tests**. Dedicated command `node --test tests/block-packs/pack-5/*.test.mjs`. Source and exact committed test Git hashes compared:
  - `src/block-packs/pack-5/residential-furnishings.mjs` `798592fc5241cffe5a9db5c8914ba9ea85524064`
  - `src/block-packs/pack-5/fixture.mjs` `b9f31dadecd093fc93e8fc4287e88c455022493b`
  - `tests/block-packs/pack-5/residential-furnishings.test.mjs` `f66c33eba92d45114d58dc4a126e7b8ddca8a08d`
  - `tests/block-packs/pack-5/fixture.test.mjs` `a0fbb1c687bcc1cc84775abd0535a2c2b9e73fdd`
  - `tests/block-packs/pack-5/residential-gallery.mjs` `3cf2cb8494aa1e0bfc41524dd36c1621d8508cf2`
  - `tests/block-packs/pack-5/residential-gallery.html` `778fa10609d62af3928fca3971c0780d8a42666d`
  - `tests/block-packs/pack-5/esm-webgl-browser.py` `0c8e6c4b1a0a4a711fa3358bb98397e2e9e37f1b`
- **Physical tests:** 32 eight-variant/four-rotation geometry/mesh checks, true single-person chairs distinct from Pack 4 benches, true two-cell bed occupancy/support including rotated far-foot support, collision/selection/removal by any cell, atomic bad-snapshot rollback, isolated variant save/restore (never production schema-1).
- **New defect found/fixed:** pre-M2 fixture let a two-cell bed float with an unsupported second cell. It now requires floor backing under **every** occupied cell. Existing foundational fixtures updated. This is a Pack 5-only test fixture, not live physics.
- **Visual defect found/fixed:** bookshelves/cabinets originally looked like featureless cubes from the rear; added physically modeled exposed side/rear timber joinery. The QA suite includes independent rear/side geometry assertions.
- **WebGL2:** Genuine Chromium 144 + software OpenGL real GPU drawing and pixel-readback with native `import`/`export` data-URL module execution. **Six authentic WebGL2 screenshots** for M2 (667×375, 844×390 and 932×430; rotations 0/1), all **eight** distinct variants render per frame with nonblank unique panel hashes; rotation changes visual fingerprints. `tests/block-packs/pack-5/esm-webgl-browser.py m2 <output-dir>` reproduces the checks under Xvfb; `m1` reproduces Milestone 1. Captures inspected separately and NOT checked into repository.
- **Honest performance:** authored unculled preview counts per variant are **408, 636, 168, 180, 612, 504, 360, 360 triangles** (816, 1272, 336, 360, 1224, 1008, 720, 720 vertices), respectively. Every cell <=64 authored boxes / <=768 prototype triangles. **These are NOT production mesher GPU costs or physical-iPhone FPS benchmarks.**
- **Served HTML remains BLOCKED**: localhost navigation returns `ERR_BLOCKED_BY_ADMINISTRATOR`. The offline data-URL runner validates real ES module semantics and genuine WebGL2 but is not an actual HTTP-served page or runtime integration.

## Decision and remaining gates
- M1: 3 **CANDIDATE** families, technical isolated QA PASS; creator visual final acceptance and served HTTP/gallery validation OPEN.
- M2: 4 new **CANDIDATE** families, 8 physical variants, native Node and offline WebGL2 preview PASS; creator art/performance review OPEN. **M2 production/final acceptance NOT GRANTED.**
- Pack 5 total **7 CANDIDATE / 11 NOT STARTED / 0 INTEGRATED** of 18 planned physical families.
- Before playable incorporation, central ownership must separately approve persistent numeric IDs and renderer/atlas, multi-cell atomic placement, shape-aware raycast and collision, variant + orientation metadata, backward-safe schema-1 saves, real mobile GPU budgets, physical iPhone controls and creator visual approval.
- **Do not merge, deploy, place assets in worldgen, alter automations, edit other pack/engine/CI files or unlock v0.11.**
