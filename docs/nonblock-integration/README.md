# Five-automation integration checkpoint

The roster has 96 source-backed and browser-tested slots. Standard game actions cover 72 removable scenery families and 12 existing Block Pack roles. The 12 environmental effects have draw, animation and lifecycle evidence. All three landscape viewports have Chromium evidence. Final visual parity, device frame-time and physical iPhone acceptance remain open. [Master draft PR #285](https://github.com/hdog960/Mythwrought/pull/285) · [Catalog and evidence](catalog.md) · [Home Screen release hold](release-hold.md)

The retrospective audit inspected 43 inherited meshes. The staged quality pass has rebuilt seven and refined fifteen. The other inherited meshes retain their original source geometry at this checkpoint. Matched captures cover the banner, rope, signpost, chain, meadow foliage and forest floor revisions. [Individual mesh decisions and captures](mesh-review.md)

## Production and source provenance

GitHub Pages reports a successful build of `64245c76a9e265f17bf387e3fd209bbfc9f6d950`, the same SHA as current `main`. The latest numbered automation incorporation is [015](
https://github.com/hdog960/Mythwrought/commit/1f67efc9805e83866549515ffdad4dc7e225b234), which makes the physical biome130 blocks available to builders. The later [PR #232](
https://github.com/hdog960/Mythwrought/pull/232) removed eight noninteractive scenery families from default terrain and provides the common divergence point for the newer non-block producers and coordinator. The baseline also contains the accepted manual four-biome work, the recorder and the V6 biome update. [Published source](https://github.com/hdog960/Mythwrought/actions/runs/44580805478)

| Lane | Source PR | Verified head | Commits outside current main |
| --- | --- | --- | ---: |
| :00 | [#106](https://github.com/hdog960/Mythwrought/pull/106) | `1975da7c57a1770f94853c74dae69f4120ef4a86` | 157 |
| :12 | [#245](https://github.com/hdog960/Mythwrought/pull/245) | `239d433854eba7457a82a1bf2b63bcfc7b65fb3a` | 122 |
| :24 | [#247](https://github.com/hdog960/Mythwrought/pull/247) | `dacbadd1abb6dc83164374fccf59a43a9578baef` | 76 |
| :36 | [#249](https://github.com/hdog960/Mythwrought/pull/249) | `e3a26c086e3b20ff787abe8f85ae691aea881dcc` | 71 |
| :48 | [#226](https://github.com/hdog960/Mythwrought/pull/226) | `c0bf94839088225d6210b6342ad6a8a402e3aa8c` | 92 |

[Source ledger](source-ledger.tsv) records each lane's changed path, latest owning commit and blob comparison against production. Blob differences flag files for manual reconciliation. Prior squash incorporations and moved implementations require content and history review. Earlier source cutoffs and activation evidence are recorded in [integration checkpoints](../INTEGRATION_CHECKPOINTS.md).

## Review standard

A family passes visual review after inspection of source meshes and deterministic variants from multiple useful viewpoints, with attention to silhouette, material, scale and visibility in actual landscape gameplay. Revised assets need comparable original and revised captures. Engine acceptance requires shared transform and triangle evidence for drawing and picking, real support and clearance checks, six-block reach, voxel precedence and physical asset compatibility. Removals need verified durable commit, isolation and reload evidence. Measured frame time, GPU bytes, draw calls and triangle totals must fit the production budget with 25 surface chunks. Offline, context recovery and legacy saves require regression runs. Classifications remain provisional until the evidence for each family is recorded.

## Source assessment

| Lane | Existing functionality | Open issues and disposition |
| --- | --- | --- |
| :00 | Shape-aware editing, orientation transactions and a candidate removal host with issued receipts and readback | Keep shipped voxel targeting. Compare parallel orientation additions with shipped shape files before intake. The candidate host uses bounds-only picking and pinned producer SHAs. The staging slice uses actual triangles and retains the issued-receipt and verified-write mechanisms. Seven failures in the local focused run include lease interruption and a rollback test that expects uncertainty despite restoration to the exact previous bytes. |
| :12 | Compatibility and evidence validators for descriptor, identity, removal, source and PNG provenance | Focused run passed. Consolidate against actual runtime and verify CI discovery before accepting fixture results as runtime evidence. |
| :24 | Ground, ceiling and wall scenery across biome and cave families | Focused run found 15 failures. The guarded integration expects a different isolated hit shape, and the admission path rejects sample geometry during descriptor validation. Legacy proposals allow eight variants while the v1 bridge accepts four and only registers the original five proposal IDs. Inspect original meshes and retain unique IDs across adapters. |
| :36 | Five fittings/props plus transform-aware batching and browser evidence modules | Preserve existing orientation suffixes. Staging uses source local geometry rotated once, with matching world-space picking. Current inherited meshes include a banner rod generated with coincident axial-ring geometry and an open rope cross-section. Both need a visual review before retention. Preserve the production physical catalog's ownership of doors, lanterns and furniture. |
| :48 | Meadow, mushroom and forest meshes and GPU upload preparation | Preserve existing IDs. Some descriptors accept explicit variants that are independent of their mesh's variation. The flora draw and selection transforms need reconciliation before extending beyond the five samples. Assess overlapping clover and moss concepts before assigning slots. |

Initial broad focused Node 24 runs used each exact PR tree. Counts include matching legacy tests in those trees.

| Lane | Passed | Failed |
| --- | ---: | ---: |
| :00 | 244 | 7 |
| :12 | 452 | 0 |
| :24 | 158 | 15 |
| :36 | 140 | 3 |
| :48 | 180 | 0 |

Two :36 evidence files require Playwright. The third failure needs separate fixture review. GitHub reports passing `node-and-browser` checks for #245, #247, #249 and #226 and no check rollup for #106. The local results above are the executed coverage for this audit.

## Inherited mesh review

[Mesh review and in-game comparisons](mesh-review.md) documents 43 exact-source mesh previews across both viewing angles and sample variants, with per-family provisional dispositions. The cloth banner and rope coil revisions preserve the original IDs and pass the staged gameplay verification.

## First staged gameplay slice

The adapter directly imports inherited source meshes for wildflower, desert scrub, pebble scatter, cloth banner and rope coil. It keeps each scene ID and the :36 orientation identity, and evaluates support and edited occupancy against the actual game world. Tests opt in through a bounded layout on loopback, with the original action controls and raycast. Staged removals use a separate versioned key scoped to the world generator and seed. The native tests cover exact triangles, edit-safe mounts, voxel tie precedence, foreign and forged picks, stored state isolation and write rejection. Shipped world formats are outside this staging path.

This is an interim draft. All five samples await final art and mobile performance acceptance. The full 96-family catalog, remaining shape and collision behaviors, production-quality batch/LOD and storage recovery, offline staging and release manifests, comparative gallery, final parity review and physical iPhone acceptance are open.

## Reproduction

Run `npm test` and `node --test tests/ci/*.test.mjs` for native and CI contracts. Install the CI-pinned Playwright and pngjs versions, serve the repo on loopback port 4173, and run `node tests/nonblock-runtime-browser.mjs` for the staged browser evidence and capture manifest. The standard CI gate lists the existing 20 browser checks.

## Expanded catalog checkpoint

The [96-family matrix](catalog.md) maps 43 inherited source mesh IDs and four new cave designs to the planned slots. The current source count is 47 under this provisional slot assignment. Four new cave designs have native geometry and collision-profile tests and still need game integration. Thirty-one inherited families now use the same opt-in game path, including the revised banner and rope. Solid and additional ceiling/wall families still need mounting and collision integration.

The expanded Chromium test used the seeded voxel world and the existing MINE touch control for all 31. After reopening the same browser storage context, all 31 tombstones remained and there were zero scenery vertices. Ordinary schema-1 save bytes matched. The captured load used 25 terrain chunks, one scenery draw call and 161,676 bytes of scenery vertex data for 1,497 triangles. The timing samples use SwiftShader and different camera poses. They do not establish a performance delta or iPhone acceptance. The [capture manifest](gallery/staged-catalog-manifest.json) records all 31 game screenshot digests and source inputs. CI uploads the screenshots through the existing browser artifact step.

## Cave mounting and collision

Four new formations now draw, pick and mine in actual seeded cave cells. The stalagmite spire uses a floor support and the limestone column needs both ends anchored. The dripstone cluster and flowstone curtain use ceiling support and allow players to pass beneath their hanging geometry. The two solid formations block the existing body collision test while attached. Mining releases the collision and leaves a tombstone that survives a fresh page.

All four have eight deterministic geometric variants. The [cave captures](gallery/caves/) show the tested variant in the original renderer. The screenshot framing in narrow passages crops some views, and final material blending and visual acceptance are open. The matrix now has 35 in-game lifecycle results.

## Offline staged cold start

An explicit second loopback option selects the existing cache worker with an independent staging cache. The worker installs the complete existing shell plus the staged source modules before taking control. It caches the static shell under its canonical path. The staged layout remains in the navigation query and tombstones remain in their own versioned save key.

Chromium reopened a fresh page with the network disabled. The worker served the shell, the mined wildflower stayed removed, and the remaining rope coil drew against the original terrain. Ordinary offline loading remained opt-out and the schema-1 world bytes matched. The [offline manifest](gallery/offline/manifest.json) records the independently matched digest for every cached asset and the [actual offline game frame](gallery/offline/cold-offline-932x430.png). Production Home Screen registration, same-install release rehearsal and physical-device acceptance are open.

## Meadow and woodland source

Eight new families fill the previously empty A and B staging slots. All eight have four deterministic variants with nondegenerate meshes under the 256-triangle limit. Ivy and vine require two natural backing cells and preserve wall orientation in their tombstone IDs. Chromium rendered all eight on actual surfaces, mined them with the touch control, and verified all eight tombstones after reopening while preserving the schema-1 save bytes. The [captures and source manifest](gallery/meadow-woodland/) include per-family triangle totals. Grass and horsetail stems were visible in the recorded views, with thin fronds still needing device-scale art review.

The provisional matrix has 55 source-authored families and 43 with game lifecycle evidence at this checkpoint. Acceptance remains open.

## Enchanted and fungal source

Ten new families complete the staged group C slot coverage. All ten have four distinct deterministic variants with native mesh checks. The shelf fungus and glowing vine attach to two natural backing cells. Chromium rendered, mined and cold-reopened all ten against seeded terrain in the actual game, including the wall placements. The ordinary schema-1 bytes matched and the sole scenery draw used 140,940 bytes for 1,305 triangles. The current vine uses a colored palette. Emissive treatment and placement in representative enchanted and cave scenes remain open. [Capture and source manifest](gallery/enchanted-fungi/manifest.json)

The candidate now has 65 source-authored families and 53 with real staged lifecycle evidence, under the provisional 96-slot assignment.

## Remaining inherited scenery

Chromium verified all 12 remaining inherited families on natural mounts. The shared stage now covers all 43 inherited source mesh IDs, plus 22 original families. Each of the 12 displayed, accepted an exact-triangle MINE action and stayed removed on reload. These tests seeded a nonempty schema-1 save before opening the game, and its exact bytes matched afterward.

Four taper-only cavity/ice meshes and the cobweb were rebuilt around their original IDs. The crystal shard now has 90 nondegenerate triangles and distinct faceted shapes through eight variants. The hanging cobweb uses a continuous corner-mounted strand pattern, with a clear opening between strands. The [original mesh sheets](mesh-review.md) and [new game captures](gallery/remaining-inherited/) show the revisions. Their viewpoints differ. The captures establish gameplay and geometry evidence, with contextual biome art and final screen-size parity still open.

Eleven additional architectural roster slots have exact physical Block Pack planning adapters. They use existing source IDs, shapes and world-save owners. The adapters are native-tested and remain outside the lifecycle count pending game-placement acceptance.

The original 20-script suite ran against checkpoint `b77497f04e2125a74002f958cc3c8dd26fe4b96d`. Eighteen passed in the first run. The voxel-landmark test timed out at the same chunk-load assertion on untouched main and passed on the isolated candidate rerun. The touch script failed two different movement timing assertions on the candidate and passed on the baseline rerun. Full exact-head regression and device acceptance remain open.

## Existing physical owners and new prop source

All 11 owner-backed cuts placed and reopened in Chromium through the existing Pack 2 or Pack 4 game path. Their geometry and save rows remain with those owners. The paired door placement commits both leaves in one owner snapshot. Its native failure injection proves both cells and the observed owner-storage bytes roll back after a primary write is rejected. The staging browser scenario reopened 12 physical cells after placing 11 roster entries and verified that the nonempty schema-1 bytes stayed intact. [Physical source and capture manifest](gallery/physical-fittings/manifest.json)

Seven newly authored fittings and props add ladders, a freestanding torch body, a fuel stack, a brazier, a bell, and pottery fragments. Their four deterministic variants pass native geometry tests. They still need game behavior and art acceptance. Overall coverage at this checkpoint is 65 staged scenery lifecycles, 11 Block Pack placement and reload results, and seven additional source-native families.

## All 96 slots staged

The [catalog matrix](catalog.md) now has 72 source-authored scenery families with in-game MINE and reload evidence, 12 scene roles backed by their original Block Pack placement and persistence owners, and 12 environmental effects. The hanging lantern uses the existing Hawthorn wall lantern and its original physical wall mount.

The seven additional props draw and remove in the original game. The ordinary movement control also climbed the wall ladder against a naturally mounted tree-trunk fixture. The source test verifies loss of climbing support when the mount disappears. [Prop evidence](gallery/world-props/manifest.json)

The twelve effects draw together in a bounded translucent pass. Chromium observed different animation frames, removed an attached effect when its parent was mined, and brought the surviving ambient effects back after genuine WebGL context loss and restore. The parent remained removed across a fresh page. The effect shapes are render-only. [Effect evidence](gallery/effects/manifest.json)

The original game at 667 × 375, 844 × 390, and 932 × 430 is captured in the [landscape evidence](gallery/landscape/manifest.json). The production activation path, same-install recovery rehearsal, comparative art passes, device-scale performance and physical iPhone acceptance remain open. This draft is still on release hold.

The latest physical test also placed the wall lantern through Pack 4 and used the existing PLACE and MINE controls to swing and remove one leaf of the paired door. The sibling remained, the mined leaf stayed absent on cold reopen, and the nonempty schema-1 bytes matched. The independent coordinator checks files against their source SHA-256 digests and uses the inherited PNG structure validator to verify each artifact's dimensions, digest and chunk CRC. [Home Screen release hold](release-hold.md)

## Matched foliage comparisons

Eight inherited meadow and woodland assets have revised meshes and palettes. The four modeled variants of each family keep the existing instance identity. Ten paired Chromium views use the same terrain, anchors and camera poses. The sample's packed vertex data grew from 27,324 to 81,216 bytes. Device frame times and longer-range foliage legibility remain open. [Foliage comparison gallery](mesh-review.md#meadow-and-woodland-refinement)

## Staged save recovery

The version-1 scenery sidecar remains compatible with earlier staged saves. A successful removal verifies both the existing primary record and its separate previous-good copy before removing the mesh. Failed backup writes and failed readbacks restore the preceding bytes. A stale copy refuses to amend a newer record. Recovery from a damaged or missing primary uses a matching seed and world ID and opens scenery removals read-only.

Chromium reopened the cached game offline after deliberately damaging only the staged primary. The mined wildflower stayed absent. MINE on the remaining rope reported recovery and preserved both sidecar records and the preloaded nonempty schema-1 save byte for byte. A second test verified the separate interrupted shell update path. [Offline evidence](gallery/offline/manifest.json) · [Shell update evidence](gallery/cache-recovery/manifest.json)

## Opt-in habitat planning

The [read-only placement adapter](../../src/nonblock/staged-habitats.mjs) turns explicit site requests into the existing staging layout. It checks the selected generator's biome map, the actual material under each plant, the available mesh footprint, and whether the mount or footprint is already occupied or edited. Cave requests require an underground location and an attached rock mount. Native tests cover the four-region and balanced profiles, a legacy surface and cave, and rejected edits or occupied sites. The adapter runs only when called with an explicit request and writes no terrain, profile or save data.

In the actual four-region game, Chromium rendered and mined an agave in desert sand, a frost fern in snow, an alpine wildflower on mountain rock, and an enchanted flower on the enchanted terrain cap. Each distinct site loaded 25 terrain chunks. All four removals survived a fresh page, and the preloaded nonempty schema-1 save and profile records still matched byte for byte. The game used its Economy preset at a 932 × 430 viewport on SwiftShader. [Four habitat captures](gallery/habitats/manifest.json)

## Scenery frame work

The renderer now checks draw distance before asking the world about mounts. One frame uses the same mounted objects for render and target feedback. MINE independently rechecks the live mount and the exact triangle before saving. In a deterministic 32-object scene with nine objects inside draw range, 300 identical views used 5,400 terrain reads, down from 38,400 at the previous checkpoint. The visible count and selected instance matched. This is a terrain-read comparison. Device frame-time and LOD acceptance remain open.

Low grass, short fern, clover clump and meadow sedge now have authored distant meshes. Detail switches beyond 16 blocks and returns inside 13 blocks to avoid repeated uploads at the boundary. The close mesh remains the source for targeting and collision. Chromium held 25 loaded terrain chunks and one scenery draw throughout the matched route. The four-family scenery batch used 35,856 bytes close up and 20,088 bytes at distance, about 44% less. The attached pollen effect still drew through both transitions. [Near and far comparison](mesh-review.md#distant-foliage-comparison)

## Browser catalog coverage

The exact `e853b66726b9978ec76292e1e0d06496789b7cfa` staging run produced matching source digests and valid PNGs for 87 captures across the catalog, original controls, offline storage, cache update and WebGL recovery tests. The independent roster check found all 72 scenery IDs, 12 physical-owner IDs and 12 effect IDs exactly once. In the longer run, the additional habitat screenshot timed out when multiple software-rendered browsers were running. The four habitat captures and their lifecycle checks passed in the separate habitat run. The published-build loopback update and rollback also has its own captured rehearsal. [Habitat evidence](gallery/habitats/manifest.json) · [Install rehearsal](gallery/install-rehearsal/manifest.json)

The GitHub run at `759af2475b3e6e83d240f84dc715bdac47c95ea1` found that a cave test used one in-memory value for every storage key. The fixture now keeps independent primary and backup records. The recorder acceptance check also compared the two clips directly, although Chromium emitted 368 and 369 rows from the same 369-pixel canvas. The check now verifies both clips against the unchanged source canvas, allowing an encoder to align an odd dimension down to even. The published build and the candidate both completed real three- and ten-second captures locally. [Native run](https://github.com/hdog960/Mythwrought/actions/runs/44686911047) · [Recorder run](https://github.com/hdog960/Mythwrought/actions/runs/44686911298)

The refreshed four-biome gallery verifies the active chunk center and an empty streaming queue before each screenshot. The save fixture is written once when the browser context is created, so reopening cannot put a lost record back. The stage v14 cache rehearsal again rejected the mismatched asset, served the preceding cached shell offline and activated the corrected worker. [Four loaded habitats](gallery/habitats/manifest.json) · [Stage v14 cache evidence](gallery/cache-recovery/manifest.json)

At the stage v14 checkpoint, the full-detail 31-object catalog benchmark held 25 loaded terrain chunks and one scenery draw. The scenery batch contained 6,315 vertices and used 227,340 GPU bytes. The fixed terrain pose is inside full-detail range for all four authored foliage LODs. The separate distant test documents how those four objects reduce upload size when they cross the detail boundary. [Near and far measurements](mesh-review.md#distant-foliage-comparison)

### Full stage v16 verification

The exact `a8d1d5e068537dea072d3e29537ccec12812f420` checkout passed all 1,083 root tests and the original 20-script GitHub WebGL2 gate. The separate staged browser run verified exactly 72 scenery families, 12 physical fittings and 12 render-only effects. The evidence verifier checked source digests and PNG dimensions, file digests and chunk integrity for 98 genuine frames across all three landscape viewports. [Staged evidence index](gallery/staging-a8d1d5e.json) · [GitHub WebGL2 run](https://github.com/hdog960/Mythwrought/actions/runs/44691596449)

The 31-object stage v16 scene held all 25 terrain chunks and used one scenery draw with 6,603 vertices and 237,708 GPU bytes. Its 31 MINE operations survived a fresh page with the original schema-1 save intact. The same staged run confirmed offline recovery, rejected cache bytes, four biome mounts, physical-owner placement and WebGL context restoration. These measurements come from Chromium with software rendering. Device frame-time acceptance remains open.
