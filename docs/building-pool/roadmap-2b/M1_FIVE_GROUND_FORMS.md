# Mythwrought Builder 2B — M1 Source-Authored L, U, T, Courtyard Ring and Switchback

**Isolated draft PR #187. Candidate source only; zero approval, merge, runtime registration, world placement, deployment or save changes.**

## Five original physically distinct architectural forms

| Absolute reserved identity | Architectural intent | Occupied authored voxels | Missing ground columns | Bearing-supported roof solids y8–11 |
| --- | --- | ---: | ---: | ---: |
| `r2:tailor:mountain:large:02` — Hawkspine L-Cliff Clothworks | True long L: unusually wide east–west cloth market front, dramatically long separate southwest loom/storeroom stem, short right fitting-room branch; per-wing entirely separate rock-spire and gable profiles | 5,407 | 963 | 930 |
| `r2:butcher:enchanted-forest:small:02` — Greenthorn U-Court Coldroot Butchery | True U enclosing a **completely absent central courtyard foundation**, left public coldstore branch, separated opposite hygienic cutting wing and distant rear cross-bridge | 3,861 | 400 | 566 |
| `r2:jeweler:mountain:large:02` — Vespercrag Hollow-Square Gem Treasury | True O-shaped ring: a very broad north public gemstone frontage, two far-separated protected east and west halls, an independently roofed south valuation cross-gallery surrounding a deep unbuilt open-air center | 8,068 | 728 | 1,380 |
| `r2:tailor:enchanted-forest:small:02` — Starfern T-Crossloom Tailory | True T crossbar of east/west separate private trading and fitting wings with extremely narrow, long south weaving stem and a small additional asymmetric side dye attachment | 3,598 | 504 | 431 |
| `r2:butcher:mountain:medium:02` — Switchstone Canyon Larder Switchback | Switchback: wide horizontal meat market gallery turns into one long western vertical butchery/cold-cellar stem, bends abruptly into a right rear smokehouse while keeping a separate right-front food kiosk | 5,377 | 522 | 906 |

These five source programs are independently coordinate-defined with actual physical architectural interiors, foundation positions, perpendicular walls, three-high air door openings, Pack-family symbolic fixture coordinates, and three separate supported raised levels above the core roof, up to **y11**. A genuinely empty U courtyard and the center of the hollow-square ring have **no occupied foundation, floor or hidden roof**. All source-cell roof mass physically bears on the voxel immediately below and has occupied ground beneath.

Each authored route target is reached by **four-neighbor movement on actual unobstructed grounded floor** from a weather entrance, then becomes unreachable when its internal physical door cells close. No off-grid invisible doors, merely inferred target rooms, procedural rotation, or unbacked floating roof cells. The structural diversity is explicit: L, hollow U, hollow ring, T, and switchback, not a five-way shared roof-cube archetype.

## Safety and verification gates

The new source modules are `src/building-pool/roadmap-2b/m1-regional-forms.mjs` and `m1-crossbar-switchback.mjs`. Earlier **121** source-authored blueprint modules and their original coordinate fingerprints, including the historic **Ironridge 4,355-voxel private-wall form**, remain unchanged. The update is fully restricted to Builder 2B-owned `src|tests|docs/building-pool/roadmap-2b/`.

`tests/building-pool/roadmap-2b/m1-architectural-forms.test.mjs` adds eight original native tests: full 126-way D4 uniqueness, genuine L/U/ring/T/offset fingerprint and hollow courtyard preservation, all grounded door/window cells, real publicly walkable and privately lockable rooms, all y8–11 physically bearing ridge solids, strict normalized eight-way same-category/size whole-occupied-source Jaccard IoU **<0.85**, symbol references to real manual Pack1–5 candidate producer families, and exact Git source blob parity/inventory governance.

The source-driven headless Chromium SwiftShader software WebGL2 browser test now calls for **204 actual exterior/cutaway images** (10 new) across `667×375`, `844×390`, and `932×430`. Screenshots are honest real-source full-cube proxies; they are **not** the real rotated, non-unit-AABB Pack1–5 producer assets, final artwork, in-game physical collision, weather or physical-iPhone tests.

The authoritative isolated candidate ledger is **126/420** = 15 exact-source inherited temples + 111 separate original geometry blueprints; **294 unauthored**, and **0 creator-approved, 0 live-registered, 0 placed**.

Remaining production blockers: full Pack1–5 rotated producer-variant occupied-offset and AABB truth, multi-cell fixtures/glazing and lighting, physical game collision and procedural placement, schema-1 save compatibility, premium visual signoff, and real device test. No source-only acceptance implies any of these are complete.

**Do not claim this tranche passed until exact-head Actions genuinely passes** the root Node suite, all 12 CI contracts, complete dedicated Builder 2B native suite with the eight new tests, 204 genuine Chromium WebGL2 source exterior/cutaway screenshots with correct source IDs and dimensions, landscape browser smoke, visual screenshot evidence inspection and strict path ownership. Keep PR draft.
