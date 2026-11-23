# Candidate-only mobile Resonance status panel

Source-only opt-in descriptor. Displays produced, used, stored, deficits and per-device state as **candidate** values, never authoritative delivered power. It does not touch renderer, production actors, saves, inventory or collision. All outputs are frozen, sorted and capped at 16 devices / 256 requested energy units. No player-facing live UI or screenshots claimed.

Read-only sibling checks: :36 PR #286 `0cc51c6a89fce1a9928216caeebf2930b5e07f45` exposes proposed network allocation, not delivered receipts. :24 PR #290 `e156d17821ce5b55518090f296e75cc9cfc33778` exposes candidate generation. The :48 consumer must not enable devices from this panel; integration requires a real authoritative delivery receipt with exact provenance.

Run `node --test tests/resonance-devices48-status-panel.test.mjs`. The isolated equivalent local fixture passed four cases before commit. Exact-head CI and three-size WebGL2 screenshots remain separate gates.