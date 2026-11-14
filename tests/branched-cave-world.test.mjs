import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides,meshChunk,CHUNK_SIZE} from '../src/voxel.mjs';
import {branchedCaveWorld} from '../src/branched-cave-world.mjs';
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
