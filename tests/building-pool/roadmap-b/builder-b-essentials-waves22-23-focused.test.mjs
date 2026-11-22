// MYTHWROUGHT Builder B Waves22–23 authentic original-source focused tests.
// Original geometry, grounded tower entrances, paved sky courts, upright
// glass, frozen B115/D92 and 32 local D4 transforms. No full 228-corpus
// duplication: one canonical Waves9–23 historical gate handles that.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDuneharpSpiralGranary,DUNEHARP_SPIRAL_GRANARY_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave22.mjs';
import {buildCrystalfenStaggeredWinterglass,CRYSTALFEN_WINTERGLASS_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave23.mjs';
import {buildBriarfordSwitchwingBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {buildMossveilTwinCourtSporeGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave11.mjs';
import {buildRimeglassCrescentSunGreenhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave7.mjs';
import {buildAuroracrestFoldedFrostSeedhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave19.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
const K=p=>p.join(',');
const studies=[
 {build:buildDuneharpSpiralGranary,id:DUNEHARP_SPIRAL_GRANARY_ID,size:'large',
  cells:13114,roofs:2521,walkable:2775,rooms:11,portals:15,glass:35,roofWings:7,
  roofProperty:'originalGranaryRoofWing',courts:[[23,20,45,42],[12,45,19,53]],
  earlier:[buildBriarfordSwitchwingBarn,buildMossveilTwinCourtSporeGranary]},
 {build:buildCrystalfenStaggeredWinterglass,id:CRYSTALFEN_WINTERGLASS_ID,size:'medium',
  cells:10996,roofs:2750,walkable:2607,rooms:10,portals:15,glass:96,roofWings:8,
  roofProperty:'originalCrystalfenRoofWing',courts:[[25,23,37,35],[13,47,19,53]],
  earlier:[buildRimeglassCrescentSunGreenhouse,buildAuroracrestFoldedFrostSeedhouse]}
];
function d4(b,flip,turn){
 const out=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  out.add([x,Y,z,p.role].join('/'));
 }return out;
}
const iou=(a,b)=>{let n=0;for(const item of a)if(b.has(item))n++;return n/(a.size+b.size-n||1)};
test('Both exact new 1B designs reserve exclusively frozen Builder B IDs, never D92 or game registration',()=>{
 const own=getBuilderBServiceOwnership();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 for(const s of studies){
  const b=s.build();
  assert.equal(b.id,s.id);assert.equal(b.size,s.size);
  assert.ok(own.builderBIds.includes(b.id),'exclusive B115 missing '+b.id);
  assert.ok(!own.builderDAvailableIds.includes(b.id),'stolen D92 slot '+b.id);
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.productionRegistered,false);
  const fp=structuralFingerprint(b);
  for(const earlier of s.earlier)assert.notEqual(fp,structuralFingerprint(earlier()));
 }
 assert.notEqual(studies[0].build().id,studies[1].build().id);
});
test('22 and 23 enforce full original walks, every immediate-bearing Pack3 roof, unblocked two-high doors and every physically PAVED SKY-OPEN yard cell',()=>{
 for(const s of studies){
  const b=s.build(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K)),roof=b.placements.filter(p=>p.role==='roof');
  assert.equal(b.placements.length,s.cells);assert.equal(b.walkable.length,s.walkable);
  assert.equal(b.rooms.length,s.rooms);assert.equal(b.portals.length,s.portals);
  assert.equal(roof.length,s.roofs);
  assert.equal(new Set(roof.map(p=>p[s.roofProperty]).filter(Boolean)).size,s.roofWings);
  for(const p of roof){
   assert.ok(p.asset.startsWith('pack3:'),'vertical Pack4 falsely mounted as horizontal roof');
   const [x,y,z]=p.at,below=m.get(K([x,y-1,z]));
   assert.ok(below&&['wall','partition','support'].includes(below.role),'roof lacks immediate source-bearing cell '+K(p.at));
  }
  for(const [x0,z0,x1,z1] of s.courts)
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
    assert.equal(m.get(K([x,0,z]))?.role,'foundation','open court has no actual walking stone');
    assert.ok(walk.has(K([x,1,z])),'paved courtyard cell is not traversable');
    for(let y=1;y<b.footprint.height;y++)
     assert.ok(!m.has(K([x,y,z])),'a supposedly open sky court has authored obstruction');
   }
  for(const portal of b.portals){
   assert.ok(walk.has(K(portal.at)),'portal has no actual walkable physical cell');
   assert.ok(!m.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),'portal lacks two-high headroom');
  }
 }
});
test('Duneharp genuine 28 and 32-high octagonal grain silos have original two-high doors, y3 masonry lintels, jambs and complete upper-bearing stone',()=>{
 const b=buildDuneharpSpiralGranary(),m=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.deepEqual(b.architecturalIdentity.groundedThreshingCourtCells,[529,72]);
 assert.deepEqual(b.architecturalIdentity.originalSiloWallTiers,[28,32]);
 assert.equal(b.architecturalIdentity.originalSiloGroundDoorways,2);
 for(const [x,z,top] of [[15,20,28],[56,35,32]]){
  assert.equal(m.get(K([x,0,z]))?.role,'foundation');
  assert.ok(!m.has(K([x,1,z]))&&!m.has(K([x,2,z])),'source silo door blocked');
  assert.equal(m.get(K([x,3,z]))?.authoredTrueSiloDoorLintel,true);
  for(let y=4;y<=top;y++)
   assert.equal(m.get(K([x,y,z]))?.role,'wall','high tower masonry absent');
  for(const zz of [z-1,z+1])
   for(let y=1;y<=top;y++)
    assert.equal(m.get(K([x,y,zz]))?.role,'wall','grounded side jamb interrupted');
 }
 for(const flag of ['liveGrainProduction','actuallyOperatingSilo','grainTransportActive',
  'workingWindPower','physicalPackCollisionCertified','actualIphoneTested','creatorArtApproved'])
  assert.equal(b.architecturalIdentity[flag],false,'invented producer/game/creator acceptance '+flag);
});
test('Crystalfen 24 FOUR-HIGH upright Pack4 030 glass bays have genuine wood sill/lintel and unobstructed original exterior air',()=>{
 const b=buildCrystalfenStaggeredWinterglass(),m=new Map(b.placements.map(p=>[K(p.at),p]));
 const pane=b.placements.filter(p=>p.role==='window'),face={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 assert.deepEqual(b.architecturalIdentity.actualPavedSkyCourtCells,[169,49]);
 assert.equal(pane.length,96);
 assert.equal(b.architecturalIdentity.framedFourTallUprightGlassBays,24);
 assert.equal(new Set(pane.map(p=>p.at[0]+','+p.at[2])).size,24);
 const yaw=new Set();
 for(const p of pane){
  const [x,y,z]=p.at,[dx,dz]=face[p.orientation];
  assert.ok([2,3,4,5].includes(y));
  assert.equal(p.asset,'pack4:030');
  assert.equal(p.sourceFourTallGroundedGlass,true);
  assert.equal(m.get(K([x,1,z]))?.role,'wall','no true supporting sill');
  assert.equal(m.get(K([x,6,z]))?.role,'wall','no true upper lintel');
  assert.ok(!m.has(K([x+dx,0,z+dz])),'upright source glass faces attached building');
  yaw.add(p.orientation);
 }
 assert.ok(yaw.size>=2,'all glazing collapsed into one identical facade');
 for(const direction of yaw){
  const actual=pack4BuilderAsset('pack4:030',{rotation:direction});
  assert.equal(actual.id,159);assert.equal(actual.mount,'opening');
  assert.ok(actual.visible.some(v=>v.bounds[4]-v.bounds[1]>.65));
  assert.ok(actual.collision.length&&actual.selection.length);
  assert.equal(actual.registeredInLiveGame,false);
 }
 for(const flag of ['growingSimulationEnabled','waterIrrigationActive','magicalSnowLightingActive',
  'thermalControlEnabled','physicalPackCollisionCertified','realIphoneTested','creatorArtworkApproved'])
  assert.equal(b.architecturalIdentity[flag],false,'false release or mechanics approval '+flag);
});
test('Waves22–23 local originality under all 32 strict eight-way D4 transforms, no reduced threshold',()=>{
 let n=0;
 for(const s of studies){
  const authored=s.build(),now=d4(authored,false,0);
  for(const original of s.earlier){
   const prior=original();
   for(const mirror of [false,true])for(let rotation=0;rotation<4;rotation++){
    const score=iou(now,d4(prior,mirror,rotation));n++;
    assert.ok(score<.85,'close original geometry '+authored.id+' / '+prior.id+' '+score);
   }
  }
 }
 assert.equal(n,32);
});
