# :12 nonblock source ABI handoff — 2026-11-18

Status: **SOURCE-ONLY, NOT LIVE VERIFIED**. No production registration, runtime bridge, save writes, or merges.

Exact PR refs observed via GitHub metadata:
- :48 #226 `10ba143556492f75d2822784ba83641ff158acc2`; `src/nonblock-scene48/nonblock-object-v1.mjs` blob `33ee82e68be152586548bc0975cd11d0cca5dffa`.
- :24 #247 `c93b4959d18890b4ee544319417e7818756ff3d2`; `src/nonblock-environments24/v1-bridge.mjs` blob `0b846c34ef5a66796b5772f91538f68ff53de2fe`.
- :36 #249 `0c1d0f8eee81dce469dafade0381590cba204635`; `src/nonblock-fittings36/guarded-break-session.mjs` blob `0bc1c05ee8484fd86fae3db4539b85a37b2f776a`.
- Historical :12 #206 remains untouched at `aedabf1d3e6250f16e3495ec77bdc056fafc1f46`.
- :12 PR #245 base checkpoint `e9223217ef1e91d282900c3fc13a21eeda316b63`. This is PR base, not proof of latest main.

**Concrete drift:** :24 exports `COORDINATOR_SHA='92578e5628063fb962c9632b35a2a25368be1ab9'`, while :48 current PR HEAD is `10ba143556492f75d2822784ba83641ff158acc2`. This is a stale pin, not proof of incompatible semantics. :24 descriptor advertises D/E IDs that :48's `requireFamily` rejects until a creator-approved registry integration. :36 guarded break session uses injected `inspectMount` and `authorizeRemoval`; it is not the actual :00 engine hook. Neither producer is permitted to change :00 save core.

**Acceptance requirement:** obtain source-exact metadata, validate actual exported descriptor identity/mesh/pick volumes, then request owner approval for canonical family registration and tombstone semantics. Test real :00 pick -> break -> save -> reload with preserved schema-1 backups. Until then: NO LIVE ACCEPTANCE.

New `auditSourceAbi` only checks supplied source text, paths, SHA-shaped metadata and :24 coordinator pin. It **does not independently authenticate** caller-supplied SHA fields or run GitHub retrieval; a green result means preflight only. Six regression tests committed but exact-head Node/Chromium execution not claimed.
