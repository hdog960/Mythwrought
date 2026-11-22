# :48 candidate gate clearance preflight v1 — SOURCE ONLY

This bounded deterministic fixture accepts D1 gate intent objects, integer-grid swept AABBs, static obstacles and actor occupancy. It rejects malformed boxes, duplicate IDs, missing paths and forged authorization. Positive-volume overlap is considered blocked; face-touching alone is not. At most 16 gates, 32 swept boxes per gate, 256 obstacles and 64 actors.

**Never** interpret `candidatePathClear` as collision approval. Every result explicitly sets `movementAuthorized`, `collisionCleared`, `authoritativeDelivery`, `physicsBound`, and `productionBound` to false. This is not a real-time dynamic actor sweep, not a voxel edit, not a renderer, and not a save bridge. It must not operate production gates.

Focused test: `node --test tests/resonance-devices48-gate-clearance-preflight.test.mjs`. Authoritative :36 delivery receipts and owner-approved live collision/physics hooks remain prerequisites. No edits to :24/:36, player physics, main, settlements, or protected assets.
