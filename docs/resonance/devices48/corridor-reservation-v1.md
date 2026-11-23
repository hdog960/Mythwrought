# D2 conservative swept-corridor reservation v1

Source-only opt-in preview for a small gate, lift or platform moving between two axis-aligned bounds. The complete union bounding box of start/end is conservatively checked against at most 64 same-world, same-tick observed actors. Intermediate blockers and boundary contact prevent a clear preview; deterministic sorted blocker IDs support reproducible fixtures. This can reject safe diagonal paths (intentional conservative false positives).

**Never authorizes movement.** `mayActuate:false`, `authoritativeDelivery:false`, `productionBound:false` are always returned. No real collision, player motion, save, block, inventory or renderer integration. Occupant observations are untrusted fixture inputs. A real owner-controlled swept collision engine and authenticated :36 delivered-power receipts are prerequisites for activation. No settlement work.

Focused tests: `node --test tests/resonance-devices48-corridor-reservation.test.mjs`. No mobile screenshot or browser evidence claimed.
