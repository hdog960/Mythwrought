// MYTHWROUGHT Builder B Waves24–25 focused original-source gates.
// Verify original paved sky yards, unsupported roof veto, real sill/lintel,
// source-grounded unpowered marker, B115 exclusivity, and 32 strict D4
// previous-authored comparisons. The 228 accepted originals belong ONLY to
// one future shared historical test; do not duplicate that expensive census.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildWistermereCrescentBaths,WISTERMERE_CRESCENT_BATHS_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave24.mjs';
import {buildRimehookWindShelterStables,RIMEHOOK_WINDSHELTER_STABLES_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave25.mjs';
import {buildSunshardSplitWellBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave5.mjs';
import {buildHearthspanDoubleCourtWinterBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave18.mjs';
import {buildMeadowstepSplitAisleStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave4.mjs';
import {buildBramblecrossSplitRailCoachStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave20.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
const K=a=>a.join(',');
const configurations=[
 {build:buildWistermereCrescentBaths,id:WISTERMERE_CRESCENT_BATHS_ID,
  footprint:'medium',cells:8674,roofs:2184,walkable:2011,windows:38,
  rooms:9,portals:13,roofProperty:'originalWistermereRoofWing',roofWings:7,
  glassProperty:'sourceTwoTierBathGlass',courts:[[24,23,33,31],[13,43,17,47]],
  mast:[46,14,23,24],courtSizes:[90,25],previous:[buildSunshardSplitWellBathhouse,buildHearthspanDoubleCourtWinterBathhouse],
  falseFlags:['liveBathWater','liveHeating','liveMagicSteam','physicalPackColliderApproved',
   'weatherproofingApproved','realIphoneTested','creatorArtApproved']},
 {build:buildRimehookWindShelterStables,id:RIMEHOOK_WINDSHELTER_STABLES_ID,
  footprint:'small',cells:6629,roofs:1633,walkable:1456,windows:36,
  rooms:8,portals:12,roofProperty:'originalSnowStableRoof',roofWings:6,
  glassProperty:'twoHighSnowStableGlass',courts:[[23,23,30,30],[13,40,17,44]],
  mast:[40,17,23,24],courtSizes:[64,25],previous:[buildMeadowstepSplitAisleStables,buildBramblecrossSplitRailCoachStables],
  falseFlags:['liveHorses','feedingMechanics','activeSnowWind','liveRoads',
   'producerColliderCertified','weatherProofingCertified','actualIphoneTested','creatorArtworkAccepted']}
];
function d4(b,mirror,turn){
 const s=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d);
  const A=mirror?15-X:X;let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  s.add([x,Y,z,p.role].join('/'));
 }
 return s;
}
const iou=(a,b)=>{let hit=0;for(const k of a)if(b.has(k))hit++;return hit/(a.size+b.size-hit||1)};
test('Both original sources are exact frozen B115 exclusive IDs, distinct from prior authored sources and D92',()=>{
 const owner=getBuilderBServiceOwnership();
 assert.deepEqual([owner.existing,owner.forBuilderB,owner.forBuilderD],[228,115,92]);
 for(const s of configurations){
  const b=s.build();
  assert.equal(b.id,s.id);assert.equal(b.size,s.footprint);
  assert.ok(owner.builderBIds.includes(b.id),'not a reserved exclusive Builder B ID: '+b.id);
  assert.ok(!owner.builderDAvailableIds.includes(b.id),'would steal Builder D ID: '+b.id);
  assert.equal(b.worldPlacement,false);
  assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.productionRegistered,false);
  for(const fn of s.previous)
   assert.notEqual(structuralFingerprint(b),structuralFingerprint(fn()),'duplicate original geometry '+b.id);
 }
});
test('Physical original source roofs are supported, doorways have two-high headroom and paved courts are fully WALKABLE and genuinely sky-open',()=>{
 for(const s of configurations){
  const b=s.build(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K)),roof=b.placements.filter(p=>p.role==='roof');
  assert.equal(b.placements.length,s.cells);assert.equal(b.walkable.length,s.walkable);
  assert.equal(b.rooms.length,s.rooms);assert.equal(b.portals.length,s.portals);
  assert.equal(roof.length,s.roofs);
  assert.equal(new Set(roof.map(p=>p[s.roofProperty]).filter(Boolean)).size,s.roofWings);
  for(const p of roof){
   assert.ok(p.asset.startsWith('pack3:'),'no horizontal Pack4 source windows masquerading as roof');
   const [x,y,z]=p.at,below=m.get(K([x,y-1,z]));
   assert.ok(below&&['wall','support','partition'].includes(below.role),
    'missing original immediate roof bearing '+K(p.at));
  }
  for(let j=0;j<s.courts.length;j++){
   const [x0,z0,x1,z1]=s.courts[j];
   assert.equal((x1-x0+1)*(z1-z0+1),s.courtSizes[j]);
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
    assert.equal(m.get(K([x,0,z]))?.role,'foundation','false open court stone paving');
    assert.ok(walk.has(K([x,1,z])),'grounded paving not traversable');
    for(let y=1;y<b.footprint.height;y++)
     assert.ok(!m.has(K([x,y,z])),'source roof/shield blocks the promised open sky');
   }
  }
  for(const p of b.portals){
   assert.ok(walk.has(K(p.at)),'unwalkable source room entrance');
   assert.ok(!m.has(K([p.at[0],p.at[1]+1,p.at[2]])),'real source doorway missing headroom');
  }
 }
});
test('Wistermere cupola and Rimehook winter wind marker are grounded continuous 23-tier masonry with separate inert Pack3 caps',()=>{
 for(const s of configurations){
  const b=s.build(),m=new Map(b.placements.map(p=>[K(p.at),p]));
  const [x,z,levels,cap]=s.mast;
  assert.equal(m.get(K([x,0,z]))?.role,'foundation');
  for(let y=1;y<=levels;y++){
   const cell=m.get(K([x,y,z]));
   assert.ok(cell&&['wall','support'].includes(cell.role),'ungrounded column '+K([x,y,z]));
   assert.equal(cell.asset,'live:stone');
  }
  assert.ok(m.get(K([x,cap,z]))?.asset.startsWith('pack3:'),'missing original roof cap');
  for(const flag of s.falseFlags)
   assert.equal(b.architecturalIdentity[flag],false,'unearned gameplay/pack/creator acceptance '+flag);
 }
 const winter=buildRimehookWindShelterStables(),m=new Map(winter.placements.map(p=>[K(p.at),p]));
 assert.equal(winter.architecturalIdentity.originalFourCourtWindbreakPiers,4);
 for(const [x,z] of [[22,23],[31,23],[22,30],[31,30]])
  for(let y=1;y<=6;y++)
   assert.ok(m.get(K([x,y,z]))?.role==='support'||m.get(K([x,y,z]))?.role==='wall',
    'court-side grounded windbreak pier absent '+K([x,y,z]));
});
test('All 74 genuine upright Pack4 panes are two-tier y2/y3 source cells with solid y1 sill, y4 lintel and clear outward ground',()=>{
 const face={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 let total=0;
 for(const s of configurations){
  const b=s.build(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   glass=b.placements.filter(p=>p.role==='window'),bays=new Set(),orient=new Set();
  assert.equal(glass.length,s.windows);
  for(const p of glass){
   const [x,y,z]=p.at,[dx,dz]=face[p.orientation];
   assert.equal(p.asset,'pack4:030');
   assert.ok(y===2||y===3,'unexpected vertical glazing level');
   assert.equal(p[s.glassProperty],true);
   assert.equal(m.get(K([x,1,z]))?.role,'wall','missing original solid sill');
   assert.equal(m.get(K([x,4,z]))?.role,'wall','missing original solid lintel');
   assert.ok(!m.has(K([x+dx,0,z+dz])),'window faces attached building instead of source outdoor air');
   bays.add(x+','+z);orient.add(p.orientation);
  }
  assert.equal(bays.size,s.windows/2,'two-high original glass bays fragmented');
  assert.ok(orient.size>=2,'source window fronts collapsed onto one wall');
  for(const direction of orient){
   const real=pack4BuilderAsset('pack4:030',{rotation:direction});
   assert.equal(real.id,159);assert.equal(real.mount,'opening');
   assert.ok(real.visible.some(part=>part.bounds[4]-part.bounds[1]>.65));
   assert.ok(real.collision.length&&real.selection.length);
   assert.equal(real.registeredInLiveGame,false);
  }
  total+=glass.length;
 }
 assert.equal(total,74);
});
test('Focused 32 eight-way same-category original D4 comparisons remain below original 0.85 threshold',()=>{
 let checked=0;
 for(const s of configurations){
  const actual=s.build(),target=d4(actual,false,0);
  for(const oldFn of s.previous){
   const old=oldFn();
   for(const mirror of [false,true])for(let t=0;t<4;t++){
    const score=iou(target,d4(old,mirror,t));checked++;
    assert.ok(score<.85,'new original near-clone '+actual.id+' versus '+old.id+' IoU='+score);
   }
  }
 }
 assert.equal(checked,32);
});
