# Builder 2B M1 — Trade/Culture source-exact candidate review (session 3)

## Starting evidence
Main at kickoff: `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db` (infrastructure PR #178 merged, CI successful), manual five-pack integrated, checkpoint 009.
Prior Builder 2B draft PR #187 at `6153e7c462dc6483ca8e7f0cb6143b46b1925e61` passed exact-head native Node + production Chromium CI #43768376255.
Legacy PR #124 remains draft at `07c45d27bd36f4f3aa3197bba0e4f49ce2a58c68`; its 15 temple identities/coordinates must retain exact source parity.

## Six original 2B-only authored M1 candidates, not a 420-slot filler

| Blueprint ID | New design and physical circulation | Core structural distinction |
|---|---|---|
| r2:market-square:temperate:small:01 | Four separately roofed stalls, three-wide open-air walk, north covered exchange and free south gate | Public square topology, independent pavilion support and 16 physical glazing/frame cells; inherited from the previous M1 cycle, not new this cycle |
| r2:tailor:temperate:small:01 | Front garment retail, east end-capped private fitting suite with one actual physical door, rear cutting workshop | Longitudinal pitched ridge, separate room screens and cross-partition; fitting can be sealed without alternate path |
| r2:butcher:temperate:small:01 | Service counters front, west physical cold room, east prep tables, paired rear entrances and an internal transfer door | Two rear independently bounded functions plus raised roof hood, rather than relabeled shelves |
| r2:jeweler:temperate:small:01 | Controlled front display, one-access workshop, side protected vault with its own single screen doorway | Side vault roof-height variation, physical front/rear partition and sealable strongroom |
| r2:bookshop:temperate:small:01 | Multiple bookshelf banks with free browsing aisle, sealed reading annex, rear stockroom | Separate clerestory and one-door reading enclosure with physical end caps |
| r2:theater:temperate:small:01 | Audience seating banks and center aisle, raised 13×6 stage, west/east side promenades, two-door enclosed backstage | Real raised stage and stage-cover roof over a lower house. Stage stairs remain **symbolic** and not physically certified |

All five new category buildings are fully deterministic integer coordinate constructs with roofs, foundations, occupied floors, physical walls, windows and doors, category fixtures and conceptual three-high walk paths. They are **not** procedural plans, marketplace placement or a live-game feature. M0 templates are not duplicated.

## Counts
Exactly **21/420 candidate blueprint source modules**: 15 original PR #124 temples (no mutation), one earlier M1 market square and **five** newly committed trade/culture exemplars. **399** still unauthored; **0** creator-approved; **0** production-integrated/placed. Planned category quotas remain market-square 60, tailor 60, butcher 60, jeweler 60, bookshop 60, temple 75, theater 45.

The current authoritative M1 ledger is `src/building-pool/roadmap-2b/m1-authoring-ledger.json`. `m1-candidates.json` preserves the earlier 16/420 source checkpoint and is not the current cumulative ledger.

## Direct source-browser review
`tests/building-pool/roadmap-2b/candidate-preview.html` imports the **actual** committed 2B source files, expanding authored voxels through WebGL2 with independent depth-tested full-cube proxy cells. It offers exterior and cutaway by query parameters `?id=r2:tailor:temperate:small:01&view=cutaway`, with status declaring the exact blueprint ID, viewport and voxel count.

`tests/building-pool/roadmap-2b/m1-webgl2-browser.test.mjs` is a new nested native Node/Chromium harness, sampling market, tailor and theater exterior/cutaway at exactly 667×375, 844×390 and 932×430 respectively. Artifacts, if this exact-head check passes, are stored under `artifacts/roadmap-2b/`. The browser uses **software WebGL2 cube proxies**, not actual block-family meshes, transparent window glazing, production collisions, live game, or physical iPhone. Do not certify screenshots until the latest run completes and images are verified.

## Integration handoff blockers
- Per-cell family symbols have source-authored intended roles, but production variant/yaw, physical occupied footprint, true supports, glass transparency, mounting, collision/selection and save schema-1 ABI remain explicit integrator checks.
- Stage's conceptual `pack1:008` stair candidates require geometry and facing proof before any claimed raised-platform walkability.
- Real final-family/WebGL2 premium-visual and physical iPhone acceptance remain open. Source cube-proxy evidence is engineering-only.
- No shared source, original PR, other seven builders, automated biome130, pack assets, central CI, engine, saves, worldgen or deployment modified. PR remains draft and unmerged. Gate A open; v0.11 locked.
