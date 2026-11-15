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
// The old twin continuous side rails read as a rigid box fence. Branch
// occupancy must now be sparse, staggered and rooted to the central deck.
const deckLength=Math.abs(b[0]-a[0])+Math.abs(b[1]-a[1]);
const limbs=plan.cells.filter(([x,cy,z,id])=>cy===y&&id===BLOCK.WOOD&&
 (a[0]===b[0]?x!==a[0]:z!==a[1]));
assert.ok(limbs.length<2*(deckLength-3),'no continuous paired side fences');
assert.ok(limbs.length>=deckLength-3,'at least one branch per interior step');
const left=limbs.filter(([x,,z])=>a[0]===b[0]?x<a[0]:z<a[1]).length;
const right=limbs.length-left;
assert.ok(left>0&&right>0,'crown alternates between both sides');
for(const [x,cy,z] of limbs){
 assert.equal(occupancy.get([x,cy+1,z].join(',')),BLOCK.LEAVES,'each limb supports its crown');
 assert.ok([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>
  occupancy.get([x+dx,cy,z+dz].join(','))===BLOCK.WOOD),
 'each limb is attached to deck timber');
}
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

// Long-span regression: two tapered side branches must remain physically
// supported, deterministic, and outside the two-block-high walkable aisle.
// Search a fixed-seed natural-air site instead of fabricating empty terrain.
let longSite=null;
for(let x=-150;x<150&&!longSite;x+=3)for(let z=-150;z<150&&!longSite;z+=3){
 const sample=fixture(),aa=[x,z],bb=[x+7,z];
 sample.edits.set(sample.k(x,y,z),BLOCK.WOOD);
 sample.edits.set(sample.k(x+7,y,z),BLOCK.WOOD);
 const candidate=planCanopyWalkway(sample.world,aa,bb,y);
 if(candidate)longSite={...sample,aa,bb,candidate};
}
assert.ok(longSite,'fixed-seed seven-cell span supports a tapered crown');
const {candidate:longPlan}=longSite;
const longOccupancy=new Map(longPlan.cells.map(([x,cy,z,id])=>[[x,cy,z].join(','),id]));
const outerTips=longPlan.cells.filter(([x,cy,z,id])=>cy===y&&id===BLOCK.WOOD&&Math.abs(z-longSite.aa[1])===2);
assert.equal(outerTips.length,2,'two separated taper tips rather than a continuous fence');
for(const [x,cy,z] of outerTips){
 assert.equal(longOccupancy.get([x,cy+1,z].join(',')),BLOCK.LEAVES,'tip foliage sits on timber');
 const innerZ=z+Math.sign(longSite.aa[1]-z);
 assert.equal(longOccupancy.get([x,cy,innerZ].join(',')),BLOCK.WOOD,'tip is joined to an inner branch');
}
for(let i=0;i<=7;i++)for(let h=1;h<=2;h++)
 assert.equal(longOccupancy.has([longSite.aa[0]+i,y+h,longSite.aa[1]].join(',')),false,
 'walking aisle remains free of canopy voxels');
assert.deepEqual(planCanopyWalkway(longSite.world,longSite.aa,longSite.bb,y)?.cells,longPlan.cells,
 'crown variant is stable for the same seed and anchors');
assert.equal(placeCanopyWalkway(longSite.world,longPlan),true,'long crown can be placed');
assert.equal(placeCanopyWalkway(longSite.world,longPlan),false,'long crown cannot duplicate edits');

console.log('Canopy walkway: supported staggered crowns, corridor, edits, tampering, rollback PASS');
