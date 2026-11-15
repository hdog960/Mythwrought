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


## Verified dense-construction / persistence simulation — exact-head CI (2026-11-15)

**Supersedes earlier "not yet executed" wording:** Standalone source commit `590c3c140ffd09161569cde0cc40d97a991a8155` passed naturally triggered [supplemental acceptance #43723553203](https://github.com/hdog960/Mythwrought/actions/runs/43723553203) via draft infrastructure PR #136 at `fe8ed41792663e865c06ebdded50072070c29235`. **109/109 genuine native Node tests passed** (the preceding 101 plus **8** Pack 1-only dense construction, metadata, support/rollback and source-budget tests), zero fail/skip/TODO. The suite exercises 120 source-defined candidate placement orientations with 24 *orientation-bearing* shaped IDs, and independently verifies 6400 candidate cells across a 25-chunk (80×80) footprint, with pre-neighbor-culling source triangle count bounded by the explicit test threshold. The six masonry cubes are rotation-invariant, so only 24 IDs retain the turn 3 state; an initial incorrect expectation was corrected before the final pass.

**Full original browser/GPU regression preserved and rerun** on this exact functional source head: 15 original Chromium Canvas2D gallery views, **63** placement/save/restore/selection checks, 30 authenticated Canvas2D PNGs, **5/5** source WebGL2 geometry tests, **360/360** genuine candidate WebGL2 GPU renders and **90/90** original WebGL2 PNGs across 667×375, 844×390 and 932×430. Artifact `source-pinned-roadmap-chromium-evidence-43723553203` (artifact ID `14165646949`); all 90 GPU PNGs independently matched their manifest SHA-256 checksums (90 distinct hashes), with zero browser console/network errors reported. Production game/physical iPhone test flags in the artifact remain FALSE.

**What the result establishes:** builder-symbol resolution, original candidate geometry/textures, a 25-chunk deterministic *source-level* placement/triangle-load sample, and a fail-closed *isolated* compatibility proposal for preserving legacy schema-1 edit rows with disjoint orientation/upper-variant/mounting metadata. It is not a live VoxelWorld or structure importer, does not prove real player collision/save/rollback on-device, and does not benchmark actual GPU frame times, 60 FPS, screen controls or production chunk streaming. Future integrator must implement/persist the real metadata (the checksum is noncryptographic diagnostic only), validate all five packs' final ID allocation, and obtain creator/physical-iPhone approval.

**Readiness remains OPEN:** Pack 1's asset/adapter source is verified, but the user-requested *final five-pack integration-ready declaration* requires actual shared-engine interoperability and physical-device evidence. No independent merge/deploy, production registration, schema change or v0.11 unlock.


## Current-production schema-1 biome compatibility remediation — pending fresh exact-head evidence

A live-main audit after Incorporation 012 identified the first **concrete cross-program save blocker**: registered biome130 IDs use **256–315**, and the live `VoxelWorld.save()` optionally emits `rotations: [[x,y,z,turns]]` for rotated biome blocks. The previous Pack 1 source-only construction adapter had an obsolete `id <= 254` validation and reconstructed `{schema,seed,edits}`, silently dropping current live biome orientation state in a proposed construction snapshot.

The Pack 1-owned adapter now explicitly accepts a full `existingSave`, preserves exact current-production schema-1 edit IDs including 256–315 and optional biome rotations, incorporates those rotations into the metadata checksum, and detects malformed, duplicate, or stale biome orientation records. It refuses unknown top-level save extensions instead of dropping future data, rejects reserved 255/65535 sentinels, and preserves biome rotations during Pack 1-only removals. This does **not** change the production `VoxelWorld` or let Pack 1 assets register automatically.

Two new exact-source native tests cover existing biome 256/315 saved rotations, legacy ID 8 and planned manual ID 109, Pack 1 rotated upper slab, remove/restore, immutable input, and corruption/unsupported-save fail-closed behavior. The opt-in suite minimum becomes **111** (prior 109 + 2). The integration owner still must prove actual production save/import/rollback compatibility and iPhone performance; the current source-only adapter is a handoff, not a live save writer.


## Verified compatibility with live biome130 schema-1 records — 2026-11-15

**Supersedes prior *pending* status for this Pack 1-owned source interoperability gate.** At inspected production main `c512fcb9e6e82697cff0c5d26f073e503d51e4a5`, the real game includes 60 authored biome130 block IDs **256–315** and optional schema-1 `rotations:[[x,y,z,turns]]` records. Pack 1's earlier isolated constructor incorrectly limited saved edit IDs to 254 and discarded existing biome rotation entries when creating construction snapshots. This was a demonstrated compatibility defect, **not** a new original-art deficiency.

Pack 1 source-only `construction-stress.mjs` now accepts the exact existing `{schema:1,seed,edits,rotations?}` save shape, preserves biome 256/315 edits and rotations, legacy 0–8 and independent other-pack candidate IDs, and passes untouched input through round-trip/removal. The adapter includes existing biome rotations in its diagnostic checksum and fails closed on missing/changed/duplicate/stale orientation state, unsupported future save fields and 255/65535 reserved sentinel IDs. It also raises its fixture's maximum legacy-edit rows from 50,000 to current production's 300,000 limit. **Production VoxelWorld remains unchanged**, and the Pack 1 candidate IDs are still not registered.

- Exact **functional Pack 1 source commit**: `81369a0c910e1b95e719814be98d2210218dec74` (draft [PR #113](https://github.com/hdog960/Mythwrought/pull/113)).
- Naturally triggered source-pinned [supplemental CI #43724597209](https://github.com/hdog960/Mythwrought/actions/runs/43724597209): **SUCCESS**, **111/111 authentic native tests passed**, zero failed/skipped/TODO. Two additional cases cover current biome-save rotation preservation and corruption rejection.
- Canvas2D: **15 genuine Chromium views**, 63 interactions, 30 authenticated PNGs.
- Source-specific WebGL2: **5/5 GPU geometry Node tests**, **360/360 actual GPU renders**, 30 IDs × four orientations × three landscape sizes; **90/90 authentic GPU screenshots**, independently checked against uploaded SHA-256 manifest, **zero mismatches**, with 30 per 667×375, 844×390 and 932×430. Reported 0 browser console/network errors. Uploaded artifact `source-pinned-roadmap-chromium-evidence-43724597209`, GitHub ID `14165928208`.
- The previous 6,400-candidate-cell / 25-chunk geometry and metadata stress test remains part of the passing 111-test suite; it measures **source geometry only**, not hardware performance.

**Verdict:** Pack 1 candidate source, builder interface, biome130 schema-1-compatible *isolated* construction simulation, and source-specific GPU QA pass. **Do not declare `BLOCK PACK 1 — READY FOR FINAL INTEGRATION`** yet: real shared-engine registration and orientation/variant/mount metadata persistence, live village/town/city builder behavior, five-pack reconciliation, dense chunk GPU frame times, and actual iPhone controls/performance have not been demonstrated. The creator has not approved Gate A; v0.11 remains locked. No production merge/deploy took place. Subsequent documentation-only commits do not change this functional source evidence.
