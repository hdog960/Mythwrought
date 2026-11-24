// MYTHWROUGHT Builder B Wave61 Rimewhorl: staged genuine Node22-ELIGIBLE tests.
// Isolated original-source V8 callbacks ARE NOT native ESM/renderer acceptance.
// Pack3/4 original producer, true M7, full 228-history D4, installed
// Home Screen PWA and WebGL2 are UNRUN until explicitly tested.
// Original near-clone cutoff >=0.85 MUST remain unchanged.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildRimewhorlFourDrySaunaCourts,RIMEWHORL_FOUR_DRY_COURTS_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave61.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildSunshardSplitWellBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave5.mjs';
import {buildHearthspanDoubleCourtWinterBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave18.mjs';
import {buildWistermereCrescentBaths} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave24.mjs';
import {buildFrostmereThreeCourtBathLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave35.mjs';
import {buildSuncradleOffsetBasinBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave43.mjs';
import {buildVesperfrostFourCourtDryBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave50.mjs';
import {buildWillowmarshThreeRingDryBathPavilion} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave56.mjs';
const peers=[buildSunshardSplitWellBathhouse,buildHearthspanDoubleCourtWinterBathhouse,buildWistermereCrescentBaths,buildFrostmereThreeCourtBathLodge,buildSuncradleOffsetBasinBathhouse,buildVesperfrostFourCourtDryBathhouse,buildWillowmarshThreeRingDryBathPavilion];
const baths=[
 ['western-slate-dry-sauna',10,67],
 ['midwestern-slate-dry-sauna',24,67],
 ['mideastern-slate-dry-sauna',40,67],
 ['eastern-slate-dry-sauna',54,67]
];
const K=(x,y,z)=>[x,y,z].join(',');
function sourceCells(b){return{m:new Map(b.placements.map(p=>[p.at.join(','),p])),
 walk:new Set(b.walkable.map(p=>p.join(',')))}}
function groundBfs(start,m,walk,admit){
 const q=[start],seen=new Set(q);
 for(let i=0;i<q.length;i++){
  const[x,,z]=q[i].split(',').map(Number);
  for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){
   const X=x+dx,Z=z+dz,k=K(X,1,Z);
   if(!admit(X,Z)||seen.has(k)||!walk.has(k)||m.has(K(X,2,Z)))continue;
   seen.add(k);q.push(k);
  }
 }
 return seen;
}
function d4(v,mirror,rotation){
 const s=new Set(),{width:w,height:h,depth:d}=v.footprint;
 for(const p of v.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),
   Z=Math.floor(16*p.at[2]/d),A=mirror?15-X:X;
  let x=A,z=Z;
  if(rotation===1)[x,z]=[Z,15-A];
  if(rotation===2)[x,z]=[15-A,15-Z];
  if(rotation===3)[x,z]=[15-Z,A];
  s.add([x,Y,z,p.role].join('/'));
 }
 return s;
}
function iou(a,b){let n=0;for(const k of a)if(b.has(k))n++;return n/(a.size+b.size-n||1)}
test('Official B115 frozen snow small bathhouse 004, excludes D92/prior228, never live registered or saved',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),o=getBuilderBServiceOwnership();
 assert.deepEqual([o.existing,o.forBuilderB,o.forBuilderD],[228,115,92]);
 assert.equal(b.id,RIMEWHORL_FOUR_DRY_COURTS_ID);
 assert.equal(b.id,'r1:bathhouse:snow:small:004');
 assert.ok(o.builderBIds.includes(b.id));
 assert.ok(!o.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['bathhouse','snow','small']);
 assert.equal(b.status,'candidate');assert.equal(b.worldPlacement,false);
 assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.schema1SaveWritten,false);
});
test('Authentic original compiler validates 13960 unique voxel cells, 3760 connected source walks, 22 rooms and 37 portals',()=>{
 const b=buildRimewhorlFourDrySaunaCourts();
 assert.deepEqual(b.footprint,{width:64,height:33,depth:76});
 assert.equal(b.placements.length,13960);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,13960);
 assert.equal(b.walkable.length,3760);
 assert.equal(b.rooms.length,22);assert.equal(b.portals.length,37);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,61);
});
test('All 4320 actual author-origin stone y0 yard cells have true live:stone footing',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),{m}=sourceCells(b);let count=0;
 for(let x=2;x<=61;x++)for(let z=2;z<=73;z++){
  count++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
 }
 assert.equal(count,4320);
});
test('All 2857 unresolved original Pack3 candidate roof cells are directly solid-backed; nine distinct real >=60-cell wings',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),{m}=sourceCells(b),
  roof=b.placements.filter(p=>p.role==='roof'),counts=new Map();
 assert.equal(roof.length,2857);
 for(const p of roof){
  const[x,y,z]=p.at;
  assert.match(p.asset,/^pack3:/);assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(['wall','support','partition'].includes(m.get(K(x,y-1,z))?.role),
   'no real original solid directly below Pack3 candidate '+p.at);
  const name=p.rimewhorlDistinctRealRoofWing;
  assert.ok(name,'original roof has no genuine wing owner');
  counts.set(name,(counts.get(name)||0)+1);
 }
 assert.equal(counts.size,9);
 for(const[name,n]of counts)assert.ok(n>=60,'source ghost roof wing '+name+' '+n);
 assert.equal(counts.get('southern-snowarch-traverse'),88);
});
test('All nine original source bearing columns remain solid from y0 to actual named roof after doors and glazing',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),{m}=sourceCells(b),
  posts=b.placements.filter(p=>p.purpose?.startsWith('rimewhorl-original-full-stone-roof-post-')),
  first=new Map();
 for(const p of posts){
  const name=p.purpose.slice('rimewhorl-original-full-stone-roof-post-'.length);
  if(!first.has(name))first.set(name,p.at);
 }
 assert.equal(first.size,9);
 for(const[name,[x,,z]]of first){
  const top=b.placements.find(p=>p.rimewhorlDistinctRealRoofWing===name&&p.at[0]===x&&p.at[2]===z)?.at[1];
  assert.ok(Number.isInteger(top),'no owned roof above original post '+name);
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  for(let y=1;y<top;y++)
   assert.ok(['wall','support','partition'].includes(m.get(K(x,y,z))?.role),
    'source-original ground-to-roof support gap '+name+' '+K(x,y,z));
 }
});
test('Four sky-open stone courtyards have 244 walkable y1 cells completely clear to original y32 roofline',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),{m,walk}=sourceCells(b);let n=0;
 for(const[x0,z0,x1,z1]of [
  [27,24,36,32],[14,35,20,41],[44,35,50,41],[28,46,35,52]
 ])for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  n++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,z)),'unwalkable open court '+K(x,1,z));
  for(let y=1;y<b.footprint.height;y++)
   assert.ok(!m.has(K(x,y,z)),'source skylight obstructed '+K(x,y,z));
 }
 assert.equal(n,244);
});
test('Four real 7x7 dry sauna surrounds have 160 physically solid two-tier stone ring voxels and 16 truly clear gate cells',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),{m,walk}=sourceCells(b);
 let rails=0,gates=0;
 for(const[name,cx,cz]of baths)
  for(let x=cx-3;x<=cx+3;x++)for(let z=cz-3;z<=cz+3;z++){
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   const edge=x===cx-3||x===cx+3||z===cz-3||z===cz+3,
    gate=(x===cx-1||x===cx)&&(z===cz-3||z===cz+3);
   if(edge&&!gate)for(let y=1;y<=2;y++){
    rails++;assert.equal(m.get(K(x,y,z))?.rimewhorlTrueTwoTierStoneCourtRing,name);
    assert.equal(m.get(K(x,y,z))?.asset,'live:stone');
    assert.ok(!walk.has(K(x,1,z)),'stone sauna wall phantom walk');
   }
   if(gate){
    gates++;assert.ok(walk.has(K(x,1,z)),'closed original dry sauna gate');
    assert.ok(!m.has(K(x,2,z)),'original sauna gate head blocked');
   }
  }
 assert.deepEqual([rails,gates],[160,16]);
});
test('All four dry bath inner courts have 88 real two-high walkable cells and exactly twelve solid bench blocks',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),{m,walk}=sourceCells(b);
 let emptyWalk=0,stoneBenches=0;
 for(const[name,cx,cz]of baths)
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
   if(x===cx+1&&z>=cz-1&&z<=cz+1){
    stoneBenches++;assert.equal(m.get(K(x,1,z))?.rimewhorlRealGroundedDrySaunaBench,name);
    assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
    assert.ok(!walk.has(K(x,1,z)),'solid slate bench phantom walk');
    assert.ok(!m.has(K(x,2,z)),'source bench y2 obstructed');
   }else{
    emptyWalk++;assert.ok(walk.has(K(x,1,z)),'false clear court walk '+K(x,1,z));
    assert.ok(!m.has(K(x,2,z)),'original dry court head obstructed');
   }
  }
 assert.deepEqual([emptyWalk,stoneBenches],[88,12]);
 assert.equal(b.architecturalIdentity.realHeating,false);
});
test('Eight original bidirectional north/south gate routes remain truly y1 walkable and y2 head-clear INSIDE the four dry courts',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),{m,walk}=sourceCells(b);
 let passes=0;
 for(const[name,cx,cz]of baths)for(const z of[cz-3,cz+3]){
  const goal=K(cx-1,1,z===cz-3?cz+3:cz-3),
   visited=groundBfs(K(cx-1,1,z),m,walk,(x,Z)=>x>=cx-3&&x<=cx+3&&Z>=cz-3&&Z<=cz+3);
  assert.ok(visited.has(goal),'true source bath bidirectional route broken '+name);
  passes++;
 }
 assert.equal(passes,8);
});
test('Three actual 3x3x3 solid stone snowguards contain 81 masonry cells and no phantom first-tier walking',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),{m,walk}=sourceCells(b);
 let n=0;
 for(const[name,cx,cz]of [
  ['left-stone-snowguard',17,67],['middle-stone-snowguard',33,67],['right-stone-snowguard',47,67]
 ])for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(!walk.has(K(x,1,z)),'snowguard falsely walkable');
  for(let y=1;y<=3;y++){
   n++;assert.equal(m.get(K(x,y,z))?.rimewhorlActualStoneSnowguard,name);
   assert.equal(m.get(K(x,y,z))?.asset,'live:stone');
  }
 }
 assert.equal(n,81);
});
test('All 37 source room portals are actually stone-grounded y0, walkable y1, clear at original y2',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),{m,walk}=sourceCells(b);
 assert.equal(b.portals.length,37);
 for(const p of b.portals){
  const[x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,y,z)),'original physical named portal blocked '+p.at);
  assert.ok(!m.has(K(x,y+1,z)),'original physical portal head blocked '+p.at);
 }
});
test('Outdoor two-high-clear stone yard actually reaches all eight north/south bath gates around 541 original source cells',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),{m,walk}=sourceCells(b),
  seen=groundBfs(K(5,1,70),m,walk,(x,z)=>x>=2&&x<=61&&z>=63&&z<=73);
 let gatesReached=0;
 for(const[name,cx,cz]of baths)for(const z of[cz-3,cz+3]){
  assert.ok(seen.has(K(cx-1,1,z)),'exterior approach blocked at '+name+' '+z);
  gatesReached++;
 }
 assert.equal(gatesReached,8);assert.equal(seen.size,541);
});
test('South outside-only three-row original stone walking connects west to east across 180 y1/y2 clear source positions',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),{m,walk}=sourceCells(b),
  seen=groundBfs(K(4,1,72),m,walk,(x,z)=>x>=2&&x<=61&&z>=71&&z<=73);
 assert.ok(seen.has(K(59,1,72)),'original 3-row west-east south source walking failed');
 assert.equal(seen.size,180);
});
test('160 genuinely unresolved original Pack4 candidate panes form forty complete outward air-facing four-high stone framed bays',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),{m}=sourceCells(b),
  glass=b.placements.filter(p=>p.role==='window'),facing={
   north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]},bays=new Map();
 assert.equal(glass.length,160);
 for(const p of glass){
  const[x,y,z]=p.at,d=facing[p.orientation],key=x+','+z;
  assert.ok(d,'actual original outward candidate missing orientation');
  assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,6,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,6,z))?.role,'wall');
  assert.ok(!m.has(K(x+d[0],y,z+d[1])),'source pane facing solid');
  if(!bays.has(key))bays.set(key,new Set());
  bays.get(key).add(y);
 }
 assert.equal(bays.size,40);
 for(const ys of bays.values())assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4,5]);
});
test('Seven actual historical bathhouse original constructors satisfy unchanged strict >=0.85 D4 novelty rejection over 56 transformations',()=>{
 const b=buildRimewhorlFourDrySaunaCourts(),target=d4(b,false,0);
 let total=0,maxIoU=0,nearest=null;
 for(const build of peers){
  const old=build();assert.notEqual(old.id,b.id);
  assert.notEqual(structuralFingerprint(old),structuralFingerprint(b));
  for(const mirror of[false,true])for(let t=0;t<4;t++){
   const v=iou(target,d4(old,mirror,t));total++;
   if(v>maxIoU){maxIoU=v;nearest=old.id}
   assert.ok(v<0.85,'near-duplicate original bathhouse '+old.id+' '+v);
  }
 }
 assert.equal(total,56);
 console.log('RIMEWHORL_7_ORIGINAL_BATHHOUSE_PEERS_56_D4_PASS '+JSON.stringify({total,maxIoU,nearest}));
});
