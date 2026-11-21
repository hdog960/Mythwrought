# :48 untrusted delivery preview v1

This deterministic, source-only module reconciles candidate demand with **untrusted** delivery observations for up to 64 devices. It checks world/tick identity, integer bounded quantities, duplicate IDs, overdelivery, unknown devices, disabled demand and forged authority flags. Missing observations are treated as zero delivery. Results are sorted and frozen, with deficits for future phone-friendly UI.

**This is not the authoritative :36 interface.** Observations are not verified :36 allocation receipts and must never be used to energize a lamp, open a gate, authorize movement, debit a battery or modify world/inventory. Every result explicitly sets `energized=false`, `movementAuthorized=false`, `authoritativeDelivery=false`, and `productionBound=false`, even if candidate demand is fully met. A future read-only SHA-pinned :36 contract audit and owner-approved integration are required before any live binding.

Focused test: `node --test tests/resonance-devices48-delivery-preview.test.mjs`. No claim of browser/WebGL2/iPhone evidence or CI success. No block IDs, save schema, renderer, physics, settlements, other lane files or production edits.
