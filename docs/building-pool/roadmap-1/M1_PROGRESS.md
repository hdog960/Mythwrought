# M1 — First 45 Homes & Regional Life voxel architecture candidates

**2026-11-14; standalone and never world-placed.** M0 accepted for isolated schema/PR bootstrap: earlier PR #121 initial commit f57d4a6543ba4907d02bf86b1d8c47ac58e6c37a had exact-head GitHub CI node-and-browser **SUCCESS**. That root check did not discover the new nested Roadmap 1 suites automatically.

## Actual authored candidates

Implemented **45 independent design briefs**, not just names or descriptions: 15 houses, 15 taverns, 15 empty stables (one of each for each of the five biomes × small/medium/large), currently building IDs index 001, 002, 003 respectively. This fills **45/885 authoring slots** (5.08%) but **0/885 creator-final-approved** slots. 840 are not authored.

m1-designs.mjs defines 45 independent named spatial/roof/frontage briefs. m1-buildings.mjs deterministically expands each into coordinate arrays: 46,299 actual source-backed voxel placements across the 45 candidates; foundation slabs; multi-height walls; interior partitions; explicit two-high open portals and stowed physical door-leaf placeholders; window openings/glass placeholders; differentiated stepped/hip/flat/courtyard/steep roofs; exterior supports and trims; interior furnishings and feed troughs; multi-room portal topology; empty-air walkable cell coordinates; full unresolved asset dependency records. Stable stalls have no animals.

Biome architecture: temperate timber/shingles, desert plaster and courtyard, snow insulated timber/steep roofing, enchanted root-toned beams/domes/skylights, mountain masonry/terraces/buttresses. Architectural identity comes from independently chosen footprint, interior zoning, roof profile, entrance offset and physical feature, not material recoloring alone. Schema catches exact recolor duplication. Mirrored/rotated and near-duplicate visual similarity remain a separate later human and algorithmic acceptance gate.

Asset identities reference verified manual rosters: Pack 1 stone, Pack 2 doors/support/timber, Pack 3 roofs/battlements/spires, Pack 4 windows/furniture/chimneys, Pack 5 plaster/furniture/stall partitions. Each non-live placement explicitly has unresolved physical dimensions, support and collision/selection/rotation dependencies. Existing live:wood and live:stone foundations are real block families. **No provisional numeric ID is assigned**, not even to integrated-but-not-engine-registered biome130 families. No production gameplay, business behavior, worldgen, NPCs, animals, crafting or save edits.

## Tests and proof limitations

- **28/28 focused native Node v22.16.0 tests passed** in the local working tree (16 earlier M0 and 12 new M1). Tests cover full 45-category matrix, distinct geometry fingerprints, coordinates, slab coverage, roof/wall/window/door/furnishing presence, passable empty two-cell headroom and connected portal graph, six stable zones, animal absence, deterministic serialization and symbolic dependency completeness.
- **36 real Chromium screenshots** from a standalone Canvas2D schematic fallback: 6 representative candidates × exterior/cutaway × 667×375, 844×390, 932×430. Browser was Chromium 144. Script injection via about:blank was required because this environment blocks local HTTP/file URL navigation. The screenshots were generated from genuine blueprint placements, not illustrations.
- WebGL2 was **not available** in local Chromium despite software-GL flags. **No WebGL2 success claim**. Schematic preview represents unit-cell positions and NOT actual future block-pack mesh contours, alpha/collisions or final creator art.
- Precise head clearance beyond two cells, door-swing and actual candidate shape fit/physical targeting, exterior terrain interfaces, multi-level stairs, mirrored+rotated near-duplicate rejection and physical iPhone controls **remain unresolved**.
- Draft PR #121 must remain **UNMERGED**, with no deployment or main changes. Root CI may be green without running nested source-specific tests. Inspect actual checks for the new exact PR head separately.

## Next M1 acceptance slice

Reverify newest main, newest incorporation checkpoint, Issues #109/#117 and five manual manifests, whether the automated 130-family catalog has changed, and PR #121. Improve building-specific individual architectural variety, support/collision enclosure constraints, mirrored and rotated uniqueness tests and actual candidate preview realism. Run dedicated nested Node source-exact tests from PR contents and genuine WebGL2 where possible. Do not count unreviewed candidates as final visual approval. Stay exclusively inside the three Roadmap 1 directories.
