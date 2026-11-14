# MYTHWROUGHT Block Pack 5 — M3 Shop & Workshop Candidate Acceptance (partial)

**Scope:** source-only early Milestone 3 physical asset candidates for symbolic families 86 and 87. This is **NOT final M3 acceptance**, not playable integration, not creator artwork sign-off, not deployment.

## Coordination reviewed on 2026-11-14

- Latest checked main `ac263720b60641c65b02330348dd76d0ef9cb75e`, incorporation **checkpoint 008**. Only automation-owned geometry was made live there; manual Block Packs 1–5 and four independent building programs were explicitly excluded.
- Rechecked [coordination #109](https://github.com/hdog960/Mythwrought/issues/109), [biome130 #117](https://github.com/hdog960/Mythwrought/issues/117), four manual Packs 1–4 at current independent draft branches/manifests, and already-incorporated symbolic :12 biome catalog/PR #118.
- Exclusively on [Pack 5 draft PR #119](https://github.com/hdog960/Mythwrought/pull/119), within `src/block-packs/pack-5/` and `tests/block-packs/pack-5/`. No shared engine, registry, physical iPhone controllers, persistent saves, terrain, worldgen, CI, automations, or other developer's files changed.
- **No persistent numeric block IDs.** All names use symbolic keys `pack5:086` and `pack5:087`; future central registry approval is required. Main playable IDs still 0–8; 255 cache sentinel, 209–254 unassigned, biome130 256–385 future-only.

## Physically authored first 2/5 Milestone 3 families (four distinct variants)

| Symbolic family | Variant | Physical geometry and distinction |
| --- | --- | --- |
| 86 Shop Counters | `ledger-service` | High stone-like service worktop with customer-facing divided physical timber fascia, open vendor-side ledger rails, brass receipt rail; not a dining table |
| 86 Shop Counters | `festival-fascia` | Distinct colored heraldic timber counter front with raised scallops, layered facing and decorative rail, separate actual 3D boxes; no trading |
| 87 Display Shelves | `stepped-market-tray` | Three staggered open product trays, actual raised lips, retaining rails and posts; not a bookcase or storage/inventory |
| 87 Display Shelves | `curio-arcade` | Open framed three-tier commercial curio plinths with metallic raised presentation marks and overhead timber rails; not Pack 4 furniture |

Every candidate has 1 occupied voxel cell, `attachment:'floor'`, true 3D box geometry, genuine partial collision matching each authored box, reversible target/removal in the isolated fixture, 0–3 quarter-turn rotation, independently selectable variant and safe **fixture-only** variant snapshots. **No shop, trade, item display inventory, crafting, NPC, furnace, stove, mobile placement or settlement content created.**

## Reproducible technical acceptance — genuine and scoped

- `node --test tests/block-packs/pack-5/*.test.mjs` run with real native **Node 22.16.0: 83/83 PASS**, 0 failed/skipped (69 preexisting M0–M2 and **14 new M3** cases). New tests cover original geometry signatures, 16 variant/quarter-turn physical meshes, colors, named variants, support requirements, physical collision gaps, ray selection/removal, snapshot rollback, budget bounds and disjoint symbolic ownership.
- Test inputs match committed original source SHA:
  - `src/block-packs/pack-5/shop-workshop.mjs` Git blob `0aa60a46fe1efbeee5dba8e95710a9e559b10f45`
  - `tests/block-packs/pack-5/shop-workshop.test.mjs` `9af6c5d7531482c04e941f5b6c5902be1fd09172`
  - `tests/block-packs/pack-5/fixture.test.mjs` `306f38d5d2a692a5f578753e43ef91e3fec55459`
  - `tests/block-packs/pack-5/shop-gallery.mjs` `bda92719c762f080c6a9a1d8443766ed23bf9c18`; HTML `9bc6705e6cd6b4f13179dddfd4b0b69551f3bd26`
  - `tests/block-packs/pack-5/esm-webgl-browser.py` `5683c7ddcd31a0fb774e981e5c08bfa362f95503`
- Source-box mobile *preview-only* budgets, before hidden-face culling: ledger counter **26 boxes / 312 triangles**, festival counter **31 / 372**, market stepped tray **23 / 276**, curio arcade **26 / 312**; all under **64 authored boxes / 768 triangles per physical cell**. NOT physical iPhone GPU profiling.
- **Genuine Chromium 144 native ES-module WebGL2 images:** reproducible with `LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python tests/block-packs/pack-5/esm-webgl-browser.py m3 <output-folder>`. **6/6 authentic PNG captures** (667×375, 844×390, 932×430; rotations 0,1), each showing all four candidates with unique nonblank GPU pixel-readback fingerprints and visible rotation changes. Screenshots visually reviewed; original counters and racks are distinct from the completed M1/M2 candidates. PNG contact sheet was provided separately, **not committed**.
- This is **real WebGL2 and genuine browser ES module import semantics**, using `data:` module URL substitutions on an offline `about:blank` page. The browser administrator still blocks HTTP-served localhost gallery requests; those loads were **NOT certified**. Not gameplay, GPU hardware, mobile Safari or a physical iPhone check.
- GitHub root Actions workflow does not discover nested Pack 5 tests. Confirm latest **exact-head CI status** separately; a queued or successful root workflow is not proof of the focused 83 tests.

## Decision and next genuine tasks

- Technical source acceptance of 86–87 is **CANDIDATE / reproducible Node+WebGL2 preview PASS**; creator premium artwork review, production engine integration, HTTP-served browser and real mobile performance still OPEN.
- Milestone 3 is **NOT complete**: remaining 88 Anvils & Forge Fixtures, 89 Cauldrons & Alchemy Stations, 90 Ovens & Cooking Ranges are **NOT STARTED**.
- Total Pack 5 roster now **9 CANDIDATE / 9 NOT STARTED / 0 INTEGRATED** out of 18. All prior 79–85 unchanged; M1 creator sign-off and M2 creator/production acceptance remain separate and open.
- Stop before runtime registration. Central :00/:12 systems must separately authorize new persistent numeric IDs and backward-safe schema-1 saves, multi-part atomic placement, collision/raycast, variant persistence, and production render mesh. Never merge/deploy/world-place/change another lane or unlock v0.11.

**Next review:** further original art refinement on 86–87, investigate 3D shape silhouette clarity and mobile budgets, then conditionally author unique physical 88–90 under *only Pack 5 source/test paths*. No feature/gameplay authoring.
