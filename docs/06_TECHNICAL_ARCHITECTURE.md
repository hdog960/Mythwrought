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

## v0.05 technical checkpoint
- Physical controller side widths are computed from available CSS safe-area-adjusted space, protected world-viewport minimum and persisted normal/large control size. Browser mobile viewport height is synchronized at resize/visualViewport events to keep buttons and footer fully on-screen; portrait orientation message remains.
- Grip graphical treatment is pure original CSS with no external textures or assets; grips and decorative ornamentation are outside the world canvas. Larger thumb targets and proportional knob translations preserve bounded joystick values from v0.04.
- Automated acceptance explicitly measures control and footer containment in 568×320, 667×375, 844×390, 932×430, 1180×520, saved control preference after reload and simulated nonzero left/right safe insets; normal world-render, saved seeds, mining, DDA targeting and real Chromium dual-touch suites continue to pass.
- A first screenshot-based inspection exposed lower controls clipped at compact landscape sizes; the defect was corrected and the test strengthened, not waived. Real iPhone Safari/installed PWA must still be tested independently.

## v0.06 technical checkpoint — player collision and movement
- Replace old three-point collision probe with exact AABB overlap of all blocks intersecting the hero (radius 0.28 blocks, height 1.78 blocks). Physics is local to the existing continuous world coordinates, including negative chunk boundaries and user-edited terrain.
- Bounded substeps (at most 0.05 s of simulation per browser frame, physics dt at most 1/90 s) avoid jumping through a solid voxel on a slow frame. Horizontal axes resolve independently for sliding, with binary separation; vertical ascent/descents stop at collision surfaces.
- One-block stair stepping requires both complete head clearance and real support; two-block walls and low roofs cannot be bypassed by the step mechanic. Walking off an edge or removing a supporting block permits gravity. Accurate ground-contact threshold fixes premature mid-air stopping, while brief jump buffering/coyote-time assist accessible controls.
- Ground-speed acceleration remains responsive, but finger/key release uses strong velocity damping so movement does not continue drifting. Spawning scans nearby terrain/builds for a non-embedded standing location; the old prototype's void reset remains explicitly temporary.
- Chunk-window desired sets are refreshed on center changes instead of every frame; GPU buffers outside the active window are deleted immediately and newly visible chunks are still meshed in bounded work units.
- Automated browser evidence demonstrates a real jump/landing, horizontal movement, no collision embedding, capped chunk buffers and no missing assets in Chromium. **Not proof of actual iPhone Safari touch, thermal behavior, or production save resilience.** All user design authority requirements still govern later RPG and sandbox implementation.

## v0.07 verified boundary/streaming checkpoint
- Chunk coordinates and culling remain global: each mesh queries neighboring voxel IDs outside its own 16×16 bounds, preventing internal paired faces at both positive and negative chunk seams. Material tint uses world-space noise, not per-chunk seeds.
- A block edit determines the owner and only the face-adjacent neighboring chunks it actually borders; **loaded** affected meshes are built and published together in the same event turn rather than exposing a halfway-edited frame. A failed GPU upload preserves old GPU meshes and reverts the voxel model; unloaded neighboring chunks are meshed from up-to-date world state when approached.
- The normal chunk queue still uploads at most one missing chunk per frame, prioritizes proximity, retains a 5×5 window, and deletes obsolete buffers. These controls are prototypes and do not guarantee final low-memory iPhone performance.
- Input direction regression: invert **horizontal touch movement and touch camera** for swipe and stick modes; vertical touch and keyboard behavior are unchanged. Tested in Node and CDP-dispatched Chromium multitouch; physical iPhone acceptance pending.
- Save schema 1, named seed slots, edit persistence and JSON export remain compatible; no destructive migration. The v0.07 localhost-only browser diagnostic helper is not available on the public GitHub Pages hostname.

## v0.08 basic block tools checkpoint
- A pure interaction module inspects the first visible voxel in a 6-block ray, calculates the adjacent empty build destination, enforces the ordinary v0.08 stone/timber/crystal palette and rejects unsupported actions, outside-height edits, occupied placement and overlap with the player-sized AABB.
- Mutation runs only after validation. On GPU chunk-boundary remesh failure the original voxel is restored, preserving save compatibility. Only successful edits trigger the existing per-seed local save; the UI accurately distinguishes localStorage save failures instead of claiming an edit is safely persisted.
- The rendered selection adds an amber adjacent world-space build-outline to the teal mine outline. No HUD or buttons intrude on the central gameplay viewport; target labels, range and build-space hints remain inside the right controller grip.
- Material shading adds low-cost original deterministic procedural wood grain, stone flecking, faceted crystal variation and ore detail without external textures, new paid dependencies or a change to terrain block IDs.
- [CI 43076661825](https://github.com/hdog960/Mythwrought/actions/runs/43076661825) confirms six real browser suites and 61 Node checks, including previously verified seed/negative-coordinate seams, dual-touch horizontal fixes, movement and new build interactions. Physical iPhone performance and full user art acceptance are still unverified.

## v0.09 save integrity checkpoint — no breaking migration
- Preserve the existing static Pages/no-server model and **canonical original schema-1 JSON under each exact pre-existing v0.02 seed key**. The world generator version, terrain edits, negative-coordinates and all uploaded/exported schema-1 format stay unchanged. No IndexedDB migration has occurred.
- Per-seed checksum sidecar plus previous-good snapshot: validate and back up a prior canonical world, write/read-back a journal with checksum, write/read-back canonical bytes, and only then report success. On corrupt primary, recover from a verified journal or previous-good snapshot; do not erase the damaged original bytes automatically. Explicit user-approved damaged-world restoration preserves those damaged bytes in a separate key first.
- A failed or interrupted save is reported without falsely claiming persistence; seed switches fail safely when the active world cannot be verified saved. Duplicate edit coordinates, malformed schema, oversized files and mismatched seeds are rejected. Importing conflicting valid changes requires user confirmation and retains the old valid snapshot. Exports remain user-owned schema-1 JSON with no proprietary wrapper.
- Real Chromium regression detected unconditional `pagehide` writes overwriting artificially damaged canonical bytes even on an unchanged world. The fix only retries genuinely dirty edits and preserves corruption for inspection/recovery.
- Test evidence: [merged main CI 43084781057](https://github.com/hdog960/Mythwrought/actions/runs/43084781057) with 77 Node tests and 7 Chromium suites, plus [public Pages deployment 43084781232](https://github.com/hdog960/Mythwrought/actions/runs/43084781232).
- Limitations: localStorage can still be evicted, filled or disabled; checksum is for accidental corruption, not cryptographic tamper security. IndexedDB with atomic multi-object transactions, migrations, off-site/player backup and mobile force-quit tests remain future work. **No v0.10 Gate A approval assumed.**


## v0.10 Gate A in-progress — optional IndexedDB backup vault, not a production migration
- `src/vault.mjs` opens a separate same-origin IndexedDB database `mythwrought-v010-optional-vault` only when a user invokes vault controls. It retains independent per-seed immutable snapshots with `raw` original schema-1 bytes, seed, edit count, timestamp and noncryptographic FNV integrity checksum. No automatic snapshot creation, world-save migration, startup import, cloud/telemetry or permanent schema key mutation.
- Snapshot creation must parse/validate input BEFORE starting an IndexedDB write transaction. A successful transaction is not reported as verified until a new read returns and validates the exact bytes. Failed/quota-denied writes cannot delete the prior backups or alter live localStorage.
- A maximum of six snapshots per seed requires **manual** offsite export/deletion rather than silent rotation. A snapshot list marks corrupted entries as damaged; selection for restore/export independently re-validates it. An explicit confirmation precedes both restore and deletion. Restore uses the existing v0.09 `saveWorldSafe` protective canonical-backup and damaged-byte paths and then updates world/chunk state only after successful validation/write.
- Separate download anchor is exposed only after async validation, permitting a subsequent real user gesture in mobile Safari. The export remains unwrapped schema-1 JSON; user can later import via the existing file import control.
- Until tested on physical iPhone, browser storage/IndexedDB quotas, transaction behavior, force-quit, Home Screen isolation, thermal behavior and long-world scale remain OPEN. This feature is a supplementary safety layer, **not** production-scale IndexedDB persistence or v0.10 Gate A completion.
