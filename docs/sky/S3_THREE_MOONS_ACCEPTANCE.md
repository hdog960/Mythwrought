# MYTHWROUGHT SKY S3 — THREE ORIGINAL MOONS
Status: staged in draft PR #269, source-exact acceptance pending.

**Protected parent:** accepted S2 `9606b32f32d5a2252923b8f833a8dd0d54bed2bb`. Strictly no merge, rebase, Pages deployment, save schema edits, Creative, builder, cave, biome, automation changes or v0.11 unlock.

## Astronomical implementation
- Exactly THREE original mystical moons in the original sky shader's fullscreen triangle. **Aurel the Pearl Crown**: large pearl-gold, 7 in-game-day lunar phase cycle. **Vesper the Amethyst Veil**: medium violet, 11-day cycle. **Thal the Verdant Lantern**: small sea-green, 17-day cycle.
- The S1 24-minute DAY/NIGHT phase remains authoritative for time-of-day and rising/setting. Each moon additionally advances on its own 7/11/17-day deterministic orbital drift and illumination cycle. All three are in world-space and project through the actual existing yaw/pitch/aspect/72-degree camera, not HUD sprites. Sky rendering remains **one opaque draw pass, zero textures, zero extra vertices**, with an early-out per-moon fragment branch and low-cost illuminated-disk terminator.
- Moon age persists in an independent, fail-closed per-seed record `mythwrought-sky-s3-lunar-<seed>` with strict `{version:1,seed,wallEpochMs}`. This is separate from S1 clock and schema-1. The record is created once, then read-only; no per-frame storage. Invalid/pre-existing sidecars are preserved unchanged. Corrupt world read-only mode never writes a lunar record. Switching DAY/NIGHT advances time of day but **does not restart lunar age or phase**; real elapsed time resumes on reload and across page background.
- At night, illuminated visible moons provide a small additional cool ambient amount capped at 0.105; the existing S2 minimum nighttime brightness remains. No fake torch pools, moon shadows, mobs, S4 stars or cloud changes.

## Non-negotiable acceptance
- Dedicated `tests/sky-moons.test.mjs`: exactly three unique original bodies, normalized orbit vectors, independent phase periods, full/new/waning illumination, across-day continuity, same seed reload, cross-seed isolation, damaged record preserved, read-only protection, day/night setting doesn't reset phase, S0–S2 shaders/clock unchanged.
- **Actual production-game Chromium WebGL2** at 667×375, 844×390 and 932×430. Real menu SET NIGHT/SET DAY, real ArrowUp camera pitch, all three projected moons inside visible sky, screenshot-pixel validation of illuminated bodies (no mock canvas), S3 lunar age changed by sidecar-only test after two game days, moon phases change independently, unchanged schema-1 and non-sky storage, 25 real chunks and zero GL or JS errors. Corrupt lunar sidecar must remain unmodified. 18+ genuine screenshot PNGs plus SHA256/PNG-dimension manifest.
- Rerun exact original S2 real gameplay and S1 menu, save and world switch browser suites, then independently audit the screenshot PNG bytes/hash/visual framing.
- A/B/B/A same-run baseline **accepted S2 commit** versus current S3 exact HEAD on 3 phone landscapes, full-game FrameHistory, guard against >20% FPS loss or major p95 regression, no claims of physical iPhone performance. If performance fails, repair S3 owned behavior, not the original tests.
- On same exact HEAD require 12 CI contracts, full repository native, 20 live WebGL2 scripts, depth, Manual Five Pack and Pack3 regressions all SUCCESS. No merging or deployment.
- S4 stars/clouds, S5 rare sky events, S6 biome variants and S7 actual Safari/Home Screen offline/thermal acceptance remain future roadmap stages.
