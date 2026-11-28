# N2 isolated wireless admission — 2026-11-23

Source-only candidate stacked on PR #478 exact head 9ff78c3dac371a8c0c067a66af3c956bdb63dc78. One Resonance energy type. Read-only deterministic descriptors; no block IDs, renderer, saves, world edits, or persistent activation.

`deriveWirelessLinks` requires loaded, unique, integer-position descriptors. A transmitter must touch exactly one channel component and broadcasts only to endpoints within its inclusive finite Euclidean radius (default maximum 6; caller cap at most 16). Endpoints auto-connect, disconnect when removed/unloaded/out of range, and fail closed on ambiguous networks. Wireless never merges channel components; transmitter power availability is NOT authenticated here. Host must supply loaded snapshots and explicitly gate transmitters on actual :24/:48 power and chunk provenance before live use.

Bounds: total descriptors <=4096; graph traversal is bounded by descriptor count; wireless comparisons are O(transmitters * endpoints) in the worst case and MUST be spatially indexed/budgeted before production activation. No throughput, cross-chunk persistence or iPhone performance proof is claimed.

Eight focused Node 22 cases were run locally against a manually copied exact channel-graph module from PR #478 and the candidate wireless module: 8/8 pass. These are local focused tests, not committed-head native Actions or authentic browser/WebGL2/iPhone proof. Future: verify exact committed head, host-provenance and power gating, chunk invalidation, spatial work budgets and offline/save behavior. No merge/deploy authorization.
