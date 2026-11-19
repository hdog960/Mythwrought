import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,worldKey} from '../src/voxel.mjs';
import {descentCells,descentWorld,descentRoute} from '../src/underground-switchback-descent.mjs';

// Reusing a seed-independent topology must never cache saved player edits,
// leak public Map mutations, or accidentally reuse another origin's caves.
test('private cave topology cache preserves edit precedence and public snapshot isolation',()=>{
  const origin={x:192,z:192};
  const route=descentRoute(origin);
  const p=route.find(step=>step.floor===-90);
  assert.ok(p);
  const key=worldKey(p.x,p.feet,p.z);
  const a=new VoxelWorld(179),b=new VoxelWorld(-77);
  const readerA=descentWorld(a,origin);
  const readerB=descentWorld(b,origin);
  assert.equal(readerA.get(p.x,p.feet,p.z),BLOCK.AIR);
  assert.equal(readerB.get(p.x,p.feet,p.z),BLOCK.AIR);
  const snapshot=descentCells(origin);
  assert.equal(snapshot.get(key),BLOCK.AIR);
  snapshot.set(key,BLOCK.DEEPSTONE);
  assert.equal(descentWorld(a,origin).get(p.x,p.feet,p.z),BLOCK.AIR,
    'a public candidate-cell snapshot cannot poison the private topology');
  a.edits.set(key,BLOCK.DEEPSTONE);
  assert.equal(readerA.get(p.x,p.feet,p.z),BLOCK.DEEPSTONE,
    'the already-created reader must observe a new saved edit');
  assert.equal(descentWorld(a,origin).get(p.x,p.feet,p.z),BLOCK.DEEPSTONE);
  assert.equal(readerB.get(p.x,p.feet,p.z),BLOCK.AIR,
    'saved edits must not leak across worlds sharing a topology');
  a.edits.delete(key);
  assert.equal(readerA.get(p.x,p.feet,p.z),BLOCK.AIR,
    'removing an edit must reveal the authored air without stale caching');
  assert.equal(a.edits.size,0);
  assert.equal(b.edits.size,0);
});

test('distinct origins do not share physical cave coordinates',()=>{
  const world=new VoxelWorld(2026);
  const a={x:192,z:192},b={x:512,z:512};
  const pa=descentRoute(a).find(p=>p.floor===-100);
  const pb=descentRoute(b).find(p=>p.floor===-100);
  assert.ok(pa&&pb);
  assert.equal(descentWorld(world,a).get(pa.x,pa.feet,pa.z),BLOCK.AIR);
  assert.equal(descentWorld(world,b).get(pb.x,pb.feet,pb.z),BLOCK.AIR);
  assert.equal(descentCells(a).has(worldKey(pb.x,pb.feet,pb.z)),false);
  assert.equal(descentCells(b).has(worldKey(pa.x,pa.feet,pa.z)),false);
  assert.equal(world.edits.size,0);
});
