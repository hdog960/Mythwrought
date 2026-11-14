# Building Roadmap 2 — M1 acceptance dossier (2026-11-14)

**30 AUTHORED CANDIDATES; 0 CREATOR-ACCEPTED; 0 INTEGRATED; 0 DEPLOYED.** One structural representative per (general store or temple) × 5 biomes × 3 sizes, including the earlier Hearthlane store. These are conceptual voxel coordinate plans, not placed buildings.

## M0 acceptance
The prior exact-head GitHub Actions [#43644864326](https://github.com/hdog960/Mythwrought/actions/runs/43644864326) completed **SUCCESS** at commit `71838311c39a0cf4a2fdeeeac8e5d28c317f5aed`. Dedicated native Node 9/9 and nine genuine Chromium standalone Canvas2D screenshot previews at 667×375, 844×390 and 932×430 were verified. **M0 technically accepted** for roadmap work, not for production WebGL2, physical iPhone, art/control acceptance, or permission to merge.

## M1 scope
30 coordinate-authored candidate buildings: 15 general stores and 15 temples, five biomes and three sizes, generated as complete explicit xyz occupancy with shell, foundation, floors, roofs, windows, entrances, inner partition doorways, two semantic rooms, fixtures and decor, all with human-walkable interior aisle paths. Stores have counters, shelf banks and rear stockrooms; temples have ceremonial nave, pews/columns, altar sanctuary, twin structural towers, shrine spire and large-class pinnacles. Temperate has cross-beam porch/gabled roof; Desert has shade terraces and a real open courtyard skylight; Snow has steep insulated ridge and sheltered vestibule; Enchanted Forest has irregular footprint, grown spires and roots; Mountain uses cliff stair/terrace roof profiles and buttressed supports. Actual footprint and roof heights vary by biome and size: not recolor-only clones.

All physical materials are symbolic manual-pack roster keys or biome130 planned family symbols. Actual asset dimensions/rotation, collision, lighting, interop and save ABI are unverified. **No new persistent numeric IDs or world placements**.

## Evidence
- Genuine native Node v22.16.0 `node --test tests/building-pool/roadmap-2/*.test.mjs`: **18/18 pass** after updating original manifest count assertion (one authored M0 candidate → 30 authored M1 candidates).
- Candidate count 30/30, 30 distinct rotation/reflection/recolor-independent geometry fingerprints; actual interior floor floodfill, three-cell-clear outer/inner doorways, symbolic materials, required temple and shop fixtures, roof/windows, increasing size volume tested.
- Genuine Chromium headless Playwright with no-network inline source bundling: **90/90 screenshots captured** covering all 30 in 667×375, 844×390, and 932×430. PNGs verified; representative images from Snow, Desert and Enchanted Forest inspected. Earlier temples lacked distinction; physically modeled front towers and spires were added, and the 90-view run repeated. Not every image individually received aesthetic human approval.
- This is a standalone Canvas2D conceptual gallery **NOT** in-game WebGL2, served Pages, real iPhone, or performance benchmark. New exact PR-head GitHub Actions remains independently required; no claim until completed.

## Governance
Checked main `caf47776b723a36684edc1a72749e49268ccc688`, incorporation checkpoint 007, Issues #109/#117, manual Pack PRs #113/#114/#112/#115/#119/manifests, biome130 status and #118, and Building Roadmaps 1/3/4 #121/#122/#123. Scope stays exclusively Roadmap 2 paths. v0.10 Gate A OPEN, v0.11 LOCKED; schema-1 saves, seed, PWA, controls and shared systems unchanged. No merge or deploy.

**M1 creator review OPEN**. Do not count these as production-approved or begin M2 until creator review and exact-head CI are resolved.

## Concurrent checkpoint 008 re-audit
After M1 authoring, main advanced independently to `ac263720b60641c65b02330348dd76d0ef9cb75e` with checkpoint **008** via PR #126 (automation-only live voxel activation). Exact diff against checkpoint 007 touched shared game/CI/docs files, not `src/building-pool/roadmap-2/`, `tests/building-pool/roadmap-2/`, `docs/building-pool/roadmap-2/`, manual Block Packs or other building roadmaps. No rebase/cherry-pick or production activation was performed in this draft. Future sessions must recheck this cutoff before editing.

## M1 follow-up visual/circulation remediation (2026-11-14)
- Confirmed PR #124 prior HEAD `e28435db7c3b7d4b4aa02dbc8138cc07326d2a22` with 18/18 native Node tests; GitHub Actions #43647392571 still queued at this review. Source blobs for M1 generator/tests/catalog/schema were byte-for-byte Git blob matched against the local working tree.
- Inspected authentic 30-design contact sheet and individual Desert, Snow, Enchanted Forest large/small views: temple silhouettes were still too similar to general-store roof boxes, regardless of previous uniqueness fingerprints. This is a genuine **visual architecture issue**; old distinctness tests alone do not establish creator-quality architecture.
- Revised all 15 temple candidate geometries (no stores changed): physically modeled paired 2×2 tall belfries above maximum biome roof ridge, three-wide processional portal with lintel, visible roof-crossing lantern spire, upper tower glazing, and a raised two-row altar dais. First dais placement obstructed rear circulation; moved it behind the internal aisle and reran flood-fill validation. No simulated NPCs, worship gameplay or live-world integration.
- Added three independent dedicated Node regression cases for belfry mass, three-wide portal clearance, and accessible raised altar platform: **21/21 native Node v22.16.0 PASS** in local isolated working source.
- Reran authentic **90/90 Chromium Canvas2D viewport PNGs** for 30 candidates at 667×375, 844×390, 932×430. Confirmed 90 unique filenames, correct viewport dimensions, 45/45 temple PNGs changed from the original candidate render, and representative Desert/Snow/Enchanted Forest views inspected. No game WebGL2 or physical iPhone tests; creator aesthetic signoff remains OPEN.
- Latest main advanced independently to `ac263720b60641c65b02330348dd76d0ef9cb75e`, checkpoint 008. Read coordination Issues #109/#117 and contemporaneous Block Pack 1–5 PRs and other building roadmaps. No shared changes in Roadmap 2 lane. Next exact-HEAD CI is separate from prior older run; do not claim it has passed without checking.
- M1 candidate count **30**, production-approved count **0**, world placed **0**; M2 remains NOT STARTED pending creator review and current head CI. Keep draft PR unmerged and undeployed.
