# Mythwrought — Pack 1 coordinated five-pack integration handoff

**Status: STANDALONE TECHNICAL QA COMPLETE; FINAL FIVE-PACK INTEGRATION READINESS NOT YET CERTIFIED.** This file is a Pack 1-owned contract, **not** an authorization to merge, deploy, register, or modify other Block Packs.

## Scope and proven source

- Draft PR [#113](https://github.com/hdog960/Mythwrought/pull/113); the standalone WebGL2/source acceptance was proved against commit `7c019432cf73cd9ebc0ab8a8485486845a948c6d` by [supplemental GitHub Actions #43717407382](https://github.com/hdog960/Mythwrought/actions/runs/43717407382): 93 native Node tests; 5 additional GPU geometry tests; 15 Canvas2D landscape views and 63 interactions; 30 Canvas2D PNGs; 360 genuine candidate WebGL2 renders and 90 source-exact GPU PNGs. Corrected arch/railing framing is included. These results cover the original source assets; new handoff tests need their **own** exact-head CI evidence.
- 21 Stone & Nature families, 30 candidate block IDs **9–38**. The production legacy block IDs **0–8** and sentinel 255 are excluded. No claim of cross-pack ID clearance without the central five-pack dependency audit.
- All source code and tests remain solely under `src/block-packs/pack-1/` and `tests/block-packs/pack-1/`.

## Builder-facing opt-in contract

`builder-handoff.mjs` provides `PACK1_BUILDER_CATALOG`, `pack1BuilderShape(id,{rotation,variant})`, `pack1BuilderPlacementPlan(id,{cell,rotation,variant,wallMounted})`, `pack1CanonicalSchema1Edit(plan)` and `pack1BuilderFaceTexture(id,role,face,size)`.

- The catalog advertises the correct stable ID, roster, slug, family, and attachment requirement **without touching the runtime registry or world**. Future village/town/city builders can resolve source-authored shapes and original material/part-role textures from this data only after central registration.
- Every shape is a single-cell union of real AABBs; targeting covers actual visible geometry. Collision uses the original soft-plant and mushroom stem-only policies instead of coercing every candidate to a solid cube. Rendering remains the already-authored original per-part source geometry, not an unrelated block proxy.
- Rotation 0–3 is available as source geometry. **Orientation cannot be silently dropped from schema-1 saves.** Rotated noncube plans produce an explicit orientation-sidecar requirement, while the **upper** slab/stair variant additionally needs distinct variant persistence (the existing rotation-only sidecar is insufficient). The canonical four-element `[x,y,z,id]` edit is available only for plans that do not need either extra state.
- Climbing ivy and wisteria require a vertical mounting face; builder plans reject unsupported placements. Production must revalidate mounts after load and neighbor edits. Planning does **not** mutate any real save or claim the feature is available in the production engine.

## Five-pack integration gates owned by the final integrator

1. Check all five packs and the automated biome library for unique live IDs, symbolic dependency aliases, and builder mapping. Do not renumber or silently substitute Pack 1's 9–38.
2. Register the 30 Pack 1 IDs in the actual `VoxelWorld` and builder palette, preserving legacy 0–8 and existing schema-1 edits; do not use preview-only `prototypeOnly/placeable:false` descriptors as live registration flags.
3. Validate the real shared renderer and chunk-mesh upload budget for distinct part materials, exposed surfaces, all four rotations, upper stone variants, alpha-cutout plants and 25-chunk normal budget. Source-only WebGL2 previews are not production rendering proof.
4. Validate real placement/removal, face support, AABB targeting and collision, player fit, structure assembly, and builder blueprints in villages, towns and cities. Canonical edits must survive save/import/rollback; noncanonical rotations and upper variants require a demonstrated, separately persisted and restored schema-1-compatible metadata system.
5. Verify current production baseline CI plus integration-specific, dense construction and physical-iPhone two-thumb/playability/performance tests. Creator artwork/control approval, Gate A and v0.11 remain separate and unapproved. Never assume hardware approval from software Chromium.
6. Preserve and compare this Pack 1 source catalog/geometry with the final integration version; any functional source changes require fresh source-specific acceptance. No Pack 1 documentation or integration test changes alone can replace the pinned WebGL2 evidence.

**Readiness verdict as of this handoff:** **NOT READY FOR FINAL INTEGRATION DECLARATION** pending the new builder-handoff tests, latest production dependency reconciliation, and proof of compatibility for rotations/variants/save/performance that the pack cannot establish by editing only its own source. The completed original M1–M6 acceptance remains preserved.

## Builder-handoff acceptance wiring

Pack 1's opt-in `tests/block-packs/pack-1/run-acceptance.mjs` explicitly includes `builder-handoff.test.mjs` among its ten native Node modules. Its fail-closed TAP threshold is now **at least 100 real passing tests**, incorporating seven additional builder-handoff checks on the original 93. The existing 15-gallery-view / 30-screenshot native browser evidence and the separate 360/90 source-WebGL2 acceptance are still required; unchanged prior artwork cannot waive new builder test execution. Root CI may not automatically run nested Pack 1 tests when its full shared browser gate is selected; treat a green root gate as **baseline only** until an exact-head, explicitly evidenced Pack 1 runner executes. This wiring alone is **NOT evidence that the new tests have passed**.

## Building-roster symbolic reference compatibility

Read-only checks of the existing building schemas in draft PRs #121 and #124 confirm that building materials use **roster symbols** such as `pack1:001` and `pack1:053`, not Pack 1's final numeric block IDs. The owned `builder-handoff.mjs` now maps 30 physical assets to **21 exact roster namespace references** (001–012 and 047–055), exposes `pack1BuilderFamilyCandidates(ref)`, and makes `resolvePack1BuilderFamily(ref,{candidateId})` fail closed for ambiguous references. For example, `pack1:053` identifies the flower family and requires choosing among IDs 32–35; there is no arbitrary first-flower replacement. The mapping does not modify any building blueprint and requires central dependency resolution before real-world construction.

The opt-in standalone native runner now requires **at least 101 actual passing tests** (the original 93 plus eight builder-handoff tests). No new pass is claimed until this exact new source is executed under native Node and the required browser/source-GPU gates are separately verified.
