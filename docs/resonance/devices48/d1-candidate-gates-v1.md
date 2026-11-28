# :48 D1 candidate gate intent v1 — SOURCE ONLY

The opt-in `stepCandidateGates` fixture consumes guarded D1 lever/button state and emits sorted, deterministic gate open/close **requests**. Each requested-open gate declares two candidate demand units. No energy is delivered, no gate mesh moves, no voxel is edited, and no collision or save bridge is registered.

The fixture rejects stale/cross-world control frames, missing controls, duplicate gates, roster removal, travel-time edits, and control rewiring. Movement remains explicitly unauthorized even when a control requests opening. This is intentional: a real gate requires the authoritative :36 receipt plus the owner-approved physics/collision clearance interface, neither of which can be inferred from demand.

Focused validation: `node --test tests/resonance-devices48-d1-candidate-gates.test.mjs` on the committed HEAD. These fixtures are not WebGL2 screenshots or production gameplay evidence. Preserve all historical PRs and production assets. Future handoff must pin :36 contract SHA and acquire real collision bridge before advancing from source-only.
