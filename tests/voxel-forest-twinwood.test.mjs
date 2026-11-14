import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {planTwinwood,placeTwinwood} from '../src/voxel-forest-twinwood.mjs';
const find=(w)=>{
 for(let x=-48;x<=48;x+=2)for(let z=-48;z<=48;z+=2){
  const p=planTwinwood(w,x,z);if(p)return p;
 }
 return null;
};
test('twinwood is deterministic, physical and preserves edits until opt-in placement',()=>{
 for(const seed of [179,917,-184]){
  const w=new VoxelWorld(seed),before=w.save(),p=find(w);
  assert.ok(p,'expected reachable flat-ground twinwood site');
  assert.deepEqual(p,planTwinwood(new VoxelWorld(seed),p.origin[0],p.origin[2]));
  assert.ok(p.cells.some(c=>c[3]===BLOCK.WOOD));
  assert.ok(p.cells.some(c=>c[3]===BLOCK.LEAVES));
  assert.ok(p.cells.every(c=>c[1]>p.origin[1]));
  assert.deepEqual(w.save(),before);
  assert.equal(placeTwinwood(w,p),true);
  const restored=VoxelWorld.restore(w.save());
  for(const [x,y,z,id] of p.cells)assert.equal(restored.get(x,y,z),id);
 }
});
test('twinwood rejects tampering and rolls back interrupted placement',()=>{
 const w=new VoxelWorld(179),p=find(w),before=w.save();
 assert.ok(p);
 const bad=structuredClone(p);bad.cells[0][3]=BLOCK.STONE;
 assert.equal(placeTwinwood(w,bad),false);
 assert.deepEqual(w.save(),before);
 const original=w.set.bind(w);let writes=0;
 w.set=(x,y,z,id)=>id!==BLOCK.AIR&&++writes===9?false:original(x,y,z,id);
 assert.equal(placeTwinwood(w,p),false);
 assert.deepEqual(w.save(),before);
 w.set=original;
 assert.equal(placeTwinwood(w,p),true);
});
