# MYTHWROUGHT Enchanted Forest — Real Screenshot Green-Gray Material Investigation

**Date:** 2026-11-21. **Scope:** isolated enchanted-forest V7 only; no release, merge, automation, builder, settlement or Codex changes.

## Protected source
- Production main independently verified: `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Branch at investigation start: `51ce6745ec57b5f196da54e9d498dac3dbc3dcd4`.
- Source original V7 terrain blob: `214f5647868663138f9086f586da3eb1b7c0b023`; source M7 materials blob `64ba16d5e145119c0c14b1ee621538d57895cab2`.
- Original actual-game WebGL2 artifact: exact run [44954690614](https://github.com/hdog960/Mythwrought/actions/runs/44954690614), seed 7919; `repaired-landmark-footprint-932x430.png` and `enchanted-forest-interior-932x430.png`. Four original-game PNGs have previously passed independent PNG CRC, source SHA256 and ZIP checks; browser proved 0 original GRASS at five original measured interior coordinates, no page/GPU faults and preserved save bytes.
- Native strict Phase 1 source verification: [44954661326](https://github.com/hdog960/Mythwrought/actions/runs/44954661326), 43/43 genuine native tests, 23,975 sampled columns including 19,525 enchanted interior, 0 original GRASS ID 1 inside sampled interior; 191 legitimate blend-edge GRASS points remain. These samples cannot prove arbitrary uninspected terrain.

## Exact visual observation
- `repaired-landmark-footprint-932x430.png` camera at `(-73.5, -584.5)` (feet Y 10), aimed at `(-56,6,-568)`, looking SE. The original game shows a broad green-gray foreground near large tree foliage, followed by purple/lavender ground. The selected outline is **MOONLEAF CANOPY**, not an identified ground block. Do **not** infer a ground block ID from the crosshair UI.
- `enchanted-forest-interior-932x430.png` camera `(-23.5,-536.5)`, aimed near `(0,-512)`, shows visibly mostly purple/lavender ground.
- These pictures display real original M7, not generated mock imagery or screenshots from a physical iPhone.

## Source-derived color hypothesis — not yet a per-pixel material proof
- In `src/environment-ground.mjs`, V7 `woodlandMoss=405` is specifically named **Moonlit woodland moss** with registered color `[.28,.37,.32]` (green-gray), while `woodlandPeat=404` is `[.25,.19,.29]` (dark purple). `woodlandLoam=403` is `[.29,.23,.34]` (lavender-brown). These are distinct from legacy `BLOCK.GRASS=1`.
- In `src/manual-biomes/environment-v7.mjs`, the enchanted default `groundAt` function assigns cap `G.woodlandMoss` when `band>.79`, otherwise `G.woodlandPeat` when `patch<.25`, otherwise `G.woodlandLoam`. This band is derived from seed+coordinates only, and does not inspect tree origin or species. Its broad low-frequency pattern can create large moss areas independent of the legacy tree generator.
- Algebraic evaluation of the exact source band expression at real screenshot anchors for seed `7919`: camera `(-74,-585)`, `band≈0.9873` => **the candidate default ground cap is 405**, if original M7 generation isn't vetoed; view target `(-56,-568)`, `band≈0.6489`, `patch≈0.00002` => **candidate default cap is 404**. The two camera areas therefore have an obvious source-grounded color explanation.
- **Critical qualification:** An original cave/landmark veto, biome shoulder rule, vegetation or edits can override candidate cap. The screenshot is not a pixel-to-voxel lookup. Do not claim confirmed material ID 405 until running the real `FourRegionWorld` source coordinate probe.

## Narrow next source gate
- Added read-only `scripts/ci/enchanted-forest-ground-color-audit.mjs` and registered it in the single existing isolated native source workflow, without altering game code or weakening prior tests.
- Runs real original `FourRegionWorld` for seed 7919 at the two screenshot camera and target areas, records each original actual terrain cap ID, full-biome weight, old and planned top, candidate green material share and every tested ground coordinate to source-associated JSON. It forbids original GRASS in sampled enchanted interiors and requires meaningful biome coverage.
- Exact GitHub Actions [44961756371](https://github.com/hdog960/Mythwrought/actions/runs/44961756371), source HEAD `c4818b66a343c5b2e74ee3a197b09dbd149e39d2`, was **QUEUED** at initial audit; exact outcome not yet established.
- Only after genuine source output will material/terrain changes be considered. Color or frequency changes to shared ID 405 could affect legitimate neighboring snow/enchanted shoulders and are not authorized by a photo alone.

## Hold and next step
- Continue source trace, verify the real GitHub job's report and artifact CRC/digests, decide if what remains is intentional Moonlit moss versus an unwanted original-grass leftover, and document whether a visual-material adjustment is justified.
- Do not fabricate pixel-level IDs, weaken strict biome-edge tests, or alter cave/landmark geometry and saved edits.
- No monumental mystical tree families have been implemented in this investigation; those remain on the separate later phases.
