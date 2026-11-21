# M7 creature collision mismatch — standalone source-backed diagnosis

Production player physics (src/voxel.mjs) treats authored M7 environment blocks 400–410 as full solid cubes. Original mob world-query.mjs recognizes legacy 1–8, Pack 2, and registered biome130 256–385 but not M7 400–410, returning unknown for real M7 terrain.

Consequently, legitimate mountain and enchanted-forest ground can be unspawnable even with perfect species selection. This is a distinct physical-reader defect from the global-roster lottery, narrow vertical search, and lifecycle churn.

The opt-in createM7MobCollisionReader reads original voxels and maps only registered environmentGround IDs into the already established BLOCK.STONE full-cube representation, matching player physical solidity without editing the world or changing live code. Unknown materials not registered in environmentGround continue to fail closed.

The native test reads original FourRegionWorld M7 and Pack2LiveWorld at authentic seeded mountain/enchanted source coordinates. It requires original player collides=true, original creature query unknown, opt-in reader solid, and original schema-1 save unchanged. No mobs are injected.

Neither the module nor its tests are production-integrated or CI-accepted until exact-head native results exist. Runtime activation would require a separate cache-versioned PWA integration gate; leave original ecology, world-query, manifest, workers, saves, and other lanes unchanged.

RELEASE HOLD: detached candidate only, no merge or deployment.