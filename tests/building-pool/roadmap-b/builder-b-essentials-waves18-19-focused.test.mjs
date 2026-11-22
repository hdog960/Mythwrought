// MYTHWROUGHT Builder B Waves18/19 focused original source geometry.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildHearthspanDoubleCourtWinterBathhouse,HEARTHSPAN_WINTER_BATH_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave18.mjs';
import {buildAuroracrestFoldedFrostSeedhouse,AURORACREST_FOLDED_FROST_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave19.mjs';
import {buildSunshardSplitWellBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave5.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildRimeglassCrescentSunGreenhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave7.mjs';
import {buildGlimmerboughSplitSunOrchidHouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave13.mjs';
import {buildAmberwellSandglassConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave17.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
const K=v=>v.join(',');
function shape(b,flip,t){
 const s=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(t===1)[x,z]=[Z,15-A];if(t===2)[x,z]=[15-A,15-Z];if(t===3)[x,z]=[15-Z,A];
  s.add([x,Y,z,p.role].join('/'));
 }return s;
}
const iou=(a,b)=>{let both=0;for(const x of a)if(b.has(x))both++;return both/(a.size+b.size-both||1)};
const specifications=[
 {build:buildHearthspanDoubleCourtWinterBathhouse,id:HEARTHSPAN_WINTER_BATH_ID,
  cells:6322,roofs:1466,walkable:1152,rooms:7,portals:11,windows:21,
  roofWingProperty:'originalRoofWing',roofWings:7,courts:[[21,21,26,26],[12,34,14,37]],
  column:[37,17,24,25],prior:[buildSunshardSplitWellBathhouse],zeroFlags:['sourceBathWaterActive','steamActive','heatingActive','producerPackColliderApproved','realIphoneAccepted','creatorArtworkApproved']},
 {build:buildAuroracrestFoldedFrostSeedhouse,id:AURORACREST_FOLDED_FROST_ID,
  cells:7754,roofs:1822,walkable:1455,rooms:8,portals:12,windows:60,
  roofWingProperty:'originalWinterRoofWing',roofWings:8,courts:[[23,21,28,27],[13,38,16,42]],
  column:[43,15,23,24],prior:[buildAlderglassTrellisConservatory,buildRimeglassCrescentSunGreenhouse,buildGlimmerboughSplitSunOrchidHouse,buildAmberwellSandglassConservatory],
  zeroFlags:['cropGrowthEnabled','thermalPlantControlsActive','auroraLightEmitted','waterOrIrrigationActive','PackPhysicalCollisionCertified','actualIphoneTested','creatorArtApproved']}
];
test('Immutable frozen Builder B ownership and no source clones',()=>{
 const o=getBuilderBServiceOwnership();
 assert.deepEqual([o.existing,o.forBuilderB,o.forBuilderD],[228,115,92]);
 for(const s of specifications){
  const b=s.build();assert.equal(b.id,s.id);
  assert.ok(o.builderBIds.includes(b.id),'B115 ownership absent '+b.id);
  assert.ok(!o.builderDAvailableIds.includes(b.id),'D92 reserved '+b.id);
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.productionRegistered,false);
  const fingerprint=structuralFingerprint(b);
  for(const prior of s.prior)assert.notEqual(fingerprint,structuralFingerprint(prior()),'cloned actual prior shape '+b.id);
 }
});
test('Exactly source-backed roofs and open courts, grounded independent masts and all original two-high portals',()=>{
 for(const s of specifications){
  const b=s.build(),map=new Map(b.placements.map(p=>[K(p.at),p]));
  assert.equal(b.placements.length,s.cells);assert.equal(b.walkable.length,s.walkable);
  assert.equal(b.rooms.length,s.rooms);assert.equal(b.portals.length,s.portals);
  const roof=b.placements.filter(p=>p.role==='roof');
  assert.equal(roof.length,s.roofs);
  assert.equal(new Set(roof.map(p=>p[s.roofWingProperty]).filter(Boolean)).size,s.roofWings);
  for(const p of roof){
   assert.ok(p.asset.startsWith('pack3:'),'unexpected horizontal Pack4 skylight');
   const [x,y,z]=p.at;
   const bearing=map.get(K([x,y-1,z]));
   assert.ok(bearing&&['wall','support','partition'].includes(bearing.role),'roof unsupported '+K(p.at));
  }
  for(const [x0,z0,x1,z1] of s.courts)
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
    assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'fake open snow court '+x+','+z);
  for(const p of b.portals){
   assert.ok(!map.has(K(p.at)),'blocked ground-level source portal '+K(p.at));
   assert.ok(!map.has(K([p.at[0],p.at[1]+1,p.at[2]])),'blocked doorway headroom '+K(p.at));
  }
  const [x,z,solidTop,capY]=s.column;
  for(let y=1;y<=solidTop;y++)
   assert.ok(map.get(K([x,y,z]))?.role==='support'||map.get(K([x,y,z]))?.role==='wall',
    'source mast/chimney not grounded at y'+y);
  assert.equal(map.get(K([x,capY,z]))?.asset,'pack3:025');
  for(const flag of s.zeroFlags)
   assert.equal(b.architecturalIdentity[flag],false,'false gameplay or creator acceptance: '+flag);
 }
});
test('Hearthspan one-high and Auroracrest real two-high exterior Pack4 windows carry proper physical wall sills and lintels',()=>{
 const dir={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const s of specifications){
  const b=s.build(),m=new Map(b.placements.map(p=>[K(p.at),p]));
  const glass=b.placements.filter(p=>p.role==='window');
  assert.equal(glass.length,s.windows);
  const yaw=new Set();
  for(const p of glass){
   const [x,y,z]=p.at,[dx,dz]=dir[p.orientation];
   assert.equal(p.asset,'pack4:030');assert.ok([2,3].includes(y));
   assert.ok(!m.has(K([x+dx,0,z+dz])),'window not exterior');
   assert.equal(m.get(K([x,1,z]))?.role,'wall','missing real sill');
   assert.equal(m.get(K([x,b.id===AURORACREST_FOLDED_FROST_ID?4:3,z]))?.role,'wall','missing real lintel');
   yaw.add(p.orientation);
  }
  assert.ok(yaw.size>=3,'not enough physical cardinal facades');
  for(const direction of yaw){
   const actual=pack4BuilderAsset('pack4:030',{rotation:direction});
   assert.equal(actual.id,159);assert.equal(actual.mount,'opening');
   assert.ok(actual.visible.some(v=>v.bounds[4]-v.bounds[1]>.65));
   assert.ok(actual.collision.length&&actual.selection.length);
   assert.equal(actual.registeredInLiveGame,false);
  }
  if(b.id===AURORACREST_FOLDED_FROST_ID){
   assert.equal(b.architecturalIdentity.actualSnowGlazingBays,30);
   assert.equal(new Set(glass.map(p=>p.at[0]+','+p.at[2])).size,30);
   assert.ok(glass.every(p=>p.sourceTwoHighUprightGlass===true));
  }
 }
});
test('Exactly 40 focused source eight-way D4 transforms against earlier authored same-category designs',()=>{
 let n=0;
 for(const s of specifications){
  const b=s.build(),now=shape(b,false,0);
  for(const fn of s.prior){
   const older=fn();
   for(const flip of [false,true])for(let t=0;t<4;t++){
    const score=iou(now,shape(older,flip,t));n++;
    assert.ok(score<.85,'original source near-duplicate '+b.id+' / '+older.id+' '+score);
   }
  }
 }
 assert.equal(n,40);
});
