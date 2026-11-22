# Floating Islands — Session 2 physical renderer bridge checkpoint (2026-11-22)

## Exact parent and source provenance

- Isolated branch: `research/floating-islands-sky-runtime-adapter-20261122`.
- Verified parent head before this session: `7031e3a157ac571ce5c217987eddfe753bf020f2`; production main `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Repository searches of branches, PRs and commits found no Codex-generated Floating Islands branch/source. The attached screenshot is **not** a checkout of Codex's generator or upper edit save code.
- Existing source blob hashes matched local Native Node 22.16.0 copies before reuse. Existing focused tests reverified 22/22 **once**. No full suite, Actions run, browser test, or PWA deployment occurred.

## Added source-only components

### src/floating-islands/sky-source-mesh.mjs

Consumes callbacks supplying **actual** global voxel IDs, real full-cube/opacity metadata, and per-face original palette/material information. Builds physical opaque triangle vertices using the original **nine floats / 36-byte stride**: three position, three RGB, two UV, one material. Reuses original six face orientations and side lighting coefficients. Reads neighbors across x/z chunk and Y-section seams. Bounds source reads with an 18x18x18-ish 1-cell halo and enforces at most 24,576 vertices (884,736 bytes) per section.

The `createSkyIslandSourceView` read-only bridge prefers separate sky edit overrides, including AIR zero, and uses the authoritative ground reader at Y<=19. Source provider above Y256 must remain AIR. Shaped noncube blocks are intentionally **rejected** until they can be meshed by the original game-owned multi-box physical shape pipeline; no decorative silhouette substitutes for interactable voxels.

Two-section preparation is bounded to 2 MiB of staged vertices per batch and returns no mesh batch on any source/mesh budget failure. No world edits or GPU buffers are changed.

### src/floating-islands/sky-gpu-transaction.mjs

Consumes source-verified staged meshes and production-compatible `uploadChunkBuffer(gl, vertices)`. Builds a **new** desired resident Map of at most 25 slots, staging no more than two new buffers. On a partial upload failure, deletes already staged buffers and leaves the original resident map intact. Returns `nextChunks`, `stagedBuffers`, and `obsoleteBuffers` for **renderer-owned** publication: publish the replacement map first; dispose old buffers only after successful publication. The staging adapter never claims live WebGL commit.

### src/floating-islands/sky-edit-invalidation.mjs

Plans all loaded upper section mesh invalidations on physical sky edits, respecting negative x/z boundaries and both sides of vertical section boundaries. A Y19 ground edit or Y20 sky edit can affect the shared ground/upper seam, so it identifies resident ground mesh keys too. No save or GPU mutations.

## Native focused acceptance

Local Node 22.16.0 test execution: **47/47 passing** combined, comprising 22 unchanged baseline tests and 25 new focused tests (14 physical mesher, 5 staged GPU transactions, 6 edit invalidation). Syntax of the three new source files also passed Node's `--check` parser.

The 25 new tests verify physical vertex array counts and 36-byte stride; x/z and vertical seams; source edits that remove/add physical cells; authoritative Y19 read and Y20 face culling; dense slab bounding; negative/distant coordinates beyond 10k; fail-closed unsupported shapes/malformed materials/budgets; two-job atomic staging; WebGL upload rollback preserving a 25-slot old map; Y19/20 and Y35/36 edit invalidations.

All six new source/test blobs were created on GitHub and matched local `git hash-object` exact bytes. This is **not** an original-game WebGL2, production VoxelWorld, actual Codex generator, iPhone FPS, island geometry quality, world-scale spawn frequency, or PWA acceptance result.

Run this targeted command (not base `npm test`) at this branch:
```sh
node --test tests/floating-islands/*.test.mjs
```

## Dependencies and next action

1. Obtain Codex's actual pushed island generator, exact higher-section schema, and sky save format. Only then adapt the provisional Y20..Y256 section reader and edit-map assumptions.
2. Replace test source callbacks with original source-backed `world.get` or Codex sky voxel reader. Wire original real biome130 material and shaped-geometry engine; do not silently turn voxel variants/vegetation into full cubes.
3. Integrate source meshing and sky GPU transaction into the renderer-owned queue with a true shared residency budget, retained terrain priority near ground, rollback on WebGL faults, and original fog/daylight uniform usage. No new ground-shadow pass.
4. Integrate Creative G2 flight with real upper section identity and body/readiness checks, without aliasing negative underground section IDs. Verify no clipping or unloaded void crossing.
5. Verify mining and placing sky cells through actual original collision, raycast, separate saves, and vertical/horizontal rebuilds. Then original WebGL2 screenshots and iPhone Home Screen PWA performance; coordinate expensive CI with other developers.
6. Preserve short-term scope: beautiful, organic vegetated islands discoverable thousands of blocks from spawn and no oppressive surface shading. The long-term structures/mobs roadmap stays on hold.

## Cross-lane protections

Source-only additions to the already isolated research branch. No existing game files, Codex work, hourly automation code, other 12 developer tracks, main, saves, CI workflows, page deployments or PR states were changed. Do not merge or deploy without creator approval. Reuse exact-commit CI results and do not duplicate browser tests to create activity.
