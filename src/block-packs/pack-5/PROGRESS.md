# MYTHWROUGHT Pack 5 — Interiors & Specialty Architecture: development ledger

## Coordination reverified — 2026-11-14
- Latest verified main: `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84` / incorporation checkpoint **006**.
- Creator-led manual pack ownership checked: Packs 1–4, their current manifests and draft PRs #113/#114/#112/#115.
- Automated biome130 catalog checked against Issue #117 and catalog PR #118; unrelated desert, underground, dungeon and raw-species candidates are NOT Pack 5.
- Rechecked coordination Issues #109/#117. No active placeable IDs above 8 on main. No overlapping Pack 5 source ownership observed.
- Pack 5 draft PR: [#119](https://github.com/hdog960/Mythwrought/pull/119). Exclusive branch `manual-pack-5-interiors-foundations-20261114`.
- **No persistent numeric block IDs allocated.** 209–254 remain unassigned; 255 sentinel; biome130 256–385 forward-only.
- No changes to main, engine, save schema, renderer, shared tooling, minimap, controller, worldgen, checkpoint, CI or automations.

## Milestone 0
- Complete as a source foundation. 18 symbolic roster records `pack5:079`–`pack5:096`; independent shape/placement fixture and browser smoke source.
- Earlier baseline GitHub Actions [run 43639264156](https://github.com/hdog960/Mythwrought/actions/runs/43639264156) is **SUCCESS**, but root CI does NOT include nested Pack 5 tests.
- Native Node 22.16.0 foundational fixture: 16/16 cases passed before Milestone 1.

## Milestone 1 — source authored; visual/production acceptance remains OPEN
**Three original physical CANDIDATE families; six authored mesh and material variants. Not integrated.**
- **79** Plaster & Stucco: wall-mounted chalk-lime and raised hand-troweled finishes, thin real geometry with wall-support direction and cladding-only collision.
- **80** Fired Brick Masonry: kiln-fired running-bond and vertical soldier-course manufactured bricks, actual mortar/brick faces, with substantial masonry collision. Not Pack 1 stone brick or Pack 3 clay roofing.
- **81** Ceramic Interior Floor Tiles: sunburst-encaustic and moonwoven-glaze arrangements with patterned raised ceramic details, shallow floor-support and partial collision. Not Pack 2 paving or biome130 underground calcite mosaics.

**Physical contracts:** 0–3 Y-quarter-turn variants per placed cell with original symbolic identity, physical box selection/removal, honest wall/floor/standalone occupancy, reversible candidate-only fixtures. Variant-selected fixture snapshots use a sixth test-only field while the original five-field rows remain valid; no production schema-1 save changes. Invalid variant restore rolls back atomically.

**Mesh evidence (isolated authored box preview, NOT live GPU timing):**
- 079 chalk-lime: 8 boxes / 96 triangles; hand-troweled: 12 / 144.
- 080 running bond: 15 / 180; soldier course: 20 / 240.
- 081 sunburst: 17 / 204; moonwoven: 15 / 180.
- Exact committed source blobs: `architectural-surfaces.mjs` `0bb60d87642d36fa9ed632af34eada47463f76d8`, fixture `1956e096ba9b3c13ab20aac596c87c493eda1d52`; dedicated Node tests `architectural-surfaces.test.mjs` `47a58200f19cbfbd086a8616f964dabf5a67cdd4`, original fixture regressions `4a463281212fa2ce04e8afe1727f227a512cb6a0`.
- **Native Node 22.16.0: 34/34 PASS** for `node --test tests/block-packs/pack-5/*.test.mjs` in the local isolated Pack 5 checkout; source/test blob hashes matched remote branch, and local manifest was semantically aligned. 18 new tests + 16 original.
- **Chromium/WebGL2: NOT VERIFIED.** Installed Chromium headless failed EGL/ANGLE GPU initialization and timed out. No authentic new screenshots; the 6-card WebGL2 gallery is SOURCE ONLY at `tests/block-packs/pack-5/architectural-gallery.html`.
- No physical iPhone testing, no creator visual acceptance, no game-level targeting/collision/save checks. Root GitHub Actions does not discover this nested suite and must not be reported as Pack 5 acceptance.

## Shared engine dependencies / next session
1. Keep current three M1 entries `CANDIDATE` until true gallery rendering and creator visual review, then run full mobile viewport/browser QA if available.
2. Central integration must design/approve extended numeric registry and shape-aware raycast/collision, support/rotation/variant state and backwards-safe schema-1 persistence. Do **not** implement these in Pack 5.
3. No switching to Milestone 2 as accepted until outstanding M1 acceptance is transparently addressed; if browser remains blocked, continue source-only candidate work with blockers clearly reported.
4. v0.10 Gate A remains OPEN; v0.11 LOCKED; never merge/deploy/place world assets without separate authorization.
