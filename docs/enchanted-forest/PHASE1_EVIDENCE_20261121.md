# Enchanted Forest Phase 0 and Phase 1 — Authentic Source Evidence (2026-11-21)

## Source-of-truth and protection
- Repository: `hdog960/Mythwrought`.
- Protected production main as observed during this work: `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Isolated branch: `dev/enchanted-forest-overhaul-20261121-phase0`; parent main exact commit, no merge/deploy.
- Historic checkpoint: `ef8a5f997ca539548cb70e0e3051c4a342e51a4d`, Phase 0 source inventory and bounds.
- Video source: `mythwrought-2026-11-21T18-50-58-672Z.mp4`; SHA256 `f86de5ffa774e75a0a9eaf4a80158ab8d085d2aac4b67a60d2d51f7e13fe5056`; ffprobe H264 798x532, 10.000 seconds, creation timestamp `2026-11-21T18:50:48Z`. A video recording timestamp does **not** identify the exact installed Home Screen JavaScript revision or service-worker cache. The video build SHA remains unverified, not fabricated.

## Source audit and actual CI
Single-job isolation uses `.github/workflows/enchanted-forest-isolated.yml`. No draft PR or large shared test suite was triggered by this work.
- Run [44947706321](https://github.com/hdog960/Mythwrought/actions/runs/44947706321), source SHA `9d11266dad48688c319120d2f28d8229e483a008`: genuine original M7 world modules imported, syntax checks and script succeeded; artifact 14723608547.
- Run [44947774163](https://github.com/hdog960/Mythwrought/actions/runs/44947774163), source SHA `9c4516b7d2e341a78ea105f25b50d7987b4bd920`: source provenance with exact first rejection locations succeeded; artifact 14724342548.
- Before repair: three seeds `179`, `7919`, `-88`; five enchanted regions including far-away regions; 2,205 interior columns; original ground IDs: GRASS (1): 5, STONE (3): 2, woodlandLoam (403): 441, woodlandPeat (404): 287, woodlandMoss (405): 1,470. Five repeatability checks passed. This is **sample coverage**, not worldwide proof.

## Exact grass witnesses and verified source cause
Seed `7919`; enchanted biome weight 1.0; zero saved edits; original GRASS voxel IDs; each planned overlay was empty:
- `(-58,5,-568)`: original protected STONE ID 3 above at Y=6..11 and ORE ID 6 at Y=12.
- `(-57,5,-568)`: protected STONE at Y=11.
- `(-55,5,-568)`: protected STONE at Y=11.
- `(-54,5,-568)`: protected STONE at Y=6..10 and ORE at Y=11.
- `(-59,4,-567)`: protected STONE at Y=6.

At these *measured* coordinates, protected landmark stone/ore above the original grass triggered the fail-closed full-column veto in `planEnvironmentalColumn` (`src/manual-biomes/environment-v7.mjs`). This left the underlying original GRASS (ID 1) unchanged. Nearby legacy district-tree sources were not present in the measured radius. Therefore do not call these five specific patches a plains-tree placement problem; unrelated unmeasured green patches require separate evidence.

The two STONE ID 3 ground-cap anomalies in seed 179 also had protected original stone above (near a named legacy court) and were intentionally left unchanged as protected landmark geometry.

## Candidate correction and explicit limits
Source change: `src/manual-biomes/environment-v7.mjs` at `65b77ef3005a24bcb05146e937891f5caec86f02`.

When protected original geometry occupies air above the old surface, the old behavior rejected all terrain replacement. Candidate now:
1. Keeps the entire above-ground protected geometry intact and never raises the terrain into it.
2. Permits a one-cell grass-cap-only material replacement **only** for an enchanted interior (biome weight >=0.70), only if original top is exactly GRASS and the underlying protected/cave check passes.
3. Returns empty for other biomes, enchanted shoulders, non-grass landmark caps, and protected underground cells.
4. Leaves original save data/edits and M2–M6 source untouched; no world is written to in the diagnostic.

Source-backed strict regression introduced at `tests/manual-biomes/enchanted-forest-phase1.test.mjs` with five actual grass coordinates and preservation of genuine legacy landmark voxels; diagnostic now asserts zero observed grass in the 2,205 sampled interior columns.

## Pending acceptance gates
The exact revised full strict CI run for source commit `40b076d6fd588d2d29c04217c9f1b2c305f91232` is [44947901589](https://github.com/hdog960/Mythwrought/actions/runs/44947901589). It was queued at the last check. Until the native regression and strict zero-grass audit actually finish, **do not claim the fix passes or Phase 1 is accepted**.

Still pending: wider seed and border audits, real WebGL2 before/after visual captures, physical collision, mining, save-restore regression, actual iPhone Home Screen PWA qualification, and tall-tree feasibility. No new tall trees have been created. No merge, deploy, PR, or automation edits authorized.
