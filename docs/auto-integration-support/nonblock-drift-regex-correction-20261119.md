# :12 coordinator drift parser correction — 2026-11-19

Scope: opt-in compatibility evidence only; never production registration, spawning, save writes, or producer source edits.

The previous `nonblock-coordinator-drift.mjs` regular expressions used double-escaped whitespace (`\\\\s`) inside JavaScript regex literals. That searches for a literal backslash followed by 's' rather than whitespace. The gate therefore could falsely reject valid producer declarations, including the actual `export const NONBLOCK_OBJECT_VERSION='nonblock-object-v1'` from :48. Corrected all five declaration parsers to use `\\s` regex whitespace tokens. Added tests for multiline declarations and absent coordinator/fittings pins; existing positive fixture is the regression witness.

Exact PR checkpoints inspected via GitHub PR metadata in this run:
- :48 #226: fa366ee78c3f4a46b3fb3c946500143158c1b620
- :24 #247: 74377b1b7f4cafa4a68eb1e93b0f36f50d8bc901
- :36 #249: c4c21060b8261495784b30c7c07750ddc5f5fc60
- Historical :12 #206: aedabf1d3e6250f16e3495ec77bdc056fafc1f46
- :12 #245 previous checkpoint: 3a508a39469779b8fa16f5a1176a5cac42133948

The real :48 contract file `src/nonblock-scene48/nonblock-object-v1.mjs` was retrieved at the recorded :48 HEAD, Git blob 33ee82e68be152586548bc0975cd11d0cca5dffa. Its sidecar is explicitly disposable and not proof of schema-1 save integration. The current producer references must be independently reconciled; this parser fix does not certify their compatibility.

Execution status: tests authored/updated, not executed at committed HEAD. Local git checkout failed because github.com DNS was unavailable. No genuine Chromium/WebGL2 or :00 PICK → BREAK → TOMBSTONE → RELOAD performed. Live integration NOT VERIFIED.

Next: run `node --test tests/auto-integration-support/nonblock-coordinator-drift.test.mjs` on exact :12 HEAD, authenticate producer Git-tree/blob membership and actual source pins, then collect real :00 lifecycle and three-size WebGL2 evidence. Preserve all old PRs, schema-1 saves and v0.11 lock.
