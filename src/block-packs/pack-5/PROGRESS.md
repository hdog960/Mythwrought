# MYTHWROUGHT — Pack 5 Interiors & Specialty Architecture progress ledger

## Authority / owner
- Main reverified at `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`; incorporation checkpoint **006**; [Issues #109](https://github.com/hdog960/Mythwrought/issues/109) and [#117](https://github.com/hdog960/Mythwrought/issues/117) read, with latest Pack 1–4 manifests and biome130 catalog.
- Exclusive branch `manual-pack-5-interiors-foundations-20261114`, [draft PR #119](https://github.com/hdog960/Mythwrought/pull/119).
- Only permitted changes: `src/block-packs/pack-5/` and `tests/block-packs/pack-5/`. All shared engine, registry, save, interaction, collision, UI/controller/minimap, worldgen, automation, CI and checkpoint files untouched.
- **NO persistent numeric IDs assigned.** Only `pack5:079` through `pack5:096` symbolic roster identifiers. Live IDs 0–8; 255 internal sentinel; 209–254 unassigned; future biome130 256–385 are not current-byte-compatible.
- v0.10 Gate A **OPEN**, v0.11 **LOCKED**. No merges, deployments, worldgen placement, buildings, or gameplay systems.

## Milestone 0 — source foundation COMPLETE
- 18 symbolic entries and isolated reproducible physical fixture.
- Shape metadata, quarter-turn rotation, multi-cell occupancy, partial collision and ray target, wall/floor/ceiling support, reversible isolated snapshots; **not production schema-1 save integration**.
- Dedicated browser smoke source, default root CI does **not** discover nested Pack 5 tests.

## Milestone 1 — source CANDIDATES complete; acceptance OPEN
- **3/18 CANDIDATE**, **15/18 NOT STARTED**, **0/18 INTEGRATED**, **0 accepted as production**.
- **079 Plaster & Stucco:** two original front-facing wall cladding variants with shallow physical attachment and backing support.
- **080 Fired Brick Masonry:** two distinct kiln-fired brick-course arrangements, now covering *all four lateral sides* with physical box relief and solid structural collision. Plain reverse/side faces in original screenshot review were an authored-source defect, corrected.
- **081 Ceramic Interior Floor Tiles:** two decorative shallow walkable tile variants with distinct 2×2 and 3×3 raised panels, not exterior paving.
- Tested 6 source variants over all four rotation states: **44/44 native Node 22.16.0 PASS** (16 foundation + 19 M1 + 9 acceptance cases), with exact GitHub blob parity. Key shape/material/rotation/collision/snapshot/mesh/visual-uniqueness assertions documented in `M1_ACCEPTANCE.md`.
- Preview-only budgets: 079 96/144 triangles; 080 504/636; 081 204/180. Max **636 triangles and 1272 vertices**, below the existing per-cell 768 triangles / 1536 vertices prototype limits. **Not measured production GPU performance**.
- Replaced misleading Canvas2D polygon sorting with authored-triangle software depth buffering. **Six genuine Chromium 144 Canvas2D screenshot captures** generated and visually inspected at 667×375, 844×390 and 932×430, rotations 0 and 1. Each of six panels has a unique sampled pixel fingerprint in every capture. Corrected screenshots show solid brick tops with visible side courses and readable floor tiles without clipping.
- **Not WebGL2 evidence.** Real WebGL2 context creation returns null here under regular and software configurations; served gallery previously blocked by `net::ERR_BLOCKED_BY_ADMINISTRATOR`. The original six-asset WebGL2 gallery remains committed for later testing. No physical iPhone art approval.
- Original and updated native Node suite: `node --test tests/block-packs/pack-5/*.test.mjs`. Actual Chromium fallback capture: `python tests/block-packs/pack-5/capture-canvas.py <output-directory>` (requires Chromium and Playwright). Root GitHub CI does not include nested Pack 5 tests; inspect its exact-head result separately.

## Remaining gates
1. Genuine source-served WebGL2 with three viewport screenshot review, and creator-approved visual art.
2. Independent central-engine expanded-ID/shape support, physical raycast/collision, variant/support save metadata, schema-1 backward compatibility, performance and physical-iPhone tests before incorporation.
3. Until those gates are verified, keep **M1 final acceptance OPEN** and **M2 Beds/Chairs/Bookshelves/Cabinets NOT STARTED**. No additional development session unless user explicitly says/clicks Continue Development.

**Full evidence/metrics:** `M1_ACCEPTANCE.md`. **Asset-level statuses:** `manifest.json`.
