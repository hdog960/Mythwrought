# :12 byte-bound removal and screenshot witness — 2026-11-19

Opt-in source/test-only module `nonblock-capture-byte-binding.mjs`. No imports from unmerged producer branches, no scene spawning, no :00 hooks, no production save writes.

## Source checkpoints (GitHub PR metadata, 2026-11-19)
- :48 PR #226: `4d9d71cce1f63317c9fc9c6aaab5ac7880393ac0`
- :24 PR #247: `3a361206b58907e2c8154ac80490daa31da3c7ff`
- :36 PR #249: `924c3e6c872d80eae9a4eddebbd22cd1ecb70202`
- Historical :12 PR #206: `aedabf1d3e6250f16e3495ec77bdc056fafc1f46`
- Previous :12 PR #245 HEAD: `0334fa645a3aef3daaae6215d78bba22981ede37`

## Scope and acceptance
The new gate binds four serialized stage JSON strings and three PNG buffers to SHA-256 digests, rejects changes to neighbor/tombstone/edit state, requires schema-1 backup evidence and checks PNG IHDR dimensions 667x375, 844x390 and 932x430. This does NOT authenticate Chromium as the screenshot origin: PNG signatures and dimensions alone cannot establish rendering provenance. The test fixtures are synthetic PNG-like bytes, not genuine Chromium captures. Passing this gate always returns `live:false`.

Actual :00 PICK -> BREAK -> TOMBSTONE -> schema-1 RELOAD remains NOT VERIFIED. Producer HEADs above are metadata checkpoints, not authenticated source-byte/export audits. No evidence is available here for WebGL2 GPU performance or actual runtime behavior.

Run `node --test tests/auto-integration-support/nonblock-capture-byte-binding.test.mjs` on the exact committed branch HEAD. The 12 cases are authored, not accepted until executed. Next: independently capture real :00 lifecycle and Chromium/WebGL2 evidence and bind each immutable artifact to its producer/core source SHA. Do not merge, deploy or enable scene spawning.
