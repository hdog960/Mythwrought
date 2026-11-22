# Mob Phase 2: isolated natural-spawn proposal coordinator

No live-game imports or changes to production ecology, saves, generator, offline assets or another developer lane. This detached module returns a read-only candidate only; it never spawns an entity or writes a save.

Original rules preserved: six attempts per poll, population localLimit, distinct rarity acceptance roll, exact authoritative residentAt, original supportedPosition and spawnEligible, source collision-based grounding, 1.2-unit occupant separation, and fixed bounded vertical placement. Missing per-species counts reject rather than assume zero; caller must also explicitly state roster capacity and supply up to original 32 existing positions.

The original 21-site M7 collision comparison measured 161/504 physically eligible for the original reader and 227/504 for the independent M7-compatible reader. Candidate counts are not natural births. The detached extended comparison and region coordinator have not yet passed native CI. The protected PR root browser cache-recovery acceptance failed on unrelated staged service worker 20261121-v38; no other-lane files or CI were changed.

Native tests for the new isolated function cover deterministic proposal output, failure when full/unknown/unloaded, original population and occupancy caps, frozen output and six-attempt budget. Release requires focused native tests, genuine M7 three-method source data, source-native natural-birth acceptance, original cave/save gates and full iPhone/offline checks at meaningful milestones.

## Genuine M7 source-region sampling without duplicate test loops

The already-existing 21 M7 source-site comparison now samples one bounded (up to six candidate trials) read-only regional poll per site, using the exact same source world, resident query and pool. Only explicit hypothetical empty local counts, empty occupancy and available engine capacity are used. The test records number of proposed candidates and attempted source-physics checks, not births. Every returned candidate must pass loaded real-world residency, real grounding, original spawnEligible, exact depth section; deep cave candidates additionally must remain valid on original unmodified reader with the original vertical window. No second region-generation, new browser suite or save writes are added. Native CI has not executed this detached change, so no authentic regional counts are yet claimed.


## Rarity once, full-roster safety and final-position residency

The earliest detached regional coordinator used a rarity-weighted species picker and THEN a separate independent per-species rarity roll, unintentionally giving infrequent species approximately **rarity squared** weighting. The new isolated `planRegionalHabitatCandidate` picks uniformly among already valid habitat species, preserving the exact deterministic spatial candidate coordinates, then applies the original-style rarity gate ONCE in the regional evaluator. Existing `planHabitatCandidate` and previous 21-site physics census remain untouched. A focused source-registered two-rarity distribution test checks neutral selection and approximately source-proportional acceptance.

An explicitly complete 32-entity roster now fails closed even if a host accidentally reports capacity available. After physical support is found, the final exact spawn point must also pass the authoritative 3D residentAt check. Neither change enables spawning in the live game or mutates original saves. These are research-stage safeguards and must pass genuine native and M7 source tests before any integration.


## Edit-revision atomicity and original M7 provenance

The regional candidate evaluator requires an authoritative read-only original-world `revision()` callback. It validates and snapshots a finite nonnegative integer revision before evaluating any habitat/collision, then confirms it remains identical before returning an eligible candidate, after exhausting all six attempts and in between attempts. Mutating voxel callbacks cause an explicit fail-closed `TypeError`; the production integration must supply its original actual edit revision, never assume a default. The 21-site M7 source test reuses its existing loop to verify any regional candidate's uniform habitat species draw, source deterministic X/Z provenance and one rarity gate, with no additional terrain-generation pass. No original gameplay files are changed.
