# :48 D2 lift intertick occupancy v1 — source only

Conservative, deterministic two-snapshot actor sweep for a candidate vertical lift. Actor endpoints are combined into axis-aligned envelopes, so an actor crossing the platform path between samples can block a candidate even when neither endpoint overlaps. Newly appearing and disappearing actors are included. Duplicate identities, stale ticks, invalid bounds, excessive movement and combined rosters above 64 fail closed. Static obstacles are delegated to the existing lift-stop preflight.

**Not a live physics or passenger bridge.** This can overblock diagonal paths and cannot prove continuous safety between samples or after the latest snapshot. Even a clear candidate has `movementAuthorized:false`, `passengerTransportAuthorized:false`, `continuousCollisionProven:false`, `authoritativeDelivery:false` and `productionBound:false`. Never move or carry a player, modify blocks, or energize a lift from this output. Authoritative :36 receipts and owner-approved physics/collision remain mandatory. No settlements, renderer, saves, inventory, or production changes.

Focused command: `node --test tests/resonance-devices48-lift-intertick-occupancy.test.mjs`. This does not provide WebGL2 or iPhone evidence.
