# Builder 4B M2 — twelve expressive authored geometries, first variant per biome × size

**Draft candidate state only; exact PR-head native and browser tests NOT YET ACCEPTED in this document.** This work stays strictly on [draft PR #185](https://github.com/hdog960/Mythwrought/pull/185).

## Source authoring and distinctive massing

The twelve individual plans in `src/building-pool/roadmap-4b/m2-distinctive.mjs` use **hand-selected physical footprints** made from architecturally meaningful segments, rounded pavilion discs and explicit outdoor courtyard holes; separate authored entry coordinates, treatment/reading rooms, partial walls/door portals, source-oriented glazing/furniture dependencies and **stacked raised roof crowns** with direct underlying support. There is no random seed, mirror generation, rotation-only duplication, palette-only quota inflation or copy of PR #123 geometry.

New silhouette vocabulary is materially different from the first sixteen broad-front-hall M2 structures: Sunwell crescent / Crosswind cross / Cloverleaf tri-pavilion / Moonring open-air healing garden / Switchback mountain treatment wing / Five-terrace mountain sanatorium; double-cloister open-air library / twin-shaft snow library / octagonal forest reading pavilion / two-octagon Lore Exchange / mountain switchspine / four-bastion archive.

## Twelve new source-addressable candidates

| Stable original-category ID | Individually authored building | Occupied 3D voxel cells | Walk nodes | Functional rooms |
|---|---|---:|---:|---:|
| `r4:healers-house:desert:small:01` | Sunwell Crescent Clinic | 1,264 | 146 | 4 |
| `r4:healers-house:snow:large:01` | Crosswind Field Hospital | 2,303 | 395 | 5 |
| `r4:healers-house:enchanted-forest:medium:01` | Cloverleaf Apothecary | 1,557 | 222 | 4 |
| `r4:healers-house:enchanted-forest:large:01` | Moonring Healing Sanctuary | 2,523 | 417 | 6 |
| `r4:healers-house:mountain:small:01` | Switchback Mountain Sickbay | 1,158 | 136 | 4 |
| `r4:healers-house:mountain:large:01` | Three-Terrace Sanatorium | 3,268 | 528 | 6 |
| `r4:library:desert:large:01` | Sun Court Double Cloister | 3,427 | 616 | 6 |
| `r4:library:snow:large:01` | Hearthline Twin-Shaft Library | 2,697 | 425 | 5 |
| `r4:library:enchanted-forest:small:01` | Octagonal Lumen Reading Room | 981 | 154 | 4 |
| `r4:library:enchanted-forest:medium:01` | Twin-Octagon Lore Exchange | 1,470 | 244 | 5 |
| `r4:library:mountain:small:01` | Switchspine Ridge Library | 1,327 | 171 | 4 |
| `r4:library:mountain:large:01` | Four-Bastion Archive | 3,598 | 572 | 6 |

**New pass:** 25,573 extra physical occupancy cells, 4,026 supported walk nodes, 59 real named room footprints; all 12 distinct from the previous 21 by rotation-, mirror-, translation- and palette-invariant shape hash. The 21 previous source records are imported unchanged in memory, never rewritten.

**Census:** 33/285 source-authored, 252 unauthored. Exactly **15/75 healers' houses and 15/60 libraries** (one unique first variant in each of the fifteen biome×size cells, 30/135 M2 category source-authoring slots). Thus M2 still needs 60 healers and 45 libraries, not 0. The other three programs remain at one each. Creator-final-approved **0**; live integrated **0**.

## Verification requirements

- Native exact-head `tests/building-pool/roadmap-4b/m2-distinctive.test.mjs` loads real committed blueprint arrays and tests all 33 source fingerprints, full weather planes, overhead tiers seating on occupied cells, clear entrance/inner portals and connected walk graph, non-overlapping functional room tiles, 12 distinct shape profiles, typed symbolic dependency manifests and all fifteen healer/library first slots.
- Genuine Chromium WebGL2 (software-ANGLE cube-proxy) `tests/building-pool/roadmap-4b/m2-distinctive-webgl2.test.mjs` drives `m2-distinctive-preview.html`: **12 newly authored source sets × exterior/section × 667×375, 844×390, 932×430 = 72 expected authentic screenshot PNGs**. Every frame must carry source ID, pixel dimensions, WebGL2 draw/gl.finish, no GL error/context loss, and a source SHA-256 in results. These screenshots have not been counted as complete merely by authoring the test; inspect actual images for readability, clipping, lens/roof silhouette and source-specific layout errors.
- Previous M1 30-view and first-M2 96-view source-specific tests remain in the same nested native suite, plus standard production-game smoke/layout. All three are distinct checks; none proves final iPhone controls or physical family rendering.

## Fidelity blockers and governance

The cube-proxy renderer presents source coordinates but **not the final manual five-pack physical shapes** or true alpha-glazing, attached support/door panes/stair collision, physical iPhone FPS/GPU or premium approved artwork. The existing manual family `pack4:030` window, `pack4:058` bench and `pack4:059` table references remain typed provisional shape/volume/mount/orientation dependencies; `pack2:020` is only planned door-closure metadata. The raised exterior roofs are non-traversable physical silhouettes and do **not** imply functional upper-floor or stair circulation. Theoretical source may exceed game-height bounds. No magic/healing mechanics, NPCs, quests or save writes are added.

Working ownership restricted to `src/building-pool/roadmap-4b/`, `tests/building-pool/roadmap-4b/`, `docs/building-pool/roadmap-4b/`. Old four building PRs, seven sibling builder PRs, five manual Block Packs, independent biome130, five automations, main/checkpoint, shared runtime, saves, Gate A and locked v0.11 remain untouched. Do not merge, deploy or register until separately authorized.

**Next:** source-exact GitHub native+browser verification and independent screenshot inspection. Correct only evidenced 4B geometry defects, then M2 variants 02–05 should introduce further distinct room graphs rather than scale/crown swaps.
