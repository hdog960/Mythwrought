import assert from 'node:assert/strict';
import {BLOCK,baseBlock,WORLD_MAX_Y} from '../src/voxel.mjs';
import {planCanopyWalkway,placeCanopyWalkway} from '../src/canopy-walkway.mjs';
const seed=17,y=WORLD_MAX_Y-3;
function fixture(failAt=Infinity){
 const edits=new Map(),k=(x,y,z)=>[x,y,z].join(',');
 let writes=0;
 const world={seed,get(x,y,z){return edits.has(k(x,y,z))?edits.get(k(x,y,z)):baseBlock(x,y,z,seed);},
 set(x,y,z,id){if(++writes===failAt)return false;edits.set(k(x,y,z),id);return true;}};
 return {world,edits,k};
}
let found=null;
for(let x=-150;x<150&&!found;x+=3)for(let z=-150;z<150&&!found;z+=3){
 const f=fixture(),a=[x,z],b=[x+5,z];
 if(Array.from({length:6},(_,i)=>[x+i,z]).every(([px,pz])=>
  baseBlock(px,y,pz,seed)===BLOCK.AIR&&
  baseBlock(px,y+1,pz,seed)===BLOCK.AIR&&
  baseBlock(px,y+2,pz,seed)===BLOCK.AIR)){
  f.edits.set(f.k(x,y,z),BLOCK.WOOD);
  f.edits.set(f.k(x+5,y,z),BLOCK.WOOD);
  const plan=planCanopyWalkway(f.world,a,b,y);
  if(plan)found={...f,a,b,plan};
 }
}
assert.ok(found,'find a natural-air corridor for real voxel walkway');
const {world,edits,k,a,b,plan}=found;
assert.ok(plan.cells.some(c=>c[3]===BLOCK.LEAVES));
assert.ok(plan.cells.some(c=>c[3]===BLOCK.WOOD));
const occupancy=new Map(plan.cells.map(([x,cy,z,id])=>[[x,cy,z].join(','),id]));
for(const [x,cy,z,id] of plan.cells){
 if(id!==BLOCK.LEAVES)continue;
 assert.equal(occupancy.get([x,cy-1,z].join(',')),BLOCK.WOOD,'every raised leaf has physical timber support');
 assert.ok([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>
   occupancy.get([x+dx,cy-1,z+dz].join(','))===BLOCK.WOOD),
 'foliage support is attached to another timber cell');
}
assert.ok(plan.cells.some(([x,cy,z,id])=>cy===y&&id===BLOCK.WOOD&&
 (z!==a[1]||x<a[0]||x>b[0])),'cross-axis outriggers are physical');
assert.ok(plan.cells.every(c=>c[1]===y||c[1]===y+1));
assert.equal(planCanopyWalkway(world,a,[a[0]+3,a[1]+1],y),null,'diagonal forbidden');
assert.equal(planCanopyWalkway(world,a,[a[0]+10,a[1]],y),null,'overspan forbidden');
assert.equal(placeCanopyWalkway(world,{...plan,cells:plan.cells.slice(1)}),false,'tampering rejected');
const blocked=fixture();blocked.edits.set(blocked.k(...[a[0],y,a[1]]),BLOCK.WOOD);
blocked.edits.set(blocked.k(...[b[0],y,b[1]]),BLOCK.WOOD);
blocked.edits.set(blocked.k(a[0]+2,y,a[1]),BLOCK.CRYSTAL);
assert.equal(planCanopyWalkway(blocked.world,a,b,y),null,'player edit protected');
assert.equal(placeCanopyWalkway(world,plan),true);
assert.ok(plan.cells.every(([x,cy,z,id])=>world.get(x,cy,z)===id));
assert.equal(placeCanopyWalkway(world,plan),false,'no duplicate placement');
const failure=fixture(4);
failure.edits.set(failure.k(a[0],y,a[1]),BLOCK.WOOD);
failure.edits.set(failure.k(b[0],y,b[1]),BLOCK.WOOD);
const before=new Map(failure.edits);
assert.equal(placeCanopyWalkway(failure.world,plan),false);
for(const [x,cy,z] of plan.cells)assert.equal(failure.world.get(x,cy,z),BLOCK.AIR,'rollback restores air');
assert.equal(failure.world.get(a[0],y,a[1]),BLOCK.WOOD);
assert.equal(failure.world.get(b[0],y,b[1]),BLOCK.WOOD);
console.log('Canopy walkway: supported staggered crowns, corridor, edits, tampering, rollback PASS');
