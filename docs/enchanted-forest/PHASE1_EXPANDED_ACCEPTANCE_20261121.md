# Enchanted Forest Overhaul — Phase 1 Expanded Source Acceptance (2026-11-21)

**Scope:** Standalone enchanted-forest cleanup, no Codex, no automation/builder/settlement/other-biome edits, no merge or deployment.

## Protected source identity
- Production `main` unchanged when independently verified: `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Original protected isolated checkpoint: `fa1d88a34b1a9656aeb8e9b5d7fb5588cb2c5652`.
- Second narrowly scoped source correction: `f7f94c112538e0708983a8383d1ba97fd327ed67`.
- Exact regression test source: `4e512981f48f77251c002b5432b383f0bfcac72a`.
- Corrected original-game WebGL2 test source: `d56982944e229637ce964ce55f7405cb4a42d9ba`. Comparison confirms the **only** file change after 4e51298 is `scripts/ci/enchanted-forest-real-webgl2.mjs`, i.e. all source/native tests are byte-identical.

## Genuine failure inspection

### Native run #44951588596
- Head `77dcc516091cd34c1faa9c3d9b1454329a87be35`; result **FAILURE**, from unchanged strict wide audit. No test weakening.
- Authenticated log: `69` original `BLOCK.GRASS` interior voxel instances out of `19,525` sampled enchanted interior columns across 7 seeds; `191` edge BLEND grass cells tracked separately and preserved as legitimate expected transitions.
- Genuine source witnesses from original M7 `FourRegionWorld`: seed 179 at `(40,9,-494)` has original grass cap Y9 but `AIR` beneath at Y7/Y8, exactly where untouched legacy `DIRT` would have existed; similarly `(34,9,-488)`, `(92,8,-568)`, `(96,7,-568)`, seed 7919 `(-92,7,-624)`, `(36,5,-624)`. No saved edits at these witnesses. The original full-column veto was triggered by **pre-existing genuine cavern/gallery air below intact grass**.
- Downloaded GitHub artifact `14726460715`, ZIP SHA256 independently rehashed `eddaebca9dbfcd4b671002be61c90784f114bb44aadd9c59ceb6a2cb810922ad`, verified ZIP CRC: both `phase1-source-audit.json` and `phase1-wide-edge-audit.json`.
- No assumption that every unsampled coordinate has the same cause; strict samples retain failure authority.

### Browser run #44951679831
- Head `fa1d88a34b1a9656aeb8e9b5d7fb5588cb2c5652`; result **FAILURE** at source browser script line 74 waiting for M7 profile activation, not at a WebGL2 rendering assertion.
- The script had prematurely set `mythwrought-v002-selected-seed=7919`, thereby intentionally making seed 7919 `isUnclaimedWorldSeed`-ineligible. Original game then refused silent M7 creation. This is proper save-protection behavior, **not a confirmed game bug**.
- Downloaded artifact `14726777956`: ZIP SHA256 independently rehashed `62494efe470c016a3bcff5df6734ea47952b2dbe312339b1e083bc2b08dba355`. CRC verified. Contains **only `failure.json`**, zero screenshots.
- Corrected script starts with empty browser storage and original default new M7 seed 179, then explicitly switches to unused seed 7919 through real menu and `switchWorld`. Strict original-game block, GPU, screenshot, PNG SHA256, viewport and saved-byte checks remain intact.

## Narrow second source repair

`src/manual-biomes/environment-v7.mjs`: If original M7 enchanted biome **interior** (weight >=0.70) has intact old `BLOCK.GRASS` cap but legacy AIR below, the generator may change **only** the existing cap's material to legitimate enchanted ground 403/404/405. The existing subsoil, buried AIR/caves, named galleries, landmarks, ordinary tree geometry and original landscape height must remain untouched. Other biomes, the legal blend shoulders, protected non-AIR subsurface materials, and stone caps preserve their original fail-closed rules.

The new native tests assert genuine source coordinates and untouched AIR, original geometry, zero artificially created save edits, and rejection for ore/stone and other biomes. This includes a replacement of the obsolete assumption `cave below => zero writes` with the **precise** semantic requirement `cave below => no cave/subsoil writes; existing grass cap may be recolored`. No cave protection has been relaxed.

## Accepted exact-source native evidence
- Run [44954661326](https://github.com/hdog960/Mythwrought/actions/runs/44954661326), exact tested HEAD `4e512981f48f77251c002b5432b383f0bfcac72a`, **SUCCESS**.
- 4 dedicated enchanted native tests + 39 existing original world/biome, save, cave, nonblock and streaming tests = **43/43 native PASS**, 0 fail.
- Two read-only genuine M7 audits PASS:
  - Earlier 3-seed exact sample: `2,205` interior columns, 0 GRASS.
  - Expanded 7-seed/biome-shoulder study: `23,975` total sampled columns; `19,525` enchanted interiors; **0 GRASS in interiors for every seed**; 663 enchanted shoulders; 2,235 Plains; 1,552 other biome columns; 191 expected shoulder grass; 14 actual biome crossings; 35 original-world deterministic repeatability comparisons.
- Artifact `14727312041`, ZIP SHA256 independently rehashed `0baae89ce5a8947ebc04e50d5132684721be5c18975534b5f58c1f4bed5d615e`; ZIP CRC valid; two JSONs have genuine exact source HEAD.
- This validates **sampled** terrain only, not universal worldwide coverage.

## Exact-source genuine original-game WebGL2 acceptance — verified SUCCESS
- Corrected WebGL2 source-proof [Actions #44954690614](https://github.com/hdog960/Mythwrought/actions/runs/44954690614) exact head `d56982944e229637ce964ce55f7405cb4a42d9ba`, job `137000073901`, **completed SUCCESS** 2026-11-21 22:16:17 UTC. All listed job steps succeeded, including pinned Playwright Chromium, source syntax, actual game, and preservation of authentic artifact.
- Actual original `index.html` game with **M7 generator** `mythwrought-five-surface-regions-v7`, seed 7919 chosen via normal UI after fresh original M7 seed 179; WebGL2 SwiftShader software renderer with touch-capable landscape contexts.
- Tested two simulated iPhone landscape sizes: **844×390** and **932×430**, two independent viewpoints each (**four source-authentic nonblank PNG files**).
- The original game's block reader verified all five actual repaired grass-coordinate block IDs have registered enchanted soils (403/404/405). The rendered camera biome remained enchanted.
- Each screenshot had **25 loaded chunks**, 0 runtime GPU-upload faults, 0 captured page JavaScript exceptions, `renderedMeshVertices` 120282 (landmark view) or 109326 (interior view), and 23 or 25 non-block scenery instances. Real image color-bucket counts ranged **79–90**. The original save bytes were compared before/after each capture and unchanged.
- Downloaded authentic GitHub artifact `14727690873` from the exact run and **independently SHA256 checked the ZIP**: `6a09e4154afcccbc2f4b6562d6a9c93ed7624663ce47a210427b3e0e1b7c9101`. ZIP CRC self-test PASS for all five entries: four PNG files plus `manifest.json`. Independently validated PNG signatures, IHDR dimensions, *every chunk CRC including IEND*, no trailing bytes, and raw file SHA256 against manifest:
  - `repaired-landmark-footprint-844x390.png`: `8a749d0ca98a9f5be4db115172f6bbde9f67e72eb024da0dd451735fc8490e29`
  - `enchanted-forest-interior-844x390.png`: `1d14ef5a8ba401a62d93327f0537f0ac235037afa4740a1b3c07e53e154c6c94`
  - `repaired-landmark-footprint-932x430.png`: `997bbb3c6c16145e15da6154b9ad0848c78a4ef15e6d1f3c3cb4f8716a7491bc`
  - `enchanted-forest-interior-932x430.png`: `5d4c1e01f9c2ecf1e57279233b37ea0424e5a33f76304e58934172ef5cfc0722`
- The manifest exact code identity `head=d56982944e229637ce964ce55f7405cb4a42d9ba` and `sourceBlob=214f5647868663138f9086f586da3eb1b7c0b023` matches the source under examination. The newer documentary checkpoint `f5420cd410f6a5a5f3d14a093597fdf8f342cdf6` changed documentation only and did not invalidate source tests.

### Human visual review and still-open quality work
- Inspected real screenshot pixels. The forest interior still has broad, sparse dark-purple ground, short repetitive trees, and limited floor vegetation, consistent with the deferred giant-tree/floor phases.
- The landmark viewpoint has **green-tinted ground** covering part of the view. This must **not** be mislabeled as unresolved original `BLOCK.GRASS=1` without coordinate/ID proof: the enchanted generator deliberately uses `G.woodlandMoss=405` with green-gray palette `[.28,.37,.32]` and other enchanted substrates. Visually distinguish planned moss variations from inappropriate green-colored material boundaries before any additional color correction.
- Actual native+browser Phase 1 sampled-grass defect gates are now **PASS**. They do not prove zero grass in every unseen seed/coordinate, original-video build provenance, natural foot traversal, physical iPhone performance, or the installed Home Screen PWA.
- No new Starspire, Moonwillow or Ancient Giant trees were authored here; these are later phases.
- No main merge/deploy, Codex involvement, automation, settlement, builder or other biome changes.

## Next action
Continue original-game enchanted source visualization with seed/coordinate-backed classification of moss ID 405 versus any genuine green grass/legacy material, broader biome edges, ground-level foliage density and tree silhouettes. Only repair proven defects. Then proceed toward the separately gated monumental-tree feasibility and mobile performance program, without touching protected lanes or merging.
