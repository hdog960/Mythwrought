// Builder B authentic original-source focused Wave30–31 tests.
// No historical 228-source recompile here; one shared Waves9–31 gate owns it.
// This test asserts real source geometry, not live game Pack3/4 meshes,
// actual iPhone/Home-Screen PWA, visual artwork, or creator acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildBriarcliffCrescentWalkLighthouse,BRIARCLIFF_CRESCENT_BEACON_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave30.mjs';
import {buildWillowglassTripleAtriumConservatory,WILLOWGLASS_TRIPLE_ATRIUM_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave31.mjs';
import {buildFrostwakeCrownbridgeLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave8.mjs';
import {buildSaltreachTidalLanternStation} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave9.mjs';
import {buildSunscarOpenOculusLanternwatch} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave21.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildCrystalfenStaggeredWinterglass} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave23.mjs';
import {buildStarpetalDoubleGardenOrchidarium} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave29.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
const K=p=>p.join(',');
const face={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
const cases=[
 {fn:buildBriarcliffCrescentWalkLighthouse,id:BRIARCLIFF_CRESCENT_BEACON_ID,
  category:'lighthouse',size:'medium',biome:'temperate',
  cells:12933,roofs:2982,walkable:2978,rooms:12,portals:17,glass:29,
  originalRoofField:'originalBriarcliffRoofWing',roofWings:7,
  courts:[[26,25,37,36],[13,48,19,54]],
  peers:[buildFrostwakeCrownbridgeLighthouse,buildSaltreachTidalLanternStation,buildSunscarOpenOculusLanternwatch]},
 {fn:buildWillowglassTripleAtriumConservatory,id:WILLOWGLASS_TRIPLE_ATRIUM_ID,
  category:'greenhouse',size:'large',biome:'temperate',
  cells:14982,roofs:3776,walkable:3729,rooms:12,portals:19,glass:48,
  originalRoofField:'originalWillowglassRoofWing',roofWings:9,
  courts:[[28,26,43,40],[13,49,22,57],[53,49,62,57]],
  peers:[buildAlderglassTrellisConservatory,buildCrystalfenStaggeredWinterglass,buildStarpetalDoubleGardenOrchidarium]}
];
function d4(b,flip,t){
 const a=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),
   Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;let x=A,z=Z;
  if(t===1)[x,z]=[Z,15-A];if(t===2)[x,z]=[15-A,15-Z];if(t===3)[x,z]=[15-Z,A];
  a.add([x,Y,z,p.role].join('/'));
 }return a;
}
const iou=(a,b)=>{let n=0;for(const p of a)if(b.has(p))n++;return n/(a.size+b.size-n||1)};
test('Original Waves30 and31 occupy separate B115-only frozen IDs and make no game-registration claim',()=>{
 const o=getBuilderBServiceOwnership();
 assert.deepEqual([o.existing,o.forBuilderB,o.forBuilderD],[228,115,92]);
 for(const s of cases){
  const b=s.fn();
  assert.equal(b.id,s.id);assert.equal(b.category,s.category);
  assert.equal(b.size,s.size);assert.equal(b.biome,s.biome);
  assert.ok(o.builderBIds.includes(b.id),'not in frozen Builder B service IDs');
  assert.ok(!o.builderDAvailableIds.includes(b.id),'reserved Builder D ID stolen');
  assert.equal(b.liveIntegration,false);
  assert.equal(b.worldPlacement,false);
  assert.equal(b.architecturalIdentity.productionRegistered,false);
  for(const fn of s.peers)assert.notEqual(structuralFingerprint(b),structuralFingerprint(fn()));
 }
});
test('Original source roof/backing, ALL 613 real paved sky-atria and two-high walkable portals remain physical',()=>{
 for(const s of cases){
  const b=s.fn(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K)),roofs=b.placements.filter(p=>p.role==='roof');
  assert.equal(b.placements.length,s.cells);assert.equal(b.walkable.length,s.walkable);
  assert.equal(b.rooms.length,s.rooms);assert.equal(b.portals.length,s.portals);
  assert.equal(roofs.length,s.roofs);
  assert.equal(new Set(roofs.map(p=>p[s.originalRoofField]).filter(Boolean)).size,s.roofWings);
  for(const p of roofs){
   assert.ok(p.asset.startsWith('pack3:'),'Pack4 fake horizontal roof');
   assert.equal(p.occupancy.kind,'unresolved','false live Pack producer admission');
   const [x,y,z]=p.at,below=m.get(K([x,y-1,z]));
   assert.ok(below&&['wall','partition','support'].includes(below.role),
    'roof lacks real original immediate y-1 backing '+K(p.at));
  }
  for(const [x0,z0,x1,z1] of s.courts)
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
    assert.equal(m.get(K([x,0,z]))?.role,'foundation','fake original court paving');
    assert.ok(walk.has(K([x,1,z])),'source court cell lacks true player walking access');
    for(let y=1;y<b.footprint.height;y++)
     assert.ok(!m.has(K([x,y,z])),'supposedly open sky court contains a roof or collider');
   }
  for(const portal of b.portals){
   assert.ok(walk.has(K(portal.at)),'original portal not traversable');
   assert.ok(!m.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),
    'source portal headroom blocked');
  }
 }
});
test('Briarcliff actually supports one 34-tier octagonal tower, 24 capped stone segments and 8 elevated outward glass panels',()=>{
 const b=buildBriarcliffCrescentWalkLighthouse(),m=new Map(b.placements.map(p=>[K(p.at),p])),
  high=b.placements.filter(p=>p.originalHighBriarcliffStoneGlass);
 assert.deepEqual(b.architecturalIdentity.genuineGroundedSkyCourts,[144,49]);
 assert.equal(b.architecturalIdentity.stoneTowerWallHeight,34);
 assert.equal(high.length,8);
 let crowns=0;
 for(let x=51;x<=57;x++)for(let z=14;z<=22;z++){
  assert.equal(m.get(K([x,0,z]))?.role,'foundation','no original tower footing');
  for(let y=1;y<=3;y++)assert.equal(m.get(K([x,y,z]))?.asset,'live:stone');
  const ring=(x===51||x===57||z===14||z===22)&&
   !((x===51||x===57)&&(z===14||z===22));
  if(!ring)continue;
  for(let y=4;y<=34;y++){
   const p=m.get(K([x,y,z]));
   assert.ok(p&&['wall','window'].includes(p.role));
   assert.ok(p.asset==='live:stone'||p.asset==='pack4:030');
  }
  assert.equal(m.get(K([x,35,z]))?.genuineDirectlyBackedBriarcliffCrown,true);
  crowns++;
 }
 assert.equal(crowns,24);
 for(const p of high){
  const [x,y,z]=p.at,[dx,dz]=face[p.orientation];
  assert.equal(y,25);assert.equal(p.asset,'pack4:030');
  assert.equal(m.get(K([x,24,z]))?.role,'wall');
  assert.equal(m.get(K([x,26,z]))?.role,'wall');
  assert.ok(!m.has(K([x+dx,y,z+dz])),'supposed upper panel faces blocked side');
 }
 const forbidden=['liveBeacon','upperTowerNavigationAvailable','seaOrCliffCollisionTested',
  'PackMeshLoadCertified','liveGameIphoneTested','creatorArtworkApproved'];
 for(const name of forbidden)assert.equal(b.architecturalIdentity[name],false);
});
test('Briarcliff 205 genuine crescent-walk source paving cells have a real two-way traversable path',()=>{
 const b=buildBriarcliffCrescentWalkLighthouse(),m=new Map(b.placements.map(p=>[K(p.at),p])),
  walk=new Set(b.walkable.map(K));
 assert.equal(b.architecturalIdentity.originalCrescentPavedCells,205);
 for(const [x,z] of [[16,66],[19,64],[32,66],[45,65],[48,66]]){
  assert.equal(m.get(K([x,0,z]))?.role,'foundation','source promenade floor missing');
  assert.ok(walk.has(K([x,1,z])),'source promenade floor not walkable');
  for(let y=1;y<b.footprint.height;y++)
   assert.ok(!m.has(K([x,y,z])),'roof or post obstructs genuine source open promenade');
 }
 const start='16,1,66',goal='48,1,66',seen=new Set([start]),q=[start];
 for(let i=0;i<q.length;i++){
  const [x,y,z]=q[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const n=K([x+dx,y,z+dz]);if(walk.has(n)&&!seen.has(n)){seen.add(n);q.push(n)}
  }
 }
 assert.ok(seen.has(goal),'true crescent stone walk is disconnected at y1');
});
test('Willowglass has 12 complete FOUR-high upright Pack4 source bays, real y1 sill/y6 lintel and 3 independent sky-open courts',()=>{
 const b=buildWillowglassTripleAtriumConservatory(),m=new Map(b.placements.map(p=>[K(p.at),p])),
  windows=b.placements.filter(p=>p.role==='window'),bays=new Map(),yaw=new Set();
 assert.deepEqual(b.architecturalIdentity.realGroundedOpenSkyAtriums,[240,90,90]);
 assert.equal(b.architecturalIdentity.nineOriginalRoofWings,9);
 assert.equal(windows.length,48);
 assert.equal(b.architecturalIdentity.realFourHighPack4GlassBays,12);
 for(const p of windows){
  const [x,y,z]=p.at,[dx,dz]=face[p.orientation];
  assert.equal(p.asset,'pack4:030');
  assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(p.authenticOriginalFourHighTemperedGlass,true);
  assert.ok([2,3,4,5].includes(y));
  assert.equal(m.get(K([x,1,z]))?.role,'wall','genuine window sill missing');
  assert.equal(m.get(K([x,6,z]))?.role,'wall','genuine window lintel missing');
  assert.ok(!m.has(K([x+dx,y,z+dz])),'original glass faces solid exterior neighbor');
  const k=x+','+z;if(!bays.has(k))bays.set(k,new Set());
  bays.get(k).add(y);yaw.add(p.orientation);
 }
 assert.equal(bays.size,12);
 for(const levels of bays.values())assert.deepEqual([...levels].sort(),[2,3,4,5],
  'broken four-tier glass bay, possibly cut by late doorway');
 assert.ok(yaw.size>=2);
 for(const direction of yaw){
  const candidate=pack4BuilderAsset('pack4:030',{rotation:direction});
  assert.equal(candidate.id,159);assert.equal(candidate.mount,'opening');
  assert.ok(candidate.visible.some(p=>p.bounds[4]-p.bounds[1]>.65));
  assert.ok(candidate.collision.length&&candidate.selection.length);
  assert.equal(candidate.registeredInLiveGame,false);
 }
 const denied=['activePlantGrowth','irrigationPowered','realBiomePlantPlacement',
  'actualWeatherproofingCertified','producerCollisionAndSelectionApproved',
  'realIphoneHomeScreenTested','creatorArtAccepted'];
 for(const flag of denied)assert.equal(b.architecturalIdentity[flag],false);
});
test('All 48 local strict eight-way D4 comparisons against previous original same-category lighthouse/greenhouse geometry pass',()=>{
 let checked=0;
 for(const s of cases){
  const b=s.fn(),base=d4(b,false,0);
  for(const oldFn of s.peers){
   const old=oldFn();
   for(const mirror of [false,true])for(let turn=0;turn<4;turn++){
    const score=iou(base,d4(old,mirror,turn));checked++;
    assert.ok(score<.85,'original source near-clone '+b.id+' vs '+old.id+' '+score);
   }
  }
 }
 assert.equal(checked,48);
});
