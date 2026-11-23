# Snow S6 — six original-owner chunks and actual stepPlayer (2026-11-23)

## Source and isolation

- Original incoming Snow S6 ref: `research/snow-s6-webgl2-inmemory-winter-preview-isolated-20261123` at `88cf5a1d7f8081c8d4ec9f041f1ff256b9537d4a`.
- This new isolated branch: `research/snow-s6-six-chunk-player-physics-isolated-20261123`.
- Native implementation/test commit: `4546e77366f3489d317be1ef3bd49f393057a9c2`. It is descended from the separate isolated post-Desert browser research child `853d51128632440573f7c249abd50c87daf0c502`; browser harness on that parent required its own later correction and does **not** form part of this native physics test acceptance.
- Earlier 2x2 native source acceptance was `fe4020a2696259a7af433553b575a202582c159b`, original Actions #45209456512 SUCCESS (6 fixture + one real native test). No rerun of broad suites.
- Main production historically advanced independently from `7016e14cd6289f45eaf7fc6a79a362b47996df65` to `db4bbcc32156e5df311f733bcaa53d559c17313b` through separate authorized Desert Phase 3 PR #463. DO NOT move/revert main. OPEN DRAFT Snow PR #358 HEAD `59e449be7e73b25f259c4c72855cfb638a056517` must remain untouched.

## Actual engineering

Extended detached `src/manual-biomes/snowy-s6-cross-owner-forest-audit.mjs` without altering the previously verified 2x2 default contract. Explicit opt-in `{width:3,height:2,stepPlayer}` constructs SIX original 16×16 consumer chunks at (`-2,32`), (`-1,32`), (`0,32`), (`-2,33`), (`-1,33`), (`0,33`). Every tree is reconstructed from its canonical source owner using existing original S3/S5 scene, actual original collision and tree factory. Each voxel's owner chunk slice must exactly equal original-source admitted cells. Strong fail-closed vetoes reject overlapping cells, edits, physical occupancy, cave changes, inconsistent tree styles/owners or insufficient source/body contracts.

After all source trees from all owners are aggregated in a READ-ONLY `world.get` overlay, the original callback `src/physics.mjs:stepPlayer` can be injected to simulate 45 player movement frames per admitted walkable tree from an actually clear player-body origin. On every frame, the EXACT original `voxel.collides` must report no penetration and all player coordinates must remain finite. No candidate is pruned to manufacture a successful walking quota. Reversed chunk request order reproduces the EXACT same record, including all player paths. Before/after schema-1 saves, source tree voxel/cave witnesses, old 2x2 overlapping slices and original generated block data are preserved.

The detached `stepPlayer` callback in the synthetic fixture is explicitly only a **source-contract regression**, not a gameplay certification. The separate genuine full-original M7 two-seed acceptance uses original `src/physics.mjs` with exact Git blob `199cab89fc1e6ab67d12a56c62795ef0ac4b50d7`. The newer Desert main physics file has that identical exact Git blob, but Desert-specific original terrain changes are **not** revalidated by this isolated native S6 test; future production integration must reconcile them.

## Exact targeted GitHub Actions evidence

**GitHub Actions #45224574152, exact HEAD `4546e77366f3489d317be1ef3bd49f393057a9c2`: COMPLETED SUCCESS.**

- Updated old 2x2 focused source fixtures plus six NEW source-contract fixtures: **12/12 PASS**.
- Genuine original two-seed 3x2 M7 original `stepPlayer` and `voxel.collides` test: **1/1 PASS**.
- Seed 179: **4 DISTINCT authentic conifers** — one compact fir, layered spruce, highland pine and windswept alpine; **296 original-owned physical voxels**, **4,531 original body probes**, **3,268 preserved directed portal pairs**, **90 actual original `stepPlayer` frames** from two physically clear tree-adjacent starts.
- Seed 2026: **3 DISTINCT authentic conifers** — one compact fir, layered spruce and windswept alpine; **210 original-owned physical voxels**, **3,318 original body probes**, **2,560 preserved directed portal pairs**, **45 actual original `stepPlayer` frames** from one physically clear tree-adjacent start.
- Exact combined totals: **7 trees**, **506 physical voxels**, **7,849 body probes**, **5,828 protected directed pairs**, **135 original movement frames**. All source saves and cave/edits unchanged.
- The previously accepted real original 2x2 shared chunk previews match their six-chunk source projections in both seeds; reversing all six consumer chunk requests yields identical tree/body/step certificates.

**Important limits:** The 135 player frames are three short real-original tree-adjacent walking paths, **not** proof the player walked every six-chunk boundary or an uninterrupted multi-chunk route. The audit is detached from gameplay and has no GPU mesh, PWA, runtime activation, infinite-world mobility or on-device performance acceptance. It must NOT be merged/deployed without separate creator authorization.

## Next objective

Reconcile S6 browser test branch and corrected two-seed 956x440 post-Desert main WebGL2/edited player-ice evidence. Once the actual source/test blob is confirmed green, combine exact already-verified isolated files on a NEW detached handoff checkpoint without modifying PR #358 or production main. Then consider player route length/crossed boundaries, fog/night variants, and physically safe versioned opt-in snow world profile only AFTER real game, save/cave, and iPhone installed Home Screen acceptance.
