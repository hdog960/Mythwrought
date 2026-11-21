# Living Underworld — Physical connectivity and real-terrain gate (isolated Phase 2)

## Protected GitHub checkpoint
- Production `main`: `7016e14cd6289f45eaf7fc6a79a362b47996df65`, untouched.
- Protected draft PR #367 and its `dev/living-underworld-p0-p1-20261121` branch only.
- This candidate adds only cave-specific modules, tests, scripts, workflow and documentation. No existing-world generator, M7 source, old seed profile, app startup, iPhone renderer, builder, Codex or automation files are modified.

## Verified previous exact-head runs (parent edc7454)
- #44951924264 / job #136991530379: completed **failure**, as required by real M7 source integrity. All **17/17 native** tests were successful. Real M7 constructor failed for **positive** seeds `8675309` and `13579`, both reporting the existing `switchback36` conflicts `AUTHORED_SOURCE_COLLISION` / `PROTECTED_EXISTING_LANDMARK`. Preserve originals and original stderr. The remaining 18 seeds yielded `2965 AIR / 1430784 = 0.207229%`.
- Real-artifact #14726456200, 22,346 bytes, SHA256 `78bbd767e4be0cec4218d0a2dbffb6ceafffd4c489ffcde616522d980526c554`: 27 ZIP members, all CRC valid, every one of 26 SHA256 manifest entries verified, exact-head file identical to parent.
- Detached calibrated proposal from same authenticated artifact: `195599 / 529920 = 36.911043%` across 20 seeds and 160 sampled distant regions. By layer upper `25.061233%`, middle `34.879557%`, deep `42.826172%`, lowest `41.019531%`. It does not represent current M7 world generation.
- Repository verification #44951924255 / job #136991553661 was IN PROGRESS when audit began; final root conclusion must be checked separately after it finishes. Do not count interim steps as completed.

## New Phase 2 physical route audit
- The existing network plan creates 36 owner-defined capsule segments per 256x256 region (4 compass corridors x 2 halves x 4 depth levels, 3 vertical connectors, upper socket).
- New pure `physical-connectivity-audit.mjs` traces each corridor centerline at half-block pitch and verifies every rounded voxel is AIR under the **calibrated** candidate, including a 6-face-connected sequence across diagonal changes. It also checks all 16 shared boundary crossings per sampled region and two entrance gallery sections.
- Deliberately sealed voxels and diagonal-only non-adjacent voxel paths are rejected, not silently deemed connected.
- Independent source-function pre-commit trial across three seeds and nine widely separated regions passed 468 route checks and 0 failures; 4 detached surface-entry galleries also passed the same centerline test. The native strict test will expand to 15 seed/region combos (780 route checks).
- **Not a full flood-fill, not an accessible 3D-network percentage, not an assurance that players can WALK steep corridors, and not actual mobile gameplay.** A 6-face-connected route does establish that the carved voxel centerline is not disconnected.

## Read-only actual M7 entrance candidates
- The existing entrance proposal still does not modify production or real voxels.
- New `scripts/underworld/audit-real-m7-entrance-terrain.mjs` constructs real source-backed M7 worlds, samples surface material columns through the real `naturalAndLandmarkBlock` reader, and checks deterministic candidate gallery mouths across all five real V6 biome categories (plains, desert, snow, mountain, enchanted).
- The source-backed surface/top detection excludes wood, leaves and water; provisional `protectedAt` rejects edits and tree cells around potential mouths.
- **Crucial limitation:** full landmark provenance, surface tree/canopy crowding, actual opening carve-acceptance, and player-walkable grade are NOT certified. A provisional mouth is only a candidate, never a safely carved production entrance.
- M7 constructor failures are retained as diagnostic rows and ARE NOT overridden. The mandatory 20-seed real M7 baseline still fails closed on any inherited refusal.

## CPU performance risk evidence
- `scripts/underworld/benchmark-node-proposal.mjs` compares 12,288 Node CPU query samples between network-only and calibrated cave-plus-network. Records median, p95 and worst batches, with exact Node version and an explicit **NOT_IPHONE_OR_GPU** marker.
- Does NOT establish frame rates, GPU uploads, chunk streaming costs or a safe Home Screen launch.

## Still unaccepted / next release gates
- Real M7 seed constructor failures remain.
- Physically navigable pedestrian paths and complete 3D flood-fill of disconnected components.
- Source-provenance-safe, genuine surface openings connected to caves in five real biomes.
- City-scale cavern contiguous floor and usable clearance under an actual future versioned generator.
- Depth-band variation and per-seed/local distribution acceptance beyond sampled averages.
- Dedicated chunk/meshing GPU cost audit and actual iPhone 17 Pro Max PWA test.
- Breakable non-block cave flora integration and persistent removal.
- No merge, deployment, or modification of unrelated workflows authorized.
