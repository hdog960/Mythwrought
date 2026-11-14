# Mythwrought — Manual Block Pack 1: Stone & Nature

**STATUS: CANDIDATE — NOT MERGED / NOT DEPLOYED.**
**Gate:** v0.10 Gate A; v0.11 locked.
**Ownership:** src/block-packs/pack-1/ and tests/block-packs/pack-1/ only.
**Coordination:** https://github.com/hdog960/Mythwrought/issues/109
**Verified base main:** f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84 (checkpoint 006).
**Branch:** manual-pack-1-stone-nature-core-masonry-20261114

## Milestone status

- **0 — Foundation:** Verified main/checkpoint 006, seven authority docs, release ledger, physical block registry and Issue #109. Main still has IDs 0–8. Existing render-only flowers/mushrooms and shader stone treatments are not finished physical blocks. Pack manifest and gallery are present.
- **1 — Core masonry:** Six original, independent **candidate** full-voxel materials developed, IDs 9–14. Each has material-specific deterministic RGBA face artwork, full-cube collision and selection descriptors, and a place/remove fixture with accurate 3D AABB ray targeting.
- **2–6:** NOT STARTED. These cannot be claimed finished from the core full-cube test fixture.

### Unique candidate IDs — no existing IDs reused

| Candidate ID | Roster | Asset | Distinction |
| --- | ---: | --- | --- |
| 9 | 1 | Cobblestone | Irregular Voronoi riverstones with broad dark joints; not natural STONE 3 |
| 10 | 2 | Stone bricks | Warm dressed limestone, staggered rectangular mortar-course face art |
| 11 | 3 | Mossy stone bricks | Irregular clustered green moss occupying chipped brick/mortar regions |
| 12 | 4 | Cracked stone bricks | Ash-grey masonry with branching dark fractures and edge chipping |
| 13 | 5 | Polished stone | Honed cool teal-grey, fine mineral veins and burnished borders |
| 14 | 6 | Carved decorative stone | Honey sandstone with incised rosette and inset double borders |

These are six new **candidate definitions**, not six currently playable materials.

## Interface

- Import CORE_MASONRY, masonryDefinition, masonryTexture or masonryTextureSet from core-masonry.mjs.
- The descriptors expose shape.boxes, selection.boxes and collision.boxes, always one exact physical unit volume [0,0,0,1,1,1]. These six cubes require no rotation persistence.
- masonryTexture(id,face,size) generates deterministic packed RGBA pixels without shader edits, external images or licenses.
- The gallery at gallery.html is *standalone*, shows original per-face pixel art using a 2D isometric visualization, and provides reversible **fixture-only** placements with a ray/AABB selection demonstration. It is not a functioning production game screenshot.
- fixture.mjs offers createMasonryFixture, restoreMasonryFixture, a 6-block-reach raycast, independent remove/place, and schema-1-shaped [x,y,z,id] save/restore. The fixture never mutates a seeded real world.
- The baseline production VoxelWorld.set() currently **rejects IDs >8**. Production rendering, selection, collision and genuine schema-1 persistence must be integrated and tested manually by the central engine owner. No new materials are available to users yet.

## Run focused Node tests

From the repository root:

    node --test tests/block-packs/pack-1/core-masonry.test.mjs

The existing repo npm test pattern targets only tests/*.test.mjs (not nested tests), so the dedicated focused command is necessary. Do not claim existing CI covers Pack 1 tests until the integration owner explicitly runs this command or adds a nonconflicting CI discovery mechanism.

A full Node and genuine Chromium browser run must occur before integration. The PR is allowed to open in candidate state while verification remains outstanding. Do not fabricate screenshot, GPU-performance, offline, or physical iPhone evidence.

## Coordination / integration handoff

1. Re-verify newest main, Issue #109 and manual pack manifests. Stop if another physical equivalent appeared since checkpoint 006.
2. Reserve IDs 9–14 only for this Pack 1 module. IDs 0–8 are protected; Pack 2 owns 59–108, Pack 3 owns 109–158, Pack 4 owns 159–208; 255 must stay the chunk-cache sentinel.
3. Central manual incorporation must expand engine ID validation, material palette/atlas mapping, discovery and save compatibility in one reviewed integration, with rollback and schema-1 historical fixtures. This pack does **not** edit those files.
4. Future Pack 1 slabs/stairs/walls/arches/railings will consume the :12 generic shape descriptors and :00 shape-aware selection/collision/save system when stable; do not reimplement that generic engine here.
5. Keep the palette wholly opt-in; neither vegetation :48 nor world generation :24 can place these materials without explicit creator-authorized integration. No constructed structures, inventory, crafting, farming or harvesting.
6. Gate A stays OPEN; no merge, deployment or creator visual/iPhone approval is inferred from source code.

**Additional evidence:** Eight focused V8 source-evaluation checks passed on fetched branch files for candidate IDs, 24px opaque face textures, texture variation, unique faces, moss appearance, independent place/remove, AABB targeting and save/restore. **Node: NOT RUN; Chromium: NOT RUN; physical iPhone: NOT RUN; screenshots: NOT CAPTURED.** The nine authored Node test groups must still run in a proper Node environment.
