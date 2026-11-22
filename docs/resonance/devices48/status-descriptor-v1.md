# :48 D5 advisory status descriptor v1

Source-only `describeDeficitStatus(window)` consumes a bounded `resonance48-deficit-window-v1` history. It recomputes and validates every history total before emitting an immutable, minimal status descriptor: idle, observed-satisfied, observed-unpowered, or observed-partial. These are **observations**, not authenticated :36 delivery receipts. All results explicitly retain `authoritativeDelivery:false`, `energized:false`, `movementAuthorized:false`, and `productionBound:false`. No renderer, save schema, block ID, physics, power ledger, settlement or production registration is changed.

Local equivalent Node test fixture: 8/8 passed. Committed-head CI and real WebGL2/iPhone captures remain separate verification requirements.