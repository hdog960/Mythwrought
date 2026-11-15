import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,CHUNK_SIZE,meshChunk} from '../src/voxel.mjs';
import {westGalleryWorld,westGalleryTraversal,westVaultTraversal,westLoopTraversal,northAlcoveTraversal} from '../src/west-gallery-world.mjs';
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

for(const seed of [179,1,2026,-77]) {
  test('second vaulted hall has connected player-sized route for seed '+seed,()=>{
    const world=new VoxelWorld(seed),saved=JSON.stringify(world.save());
    const route=westVaultTraversal(world);
    assert.equal(route.samples.length,23);
    assert.deepEqual(route.failures,[]);
    assert.equal(route.walkable,true);
    const last=route.samples.at(-1);
    assert.equal(last.x,CAVE_CANDIDATE.x+22);
    assert.equal(last.z,CAVE_CANDIDATE.z-13);
    const reader=westGalleryWorld(world);
    assert.equal(reader.get(last.x,last.y+4,last.z),BLOCK.AIR);
    assert.equal(JSON.stringify(world.save()),saved);
  });
}
test('saved placed block in east vault remains solid and blocks route',()=>{
  const world=new VoxelWorld(179),last=westVaultTraversal(world).samples.at(-1);
  assert.equal(world.set(last.x,last.y,last.z,BLOCK.WOOD),true);
  const before=JSON.stringify(world.save());
  assert.equal(westGalleryWorld(world).get(last.x,last.y,last.z),BLOCK.WOOD);
  assert.ok(westVaultTraversal(world).failures.some(p=>p.x===last.x&&p.z===last.z));
  assert.equal(JSON.stringify(world.save()),before);
});

for(const seed of [179,1,2026,-77]) {
  test('west vaulted hall has a physical return passage to primary cave for seed '+seed,()=>{
    const world=new VoxelWorld(seed),saved=JSON.stringify(world.save());
    const route=westLoopTraversal(world);
    assert.equal(route.samples.length,14);
    assert.deepEqual(route.failures,[]);
    assert.equal(route.walkable,true);
    const exit=route.samples.at(-1);
    assert.equal(exit.x,CAVE_CANDIDATE.x+24);
    assert.equal(exit.z,CAVE_CANDIDATE.z);
    const returnCell=route.samples[10];
    assert.equal(westGalleryWorld(world).get(returnCell.x,returnCell.y,returnCell.z),BLOCK.AIR);
    assert.equal(JSON.stringify(world.save()),saved);
  });
}
test('explicit saved block obstructs loop but never gets overwritten',()=>{
  const world=new VoxelWorld(179),sample=westLoopTraversal(world).samples[10];
  assert.equal(world.set(sample.x,sample.y,sample.z,BLOCK.WOOD),true);
  const saved=JSON.stringify(world.save());
  assert.equal(westGalleryWorld(world).get(sample.x,sample.y,sample.z),BLOCK.WOOD);
  assert.ok(westLoopTraversal(world).failures.some(p=>p.x===sample.x&&p.z===sample.z));
  assert.equal(JSON.stringify(world.save()),saved);
});

for(const seed of [179,1,2026,-77]) {
  test('third north alcove is a supported physical chamber for seed '+seed,()=>{
    const world=new VoxelWorld(seed),saved=JSON.stringify(world.save());
    const route=northAlcoveTraversal(world);
    assert.equal(route.samples.length,7);
    assert.deepEqual(route.failures,[]);
    assert.equal(route.walkable,true);
    const far=route.samples.at(-1),reader=westGalleryWorld(world);
    assert.equal(far.x,CAVE_CANDIDATE.x+11);
    assert.equal(far.z,CAVE_CANDIDATE.z-15);
    assert.equal(reader.get(far.x,far.y+3,far.z),BLOCK.AIR);
    assert.equal(JSON.stringify(world.save()),saved);
  });
}
test('third cavern honors saved edits and reports obstructed traversal',()=>{
  const world=new VoxelWorld(179),sample=northAlcoveTraversal(world).samples.at(-1);
  assert.equal(world.set(sample.x,sample.y,sample.z,BLOCK.WOOD),true);
  const saved=JSON.stringify(world.save());
  assert.equal(westGalleryWorld(world).get(sample.x,sample.y,sample.z),BLOCK.WOOD);
  assert.equal(northAlcoveTraversal(world).walkable,false);
  assert.equal(JSON.stringify(world.save()),saved);
});
