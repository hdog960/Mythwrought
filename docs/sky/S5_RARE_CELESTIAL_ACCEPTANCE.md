# MYTHWROUGHT SKY S5 — RARE CELESTIAL EVENTS

**Source state:** isolated draft PR #269, parent accepted S4 `a80cf705c539360440eabe8d7ffe931f9a730a7d`. S5 is not accepted until all exact-HEAD workflows and visual artifact audits pass.

## Celestial content and deterministic rarity

S5 adds four original, optional, visual-only phenomena **inside the existing one-pass WebGL2 sky**:

- **Ember meteor:** warm pink-gold traveling head and delicate tail. One bounded 52-second window per **29 elapsed lunar days**, only in a dark night sky.
- **Luminous arc:** cool violet spectral crescent/veil. A roughly 81-second appearance every **53 elapsed lunar days**, visible from an appropriate camera angle.
- **Silvertail comet:** a delicate pale-cyan head and diffused tail. One roughly 98-second window every **97 lunar days**.
- **Exceptional three-moon conjunction:** an ethereal overlapping halo generated **only by genuinely aligned, illuminated, above-horizon three-S3-moon world-space vectors**, not a fake date flag. A pairwise minimum moon dot-product above 0.98 activates; illumination, altitude and night darkness also gate it.

The phase/window and the scheduled lunar day come from existing S1 `normalizeSkyPhase` and independent S3 `sampleThreeMoons`; no new storage or timers, no RNG, no game-state writes. Normal nights are free of S5 event pixels, and all events fade away under daylight. Events project through the actual player camera and are not HUD overlays, weather, hazards or mandatory mechanics.

## Architectural boundaries

Only S5-owned `src/sky-events.mjs` plus narrow S5 hooks in the existing sky fragment, GPU uniform cache, and draw loop. All older sky, voxel, Creative, biome, cave, builder and automation data remains unchanged; no render passes/textures/geometry added. S4's original star-cloud shader and three S3 moon discs remain. Weather, mob behavior, biome sky and game damage are explicitly out of scope.

## Exact-head acceptance

1. Validate 4 deterministic event kinds, true vector-based lunar conjunction, 1000-lunar-day rarity, one-window-only scheduling, smooth endpoints, 24-minute repeatability, daylight exclusion, no new storage, and S1–S4 native source contracts.
2. Run **real original-game Chromium WebGL2** at **667×375**, **844×390**, and **932×430**. Capture genuine non-event night, meteor, arc, comet, lunar conjunction and clean day, including original-game canvas images (62 PNGs total, including matched same-phase non-event controls and 932×430 meteor reload proof). Use only isolated S1 and S3 sidecars for test reproduction. Verify meaningful bright event pixels, actual center in camera frame, S3 moons preserved, 25 resident chunks, zero browser/GL errors, all schema-1 bytes unchanged and SET DAY extinguishes events. No simulated art or teleport.
3. Independently download and inspect ZIP bytes, manifest exact HEAD, SHA256 for **each** decoded PNG, expected dimensions, correct event appearance, non-event sky and moon/star continuity.
4. Rerun all **unmodified** S4, S3, S2, S1 actual original-game Chromium browser regressions. Audit genuine PNG manifests separately.
5. Run paired same-GitHub-runner **ABBA/BAAB S4 vs S5** at all phone landscape sizes, enforce inherited >20% FPS loss guard and severe p95 limit, no claim of physical iPhone performance.
6. Require **12/12 CI contracts, full root native, 20/20 original-game Chromium WebGL2 scripts**, 10× depth, Pack3 and Manual Five Pack success on **the same precise HEAD**. No test weakening or out-of-scope edits.
7. Preserve draft, production `main`, schema-1, v0.11 lock and earlier roadmaps. No merge, rebase or deploy.

S6 biome-specific sky differences and S7 real iPhone Safari, PWA offline, heat and battery tests remain deferred. S5 acceptance does not certify an actual iPhone.
