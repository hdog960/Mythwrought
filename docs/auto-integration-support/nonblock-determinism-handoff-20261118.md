# :12 non-block deterministic lifecycle handoff — 2026-11-18
Status: CANDIDATE / UNMERGED / UNDEPLOYED. This is an opt-in callback fixture, not a production bridge.
## Source references at inspection
- :48 PR #226: d3affe8097725194b3a63a73365e794f74d9522c; observed src/nonblock-scene48/nonblock-object-v1.mjs exports describeNonblockObject, nonblockInstanceKey, createNonblockSidecar, pickNonblockRay.
- :24 PR #247: 4c673a5aaf0deffc4b2d0d397dbfc381390d9eab; metadata only, descriptors not authenticated this run.
- :36 PR #249: 38a73665df43c832f591a10d8de5087be6ee5f1f; metadata only, descriptors not authenticated this run.
- :12 PR #245: separate branch auto-12-nonblock-compat-20261117.
- :00 production picking/removal/schema-1 hooks: not authenticated. Caller-supplied provenance strings are NOT cryptographic verification.
## Adapter
nonblock-determinism-gate.mjs requires externally supplied describe/snapshot/remove/restore/visible callbacks, validates canonical nb1 identities, deterministic descriptor replay, selection AABBs, individual break intent, preexisting tombstones, removal and neighbor isolation. It does not alter saves or production. The success label explicitly excludes schema-1/browser proof.
## Manual incorporation dependencies
1. Resolve :24 descriptor shape and :36 orientation key incompatibilities with :48 canonical identity, preserving unique persistent tombstones.
2. :00 must supply authenticated pick/removal and schema-1 save/reload callbacks without changing existing schema-1 backups or seed identity.
3. Run exact-head Node tests and genuine Chromium WebGL2 at 667x375, 844x390 and 932x430. No such captures were produced by this change.
4. Verify edit protection, per-object break/removal, retained old tombstones, offline reload, budgets and rollback before any production registration.
Never merge automatically. Keep historical cave PR #206 and producer branches unchanged.
