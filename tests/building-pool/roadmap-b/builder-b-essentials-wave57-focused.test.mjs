// MYTHWROUGHT Wave57 original-source focused tests (Node22 STAGED).
// Genuine Node ES modules, 228-history full D4, Pack3/4 physical producer,
// actual M7 walking, WebGL2 and installed iPhone PWA are UNRUN.
// Do not weaken >=0.85 near-duplicate rejection or frozen ownership.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMoonrootFourRackSporeBarn,MOONROOT_FOUR_RACK_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave57.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildBriarfordSwitchwingBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {buildMossveilTwinCourtSporeGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave11.mjs';
import {buildDuneharpSpiralGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave22.mjs';
import {buildCoppermesaCombLaneHarvestBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave34.mjs';
import {buildSleetgroveRafterLatticeBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave38.mjs';
import {buildGreenbarrowThreeLaneStonecropGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave42.mjs';
import {buildBrackenmereThreeSiloCrossyardGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave49.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const racks=[
 ['west-mossroot-rack',10,68],['west-mid-fern-rack',23,68],
 ['east-mid-glowspore-rack',40,68],['east-twilight-rack',53,68]
];
const peers=[
 buildBriarfordSwitchwingBarn,buildMossveilTwinCourtSporeGranary,
 buildDuneharpSpiralGranary,buildCoppermesaCombLaneHarvestBarn,
 buildSleetgroveRafterLatticeBarn,buildGreenbarrowThreeLaneStonecropGranary,
 buildBrackenmereThreeSiloCrossyardGranary
];
function d4(v,flip,t){
 const s=new Set(),{width:w,height:h,depth:d}=v.footprint;
 for(const p of v.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),
   Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(t===1)[x,z]=[Z,15-A];
  if(t===2)[x,z]=[15-A,15-Z];
  if(t===3)[x,z]=[15-Z,A];
  s.add([x,Y,z,p.role].join('/'));
 }
 return s;
}
const iou=(a,b)=>{let n=0;for(const k of a)if(b.has(k))n++;return n/(a.size+b.size-n||1)};
test('Frozen B115-only enchanted forest small farm-barn :004, no D92/accepted228 or live world registration',()=>{
 const b=buildMoonrootFourRackSporeBarn(),o=getBuilderBServiceOwnership();
 assert.deepEqual([o.existing,o.forBuilderB,o.forBuilderD],[228,115,92]);
 assert.equal(b.id,MOONROOT_FOUR_RACK_ID);
 assert.equal(b.id,'r1:farm-barn:enchanted-forest:small:004');
 assert.ok(o.builderBIds.includes(b.id));
 assert.ok(!o.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['farm-barn','enchanted-forest','small']);
 assert.equal(b.status,'candidate');assert.equal(b.worldPlacement,false);
 assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.schema1SaveWritten,false);
});
test('Real original schema validates 12318 distinct authored voxel cells and 3481 original connected y1 walks',()=>{
 const b=buildMoonrootFourRackSporeBarn();
 assert.deepEqual(b.footprint,{width:62,height:34,depth:76});
 assert.equal(b.placements.length,12318);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,12318);
 assert.equal(b.walkable.length,3481);
 assert.equal(b.rooms.length,24);assert.equal(b.portals.length,33);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,57);
});
test('2833 genuinely authored Pack3 unresolved source roof cells have immediate original solid backing and 11 occupied roof wing regions',()=>{
 const b=buildMoonrootFourRackSporeBarn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roofs=b.placements.filter(p=>p.role==='roof'),wings=new Map();
 assert.equal(roofs.length,2833);
 for(const p of roofs){
  const [x,y,z]=p.at;
  assert.match(p.asset,/^pack3:/);assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(['support','wall','partition'].includes(m.get(K(x,y-1,z))?.role),'unbacked source roof '+p.at);
  const name=p.moonrootOriginalDistinctCoveredWing;
  assert.ok(name,'source roof missing real wing identity');
  wings.set(name,(wings.get(name)||0)+1);
 }
 assert.equal(wings.size,11);
 for(const [name,count] of wings)assert.ok(count>=40,'original roof wing completely occluded '+name);
});
test('All eleven genuinely stone-founded roof load columns remain solid every tier through their real original roof',()=>{
 const b=buildMoonrootFourRackSporeBarn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  parts=b.placements.filter(p=>p.purpose?.startsWith('moonroot-original-full-ground-roof-post-')),
  first=new Map();
 for(const p of parts){const name=p.purpose.slice('moonroot-original-full-ground-roof-post-'.length);
  if(!first.has(name))first.set(name,p.at);
 }
 assert.equal(first.size,11);
 for(const [name,[x,,z]] of first){
  const top=b.placements.find(p=>p.moonrootOriginalDistinctCoveredWing===name&&p.at[0]===x&&p.at[2]===z)?.at[1];
  assert.ok(Number.isInteger(top),'original roof source has no authored support site '+name);
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  for(let y=1;y<top;y++)assert.ok(['support','wall','partition'].includes(m.get(K(x,y,z))?.role),
   'portal/window removed original roof load post '+name+' '+K(x,y,z));
 }
});
test('Four authentic open sky courts are grounded and walkable in 292 y1 columns completely clear to source sky',()=>{
 const b=buildMoonrootFourRackSporeBarn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let count=0;
 for(const [x0,z0,x1,z1] of [
  [25,20,35,29],[13,33,20,39],[41,33,48,39],[26,44,35,50]
 ])for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  count++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,z)),'open court lacks source walk '+K(x,1,z));
  for(let y=1;y<b.footprint.height;y++)
   assert.ok(!m.has(K(x,y,z)),'sky court physically obstructed '+K(x,y,z));
 }
 assert.equal(count,292);
});
test('Four 7x7 pergolas have authentic stone y0 footprint and 64 continuous original solid timber post tiers',()=>{
 const b=buildMoonrootFourRackSporeBarn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let count=0;
 for(const [name,cx,cz] of racks)for(let x=cx-3;x<=cx+3;x++)for(let z=cz-3;z<=cz+3;z++){
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  const corner=(x===cx-3||x===cx+3)&&(z===cz-3||z===cz+3);
  if(corner)for(let y=1;y<=4;y++){
   count++;assert.equal(m.get(K(x,y,z))?.moonrootRealFourTierTimberPost,name);
   assert.equal(m.get(K(x,y,z))?.asset,'live:wood');
   assert.ok(!walk.has(K(x,1,z)),'real timber post phantom-walkable');
  }
 }
 assert.equal(count,64);
});
test('All four timber pergola source frames have 96 genuine y5 perimeter beam cells with open original upper centers',()=>{
 const b=buildMoonrootFourRackSporeBarn(),m=new Map(b.placements.map(p=>[p.at.join(','),p]));
 let beams=0,free=0;
 for(const [name,cx,cz] of racks)for(let x=cx-3;x<=cx+3;x++)for(let z=cz-3;z<=cz+3;z++){
  const boundary=x===cx-3||x===cx+3||z===cz-3||z===cz+3;
  if(boundary){
   beams++;const p=m.get(K(x,5,z));
   assert.equal(p?.moonrootRealOriginalFifthTierPerimeterBeam,name);
   assert.equal(p?.asset,'live:wood');
  }else{free++;assert.ok(!m.has(K(x,5,z)),'dry rack upper core not open');}
 }
 assert.deepEqual([beams,free],[96,100]);
});
test('180 truly unoccupied y1 two-high rack-floor source cells and all four rack approaches physically reachable from transverse',()=>{
 const b=buildMoonrootFourRackSporeBarn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let free=0,reached=0;
 for(const [name,cx,cz] of racks){
  for(let x=cx-3;x<=cx+3;x++)for(let z=cz-3;z<=cz+3;z++){
   const corner=(x===cx-3||x===cx+3)&&(z===cz-3||z===cz+3);
   if(!corner){
    free++;assert.ok(walk.has(K(x,1,z)),'original drying rack false walkable');
    assert.ok(!m.has(K(x,2,z)),'original drying rack lacks two-high headroom');
   }
  }
  const start=K(cx,1,cz-3),goal=K(cx,1,73),q=[start],seen=new Set(q);
  for(let i=0;i<q.length;i++){
   const [x,,z]=q[i].split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const X=x+dx,Z=z+dz,k=K(X,1,Z);
    if(Z<59||Z>74||seen.has(k)||!walk.has(k)||m.has(K(X,2,Z)))continue;
    seen.add(k);q.push(k);
   }
  }
  assert.ok(seen.has(goal),'real drying frame cannot be entered from exterior '+name);
  reached++;
 }
 assert.deepEqual([free,reached],[180,4]);
});
test('Three raised dry source packing plinths consist of 27 solid stone y1 source cells with genuine stone y0 backing',()=>{
 const b=buildMoonrootFourRackSporeBarn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let count=0;
 for(const [name,cx,cz] of [
  ['west-dry-spore-packing',15,69],['central-dry-spore-packing',28,69],
  ['east-dry-spore-packing',35,69]
 ])for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
  count++;const p=m.get(K(x,1,z));
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.equal(p?.moonrootGenuineRaisedStoneDryPackingPlate,name);
  assert.equal(p?.asset,'live:stone');
  assert.ok(!walk.has(K(x,1,z)),'solid dry packing plinth phantom walkable');
  assert.ok(!m.has(K(x,2,z)),'dry packing stone falsely roofed at y2');
 }
 assert.equal(count,27);
 assert.equal(b.architecturalIdentity.realSporeCropHarvesting,false);
});
test('All 33 actual original portals have stone foundation, y1 body walking and real y2 headroom; four outside arms connect',()=>{
 const b=buildMoonrootFourRackSporeBarn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 assert.equal(b.portals.length,33);
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
  assert.ok(walk.has(K(x,y,z)),'source portal physically blocked '+p.at);
  assert.ok(!m.has(K(x,y+1,z)),'source portal original head blocked '+p.at);
 }
 const q=[K(10,1,73)],seen=new Set(q);
 for(let i=0;i<q.length;i++){
  const [x,,z]=q[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const Z=z+dz,k=K(x+dx,1,Z);
   if(Z<72||seen.has(k)||!walk.has(k))continue;
   seen.add(k);q.push(k);
  }
 }
 assert.ok(seen.has(K(53,1,73)),'outside-only four-way source walking disconnected');
 assert.equal(seen.size,159);
});
test('48 unresolved candidate Pack4 cells form twelve genuinely outward original source stone framed four-high window bays',()=>{
 const b=buildMoonrootFourRackSporeBarn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  panes=b.placements.filter(p=>p.role==='window'),
  faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]},bays=new Map();
 assert.equal(panes.length,48);
 for(const p of panes){
  const [x,y,z]=p.at,d=faces[p.orientation],k=x+','+z;
  assert.ok(d,'unoriented candidate glass');
  assert.equal(p.asset,'pack4:030');
  assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,6,z))?.role,'wall');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,6,z))?.asset,'live:stone');
  assert.ok(!m.has(K(x+d[0],y,z+d[1])),'pane faces an original wall');
  if(!bays.has(k))bays.set(k,new Set());
  bays.get(k).add(y);
 }
 assert.equal(bays.size,12);
 for(const y of bays.values())assert.deepEqual([...y].sort((a,b)=>a-b),[2,3,4,5]);
});
test('Unchanged strict 0.85 D4: 56 rotations/reflections of seven genuinely earlier same-category barn originals and no duplicate fingerprint',()=>{
 const b=buildMoonrootFourRackSporeBarn(),target=d4(b,false,0);
 let total=0,maxIoU=0,nearest=null;
 for(const create of peers){
  const p=create();assert.notEqual(p.id,b.id);
  assert.notEqual(structuralFingerprint(p),structuralFingerprint(b));
  for(const flip of [false,true])for(let t=0;t<4;t++){
   const score=iou(target,d4(p,flip,t));
   if(score>maxIoU){maxIoU=score;nearest=p.id}
   assert.ok(score<0.85,'original near-clone '+p.id+' '+score);
   total++;
  }
 }
 assert.equal(total,56);
 console.log('MOONROOT_AUTHENTIC_7_BARN_PEERS_56_D4_PASS '+JSON.stringify({total,maxIoU,nearest}));
});
