# Living Underworld — Phase 2 alternate entrance routing and 3D seam validation

## Protected authority (2026-11-21)
Original `main`: `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
Parent protected draft PR #367 HEAD: `e2f58a6640f3ffbae1d7808fddbc013c2f22d923`.
Do not merge, deploy, replace world saves, or touch any active M7 production generator,
Codex, five hourly automations, builders, other biomes, Creative, or digging lag.

## Verified parent GitHub evidence, not assumptions
- Dedicated #44958335270 job #137011331803: all **34/34 native source tests PASS**; original M7 20-seed baseline **FAILURE**, correctly preserving positive seeds 8675309 and 13579 historical `switchback36` authored-source/landmark conflicts. 18 valid M7 seeds 2965/1430784 = **0.2072290436%** actual sampled AIR.
- Genuine artifact #14728773236, 38,086-byte ZIP, SHA256 `5e29c6a5593a8c24b5c226ab6ba62d5eeba411e5b19f8f74e38431e735923a68`: all 33 ZIP entries CRC passed, 32 SHA256SUMS matches, exact old head verified.
- Isolated 20-seed calibrated candidate: 195599/529920 = **36.9110431763%** AIR; four bands 25.0612%,34.8796%,42.8262%,41.0195%; no original game code imported this candidate.
- **Critical correction** from authenticated strict M7 source audit: only **4/120** original first-choice surface proposals were full-envelope safe, across five biomes: plains **2/24**, desert **1/24**, snow **0/24**, mountain **1/24**, enchanted **0/24**. Prior 120/120 was ONLY preliminary centerline geometry, NOT safe material ownership, a live carved entrance, or approved access. Frequent blockers include original mineable ore ID 6 and protected old landmarks.
- Parent root #44958335249: 20-script original WebGL2 stage PASS while run remained in progress at this checkpoint. Final conclusion must be checked before acceptance.

## Safe alternate route research (new, isolated)
- `entrance-candidate-search.mjs` tries up to **four** deterministic compass variants for each region, one at a time, and accepts ONLY if (a) real biome mouth matches the requested biome, (b) existing protected mouth checks pass, (c) proposed AIR path is face-connected, (d) a three-wide three-high supported stair deck can be constructed in the candidate geometry, AND (e) the same conservative **full 7x7 original M7 voxel provenance envelope** protects authored source-owned rocks, player edits, historical landmarks, ore, canopy and non-geology without exception.
- The previous first-choice result remains separately reported and must never be re-labeled after finding a later alternative. The next exact-head Actions artifact contains an independent `alternateSearch` survey next to the old `byBiome`, with counts of attempts and additional accepted proposals, including all strict reasons for rejected routes.
- Synthetic source-function proof: with unprotected original stone, first plan succeeds; poisoning the first mouth as a historical landmark makes the first plan fail but the next compass approach succeeds; making all original surface ore, edits, authored stone or historical landmarks forces **all four** to fail. No tests softened or protection list loosened.

## Actual 3D seam proof beyond skeleton endpoints
- `region-seam-components.mjs` samples a bounded exact 3D voxel window centered on a **real planned region boundary**. It requires cells three blocks on BOTH sides of a portal to be AIR and members of the SAME six-face-connected flood-fill component.
- Independent exact-source trial: **72/72 seam crossings passed** over 3 seeds, 3 widely separated regions, 4 depth layers and east/south boundaries. Some windows contain additional disconnected pockets; these are intentionally retained in the report. Not a proof of infinite-world complete connectivity or ordinary walking-grade traversal.
- Native CI includes deliberate invalid level/direction/budget inputs and rejects invalid test options.

## Resource-bounded city material lookup
- `city-floor-proposal.mjs` now uses a small **48-region-entry LRU** of immutable neighboring city candidates, not actual voxel state, saves, edits, or player actions. It retains exact floor-over-air priority, and evicts deterministically.
- Independent exact-old/new verification: **5175 seeded far-region material samples yielded zero differences**. A same-isolate local cache-hot microbenchmark observed 45 ms vs 206 ms over 50,000 material queries (the result is host-specific, not a GPU or game claim). The dedicated Actions CPU benchmark now includes a genuine pre-cache 3x3-neighbor reference with **12,288 exact-output equivalence checks** and same-run timings.
- Cave density, regional city-floor geometry, the original 20 real M7 seed inventory and cave non-blocks are unchanged.

## Non-acceptance
Not in actual Home Screen PWA. Real source-backed alternate entrance counts await CI.
No protected world carving, in-game collision, iPhone FPS, chunk meshing, full-world component
fraction, non-block persistence, or buildable-civilization site runtime placement have
been certified. No merges, deployments, or other development-lane changes authorized.
