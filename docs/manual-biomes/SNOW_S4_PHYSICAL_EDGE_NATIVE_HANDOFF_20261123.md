# Snow S4 physical-edge preflight and authentic native test gate — 2026-11-23

## Protected provenance and no-go boundaries

- Original production main (protected, do not alter): `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- OPEN DRAFT PR #358 exact HEAD (protected, do not alter): `59e449be7e73b25f259c4c72855cfb638a056517`.
- Previous isolated S4 branch: `research/snow-s4-low-blend-source-holds-isolated-20261122` at `b11ddb66ffc76dcda59454d584d24635b534269c`.
- New detached research: `research/snow-s4-physical-edge-original-native-isolated-20261123` descends directly from that verified S4 HEAD, not from main or the protected draft.
- All new source/test files and the *single purpose-built native CI workflow* are committed in one isolated descendant commit. No gameplay generator changes, no material IDs, shader edits, save-schema edits, automated settlement changes, merges, deployments, or other developer/automation branch edits.

## Physical edge preflight

`src/manual-biomes/snowy-s4-physical-edge-preview.mjs` is deliberately read-only. It consumes the previous genuine S4 transition-hold report (which itself requires original M7 column/cave/source context), and considers ONLY a retained GRASS column attributed to the original no-shoulder/low-blend early return. It will **never** certify a source veto, unexplained empty original M7 plan, unsupported top or player edit.

Even that low-blend column is only a future-profile review site if:

1. Its authentic M7 profile, old top, empty column plan, GRASS cap and solid original support agree.
2. The complete original oldTop-2..Y19 source baseline has no cave overrides, edit rows, old WOOD/LEAVES or other persistent occupancy; even naturally suppressed old foliage vetoes a proposed snow patch.
3. All FOUR immediate cardinal neighbors are actually authored snow caps (IDs 272/276/279), same snow climate, physically supported, not edited or cave-occupied and within ONE vertical voxel of the original ground. Any old overhead features in those neighbors cause rejection.
4. Every sampled original cave, baseline, legacy, column-plan and schema-1 save witness is unchanged at the end of the review. A bounded 128-cell input uses at most 176 unique sampled columns in the fixture grid. This is an OFFLINE research tool, never imported by live game or frame loop.

Any returned reference material ID 272 is an investigative suggestion, **not** an approved voxel write. Every preview and candidate has `writerEnabled:false` / `authorizingTerrainWrites:false`, and no API here calls `world.set`.

## Focused evidence and two original-world import blockers

- New local Node **22.16.0**, `node --test tests/snowy-s4-physical-edge-preview.test.mjs`: **12/12 PASS**. Cases cover physically supported isolated grass, original WOOD and LEAVES (IDs 4/7), cave AIR, saved edits, old tree overhang, other-biome neighbor, unauthored neighbor, two-block cliff, neighboring cave/edit, mutation callback, forged input, negative chunk coordinates and 128 input cells.
- Locally tested Git blobs: `src/manual-biomes/snowy-s4-physical-edge-preview.mjs` = `9624188c546bdb8d9976b56195f565b74103f3d3`; `tests/snowy-s4-physical-edge-preview.test.mjs` = `d958bb3a01e3367d3c37aaa048167f836fe35291`. Compare these after commit to ensure GitHub content matches exact tested source.
- `tests/snowy-s4-physical-edge-original-m7.test.mjs` now authors a genuine `FourRegionWorld` two-seed read-only test with profile, original legacy source, cave, save and selected physical edge source acceptance. It is **UNRUN until native full-checkout results**.
- `tests/snowy-s3-real-m7-provenance.test.mjs` and `tests/snowy-s3-s5-real-m7-gate.test.mjs` previously failed during static import in a partial local directory that lacked `profile-world.mjs` and its imports. Exact GitHub tree checks already established those paths exist remotely. There is no established gameplay test failure or successful native run at the new branch HEAD yet.
- New `.github/workflows/snow-s4-isolated-original-native.yml` is triggered ONLY by an isolated branch push to this exact branch. It performs an authentic complete Actions checkout with exact HEAD check, 12 fixture tests, both previously blocked original-world tests and a newly authored native M7 physical-edge test; reports each result separately even if others fail, then fails the entire job if any fail. No Chromium or full CI, no PR modification, no run cancellation and no deployment.
- Do NOT claim actual original M7 passing until the GitHub Actions workflow is confirmed completed SUCCESS with all four native/focused steps individually passed. Read logs for import stack traces if anything fails.

## Subsequent tasks

1. Inspect the targeted native workflow job steps and logs, correct any real source failures in another isolated commit only after understanding them; avoid duplicate broad CI.
2. Reconcile real source counts of zero or more conservatively proposed physical edge sites; a zero count is a valid safe outcome, not a prompt to weaken protections.
3. Plan a genuinely versioned **new-world only** snow terrain/vegetation change after original cave, save, player movement, WebGL2 and iPhone Home Screen visual/performance acceptance. Do not turn this read-only diagnostic into the live M7 generator.
4. Preserve original S1 ice checkerboard fixes, S2 cap source evidence, S3 prototypes, the two S4 diagnostic layers and S5 non-block reuse; never touch the other developer branches.


## Verified complete original-repository native acceptance (2026-11-23 UTC)

**New GitHub Actions #45170543633** at exact source/test HEAD `0e309a0371dcb4894af4c7c51469fe155313c225`: `COMPLETED SUCCESS`. All four test stages actually executed against the exact full original repository checkout:

- S4 preview focused fixture: **12/12**.
- Previously static-import-blocked original S3 two-seed provenance: **1/1**.
- Previously static-import-blocked original S3/S5/S4 physics/scene gate: **1/1**. Seed179: 10 walking proposals audited; 1 source-admitted and 1 player-body-approved tree, 1,171 collision probes, 870 preserved directed portal pairs, **45 genuine original stepPlayer steps**. Seed2026: 6 walking proposals, no eligible source-admitted trees, zero steps; this is an honest empty admission, not an error.
- New original S4 physical-edge 2-seed gate: **1/1**, preserving saves/caves. Its original two 6x6 rectangles happened to contain zero retained grass, so the pass did NOT establish real grass classification.

**New separate minimum-scope GitHub Actions #45170899399** at exact source/test HEAD `30ded9ac8e628924b13716f5a43f46e17a7a0fdd`: `COMPLETED SUCCESS`, **1/1** genuine original M7 retained-grass witness test. No other previously successful tests were redundantly rerun. The coordinates were recovered from earlier protected-head S0 original seed179/2026 run #44980094211, not fabricated:

| Seed | Original grass witness | Original source diagnosis | Retained grass in 5x5 sample | Physical candidate disposition |
| --- | --- | --- | ---: | --- |
| 179 | (-104, oldTop=9, 360) | original elevated physical source | 5 | 0 proposals, all 5 rejected |
| 179 | (-88, oldTop=7, 536) | invalid original subsurface (cave/source protection) | 10 | 0 proposals, all 10 rejected |
| 2026 | (-104, oldTop=9, 360) | original elevated physical source | 5 | 0 proposals, all 5 rejected |
| 2026 | (-88, oldTop=7, 536) | invalid original subsurface (cave/source protection) | 10 | 0 proposals, all 10 rejected |

This authentic **30 retained-grass column observations** total across two original source seeds and two real sites. Every one is protected, and zero writes or edits were made. A future visual fix cannot indiscriminately paint these green islands without crossing historically protected source. Do not weaken the constraints to manufacture a positive candidate quota.

The four native tests in #45170543633 and one native test in #45170899399 are authenticated exact test-source results. The new handoff update is documentation-only; no original test/implementation files changed after their successful runs. Reuse the existing exact code-blob evidence; **no repeat broad CI**.

**Remaining gates:** no live M7 physical snow conversion, no new-profile source acceptance, no complete snow art parity, no target iPhone WebGL2 frame-time or installed Home Screen PWA acceptance. S3 physical trees remain detached, not game-integrated. Production main and protected OPEN DRAFT PR #358 must remain frozen until separately approved.
