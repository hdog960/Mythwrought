# MYTHWROUGHT Floating Islands — Session 5 swept-flight and GPU publication checkpoint (2026-11-22)

## Provenance and protection

- Verified starting Floating Islands research HEAD: `a2ad01565de35c65b9522a7ec40209312216418c`.
- Protected `main` at the initial ref check: `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Research branch: `research/floating-islands-sky-runtime-adapter-20261122`.
- Read exact previous handoff: `docs/floating-islands/SESSION_4_ORIGINAL_PHYSICAL_SOURCE_BRIDGE_20261122.md`.
- One initial GitHub branch/PR/commit sweep found no pushed Codex floating-island generator. The user-provided Codex screenshot is **not a source checkout**; its sky world, saves, distant island frequency and geometry remain unverified.
- Direct local `git ls-remote https://github.com/hdog960/Mythwrought.git` failed DNS resolution (`Could not resolve host: github.com`). Original repository dependency closure was therefore not available to execute the three native original-game tests from Session 4. **Those three remain UNRUN.**
- No original `src/main.mjs`, G2, `src/voxel.mjs`, world generator, original assets, saves, CI workflows, other developer branches, `main` or Pages deployment changed.

## Substantial original-contract source engineering

### `src/floating-islands/sky-flight-sweep.mjs` — new, purely functional

- Adds a source-only physical **swept movement preflight**, compatible with original G2's 15 blocks/s maximum and 0.05-second frame clamp (max 0.750001 blocks per call). Samples the start and every <=0.25-block swept interval.
- Requires the real dual-world `verifySkyCreativeFlightStep` / physical-world host (or equivalent) as `certifyPoint`. Rejects unloaded sky region, original terrain unready, sky collision, start position invalid after edits, host exceptions, oversized movement, and stale world tokens.
- Optional live `readCurrentWorldToken` detects a world switch *during* a multi-sample sweep, not just at entry. The API has no player mutation, cannot arm/override G2, and does not assert it has been connected to the live original controller.
- Tests include vertical Y35/36 and negative x/z seam crossing, remote coordinates beyond 10,000, no-op safety, host failures and mid-sweep world switch.

### `src/floating-islands/sky-gpu-transaction.mjs` — isolated source modification

- Preserves original two-mesh max and 884,736-byte mesh quota while enforcing **25 total ground-plus-sky GPU resident slots** (previous staging API allowed maxResident 27).
- Before uploads, captures immutable `baseEntries` and base map identity. On stage completion, captures immutable `nextEntries`. These allow the subsequent renderer publisher to detect both in-place old-map mutation and tampering of the staged new map, even when keys and map sizes look similar.

### `src/floating-islands/sky-frame-publish.mjs` — new detached renderer-owned CAS

- Adds strict original world token, WebGL context token and renderer epoch fences, exact previous map ownership check, old and staged map entry equivalence, two-buffer staging limit and 25-slot resident maximum.
- A stale world/epoch/map discards the *newly staged* buffers, leaving old resident ground buffers intact. On WebGL context loss no unsafe `deleteBuffer` calls are made.
- Publishes the new chunk Map **before** deleting replaced buffers; handles a synchronous publish refusal with staged-buffer cleanup. If a host callback fails after swapping maps, attempts rollback; on unverifiable renderer ownership returns explicit **fatal/reset-needed** without freeing potentially live buffers.
- Subsequent transaction replay is refused to prevent double deletion. Delete errors after successful publication are disclosed for renderer-owned cleanup, never lied about as a rollback.
- Not connected to `src/main.mjs`, not a real WebGL2 upload/draw assertion, and no production GPU resources changed.

## Focused tests and anti-clog status

- Real local Node `v22.16.0`, using **exact source and test bytes verified against GitHub Git blobs**:
  `node --test tests/floating-islands/sky-flight-sweep.test.mjs tests/floating-islands/sky-frame-publish.test.mjs`.
- **28/28 PASS** newly committed focused tests: 12 swept movement / world token tests and 16 GPU-map publication, failure/rollback and staging-cap tests. Native `node --check` syntax passed on changed modules.
- Previously verified 75 source-only focused tests from Session 3 and 8 fixture tests from Session 4 were not redundantly rerun. The 3 actual original-source tests in `sky-original-native.test.mjs` are **UNRUN**, not passing.
- No GitHub Actions, Chromium/WebGL, iPhone tests, full `npm test`, duplicate CI, PRs, merges, deployments or cancellations were launched/performed.

## Next focused development

1. Obtain actual pushed Codex Floating Islands generator and its upper-section boundaries, real saved edit sidecar, and deterministic island ecology. Do not invent source or claim the existing screenshot verifies production.
2. If full original checkout becomes available, run the **three unrun** `sky-original-native.test.mjs` original `VoxelWorld`/biome130/raycast/collision tests once and repair mismatches only.
3. Integrate source-original host's `physical` and `world` callbacks into `planSweptSkyFlight`, then original G2's owner-controlled flight move. Keep the original nonpositive 0/negative section stream untouched and the new sky namespace disjoint.
4. Wire the existing source mesher and `stageSkyIslandGpuTransaction` plus `publishSkyIslandGpuFrame` to the actual renderer's owner/epoch/context state. Keep current 25 shared GPU slots, ground 3x3 protection and at-most-two sky uploads; run focused source/Node then a genuine original-game WebGL2 job only when necessary.
5. Complete true supported physical island vegetation on authentic generator source; missing registered ferns, flowers, and windgrass must not use made-up assets or render-only decorations. Ensure distant exploration (10,000+ blocks), no oppressive ground shadows, iPhone frame times, current day/night/three moons and installed Home Screen PWA work in a real integration test.
6. Long-term settlements/mobs/structures remain deferred.

## Release gate

Research checkpoint ONLY. No playable floating islands accepted, no main merge, no deployment authorization assumed. Anti-clog policy remains mandatory for this track and the other developer tracks.
