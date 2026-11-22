# Roadmap A — original Pack5 conservative opaque-seam preview planner

## Scope and immutable source lineage

This is a **new source-only engineering primitive**, developed on isolated branch `roadmap-a-pack5-physical-release-blocker-matrix-20261121`, after original physical cost envelope HEAD `f7059021f91405db5926632e35e023e3c0073203`. No changes to the 79 original commerce source blueprints or protected 207-record A5 ledger. No selection of any physical variant or orientation for any original A5 building. No real gameplay registration, actor, settlement, save/schema1/PWA, source biomes, 5 automations, or other builder work.

The original real Pack5 fired-brick masonry has a **full-cell collision box** but dozens of separate, source-authored relief boxes with genuine material colors. Thin tiles are full-width *floor surfaces*, and plaster is a wall-mounted thin layer. The old 75–97 million hypothetical triangle envelope assumed one individually rendered, unmerged original material per corresponding source cell and is **NOT** an observed game GPU cost. That conditional scenario motivated a safe preview-only face-pair detector rather than arbitrary material substitutions or unverified game optimizations.

## Real engineering

**New core: `src/building-pool/roadmap-2a/roadmap-a-physical-source-seam-core.mjs`**

Input: only a bounded list (default 96 fixtures, 8192 source art boxes) of **explicitly supplied isolated Pack5 preview assets**. Each fixture must provide source symbol, an explicitly named variant, an explicitly named quarter-turn `orientation`, integer test-only anchor and fully opaque physical author-box material data. Rejects source blueprint IDs, unknown/omitted variants, duplicate anchors, transparent art, invalid AABBs, out-of-range anchors, and size overruns.

- Enumerates actual original AABB planar faces by axis, oriented outward normal, exact rounded plane coordinate and both in-face intervals.
- Proposes a potential seam pair only when TWO different, explicitly specified test assets have **identical original Pack symbol, authored variant, orientation, material and opaque RGBA**, with **exactly coincident opposing full rectangular faces**.
- Does **not** cull partial coincident patches, different-material seams, mismatched variants/orientations, same-asset internal detail, or unproven overlaps.
- Caps and deterministically reports original AABB count, source quads/triangles, potential opposite-face pairs, and conditional remaining unmerged triangles *if some future renderer elected to apply this proven conservative subset*.
- Never emits real mesh buffers, changes existing art geometry/collision/support, mutates a game world, modifies saves, or certifies source materials.

**Original physical producer adapter: `src/building-pool/roadmap-2a/roadmap-a-physical-source-seam-producer.mjs`**

Integrates actual immutable `PACK5_BUILDER_CATALOG`, `getPack5Surface`, `surfaceBoxMesh`, `PACK5_SURFACE_MATERIALS`, and `resolveManualFivePackAsset`. It requires caller-specified source-authored variant and yaw for a **preview fixture only** (never source building selection), reconstructs every real source art AABB from the original producer's rotated, indexed float mesh, checks that its visible-box signatures agree with the Manual Five Pack resolver, and verifies original per-box RGBA against source palettes. Failed source/prod geometry or opaque-color identity **blocks** the preview, not relaxes assertions.

No full 79-building Pack geometry is generated. Source A5 plaster variantless cells, clay/brick roof replacements, real structural backing and physical support remain unresolved as before.

## Native tests

- `tests/building-pool/roadmap-2a/roadmap-a-physical-source-seam-core.test.mjs`: **4 focused cases**, correct equal-face match (2 neighboring full cubes -> one potential pair, 24 original -> 20 conditional triangles), strict exclusion of partial/material/variant/offset mismatches, fail-closed bad/transparent/source-linked fixtures and bounds, deterministic pair count independent of fixture order.
- `tests/building-pool/roadmap-2a/roadmap-a-physical-source-seam-producer.test.mjs`: **4 further focused cases**, all six actual original source variants across all four rotations, real ceramic tile grout seam candidate, mismatched original variants excluded, no guessed variant or source building allowed. Requires complete original repository Pack5 source dependencies.

The **byte-identical GitHub committed pure core** has already passed **4/4 local native Node tests** in an isolated test runner, under `/mnt/data/roadmap_a_seam_dev`; blob SHA256 is NOT implied by the Git blob SHA. The producer adapter passed local `node --check`, but its original-repository-native tests are **not executed**: full source dependencies are unavailable locally. They require focused exact-head execution when feasible. No new PR, GitHub Actions workflow, broad 920-test suite or Chromium multi-viewport run was triggered. Original exact source evidence from PR390, PR396, PR401 and PR406 is reused only for unchanged source/producer conditions; no old CI claimed to validate this new code.

## Acceptance still explicitly blocked

`auditExactPack5SeamCandidates` and `auditExplicitPack5SourcePreviewSeams` emit potential *source-only candidate* pairs, not a modified rendering. They do **not** guarantee all hidden faces are found, make a production face-culling change, preserve source art acceptance in a live scene, or demonstrate an actual GPU triangle reduction. Any future renderer optimization requires separate real original-game WebGL2 visual tests, partial/mixed material coverage, collision consistency, mobile performance and creator art approval. All source variants for existing 79 provisional designs remain **unassigned**, and no road/town/citizen/world structures are placed.

Maintain production `main` at `7016e14cd6289f45eaf7fc6a79a362b47996df65`, protected OPEN DRAFT PR406 at `1d71f5e37891280a21c777e5189f0762014ed8a9`, 207/420 provisional A5 with 213 unwritten, historic 128 commerce/345 industry/315 government and all five automations untouched. Do not merge/deploy/cancel CI or alter required release gates.
