# Builder D Wave3 genuine Chromium startup failure — isolated draft repair

**Source of verified failure:** Protected Wave3 PR #309 HEAD `6a80c68799c1cee143b2e6b6a123119e828fdd87`, dedicated Actions [#44820464424](https://github.com/hdog960/Mythwrought/actions/runs/44820464424), job `136579725575`. At exact-head source, all **4/4 real native original-source validations PASSED**, real system Chrome binary was found at `/usr/bin/google-chrome`, pinned `pngjs@7.0.0` installed, then actual 48-frame Chromium test **FAILED** before the first capture: `Chromium did not expose a DevTools port (no simulated browser fallback)` from `launchChrome` around line 82. The job had no genuine PNG files; its always-upload step truthfully reported no artifacts. This is a confirmed failed **real Chrome bootstrap**, not evidence of a failed architectural source geometry or an actual corrupted screenshot.

## Verified scope and repair

Read the exact failed job logs and compared the Wave3 launcher with protected successfully executed Wave2 genuine Chrome launcher. Both require a genuine Chrome executable and use `--remote-debugging-port=0`, but their original startup checks only polled `DevToolsActivePort` for up to 14 seconds and did not preserve Chrome stderr/exit diagnostics. An overloaded runner, browser process failure, or delayed profile initialization could each cause this symptom; **the underlying cause was not recorded**, so do not assert which one occurred.

On this isolated downstream branch, only `tests/building-pool/roadmap-d/d1-original-institutions-wave3-webgl2.test.mjs` receives a fail-closed startup hardening patch:
- Still spawns actual installed Chrome in real headless WebGL2 mode with original exact GPU flags, DevTools remote port 0 and a fresh temporary user profile. No fake browser, screenshot fallback, skip or test-only generated image.
- Captures actual Chrome stderr (bounded), real process exit/signal/spawn error and whether the DevToolsActivePort file appeared, logging these diagnostics on any failed attempt.
- Polls for a real DevTools port for up to 40 seconds; performs only **one** fresh-profile retry after terminating the entire detached browser process group and cleaning up the failed profile. If both attempts fail, the test fails with real diagnostics.
- Waits briefly for the *actual* `/json/version` live endpoint after the port file appears. No synthetic CDP payload is allowed; missing CDP socket remains a test failure.
- Keeps the existing genuine WebSocket handshake, real WebGL2 frame rendering, source file SHA, exact six captures per source, all 8×2×3=**48** PNG dimensions, source-specific identity, source/camera geometry, zero GL/context errors, valid screenshots, full independent PNG CRC/SHA/pixel checks, and strict source geometry acceptance **unchanged**.
- Correct original Wave3 `.github/workflows/roadmap-d-d3-source-acceptance.yml` already triggers on this file's change. Do not alter its source ID, D4, image or native test thresholds.

The repaired launcher is statically syntax-verified and MUST still execute at the new exact-head CI. **NO new Wave3 real Chromium artifact or technical acceptance is claimed yet**; download/archive and inspect its actual 48 frames after a successful run.

## Protected source and broader program

Stacked downstream of new Wave7 draft PR #330 (exact parent `c346b839abaeb5c899aa7bce51d4e605b417e743`); retains PRs #297/#304/#309/#311/#317/#322/#326/#330 exact heads unchanged. The 153 historical source objects, 52 new D1–D7 provisional designs, immutable frozen 161-ID 1B/2B fence, all builders A/B/C, five automation assignments, main, schema-1 saves, v0.11 and live PWA are untouched. Original full root game 20-script WebGL2 and historical **205-source / 784 bidirectional D4 <0.89** CI still mandatory. Physical Pack1–5 materials, furnished visual art and real iPhone proof remain outstanding.

**NO MERGE, NO DEPLOY, NO RELEASE, NO LIVE REGISTRATION, NO SAVE OR SCHEMA CHANGE.**
