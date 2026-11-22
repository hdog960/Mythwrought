# Builder 1A M1 — First Inn and source-geometry browser handoff

PR #180 remains DRAFT. Legacy PR #121 is read-only. Main e6bd7c1; incorporation checkpoint 009. Gate A OPEN; v0.11 LOCKED.

## Actual authored building
First new blueprint: **r1:inn:temperate:small:001**, Wayfarer's Lantern Inn (Temperate Small). **1,493 actual integer voxel anchors** within **17×12×18** XYZ footprint; real stone foundation, four-high wood-walled envelope, two 2-high clear hall-connected guestrooms, separate reception and commons, a central corridor with independent portals, 306 authored stepped gable roof tiles with underlay/backing, exterior porch and eight glazing openings. Two independent Pack5:082 beds use the source-authored wanderer-quilt physical variant and reserve adjacent +Z foot cells. One accessible floor; no pretend stairs, NPCs or functioning inn simulation.

## Exact-source evidence and physical audit
- Existing 30 source-exact house/tavern objects stay byte-for-byte untouched in 1A; Action 43768982035 passed 38/38 nested native and 735/735 root tests.
- The committed Inn also passes source native-schema validation as an isolated candidate; new exact PR-head GitHub CI is separately required.
- Source inspected: src/builder-assets/manual-five-pack.mjs and Pack2/3/4/5 physical adapters. They expose real collision/selection/visible bounds, orientation, Pack5 variant and support offsets. The producer marks productionRegistered:false and the dry-run planner is not a world writer.
- A dedicated 1A-owned physical source audit checks numerical/manual symbol resolution, roof backing, Pack4 pane yaw, Pack2 side-jamb door semantics and Pack5 multi-cell/floor support. **No claim of weather sealing, roof span engineering, real door sweep or actual save replay.**

## Browser evidence — accurately classified
- Six real local Chromium screenshots were produced: exterior and cutaway at 667×375, 844×390, and 932×430, with no page errors. Chromium failed to acquire WebGL2 in the local execution environment, so the captures use Canvas2D **source-coordinate proxy cuboids**, not real Pack meshes.
- Original source and committed Inn position, room, walkway and portal sequences had matching independent FNV-1a-64 fingerprints before rendering. The source-served gallery is in tests/building-pool/roadmap-1a/m1-inn-canvas.html.
- This renderer draws occupancy cells, not genuine source AABB shapes, actual light/weather, physical iPhone hardware or live-game content. A physical-family WebGL2 building-specific exterior/cutaway acceptance is still required.

## Counts and blockers
31/450 actual authored designs = 15 legacy houses + 15 legacy taverns + 1 independently authored Inn; 419 genuinely new designs remain. Creator accepted 0; integrated 0; deployed 0. Roof load/edge weather, hinge swept-clearance and schema-1 sidecars, pane seals/transparency, physical multi-cell placement, real builder WebGL2, and creator artwork approval stay OPEN.
