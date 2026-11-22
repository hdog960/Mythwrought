// MYTHWROUGHT Roadmap B Waves36–37 original-source focused Node tests.
// Source candidate geometry only: these tests DO NOT certify full original
// game rendering, live Pack3/4 colliders, materials, weather loads, sea,
// settlements, physical upper-story access, saved worlds or iPhone/PWA.
// Full accepted historical 228-candidate D4 belongs to ONE shared test.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSunspireTwinCrownDesertLighthouse,SUNSPIRE_TWIN_CROWN_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave36.mjs';
import {buildSilverpineFourCourtWinterglass,SILVERPINE_FOUR_COURT_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave37.mjs';
import {buildFrostwakeCrownbridgeLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave8.mjs';
import {buildSunscarOpenOculusLanternwatch} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave21.mjs';
import {buildBriarcliffCrescentWalkLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave30.mjs';
import {buildCrystalfenStaggeredWinterglass} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave23.mjs';
import {buildStarpetalDoubleGardenOrchidarium} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave29.mjs';
import {buildWillowglassTripleAtriumConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave31.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=a=>a.join(',');
const face={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
const specs=[
 {build:buildSunspireTwinCrownDesertLighthouse,id:SUNSPIRE_TWIN_CROWN_ID,
  size:'large',biome:'desert',category:'lighthouse',
  authored:18390,roofs:4186,walkable:4391,rooms:15,portals:21,
  roofKey:'originalSunspireRoofWing',wings:9,
  courts:[[30,27,47,40],[13,50,22,59],[56,50,65,59]],
  outdoorWalking:224,outdoorProp:'originalPavedUnroofedYApproachCells',
  endpoints:[[22,75],[57,75]],glass:63,lowBayHeight:3,lowBayCount:17,highGlass:12,
  previous:[buildFrostwakeCrownbridgeLighthouse,buildSunscarOpenOculusLanternwatch,
   buildBriarcliffCrescentWalkLighthouse]},
 {build:buildSilverpineFourCourtWinterglass,id:SILVERPINE_FOUR_COURT_ID,
  size:'large',biome:'snow',category:'greenhouse',
  authored:17350,roofs:4308,walkable:4620,rooms:17,portals:25,
  roofKey:'originalSilverpineRoofWing',wings:10,
  courts:[[30,27,47,40],[12,51,21,60],[57,51,66,60],[30,61,49,66]],
  outdoorWalking:209,outdoorProp:'genuineOpenSouthUPromenadeCells',
  endpoints:[[19,75],[60,75]],glass:105,lowBayHeight:5,lowBayCount:21,highGlass:0,
  previous:[buildCrystalfenStaggeredWinterglass,buildStarpetalDoubleGardenOrchidarium,
   buildWillowglassTripleAtriumConservatory]}
];
function d4(b,mirror,turn){
 const s=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),
   Z=Math.floor(16*p.at[2]/d),A=mirror?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  s.add([x,Y,z,p.role].join('/'));
 }
 return s;
}
const iou=(a,b)=>{let n=0;for(const k of a)if(b.has(k))n++;return n/(a.size+b.size-n||1)};
test('Waves36 and37 own only frozen B115-exclusive unused IDs; never D92 or canonical historical 228 or production/world saves',()=>{
 const own=getBuilderBServiceOwnership();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 for(const spec of specs){
  const b=spec.build();
  assert.equal(b.id,spec.id);
  assert.equal(b.category,spec.category);assert.equal(b.biome,spec.biome);
  assert.equal(b.size,spec.size);
  assert.ok(own.builderBIds.includes(b.id),'not a frozen B115 exclusive source slot');
  assert.ok(!own.builderDAvailableIds.includes(b.id),'Builder D-only slot collision');
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
  assert.equal(b.architecturalIdentity.productionRegistered,false);
  assert.equal(b.architecturalIdentity.saveSchema1Written,false);
  for(const old of spec.previous)
   assert.notEqual(structuralFingerprint(b),structuralFingerprint(old()));
 }
});
test('Both original source plans keep 8494 immediately backed Pack3 roof cells, all 1024 y0 paved/y1 walkable sky-open court columns and clear 46 original portals',()=>{
 let nRoof=0,nCourt=0,nPortal=0;
 for(const spec of specs){
  const b=spec.build(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K)),roof=b.placements.filter(p=>p.role==='roof');
  assert.equal(b.placements.length,spec.authored);
  assert.equal(b.walkable.length,spec.walkable);
  assert.equal(b.rooms.length,spec.rooms);assert.equal(b.portals.length,spec.portals);
  assert.equal(roof.length,spec.roofs);
  assert.equal(new Set(roof.map(p=>p[spec.roofKey]).filter(Boolean)).size,spec.wings);
  for(const p of roof){
   assert.ok(p.asset.startsWith('pack3:'),'source roof spoofed by horizontal Pack4 glass');
   assert.equal(p.occupancy.kind,'unresolved','no unearned real Pack3 producer/collider certificate');
   const [x,y,z]=p.at,below=m.get(K([x,y-1,z]));
   assert.ok(below&&['wall','support','partition'].includes(below.role),
    'authored roof lacks genuine immediate source y-1 support '+K(p.at));
  }
  for(const [x0,z0,x1,z1] of spec.courts)
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
    nCourt++;
    assert.equal(m.get(K([x,0,z]))?.role,'foundation','outdoor court has no original stone source ground');
    assert.ok(walk.has(K([x,1,z])),'outdoor court is not truly walkable');
    for(let y=1;y<b.footprint.height;y++)
     assert.ok(!m.has(K([x,y,z])),'real sky-open original courtyard obstructed at '+K([x,y,z]));
   }
  for(const p of b.portals){
   assert.ok(walk.has(K(p.at)),'actual original portal is not on a connected walkable floor');
   assert.ok(!m.has(K([p.at[0],p.at[1]+1,p.at[2]])),'two-high portal loses original headroom');
  }
  nRoof+=roof.length;nPortal+=b.portals.length;
 }
 assert.deepEqual([nRoof,nCourt,nPortal],[8494,1024,46]);
});
test('All genuine external Y/U pedestrian arms remain unroofed, physically grounded and joined by cardinal walkable source BFS',()=>{
 for(const spec of specs){
  const b=spec.build(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K));
  assert.equal(b.architecturalIdentity[spec.outdoorProp],spec.outdoorWalking);
  const [[x0,z0],[x1,z1]]=spec.endpoints;
  for(const [x,z] of spec.endpoints){
   assert.equal(m.get(K([x,0,z]))?.role,'foundation','claimed approach floor is not grounded stone');
   assert.ok(walk.has(K([x,1,z])),'outdoor approach endpoint not walkable');
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!m.has(K([x,y,z])),'supposedly open exterior path has authored roof/support');
  }
  const start=K([x0,1,z0]),end=K([x1,1,z1]),q=[start],seen=new Set(q);
  for(let i=0;i<q.length;i++){
   const [x,y,z]=q[i].split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const next=K([x+dx,y,z+dz]);
    if(walk.has(next)&&!seen.has(next)){seen.add(next);q.push(next)}
   }
  }
  assert.ok(seen.has(end),'the two physically paved outdoor limbs are not traversably cross-linked');
 }
});
test('Sunspire two independent real 38/34-tier grounded masonry octagons hold 48 backed crown cells and 12 high originally framed windows',()=>{
 const b=buildSunspireTwinCrownDesertLighthouse(),m=new Map(b.placements.map(p=>[K(p.at),p])),
  towers=[{name:'west-grounded-sunspire',x0:7,x1:13,z0:22,z1:30,h:38},
   {name:'east-grounded-sunspire',x0:65,x1:71,z0:22,z1:30,h:34}];
 assert.deepEqual(b.architecturalIdentity.realStoneTowerWallHeights,[38,34]);
 assert.equal(b.architecturalIdentity.realPack3CrownCells,48);
 assert.equal(b.architecturalIdentity.originalHighStoneFramedPack4Windows,12);
 let nCrown=0,nHigh=0;
 for(const t of towers){
  let crowns=0;
  for(let x=t.x0;x<=t.x1;x++)for(let z=t.z0;z<=t.z1;z++){
   assert.equal(m.get(K([x,0,z]))?.role,'foundation','true original tower ground footing missing');
   for(let y=1;y<=3;y++)
    assert.equal(m.get(K([x,y,z]))?.asset,'live:stone','original tower foundation is not a solid stone body');
   const ring=(x===t.x0||x===t.x1||z===t.z0||z===t.z1)&&
    !((x===t.x0||x===t.x1)&&(z===t.z0||z===t.z1));
   if(!ring)continue;
   for(let y=4;y<=t.h;y++){
    const p=m.get(K([x,y,z]));
    assert.ok(p&&['wall','window'].includes(p.role),'octagonal original shaft has missing masonry tier');
    assert.ok(['live:stone','pack4:030'].includes(p.asset));
   }
   assert.equal(m.get(K([x,t.h+1,z]))?.realDirectlyBackedSunspireCrown,t.name);
   crowns++;
  }
  assert.equal(crowns,24);
  const high=b.placements.filter(p=>p.originalHighSunspireWindow===t.name);
  assert.equal(high.length,6);
  for(const p of high){
   const [x,y,z]=p.at,[dx,dz]=face[p.orientation];
   assert.equal(m.get(K([x,y-1,z]))?.role,'wall','high Pack4 stone window missing real sill');
   assert.equal(m.get(K([x,y+1,z]))?.role,'wall','high Pack4 stone window missing real lintel');
   assert.ok(!m.has(K([x+dx,y,z+dz])),'high source window faces real neighboring voxel');
  }
  nHigh+=high.length;nCrown+=crowns;
 }
 assert.deepEqual([nCrown,nHigh],[48,12]);
 for(const flag of ['livePowerOrBeacon','upperTowerPlayerStairs','realSeaOrDesertWindSimulation',
  'actualPackCollisionApproved','iphoneHomeScreenAccepted','creatorVisualAccepted'])
  assert.equal(b.architecturalIdentity[flag],false);
});
test('Both have 168 original upright Pack4 window cells: 12 upper framed stone panels, 17 full three-high and 21 full five-high exterior wood bays',()=>{
 let total=0,high=0,bayCount=0;
 for(const spec of specs){
  const b=spec.build(),m=new Map(b.placements.map(p=>[K(p.at),p])),
    glass=b.placements.filter(p=>p.role==='window'),bays=new Map();
  assert.equal(glass.length,spec.glass);
  for(const p of glass){
   const [x,y,z]=p.at,[dx,dz]=face[p.orientation];
   assert.equal(p.asset,'pack4:030');
   assert.equal(p.occupancy.kind,'unresolved','Pack4 live physical mesh has not been approved');
   assert.ok(!m.has(K([x+dx,y,z+dz])),'upward glass window not facing exterior air');
   if(p.originalHighSunspireWindow){
    high++;assert.equal(m.get(K([x,y-1,z]))?.role,'wall');
    assert.equal(m.get(K([x,y+1,z]))?.role,'wall');
   }else{
    assert.ok(y>=2&&y<spec.lowBayHeight+2);
    assert.equal(m.get(K([x,1,z]))?.role,'wall','original glass sill missing');
    assert.equal(m.get(K([x,spec.lowBayHeight+2,z]))?.role,'wall','original glass lintel missing');
    const key=x+','+z;
    if(!bays.has(key))bays.set(key,new Set());
    bays.get(key).add(y);
   }
  }
  assert.equal(bays.size,spec.lowBayCount);
  for(const levels of bays.values())
   assert.deepEqual([...levels].sort(),Array.from({length:spec.lowBayHeight},(_,i)=>i+2),
    'source window not physically complete vertically');
  total+=glass.length;bayCount+=bays.size;
 }
 assert.deepEqual([total,high,bayCount],[168,12,38]);
});
test('Exactly 48 prior original same-category strict eight-way rotations/reflections remain below D4 threshold 0.85',()=>{
 let n=0;
 for(const spec of specs){
  const actual=spec.build(),one=d4(actual,false,0);
  for(const fn of spec.previous){
   const old=fn();
   for(const flip of [false,true])for(let t=0;t<4;t++){
    const score=iou(one,d4(old,flip,t));n++;
    assert.ok(score<.85,'new original source is near-clone '+actual.id+' / '+old.id+' '+score);
   }
  }
 }
 assert.equal(n,48);
});
