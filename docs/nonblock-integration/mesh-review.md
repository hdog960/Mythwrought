# Inherited mesh review

The four WebGL2 sheets show 43 distinct source meshes at two angles and show a second sample for each mesh. The preview uses an inspection palette and fits the camera to each mesh. Judge in-game color, relative size and legibility from the gameplay captures. The [mesh manifest](gallery/manifest.json) records source paths, triangle counts, degenerates, geometry digests and screenshot digests. [Source commit ledger](source-ledger.tsv)

- [Sheet 1 · biome specialists](gallery/inherited-1.png)
- [Sheet 2 · cave formations and fittings](gallery/inherited-2.png)
- [Sheet 3 · world props, fungi and forest](gallery/inherited-3.png)
- [Sheet 4 · meadow and woodland](gallery/inherited-4.png)

The dispositions below are provisional. Runtime attachment, collision, removal, replay, and measured performance must pass before a family is accepted. Same-geometry sample digests do not rule out variation in a separate instance transform.

| Inherited mesh | Disposition | Geometry review |
| --- | --- | --- |
| Agave rosette | Refine | Recognizable rosette. Sharpen the curved leaf tips and show differences among age variants. |
| Alpine wildflower | Refine | Slender long stems suit the alpine profile. Give the open petals support from below and keep a distinct color from the meadow flower. |
| Column cactus | Refine | Upright stem and separate branches read well. Add shallow ribs and check branch joints. |
| Desert bloom | Refine | Flower and leaves read from two sides. Resolve floating-looking petals and distinguish the leaf profile from the alpine flower. |
| Desert scrub | Refine | Distinct splayed shoots. The widest shoot gaps and sparse stems can lose the bush silhouette on mobile. |
| Dwarf juniper | Refine | Recognizable trunk and massing. Join branches to the trunk and give the foliage greater depth. |
| Frost fern | Refine | Frond silhouette reads in the oblique view. Add frost-specific detail that survives mobile scale. |
| Icicle spear | Rebuild | Plain tapered cone shares the stalactite profile. Give it angular ice facets and a credible attachment. |
| Prickly pear | Refine | Pads have good thickness but some read as disconnected polygons. Improve pad joints. |
| Saltgrass | Refine | Seed heads could distinguish it from snowgrass and sedge at gameplay distance. |
| Snowgrass | Refine | Narrow fan is coherent. Distinguish the blade posture and coating from other grasses. |
| Tumblebrush | Rebuild | Six radial sections read as a star. Replace with a sparse spherical lattice and a compact core. |
| Branching crystal cluster | Refine | Spikes lack convincing intersections and terminated crystal facets. |
| Cave rubble | Refine | Angular fragments read as rubble. Add broad, fractured surfaces and avoid the repeated pyramid outline. |
| Crystal shard | Rebuild | The source emits 16 degenerate triangles in a 32-triangle mesh and reads too similarly to the branching cluster. Preserve the distinct shard ID. |
| Geode opening | Refine | The large hollow is legible. Show an irregular outer host rock and improve the transition into the crystal rim. |
| Hanging stalactite | Rebuild | Generic cone opens into the ceiling. Use layered mineral growth and an irregular taper distinct from ice. |
| Mineral encrustation | Refine | Flat quadrilaterals leave conspicuous gaps. Build overlapping shallow crystalline facets that hug the wall. |
| Pebble scatter | Refine | Low count suits distance. Original pebbles look like pointed chips. Soften faceting and review dark cave contrast. |
| Small stalagmite | Rebuild | Uniform circular cone lacks a signature silhouette. Improve asymmetric growth and taper. |
| Cloth banner | Refine | Original broad cloth reads, but the rod includes four degenerate triangles and the cloth has no modeled detail. |
| Hanging chain | Refine | Alternating links read at close range. Add a credible link cross-section and verify each opening remains pick-through. |
| Hanging cobweb | Refine | Basic radial pattern works. Improve the corner anchor and visibility of connecting strands. |
| Rope coil | Rebuild | Open wall rings read as disconnected cutouts. Replace the cross-section with one continuous solid rope. |
| Signpost | Refine | Readable at mobile scale. Add thickness to the plank and close the post ends. |
| Bracken fern | Refine | Broad fronds differ from meadow fern. Connect the leaflets to a clear rachis. |
| Button mushroom | Refine | Strong silhouette for very few triangles. Give the cap a rounded button profile and vary cap size and color by variant. |
| Clover clump | Defer | Compare with clover patch and establish distinct placement or assign one shared slot while retaining both source IDs. |
| Clover patch | Defer | Lower profile than clover clump. Further gameplay distinction and ledger reconciliation are open. |
| Clustered toadstools | Refine | Cohesive three-cap silhouette. Distinguish stem contours and surface pattern from button mushroom. |
| Exposed root | Refine | Good low, branching footprint. Joint openings and abrupt segment ends need treatment. |
| Fallen branch | Refine | Trunk and fork are recognizable. Add a coherent break face and end caps. |
| Forest lichen patch | Refine | Patch feels tall and rocky. Flatten it against the mounting face and review the stone-specific palette. |
| Forest moss mat | Refine | Rectangular silhouette reads as a tile. Break up the edges and check for ground z-fighting. |
| Heather sprig | Refine | Repeating triangular florets convey a sprig. Improve variation and distinguish it from lavender. |
| Lavender spike | Refine | The vertical clustered stems read well. Improve the continuity of blooms around each stalk. |
| Low grass | Refine | Efficient low clump. Review blade visibility from head-on and edge-on approaches. |
| Meadow sedge | Refine | Broad upright blades read. Add the characteristic stalk/seed-head break in the silhouette. |
| Moss cushion | Defer | Resolve overlap with forest moss mat and confirm that the mound appearance is intentional. |
| Short fern | Refine | Slender, widely separated fronds look disconnected at grazing angles. |
| Single wildflower | Refine | Extremely economical silhouette. The stem is a single plane and fades to a line from the side. |
| Woodland sapling | Refine | Simple growth hierarchy is visible. Add credible joins and reconnect angular foliage to branches. |
| Woodland shrub | Refine | Broader than the sapling. Thin triangular leaf surfaces leave gaps through the crown. |

## Current decisions on inherited meshes

The original-source review above remains the record of what arrived from the five automation branches. The current candidate has changed 35 of those 43 meshes. All 43 have an in-game staging lifecycle, and the art decisions remain subject to the final parity and device pass. [Catalog evidence](catalog.md)

| Decision | Families |
| --- | --- |
| Rebuilt | Icicle spear, crystal shard, hanging stalactite, small stalagmite, rope coil, hanging cobweb and tumblebrush |
| Refined | Cloth banner, low grass, short fern, single wildflower, button mushroom, lavender spike, heather sprig, clover clump, meadow sedge, forest lichen patch, forest moss mat, signpost, hanging chain, desert bloom, frost fern, dwarf juniper, prickly pear, bracken fern, clover patch, clustered toadstools, exposed root, fallen branch, moss cushion, woodland sapling, woodland shrub, branching crystal cluster, geode opening and pebble scatter |
| Original geometry retained provisionally | Agave rosette, alpine wildflower, column cactus, desert scrub, saltgrass, snowgrass, cave rubble and mineral encrustation |

Earlier landscape frames showed the bracken and toadstools alongside richer authored foliage and fungi. The matched undergrowth views below verify revisions to six shapes and four previously aliased variants. The remaining biome and cave families still need a comparable habitat review. [Representative authored foliage and fungi](gallery/enchanted-fungi/manifest.json)

## First in-game comparisons

Both pairs use the original seed, camera position and mobile viewport. Aim shifted slightly to hit the revised geometry. The captures include the actual game, not the isolated mesh preview.

| Family | Original | Revised | Geometry cost |
| --- | --- | --- | --- |
| Cloth banner | [In-game original](gallery/banner-original.png) | [Refined](gallery/banner-refined.png) | 32 triangles with four degenerates → 112 triangles with none |
| Rope coil | [In-game original](gallery/rope-original.png) | [Rebuilt](gallery/rope-rebuilt.png) | 96 → 228 triangles |

The banner now has a cylindrical rail, modeled folds, trim and an inset emblem. The rope has closed ends and a continuous cross-section. Four bounded variants are distinct for both families. Both retained their instance identities, responded to the existing MINE touch control, and stayed removed after opening a fresh game page. The same test verifies that the ordinary schema-1 save bytes stay intact. Source and capture digests are in [the comparison manifest](gallery/fittings-comparison.json). Mobile GPU and frame-time parity remain open.

## Meadow and woodland refinement

The paired Chromium captures show eight inherited families in the original game at 932 × 430. Each view uses the same seed, anchors, variants and camera pose. The oblique view shows the rounder mushroom and catches the folded grass and fern against the terrain. Low grass and sedge still blend into similarly colored terrain at the longer view. Four distinct geometric variants per family retain the existing instance IDs. [Before manifest](gallery/foliage-refinement/before/manifest.json) · [After manifest](gallery/foliage-refinement/after/manifest.json)

| Family or scene | Before | After | Sample triangles |
| --- | --- | --- | --- |
| Mixed planting, front | [View](gallery/foliage-refinement/before/mixed-front.png) | [View](gallery/foliage-refinement/after/mixed-front.png) | 253 → 752 |
| Mixed planting, oblique | [View](gallery/foliage-refinement/before/mixed-oblique.png) | [View](gallery/foliage-refinement/after/mixed-oblique.png) | 253 → 752 |
| Low grass | [View](gallery/foliage-refinement/before/low-grass.png) | [View](gallery/foliage-refinement/after/low-grass.png) | 10 → 24 |
| Short fern | [View](gallery/foliage-refinement/before/short-fern.png) | [View](gallery/foliage-refinement/after/short-fern.png) | 48 → 160 |
| Single wildflower | [View](gallery/foliage-refinement/before/single-wildflower.png) | [View](gallery/foliage-refinement/after/single-wildflower.png) | 13 → 42 |
| Button mushroom | [View](gallery/foliage-refinement/before/button-mushroom.png) | [View](gallery/foliage-refinement/after/button-mushroom.png) | 32 → 96 |
| Lavender spike | [View](gallery/foliage-refinement/before/lavender-spike.png) | [View](gallery/foliage-refinement/after/lavender-spike.png) | 54 → 114 |
| Heather sprig | [View](gallery/foliage-refinement/before/heather-sprig.png) | [View](gallery/foliage-refinement/after/heather-sprig.png) | 50 → 168 |
| Clover clump | [View](gallery/foliage-refinement/before/clover-clump.png) | [View](gallery/foliage-refinement/after/clover-clump.png) | 32 → 64 |
| Meadow sedge | [View](gallery/foliage-refinement/before/meadow-sedge.png) | [View](gallery/foliage-refinement/after/meadow-sedge.png) | 14 → 84 |

At nine 32-bit floats per vertex, the sampled eight plants increase the one scenery batch from 27,324 to 81,216 bytes. The measurements describe geometry and upload size. Device frame times and final parity remain open.

## Forest floor refinement

The old moss read as a checkerboard tile in the near game view. The revised footprint is irregular, and the ridges sit low against the ground. The lichen now has separate curled lobes and a muted stone palette. The comparison uses the same standing eye, aim and anchors before and after. Both versions accepted the standard MINE control and preserved both removals on fresh pages. [Before manifest](gallery/forest-floor-refinement/before/manifest.json) · [After manifest](gallery/forest-floor-refinement/after/manifest.json)

| Family or scene | Before | After | Sample triangles |
| --- | --- | --- | --- |
| Forest moss mat | [View](gallery/forest-floor-refinement/before/forest-moss-mat.png) | [View](gallery/forest-floor-refinement/after/forest-moss-mat.png) | 40 → 38 |
| Forest lichen patch | [View](gallery/forest-floor-refinement/before/forest-lichen-patch.png) | [View](gallery/forest-floor-refinement/after/forest-lichen-patch.png) | 24 → 48 |
| Mixed oblique view | [View](gallery/forest-floor-refinement/before/mixed-oblique.png) | [View](gallery/forest-floor-refinement/after/mixed-oblique.png) | 64 → 86 |

The two-family sample used 6,912 packed vertex bytes before and 9,288 after. The revision removes the moss's coincident faces. Close-up silhouette is visible on the grass fixture. Final contrast on stone and at device-scale view distance is open.

## Distant foliage comparison

The same four plants use 332 triangles at close range in both builds. The distant pass uses 186 triangles. It flattens thin leaves and simplifies sedge seed heads within the same source bounds. The matched standing views preserve the grove composition at both distances. Individual blades are small at the distant pose. Chromium observed one batch and 25 terrain chunks at both distances, and the effect attached to the fern remained active. [Before source and observations](gallery/foliage-lod/before/manifest.json) · [After source and observations](gallery/foliage-lod/after/manifest.json)

| View | Before | After |
| --- | --- | --- |
| Near | [View](gallery/foliage-lod/before/near.png) | [View](gallery/foliage-lod/after/near.png) |
| Far | [View](gallery/foliage-lod/before/far.png) | [View](gallery/foliage-lod/after/far.png) |

## Signpost and chain refinement

The signpost now has a closed, subtly tapered post and a board with a visible arrow tip from either side. The chain's alternating links have three-dimensional cross-sections and open centers. The captures use the same seed, natural ground or ceiling mount, variant, standing eye and aim. Both versions accepted the original MINE control and stayed removed on reload. The signpost still blocks the player at the post and board, and the chain remains pass-through. [Before manifest](gallery/fittings-refinement/before/manifest.json) · [After manifest](gallery/fittings-refinement/after/manifest.json)

| Family | Before | After | Sample triangles |
| --- | --- | --- | --- |
| Signpost | [View](gallery/fittings-refinement/before/signpost.png) | [View](gallery/fittings-refinement/after/signpost.png) | 17 → 48 |
| Hanging chain | [View](gallery/fittings-refinement/before/hanging-chain.png) | [View](gallery/fittings-refinement/after/hanging-chain.png) | 128 → 252 |

The comparison pair uses 15,660 packed vertex bytes before and 32,400 after. Each family has four distinct variants. The native mesh checks verify closed edges, finite nondegenerate faces and the original orientation-bearing instance IDs. The chain stays within the 256-triangle budget.

## Desert and snow flora refinement

The desert bloom has a green anchored stalk, folded orange petals and a gold center that reads against sand. The frost fern has darker frond spines and pale ridges that remain visible against snow. The game captures use the same camera in each pair and wait for all 25 chunks around the new viewpoint before capture. Each plant was mined in its original biome, and its removal survived a fresh page with the existing world and profile bytes intact. [Before manifest](gallery/biome-flora-refinement/before/manifest.json) · [After manifest](gallery/biome-flora-refinement/after/manifest.json)

| Family | Before | After | Sample triangles |
| --- | --- | --- | --- |
| Desert bloom | [View](gallery/biome-flora-refinement/before/desert.png) | [View](gallery/biome-flora-refinement/after/desert.png) | 38 → 44 |
| Frost fern | [View](gallery/biome-flora-refinement/before/snow.png) | [View](gallery/biome-flora-refinement/after/snow.png) | 54 → 90 |

The two samples use 9,936 packed vertex bytes before and 14,472 after. Native tests check all four variants, every face pigment, the original instance IDs, finite nondegenerate geometry and the source bounds. Long-range readability remains open for the thinner fern tips.

## Tumblebrush rebuild

The old spokes now form rooted twigs with curved sides and cross-branches. The matched desert view shows space between the branches and a larger silhouette against sand. Both versions used the same natural mount, standing eye, aim and variant, and both removals persisted after a new page. The sample grows from 32 to 128 triangles, or 3,456 to 13,824 packed vertex bytes. Four variants preserve the original instance IDs. The result retains a faceted, open silhouette at the review distance. [Before capture](gallery/tumblebrush-refinement/before/desert.png) · [After capture](gallery/tumblebrush-refinement/after/desert.png) · [Replay manifest](gallery/tumblebrush-refinement/after/manifest.json)

## Luminous vine and lantern mushroom

The vine's blue-green tips and the lantern mushroom's orange cap rim use Mythwrought's existing opaque luminous material. The stem and unlit surfaces keep their normal shading. Both versions drew the ten-family scene in one batch of 140,940 GPU bytes with 25 terrain chunks loaded. The geometry and game MINE lifecycle stayed the same, and the ten removals survived a fresh page. The wall vine has a modest highlight change. The mushroom's alternating rim reads more clearly at the tested view. [Before manifest](gallery/enchanted-materials/before/manifest.json) · [After manifest](gallery/enchanted-materials/after/manifest.json)

| Family | Before | After |
| --- | --- | --- |
| Glowing vine | [View](gallery/enchanted-materials/before/glowing-vine.png) | [View](gallery/enchanted-materials/after/glowing-vine.png) |
| Lantern mushroom | [View](gallery/enchanted-materials/before/lantern-mushroom.png) | [View](gallery/enchanted-materials/after/lantern-mushroom.png) |

## Mountain juniper and desert prickly pear

The juniper has capped woody boughs and folded evergreen sprays. The prickly pear pads overlap at their joints and have thick, faceted faces. The matched mountain and desert captures each use the same natural mount, aim and render preset before and after. Both plants were removed with MINE and remained absent on a fresh game page. The schema-1 world, generation profile and matched removal records were verified across the reload.

| Family | Before | After | Sample triangles | GPU bytes |
| --- | --- | --- | --- | --- |
| Dwarf juniper | [Mountain view](gallery/dwarf-juniper/before/mountain.png) | [Mountain view](gallery/dwarf-juniper/after/mountain.png) | 48 → 128 | 5,184 → 13,824 |
| Prickly pear | [Desert view](gallery/prickly-pear/before/desert.png) | [Desert view](gallery/prickly-pear/after/desert.png) | 128 → 128 | 13,824 → 13,824 |

The juniper remains pass-through. The sampled prickly pear retains its four individual solid pad collision parts. Both captures used one scenery draw with 25 chunks loaded. The angled juniper branches and joined cactus pads are visible against the terrain. Device-scale performance remains open. [Juniper source and replay](gallery/dwarf-juniper/after/manifest.json) · [Prickly pear source and replay](gallery/prickly-pear/after/manifest.json)

## Undergrowth, fallen wood and previously aliased variants

Clover now forms low crowns with folded three-leaf profiles. Bracken has a joined rachis and alternating leaflets. Moss cushions sit in shallow irregular mounds, and the toadstools have separate modeled stems and cap rims. The roots and fallen branch use continuous rings with capped ends. Sapling, shrub, lichen and forest moss now expose distinct geometry for variant zero alongside their three existing variants.

| Family | Before | After | Sample triangles |
| --- | --- | --- | --- |
| Clover patch | [View](gallery/undergrowth/before/clover-patch.png) | [View](gallery/undergrowth/after/clover-patch.png) | 42 → 98 |
| Bracken fern | [View](gallery/undergrowth/before/bracken-fern.png) | [View](gallery/undergrowth/after/bracken-fern.png) | 56 → 190 |
| Moss cushion | [View](gallery/undergrowth/before/moss-cushion.png) | [View](gallery/undergrowth/after/moss-cushion.png) | 35 → 210 |
| Clustered toadstools | [View](gallery/undergrowth/before/clustered-toadstools.png) | [View](gallery/undergrowth/after/clustered-toadstools.png) | 63 → 126 |
| Exposed root | [View](gallery/undergrowth/before/exposed-root.png) | [View](gallery/undergrowth/after/exposed-root.png) | 60 → 108 |
| Fallen branch | [View](gallery/undergrowth/before/fallen-branch.png) | [View](gallery/undergrowth/after/fallen-branch.png) | 50 → 84 |
| Woodland sapling, variant zero | [View](gallery/undergrowth/before/woodland-sapling.png) | [View](gallery/undergrowth/after/woodland-sapling.png) | 68 → 68 |
| Woodland shrub, variant zero | [View](gallery/undergrowth/before/woodland-shrub.png) | [View](gallery/undergrowth/after/woodland-shrub.png) | 40 → 40 |
| Forest lichen patch, variant zero | [View](gallery/undergrowth/before/forest-lichen-patch.png) | [View](gallery/undergrowth/after/forest-lichen-patch.png) | 42 → 36 |
| Forest moss mat, variant zero | [View](gallery/undergrowth/before/forest-moss-mat.png) | [View](gallery/undergrowth/after/forest-moss-mat.png) | 38 → 36 |

The ten-family scene used one scenery draw and all 25 terrain chunks in both runs. The sample increased from 53,352 to 107,568 packed GPU bytes. Exact MINE removed all ten families, the removals survived a fresh page, the two removal records matched, and the nonempty schema-1 bytes were preserved. Native tests compare the 320 declared scenery variants for distinct geometry at the same seed and anchor and reject degenerate triangles. Final device frame-time and foliage readability at longer ranges remain open. [Before source and replay](gallery/undergrowth/before/manifest.json) · [After source and replay](gallery/undergrowth/after/manifest.json)

## Crystal, geode and pebble refinement

The cave cluster now uses joined hexagonal crystals with faceted terminations. Pebbles have broad uneven faces that catch the cave light. The geode has a layered host-rock rim and a visible purple seam around its open center. Before and after frames share the same eye, aim and natural rock mount.

| Family | Before | After | Sample triangles | GPU bytes |
| --- | --- | --- | --- | --- |
| Branching crystal cluster | [View](gallery/cave-art/before/branching-crystal-cluster.png) | [View](gallery/cave-art/after/branching-crystal-cluster.png) | 50 → 120 | 5,400 → 12,960 |
| Pebble scatter | [View](gallery/cave-art/before/pebble-scatter.png) | [View](gallery/cave-art/after/pebble-scatter.png) | 40 → 60 | 4,320 → 6,480 |
| Geode opening | [View](gallery/cave-art/before/geode-opening.png) | [View](gallery/cave-art/after/geode-opening.png) | 72 → 156 | 7,776 → 16,848 |

All three drew in one scenery call with 25 chunks loaded. The original MINE control released the cluster's body collision. The pebble site stayed pass-through. The wall-mounted geode retained its bounded solid rim, and native rays passed through the center. The geode's cave fixture verified removal and persistence while the surrounding terrain blocked direct entry at the wall cell. All three removals survived a new page, the two scenery records matched, and the nonempty schema-1 save bytes stayed intact. [Before source and replay](gallery/cave-art/before/manifest.json) · [After source and replay](gallery/cave-art/after/manifest.json)
