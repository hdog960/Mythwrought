import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {WORLD_MIN_Y} from '../src/depth.mjs';
import {descentWorld,descentRoute,descentEvidence,descentConnectivity} from '../src/underground-switchback-descent.mjs';
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

for(const seed of [179,1,2026,-77])test('ordered four-band descent connectivity '+seed,()=>{
  const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
  const audit=descentConnectivity(world);
  assert.equal(audit.connected,true,JSON.stringify(audit.failures.slice(0,5)));
  assert.equal(audit.bands.length,4);
  assert.ok(audit.bands.every(n=>n>30));
  assert.equal(audit.surfaceConnected,false);
  assert.equal(JSON.stringify(world.save()),before);
});
test('player-edited obstruction makes full-depth route fail',()=>{
  const world=new VoxelWorld(179),p=descentRoute()[350];
  assert.equal(world.set(p.x,p.feet,p.z,BLOCK.WOOD),true);
  const audit=descentConnectivity(world);
  assert.equal(audit.connected,false);
  assert.ok(audit.failures.some(f=>f.reason==='blocked-or-unsupported'));
});
test('edited missing floor makes full-depth route fail',()=>{
  const world=new VoxelWorld(179),p=descentRoute()[550];
  assert.equal(world.set(p.x,p.floor,p.z,BLOCK.AIR),true);
  const audit=descentConnectivity(world);
  assert.equal(audit.connected,false);
});

test('first descending step has full headroom below untouched legacy floor',()=>{
  const world=new VoxelWorld(179),reader=descentWorld(world),route=descentRoute();
  const first=route[0];
  assert.ok(first.feet+3<-3,'four-cell tunnel must remain below legacy -3');
  for(let h=1;h<=4;h++)assert.equal(reader.get(first.x,first.floor+h,first.z),BLOCK.AIR);
  assert.notEqual(reader.get(first.x,first.floor,first.z),BLOCK.AIR);
  assert.equal(reader.get(first.x,-3,first.z),world.get(first.x,-3,first.z));
  assert.equal(descentConnectivity(world).connected,true);
});
