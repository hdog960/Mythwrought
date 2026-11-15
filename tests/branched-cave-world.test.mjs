import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides,meshChunk,CHUNK_SIZE} from '../src/voxel.mjs';
import {branchedCaveWorld,northWingTraversal} from '../src/branched-cave-world.mjs';
import {CAVE_CANDIDATE,caveRoute,experimentalCaveWorld} from '../src/experimental-cave-route.mjs';
for(const seed of [179,1,2026,-77]){
  test('north cave wing is solid-floored, head-clear and meshes for seed '+seed,()=>{
    const original=new VoxelWorld(seed),before=JSON.stringify(original.save());
    const candidate=branchedCaveWorld(original);
    const t=CAVE_CANDIDATE.length-14,floor=caveRoute(seed).floorAt(t),x=CAVE_CANDIDATE.x+t,z=CAVE_CANDIDATE.z;
    for(let dz=-1;dz>=-10;dz--){
      const at=z+dz;
      assert.equal(candidate.get(x,floor,at),BLOCK.STONE,'solid floor '+dz);
      assert.equal(candidate.get(x,floor+1,at),BLOCK.AIR,'feet clearance '+dz);
      assert.equal(candidate.get(x,floor+2,at),BLOCK.AIR,'head clearance '+dz);
      assert.equal(collides(candidate,x+.5,floor+1,at+.5),false,'player clearance '+dz);
    }
    const cx=Math.floor(x/CHUNK_SIZE),cz=Math.floor((z-8)/CHUNK_SIZE);
    assert.notDeepEqual(meshChunk(candidate,cx,cz),meshChunk(experimentalCaveWorld(original),cx,cz));
    assert.equal(JSON.stringify(original.save()),before);
  });
}
test('explicit saved placement blocks the new branch without altering the save',()=>{
  const world=new VoxelWorld(179),t=CAVE_CANDIDATE.length-14;
  const x=CAVE_CANDIDATE.x+t,z=CAVE_CANDIDATE.z-7,y=caveRoute(179).floorAt(t)+1;
  assert.equal(world.set(x,y,z,BLOCK.WOOD),true);
  const saved=JSON.stringify(world.save()),candidate=branchedCaveWorld(world);
  assert.equal(candidate.get(x,y,z),BLOCK.WOOD);
  assert.equal(collides(candidate,x+.5,y,z+.5),true);
  assert.equal(JSON.stringify(world.save()),saved);
});

for(const seed of [179,1,2026,-77]){
  test('north wing full route trace and saved-edit override '+seed,()=>{
    const world=new VoxelWorld(seed),original=JSON.stringify(world.save());
    const route=northWingTraversal(world);
    assert.equal(route.samples.length,11);
    assert.deepEqual(route.failures,[]);
    assert.equal(route.walkable,true);
    assert.equal(JSON.stringify(world.save()),original);
    const obstruct=route.samples[7];
    assert.equal(world.set(obstruct.x,obstruct.y,obstruct.z,BLOCK.WOOD),true);
    const blocked=northWingTraversal(world);
    assert.equal(blocked.walkable,false);
    assert.ok(blocked.failures.some(p=>p.x===obstruct.x&&p.z===obstruct.z));
    assert.equal(world.get(obstruct.x,obstruct.y,obstruct.z),BLOCK.WOOD);
  });
}

test('north wing uses actual player body collision, not only center voxel checks',()=>{
  const world=new VoxelWorld(179);
  const route=northWingTraversal(world);
  assert.equal(route.walkable,true);
  assert.ok(route.bodyHeight>1 && route.bodyRadius>0);
  const middle=route.samples[5];
  // A player-sized body must remain clear at each route sample.
  const candidate=branchedCaveWorld(world);
  for(const point of route.samples)
    assert.equal(collides(candidate,point.x+.5,point.y,point.z+.5),false);
  // A saved block at a sampled center is a physical obstruction.
  assert.equal(world.set(middle.x,middle.y,middle.z,BLOCK.STONE),true);
  const blocked=northWingTraversal(world);
  assert.equal(blocked.walkable,false);
  assert.ok(blocked.failures.some(p=>p.x===middle.x&&p.z===middle.z));
});
