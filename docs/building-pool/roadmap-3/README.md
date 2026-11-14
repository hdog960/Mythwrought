# Mythwrought Roadmap 3 — Industry & Fortifications

**State:** v0.10 Gate A; **M0 accepted, M1 has 30 authored theoretical candidate structures and geometry QA in progress**. Nothing in this pool is installed, spawned, merged or deployed. Only this roadmap's `src/`, `tests/`, and `docs/` subdirectories are owned by this development lane.

## Design allocation

11 types × 5 biomes × 3 sizes = **705 specifically allocated theoretical buildings**. The executable roster in `src/building-pool/roadmap-3/roster.mjs` is the authority: M2 = 225 blacksmith/armorer/carpenter designs; M3 = 240 stonemason/mining/lumberyard/mill designs; M4 = 240 watchtower/barracks/gatehouse/city-wall designs. Every type has **3 to 5 independent variations per biome and size**, not palette copies. City wall = **one entire closed settlement fortification per identity**, never one wall segment.

## Blueprint v1 authoring contract

Each future record must have a stable `r3:type:biome:size:variant` identity, `status:'theoretical'`, integral `envelope`, authored `modules` with full physical `[x,y,z,assetRef]` cell coordinates, clearance AABBs, real passable `openings`, named `spaces`, a connected `navigation` graph, and named `features` with coordinate locations. Foundation, floor, wall, and roof are mandatory; physically authored stairs are mandatory for vertical routes. A vertical navigation edge can climb only one unit per stair step. Interior headroom and walkway widths begin at **2 voxels** as a *Roadmap 3 authored design constraint*, **not** a claim about future engine/player collision dimensions. Full engine fit remains an integration dependency.

The `geometryFingerprint` excludes palette, biome and naming metadata, so copies recolored between regions cannot count toward the 705. All future designs must vary physical massing, circulation, openings, verticality or room geometry. `validatePool` rejects repeated shape. Only genuine authored voxel cells count as construction; `features` are location/dependency records, not completed physical geometry or functioning equipment. M1 must add representative blacksmith and watchtower buildings for all 5 biomes × all 3 sizes, then rigorously review route and structural logic.

## Materials and unresolved dependencies

`assets.mjs` is an exact-name **curated starter reference catalog**, not a claim that all 96 manual and 130 biome families have been integrated. Expand it only after verifying individual roster identity in [Issue #109](https://github.com/hdog960/Mythwrought/issues/109), [Issue #117](https://github.com/hdog960/Mythwrought/issues/117), and the current Pack 5 manifest. `builtin:*` identifies an already existing full-cube block. `pack1:`–`pack5:` refer to **manual physical family roster numbers**, while `biome130:` refers to the automated roadmap family's planning position. Future numeric IDs, shape dimensions and orientation remain explicitly `null`. Do not use prospective ID bands as production IDs. Forge fixtures `pack5:088` and chimney `pack4:063` are only candidate/planned components. Functional mill rotor/wheel, lifting gear, machinery and any dimensionless mounting assembly must remain named unresolved dependencies until their exact physical family exists; never fake them as completed block assets.

## Coordination & acceptance

Source main at M0 audit: `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, [incorporation checkpoint 006](https://github.com/hdog960/Mythwrought/blob/main/docs/INTEGRATION_CHECKPOINTS.md). Open automation incorporation PR #120 and manual PRs #112–115/#119 were reviewed; none owned this roadmap's directories. New automated assets on #118/#120 are candidates, not guaranteed runtime materials. Reaudit live main, issues, source packs, biome lane, and PRs before **every** session. Do not edit shared engine, integration ledger, world generation, maps, other roadmaps/packs, saves, controls or CI. No NPCs, military behavior, crafting or working machines.

**M0 local evidence:** `node --test tests/building-pool/roadmap-3/contract.test.mjs`: 11/11 passing under Node 22.16.0 on a local authored source copy. These tests are nested and **not automatically run** by main's existing `node --test tests/*.test.mjs` CI script. Review exact PR HEAD and arrange independently verified execution before declaring M0 acceptance. No genuine WebGL2/Chromium asset gallery or physical-iPhone verification is claimed because the initial milestone authors no production buildings/preview. Gate A stays open, v0.11 locked.

## Current M1 review slice (not live)

30 blacksmith/watchtower proposals exist at `src/building-pool/roadmap-3/m1.mjs`. Reviewed roofs now have meaningful single-cell shells/rafters, forge-aligned conceptual flues, upper tower braces and supported stair treads. Manifest count is **70,921** physical voxel-coordinate records. Dedicated `node --test tests/building-pool/roadmap-3/*.test.mjs` passes **33/33** locally on exact candidate source. Authored WebGL2 preview source lives under the owned nested test folder; genuine three-viewport browser screenshots and future installed-asset collision dimensions remain **UNVERIFIED**. The optional browser runner is not wired into the shared project CI, which this lane must never edit. Main checkpoint 008 automation activation is separate and excluded.

## Browser and winding QA follow-up

The roadmap-only diagnostic cube envelope preview now emits outward CCW triangle faces and uses ordinary WebGL2 back-face culling. Dedicated `node --test tests/building-pool/roadmap-3/*.test.mjs` is **33/33 native Node PASS**, including 30 exterior/cutaway winding checks. The optional 180-image real Chromium runner now checks framebuffer pixels and GPU/page errors instead of trusting screenshots blindly. Browser navigation is still blocked locally; **zero authenticated Chromium candidate images**. No actual finished symbolic-family shapes are implied.
