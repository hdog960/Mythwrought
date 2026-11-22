# MYTHWROUGHT Enchanted Forest Phase 1 — Moss-Pocket Exact-Source Acceptance

Date: November 21, 2026 (GitHub run completion November 22 UTC). **Protected isolated development checkpoint. No release, merge or deployment.**

## Grounded production / branch authority

- Protected production `main` verified at `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Isolated enchanted-forest branch verified before checkpoint write at `07e3cbdf65de87b8bcb6dd2eeb6fe8aa74766947`. It was identical to the creator-provided exact HEAD at the start of this continuation.
- Same genuine modified terrain source blob in **both** native and original-game WebGL2 proof: `c2f09b0e2bb261069a36ff911ca725516e96712e`.
- Protected source correction only concerns `src/manual-biomes/environment-v7.mjs`'s M7 **enchanted interior** moss-cap pocket gate. No material IDs/colors changed, no height/cave/landmark logic change in this phase, and `biome.weight<.70` retains the original enchanted-shoulder material choice. No modified other biome, builder, settlement, automation, production service worker, Codex or save file.
- Four authentic browser screenshots have separate SHA256s and 2 simulated phone-landscape sizes; test-only camera teleport is disclosed. Never describe this as physical iPhone/PWA acceptance.

## Genuine native strict acceptance

[GitHub Actions #44962042593](https://github.com/hdog960/Mythwrought/actions/runs/44962042593), exact commit `c562620b320fbb564f9189210e6fe7c54aa93fb1`, real job `137022788323`, completed **SUCCESS**.

Actual native logs:
- 4/4 dedicated Phase 1 source/cave/landmark tests, **PASS**.
- 3/3 new source-backed moss-carpet material tests, **PASS**. Strict region assertions require 8–40% enchanted Moonlit Moss at landmark camera; >=55% purple loam/peat, saved edits unchanged, actual original cap reader parity and protected prior boundary caps.
- 39/39 existing original world/profile/save, depth/cave, native trees, seed generation, biome shoulder, non-block scenery, streaming tests, **PASS**.
- **46/46** native tests across those groups, zero failures.
- Original three-seed audit: 2,205 enchanted-interior sampled columns, original BLOCK.GRASS=1 count **zero**, protected original stone surface caps still present.
- Expanded 7-seed audit: 23,975 sampled columns, comprising 19,525 enchanted interior, 663 enchanted shoulder, 2,235 plains, 1,552 other biomes, 14 observed adjacent biome crossings and 35 deterministic independent-world comparisons; **zero** genuine original plains grass in sampled enchanted interiors. The expected 191 grass instances on narrow blended shoulders remain.
- 7-seed audit is sampled evidence, **not** a guarantee for all possible seeds and coordinates.

Source-backed `phase1-ground-color-provenance.json` counts were calculated with the true original `FourRegionWorld` at seed `7919`, four screenshot regions, each using a 27×27 grid of 729 samples (X/Z step 2). These are physical block IDs, **not** inferred pixel-to-voxel ray intersections:

| Seed 7919 screenshot-region center | Moonlit moss ID 405 *before* | Moss ID 405 *after* | After share of all 729 |
|---|---:|---:|---:|
| Landmark camera (-74,-585) | 551 | **158** | **21.67%** |
| Landmark target (-56,-568) | 250 | **66** | **9.05%** |
| Forest interior camera (-24,-537) | 3 | **0** | **0%** |
| Forest interior target (0,-512) | 360 | **158** | **21.67%** |

For the landmark camera after correction: 526 purple Deep Woodland Peat (ID404), 31 purple-brown Aether Woodland Loam (ID403), 158 magical moss (ID405), 12 original AIR (ID0) and two protected STONE (ID3). The camera's exact source terrain cap changed from **405 moss** to **404 peat**. Source colors registered in `src/environment-ground.mjs`: 405 green-gray `[0.28,0.37,0.32]`; 404 purple `[0.25,0.19,0.29]`; 403 `[0.29,0.23,0.34]`. No source ground cap ID1 was measured in the four sampled enchanted interiors.

### Independent native artifact integrity
GitHub artifact [14730868543](https://github.com/hdog960/Mythwrought/actions/runs/44962042593/artifacts/14730868543), authentic downloaded ZIP SHA256 independently recomputed: `ea6f9c26b0db4b133cd09a06cb01ffcccd5d197a846a655083cb932d2418c889`, matches GitHub-reported digest. ZIP CRC verified all three JSON files:
`phase1-source-audit.json`, `phase1-wide-edge-audit.json`, `phase1-ground-color-provenance.json`. The material source identity in JSON is precisely `c2f09b0e2bb261069a36ff911ca725516e96712e`.

## Genuine original-game WebGL2 acceptance

[GitHub Actions #44962003550](https://github.com/hdog960/Mythwrought/actions/runs/44962003550), source commit `8106e74f12b77b7d48a860ee5e77bb9e042ffaa5`, actual job `137022665906`, **SUCCESS**. Source blob is **byte-identical** to native audit `c2f09b0e2bb261069a36ff911ca725516e96712e`. Later native-only changes were tests/workflows/docs, not gameplay material source.

- True local original `index.html` game, generator `mythwrought-five-surface-regions-v7`, seed 7919 via actual UI with first fresh M7 world 179; Chromium WebGL2 software renderer, touch-capable simulated phone-landscape viewport (not physical device).
- 4/4 independently checked original-game PNG captures, across 844×390 and 932×430. All five old grass-repair witness block IDs were real enchanted ground. Source renderer had 25 resident chunks in all four frames, rendered geometry 120282 landmark and 109326 forest interior mesh vertices, nonblock scenery 23/25 instances. No captured JS page errors or GPU upload faults. Saved-world bytes were checked unchanged during each capture.
- [Authentic artifact 14729803878](https://github.com/hdog960/Mythwrought/actions/runs/44962003550/artifacts/14729803878) downloaded; independently recomputed ZIP SHA256 `c3ea8981c495773d3d3c7c28e11cbc17fbd5600eb8b056778c0a0be4d6505ad6` matches GitHub. The manifest and four PNGs passed ZIP CRC. Independently parsed **every PNG chunk's CRC**, 8-byte signature, IHDR dimensions, IEND and no trailing bytes; each PNG SHA256 matched manifest exactly:
  - `repaired-landmark-footprint-844x390.png`: `0efbabeb2db71b29b676732e5d65e60e23fa890951a30b9390d64d5f8c4387d1`
  - `enchanted-forest-interior-844x390.png`: `ce009392ce3e1552e2b1298845b03c38559b512a2ec1b65b5ac5b6bf76cabbd1`
  - `repaired-landmark-footprint-932x430.png`: `012c77f7bfb12014cb88d932bbc21019cfab7cc9d5623cc53be0a4edb749533f`
  - `enchanted-forest-interior-932x430.png`: `6ad5fac0b8ec773643367853cfe78a40fdf0a62852e921f9badd2d4cb050fa6f`.
- Actual screenshots inspected: in the landmark viewpoint purple earth now occupies the broad foreground formerly green-gray, with green enchanted tree canopies retained. Interior remains purple and exhibits existing short/repetitive trees and a sparsely planted ground floor. *This is visual review, not numeric per-pixel color-source proof.*

## Deliberate limits / next roadmap

**ACCEPTED: Phase 1 sampled original-grass contamination repair and localized purple-dominant moss-material visual correction through native and genuine original-game WebGL2 gates.** No additional terrain-source correction justified by current measured evidence. Do not touch game code just to extend Phase 1.

**NOT ACCEPTED:** Physical iPhone 17 Pro Max Home Screen PWA, actual on-foot traversal/performance, world-wide perfect coverage, old cached PWA build update, source gameplay restore of old screenshots, fully backward-identical *unmodified* M7 generated terrain for already-created worlds. The generator's procedural material choice has changed within the same M7 identity; schema-1 edit preservation passes, but previously unedited naturally generated cap material can visually regenerate differently when deployed. This must remain a future explicit release/migration acceptance risk and is not a license to alter old saves.

Next develop **separate protected Phase 2 tall fantasy trees**: source-correct M7 world maximum Y19, tree height/shape feasibility and canopy bounds, Starspire/Moonwillow/Ancient Giant variations, old legacy trees and edited saves protection, chunk boundary correctness and iPhone renderer performance. First review roadmap criteria and test physical feasibility rather than raising global Y or modifying legacy tree seed shuffle. Phase 3 forest-floor non-block vegetation density later. Maintain isolation from all other biome development and five automations; no merge or deploy without explicit creator authorization.
