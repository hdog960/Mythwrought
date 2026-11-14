import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {planVoxelGrove} from '../src/voxel-groves.mjs';
test('grove composition is deterministic, bounded, nonmutating and physical',()=>{
 for(const seed of [179,917,-184]){
  const world=new VoxelWorld(seed),before=world.save();
  const opts={minX:-48,minZ:-48,maxX:48,maxZ:48,maxTrees:16};
  const a=planVoxelGrove(world,opts),b=planVoxelGrove(new VoxelWorld(seed),opts);
  assert.deepEqual(a,b);
  assert.ok(a.treeCount>0&&a.treeCount<=16);
  assert.ok(a.plans.every(p=>p.cells.some(c=>c[3]===BLOCK.WOOD)&&p.cells.some(c=>c[3]===BLOCK.LEAVES)));
  const keys=new Set();
  for(const p of a.plans)for(const c of p.cells){
   const k=c.slice(0,3).join(',');
   assert.ok(!keys.has(k),'tree crowns may not overlap');
   keys.add(k);
  }
  assert.deepEqual(world.save(),before);
 }
});
test('rejects unbounded requests and leaves existing edits untouched',()=>{
 const w=new VoxelWorld(179);
 assert.equal(planVoxelGrove(w,{minX:0,minZ:0,maxX:1000,maxZ:1000}),null);
 assert.equal(planVoxelGrove(w,{minX:10,minZ:0,maxX:0,maxZ:10}),null);
 assert.equal(planVoxelGrove(w,{minX:0,minZ:0,maxX:10,maxZ:10,spacing:2}),null);
 const before=w.save();
 assert.ok(planVoxelGrove(w,{minX:0,minZ:0,maxX:30,maxZ:30}));
 assert.deepEqual(w.save(),before);
});
