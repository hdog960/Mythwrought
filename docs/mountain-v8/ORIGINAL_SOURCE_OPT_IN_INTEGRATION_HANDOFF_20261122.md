# MYTHWROUGHT Mountain V8 — original-source integration handoff (isolated, NOT APPROVED)
**Source checkpoint:** detached research branch `mountain-v8-proposal-isolated-20261121` at `7b9c27098ba4be197b6c76d460a8b642153bc2eb` before this documentation-only commit.  
**Protected references at handoff:** production `main` `7016e14cd6289f45eaf7fc6a79a362b47996df65`; protected OPEN DRAFT PR #374 `bc1da28e7f1e35b4b687b4b581b92876e31c63f3`. DO NOT move these refs.  
**Evidence:** original full-checkout GitHub Actions [#45092207790](https://github.com/hdog960/Mythwrought/actions/runs/45092207790) **SUCCESS, 14/14** native Node 22 tests at the exact preceding source HEAD. Historical original-world geometry audit [#45088914173](https://github.com/hdog960/Mythwrought/actions/runs/45088914173) **SUCCESS, 6/6** at `cd45a548b670a3b43fc3a56fb661ea7de9afb3b7` and original-source seam provenance [#45084195491](https://github.com/hdog960/Mythwrought/actions/runs/45084195491) **SUCCESS, 25/25** at `c9b25f9ceaa248ce45140c07852eb32b3330e33c`. Results only apply to the stated exact commits, not to a future merged/released engine.

## 1. Precise status and immovable boundaries

Mountain V8 is an **opt-in, descriptor-only research proposal** with `generatorIdentityRequired: 'v8-new-opt-in'` and `safeToIntegrate:false`. No material IDs are assigned, no runtime routing has been registered, and no original save, mesh, collision, targeting, or mining contract was changed by this lane. A SUCCESS status below means only the original-source descriptor contract passed its stated focused test; it does **not** grant integration authorization.

Do not silently replace historical V7/M7 terrain or uplift another existing save, copy V8 descriptors directly into `VoxelWorld.get()`, allocate new IDs from apparent numeric gaps, use a legacy save as an implicit V8 opt-in, or change other developers' cave, biome, terrain, nonblock, builder, Codex or automation branches. Production main and PR #374 must not be merged or deployed from this handoff. All further work requires creator-approved scope and coordinated cross-owner integration.

## 2. Verified original-world source evidence

Four 8×8 tile atlases from original `VoxelWorld` at seeds 179 and 2026, totaling **256** inspected sparse tile roots:

| Source-backed result | Seed 179 | Seed 2026 | Total |
|---|---:|---:|---:|
| Tile roots audited | 128 | 128 | **256** |
| Admitted source + five-neighbor physical seams | 66 | 46 | **112** |
| Source root vetoes | 49 | 66 | **115** |
| Preserved seam vetoes | 13 | 16 | **29** |
| Snow / meadow / exposed-rock caps | 35 / 15 / 16 | 26 / 10 / 10 | 61 / 25 / 26 |
| Cliff-classified accepted roots | 41 | 35 | **76** |
| Accepted terrain descriptor cells | 607 | 482 | **1,089** |
| Accepted flora descriptor cells | 8 | 32 | **40** |
| Source-certified cardinal cliff contacts | 39 | 12 | **51** |
| Full-cube-equivalent exposed faces | 2,592 | 2,132 | **4,724** |
| Analytical full-cube staging bytes | 559,872 | 460,512 | **1,020,384** |
| Naive full-cube staging bytes | 797,040 | 666,144 | **1,463,184** |

The 29 seam vetoes are **not broken geometry**: 22 original-world occupied uplift cells, five physical cave AIR exclusions and two non-grass original surfaces. The 115 root vetoes are 75 occupied uplift cells, 38 cave AIR exclusions and two source height-limit exclusions. They must not be bypassed or filled. There were zero physical-budget, excessive-height-step and face-budget seam vetoes in these atlases. All test-sampled pre/post original `meshChunk` buffers had byte-identical SHA-256, and clean schema-1 save contents, edits and rotations did not change. This validates the read-only proposal, **not** generated gameplay V8.

All 13 material descriptor cell totals from the exact latest original-world handoff: stone **927**, dirt **50**, snow **61**, alpine grass **25**, slate **15**, gneiss **4**, scree **7**, flower **3**, flower petals **3**, heather **4**, heather tips **4**, conifer trunk **6**, conifer needles **20**. The 4,724 faces are an analytical **full-cube-equivalent** visible-face count after culling 1,025 internal adjacent face pairs. The **1,020,384 bytes are NOT measured V8 WebGL GPU allocation**, and especially not an estimate of approved non-cube plant meshes, which do not yet exist.

## 3. Specific original-source integration contracts (read-only research)

| Owner / original source blob | Existing contract evidenced in original source | Required separate integration evidence |
|---|---|---|
| Terrain and saves: `src/voxel.mjs` blob `543677a61aff7f54c0111f2485be79fbbbd560c6` | `VoxelWorld.get` checks exact edit overrides before `naturalAndLandmarkBlock`. `VoxelWorld.set` explicitly validates legacy, registered biome130, and current environment IDs. `save()` emits schema-1 seed/edits plus optional rotations; `restore` validates the schema. | An **explicit new generator identity and owner-approved mapping**, without modifying historical V7 voxel output, edit precedence, schema-1 byte shape or lossless restoration. Reject accidental V8 IDs in legacy worlds. No ID may be selected solely because it seems vacant. |
| Profiled worlds: `src/manual-biomes/profile-world.mjs` blob `a8d236ae0ea5ed383ddd8f8542714fc9136d8f30` | `FourRegionWorld extends VoxelWorld`, has its own `profile.generator` dispatch and source-preserving terrain baseline; M7 is `mythwrought-five-surface-regions-v7`. | Creator-approved **distinct V8 opt-in path** preserving all existing M2–M7 profile identities. Prove historical profile outputs and save reopen unchanged, including the explicit user-created M7 path. **Bare `VoxelWorld` read-only audits do not prove this profiled runtime.** |
| Playable startup and rendering: `src/main.mjs` blob `9a33a51e602236b66ed0a3146895e760d478d803` | Game loads via profile-aware world startup and `Pack2LiveWorld`; `meshPlayableChunk` composes canonical `meshChunk`, Pack 3 and manual layers; WebGL2 is requested directly; refresh paths stage chunk and water buffers. | Only after authorized scope, prove correctly layered V8 chunk meshes, vertical/horizontal seam rebuilds, no duplicate overlay geometry, context recovery, accurate uploaded bytes/chunks and no loss of current Pack 2/3/manual layers. Do **not** install a V8 display hook as a shortcut during detached research. |
| Collision and targeting: `src/voxel.mjs` same blob; `src/voxel-shape-interactions.mjs` blob `01be82e6c308e47a35fa6588cc6ed1ebeafca307` | `collides` reads registered cell shapes and other existing collision overlays. `raycast` resolves existing world shapes and competing physical targets at their actual distances. Original `FULL_CUBE` shape uses `[[0,0,0,1,1,1]]`; `validateShape` enforces bounds. | Define and test terrain full-cube semantics; separately authorize real **non-cube flower/heather/conifer** geometry and solid/pass-through behavior. Verify both body AABB collisions and exact raycast/selection placement at original and V8 seams, including mining and edit precedence. Descriptor cell coordinates alone do not implement these systems. |
| Material identity: `src/biome130-registry.mjs` blob `934a0e33b90155f5b2f49b6e8c69dafc234e282f`, `src/environment-ground.mjs` blob `64ba16d5e145119c0c14b1ee621538d57895cab2`, `src/pack2-integration.mjs` | 130 biome130 entries are in existing registered ranges; 18 Pack 2 IDs; existing environment IDs **400–410**. Handoff audited 170 known IDs/sentinels, but not **all owners and future allocations**. | Commission a **complete multi-owner registry audit** before proposing numbers; choose only creator-approved V8 identity/material mapping. Existing slate/scree/gneiss labels do NOT authorize reusing numeric M7 IDs 400/401/402. Maintain palettes, transparency, attachment and save compatibility. |
| Saves and recovery: `src/persistence.mjs` blob `b911d1edb079823791076c719a58a5cf562b71d7` | Existing `saveWorldSafe` uses schema-1 JSON, a checksum-protected journal and previous-good backups; `loadWorldSafe` chooses valid primary/journal/backup without inventing edits. Profiled worlds route separately in `main.mjs`. | Existing saves and recovery bytes must remain intact; prove profile/version opt-in is explicit, no silent migration, and no overwrites of a damaged, journal-recovered or unclaimed original world. Test export/import and Home Screen cache upgrade with the genuine app. |
| iPhone depth/performance: `src/depth.mjs` blob `b54b7fd8c422699a328b60135178f97508e277c8`, `src/render-budget.mjs` | Legacy surface bounds persist and deeper sections are separately managed; user-visible renderer applies a pixel-density budget. | Real hardware landscape test for interactive FPS, p50/p95 frames, rapid dig and rebuild, GPU vertex/buffer counts, source chunk ceiling, collision/raycast. The **30.3% proxy byte reduction** is not a GPU measurement. |

## 4. Proposed approval-gated integration order

1. **Cross-owner decision (not granted):** Creator explicitly approves *planning* an independent V8 generator version, allocation responsibilities, save/profile migration policy, and which developer owns runtime integration. Obtain current authoritative repository HEADs and any in-flight other-owner changes before allocating material IDs.
2. **Registry and geometry design, separately approved:** Reconcile every existing block/overlay/automatic material namespace and 13 V8 descriptor kinds. Provide source-backed tests for full-cube terrain and physically authored non-cube flora, including alpha, shape collision and placement. **Do not** assume the 170 checked IDs exhaust the catalog.
3. **Isolated integration candidate (requires separate authorization):** Integrate a strictly opted-in new V8 profile, without replacing M7/V7 `VoxelWorld`, `FourRegionWorld`, `Pack2LiveWorld`, save or cave dispatch. Validate original and new worlds side-by-side against the same historical seeds and edit deltas. Preserve all existing safety vetoes, the 18-cell per-column/plant cap, deterministic sparse tile ownership and source-certified seam faces.
4. **Real engine acceptance:** Actual V8 material ID reads/writes; real collision, ray selection, placement, mining, water/cave contacts, chunk-boundary rebuilds and profile save/restore through the **original playable engine**. Record before/after original V7 mesh/save SHA and genuine newly rendered V8 GPU vertex/buffer counts. Tests must be on the exact candidate commit.
5. **iPhone and offline acceptance, separately creator-approved:** iPhone landscape gameplay with installed Home Screen PWA; full visual review of jagged natural ridges, snowlines, real exposed stone, meadows, rare plants, cave safety and no squared terrain cutoffs; rapid-dig frame-time p50/p95; offline reopen/update and seed/profile stability. Do not deploy from this research lane.

## 5. Hard stop conditions

Any attempted V8 integration must fail closed if it invents a block ID, modifies generated V7 voxels, overwrites original cave AIR/landmarks/occupied uplift, permits non-owner 8×8 vegetation, exceeds 18 physical cells per column or plant, introduces unapproved flora collider/selection behavior, changes schema-1 save bytes or their recovery rules, modifies another owner's branch, or uses estimated staging bytes as evidence of actual GPU performance.

**Current evidence supports a completed isolated source-only research/handoff phase, NOT a merge/release request.** There is no outstanding need to rerun historical unchanged suites. Further development in this lane should require a **new reproduced isolated-source defect**; all remaining code-level integration and iPhone work must be separately scoped and authorized.
