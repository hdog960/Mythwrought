# :12 coordinator drift handoff — 2026-11-19
Opt-in only. No production imports, registration, saves or deployment.

Verified PR HEADs (GitHub metadata): :48 #226 b6d5e6e5bebfa8e533d7c1db9af61208f685b46a; :24 #247 035c4fcd328982e9df343efec37e9a520f1e417b; :36 #249 c4c21060b8261495784b30c7c07750ddc5f5fc60.
Verified GitHub file blobs: :48 nonblock-object-v1.mjs 33ee82e68be152586548bc0975cd11d0cca5dffa; :24 v1-bridge.mjs 0b846c34ef5a66796b5772f91538f68ff53de2fe; :36 fittings-phase1.mjs 562e360b259f5aca00ab8ce859bb5b8e2f09bc36.

Source-exact blockers: :24 bridge COORDINATOR_SHA points to 92578e5628063fb962c9632b35a2a25368be1ab9 rather than current :48 HEAD. :36 fittings CONTRACT_SOURCE_SHA points to d8f00bcc2d5fe186a9822eeeb48684f51222fad3 rather than current coordinator file blob 33ee82e68be152586548bc0975cd11d0cca5dffa. Both need owner-reviewed reconciliation, not :12 edits. New gate compares supplied Git blob bytes, expected HEADs and source-declared contract pins. It cannot establish Git tree membership without independently fetched tree evidence; it never returns live:true. Real :00 PICK/BREAK/TOMBSTONE/RELOAD and Chromium evidence still required.

Focused command: node --test tests/auto-integration-support/nonblock-coordinator-drift.test.mjs
