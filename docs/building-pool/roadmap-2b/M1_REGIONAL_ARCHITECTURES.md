# Builder 2B M1 — Regional architectural expansion (12 additional coordinate-authored designs)

**Development state:** Draft PR #187 ONLY, with no merge, game placement, runtime registration, save edit or Pages deployment. Exact-head CI must be independently verified after final changes.

## Authorized baseline and preservation

- This session began from isolated Builder 2B candidate HEAD `e12fd24e63a5e878d3e91abf89ea1ef2aab65500` and successful exact-head CI #43772040924 (735 standard, 22 focused 2B tests, source-bound WebGL2 diagnostics).
- Current `main` at kickoff: `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`. Infrastructure PR #178 merged with authorization; manual five-pack source bridge 96 family symbols / 106 numeric variants. Last inspected incorporation ledger: checkpoint 009.
- Original read-only draft PR #124 HEAD `07c45d27bd36f4f3aa3197bba0e4f49ce2a58c68`. All 15 temples maintain byte-exact native source parity, without mutation.
- Categories exclusively owned by 2B. No 2A shops/banks, other six builder families, shared runtime, biome130 authoring or five automation PR paths modified.

## Newly authored coordinate-programs (not recolors, renames, mirrored clones or metadata-only slots)

| Category | Region & size | Original authored concept | Physical layout and distinct massing |
|---|---|---|---|
| Market square | Desert / Medium | Suntrail Windbreak Caravan Exchange | Four supported roofed stalls, two wind-sheltered desert perimeter baffles, south gateway and central exposed public processional route |
| Market square | Snow / Large | Frostlane Six-Stall Winter Exchange | SIX separately roofed trading wings, three distinct stall rows, reinforced winter wind screens, independent communal north pavilion |
| Tailor | Enchanted Forest / Medium | Moonthread Fitting Atelier | Public garment gallery, west cutting studio, enclosed east fitting room, paired grown-root pylons and lateral livingwood clerestory |
| Tailor | Mountain / Large | Highloom Terrace Tailors | Enlarged display and fitting wing, protected rear cutting atelier, separate rear annex, cliffside buttresses and raised stone roof terrace |
| Butcher | Snow / Medium | Frostcellar Covered Butchery | Two independently accessible insulated cold/prep wings, high snow ridge, service counters and physically tall extraction flue |
| Butcher | Desert / Large | Sunscarp Spice Butcher Hall | Separate cooler/prep zones and rear supply annex, shade crenels, REAL open roof atrium instead of uniform flat cap |
| Jeweler | Desert / Medium | Sandglass Gem Exchange | Public gem exchange, controlled single workshop entry, interior-only vault doorway, desert rooftop light opening and shade parapets |
| Jeweler | Mountain / Large | Cairncrest Lapidary & Stronghold | Gallery, protected lapidary chamber, transfer-door-only vault, rear annex, high stone terrace and reinforced cliff piers |
| Bookshop | Mountain / Medium | Stoneleaf Terrace Scriptorium | Public book gallery, separately screened reading vault, west archival stock and triple-band stone ridge |
| Bookshop | Enchanted Forest / Large | Glimmerbough Book Conservatory | Larger browsing hall, private reading bower, secured rear book storage annex, high livingwood clerestory and rooted corner supports |
| Theater | Enchanted Forest / Medium | Whisperroot Living Glade Theater | OPEN-AIR 9×9 roof oculus above audience, raised 13×6 performance platform, side promenades, independently gated backstage and two livingwood towers |
| Theater | Snow / Large | Whiteharbor Snow-Shed Playhouse | Enclosed large winter auditorium, raised 17×6 stage, paired physical stair *candidate* cells and lower/upper landing intentions, double-snow roof ridge, two backstage accesses |

Every new candidate expands to a fully specified deterministic integer voxel map: foundations at y0, supported walking floor y1, actual exterior and interior walls, roof pieces, independently occupied functional fixtures, explicitly empty three-high entry/room ports, all real window-kind voxels with exactly matching position/material metadata, per-source category/biome/size and independent dependency ledger. The roof openings above desert public trade space and enchanted performance audience are **intentional**. Stage stair slope and occupancy ABI remain *unverified*.

## Current truthful counts

| Type | Authored | Quota | Still unauthored |
|---|---:|---:|---:|
| Markets | 3 | 60 | 57 |
| Tailors | 3 | 60 | 57 |
| Butchers | 3 | 60 | 57 |
| Jewelers | 3 | 60 | 57 |
| Bookshops | 3 | 60 | 57 |
| Temples | 15 | 75 | 60 |
| Theaters | 3 | 45 | 42 |
| **Total** | **33** | **420** | **387** |

Includes **15 inherited** temple geometries, **6** earlier original Temperate/Small models, **12 new regional Medium/Large** designs. **Creator accepted: 0. In-game integrated: 0. World placed: 0.**

| Biome | Small | Medium | Large | Total authored |
|---|---:|---:|---:|---:|
| Temperate | 7 | 1 | 1 | 9 |
| Desert | 1 | 3 | 2 | 6 |
| Snow | 1 | 2 | 3 | 6 |
| Enchanted Forest | 1 | 3 | 2 | 6 |
| Mountain | 1 | 2 | 3 | 6 |
| **Total** | **11** | **11** | **11** | **33** |

The `m1-authoring-ledger.json` cumulative record is authoritative. Earlier 16/420 checkpoint file `m1-candidates.json` is retained for provenance; planned slot reservations still do not count as authored.

## Verification scope

- `tests/building-pool/roadmap-2b/m1-regional-exemplars.test.mjs`: verify all 12 fully occupied native source geometries, exact 33 unique identities and 33 non-recolor/non-mirror fingerprints; accessible independent three-high routes, sealable workrooms/strongrooms, physical kiosk roof/post supports, stage rise/landings, actual window cells, and source-head hashes.
- `tests/building-pool/roadmap-2b/m1-physical-preflight.test.mjs`: verify source-authentic manual-family AABBs/selection geometry and catalog families without pretending runtime registration; inspect Pack 5 unresolved orientation and authored variant using the actual read-only mixed-blueprint adapter.
- `tests/building-pool/roadmap-2b/m1-webgl2-browser.test.mjs`: genuine Chromium software/WebGL2 cube-proxy source-preview with **18** exterior/cutaway PNGs at 667×375, 844×390 and 932×430. It imports the *actual candidate modules*, checks runtime DOM blueprint identities and valid PNG dimensions. It is **not physical-family rendering, transparency acceptance, a production game screenshot, or an actual iPhone test**.
- Exact test outcomes, screenshot artifacts and appearance remain **PENDING exact-head GitHub Actions success and inspection**; never infer pass merely because files exist.

## ABI and integration blockers

- Integrated manual family symbols are real source entries, but **architectural per-cell physical selected variant, yaw, multi-cell footprint, support bearing and transparent glazing interactions remain unresolved**; generic empty voxels do NOT stand for approved physical-profile movement.
- The mixed Pack 5 inspector intentionally flags fixtures lacking explicit orientation and authored variant. Do not fabricate defaults for shop counters or decorative products.
- Stage's `pack1:008` stair pieces have planned lower and upper landings, but the category-level label `stage` is not a four-way world orientation. A future specific-world integration must select the actual physical slope/yaw and run collision/stair tests.
- Interior logic and weather envelope need direct premium physical-family WebGL2 and creator approval; the software proxy only substantiates occupied candidate cell locations.
- Creator acceptance, physical-iPhone controls, production save schema-1 integration and any eventual placement are separate future central gates. Gate A remains open; v0.11 locked.

## Next M1 focus

Complete the remaining category × biome × size representative combinations with **genuinely new spatial programs**, not just stretching these floorplans or changing materials. Inspect exact-browser cutaways and repair only observed 2B-owned defects; then advance the full theoretical counts toward M2 while preserving every original temple identity and the draft/unmerged/undeployed state.
