# Mountain V8 — creator-authorized cross-owner integration *preparation*, isolated
**Authorization recorded:** 2026-11-22. Creator approved cross-owner planning and isolated development only. **No permission to merge, deploy, alter protected refs, register any numeric material ID, touch another owner's code, or migrate an existing world.** This note does not grant those permissions.

## Provenance and frozen boundaries
- Source-only research handoff: `182cf99ed4c0231dd629c56d856ffc99fec935b0`; handoff blob `af38dbaccfa4baa27551730c3c2308e3277440d0`. Prior source `7b9c27098ba4be197b6c76d460a8b642153bc2eb` passed exact native Node Actions [#45092207790](https://github.com/hdog960/Mythwrought/actions/runs/45092207790), **14/14**. No change to those original research modules.
- Protected production main `7016e14cd6289f45eaf7fc6a79a362b47996df65`, protected open draft PR #374 `bc1da28e7f1e35b4b687b4b581b92876e31c63f3`, checkpoint #7089592755: **not edited**.
- This separate integration-preparation branch was forked directly from `182cf99ed4c0231dd629c56d856ffc99fec935b0`. It only adds a read-only original storage preflight, targeted tests and this documentation. The research branch stays frozen.
- Historical source-backed result: 256 VoxelWorld roots, 112 admitted sites, 115 protected root vetoes, 29 protected seam vetoes, 1,089 terrain descriptor cells, 40 flora descriptor cells across 13 descriptor kinds. No V8 runtime ID, generator, mesh, GPU upload, collision, raycast, mining, PWA, or live save implementation exists.

## New isolated source exercise: seed ownership (NOT V8 activation)
`src/manual-biomes/mountain-v8-opt-in-seed-preflight.mjs` imports the authentic existing `readFourRegionProfile`, `loadWorldSafe` and `isUnclaimedWorldSeed` **only for read-only inspection**. Every result sets `safeToIntegrate:false`, `runtimeActivationAuthorized:false`, and null approved generator/material mappings.
- Existing M2–M7 generation profile sidecar -> reject candidate, even if its voxel delta is empty.
- Existing primary, legacy, journal or backup world -> reject candidate; never flatten through ordinary `VoxelWorld.restore`.
- Selected seed or original cave/Pack3/other known-owner per-seed sidecar -> reject candidate.
- Contradictory/corrupt profile, save or journal, or non-enumerable storage -> reject candidate without writes.
- Known-key unclaimed candidate -> **planning-only preliminary evidence**, not permission to create V8. Other-owner namespaces may still be unscanned.
`tests/mountain-v8-opt-in-seed-preflight.test.mjs` exercises these original APIs and tests that snapshots of the supplied storage are unchanged. This is a **new test file not yet executed against an authentic full original repository checkout**. Do not claim native passing coverage or schedule a broad CI run merely for this documentation. Prefer one targeted native test with exact commit when a safe original checkout/test lane is available.

## Original-source dependency / ownership map
| Interface (original blob) | Concrete boundary for the owner to review | Current state |
| --- | --- | --- |
| `src/manual-biomes/profile-world.mjs` (`a8d236ae0ea5ed383ddd8f8542714fc9136d8f30`) | `ACCEPTED_GENERATORS` recognizes M2–M7; profile shape exactly `{kind,version,generator,seed}`. V8 requires a **new distinct opt-in** identity, never reinterpret v7/M7 or restore v7 under a new natural baseline. | **Owner approval pending**; no new identity assigned. |
| `src/manual-biomes/profile-storage.mjs` (`976050a25cfbb027e64f34df7cdb7eff31d7c887`) | Checksummed per-seed profile sidecar, journal, claim detection, explicit unused-seed creation, and profile-aware restore. Damaged/conflicting source must fail closed. New V8 identity/storage policy needs separate agreed ownership and import/export isolation. | **Owner approval pending**; read-only preflight only. |
| `src/manual-biomes/m2-runtime-bridge.mjs` (`628a87c0cb78c5c57efef61548ed9fde11c25451`) | `M2_WORLD_MODE` has no V8 option; Pack2LiveWorld wraps authoritative profiled base. `saveM2World` stages Pack2 before base and reports partial commits; export must retain profile and Pack2 state. Do not add V8 dispatch to existing mode until separately approved. | **Owner approval pending**. |
| `src/voxel.mjs` (`543677a61aff7f54c0111f2485be79fbbbd560c6`) | Edits override natural baseline; `set` rejects unregistered IDs; schema-1 save keys/edits/rotations and 9-float mesh contract unchanged. V8 requires owner-approved mapping and strict historical save byte parity. | **Owner approval pending**; no IDs allocated. |
| `src/persistence.mjs` (`b911d1edb079823791076c719a58a5cf562b71d7`) | `saveWorldSafe` verifies bare `VoxelWorld.restore` and uses existing seed slot and journal/backup. Unregistered future V8 IDs **cannot** simply flow into this existing path. A distinct, reviewed V8 profile/restore/storage design is essential; no implicit format migration. | **Owner approval pending**. |
| `src/voxel-shape-interactions.mjs` (`01be82e6c308e47a35fa6588cc6ed1ebeafca307`) | Terrain full cube and authored non-cube flora need explicit AABB, target ray order, mining/placement policy. `FULL_CUBE` proof is not live non-cube flora proof. | **Physics/interaction owner approval pending**. |
| `src/main.mjs` (`9a33a51e602236b66ed0a3146895e760d478d803`) | Current startup and `meshPlayableChunk` compose physical terrain, Pack3/manual layers and Pack2 water; active WebGL2 and Home Screen behavior cannot be established from proxy geometry. | **Rendering/release owner approval pending**. |

## Material registry reconciliation — inventory is NOT exhaustive
Exact existing original registries identified in source:
- `BLOCK` original legacy **0–8**; `PACK2_LIVE_IDS` exactly **59–76** (18) for Pack2's separate adapter.
- `biome130-registry.mjs` uses `255 + ordinal`, ordinals **1–130**, hence exact registered **256–385**.
- `environment-ground.mjs` owns **400–410**; specifically V7 mountain slate **400**, scree **401**, and gneiss **402**. Shared labels do **not** grant reuse.
- Sentinel **255** and **65535** are included in the original 170-known-IDs/sentinels handoff audit. **170 is not a complete registry census**.
- Other registry and overlay owners, including other manual block packs, construction, Creative, nonblock vegetation, settlements, caves and automations, still require **explicit current-HEAD namespace reconciliation and written owner sign-off**. No range gaps are being recommended or reserved.
- Seven V8 terrain descriptors: `stone`, `dirt`, `snow`, `alpine-grass`, `slate`, `gneiss`, `scree`. Six flora descriptors: `flower`, `flower-petal`, `heather`, `heather-tip`, `conifer-trunk`, `conifer-needles`. Some materials might later map to an approved existing compatible representation, but that is a separate owner decision and **not** implicit ID reuse.

## Required cross-owner approvals and explicit stop points
1. **Creator / world-profile owner** — approve a new generator identity, user-facing *new world only* opt-in, storage namespace, and named integration owner. New historical save reopening tests must remain source-exact.
2. **Material registry owners** — complete all namespaces and obtain collision-free, versioned material decisions. **Separate creator approval is required before any new ID registration or reservation.**
3. **Persistence, Pack2 and construction owners** — agree schema-1 byte shape, profile-sidecar checksums, source of truth after journal/backup recovery, export/import and independent overlay roundtrip, corrupted worlds, seed collision behavior.
4. **Physics, mining, cave and flora owners** — approve exact original-space terrain AABB, non-cube flower/heather/conifer shape and solidity policy, raycast distance and selection, mining edit precedence, source cave AIR and protected seams.
5. **Renderer/engine owner** — approve an isolated runtime candidate that layers V8 with existing Pack2/3/manual gameplay without duplicate geometry; exact original-world buffer/save SHA comparison, chunk seam updates and measured GPU bytes.
6. **Creator / hardware acceptance owner** — explicitly authorize a candidate tested in real iPhone landscape **installed Home Screen PWA**: terrain visuals, no squared cutoffs, original-world reopen, offline cache upgrade, walk/target/dig, frame-time p50/p95 and GPU buffers. No deployment as a shortcut.

## CI and publication policy
- Reuse original-source exact results; no duplicated expensive unchanged full suites.
- New targeted preflight test remains **unrun** until a real full-checkout Node 22 environment is available; a test file alone is not a success.
- Nothing in this branch is a gameplay candidate. All references remain protected. **No merge, deployment, newly registered ID, M7/V7 mutation, or owner lane edits.**
- Keep coordination evidence and approvals in a **separate tracking issue**, not by pushing to PR #374 or production. Revalidate current cross-owner source SHAs before any later approved implementation.
