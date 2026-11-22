# Mob Phase 2: isolated natural-spawn proposal coordinator

No live-game imports or changes to production ecology, saves, generator, offline assets or another developer lane. This detached module returns a read-only candidate only; it never spawns an entity or writes a save.

Original rules preserved: six attempts per poll, population localLimit, distinct rarity acceptance roll, exact authoritative residentAt, original supportedPosition and spawnEligible, source collision-based grounding, 1.2-unit occupant separation, and fixed bounded vertical placement. Missing per-species counts reject rather than assume zero; caller must also explicitly state roster capacity and supply up to original 32 existing positions.

The original 21-site M7 collision comparison measured 161/504 physically eligible for the original reader and 227/504 for the independent M7-compatible reader. Candidate counts are not natural births. The detached extended comparison and region coordinator have not yet passed native CI. The protected PR root browser cache-recovery acceptance failed on unrelated staged service worker 20261121-v38; no other-lane files or CI were changed.

Native tests for the new isolated function cover deterministic proposal output, failure when full/unknown/unloaded, original population and occupancy caps, frozen output and six-attempt budget. Release requires focused native tests, genuine M7 three-method source data, source-native natural-birth acceptance, original cave/save gates and full iPhone/offline checks at meaningful milestones.