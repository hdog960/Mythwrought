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

## Source-authentic S0 evidence update — 2026-11-21

**Source/provenance acceptance:** The generator, physical ID, renderer, legacy protection, reference screenshots, and reproduction mechanism are now identified and source-probed. The full snow cleanup is **not complete**. No S2 generator changes are accepted.

### Exact previous-head 4606d69a CI

- Dedicated S0 #44951705817 **SUCCESS**: 5/5 strict ice native tests, 10/10 environment-profile tests, all 303 manifest assets verified and real Chromium WebGL2 before/after at 844x390, 956x440.
- Depth #44951705801 **SUCCESS**: native 1748/1748 and 3 actual WebGL2 landscape gates.
- Pack 3 #44951705792 and Manual Five-Pack #44951705802 **SUCCESS**.
- Root #44951705796 still running at this source-analysis checkpoint; do not infer final success.

### Authenticated real-game artifact

Artifact **14726211985**, ZIP SHA256 **a7b7dc2f3371e92e0ecf6742d7b0d92892be78e866dadabbaf2d2673e8c3e59e**; all ZIP CRCs and PNG SHA256s passed independent audit. Original and renderer-draft captures share seed 179, real ice block 276 at (-144,8,528), camera pose (-133.5,9,515.5), 25 loaded chunks and native Chromium WebGL2. At 844x390, 7,870 of 329,160 pixels changed (2.39%); at 956x440, 9,008 of 420,640 changed (2.14%). Those are actual frame diffs, **not** proof the entire blue-white checkerboard disappeared: the baseline camera sees only a narrow edge of the ice field.

A new elevated in-game comparison (via the existing localhost-only, collision-validated camera method) is now queued to show the real ice field from closer above. No game API or save data were changed to create this image.

### Measured grass-column protection

Sample: 1,681 high-weight snow columns per seed, two seeds (179, 2026), x [-160,160], z [352,672], 8-block spacing, total **3,362**.

| Genuine M7 rejection case | seed 179 | seed 2026 | total |
| --- | ---: | ---: | ---: |
| protected legacy AIR in old substrate | 79 | 77 | 156 |
| protected old STONE above surface | 16 | 14 | 30 |
| protected old WOOD above surface | 12 | 11 | 23 |
| protected old LEAVES above surface | 4 | 0 | 4 |
| all empty protected columns | 111 | 102 | 213 |
| retaining legacy GRASS at old top | 52 | 45 | 97 |

These cases are **not interchangeable**. The 156 subsurface AIR rejections can be old caves/cutouts; **never fill them blindly**. The 57 above-surface blocks include potential ordinary trees, groves, and named objects, not all verified to be removable. The 97 legacy grass cells are material-level evidence; additional air/visibility qualification is needed before claiming all are visually exposed. There is no recorded cave override in the rejected sample examples.

**S2 design gate:** A source-safe fix must distinguish harmless surface grass from all protected legacy caves/landmarks; prove unchanged original M7 world/save behavior or use a new explicit versioned generation profile if physical natural baseline changes. No blanket tree erasure or shader-only concealed broken terrain is accepted. Dedicated tests `tests/snowy-biome-provenance.test.mjs` lock authentic AIR/STONE/WOOD/LEAVES witnesses and schema-1 edit/reload; not yet accepted until new exact-head CI.

**S1 design gate:** Five strict renderer tests passed at prior exact head and the current physical ice cap's material contrast was reduced. This alone is not visual acceptance of the wide checkerboard: await elevated before/after PNG inspection and multi-seed field checks before declaring S1 complete.

**S3–S6:** visual vegetation, terrain/environment and physical-phone review remain future work, not implementation claims.
