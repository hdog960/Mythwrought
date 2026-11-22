# Living Underworld — Phase 3 pedestrian path geometry and source-only chunk exposure

## Protected starting authority
- Production main `7016e14cd6289f45eaf7fc6a79a362b47996df65` remains unchanged.
- Original OPEN DRAFT PR #367 `f7de8cfe6c4e055e94bf1ce2398ad7aa97e588e0` stays protected until its exact-head dedicated #44972360755 and root #44972360733 exit the GitHub Actions queue.
- The two exact-head workflows and jobs were **QUEUED** with **no available logs or artifact** at the start and last recheck. Do not manufacture run results, true original-world 64-way entrance acceptance, hashes, or ZIP CRC.
- All code in this candidate is new `src/living-underworld/`, `scripts/underworld/`, `tests/living-underworld-*` and own workflow/doc files ONLY. No existing M7 generator, other biomes, Codex, builders, hourly automations, Creative, mining lag, saves, game renderer, production PWA, or main change authorized.

## Newly discovered original pedestrian geometry defect
Source-exact dry-run inventory across six seeds [179,-17,2026,314159,8675309,13579] × four distant 256x256 regions:
- Original horizontal two-piece hub-to-boundary galleries: **384/384** have nonintersecting three-wide, three-high supported stair *geometry*.
- Original straight depth connectors: **2/72** pass the same proposed stair grade contract. **70/72 fail** steepness.
- Original straight surface sockets: **0/24** pass; 24/24 are vertical shafts to Y=-4, never valid ordinary walking ramps. These are geometrically face-connected AIR yet NOT naturally walkable.
- A first naive two-segment switchback attempt FAILED **96/96** due to support-floor and required-headroom intersections. Keep this negative evidence; matching net horizontal grade alone is insufficient.

## New detached source-only rectangular switchback candidate
- New `pedestrian-switchback.mjs` plans four slow descending straightaways on a 44-block-radius square spiral with eight-block flat landings at corners. The route remains strictly inside its original 256x256 region, each step climbs/descends at most one block, full three-wide deck and three-high headroom never intersect.
- Exact original-source trial: **96/96** candidate switchbacks pass supported stair dry-run on 24 sampled regions. Source-level proposed-carve centerline check of the seed179 upper/middle ramp is face-connected, with zero carved voxels.
- The upper *surface socket* approach stops at **Y=-7**, retaining three protected blocks before the historical -4 socket. It explicitly refuses to assume or cut a live M7 surface entrance; source-owned landmarks, ore, M7 edits and biome voxel provenance are NOT yet audited for the proposed spiral.
- Required proposed support cells, summed separately by each link across the sample: **128,731** (about 5,364 per sampled region). This is an upper development cost signal; overlap across links was NOT deduplicated and zero support blocks have been placed. It is NOT acceptable to introduce this huge ramp plan directly on iPhone without mining, placement, collision and performance work.
- New native tests deliberately preserve original 70/72 connector failures and 24/24 socket failures while verifying **only future dry-run geometry**. No original cave or surface edits.

## First deterministic binary-cube chunk face-risk estimator
- New `chunk-exposure-audit.mjs` samples a real voxel AIR source with a 1-voxel halo around a 16x16x16 chunk, counts six-neighbor cube faces and calculates an explicitly **illustrative unmerged mesh** footprint (32 bytes per vertex; 2/4 bytes per index, no greedily meshed quads).
- Independent exact-source preflight: **32** candidate chunks (four seeds × two distant regions × four depths), largest exposed surface **513 cube faces**, with illustrative footprint **71,820 bytes**. Eight chunks per depth. The sampled chunks are biased to each proposed network hub; they do not represent average world chunks or newly proposed switchbacks, non-block formations, GPU allocations or installed iPhone rendering.
- Native controls prove all-rock chunk and all-air chunk expose no internal faces, one isolated cube has six faces/24 vertices/36 indices, and unsafe dimensions or halo-budget shortages fail.
- Root actual WebGL2, mining speed, shader and mobile FPS remain independent gates; none has been modified or passed by this estimate.

## Still unaccepted
- New exact-head source-native CI and signed ZIP/SHA256 artifact from future protected child checkpoint.
- Original 64-way genuine M7 biome entrance census on the **same geographically distributed 120-site cohort**, plus inherited positive seed constructor failures 8675309/13579. The user explicitly prohibits bypassing the original `switchback36` protection.
- Full-world connected AIR from genuine protected surface to city interior, physical player walking and vehicle/stair collision, absence of original authored-source collisions below the surface, non-block detail minability/persistence, actual chunk mesh bytes and 55–60FPS iPhone Home Screen shortcut acceptance.
- No merges, deployments, force pushes, edits to other lanes or player saves.

## Phase 3 optimization follow-up, candidate child only
- The original 44-block-radius, 8-block-corner plan is preserved as the default, with all old 3-wide/3-high grade, region and support checks enforced.
- A bounded 16-radius × 4-corner search chooses minimum supporting floor cells (14–44 block radius, 4–10 corner flats), rejecting any shape that fails the same strict checks or exits its 256-block region.
- Independent exact-source 96-link evaluation: **128,731 original proposed support cells vs 45,866 optimized** across six seeds × four distant regions × four connectors, **64.37% fewer**. None placed. A proposed candidate AIR continuity sample also passed, still not a player-physics or existing-M7 provenance approval.
- This reduces only theoretical staircase material; total generated tunnel AIR, original M7 terrain, saves, GPU uploads and mobile FPS are NOT changed or measured. New tests guard cost monotonicity, default geometry and the historical protected Y=-7 socket handoff.

## Read-only underground provenance gate (new isolated child research)
- New `protected-subsurface-stairs.mjs` reconstructs the **exact three-wide support and three-high headroom footprint** of a geometrically accepted proposed ramp and verifies its support/clearance cell counts against the independent strict stair auditor; mismatch throws instead of passing.
- Every footprint cell is examined with caller-supplied read-only callbacks for old authored source, saved player edits, historical protected landmarks, and original natural materials. Unknown material, ore, saved edits, authored solid, or protected old landmarks fail-closed; natural geology may be included in **proposed** future excavation without modifying any original world bytes. Bounds/query budget always enforced.
- Focused exact-source preflight for seed179 optimization: **1,896** footprint cells enumerated, matching **474 support + 1,422 headroom** cells. All-stone synthetic data accepted for hypothetical new-world geology, while all-ore, authored solid, player edit, historical landmark and unknown materials were individually rejected; a 100-cell cap correctly refused the sample. Original upper socket remains strictly below Y=-4.
- `audit-real-m7-deep-stairs.mjs` was staged as a **manual read-only 32-site original-M7 ownership research script**, using four historically constructible seeds, two distant regions and four depth/socket links. It is intentionally NOT automatically executed in every CI run, because the creator's 12-developer anti-congestion policy reserves expensive genuine-M7 source research for coordinated milestones. Its results are **unknown until actually executed**; do not claim real M7 subsurface permission from synthetic tests.
- No original M7 generator changes, player edits, save schema, deployment or WebGL2 work. The original inherited seed faults 8675309 / 13579 remain blocking in the dedicated workflow.
