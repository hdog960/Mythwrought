import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {planVoxelGrove,placeVoxelGrove} from '../src/voxel-groves.mjs';
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

test('footpath corridors remain traversable under real tree voxel occupancy',()=>{
 for(const seed of [179,917,-184]){
  const w=new VoxelWorld(seed),before=w.save();
  const opts={minX:-48,minZ:-48,maxX:48,maxZ:48,maxTrees:32,
   paths:[[[-48,0],[48,0]],[[0,-48],[0,48]]]};
  const a=planVoxelGrove(w,opts),b=planVoxelGrove(new VoxelWorld(seed),opts);
  assert.deepEqual(a,b);
  for(const p of a.plans)for(const [x,y,z] of p.cells){
   if(y>p.origin[1]+3)continue;
   assert.ok(Math.abs(z)>2||x < -48||x > 48,'east-west route obstructed');
   assert.ok(Math.abs(x)>2||z < -48||z > 48,'north-south route obstructed');
  }
  assert.deepEqual(w.save(),before);
 }
});
test('rejects malformed and unbounded path reservations',()=>{
 const w=new VoxelWorld(179),bounds={minX:-16,minZ:-16,maxX:16,maxZ:16};
 for(const paths of [null,{},Array(9).fill([[0,0],[1,1]]),
  [[[0,0],[1000,0]]],[[[0,0],[NaN,1]]],[[[0,0]]]]){
  assert.equal(planVoxelGrove(w,{...bounds,paths}),null);
 }
});

test('protected cave approaches and landmark clearings exclude all tree voxels',()=>{
 for(const seed of [179,917,-184]){
  const w=new VoxelWorld(seed),before=w.save();
  const opts={minX:-48,minZ:-48,maxX:48,maxZ:48,maxTrees:48,
   protectedSites:[[0,0,15],[24,-24,9],[-24,24,7]]};
  const a=planVoxelGrove(w,opts);
  assert.deepEqual(a,planVoxelGrove(new VoxelWorld(seed),opts));
  assert.ok(a.treeCount>0);
  for(const plan of a.plans)for(const [x,,z] of plan.cells)
   for(const [sx,sz,r] of opts.protectedSites)
    assert.ok((x-sx)**2+(z-sz)**2>r*r,'cave/landmark clearance must include canopy');
  assert.deepEqual(w.save(),before);
 }
});
test('rejects malformed and excessive protected sites without modifying saves',()=>{
 const w=new VoxelWorld(179),before=w.save();
 const bounds={minX:-16,minZ:-16,maxX:16,maxZ:16};
 for(const protectedSites of [null,{},Array(17).fill([0,0,2]),
  [[0,0,1]],[[0,0,25]],[[0,0,NaN]],[[1000,0,5]],[[0,0]],[[0,0,3.5]]])
  assert.equal(planVoxelGrove(w,{...bounds,protectedSites}),null);
 assert.deepEqual(w.save(),before);
});

test('whole-grove installation writes physical voxels and survives schema-1 roundtrip',()=>{
 const w=new VoxelWorld(179);
 const grove=planVoxelGrove(w,{minX:-32,minZ:-32,maxX:32,maxZ:32,maxTrees:4});
 assert.ok(grove.treeCount>=2);
 assert.equal(placeVoxelGrove(w,grove),true);
 for(const p of grove.plans)for(const [x,y,z,id] of p.cells)
  assert.equal(w.get(x,y,z),id);
 const restored=VoxelWorld.restore(w.save());
 for(const p of grove.plans)for(const [x,y,z,id] of p.cells)
  assert.equal(restored.get(x,y,z),id);
});
test('whole-grove rejects tampering and rolls back failed writes',()=>{
 const w=new VoxelWorld(917),before=w.save();
 const grove=planVoxelGrove(w,{minX:-32,minZ:-32,maxX:32,maxZ:32,maxTrees:4});
 assert.ok(grove.treeCount>=2);
 const corrupt=structuredClone(grove);
 corrupt.plans[1].cells[0][3]=BLOCK.STONE;
 assert.equal(placeVoxelGrove(w,corrupt),false);
 assert.deepEqual(w.save(),before);
 const originalSet=w.set.bind(w);
 let writes=0,failed=false;
 w.set=(x,y,z,id)=>{
  if(id!==BLOCK.AIR&&++writes===grove.plans[0].cells.length+3&&!failed){
   failed=true;return false;
  }
  return originalSet(x,y,z,id);
 };
 assert.equal(placeVoxelGrove(w,grove),false);
 assert.deepEqual(w.save(),before);
 w.set=originalSet;
 assert.equal(placeVoxelGrove(w,grove),true);
});
