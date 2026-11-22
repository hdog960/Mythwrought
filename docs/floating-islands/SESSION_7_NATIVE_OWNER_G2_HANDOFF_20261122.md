# Floating Islands Session 7 - Original renderer ownership and G2 compatibility (2026-11-22)

## Protected provenance

Base: isolated research branch research/floating-islands-sky-runtime-adapter-20261122 at 4b83baa7e2f4065b23460879d3218029931722ba.
Protected production main: 7016e14cd6289f45eaf7fc6a79a362b47996df65.
Read the exact Session 6 handoff before this work. Checked GitHub branches, PRs and commits once: no accessible Codex Floating Islands generator. Nothing in this commit alters src/main.mjs, the original world generator, saves, other developer work, workflows, deployed Pages/PWA, or protected main.

## Actual source contracts read and reused

Exact unmodified original source modules were retrieved and verified against their Git blob SHA-1:
- src/depth.mjs: b54b7fd8c422699a328b60135178f97508e277c8
- src/gpu-recovery.mjs: 422ef73e383bda78ff94607abb858e3c8a57c2d1
- src/creative-integration/g2-flight.mjs: 5107244bade02e0281e98da8d4faab79ea9866bb
- src/creative-integration/g2-streaming.mjs: 811bc4660dfa4e579e692f2f335b70966ea20270

Read src/main.mjs original renderer. Its chunk Map is a const modified in place, not replaceable with a new Map. Native depth has up to 25 surface, 27 underground and 34 surface-shaft slots. Native chunk retirement disposes both opaque buffer and waterBuffer.

## New detached source modules

src/floating-islands/sky-native-owner.mjs
- Requires exact real renderer grant for native desired keys, world token, renderer epoch and native revision before reserving GPU capacity.
- No sky publication while 25 native surface buffers remain desired; never reduces original 27/34 underground budgets.
- Reserves up to eight truly required sky body-seam regions while retaining a combined maximum of 25 GPU chunk entries and at most two upper uploads per frame.
- Uses original depthMeshKey, sectionBounds and actual uploadChunkBuffer. If terrain is not GPU resident or source candidates are missing, stage is refused.
- Publishes into the original const Map IN PLACE at an explicit renderer-owned frame boundary, with exact entry CAS, world/epoch/context fences and rollback on failed mutation.
- Retires superseded opaque and waterBuffer resources only after publication; retains resources still referenced by the new scene. Context-loss cases refuse unsafe disposal.
- Still UNWIRED to production WebGL2 entrypoint. This is not a visual acceptance result.

src/floating-islands/sky-native-g2.mjs
- Runs exact original planG2FlightStep, preserving G2's speed/frame/segment math and control ownership.
- Authoritative separate base/sky readiness and full-body physical-clearance callbacks. Checks current body first, destination/swept body, and world identity throughout.
- Prevents synthetic sky requests using old G2 (cx,cz,0) grammar from leaking to original ground queue. Separate bounded sky lookahead points work around same-key collision with pending genuine surface requests.
- Preserves original G2's 0/negative regions and separate namespaced upper prefetch; no player, saves or renderer mutation.
- Still UNWIRED to original live flight controllers. No iPhone acceptance claim.

## Test evidence

Local Node 22.16.0: 48/48 PASS across original-authoritative-module-backed focused tests using byte-identical source modules and a simulated WebGL2 uploader / physical world. Full test harness files exist in the local session artifact, not included byte-for-byte in this GitHub commit due a failed large-file transfer. This GitHub commit contains smaller smoke tests which are authored but NOT separately executed; do not claim smoke tests pass solely from the 48 local test result. All two implementation files are Git blob SHA matched to local tests:
- sky-native-owner.mjs 6f9b31b794017b9bdc79232ac50ebe39ae9afee7
- sky-native-g2.mjs 7bc5f400386d9995bd3c5fccb4ea460cca999d62

Session 6's 38 tests and earlier focused tests are reused exact-revision evidence, not redundantly rerun. Three whole-repository sky-original-native tests remain UNRUN; Github DNS blocked obtaining full original checkout. No GitHub Actions/CI runs, WebGL2 browser, installed iPhone PWA or Codex original generator testing occurred.

## Next development

First obtain authenticated pushed Codex island generator and actual upper world/save schema; do not replace the generator or assume it exists. Run three old genuinely original-world tests on complete checkout once. Integrate original renderer's consent and in-place CAS at its safe frame boundary only after full native tests; never evict protected 25 surface or 27/34 underground budgets. Wire dual-source G2 owner to production controls after collision and GPU readback verification. Continue physically registered vegetation (no fabricated block IDs), true mine/place and separate sky save, biome-organic islands at +/-10,000 blocks, no oppressive ground darkness or shadow pass, natural day/night and three moons, and target iPhone WebGL2 benchmarks. Long-term settlements, mobs and structures stay deferred.

No merge, deployment, CI cancellation, main modification or cross-developer interference authorized. This is source-only research, not a playable release.
