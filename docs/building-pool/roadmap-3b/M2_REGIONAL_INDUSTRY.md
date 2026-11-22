# Builder 3B: M2 regional industry source-authored expansion

DRAFT PR #181, unmerged, undeployed. Only Builder 3B-owned source, test and docs.
All building instances are theoretical. There are no functioning saws, mills,
waterwheel drives, NPCs, crafting, world placement or save edits.

## Verified M1 and existing M2 baseline
- Original PR #122 is read-only; all 15 source-exact watchtowers retained.
- M1 source-authentic watchtower Chromium WebGL2 diagnostic cube views: 90/90
  across 667x375, 844x390, and 932x430, artifact #14184412608.
- Exact existing-M2 baseline at commit ec107f27b3bc8543dfdc310c7cea6e365071c054
  passed 735 root Node tests, 32 focused 3B native tests, and 90 tower previews
  at CI #43772228551.
- First two original authored designs: Temperate Small Lumberyard (1,479 cells),
  Temperate Small Mill (2,703 cells). The independent new M2 Chromium source
  preview for these exact two buildings checks 12 WebGL2 exterior/cutaway views
  at the same three landscape viewports; it is NOT the final physical-family renderer.

## Four additional distinctive coordinate-authored M2 candidates

| Building ID | Actual voxel-coordinate cells | Envelope width x depth x height | Original architecture |
|---|---:|---|---|
| r3:lumberyard:temperate:medium:1 | 2767 | 32x29x20 | Gabled western four-post warehouse, east open freight court, separated covered racks / plank staging / loading routes |
| r3:lumberyard:desert:small:1 | 1806 | 26x22x17 | Stone windbreak courtyard and flat four-column pergola with separate sun-drying and sandstone cart pads |
| r3:mill:temperate:medium:1 | 4000 | 31x28x24 | Three-room grain/processing/axle millhouse with wide gables, roof supports and a central two-voxel freight route |
| r3:mill:mountain:small:1 | 2692 | 23x25x22 | Asymmetric twin-height terraced mill roof, stone grain vault, isolated drive bay and rocky milling floor |

All four designs were individually authored using purpose-specific coordinate loops.
They are NOT palette swaps, mirrors, rotations, shape-resized clones or mere outlines.
Every room has a named circulation node, the entrance has a 2-wide clear opening, and
all structural cells are checked by a face-adjacent flood from stone foundation.
Their source structures require per-cell final variant/orientation/support verification.

## Accounting, pending exact-new-head CI
- Lumberyards 3/60: Temperate Small, Temperate Medium, Desert Small.
- Mills 3/60: Temperate Small, Temperate Medium, Mountain Small.
- Watchtowers 15/75: original 15, source-exact, five biomes x three sizes.
- Barracks 0/60; Gatehouses 0/60; complete City Walls 0/45.
- Total authored 21/360, remaining 339; creator-final-approved 0;
  integrated/deployed 0; no physical-iPhone or premium-art approval.

## Tests and dependency handoff
- m2-regional.test.mjs: 21 unique IDs and fingerprints; 4 new architectural
  volumetric counts; deterministic serialized geometry; real grounded two-wide
  all-room flood; supported roof/columns via 6-neighbor foundation connectivity;
  24 mathematical native viewport/mesh checks (NOT browser screenshots).
- m2-dependency-review.mjs: reads the real 96-family, 106-physical-variant
  manually integrated five-pack builder ABI, and actual biome130 registration.
  All per-cell yaw, variant, occupancy/multicell overlaps, support and collision
  remain UNRESOLVED even if one diagnostic default family shape exists.
- None of these files writes to world, runtime registry, saves, common assets,
  automations, siblings, checkpoints, or GitHub Pages.
- The four newly authored regionals have not yet been approved in real Chromium
  or visually reviewed by creator; regionals are source-only candidates.

## Exact-head release gates remain locked
Never merge or deploy this PR; preserve original #122, the other 7 builders,
the manual five packs, automated biome130, five independent hourly lanes, schema-1
saves, v0.10 Gate A open and v0.11 locked. Final manual family collider,
support/placement, genuine physical shape renderer, actual iPhone and art review
belong to later creator-authorized integration, not this builder.
