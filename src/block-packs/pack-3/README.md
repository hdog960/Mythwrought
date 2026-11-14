# MYTHWROUGHT — Pack 3 isolated asset work

**UNMERGED CANDIDATE — NOT IN LIVE GAME.** v0.10 Gate A only. No map generation, structure assembly, central registry changes, shared engine edits, saves migration, crafting, NPCs, or deployment.

## Source-of-truth audit (2026-11-14)

- GitHub main: `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84` (integration checkpoint **006**).
- Issue [#109](https://github.com/hdog960/Mythwrought/issues/109) reserves Pack 3 candidate IDs **109–158**. Immutable existing IDs **0–8**. ID **255** is the unvisited sentinel.
- Read seven authorities `docs/01`…`docs/07`, `docs/INTEGRATION_CHECKPOINTS.md`, `docs/RELEASE_LEDGER.md`, `src/voxel.mjs`, `src/blocks.mjs`, existing `src/storybook-roof.mjs`, `src/physical-construction-kit.mjs`, and open shape PRs [#106](https://github.com/hdog960/Mythwrought/pull/106) / [#108](https://github.com/hdog960/Mythwrought/pull/108).
- Main's `storybook-roof.mjs` is **render-only**; live `VoxelWorld.set` refuses IDs above 8. Existing waystone/ruin/watchtower templates use existing IDs, not these independent roof parts.
- Exclusive dirs: `src/block-packs/pack-3/` and `tests/block-packs/pack-3/`. Check fresh main, other pack PRs and Issue #109 before further work.

## Asset-by-asset progress and unique persistent candidate IDs

| Roster | Candidate ID | Name | Status | Variants | Next/dependency |
|---:|---:|---|---|---|---|
| 23 | 109 | Wooden shingles | Isolated physical candidate | cedar scale surface | :00 registry/raycast/save integration |
| 24 | 110 | Clay roof tiles | Isolated physical candidate | fired barrel-tile surface | :00 registry/raycast/save integration |
| 25 | 111 | Slate roof tiles | Isolated physical candidate | cleft blue-grey slate surface | :00 registry/raycast/save integration |
| 26 | 112 | Thatched roofing | Isolated physical candidate | thick golden straw surface | :00 registry/raycast/save integration |
| 27 | — | Roof stairs/slopes | Not started | — | :12 rotational shape contract |
| 28 | — | Roof corners | Not started | — | :12 corner shape contract |
| 29 | — | Roof ridge | Not started | — | :12 ridge profile contract |
| 69 | — | Castle wall sections | Not started | — | own distinct fortified unit |
| 70 | — | Battlements | Not started | — | not Pack 2 parapet |
| 71 | — | Stone buttresses | Not started | — | anchored physical projection |
| 72 | — | Ornamental columns | Not started | — | not Pack 1 pillar |
| 73 | — | Decorative cornices | Not started | — | protruding separate trim |
| 74 | — | Large arched windows | Not started | — | surround only; Pack 4 glazing |
| 75 | — | Carved stone reliefs | Not started | — | face-mounted physical panel |
| 76 | — | Aqueduct channels | Not started | — | physical containment only, no fluid engine |
| 77 | — | Crystal spires | Not started | — | separate from CRYSTAL 5 |
| 78 | — | Carved statues | Not started | — | selection/removal per piece |

**No unassigned ID is promised or counted as completed.** Each roofing family has multiple genuine raised/layered box parts; its collision and selection boxes are *the exact same occupied volumes* as preview geometry. Box count remains below the :00 32-box contract. Color palettes are candidate material metadata only, not installed shader code.

## Opt-in preview and test fixture

- `roofing-materials.mjs`: four stable ID/geometry/material definitions.
- `manifest.mjs`: 17-family ownership/duplicate-audit ledger.
- `fixture.mjs`: isolated manual place, remove, inspect geometry, and save/restore demonstration.
- `preview.html`: optional gallery depicting actual box parts (not a screenshot of the live WebGL game).
- Reproducible isolated regression: `node --test tests/block-packs/pack-3/roofing.test.mjs`.
- The existing `npm test` script only globs `tests/*.test.mjs`; this nested suite needs an explicit invocation. Do not claim CI exercised it without evidence.

**Honest integration boundary:** the fixture writes `{schema:1,seed,edits}`-shaped candidate samples, but the live `VoxelWorld.restore` currently **rejects IDs 109–112**. Rotation is locked at 0 for these surface candidates; the existing schema has no orientation state. For the non-cube roof stairs/corners/ridges, require merged :12 shape geometry and :00 selection/collision/save handling before promising rotation persistence. Do not use these fixture snapshots as player saves. Integration must preserve existing player data and fail closed for unsupported states.

## Session handoff

Milestone 0: verified authorities/contracts, dedicated manifest and isolated fixture; candidate module authored. Milestone 1: **four isolated original material/physical geometry candidates authored**; tests and preview to be verified; **not approved or integrated**. Milestones 2–6 remain open. Branch and exact PR HEAD live in the reviewable PR; never infer a later HEAD from this initial audit.

No actual iPhone or live-world verification. Manual creator incorporation only, after independent tests and explicit approval.
