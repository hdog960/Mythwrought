// MYTHWROUGHT Builder B Roadmap B Wave56 focused ORIGINAL source tests.
// These native Node22 tests are STAGED, not proven on a genuine full checkout.
// An isolated V8 test/assert adapter may execute exactly their callback bodies
// without claiming native ES imports, Pack3/4 physical runtime, real water,
// original browser WebGL2, installed iPhone PWA or full accepted228 D4.
// Preserve strict source ownership and reject any D4 overlap >=0.85.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildWillowmarshThreeRingDryBathPavilion,WILLOWMARSH_THREE_RING_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave56.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildSunshardSplitWellBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave5.mjs';
import {buildHearthspanDoubleCourtWinterBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave18.mjs';
import {buildWistermereCrescentBaths} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave24.mjs';
import {buildFrostmereThreeCourtBathLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave35.mjs';
import {buildSuncradleOffsetBasinBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave43.mjs';
import {buildVesperfrostFourCourtDryBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave50.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const peers=[
 buildSunshardSplitWellBathhouse,buildHearthspanDoubleCourtWinterBathhouse,
 buildWistermereCrescentBaths,buildFrostmereThreeCourtBathLodge,
 buildSuncradleOffsetBasinBathhouse,buildVesperfrostFourCourtDryBathhouse
];
const rings=[
 ['western-stone-dry-bath',19,90],
 ['central-stone-dry-bath',42,90],
 ['eastern-stone-dry-bath',65,90]
];
function d4(v,flip,t){
 const set=new Set(),{width:w,height:h,depth:d}=v.footprint;
 for(const p of v.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),
   Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(t===1)[x,z]=[Z,15-A];
  if(t===2)[x,z]=[15-A,15-Z];
  if(t===3)[x,z]=[15-Z,A];
  set.add([x,Y,z,p.role].join('/'));
 }
 return set;
}
function iou(a,b){let n=0;for(const k of a)if(b.has(k))n++;return n/(a.size+b.size-n||1)}
test('Frozen exclusive B115 temperate LARGE bathhouse #003 not D92 or accepted228 and no live world placement',()=>{
 const b=buildWillowmarshThreeRingDryBathPavilion(),own=getBuilderBServiceOwnership();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(b.id,WILLOWMARSH_THREE_RING_ID);
 assert.equal(b.id,'r1:bathhouse:temperate:large:003');
 assert.ok(own.builderBIds.includes(b.id));
 assert.ok(!own.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['bathhouse','temperate','large']);
 assert.equal(b.status,'candidate');
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.schema1SaveWritten,false);
});
test('Actual original source compiler validates 22,976 unique original cells, 6,756 connected y1 walks, 24 rooms and 36 grounded portals',()=>{
 const b=buildWillowmarshThreeRingDryBathPavilion();
 assert.deepEqual(b.footprint,{width:84,height:40,depth:104});
 assert.equal(b.placements.length,22976);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,22976);
 assert.equal(b.walkable.length,6756);
 assert.equal(b.rooms.length,24);assert.equal(b.portals.length,36);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,56);
});
test('All 5,497 genuine candidate original Pack3 roofs are immediately solid-backed with twelve genuinely occupied distinct roof wings',()=>{
 const b=buildWillowmarshThreeRingDryBathPavilion(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roofs=b.placements.filter(p=>p.role==='roof'),wingCounts=new Map();
 assert.equal(roofs.length,5497);
 for(const p of roofs){
  const [x,y,z]=p.at;
  assert.match(p.asset,/^pack3:/);
  assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(['wall','partition','support'].includes(m.get(K(x,y-1,z))?.role),
   'false Pack3 immediate physical bearer '+p.at);
  const name=p.willowmarshRealNonemptyRoofWing;
  assert.ok(name,'genuine original candidate roof missing occupied wing');
  wingCounts.set(name,(wingCounts.get(name)||0)+1);
 }
 assert.equal(wingCounts.size,12);
 for(const [name,count] of wingCounts)
  assert.ok(count>=60,'occluded or fictitious occupied original roof '+name);
});
test('Twelve real original stone posts continue from true stone foundation to their individual roof underside after doorways, screens, glazing',()=>{
 const b=buildWillowmarshThreeRingDryBathPavilion(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  parts=b.placements.filter(p=>p.purpose?.startsWith('willowmarsh-real-full-height-roof-bearing-')),
  first=new Map();
 for(const p of parts){
  const name=p.purpose.slice('willowmarsh-real-full-height-roof-bearing-'.length);
  if(!first.has(name))first.set(name,p.at);
 }
 assert.equal(first.size,12);
 for(const [name,[x,,z]] of first){
  const top=b.placements.find(p=>p.willowmarshRealNonemptyRoofWing===name&&p.at[0]===x&&p.at[2]===z)?.at[1];
  assert.ok(Number.isInteger(top),'source roof missing under genuine post '+name);
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  for(let y=1;y<top;y++)
   assert.ok(['wall','support','partition'].includes(m.get(K(x,y,z))?.role),
    'bearing post was removed by later authoring '+name+' '+K(x,y,z));
 }
});
test('All five fully authentic stone-founded sky courtyards have 578 original walkable y1 columns with zero solids above to source sky top',()=>{
 const b=buildWillowmarshThreeRingDryBathPavilion(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let total=0;
 for(const [x0,z0,x1,z1] of [
  [36,26,48,39],[16,49,25,59],[59,49,68,59],
  [36,63,47,72],[26,63,32,70]
 ])for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  total++;
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,z)),'open court has no actual y1 walk '+K(x,1,z));
  for(let y=1;y<b.footprint.height;y++)
   assert.ok(!m.has(K(x,y,z)),'fictitious source open sky court '+K(x,y,z));
 }
 assert.equal(total,578);
});
test('Three distinct 9x9 original stone-founded dry bath precincts have exactly 168 actual opaque two-tier masonry wall cells and twelve 2-high clear gates',()=>{
 const b=buildWillowmarshThreeRingDryBathPavilion(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let walls=0,gates=0;
 for(const [name,cx,cz] of rings)
  for(let x=cx-4;x<=cx+4;x++)for(let z=cz-4;z<=cz+4;z++){
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   const perimeter=x===cx-4||x===cx+4||z===cz-4||z===cz+4;
   const gate=(x===cx-1||x===cx)&&(z===cz-4||z===cz+4);
   if(perimeter&&!gate)for(let y=1;y<=2;y++){
    walls++;
    assert.equal(m.get(K(x,y,z))?.willowmarshActualTwoTierDryStoneBathWall,name);
    assert.equal(m.get(K(x,y,z))?.asset,'live:stone');
    assert.ok(!walk.has(K(x,1,z)),'stone wall phantom walkway '+K(x,1,z));
   }
   if(gate){
    gates++;
    assert.ok(walk.has(K(x,1,z)),'actual bath entrance not walkable');
    assert.ok(!m.has(K(x,2,z)),'real bath entrance lacks headroom');
   }
  }
 assert.deepEqual([walls,gates],[168,12]);
});
test('Each genuine bath ring is uninterruptedly traversable north-to-south and south-to-north on original cardinal y1/y2 walking around solid basin',()=>{
 const b=buildWillowmarshThreeRingDryBathPavilion(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let traversed=0;
 for(const [name,cx,cz] of rings)for(const z of [cz-4,cz+4]){
  const start=K(cx-1,1,z),goal=K(cx-1,1,z===cz-4?cz+4:cz-4),
   queue=[start],seen=new Set(queue);
  for(let i=0;i<queue.length;i++){
   const [x,,Z]=queue[i].split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const X=x+dx,ZZ=Z+dz,k=K(X,1,ZZ);
    if(X<cx-4||X>cx+4||ZZ<cz-4||ZZ>cz+4||
       seen.has(k)||!walk.has(k)||m.has(K(X,2,ZZ)))continue;
    seen.add(k);queue.push(k);
   }
  }
  assert.ok(seen.has(goal),'original source 2-high bath-ring movement disconnected '+name);
  traversed++;
 }
 assert.equal(traversed,6);
});
test('All three 3x3 true source stone DRY central basins contain 27 grounded solid bases, 24 raised stone rim cells and three real empty upper centers',()=>{
 const b=buildWillowmarshThreeRingDryBathPavilion(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let bases=0,rims=0,centers=0;
 for(const [name,cx,cz] of rings)
  for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   const body=m.get(K(x,1,z));
   assert.equal(body?.willowmarshGenuineDryStoneInnerBasin,name);
   assert.equal(body?.asset,'live:stone');
   assert.ok(!walk.has(K(x,1,z)),'dry stone basin is ghostly walkable');bases++;
   if(x===cx-1||x===cx+1||z===cz-1||z===cz+1){
    const rim=m.get(K(x,2,z));
    assert.equal(rim?.willowmarshFullOriginalDryStoneInnerBasinRim,name);
    assert.equal(rim?.asset,'live:stone');
    rims++;
   }else{
    assert.ok(!m.has(K(x,2,z)),'original source dry basin center covered');
    centers++;
   }
  }
 assert.deepEqual([bases,rims,centers],[27,24,3]);
 assert.equal(b.architecturalIdentity.workingHotWater,false);
 assert.equal(b.architecturalIdentity.actualLiquidPhysics,false);
});
test('Every one of 36 genuine room and bath-ring portals has stone footing and true walkable y1/two-high y2 headroom',()=>{
 const b=buildWillowmarshThreeRingDryBathPavilion(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 assert.equal(b.portals.length,36);
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,y,z)),'portal actual original y1 body blocked '+p.at);
  assert.ok(!m.has(K(x,y+1,z)),'portal actual original y2 head blocked '+p.at);
 }
 for(const [name] of rings)
  assert.equal(b.portals.filter(p=>p.to===name).length,2,'missing north/south bath entrances '+name);
});
test('All three fully outside bathing approaches connect west/east by real cardinal stone walk through only unroofed z>=99 corridor',()=>{
 const b=buildWillowmarshThreeRingDryBathPavilion(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(','))),
  start=K(19,1,101),end=K(65,1,101),queue=[start],seen=new Set(queue);
 for(let i=0;i<queue.length;i++){
  const [x,,z]=queue[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const Z=z+dz,k=K(x+dx,1,Z);
   if(Z<99||seen.has(k)||!walk.has(k))continue;
   seen.add(k);queue.push(k);
  }
 }
 assert.ok(seen.has(end),'true outside baths west/center/east path broken');
 assert.equal(seen.size,284);
 for(const x of [19,42,65]){
  assert.equal(m.get(K(x,0,101))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,101)));
 }
});
test('105 original unresolved Pack4 candidate panes form 21 truly outward five-high completely stone framed source bays',()=>{
 const b=buildWillowmarshThreeRingDryBathPavilion(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  panes=b.placements.filter(p=>p.role==='window'),faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]},groups=new Map();
 assert.equal(panes.length,105);
 for(const p of panes){
  const [x,y,z]=p.at,d=faces[p.orientation],cell=x+','+z;
  assert.ok(d,'candidate pane face missing');
  assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,7,z))?.role,'wall');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,7,z))?.asset,'live:stone');
  assert.ok(!m.has(K(x+d[0],y,z+d[1])),'pane faces real original source solid');
  if(!groups.has(cell))groups.set(cell,new Set());
  groups.get(cell).add(y);
 }
 assert.equal(groups.size,21);
 for(const ys of groups.values())assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4,5,6]);
});
test('Six REAL prior bathhouse original constructors, 48 unchanged strict D4 rotations/reflections <0.85, no duplicate ID or structural fingerprint',()=>{
 const b=buildWillowmarshThreeRingDryBathPavilion(),original=d4(b,false,0);
 let total=0,maxIoU=0,nearest=null;
 for(const constructor of peers){
  const other=constructor();
  assert.notEqual(other.id,b.id);
  assert.notEqual(structuralFingerprint(other),structuralFingerprint(b));
  for(const mirror of [false,true])for(let orientation=0;orientation<4;orientation++){
   const v=iou(original,d4(other,mirror,orientation));
   if(v>maxIoU){maxIoU=v;nearest=other.id;}
   assert.ok(v<.85,'authentic original bathhouse near-clone '+other.id+' '+v);
   total++;
  }
 }
 assert.equal(total,48);
 console.log('WILLOWMARSH_SIX_ACTUAL_ORIGINAL_BATHHOUSE_PEERS_48_D4_PASS '+JSON.stringify({total,maxIoU,nearest}));
});
