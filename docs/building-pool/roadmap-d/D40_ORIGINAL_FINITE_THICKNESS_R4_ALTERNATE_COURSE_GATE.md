# MYTHWROUGHT Builder D40 — finite-thickness exterior retaining strap, radius-four and lower-course study

23 November 2026. **Strict isolated original-source engineering only**; exact parent `9deb6fdd9bb4945315f7ae1abb52dd2906d62910`. D40 adds exactly two original-source helper modules, two new narrowly scoped tests, this handoff, and one isolated native Actions workflow. No registered physical owner, active game code, building source authors, Pack2 material variants, world, save, terrain, settlement or UI changes.

## Why D40 differs from D39

D38's Y5 and Y6 four-face neighborhood ring was vacant at only four of the 128 original tensile wall roots; this is necessary **only** for the tested single-course layout, not proof of every external scheme. D39's radius-three Y4/Y5/Y6, six-connected, projected-winding centerline search found **zero** full loops on the sixteen authentic W16/W17 buildings, while 107 rear sites were accessible. D39's route-level `fill()` checked 0.12-wide central volumes at **individual cells**, not necessarily the full edge or rounded elbow between them.

D40 adds a new deterministic bounded search with **continuous squared-prism geometry** on every six-connected edge. Each edge is swept from one integer-cell center to the next with a physical full cross-sectional thickness 0.16 world units (half-width .08) and **solid union at every corner**. Both endpoints and the entire intervening swept AABB are separately checked against:

- Every intersecting **original authored source voxel** in a strictly bounded local swept-volume cell scan;
- The conservative standing-player body in original Y2 WALK columns (0.6 wide and 2.5 high), **not** original stepPlayer, jumping, NPC collision, or live-world physics;
- The previously original-source cleared but still **unregistered** D36 socket's full AABB, not merely its center or a mesh-ray;
- Intact wall root, Y7 `live:wood`, source ownership and original parent context. The protected original wall column is excluded at all elevations.

A route must be closed in three dimensions by six-connected physical segments, have a **nonzero projected winding about the uncut original wall**, visit its actual rear-adjacent position at Y5 or Y6 and return to its original exposed front. A route that only brushes one wall face or has a blocked rear is not accepted. `inspectD40SweptOriginalWallRoute` tests two targeted configurations: radius four with Y4–Y6, and radius four with a genuinely **lower Y3 course** allowed. Y3 is a research alternative, not permission to obstruct authored pedestrian lanes. The same exact WALK envelopes veto any low route that crowds passage.

The previous D39 exact results are reused as test evidence, not rerun. D40's one new authentic W16/W17 source test independently checks inherited D38 4/4 vacant Y5/Y6 rings and 213/213 neighbor obstacles, along with 16 authors, 64 original bays, 128 tensile roots, roof/source identity, newly scanned radius-four decisions and newly sampled original native `validateShape`/`raycastShapes`/`inspectBodyFit` semantics. The second source test deliberately alters original wood, navigation, and approval to assert hard rejection.

## Physically meaningful but not a manufactured connector

`deriveD40UnregisteredStrapSegment` paints one squared-prism preview using the **unchanged original Pack2 ID61 metal palette**. This is explicitly **not the physical geometry, factory source mesh, rotation, new block ID, or palette mutation of ID61**. A separately derived 12-triangle box mesh is ray-checked against the analytic prism surface; a two-cell local-coordinate shape adapter splits the segment at exact voxel boundaries so the original runtime `validateShape`, `raycastShapes`, and `inspectBodyFit` functions can be exercised without writing or registering any world cell. This is only geometry adaptation; full connected-route native collision, actual gameplay construction, joint UV/endcap and WebGL2 remain untested.

Source-clear cell centers are insufficient: the pure tests explicitly create a narrow D36-like obstruction **between** two clear sampled endpoints, then verify the full swept edge is vetoed. The physical corner is a union of overlapping squares. The prototype never claims a smooth manufactured bent metal beam, validated bend radius, weld, bolt, pin, clamp, section inertia, fatigue limit, permitted transverse body pressure, or true socket-to-strap and strap-to-rear-wall mechanical attachment.

## Hard boundary: tensile retention remains unproved

The original mathematical D30 statics gives all 128 original roots positive **normalized tension under an artificial unit distributed load**, with no real original roof load. Even a spatially complete loop and a geometrically clear rear face do not establish:

1. Approved original Pack2 owner/registered descriptor for the complete strap, bend, retainer or fastener;
2. Mechanically closed and tested *socket-to-strap-to-rear-retainer* topology with actual mechanical fastener;
3. Tested true wall-to-foundation axial uplift/pullout, roof gravity and uplift, shear, buckling, original load cycles and material limits;
4. Actual original block collider/selection/UV/end-cap mesh, player/NPC `stepPlayer`, original WebGL2 and installed iPhone PWA frame-time/offline acceptance.

All requested/claimed evidence IDs, user-supplied numeric capacities, touching areas, mesh colors and clean source space leave `constructionAllowed=false` and load strength `null`. An obstruction to this **specific radius-four/Y3–Y6, 0.16-thick, six-connected, rigid-square prism layout** is not a global theorem about all possible future anchors.

Every original authored cell, the original live Y7 wood and upper tiers, authored walking, original Pack owners and registered IDs, 3,644 D4 checks, 285 source IDs including 132 provisional, and all 59,412 uncertified distant roof cells in 34 zones remain untouched. **No merge, deployment, outside-branch edits or automation mutation.**

## Focused CI

One new push-only, branch-only GitHub Actions workflow pins the exact parent/source blobs. It executes only D40's four pure tests and two W16/W17 source-native tests on Node 22; prior D25–D39 exact-commit successful suites and broad WebGL/browser jobs are not repeated. New native source logs (not hypothetical local fixtures) are required before reporting genuine counts. The technical next stage depends on those counts and creator/Pack owner approval of independent physical anchors rather than simply expanding search until an untested geometry passes.
