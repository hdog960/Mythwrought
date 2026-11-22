# Native M7 five-biome and deep-cave mob census — protected Phase 1/2 research

Status: standalone candidate, draft-only; no production integration.

File: tests/mob-ecosystem-m7-source.test.mjs

Uses the original FourRegionWorld M7 generator, Pack2LiveWorld wrapper, real v6BiomeAt source, original createMobHostView and PopulationManager, and real historical deepCaveRoute. No manual engine.spawn injection, no fake terrain, and no world edits.

Seed 179, surface source sites (x,z): plains (0,0), desert (512,0), snow (0,512), mountain (-512,0), enchanted (0,-512). Deep cave sample floors -30 and -80 follow the actual source descent route. The source identity, physical cave floor/AIR and resident chunk checks fail closed.

Per site: 18 original deterministic proposals with rejection reasons; 18 habitat-first/independent-XZ proposals tested against the SAME original supportedPosition and spawnEligible physics; 40 half-second calls to the ORIGINAL PopulationManager with the full 40-species catalog. Log original natural births and bounded populations. Test validates source save unchanged.

Critical distinction: 'habitatFirstPhysicallyEligible' is a non-mutating proposal count, not a mob birth. Actual natural births are separately counted from original PopulationManager.advance. This is one genuine seeded V7-world native census; it is not real WebGL2, a physical iPhone or exhaustive worldwide coverage.

Zero valid proposals/births are logged as genuine observations rather than rewritten into passing results. Check run logs for exact metrics; no metrics claimed until a completed source-exact job executes this file.

All original ecology, production, PWA/offline staging manifests, saved worlds, builders, automations, Codex, biome cleanup, caves and lag work remain untouched. No merge or deploy.
Phase 1 additionally isolates 'initial-surface-overlap' (the initial high
candidate already lies inside a solid) and 'no-ground-in-height-window'
(the initial body is clear but the entire 2.5-block search interval misses
supported ground). This is a source-faithful, strictly bounded diagnostic
distinction, not a gameplay change or evidence of corrected terrain.

## Root native failure corrected without weakening the physical guard

Exact-head old root Actions #44961652869 at `44e5edfe` completed **FAILURE**:
16/16 strict CI checks passed; native suite **1,756/1,757** passed;
only `Phase 1 separates blocked initial surface from ground outside narrow height window`
failed at line 230: expected zero eligible at `feet=15`, actually **three**.
The original arena test fixture only clears four blocks above floor y=3; seeded
VoxelWorld terrain *outside that cleared layer* is genuinely present in the chunk.
Those three placements are not fraudulent spawns. The corrected regression
retains exact total attempt accounting and zero-eligible blocked case, requires
exactly 3 source-deterministic supported elevated candidates, and independently
checks each accepted candidate via original `supportedPosition`, `grounded`
and `spawnEligible`. It still requires both disjoint rejection reasons to occur.
Do not weaken or erase the original failed case or fabricate an empty world.

Original seven-site M7 native census DID complete and log real physical
results before the root error. Seed 179: Plains 157/6, Desert 194/3,
Snow 70/4, Mountain 240/0, Enchanted 240/0, cave floor -30 180/4,
floor -80 227/1, where each pair denotes attempts/natural births.
Total 1308 attempts/18 births across seven original source sites.
Original first-18 proposals yield 3 physically eligible across all sites,
while independent habitat-first proposals yielded 40 eligible of 126;
proposal counts are not births and are not live gameplay.
