# Authority 06 — Technical architecture, data integrity, verification
**Status:** proposed implementation contract subject to measured iPhone validation.

## Deployment/requirements
Static GitHub Pages with zero paid services. Offline-capable PWA once implemented and verified. Landscape iPhone Safari and installed Home Screen tested independently. Browser code runs locally; GitHub Pages DOES NOT host an always-on AI/NPC simulation, multiplayer state or backend. Avoid mandatory third-party CDN dependencies and external API keys. Deploy from main only after CI; preserve rollbacks and previous saves.

## Voxel architecture
Deterministic PRNG/noise and stable versioned world-seed generator; chunk partition, mesh greedy face culling where appropriate, terrain LOD for long cave sightlines, asynchronous time-sliced generation/meshing and bounded upload/frame work. Real block edits persisted separately from untouched seeded terrain, with provenance for automation and wildlife exclusion. Water/lava local work queues and capped propagation. Cave/city procedural overlays reserve placeable story structures. Save surfaces, underground and player modifications in ONE world coordinate system.

## Input/rendering
WebGL2 baseline with capabilities checks; evaluate WebGPU later as optional optimization only if tests justify. On GPU failure, recover or clearly show a descriptive message rather than blank screen. Separate world canvas viewport from side controls/compass; no pointer capture requirement for touch aiming. Tune pixel resolution and draw range dynamically after profiling; never claim 60 FPS or any particular chunk distance without measurement.

## Persistence contract
Versioned world manifest {seed,generatorVersion,schemaVersion}, chunk edit deltas, protagonist inventory/stats/learned spells, authored quest flags, companions, residents, wiring/energy/machines, ecology/sanctuaries, custom map pins, named colored portal anchors, Death Echoes and game preferences. IndexedDB preferred for sizable data; localStorage only for tiny prototype state/preferences if clearly labeled. Atomic/transactional restoration of Echo payloads, item conservation across machines, consistent seed/coord mapping, backup export and reimport, schema migration with fixtures, storage-quota warnings, save replay tests. “Persist” means recoverable after crash/reload, not just surviving in live JS memory. Save older schemas, create backups before migrations and provide user-owned export.

## World simulation budgets
Active local chunks: per-entity AI, pathing, animations, fluid stepping, circuit events and machine actions. Far-away: deterministic bounded offline/event summaries, never generate free resources or fabricate quests. Stable event ordering with safety quotas and circuit cycle prevention. No recursive unbounded machinery loop. NPC pathfinding locally recomputed upon modified walkable terrain. Sanctuary/quarry zones saved explicitly. Mobile memory headroom and pausing/resuming tab are treated as first-class test cases.

## Test matrix
1. Node pure logic tests: seed determinism, chunk coordinate mapping at negatives, edit overrides, save/restore and corruption handling, no duplicate Death Echo recovery, inventory invariants, progression rules and safe bounds.
2. Automated Chromium/browser tests: first world draws without black screen, landscape grips stay outside central canvas, world edits visually apply/persist after reload, controls respond, touch emulation, resume from background, fallback message on context loss and no console errors.
3. Real iPhone Safari + Home Screen manual visual gate: movement/look/attack hand reach, device thermal/memory behavior, deep cave graphics, long play, orientation/safe area, storage after force quit, airplane/offline behavior if PWA.
4. Deployment test: exact main SHA, Actions run status, HTML/asset HTTP retrieval, live page functionality; wait to claim deployment until evidence available.

## Verification honesty
Release ledger reports implemented vs design-only, file scope, automated tests run, actual commit SHA, Pages status (enabled/verified/unknown), remaining risks and user's next acceptance question. Do not say deployed merely because branch was pushed. Preserve no-cost requirements and never enable paid infrastructure by assumption.

## Feasibility contingency
If real device fails, profile and optimize chunk/texture/meshing before cutting locked creative goals; explicitly bring forward any genuine incompatibility for user decision. Gate A = engine/control/persistence stability, Gate B = premium art approval, subsequent gates = feature/system quality. Gate names are not permission to bypass visual approval.
## v0.02 implementation note (not a new design requirement)
- Seed text is NFC-normalized; decimal integer strings wrap to signed 32-bit with BigInt, other text uses a fixed 32-bit hash. Signed numeric IDs are displayed, and the unchanged generator reads their values deterministically.
- Prototype worlds store edits under per-seed localStorage keys; startup prefers previously selected seed and falls back to the legacy v0.01 default slot. Do not claim this is production-grade save architecture.
- Browser test now checks screen pixels from an actual Chromium screenshot rather than relying on a WebGL backbuffer (which may be discarded after compositing). This guards against a visually blank canvas.
- Chunk meshes are rebuilt nearest-first with a bounded active radius, and old queued requests are discarded. Actual iPhone memory and touch responsiveness are not yet measured.

## v0.03 technical checkpoint (verified code, not final iPhone acceptance)
- Separate fullscreen WebGL2 sky pass uses original fragment art (daylight gradient, sun, light cloud streaks, distant hazy mountain silhouette) without network asset dependencies or physics-changing terrain geometry. Material pass restores depth testing and uses a matching sky horizon fog palette.
- Camera angle math is shared by pointer/arrow controls and bounded, with persisted adjustable sensitivity. The global keyboard handler does not intercept input/select/button controls; iPhone menus can scroll vertically while movement/look pads and the canvas block gameplay panning.
- Node checks verify shared chunk-boundary face culling and camera math. Chromium checks verify live GPU rendering and correct control location, actual world edits, seed changes and screenshot colors.
- Actual Safari/iPhone thermal, touch accessibility and real game-world streaming acceptance still require device testing; v0.03 is not Gate A or an art approval.

## v0.04 implementation checkpoint
- Shared pure input functions normalize both thumb pads radially, with deadzone (prevent resting-finger drift), rate-based optional stick look and bounded relative swipe deltas; precise movement/camera are owned by independent browser pointer IDs and safely released on cancel, blur, app hide, menu open and pagehide.
- A selectable stored swipe/stick camera mode, original controls inside decorated side grips, a temporary fine-aim modifier and saved sensitivity do NOT place HUD elements over the viewport.
- Replace step-sampled targeting with voxel grid DDA, including exact signed chunk seams, tie traversal and true adjacent empty-cell placement. World-space cube outline is drawn in WebGL with depth testing.
- React to WebGL context loss by pausing stale GL draw calls and showing a reload explanation; no false claim of GPU state restoration.
- Static browser verification uses two Chromium suites including Chrome DevTools-dispatched simultaneous two-finger touches; these are **not** substitutes for actual iPhone Safari, assistive touch or thermal profiling.
- Maintain seed-specific localStorage saves and export/import as temporary engineering foundation, not production-safe backups. Stored format remains unchanged.
