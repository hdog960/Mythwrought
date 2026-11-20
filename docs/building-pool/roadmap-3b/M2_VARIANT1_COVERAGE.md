# Builder 3B — M2 exact first-variant biome/size coverage

**DRAFT SOURCE ONLY. NO MERGE, NO DEPLOY, NO GAME/BUILDER RUNTIME WRITES.**

Latest accepted predecessor is PR #181 @ \`cde0014c81d39944411c548d741b595a8fea6df4\`,
exact-head [Actions #43779075666](https://github.com/hdog960/Mythwrought/actions/runs/43779075666):
735 root native and 60/60 3B native tests, 210 source-driven Chromium
software-WebGL2 cube-envelope diagnostics, no physical-family shape certification.
Original PR #122 and all 15 source-exact inherited watchtowers unchanged.

## Ten genuinely authored first-variant industry blueprints

| Original ID | Conceptual occupied voxels | Architectural layout |
|---|---:|---|
| r3:lumberyard:temperate:large:1 | 7,188 | Three-wing riverfront timber customs depot: oversized gable, sawtooth dry store and lean-to loading |
| r3:lumberyard:desert:medium:1 | 3,649 | Thick-walled stone caravan yard, separate shade screens, two flat porticos and a sloping storehouse |
| r3:lumberyard:snow:medium:1 | 4,464 | Unequal cross-roof snow bunker and snow-shed with sled turnover/frostproof racks |
| r3:lumberyard:enchanted-forest:large:1 | 7,121 | Large double arboretum with contrasting cross, terraced and sawtooth arbor roofs, central open grove |
| r3:lumberyard:mountain:small:1 | 3,308 | Tight cliff-cleft freight court with stepped retaining gallery and lean high-load shelf |
| r3:mill:temperate:large:1 | 11,465 | Multi-chamber riverfront guild millhouse: full gable, attached high mill bay, granary/drive partitions |
| r3:mill:desert:small:1 | 2,993 | Separated flat pergola quernhouse and narrow sun-driven shaft shelter, true grain/stone service rooms |
| r3:mill:snow:small:1 | 4,548 | Frostproof cross-pitched enclosed quernhouse with attached high stone shaft casing and winter stores |
| r3:mill:enchanted-forest:medium:1 | 6,558 | Separate gabled/cross-pitched livingwood granary, moon-grain work aisle and stone axle annex |
| r3:mill:mountain:large:1 | 12,203 | Stonegrain three-vault cliff monastery-mill: main terraced roof, additional tall gabled drive, reinforced face |
| **New batch** | **63,497** | 10 independent integer-coordinate plans |

Buildings use actual authored voxel cells, not hypothetical bounds, randomized seeds,
recolored copies, mirrored/rotated duplicates or names without interior geometry.
Each has real foundation, floor, walls, roof step-joints, multiple grounded
load-bearing pier columns, cargo/production fixtures, a 2-wide door, real
clearances and named reachable work areas. No extra floor is claimed as
accessible without a stairway. Small/medium/large are distinct spatial programs.

## Distribution after this batch — conditional on the new exact-head CI

Every one of five biomes × three sizes now has precisely one variant-1
**lumberyard** and one variant-1 **mill**:
- Lumberyards 15/60 (45 still unwritten: three additional *architecturally
  different* variants in every biome/size).
- Mills 15/60 (45 still unwritten, same per-slot quota).
- Original watchtowers 15/75 (60 still unwritten: four additional variants
  in every biome/size; original source identities protected).
- Barracks 0/60; Gatehouses 0/60; complete closed gated City Walls 0/45.
- **45/360 authored theoretical designs, 315 unwritten**; M2 45/195,
  M2 balance 150.
- Creator-final-accepted 0, production-integrated 0, world-deployed 0.

## Evidence gates
- \`m2-missing-sizes.test.mjs\` loads the **real Node source**, validates
  all 45 blueprints, 45 palette-independent unique fingerprints, exactly
  one variant-1 per biome/size/type, deterministic serialization, exact
  63,497-cell census, 2-wide physically grounded flood to each named
  work-area, 6-direction foundation connection for every authored voxel,
  actual roof pier support and 60 native mesh/camera configurations.
- \`m2-missing-sizes-dependencies.mjs\` reads the real already-integrated
  96-family/106-variant five-pack ABI and biome130 registry. Inspected
  default-north family shapes remain **only diagnostic**; numeric variants,
  yaw/orientation, state, physical multi-cell footprint, supports and
  actual live colliders are **not approved per cell**. Unregistered
  biome130:094/:096/:098 remain symbolic-only dependencies.
- \`m2-missing-sizes-chromium.test.mjs\` must genuinely run in Chromium
  software-WebGL2 with zero errors, confirm nonblank source geometry,
  and capture exactly **60 PNGs**: 10 new designs × exterior/cutaway ×
  667×375, 844×390, 932×430. WebGL2 *unit cubes* are not actual
  physical-family AABB meshes, premium art or live game rendering.
  **No screenshot count, native acceptance or CI success is claimed until
  the latest PR-head run and artifact are verified.**
- Prior 35 source designs and 210 Chromium cube-envelope diagnostics
  preserved unchanged. No gameplay AI, NPCs, crafting, harvesting,
  operated mills, wheel animations, runtime controls or save changes.

## Open blockers
Real variant/rotation/occupied-footprint selection, physical collision
and mount/support fit, source-authentic final family rendering, creator
artwork approval, and physical iPhone usability/performance. None
blocks continuing theoretical coordinate-authored work, but none
can be silently marked complete. Preserve v0.10 Gate A, locked v0.11
and all sibling lanes/automations.
