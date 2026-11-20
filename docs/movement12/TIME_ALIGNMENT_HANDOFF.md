# :12 time-aligned trajectory diagnostic v1 — 2026-11-20

Source-only, opt-in test adapter. It consumes real or synthetic movement samples supplied by a caller; it does **not** hook production stepPlayer, input, collision, camera, Creative flight, saves, or WebGL2.

Unlike endpoint-only comparison, it interpolates timestamped positions at equal elapsed-time checkpoints, detecting transient frame-rate-dependent drift even if endpoints match. All runs must start at zero and share a duration. Every aligned trajectory is independently passed through the existing bounded collision audit. Budget failures and collision hits fail closed. Linear interpolation cannot prove thin-geometry safety between sample points.

Execution: `node --test tests/movement12-time-alignment.test.mjs`. Until executed on the committed PR head, the test suite is authored but **not accepted**.

Next handoff: obtain source-authenticated production stepPlayer traces with identical seed, movement inputs, and collision reader; compare 30/60/120 Hz walking, steps, ledges, and Creative flight. Genuine Chromium 667×375, 844×390, 932×430 and physical iPhone testing are not claimed. Do not integrate without creator approval.
