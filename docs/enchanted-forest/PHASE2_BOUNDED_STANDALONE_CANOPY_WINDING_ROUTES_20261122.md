# MYTHWROUGHT — Enchanted Forest Phase 2: Bounded Standalone Canopy Reads and Original-M7 Winding Walks

**Isolated experimental source checkpoint, November 22, 2026 (Actions executed 2026-11-23 UTC). NOT a merge, deployment, historical-M7 generator change, saved-world migration, physical iPhone test, or browser-streaming/FPS acceptance.**

## Protected source and exact test revisions

- Entry isolated branch `research/enchanted-p2-physical-root-safety-20261121` exact HEAD `cfd0332d1b8bba154f8eaf83ddaab6cb3b035901`.
- Production `main` verified `7016e14cd6289f45eaf7fc6a79a362b47996df65` and protected parent `dev/enchanted-forest-overhaul-20261121-phase0` verified `db8cad02387050579c75cbdcdea3e94a9f6d6bee`; no write actions to either.
- Previous 3/3 canonical cache and 288-original-chunk native acceptance [Actions #45084197618](https://github.com/hdog960/Mythwrought/actions/runs/45084197618), exact runtime `8deb20fb127fd5d699b9b27ff3100df51902d6fc`, reused where source unchanged.
- **New standalone canopy source tested at exact commit `a4799ef8ddb8ce34002ba8fd533f40235188fc05`**, [focused Actions #45088942632](https://github.com/hdog960/Mythwrought/actions/runs/45088942632): **SUCCESS, 12/12 original Node 22 native tests, 0 failures**.
- **New independent short climate survey tested at exact commit `e09f835d4ba4aac5deed6b0b78cd3ae88b9d743a`**, [focused Actions #45089099828](https://github.com/hdog960/Mythwrought/actions/runs/45089099828): **SUCCESS, 1/1 changed-only native test, 0 failures**. Runtime canopy source is unchanged between these tests; second Actions run executes only the new test via `--test-name-pattern`.

## Real source memory-bounding fix

Changed **only** `src/manual-biomes/enchanted-tree-walking-clearance.mjs` on the gameplay side. Prior `clearEnchantedCanopyForWalking` independently allocated an unrestricted `new Map()` when a caller did not provide a per-chunk cache. Its normal original `environmentalTreesForChunk` caller already supplies a strictly capped `EnchantedCandidateSourceCache` of 1,024 entries; but standalone actual-source use could grow with input size. The fallback now **uses the same reviewed 1,024-entry bounded FIFO**. Existing explicitly shared cache semantics are unchanged. Evictions re-query the real authoritative original source: unknown/occupied cave, landmark, real ground and player standing AIR cannot be inferred or replaced with a guessed value.

New genuine source-unit stress test in `tests/manual-biomes/enchanted-tree-walking-clearance.test.mjs` used **1,600 deterministic synthetic leaves for cache-pressure characterization only**, and compared the exact retained ordered source foliage against the earlier unrestricted explicit-Map behavior:
- **1,413** leaves retained, **187** leaves pruned in each implementation, exact byte/order/material parity.
- Unrestricted original source memo contained **3,506 distinct keys**; new default fallback entry capacity **1,024**. The reviewed bounded cache class enforces the cap; the headroom code does not mutate it.
- **3,506 genuine supplied baseline reads in each case**, so this specific access pattern saves retained entries without introducing additional source callbacks. This is synthetic memory-pressure validation and is **not** a measured byte-heap or real iPhone FPS result.
- All original 9 previous walking-clearance native tests passed too, including real 1.78-height player AABB, .28-radius cardinal/diagonal headroom, original structural bark preservation, original cave/landmark/undefined conservative veto, and short-lived shared cache parity.
- Historical/default M7 generator path, saved-world schema, candidate shapes, other biomes, source cave geometry, GPU mesher and original original-game `stepPlayer`/collision are untouched.

## Original-engine native movement — new 14-leg WINDING routes

Extended **`tests/manual-biomes/enchanted-biome-seam-long-walk-real-m7.test.mjs`**, where original historical and experimental `FourRegionWorld` are independently generated, using the original `v6BiomeAt`, real original terrain/landmark cave AIR, `collides`, untouched `stepPlayer` and one continuously moving player object. The old world must complete each winding route **before** the candidate may be checked. Genuine opted-in solid bark is filtered out and never falsely called an experimental leaf blockage.

Four new true **14-leg diagonal winding routes** across actual Enchanted↔Snow climate boundaries:
- Seed `179`: two anchored routes `[268,-600]` and `[268,-598]`, lateral `+1` side-step between legs 4 and 8; each completed **140** original and **140** experimental ticks.
- Seed `7919`: two routes `[-208,-600]` with detour legs 4–8, and `[-208,-598]` with detour legs 3–5; **140** and **141** matched original/experimental ticks respectively.
- Each has **two authentic diagonal movement legs** and 14 total continuous player legs; **8 new diagonal legs** across four routes. Every route retains original full-body collision, no teleport/reset of movement, no candidate hit wall/ceiling, original cave/ground source and unmodified save protections.
- These are actually walkable original-game-source paths; NOT a direct iPhone playtest. They add winding variety to the prior four straight 14-leg climate routes; they do not claim that other biome transitions are yet safe.

## Separate bounded real eight-leg boundary survey

The second isolated **1/1 focused native** run checks actual warped V6 biome borders at three seeds and attempts shorter **8–10-leg** original-source corridors with the same genuine physics, no synthetic flat ground. It logged:
- Seed `179`: **26** sampled borders, 38 candidate corridors considered, two genuine original and prototype passes. Verified **8-leg** Enchanted→Snow at `[271,-588]`, **76** ticks both, real 16-block chunk crossing.
- Seed `7919`: **26** sampled borders, ten considered, two passes. Verified **8-leg** Snow→Enchanted at `[-205,-588]`, **76** ticks both.
- Seed `-88`: **28** detected warped Enchanted borders; **784** short straight corridors examined, **zero** met the test's strict natural support, headroom and source-physical route-admission filters. Do **NOT** infer there are no passable Enchanted crossings, or claim that seed `-88` was accepted. Winding terrain-aware route discovery should address this gap.
- This search only found verified Enchanted↔Snow paths, **not** Enchanted↔Plains/Mountain/Desert. Treat all other climate pairs as outstanding rather than claiming five-biome mobility coverage.

## Global anti-clogging and original safety

- **Executed:** first focused original source change **12/12** passed on `a4799ef8...`; second **one new test only** passed on `e09f835d...`. No failed native runs.
- **Reused:** prior 3/3 actual original-world canonical key/288-chunk evidence, historical 64-chunk eviction and user edit, 128 site-biome cache, 17,877 exact ordered tree voxels, 308 source seam pairs; Moonwillow native GPU and matched original WebGL2 screenshots all remain previously accepted on unchanged geometry.
- **Avoided:** full repo CI, broad Chromium, duplicate existing 12 native test bodies on the second run, repeated queue congestion audits, CI cancellations, shared branch/workflow edits, other developer interference, merges and deployments.
- **Remaining priorities:** source-grounded winding/pathfinding discovery for seed `-88` and Enchanted↔Plains/Mountain/Desert, cave-mouth/landmark-adjacent genuinely traversable original routes, controlled real mobile memory/CPU work, physical iPhone 17 Pro Max installed Home Screen PWA full frame p95/FPS, GPU resident buffer/heap/thermal checks, and separately authorized new generator identity and safe save migration before production tree opt-in changes.
- Production `main`, protected parent, other developers/biomes, Codex, the five automations, settlements, original saved-world identities and PWA remain untouched.

**Conclusion:** experimental standalone source headroom is now safely bounded without changing candidate foliage, and actual original native walking has four new winding and two shorter source-authentic Enchanted/Snow crossings. Other biome pairs and seed -88 remain explicitly unresolved.
