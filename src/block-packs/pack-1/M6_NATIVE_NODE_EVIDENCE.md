# Mythwrought Pack 1 — M6 genuine native Node evidence

**2026-11-14 · NATIVE NODE PASS · standalone Pack 1 source verification, not production integration**

## What genuinely ran

A local isolated Pack 1 source mirror was reconstructed from **exact GitHub file contents** at draft PR #113 source HEAD `84001dbddd9fa9630ad9382c9f9d85c986590a9c`. Each of the 21 executable source/test files was independently checked with `git hash-object` against the corresponding GitHub Git blob SHA. The nine Pack 1 nested Node test modules were then executed together in one **genuine Node v22.16.0** process.

**TAP result: 93 tests; 93 PASS; 0 FAIL; 0 SKIPPED; 0 TODO; 0 CANCELLED; duration about 1.16 seconds.** No V8 test shim was used for this result.

| Native suite | Genuine test cases |
| --- | ---: |
| `core-masonry.test.mjs` | 9 |
| `stone-shapes.test.mjs` | 11 |
| `garden-components.test.mjs` | 14 |
| `physical-foliage.test.mjs` | 16 |
| `floral-forms.test.mjs` | 15 |
| `all-families.test.mjs` | 10 |
| `raycast-regression.test.mjs` | 6 |
| `gallery-count.test.mjs` | 5 |
| `png-proof.test.mjs` | 7 |
| **TOTAL** | **93** |

Real command (from the isolated Pack 1 mirror root):

```bash
node --test tests/block-packs/pack-1/core-masonry.test.mjs tests/block-packs/pack-1/stone-shapes.test.mjs tests/block-packs/pack-1/garden-components.test.mjs tests/block-packs/pack-1/physical-foliage.test.mjs tests/block-packs/pack-1/floral-forms.test.mjs tests/block-packs/pack-1/all-families.test.mjs tests/block-packs/pack-1/raycast-regression.test.mjs tests/block-packs/pack-1/gallery-count.test.mjs tests/block-packs/pack-1/png-proof.test.mjs
```

## Exact committed Git blob identity (local `git hash-object`)

| Exact file in draft PR | Git blob |
| --- | --- |
| `src/block-packs/pack-1/core-masonry.mjs` | `d790c7189b139383deb4c218740895c17080d683` |
| `src/block-packs/pack-1/fixture.mjs` | `601e4bf602ca3a5b058251025baffffbd8ab8b20` |
| `src/block-packs/pack-1/stone-shapes.mjs` | `f5feaaf2e4e18892b5bc3b5466d2808ebeee63e3` |
| `src/block-packs/pack-1/stone-shape-fixture.mjs` | `6c9ec73c0cb2d43b985b74c5ee32cc8777eb2c85` |
| `src/block-packs/pack-1/garden-components.mjs` | `df6d9af5fd675f3ef1fd419ca3a89175999a4e91` |
| `src/block-packs/pack-1/garden-fixture.mjs` | `a060586b0fe847fcd03cd8559f85e71fe5497b43` |
| `src/block-packs/pack-1/physical-foliage.mjs` | `c52fbeac79eca87b67a5cef2625445a337ea1316` |
| `src/block-packs/pack-1/foliage-fixture.mjs` | `b5e990ac93e7f9c16b754b2445fbe3b6fd7a839d` |
| `src/block-packs/pack-1/floral-forms.mjs` | `50371d5a44b09467963e9614b7d5075bfa73c013` |
| `src/block-packs/pack-1/floral-fixture.mjs` | `3804f15fcf3d77b943f3d04a7fae12329114be24` |
| `tests/block-packs/pack-1/core-masonry.test.mjs` | `64cc4561865d145cff99748790e641ac6c0807e0` |
| `tests/block-packs/pack-1/stone-shapes.test.mjs` | `276a45851e6b21ba1e66b6a4fa3f9e0d577c6ca4` |
| `tests/block-packs/pack-1/garden-components.test.mjs` | `dc6f39a76776ba97154480129f7b1c09ee14131a` |
| `tests/block-packs/pack-1/physical-foliage.test.mjs` | `9507b83e5bac018a2de2df18ae20cacc041db7c9` |
| `tests/block-packs/pack-1/floral-forms.test.mjs` | `3628f2a95a330481bc1d284495f783e50191736a` |
| `tests/block-packs/pack-1/all-families.test.mjs` | `e5d1f88fecc81a4d789a38b06c160b80047aaaeb` |
| `tests/block-packs/pack-1/raycast-regression.test.mjs` | `5b4ec4a52f9246c4d5856ae6dfecb658c07dffe3` |
| `tests/block-packs/pack-1/gallery-count.mjs` | `6e941cf73b310eb2400b274cb878e1d56d3214c9` |
| `tests/block-packs/pack-1/gallery-count.test.mjs` | `ab02c4712f525d9f964794ce0952ae581ad1b113` |
| `tests/block-packs/pack-1/png-proof.mjs` | `dfb955ae86be27438d85befe727c5b0f955cca28` |
| `tests/block-packs/pack-1/png-proof.test.mjs` | `5b74fa756c384cf6354c453eb63afe25df3b3cf9` |

## What this does and does not certify

This genuinely clears the **Pack 1 dedicated nine-module native Node acceptance requirement** for these committed candidate-source files; it is not a fake or a substitute V8 run. It did **not** run the live game or the root GitHub workflow in this local mirror. The GitHub network prevents obtaining a complete root repository checkout; however, all 21 relevant test/runtime file blobs were verified exactly against GitHub.

**Still OPEN / NOT ACCEPTED:** Five authentic Pack 1 Canvas2D gallery pages at 667×375, 844×390 and 932×430 and 30 genuine screenshots have not been captured. A fresh system Chromium check could launch the browser but `file://` and `data:` page navigation both returned `net::ERR_BLOCKED_BY_ADMINISTRATOR`; no policy bypass was attempted. Real production WebGL2 block registration (live IDs still 0–8), shape collision/selection and schema-1 orientation persistence, physical-iPhone controls and creator art approval are still unverified and require separate creator-authorized incorporation. No merge, deploy, generated-world placement, shared source/CI edits or v0.11 unlock is permitted in this PR.

**Final status: all 21 families / 30 physical assets in IDs 9–38 remain CANDIDATE. M6 complete for native Pack 1 Node test gate only; overall M6 gate OPEN.**
