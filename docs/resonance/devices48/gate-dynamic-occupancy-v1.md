# :48 dynamic gate occupancy v1 — SOURCE ONLY

A deterministic, opt-in, **two-snapshot** candidate preflight for gate paths. Requires consecutive ticks and identical world IDs. A gate remains blocked when an actor was present at either snapshot, including actors entering or leaving the path. Static obstacles are also checked. All paths and intents are validated by the existing :48 clearance preflight. Bounded to 16 gates, 64 actors per snapshot, 256 obstacles and 32 swept boxes per gate.

**Not a continuous sweep:** an actor could cross between samples, occupancy could change after the last sample, and the source does not bind to authoritative physics, live actors, energy receipts, world edits or saves. Even a clear result has movementAuthorized=false, physicsBound=false, authoritativeDelivery=false and productionBound=false. Never use this module to actuate a real gate.

Focused command: `node --test tests/resonance-devices48-gate-dynamic-occupancy.test.mjs`. No protected production or other-owner files changed.
