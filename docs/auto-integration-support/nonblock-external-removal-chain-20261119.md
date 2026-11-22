# :12 external removal chain — 2026-11-19

Opt-in, non-production structural acceptance for a captured PICK -> REMOVE -> TOMBSTONE -> schema-1 RELOAD sequence. No :00 callbacks are executed; no producer code is imported. The gate rejects loss of neighboring objects, historical tombstones, seed identity, existing edits, backup evidence and orientation-sensitive canonical keys when represented as distinct keys.

**Important:** `ok: true` means only a caller-supplied trace is internally consistent. It never means the capture is authentic, and `live` is always false. Independently bind each capture hash to actual immutable bytes and each producer SHA to the matching Git tree before any real acceptance claim.

Producer checkpoints in the preceding run were :48 #226 `76609abc21b5`, :24 #247 `da038e4c4050`, :36 #249 `8d272ef7e155`; these are historical, **not freshly authenticated in this change**. Historical :12 #206 and all producer/cave branches remain untouched.

Run `node --test tests/auto-integration-support/nonblock-external-removal-chain.test.mjs` at exact branch HEAD. Three Chromium/WebGL2 captures (667x375, 844x390, 932x430) and real :00 save/reload evidence remain required.
