# Five-automation integration checkpoint

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
