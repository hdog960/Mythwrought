# Pack 5 — Milestone 1 technical candidate acceptance (creator review remains OPEN)

## Coordination & scope (2026-11-14)
- Main verified at `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`; checkpoint **006** is newest.
- Rechecked GitHub Issues [#109](https://github.com/hdog960/Mythwrought/issues/109) and [#117](https://github.com/hdog960/Mythwrought/issues/117), Pack 1–4 current draft manifests/PRs #113/#114/#112/#115 and automated biome130 catalog PR #118.
- Dedicated Pack 5 draft PR [#119](https://github.com/hdog960/Mythwrought/pull/119). No other developer files, shared engine/registry/physics/saves, CI, controller/minimap, worldgen or automations touched.
- Persistent IDs **NOT ASSIGNED**. `pack5:079`–`pack5:096` are symbolic roadmap keys; live main accepts 0–8, 255 is an internal sentinel, 209–254 unassigned; biome130 256–385 future-only until approved widened IDs.

## Authored families — 3/18 CANDIDATE, 15/18 NOT STARTED
| Symbolic ID | Physical family | Two distinct geometric material variants | Geometry / attachment |
| --- | --- | --- | --- |
| `pack5:079` | Plaster & Stucco | chalk-lime, hand-troweled | physical thin front wall facing, wall backing required, selection and partial collision |
| `pack5:080` | Fired Brick Masonry | hearth running bond, kiln soldier course | raised manufactured brick courses over true masonry core, independent targeting, solid collision |
| `pack5:081` | Ceramic Interior Floor Tiles | sunburst encaustic, moonwoven glaze | distinct 2×2 and 3×3 raised floor tile composition, thin headroom-preserving floor collision |

**Not duplicates:** plaster/stucco is manufactured wall finishing, not biome130 desert adobe or Pack 1 stone masonry. Fired kiln brick is neither Pack 1 stone brick nor Pack 3 clay roofing. Ceramics are interior tile geometry, not Pack 2 path/paving or biome130 cavern calcite mosaics. All six art/shape signatures differ, rather than shader-only re-labeling.

## Genuine source-backed technical results
- `node --test tests/block-packs/pack-5/*.test.mjs` executed in native **Node 22.16.0: 43/43 PASS** (16 M0 fixture, 18 M1 material/fixture, 9 additional M1 acceptance cases).
- Exact Github blob parity checked for both source and tests:
  - `architectural-surfaces.mjs`: `333314a970c9810e960b541d23659c828f3796ae`
  - `fixture.mjs`: `1956e096ba9b3c13ab20aac596c87c493eda1d52`
  - `architectural-surfaces.test.mjs`: `47a58200f19cbfbd086a8616f964dabf5a67cdd4`
  - `fixture.test.mjs`: `4a463281212fa2ce04e8afe1727f227a512cb6a0`
  - `acceptance-m1.test.mjs`: `79b0e91b8dc5d06e08fcdb012b047169b5e29857`
- 24 variants × quarter-turn rotations audited for bounded vertices, outward triangle winding, exact rotated AABB, mesh color finiteness, geometric uniqueness and preview budget.
- Isolated fixture verifies attachments, partial collision, ray selection/removal, variant placement, atomic invalid-record recovery and reversible fixture-only snapshots. **Not production schema-1 save compatibility evidence**; schemas in live runtime remain unchanged.
- Prototype mesh budget per variant **96, 144, 180, 240, 204, 180 triangles**, respectively (maximum 240), NOT measured game GPU throughput.

## Browser image evidence — accurately scoped
- Real **Chromium 144, Canvas2D** screen rendering succeeded via the offline `about:blank` harness (no remote or local HTTP) with **six authored source-derived variants** at **667×375, 844×390, 932×430**, each at rotation 0 and 1 (**six genuine PNGs**). The companion `tests/block-packs/pack-5/capture-canvas.py` can reproduce this using Python Playwright and a locally installed Chromium; direct local screenshots were supplied separately to the creator, not committed to GitHub.
- Inspected actual PNGs; fixed fallback preview face ordering and automatic shape fit so raised interior tiles are visible instead of clipped/covered. Pairwise screenshot pixel differences were positive across all three sizes, providing limited independent visual-difference evidence, not art approval.
- These captures use **Canvas2D** and an assembled same-source script in an offline page, **not real WebGL2, not the production renderer, not the served HTML module loader**.
- Direct Chromium navigation to local HTTP gallery failed with `net::ERR_BLOCKED_BY_ADMINISTRATOR`. Local WebGL2 context creation returned false under multiple GPU flag configurations. **WebGL2 / served gallery / in-game screenshots are UNVERIFIED**. Do not claim a WebGL2 pass or physical-iPhone result. The original opt-in `architectural-gallery.html` remains available for future genuine WebGL2 testing in an allowed browser.

## Remaining acceptance and creator integration blockers
1. Obtain actual source-served WebGL2 gallery screenshots at all three landscape sizes; inspect material fidelity, geometry layering, transparency/depth, 4-way rotations, performance budgets and output contrast.
2. Have creator assess premium art visual quality. No approval was inferred from source or fallback previews.
3. Engine-owned :00/:12 design must centrally authorize widened numeric IDs, geometry-aware target/collision, state/rotation/attachment persistence, registry/mesher integration, and legacy schema-1 save compatibility. **Pack 5 does not implement these shared systems**.
4. No merge, deploy, world placement, settlement creation or v0.11 unlock. v0.10 Gate A OPEN.

**Decision:** M1 technical source candidates passed native Node, but **Milestone 1 final acceptance remains OPEN** because WebGL2/creator/production gates are unverified. Do not label these assets `INTEGRATED` or begin Milestone 2 on the basis of unverified browser results.
