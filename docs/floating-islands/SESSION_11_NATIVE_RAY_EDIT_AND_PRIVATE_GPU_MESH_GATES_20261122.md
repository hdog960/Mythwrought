# MYTHWROUGHT Floating Islands — Session 11 physical edit admission and private mesh snapshot

**2026-11-22 • ISOLATED RESEARCH • NOT INTEGRATED INTO LIVE GAME • NOT APPROVED FOR MERGE OR DEPLOYMENT**

## Exact provenance and source access

- Verified starting isolated branch `research/floating-islands-sky-runtime-adapter-20261122` HEAD `8805a33d4f74338c02dd69cd53739fa471018381`.
- Verified protected production `main` HEAD `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Read exact preceding handoff `docs/floating-islands/SESSION_10_GENERATED_ECOLOGY_PLAYER_EDIT_PRECEDENCE_20261122.md` before engineering.
- One initial GitHub branch/PR/commit search found **no pushed, accessible Codex Floating Islands generator**. This research does not create substitute islands, density, seed semantics or a pretend Codex save schema.
- One direct local `git ls-remote` failed GitHub DNS again, so the entire original repository checkout remains unavailable. The three original full-repository `tests/floating-islands/sky-original-native.test.mjs` tests and the detached real-registry `sky-original-flora-host.mjs` remain **UNRUN** in native original-game context.
- Reused dependency source files have exact SHA-1 Git blob parity with already verified research and actual original modules. Actual production `src/depth.mjs` Git blob `b54b7fd8c422699a328b60135178f97508e277c8`; actual `src/gpu-recovery.mjs` Git blob `422ef73e383bda78ff94607abb858e3c8a57c2d1`. Original 9-float WebGL upload is executed with a simulated WebGL2 context, not a browser GPU or iPhone.

## Proven source gap 1: source-attested triangles were still externally mutable

Earlier `sky-attested-mesh.mjs` proved original world identity/section revision **while generating** a mesh, but returned its mutable `Float32Array` from the physical producer. Another reference could alter those bytes after attestation and before GPU upload without invalidating the provenance object. The research owner stage accepted shape-correct keys and proof stamps but did not privately own the certified vertex memory.

### New `src/floating-islands/sky-physical-frame-gate.mjs`

- Composes the **exact unchanged** physical-source `createAttestedOriginalSkyMesher`, `planCertifiedSkyOwner`, `stageCertifiedSkyFrame`, and `publishCertifiedSkyFrame`. The original renderer must still grant **25 total surface/sky slots**, including up to **8 source-required x/z/Y seam sections**, max **2 uploads per frame**; original 27/34 underground depth ownership remains unaffected.
- The original mesh source stays private in the frame gate. After genuine source meshing, a bounded copy of original 9-float vertices is captured, with finite float/vertex quotas and a fresh source/overlay check. Only the private copy is passed to the real `uploadChunkBuffer` in a synchronous renderer-owned transaction; the caller cannot replace the internal mesher with synthetic triangles.
- Revalidates the same natural ecology overlay identity and `assertFresh` before planning, before/after each original mesh copy, after GPU staging, and just before publication. On a stale ecosystem or changed generator *after* successful upload but *before* in-place publication, newly staged buffers are released only with a still-current original WebGL context; otherwise deletion is refused for context recovery. Stage ownership is one-shot and rejects duplicate or forged publication.
- No shadow renderer, independent sky/day clock, world save, user edit, original chunk map replacement, production source changes or renderer pipeline hookup. The actual Codex source-producer interface and real WebGL2 behavior remain unverified.
- **Memory note:** the private source-triangle copy is an extra bounded staging allocation; real iPhone peak CPU/GPU memory, leak rate, p95 frame time and Home Screen PWA must be measured before integration.

## Proven source gap 2: native ray selection and sidecar edit authority were not composed

The previous provisional `planSkySessionEdit` could be called using an incorrect natural-source baseline, and had no direct source-proof requirement tying selection to the **original `voxel.mjs` raycast**, the current actual player eye/body, current original GPU residency, protection or a stable world revision. This is unsafe when a naturally generated tree is mined to player-authored AIR: a baseline generator with no flora could silently treat the AIR operation as redundant.

### New `src/floating-islands/sky-physical-edit-gate.mjs`

- A **read-only mine/place proposal** integrates authentic physical-host API shapes (`physicalHost.world.get`, `physicalHost.physical.raycast`) with the exact existing `sky-edit-session.mjs`, `sky-sidecar.mjs` and `sky-edit-invalidation.mjs` source. The real native original-game `raycast` function is not executed in local tests because its entire production import closure is unavailable; a source-contract ray mock is used. Real integration **must supply the actual original host**.
- Hard-requires the exact `session.context.naturalAt === certifiedEcologyOverlay.naturalAt` callback and byte-equivalent existing player edits/rotations. A tree generated in natural ecology can be mined to actual `id=0` without marking the generated tree itself as authored. No edit is adopted or written; returns a proposed isolated player sidecar session for a separate renderer/save owner to approve.
- Requires the actual original physical-world object identity, current seed/world token/generator fingerprint/epoch, original global edit revision, exact current original player eye and body, bounded 7-block ray range, and source-proven loaded ray path plus target sky section. Refuses protected cells, non-Air placement, duplicate natural edits, out-of-range selected coordinates, and missing native player collision clearance. The latter is supplied by an original-source `canPlaceCell` callback; neither an unsafe inferred cube nor a fake biome ID can authorize placement.
- Independently repeats the native ray before proposing a change and compares **copied** immutable original hit/adjacent/distance values. This closes reused-array mutation during callbacks. Snapshots the player-body position to detect mutation of the same live object mid-ray. Source identity, original global revision and 3D adjacent upper section revisions are checked before, during and after the proposal.
- For upper Y=20 edits, also captures the original Y=19 ground renderer's own surface revision and all x/z seam-adjacent original surface chunks, including negative coordinates. Provides `assertFresh()` for a caller to revalidate before actually adopting the proposed session or remeshing.
- Signed coordinates beyond ±10,000 are supported as source reads, not proof that actual Codex island generation there exists.
- **No** live player edit, world write, Schema-1 save mutation, provisional sky save write, GPU allocation or new ground shadow pass occurs in this gate.

## Focused test evidence and limitations

- Node.js **v22.16.0**: `node --test tests/floating-islands/sky-physical-frame-gate.test.mjs tests/floating-islands/sky-physical-edit-gate.test.mjs` — **51/51 PASS**, exact newly authored source/test files; syntax checked.
- **18** renderer/mesh tests: actual original GPU uploader and 25-slot owner modules with a simulated GL buffer path; private vertex-copy alias check; four two-upload frames filling all 8 seam regions; stale world/epoch/ecology/section safety; context-loss cleanup refusal; original 27-slot depth ownership; source-only/zero save writes.
- **33** physical mine/place tests: generated physical pine trunk AIR=0, registered rotated user placement, protected/occupied source, original ray two-pass selection stability, mutable ray result, mutable player body/remote eye rejection, source changes during ray, selected section unloaded, stale separate player session, user save limit and signed remote coordinates, original Y19/Y20 ground invalidation and negative seam revisions, zero world save/GPU writes.
- The unchanged Session 10 ecology test modules were run once locally as a baseline (**47/47 PASS**) before starting Session 11 engineering; they were not repeatedly rerun. Session 9 31/31, Session 8 73/73 and Session 7 48/48 results remain reused historical exact-commit evidence without new broad runs.
- Still **UNRUN**: original full-repository `VoxelWorld` three tests, native direct-import original flora/physical host, authentic user-input game loop, WebGL2 browser draw/pixel inspection, iPhone memory/FPS, three-moon visual/day-night and Home Screen PWA refresh/acceptance.
- No GitHub Actions, duplicate broad CI, browser queues, merges, deployments, CI cancellations, rewrites of production or other developer changes.

## Next engineering and release gates

1. Retrieve **genuine pushed Codex original Floating Islands generator**. Verify world identity, 3D section revisions, source completion and authored upper edits. These provisional callbacks MUST be adapted, not substituted for missing generator code.
2. Run all three original native `sky-original-native.test.mjs` tests against exact complete original checkout once; resolve genuine original source physics/selection/material conflicts. Then connect real `createOriginalSkyPhysicalHost`, original `voxel.mjs` collision/raycast, actual current `eye()`/player AABB and original placement permission to the two new gates.
3. At the renderer-owned synchronous frame boundary, enforce private mesh and source attestation through actual upload, 25 combined resident slots, <=2 staged meshes, real transparent-water retirement and 27/34 original underground exceptions. Never alter original source without authorized integration plan.
4. Reconcile authored AIR/placement + deterministic physical flora with actual generator's island mesh/save format at Y20..256 and distant signed coordinates beyond 10,000. Verify natural roots/canopies, real opacity/cutout selection and walkability, repeated generation and no generated vegetation stored as user edits.
5. Run targeted original game WebGL2 and installed iPhone PWA acceptance only after source is genuinely wired and tested. Preserve bright ground illumination (no perpetual island shadows), original 24-minute cycle and **exactly three moons**.
6. Long-term settlements, roads, mobs and artificial island structures stay deferred. Do not merge, deploy, cancel CI, or edit other lanes without explicit authorization.

**Release status: detached research only, not playable Floating Islands.**
