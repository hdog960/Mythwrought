# Roadmap A Pack5 — narrow original-game browser readiness, source-only

## Purpose

This document establishes the **next safe acceptance gate** for the original Pack5 fired-brick geometry: run one original Mythwrought main-game WebGL2 scene under a clean, disposable Chromium context while examining original Pack5 preview ray mathematics **only in separate, in-memory test fixtures**. The pilot tests browser-runtime support and numeric precision near authored boundaries. It cannot claim to have placed, rendered or interacted with a Pack5 fixture inside the real Mythwrought world. It intentionally does not use the original localhost debug methods that place actual world blocks or write the Pack5 seed sidecar.

This step is *readiness*, not the actual production game Pack5 gameplay or physical-world integration. It is not a re-run of the prior original six-variant WebGL2 gallery or the full three-viewport game browser suite. It is deliberately **not automatically run by CI**. A future owner can explicitly authorize one standalone run on an isolated checkout without touching main or a shared PR.

## New isolated source-only modules

1. \`src/building-pool/roadmap-2a/roadmap-a-pack5-game-browser-readiness-core.mjs\`
   - Fail-closed original main-game \`camera,player,WebGL2,local-only debug,Pack5 guard\` source-contract crosscheck against the unchanged \`src/main.mjs\` and existing \`tests/pack5-game-browser.mjs\`.
   - Exact real original producer \`pack5:080\` both brick variants x 2 original yaws (2,3) check: original collision full cube, detailed selection/visible boxes, authentic source-authored 9-float terrain shader staging, material channel 0, per-object 384-KiB page cap and 2-MiB/8-page resident cap. No GL upload nor actual per-frame visibility claim.
   - \`originalPack5ReadOnlyBrowserPlan()\` declares **one 844x390 viewport**, one screenshot of *unchanged actual main game scene*, 72 independent test-only browser source rays, zero source A5 choices and zero approval.
   - \`requireOriginalPack5ReadonlyBrowserPilot()\` requires original game WebGL2 ready, rendered frames >=3, complete original 72-ray source-only JS geometry sample, finite original camera telemetry, both original and final Pack5 saved-sidecar counts zero, **zero actual game Pack5 live instances**, zero page/console errors and explicit non-approval. Rejects false iPhone/renderer/production claims.

2. \`tests/building-pool/roadmap-2a/roadmap-a-pack5-game-readonly-browser.mjs\`
   - **Manual optional** \`node tests/building-pool/roadmap-2a/roadmap-a-pack5-game-readonly-browser.mjs artifacts/roadmap-a-pack5-readonly-game-pilot\`.
   - HTTP serves the exact original repository, imports the **unchanged original** main-game DOM/WebGL2 and waits for true rendered scene frame count.
   - Starts a **new ephemeral, storage-empty 844x390 browser context**, blocks service workers, uses one viewport only and an unused localhost port. No saved user profile or original Home Screen PWA involved. Reads original scene \`dataset\` camera values and localhost-only \`__mythwroughtTest.snapshot()\`; never calls any test API mutator.
   - Independently imports the original \`camera.mjs\`, original Pack5 catalog/fixture, and pure source triangle-ray function in the SAME browser JS engine. Creates four **ephemeral memory-only** original brick preview fixtures, two authored variants x yaw2/3, tests x coordinates near 0.02 and 0.98 and three small view deltas: **72 independent test-only ray-to-authored-triangle comparisons**, counting all raw mismatches rather than assuming zero.
   - Does NOT enable Pack5 mode, call \`placePack5TestFixture\`, \`placePack5DenseTestFixture\`, \`setOrientation\`, \`placeFixture\`, alter the actual main game player/world, press controls, write to \`localStorage\` or enable persistent app storage. The original main app might initialize its own isolated local in-memory/browser storage; that remains disposable. The probe explicitly asserts **zero Pack5 sidecar keys and zero actual live Pack5 instances before and after**.
   - Outputs one original **unmodified-game scene** screenshot and JSON with SHA-256; no screenshot is a Pack5 in-game render. If WebGL2 unavailable or original source contracts drift, the pilot **fails**, not a simulated success.

3. \`tests/building-pool/roadmap-2a/roadmap-a-pack5-game-browser-readiness.test.mjs\`
   - **Eight new original-repo native tests** verify original main source hooks, exact browser plan, original Pack5 physical renderer staging, fail-closed evidence rejection for spoofed GPU/iPhone/gameplay/sidecar/variant authorizations, and static browser harness non-mutation restrictions.
   - Native testing **never** starts Playwright or a browser. The validator acceptance test uses explicitly *synthetic* data to test the validator, **not actual browser evidence**.

## Where to draw the next approval boundary

**Native Node pass** can establish source-math and browser preflight invariants, not actual WebGL2 game rendering. **One future, opt-in Chromium run** would establish that the real original game can boot WebGL2 at 844x390 in a clean browser while the independent Pack5 source rays run in that same JavaScript engine. It would still *not* establish Pack5 mounted in-game, original player editing/collision, iPhone Safari GPU/pixel/latency, live edge-grazing selections, or 79 A5 building support.

A genuine Pack5 **in-game** visual/player interaction acceptance would require a *separate, explicitly authorized* isolated browser test with a temporary test fixture, truthful screenshot and GPU pixel checks, and a proven disposable world/save context. Do not quietly use any localhost-only world mutation hooks in this pilot. The original game exposes \`placePack5TestFixture()\` that writes a Pack5 sidecar; that is **intentionally forbidden** here.

## Existing evidence reused, not repeated

- Exact original native main camera/Pack5 sparse-dense 7/7 Actions #45057409771
- Original Pack5 live ray/occlusion 6/6 Actions #45055300060
- Original Pack5 source mesh/selection ray 15/15 Actions #45049471293; original 88 edge-grazing warnings remain unresolved as actual gameplay
- Original Pack5 earlier native 40/40 Actions #45044721507, footprint 9/9 + authentic producer 5/5, original historical Pack5 24/24 and controlled V8 58/58
- Earlier authentic original source-only physical producer 36 original WebGL2 screenshots; these are not iPhone or source A5 world integration.

## Protected ownership and unchanged integration gates

Source-only Roadmap A remains **207/420 drafted, 213 unwritten**. Historic 128 commerce, 345 industrial and 315 government unchanged. All original 79 A5 source designs remain unmodified, with no real variant/yaw assignment, world-placement, mixed Pack1–5 structural approval or full-game Pack5 visual acceptance.

Protected production main \`7016e14cd6289f45eaf7fc6a79a362b47996df65\` and OPEN DRAFT PR406 code HEAD \`1d71f5e37891280a21c777e5189f0762014ed8a9\` remain unchanged. No modification of other builders, five hourly automations, pre-existing workflows, original renderer/camera/input, saved worlds, schema1, installed Home Screen PWA, locked v0.11, no merge/deployment/cancellation. Source-only evidence must never be interpreted as permission to approve a live Pack5 building or a finished release.
