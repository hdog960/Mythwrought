import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,collides,terrainHeight,meshChunk,CHUNK_SIZE} from '../src/voxel.mjs';
import {experimentalCaveWorld,caveRoute,CAVE_CANDIDATE} from '../src/experimental-cave-route.mjs';

for(const seed of [179,1,2026,-77]){
  test('seed '+seed+' has a traversable main passage and connected side grotto',()=>{
    const base=new VoxelWorld(seed),world=experimentalCaveWorld(base);
    const {x,z,length}=CAVE_CANDIDATE,{floorAt,grotto,chamber}=caveRoute(seed);
    const at=(t,dz)=>[x+t,floorAt(t)+1,z+dz];
    for(let t=0;t<=length;t++){
      const [px,feet,pz]=at(t,0);
      assert.equal(world.get(px,feet-1,pz),BLOCK.STONE,'solid floor '+t);
      assert.equal(world.get(px,feet,pz),BLOCK.AIR,'open feet '+t);
      assert.equal(world.get(px,feet+1,pz),BLOCK.AIR,'open head '+t);
      assert.equal(collides(world,px+.5,feet,pz+.5),false,'body fits '+t);
      if(t)assert.ok(Math.abs(floorAt(t)-floorAt(t-1))<=1,'walkable step '+t);
    }
    for(let t=length-13;t<=length-8;t++){
      for(let dz=1;dz<=4;dz++){
        const [px,feet,pz]=at(t,dz);
        assert.equal(world.get(px,feet-1,pz),BLOCK.STONE,'grotto floor');
        assert.equal(collides(world,px+.5,feet,pz+.5),false,'grotto is physically walkable');
      }
    }
    assert.equal(grotto[2],z+3);
    assert.ok(chamber[0]>grotto[0]);
    assert.equal(world.get(x,terrainHeight(x,z,seed),z),BLOCK.AIR,'daylight entrance');
    assert.deepEqual(base.save(),new VoxelWorld(seed).save(),'opt-in reader did not mutate default world');
  });
}
test('side grotto respects a player-built wall after save and restore',()=>{
  const base=new VoxelWorld(179),{x,z,length}=CAVE_CANDIDATE;
  const t=length-10,y=caveRoute(179).floorAt(t)+1;
  assert.equal(base.set(x+t,y,z+3,BLOCK.WOOD),true);
  const restored=VoxelWorld.restore(base.save());
  assert.equal(experimentalCaveWorld(restored).get(x+t,y,z+3),BLOCK.WOOD);
});
test('opt-in route meshes with the existing chunk renderer without changing ordinary chunks',()=>{
  const base=new VoxelWorld(179),world=experimentalCaveWorld(base);
  const cx=Math.floor(CAVE_CANDIDATE.x/CHUNK_SIZE),cz=Math.floor(CAVE_CANDIDATE.z/CHUNK_SIZE);
  const candidate=meshChunk(world,cx,cz),original=meshChunk(base,cx,cz);
  assert.ok(candidate.length>0&&candidate.length%9===0,'valid vertex layout');
  assert.notDeepEqual(candidate,original,'actual voxel faces differ from default terrain');
  assert.deepEqual(meshChunk(world,cx,cz),candidate,'deterministic candidate mesh');
});
