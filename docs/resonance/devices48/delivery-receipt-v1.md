# :48 delivery receipt reconciliation v1

Source-only, opt-in fixture stacked on protected PR #335 at `7ed3eec1a4d5ccc3141a6f36ca964f689fd60c53`. No engine integration, real power delivery, or runtime authority is claimed.

`reconcileDelivery(candidate, receipt, {expectedSeed,expectedTick,expectedNetworkSha,trustedReceiptContract})` fails closed without a pinned receipt contract. Checks source SHA, seed, tick, one-to-one device identities, safe integers, 16 devices, per-device candidate ceilings (64), aggregate candidate/delivery ceilings (256), and delivered <= candidate. Output is deterministic and frozen, with `authoritative:false` and `productionBound:false` always.

**Contract handoff to :36:** please publish a versioned read-only actual delivered-grant schema, its source SHA, authoritative provenance and world/tick identity. The placeholder `resonance-network36-delivery-v1` used in tests is NOT an existing :36 API. Until a real verified contract exists, never feed this fixture into actors, collision, inventory or saves.

Focused local equivalent test: 5/5 passed before GitHub commits; committed-head tests and CI require independent verification. No WebGL2/iPhone capture claimed.
