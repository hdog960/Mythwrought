# Builder 2B M1 — Seven stepped regional halls (candidate-only, isolated)

Checkpoint: 2026-11-16. **Draft PR #187, no merge, Pages deployment, runtime registry, save migration, world placement, sibling Builder edits, manual Pack edits, automation changes or v0.11 unlock.**

Seven original author-owned absolute-voxel architectural blueprints were added to the isolated Builder 2B lane. Distinct original outline, door partition coordinates, real flood-fillable private rooms, and stacked step/ridge volumes were authored individually, not resized/recolored prior buildings.

| Reserved identity | Architectural distinction | Absolute occupied voxels | Physically absent ground columns | Supported roof voxels y8–y11 |
|---|---|---:|---:|---:|
| `r2:theater:mountain:medium:02` — Talusreach Nine-Rock Performance Hall | 48 actual raised stage cells; open side-aisles, northwest prop warehouse, off-axis rock-mask workshop and east sound gallery | 4,958 | 429 | 626 |
| `r2:theater:snow:large:02` — Winterspire Six-Wing Ice Opera | 70 actual raised stage cells; two performer side aisles; broad unequal costume/orchestra wings and two separately locked far-rear auxiliary stores | 8,480 | 435 | 1,339 |
| `r2:temple:desert:small:02` — Sundrift Five-Vigil Star Sanctuary | Extremely slim central pilgrimage hall, far-left separate votive store, east guarded relic, west incense and enclosed north equinox altar; physically high sandstone sun needle | 3,190 | 340 | 317 |
| `r2:bookshop:enchanted-forest:large:02` — Moonroot Six-Bough Living Archive | Wide illuminated book spine, unusually long western herbarium, eastern reader conservatory, far-west rare-book reserve and far-east artist study | 7,983 | 480 | 1,063 |
| `r2:tailor:snow:medium:02` — Hailweft Four-Loft Snow Tailory | Deep west fitting hall, different-length east dye house, rear loom gallery and far-west climate-controlled fabric vault | 4,746 | 385 | 566 |
| `r2:butcher:enchanted-forest:large:02` — Bramblewake Root-Cold Artisan Butchery | Very deep left root-chilled coldstores, short eastern sanitary butcher room, northern controlled smoke room, separately secured dry reserve and inspected kitchen | 7,578 | 512 | 1,065 |
| `r2:jeweler:desert:large:02` — Qamar-Seam Faceted Star Treasury | Long public sales spine, large southwest lapidary, east gold bank vault, north appraisal, separate far-left ore store, and right stargazing laboratory | 7,157 | 406 | 942 |

## True source geometry and tests

- Fixed ground/foundation cells, actual concave perimeter weather walls and precise air voids, true three-cell-high circulation ports, real supported roof surfaces and several high levels up to y11. The mountain and snow theaters have 48 and 70 raised stage cells, respectively; these are not metaphorical stage labels.
- Each room destination must be reachable by physical four-neighbor path on unobstructed y1 floor while its private access is closed to all such paths if actual door cells are shut. Preflight caught and corrected furniture-occupied route targets before final authoring.
- Exact blueprint IDs must be reserved in the original 420-slot scheme and unique among earlier 108. All 115 occupied-cell D4 fingerprints are distinct, and every new design must satisfy strict eight-way normalized same-category/size full 3D occupied-cell intersection/union **<0.85**.
- Genuine producer Pack1–5 family symbols are validated against manual Pack candidate inventories and family definitions. Actual variant dimensions, yaw, AABB, collision/occupancy reservations, slope/shapes, glass transparency, lighting, physical stage steps and schema-1 save compatibility remain **unresolved**, never silently treated as production-ready or approved.
- Dedicated verification extension: `tests/building-pool/roadmap-2b/m1-terraces-guilds.test.mjs` (nine new source-native tests); `tests/building-pool/roadmap-2b/m1-webgl2-browser.test.mjs` gains 14 exact source-specific exterior/cutaway Chromium WebGL2 cube-proxy screenshots at 667×375, 844×390 and 932×430 for **182 total captures**. The proxy is not Pack producer geometry, final art or physical-iPhone acceptance.

## Ledger, safety and prior-source preservation

The candidate inventory is now **115/420 authored**, consisting of **15 source-exact inherited temples + 100 independently original coordinate-authored blueprints**. **305 are unauthored**; **0 approved, 0 live-registered, 0 world-placed**. All earlier 108 blueprint source modules and their fingerprints remain unchanged; the isolated test snapshots only update authoritative cumulative ledger totals. Ironridge's source-authored 4,355-voxel wall state remains protected.

Required exact-head acceptance: repository Node tests, 12 CI contracts, dedicated Builder 2B native tests including this 9-test extension, 182 genuine Chromium exterior/cutaway PNGs with correct source IDs/viewport dimensions, visual inspection, no out-of-lane modified paths. Do not claim these gates passed until Actions has actually produced the evidence. Leave PR as draft; v0.10 Gate A and v0.11 lock remain unchanged.
