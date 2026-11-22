# :12 pixel-stream evidence gate — 2026-11-19
Status: candidate-only, opt-in, no runtime imports or production registration.
Branch: auto-12-nonblock-compat-20261117; PR #245.
Producer checkpoints inspected via GitHub PR metadata (not authenticated source bytes):
:48 #226 6735680ac2cbcbe78b55fca59315f6d04d56c2c7
:24 #247 003f095a7e93229da73a57b6ce94aa52d563b072
:36 #249 9f031d3bb24405ee9cac9a88b88b350eec9bfa74
Historical :12 #206 aedabf1d3e6250f16e3495ec77bdc056fafc1f46 (unchanged).

## Scope
The opt-in auditPngPixels gate supplements (does not replace) existing PNG chunk/CRC gates. It verifies bounded zlib inflation, exact decoded scanline byte counts, valid PNG filter bytes, strict dimensions, SHA-256, and no trailing data. It intentionally accepts only noninterlaced 8-bit RGB/RGBA PNG; other legitimate PNG formats fail closed. Valid pixels do not establish screenshot provenance, actual Chromium/WebGL2 rendering, :00 picking, schema-1 persistence, or breakability.

## Acceptance
Run: node --test tests/auto-integration-support/nonblock-png-pixel-stream.test.mjs
Execution from exact committed HEAD: NOT VERIFIED in this handoff.
Real browser captures at 667x375, 844x390 and 932x430: NOT EXECUTED.
Real :00 PICK -> BREAK -> TOMBSTONE -> RELOAD: NOT VERIFIED.
Producer Git-tree/source-byte authentication: NOT VERIFIED.
No objects spawned; no core/save edits; no merge/deploy.

Next: execute exact-head native tests; audit actual captured screenshot PNGs and producer source blobs; request :00-owned external lifecycle trace for individual removal and schema-1 backup/reload.
