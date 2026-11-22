// MYTHWROUGHT Roadmap B original Waves26–27 FOCUSED source checks.
// Strict source geometry, genuine 205-cell forked quay, TWO 7x9 grounded
// customs towers with twelve correctly framed HIGH Pack4 windows, and 48
// prior-authored same-category D4 transforms. Actual native Node execution
// and canonical 228 historic D4 remain gated, not claimed by this source file.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTidemarkForkedQuayFishingLodge,TIDEMARK_FORKED_QUAY_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave26.mjs';
import {buildSaffronwindDoubleTowerHarborRegistry,SAFFRONWIND_DUAL_REGISTRY_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave27.mjs';
import {buildSedgewatchTidehookFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave3.mjs';
import {buildDunewakeOasisReedworksFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave10.mjs';
import {buildFrostlineEightWingIcewatchLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave16.mjs';
import {buildTidehollowCrosswharfHarborOffice} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave6.mjs';
import {buildGlassduneSplitQuayRegistry} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave14.mjs';
import {buildIcehavenBifurcatedSnowCustoms} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave15.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=a=>a.join(',');
const dir={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
const specs=[
 {build:buildTidemarkForkedQuayFishingLodge,id:TIDEMARK_FORKED_QUAY_ID,size:'medium',
  sourceCells:11254,roofs:2823,walk:2841,rooms:12,portals:17,glass:34,
  courts:[[27,25,38,35],[13,45,19,50]],roofField:'genuineTidemarkRoofWing',
  roofWings:7,previous:[buildSedgewatchTidehookFishingLodge,
   buildDunewakeOasisReedworksFishingLodge,buildFrostlineEightWingIcewatchLodge]},
 {build:buildSaffronwindDoubleTowerHarborRegistry,id:SAFFRONWIND_DUAL_REGISTRY_ID,size:'medium',
  sourceCells:12926,roofs:2853,walk:2583,rooms:10,portals:14,glass:36,
  courts:[[26,25,37,35],[14,47,19,52]],roofField:'originalSaffronwindRoofWing',
  roofWings:8,previous:[buildTidehollowCrosswharfHarborOffice,
   buildGlassduneSplitQuayRegistry,buildIcehavenBifurcatedSnowCustoms]}
];
function d4(b,mirror,turn){
 const a=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),
   Z=Math.floor(16*p.at[2]/d),A=mirror?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];if(turn===2)[x,z]=[15-A,15-Z];if(turn===3)[x,z]=[15-Z,A];
  a.add([x,Y,z,p.role].join('/'));
 }return a;
}
const iou=(a,b)=>{let common=0;for(const k of a)if(b.has(k))common++;return common/(a.size+b.size-common||1)};
test('Wave26 and Wave27 have distinct immutable Builder B115 service IDs and never take D92/accepted 228 slots',()=>{
 const ownership=getBuilderBServiceOwnership();
 assert.deepEqual([ownership.existing,ownership.forBuilderB,ownership.forBuilderD],[228,115,92]);
 for(const spec of specs){
  const b=spec.build();
  assert.equal(b.id,spec.id);assert.equal(b.size,spec.size);
  assert.ok(ownership.builderBIds.includes(b.id),'B115 original allocation missing '+b.id);
  assert.ok(!ownership.builderDAvailableIds.includes(b.id),'original takes D92 '+b.id);
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.productionRegistered,false);
  for(const old of spec.previous)assert.notEqual(structuralFingerprint(b),structuralFingerprint(old()));
 }
 assert.equal(new Set(specs.map(s=>s.id)).size,2);
});
test('Both sources preserve exact original roofs, connected walkability, genuine paved uncovered courts, and 2-high unobstructed portals',()=>{
 for(const spec of specs){
  const b=spec.build(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K)),roofs=b.placements.filter(p=>p.role==='roof');
  assert.equal(b.placements.length,spec.sourceCells);
  assert.equal(b.walkable.length,spec.walk);assert.equal(b.rooms.length,spec.rooms);
  assert.equal(b.portals.length,spec.portals);
  assert.equal(roofs.length,spec.roofs);
  assert.equal(new Set(roofs.map(p=>p[spec.roofField]).filter(Boolean)).size,spec.roofWings);
  for(const p of roofs){
   assert.ok(p.asset.startsWith('pack3:'),'no fake horizontal Pack4 source skylights');
   const [x,y,z]=p.at;
   const under=m.get(K([x,y-1,z]));
   assert.ok(under&&['wall','partition','support'].includes(under.role),
    'Pack3 roof has no authored immediate y-1 source support '+K(p.at));
   assert.equal(p.occupancy.kind,'unresolved','source-only Pack3 roof misrepresented as live physical');
  }
  for(const [x0,z0,x1,z1] of spec.courts)
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
    assert.equal(m.get(K([x,0,z]))?.role,'foundation','claimed paved yard lacks ground');
    assert.ok(walk.has(K([x,1,z])),'actual yard cell not walkable');
    for(let y=1;y<b.footprint.height;y++)
     assert.ok(!m.has(K([x,y,z])),'false open-sky court '+K([x,y,z]));
   }
  for(const p of b.portals){
   assert.ok(walk.has(K(p.at)),'portal lacks original physical walkable admission '+K(p.at));
   assert.ok(!m.has(K([p.at[0],p.at[1]+1,p.at[2]])),
    'original doorway headroom is blocked '+K(p.at));
  }
 }
});
test('Tidemark original FORKED quay has 205 roofless and fully walkable stone cells, linked source deck and true inert stone marker',()=>{
 const b=buildTidemarkForkedQuayFishingLodge(),
  m=new Map(b.placements.map(p=>[K(p.at),p])),walk=new Set(b.walkable.map(K));
 assert.deepEqual(b.architecturalIdentity.skyOpenPavedCourts,[132,42]);
 assert.equal(b.architecturalIdentity.sourceUnroofedQuayCells,205);
 assert.equal(b.architecturalIdentity.originalForkedQuayFingers,2);
 for(const [x,z] of [[13,63],[13,60],[17,60],[32,60],[45,60],[48,63],[48,59]]){
  assert.equal(m.get(K([x,0,z]))?.role,'foundation','missing genuine wharf floor');
  assert.ok(walk.has(K([x,1,z])),'wharf is a source decoration, not actual walkable stone');
  for(let y=1;y<b.footprint.height;y++)
   assert.ok(!m.has(K([x,y,z])),'the advertised outdoor quay has a roof/post above it');
 }
 // Reachability between both wharf tips uses ONLY authenticated y1 walkable
 // original floor cells, not labels from room/portal metadata.
 const start='13,1,63',target='48,1,63',seen=new Set([start]),todo=[start];
 for(let i=0;i<todo.length;i++){
  const [x,y,z]=todo[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const next=K([x+dx,y,z+dz]);
   if(walk.has(next)&&!seen.has(next)){seen.add(next);todo.push(next)}
  }
 }
 assert.ok(seen.has(target),'original twin wharf fingers are not joined by a traversable cross-deck');
 for(let y=1;y<=23;y++)assert.equal(m.get('53,'+y+',19')?.asset,'live:stone');
 assert.equal(m.get('53,24,19')?.asset,'pack3:025');
 for(const flag of ['fishCatchEnabled','boatSailingEnabled','sourceWaterOrBiomesChanged',
  'liveWharfEconomy','finalPackCollisionApproved','realIphoneAccepted','creatorArtworkAccepted'])
  assert.equal(b.architecturalIdentity[flag],false,'invented simulation/Pack approval '+flag);
});
test('Saffronwind has two REAL 7x9 octagonal grounded masonry towers and 48 backed Pack3 roof crown cells',()=>{
 const b=buildSaffronwindDoubleTowerHarborRegistry(),
  m=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.deepEqual(b.architecturalIdentity.groundedOctagonalTowerHeights,[25,29]);
 assert.deepEqual(b.architecturalIdentity.sourceSkyOpenQueueCourts,[132,36]);
 const towers=[
  {name:'western-stone-registration-tower',x0:6,x1:12,z0:18,z1:26,h:25},
  {name:'eastern-stone-registration-tower',x0:52,x1:58,z0:14,z1:22,h:29}
 ];
 let crowns=0;
 for(const t of towers){
  let thisCrown=0;
  for(let x=t.x0;x<=t.x1;x++)for(let z=t.z0;z<=t.z1;z++){
   assert.equal(m.get(K([x,0,z]))?.role,'foundation','tower floating at '+x+','+z);
   for(let y=1;y<=3;y++)
    assert.equal(m.get(K([x,y,z]))?.asset,'live:stone','fake hollow access or ungrounded tower core');
   const ring=(x===t.x0||x===t.x1||z===t.z0||z===t.z1)&&
     !((x===t.x0||x===t.x1)&&(z===t.z0||z===t.z1));
   if(!ring)continue;
   for(let y=4;y<=t.h;y++){
    const v=m.get(K([x,y,z]));
    assert.ok(v&&['wall','window'].includes(v.role),'tower shaft disconnected from base');
    assert.ok(v.asset==='live:stone'||v.asset==='pack4:030');
   }
   const cap=m.get(K([x,t.h+1,z]));
   assert.equal(cap?.originalStoneTowerCrown,t.name);
   assert.equal(cap?.asset,'pack3:025');
   thisCrown++;
  }
  assert.equal(thisCrown,24,'solid-backed octagonal ring cap count drifted');
  crowns+=thisCrown;
 }
 assert.equal(crowns,48);
 for(const flag of ['actualTowerUpperStairs','realHarborTraffic','liveWaterOrSeaPhysics',
  'customsEconomyActive','physicalProducerColliderApproved','actualWeatherproofingApproved',
  'actualIphoneTested','creatorArtworkApproved'])
  assert.equal(b.architecturalIdentity[flag],false,'tower source falsely claims live mechanic '+flag);
});
test('Original 70 upright Pack4 panes: 34 Tidemark+24 Saffronwind low two-tier windows and 12 high stone-frame windows',()=>{
 let total=0;
 for(const spec of specs){
  const b=spec.build(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   panes=b.placements.filter(p=>p.role==='window');
  assert.equal(panes.length,spec.glass);
  let high=0,low=0;
  for(const p of panes){
   const [x,y,z]=p.at,[dx,dz]=dir[p.orientation];
   assert.equal(p.asset,'pack4:030');
   assert.equal(p.occupancy.kind,'unresolved','false original Pack4 live collision certification');
   assert.ok(!m.has(K([x+dx,y,z+dz])),'pane aimed inside a solid neighboring voxel');
   if(p.realElevatedStoneFrame){
    high++;
    assert.ok(y===19||y===23,'wrong original registry tower high glass tier');
    assert.equal(m.get(K([x,y-1,z]))?.role,'wall','missing upper glass stone sill');
    assert.equal(m.get(K([x,y+1,z]))?.role,'wall','missing upper glass stone lintel');
   }else{
    low++;
    assert.ok(y===2||y===3,'two-tier source window is not truly upright');
    assert.equal(m.get(K([x,1,z]))?.role,'wall','missing original ground sill');
    assert.equal(m.get(K([x,4,z]))?.role,'wall','missing original upper lintel');
   }
  }
  if(b.id===SAFFRONWIND_DUAL_REGISTRY_ID){assert.equal(high,12);assert.equal(low,24)}
  else{assert.equal(high,0);assert.equal(low,34)}
  total+=panes.length;
 }
 assert.equal(total,70);
});
test('Exactly 48 local eight-way strict D4 against genuine prior original fishery and registry designs',()=>{
 let n=0;
 for(const spec of specs){
  const source=spec.build(),a=d4(source,false,0);
  for(const prior of spec.previous){
   const previous=prior();
   for(const flip of [false,true])for(let turn=0;turn<4;turn++){
    const score=iou(a,d4(previous,flip,turn));n++;
    assert.ok(score<.85,'same-category original clone '+source.id+' vs '+previous.id+' score '+score);
   }
  }
 }
 assert.equal(n,48);
});
