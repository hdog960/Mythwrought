# Roadmap A — real Pack5 79-building physical integration HOLD matrix

This is **isolated source-only development** on branch `roadmap-a-pack5-physical-release-blocker-matrix-20261121`, child of test-only fix commit `145ab46e74f812bf0889805bc53e4915538781d9` (which descends from protected original OPEN DRAFT PR #406 HEAD `1d71f5e37891280a21c777e5189f0762014ed8a9`). No new PR, integration, merge, deployment or automatically triggered CI while runners are congested.

## What this materially adds

1. A **pure deterministic all79 release-blocker matrix**, populated only by existing original Wave01–07 source geometry/A5 exact SHA-256 and the authenticated real Pack5 source-bearing census. For all 79 structures, it emits a distinct technical ticket with exact source hashes, source material risk counters, four original producer mounting offsets, supporting original-source-only exposure counts, and explicit engineering decisions required.
2. A separate **authentic physical producer adapter** that reads actual `PACK5_BUILDER_CATALOG`, `getPack5Surface` source details, and `resolveManualFivePackAsset`. It samples both existing authored variants for each of `pack5:079`, `pack5:080`, `pack5:081` and all four actual orientations, validating physical visible/collision box counts and original support offsets. Examples are **NEVER assigned to buildings**. These are unselected options and not new materials or invented catalog IDs.
3. **Fail-closed safety:** `requireRoadmapA79PhysicalWorldPlacement` cannot authorize any world change. Invalid source fingerprints, changed A5 counts, selected physical variants, disappeared backing cells, invalid variants or mismatched producer mounting offsets are rejected rather than quietly accepted.
4. Transparent engineering priority, by **number of cells missing mandatory authored Pack5 variant** then plaster whole-wall cells then masonry-as-roof cells; priority does not claim aesthetic preference, structural failure, or acceptance. Every ticket preserves provenance; no material substitutions, roof repairs, physical block construction or runtime timing estimates are made.

### Known exact source baseline

- 79 original design source candidates; 207/420 accepted as **source-only** (213 still unwritten).
- 1,115,590 original voxel source cells.
- 257,449 Pack5 source cells lack a mandatory authored variant.
- 105,584 wall-mounted Plaster & Stucco `pack5:079` cells are used as whole source walls; original source-neighbor missing mounts at four **hypothetical** yaws are North 61,324, East 55,478, South 61,398, West 55,214. No yaw or variant selected.
- 117,048 full-cube fired-brick `pack5:080` cells are authored as roofs; NOT a pitched roof proof.
- 34,751 thin `pack5:081` ceramic tile cells are authored as floors; NOT proof of a physically supported floor assembly.
- 138,698 source roof bases have no immediate source wall beneath. **This does not prove any future structural roof failure**; a correctly engineered span could still be safe.
- Every source blueprint has more than 4,096 source cells, but the Manual Five Pack dry-run cap is 4,096 **instances**, and actual placement/pack batching remains unverified.

### Preserved source and release boundaries

The matrix is a pure diagnostic and cannot call world/game API; it never modifies any of the 79 original source designs or the protected A5 207 records, historic 128 commerce, 345 industry, 315 government, five automations or other builder branches. `main` remains protected at `7016e14cd6289f45eaf7fc6a79a362b47996df65`, v0.11 locked, and schema-1/iPhone Home Screen PWA saves preserved.

**Creator-art acceptance, actual full-building Pack5 material/shape rendering, physical support and load-bearing engineering, compound 4096-instance planning, live collision, actual GPU uploads/FPS, physical iPhone performance, settlement placement and production registration all remain on HOLD.**

### Testing under global reduce-redundant-testing directive

Original protected PR #406 exact-head CI #44972406131 **failed 193/194 focused** because one test referenced `row.sourceWholeWallPlasterCells` instead of `yaw.sourceWholeWallPlasterCells`; repo root **920/920 passed**. The previously committed isolated test-only fix `145ab46e74f812bf0889805bc53e4915538781d9` changes one line; its CI has not yet run. Previous PR #401 WebGL2/PNG evidence is valid for the unchanged renderer and source but **does not count as new-head CI acceptance**.

New focused native tests: `tests/building-pool/roadmap-2a/roadmap-a-physical-integration-holds.test.mjs`. They verify exact original source totals, 79/207/213 count, source SHA, all 4 producer mounting angles, real two-variant original Pack5 AABBs and support offsets, all tickets' HOLD flags, and independent negative tests for source tampering/variant auto-selection/placement attempts. The report is intended to be emitted as `artifacts/roadmap-a-physical-holds/ROADMAP_A_79_IMMUTABLE_SOURCE_REAL_PACK_INTEGRATION_HOLDS.json` when focused native testing runs.

**No Chromium screenshots are needed at this source-only design stage**: 1,278 exact unchanged source/real Pack5 original gallery PNGs were already authenticated in previous exact-revision evidence, including 36 individual real physical asset renders (not built commerce buildings). Exact-head focused CI for this child commit, final required branch protections and full physical iPhone acceptance remain outstanding.

The next safe work is engineering owner review of explicit variant assignment rules, mounting/support construction and correct roofing/floor assemblies *before* any real placement or structure registration. No automated variant guesses.
