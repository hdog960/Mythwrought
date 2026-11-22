# MYTHWROUGHT Enchanted Forest Phase 2 — Bounded Tall-Tree Feasibility Candidate

**Protected isolated development only. No merge, deploy, Codex or automation modifications.**

## Source-verified engineering envelope
- Production main at phase start: `7016e14cd6289f45eaf7fc6a79a362b47996df65`. Phase 1 source/browser accepted checkpoint `7db862e287d7f767d799cc4ddd5ff44c8cea79b7`.
- Source `src/depth.mjs`: `WORLD_MAX_Y=19`, original surface interval `[-3,19]`; lower tenfold expansion exists below that surface, **not** above the sky.
- Real `src/voxel.mjs` original `terrainHeight` is naturally 2–12. M7 surfaces can be raised slightly and original caves/landmarks can occupy otherwise empty cells.
- Existing M7 `environmentalTreesForChunk` samples sites on an 8-block lattice, places physical enchanted trunks 5–6 high with small crown, uses original in-game `readCell` collision gates and rejects potential roots at `floor>WORLD_MAX_Y-5`; old tree sites/color IDs are deterministic.
- A typical 4–6× overall height increase from a 6-7-block old tree is **impossible** as fully mineable native voxel geometry under the hard Y=19 ceiling. Do not secretly enlarge `WORLD_MAX_Y` or create fake invisible support; later design may negotiate alternate presentation.

## Phase 2 source candidate (NOT production M7)

New pure `src/manual-biomes/enchanted-tree-candidates.mjs` constructs distinct bounded physical silhouette candidates with the **existing registered IDs only**:
1. **Starspire:** 8–10 trunk voxels, tapered/spired 2 additional crown levels, roughly 10–12 above root; single supported base, side bark spires, mixed aether and moonleaf canopy.
2. **Moonwillow:** 7–8 trunk voxels, up to 1 top crown level and hanging draped outer fronds, 8–9 overall above root; airy playable lower trunk.
3. **Ancient Giant:** 10–11 trunk voxels, 2 additional crown levels, 12–13 overall above root, a real mineable **2×2 supporting trunk and four-root footprint**, sculpted canopy. Only naturally eligible when the top leaves remain at or below Y19; many higher surfaces deliberately decline placement.

Each candidate is capped at **240 raw tree voxels**, maximum horizontal radius **4**, **no** Y>19, unique integer source cells. Site species choice uses an additional deterministic style hash but does not alter the historical density/site hash. Physical placement still demands actual M7 biome, real supported column, no collisions with protected cave/landmark geometry, and genuine AIR for every proposed voxel.

### Important version-and-save protection

`FourRegionWorld` now has an **explicit in-memory-only** constructor option `experimentalEnchantedTrees:true`, accepted only with M7. Default omitted/false uses the existing historical M7 tree path unchanged. The prototype **refuses `save()`** rather than serializing newly generated tree geometry under the unchanged M7 version and corrupting historical edits. Gameplay `src/main.mjs`, source existing profile identity, old default world loader and legacy tree shuffle were not touched.

An eventual releasable production version must use separately reviewed versioned generation/save migration and default-world cutover, or another creator-approved compatibility strategy. The opt-in is a **draft research tool**, not an automatic upgrade and not a user-visible toggle.

## Exact-head native gate

Source-only CI [Enchanted Phase 2 Tall Tree Feasibility](https://github.com/hdog960/Mythwrought/actions/workflows/enchanted-forest-phase2-trees.yml), created via isolated protected branch. Initial exact source run [#44965659979](https://github.com/hdog960/Mythwrought/actions/runs/44965659979) at commit `bebdbe7ff74ac59f256735ab3119f202bf81dec7` was **QUEUED at initial documentation**, not yet accepted.

Strict new tests:
- All three tree kind silhouettes, 2×2 giant root, species-specific bark/leaf placement, deterministic distinct cells; bounded Y19/radius/voxel count and safe decline at high terrain.
- Historical M7 path and other biome tree chunks remain unchanged when the prototype is not opted in; no M6 prototype acceptance.
- Real original `FourRegionWorld` source chunk seam and independent same-seed parity across negative/positive chunk boundaries.
- Actual original `meshChunk()` physical GPU buffers for six genuine jungle-region chunks, unchanged per-chunk GPU-upload limit and bounded 2.5× aggregate source mesh growth; no NaN vertices.
- Actual prototype canopy can be mined in memory but **cannot** be durably saved under historical M7 profile. Original M7 saves unaffected.
- All existing profile/save/v6, enchanted Phase 1 cave/landmark and moss caps remain green.
- Additional read-only `scripts/ci/enchanted-trees-phase2-census.mjs` enumerates genuine original terrain/seed cave/landmark/collision gates over 3 seeds, real natural tree sites, actual species acceptance and chunk-local voxel counts. Writes source SHA, source identity, rejection reasons, density and species summary to `artifacts/enchanted-forest/phase2-tree-feasibility.json` only.

**Important:** Native test run is pending. Actual giant placement may be rare due low-floor and four-root constraints. Do **not** claim all three species spawn naturally or that the original game visually shows any candidate until real exact-source logs prove it.

## Remaining critical work
- Inspect actual CI native error logs and restore source-bound tests without weakening performance, caves, tree support or saves.
- Verify naturally placed **each** species on representative seeds, not only that pure model constructors can draw them. Determine actual rarity and height distributions, reject overgrown or unsuitable sites.
- Capture genuine modified original-game WebGL2 images of the explicitly experimental prototype without changing production/default M7 world state or bypassing old save guards; visually review tree silhouette, green canopies, forest density, chunk seams and sky clipping.
- Qualify original untouched old forest source and named landmarks, source exact save/profile version migration strategy, physical iPhone installed Home Screen PWA and native FPS/p95/GPU upload parity before creator-approved merge/deploy.

**Keep protected lanes, five hourly automations, other biomes, settlements, Codex, user saves/icons and production main untouched.**
