# Desert Phase 3 — exact-source focused T-junction visual gate

**2026-11-22.** Isolated test-only branch `research/desert-p3-junction-visual-gate-20261122`, based on gameplay child `2bd0395d3ef163e9fdc491ab5119b1ee80844194`. No terrain, world, save, automation, shared workflow or production files changed in this branch.

## Evidence inherited / reused, not rerun
- Original V6 five-seed source census Actions #45036277170 SUCCESS; 1,207 bounded order-priority conflicts (not 1,207 rendering acceptance samples).
- Exact gameplay child focused native Actions #45036500012 SUCCESS 20/20.
- Original Phase 3 parent `3c1f87c0db53ebafa8fbb52fcb7964c23fd5ba68` remains protected. Existing Phase 1/2 and shelf research source results are reused.
- This checkpoint performs **no new native, browser, GPU, queue or full-suite execution**. Source-backed browser harness is authored but unexecuted.

## Minimal actual-game screenshot acceptance (pending)
The new `tests/desert-phase3-triple-junction-browser.mjs` uses the real shipped main.mjs via `window.__mythwroughtTest`, authentic M7 original world, V6 selectors, actual WebGL2/composited page screenshots, two pre-proven source-eligible sites only:
- seed 179, x=-786 z=-1774: Desert / Mountain / Enchanted
- seed 2026, x=-2848 z=-774: Desert / Mountain / Snow

Each run confirms genuine neighboring original V6 labels and order, eligible original `_columnPlan`, actual top cap and in-engine voxel reader, world generator, completed 25-chunk streaming, GL context, nonblank screenshot and browser exceptions. Expected cap **before** 258; **after** `ENVIRONMENT_GROUND.scree`.

To compare on exact sources without adding shared CI workflows, a single *explicitly coordinated* Linux/Node22 browser job should:
1. Check out accepted parent **exact SHA** `3c1f87c0db53ebafa8fbb52fcb7964c23fd5ba68` in one worktree; copy the script from this test-only branch to `tests/` in that worktree (do not commit to parent).
2. Check out gameplay child **exact SHA** `2bd0395d3ef163e9fdc491ab5119b1ee80844194` in a second worktree; copy the same script to `tests/`.
3. Install **pinned** `playwright@1.58.2` and `pngjs@7.0.0` once per isolated environment and use the same available Chromium/SwiftShader build for both. In each worktree start a separate temporary localhost HTTP server; run `DESERT_JUNCTION_PHASE=before node tests/desert-phase3-triple-junction-browser.mjs` on parent, and `DESERT_JUNCTION_PHASE=after node tests/desert-phase3-triple-junction-browser.mjs` on child. Use unique artifact destinations, and collect both JSON manifests plus four PNGs.
4. Verify SHA-pinned checkouts, screenshot ZIP/PNG integrity and hashes, exact viewport, seed/coordinate/biome provenance, unchanged cave and landmark veto, no new saves/edits, and visually compare before/after screenshots for unexpected scree loss, exposed checkerboard, or boundary discontinuity. Use screenshots as a manual acceptance aid; pixel differences alone do not establish improvement.
5. If test detects a real regression, repair only isolated Desert source; do not change Mountain, Snow, Enchanted, sky, caves, builders or saves.

**Outstanding:** This original-game before/after WebGL2 gate has **not run**, images/artifact do **not exist yet**, and no physical iPhone Home Screen visual or frame-time acceptance is claimed. Do not repeat the Plains-only, ten-scene, or full repo browser suites. No merges, deployment, CI cancellations or shared workflow edits are authorized.
