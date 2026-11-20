# :12 candidate scene acceptance — 2026-11-19
Status: opt-in fixture gate only; **NOT LIVE** and **NOT source-exact producer acceptance**.
Branch: `auto-12-nonblock-compat-20261117`; draft PR #245.
Checkpoint before this work: :12 `3a4ed82eba025a256952019248b72afcfd6b1f17`.
Previously observed producer commits (must be refreshed before acceptance):
:48 #226 `d058a4b9b9d37b4b168e0213632d830abb3fcca9`;
:24 #247 `d312444d43562f1485f4125e6906064123339e45`;
:36 #249 `e31a1c44603260c0d97f6ad9678f4412f8369dc6`.
Historical :12 #206 remains untouched.

New gate: `auditNonblockCandidateScene` validates namespaced IDs, unique instance/tombstone identity, seed and owner, individual pick/break/remove flags, finite AABBs, candidate collisions and protected edits, and declared triangle/draw-call budgets. It never imports producer branches, spawns objects, changes saves, or asserts Chromium provenance. All supplied objects are caller fixtures; even a pass returns `live:false`.

Run locally after checkout: `node --test tests/auto-integration-support/nonblock-candidate-scene-gate.test.mjs`. Fourteen tests authored, execution pending because local GitHub DNS resolution failed. Do not report green until run.

Required follow-up: refresh exact producer HEADs and Git blob/tree witnesses; reconcile :24 coordinator commit and :36 coordinator blob pins with :48 owner; obtain real :00 PICK -> BREAK -> TOMBSTONE -> schema-1 RELOAD traces with neighboring object preservation and genuine Chromium WebGL2 captures at 667x375, 844x390, 932x430. Real integration NOT VERIFIED. No default spawning or deployment authorized.
