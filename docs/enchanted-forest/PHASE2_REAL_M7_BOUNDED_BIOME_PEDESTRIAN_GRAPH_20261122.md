# MYTHWROUGHT — Enchanted Forest Phase 2: Authentic Bounded Original-M7 Pedestrian Graph

**Isolated source-only research checkpoint — November 22, 2026 local (GitHub Actions November 23 UTC). No merge, deployment, browser/PWA update, save migration, or edits to other developers.**

## Exact refs, immutable original engine and final accepted source

- Entry isolated branch `research/enchanted-p2-physical-root-safety-20261121` exact HEAD `aafb9ea42604ffccef06e676e228e4fd1fc7345d`.
- Production `main` independently verified `7016e14cd6289f45eaf7fc6a79a362b47996df65`, and protected parent `dev/enchanted-forest-overhaul-20261121-phase0` `db8cad02387050579c75cbdcdea3e94a9f6d6bee`; unchanged.
- New **source-only read-only** module `src/manual-biomes/enchanted-original-pedestrian-search.mjs`; **final accepted source Git blob `49fa84146656d895638126c7766675188a13fa80`**. This blob is **identical** to the source originally green at exact commit `9c3bff46794a99dbca6a124ee790f1865e047491`, [Actions #45092293445](https://github.com/hdog960/Mythwrought/actions/runs/45092293445), 2/2 original native tests.
- Broader physically grounded border survey at commit `5b99fa437d79c9f1f22ebde051c08df82e8bf88a`, [Actions #45092467293](https://github.com/hdog960/Mythwrought/actions/runs/45092467293), 1/1 pass. Same original pathfinder module source as first success.
- **Final exact native-accepted source/test HEAD `8a897df68cc6f8c849d157c2bca4646e2c693f3d`**, [focused Actions #45093229883](https://github.com/hdog960/Mythwrought/actions/runs/45093229883): **SUCCESS, 3/3 genuine Node22 source/physics tests**; workflow explicitly checked `git hash-object` of new module equals above previous green blob. One local research document will be the only additional commit.
- Historical M7 generator, `src/physics.mjs`, `src/voxel.mjs`, terrain/cave/landmark source, real environment tree generator, opted-in previous canopy source, original schema-1 saves and user worlds were not changed by this session. The new helper is not wired into live gameplay or the production PWA.

## Substantive native original-world path-search engineering

Prior straight-line 8–14 leg tests were physically authentic but restricted to predetermined X/Z tracks. They were green for Enchanted↔Snow (seeds 179 and 7919) but did not certify Enchanted↔Desert, Plains, Mountain or seed -88 routes.

The new `searchOriginalM7PedestrianBorder` explores a **bounded eight-neighbor source-ground graph**, with deterministic FIFO/BFS ownership and explicitly validated limits:
- At most **384 visited source nodes**, **16-block origin radius**, **32 waypoint steps**, **four graph proposals** per query. Invalid queries fail closed; the pathfinder does not edit or save the world.
- Each supported node is built from the actual `FourRegionWorld._columnPlan` surface and `_environmentBaseline` cave/landmark source, with **both source-authored headroom AIR voxels**, original `world.get`, genuine original `collides` AABB, and authentic ground-contact probe.
- Movement graph prevents one-block-plus vertical jumps, eight-way **diagonal corner-cutting** around unsupported source ground, and original-body sample collisions along each real continuous segment. No proposed path is **certified** without the unchanged original `stepPlayer` traversing it, one continuous player object and velocity across all legs.
- Original-source historic walk runs **before** an identical opt-in experimental walk; deliberately solid new aether bark is not mislabeled as a canopy clearance defect. Only routes that genuinely pass original physics count as preserved passage.
- Source graphs are proposal tools and conservative filters, not gameplay pathfinding, and not a proof that all possible original paths exist or were found. No fabricated flat voxels, fake cave entrances, bypassed collider, teleports between legs or sampled user-edit changes.

New `tests/manual-biomes/enchanted-original-pedestrian-search-real-m7.test.mjs` anchors real original M7 source caps and three-seed warped biome boundaries, compares historic and opt-in `stepPlayer` traversal, and logs rejected/proposed/physically accepted routes.

## Native original-game verified routes — new biomes

First exact-source successful run [#45092293445](https://github.com/hdog960/Mythwrought/actions/runs/45092293445) certified **two real Enchanted↔Desert pedestrian crossings on seed 7919**:
1. Starting original position `[225,-592]`, end `[229,-596]`: **four diagonal legs, one genuine uphill leg, 54 old and 54 experimental physics ticks**, crossing an actual 16-block chunk edge.
2. Starting `[225,-595]`, end `[229,-598]`: **four legs, three diagonal, 50 old and 50 experimental physics ticks**.

Stratified independently green original source survey [#45092467293](https://github.com/hdog960/Mythwrought/actions/runs/45092467293) separately certified:
- Seed 179 Enchanted↔Snow `[271,-592]` to `[275,-587]`, **5 legs, 63 original and 63 experimental ticks**.
- Seed 7919 Enchanted↔Snow `[-205,-592]` to `[-200,-588]`, **5 legs, 63/63 ticks**.
- Seed 7919 Desert↔Enchanted `[226,-592]` to `[231,-596]`, **5 legs, one uphill, 63/63 ticks**.
- Those are original historical-world physically completed routes; they do not suggest every pair is safe, and none is a user-installed iPhone PWA session.

Final `#45093229883` restored and **revalidated exactly this evidence with 3/3 PASS**, after the speculative heuristic below was withdrawn.

## Seed -88 and abandoned direction-biased search — important negative results

The original short-straight sampler found **28 source Enchanted↔Plains border opportunities for seed -88**, but no original admitted route.

- The new stratified original BFS scanned 40 valid-biome starts for seed -88; **10 had actual original standing support** and ten bounded searches used 176 expansions apiece (**1,760 visited**) without a crossing proposal. **This is not proof that the world is impassable**.
- A *separate experimental* target-biased graph priority was investigated and tested against more starts. It found **20 genuine supported seed -88 starts among 117 checked**, and scanned **5,120 total nodes** (20×256), but **all twenty searches reached their visit caps and none returned a crossing**. Those observations refine the search limit, not geometry acceptance.
- That speculative priority heuristic could also fail to reproduce the earlier physically walked Desert witness, even with corrected original-biome start selection and independently bounded unbiased fallbacks. Focused research Actions **#45092615665, #45092778527, #45092931228, #45093044590** are **FAILED** and MUST NOT be cited as green. They identified search completeness and test-ranking limitations, not a proven gameplay defect.
- Engineering action: **withdrawn** the unverified priority heuristic completely. The final source was restored **byte-for-byte to the earlier accepted FIFO/BFS blob `49fa84146656d895638126c7766675188a13fa80`**. Its speculative failing tests were removed, retaining only the three independently accepted genuine source/physics tests. Final focused Actions #45093229883 verifies the source blob and all three test bodies, **SUCCESS**.
- Do not claim seed -88 original pass or fail, Enchanted↔Plains or Mountain pass, cave-mouth traverse, or performance improvement from any of these source-only experiments.

## CI efficiency, original safety and next work

- **Executed:** one new-source 2/2 native test, one changed-only stratified 1/1 test; exploratory directional tests were attempted, exposed a real accepted-route regression and **were reverted**, not silently accepted; final exact restored source 3/3 focused native acceptance.
- **Reused:** previous original-m7 continuous 14-leg straight and winding Enchanted↔Snow tests, actual AIR edit after 64-tree-chunk eviction, 128-entry immutable V6 metadata cache, 1,024-entry bounded walking canopy source cache, 17,877 exact original-source candidate tree voxels, 308 source face pairs, Moonwillow original-engine WebGL2 and native GPU budgets where source unchanged.
- **Avoided:** broad repository CI, repeat browser screenshot galleries, changes to five automations, Codex, builders, settlements, other biome/cave source, user saves, protected main/parent, deployment or CI cancellation.
- **Remaining:** source-admitted genuine long winding original routes for seed -88/Enchanted↔Plains and Mountain, physically tested cave-mouth/landmark-adjacent crossings, possible **admission-aware** bounded route search that does not lose old physically walkable routes, original browser live streaming, physical iPhone 17 Pro Max **installed Home Screen PWA** frame p95/FPS/JS heap/GPU residency/thermal tests, and distinct separately approved generator/version-safe save migration before enabling experimental Enchanted trees in production.

**Accepted conclusion:** The isolated original-source pathfinder genuinely expanded physically verified biome walkability to Desert↔Enchanted and preserved historical Enchanted↔Snow. Seed -88 remains an open source-grounded research problem; an unverified heuristic was actively reverted rather than falsely declared accepted.
