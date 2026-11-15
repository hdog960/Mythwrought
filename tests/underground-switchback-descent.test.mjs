import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {WORLD_MIN_Y} from '../src/depth.mjs';
import {descentWorld,descentRoute,descentEvidence} from '../src/underground-switchback-descent.mjs';
for(const seed of [179,1,2026,-77])test('four depth bands have solid floors and two-block air: '+seed,()=>{
  const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
  const bands=descentEvidence(world);
  assert.equal(bands.length,4);
  for(const b of bands){assert.ok(b.count>30,JSON.stringify(b));assert.equal(b.invalid,0,JSON.stringify(b));}
  const route=descentRoute();
  assert.ok(route.at(-1).floor<=WORLD_MIN_Y+8);
  assert.equal(JSON.stringify(world.save()),before);
});
test('player edits override cave and persist through schema-1 save/restore',()=>{
  const world=new VoxelWorld(179),p=descentRoute()[400];
  assert.equal(world.set(p.x,p.feet,p.z,BLOCK.WOOD),true);
  const snapshot=world.save(),restored=VoxelWorld.restore(snapshot);
  assert.deepEqual(restored.save(),snapshot);
  assert.equal(descentWorld(restored).get(p.x,p.feet,p.z),BLOCK.WOOD);
  assert.ok(descentEvidence(restored).some(b=>b.invalid>0));
});
test('legacy terrain and unopened surface floor are untouched',()=>{
  const world=new VoxelWorld(179),reader=descentWorld(world);
  for(const [x,y,z] of [[192,-3,192],[192,0,192],[208,8,208],[220,12,220]])
    assert.equal(reader.get(x,y,z),world.get(x,y,z));
});
