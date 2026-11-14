# Mythwrought Building Roadmap 3 — Milestone 1 technical acceptance candidate

**Status:** 30 / 30 M1 representative theoretical buildings authored in isolated source. **REVIEW CANDIDATE, NOT APPROVED, NOT MERGED, NOT DEPLOYED.** The full 705-building roadmap is **30 / 705** authored; these thirty are one variation per type × biome × size for blacksmiths and watchtowers, not the full M2/M4 quotas.

## Repository coordination

- Ownership: `src/building-pool/roadmap-3/`, `tests/building-pool/roadmap-3/`, `docs/building-pool/roadmap-3/` only.
- Baseline: initial branch `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`; latest separately incorporated main during M1 review `caf47776b723a36684edc1a72749e49268ccc688`, checkpoint **007**. The only intervening main changes since `b62728e` are checkpoint/release documentation.
- Cross-lane: Issues [#109](https://github.com/hdog960/Mythwrought/issues/109) and [#117](https://github.com/hdog960/Mythwrought/issues/117), manual pack PRs #112–#115/#119, biome130 PR #118, automated #120 and building PRs #121/#123/#124 checked. No owned-path overlap.
- [M0 exact-head GitHub Actions #43643210989](https://github.com/hdog960/Mythwrought/actions/runs/43643210989) **SUCCESS**; its configured root tests/browser smoke do *not* separately execute the nested Roadmap 3 suite.

## Authored design pool

The generator in `src/building-pool/roadmap-3/m1.mjs` exports `createM1Blueprint(type,biome,size)` and `createM1Pool()`, producing 30 complete theoretical serialized structures with **76,376 total integral voxel-coordinate slots**. They contain authored foundation, floor, wall, roof, optional stair, battlement, fixture and buttress modules. Every occupied coordinate references a named already-existing built-in physical block or an exact symbolic planned family; no engine IDs are assigned. The engine does not yet activate or physically render these buildings.

| Biome | Blacksmith architectural direction | Watchtower architectural direction |
| --- | --- | --- |
| Temperate | gabled stone/timber workshop with exterior beam details | corner buttresses and open crenellated observation deck |
| Desert | low shaded roof, broad wind-screen supports, interior cross-divider | reinforced wind-facing buttresses and roof terrace shade |
| Snow | high snow-shedding roof, insulated walls, sheltered approach | reinforced enclosure, raised steep upper cover |
| Enchanted Forest | off-center canopy roofline and livingwood ribs | livingwood support bays and magic-timber upperwork |
| Mountain | stepped stone roof and cliff-facing masonry supports | cliff-anchor reinforcement with high stone observation terrace |

Each biome has **one unique small, medium and large blacksmith** and **one unique small, medium and large watchtower**; all thirty produce distinct geometry fingerprints even after excluding material, labels and empty envelope padding. Watchtowers include 10/12/14 authored two-wide stair tread sequences for small/medium/large. Blacksmiths provide forge-mouth, anvil, storage, chimney ventilation and fuel-separation location data. These are **static assembly/fixture positions**, not operational equipment.

## Verification evidence

- **Native Node 22.16.0:** `node --test tests/building-pool/roadmap-3/*.test.mjs` — **25/25 PASS** locally on source matching the committed GitHub file blob hashes for the six M0 files and exact M1 source/test/manifest modules; includes three additional manifest/JSON-roundtrip cases. No surrogate browser or V8-shim tests counted.
- Independent voxel-grid flood traversal: checks two-wide unobstructed, floor-supported paths from entrance to blacksmith work/storage nodes and through stair steps to watchtower observation deck on all 30 structural proposals. This is theoretical cell-occupancy QA, **not production player collision verification**.
- Reversible serialization / uniqueness: stable canonical generator output; 30 distinct design identities and geometry fingerprints; duplicate occupancy, unknown family references, malformed clearances, invalid type/size and missing routes rejected by tests.
- Authored snapshot is reproducible from `createM1Pool()` and was independently materialized as local `M1_SNAPSHOT.json` (30 enumerated layouts, 1,846,816 bytes). Snapshot is a local transfer/verification artifact, **not committed** to keep the draft PR source-driven and lightweight.
- **Genuine Chromium/WebGL2 candidate screenshots:** **NOT CAPTURED.** Local Chromium on a trivial navigation returned `net::ERR_BLOCKED_BY_ADMINISTRATOR`; no browser simulation or rendered image is treated as acceptance evidence. New PR-head GitHub CI remains a separate gate.
- **Physical iPhone/creator art signoff:** NOT RUN / NOT APPROVED.

## Known dependencies and restrictions

Manual/future block shapes are currently **symbolic voxel positions**, not certified finished shapes. Candidate material dimensions and orientation metadata remain unresolved; real full engine collision, raycast, support, stairs, roof and selection must be retested *after* centralized block incorporation. The two-cell corridor policy is a design constraint, not a verified physical player-body dimension. No industrial machinery, smoke, fires, lights, AI guards, crafting, functioning mills, harvesting or combat was implemented. No changes to seeded world, persistent IDs, save schema 1, runtime performance, PWA, UI, thumb rails, other roadmaps, or integration checkpoint.

**Next:** Verify exact latest PR #122 head CI; pursue authentic WebGL2 visualization at 667×375, 844×390 and 932×430 where an approved browser environment works, resolve M1-only architectural defects, then proceed to the remaining blacksmith variations and the M2 armorer/carpenter designs only after the review gates are addressed. Gate A remains open and v0.11 locked.
