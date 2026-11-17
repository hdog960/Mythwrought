# Mythwrought Creative G2B — Acceptance Matrix

**Status:** Pending exact-head verification and creator/physical-iPhone acceptance. Production remains unchanged.

- Authoritative branch: integration/creative-flight-g2b-20261116, stacked on G2A PR #209, draft PR targeting G2A branch.
- Exact G2B diff must remain the ten paths in G2B_SCOPE.md; shared G2A/G1/PR #186 and sibling builder producer paths unchanged.
- New root bridge tests/creative-integration-g2b.test.mjs imports 22 native source tests across three suites. Use npm test with genuine production physics/depth imports and static guarded integration checks.
- Existing full 20-script production Chromium WebGL2 GitHub gate must pass at the exact G2B HEAD. It checks baseline gameplay regressions; it does **not** automatically run the new dedicated flight harness.
- New G2B source-specific browser tests MUST genuinely run and pass at 568x320, 667x375, 844x390, 932x430, 956x440 and 1180x520; source tests may not be called executed merely because authored. The harness lives at tests/creative-integration/g2b-browser.mjs and uses actual Playwright Chromium/SwiftShader and CDP touch events, real src/main.mjs and world physics, genuine WebGL2/GPU buffers, screenshots and save-byte checks.
- Safety checks: default off; four speeds 1.4/4/8/15; frame cap 50 ms; physically clear movement and loaded body sections; cx,cz surface key translation; one renderer queue and ≤34 resident chunks; no mine/place leakage while flying; map upper-right, discover-only and tappable; independent two-thumbs; landing only after full support/sweep and real body check; fail-closed hover on unsafe landing; context-loss, world-change, import/restore, hidden/blur pointers fail safe; no new stored flight data or schema change.
- Genuine external device / installed Home Screen Safari testing is NOT performed by CI. G2B cannot be declared creator/device approved without creator's subsequent physical device report.
- Acceptance is blocked by any failed or unexecuted required source-specific browser suite, regression, unauthorized path, unsafe landing, input ownership bug or save drift.
- Do not merge, deploy, activate registry drafts, start G3 or unlock v0.11 without separate permission.
