# D1 button → lamp opt-in preview v1

Source-only fixture, **not** production device wiring. Uses the committed :48 button edge filter and consumer lamp demand (one integer energy unit/tick). A powered rising button edge toggles desired lamp state; holding does not retrigger. A grant deficit darkens the preview without destroying the latch. Restoration while still held never invents another press. Caller must supply consecutive ticks, immutable world/device identities and a valid lamp anchor.

The `observedGrant` input is **untrusted fixture data** and does not represent a :36 authoritative receipt. Every output explicitly sets `activationAuthorized=false`, `authoritativeDelivery=false`, `productionBound=false`. No game actors, block IDs, physics, renderer, inventory or saves are touched. Do not connect this output to actual device activation. Next: pin a genuine :36 delivery contract by source SHA and require owner-approved integration before live binding.
