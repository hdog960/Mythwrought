import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides} from '../src/voxel.mjs';
import {planVoxelPilgrimCourt,placeVoxelPilgrimCourt} from '../src/voxel-pilgrim-court.mjs';
function find(seed){
 const w=new VoxelWorld(seed);
 for(let z=-160;z<=160;z+=4)for(let x=-160;x<=160;x+=4){
  const plan=planVoxelPilgrimCourt(w,x,z);
  if(plan)return {w,plan};
 }
 return null;
}
test('two physical arches have a continuous open approach and stable cells',()=>{
 const found=find(179);
 assert.ok(found,'representative seed must have a suitable natural site');
 const {w,plan}=found;
 assert.deepEqual(planVoxelPilgrimCourt(w,plan.origin[0],plan.origin[2]),plan);
 assert.equal(plan.gates.length,2);
 assert.equal(plan.blockCount,plan.gates[0].blockCount+plan.gates[1].blockCount);
 assert.ok(plan.cells.every(c=>c[3]===BLOCK.STONE));
 const [x,h,z]=plan.origin;
 assert.equal(collides(w,x+.5,h+2,z+.5),false);
});
test('opt-in construction produces real editable collision voxels and saved restoration',()=>{
 const found=find(179);assert.ok(found);
 const {w,plan}=found;
 assert.equal(placeVoxelPilgrimCourt(w,plan),true);
 const [x,h,z]=plan.gates[0].origin;
 assert.equal(w.get(x,h+5,z),BLOCK.STONE);
 assert.equal(collides(w,x+2.5,h+2,z+.5),true);
 assert.deepEqual(VoxelWorld.restore(w.save()).save(),w.save());
});
test('saved corridor edits prevent construction without altering the save',()=>{
 const found=find(179);assert.ok(found);
 const {w,plan}=found;const [x,h,z]=plan.origin;
 assert.equal(w.set(x,h+2,z,BLOCK.WOOD),true);
 const before=w.save();
 assert.equal(placeVoxelPilgrimCourt(w,plan),false);
 assert.deepEqual(w.save(),before);
});
