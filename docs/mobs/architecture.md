# Mob Foundation architecture

## M0 source and ownership

The isolated local branch is `mob-foundation`. Its verified production base is
`e9223217ef1e91d282900c3fc13a21eeda316b63` from `hdog960/Mythwrought`.
The checkout is at `/workspace/work/mythwrought-mob-foundation`.

Write scope is `src/mobs/`, `tests/mobs/`, `docs/mobs/`, and
`mob-preview/`, with an optional dedicated workflow for evidence. Builders
A/B/C, their source lanes, caves, biome and sky systems, Creative Mode, hourly
automations, production UI, and the PWA remain owned by their existing lanes.
The Pages workflow publishes on a push to main or manual dispatch. The mob
branch will only be eligible for a draft PR after validation. Gate A and the
v0.11 lock are governed by the existing roadmap and release ledger.

The application uses native ESM and a static server. The existing test stack
uses Node's test runner plus pinned Playwright and PNGJS for browser evidence.
The mob runtime requires no new external dependencies or assets.

## World interface

The adapter returns collision, ground support, line of sight, section residency,
an edit revision, and environmental observations for bounded world-space
queries. Coordinates use signed voxel units. Position is the center of the
horizontal footprint at the feet. Body dimensions come from the species
registry. Depth bounds and residency use `depth.mjs`, including its expanded
minimum. The legacy minimum exported by `voxel.mjs` is a generator contract.

`VoxelWorld.get`, `rotationAt`, and the existing biome collision boxes provide
base terrain geometry. `Pack2LiveWorld.getPack2State` and
`pack2BodyIntersects` supply actual open/rotated shape collision. The adapter
consults Pack 3's body fit and the installed Manual 1/4 and Pack 5 collision
callbacks. This follows the geometry authority in `voxel.mjs`; the exported
`collides` specializes that logic to a fixed player-sized body. The entity
adapter accepts species-sized bounds. Unknown residency or unknown required
shape state blocks movement. Water remains passable geometry and may be marked
as a hazard by the host. Host-supplied habitat, light, hazard, and interactive
object observations are read-only. An explicitly approved object command is a
separate, capability-checked service with no generic voxel write operation.

Ground, collision, and traversal probes share geometry. Local three-dimensional
routes have fixed radius and work limits, and edits or residency changes
invalidate routes. The host owns revision and residency notifications. Missing
environmental metadata fails closed for spawn eligibility.

## Simulation and rendering

A fixed-step entity engine owns stable runtime IDs, seeded random streams,
health, movement, lifecycle, events, and bounded entity work. Ecology owns
replenishment and residency transitions. Bonded identity ownership is separate
from ordinary population counts. Combat and companion behavior consume the same
movement and sensing contracts. Rendering consumes snapshots and keeps its own
GPU resources. No system imports the production entry point or calls browser
storage, journals, backups, or import/export writers.

The standalone preview starts from an in-memory production-compatible seeded
world with disposable fixtures. It can use production voxel/depth mesh buffers
and the existing pixel budget while creating a separate WebGL2 context and mob
draw pass. Context loss pauses drawing and restore rebuilds preview buffers.
Production adoption would require approval for frame scheduling, streamed
residency and revision wiring, object authorization, lifecycle hooks, UI,
and a separately versioned companion persistence design.

## Milestone and verification dependencies

M1 fixes symbolic registry IDs and validates all descriptors. M2 uses them to
build deterministic entities against real signed-coordinate voxel fixtures.
M3 shares M2's physics for navigation, sensing, and behaviors. M4 owns spawning
and admission budgets. M5 adds target contracts, damage, and approved object
requests. M6 adds companion identity and rescue. M7 adds browser controls and
GPU resources after the native scenarios work. M8 runs native coverage, the
existing repository regression gates, and Chromium evidence at four sizes
from one exact source. Preview measurements must include an equal no-mob
baseline. Browser evidence is separate from the creator's physical iPhone
Safari and Home Screen acceptance.

Use seeded tests against real `VoxelWorld` and Pack 2 fixtures, including thin
geometry, signed chunk seams, depth, revisions, and schema-1 byte comparisons.
Use the existing Chromium conventions for real rendered screenshot validation,
context recovery, and image dimensions, with the original Playwright gates
covering the protected production game.

## Baseline evidence

On the starting SHA, the syntax check of `src/main.mjs` passed. The focused
baseline command below passed 60 tests with zero failures.

```sh
node --test tests/{physics,depth,persistence,voxel-shape-interactions,gpu-recovery,render-budget}.test.mjs
```

The original `npm test` run emitted a failure in
`G2B six-size genuine WebGL2 and live-flight browser acceptance` after 450.9
seconds. That existing test was waiting for the Pack 2 browser manifest. The
Pack 2 test began after the G2B wait expired in this two-CPU local environment.

The complete original run exited 1 with **924 passed and 1 failed** out of 925
tests. Pack 2 passed within that run. G2B's failure was a prerequisite timing
failure on the verified production baseline. A fresh paired Pack 2/G2B run is
needed before declaring the browser gate green.

M0 verification is complete with this recorded baseline defect. Isolated
development can proceed. Publishing remains gated on the required verification.
