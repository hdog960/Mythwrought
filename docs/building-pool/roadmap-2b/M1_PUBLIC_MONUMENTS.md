# Builder 2B M1 — Six original public architectures, source-only

## Revision and ownership
Current work follows the source-exact 33-candidate baseline at PR #187 `51ba5be29c21f10b1a2157ea4af41c7ac86af055`, with exact-head GitHub Actions #43774659882 SUCCESS (735 standard Node, 34 Builder 2B native, 18 honest source-importing WebGL2 software-cube captures). `main` at baseline was `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`, checkpoint 009. Legacy source PR #124 remains read-only at `07c45d27bd36f4f3aa3197bba0e4f49ce2a58c68`. All 15 inherited temple :01 identities remain unchanged with their existing source-parity test.

This revision adds only Builder 2B-owned source, tests and documentation; no shared registry, pack, biome130, automation, other builder, engine, CI workflow, main, save or Pages change.

## New real coordinate-authored architecture (six)

| Identity | Architectural concept and topology | Distinct physical intent |
|---|---|---|
| `r2:temple:temperate:small:02` | Bellgarden Cloister & Sanctuary, 21×25; cross-lit open seven-by-five central garden, two physically end-capped side chapels, three-wide rear apse opening, rear altar | Two independent 2×2 supported tall belfries, covered side cloisters and actual symbolic raised dais stair approaches. Different from legacy sanctuary and all other candidates |
| `r2:temple:desert:medium:02` | Sunwell Hypostyle Court, 27×29; nine-wide unroofed prayer court, two longitudinal colonnades, separate rear sanctuary | Four dedicated shade towers, flat shaded side aisle, rear seven-wide altar terrace and processional triple port; no chapel/belfry cloning |
| `r2:market-square:mountain:small:01` | Switchback Stone Market, 25×25; four staggered, separated vendor booths, real mountain retaining screens, roofed north weighing exchange | Asymmetric stalls, separate stone gate and actual unroofed crossing |
| `r2:market-square:enchanted-forest:large:01` | Moonroot Ring Exchange, 37×35; EIGHT distinct physical kiosk canopies arranged around an open glade, raised framed ring arcade | Four load-bearing ring posts, physical roof beams and eight free buyer approaches instead of scaled or mirrored four-stall plaza |
| `r2:theater:desert:medium:01` | Solstage Open-Air Playhouse, 29×29; deliberately unroofed audience area, side shade galleries, raised 13×6 stage and two-door enclosed backstage | Free sky above audience, roofed backstage, accessible side promenades and explicitly symbolic stage stairs |
| `r2:theater:mountain:large:01` | Cliffecho Mountain Auditorium, 37×33; high enclosed hall, central clerestory, side galleries, raised 17×6 stage and opposed backstage entries | Tiered side roof, separate raised stage shelter, cliff-support posts; not a scale transform of the Desert stage |

All six contain explicit integer-coordinate foundation/floor/wall/roof/window/fixture/decor cells; three-high physical ports and source-authentic symbolic material dependencies. No production placement. Intended dais/stage stair slope, orientation and collision are **not** approved by a numeric voxel location.

## Truthful source counts
- Previous baseline: **33 authored of 420** = 15 legacy temples + 18 original candidates.
- New authored in this revision: **6** = 2 new temples, 2 new markets, 2 new theaters.
- Current cumulative source: **39/420**, **381 unauthored**, **24 new originals**, **15 source-exact inherited temples**.
- Category totals: markets **5/60**, tailors **3/60**, butchers **3/60**, jewelers **3/60**, bookshops **3/60**, temples **17/75**, theaters **5/45**.
- Creator-approved **0**, integrated **0**, placed **0**. The source ledger is `src/building-pool/roadmap-2b/m1-authoring-ledger.json`; historical `m1-candidates.json` remains the earlier 16/420 checkpoint.

## Evidence and blockers
- `m1-public-monuments.test.mjs`: source-authentic uniqueness across 39 candidates, exact occupied geometry, glazing registry, physical three-high door routes, sealed side-chapel paths, roof/canopy support, skylit court, raised stage and symbolic stair handoff.
- `m1-public-physical-preflight.test.mjs`: real read-only integrated manual five-pack source catalog and producer AABB variants; explicitly rejects interpreting symbolic Pack5 fixtures as resolved yaw/variant or live assets.
- `candidate-preview.mjs` imports all actual 39 candidate modules; `m1-webgl2-browser.test.mjs` now requests **30** exterior/cutaway Chromium software-WebGL2 cube-proxy captures at the three agreed landscape sizes, including all six new models. These are neither final physical-family rendering nor physical iPhone captures.
- Exact CI **pending at authoring time**; do not claim a successful current-head run before verification. Inspect the genuine PNG artifact for geometry/readability and report defects.
- Producer exact physical variant, yaw, multi-cell occupied footprint, true load bearing, window transparency, collision/selection, mounting and schema-1 save behavior are separate central handoff gates. Automated biome130 and manual Blocks 1–5 remain independently owned; no game/world placeability claim.
- No creator acceptance, Gate A promotion or v0.11 unlock. Keep PR draft, unmerged and undeployed.

## Next M1 focus
After exact-head CI, repair only actually observed 2B source/test/preview issues. Extend new regional buildings with unique architecture across missing biome-size slots and physical-family review. Prioritize more medium/large and snow-region civic/cultural buildings; do not count theoretical plan records or mirrored/reskinned clones as authored.