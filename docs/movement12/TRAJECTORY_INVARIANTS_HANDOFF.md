# :12 trajectory invariant acceptance handoff — v1

Scope: only movement12. Candidate source: `src/movement12/trajectory-invariants.mjs`; regression suite: `tests/movement12-trajectory-invariants.test.mjs`.

## Input contract
Supply the existing `recordRealStepTrace` samples and events, an unchanged real world and the real `collides` function. Sample timestamps must increase strictly. Every frame requires one physics event. The auditor rejects embedded player bodies, nonfinite positions, teleport-like horizontal or vertical displacement, and excessive trace lengths. Thresholds are explicit caller parameters, **not** inferred production limits.

## Acceptance boundaries
This is a frame-sample audit, **not** continuous swept collision proof: tunneling between samples can remain undetected. Use the existing swept-probe audit separately. Synthetic tests prove only the utility's contract, not real terrain or iPhone behavior. Do not register this in production or modify the game, saves, input rails, Creative flight, or any other lane.

## Required before integration
1. Execute committed exact-head Node tests and inspect failures.
2. Feed actual `stepPlayer` runs at 30/60/120 Hz, including shape-aware steps, corner sliding, ledges, ceiling and fall recovery; record concrete thresholds and false positives.
3. Exercise genuine Chromium/WebGL2 at 667×375, 844×390 and 932×430, plus full game scripts when accessible.
4. Verify Creative double-tap JUMP flight toggle, UP/DOWN, schema-1 saves, offline PWA and 25-chunk performance separately.

Status: SOURCE-ONLY, not live, not production integrated. No claims of physical iPhone testing.
