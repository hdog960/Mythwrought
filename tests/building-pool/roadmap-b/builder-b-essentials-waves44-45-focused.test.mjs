// MYTHWROUGHT Builder B Waves44-45 focused original-source Node contracts.
// Does not execute itself when staged. Full accepted 228 historical-source
// D4 is intentionally NOT duplicated: only waves9-45 shared gate owns it.
// Actual Pack3/Pack4 collider, shader, support/material weather, original
// game, 1B settlement placement, NPCs, saves and iPhone PWA remain UNTESTED.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAlderbrookDoubleHorseshoeCoachingStables,ALDERBROOK_DOUBLE_HORSESHOE_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave44.mjs';
import {buildGraywakeDoubleReturnBeaconLodge,GRAYWAKE_DOUBLE_RETURN_BEACON_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave45.mjs';
import {buildMeadowstepSplitAisleStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave4.mjs';
import {buildBramblecrossSplitRailCoachStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave20.mjs';
import {buildSunfallBraidedSandCaravanStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave33.mjs';
import {buildSaltreachTidalLanternStation} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave9.mjs';
import {buildBriarcliffCrescentWalkLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave30.mjs';
import {buildSunspireTwinCrownDesertLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave36.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const face={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
const specs=[
 {fn:buildAlderbrookDoubleHorseshoeCoachingStables,id:ALDERBROOK_DOUBLE_HORSESHOE_ID,
  cat:'stable',biome:'temperate',size:'large',count:14830,roofs:3778,
  walk:4055,glass:76,rooms:16,portals:23,wings:9,wingField:'originalAlderbrookRoofWing',
  courts:[[28,27,44,42],[13,48,22,56],[53,48,62,56]],
  route:[[17,72],[59,72]],outsideMinZ:70,outside:214,glassHeight:4,bays:19,
  old:[buildMeadowstepSplitAisleStables,buildBramblecrossSplitRailCoachStables,buildSunfallBraidedSandCaravanStables]},
 {fn:buildGraywakeDoubleReturnBeaconLodge,id:GRAYWAKE_DOUBLE_RETURN_BEACON_ID,
  cat:'lighthouse',biome:'temperate',size:'medium',count:14298,roofs:3428,
  walk:3639,glass:60,rooms:16,portals:23,wings:8,wingField:'originalGraywakeAngularRoofWing',
  courts:[[27,25,42,37],[11,47,20,55],[46,48,54,56]],
  route:[[14,71],[55,71]],outsideMinZ:69,outside:189,glassHeight:3,bays:18,
  old:[buildSaltreachTidalLanternStation,buildBriarcliffCrescentWalkLighthouse,buildSunspireTwinCrownDesertLighthouse]}
];
function d4(b,mirror,turn){
 const set=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),
   A=mirror?15-X:X;let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  set.add([x,Y,z,p.role].join('/'));
 }return set;
}
const iou=(a,b)=>{let count=0;for(const k of a)if(b.has(k))count++;return count/(a.size+b.size-count||1)};
test('New exact source IDs are only B115, not accepted 228 or D92 and never collide with any focused earlier same-category wave',()=>{
 const own=getBuilderBServiceOwnership();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(ALDERBROOK_DOUBLE_HORSESHOE_ID,'r1:stable:temperate:large:005');
 assert.equal(GRAYWAKE_DOUBLE_RETURN_BEACON_ID,'r1:lighthouse:temperate:medium:003');
 for(const s of specs){
  const b=s.fn();
  assert.equal(b.id,s.id);assert.equal(b.category,s.cat);assert.equal(b.biome,s.biome);
  assert.equal(b.size,s.size);assert.equal(b.status,'candidate');
  assert.ok(own.builderBIds.includes(b.id));assert.ok(!own.builderDAvailableIds.includes(b.id));
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.productionRegistered,false);
  assert.equal(b.architecturalIdentity.saveSchema1Written,false);
  for(const other of s.old){
   const previous=other();
   assert.notEqual(b.id,previous.id,'earlier same-category service ID reused');
   assert.notEqual(structuralFingerprint(b),structuralFingerprint(previous));
  }
 }
});
test('Exactly 7206 original roof cells have immediate solid y-minus-one backing, Pack3 only, unapproved physical occupancy',()=>{
 let total=0;
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
   roof=b.placements.filter(p=>p.role==='roof');
  assert.equal(b.placements.length,s.count);assert.equal(b.walkable.length,s.walk);
  assert.equal(b.rooms.length,s.rooms);assert.equal(b.portals.length,s.portals);
  assert.equal(roof.length,s.roofs);
  assert.equal(new Set(roof.map(p=>p[s.wingField]).filter(Boolean)).size,s.wings);
  for(const p of roof){
   assert.ok(p.asset.startsWith('pack3:'));
   assert.equal(p.occupancy.kind,'unresolved');
   const [x,y,z]=p.at,under=m.get(K(x,y-1,z));
   assert.ok(under&&['wall','support','partition'].includes(under.role),
    'roof has no original immediate source load bearer at '+p.at.join(','));
  }
  total+=roof.length;
 }
 assert.equal(total,7206);
});
test('Both source bodies maintain exactly 831 entirely sky-open stone-founded y1-walkable court columns and all 46 actual two-high portals',()=>{
 let courts=0,portals=0;
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
   walk=new Set(b.walkable.map(p=>p.join(',')));
  for(const [x0,z0,x1,z1] of s.courts)
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
    courts++;
    assert.equal(m.get(K(x,0,z))?.role,'foundation');
    assert.ok(walk.has(K(x,1,z)),'court missing actual original walkable y1');
    for(let y=1;y<b.footprint.height;y++)
     assert.ok(!m.has(K(x,y,z)),'false roofless court has blocked column '+K(x,y,z));
   }
  for(const p of b.portals){
   const [x,y,z]=p.at;portals++;
   assert.ok(walk.has(K(x,y,z)),'portal no walking floor '+p.at);
   assert.ok(!m.has(K(x,y+1,z)),'two-high portal blocked by later source placement');
  }
 }
 assert.deepEqual([courts,portals],[831,46]);
});
test('Source outdoor route proves both sides really connected via y1 cardinal EXTERIOR-ONLY ground; source U/return cannot borrow indoor roof lanes',()=>{
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
   walk=new Set(b.walkable.map(p=>p.join(','))),
   [startPos,endPos]=s.route;
  const meta=b.architecturalIdentity;
  assert.equal(meta[s.cat==='stable'?'actualSourceOutdoorExerciseCells':'sourceExteriorDoubleReturnCells'],s.outside);
  for(const [x,z] of s.route){
   assert.equal(m.get(K(x,0,z))?.role,'foundation');
   assert.ok(walk.has(K(x,1,z)));
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!m.has(K(x,y,z)),'outside endpoint has unsupported source canopy');
  }
  const start=K(startPos[0],1,startPos[1]),goal=K(endPos[0],1,endPos[1]),q=[start],seen=new Set(q);
  for(let i=0;i<q.length;i++){
   const [x,y,z]=q[i].split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const X=x+dx,Z=z+dz,k=K(X,1,Z);
    if(Z<s.outsideMinZ||!walk.has(k)||seen.has(k))continue;
    seen.add(k);q.push(k);
   }
  }
  assert.ok(seen.has(goal),'source outdoor cross-walk cannot reach real opposite end');
 }
});
test('Alderbrook eight stall gates are source-grounded and retain full TWO-high air after all partitions; two stone hitch posts remain true 7-tier foundations',()=>{
 const b=buildAlderbrookDoubleHorseshoeCoachingStables(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let gates=0;
 for(const x of [17,52])for(let j=0;j<4;j++){
  const z=20+j*8;gates++;
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
  assert.ok(walk.has(K(x,1,z)),'late partition recollided with true horse stall gate');
  assert.ok(!m.has(K(x,2,z)),'late partition closes horse-height doorway');
 }
 assert.equal(gates,8);assert.equal(b.architecturalIdentity.originalSourceStallGateCount,8);
 for(const [x,z] of [[19,26],[57,27]]){
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
  for(let y=1;y<=7;y++){
   assert.equal(m.get(K(x,y,z))?.asset,'live:stone','hitching marker has unsupported physical column');
  }
 }
 assert.equal(b.architecturalIdentity.activeAnimalSpawning,false);
});
test('Graywake 31-tier octagonal masonry has true grounded 7x9 core, 24 backed crown caps, six independent stone-framed high outward windows',()=>{
 const b=buildGraywakeDoubleReturnBeaconLodge(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  t={x0:52,x1:58,z0:20,z1:28,h:31},ring=(x,z)=>
   (x===t.x0||x===t.x1||z===t.z0||z===t.z1)&&
   !((x===t.x0||x===t.x1)&&(z===t.z0||z===t.z1));
 let caps=0;
 for(let x=t.x0;x<=t.x1;x++)for(let z=t.z0;z<=t.z1;z++){
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
  for(let y=1;y<=3;y++)assert.equal(m.get(K(x,y,z))?.asset,'live:stone');
  if(!ring(x,z))continue;
  for(let y=4;y<=t.h;y++){
   const p=m.get(K(x,y,z));
   assert.ok(p&&['wall','window'].includes(p.role),'missing genuine continuous tower tier');
   assert.ok(['live:stone','pack4:030'].includes(p.asset));
  }
  assert.equal(m.get(K(x,t.h+1,z))?.originalGraywakeBackedCrown,true);
  caps++;
 }
 assert.equal(caps,24);
 const high=b.placements.filter(p=>p.realGraywakeHighStoneFramedPane);
 assert.equal(high.length,6);
 for(const p of high){
  const [x,y,z]=p.at,[dx,dz]=face[p.orientation];
  assert.equal(m.get(K(x,y-1,z))?.role,'wall');
  assert.equal(m.get(K(x,y+1,z))?.role,'wall');
  assert.ok(!m.has(K(x+dx,y,z+dz)));
 }
 assert.equal(b.architecturalIdentity.poweredBeacon,false);
});
test('Both originals have 136 upright Pack4 pane cells, 37 complete framed low vertical bays and six genuinely framed high panes',()=>{
 let total=0,bays=0,highTotal=0;
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
   glass=b.placements.filter(p=>p.role==='window'),groups=new Map();
  assert.equal(glass.length,s.glass);
  for(const p of glass){
   const [x,y,z]=p.at,[dx,dz]=face[p.orientation];
   assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
   assert.ok(!m.has(K(x+dx,y,z+dz)),'glass faces source wall');
   if(p.realGraywakeHighStoneFramedPane){highTotal++;continue;}
   assert.equal(m.get(K(x,1,z))?.role,'wall','glass lower source sill not solid');
   assert.equal(m.get(K(x,s.glassHeight+2,z))?.role,'wall','glass upper header not solid');
   const k=x+','+z;if(!groups.has(k))groups.set(k,new Set());
   groups.get(k).add(y);
  }
  assert.equal(groups.size,s.bays);
  for(const ys of groups.values())
   assert.deepEqual([...ys].sort((a,b)=>a-b),Array.from({length:s.glassHeight},(_,i)=>i+2));
  total+=glass.length;bays+=groups.size;
 }
 assert.deepEqual([total,bays,highTotal],[136,37,6]);
});
test('Exactly 48 strict earlier original same-category 8-way D4 transforms preserve unchanged <0.85 originality barrier',()=>{
 let checked=0;
 for(const s of specs){
  const b=s.fn(),a=d4(b,false,0);
  for(const old of s.old){
   const oldB=old();
   for(const mirror of [false,true])for(let t=0;t<4;t++){
    const score=iou(a,d4(oldB,mirror,t));checked++;
    assert.ok(score<.85,'original service design near-clone '+b.id+' vs '+oldB.id+' '+score);
   }
  }
 }
 assert.equal(checked,48);
});
