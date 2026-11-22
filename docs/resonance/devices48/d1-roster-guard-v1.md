# :48 D1 guarded controls v1 — source-only

The opt-in `stepGuardedDeviceControls` wrapper refuses malformed previous control states, silent roster removal/replacement, lamp rewiring, button duration changes, duplicate identities, stale ticks and cross-world frames before delegating to the existing D1 state machine. A new fixture is required for roster changes. It does not register assets, operate a lamp, touch saves, change block IDs, or prove :36 delivered power. `energized` stays false.

Validation: run `node --test tests/resonance-devices48-d1-roster-guard.test.mjs` on the exact committed SHA. The fixture tests do not substitute for full WebGL2 landscape captures or authoritative delivery verification.
