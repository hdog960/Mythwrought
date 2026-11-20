# Frame-trace handoff — 2026-11-20

Source-only P0/P1 diagnostic, NOT production movement or a live bridge. The comparator consumes 2–8 trajectories with explicit frame delta and player feet coordinates. It delegates full-body collision checks to the existing trace-budget contract, rejects any collision/budget failure, and checks final position drift against a configurable tolerance (default 0.02 world units).

A passing synthetic fixture is not evidence that production stepPlayer behaves consistently. Real integration requires recording genuine stepPlayer trajectories under identical world seed, input timeline and elapsed simulation time at 30/60/120 FPS, and supplying the production full-body collides reader. Capture shaped steps, corners, ledges, fall transitions, Creative double-tap JUMP and UP/DOWN flight separately. Do not alter touch rails, movement core or save core in this PR.

The diagnostic checks endpoint consistency, not velocity curves, camera jitter or continuous swept-volume safety. Sampled collision checks may miss thin geometry. The 11 new synthetic Node tests passed locally with a copy of the prior trace-budget source; exact committed-head and Chromium/WebGL2 tests are pending. Preserve main, Gate A, schema-1 saves and all other owners' branches. No merge/deployment authorized.
