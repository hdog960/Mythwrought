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

## Milestone 3 — garden physical components (candidate IDs 21–23)

**Developed net-new standalone physical voxel assets, no crops or game gardening systems:**

| Candidate ID | Roster | Physical piece | Appearance / occupancy |
|---|---:|---|---|
| 21 | 47 | Tilled farmland soil | Rich umber dirt occupies 0–0.67 of a full cell; four independently raised earthen ridges to y=0.84, with true empty planting grooves at the higher level. The underlying earth and ridge-top art now differ after a detected texture alias was corrected. No watering, planting or growth. |
| 22 | 48 | Cedar garden planter box | Actual wooden base and four walls; four raised top rims surround a small solid bed of unplanted soil at y=0.42. Above the inner soil is an open, ray-passable cavity; all parts together are one independently selectable/removable piece. |
| 23 | 49 | Terracotta flower pot | Compact stand-alone square-profile ceramic vessel, with physical base, tapered walls and four glazed rim segments; genuine open air above its internal floor. No flowers, planting or separate inventory object. |

Source: garden-components.mjs, garden-fixture.mjs. The descriptors expose immutable local-space `boxes` as the authoritative generic :00 targeting / :12 meshing interface; additional `parts:[{role,box}]` identifies submaterials for later renderer work. gardenTexture(id,face,size,role) returns original deterministic opaque RGB(A) pixel artwork for earth/ridges, wood/loam/rim and ceramic/glaze.

**Gallery:** garden-gallery.html + garden-gallery.mjs (isolated, not used by live game). The 2D isometric preview and click-probe cross-section are both derived directly from box definitions, illustrating true solid ridges, cavities, and individual piece placement/removal. It is a source-authored preview, **not an authentic browser screenshot**.

### Tests and evidence

Run these focused tests from the repository root:

    node --test tests/block-packs/pack-1/core-masonry.test.mjs tests/block-packs/pack-1/stone-shapes.test.mjs tests/block-packs/pack-1/garden-components.test.mjs

- **14/14 authored garden Node-test bodies passed** via a V8 compatibility harness using exact fetched branch source with compatible assertion shims. One distinct-material texture test initially failed (tilled earth and ridge top-face aliases) and was corrected; then all 14 passed. This **is not an actual Node execution**.
- **17/17 cross-team compatibility checks passed** in V8 against exact unmerged :00 raycast and :12 prototype mesher candidate source: 3 shapes x 4 rotations, with 108–468 triangles in the opt-in surface mesh, plus five physically grounded targeting / occupancy checks. Triangle counts are descriptive prototype outputs, NOT game rendering performance measurements.
- **Focused real Node: NOT RUN. Gallery Chromium: NOT RUN. Screenshots: NOT CAPTURED. Physical iPhone: NOT RUN.** Existing GitHub workflow is for the baseline project tests and cannot discover these nested Pack 1 files through the current npm test glob; do not advertise its green status as passing the garden-specific suite.
- Pure fixture save/restore preserves the legacy `{schema:1,seed,edits:[[x,y,z,id],...]}` shape for canonical orientation only. Nonzero rotations reject saves, rather than silently corrupt state. This does **not** establish compatibility with the live VoxelWorld, which still rejects IDs above 8.

For a future local browser proof (not performed yet), run the free local static server from the repository root:

    python3 -m http.server 4173

Then visit http://localhost:4173/src/block-packs/pack-1/garden-gallery.html in real Chromium at mobile landscape widths. Capture actual screenshot evidence and verify the visible slice, role texture previews, buttons and no console errors. Do not substitute concept art.

**Milestone 3 source candidates are complete, but integration and genuine device/browser acceptance are pending.** The next source category is Milestone 4's physical hedge, bush, climbing vine and colored decorative leaf variants. Before developing, recheck main, checkpoint and Issues #109/#117 to avoid duplicate integrated or automated-biome equivalents. Keep PR #113 draft/unmerged, v0.10 Gate A open, and all other pack/automation ownership unchanged.

## Milestone 4 — independent physical foliage (source candidates)

**Four roster families, eight truly different ID-bearing physical candidates:**

| Candidate | Roster family | Distinct independent physical silhouette and interaction |
|---|---|---|
| 24 Clipped yew hedge | 50 Hedge | Dense, irregular lattice of dark branch and stepped top-leaf boxes; solid barrier collision and individually removable as one cell. |
| 25 Briar thicket | 51 Bush | Wide low branching twig thicket and airy leaf clusters; woody stalk boxes collidable, foliage selectable. No berries or harvest. |
| 26 Woodland fern bush | 51 Bush | Vertical central stalk, splayed thin fronds and genuine open spaces; passable but ray-selectable and removable. |
| 27 Climbing ivy | 52 Climbing vine | Thin face-attached vertical twig lattice and spaced leaves; optional support metadata, mount precondition in isolated fixture, real raycast hit geometry; no full-cube wall collision. |
| 28 Wisteria foliage vine | 52 Climbing vine | Separate hanging foliage runners and draping leaves, wall-mounted, passable but targetable; no blossom/crop gameplay. |
| 29 Golden ornamental fan leaves | 55 Decorative leaf | Sculpted fan arrangement with thin stems and projecting gold leaf facets. |
| 30 Ruby curled ornamental leaves | 55 Decorative leaf | Red curled banded foliage volume with open lobes and different arrangement from golden fans. |
| 31 Silver star ornamental leaves | 55 Decorative leaf | Pale spiky star/spray clusters on slender twig arms, separate from other colors' silhouettes. |

All eight are **not** simply recolored LEAVES ID 7, shader tags, or natural leaf species from automation Issue #117. All foliage assets are independent single-cell physical pieces with exact local unit voxel occupancy boxes and original seeded RGBA material art per leaf/twig role. Soft plants and vines deliberately have empty or minimal physical collision boxes while retaining nonempty selection/hit boxes; this is real selectable geometry rather than uneditable scenery.

### Shape-budget correction, not a performance claim

The :12 prototype surface mesher partitions every unique box boundary. An initial Milestone 4 compatibility probe exposed **1,480–4,412** triangles per piece with hand-authored microbox edges, which was unacceptable for mobile-candidate geometry. The source now quantizes the **actual physical occupancy** boxes (not just the art preview) to a deterministic **1/8-voxel lattice**. This lowered source-prototype :12 surface-mesh output to **208–532 triangles per shape across all 32 combinations (8 assets × 4 rotations)**, with valid indices and bounded unit-cell coordinates. This is an isolated source arithmetic result, **NOT a measured WebGL2 draw/fragment workload, frame rate, memory budget, or real device acceptance**.

### Files and tests

- physical-foliage.mjs — original garden/ornamental foliage definitions, per-material pixel art, collision/selection boxes and four-way rotations.
- foliage-fixture.mjs — opt-in individual place/remove, AABB ray targeting, wall-mount precondition, exact canonical schema-1-shaped edit roundtrip and fail-closed orientation serialization.
- foliage-gallery.html + foliage-gallery.mjs — responsive standalone Canvas2D 3D-like gallery using candidate box shapes, per-face material art, selectable cross sections, rotation and reversible fixture test. **This is source code for an optional preview, not an authentic gameplay screenshot.**
- tests/block-packs/pack-1/physical-foliage.test.mjs — 16 focused authored Node test groups.

To execute all dedicated Pack 1 tests (requires a real Node 22 runtime and a complete checked-out candidate branch):

    node --test tests/block-packs/pack-1/core-masonry.test.mjs tests/block-packs/pack-1/stone-shapes.test.mjs tests/block-packs/pack-1/garden-components.test.mjs tests/block-packs/pack-1/physical-foliage.test.mjs

The configured root npm test glob excludes all these nested tests. Its passing CI checks prove the unchanged baseline continues to work, not that new Pack 1 asset tests executed.

**Evidence:** exact branch source evaluated by V8 with Node assertion/test compatibility shims: **16/16 authored foliage test bodies PASS**. Additionally, **40/40 V8 integration probes PASS** against exact unmerged :00 targeting and :12 shape-mesh source: all 32 optimized shape/rotation meshes and 8 physically meaningful open/solid space, targeting and placement guards. These are **not actual Node or Chromium executions**. Direct GitHub branch checkout/download into the local Node/Chromium test runtime was unavailable (network sandbox), so **dedicated Node, actual gallery Chromium, offline browser, authentic screenshots and physical iPhone: NOT RUN / NOT CAPTURED**. Do not upgrade candidate states to TESTED without genuine test evidence.

**Integration blockers:** production VoxelWorld still only knows IDs 0–8; :00/:12 candidate engines are not wired into the live renderer; orientation state not representable by legacy edit row [x,y,z,id], so rotated fixtures refuse to save; face-climbing vines need host support validation. Physics, save data, UI, terrain, shaders, PWA and world placement were not touched.

**Milestone 4 source work completed for review only.** Pack 1 now tracks **19/21 candidate families**, **23 ID-bearing variants (IDs 9–31)**. **NEXT**: verify focused Node and authentic Chromium if accessible, then develop Milestone 5's individual physical flower species (at least four) and mushroom species (at least three) beginning at unused Pack 1 candidate ID 32, without overwriting foliage or adopting the separate Issue #117 biome130 leaf catalog.

**STATUS: CANDIDATE — NOT MERGED / NOT DEPLOYED. Gate A open; v0.11 locked.**

## Milestone 5 — seven physically independent flowers and mushrooms (IDs 32–38)

**Source-authored and committed. Candidate-only, not registered in the live game.**

| Candidate ID | Roster | Species | Physical identity and distinguishing 3D shape |
|---|---:|---|---|
| 32 | 53 Flower | Skybell | One curved thin stem, two opposing leaves, four individually bounded downward blue bells; solid-selection box union but passable petals. |
| 33 | 53 Flower | Ember lily | Six separate angular upturned copper-orange petals, stem, leaves and raised gold center; different topology from Skybell. |
| 34 | 53 Flower | Moonstar | Pale ivory four-point open star bloom, slender stem, basal leaves and central pollen core; no emitted light. |
| 35 | 53 Flower | Thornrose | Layered ruby-red rose-petal shells, twig branching and small leaves with separate central bud. |
| 36 | 54 Mushroom | Amber cap | Single honey-gold faceted mushroom canopy, pale stalk and distinctly bounded gill underside; only physical stem boxes block collision. |
| 37 | 54 Mushroom | Violet shelf | Three staggered, separately bounded purple shelf caps along one branching stalk, with gaps below; not a repainted single-cap fungus. |
| 38 | 54 Mushroom | Pearl gill | Pale fan cap with at least four distinct gill-ledged surfaces and a tapered central stalk; **lightEmission: 0**, no fake glowing gameplay. |

Unlike pre-existing render-only floral accents, these candidates each have a unique persistent candidate ID, local-unit AABB selection geometry, independently reversible fixture placement/removal, original deterministic RGBA art separated by stem/leaf/petal/center or stem/cap/gill roles, and orientation metadata. All physical parts are aligned on an 1/8-voxel coordinate lattice to avoid unbounded prototype surface mesh partitioning. The four soft flowers have passable collision but remain ray-targetable; mushrooms offer stem-only collision, with air below/around their cap. No crop growth, collection, pot planting, food, spore spread, illumination, gameplay or world generation.

Files created exclusively in Pack 1:
- src/block-packs/pack-1/floral-forms.mjs — all seven physical voxel box arrangements, part-role color art, four rotations, independent IDs and metadata.
- src/block-packs/pack-1/floral-fixture.mjs — isolated exact partial-AABB raycast, test-only reversible cell placement/removal, canonical schema-1-shaped save/restore, fail-closed rotated saves.
- src/block-packs/pack-1/floral-gallery.html and floral-gallery.mjs — standalone responsive Canvas2D 3D-style preview, derived from true physical boxes and part-role textures, individual probeable physical slices, rotate/place/remove, test-only save.
- tests/block-packs/pack-1/floral-forms.test.mjs — fifteen focused authored test groups.

### Tests and honest certification boundary

**15/15 new authored test groups pass** in a V8 compatibility harness using the **exact fetched GitHub source** and compatible Node-style assert/test shims. A first pass detected two incorrect expectations: a shelf cap reaches y=1 after 1/8-voxel lattice quantization, and the amber cap reaches the top of the cell. The test assertions were corrected to match authored geometry, and **15/15 pass** on the corrected exact branch. The physical geometry was not made fake or flattened to bypass these failures.

**39/39 cross-lane opt-in compatibility checks pass** in V8 using the exact :00 generic targeting source, the exact :12 prototype surface mesher and the Pack 1 floral source. These cover 7 shapes × 4 rotations (28 meshes, between 204 and 376 triangles, finite unit-cell positions and valid indices), open-space targeting, cap/stalk rays, overlap guards, no simulated light and standalone gallery script parse. The triangle counts are prototype source output, **not real GPU/draw-call or device performance**.

**Dedicated real Node:** NOT RUN; **dedicated authentic Chromium WebGL2 / offline gallery:** NOT RUN; **authentic screenshots:** NOT CAPTURED; **real iPhone:** NOT RUN. Actual GitHub project CI verifies the unchanged baseline but its root npm test glob does not auto-run the nested Pack 1 test suites. The local Node/Chromium runtime cannot network-fetch the GitHub branch through this session's container (DNS/network blocked); do not present V8 compatibility results as genuine Node or Chromium evidence.

To run all five nested Pack 1 Node test modules in the correct environment:

    node --test tests/block-packs/pack-1/core-masonry.test.mjs tests/block-packs/pack-1/stone-shapes.test.mjs tests/block-packs/pack-1/garden-components.test.mjs tests/block-packs/pack-1/physical-foliage.test.mjs tests/block-packs/pack-1/floral-forms.test.mjs

Then serve the full branch locally and use genuine mobile landscape Chromium to inspect:
- gallery.html (masonry)
- stone-shape-gallery.html
- garden-gallery.html
- foliage-gallery.html
- floral-gallery.html

Check console failures, original role-texture composition, actual physical empty gaps, selection and remove actions, rotation refusal on unsafe old saves, bounded mesh budgets and offline handling where applicable. Screenshots must be captured from those running pages, not illustrations or fabricated before/after comparisons.

### Milestone 6 handoff and blockers

All **21 assigned Stone & Nature roster families** now have source-authored opt-in candidate assets across **30 unique candidate IDs 9–38**. This is source-development progress, **not final acceptance, real device testing, production block registration or deployment**. The manifest retains all IDs, each family status **CANDIDATE**, PR link, source commit, dependency and evidence. No other manual pack or :00/:12/:24/:36/:48 source was edited. No additional 130-biome-program assets were duplicated or taken over.

Milestone 6 remains **OPEN** until dedicated genuine Node/Chromium and original screenshot review, source ID and geometry integrity audits, shape-aware live integration validation and historical schema-1 save test evidence. Production VoxelWorld.set still rejects IDs above 8, unmerged :00/:12 generic shape contracts are not live-wired, and old schema-1 edit rows cannot persist arbitrary rotations. A creator-authorized manual integration, followed by iPhone visual/controls approval, is required before any of these candidate assets are player-usable. Do not merge PR #113, deploy Pages, place flowers in the generated world, start v0.11 or alter central engine files without that separate explicit authorization.

**STATUS: 21/21 SOURCE CANDIDATE FAMILIES; 30/30 DISTINCT CANDIDATE IDS; 0/30 LIVE-INTEGRATED PACK 1 IDS.**
