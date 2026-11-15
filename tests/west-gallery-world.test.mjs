import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,CHUNK_SIZE,meshChunk} from '../src/voxel.mjs';
import {westGalleryWorld,westGalleryTraversal} from '../src/west-gallery-world.mjs';
import {branchedCaveWorld} from '../src/branched-cave-world.mjs';
import {CAVE_CANDIDATE} from '../src/experimental-cave-route.mjs';

for(const seed of [179,1,2026,-77]) {
  test('west gallery connects to a supported, player-clear chamber for seed '+seed,()=>{
    const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
    const route=westGalleryTraversal(world);
    assert.equal(route.samples.length,11);
    assert.deepEqual(route.failures,[]);
    assert.equal(route.walkable,true);
    assert.ok(route.bodyHeight>1&&route.bodyRadius>0);
    const x=CAVE_CANDIDATE.x+13,z=CAVE_CANDIDATE.z-9;
    const cx=Math.floor(x/CHUNK_SIZE),cz=Math.floor(z/CHUNK_SIZE);
    assert.notDeepEqual(meshChunk(westGalleryWorld(world),cx,cz),meshChunk(branchedCaveWorld(world),cx,cz));
    assert.equal(JSON.stringify(world.save()),before);
  });
}
test('existing placed blocks win and obstruct physical traversal',()=>{
  const world=new VoxelWorld(179),sample=westGalleryTraversal(world).samples[8];
  assert.equal(world.set(sample.x,sample.y,sample.z,BLOCK.WOOD),true);
  const saved=JSON.stringify(world.save()),reader=westGalleryWorld(world);
  assert.equal(reader.get(sample.x,sample.y,sample.z),BLOCK.WOOD);
  const route=westGalleryTraversal(world);
  assert.equal(route.walkable,false);
  assert.ok(route.failures.some(p=>p.z===sample.z));
  assert.equal(JSON.stringify(world.save()),saved);
});
