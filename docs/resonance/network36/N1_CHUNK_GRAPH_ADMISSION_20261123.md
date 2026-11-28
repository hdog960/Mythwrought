# N1 chunk-to-graph admission (source-only; 2026-11-23)

This opt-in adapter combines the existing 25-chunk invalidation planner and N1/N3 channel graph allocation. Every channel and endpoint must carry a host-authenticated `chunkKey`, `chunkEpoch`, and `loaded:true` matching the currently loaded snapshot. Missing, stale or unloaded descriptors throw before power allocation. A budget overflow returns `admitted:false` and no partial allocation.

The host remains responsible for authenticating chunk keys/epochs, world identity, generator fuel, tick ordering, and whether snapshots include all relevant connected chunks. This module does **not** prove global topology completeness, incremental performance, authoritative delivered energy, browser integration or iPhone performance. It does not change saves, voxel IDs, world edits, renderers, or other lanes.

Source parent: PR #475 HEAD 597f43239b0f57cbac211b3906d5c31c7370b137. New branch only; no modifications to protected parent PR.
