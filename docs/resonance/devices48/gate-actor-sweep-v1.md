# :48 D2 intertick actor-sweep candidate safety v1

Source-only opt-in preflight. In addition to checking both endpoint occupancy snapshots, construct conservative axis-aligned swept envelopes for actors present at both consecutive ticks. A crossing actor can block a gate even when both endpoint boxes miss its path. Disappearing actors remain covered by the previous snapshot; new actors by the current snapshot. Duplicate actors, invalid bounds, world/tick mismatches and envelopes wider than the existing 16-unit geometry contract fail closed instead of truncating.

No movement authorization, energy receipt, live physics, player movement, voxel modification, inventory, saves, block IDs, or production registration. This is a conservative preflight, not a continuous collision proof. Candidate clearance is not permission to move. Follow-up requires real :36 delivered-energy receipts and owner-approved physics bridge.

Run focused test: `node --test tests/resonance-devices48-gate-actor-sweep.test.mjs`. Syntax checked locally before commit; committed-head test and WebGL2 capture must be independently verified. Historical PR #368 and all earlier PRs remain unchanged.
