# The Forgotten Sands — Phase 0 authentic upper-section feasibility checkpoint (2026-11-23)

**Scope:** Direct original-source engineering, isolated from production. Do NOT merge, deploy, or change other lanes.

**Protected main:** `db4bbcc32156e5df311f733bcaa53d559c17313b`, released Desert V7 Phase 3.  
**Starting Phase 0 branch:** `f7c7d1c802c5ee57d629d2fbd0edd249261c2473`, source tree `fc821e43ccfd9a62e699def9d1ba724d207c943d`, original six prototype tests.  
**First upper probe:** `dff4d800e1c448997893b4c5363c8e61dafecce8`, source tree `4ad21639b25506c5272efbf87421a2b436e8597a`.
**Authenticated GitHub Action #45275522696:** SUCCESS; job #138046187914, 15/15 original-source Node22 tests passed, 4/4 changed-file syntax checks passed; run at exact `dff4d800` with full original repository. No broad CI rerun.

## Research results

The source-native research module `src/manual-biomes/forgotten-sands-upper-probe.mjs` imports the production `depth.mjs`, `depth-mesh.mjs` and `voxel.mjs` unchanged. It maps positive 16-cell slices (1: Y20–35, 2: Y36–51, ... 8: Y132–147) to the native negative section -1 coordinate frame, calls *the real meshDepthSection*, then shifts emitted vertex Y back into the exact world frame. The nine-float vertex layout and original depth-mesher neighbor culling survive. In focused native tests, a pair of blocks at Y19/20 and cross-chunk X15/16 / cross-section Y35/36 correctly omit invisible shared faces.

`createP0UpperOnlyView` is read-only and refuses unapproved whole-site occupancy. For all Y below 20 the original game world.get is authoritative; no generated underground foundation is published, no cave is overwritten, no schema-1 row is written, and no production height constant changes. The full proposed site is scanned above Y19, with a 150,000-voxel conservative cap, so the rare 111-wide colossal candidate is explicitly refused by this research acceptance path until a bounded site-index proof exists. Exact-footprint reservation and ground/support geometry are NOT certified. The wrapper forwards original M7 _columnPlan to preserve authentic terrain RGB eligibility, with a dedicated original mesh parity test in this checkpoint.

Proposed streaming selection reuses the actual original sectionWindow/sectionChunkRadius when not near a site: normal surface 25, mined near-floor breach 34. In an upper site research plan it uses surface [0,1] at 3x3 each (18 buffers) or active upper [s,s-1,s+1] (up to 27), and rejects simultaneous near-shaft/upper residency instead of silently requiring 43 buffers. No production queue or real GPU allocation has been changed.

## Strongest safety evidence and remaining blockers

- Real M7 FourRegionWorld, seed179: canonical read-through below 20, schema-1 edits, original restored M7 data and original raycast/collision on high-world overlay are covered by an authenticated native test.
- Real legacy VoxelWorld seed2026: upper native mesh finite and bounded; unchanged save/restore; original untouched.
- Whole-site source preflight rejects seed mismatch, existing upper occupancy, reservation veto and over-budget colossal scanning. Original cave AIR below Y20 cannot be overwritten by this upper-only projection.
- No production branch, generator, save schema, clock, biome, mob, automation, builder catalog or cave system has been altered.
- **Unproven:** anchored foundation design, original cave-preservation veto for underground construction, global deterministic site index and disjoint landmark reservations, integrated gameplay chunk queues, GPU upload/memory, actual iPhone WebGL2, PWA, building/mining inside finished monumental structures. Do not claim any full Pyramid or Phase 0 acceptance yet.

## Development continuation

1. Revalidate GitHub exact research head and reuse successful run #45275522696 rather than repeating it. Read this handoff and confirm the fresh RGB parity run's exact SHA/status.
2. Once RGB parity is green, isolate a terrain-following **grounded footprint** proof with original M7 geology/cave/landmark and player-edit authority. Do not generate anything below Y20 without whole-site protection.
3. Investigate a bounded site-index representation for colossal footprints that does not need scanning 500k+ cells on the main iPhone render thread.
4. Build an opt-in original-game renderer slice and benchmark real WebGL2 + iPhone/Home Screen update path *before* discussing production integration.
5. Coordinate expensive validation and never merge/deploy/cancel other developer work without authorization.
