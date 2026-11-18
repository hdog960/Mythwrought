# MYTHWROUGHT SKY ROADMAP — S1 CLOCK AND MENU CONTROLS

**Status:** staged, exact-head acceptance pending. This is a protected draft PR #269; not merged, deployed, rebased, production-registered, or v0.11-unlocked.

## Scope and clock semantics

- Preserve accepted S0 baseline at `7840b4cb22a1209406abdfb465b3630af16709c3`, original production base `e9223217ef1e91d282900c3fc13a21eeda316b63`.
- World day duration is **1,440,000 real milliseconds = exactly 24 minutes**. `src/world-clock.mjs` expresses time as an in-world phase in `[0, 1,440,000)`, independent of rendering FPS, chunk streaming, player physics, and the existing 35-ms movement-delta clamp.
- S1 defaults to in-world **12:00** when a seed's clock is first created. The menu's **SET DAY** jumps to **12:00**, **SET NIGHT** jumps to **00:00**. Neither action pauses, slows or restarts the automatic 24-minute loop. These clock targets are chosen to give future S2/S3 a stable phase model.
- The clock uses a monotonic `performance.now()` anchor during an active session; it advances while settings are open, and elapsed time catches up when the document resumes after backgrounding. Wall time is sampled only when loading/reloading or explicitly selecting a new time, to recover the phase across reloads. Do **not** substitute frame-counted time, per-frame `dt`, or visual shader randomness.
- Every seed has its own separate `mythwrought-sky-s1-clock-<seed>` localStorage record containing only `{version:1,seed,wallAnchorMs,anchorPhaseMs}`. It does not modify the user's canonical schema-1 world, previous-good backup, journal, mirrors, installed builders, or seed-selection preference.
- Existing clock sidecars are validated fail-closed: invalid records are preserved unchanged and S1 operates session-only; quota/permission failures leave the in-memory clock usable, with a visible session-only warning. A protected corrupt world runs sky time session-only and never writes even its sky sidecar.
- `src/main.mjs` exposes read-only canvas attributes `data-sky-clock-phase-ms`, `data-sky-clock-cycle-ms`, `data-sky-clock-time`, `data-sky-clock-seed`, `data-sky-clock-persistence` for integration and exact-source browser testing. Clock status text updates at most twice per second while active; math is inexpensive and requires no new GPU resources.
- The **two buttons appear only inside the existing scrollable `#help` settings sheet**. `#menu`, `#closeHelp`, existing left/right touch grips, creative flight, exploration map, graphics recovery, world save/import/restore and rendering presets remain authoritative.

## S1 boundaries

**No visible day/night lighting change yet.** `src/sky.mjs`, existing sky shading, terrain fog, materials, sun, moon and clouds remain unchanged; S2 uses this S1 clock to move the sun and atmosphere; S3 adds exactly three moons. S1 screenshots demonstrate actual production-game WebGL2 gameplay, the existing sky and the working time controls—not finished night lighting or majestic art.

## Acceptance requirements

- `node --test tests/world-clock.test.mjs`: deterministic 24-minute wrap, midnight/noon selectors, monotonic behavior through settings and elapsed time, seed isolation, reload, invalid sidecar, protected world, storage failure, unchanged schema-1 bytes and no periodic storage writes.
- `tests/sky/s1-clock-browser.mjs`: full original-game mobile Chromium with real WebGL2 at **667×375, 844×390 and 932×430**. Verify 25 resident chunks, zero GL errors, no page or HTTP errors, two accessible buttons and scrollable settings, time jumps exactly as specified, clock advancing with settings open, no changes to canonical save, reload retaining the selected time, and distinct world-clock state through an actual in-game world switch.
- Capture **12 authentic, source-specific PNGs** (day/night settings and day/night gameplay across three screen sizes), plus exact-head JSON manifest with image SHA256, PNG dimensions and source identity. Independently download and inspect image bytes, hashes, framing and any visual regressions.
- Exact same staging commit must also pass existing **12 CI contracts, full repository Node suite and 20-script WebGL2 gate**, plus relevant depth/pack CI runs that trigger for shared files. Never treat older green CI as exact-head approval.
- Compare non-hardware Chromium performance against S0 cautiously. Genuine iPhone Safari/Home Screen, thermal and offline acceptance belongs to S7; no claim that a web-app manifest alone guarantees offline PWA caching.
- All S1 commits remain isolated in draft PR #269. **No merge, rebase, deployment, production registration or v0.11 unlock.**
