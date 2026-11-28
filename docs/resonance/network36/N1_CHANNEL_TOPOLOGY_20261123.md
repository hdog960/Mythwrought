# N1 bounded channel topology candidate — 2026-11-23

Contract: `resonance-network36-channel-graph-v1`. Source-only and opt-in; no production registration.

`deriveChannelGraph({channels,endpoints,maxNodes})` builds six-face-adjacent connected components from externally verified, loaded channel descriptors with stable IDs and integer coordinates. Each component ID is `channel:` plus the lexicographically smallest channel ID. Removing a middle channel splits a component; re-adding it joins it. Endpoints automatically attach only when exactly one network is adjacent. Endpoints adjacent to two otherwise disconnected networks are marked `ambiguous` and receive **no power**; they never silently bridge systems. Missing/unloaded descriptors fail closed. Input arrays are not mutated.

All inputs are caller assertions, not authenticated game-world evidence. Full graph reconstruction is O(nodes + six-neighbor probes + sorting), bounded to 4096 combined descriptors per call; this is **not** an incremental per-tick implementation and must not be run unbounded every frame. No wireless, throughput, save authority, generator fuel authority, renderer, voxel IDs, settlement logic, production edits, or damage. Channel component IDs can change after split/join, so storage identity must remain device-owned, never keyed only by component ID.

Run `node --test tests/resonance-network36-channel-graph.mjs`. Seven focused native Node tests passed locally before upload; exact committed-head CI, integrated WebGL2, offline PWA and iPhone validation remain pending. Future integration must authenticate chunk loading, ownership, edits, and channel descriptors, then map these memberships into N3 scoped allocation with :24 generation authorization and :48 device contracts.
