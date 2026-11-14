# Mythwrought Pack 2 — Timber & Infrastructure candidate ledger

**Governance:** [coordination Issue #109](https://github.com/hdog960/Mythwrought/issues/109) / seven authoritative docs / v0.10 Gate A, v0.11 locked.
**Status:** **10/18 distinct physical candidate families authored** (not integrated, merged, deployed or playable). 8 families remain.
**Latest checked main:** `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`; incorporation checkpoint **006**. Live IDs 0–8 only. Wood ID 4 is not a substitute for these independent candidate shapes.
**Draft PR:** https://github.com/hdog960/Mythwrought/pull/114
**Dedicated branch:** `manual-pack-2-timber-foundation-20261114`; see PR for live exact HEAD / CI.
**Exclusive provisional ID range:** 59–108. Only **59–68** allocated, and those IDs are not installed in the game. 255 reserved. No per-rotation/upper/lower/open/closed ID inflation.

## Roster-level asset progress

| Milestone | Roster | Candidate ID | Family / original visual and physical distinction | States | Status |
|---|---:|---:|---|---|---|
| M1 | 13 | 59 | Planed honey-oak planks with actual course seam triangles, full cube | 1 | Candidate |
| M1 | 14 | 60 | Peeled ash log, two-box rounded horizontal profile, pale long grain and end rings | 4 rotations | Candidate |
| M1 | 15 | 61 | Dark heartwood beam, slim core, expanded ironbound shoulders, physical collars | 4 rotations | Candidate |
| M1 | 22 | 62 | Vertical dovetailed support post with wide bearing collar and flared foot | 1 | Candidate |
| M2 | 16 | 63 | Oak half-slab, true lower or upper half-cell shape, horizontal planed seam art | lower/upper | Candidate |
| M2 | 17 | 64 | Genuine two-step stair with riser + upper tread | 4 rotations × 2 half-states | Candidate |
| M2 | 18 | 65 | Open two-rail timber fence, two vertical stakes and spaced rails, NOT bridge guardrail | 4 rotations | Candidate |
| M2 | 19 | 66 | Hinged latticed fence gate with physically different open vs closed rail AABBs | 4 rotations × 2 hinge states | Candidate |
| M2 | 20 | 67 | Single-cell carved hinged timber door leaf with actual swung-open collision shape | 4 rotations × 2 hinge states | Candidate |
| M2 | 21 | 68 | Hinge-mounted horizontal trapdoor that swings into a vertical physical panel | 4 rotations × 2 mounts × 2 hinge states | Candidate |
| M3 | 39–42 | — | Gravel, compacted dirt paths, cobblestone paving, decorative paving | — | Not started |
| M4 | 43–44, 46 | — | Bridge-specific reinforcement rail, wide stone parapet, elevated boardwalk | — | Not started |
| M5 | 45 | — | True water voxel requiring shared transparent fluid rules; NOT a static cyan cube | — | Not started |

**Physical evidence:** `definitions.mjs` and `joinery.mjs` expose genuine occupied local AABB unions that are independently ray-targetable/collidable when connected. Each exports original palette and actual triangle meshes, with surface details anchored to physical geometry. `fixture.mjs` can select, rotate, choose upper/lower, toggle hinges, place, ray-select, mine/remove, serialize and restore isolated candidate cells. Fixture snapshots preserve the old five-number record rows and use seven fields for new stateful joinery.

## Session 2 — Milestone 2 delivery (2026-11-14)

- [x] Rechecked newest main, source registry, checkpoint 006, Issue #109 and four coordination comments, same Pack 2 draft PR, and competing ownership/IDs in other 3 manual pack PRs.
- [x] All six joinery families (63–68), independent physical shapes and true state-dependent shapes. Rotations share IDs.
- [x] Safe pure state transition helper for gate/door/trapdoor without changing actual game interaction or engine.
- [x] Standalone fixture updated with stateful targeting, placement, open/close and backwards-compatible isolated fixture snapshots.
- [x] Original face-shaded physical triangle meshes and joint/grain highlights for all six.
- [x] Interactive browser gallery extended to all 10 assets, quarter-turn, half-variant, state toggle and placed-piece toggle.
- [x] 15 new dedicated joinery test cases, plus existing 12 material tests: **27/27 checked-in test functions passed in an isolated V8 compatibility harness**. This is not Node/Chromium certification and tests must be run directly under Node.
- [x] Candidate-specific engine handoff documented in `INTEGRATION_CONTRACT.md`; no changes to generic shared files.
- [ ] Genuine dedicated `node --test tests/block-packs/pack-2/*.test.mjs` execution in a checkout: not yet available through GitHub API; existing root CI glob does not include these nested tests.
- [ ] Actual integrated browser WebGL2 screenshot/performance/offline testing: blocked pending authorized engine integration. Isolated preview is Canvas 2D and not playable game proof.
- [ ] Real iPhone inspection and creator art/control approval: not claimed.

## Outstanding engine integration (manual incorporation only)

1. Live VoxelWorld ID limit still 0–8; extend only when centrally authorized and save-compatible.
2. Generic :00 shape-target/raycast/collision (opt-in [PR #106](https://github.com/hdog960/Mythwrought/pull/106)) and :12 shape descriptor/mesher ([PR #108](https://github.com/hdog960/Mythwrought/pull/108)) are separate engineering; Pack 2 may not edit or merge them.
3. Production shape mesh/collision/targeting must respect exposed surfaces, rotation, upper/lower, actual hinge position and player intersection.
4. Save schema-1 stores legacy `[x,y,z,id]`, no rotation/hinge state. Need central, opt-in metadata storage and atomic rollback, no migration of existing saves.
5. Hinges need engine-owned input, obstruction checks, animation and safe transitions. Standalone fixture state swaps are not production interaction implementation.
6. No world generation placement, roads, bridges, houses, settlements, inventories, mobs, harvesting, crafting or paid services.

## Session 3 / next incomplete milestone

**Milestone 3** — audit latest main/checkpoint/Issue #109/other pack manifests again, then create 39 gravel, 40 packed dirt paths, 41 shallow cobblestone paving, 42 decorative paving with distinct physical top profile and materials. Coordinate gravel falling physics with automation :00 and terrain with :24; do not implement a simulation in this pack. IDs 69–72 are *possible provisional candidates only*, not reserved until live duplicate-prevention audit. Continue maintaining PR #114; do not merge or deploy.
