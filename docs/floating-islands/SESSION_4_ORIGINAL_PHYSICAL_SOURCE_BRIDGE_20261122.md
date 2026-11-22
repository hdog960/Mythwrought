# Floating Islands — Session 4 original physical source bridge checkpoint (2026-11-22)

## Protected references and availability

- Verified initial protected production `main`: `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Verified initial isolated research HEAD: `a6356250dabff335d8c9e28df6a5198f99555d62`.
- Branch: `research/floating-islands-sky-runtime-adapter-20261122`.
- Initial branch, PR and commit searches found **no pushed Codex Floating Islands generator source**. Do not invent a Codex source commit, sky saved-edit format, output screenshot, generator benchmark, or world-wide island count.
- `src/main.mjs`, `src/voxel.mjs`, original G2, the registry, user world saves, deployments, workflows, other developer branches and production main were **not changed**.

## Engineering work added

1. `src/floating-islands/sky-original-core.mjs`: read-only material and physical-world adapter for the **original** `biome130Block`, `isBiome130BlockId`, `biome130Color`, `prototypeSurfaceMesh`, `environmentGround`, `collides` and `raycast` contracts. The material hooks preserve original face colors, 9-float vertex-compatible material IDs, true partial occupancy and non-solid foliage. A bounded 64-key original shape surface cache and fail-closed unknown numeric IDs prevent fake full-cube fallbacks.
2. Authentic original catalog identities were verified from source files: pine trunk 370 / needles 379, Moonwillow 376 / silverleaf 385, Blackwood 375 / thornleaf 384, original Star-moss ground 287. Descriptive canopy styles can use these **actual physical IDs**, subject to registry name/solid-status validation. Unsupported original grass, shrub, fern and flower equivalents remain **UNMAPPED**; invented ID substitutions are explicitly rejected.
3. `createSkyOriginalWorldView` keeps original `groundWorld.get` at Y<=19, reads sky generator/sidecar overrides at Y20..256 including AIR=0, and returns AIR above 256. Rotations also respect each source. The original ground shape-overlay collision hooks are forwarded. Crucially, original `raycast` only uses its shape-aware path when `biomeCellCount>0` or Pack2 exists; the read-only sky view forces that mode without changing `groundWorld.biomeCellCount`.
4. `src/floating-islands/sky-original-host.mjs` imports genuine production modules directly, and composes source-backed `world`, original `physical` queries, original registry `materials`, `meshSection`, and `planPhysicalFoliage`. It is **NOT connected to `src/main.mjs`** or Codex's unavailable generator. It does not write to world, GPU, caches beyond its private bounded mesh cache, persistence, or PWA.
5. `tests/floating-islands/sky-original-bridge.test.mjs` has eight committed local Node tests of the pure bridge with original-contract fixtures. `tests/floating-islands/sky-original-native.test.mjs` has three separately written full-original-source tests (registered assets, actual `VoxelWorld` collision/raycast/source meshing/mining, non-solid needles) that are explicitly **UNRUN** until an authentic complete checkout or targeted Actions lane is available. Do **not** classify those three as passing.

## Test provenance and CI anti-clog

- Local Node `v22.16.0` new focused committed fixture tests **8/8 PASS**:
  `node --test tests/floating-islands/sky-original-bridge.test.mjs`.
- A larger 14-test exploratory fixture suite of the same exact committed core source was also **14/14 PASS locally**, but is not the committed test file.
- Original 75 earlier focused tests were verified in Session 3 on the prior exact HEAD; the untouched original test/source portions were **not redundantly rerun in this session**.
- New full-source original `sky-original-native.test.mjs` **3 UNRUN** (syntax check passed locally). Source-direct facade imports were source-inspected but **not executed** in the absent complete repository checkout.
- All three new/updated source/test files copied from local authored code have exact Git blob SHA equality against the GitHub branch. New native source test syntax also passed `node --check`.
- No GitHub Actions, broad Chromium/WebGL2, iPhone Home Screen PWA, full `npm test`, or browser tests were launched.

## Next short-term engineering

1. Obtain the actual Codex generator and verify its section layout, sky cell IDs, sky rotation/edit keys, worldwide density, saves and physical voxel geometry. Adapt rather than overwrite it.
2. Run `node --test tests/floating-islands/sky-original-native.test.mjs` **once on authentic full original checkout**, inspect any failures, and correct the original registry/physics bridge as necessary. Only then consider targeted browser acceptance.
3. Connect the detached host to the existing renderer-owned chunk queue and G2 dual-world readiness/flight swept collision; preserve the shared surface/sky GPU budget, upload rollback and zero new surface shadow passes.
4. Real-world smoke tests: actual authored island cliffs/vegetation, no ground-darkening surfaces, two original seeds and +/-10,000 block exploration, actual Edit AIR/placement save reload, physical shapes, original day/night and iPhone performance. Do not declare these accepted before an original-game test.
5. Feature completeness: missing *physical* ferns, flowers, shrubs, windgrass remain open choices; no fake render-only meshes or unrelated developer catalog edits. Long-term island mobs/structures stay on hold.

## Branch safety

No merges, deploys, branch/cancel changes to other developers or production. Tests remain targeted until original integration actually justifies a more expensive acceptance pass. The source-only bridge checkpoint is **not a playable build**.
