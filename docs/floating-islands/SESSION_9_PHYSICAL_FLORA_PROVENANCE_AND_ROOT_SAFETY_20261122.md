# MYTHWROUGHT Floating Islands — Session 9 original-block flora and source-revision checkpoint

Date: 2026-11-22. Research-only, no production or Codex source changes.

## Exact source and protected refs

- Starting `research/floating-islands-sky-runtime-adapter-20261122` HEAD: `e0c2cb5a4cb6701715341c19f48db01f2bf46a5f`.
- Protected production `main` HEAD at the beginning: `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Read exact `docs/floating-islands/SESSION_8_SKY_SOURCE_PROVENANCE_FENCES_20261122.md` on GitHub and inspected original `src/biome130-registry.mjs` and its M10/M11 physical log/foliage definitions, including actual IDs 370/379 (pine), 375/384 (blackwood), 376/385 (moonwillow), and original M3 Star-moss 287.
- Initial branch/PR/commit sweep found no pushed Codex Floating Islands generator. A single direct local `git ls-remote` still fails DNS. The three earlier whole-original-repository `sky-original-native.test.mjs` tests remain **UNRUN**, not passing.
- Preserved original `src/floating-islands/sky-vegetation-physical.mjs` Git blob `769b2ac67f8bb552aeb8ecfb5a71acbec6fbf54b` was reconstructed byte-identically and **executed directly** in the new tests. It is unchanged by this checkpoint.

## Original source defect and isolated fix

The previous physical voxel proposal planner only required `sourceGet(x,y-1,z)!==0` as vegetation support. A decorative non-solid leaf cell or thin cutout moss can therefore allow an implausible floating tree if used directly. Its semantic `supported:true` status comes from a future generator and is not independent evidence of real support. A source cell or generator can also mutate during an ecology pass, so merely comparing keys after the pass is inadequate.

### New: `src/floating-islands/sky-certified-flora.mjs`

- Consumes a COMPLETE generator-certified island vegetation plan. Requires the real merged physical world reader, generator world identity/fingerprint, signed original seed, global authored edit revision, per-upper-section revision, original material registry, protected cell veto, and complete-island certification.
- Copies and freezes placement anchors BEFORE callback-based surface certification; rejects mutation of that immutable source plan.
- Independently checks support solidity and real authored multi-box geometry. A viable root needs a top physical face at local Y=1 covering at least 12 of 16 center-footprint samples. A nonzero but non-solid foliage/moss block or narrow log/post does **not** count as a stable floor.
- Filters out unsupported vegetation types rather than fabricating block IDs. Existing `planPhysicalSkyVegetation` still assembles deterministic *real physical voxel* trunk/canopy/moss proposals and rejects whole trees on collisions, authored edits or lack of headroom.
- Captures current source section revisions for every possible 3D canopy halo (up to 512 unique section keys), including negative and distant coordinates; requires source identity, global edited-world revision and every section revision to remain unchanged after planning.
- Returns **read-only proposals** and a source proof; 0 world writes, 0 save writes, 0 render-only meshes, 0 additional ground-shadow passes, no GPU allocations, no independent day/night cycle.
- This is not the missing Codex generator or a new procedural terrain implementation.

### New: `src/floating-islands/sky-original-flora-authority.mjs`

- Integrates original biome130 source `blockId`, `solid` and real `boxes` plus conservative actual legacy full-cube terrain IDs (1,2,3,4,6,8).
- Legacy leaf 7, crystal 5, AIR 0, unsupported numeric IDs and guessed plant variants are **not** recognized as valid tree roots. Star-moss 287 and pine needle 379 are explicitly non-solid even though mineable/selectable as individual physical geometry.
- `planOriginalSkyEcology` binds the planner's `get` to the genuine merged `physicalHost.world.get` so caller-supplied stale source-get callbacks cannot bypass sky AIR edits. Requires **object-identity equality** between claimed source world and the physical host world. Original source callbacks keep their original `this` context.
- No original source module is modified.

### New: `src/floating-islands/sky-original-flora-host.mjs`

- Detached, opt-in native integration facade importing actual `biome130Block`, `isBiome130BlockId` and original physical host/material definitions. It only forwards valid original-source references to the certification layer.
- Because complete repository imports remain unavailable locally, this final *direct-import facade* is **not native-executed**; the separately authored pure source-contract adapter and actual original `sky-vegetation-physical.mjs` are the exercised units.
- Not imported by production `src/main.mjs`; no renderer/G2/save integration is claimed.

## Test evidence, honesty, anti-clogging

- Local Node 22.16.0 **31/31 focused new tests PASSED**, executed on unchanged original `sky-vegetation-physical.mjs` and `sky-runtime-adapter.mjs` plus the two new isolated pure modules.
- Tests: Pine, moonwillow, blackwood and moss physical ID contracts; giant original terrain vs non-solid leaf/moss, narrow post and multi-box topped floor; signed world seed validation; immutable complete-surface admission; source-world pointer identity; source world-edit, generator fingerprint and section mutation during validation; 3D x/z/y eight-section seam halo; protected/mine-edited cell veto; whole-tree rejection rather than partial floating trunks; max 64 input and 512 actual cell budgets; +/-10,000+ coordinates; zero save writes/shadows; native-sourced merged-cell API.
- Existing Session 8 73/73 earlier tests and original deep/G2 GPU source checks are unchanged and were not redundantly rerun. The three pre-existing full original-world tests remain UNRUN. No GitHub Actions, original WebGL2, original iPhone Home Screen PWA, or Codex generator acceptance was performed.

## Next short-term work

1. Obtain Codex's actual pushed generator, exact section indexing, global revision/physical identity, true biome density and authoritative sky-edit storage. Do not replace or claim its unpushed source. Reconcile these **provisional** source-reader contracts with real code.
2. Run 3 existing whole-original-repository tests once on an authentic complete checkout when available, then test the final direct-import flora host against real biome130, original `VoxelWorld`/sky edits and original shape-prototype meshes.
3. Couple root-verified physical proposals with the source-attested GPU mesh producer and renderer-owner CAS, while maintaining two uploads/frame and <=25 authorized combined ground/sky GPU slots. Preserve 27/34 original underground cases; never create a new ground shadow pass or replace three-moon day/night.
4. Validate original generator island shapes and vegetation at both signs of 10,000-block coordinates, physically mine/place/restore exact upper AIR edits, iPhone WebGL2 GPU/FPS budgets, four phone viewports and installed Home Screen PWA before release approval.
5. Long-term island mobs, settlements and structures remain deferred indefinitely.

## Branch and release protection

Only add isolated `src/floating-islands/`, `tests/floating-islands/`, and this documentation. No main/other developer/automation/CI workflow changes, PR merge, deployment, CI cancellation or save mutation. Source-only research; **not a playable build**.
