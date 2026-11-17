# Mythwrought Builder 2B — M1 Echo, Crag & Frost Originals

**Source-candidate checkpoint, draft PR #187 only. Do not merge, deploy, world-place, register in gameplay, modify saves/biome130/manual packs/other builder lanes, or unlock v0.11.**

## Individually authored absolute-coordinate buildings

| New reserved identity | Name | Occupied source cells | Absent foundation columns | Source-backed high roof cells y8–11 | Geometry |
| --- | --- | ---: | ---: | ---: | --- |
| `r2:butcher:snow:small:02` | Snowgraft Twin-Ridge Meat Hall | 5,224 | 395 | 823 | Intentionally uneven left deep-freeze spine, shorter right curing gallery and offset remote salt-accounting bridge enclosing a fully unbuilt snow court |
| `r2:theater:mountain:large:02` | Echoquarry Grand Open-Ring Amphitheater | 9,818 | 842 | 2,058 | Enormous mountain hollow-ring theater, radically distinct western mask and eastern acoustic arms, long rear performance canopy and **36 actually occupied y2 raised-stage voxels**, with grounded and secured private backstage access |
| `r2:temple:mountain:small:02` | Cragwhorl Offset Votive Shrine | 4,510 | 414 | 688 | Small asymmetric cliffside ceremony hall, very long left private pilgrimage/spirit wing, much shorter east sanctum and high north votive altar spanning a physically void mountain court |
| `r2:bookshop:temperate:large:02` | Cedarwick Lantern Bridge Bibliotheque | 8,729 | 686 | 1,613 | Long central T-spine indexing nave, short lateral old-map wing, far-placed larger east reading room, separate high rear preservation crossbridge and two real empty courtyard regions |
| `r2:tailor:temperate:small:02` | Thistlecross Lean-To Tailory | 4,647 | 415 | 777 | Off-axis T weave spindle, left detached-looking dye shed, far-right fitting pavilion and connecting north cloth archive bridge, with five unequal supported gabled roof clusters |
| `r2:market-square:snow:small:02` | Frostmere Spiral Trading Cross | 5,453 | 393 | 961 | Compact spiral/courtyard winter market: east ice-fisher corridor, private western goods archive, back remote customs bridge and genuinely empty interior snow court |

All six blueprints are original fixed-cell structural programs in `src/building-pool/roadmap-2b/m1-echo-six.mjs`, not procedural resizes or re-skins of earlier source. They add **38,381 occupied voxel cells** with actual foundations and floors, true concave enclosing weather walls, three-high clear door openings with lintels, source-backed material/glazing symbols, separate raised roof blocks at y8, y9, y10, y11, and no high roof over foundationless voids.

Preflight verified every public and private named floor destination can be reached from its entrance by four-neighbor grounded cell motion, while private destinations are inaccessible when all authored internal door cells close. The mountain performance stage contains 36 real y2 source cells, but its actual playable vertical stairs or rotated non-block actor collision are explicitly unresolved pending producer ABI integration.

## Evidence and acceptance

The candidate ledger now contains **144 / 420 source-authored objects** = **15 exact inherited temples + 129 independently authored originals**, with **276 unauthored**. Creator-accepted, gameplay-integrated, and in-world placed each remain **zero**.

Nine new focused native cases in `tests/building-pool/roadmap-2b/m1-echo-six.test.mjs` cover exact reserved slots, full **144-way eight-way D4 source architectural uniqueness**, 144-source geometry identity preservation including inherited Ironridge's **4,355** private-wall voxels, groundless open courtyards and physical floors/weather walls, grounded three-cell high real door openings and real windows, accessible and sealable private rooms, independent bearing-supported y8–11 roof voxels, physically raised 36-cell stage with crew aisle, strict normalized source-occupied 3D eight-way Jaccard IoU **< 0.85** among same category/size peers, real manual Pack1–5 family candidate symbolic materials, exact tested Git source blob and immutable previous 138 candidate IDs.

Chromium source-driven software-WebGL2 exterior/cutaway gallery expands **228→240** PNGs, including **12 new authentic input-model captures** at phone-landscape **667×375, 844×390 and 932×430**, not static mockups. The gallery renders full-cube software proxy geometry, not actual Pack1–5 rotated producer family meshes: screenshot similarity or CI screenshot success cannot validate final premium roof art, full collision/AABB/yaw/occupied offsets, translucency, weather, save schema or on-device gameplay.

Do not claim source acceptance until exact-head GitHub Actions reports successful repository Node and CI contracts, all 24 dedicated Builder 2B native files and **240 source-specific Chromium exterior/cutaway** PNG witnesses, landscape smoke pass, verified unique/nonblank correct-sized PNGs and human comparison of the six new exterior/cutaway pairs. Shared full-game WebGL2 may appropriately skip on draft isolated lane. After accepted, retain draft unmerged status and 0 creator/gameplay approvals.

## Hard blockers remaining

Original symbolic manual Pack1–5 family references are candidates, not confirmed authored rotated variants or physical assets. Full producer-backed variant IDs, occupied offsets, bounding boxes, yaw-specific multi-cell collision and support, actual hinged doors, staged vertical access, premium roof shape/materials, translucent glazing/alpha, save/load parity, game runtime world placement and real iPhone landscape performance still require later coordinated approvals. **No v0.11 unlock.**

Creator-assigned project boundaries: only `src|tests|docs/building-pool/roadmap-2b/`. Older 138 authored source modules and fingerprints untouched, including protected prior Ironridge. Existing newer Creative integrations on main are not part of this Builder 2B lane.

## PR base synchronization / fail-closed CI selection (2026-11-17)

The initial isolated-source commit passed the repository-wide Node/contract gate but its PR Actions run #44168922436 chose **full** WebGL2 verification: the PR event still carried an older main-base SHA after separately approved Creative/interaction main commits. `scripts/ci/select-scope.mjs` correctly failed closed when a merged PR checkout diff covered shared paths. This is **not an independently demonstrated Builder 2B source regression**, and the skipped dedicated 2B native / 240-view capture gate cannot be counted as passed.

The PR's existing base branch was refreshed to the **same `main` branch** using only GitHub PR metadata, not a merge, rebase, source change or production deployment. At the time of this checkpoint, PR base and main both resolved to `104e57ff678a0c58593d1e3c85c13c6c112da992`. The source archive and all earlier 138 authored source files remain unchanged. This Builder 2B-owned documentation update deliberately triggers new exact-HEAD PR verification. Claim success only after inspecting that new run's executed dedicated 2B Node tests, 240 real source-specific Chromium exterior/cutaway artifacts, valid PNGs and physical scene review. If the selector again fails closed because main changes, do not weaken CI or silently report a skipped gate as success.
