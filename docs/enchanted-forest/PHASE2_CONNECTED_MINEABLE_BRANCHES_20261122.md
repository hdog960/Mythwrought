# MYTHWROUGHT — Enchanted Forest Phase 2: Face-connected Tall Tree Engineering

**Isolated development; not for merging or deploying.** Parent `dev/enchanted-forest-overhaul-20261121-phase0` is protected at `db8cad02387050579c75cbdcdea3e94a9f6d6bee`. Production `main` remains `7016e14cd6289f45eaf7fc6a79a362b47996df65`. No user-save, M7 generator ID, cave, other-biome, Codex, settlement, PWA, or five-automation changes.

## Exact previous source-native acceptance (reused, not repurposed)

- `[GitHub Actions #45028995700](https://github.com/hdog960/Mythwrought/actions/runs/45028995700)`, source revision `7e76a19f856434113c8f1d1804d15a4ce4e71ec6`, job `137228180061` **SUCCESS**, full job logs read **once**. **21/21 Node source-native tests PASS**, zero failures.
- Actual three-seed M7 Giant census from that exact source: **oldEligible=12, newEligible=12, blockedByStrictRoots=0**, 48 genuine supported root corners. Per-seed Giants 179: **5**, 7919: **1**, −88: **6**. No hard Y=19 ceiling breaches.
- Actual six-chunk×three-seed cross-source-identity census: **2,914 physical candidate tree voxels**, **465 chunk-border voxels**, **62 connected neighboring cross-chunk voxel pairs**, original `FourRegionWorld` reader and direct chunk planner parity green.
- Six native meshes at seed 7919: original 963,360 bytes vs candidate 1,010,664 bytes, ratio 1.049, all actual single-chunk uploads below unchanged 8 MiB cap.
- This evidence belongs to the checked exact source. **New changes to candidate geometry require their own focused tests**, and older visual screenshots do not certify new tree appearance.

## New physical source engineering

Previous `buildEnchantedTreeCandidate` stored voxels in a `Map`, and **later same-tree foliage could overwrite earlier bark**. Certain decorative branch tips were also separated from main trunks by diagonal corners/gaps, leaving physically disconnected bark in the generated tree geometry. This bug exists entirely within the explicitly opted-in experimental tree builder; historical M7 is not changed.

New `src/manual-biomes/enchanted-tree-candidates.mjs`:
1. Uses existing `resolveEnchantedTreeOverlap` precedence **only when the same tree writes a coordinate twice**. Existing bark remains bark even after the crown/fronds are authored. Leaves and unique positions retain the original bounded structure and deterministic ordering.
2. **Starspire:** physical 1-voxel bearing elbows link both upper side spires to the bent central shaft.
3. **Moonwillow:** a vertical-to-horizontal bend elbow and real intermediate branch beams connect the leaning shaft and both outer arms by shared cube faces rather than corners.
4. **Ancient Giant:** four thick outer branches now have intermediate 1-block bearing beams joining them to the solid, mineable 2×2 shaft. Four-root authentic surface/cave/landmark checks remain unchanged.
5. Adds no generated Y values beyond WORLD_MAX_Y=19; each proposal still uses existing mineable `G.aetherBark/G.aetherLeaves/G.moonLeaves` IDs and prior density/site rolls. No gameplay opt-in, no save migration, no UI or main/PWA modifications.

Added `tests/manual-biomes/enchanted-tree-structural-branches.test.mjs`, **four new focused native tests**:
- Breadth-first traversal through original authored bark using **six face-neighbor directions** from the real root pad, asserting every bark voxel belongs to its mineable trunk and no floating bark island remains, for nine style rolls covering all three species and height/silhouette variants.
- Verifies Starspire/Moonwillow full central shafts and elbows cannot be replaced by later canopy/frond voxels.
- Verifies Giant 2×2 full-height trunk and all four heavy branch crossbeams stay physical bark.
- Ensures leaves preserve at least a two-block human-standing headspace away from trunks, all cells are valid integers within unchanged Y19/cell budget, and same style is exactly deterministic.

## Focused only; no redundant CI

- Previously successful original source-native proof: **21/21 PASS**, reused exclusively for its own revision.
- New branch source update `217f585d5012e70ca7391e830a5abefc63c045af` for geometry and `aeec831dfb33926b5dedb7471293c984e1f25ee5` for topology tests.
- One isolated lightweight native [Actions #45033031803](https://github.com/hdog960/Mythwrought/actions/runs/45033031803) source commit `5d01f7d111688d30b635ece1c91252eed7406e85` launched by updating the **existing child-branch-only** native workflow to include the four new cases and earlier **affected** source-native regressions. It was **IN PROGRESS** at initial check. No second run, Chromium, screenshots or whole repository suite.
- New candidate geometry and all new tests are **provisional until #45033031803 succeeds on this exact source**. Treat any real native failure as a bug to fix, not a reason to weaken assertions.

## Outstanding release gates

- Confirm exact source native 25/25 (21 retained + 4 new) or examine genuine failures; remeasure real three-seed Giant census and six-chunk native GPU budget after changed connected branches.
- At milestone: **affected** real original-game WebGL2 viewports including canopy seams, player access and iPhone landscape, only where new branches changed appearance. Do not repeat old Phase 1 and unrelated visual suites.
- Before launch: explicit versioned generator identity with save/reload compatibility, no old-world reinterpretation; physical iPhone Home Screen PWA streaming, mobile p95, cave/landmark, collision and full required release safety checks.
