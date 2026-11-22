// MYTHWROUGHT Builder B Waves 28–29 authentic original-source focused test.
// Captures actual y0 ground + y1 walkable no-obstruction sky courts, a SOURCE
// T apron crossing, atomic triple-glass bays (after portal cuts) and original
// physical candidate Pack4 orientation, plus 48 strict prior-source D4 tests.
// This file is NOT a full historical 228-candidate test, real WebGL2 visual
// or live world collider/integration certification.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDriftgaleTLandingSnowLodge,DRIFTGALE_T_LANDING_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave28.mjs';
import {buildStarpetalDoubleGardenOrchidarium,STARPETAL_ORCHIDARIUM_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave29.mjs';
import {buildDunewakeOasisReedworksFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave10.mjs';
import {buildFrostlineEightWingIcewatchLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave16.mjs';
import {buildTidemarkForkedQuayFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave26.mjs';
import {buildGlimmerboughSplitSunOrchidHouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave13.mjs';
import {buildAuroracrestFoldedFrostSeedhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave19.mjs';
import {buildCrystalfenStaggeredWinterglass} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave23.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
const K=a=>a.join(',');
const dirs={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
const specs=[
 {fn:buildDriftgaleTLandingSnowLodge,id:DRIFTGALE_T_LANDING_ID,
  category:'fishing-lodge',biome:'snow',size:'medium',
  cells:11159,roofs:2764,walk:2807,rooms:12,portals:17,windowCells:50,
  originalGlassLevels:[2,3],expectedBays:25,roofField:'originalDriftgaleRoofWing',
  roofWings:8,courts:[[25,24,37,37],[14,46,20,52]],
  peers:[buildDunewakeOasisReedworksFishingLodge,buildFrostlineEightWingIcewatchLodge,
   buildTidemarkForkedQuayFishingLodge]},
 {fn:buildStarpetalDoubleGardenOrchidarium,id:STARPETAL_ORCHIDARIUM_ID,
  category:'greenhouse',biome:'enchanted-forest',size:'medium',
  cells:11679,roofs:2906,walk:2748,rooms:10,portals:14,windowCells:75,
  originalGlassLevels:[2,3,4],expectedBays:25,roofField:'originalStarpetalRoofWing',
  roofWings:8,courts:[[24,24,36,35],[12,45,20,52]],
  peers:[buildGlimmerboughSplitSunOrchidHouse,buildAuroracrestFoldedFrostSeedhouse,
   buildCrystalfenStaggeredWinterglass]}
];
function shape(b,mirror,turn){
 const a=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d);
  const A=mirror?15-X:X;let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];if(turn===2)[x,z]=[15-A,15-Z];if(turn===3)[x,z]=[15-Z,A];
  a.add([x,Y,z,p.role].join('/'));
 }return a;
}
const iou=(a,b)=>{let n=0;for(const key of a)if(b.has(key))n++;return n/(a.size+b.size-n||1)};
test('Wave28–29 source IDs exactly match frozen Builder B ownership, not D92 or historical accepted 228',()=>{
 const own=getBuilderBServiceOwnership();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 const ids=new Set();
 for(const s of specs){
  const b=s.fn();ids.add(b.id);
  assert.equal(b.id,s.id);
  assert.equal(b.category,s.category);
  assert.equal(b.biome,s.biome);
  assert.equal(b.size,s.size);
  assert.ok(own.builderBIds.includes(b.id));
  assert.ok(!own.builderDAvailableIds.includes(b.id));
  assert.equal(b.liveIntegration,false);
  assert.equal(b.worldPlacement,false);
  assert.equal(b.architecturalIdentity.productionRegistered,false);
  for(const old of s.peers)assert.notEqual(structuralFingerprint(b),structuralFingerprint(old()));
 }
 assert.equal(ids.size,2);
});
test('Both original physical sources keep 8 grounded roof wings, all 459 expected paved courts walkable and completely sky open, and all portal headrooms clear',()=>{
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K)),roof=b.placements.filter(p=>p.role==='roof');
  assert.equal(b.placements.length,s.cells);
  assert.equal(b.walkable.length,s.walk);
  assert.equal(b.rooms.length,s.rooms);assert.equal(b.portals.length,s.portals);
  assert.equal(roof.length,s.roofs);
  assert.equal(new Set(roof.map(p=>p[s.roofField]).filter(Boolean)).size,s.roofWings);
  for(const p of roof){
   assert.ok(p.asset.startsWith('pack3:'));
   assert.equal(p.occupancy.kind,'unresolved');
   const [x,y,z]=p.at,under=m.get(K([x,y-1,z]));
   assert.ok(under&&['wall','support','partition'].includes(under.role),
    'authored roof missing source y-1 bearing at '+K(p.at));
  }
  for(const [x0,z0,x1,z1] of s.courts)for(let x=x0;x<=x1;x++)
   for(let z=z0;z<=z1;z++){
    assert.equal(m.get(K([x,0,z]))?.role,'foundation','false real court paving');
    assert.ok(walk.has(K([x,1,z])),'paved ground is not physically traversable');
    for(let y=1;y<b.footprint.height;y++)
     assert.ok(!m.has(K([x,y,z])),'roof or trellis violates sky opening');
   }
  for(const portal of b.portals){
   assert.ok(walk.has(K(portal.at)),'source portal is not actually walkable');
   assert.ok(!m.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),'portal lost its full headroom');
  }
 }
});
test('Driftgale T apron has 179 paved source cells and a true walkable crossing between two snow landing ends',()=>{
 const b=buildDriftgaleTLandingSnowLodge(),m=new Map(b.placements.map(p=>[K(p.at),p])),
  walk=new Set(b.walkable.map(K));
 assert.deepEqual(b.architecturalIdentity.sourcePavedSkyCourts,[182,49]);
 assert.equal(b.architecturalIdentity.realPavedTApproachCells,179);
 for(const [x,z] of [[31,65],[29,62],[35,62],[17,64],[48,64],[32,62]]){
  assert.equal(m.get(K([x,0,z]))?.role,'foundation','stone apron absent');
  assert.ok(walk.has(K([x,1,z])),'stone apron is an inert 3D decal, not walkable');
  for(let y=1;y<b.footprint.height;y++)
   assert.ok(!m.has(K([x,y,z])),'apron source roof or fixture obstructs sky');
 }
 const start='17,1,64',goal='48,1,64',seen=new Set([start]),q=[start];
 for(let i=0;i<q.length;i++){
  const [x,y,z]=q[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const next=K([x+dx,y,z+dz]);if(walk.has(next)&&!seen.has(next)){seen.add(next);q.push(next)}
  }
 }
 assert.ok(seen.has(goal),'T apron lacks an actual traversable transverse bar');
 for(let y=1;y<=22;y++)
  assert.equal(m.get(K([54,y,19]))?.asset,'live:stone','unpowered signal lacks true grounded stone');
 assert.equal(m.get('54,23,19')?.asset,'pack3:025');
 for(const key of ['actualIceBearingVerified','workingFishCatch','workingSkiffs',
  'animatedIceSignals','physicalPackColliderApproved','originalGameIphoneApproved'])
  assert.equal(b.architecturalIdentity[key],false);
});
test('Starpetal full triple-height original Pack4 upright glass bays are authored atomically after portal cuts',()=>{
 const b=buildStarpetalDoubleGardenOrchidarium(),
  m=new Map(b.placements.map(p=>[K(p.at),p])),glass=b.placements.filter(p=>p.role==='window'),
  byBay=new Map(),orientations=new Set();
 assert.deepEqual(b.architecturalIdentity.actualPavedUnroofedCourts,[156,72]);
 assert.equal(glass.length,75);
 assert.equal(b.architecturalIdentity.uprightThreeHighGlassBays,25);
 for(const p of glass){
  const [x,y,z]=p.at,[dx,dz]=dirs[p.orientation],key=x+','+z;
  assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
  assert.ok([2,3,4].includes(y));
  assert.equal(p.sourceThreeHighGlassBay,true);
  assert.equal(m.get(K([x,1,z]))?.role,'wall','physical timber sill missing');
  assert.equal(m.get(K([x,5,z]))?.role,'wall','physical timber lintel missing');
  assert.ok(!m.has(K([x+dx,y,z+dz])),'supposed outward pane faces solid voxel');
  (byBay.get(key)||byBay.set(key,new Set()).get(key)).add(y);
  orientations.add(p.orientation);
 }
 assert.equal(byBay.size,25);
 for(const levels of byBay.values())assert.deepEqual([...levels].sort(),[2,3,4],
  'incomplete triple-height glass after original doorway cuts');
 assert.ok(orientations.size>=2,'all glass collapsed to one flat facade');
 for(const direction of orientations){
  const candidate=pack4BuilderAsset('pack4:030',{rotation:direction});
  assert.equal(candidate.id,159);assert.equal(candidate.mount,'opening');
  assert.ok(candidate.visible.some(part=>part.bounds[4]-part.bounds[1]>.65));
  assert.ok(candidate.selection.length&&candidate.collision.length);
  assert.equal(candidate.registeredInLiveGame,false);
 }
 for(const key of ['liveFlowers','growingCrops','magicalLightingEnabled',
  'functioningIrrigation','realWeatherSealCertified','PackProducerCollisionApproved',
  'originalIphoneAcceptance','creatorVisualAcceptance'])
  assert.equal(b.architecturalIdentity[key],false);
});
test('All 48 source-only same-category eight-way D4 transformations stay below original 0.85 threshold',()=>{
 let checked=0;
 for(const s of specs){
  const b=s.fn(),actual=shape(b,false,0);
  for(const fn of s.peers){
   const old=fn();
   for(const mirror of [false,true])for(let turn=0;turn<4;turn++){
    const score=iou(actual,shape(old,mirror,turn));checked++;
    assert.ok(score<.85,'near clone '+b.id+' versus '+old.id+': '+score);
   }
  }
 }
 assert.equal(checked,48);
});
