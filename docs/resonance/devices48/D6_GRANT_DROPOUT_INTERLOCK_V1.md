# D6 grant-dropout advisory interlock v1

Isolated :48 source-only device safety proposal. Consumes **untrusted** normalized grant frames; it is not a :36 allocation implementation, an authenticated :36 contract, a collision/physics bridge, or an actor controller. The real network contract remains unverified.

A device with an insufficient or missing grant is marked stopped. A skipped tick interval larger than the configured bound is also stopped even when the next frame advertises full power; a subsequent consecutive sufficient grant may recover. Invalid, duplicate, nonmonotonic, fractional or oversized input fails closed by throwing. All results are immutable, deterministic and explicitly non-authoritative. No player motion or world edits are permitted.

Limits: 1–32 frames, 16 unique grants per frame, 0–64 units per grant, 1–64 required units, 1–32 maximum tick gap. These are fixture limits, not claimed production budgets.

Run: `node --test tests/resonance-devices48-grant-dropout-interlock-v1.mjs`.

Integration prerequisites: exact-SHA authenticated :36 grants, real actor state/stop behavior, save compatibility and physical occupancy validation. No production registration, renderer, save, inventory, or settlement changes.
