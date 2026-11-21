# Enchanted Forest Overhaul — Phase 0 Baseline (2026-11-21)

Status: investigation underway; do not merge or deploy.
Branch: `dev/enchanted-forest-overhaul-20261121-phase0`
Parent production main: `7016e14cd6289f45eaf7fc6a79a362b47996df65` (2026-11-21 18:32:47 UTC; merged five-lane non-block integration PR #285).

## Scope and controls

- Enchanted forest only: correct foreign ground patches; add Starspire, Moonwillow, and rare Ancient Giant tree families; densify breakable ground vegetation; investigate terrain defects; add restrained ambience; qualify actual mobile/WebGL2/PWA performance.
- Do not modify the five automation branches or their prompt/assignments, other biomes, existing builders, settlements, or Codex integration projects.
- Preserve seed determinism, existing generation/save contracts, other work, and the protected production `main`.
- No merges or deployment without creator authorization.

## Source-backed findings

1. `src/manual-biomes/profile-world.mjs` routes M7 worlds through `v6BiomeAt`, `planEnvironmentalColumn`, `environmentalTreesForChunk`, and `_environmentBaseline`. Runtime staging uses `planEnvironmentalScenery` from `src/nonblock/staged-habitats.mjs` (see `src/main.mjs`).
2. `src/environment-ground.mjs` defines M7 enchanted ground: woodlandLoam ID 403, woodlandPeat ID 404, woodlandMoss ID 405; enchanted wood/canopies IDs 408–410. `src/manual-biomes/environment-v7.mjs` uses these in the enchanted ground and trees.
3. Ordinary legacy groves can be preserved near biome shoulders by `keepLegacyGroveTree` (no special biome, or weight <0.56), while interior legacy WOOD and LEAVES can be hidden by `_environmentBaseline`. In `planEnvironmentalColumn`, replacement refuses any protected above-ground baseline cell. Therefore **tree/grass contamination remains a hypothesis** requiring seed/coordinate tracing before repair. No specific culprit has been proven.
4. Existing enchanted voxel trees in `treeVoxels` are generally only 5–6 blocks tall with bent aether-bark trunks and moon/aether leaves. Generation samples 8-block candidate sites and has canopy-weight-dependent probability. Additional mystical tree families must be compatible with deterministic chunk borders, physical collisions, and caves.
5. `src/nonblock/staged-habitats.mjs` has a substantial existing enchanted flora catalog: spore pods, enchanted flowers, lantern mushrooms, ringed morels, starpetals, inkcaps, velvet cups, leaf litter, horsetail, moss cushions, saplings, shrubs, bracken, roots, branches, moss mats, lichen and toadstools. Placement currently samples three candidate positions per 16x16 terrain chunk (with neighbor sampling) and validates support/visibility, so the visible forest may be sparse despite source catalog breadth. Count **successful placed** instances and rejected sites rather than simply counting registered families.
6. `src/depth.mjs` caps physical world voxels at WORLD_MAX_Y=19. The current 5–6-voxel trees and high terrain leave limited headroom. Reaching the proposed 2–6x landmark scale without modifying other world-generation, streaming and save invariants requires a dedicated feasibility proof. Do not quietly lower requested landmark scale or raise the global world ceiling.
7. Main commit `7016e14` predates the recorded MP4 creation time (metadata 2026-11-21 18:50:48 UTC), but the exact game commit in the footage **is not proven** by video metadata: Home Screen caches may contain previous JS. Record runtime version/build evidence before claiming video provenance.

## Phase 1 root-cause protocol

- Sample multiple reproducible enchanted-biome seeds, interiors, and biome shoulders; record coordinates of any bright green grass and the nearest old/new tree origins.
- For every suspicious visible voxel, collect (a) biome name/weight, (b) default natural block, (c) legacy district tree provenance, (d) legacy mask decision, (e) M7 column overlay/writes, (f) final natural player-visible block, (g) save edit state.
- Distinguish expected plains biome shoulders from illegal interior grass patches. Protect caves, named landmarks and player edits.
- Fix only the proven failing rule. Maintain byte-identical non-enchanted generation and explicit legacy/M2–M6 profiles.
- Add deterministic tests for both interior contamination and legitimate seam survival; test real WebGL2 visuals and iPhone Home Screen playback before acceptance.

## Phase 2 height feasibility gate

- Keep all three distinct families: Starspire (2–4x), Moonwillow (tall hanging canopy), rare Ancient Giant (4–6x).
- Prototype heights and collision/mining semantics without changing `WORLD_MAX_Y` or the depth-section contracts until a tested approach exists.
- If true physically interactable giants cannot be supported in the current vertical envelope, document the engineering options and tradeoffs rather than shipping a decorative fake or silently shrinking the trees.
- Bound geometry/culling/chunk memory and preserve daylight/three-moon/24-minute-night compatibility.

## Qualification and current limitations

Phase 0 is only partially complete. The source audit and branch isolation are real; no actual node/browser tests, iPhone WebGL2 captures, PWA validation or seed-based color tracing have run on this branch. Video runtime SHA remains unproven. Phase 1 not yet accepted. A final release remains on hold.
