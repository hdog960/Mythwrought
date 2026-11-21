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

## Outstanding gate — original-game visual rendering
- Corrected WebGL2 source-proof run [44954690614](https://github.com/hdog960/Mythwrought/actions/runs/44954690614), exact head `d56982944e229637ce964ce55f7405cb4a42d9ba`, was QUEUED at the most recent observation.
- Requires original M7 game in Chromium SwiftShader WebGL2, 2 landscape viewports `844×390`, `932×430`, 4 distinct true PNG screenshots, independent PNG dimensions/color diversity/digests, checked five genuine repaired voxel IDs, no unexpected JS/GPU errors, and no modified save bytes.
- This is NOT a physical iPhone or installed Home Screen PWA test. Until the actual finished run/logs/artifacts prove the conditions, mark visual acceptance **PENDING**, not success.
- Tall Starspire/Moonwillow/Ancient trees and additional vegetation density are later phases and **have not been authored** here.

## Next action
Verify the browser run status, exact branch refs and actual job logs; diagnose any genuine browser failure without relaxing source/render checks; download authentic artifact ZIP and independently validate SHA256, ZIP and PNG CRC/IHDR/SHA. Then extend biome edge/forest-floor visual review as warranted, still isolated, without merge or deployment.
