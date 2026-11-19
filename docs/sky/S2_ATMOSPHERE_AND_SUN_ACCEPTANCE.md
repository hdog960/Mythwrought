# MYTHWROUGHT SKY ROADMAP — S2 ATMOSPHERE AND SUN

**Status:** source-implemented, protected DRAFT PR #269. Acceptance is NOT complete until one exact HEAD passes all gates and the artifact audit.

**Accepted parent:** S1 `ec62cb022ffcd9a1759b456f8e3a9c501a18d293`, originally from production `main=e9223217ef1e91d282900c3fc13a21eeda316b63`. Preserve all 24-minute clock semantics and schema-1 save bytes.

## Rendering implementation and gameplay intent

- Authoritative 1,440,000ms S1 clock sampled once per render frame, without using player-movement dt. Midnight 00:00 is phase 0; sunrise 06:00, noon 12:00 and sunset 18:00 are quarter-cycle points.
- The one real sun follows a deterministic world-space great-circle orbit, rising east and setting west. The existing 72-degree camera projects it into the sky shader, so the sun is stationary relative to the world but moves relative to the player's view. Invisible when below horizon or behind camera; no painted/static fake sun.
- `src/sky-atmosphere.mjs` is a pure, no-I/O CPU model. It samples continuous day/twilight/night zenith, horizon, distant ridge, clouds, sun glow, fog, and terrain-ambient colors. No procedural noise or random flickering.
- Retain the original fullscreen WebGL2 sky triangle and procedural wisps; no extra draw calls, textures, raymarch, particles, weather, stars, S3 moons or S4 new moving cloud layers.
- `src/main.mjs` pipes **one atmosphere sample** to both fullscreen shader and existing terrain fog uniform `uFog`, and adds a cool `uSkyLight` multiplier in economy, storybook material and water paths. Original physical meshes, shader material taxonomy, block IDs, saves, Creative, cave and builder geometry unchanged.
- Night is balanced, not black: terrain ambient RGB minimum 0.42, fog remains readable cool-blue. These are ambient atmosphere effects, not dynamic shadows, point lights or mob behavior. S3 exactly three moons remain reserved.
- WebGL2 program uniforms are rebound by the existing context restore path; no process-local GPU program handles are persisted. No extra stateful frame driver, timers, save writes or repeated DOM work beyond existing 4Hz S1 clock status and low-rate read-only sky metrics.

## Exact HEAD acceptance contract

1. All inherited S1 deterministic clock, menu controls, persistence and world switch regression tests must pass unchanged.
2. `node --test tests/sky-atmosphere.test.mjs`: original 24-minute sun orbit, sunrise/sunset projection with real voxel camera, continuous full-cycle color and fog, bounded pigments, non-black moonlit ambient, no S3 content and no change to canonical shader artwork module.
3. `node tests/sky/s2-atmosphere-browser.mjs`: actual original game in real Chromium WebGL2 with SwiftShader at **667×375, 844×390 and 932×430**. Use the *real* SET DAY and SET NIGHT buttons, assert day/night terrain and sky brightness differences, non-black moonlight, fog/ambient synchronization, 25 resident chunks, zero GL errors, full side-grip clearance and unmodified schema-1 bytes. At 932×430 inject **only the independent S1 clock sidecar** for reproducible 07:00/17:00 and use real keyboard camera rotation to capture the sun in sky. No fake world/camera/renderer path, no teleport.
4. Capture **16 PNGs** (full-screen day/night settings and canvas world across 3 landscape sizes, plus 2 full-screen and 2 canvas sunrise/sunset directional captures), a manifest of exact source HEAD / SHA256 / dimensions / pixel luminance / GL and storage checks. Independently download and inspect actual PNGs, hashes, dimensions and framing.
5. Run the exact original S0 quiet-frame software Chromium performance capture protocol (same 3 viewports, same render preset), compare S2 median/p95/FPS with S0 and S1. **Because runner load can distort runs, also perform a same-run 4-trial ABBA/BAAB paired comparison with read-only git-archived S0 production served on port 4174 and S2 on port 4173**, never modifying or rebasing either branch. Inspect ratios before S2 acceptance. Synthetic Chromium is **not** a physical iPhone benchmark. If a meaningful regression repeats under paired measurement, diagnose it before acceptance; never weaken visual checks.
6. Exact same HEAD must pass complete 12 CI contracts, full repo native, **20 real WebGL2 scripts** and all triggered full-depth, Pack3 and Manual Five Pack regression workflows. Do not infer exact-head success from earlier commits.
7. S2 modifications must remain confined to `src/sky-atmosphere.mjs`, `src/sky.mjs`, `src/gpu-pipeline.mjs`, `src/main.mjs`, tests/docs/workflows under `sky`; all unrelated production and save owner paths untouched.
8. Keep PR **draft/unmerged**, do not rebase or deploy, do not unlock v0.11. Manual physical iPhone Safari, Home Screen offline, heat and battery tests remain S7.

**Stop/go:** S2 only accepted once its exact-head evidence is green and independently checked. Do NOT begin S3 until S2 is accepted.

## S2 paired performance qualification

The **initial cross-run** quiet-frame result under varying CI load was slower than historical S0. An exact-run ABBA/BAAB pair using the immutable original S0 source and S2 on the **same Chromium runner** established no repeatable large FPS regression: 667×375 22→22.5 FPS; 844×390 16→15; 932×430 14→14. All p95 medians stayed within 10% of S0, and all 25 chunks and real GL remained valid. These are software-renderer measurements, never physical-iPhone acceptance. A guard rejects >20% FPS regression or >30%+10ms p95 regression in future paired sky runs. The historical warm daylight sky color remains a live input anchor in the S2 shader to preserve the original storybook source contract without weakening tests. Final numbers must be reverified at the final exact commit.
