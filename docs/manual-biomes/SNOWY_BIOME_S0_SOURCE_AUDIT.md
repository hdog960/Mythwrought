# Snowy biome cleanup — S0 source investigation

**Status:** S0 source audit started; S1 narrow renderer correction staged for testing, **not accepted or deployed**.  
**Source:** `main` at `7016e14cd6289f45eaf7fc6a79a362b47996df65` on 2026-11-21.  
**Scope:** Standalone protected draft, independent of Codex and the five automation lanes. No merges/deployments authorized.

## Traced source paths

- `src/manual-biomes/v6-balanced-biomes.mjs`: V6 biome membership, weighted borders and seed-dependent tiles.
- `src/manual-biomes/profile-world.mjs`: generation-profile routing, M7 protected-cave baseline, tree masking and physical natural cells.
- `src/manual-biomes/environment-v7.mjs`: M7 surface cap IDs, special-biome shoulders, legacy grove suppression, native snow/enchanted trees.
- `src/voxel.mjs`: colored exposed faces and M7-specific natural terrain smoothing.
- `src/biome130-registry.mjs`: physical IDs, per-face deterministic palette selection.
- `src/auto-block-catalog/biome130/{snow-foundations,glacial-materials,frozen-ice}.mjs`: physical ice and snow material palettes.

## Findings

1. **Checkerboard (source-backed likely visual cause).** M7 snow caps can select block `276` (blue glacier ice) when `patch<.10`; other snow-cap choices are `272` snowpack and `279` rime rock. M7 renderer already shades authored terrain with averaged material colors and continuous world-space tint. However, `276` was missing from `BIOME_GROUND_COLORS`, so it fell back to `biome130Color(id,x,y,z,face)`, a palette choice that varies abruptly by physical cell. Its catalog palette ranges from deep blue to white. This matches the blocky blue/white variation in the user capture, although exact scene-coordinate reproduction is pending.
2. **Snow-tree repetition (confirmed source design limitation).** M7 conifers use only height 4 or 5 and one narrow tier/radius recipe in `treeVoxels`, with upper snow needles. S3 must add genuine distinct silhouettes, maintaining collision/physical cells and chunk-border determinism.
3. **Plains vegetation (partially traced; visual cause not yet proved).** `keepLegacyGroveTree` examines a grove tree's origin climate and `_environmentBaseline` masks only ordinary `WOOD` and `LEAVES` for qualifying groves. Separately, `planEnvironmentalColumn` returns an empty replacement when preexisting natural non-air geometry above the old ground fails its protective full-column check. That can retain original `GRASS` columns, but correlation with the user-visible patch must be demonstrated before changing it. Trees crossing a biome boundary and named protected geometry need special care.
4. **Exposed gray rock (needs measured scene reproduction).** Snow caps can select rime-coated stone `279`, snow rock `279`, and permafrost subsoil `278`. Other gray patches can be cave, legacy terrain, or generated stone; do not recolor until cells are sampled.
5. **Save-provenance constraint.** M7 is its own generation identity and older M2–M6 profiles remain supported. Changing existing M7 natural block IDs would change those worlds' baseline. First corrective patch therefore changes only how **natural M7 blue ice is rendered**, not physical generation, IDs, collision, cave protection, player edits or schema-1 serialization.

## Narrow corrective patch staged (S1, unverified)

Include ID `276` in the M7 natural-terrain color averaging path. The pixel-alternating face palette is no longer used for this natural glacier cap; it instead uses continuous world-space tint like neighboring natural snow materials. Explicitly player-edited blue ice and earlier generator profiles keep their existing rendering behavior.

A new direct `meshChunk` test exercises natural M7 ice, V6 isolation and edited-ice isolation. **Test execution and visual acceptance are pending.** The patch does not promise that all ice/snow transitions or checkerboard patterns have been eliminated.

## S0 evidence still required

- Reproduce user video's glacier field with matching world seed/camera coordinates; capture authenticated WebGL2 before/after frames at iPhone landscape sizes.
- Sample real world-reader block IDs around blue/white tiles and green patches.
- Trace grove-origin, canopy overhang, safe terrain replacement, named/protected cells, and biome shoulders without disturbing unrelated trees.
- Inventory non-block winter decoration assets and verify their mounting path.
- Record genuine baseline/proposed frame timing, geometry uploads and cave/digging effects.

**Gate:** Do not mark S0 accepted or progress to broad terrain/tree fixes until these checks are documented. S1 visual acceptance requires genuine image evidence. Retain protected draft until creator approves final outcome.
