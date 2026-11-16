# Mythwrought Creative Mode — G0 authorized isolation

**Creator authorization:** G0 branch setup and G1 **read-only** registered-placeables development only. This document does not authorize the later G2–G7 stages, live integration, merges, deploys, save changes or a v0.11 unlock.

## Verified GitHub entry

- Repo: `hdog960/Mythwrought`; main at `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db` when branch created (2026-11-16).
- Separate branch: `integration/creative-registry-g1-20261116` with parent exactly the above `main` commit.
- Detached Creative Mode reference PR [#186](https://github.com/hdog960/Mythwrought/pull/186) at `6222efa17acb0863fea42574be9748760dd877f0`, draft/unmerged, 65/65 Creative-owned. Its [M8 GitHub Actions #43802588966](https://github.com/hdog960/Mythwrought/actions/runs/43802588966) passed.
- Baseline is v0.10 Gate A. The later v0.11 release remains locked.

## Exactly seven authorized integration-PR files

1. `src/creative-integration/registry-snapshot.mjs`
2. `src/creative-integration/registry-validation.mjs`
3. `tests/creative-integration/registry-snapshot.test.mjs`
4. `tests/creative-integration/registry-provenance.test.mjs`
5. `tests/creative-integration-g1.test.mjs` (existing root `tests/*.test.mjs` runner bridge)
6. `docs/creative-integration/G0_SCOPE.md`
7. `docs/creative-integration/G1_ACCEPTANCE.md`

**Shared source is strictly read-only.** `src/main.mjs`, `src/blocks.mjs`, `src/voxel.mjs`, `src/biome130-registry.mjs`, `src/pack2-integration.mjs`, Pack 1–5 physical registries, builder 1A–4B, the five automations, CI and PWA, controls/camera/physics/chunks/renderer, service worker, storage and schema-1 ownership are not writable under this approval. No other module may be registered or installed into the game. Never merge/deploy this branch at G1.

## G1 interface and future authority

The detached PR #186 keeps `mythwrought.creative.adapters.v1` unchanged, with `CREATIVE_ENABLED_BY_DEFAULT=false`. G1's separate read-only envelope has `mythwrought.creative.registry-snapshot.v1`. It is **not** the enabled runtime adapter and does not import the draft Creative Mode PR.

- `readRegisteredSnapshot()` reads only the *merged main's* `BUILD_MATERIALS` whitelist and corresponding physical definitions. It returns immutable `{abi,readOnly:true,origin,revision,records,excluded}`.
- `getCatalogRevision()` returns a deterministic change detector; it is **not** a cryptographic signature or creator-approval attestation.
- `readOnlyRegistryPort()` exposes only `readRegisteredSnapshot`, `getCatalogRevision` and async `listPlaceables`; no edit, save or runtime-enable API is created.
- Records preserve numeric/string ID types, verified name/category, source producer, selection and collision boxes, occupancy anchor, support policy and explicitly supported orientations.
- Even perfectly shaped test rows are **not** proof of runtime registration. Only this narrowly audited code path obtaining actual `BUILD_MATERIALS` plus source-owned matching physical readers can claim G1 inventory eligibility. Producer-owned placement support and collision still require G3 authorization before live editing.

This initial read-only snapshot intentionally omits manual Packs 1/3/4/5 construction catalogs and draft building PRs. Their reserved builder IDs/geometry are not proof of live placement authority. `Pack2` fluid ID 76 has a triangle-level authored fluid selection with `boxes: []`; it is **explicitly excluded** until a dedicated non-box fluid selector is accepted. The other Pack2 entries expose neutral rotation only pending producer-specific state validation. This omission is documented, not silently substituted with a full cube.

## Rollback / stop conditions

G1 creates no runtime mounts, world edits, saves, assets or deployment artifacts. On invalid or duplicate IDs, unknown runtime material families, unsupported physical metadata or source/API drift, the snapshot throws before returning records. If exact-head CI fails, do not merge or proceed to G2. Reverting the *separate draft branch* suffices; existing world bytes are never changed.

G1 completion requires exact-head scope review, root Node suites, repository CI, full WebGL2 gate where required, and report of which IDs were withheld with reasons. A future G2 flight/input/streaming bridge, G3 cross-owner edits, G4 saves and release gates require separate creator approval.
