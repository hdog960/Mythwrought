// MYTHWROUGHT Builder B Waves38-39 original-source focused Node contract.
// No 228 historical full corpus scan here. No native execution claimed until
// an exact-head original-repository Node runner actually executes this file.
// Source support/walk/court/window/tower only, not a live Pack3/4 mesh,
// climate, settlement, world-save, iPhone PWA or creator visual certificate.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSleetgroveRafterLatticeBarn,SLEETGROVE_RAFTER_LATTICE_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave38.mjs';
import {buildCoppersaltTripleDrySlipLodge,COPPERSALT_TRIPLE_DRY_SLIP_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave39.mjs';
import {buildMossveilTwinCourtSporeGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave11.mjs';
import {buildDuneharpSpiralGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave22.mjs';
import {buildCoppermesaCombLaneHarvestBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave34.mjs';
import {buildDunewakeOasisReedworksFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave10.mjs';
import {buildTidemarkForkedQuayFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave26.mjs';
import {buildDriftgaleTLandingSnowLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave28.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=p=>p.join(',');
const sides={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
const specs=[
 {fn:buildSleetgroveRafterLatticeBarn,id:SLEETGROVE_RAFTER_LATTICE_ID,
  category:'farm-barn',biome:'snow',size:'large',cells:18505,
  roofs:4783,walk:5072,windows:63,rooms:19,portals:27,
  wings:11,roofKey:'originalSleetgroveRoofWing',
  courts:[[30,27,48,41],[13,51,23,61],[55,51,66,61]],
  outdoorKey:'physicallyPavedLoadingLadderCells',outdoor:207,
  left:[16,77],right:[63,77],lowBays:21,upperGlass:0,
  peers:[buildMossveilTwinCourtSporeGranary,buildDuneharpSpiralGranary,buildCoppermesaCombLaneHarvestBarn]},
 {fn:buildCoppersaltTripleDrySlipLodge,id:COPPERSALT_TRIPLE_DRY_SLIP_ID,
  category:'fishing-lodge',biome:'desert',size:'large',cells:18588,
  roofs:4559,walk:4867,windows:57,rooms:17,portals:24,
  wings:10,roofKey:'originalCoppersaltRoofWing',
  courts:[[30,28,48,42],[13,52,23,62],[56,52,67,62]],
  outdoorKey:'unroofedTripleDrySlipCells',outdoor:236,
  left:[17,77],right:[61,77],lowBays:17,upperGlass:6,
  peers:[buildDunewakeOasisReedworksFishingLodge,buildTidemarkForkedQuayFishingLodge,buildDriftgaleTLandingSnowLodge]}
];
function d4(b,mirror,turn){
 const out=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),
   A=mirror?15-X:X;let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  out.add([x,Y,z,p.role].join('/'));
 }return out;
}
const iou=(a,b)=>{let common=0;for(const k of a)if(b.has(k))common++;return common/(a.size+b.size-common||1)};
test('Waves38 and39 use unused B115-only frozen IDs and no live world or schema1 changes',()=>{
 const own=getBuilderBServiceOwnership();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 for(const s of specs){
  const b=s.fn();
  assert.equal(b.id,s.id);assert.equal(b.category,s.category);
  assert.equal(b.biome,s.biome);assert.equal(b.size,s.size);
  assert.ok(own.builderBIds.includes(b.id),'new original is not B115-exclusive');
  assert.ok(!own.builderDAvailableIds.includes(b.id),'Builder D-only slot stolen');
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
  assert.equal(b.architecturalIdentity.productionRegistered,false);
  assert.equal(b.architecturalIdentity.saveSchema1Written,false);
  for(const fn of s.peers)assert.notEqual(structuralFingerprint(b),structuralFingerprint(fn()));
 }
});
test('Original 9342 backed Pack3 roofs and 1076 genuinely paved, walkable, completely sky-open courts stay physical',()=>{
 let roofTotal=0,courtTotal=0,portalTotal=0;
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K)),roofs=b.placements.filter(p=>p.role==='roof');
  assert.equal(b.placements.length,s.cells);assert.equal(b.walkable.length,s.walk);
  assert.equal(b.rooms.length,s.rooms);assert.equal(b.portals.length,s.portals);
  assert.equal(roofs.length,s.roofs);
  assert.equal(new Set(roofs.map(p=>p[s.roofKey]).filter(Boolean)).size,s.wings);
  for(const p of roofs){
   assert.ok(p.asset.startsWith('pack3:'),'roof replaced by fake horizontal Pack4 glazing');
   assert.equal(p.occupancy.kind,'unresolved','Pack3 installation is not yet certified');
   const [x,y,z]=p.at,back=m.get(K([x,y-1,z]));
   assert.ok(back&&['wall','support','partition'].includes(back.role),
    'roof misses true original immediate y-1 source backing at '+K(p.at));
  }
  for(const [x0,z0,x1,z1] of s.courts)for(let x=x0;x<=x1;x++)
   for(let z=z0;z<=z1;z++){
    courtTotal++;
    assert.equal(m.get(K([x,0,z]))?.role,'foundation','fake source courtyard paving');
    assert.ok(walk.has(K([x,1,z])),'source paved courtyard not traversable');
    for(let y=1;y<b.footprint.height;y++)
     assert.ok(!m.has(K([x,y,z])),'courtyard supposed sky-open column has a physical obstruction');
   }
  for(const p of b.portals){
   assert.ok(walk.has(K(p.at)),'portal lacks a true grounded pedestrian floor');
   assert.ok(!m.has(K([p.at[0],p.at[1]+1,p.at[2]])),'portal lost its original two-high clearance');
  }
  roofTotal+=roofs.length;portalTotal+=b.portals.length;
 }
 assert.deepEqual([roofTotal,courtTotal,portalTotal],[9342,1076,51]);
});
test('Four-branch snow ladder and three dry-slip outdoor arms are truly grounded, sky-clear, and connected through y1 cardinal walking',()=>{
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K)),[[x0,z0],[x1,z1]]=[s.left,s.right];
  assert.equal(b.architecturalIdentity[s.outdoorKey],s.outdoor);
  for(const [x,z] of [s.left,s.right]){
   assert.equal(m.get(K([x,0,z]))?.role,'foundation','physical outdoor ground missing');
   assert.ok(walk.has(K([x,1,z])),'source outdoor endpoint not walkable');
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!m.has(K([x,y,z])),'open-air outdoor endpoint has authored roof/post');
  }
  const start=K([x0,1,z0]),goal=K([x1,1,z1]),seen=new Set([start]),q=[start];
  for(let i=0;i<q.length;i++){
   const [x,y,z]=q[i].split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const next=K([x+dx,y,z+dz]);
    if(walk.has(next)&&!seen.has(next)){seen.add(next);q.push(next)}
   }
  }
  assert.ok(seen.has(goal),'source outdoor crosslink not actually traversable');
 }
});
test('Sleetgrove has four truly grounded seven-tier masonry cold-wind piers outside all source open courts',()=>{
 const b=buildSleetgroveRafterLatticeBarn(),m=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.deepEqual(b.architecturalIdentity.groundedPavedUnroofedCourts,[285,121,132]);
 assert.equal(b.architecturalIdentity.originalGroundLoadingArms,4);
 assert.equal(b.architecturalIdentity.groundedStoneWindbreakPosts,4);
 for(const [x,z] of [[24,24],[53,24],[24,44],[53,45]]){
  assert.equal(m.get(K([x,0,z]))?.role,'foundation','cold-wind pier not source grounded');
  for(let y=1;y<=7;y++){
   const p=m.get(K([x,y,z]));
   assert.ok(p&&['wall','support','partition'].includes(p.role),
    'missing physical original stone-windbreak tier '+K([x,y,z]));
  }
 }
});
test('Coppersalt 28-tier stone lookout has 24 directly backed crowns and exactly six true stone-framed elevated panes',()=>{
 const b=buildCoppersaltTripleDrySlipLodge(),m=new Map(b.placements.map(p=>[K(p.at),p])),
  t={x0:66,x1:72,z0:24,z1:32,h:28};
 assert.deepEqual(b.architecturalIdentity.realPavedSkyOpenCourts,[285,121,132]);
 assert.equal(b.architecturalIdentity.originalStoneTowerHeight,28);
 assert.equal(b.architecturalIdentity.originalBackedCrownCells,24);
 let crown=0;
 for(let x=t.x0;x<=t.x1;x++)for(let z=t.z0;z<=t.z1;z++){
  assert.equal(m.get(K([x,0,z]))?.role,'foundation','original lookout no stone y0');
  for(let y=1;y<=3;y++)
   assert.equal(m.get(K([x,y,z]))?.asset,'live:stone','hollow fake original tower base');
  const rim=(x===t.x0||x===t.x1||z===t.z0||z===t.z1)&&
   !((x===t.x0||x===t.x1)&&(z===t.z0||z===t.z1));
  if(!rim)continue;
  for(let y=4;y<=t.h;y++){
   const p=m.get(K([x,y,z]));
   assert.ok(p&&['wall','window'].includes(p.role),'octagonal tower has a missing tier');
   assert.ok(['live:stone','pack4:030'].includes(p.asset));
  }
  assert.equal(m.get(K([x,t.h+1,z]))?.originalDirectlyBackedCoppersaltCrown,true);
  crown++;
 }
 assert.equal(crown,24);
 const high=b.placements.filter(p=>p.actualHighCoppersaltStoneGlass);
 assert.equal(high.length,6);
 for(const p of high){
  const [x,y,z]=p.at,[dx,dz]=sides[p.orientation];
  assert.equal(m.get(K([x,y-1,z]))?.role,'wall','tower upper window lacks stone sill');
  assert.equal(m.get(K([x,y+1,z]))?.role,'wall','tower upper window lacks stone lintel');
  assert.ok(!m.has(K([x+dx,y,z+dz])),'tower high pane does not face exterior air');
 }
});
test('Both source buildings have 120 real Pack4 window cells and 38 complete upright three-high exterior bays',()=>{
 let allGlass=0,allBays=0,allHigh=0;
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   panes=b.placements.filter(p=>p.role==='window'),bays=new Map();
  assert.equal(panes.length,s.windows);
  for(const p of panes){
   const [x,y,z]=p.at,[dx,dz]=sides[p.orientation];
   assert.equal(p.asset,'pack4:030');
   assert.equal(p.occupancy.kind,'unresolved','real Pack4 mesh/collision not yet live');
   assert.ok(!m.has(K([x+dx,y,z+dz])),'glass points into a physical wall');
   if(p.actualHighCoppersaltStoneGlass){
    allHigh++;
    assert.equal(m.get(K([x,y-1,z]))?.role,'wall');
    assert.equal(m.get(K([x,y+1,z]))?.role,'wall');
   }else{
    assert.ok([2,3,4].includes(y));
    assert.equal(m.get(K([x,1,z]))?.role,'wall','glass sill missing');
    assert.equal(m.get(K([x,5,z]))?.role,'wall','glass header missing');
    const key=x+','+z;
    if(!bays.has(key))bays.set(key,new Set());
    bays.get(key).add(y);
   }
  }
  assert.equal(bays.size,s.lowBays);
  for(const v of bays.values())assert.deepEqual([...v].sort(),[2,3,4]);
  allBays+=bays.size;allGlass+=panes.length;
 }
 assert.deepEqual([allGlass,allBays,allHigh],[120,38,6]);
});
test('Strict original same-category 8-way D4 remains below unchanged 0.85 on exactly 48 real transformations',()=>{
 let checked=0;
 for(const s of specs){
  const b=s.fn(),actual=d4(b,false,0);
  for(const prior of s.peers){
   const other=prior();
   for(const mirror of [false,true])for(let turn=0;turn<4;turn++){
    const score=iou(actual,d4(other,mirror,turn));checked++;
    assert.ok(score<.85,'original source near-clone '+b.id+' vs '+other.id+' score '+score);
   }
  }
 }
 assert.equal(checked,48);
});
