import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides} from '../src/voxel.mjs';
import {planVoxelRuinedArch,placeVoxelRuinedArch} from '../src/voxel-ruined-arch.mjs';
function eligible(w){
 for(let z=-320;z<=320;z+=4)for(let x=-320;x<=320;x+=4){
  const p=planVoxelRuinedArch(w,x,z);if(p)return p;
 }
 throw Error('No safe arch site in seed '+w.seed);
}
test('arch is a deterministic real-block structure with an open passage',()=>{
 const w=new VoxelWorld(179),p=eligible(w),[x,h,z]=p.origin;
 assert.deepEqual(planVoxelRuinedArch(w,x,z),p);
 assert.ok(p.blockCount>20&&p.blockCount<90);
 for(let dy=1;dy<=4;dy++)for(let dx=-1;dx<=1;dx++)
  assert.equal(p.cells.some(c=>c[0]===x+dx&&c[1]===h+dy&&c[2]===z),false);
 assert.ok(p.cells.some(c=>c[0]===x&&c[1]===h+5&&c[2]===z));
});
test('opt-in placement creates collidable editable voxels and schema-1 restoration',()=>{
 const w=new VoxelWorld(179),p=eligible(w),[x,h,z]=p.origin;
 assert.equal(placeVoxelRuinedArch(w,p),true);
 assert.equal(w.get(x,h+5,z),BLOCK.STONE);
 assert.equal(collides(w,x+.5,h+2,z+.5),false);
 assert.equal(collides(w,x+2.5,h+2,z+.5),true);
 assert.deepEqual(VoxelWorld.restore(w.save()).save(),w.save());
});
test('saved interior edits and stale plans reject placement without overwriting',()=>{
 const w=new VoxelWorld(179),p=eligible(w),[x,h,z]=p.origin;
 assert.equal(w.set(x,h+2,z,BLOCK.WOOD),true);
 const saved=w.save();
 assert.equal(planVoxelRuinedArch(w,x,z),null);
 assert.equal(placeVoxelRuinedArch(w,p),false);
 assert.deepEqual(w.save(),saved);
});
test('tampered template and excavated foundation cannot be installed',()=>{
 const w=new VoxelWorld(179),p=eligible(w);
 const bad={...p,cells:p.cells.map(c=>[...c])};bad.cells[0][0]+=1;
 assert.equal(placeVoxelRuinedArch(w,bad),false);
 const [x,h,z]=p.origin;
 assert.equal(w.set(x,h-2,z,BLOCK.AIR),true);
 assert.equal(placeVoxelRuinedArch(w,p),false);
});
