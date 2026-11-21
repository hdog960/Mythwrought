# :36 finite routing candidate — N1/N3
Contract: resonance-network36-finite-routing-v1. Source-only and opt-in; no production registration, world/save mutations, or renderer hooks.
A shared residual ledger reserves undirected edge throughput across all devices in priority order. Each device is all-or-nothing; failed partial routes roll back. Deterministic ID tie-breaks; safe integer units per tick.
Limits: this greedy path allocator is conservative and is NOT a complete maximum-flow optimizer; a feasible alternative routing may be missed. Storage is NOT connected to the finite routing ledger; do not claim integrated discharge or final N3. Edge records referring to unloaded nodes are ignored. Source descriptors are externally supplied, untrusted candidate availability, NOT authoritative :24 inventory/fuel receipts.
Run node --test tests/resonance-network36-finite-routing.test.mjs. Authentic browser, PWA, iPhone and exact-head CI pending.
