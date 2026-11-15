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


## Latest exact-head expanded builder/asset acceptance — 2026-11-15

**Evidence is NOW VERIFIED; this section supersedes the earlier pending-native-test language in this handoff.** Exact **Pack 1 source head** `bfa15c846b9b2b7227f78321b2b8657c7c311e20`, [draft PR #113](https://github.com/hdog960/Mythwrought/pull/113). The opt-in Pack 1-only supplemental workflow on [infrastructure PR #136](https://github.com/hdog960/Mythwrought/pull/136) at `7f4bb9dde3d8b47f6c9d0b0e18e136285f0a730a` ran automatically. [GitHub Actions #43720843639](https://github.com/hdog960/Mythwrought/actions/runs/43720843639) **SUCCESS**; job `verify-candidates` completed green, evidence artifact `source-pinned-roadmap-chromium-evidence-43720843639` (ID `14164965168`).

- **101/101 genuine native Node tests passed**, zero failures/skips/TODO. This includes **8 new builder handoff / family-symbol resolution tests** plus the previous 93 original tests. No substitute V8 shim was used.
- **5/5 source GPU geometry Node tests** passed; 15/15 genuine source Canvas2D gallery views, 63/63 offline-fixture/card-state/interactions, 30 original decoded Canvas2D PNGs.
- **360/360 actual candidate WebGL2 GPU renders** on 30 physical IDs × four quarter-turns × CSS viewports 667×375, 844×390, 932×430. **90/90 original GPU screenshots**, each with verified SHA-256 and distinct checksums; no GPU/context-loss, page console, or network errors recorded in the acceptance manifest.
- The stone pillar, arch and railing (IDs 18, 19, 20) are fully visible at all three sizes; the old preview status-panel overlap did not recur.
- The candidate-only builder catalog maps **21 exact building roster symbols** `pack1:001`–`012` and `pack1:047`–`055` to the **30 unique actual candidate IDs 9–38**. Ambiguous family symbols must specify a physical variant. Builder plan orientation/upper-variant state and vine mounting requirements remain explicit; schema-1 edits cannot silently drop state.

**Readiness assessment:** Pack 1 source assets, the independent candidate renderer, and the Pack 1-only builder handoff/isolated QA are technically complete **as candidate inputs**. The phrase `BLOCK PACK 1 — READY FOR FINAL INTEGRATION` is **withheld**, because physical-iPhone game performance, registered-world shape/collision/saving, upper-variant and rotation state persistence, dense-building compatibility, and the five-pack conflict audit have **not been proven**. Those are coordinated production integration gates, not evidence of missing original artwork. Do not merge or deploy independently; preserve legacy 0–8, saves, iPhone controls, Gate A and locked v0.11.

This evidence is pinned to source commit `bfa15c84`. Any later *documentation-only* handoff update does not modify these source geometries. A later functional asset/bridge edit requires fresh source-exact candidate tests.

## New source-level dense construction + sidecar stress acceptance — pending exact-head CI

New isolated Pack 1-owned `construction-stress.mjs` / `construction-stress.test.mjs` demonstrate a **separate** no-world-write integration plan with 8 tests covering 120 rotations, upper slab/stair metadata, mounted vines, schema-1 edits, stale/duplicate records and an intentionally unoptimized **6400 candidate-cell / 25-chunk source geometry sample**. A deterministic noncryptographic integrity checksum of world edits plus separate turn/variant/mount records prevents accidental metadata loss. The existing `run-acceptance.mjs` explicitly includes these tests; the native fail-closed threshold is raised to **109 tests** across 11 modules. The source estimates triangles without interblock culling, so it neither measures GPU draw time nor certifies 60 FPS on physical iPhone. As of authoring, **no exact-head execution** of these 8 new tests has been verified; final certification requires real native and source-WebGL2 evidence. Changes are Pack 1-only, and the previously accepted source art remains unchanged.
