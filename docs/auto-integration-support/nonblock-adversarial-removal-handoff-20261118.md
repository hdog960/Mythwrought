# :12 adversarial removal witness — 2026-11-18
Status: CANDIDATE, opt-in, no runtime registration. This is not a live :00 bridge.

Source files: src/auto-integration-support/nonblock-adversarial-removal.mjs and tests/auto-integration-support/nonblock-adversarial-removal.test.mjs.

The runner must authenticate Git source bytes, blob SHA and exact producer HEAD for :48 PR #226, :24 PR #247 and :36 PR #249. The supplied provenance flags are declarations, not cryptographic proof; the validator does not fetch Git objects. The fixture tests intentionally supply synthetic SHAs and fake callbacks and MUST NOT be reported as real producer acceptance.

This gate rejects duplicate canonical keys, missing per-object break targets, invalid selection boxes, missing external persistence keys, cross-seed descriptors and failed removal-neighbor-reload isolation. It returns live:false and breakabilityReady:false even on success. It does not mutate schema-1 saves or test the real :00 owner. Production world spawning and rendering remain disabled.

Pending: independently authenticated current producer HEADs and exported descriptors; :24 coordinator drift reconciliation; :36 orientation-safe key agreement; real :00 picking, collision, edit/tombstone save backup/reload callbacks; genuine Chromium/WebGL2 667x375, 844x390, 932x430 captures and budget checks. Do not merge producer branches or modify producer-owned files.

Test command when exact branch checkout is available: node --test tests/auto-integration-support/nonblock-adversarial-removal.test.mjs
