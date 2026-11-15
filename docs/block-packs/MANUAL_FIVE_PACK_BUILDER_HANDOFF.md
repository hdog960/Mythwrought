# Mythwrought — Manual Five-Pack Builder AI live contract

**Scope: five independent MANUAL Block Packs only.** This handoff does **not**
include or modify the automation-owned biome130 block library, builders 1A–4B,
or existing schema-1 world saves.

## Five source families and stable owner IDs

| Owner | Symbol namespace | Numeric choice | Live persistence |
|---|---|---|---|
| Pack 1 | `pack1:NNN` | 9–38 (30 variants) | `mythwrought.manual14.seed.<seed>` |
| Pack 2 | `pack2:NNN` | 59–76 (18) | Pack2 checked per-seed overlay/journal |
| Pack 3 | `pack3:NNN` | 109–125 (17) | Pack3 checked independent overlay |
| Pack 4 | `pack4:NNN` | 159–181 (23) | Shared manual14 checked per-seed overlay |
| Pack 5 | `pack5:NNN` | 209–226 RESERVED IN BUILDER ABI ONLY (18) | Pack5 symbolic physical sidecar, not numeric VoxelWorld IDs |

There are **96 unique family symbols and 106 physically authored numeric variants**.
A symbolic family with multiple candidate IDs must supply an explicit `numericId`.
Pack5 requires an actual authored `variant`, and upper Pack1 slabs/stairs
require their approved state. No silent shape or material substitutions.

## Entry points

- `src/builder-assets/manual-five-pack.mjs`: catalog, variant
  lookup, exact-source AABBs, collision/support offsets, side-effect-free
  `resolveManualFivePackAsset` and `planManualFivePackBlueprint`.
- `src/builder-assets/manual-five-pack-live.mjs`:
  `createManualFivePackLiveBuilder({getWorld,getManual14,getPack3,getPack5,
  loadPack5,getPlayer,storage,canEdit,rebuildPack2,rebuildPack3,rebuildPack5})`.
  Host must pass its **actual** active game world, verified save-layer bridges,
  real player bounds, and GPU rebuild handlers. Supplying unverified mocks to
  claim actual gameplay is forbidden.
- `await builder.place({asset:'pack1:001',numericId:9,
  at:[500,19,500],orientation:'north'})` returns a truthful
  `{ok,pack,numericId,sourceExact,verifiedSave,worldSchema}`.
  Pack2 variant/open/flow goes in `state`, Pack5 demands `variant`,
  Pack1/4 may demand exact mounted support.
- `builder.placeManual14Batch([...])` stages one atomic source-backed
  Pack1/4 batch with verified save and GPU rebuild rollback. It refuses
  records owned by Packs 2,3,5.
- `builder.dryRun([...])` is a **non-mutating source preflight**. Its
  `readyForWorldPlacement:false` is intentional: a dry run is not permission
  to write an arbitrary multi-owner city. Builder AIs must not claim mixed-pack
  atomicity or creator acceptance without independent proof.

## Live-game proof and limits

The original source branches are preserved. Pack1/4 browser acceptance captured
three genuine Chromium WebGL2 landscape screenshots, verified both owners'
actual resident meshes (756 source vertices in the fixture), separate saved
world restoration, 11/11 native checks, and all 53 IDs in four rotations.
This is **not** a physical-iPhone acceptance report. Pack1 source face textures
are sampled into a bounded 4×4 color grid to fit the existing terrain shader;
full original 24×24 texture parity must be reviewed separately if required.

**Currently open**: true all-five mixed-owner atomic building transactions,
dense city-sized cumulative GPU/retention and cross-owner support validation,
physical iPhone touch/FPS and creator art approval, full exact-head CI.
Never merge/deploy PR #174 or unlock v0.11 based solely on this handoff.
