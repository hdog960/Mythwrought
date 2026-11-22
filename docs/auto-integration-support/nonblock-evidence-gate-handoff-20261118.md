# :12 exact-source evidence gate handoff — 2026-11-18
Non-production, opt-in; does not import unmerged producer code or modify any live systems.
Current verified PR HEADs at inspection:
- main e9223217ef1e91d282900c3fc13a21eeda316b63
- :48 #226 6ad848dc26933686247503b6432e52e00240189e
- :24 #247 0d0e0a7d9838d51ad4080ec56d8a7f74f940945f
- :36 #249 238e209d27acfc344b100798bcb9b3b40fc72c18
- historical :12 #206 aedabf1d3e6250f16e3495ec77bdc056fafc1f46 (unchanged)
- :12 #245 before this work ecfd66bfadd634da4070091a8ba0c557fa589399

The evidence gate rejects missing or malformed exact-ref provenance, duplicate identities,
default spawning, unbreakable objects, invalid pick boxes, protected edits,
tombstone respawning, unowned FX, and absent real lifecycle/WebGL2 evidence.
Even its positive result is explicitly a **declaration**, not independent verification:
source authentication must be performed outside the gate; the :00 real hooks
and schema-1 reload remain unverified. Do not count fixture tests as live integration.
Pending producer resolution: :24 descriptor normalization, :36 orientation-safe identity,
and :00 picking/removal/persistence. No merge or deployment authorized.
