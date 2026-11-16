# Mythwrought Creative Builder Mode — M8 integration-readiness handoff

**Status:** isolated M0–M7 source is regression-tested; only a *proposal* for future creator-approved integration. This note grants **no permission to integrate, merge, deploy, publish, activate defaults or change v0.11**. PR #186 must stay draft/unmerged/undeployed. Main/production remains unchanged.

## Read-only inventory of candidates and required future owners

| Candidate | Owned Creative module | Production counterpart (READ ONLY in this PR) | Separate future authorization / evidence |
| --- | --- | --- | --- |
| Explore/Creative controls and HUD | `ux-state.mjs`, `preview.*` | `src/input.mjs`, `src/layout.mjs`, `src/main.mjs`, `src/exploration-map.mjs` | Explicit input-suspension/restore, upper-right minimap, untouched rails, physical-iPhone acceptance |
| Flight and bounded requests | `flight-model.mjs` | `src/camera.mjs`, `src/physics.mjs`, `src/chunks.mjs`, `src/depth.mjs`, renderer | Collision/readiness authority, whole-segment tests, safe landing, bounded chunk prefetch, fallback on context loss |
| Registered placeable catalog | `adapter-contract.mjs`, `inventory-model.mjs` | `src/blocks.mjs`, `src/voxel.mjs`, shaped-asset/pack registries | **One** authoritative installed placeables enumeration, verified stable typed IDs, real support/geometry, never draft/unmerged assets |
| M4 transactional placement | `build-model.mjs` | `src/blocks.mjs`, chunk/renderer refresh and physical shape owners | Atomic place/remove with edit permission, support, collision, door/window/object footprint, chunk-edge updates |
| M5 undo/redo and recovery | `history-model.mjs`, `save-compat.mjs` | `src/voxel.mjs`, `src/persistence.mjs`, existing shaped-asset sidecar stores | Existing schema-1 journal and sidecar-compatible transaction; no parallel Creative world store; crash/quota rollback |
| M6 advanced edit tools | `advanced-tools.mjs` | Authorized M4/M5 live adapters **only after approval** | Preview fingerprint/revision revalidation, capped batch, partial multi-cell shape rejection, cancellation, refresh backpressure |
| M7 accepted blueprint browser | `blueprint-browser.mjs`, `blueprint-fixture.mjs` | Eight independent building-pool lanes and actual dependency producer registries | Read-only **creator-final-approved, merged, source-attested** registry; zero real records until proof, no builder imports |

## Trust and gating sequence (future work only)

1. **G0 explicit creator release/attachment approval:** before any shared-file edits, reassess latest `main` and all PR-head ownership. Do not move this PR out of draft or merge automatically; the user may elect a distinct integration PR/branch. Preserve Gate A/v0.11 lock.
2. **G1 authoritative registry and authority:** Obtain a narrow runtime `registry.listPlaceables()` from actual registered placeables and separate attestation for accepted buildings. M0's `registry.provenance='live-registered-placeables'` and M7's `accepted-blueprint-registry` strings are structural guards, **not signatures**. Enforce source ownership/merged status and reject ID aliasing, duplicate IDs, scenic-only assets, unapproved packs, incomplete dependency manifests or nonphysical furniture before selection.
3. **G2 safe input/flight bridge:** Implement separately approved `suspendExploration/readFlightIntent/restoreExploration`, clamp/no-clip height, physically checked player collision, region readiness and prioritized bounded prefetch with cancellation. Test move/look/aim/jump, Creative toggle, and minimap at all landscape viewports; ensure input is reset on focus loss, modal overlay, mode exit and failed landing.
4. **G3 transaction and physics bridge:** Connect `canEdit/tryPlace/tryRemove/applyEditBatch/queueMeshRefresh` to a single real engine edit transaction, never a direct bypass of physical producer families. Include support, multi-voxel object AABB, neighbor chunk/roof updates, permission, occupancy and unloaded terrain checks. Guarantee all-or-nothing edits, capped GPU work and deterministic retry/rollback.
5. **G4 persistence and backward compatibility:** Bind M5 history to Mythwrought's **existing** schema-1 journal/backups and distinct shaped-asset sidecar owners without changing saved format prematurely. Verify existing-world load, offline reload, quota failure mid-transaction, interrupted write, backup integrity, save-version rollback and recovery on actual iPhone. Memory-only M5 save envelopes are examples, **not migration inputs**.
6. **G5 performance and browser evidence:** Repeat Node/syntax/scope gates, root native tests and full genuine WebGL2 screenshot suite at the exact integration head. Measure edited chunk seams, mesh uploads/refresh budgets and FPS under travel + construction; do not cite synthetic Chromium DOM screenshots as game GPU proof. Audit main and sibling paths again, coordinate owners, zero conflicts.
7. **G6 physical iPhone and installed PWA:** In landscape test thumb rails, map positioning, long press, hold-to-fly, modal focus, virtual keyboard, Home Screen installation, airplane/offline load/restart, local save durability and device-scale FPS. Obtain explicit user art/control approval for the relevant release gate; no physical-iPhone testing is claimed here.
8. **G7 final approval and rollout:** Only after creator review may a separate authorized integration effort merge/deploy, with tested rollback and clear changelog. Keep v0.11 locked until expressly approved. M7 blueprints are optional and **must remain empty** if no audited, finalized structures exist.

## Evidence and ownership guardrails

- Last successful entry CI at exact head `74c75e548b31406ccd68a1c8d07c1215ab4cb24e`: [Actions #43791656990](https://github.com/hdog960/Mythwrought/actions/runs/43791656990).
- M8 local: 143 native tests and 2,036 browser assertions (1,920 inherited, 116 offline-supplement). Six landscape sizes plus portrait in inherited checks. Offline test uses injected resources, not real service-worker cache or durable browser store.
- Exact GitHub baseline object hashes for 50 inherited source/test files live in `tests/creative-mode/m8-baseline.json`; file-scope audit found 59/59 existing PR paths Creative-owned at M8 entry.
- No modifications permitted within eight builder Roadmaps 1A–4B, their draft PRs, the five manual Block Packs, the automated biome130 catalog, the five hourly automations, the world/terrain/depth generation ownership or shared game/runtime/UI/physics/PWA/saves/CI files as part of M8.

**Release disposition:** M8 can be accepted as a *detached audit/handoff* after exact-head GitHub CI completes successfully. It cannot be accepted as a playable Creative Mode launch or as proof of live controls/building/flight/save behavior.
