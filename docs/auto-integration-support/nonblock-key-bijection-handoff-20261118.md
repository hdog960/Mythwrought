# :12 orientation-safe identity acceptance handoff — 2026-11-18
Status: isolated draft-only compatibility fixture; **NOT LIVE**, no production registration or schema-1 modification.

## Source checkpoints observed via GitHub PR metadata
- :48 #226 HEAD `44e0d1d557528e84732999df6114d2302023c8a5`
- :24 #247 HEAD `66ba8b1892a61616f4e0c9b1bfa11e10794a5f08`
- :36 #249 HEAD `29dbef6d141977aa1f8d298538dd9e1f00957c04`
- Historical :12 #206 HEAD `aedabf1d3e6250f16e3495ec77bdc056fafc1f46`
- Prior :12 #245 HEAD `d15355a283a97640f228ae17ad592d91d59341c8`

These are PR metadata identities, **not** authenticated producer source bytes or tested exports. Earlier source inspections found :36 orientation suffixes incompatible with :48's strict tombstone parser. This run does not establish whether those implementations have changed.

## New opt-in harness
`src/auto-integration-support/nonblock-key-bijection.mjs` exercises injected encode/decode/save/remove/reload callbacks. It rejects key collisions, lossy orientation/seed decoding, deleted-neighbor loss, missing callbacks, and removed-object respawn. The associated eight synthetic Node tests passed locally in an isolated copy, not on the exact GitHub branch HEAD. The harness always reports `live:false` and `breakabilityReady:false`.

## Producer and :00 handoff
:36 and :48 must agree on one persistent canonical identity for every orientation; :24 must use independently namespaced IDs and source-exact coordinator pins. :00 alone owns actual picking, breaking, tombstones and schema-1 save/reload. A real witness must inject authenticated producer exports and :00 callbacks, test two nearby independently removable objects across reload and old-save backup preservation, and capture real Chromium/WebGL2 at 667x375, 844x390, 932x430. Until then **real integration NOT VERIFIED**.

No changes to :24/:36/:48/:00, cave PRs, manual packs, generator, saves, main, or deployment.