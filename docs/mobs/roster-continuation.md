# Full creature roster

Foundation PR #274 stays at `3640979523b924bc4d5be09668890fc19c816c72`.
The continuation uses `mob-roster-complete`, stacked on `mob-foundation`.
The production base is `e9223217ef1e91d282900c3fc13a21eeda316b63`.

## Phase 0

The foundation passed 24 focused native tests in the continuation worktree.
The original hosted stand-alone preview and 20-script regression passed on the
foundation commit. Its 32-screenshot archive remains available.
[Foundation draft](https://github.com/hdog960/Mythwrought/pull/274)
[Foundation evidence](https://github.com/hdog960/Mythwrought/actions/runs/44450033430/artifacts/14495811486)

## Delivery order

1. Familiar passive wildlife. Add original anatomy, environmental activities,
   group movement, collision-authorized jumps and climbing, and eligible animal
   interactions. Exercise each through the same preview and runtime as Deer.
2. Original passive wildlife. Extend the same motion and navigation contracts
   with real flight and swimming. Verify habitat response and landing or exit.
3. Familiar hostile creatures, then original hostile creatures. Use the shared
   damage, line-of-sight and cooldown contract for different attack tactics.
4. Complete the per-species browser matrix, verify performance and persistence,
   and record the dependencies for later production integration.

Update the acceptance manifest with exact-head evidence for each wave. A
registry entry or visible model alone is insufficient. Production activation
depends on completion of the biome, sky and cave roadmaps and explicit creator
approval.

## Familiar wildlife checkpoint

The continuation adds Cow, Sheep, Pig, Chicken, Horse, Rabbit, Fox, Mountain
Goat and Wolf to the playable preview. Each has separate authored geometry
and a terrain-aware activity profile. The native tests cover motion at walls,
eligible pairs, the horse rider clearance check, physical hopping and
authorized climbing. The preview exposes group behavior, breeding, taming,
riding, stalking, and bonded Wolf defense and recovery where applicable.
Phase 1 checks retain the original reference scenarios.

The stacked preview workflow checks out the exact draft head and publishes
the screenshot manifest and a Phase 1 species acceptance report.
`finalAcceptance` stays false while future waves and the final matrix remain.
The continuation has no production entry point.

## Original passive wildlife checkpoint

The next nine original creatures add distinct models and authored activities
for dusk, light seeking, shell retreat, alpine movement, paddling, bounding,
flock flight, diving and thermal flight. Glownewt retains its original
preview and companion interactions. Flight uses real three-axis movement
through resident, collision-checked space. Swimming samples the authoritative
Pack 2 sloped water volume. Missing fluid state fails closed. The preview's
water mesh uses a local transparent draw pass and the shared voxel renderer
remains untouched.

Original wildlife exercise takeoff and landing, bank exit and re-entry in the
browser. Native tests verify volumetric flight near solid and unloaded
boundaries and water entry, depth and exit. The beta biome, sky and pool
inputs in this preview are staging fixtures. Future production integration
will obtain these observations through approved world adapters.

## Familiar hostile checkpoint

Zombie, Skeleton, Giant Spider, Slime, Wraith, Troll, Harpy, Mimic and Gargoyle
join the preserved Goblin encounter. The caverns are isolated VoxelWorld
fixtures rendered by the shared depth mesher. The preview also uses physical
high terrain for the aerial encounters.

Skeleton projectiles travel through world coordinates with a lifetime and
queue cap. Changes to terrain can block a projectile after launch. Slime hops
physically, Spider can climb authorized stone, and the flying foes use the
same three-axis solver as flying wildlife. Mimic and Gargoyle require actual
reveal or awakening transitions before their attacks. Encounters check
windup, impact, target loss, and preservation of world bytes.

## Original hostile checkpoint

Shardmaw, Thornwraith, Hollowbound, Sandstalker, Frostwraith, Stoneclaw,
Gloomcrawler, Ashfang, Briarlurker and Voidmoth join the preview. The wave
exercises heavy attacks, compact cave traversal, physical flight, ambush,
pack coordination and different projectile meshes over the common bounded
projectile solver. The full scene still uses a disposable voxel world.

## Staged persistence and host readiness

The V1 mob snapshot is a separate bounded payload with its own envelope and
checksum. It never reads or writes the existing save keys. It verifies seeded
IDs, sequence bounds, species, pose, lifecycle, active capacity, and owner
records before returning a new runtime. Duplicate identities, damaged payloads
and unsupported versions are rejected. A valid body in an unavailable chunk
restores dormant. An authorized companion can be recovered once after reload.
The snapshot preserves bonded modes, recovery timers, ownership and eligible
tames. A rider must mount again after reload. A future format reader should
decode earlier envelopes explicitly, then validate before enabling actors.

| Protected dependency | Staged adapter input | Production evidence required before incorporation |
| --- | --- | --- |
| Four-biome roadmap | Resident coordinates, authoritative biome ID, hazards and eligible terrain | Supported habitat mapping, edits, spawn boundaries, and untouched biome-owned structures |
| Sky/day-night roadmap | Current phase and normalized light | Dusk, dark habitat, transitions, pause and resume, and deterministic spawn eligibility |
| Cave roadmap | Loaded vertical section, cave readiness and climb surfaces | Deep collision, water availability, terrain revision, and resident seam and unload behavior |

The read-only host view waits for all relevant observations. Before activating
any mob, obtain explicit creator approval after all three protected roadmaps
are complete. Wire the host view and the read-only world revision, validate
active/dormant transitions in the existing scheduler, and run production
browser and actual device gates with spawning disabled. Introduce any later
pilot behind a separately approved feature gate. Approve world-object
capabilities, draw ordering and resource ownership, then stage reversible
spawn, combat, UI and persistence integration individually. Define migration
and rollback against a copy of existing saves before accepting a production
creature format. The current draft activates none of those integrations.

## Device acceptance

The creator owns real landscape Safari and installed Home Screen checks. Test
camera framing and input reach on an iPhone, movement and habitat transitions,
mixed combat, companion rescue, pause/resume, offline access and cold restart.
Capture frame times and device model during a long session at the proposed
cap, compare against the no-creature scene, and check storage before and
after. Record trouble with thermal throttling, memory or context loss before
approving any production cap.

## Technical acceptance evidence

The exact-head browser run checks idle animation for all 40, automatic
movement, signatures, camera framing, native pose transitions, damage and
cleanup. It keeps the original four landscape sizes and requires the
creator's three specified sizes for every species. The archive carries
`manifest.json` and `species-acceptance.json`.

The configurable active population defaults to eight in staging. A
preliminary local cave encounter with 16 active creatures measured 6.5 ms
simulation p95 and exceeded the low-single-digit target. The final browser
benchmark compares zero, one, eight, sixteen and twenty-four active
creatures, dormant populations, and cave encounters with a moving target.
Use the exact-head manifest for the final measured numbers. The preview
culls distant instances, batches survivors by model, caps projectile and
navigation work, and checks explicit GPU and runtime release. A device
measurement is still required before adopting a production cap.
