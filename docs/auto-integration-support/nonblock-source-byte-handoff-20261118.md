# :12 source-byte attestation handoff — 2026-11-18
Status: CANDIDATE ONLY; no live bridge, no world spawning, no schema-1 integration.

## Source identities observed directly through GitHub
- :48 PR #226 HEAD ef23558ada822674e462ef237a18c8d1760476b0; `src/nonblock-scene48/nonblock-object-v1.mjs` blob 33ee82e68be152586548bc0975cd11d0cca5dffa
- :24 PR #247 HEAD f4a54899827002a1e5d31511d55ed3bd6cfe040f; `src/nonblock-environments24/v1-bridge.mjs` blob 0b846c34ef5a66796b5772f91538f68ff53de2fe
- :36 PR #249 HEAD 3c03f5a58fce69cd9144b7818da26e95f3f0bcfc; `src/nonblock-fittings36/guarded-break-session.mjs` blob 0bc1c05ee8484fd86fae3db4539b85a37b2f776a
- Historical :12 PR #206 HEAD aedabf1d3e6250f16e3495ec77bdc056fafc1f46, untouched.
- :12 PR #245 started this run at b4e38a1f3f08f9c744e365199dddeadefeebcd9a. Its base main e9223217ef1e91d282900c3fc13a21eeda316b63 is a PR-base checkpoint, NOT independently established as the latest main HEAD.

## Verified finding
:24's exported COORDINATOR_SHA remains 92578e5628063fb962c9632b35a2a25368be1ab9; it does not match current examined :48 PR HEAD ef23558ada822674e462ef237a18c8d1760476b0. Do not accept the bridge without producer-owned source-exact reconciliation. The :24 integrationStatus explicitly remains proposal-only. :36 guarded session accepts external mount inspection and authorization callbacks; it is not evidence of real :00 save integration.

## New gate
`nonblock-source-byte-attestation.mjs` calculates actual Git blob SHA-1 from UTF-8 source bytes, compares caller-provided blob SHA, checks expected path and exported symbols, and rejects stale :24 coordinator pins and production registration. This closes the previous source-ABI gate's unchecked SHA-declaration weakness **when the source bytes are obtained from a trusted ref**. It does not independently bind a supplied commit HEAD to a blob (that still requires authenticated GitHub fetch), execute imports, verify behavior or authorize runtime integration.

## Acceptance evidence
Eight regression cases authored in :12 path. An equivalent isolated local Node prototype passed 8/8. Exact committed-head tests NOT EXECUTED: direct Git checkout failed on DNS resolution of github.com. Genuine Chromium/WebGL2 captures at 667x375, 844x390 and 932x430 NOT EXECUTED. Actual :00 PICK -> BREAK/REMOVE -> TOMBSTONE -> schema-1 RELOAD NOT VERIFIED.

## Next task
Run the exact-head Node suite, then bind authenticated :24/:36 descriptors and :00-owned callbacks to opt-in lifecycle fixtures; insist on real schema-1 reload and individual removal evidence before integration. No default spawning, no edits to any producer/core/legacy PR, no merges or deployment.
