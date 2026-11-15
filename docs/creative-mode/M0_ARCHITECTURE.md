# Mythwrought Roadmap 9 — M0 architecture and ownership

**Source audited:** main e6bd7c173a4531ba7efc153e5f2eb89870c3b9db (2026-11-15), with infrastructure PR #178 merged. **Release:** v0.10 Gate A; v0.11 locked. **Status:** draft feature-only; no runtime activation, merge, deployment or physical-iPhone testing.

## Exclusive Creative Mode paths

| Path | Owner and responsibility |
| --- | --- |
| src/creative-mode/** | Isolated Creative Mode feature implementation and adapters |
| tests/creative-mode/** | Dedicated native test suites/fixtures |
| tests/creative-mode-m0.test.mjs | Feature-named root entrypoint; imports nested suite into existing npm test without shared CI edits |
| docs/creative-mode/** | Architecture, ownership, evidence, integration handoff |

All other paths are **read-only**, including the eight builder paths under building-pool/roadmap-1a..4b, five manual Block Packs, five autonomous lanes, production registry and main UI, terrain, cave/depth, shared physics, controls, minimap, renderer, save schema 1, PWA, .github workflows and CI scripts. No production IDs, pack imports, runtime registrations or ad-hoc shared hooks. If another lane claims one of the four owned paths, stop and request ownership resolution.

## Verified source entry points and constraints

| System | Production entry point | M0 finding |
| --- | --- | --- |
| Main renderer/frame and GPU | src/main.mjs, src/gpu-pipeline.mjs, src/foreground.mjs, src/render-budget.mjs | Game owns WebGL2 lifecycle; cannot add new gameplay HUD or render hooks in feature branch |
| iPhone input/camera/physics | src/input.mjs, src/layout.mjs, src/camera.mjs, src/physics.mjs, src/main.mjs | Existing two-thumb landscape rails must remain unobstructed; restore explore input on exit |
| Map and depth | src/exploration-map.mjs, src/depth.mjs, src/depth-mesh.mjs | Upper-right map and deep-cave paths are shared; read-only |
| Streaming and chunk seams | src/chunks.mjs, src/main.mjs | Chunk windows and seam rebuild exist; no approved Creative-specific bounded prefetch/refresh port |
| Ordinary editing | src/blocks.mjs, src/voxel.mjs | applyBlockAction, inspectBlockTarget and VoxelWorld.set exist; not a universal block/object placement transaction |
| Placeable assets | src/blocks.mjs, src/biome130-registry.mjs, src/builder-assets/** | BUILD_MATERIALS and BLOCK_NAMES are not an exhaustive authoritative runtime-placeable catalog; shaped packs use distinct paths |
| Save/recovery | src/voxel.mjs, src/persistence.mjs, src/pack2-world.mjs, shaped-asset bridges | Schema-1 voxel edits use verified journal/backups; shaped assets may use seed-scoped sidecars. No parallel incompatible Creative world save permitted |
| CI | package.json, .github/workflows/ci.yml, scripts/ci/scope.mjs | Root npm test is tests/*.test.mjs; owned root entrypoint covers nested Creative tests. CI recognizes 17 existing lanes; Creative paths fail closed to full-game, 20-script WebGL2 gate. Do not modify CI here |

## M0 adapter ABI: mythwrought.creative.adapters.v1

Pure module: src/creative-mode/adapter-contract.mjs. Structural validation is **not** proof of live integration; enabled and runtimeIntegrated remain false even for a perfect mock.

| Port | Required contract | Later integration owner must verify |
| --- | --- | --- |
| registry | listPlaceables(); provenance=live-registered-placeables | Dynamic currently registered **and placeable** entries only: stable ID, name, category, kind block/object, placementRules, registered:true, placeable:true. Reject duplicates, scenic-only, unmerged, missing metadata; no manually copied inventory |
| controls | suspendExploration(), readFlightIntent(), restoreExploration() | Safe explore/creative transitions and cancellation of touch/key state; preserves dual rails |
| streaming | isRegionReady(), requestBoundedPrefetch() | Clamp flying at unloaded terrain, bound/cancel prioritized chunk work |
| edits | canEdit(), tryPlace(), tryRemove(), applyEditBatch(), queueMeshRefresh() | Validate support/collision/shape owner, cap edits per frame, queue chunk-edge rebuilding, honor context loss/read-only storage |
| saves | worldSchema:1; loadCreativeEdits(), saveCreativeEdits() | Use core verified schema-1 save and actual shaped-asset sidecar owners; recover from quota/crashes, preserve preexisting saves |
| blueprints (optional) | listReadyBlueprints() | Read-only accepted, dependency-resolved blueprints; empty list is fine; builder PRs are not production inventory |

The module never imports shared runtime files. A registered-placeables snapshot guard rejects duplicate/unregistered/non-placeable/scenic entries. A provenance string is an integration contract, not proof of authority; real attachment remains a separate acceptance gate.

## Evidence, blockers and next milestone

Run Node 22: node --test tests/creative-mode-m0.test.mjs (eight native tests). Exact-head GitHub PR CI must be checked separately. No actual flight, inventory UI, placement, save write or browser/device acceptance occurs in M0.

M0 blockers for **future live operation**, not for M1 offline preview: no universal production-placeables enumeration; no approved cross-pack edit transaction; no authorized creative flight/prefetch bridge; no proven creative save transaction spanning core and sidecar owners. Physical iPhone performance, offline recovery, safe-area touch layout, and creator acceptance remain pending. Historical chunk/FPS claims are not current measurements.

**M1 next:** standalone landscape UX harness under the same owned paths, including explore/creative toggle, unobstructed grip rails, safe areas, hotbar/search shell, preserved upper-right map space, and focused tests. No production input/UI edits or integration until explicitly authorized.
