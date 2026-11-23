// MYTHWROUGHT Builder B Wave50 — genuine original-source focused Node22 gates.
// Run this specific test alone during development; do NOT fan out old 228
// original-history scans on an unchanged parent. No installed Pack3/Pack4,
// heat/water/weather AI, in-game settlements, schema1 writes or iPhone pass.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildVesperfrostFourCourtDryBathhouse,VESPERFROST_FOUR_COURT_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave50.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildSunshardSplitWellBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave5.mjs';
import {buildHearthspanDoubleCourtWinterBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave18.mjs';
import {buildWistermereCrescentBaths} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave24.mjs';
import {buildFrostmereThreeCourtBathLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave35.mjs';
import {buildSuncradleOffsetBasinBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave43.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
const old=[
 buildSunshardSplitWellBathhouse,buildHearthspanDoubleCourtWinterBathhouse,
 buildWistermereCrescentBaths,buildFrostmereThreeCourtBathLodge,
 buildSuncradleOffsetBasinBathhouse
];
function d4(b,flip,t){
 const s=new Set(),{width:W,height:H,depth:D}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/W),Y=Math.floor(12*p.at[1]/H),Z=Math.floor(16*p.at[2]/D),
   A=flip?15-X:X;
  let x=A,z=Z;
  if(t===1)[x,z]=[Z,15-A];
  if(t===2)[x,z]=[15-A,15-Z];
  if(t===3)[x,z]=[15-Z,A];
  s.add([x,Y,z,p.role].join('/'));
 }
 return s;
}
function iou(a,b){let overlap=0;for(const x of a)if(b.has(x))overlap++;return overlap/(a.size+b.size-overlap||1)}
test('Source-only Wave50 frozen B115 snow LARGE bathhouse #003, never D92/accepted228 or live registered',()=>{
 const own=getBuilderBServiceOwnership(),b=buildVesperfrostFourCourtDryBathhouse();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(b.id,VESPERFROST_FOUR_COURT_ID);
 assert.equal(b.id,'r1:bathhouse:snow:large:003');
 assert.ok(own.builderBIds.includes(b.id));
 assert.ok(!own.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['bathhouse','snow','large']);
 assert.equal(b.status,'candidate');
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.saveSchema1Written,false);
});
test('Genuine original blueprint validates 15,973 unique voxel cells, 4,062 walkable, 20 rooms, 26 portals',()=>{
 const b=buildVesperfrostFourCourtDryBathhouse();
 assert.deepEqual(b.footprint,{width:70,height:36,depth:82});
 assert.equal(b.placements.length,15973);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,15973);
 assert.equal(b.walkable.length,4062);
 assert.equal(b.rooms.length,20);
 assert.equal(b.portals.length,26);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,50);
});
test('3,810 real original candidate Pack3 roof cells actually occupy TWELVE differentiated wings and each has immediate solid backing',()=>{
 const b=buildVesperfrostFourCourtDryBathhouse(),
  map=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roofs=b.placements.filter(p=>p.role==='roof'),wings=new Map();
 assert.equal(roofs.length,3810);
 for(const p of roofs){
  const [x,y,z]=p.at;
  assert.match(p.asset,/^pack3:/);
  assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(['wall','support','partition'].includes(map.get(K(x,y-1,z))?.role),
   'candidate roof lacks true original immediate stone backing '+p.at);
  assert.ok(p.vesperfrostRealRoofWing);
  wings.set(p.vesperfrostRealRoofWing,(wings.get(p.vesperfrostRealRoofWing)||0)+1);
 }
 assert.equal(wings.size,12,'a proposed wing has no actual original roof occupancy');
 for(const [name,n] of wings)assert.ok(n>=100,'roof region is only an overlapped shadow '+name);
});
test('All 12 authored original bearing posts are source-solid continuously from y0 up to actual original roof undersides',()=>{
 const b=buildVesperfrostFourCourtDryBathhouse(),
  map=new Map(b.placements.map(p=>[p.at.join(','),p])),
  posts=b.placements.filter(p=>p.purpose?.startsWith('vesperfrost-source-bearing-post-')),
  byName=new Map();
 for(const p of posts){
  const name=p.purpose.slice('vesperfrost-source-bearing-post-'.length);
  if(!byName.has(name))byName.set(name,[]);
  byName.get(name).push(p);
 }
 assert.equal(byName.size,12);
 for(const [name,pieces] of byName){
  const [x,,z]=pieces[0].at;
  assert.equal(map.get(K(x,0,z))?.asset,'live:stone');
  const roof=b.placements.find(p=>p.vesperfrostRealRoofWing===name&&p.at[0]===x&&p.at[2]===z);
  assert.ok(roof,'original wing real roof coordinate missing '+name);
  for(let y=1;y<roof.at[1];y++)
   assert.ok(['wall','support','partition'].includes(map.get(K(x,y,z))?.role),
    'original source post is hollow beneath '+name+' '+K(x,y,z));
 }
});
test('All FOUR completely open stone founded courtyards retain 370 original y1 walks with zero roof/wall to full blueprint height',()=>{
 const b=buildVesperfrostFourCourtDryBathhouse(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let count=0;
 for(const [x0,z0,x1,z1] of [[30,21,39,31],[11,40,19,49],[50,40,58,49],[30,54,39,61]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   count++;
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.ok(walk.has(K(x,1,z)),'unwalkable sky court '+K(x,1,z));
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!m.has(K(x,y,z)),'false roofless court '+K(x,y,z));
  }
 assert.equal(count,370);
});
test('Four real 5x5 stone dry basins possess all 100 solid y1 bottoms and 64 raised perimeter y2 rim cells, with truly open inner y2 voids',()=>{
 const b=buildVesperfrostFourCourtDryBathhouse(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let bottoms=0,rims=0,centers=0;
 for(const [name,cx,cz] of [
  ['west-inner-dry-plunge',16,25],['east-inner-dry-plunge',54,25],
  ['southwest-stone-cooling-basin',19,57],['southeast-stone-cooling-basin',51,57]
 ])for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  const p=m.get(K(x,1,z));
  assert.equal(p?.role,'furnishing');assert.equal(p?.asset,'live:stone');
  assert.equal(p?.originalSolidDryBasinBottom,name);
  assert.ok(!walk.has(K(x,1,z)),'phantom source walk through 1-cell solid stone bath bottom');
  bottoms++;
  const rim=x===cx-2||x===cx+2||z===cz-2||z===cz+2;
  if(rim){
   const top=m.get(K(x,2,z));
   assert.equal(top?.role,'furnishing');assert.equal(top?.asset,'live:stone');
   assert.equal(top?.originalRaisedFullPerimeterRim,name);rims++;
  }else{
   assert.ok(!m.has(K(x,2,z)),'dry basin center enclosed by later partition');
   centers++;
  }
 }
 assert.deepEqual([bottoms,rims,centers],[100,64,36]);
 assert.equal(b.architecturalIdentity.realHeatedWater,false);
 assert.equal(b.architecturalIdentity.waterPiping,false);
 assert.equal(b.architecturalIdentity.realHeating,false);
});
test('All 26 named original portals have actual stone foundation and physical y1 & head-level clear source space',()=>{
 const b=buildVesperfrostFourCourtDryBathhouse(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,y,z)),'physically non-walkable portal '+p.at);
  assert.ok(!m.has(K(x,y+1,z)),'source doorway lacks 2-high passage '+p.at);
 }
});
test('Original three exterior cold-air branches connect through a true outside-only z>=77 stone walking crosspass',()=>{
 const b=buildVesperfrostFourCourtDryBathhouse(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(','))),
  start=K(18,1,79),end=K(54,1,79),
  queue=[start],seen=new Set(queue);
 for(let i=0;i<queue.length;i++){
  const [x,,z]=queue[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const X=x+dx,Z=z+dz,k=K(X,1,Z);
   if(Z<77||seen.has(k)||!walk.has(k))continue;
   seen.add(k);queue.push(k);
  }
 }
 assert.ok(seen.has(end),'outdoor paths borrow indoor geometry or are disconnected');
 assert.equal(seen.size,180);
 for(const x of [18,35,54]){
  assert.equal(m.get(K(x,0,79))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,79)));
 }
 assert.equal(b.architecturalIdentity.actuallyGroundedExteriorStoneCells,383);
});
test('130 original Pack4 candidate panes form 26 full five-high vertical outdoor bays with original sill/lintel, physical ABI still unresolved',()=>{
 const b=buildVesperfrostFourCourtDryBathhouse(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  glass=b.placements.filter(p=>p.role==='window'),groups=new Map();
 assert.equal(glass.length,130);
 for(const p of glass){
  const [x,y,z]=p.at,[dx,dz]=faces[p.orientation];
  assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,7,z))?.role,'wall');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,7,z))?.asset,'live:stone');
  assert.ok(!m.has(K(x+dx,y,z+dz)),'glass opens against an external solid');
  const k=x+','+z;if(!groups.has(k))groups.set(k,new Set());
  groups.get(k).add(y);
 }
 assert.equal(groups.size,26);
 for(const ys of groups.values())
  assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4,5,6]);
});
test('Strict UNCHANGED D4 originality: 40 real comparisons with 5 original earlier B bathhouses <0.85, no duplicate fingerprints',()=>{
 const b=buildVesperfrostFourCourtDryBathhouse(),source=d4(b,false,0);
 let compares=0,maxIoU=0,nearest=null;
 for(const fn of old){
  const peer=fn();
  assert.notEqual(peer.id,b.id);
  assert.notEqual(structuralFingerprint(peer),structuralFingerprint(b));
  for(const flip of [false,true])for(let t=0;t<4;t++){
   const score=iou(source,d4(peer,flip,t));compares++;
   if(score>maxIoU){maxIoU=score;nearest=peer.id;}
   assert.ok(score<.85,'actual older bathhouse source near-clone '+peer.id+' '+score);
  }
 }
 assert.equal(compares,40);
 console.log('VESPERFROST_AUTHENTIC_40_D4_PASS '+JSON.stringify({compares,maxIoU,nearest}));
});
