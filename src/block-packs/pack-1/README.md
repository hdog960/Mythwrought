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

## Milestone 2 — physical stone shapes (new candidate work)

**Six additional independent shape candidates, IDs 15–20** (roster 7–12), are implemented in pack-owned modules:

- Stone slab **15**: lower half-height stone surface; optional upper preview (requires engine save state).
- Stone stair **16**: two solid risers, empty upper-front half; four quarter-turn orientations and optional upper preview.
- Stone wall **17**: substantial narrow stone spine and wider cap, not a full-meter cube.
- Stone pillar **18**: broad plinth, slender shaft, solid capital.
- Stone arch **19**: one-cell arch opening with independent solid piers and crown; a *decorative modular arch component*, **not** a completed gateway with player-sized clearance.
- Stone railing **20**: separate balusters, foot rail and handrail with empty targeting gaps. Different from Pack 2 bridge railing and Pack 3 parapets.

**Source:** stone-shapes.mjs. **Fixture:** stone-shape-fixture.mjs. Geometry uses immutable [x0,y0,z0,x1,y1,z1] local-unit occupancy boxes. stoneShapeDescriptor(id,{rotation,variant}) produces the :12/:00 standard occupancy shape interface. stoneShapeTexture(id,face,size) generates original detailed pixel-art surface motifs. No shared engine modifications.

**Preview:** stone-shape-gallery.html + stone-shape-gallery.mjs is a standalone 2D canvas rendering the exact shape boxes with four-way rotation, optional upper variants and isolated place/remove actions. It is NOT a genuine production game screenshot.

### Verification and blockers

Run (in an authorized Node environment) from the repo root:

    node --test tests/block-packs/pack-1/core-masonry.test.mjs tests/block-packs/pack-1/stone-shapes.test.mjs

- Milestone 1: 9/9 Node test bodies passed V8 compatibility evaluation (NOT actual Node execution).
- Milestone 2: 11/11 Node test bodies passed V8 compatibility evaluation against fetched branch source, including rotation, partial occupancy, unique artwork, individual removal and explicit unsafe-save refusal.
- Cross-lane :00 opt-in shape API: 8/8 V8 probes passed with the actual unmerged generic targeting source: 24 valid orientations, open arch void, physical pier, open railing gaps, solid baluster, rear stair riser, compatible stacked slabs and collision prevention. **Not production integration.**
- Existing project CI runs npm test against tests/*.test.mjs and genuine Chromium scripts, but DOES NOT discover nested Pack 1 tests. Exact-head baseline CI must be checked separately and is not direct Pack 1 test proof.
- Focused Node, actual Pack 1 Chromium preview, mobile/offline test and authentic screenshot: **NOT RUN / NOT CAPTURED.**
- **Orientation persistence BLOCKED BY ENGINE:** production schema-1 edit rows [x,y,z,id] cannot carry rotation or upper variant. The pack fixture refuses a rotated/upper save rather than silently dropping state. Canonical orientation-0/variant-lower edits roundtrip in the isolated schema-1-shaped fixture only.
- Central manual integration must establish safe persistent orientation encoding, full material registration, shape-aware mesh/targeting/collision, legacy save fixtures and iPhone performance checks without changing the existing production systems prematurely.

**Ownership preserved:** no edits to :00/:12/:24/:36/:48, world generation, source registry, controls, other pack files or CI. **Milestone 3 garden components remain NOT STARTED.**
