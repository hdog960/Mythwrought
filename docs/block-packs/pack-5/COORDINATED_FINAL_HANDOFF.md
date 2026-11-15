# Block Pack 5 — Coordinated five-pack integration handoff

**Owner:** Manual Block Pack 5 — Interiors & Specialty Architecture  
**Producer PR:** #148 (draft; remains unmerged and undeployed)  
**Target:** One coordinated integration of manual Block Packs 1–5, never independent production merge.

## Source and contract
- Exactly 18 physical symbolic families `pack5:079` through `pack5:096`; 2 authored variants per family and 4 90-degree orientations. Unique geometry, selection, collision and attachment requirements are provided by the existing physical catalog.
- Machine-readable source-owned manifest: `src/pack5-integration/final-integration-handoff.json`.
- Source-exact builder resolver: `src/pack5-integration/blueprint-handoff.mjs`; geometry: `src/block-packs/pack-5/`; construction adapter: `src/pack5-integration/live-adapter.mjs`.
- The final five-pack integrator must preserve legacy block IDs 0–8 and schema-1, resolve **all five namespaces together** before assigning a new production registry, validate building dependencies and placements against actual supports, and reject duplicates. Pack 5 does not assign global numeric IDs in isolation.
- Pack 5's per-seed checksummed and backed-up sidecar remains separate; imported objects are validated before persistence. No pack code may assume a new production save schema.
- Two-thumb rails, camera, chunk budgets and locked v0.11 remain untouched; all changes are isolated in draft #148.

## Acceptance evidence
- Dedicated source-authentic pack tests and live WebGL2 gallery, real-game 3-landscape screenshots and saved-shape reloads.
- A 64-brick real-game stress fixture reached **37 visible** under **2,013,984 GPU bytes** and **6 draw calls**; 28 were budget-excluded, not deleted. This does not guarantee all furnishings in a completed village render concurrently.
- The coordinated handoff regression exercises every family and variant, mixed-family saved layout and builder occupancy, attachment cells and GPU page limits.
- GitHub-hosted software Chromium and touch simulation are not equivalent to physical iPhone/Safari frame-time, memory and thermal acceptance.

## Release blockers — do not announce READY prematurely
1. **Exact head CI:** dedicated Pack 5, full-game and depth suites must all pass on the final candidate head.
2. **Hardware:** physical-iPhone two-thumb interactions, visible mixed-family interiors, target FPS, memory and WebGL context recovery still require explicit on-device evidence and creator review.
3. **Complete buildings:** 2 MiB Pack 5 drawing budget can exclude nearby pieces. The five-pack integrator must verify real mixed-family village, town and city blueprints, dependency/support resolution, collision and visual completeness without silently raising GPU limits.
4. **Registry:** a single cross-pack production registration / serialization strategy must be approved before final merge; the Pack 5 manifest intentionally leaves `numericId` null.

**Do not merge, deploy or mark READY while these checks remain open.** No edits to the other four manual packs or building-roadmap projects are authorized.

## Mixed-pack blueprint ingestion (Pack 5-owned, non-destructive)
- Use `inspectPack5InMixedBlueprint` from `src/pack5-integration/blueprint-handoff.mjs` for Roadmap 1 `placements` and Roadmap 2-style `voxels` objects. The helper extracts only Pack 5 dependencies and reports foreign symbols separately; it never edits their source or claims their geometry.
- When any Pack 5 item lacks an explicit four-way orientation or an authored variant, it is returned as **unresolved**, with no physical plan created. This deliberately avoids silently defaulting an unfinished village interior to north-facing furniture.
- Even an entirely physically resolved Pack 5 subset carries `readyForCombinedPlacement:false` until the final five-pack integrator validates cross-pack occupancy, structures, supports and overall construction performance. This helper does not merge, register or place anything in the game.

## Read-only placement preflight for the five-pack integrator

`preflightPack5BuilderPlan` in `src/pack5-integration/placement-preflight.mjs` accepts a Pack 5 physical plan and a seeded, read-only legacy world, with optional arrays of occupied cells from other packs and already placed Pack 5 objects. It reconstructs the source-authored geometry rather than trusting copied blueprint shapes. It reports occupied cells, legacy/foreign overlap, attachment supports, and height-bound violations without mutating any world, save, numeric ID, or other roadmap.

An external occupied cell does **not** by itself verify that a future cross-pack structure can support a wall, floor, or ceiling fixture. Missing legacy supports are marked `unverified-support` for the combined integrator. Even a preflight with zero issues explicitly returns `integrationReady:false` and `crossPackPhysicalAcceptance:false`; final five-pack support semantics and production registration must still be approved and tested.

The dedicated regression exercises authentic 36-variant mixed geometry plus conflict/forgery/boundary cases. These are developer-level acceptance aids, **not** proof of physical-iPhone rendering or settlement completion.
