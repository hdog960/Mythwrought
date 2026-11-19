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
