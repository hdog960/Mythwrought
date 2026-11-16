# Mythwrought — G1 Read-Only Runtime Inventory Acceptance

**Status:** G1 candidate on an isolated DRAFT integration branch; no live-world integration or activation. Exact-head GitHub CI must complete and be reverified before technical acceptance.

## Scope and exact source provenance

- Runtime allowlist is imported from production `src/blocks.mjs` `BUILD_MATERIALS`. Core definitions come from `src/voxel.mjs`, authored biome definitions from `src/biome130-registry.mjs`, and live Pack2 definitions from `src/pack2-integration.mjs`.
- Builder dependency catalogs are not runtime registration: the 96-family/106-variant manual five-pack handoff and eight building PRs are expressly excluded. No IDs are synthesized.
- Numeric ID `76` (authored water) is registered in the live Pack2 source but its fluid geometry uses a non-box triangle-level selector. G1 explicitly lists it as `excluded:[{id:76,reason:'fluid-selection-adapter-not-certified'}]`; never generate a cube stand-in.
- Other registered ordinary materials, 70 installed biome130 definitions, and 17 supported nonfluid Pack2 definitions are validated at source, with conservative neutral rotation for stateful Pack2. Expected current merge baseline: **92 read-only records and one explained exclusion**, subject to exact-head CI and source execution.
- Any future registry additions need explicit G1 validator support; unknown producer IDs fail closed. The output's source label is informational, not an authentication signature.

## Source interfaces

- `registry-validation.mjs`: immutable typed-ID validation and geometry limits; rejects duplicate IDs, missing anchor, empty selection, invalid AABBs, out-of-range rotations, source/registration contradictions and oversized catalogs; deterministic revision is a non-security change detector.
- `registry-snapshot.mjs`: imports production readers; returns sealed snapshot and explicit exclusions, plus an async `listPlaceables` read-only facade for a future approved consumer. Neither module installs itself into `src/main.mjs`.
- G1 does **not** change the detached `mythwrought.creative.adapters.v1` ABI; separate `mythwrought.creative.registry-snapshot.v1` envelope is experimental and would need deliberate integration-version review.

## Test plan and evidence requirements

```bash
node --test tests/creative-integration-g1.test.mjs
npm test
```

The 21 dedicated native tests exercise the compiled production imports in GitHub CI: provenance and ID exclusion, missing physical metadata, draft rejection, duplicates, typed IDs, rotation and anchor checks, deterministic snapshot revisions, read-only port surface and deep freeze. Local development used an **explicitly disposable stub for the imported production API**, so local passing tests alone do not prove live sources. CI must run the exact head against real repo modules and the full 20-script WebGL2 gate; record success/failure and exact SHA without inventing the outcome.

No G1 visual UI is attached; do not describe detached inventory screenshots or ordinary CI WebGL2 gates as physical-iPhone Creative Mode testing. There are no G1 save writes to test.

## Fail-closed completion conditions

- Any file outside the seven-path allowlist changed: stop, revert out-of-scope changes, recheck baseline.
- Any unresolved, unplaceable, candidate-only, unsupported physical definition or ID collision emitted: stop; never publish a partially validated catalog.
- Any new caller linking G1 into the live world, installation, storage or controls: stop; violates authorized G1 scope.
- Any native CI or full WebGL2 check pending/failed: report precise blocker, leave PR draft/unmerged/undeployed.
- No G2–G7 transition or production integration without separate creator approval.

**Approval state:** creator authorized G0/G1 development only. Neither CI success nor this note authorizes merge, deploy, changing `main`, enabling Creative Mode or unlocking v0.11.
