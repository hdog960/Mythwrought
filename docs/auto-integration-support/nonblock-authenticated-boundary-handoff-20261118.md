# :12 authenticated boundary handoff — 2026-11-18

Branch: `auto-12-nonblock-compat-20261117`, draft PR #245. Candidate-only; no runtime registration.

## Source-authenticated input
The new `auditAuthenticatedBoundary` checks all three producer owners' supplied source bytes against Git blob SHA-1, exact 40-character commit-head declarations and strict ownership paths. **Limitation:** this is byte-to-declared-blob authentication, NOT independently proven blob-to-commit membership. An external Git tree verification must bind each file to its producer HEAD. Do not call `ok:true` production-ready.

The actual :48 `src/nonblock-scene48/nonblock-object-v1.mjs` export was inspected via PR #226; its `nb1:` canonical identity, `selectionAabbs`, `breakIntent` and disposable sidecar are not real :00 persistence. The new audit uses a neutral normalized witness record; adapters for :24 and :36 must preserve their original keys and orientation before accepting any mapping. In particular :36 orientation suffixes cannot be silently dropped to satisfy the :48 parser.

## Required next acceptance
1. Verify :48 #226, :24 #247 and :36 #249 exact commit SHA and Git tree blob membership; fail closed if changed.
2. Add source-exact read-only adapters for each exported descriptor and check selection/collision AABBs, triangle/LOD/batching caps and deterministic instance identity.
3. Obtain :00-owned real hook signatures and test individual PICK -> REMOVE -> TOMBSTONE -> schema-1 SAVE -> RELOAD, preserving untouched neighbor, backups and original worlds.
4. Run committed `node --test tests/auto-integration-support/nonblock-authenticated-boundary.test.mjs` at the exact PR HEAD, then isolated genuine Chromium WebGL2 at 667x375, 844x390 and 932x430 with artifact hashes and GPU budget checks.

**Current acceptance:** test cases written, exact-head execution not independently observed; live=false, breakabilityReady=false, real00Verified=false. No automatic spawning, production registration, merges, deployments or schema writes.
