// MYTHWROUGHT Builder B original Waves32–33 focused Node contract.
// Exact original source cells only: no duplicate 228 historical scan here,
// no WebGL2/iPhone run, no real-game Pack producer or save certification.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAlderquaySplitPierHarborOffice,ALDERQUAY_SPLIT_PIER_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave32.mjs';
import {buildSunfallBraidedSandCaravanStables,SUNFALL_BRAIDED_STABLE_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave33.mjs';
import {buildTidehollowCrosswharfHarborOffice} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave6.mjs';
import {buildGlassduneSplitQuayRegistry} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave14.mjs';
import {buildSaffronwindDoubleTowerHarborRegistry} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave27.mjs';
import {buildMeadowstepSplitAisleStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave4.mjs';
import {buildSunspokeForkedShelterCorralStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave12.mjs';
import {buildBramblecrossSplitRailCoachStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave20.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=a=>a.join(',');
const face={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
const specs=[
 {build:buildAlderquaySplitPierHarborOffice,id:ALDERQUAY_SPLIT_PIER_ID,
  category:'harbor-office',biome:'temperate',size:'medium',wave:32,
  cells:12372,roofs:3123,walkable:3199,rooms:13,portals:18,glass:42,
  roofProp:'originalAlderquayRoofWing',wings:8,openCourts:[[26,25,38,37],[12,48,20,55]],
  additionalPaving:212,pavingProp:'extraUnroofedWharfCells',
  endpoints:[[13,66],[50,67]],previous:[buildTidehollowCrosswharfHarborOffice,
    buildGlassduneSplitQuayRegistry,buildSaffronwindDoubleTowerHarborRegistry]},
 {build:buildSunfallBraidedSandCaravanStables,id:SUNFALL_BRAIDED_STABLE_ID,
  category:'stable',biome:'desert',size:'medium',wave:33,
  cells:12769,roofs:3257,walkable:3422,rooms:13,portals:18,glass:48,
  roofProp:'sourceSunfallRoofWing',wings:8,openCourts:[[25,23,39,37],[13,47,20,54]],
  additionalPaving:250,pavingProp:'braidPavedUnroofedCells',
  endpoints:[[16,66],[50,67]],previous:[buildMeadowstepSplitAisleStables,
    buildSunspokeForkedShelterCorralStables,buildBramblecrossSplitRailCoachStables]}
];
function d4(b,mirror,turn){
 const s=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d);
  const A=mirror?15-X:X;let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];if(turn===2)[x,z]=[15-A,15-Z];if(turn===3)[x,z]=[15-Z,A];
  s.add([x,Y,z,p.role].join('/'));
 }return s;
}
const iou=(a,b)=>{let n=0;for(const k of a)if(b.has(k))n++;return n/(a.size+b.size-n||1)};
test('Wave32 and Wave33 have only unused frozen B115 IDs and no live world or approval claims',()=>{
 const own=getBuilderBServiceOwnership();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 for(const s of specs){
  const b=s.build();
  assert.equal(b.id,s.id);assert.equal(b.category,s.category);
  assert.equal(b.biome,s.biome);assert.equal(b.size,s.size);
  assert.ok(own.builderBIds.includes(b.id),'not a frozen Builder B ID');
  assert.ok(!own.builderDAvailableIds.includes(b.id),'stolen Builder D ID');
  assert.equal(b.liveIntegration,false);
  assert.equal(b.worldPlacement,false);
  assert.equal(b.architecturalIdentity.productionRegistered,false);
  for(const prior of s.previous)
   assert.notEqual(structuralFingerprint(b),structuralFingerprint(prior()));
 }
});
test('All 6380 original roofs are immediately backed, all 530 paved open-air yard cells actually walkable, all 36 two-high portal links clear',()=>{
 for(const s of specs){
  const b=s.build(),m=new Map(b.placements.map(p=>[K(p.at),p])),
    walk=new Set(b.walkable.map(K)),roof=b.placements.filter(p=>p.role==='roof');
  assert.equal(b.placements.length,s.cells);assert.equal(b.walkable.length,s.walkable);
  assert.equal(b.rooms.length,s.rooms);assert.equal(b.portals.length,s.portals);
  assert.equal(roof.length,s.roofs);
  assert.equal(new Set(roof.map(p=>p[s.roofProp]).filter(Boolean)).size,s.wings);
  for(const p of roof){
   assert.ok(p.asset.startsWith('pack3:'),'no fake horizontal glass as roof');
   assert.equal(p.occupancy.kind,'unresolved','must not claim installed Pack3 roof mesh');
   const [x,y,z]=p.at,below=m.get(K([x,y-1,z]));
   assert.ok(below&&['wall','support','partition'].includes(below.role),
    'roof lacks immediately authentic physical source support '+K(p.at));
  }
  for(const [x0,z0,x1,z1] of s.openCourts)
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
    assert.equal(m.get(K([x,0,z]))?.role,'foundation','claimed paved yard missing real floor');
    assert.ok(walk.has(K([x,1,z])),'open sky courtyard not physically walkable');
    for(let y=1;y<b.footprint.height;y++)
     assert.ok(!m.has(K([x,y,z])),'court contains authored roof or supporting post');
   }
  for(const portal of b.portals){
   assert.ok(walk.has(K(portal.at)),'doorway does not lead to grounded walking');
   assert.ok(!m.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),'two-high headroom obstructed');
  }
 }
});
test('Both distinct stone pier/track cross-decks have original y0 floors, unblocked y1+ sky and connected pedestrian paths',()=>{
 for(const s of specs){
  const b=s.build(),m=new Map(b.placements.map(p=>[K(p.at),p])),
    walk=new Set(b.walkable.map(K));
  assert.equal(b.architecturalIdentity[s.pavingProp],s.additionalPaving);
  const [from,to]=s.endpoints;
  for(const [x,z] of [from,to]){
   assert.equal(m.get(K([x,0,z]))?.role,'foundation','stone external track misses original floor');
   assert.ok(walk.has(K([x,1,z])),'external route not walkable');
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!m.has(K([x,y,z])),'supposed outdoor pier end is obstructed');
  }
  const key=K([from[0],1,from[1]]),target=K([to[0],1,to[1]]),
    queue=[key],seen=new Set(queue);
  for(let i=0;i<queue.length;i++){
   const [x,y,z]=queue[i].split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const k=K([x+dx,y,z+dz]);
    if(walk.has(k)&&!seen.has(k)){seen.add(k);queue.push(k)}
   }
  }
  assert.ok(seen.has(target),'two distinct external handling limbs lack genuine pedestrian cross-deck');
 }
});
test('Original 90 upright two-tier Pack4 030 glass cells form 45 fully framed outward bays after ALL door cuts',()=>{
 let total=0,bayTotal=0;
 for(const s of specs){
  const b=s.build(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   glass=b.placements.filter(p=>p.role==='window'),bays=new Map();
  assert.equal(glass.length,s.glass);
  for(const p of glass){
   const [x,y,z]=p.at,[dx,dz]=face[p.orientation];
   assert.equal(p.asset,'pack4:030');
   assert.equal(p.occupancy.kind,'unresolved','unearned live Pack4 collider certification');
   assert.ok(y===2||y===3);
   assert.equal(m.get(K([x,1,z]))?.role,'wall','real source timber sill missing');
   assert.equal(m.get(K([x,4,z]))?.role,'wall','real source timber lintel missing');
   assert.ok(!m.has(K([x+dx,y,z+dz])),'window faces adjacent full-cell obstruction');
   const k=x+','+z;
   if(!bays.has(k))bays.set(k,new Set());
   bays.get(k).add(y);
  }
  assert.equal(bays.size,s.glass/2,'incomplete paired original source windows');
  for(const levels of bays.values())assert.deepEqual([...levels].sort(),[2,3]);
  total+=glass.length;bayTotal+=bays.size;
 }
 assert.equal(total,90);assert.equal(bayTotal,45);
});
test('Sunfall four original 6-high limestone baffles stand outside actual full-sky corral with physically grounded footings',()=>{
 const b=buildSunfallBraidedSandCaravanStables(),
  m=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.deepEqual(b.architecturalIdentity.realOpenPavedCourts,[225,64]);
 assert.equal(b.architecturalIdentity.groundedStoneWindbreakPiers,4);
 for(const [x,z] of [[24,24],[40,24],[24,37],[40,37]]){
  assert.equal(m.get(K([x,0,z]))?.role,'foundation');
  for(let y=1;y<=6;y++)
   assert.ok(['support','wall'].includes(m.get(K([x,y,z]))?.role),'missing real stone windbreak post tier');
 }
 for(const flag of ['liveCaravanHorses','caravanEconomy','feedingOrRiding',
   'weatherAndSandPhysics','worldTerrainEdited','physicalPackCollisionApproved',
   'realIphoneAccepted','creatorArtAccepted'])
  assert.equal(b.architecturalIdentity[flag],false);
});
test('Both new originals remain below unchanged 0.85 strict same-category D4 bound under 48 genuine transformations',()=>{
 let count=0;
 for(const s of specs){
  const actual=s.build(),a=d4(actual,false,0);
  for(const fn of s.previous){
   const old=fn();
   for(const flip of [false,true])for(let t=0;t<4;t++){
    const value=iou(a,d4(old,flip,t));count++;
    assert.ok(value<.85,'new source near-clone '+actual.id+' / '+old.id+' '+value);
   }
  }
 }
 assert.equal(count,48);
});
