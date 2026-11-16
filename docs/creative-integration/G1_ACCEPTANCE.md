# Mythwrought — G1 Read-Only Runtime Inventory Acceptance

**Status:** G1 source was independently verified for the prior 80-family baseline; this 130-family acceptance update requires a new exact-head GitHub Node and full WebGL2 CI run against current merged `main` before final technical acceptance. Isolated DRAFT integration branch; no live-world integration or activation.

## Scope and exact source provenance

- Runtime allowlist is imported from production `src/blocks.mjs` `BUILD_MATERIALS`. Core definitions come from `src/voxel.mjs`, authored biome definitions from `src/biome130-registry.mjs`, and live Pack2 definitions from `src/pack2-integration.mjs`.
- Builder dependency catalogs are not runtime registration: the 96-family/106-variant manual five-pack handoff and eight building PRs are expressly excluded. No IDs are synthesized.
- Numeric ID `76` (authored water) is registered in the live Pack2 source but its fluid geometry uses a non-box triangle-level selector. G1 explicitly lists it as `excluded:[{id:76,reason:'fluid-selection-adapter-not-certified'}]`; never generate a cube stand-in.
- Other registered ordinary materials, **130 installed biome130 definitions (001–130)**, and 17 supported nonfluid Pack2 definitions are validated at source, with conservative neutral rotation for stateful Pack2. Expected current merged-main baseline: **152 read-only records and one explained exclusion** (5 core + 130 biome + 17 nonfluid Pack2), subject to updated exact-head CI and source execution. No biome family **131+** may be synthesized from unregistered future source candidates.
- Baseline history: `main` at `440ab01a942bb3378d6ac2ff07945f4a9fb9861d` registered biome130 071–080; subsequently `main` at `1f67efc9805e83866549515ffdad4dc7e225b234` registered the complete 001–130 physical roster. G1 continues to read live `BIOME130_REGISTERED_IDS` dynamically; only the prior exact-80 native assertion and documentation were stale. Updated source-specific acceptance verifies the full actual 130-ID registry, no synthesized 131+ IDs, type-stable uniqueness, and all 152 expected records. No producer code is edited by G1.
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

The 21 dedicated native tests exercise the compiled production imports in GitHub CI (the revised source-specific registry test remains one test): provenance and ID exclusion, missing physical metadata, draft rejection, duplicates, typed IDs, rotation and anchor checks, deterministic snapshot revisions, read-only port surface and deep freeze. Local development used an **explicitly disposable stub for the imported production API**, so local passing tests alone do not prove live sources. CI must run the exact head against real repo modules and the full 20-script WebGL2 gate; record success/failure and exact SHA without inventing the outcome.

No G1 visual UI is attached; do not describe detached inventory screenshots or ordinary CI WebGL2 gates as physical-iPhone Creative Mode testing. There are no G1 save writes to test.

## Fail-closed completion conditions

- Any file outside the seven-path allowlist changed: stop, revert out-of-scope changes, recheck baseline.
- Any unresolved, unplaceable, candidate-only, unsupported physical definition or ID collision emitted: stop; never publish a partially validated catalog.
- Any new caller linking G1 into the live world, installation, storage or controls: stop; violates authorized G1 scope.
- Any native CI or full WebGL2 check pending/failed: report precise blocker, leave PR draft/unmerged/undeployed.
- No G2–G7 transition or production integration without separate creator approval.

**Approval state:** creator authorized G0/G1 development only. Neither CI success nor this note authorizes merge, deploy, changing `main`, enabling Creative Mode or unlocking v0.11.
