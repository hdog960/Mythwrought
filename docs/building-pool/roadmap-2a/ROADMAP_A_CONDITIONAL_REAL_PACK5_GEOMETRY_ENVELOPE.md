# Roadmap A — Conditional real-Pack5 physical box/triangle envelope (unselected source assets)

**Source-only engineering. Not an installed building or a runtime GPU estimate.** This is new isolated development within `roadmap-a-pack5-physical-release-blocker-matrix-20261121` and its protected ancestor. It does not alter any of the 79 original Wave01–07 source plans, the 207 A5 source-only ledger, original 128 commerce buildings, industrial 345, government 315, other developers, five automations, schema1 saves, locked v0.11 or Home Screen PWA.

## What we actually compute

Read the original authenticated 79-design four-yaw source census and real unmodified `getPack5Surface`, `surfaceBoxMesh`, `resolveManualFivePackAsset` and `PACK5_BUILDER_CATALOG`. Require all seven original source-file SHA256 fingerprints, original A5 geometry SHA256 per building, all material count totals and no choices or producer/world registrations. **Never choose a variant or orientation.**

For three original Pack5 **material/role mismatches**, evaluate both genuine authored *unselected* physical variants:

| Symbol & source role | Original source cells | Original variant art-box counts | Original mesh triangles per unit |
|---|---:|---:|---:|
| `pack5:079` wall-mounted plaster incorrectly used as full walls | 105,584 | 8 / 12 | 96 / 144 |
| `pack5:080` full brick masonry used as a source 'roof' | 117,048 | 42 / 53 | 504 / 636 |
| `pack5:081` thin ceramic tile used as a source 'floor' | 34,751 | 17 / 15 | 204 / 180 |

Each source-authored physical art box has **12 original producer triangles and 24 original mesh vertices**. The adapter **calls the real physical box-mesh producer** and requires that exact identity for both original variants, plus four real support-offset resolutions and the original source support policy. It does not substitute proxy geometry or infer material colors.

The model asks one strictly conditional question: **what range of unmerged visible AABBs and source triangles would result *if and only if* each of those original source cells were individually converted into one instance of its corresponding real Pack5 physical asset?** This assumption is not an approved construction strategy, and the 4,096 limit refers to *placement instances*, not original voxel source cells. The real building could use walls, roof assemblies, batching or optimized meshes very differently.

| Conditional one-original-asset-per-source-cell metric | Minimum | Maximum |
|---|---:|---:|
| Modeled source material cells | 257,383 | 257,383 |
| Visible original source art AABBs | 6,281,953 | 8,061,319 |
| Original source-box mesh triangles | 75,383,436 | 96,735,828 |
| Original mesh vertices prior to any engine optimization | 150,766,872 | 193,471,656 |

Other **66 Pack5 source cells** also lack an explicit authored variant but are **excluded**, not guessed into one of these three material roles. The original total without explicit variants remains 257,449. The 79-building and per-role report explicitly includes those 66 other items as unresolved; it does not make visual shape or performance claims about them.

**These numbers are scenario-specific mathematical products of actual source-authored physical box counts. They are NOT measured triangles uploaded by Mythwrought, GPU buffer use, frame time, expected iPhone FPS, physical world collision, support certification or final creator art.** Reusing them as real runtime performance measurements would be a validation error.

## Engineering value

- Makes the naive original full-brick-roof complexity exposure explicit before someone incorrectly attempts a one-cube-to-many-AABB bulk placement.
- Provides deterministic, independently attributable source candidate risk order using only **hypothetical maximum original producer triangles**, without picking creator-approved material variants, physical orientations or architecture.
- Preserves exact A5/wave source fingerprint lineage and fails closed if any source role count, source module hash, actual producer variant, original material geometry, support rotation or approval flag changes.
- The previously verified four-yaw **plaster backing gaps** (61,324 / 55,478 / 61,398 / 55,214) still describe neighboring *source* cells only. They are not a future real-world bearing failure.
- Future engineering must design a true structural facade, roof/floor assemblies and safe instance/mesh batching with explicit physical variants and creator-art review rather than presuming original source cube cells should be rendered as isolated Pack5 art objects.

## Tests and release status

New files:
- `src/building-pool/roadmap-2a/roadmap-a-physical-complexity-envelope-core.mjs` — pure fail-closed source/producer conditional geometry engine.
- `src/building-pool/roadmap-2a/roadmap-a-physical-complexity-envelope.mjs` — adapter sampling **actual original physical producer** AABB/triangle/vertex arrays across both variants and four rotations.
- `tests/building-pool/roadmap-2a/roadmap-a-physical-complexity-envelope.test.mjs` — four focused native tests, exact aggregate expected values, original real mesh geometry, source tampering/hidden variant/producer mismatch, source-only evidence output.
- This document.

During development the new **byte-identical pure core module** passed **2/2 local native Node tests** against the independently authenticated real PR406 79-design census JSON (SHA256 `dd88b330cd6ea379ae077ccfbacbf17cd46af510bda573b292e8c1022fefb79c`), original PR390 physical producer artifact (SHA256 `d736e32fcc7d8848bb8fadd349f908ee3e7331b8213047e970e61c01196525d8`) and original PR396 genuine Chromium real-producer mesh report (SHA256 `ba0bceba60c23d91782818577563a18f0a9ffb3a2488447fc05a174de58f0acb`). These are **local evidence-level tests**, not execution of the new four repository-native tests or an exact-head GitHub Actions run. The old PR406 failure has a protected separate one-line fix parent. There are **no new CI, Chromium or full-suite runs** at this stage.

When appropriate, run only targeted new producer-envelope and integration-hold native tests and the existing fixed yaw census test, preserving required exact-head final validation and browser/iPhone release requirements. The JSON artifact path for authentic focused native execution is `artifacts/roadmap-a-pack5-conditional-geometry/ROADMAP_A_79_UNCHOSEN_REAL_PACK5_CONDITIONAL_GEOMETRY_ENVELOPE.json`.

**HOLD:** physical placement and registration, creator-art signoff, roof/floor structural bearing, mixed five-pack collision, real GPU uploads/FPS/physical iPhone acceptance. No merge, deployment, or changes to protected files.
