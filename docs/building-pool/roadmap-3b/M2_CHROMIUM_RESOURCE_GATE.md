# Builder 3B exact-head browser CI resource correction

**Only Builder 3B-owned tests and documentation are touched.** No CI workflow,
other builder lanes, main, runtime, packs, registry, automation, saves or
deployment changes.

## Evidence of the failure

At variant-2 source commit \`ffcc9a7be3b0158eedd465d396ac7b25910f3f87\`
([Actions #43784941383](https://github.com/hdog960/Mythwrought/actions/runs/43784941383)):

- 735/735 root native Node and 12/12 CI contract tests passed.
- 76 of 79 Builder 3B nested tests passed. The failed three were **only**
  genuine Chromium screenshot suites: original M1 90-image, first M2
  12-image, and frontier 36-image. All three failed specifically before
  browser session initialization with \`Chromium CDP port missing\`.
- The **new** original variant-2 source suite passed its authored 51-design
  global uniqueness test, D4 reflected/rotated normalized Jaccard cutoff
  (\`0.878378 < 0.89\`), physical two-wide clearance, foundation/roof
  support, deterministic source and physical ABI assertions.
- The new six-design screenshot suite **passed 36/36 real Chromium/WebGL2
  source cube-envelope captures**. Three other prior Chromium suites
  succeeded too. This indicates resource contention when multiple Chrome
  instances spawn concurrently rather than a failing new blueprint or
  game runtime.
- The shared native runner starts 3B test files concurrently. With seven
  independent software-rendering Chromium sessions, some Chromes fail to
  expose the CDP debugging port within the 15-second launch window.

## Narrow 3B-only correction

\`chromium-resource-lock.mjs\` implements an atomic temporary-directory
mutual exclusion permit across all Node test-file child processes. Each of
the seven 3B Chromium screenshot test suites now acquires it *before*
launching Chrome and releases it in a nested \`finally\` after browser,
server, temp user-data and CDP teardown, including when tests fail.
The lock applies only to these 3B tests, never to production, automation
or sibling suites. It waits with bounded timeout, and refuses to claim
visual success if Chromium still cannot launch or render.

\`chromium-resource-lock-contract.test.mjs\` verifies every screenshot
module uses the permit and preserves actual CDP navigation, readPixels
and screenshots. All 306 source preview PNGs (old 270 + six variant-2 ×
2 views × 3 viewports = 36) are still required in exact-head successful
CI. None of the original source blueprints, geometry witnesses, category
counts or screenshots assertions was weakened or removed.

**Acceptance pending** until the exact new PR head succeeds, all seven
Chromium suites genuinely pass and their actual PNG artifact is verified.
No screenshot substitutes for final manual-family physical shapes,
premium artwork or physical iPhone evidence.
