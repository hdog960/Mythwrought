# Builder D — isolated real-Chromium startup recovery for Waves 1, repaired 2 and 5

**Protected downstream branch:** parent draft PR #331 exact HEAD `930c46760ea85097ce720af3055a1ef5627c14f5`. Original PRs #297, #304, #309, #311, #317, #322, #326, #330, #331 remain at their own source heads; they are not modified by this independent remediation. Production main had advanced externally to `7016e14cd6289f45eaf7fc6a79a362b47996df65`, untouched by Builder D.

## Verified real CI failure, not inferred architectural defects

Completed exact-head job logs identify the **same test launcher failure** before the first genuine screenshot in the following specific original tests:

| Failure | Actual dedicated run | Evidence |
|---|---|---|
| Wave1 inherited at Wave5 | 44828373035 | native source passed; Chrome never exposed DevToolsActivePort before 14-second timeout |
| Wave1 inherited at Wave7 | 44840442764 | native passed; same Chromium startup failure |
| Wave2, repaired Pinewater source | 44829744319 | native sources passed; DevTools startup failure; no 36-frame ZIP |
| Wave5 new eight sources | 44828373352 | native sources passed; DevTools startup failure; no 48-frame ZIP |

Before this repair, Wave3 encountered the same exact error in run #44820464424; its downstream isolated repair #331 was subsequently **proven by two successful dedicated real Chromium workflows** #44840846123 and #44840846159, each with real 48-frame PNG ZIP artifacts. Their exact source and image SHA/CRC and projected exterior/section geometry were independently audited.

## This patch

- Only the original Wave1, repaired Wave2 and original Wave5 `tests/building-pool/roadmap-d/d1-original-institutions-wave*-webgl2.test.mjs` launchers are updated to use the **verbatim already-green original Wave3 real Chromium CDP bootstrap**: up to 40 seconds to wait for a genuine live port, one bounded clean-profile *real browser* retry after full process-group shutdown, actual stderr/exit/signal logging, and real `/json/version` CDP WebSocket proof.
- Every existing source-coordinate building object, all historical original 153, all newer Wave1–Wave7 52 provisional source plans and production code are untouched. All strict existing assertions **from the genuine Wave1/Wave2/Wave5 screenshot test bodies through their final source SHA manifest output are byte-identical** to their protected parent versions. No screenshot generation substitutes, no mock CDP, no extra GL errors permitted, no waived/shortened image tests and no test threshold loosened.
- Focused new draft-only Actions workflow `.github/workflows/roadmap-d-wave125-cdp-recovery.yml` runs original native 153+52=205 D7, D1, D2 and D5 tests, then authentic serial Chromium WebGL2 source renderers and independent PNG audits: **36 W1 + 36 W2 repaired + 48 W5 = 120 original frames**, all three original phone-landscape dimensions, true exterior/cutaway geometry, actual WebGL2 context, source fingerprints and decoded PNG CRC/SHA. Three actual GIF/PNG evidence archives retained with fail-closed test outcome. Serial execution reduces concurrent Chrome process contention, never bypasses a required original capture.
- Existing original D1, D2 and D5 native/revised Chromium workflows also trigger on the test file changes; original mandatory full-game browser 20-script run stays enabled on the repository root action. This new focused workflow is **not** a replacement for original root, producer pack or mobile/iPhone acceptance.

## Current hold

Technical source acceptance from earlier CI is not a visual artwork approval. Independent original true screenshot review: many designs have repetitive common maroon prototype roofs, thin facade differentiation, and minimally furnished interiors despite unique original floor geometry. Pack1–5 genuine physical-family renderer, collision, furnished rooms, original creator visual sign-off and real iPhone acceptance remain open. All 52 new authored sources remain **provisional** at the tracked historical 153/285 accepted checkpoint; 80 canonical 4B slots unfilled. Frozen shared 161-ID 1B/2B B/C ledger, all other builders and five automations are protected.

**NO MERGE, NO DEPLOYMENT, NO RELEASE, NO GAMEPLAY OR SETTLEMENT REGISTRATION, NO SAVE DATA OR SCHEMA CHANGES, NO v0.11 UNLOCK.**
