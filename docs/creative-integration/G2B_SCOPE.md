# Mythwrought Creative G2B — Live Flight Attachment Scope

**Explicit creator authorization:** G2B only, stacked from accepted G2A PR #209 on isolated branch integration/creative-flight-g2b-20261116, draft PR targeting G2A branch. No G3, no merge, deploy, saves, v0.11 unlock or asset registration.

## Exclusive write allowlist (exactly 10 paths)

- src/main.mjs — minimal source-backed flight interface, input handoff, GPU readiness, safe landing
- index.html — accessible opt-in flight toggle and four-speed select in existing settings
- styles.css — flight-state labels inside existing external grip layout
- tests/creative-integration/g2b-physics-stream.test.mjs
- tests/creative-integration/g2b-input-safety.test.mjs
- tests/creative-integration/g2b-feature-off.test.mjs
- tests/creative-integration/g2b-browser.mjs
- tests/creative-integration-g2b.test.mjs
- docs/creative-integration/G2B_SCOPE.md
- docs/creative-integration/G2B_ACCEPTANCE.md

**No changes** to production main, G2A four modules or its 11 files, G1 draft registry, Creative prototype PR #186, src/physics.mjs, src/depth.mjs, src/chunks.mjs, src/voxel.mjs, src/input.mjs, src/camera.mjs, src/exploration-map.mjs, renderer, worker, CI, persistence, manual Block Packs, builders, or automation producer branches.

## Current production-source adapter contract

- Real full player AABB checked through existing collides(world,x,feet,z). Includes Pack 2 state, biome130 occupancy, Pack 3, manual 1/4 and Pack 5 overlays. Any collision reader exception blocks movement.
- Real GPU residency checked against the existing chunks Map for all horizontally straddled 16-cell chunks and both player-height vertical sections, not merely terrain generation or scheduled pending meshes.
- G2A prefetch region keys use cx,cz,section; GPU surface mesh keys are cx,cz while deep mesh keys are cx,cz,section. Translate using depthMeshKey. A prefetch proposal can enter only existing wanted/pending queue; no extra unbounded queue or new renderer. Bounded two proposed requests/update, six G2A pending; preserve actual 25 surface, max 34 breach, 27 underground GPU chunk budgets.
- World heights limited to source WORLD_MIN_Y through WORLD_MAX_Y+1 player feet. Air just above uppermost voxel uses surface section 0, not a fabricated new vertical GPU section. Higher flight blocked until separate physical/source approval.
- Feature OFF on every new session; not persisted. No G1 inventory or G3 registration.
- Normal MOVE/LOOK/HOLD AIM and original MINE/PLACE/JUMP handlers preserved in Explore. In flight, same MOVE/LOOK, MINE->hold DOWN, PLACE->hold UP, JUMP->LAND. Separate touch ownership, pointer release/cancel/blur/hidden/context-loss safety; keyboard WASD/Q/E/Space; guarded keyboard accessibility actions.
- Minimap remains discovered-only, tap-to-expand in world viewport upper-right; opening map pauses flight input.
- Landing search max 13 local columns, at most 32 units drop, backed by collides ground support and swept 0.25 step physical/reloaded safety. Missing safe candidate leaves hover and flight-owned controls. World restores, seed changes and mirror/backup imports invalidate old flight and follow existing safe newPlayer grounding.

## G2B limits and stop rules

No source tests count as a physical iPhone test; no CI WebGL2 regression alone verifies real flight. Separate G2B source-specific genuine Chromium harness covers six landscape sizes with WebGL2, CDP three-finger touches, mode gating, profile selection, landing, minimap and save parity. Exact-head full 20-script GitHub CI also required.

If any test cannot run in existing infrastructure, report it as a blocker rather than calling acceptance complete. Do not expand shared write scope, force-push, merge, deploy or unlock v0.11.
