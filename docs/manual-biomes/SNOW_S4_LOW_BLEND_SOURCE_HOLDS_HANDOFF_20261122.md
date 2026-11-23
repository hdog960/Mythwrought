# Snow S4: original low-blend / shoulder hold diagnostic — isolated handoff (2026-11-22)

## Exact source and protection checkpoint

- Protected production main: `7016e14cd6289f45eaf7fc6a79a362b47996df65`; independent compare returned IDENTICAL.
- Protected OPEN DRAFT Snow PR #358: `59e449be7e73b25f259c4c72855cfb638a056517`; open/draft/unmerged.
- Historical requested detached S3: `ad75fc94b22f1f9fc420fcf2231e3e242811b065`.
- This work extends the LATER verified isolated S4 descendant `2bede0f74e4d9c55acfe67faf820bf1eccb48c08` (11 ahead of ad75fc9), to avoid dropping the already completed 6-case grass topology and 12-case first-veto attribution lanes.
- New isolated branch: `research/snow-s4-low-blend-source-holds-isolated-20261122`. All writes have been on that new branch only, never the protected main or PR #358.
- No generator, M7 profile ID, physical block registration, save schema, shader, gameplay code, cave source, automation or another developer's branch was changed.

## Why this source work matters

Original `src/manual-biomes/environment-v7.mjs` (Git blob `d7b93c0a687afe7bbb8cf169c0b318fd1dc593af`) chooses not to author a snow column for TWO distinct reasons:

1. **Preservation veto:** any original block above `oldTop` is not AIR, or any `oldTop-2..oldTop` substrate block is not GRASS/DIRT/STONE. These can be old trees, cave AIR, stone or a protected landmark, and must not be mass-deleted.
2. **Legitimate low-blend exclusion:** if the source guard passes, `smooth(clamp((region.weight - .35) / .65)) < .065` and there is no shared biome shoulder, an empty plan is intentional. The original shoulder probe uses offsets `(+14,0),(-14,0),(0,+14),(0,-14)` in that priority order when weight is <= .50. It chooses original scree ID401 for mountain edges, moss ID405 for snow/enchanted edges, or generic shoulder ID258 otherwise.

The research-only `src/manual-biomes/snowy-s4-transition-source-check.mjs` uses the earlier S4 bounded, original-source grass-component census and first-veto attribution to classify observed original grass columns into `original-physical-source-veto`, `original-low-blend-without-shoulder`, or `unexplained-empty-M7-source-column`. An unexplained column is **NOT** deemed safe to repaint. Every record has `authorizingTerrainWrites:false` and the entire result has `writerEnabled:false`. A <=128-column physical source witness checks caves, column plans and schema-1; repeated biomeAt probes detect a mutable climate callback.

The only change to the already authored 2-seed full-M7 native test is an additional assert that all 36 sampled original-world columns have a genuine original guard veto or legitimate low-blend explanation. This test remains **UNRUN** on the new isolated source revision.

## Historical authenticated source evidence

An earlier authenticated M7 reader census on PR #358 (fixtures in `tests/fixtures/snow-s4-authentic-two-seed-reader-census.json`, checked by `src/manual-biomes/snowy-s4-authenticated-census.mjs`) records two seeds (179 and 2026), 3,362 snow-interior sampled columns, 3,149 authored, 213 untouched, and 97 with grass. Of the 213 untouched columns, 156 involved protected original AIR, 30 original STONE, 23 original WOOD and 4 original LEAVES (actual LEAVES=7, not CRYSTAL=5). This is earlier source-authenticated evidence, **not** an original-world run of the new classifier.

Original protected-head Snowy S0 GitHub Actions `44980094211` completed SUCCESS and its actual-game WebGL2 steps were green. That proves those older existing tests executed against a full original checkout; it is not acceptance for detached S3/S4 code.

## Two static-import blockers — exact diagnosis

The prior partial local checkout failed at static module import before test callbacks, affecting:

- `tests/snowy-s3-real-m7-provenance.test.mjs`
- `tests/snowy-s3-s5-real-m7-gate.test.mjs`

Both import `src/manual-biomes/profile-world.mjs`; that module and much of its original imported tree was not mounted in the earlier partial container. Direct container `git ls-remote` still fails due DNS resolution of `github.com`. Independent GitHub source-tree fetch at the pinned original research HEAD confirms **all direct relative import targets exist** for both tests (5/5 and 16/16), `profile-world.mjs` (13/13), `voxel.mjs` (8/8), and `environment-v7.mjs` (4/4). This is a **repository-path audit, NOT executable static-module-linking or runtime proof**. It rules out missing files in those direct paths at the remote checkpoint, but deeper imports, named exports and runtime compatibility remain unverified.

## Focused test evidence

- Node v22.16.0, exact newly authored `tests/snowy-s4-transition-source-check.test.mjs`: **12/12 PASS** on synthetic source-contract fixtures.
- Same run with inherited `tests/snowy-s4-grass-source-attribution.test.mjs`: **24/24 PASS**.
- Cases: protected WOOD/STONE, suppressed old foliage, saved edits, cave mutations, no-blend and shoulder rules, snow/enchanted vs snow/mountain source IDs, priority probe order, original negative chunk coordinates, unstable climate callbacks, empty sample, original-valid ID distinctions, maximum 128-column bounded witness.
- In the 128-column synthetic worst-case, 20,736 original cave-reader calls were observed across the entire chain, approximately 162 per green column. This is a bounded offline diagnostic, **not** a live iPhone frame-time metric and is never imported into the live game.
- New Git blob IDs are individually checked against locally tested files. No broad new GitHub Actions CI is requested or claimed.

## Exact next original game acceptance

In an *authentic full repository checkout* at this isolated branch HEAD, run only the missing original-world gates, avoiding redundant full CI:

```bash
node --test tests/snowy-s3-real-m7-provenance.test.mjs
node --test tests/snowy-s3-s5-real-m7-gate.test.mjs
```

If they fail, report real stack traces. Do not claim that previously missing static imports are gameplay failures. Reuse any exact-commit source test evidence before scheduling costly WebGL2. Reconcile actual world seeds with historical authenticated 97 grass samples, document all protected causes, and only then propose an independently approved new-world versioned snow terrain change. Visual checkerboard, tree silhouette, stray green broadleaf, snow/rock edge art and physical iPhone Home Screen performance remain unaccepted.

**Status: new original-source engineering and focused fixtures only; no production snow visual changes or authorized release.**
