# Builder 1A — M2 wave four, 15 original houses and real roof wings

**Latest source baseline:** draft PR #180 started this development at `7e7d5eb124e4aaaa4aca0e77b00ac9da5b9a6e44`, main checkpoint 009 `e6bd7c1`. The original 30 inherited candidates and all earlier 54 lane-created ones are unchanged. Seven sibling builders, manual block packs, biome130 and five automations, shared runtime, saves and CI config untouched.

## Work completed
15 complete independently coordinate-authored houses across five biomes × three relative sizes. Real 3D voxel placements **56,658**; per-building two to three physical roof wings with **37 authentic per-voxel vertical roof/underlay regions**, separate walkable entrances, rooms, door/stowed leaf arches, foundations and actual support. These are not names, seeds, reskins or geometry mirrors. Full 84-building prior source objects have regression fixture checks for exact serialized placement/room/portal/asset identity, while legacy 30 already have their source hash fixtures.

**Inventory:** 99 of 450 theoretical candidates, with **78 Houses / 17 Taverns / 4 Inns**; 30 inherited, 69 new. **351 unauthored:** 222 Houses, 58 Taverns, 71 Inns. **M2 houses 78/150**, 72 houses to M2 foundation milestone. Creator-final-approved 0, integrated 0, deployed 0.

## Source and technical gates
M2 new native suite: 84-record full JSON preservation fixture, 99-ID and D4 uniqueness, 15-wave5-biome×3-size, 60 new houses strict normalized partition IoU < 0.88, real connected rooms, two-high portal clearance, roof support, Pack5 actual 2-cell bed-foot reservations and five-pack producer AABB source lookup. New source browser **target** 71 different candidate models × exterior/cutaway × three sizes (667×375, 844×390, 932×430) = **426 source cell cube WebGL2 captures** plus 25 physical-source candidates × 2 × 3 = **150 actual producer Pack visibleBoxes AABB WebGL2 captures**. They are **not yet accepted** until exact current HEAD Actions passes.

Pack AABBs are source-authentic geometry with provisional preview colors and producer state. Door swing and save codec, transparent glass, roof load/weatherproofing, bed runtime collision, final artwork, physical iPhone testing, production placeability remain unresolved. Draft unmerged and undeployed; Gate A open and v0.11 locked.
