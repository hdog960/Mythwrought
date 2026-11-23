# Snow S6 — isolated opt-in new-world design preview (native acceptance checkpoint, 2026-11-23)

## Protected refs and exact ancestry

- Production `main` protected at `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Snow OPEN DRAFT PR #358 protected at `59e449be7e73b25f259c4c72855cfb638a056517` (open/unmerged).
- Source parent: `research/snow-s4-physical-edge-original-native-isolated-20261123` exact `f79051feacfce4cdafc6e509e6cbba4de7a538df`.
- This independent line: `research/snow-s6-pristine-new-world-design-isolated-20261123`.
- Implementation/test HEAD: `9366e472f2ebcb83c9475b7522c5462514eddc04`.
- New implementation/source files are **detached**, NOT imported by the active generator, renderer, physics or save readers; current M7 source and both original protected refs remain untouched.

## New engineering

1. `src/manual-biomes/snowy-s6-winter-tone-proposal.mjs`: three coordinated original material references, snow ID 272, natural glacier ice ID 276 and rime ID 279, each with subdued linear-RGB candidate colors. Nearby world-coordinate samples differ only by continuous sinusoidal fields, not per-voxel hashes. Original physical IDs, palette and renderer remain untouched. This is a design color proposal, NOT a WebGL2 image or live shader patch.
2. `src/manual-biomes/snowy-s6-fresh-world-design-preview.mjs`: combines original S4 low-blend/shoulder source attribution, original S4 strict four-neighbor physical-edge review and the original S3 canonical-owner conifer cells. Caller must explicitly provide the research-only candidate profile marker `mythwrought-five-surface-regions-v8-snow-optin-research`, intent `fresh-new-world-research-only`, and `allowM7SaveMigration:false`. The marker is **not** registered in `fourRegionProfile`; native test proves it rejects the ID. The API rejects existing schema-1 edits/rotations, non-M7 worlds, missing original source callbacks, and cross-chunk/unbounded tiles.
3. The true source tile is at most 8×8 in ONE original 16×16 chunk. It captures original column plans, snow biome weights, original physical cap/support, cave overrides and save state before and after. Any temporary callback mutation fails closed. S3 cells are already admitted by real body/cave/scene checks and are checked again. Any candidate S4 surface cap is blocked by an admitted low conifer overhang, and even remaining referrals are **research only**. Four pre-existing detached S3 conifer silhouettes (compact fir, layered spruce, highland pine, windswept alpine) remain available for a future versioned world, but actual styles used in this tile are not certified by the composite output.
4. The only new Actions workflow `.github/workflows/snow-s6-isolated-native.yml` is scoped to the new isolated branch and changes to these S6 files. It runs syntax, new focused tests and one complete original M7 native test. **It does not rerun old S3/S4 CI, Chromium WebGL2, npm full suites or an iPhone check**.

## Exact native acceptance (new code)

- GitHub Actions run **#45191677603**, exact source/test HEAD `9366e472f2ebcb83c9475b7522c5462514eddc04`, `COMPLETED SUCCESS` (full exact original repository checkout, Node 22).
- `tests/snowy-s6-winter-tone-proposal.test.mjs` + `tests/snowy-s6-fresh-world-guard.test.mjs`: **12/12 PASS**.
- `tests/snowy-s6-original-m7-design-gate.test.mjs`: **1/1 PASS**, genuinely instantiated original `FourRegionWorld` for seeds 179 and 2026. The test explicitly proves `fourRegionProfile(seed,S6_PROFILE)` throws: the candidate **cannot accidentally become live**, and original save restores unchanged.
- Real original M7 8×8 tile at x=-16,z=512: seed179 = **64** original snow palette references, **102** S3 approved physical conifer voxels, 1 owner review, 0 protected grass; seed2026 = **64** palette references, **0** conifer voxels, 2 owner reviews, 0 protected grass.
- Real original M7 8×8 tile at x=-104,z=360: both seeds = **63** authentic original authored winter palette references, **1 protected legacy GRASS column**, **0** physical conifer cells and **0** S4 edge referrals. All authentic protected grass remains GRASS at oldTop and neither save nor cave data is changed.
- The 102 cells represent physical tree material placements in this detached preview, **not 102 distinct trees**, and do not prove any particular one of the four styles was present in that tile.
- Original source/test Git blobs:
  - `snowy-s6-winter-tone-proposal.mjs`: `ba96c8e9785d5c3333db614aeb82509fdf7edfe8`
  - `snowy-s6-fresh-world-design-preview.mjs`: `76bce9c9a838bc95346804743232d9a427edb973`
  - `snowy-s6-winter-tone-proposal.test.mjs`: `babca23f0db4428b7d7e2fbeff9dac14fc501d91`
  - `snowy-s6-fresh-world-guard.test.mjs`: `97da1cd766413876e4ab28b8f8dc7e0fe3076749`
  - `snowy-s6-original-m7-design-gate.test.mjs`: `bc5dee3652141220383c5baa24b8fba39830be5f`
- The earlier authenticated S3/S4 native run #45170543633 and protected real-grass run #45170899399 were reused, NOT repeated.

## Next development constraints

1. S6 is **not** an active v8 generator or registered save profile. Do not turn the draft marker into a real profile or allow migrations without explicit creator approval and complete original physical save/cave/biome/collider review.
2. A real production-quality design needs the source-exact integration protocol for deterministic owner-chunk conifer placement, total multi-owner collision admission and genuine render/mining/selection parity.
3. Actually activate the continuous winter shader/color only after authentic side-by-side Chromium WebGL2 screenshots (including snow/ice/stone and player-placed ice), selection/collision comparisons, and on-device iPhone installed Home Screen PWA performance acceptance.
4. Green patches protecting old cave AIR, stone, WOOD, LEAVES, named landmarks or saved edits must never be overwritten. Candidate cap referrals do not constitute permission for a replacement, even for a future profile, until a separately accepted physical migration and world-release protocol exists.
5. Do not merge, deploy, modify protected main, PR #358, other developers, the hourly automations, or settlements. Keep CI targeted; no redundant full suites on identical SHAs.

**Status: authentic source-tested detached new-world design research, NOT a production snow visual fix or deployable v8 world.**
