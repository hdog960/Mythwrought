# :48 gate continuity advisory v1

Three consecutive simulation-tick candidate-clearance snapshots must remain clear before a gate is reported as *stable candidate-clear*. An intermediate obstruction, stale/skipped tick, cross-world frame, roster mutation, duplicate identity, or forged authority fails closed.

**Source only:** the module always reports movementAuthorized=false and never grants power, collision clearance or physical movement. Three snapshots cannot prove absence of between-tick crossing, nor protect against later actor changes. Real operation still requires SHA-pinned authoritative :36 delivered-energy receipts and an owner-approved live physics bridge. No production registration, save/schema change, renderer change, block ID, voxel edit or settlement work.

Focused test: `node --test tests/resonance-devices48-gate-motion-continuity.test.mjs`. This is not WebGL2 or physical iPhone evidence.
