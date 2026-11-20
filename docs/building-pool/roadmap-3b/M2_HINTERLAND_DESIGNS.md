# Builder 3B — M2 Eight-Design Hinterland Expansion

**Draft, unmerged, undeployed.** This work is exclusively within the three
Builder 3B-owned source/test/docs prefixes. It does not edit original PR #122,
any sibling builder/Creative Mode path, the five manual packs, automated
biome130, five hourly automations, main, runtime, saved worlds, CI or Pages.

## Eight genuinely separate voxel-coordinate industrial spatial programs

| Source blueprint ID | Exact authored positions | Physical envelope W×D×H | Design program |
|---|---:|---|---|
| r3:lumberyard:desert:large:1 | 5,483 | 46×41×28 | Large Karez quadrangle with independent sandstone sun vault and sawtooth loading portico |
| r3:lumberyard:snow:large:1 | 5,534 | 44×39×30 | Avalanche-baffled heavy winter sled court with sheltered log vault and terraced freight shed |
| r3:lumberyard:enchanted-forest:small:1 | 1,818 | 26×25×21 | Compact twin trellis and asymmetric grove herbwood-drying yard |
| r3:lumberyard:mountain:medium:1 | 3,971 | 36×34×27 | Retaining rock face and cantilevered shelf roof, separate quarry-freight ledge |
| r3:mill:desert:large:1 | 9,173 | 48×42×32 | Fully roofed broad grain/millstone/wind-axle facility, with actual cross-partitions |
| r3:mill:snow:large:1 | 8,948 | 46×43×33 | Snowproof broad-gabled hall with separate grain vault and frost-drive room |
| r3:mill:enchanted-forest:small:1 | 3,404 | 28×27×25 | Narrow two-roof fae grain and moonwater mill; intentionally open center roof seam |
| r3:mill:mountain:medium:1 | 6,110 | 38×36×30 | Thick rock millhouse and stepped roof, distinct granary / stone-grind / cliffshaft vaults |
| **Eight new source candidates** | **44,441** | | |

These are *full deterministic voxel-cell lists built from independently
authored coordinate envelopes and feature programs*, not names, colored boxes,
random seeds, palette swaps or merely flipped copies.

The three broad-roofed desert, snow and mountain mills have independent interior roof piers (40, 44 and 52 actual additional supported positions). All eight share only reusable physical-construction primitives that explicitly
expand foundations, floors, full perimeter walls, roof joints and load-bearing
posts. Each has its own authored roof spans/profile(s), partitions, load-bearing
pier footprints, pallets, stoneworks, room identities and work cargo positions.
Concrete two-wide grounded passage reservations and entry/room graph preserve
real standing headroom. Wall, roof, stone supports and fixtures must be
face-connected through occupied cells back to actual foundation coordinates.

## Counts — conditional on *new exact-head* CI
- Legacy source-identical watchtowers: 15/75 (unchanged, source-exact).
- Lumberyards: 10/60, Mills: 10/60.
- Barracks: 0/60, Gatehouses: 0/60, complete gated City Walls: 0/45.
- **35/360 theoretical coordinate-authored; 325 remaining.**
- Creator-final-approved **0**, integrated/world-placed **0**, deployed **0**.

## Verification gates
- m2-hinterland.test.mjs: full 35-design 3B pool, names and unique
  palette-agnostic fingerprints, 44,441 source-authored occupied cells,
  identical canonical serializations, real supported two-wide ground-level
  entrance-to-room flood, 6-face structural connectivity, 48 viewport ×
  source-cube-mesh camera combinations.
- m2-hinterland-dependencies.mjs: real main integrated 96 family symbols / 106
  numeric manual physical variants, exact registered biome130 shapes and
  pending symbolic biome130:094/:096/:098. One diagnostic default-north
  shape per family is NOT an approved per-cell numeric variant, yaw, support,
  multi-voxel occupied reservation, actual collider, texture or world interface.
- m2-hinterland-chromium.test.mjs: eight real source-rendered blueprint IDs ×
  exterior/cutaway × three landscapes 667×375/844×390/932×430 = **48 genuine
  Chromium WebGL2 cube-envelope views**, nonblank readback, zero GPU errors,
  PNGs and acceptance.json. **No browser acceptance claimed until exact-head
  run and screenshot artifact are verified.**
- Previous 27 blueprints and 162 source-driven WebGL2 captures remain untouched.
- A real physical-family WebGL2 renderer, original premium block artwork,
  item support/mount/collision/footprint, fluid/saw/wind/operating mills and
  actual physical-iPhone review are still NOT certified.
- No final work is considered creator-approved or live-integrated. Retain PR
  draft state and v0.11 locked; Gate A remains open.
