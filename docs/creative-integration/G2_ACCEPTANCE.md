# Mythwrought — G2A Isolated Flight Acceptance

**Status:** G2A candidate pending exact-head native and repository CI; no live Creative flight.

## Required proof

1. Seven? NO: the approved G2A diff has EXACTLY ELEVEN owned paths, listed in G2_SCOPE.md. Any others fail closed.
2. Native command: node --test tests/creative-integration-g2.test.mjs. The root bridge imports 37 pure source-backed cases: 13 flight; 11 input-owner lifecycle; 13 streaming/landing. Verify genuine Node execution, not just static syntax.
3. Existing repository native and CI-contract tests must pass under npm test. The full 20-script real Chromium/WebGL2 production regression runs via existing .github/workflows/ci.yml without modifying shared CI or producer files.
4. Optional standalone source-specific browser harness (not automatically part of the 20-script CI): start python3 -m http.server 4173 and run node tests/creative-integration/g2-real-browser.mjs after installing pinned Playwright. It imports the actual new detached modules in the browser, checks game feature-off, real WebGL2, existing grip layout and upper-right minimap across 568x320, 667x375, 844x390, 932x430, 956x440 and 1180x520. Record screenshots/actual run if executed; do not claim they ran merely because the source file exists.
5. Ensure source modules never install DOM listeners or touch live world/save/GPU resources; test bound prefetch, stale world token, full host-reader requirements, pointer cancellation, failed landing, and post-check stale landing cancellation.

## Candidate invariants and future host responsibility

| Contract | G2A pure candidate | G2B future required integration |
|---|---|---|
| Flight profiles | 1.4, 4, 8, 15 units/sec | Creator approval of physical-iPhone feel |
| Motion frame | <=50ms, segment <=0.25 units | Real continuous full-body collision and streamed regions |
| Prefetch | <=2 new/update, <=6 pending | Bounded actual section/mesh queue and GPU upload budget |
| Landing | <=64 candidates, max 8 horizontal, max 32 drop | Physical floor, real overlay support, continuous descent and safe fallback |
| Controls | Separate finger IDs, full cancellation and restore gate | Actual DOM ownership and native Explore-control preservation |
| Map | No writes or relocation | Keep upper-right discovered-only minimap accessible |

Native test callbacks intentionally use simulated readiness/clearance; this verifies the safety contract, NOT real player-body collision against every production block or physical-iPhone testing. The ordinary 20-script WebGL2 CI validates production regression and feature-off isolation, NOT in-game Creative flight. G1 read-only registry remains independent. Do not start G2B/G3, merge, deploy, modify saves or unlock v0.11 without separate creator approval.

**Acceptance decision is pending until exact-head CI completes and ownership is independently rechecked.**
