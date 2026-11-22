# Resonance :48 — candidate pulse cooldown v1

Source-only D5 visual descriptor scheduler. Consumes `buildPriorityPulseFrame` output without modifying the producer. Use `scheduleCandidatePulses(previousStateOrNull, frame, {cooldownTicks:4})`. Returns immutable `state`, `emitted`, `suppressed` and explicit false authority flags. Previous state is an ephemeral preview cache, not save-schema data.

A candidate-restored or candidate-changed pulse is suppressed if the same device emitted an event less than four ticks ago. **Power interruption warnings are never suppressed.** Candidate pulses are ranked by interruption/restoration/change, then lexicographic device ID. At most 16 devices, 16 retained history entries and 120 ticks of history are permitted. Seed mismatches, stale frames, invalid candidate provenance, duplicate identities and malformed data fail closed.

This does not authorize delivered energy, powered movement, collision, inventory, block edits, actual GPU effects or gameplay HUD changes. No live renderer/actor/PWA integration and no genuine three-size WebGL2 evidence. :36 must supply authoritative delivered-energy receipts separately. The renderer owns safe-area placement and two-thumb controls.

Local Node equivalent test fixture: 3/3 passed on 2026-11-21; committed-head execution and GitHub Actions require separate verification. Parent protected PR #348 exact HEAD `f09d70fe35e21cf456335a1ce90adc3422767232`; do not modify it.