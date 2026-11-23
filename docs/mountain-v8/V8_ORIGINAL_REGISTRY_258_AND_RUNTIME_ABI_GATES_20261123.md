# MYTHWROUGHT Mountain V8 — original-source 258-ID census and runtime ABI gates
**Scope:** 2026-11-23 isolated integration preparation on `mountain-v8-integration-preflight-isolated-20261122`, descended from frozen research handoff `182cf99ed4c0231dd629c56d856ffc99fec935b0`. Creator-authorized preparation ONLY. No ID allocation, V8 runtime activation, production/PR/other-owner edit, merge or deployment. Cross-owner responses belong in issue #452.

## 1. New source-backed, overlap-free *known* ownership ledger
Read-only `src/manual-biomes/mountain-v8-registry-ownership-audit.mjs` imports existing original owner lists, validates the full exact group member sequences and checks their disjointness; it cross-checks all 106 combined manual five-pack numeric bridge records. This expands the earlier `170` known legacy/Pack2/biome130/M7/sentinels set to **258** distinct source-owned/bridged/sentinel numeric values:

| Existing owner | Exact IDs (no gaps claimed available) | Count | Original source Git blob | Status |
| --- | --- | ---: | --- | --- |
| Legacy `BLOCK` | 0–8 | 9 | `src/voxel.mjs` `543677a61aff7f54c0111f2485be79fbbbd560c6` | Original live voxel |
| Manual Pack 1 | 9–38 | 30 | `src/block-packs/pack-1/builder-handoff.mjs` `b5b3a07a1abe92b226c38da9d70a5be4aadc5637` | Construction sidecar |
| Pack 2 | 59–76 | 18 | `src/pack2-integration.mjs` `5bf9770a14c689eba82f99c63d7475b4bb584fde` | Physical overlay |
| Manual Pack 3 | 109–125 | 17 | `src/builder-assets/pack3.mjs` `96503575da3700476bb65ee89dc05101b60a3bcc` | Construction sidecar |
| Manual Pack 4 | 159–181 | 23 | `src/block-packs/pack-4/builder-handoff.mjs` `ab51fe23aa83ed3c3817478ca97b36ecbc1b93b9` | Construction sidecar |
| Manual Pack 5 | 209–226 | 18 | `src/pack5-integration/catalog.mjs` `10303fd542a0fb48c1f80d053903cf3ae665c305`; numeric bridge in `src/builder-assets/manual-five-pack.mjs` `0d8e4c66f63e086132a2779875e2ce2df4d784cc` | **Builder bridge only**, not registered voxel IDs |
| biome130 | 256–385 | 130 | `src/biome130-registry.mjs` `934a0e33b90155f5b2f49b6e8c69dafc234e282f` | Existing registered shapes |
| V7 environment | 400–410 | 11 | `src/environment-ground.mjs` `64ba16d5e145119c0c14b1ee621538d57895cab2` | Existing original terrain |
| Original sentinels | 255, 65535 | 2 | Original `mountain-v8-integration-handoff.mjs` blob `34f29a1adba6337684276de353d438ff63ff1711` | Known reserved/sentinel |

Sum: 9 + 30 + 18 + 17 + 23 + 18 + 130 + 11 + 2 = **258**; five-pack's **106** entries are the sum of Packs 1–5 and MUST NOT be added a second time. This is NOT the complete world material namespace, not a free-ID search, and NOT permission to allocate, reserve or reuse **any** numeric value. Other current owners, unrelated candidate catalogs, Creative, nonblock overlays, cave/settlement/automations and pending branches require their own complete signed audit. `fullMultiOwnerNamespaceAuditComplete:false` and `allocatableIds:null` are intentional hard stops.

## 2. Real original gameplay interfaces requiring independent V8 integration owner decisions

### Generator and save: source-compatible, NOT directly V8-compatible
- `profile-world.mjs` blob `a8d236ae0ea5ed383ddd8f8542714fc9136d8f30`: `ACCEPTED_GENERATORS` is an exact M2–M7 set; profile JSON has exact kind/version/generator/seed fields. V8 needs a distinct agreed opt-in identity, cannot reuse M7 and cannot reinterpret existing saves.
- `profile-storage.mjs` blob `976050a25cfbb027e64f34df7cdb7eff31d7c887`: durable profile sidecar + journal, `isUnclaimedWorldSeed`, and profile-aware `restoreFourRegionWorld`. New identity and storage namespace need jointly owned definition before writes.
- `src/main.mjs` blob `9a33a51e602236b66ed0a3146895e760d478d803`: `loadWorld()` auto-chooses `M2_WORLD_MODE.CREATE_ENVIRONMENT_V7` on some unclaimed seeds. This **existing and correct V7 behavior must not be silently reinterpreted as V8**. Separate explicit new-world choice is required.
- `src/voxel.mjs` blob `543677a61aff7f54c0111f2485be79fbbbd560c6`: `get` prioritizes player edits; `set` validates only approved original IDs. New materials cannot be injected without registry and save owner approval; legacy schema-1 exact edit shape must not change.
- `src/persistence.mjs` blob `b911d1edb079823791076c719a58a5cf562b71d7`: `saveWorldSafe` calls ordinary `parseWorldData` / `VoxelWorld.restore` and has original journal/backup behavior. Unapproved V8 materials would fail original restoration; a separate, agreed profile-safe save path is mandatory.
- `src/manual-biomes/m2-runtime-bridge.mjs` blob `628a87c0cb78c5c57efef61548ed9fde11c25451`: Pack2 is the authoritative `Pack2LiveWorld` wrapper; edits and independent overlay saves can partially commit, and exports require full profile/Pack2 consistency. V8 needs a reviewed new-world and rollback contract rather than reuse with an invented enum.

### Physical targeting and mining — verified original routing, V8 not implemented
- In `src/voxel.mjs`, `raycast` calls box-accurate `raycastShapes` when biome130 cells or Pack2 cells are present; otherwise it traverses non-air cells with legacy cube DDA. Existing Pack3/manual14 overlays compete by physical hit distance, and Pack2 water has its own sloped ray path. **New V8 flora are not automatically included** in either branch.
- In the same source, `collides` uses Pack2 authored shapes and biome130 shapes; other non-air IDs are treated as full solids. A V8 flower/heather/conifer descriptor alone therefore cannot define pass-through/collision behavior. **No collider or raycast policy approved yet**.
- `src/main.mjs` `meshPlayableChunk` composes genuine source terrain/deep sections with Pack3 and manual14 overlays; water is separately composed. `refreshEditedMeshes` stages all loaded horizontal and vertical seam neighbors atomically. V8 source chunks must preserve these layers, immutable vetoes and rollback behavior.
- Analytical V8 CPU full-cube-equivalent staging estimate **1,020,384 bytes across four atlases** does not measure actual iPhone WebGL2 allocation. `src/gpu-recovery.mjs` blob `422ef73e383bda78ff94607abb858e3c8a57c2d1` enforces **8 MiB per chunk upload** and errors/rollback; no actual V8 GPU acceptance recorded.

## 3. Focused tests and limits (no invented result)
- Original V8 source handoff still reuses exact native Actions #45092207790 **14/14** at original source commit `7b9c27098ba4be197b6c76d460a8b642153bc2eb`. No duplicate broad suite run.
- New `tests/mountain-v8-opt-in-seed-preflight.test.mjs`: exactly **8** top-level original-world seed ownership/recovery tests, including corrupted primary with valid journal; no storage writes and never returns runtime permission.
- New `tests/mountain-v8-registry-ownership-audit.test.mjs`: **3** top-level tests for 258 distinct known ID/sentinel provenance, catalog bridge completeness, immutability and no V8 allocation.
- A single isolated workflow `.github/workflows/mountain-v8-integration-preflight-focused.yml` targets only these 11 tests and syntax checks, triggers on its own initial file creation only, and cannot rerun on future source/doc pushes. **The workflow's actual run status has NOT been independently obtained**. Its definition/commit is not a passing test result; do not count the 8+3 as green without original GitHub Actions evidence.

## 4. Still-required approval owners and strict stop lines
1. Creator + generator/profile owner: propose, explicitly approve and separately enable **new V8 opt-in** identity, new unused-seed route, no M2–M7 changes.
2. Registry + every other material/overlay owner: complete remaining namespace inventory, confirm no conflicts or in-flight reservations; **separate explicit creator approval before numeric ID registration**.
3. Save/persistence/Pack2/Pack3/manual1–5 owners: sign off schema-1 and full layered recovery, cross-profile seed isolation, export/import and journal crash scenarios.
4. Physics/flora/cave/interaction owners: approve authored noncube meshes/solidity, body AABB, selection/raycast, mining and protected cave AIR/seam vetoes.
5. Render/performance owner: plan exact candidate-commit original-world mesh SHA parity, real chunk buffers, GPU bytes and WebGL2 context recovery.
6. Creator + device/release owner: separately approve physical iPhone landscape, installed Home Screen PWA, offline reopen/cache update and interactive p50/p95 digging/walk/target acceptance.

**Conclusion:** This branch is an isolated **preflight**, not a playable candidate. No proposed V8 IDs, runtime, merge, deployment, protected ref or other-owner changes are authorized. Cross-owner signoffs remain pending in issue #452.
