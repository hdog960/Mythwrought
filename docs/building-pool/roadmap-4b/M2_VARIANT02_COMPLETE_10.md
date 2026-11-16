# Mythwrought Builder 4B M2 — second-variant regional completion

**Draft PR #185, unmerged and undeployed. New ten models source-authored; exact-head native and Chromium acceptance PENDING.** Previous 53 geometries remain source-unchanged and were technically accepted at [Actions #43790613985](https://github.com/hdog960/Mythwrought/actions/runs/43790613985) (103 native tests, 318 genuine Chromium WebGL2 cube-proxy renders across 667×375, 844×390 and 932×430, no GL errors/context loss).

Ten independent, genuinely coordinate-authored buildings now fill the five missing second-variant biome/size slots for each healer-house and library program. The new architectures include serpentine infirmaries, dual-rounded desert medicine, snowy cruciform care, triple-lotus enchanted forest healing, mountain winged curatives, Brookgate round-wing reading, twin open-sky desert manuscript courts, rear-wing snow library, triple-leaf forest reading and a mountain round-front archive.

| Stable source ID | Original individually authored plan | Occupied 3D voxel cells | Supported navigation nodes | Named rooms |
|---|---|---:|---:|---:|
| `r4:healers-house:temperate:large:02` | Riverbend Serpentine Infirmary | 2,768 | 420 | 6 |
| `r4:healers-house:desert:small:02` | Dustgate Dual-Round Apothecary | 1,330 | 165 | 4 |
| `r4:healers-house:snow:small:02` | Iceloft Hearth Cross | 1,426 | 177 | 4 |
| `r4:healers-house:enchanted-forest:large:02` | Moonpetal Grand Recovery House | 3,250 | 652 | 6 |
| `r4:healers-house:mountain:medium:02` | Skybridge Curative Lodge | 2,141 | 324 | 4 |
| `r4:library:temperate:small:02` | Brookgate Twin-Round Reading Cottage | 1,241 | 157 | 4 |
| `r4:library:desert:large:02` | Sirocco Twin-Courtyard Archive | 4,150 | 730 | 6 |
| `r4:library:snow:small:02` | Frostflower Rear-Wing Library | 1,354 | 222 | 4 |
| `r4:library:enchanted-forest:medium:02` | Greenhush Branching Lore Grove | 2,248 | 397 | 5 |
| `r4:library:mountain:small:02` | Basalt Sentry Round Archive | 1,202 | 175 | 4 |

**New physical-coordinate authored inventory:** 21,110 cells and 3,419 walk nodes. **Complete 4B census:** 63/285 source-authored, 222 not yet authored, 30/75 healers and 30/60 libraries (two original 01/02 designs in each of 15 biome×size cells), the other three categories remain at one each. M2 healer+library target still requires 45 healer designs and 30 libraries. 0 creator-final-approved and 0 integrated. 63 unique geometry fingerprints under translation, palette, D4 rotation and reflection. Additional in-memory 2D normalized silhouette audit found no new near duplicates with Jaccard >=0.89 among 63 designs.

## Exact-head verification

- `m2-variant02-completion.test.mjs` uses the actual authored 63-candidate collection to check two distinct variants per region, all previous source objects by identity, real supported foundations and weather roofs, grounded raised tiers, accessible two-cell door apertures, functional interior navigation, typed provisional physical symbols and a normalized 2D D4 near-duplicate cutoff.
- `m2-variant02-completion-webgl2.test.mjs` uses real headless Chromium software WebGL2 and `m2-variant02-completion-preview.html` to demand **60 genuinely source-authentic screenshots** for the ten new designs × exterior/section × 667×375, 844×390, 932×430; records exact source SHA-256, IDs, no GL error/loss and projected camera fit. Prior 318 screenshots remain required. New total expected **378**.
- These tests are authored but the newest 60 **are NOT technically passed until an exact-head Actions run completes green and real screenshots are inspected**.

## Structural and user-facing integration gates

Source geometry is theoretical, not live world placement. Manual pack4:030 windows, pack4:058/059 furnishing and planned pack2:020 closures remain symbolic dependencies, awaiting actual producer variant AABB, orientation, bearing, collision, transparent panes/picking, schema-1 save persistence and world-runtime integration. Current Chromium renders show cube proxies only, **not final physical family meshes or mobile GPU performance**. No NPC, healing, education or gameplay mechanics. No creator-art or physical-iPhone controls approval.

Changes restricted to `src/building-pool/roadmap-4b/`, `tests/building-pool/roadmap-4b/`, `docs/building-pool/roadmap-4b/`. Legacy PR #123, seven sibling builders, five manual Block Packs, biome130 and five automations, shared runtime/CI, main/checkpoint, saves, v0.10 Gate A and locked v0.11 remain untouched.
