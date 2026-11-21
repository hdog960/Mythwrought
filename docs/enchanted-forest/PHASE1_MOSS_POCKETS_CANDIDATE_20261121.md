# MYTHWROUGHT Enchanted Forest — Phase 1 Moss-Carpet Source-Backed Visual Correction

Date: November 21, 2026. Standalone enchanted-only branch, no merge, deployment, automation, Codex, builders, settlements or unrelated biome modifications.

## Protected source and pre-change confirmed evidence

- Production `main` when verified: `7016e14cd6289f45eaf7fc6a79a362b47996df65`. Original creator-specific isolated branch checkpoint: `51ce6745ec57b5f196da54e9d498dac3dbc3dcd4`.
- Original-game WebGL2 proof [44954690614](https://github.com/hdog960/Mythwrought/actions/runs/44954690614), screenshot `repaired-landmark-footprint-932x430.png`: seed `7919`, camera `(-73.5,-584.5)` feet `10`, looking toward `(-56,6,-568)`. Genuine game shows a broad green-gray foreground and purple earth beyond.
- Original native source [44961756371](https://github.com/hdog960/Mythwrought/actions/runs/44961756371), commit `c4818b66a343c5b2e74ee3a197b09dbd149e39d2`: **SUCCESS**, 43/43 native tests PASS; 7-seed 23,975-column strict zero interior original-GRASS audit PASS. Exact screenshot-coordinate color audit PASS.
- Original ground color audit artifact `14730355382` independently checked: ZIP SHA256 `c91e4b2f356c568d2ba9949cf2013c9d1d55f859bede991e8d60278694ae8968`, all three ZIP CRC valid, `phase1-ground-color-provenance.json` SHA256 `3e0a772afd5f2684e885d6f1aec195ae24f693a0f627d7e2e5eca2b87f444d48`. Exact source blob `214f5647868663138f9086f586da3eb1b7c0b023`.
- Authentic original terrain ground-caps (27×27 2-block lattice, 729 samples per scene): landmark camera at `(-74,-585)` is block ID `405` (Moonlit Woodland Moss). Moss at landmark camera = **551/729 = 75.58%**. Target at `(-56,-568)` is block `404` (Deep Woodland Peat), with 250/729 = 34.29% moss nearby. Interior camera `(-24,-537)` is ID `404`, with only 3/729 = 0.41% moss. No original GRASS ID `1` at sampled enchanted interior terrain caps.
- This proves the broad green-gray area is **M7's own intentionally selected green-gray moss material**, not ordinary plains grass, and the moss selection band is disproportionately large in one genuine original-game view. It does **not** prove direct exact per-pixel ray intersection with specific blocks, nor characterize all seeds/worlds.

## Focused source repair candidate (protected, NOT released)

The creator's aesthetic requirement is enchanted purple earth with **localized magical vegetation**, not wide solid green-gray carpets. Keep Moonlit Moss but interrupt the existing low-frequency blanket with two smoothly varying source-deterministic organic pockets.

- `src/manual-biomes/environment-v7.mjs` changed only the default enchanted `groundAt` moss cap selection. Source blob at candidate: `c2f09b0e2bb261069a36ff911ca725516e96712e`.
- Retains existing outer band threshold `band>.79`; for **enchanted interior biome weight >=.70**, additional pocket gate `0.64*mossWisp + 0.36*mossPulse >.66` applies. `mossWisp` and `mossPulse` are smooth seed + X/Z sinusoidal contours. This is not per-cell hash/checkerboard material randomization.
- **For enchanted shoulder biome weight below .70**, the original band-only moss rule remains exactly as before. Desert/snow/mountain `groundAt` returns, original shared shoulders, forest tree source, cave/landmark geometry, legacy grove rules, M7 generator identity, material palette and numeric IDs 403/404/405 remain unchanged.
- Old woodland moss cells displaced by this aesthetic correction use the existing purple peat or loam cap, not a new resource ID. Subsoil, height, cave air and physical mesh pipeline unchanged by this source change. This is a candidate generated-ground difference; prior-world terrain/save compatibility still requires original save/reload verification and creator hold.

## Strict independent acceptance gates

1. New `tests/manual-biomes/enchanted-forest-moss-pockets.test.mjs`, blob `96c537f13b8b881a6cad2be32992226088bd5be8`: original `FourRegionWorld` screenshot-area source caps must remain 100% enchanted interior; retain **>=8% and <=40% real Moonlit Moss** around landmark camera and **>=55% actual purple loam/peat**; preserve strong existing purple forest interior and foreground; forbid GRASS; verify the actual original block reader and zero world edits. Explicit old shoulder weights 0.51, 0.60, 0.69 retain their original moss cap, and real seed179 transition grass stays intact. Non-enchanted cap types excluded.
2. Existing dedicated 4/4 Phase 1 and 39/39 original compatibility tests, plus unchanged 3-seed and 7-seed strict source audits, plus the new original source-ground material audit in **single isolated workflow**.
3. Current native exact-head run [44962042593](https://github.com/hdog960/Mythwrought/actions/runs/44962042593), source commit `c562620b320fbb564f9189210e6fe7c54aa93fb1` — QUEUED at candidate checkpoint. Do not call PASS until logs confirm.
4. Current real WebGL2 [44962003550](https://github.com/hdog960/Mythwrought/actions/runs/44962003550), exact source commit `8106e74f12b77b7d48a860ee5e77bb9e042ffaa5` — QUEUED at checkpoint; compares same original game and two real mobile-sized Chromium viewports. Subsequent source changes are **test/workflow/docs only**, not terrain source. Require valid four genuine PNGs, source SHA, browser errors=0, GPU faults=0, unchanged saved bytes. Do not mark accepted until independently checked.
5. Physical iPhone Home Screen PWA remains a later creator acceptance gate. Genuine Chromium screenshots are **not** a physical iPhone or ordinary walking proof.

## No-release boundary

Protected `main`, other biome developers, five automations, settlement tracks, Codex, builders and existing other protected branches remain untouched. No merge/deploy. The mythical tall-tree, ground vegetation and particle phases remain separate future work.
