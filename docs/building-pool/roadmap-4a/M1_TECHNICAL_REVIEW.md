# Builder 4A — M1 technical review / new-lane acceptance

**Source preservation:** Legacy PR #123 HEAD `564330635f18e10215a3bf93901923fbf5af528d`; the exact original 30-design generator Git blob `14ecb6fcfbe5cfeea97976670d14afb93bc6fe45` is unchanged in new 4A. Retain **15 civic-hall + 15 castle-palace** candidates with original `r4:` identities. Total allocation **315**, new **0**, remaining **285**, creator accepted **0**, integrated **0**.

## Reproducing old source QA as 4A tests
Eight source-focused legacy suites plus an M1 inventory suite now directly load the 4A-owned generator, schema, preview AABBs and readiness module. Their checks cover roof posts/purlins/weather seams, windows, 280 conceptual player AABB static poses, two-cell entry/route clearance, connected functional rooms, stair/landing support, 30 unique geometry signatures and deterministic serialization. Source blob parity is still tested separately by M0. M1 copy tests are *not* proof of physical collisions in the game.

## Merged manual block ABI — actual source, read-only
The `m1-material-audit.mjs` module groups every inherited blueprint's used `packN:NNN` symbols by role and facing; consults the real merged 96-family/106-variant `manual-five-pack.mjs` resolver, and samples actual source selection/collision/render AABBs for unambiguous families. It deliberately never chooses ambiguous numeric/Pack5 variant IDs, never writes a persistent ID, never assumes support/rotation state is installed in schema-1, and never places a building. Unregistered `biome130:NNN` remains symbolic. Even a resolved shape has explicit whole-building joinery, mount, save, AABB and world-height blockers.

## WebGL2 candidate-proxy reviewer — separate actual execution gate
Copied the original PR #123 read-only actual Chromium/Mesa WebGL2 gallery source into 4A paths and rewired imports to current 4A geometry. Entry: `xvfb-run -a env LIBGL_ALWAYS_SOFTWARE=1 python3 tests/building-pool/roadmap-4a/webgl2-preview-browser.py`. The runner is intended to check **30 blueprints × exterior/cutaway × 667×375, 844×390, 932×430 = 180 candidate diagnostic renders**, read back GL errors/context loss with `gl.finish()`, save screenshots and source bundle digest. Its `candidatePreviewShape` has **explicit proxy fallbacks**; it is not a new full physical-family renderer, live GPU performance benchmark or creator/physical-iPhone approval. Full candidate-gallery execution and image inspection must be independently evidenced; CI gameplay smoke/layout is a separate test.

## Status
M0 exact head `836a203d9d77d58aeae5b5c129f5c7e135990a98` Actions #43767981937 SUCCESS. The **new M1 exact-head CI is pending** at this writing. No acceptance claims for a new M1 head until independent check. M2–M4 285 new designs remain unauthored. No non-4A files modified; draft, unmerged, undeployed; Gate A v0.10 open, v0.11 locked.
