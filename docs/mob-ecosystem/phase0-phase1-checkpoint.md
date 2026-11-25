# Living Ecosystem — exact-head Phase 0 and Phase 1/2 checkpoint

## Verified ancestor and CI

- Production main: `7016e14cd6289f45eaf7fc6a79a362b47996df65` (same when verified).
- Original isolated draft HEAD `fc78ff9842d91f291366ebceeed79035a356a0d1`.
- [Original root Actions 44948785040](https://github.com/hdog960/Mythwrought/actions/runs/44948785040): FAILURE, 15/16 CI contract tests PASS, one strict source manifest test FAIL because `src/mobs/ecology.mjs` changed but its staged-cache hash remained the original. The `npm test` step did not run.
- [Original 40-creature WebGL2 Actions 44948785133](https://github.com/hdog960/Mythwrought/actions/runs/44948785133): SUCCESS; 12/12 native five-system tests, 2/2 cache tests, 5/5 full-roster, 4/4 persistence, and all authored-model Chromium capture steps succeeded. The browser workflow manually inserts actors and does not establish natural spawning.

## Safe correction

`src/mobs/ecology.mjs` is restored to its byte-identical production blob `b145ab48d5a993f0796b1b321ce2b0ba0a7e1b23`. The `nonblock-stage-assets.json`, `sw-nonblock-stage.js`, and the PWA delivery files are unchanged. The protected source-verified offline worker version `20261121-v36` is preserved. Do not regenerate that manifest for an unactivated draft or reuse an already published staging version with altered source.

Phase 1 adds `src/mobs/ecosystem-diagnostics.mjs`, a standalone development-only replay of the original deterministic six-candidate sampler with a bounded rejection-reason census. It reads voxel collision and habitat via the actual world query but never inserts any mobs. The native test also advances original `PopulationManager` with the original 40-species roster and counts real natural births. Both are controlled meadow observations over actual VoxelWorld geometry; this is not complete V6 biome evidence.

Phase 2 adds `src/mobs/ecosystem-habitat.mjs` containing an isolated, deterministic biome+depth+light eligibility pool and rarity-weighted picker. The original runtime does NOT import it yet. No tuned weights, population limits, spawn radius, save schema, rendering or combat were modified.

## Remaining

- Verify new exact-head CI including independent root tests and strict manifest contract.
- Measure actual five-biome V6 terrain, cave sections and far coordinates with naturally created entities.
- Verify original Home Screen cache generation and physical iPhone runtime separately.
- Design a safely versioned staging integration before changing live `ecology.mjs`; do not defeat cache integrity or alter non-block automation branches.
- Apply Phase 2 to production spawning only after separate source-supported integration verification.

**Release HOLD: protected DRAFT PR #380; no merge or deployment.**

## Phase 1 precision and Phase 2 independent streams

Original source arithmetic revealed a deterministic species/X coordinate lock:
speciesIndex=random%40 and localX=random&15 share three low bits,
restricting each species to two of sixteen chunk columns. This is not
a terrain fixture artifact. The new isolated prototype uses independent
deterministic streams for candidate species, X and Z, without any runtime
imports, PWA modifications, or save changes.

The Phase 1 observer now accepts explicit localCounts and matches the
production short-circuit ordering of habitat eligibility before overlap.
Tests check a full per-species population cap, production stripe lock,
unrestricted proposed X coverage, determinism, remote coordinates and
negative chunk handling.

These modules remain unactivated; actual game spawning is not repaired.
