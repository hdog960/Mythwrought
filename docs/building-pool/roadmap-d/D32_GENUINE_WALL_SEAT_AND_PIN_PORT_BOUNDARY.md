# MYTHWROUGHT Builder D32 — source-preserving real owner wall seats and unrated pin-joint clearances

2026-11-22. Strict isolated source engineering. Parent `5ccc2348493b4fe2505b100e324ddffe7cdab3e4` on `builder-d-d31-original-pack2-oblique-web-isolated-20261122`. The separate D32 branch contains **only two new source files, two focused tests, one documentation file, and one push-only narrow workflow**. No runtime, building author, original Pack2 source or world/save change.

## Real defect and distinction

Native D31 original W16/W17 found 64 long-bay truss proposals across 16 actual source buildings, 2,516 Pack2-ID61/62-derived member envelopes, 1,354 pin nodes, **256 positive-volume intersection samples with rooted original bearing wall cells**, and **6,002 incident member pair intersections** at hypothetical pins. Those collisions cannot be ignored as fasteners. D30 normalized statics have **no actual tested materials, roof load, slenderness, joint stiffness, lateral restraints, or foundation capacity** and confer NO authority to construct.

D32 adds an **exact material-owner OBB axial clip**, applied separately to each of the actual three-part Pack2 ID61 beam geometry and three-part ID62 post geometry. It retains source transverse box shapes and adjusts longitudinal OBB intervals; it does not carve or edit original wall cells. For members incident at an original two-foundation-backed bearing, a bounded binary search finds the minimum member-end retreat needed to avoid positive-volume overlap with **both actual Y5 and Y6 wall cells**. The physically trimmed face intentionally has a tiny positive clearance; therefore even a perfectly flush-looking horizontal chord does **not have certified positive-area wall bearing contact**. An oblique diagonal trimmed perpendicular to its own axis will not form a wall-parallel positive-area end face. Both require future explicitly authored metal/wood seating or sockets and tested axial/uplift transfer. A detected zero-overlap is **not a rated joint**.

For internal pin nodes D32 independently trims an experimental 0.35-cell axial segment from the ends of each member and counts **both unmodified and remaining OBB pair overlaps** using D31's source-owned 15-axis separating-axis collision test. Any reduced overlaps leave an **open, unbuilt joint gap**, not a resolved, connected joint. The cut geometry is unregistered, has no authored end-cap rendering, and has **no original game pick/collision or WebGL2 parity**; original colors/source mesh ownership are retained only as a provenance requirement, never claimed as a finished graphic. Original ID61/62 byte-for-byte source cannot be silently replaced by made-up beveled blocks or new IDs.

## Hard safety gates

- Real original W16/W17 blueprints only; original Pack2 ID61/62 source IDs/shapes authenticated, original `BLOCK.WOOD=4` required.
- Exact D25–D30 original walking, Y5/Y6 corridor, rooted wall and Y7 live:wood roof gate retained by real original-source imports. D31 source geometry functions are imported unchanged; prior exact D31 CI is reused, not duplicated.
- Neither source nor original walking/roof/cave/settlement logic is ever edited; no `world.set`, registration, block ID, additional settlement, player physics or save mutation.
- If a member cannot be clipped off a real wall within a strict 1.5-cell search bound, it remains **unseatable**, not constructed. Out-of-budget geometry, counterfeit owner, missing walk node, altered roof asset, unapproved original source and wall-loss cases fail closed.
- End-cap face/picking geometry is unimplemented. Section capacity, tension, compression, shear, buckling, verified pin/joint connector, roof diaphragm, foundation reactions, actual vertical/lateral loads, cover/collision/placement and iPhone PWA/WebGL2 remain unknown. No structural acceptance in D32.
- The 59,412 far roof cells in 34 source regions remain **structurally uncertified**, regardless of improved *proximity* calculations. All 3,644 strict bidirectional D4 checks, 285 source IDs including 132 provisional, Pack1–5 owners and release gates remain unchanged.

## CI and handoff

One push-only new D32 native workflow uses the complete original checkout and validates the exact D31 parent, W16/W17 Git blobs, Pack2 original source ID registry owner, runtime WOOD source, and unchanged D31 sources. It executes **only the four new pure tests plus two new original W16/W17 source tests**, not historical D25–D31 suites or broad GitHub Actions/UI. Source test logs print counts of source-owner wall seat clearances, old vs remaining overlapping pins, original 16-building source geometry and all remaining hard safety gates.

Next development should design a **genuine separate joint material and collision/mesh owner** or prove geometric infeasibility of safe original-source wall sockets; do not accept a trimmed member or intentional gap as real load transfer. Full source-approved angled support members, tested rated connection strengths, game collision/picking/renderer behavior, and player-admissible runtime placement all remain necessary.
