# :12 coordinator declaration spoof hardening — 2026-11-19

CANDIDATE ONLY. No producer import, production registration, save write, deployment, or live bridge.

Source checkpoints inspected through GitHub PR metadata:
- :48 #226 d058a4b9b9d37b4b168e0213632d830abb3fcca9
- :24 #247 d312444d43562f1485f4125e6906064123339e45
- :36 #249 e31a1c44603260c0d97f6ad9678f4412f8369dc6
- Historical :12 #206 aedabf1d3e6250f16e3495ec77bdc056fafc1f46 (unchanged)
- Previous :12 #245 541b5f5760c358962bb8662295ff740f79b485ae

The coordinator drift gate previously searched source text for a declaration-like substring, allowing a commented-out or ambiguous declaration to masquerade as a valid version/pin. The restricted exported-literal reader now rejects missing and duplicate matches, and ignores comment-only lines. This remains a conservative textual gate, not a full JavaScript parser; source-byte and commit-tree provenance must be checked separately before trusting the contract. Never treat caller-supplied blob SHA/HEAD values as independent Git membership evidence.

Four adversarial regression cases added in tests/auto-integration-support/nonblock-coordinator-drift.test.mjs. Tests authored, **not executed** in this run: the local container cannot resolve github.com for exact-head checkout. No genuine Chromium/WebGL2 capture at 667x375, 844x390 or 932x430. No real :00 PICK → BREAK → TOMBSTONE → schema-1 SAVE/RELOAD verified. Existing producer pins may still drift; require new source-exact inspection.

Next: execute the 14-case suite on exact HEAD, replace textual pin extraction with an AST-backed restricted syntax audit if needed, authenticate producer blob membership, and validate actual :00 removal traces. Real integration NOT VERIFIED; v0.11 LOCKED.
