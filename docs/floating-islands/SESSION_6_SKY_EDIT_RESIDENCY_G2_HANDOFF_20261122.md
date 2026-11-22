# MYTHWROUGHT Floating Islands — Session 6 source-only handoff (2026-11-22)

## Exact provenance and protection

- Starting research branch `research/floating-islands-sky-runtime-adapter-20261122` HEAD: `572c31895b3e1c894ed15e5313b3f6281a3c7fd2`.
- Protected production `main` HEAD at one-time check: `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Read `docs/floating-islands/SESSION_5_SWEPT_FLIGHT_GPU_CAS_HANDOFF_20261122.md` directly from exact starting branch.
- GitHub branch, PR and commit searches did **not** reveal Codex's floating-islands generator; the user screenshot is not verified code. The actual island frequency, plant distribution, Y256 worldgen, save format, daylight visuals and iPhone FPS are still **unverified**.
- A single direct local `git ls-remote` attempt again failed DNS for github.com. The three earlier `sky-original-native.test.mjs` genuine original-repository tests therefore remain **UNRUN**. No workflow was requested to circumvent CI anti-clogging.

## Four new isolated production-compatible modules

**1. `src/floating-islands/sky-sidecar.mjs` — provisional isolated save ledger**

- New distinct `mythwrought-floating-islands-provisional-1` format, **NOT Codex's format** and NOT existing Schema-1. Strict original world seed (signed int32), stable world identity, generator fingerprint, edit revision, and maximum 8,192 sky edits. Height Y20..256, bounded distant signed X/Z.
- Immutable, internally indexed per-cell edits; `id=0` is a real mined AIR override even when the generator naturally emitted a physical block. Original-valued unrotated edits are omitted and redundant edits are no-ops.
- Source-approved numeric block and rotation checks, duplicate/invalid row rejection, fail-closed world/fingerprint/revision mismatch, deterministic sorted JSON snapshot and strict restore. No `VoxelWorld.save`, `VoxelWorld.set`, localStorage, WebGL, generator, or actual persistent save writes.
- The generator fingerprint is a caller-supplied compatibility fence, not proof that the unknown Codex generator has been found. This provisional format must be reconciled with Codex's actual sky edit sidecar before live storage.

**2. `src/floating-islands/sky-edit-session.mjs` — physics/edit-to-mesh bridge**

- Builds authenticated source-backed edit proposals from the provisional ledger, exports copied `skyEdits` and `skyRotations` maps compatible with the previously authored detached `sky-original-host.mjs`, and provides read-only cell/rotation views.
- Composes the **unchanged exact** `planSkyIslandEditInvalidation` for upper Y-seams and the original Y19/Y20 ground-sky boundary. Invalidation is planned before a new session is exposed; no actual save or GPU work is performed.

**3. `src/floating-islands/sky-body-residency.mjs` — fixes an important source-only six-slot deadlock**

- The prior default `planSkyIslandResidency` allowed only **6 upper slots**, yet `skyIslandBodyRegions({x:0,feet:35.5,z:0})` requires **8** upper sections (2 vertical x 2 horizontal X x 2 horizontal Z) for full-body flight readiness. The old default cannot satisfy that combination.
- This separate opt-in planner elevates the **eight genuinely supplied** body-region candidates first, preserves original 3x3 nearby ground priority, uses the **real production `depthMeshKey(cx,cz,0)` grammar `cx,cz` instead of abstract `ground:cx,cz`**, keeps a maximum of **25 total** sky plus ground GPU slots, and requests at most **2 sky meshes** each planning pass.
- It refuses the scene publication plan if a required source candidate is missing, refuses flight until all required upper sections are actually GPU-resident, and does not manufacture unprovided generator voxels. All additional physical body collision certification still belongs to original G2/sky physics.
- No new shadow pass, ground light darkening or independent night clock.

**4. `src/floating-islands/sky-g2-orchestrator.mjs` — detached G2 dual-source coordinator**

- Composes exactly the prior `planSweptSkyFlight`, `verifySkyCreativeFlightStep` and `planSkyCreativePrefetch` contracts with original-G2 approval. A motion plan can be used ONLY if **both** original G2 and all swept real-world+sky body checkpoints approve.
- Supports source-marked `originalG2DeniedBySkyResidency` to prefetch missing sky sections even while original G2 refuses movement. Non-sky G2 refusals request no phantom sky work. At most 2 new sky requests/6 pending; strictly namespaced upper keys.
- Re-checks world identity during a swept step, cancels previous world pending keys if identity changes, prevents >0.75m/frame bypass, and never alters live player coordinates, original G2 state, WebGL buffers or saves.

## Focused evidence, non-redundant CI

- Exact source/test bytes created and executed locally under Node **v22.16.0**, then all **8 new GitHub blob SHA-1 hashes matched** local `git hash-object`:
  - `tests/floating-islands/sky-sidecar.test.mjs` — **11/11 passing**
  - `tests/floating-islands/sky-edit-session.test.mjs` — **7/7 passing**
  - `tests/floating-islands/sky-body-residency.test.mjs` — **9/9 passing**
  - `tests/floating-islands/sky-g2-orchestrator.test.mjs` — **11/11 passing**
- **38/38 focused new tests passed**, including the six-slot seam defect, direct source-key parity, stale generator/seed/world, physical sky AIR mining, live Y19/20 invalidation, source-backed three-dimensional flight, and distant signed coordinates beyond 10k.
- Original dependency modules `sky-runtime-adapter.mjs`, `sky-creative-bridge.mjs`, `sky-flight-sweep.mjs`, `sky-gpu-transaction.mjs` locally matched their exact prior GitHub blobs without changes.
- Earlier 75 Session 3 + 8 Session 4 fixture + 28 Session 5 tests are previously verified historical evidence and were **not redundantly rerun** here.
- The three authentic original `VoxelWorld` native tests remain **UNRUN**. No authentic original-game WebGL2 tests, original Codex generator execution, iPhone/browser benchmarks or actual PWA acceptance are claimed. No GitHub Actions were launched.

## Next source-engineering priority

1. Obtain Codex's actual pushed generator and verify its section-index ABI, physical material IDs, seed distribution, upper edit keys, save format and authoritative physics. Adapt the provisional ledger and planner rather than replacing Codex's design.
2. Run the three authentic original `sky-original-native.test.mjs` tests against a complete exact-revision original repository checkout ONCE; fix any actual registry/physics errors.
3. Connect the detached `sky-original-host`, edit session, G2 coordinator, eight-slot safety planner and GPU-CAS publication to a renderer-owner-specific integration **only on an isolated branch**, with signed chunk keys, exact epoch/context fences, max 25 GPU slots and no ground darkness. Test under actual daylight/night and three moons.
4. Validate real upper voxel mine/place through save/reload and true source collision/raycast; 10,000+ blocks in positive and negative coordinates; living detailed vegetation using valid physical catalog entries; four iPhone viewports, WebGL2 FPS/p95, GPU caps and installed Home Screen PWA.
5. Retain **short-term scope only**. No island settlements, mobs, artificial structures or long-term content development.

## Release/owner guard

This is **source-only research**, not a playable or accepted island build. Other developers' lanes, production main, original G2 and game files, protected CI, user saves, Pages and PWA deployment were not modified. No unapproved merge, deployment, rebases, CI cancellation or alteration of others' work. Continue using targeted native tests, exact-revision evidence and no redundant browser runs.
