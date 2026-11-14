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
