# MYTHWROUGHT Builder D31 — owner-derived oblique truss and original-source player clearance

**22 November 2026. Isolated source-only, unregistered geometry and audit.** Parent commit `e5cb25c97ce6cd9c223e8fb79c1046f69253797e`, protected main and draft PRs untouched. No world placement, save writes, settlement, production, source Wave16/17 edits, 285 source ID changes (132 remain provisional), Pack2 owner changes, other developer or automation changes, D4 threshold modifications, or merges/deployments.

## The defect D31 investigates

The previously validated D30 statics has 2,516 ideal pin-truss members over 64 long-bay geometry proposals in original 16 buildings. Those normalized mathematical centerlines are NOT collision or real timber members. Original Pack2 ID61 is a **one-block, axis-aligned** 3-box beam, with 156 authored texture/color triangles; ID62 is a distinct **one-block vertical** 3-box post. Neither has an approved oblique, multi-block or force-rated joint variant. Calling all D30 centerlines “placeable Pack2 beams” is false even if Y5/Y6 full-course centerlines are empty.

D31 performs a new original-geometry engineering screen. A derived, explicitly unregistered oblique preview transforms **all three original ID61 owned boxes** along the D30 chord or diagonal centerline, retaining original 0.48-body cross-section and 0.60-collar section. Original ID62 post boxes are used separately for genuine vertical-web shapes. No source pack, numeric block ID, original author material, original wood roof or save is changed. **Longitudinal scaling of ID61 to multi-cell lengths is a proposed derivative, not original Pack2 physical geometry.** Only a future explicitly authored/approved physical variant can implement it.

### Geometry and actual source compatibility

- `d31-pack2-owner-oblique-preview.mjs`: 3D oblique section sweep, 3 owner OBBs per member, exact 15-axis SAT against authored full-cell source, exact 15-axis OBB-vs-OBB for joint overlaps, analytic 3-box ray, and transformation of authentic source mesh `positions/colors/indices` with preserved colors. Source owner ID61/ID62 functions remain unchanged. The stored collision boxes are *oriented*, and therefore **cannot** be installed into the game's 32-local-axis-aligned-box registry without a new architecture and review.
- `d31-original-pack2-web-envelope-audit.mjs`: directly imports original Pack2 definitions, original registered collision adapters, original runtime `BLOCK.WOOD`, exact original D29 long-bay routes, D30 centerline and static model. Checks each member against every actual original authored cell inside a bounded physical AABB, not merely the source centerline. Counts genuine source wall/pocket overlaps, other authored-cell clashes, neighboring upper-tier roof contact, player WALK corridor envelope interference, and overlapping incident owner-box pairs at theoretical pin joints. Does not interpret those physical overlaps as approved joints.
- Actual live collision and picking remain **untested**. The sampled conservative WALK-probe is one 0.6-wide × 2.5-high standing body above original Y2, **not** a certified game character/NPC envelope. The selected exact original owner's source mesh and analytic box-ray must agree to within 0.004 world cells; this is preview parity only, not a WebGL2 picking gate.
- Outward top-chord faces end below the Y7 live:wood original full cube; attachment continues to require real D26/D27 ID62 cut-post connectors. These were geometric previews only and are not installed/rated.
- Every building retains all authored cells, Y7 weather-plane `live:wood`, Y8/Y9 tiers, navigation, windows, fixtures and all 285 ID ownership; no new physical blocks.

### Structural and release gate (unconditionally closed)

Even collision-clear hypothetical members would need a real approved source-owner-specific diagonal mesh and collider, manufacturer/creator-rated axial tension and compression, buckling restraint, end-bearing seating, joint pin strength, tie/roof attachment and lateral braces, genuine live-wood roof gravity/uplift loads, and actual source/terrain footing capacity. D31 **never** sets `constructionAllowed=true`, and neither the numeric D30 statics nor calculated source overlap is capacity evidence. If a root wall must be cut for a socket, an entirely new source-authorized architecture/navigation review is required before any changes.

No roof-wide certification: 59,412 roof cells in 34 distant zones remain uncertified, along with 3,644 strict bidirectional D4 comparisons, original runtime visual/picking/physics validation, original WebGL2 and installed iPhone Home Screen PWA/offline performance.

### Tests

The new pure suite tests X/Z actual-section diagonal geometry, full OBB collision SAT, mesh/RGB and analytic picking parity, invalid owner/count, and original vertical ID62. The original-native suite independently generates all 16 genuine source buildings, reconciles the exact D30 64 long bays/2,516 ideal members/1,354 theoretical joint nodes and source-owner geometry, samples original owner 156-triangle colored mesh, checks every authored source cell/body-probe and reports per-building genuine collisions. It also tests altered source wood/approval/walking evidence. Source access is via one narrow GitHub Actions checkout on the isolated D31 branch. D25–D30 already verified on previous exact commits; no repeated broad CI or browser suites.

The follow-on D32 should focus on any measured original pocket/adjacent-cell intersections and **independently sourced** real joint fabrication. Never silently trim original Y7 wood, existing wall, navigation or source ID registry to fit a proposed truss.
