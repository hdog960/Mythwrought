# Mythwrought Pack 5 — Shared-file merge conflict handoff

**Producer branch:** `integration/pack5-builder-layer-20261114` (draft PR #148, not deployed).  
**Pinned upstream main examined:** `c512fcb9e6e82697cff0c5d26f073e503d51e4a5`.  
**Pinned Pack 5 producer source examined:** `dc18ce6dbe0e7f09ba1c27d0637055cfac9ad1cc`.  
This is an **integration instruction for the future single five-pack operation**, not permission to modify or merge `main` or another manual pack.

## Shared `src/main.mjs` — preserve both sides

1. Main's new **biome130 physical palette** is initialized immediately after `bindGameplayAction('place',...)` and uses a scrollable settings sheet. Keep it, its selection state, and its rotation-aware placement calls. Pack 5 adds independent, opt-in **family/variant/rotation settings** and must not steal or overlay either thumb rail.
2. Main calls `inspectBlockTarget(world,eye(),facing(),selected,player,selectedRotation)` and `applyBlockAction(...,{rotation:selectedRotation})`. Pack 5's earlier fork calls the legacy form without rotation. When combining, preserve main's rotation argument and edition/feedback behavior **for ordinary edits** and retain the Pack 5 physical furniture path as an explicit guarded alternative. Pack 5 must not downgrade regular placement/mine controls or loss-of-save behavior.
3. Pack 5 renders its source-authored nine-float WebGL2 stream **after** the ordinary chunk loop (`gl.drawArrays(gl.TRIANGLES,0,c.count)`) but before the selection outline, under the same camera, shader and depth settings. Preserve both main's later terrain/biome130 rendering and Pack 5's bounded 2 MiB/8-draw policy, and benchmark the *combined* memory. Do not replace registered biome shapes with cube impostors.
4. Pack 5 registers a world-specific **shape collision callback**, restores/exports/imports a separate sidecar, and resets the builder on world switches and WebGL loss. Reconcile every existing world-import, vault-restore, seed-switch and graphics-recovery path; recheck saved geometry with editor OFF after reload.
5. Test target HUD and mining: base-world rotation-aware picking and feedback must continue when Pack 5 mode is OFF. In Pack 5 mode, selection and removal must use physical surfaces; removing structural backing should not strand furnishings without an explicit builder migration rule.

## Shared `src/voxel.mjs` — critical correctness

Main uses 16-bit cached voxel indices and registered biome130 block IDs 256–312 with **non-full-cube, potentially nonsolid physical shapes**. It performs geometry-aware raycasts and body collision via `biome130Block`, `isBiome130BlockId` and saved rotations. **Keep all of that.**

Pack 5's earlier fork added a `world.pack5Collision(box)` invocation at the bottom of `collides(world,x,feet,z)`. The future integrator must append that optional Pack 5 shape-exact check **after** main's existing registered-shape collision logic, not restore the older `world.get(...)!==BLOCK.AIR` full-cube loop. Preserve schema-1 saves and the complete main terrain/rotation engine.

## Enforced boundaries / blockers

- Packs 1–4 and biome130 own their own symbolic catalogs; Pack 5 only resolves `pack5:079`–`pack5:096`. Resolve global IDs in the *combined* registry, never here.
- A foreign registered block occupying a cell is **not** automatically structural support. Use Pack 5's explicit `pack5StructuralSupport(cell,id)` certification and `verifiedStructuralSupports` preflight input, alongside cross-pack occupied-cell manifests.
- Both source streams currently have shared-file changes and GitHub reports PR #148 `mergeable_state=dirty`. Do not merge producer PR #148 independently. A combined integration branch must merge the actual semantics, run a full latest-main native + depth + Chromium acceptance, and check original two-thumb rails, exploration map, shape picking, WebGL loss and save coexistence.
- The current Pack 5 36-variant WebGL2 gallery and 512-item mixed-family native GPU tests are **candidate isolated evidence only**; they cannot prove real iPhone 60 FPS, thermal safety, complete settlement interiors or cross-pack gameplay acceptance. Keep Gate A and v0.11 restrictions.

No operations on other producers, other building roadmaps, main, deployment or automations are authorized by this document.
