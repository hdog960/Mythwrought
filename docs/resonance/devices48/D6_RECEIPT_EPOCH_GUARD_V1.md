# D6 receipt epoch guard v1 — isolated :48 source only

This opt-in adapter checks chronological continuity of *untrusted* :36-shaped delivery receipt fixtures. It never claims the fixtures are authentic delivery, does not allocate power, and cannot drive gameplay, physics, saves, rendering, or inventory.

Inputs must explicitly pin a network source SHA and a versioned receipt contract. Each frame requires a matching seed, source SHA, contract, strictly increasing safe-integer tick, productionBound:false, at most 16 unique device IDs, <=64 units per device and <=256 total units. History is bounded to 32 frames. Output is deterministic, deeply frozen, and always authoritative:false and productionBound:false.

The test contract name is a placeholder, NOT an authenticated :36 API. A genuine read-only :36 export with provenance and actual grant semantics remains mandatory before integration. This code cannot prove that a receipt is truthful or that a world actor received energy.

Run: `node --test tests/resonance-devices48-receipt-epoch-guard-v1.mjs`. No production files changed; no real iPhone/WebGL2 evidence claimed.
