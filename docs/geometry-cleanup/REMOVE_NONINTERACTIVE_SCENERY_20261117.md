# Mythwrought — remove noninteractive visual-only scenery from playable world

**Creator's exact definition (2026-11-17):** "Geometry crap" is scenery in the game that cannot be broken/harvested; it must be removed, not polished, to make room for real interactive vegetation, trees, flowers, cave things and objects.

## Implementation

All eight old noninteractive appendages are disconnected from the single *live* surface chunk renderer, `src/voxel.mjs::meshChunk`:

1. `src/canopy.mjs` — render-only, nonmineable sculpted trees, canopy highlights, roots, woodland-floor triangles.
2. `src/grove.mjs` — garden groves, ferns and blossoms.
3. `src/meadow.mjs` — wildflowers and painterly surface decorations.
4. `src/grotto.mjs` — fake cave mushrooms, crystals and caps.
5. `src/cave-runes.mjs` — unmineable decorative wall glyphs.
6. `src/cave-thresholds.mjs` — render-only cave entrance dressing.
7. `src/moonbells.mjs` — flowers, lichen and decorative shelving on soil/rock.
8. `src/ridge-strata.mjs` — fake surface wall/rock overlays and ledge triangles.

**This is a LIVE RENDER DISCONNECTION, not deletion of historic source modules.** Generator source remains available as read-only reference for the separate :48 interactive non-block object roadmap, but no longer executes for `meshChunk`. Old cosmetic shader tags `7..17` must not appear in a new playable chunk mesh. No world-save or block-ID migration, no extra draw calls.

### Explicitly preserved

- Every real `VoxelWorld.get` cell, normal terrain, caves, physical LEAVES/WOOD, ancient ruins, source-backed registered shapes, block IDs, collision, mine/place behavior and current seed distribution.
- `src/live-voxel-world.mjs` and all physical tree/grove/cave generators are **unchanged**. Their seed-fixed historical cell coordinates and saved-mining overrides are retained.
- Depth section meshes, manual block packs 1–5, 130 registered construction blocks, builders, creative flight, offline PWA, 25-chunk budget, minimap and two-thumb rails.
- Draft PR #175 and existing manual **art-only PR #225** remain untouched. PR #225 was focused on making the now-retired render-only foliage prettier and **must not be incorporated as the removal solution**.
- :48 automation continues its new 96-family interactive non-block object work in its own branch.

### What WILL look different

The game's temporary playable scene becomes sparser where fake flowers, ferns, decorative fir trees, crystal clusters, mushrooms, carved rock decals and rune drawings had been displayed. That is **intentional**. Real mineable terrain, voxel trees and structures remain. Real replacement assets will be incorporated separately when genuinely harvestable with correct interaction, save persistence and iPhone rendering.

### Tests / acceptance

- The old generator's source-only tests remain for future asset design. Tests that previously demanded invisible ghost objects be appended to the real renderer are replaced with checks that reject shader-only object materials in the active mesh.
- New `tests/no-fake-scenery.test.mjs` checks five real seeded chunks for forbidden material tags 7..17, ensures actual physical leaf and wood faces are still present, preserves schema-1 save bytes, and confirms mining/reloading of a seeded real LEAVES block.
- The existing 20-script genuine Chromium/WebGL2 gate now tests absence of noninteractive materials in the same source module as the game, while retaining 25 chunks, original controls, save/reload and context recovery. The canopy browser script also captures three landscape images of the cleared scene, 667×375, 844×390, 932×430. **Verify** that the artifact actually contains these before claiming screenshots accepted.
- Audit current main and isolated PR exact-head CI, log total native tests, run the full 20 browser gate, verify render difference against baseline, check screenshots and explicit iPhone performance. No fictitious claims.
- **NO MERGE OR DEPLOYMENT** until explicit creator authorization after genuine green exact-head CI and a preview review; v0.11 remains locked.

### Acceptance definition for future real non-block objects

A new tree, grass/flower, mushroom, cave object or physical decoration should not be added visually to the game until it has genuine mine/break/harvest interaction, raycast/selection, appropriate physics/collision, edit/save persistence or confirmed stateless harvest behavior, and passable iPhone performance. A *non-block* mesh can still be a real interactive harvestable object; a decorative draw-only triangle cannot masquerade as one.
