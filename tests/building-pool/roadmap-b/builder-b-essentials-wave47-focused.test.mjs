// MYTHWROUGHT Builder B Wave47 isolated Node22 original-source acceptance.
// Efficient local focused gate only: do not rerun old accepted 228-history D4 here.
// No live Pack3/4 mesh or collider, no actual boats/tides, no settlement,
// no runtime registration, no schema1 saves, and no installed iPhone PWA.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildHearthquayThreeFingerRegistry,HEARTHQUAY_SPLIT_REGISTER_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave47.mjs';
import {buildTidehollowCrosswharfHarborOffice} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave6.mjs';
import {buildGlassduneSplitQuayRegistry} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave14.mjs';
import {buildIcehavenBifurcatedSnowCustoms} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave15.mjs';
import {buildSaffronwindDoubleTowerHarborRegistry} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave27.mjs';
import {buildAlderquaySplitPierHarborOffice} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave32.mjs';
import {buildSaltglassTernForkCustomsHouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave41.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const faces={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
function d4(b,flip,turn){
 const set=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d);
  const A=flip?15-X:X;let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  set.add([x,Y,z,p.role].join('/'));
 }return set;
}
const iou=(a,b)=>{let common=0;for(const k of a)if(b.has(k))common++;return common/(a.size+b.size-common||1)};
const previous=[
 buildTidehollowCrosswharfHarborOffice,buildGlassduneSplitQuayRegistry,
 buildIcehavenBifurcatedSnowCustoms,buildSaffronwindDoubleTowerHarborRegistry,
 buildAlderquaySplitPierHarborOffice,buildSaltglassTernForkCustomsHouse
];
test('Wave47 genuine canonical ownership only B115, neither historic 228 nor D92',()=>{
 const own=getBuilderBServiceOwnership(),b=buildHearthquayThreeFingerRegistry();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(b.id,HEARTHQUAY_SPLIT_REGISTER_ID);
 assert.equal(b.id,'r1:harbor-office:temperate:medium:003');
 assert.ok(own.builderBIds.includes(b.id));
 assert.ok(!own.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['harbor-office','temperate','medium']);
 assert.equal(b.status,'candidate');assert.equal(b.worldPlacement,false);
 assert.equal(b.liveIntegration,false);assert.equal(b.architecturalIdentity.saveSchema1Written,false);
});
test('Original installed blueprint compiler validates 10,391 unique voxel placements, 2,682 real clear walks and 16 named rooms',()=>{
 const b=buildHearthquayThreeFingerRegistry();
 assert.deepEqual(b.footprint,{width:58,height:30,depth:66});
 assert.equal(b.placements.length,10391);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,10391);
 assert.equal(b.walkable.length,2682);
 assert.equal(b.rooms.length,16);assert.equal(b.portals.length,19);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,47);
});
test('Nine actual original roof wing tags cover 2,498 Pack3 candidates, each with immediate occupied backing',()=>{
 const b=buildHearthquayThreeFingerRegistry(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roofs=b.placements.filter(p=>p.role==='roof');
 assert.equal(roofs.length,2498);
 assert.equal(new Set(roofs.map(p=>p.hearthquayTrueIndividualRoofWing)).size,9);
 for(const p of roofs){
  const [x,y,z]=p.at,under=m.get(K(x,y-1,z));
  assert.match(p.asset,/^pack3:/);assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(under&&['support','wall','partition'].includes(under.role),'unbacked source roof '+p.at);
 }
});
test('Three true entirely sky-open paved stone courts give 228 fully clear walkable columns',()=>{
 const b=buildHearthquayThreeFingerRegistry(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 let total=0;
 for(const [x0,z0,x1,z1] of [[23,18,32,27],[9,31,16,38],[41,32,48,39]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   total++;
   assert.equal(m.get(K(x,0,z))?.role,'foundation');
   assert.ok(walks.has(K(x,1,z)));
   for(let y=1;y<30;y++)assert.ok(!m.has(K(x,y,z)),'unroofed court closed '+K(x,y,z));
  }
 assert.equal(total,228);
});
test('All 19 source portals genuinely grounded, not closed by last window or partition steps',()=>{
 const b=buildHearthquayThreeFingerRegistry(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
  assert.ok(walks.has(K(x,y,z)),'portal not source walkable');
  assert.ok(!m.has(K(x,2,z)),'source doorway lacks headroom');
 }
});
test('Three genuinely founded dry quay fingers are joined by full outside-only west-east pedestrian transverse return',()=>{
 const b=buildHearthquayThreeFingerRegistry(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 for(const x of [14,28,44])for(const z of [58,62]){
  assert.equal(m.get(K(x,0,z))?.asset,'live:wood');
  assert.ok(walks.has(K(x,1,z)));
 }
 assert.equal(b.architecturalIdentity.actuallyGroundedUnroofedQuayCells,266);
 const start=K(14,1,62),goal=K(44,1,62),seen=new Set([start]),queue=[start];
 for(let i=0;i<queue.length;i++){
  const [x,,z]=queue[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const X=x+dx,Z=z+dz,k=K(X,1,Z);
   if(Z<61||seen.has(k)||!walks.has(k))continue;
   seen.add(k);queue.push(k);
  }
 }
 assert.ok(seen.has(goal),'external-only west-east quay false walking');
 assert.ok(seen.size>=150);
});
test('Six full six-high original stone quay marker columns are source-grounded, no invented docking AI',()=>{
 const b=buildHearthquayThreeFingerRegistry(),m=new Map(b.placements.map(p=>[p.at.join(','),p]));
 for(const [x,z] of [[8,59],[16,59],[25,59],[30,59],[40,59],[48,59]]){
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
  for(let y=1;y<=6;y++){
   const p=m.get(K(x,y,z));
   assert.equal(p?.role,'support');assert.equal(p?.asset,'live:stone');
   assert.ok(p?.realGroundedUnpoweredHarborMark);
  }
 }
 assert.equal(b.architecturalIdentity.actualFisheriesOrBoats,false);
 assert.equal(b.architecturalIdentity.seaGenerated,false);
});
test('57 physically framed upright candidate Pack4 windows make 19 full three-high outward bays',()=>{
 const b=buildHearthquayThreeFingerRegistry(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  glass=b.placements.filter(p=>p.role==='window'),groups=new Map();
 assert.equal(glass.length,57);
 for(const p of glass){
  const [x,y,z]=p.at,[dx,dz]=faces[p.orientation];
  assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,5,z))?.role,'wall');
  assert.ok(!m.has(K(x+dx,y,z+dz)),'outward glass faces live source wall');
  const key=x+','+z;
  if(!groups.has(key))groups.set(key,new Set());
  groups.get(key).add(y);
 }
 assert.equal(groups.size,19);
 for(const ys of groups.values())assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4]);
});
test('Strict 48 unchanged focused D4 rotations against six authentic prior harbor offices are distinct under 0.85',()=>{
 const b=buildHearthquayThreeFingerRegistry(),source=d4(b,false,0);
 let checked=0,max=0;
 for(const fn of previous){
  const peer=fn();
  assert.notEqual(peer.id,b.id);
  assert.notEqual(structuralFingerprint(peer),structuralFingerprint(b));
  for(const flip of [false,true])for(let turn=0;turn<4;turn++){
   const score=iou(source,d4(peer,flip,turn));checked++;
   max=Math.max(max,score);
   assert.ok(score<.85,'same-category D4 near-duplicate '+peer.id+' value '+score);
  }
 }
 assert.equal(checked,48);
 console.log('HEARTHQUAY_AUTHENTIC_SIX_PEER_48_D4_PASS '+JSON.stringify({maxIoU:max,checked}));
});
