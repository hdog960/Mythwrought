# :48 D2 sensor/timer candidate interlock v1

Opt-in source-only composition of the existing proximity-sensor and timed-control outputs. Both independently observed frames must have matching world, tick, target, and stable identities. Requires consecutive ticks; rejects contradictory grants and forged authority. A candidate request is emitted only when both preview outputs are active.

This is **not authenticated power delivery**. Observed grants are fixture data, never :36 delivery receipts. Every output explicitly denies actuation, authoritative delivery, and production binding. No gate, lift, collision, player-placed voxel, inventory, save, renderer, block ID, or settlement is modified. A real device needs a SHA-pinned :36 receipt and owner-approved physics/collision integration.

Focused test: `node --test tests/resonance-devices48-sensor-timer-interlock.test.mjs`. Real WebGL2/mobile and offline acceptance remain pending.
