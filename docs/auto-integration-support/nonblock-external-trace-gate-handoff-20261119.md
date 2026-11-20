# :12 external removal trace handoff — 2026-11-19
Status: opt-in candidate; **NOT LIVE**. This harness does not call, implement, or modify :00 hooks.

Source checkpoint at inspection: :48 PR #226 `76609abc21b50f58f2f82160ec440357dc701820`; :24 PR #247 `da038e4c4050b1e517aa81d41fcd583e96632bc9`; :36 PR #249 `8d272ef7e1554ac879733df371c419d8e032d1c4`; historical :12 PR #206 `aedabf1d3e6250f16e3495ec77bdc056fafc1f46`. These are PR metadata, NOT authenticated producer file bytes.

New preflight requires evidence for producer commits, a :00 hook source commit, and schema-1 backup verification, plus two individually breakable seed-scoped canonical objects and finite nondegenerate selection AABBs. Evidence fields are declarations, not independent cryptographic authentication. No runtime registration occurs.

A separate immutable before/after/reloaded trace witness checks exactly-one-object removal, neighbor retention, persistent tombstones, preserved historical tombstones, and seed identity. This trace verifier never calls production hooks; a passing synthetic fixture MUST NOT be represented as a real save/reload. Production acceptance requires independently authenticated :00 callback source and a real schema-1 backup/reload capture, plus Chromium/WebGL2 screenshots at 667x375, 844x390, 932x430 and no GL errors.

Tests: 12 authored Node cases in `tests/auto-integration-support/nonblock-external-trace-gate.test.mjs`. Exact GitHub committed-head execution and Chromium NOT VERIFIED (container GitHub DNS failure). No changes to :00, producers, caves, manual packs, main, or production. v0.11 remains locked.

Next: run `node --test tests/auto-integration-support/nonblock-external-trace-gate.test.mjs` on exact branch HEAD, authenticate producer Git trees/bytes, then collect actual :00 trace evidence without writing :00 code.
