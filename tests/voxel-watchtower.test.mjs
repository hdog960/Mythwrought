import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides,raycast} from '../src/voxel.mjs';
import {planVoxelWatchtower,placeVoxelWatchtower} from '../src/voxel-watchtower.mjs';
function find(world){
 for(let z=-320;z<=320;z+=8)for(let x=-320;x<=320;x+=8){
  const plan=planVoxelWatchtower(world,x,z);
  if(plan)return plan;
 }
 throw Error('No eligible level footprint in deterministic fixture');
}
test('physical template is deterministic, bounded and has a clear doorway',()=>{
 const w=new VoxelWorld(179),a=find(w),b=planVoxelWatchtower(w,a.origin[0],a.origin[2]);
 assert.deepEqual(a,b);
 assert.ok(a.blockCount>150&&a.blockCount<400);
 assert.deepEqual(a.materialIds,[BLOCK.STONE]);
 const [x,y,z]=a.entrance;
 assert.equal(a.cells.some(c=>c[0]===x&&c[1]===y&&c[2]===z),false);
 assert.equal(a.cells.some(c=>c[0]===x&&c[1]===y+1&&c[2]===z),false);
});
test('opt-in construction uses real editable collidable saved voxels',()=>{
 const w=new VoxelWorld(179),plan=find(w),[x,y,z]=plan.origin;
 assert.equal(placeVoxelWatchtower(w,plan),true);
 assert.equal(w.get(x,y,z),BLOCK.STONE);
 assert.equal(collides(w,x+.5,y+1,z+3.5),false);
 assert.equal(collides(w,x+3.5,y+1,z+3.5),true);
 assert.deepEqual(VoxelWorld.restore(w.save()).save(),w.save());
 assert.equal(w.set(x+3,y+1,z+3,BLOCK.AIR),true);
 assert.equal(w.get(x+3,y+1,z+3),BLOCK.AIR);
});
test('preexisting player edits prevent construction, without overwrites',()=>{
 const w=new VoxelWorld(179),plan=find(w),[x,y,z]=plan.origin;
 w.set(x,y+1,z+3,BLOCK.WOOD);
 const before=w.save();
 assert.equal(planVoxelWatchtower(w,x,z),null);
 assert.equal(placeVoxelWatchtower(w,plan),false);
 assert.deepEqual(w.save(),before);
});

test('stale plan refuses later interior construction even where no tower stone is placed',()=>{
 const w=new VoxelWorld(179),plan=find(w),[x,y,z]=plan.origin;
 assert.equal(w.set(x,y+2,z,BLOCK.WOOD),true);
 const before=w.save();
 assert.equal(placeVoxelWatchtower(w,plan),false);
 assert.deepEqual(w.save(),before);
 assert.equal(planVoxelWatchtower(w,x,z),null);
});
test('tampered candidate cells are rejected before writing any voxels',()=>{
 const w=new VoxelWorld(179),plan=find(w);
 const altered={...plan,cells:plan.cells.map(c=>[...c])};
 altered.cells[0][0]+=1;
 const before=w.save();
 assert.equal(placeVoxelWatchtower(w,altered),false);
 assert.deepEqual(w.save(),before);
});
test('fresh plans reject shallow excavated voids beneath foundations',()=>{
 const w=new VoxelWorld(179),plan=find(w),[x,y,z]=plan.origin;
 assert.equal(w.set(x,y-2,z,BLOCK.AIR),true);
 assert.equal(planVoxelWatchtower(w,x,z),null);
 assert.equal(placeVoxelWatchtower(w,plan),false);
});

test('real stone stairs connect interior to an open roof landing',()=>{
 const w=new VoxelWorld(179),plan=find(w),[x,y,z]=plan.origin;
 assert.equal(plan.stairSteps.length,5);
 assert.deepEqual(plan.stairSteps,[
  [x-2,y+1,z+2],[x-2,y+2,z+1],[x-2,y+3,z],
  [x-2,y+4,z-1],[x-2,y+5,z-2]]);
 for(const [sx,sy,sz] of plan.stairSteps)
  assert.ok(plan.cells.some(c=>c[0]===sx&&c[1]===sy&&c[2]===sz&&c[3]===BLOCK.STONE));
 for(const dz of [-2,-1])
  assert.ok(!plan.cells.some(c=>c[0]===x-2&&c[1]===y+6&&c[2]===z+dz));
 assert.ok(plan.cells.some(c=>c[0]===x-1&&c[1]===y+6&&c[2]===z-2));
 assert.equal(placeVoxelWatchtower(w,plan),true);
 for(const [sx,sy,sz] of plan.stairSteps)
  assert.equal(w.get(sx,sy,sz),BLOCK.STONE);
 assert.deepEqual(VoxelWorld.restore(w.save()).save(),w.save());
});
