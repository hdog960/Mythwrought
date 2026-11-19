import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {WORLD_MIN_Y,LEGACY_WORLD_MIN_Y} from '../src/depth.mjs';
import {deepCaveWorld,deepCaveRoute,deepCaveEvidence,DEEP_CAVE_BANDS} from '../src/deep-cave-network.mjs';
for(const seed of [179,1,2026,-77]){
  test('deep cave physical air and body passage across all four bands seed '+seed,()=>{
    const world=new VoxelWorld(seed),saved=JSON.stringify(world.save());
    const evidence=deepCaveEvidence(world);
    assert.equal(evidence.bands.length,4);
    for(const band of evidence.bands){
      assert.ok(band.samples>30,JSON.stringify(band));
      assert.equal(band.failures,0,JSON.stringify(band));
    }
    assert.equal(evidence.walkable,true);
    assert.equal(JSON.stringify(world.save()),saved);
    const route=deepCaveRoute();
    assert.ok(route.some(p=>p.floor<=WORLD_MIN_Y+2));
    assert.equal(deepCaveWorld(world).get(route[100].x,route[100].feet,route[100].z),BLOCK.AIR);
    assert.equal(deepCaveWorld(world).get(route[100].x,route[100].floor,route[100].z),BLOCK.DEEPSTONE);
  });
}
test('explicit deep edits override carved geometry and survive schema-1 restore',()=>{
  const world=new VoxelWorld(179),point=deepCaveRoute()[300];
  assert.ok(point.floor<LEGACY_WORLD_MIN_Y);
  assert.equal(world.set(point.x,point.feet,point.z,BLOCK.WOOD),true);
  const saved=world.save();
  assert.equal(deepCaveWorld(world).get(point.x,point.feet,point.z),BLOCK.WOOD);
  const restored=VoxelWorld.restore(saved);
  assert.deepEqual(restored.save(),saved);
  assert.equal(deepCaveWorld(restored).get(point.x,point.feet,point.z),BLOCK.WOOD);
  assert.equal(deepCaveEvidence(restored).walkable,false);
});
test('legacy envelope and old cave openings remain unchanged',()=>{
  const world=new VoxelWorld(179),candidate=deepCaveWorld(world);
  for(const [x,y,z] of [[64,-3,64],[64,0,64],[80,8,80],[100,12,100]]){
    assert.equal(candidate.get(x,y,z),world.get(x,y,z));
  }
  assert.equal(DEEP_CAVE_BANDS[3][1],WORLD_MIN_Y);
});
