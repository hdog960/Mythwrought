// MYTHWROUGHT Builder B Wave46 focused genuine Node source tests.
// Run separately from the expensive shared 228-original historical D4 scan.
// Pack3/Pack4 real meshes, collider/selection, game integration and iPhone PWA
// are NOT tested by this source-only contract.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCattailreachThreeFingerFishingLodge,CATTAILREACH_THREE_FINGER_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave46.mjs';
import {buildSedgewatchTidehookFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave3.mjs';
import {buildDunewakeOasisReedworksFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave10.mjs';
import {buildFrostlineEightWingIcewatchLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave16.mjs';
import {buildTidemarkForkedQuayFishingLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave26.mjs';
import {buildDriftgaleTLandingSnowLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave28.mjs';
import {buildCoppersaltTripleDrySlipLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave39.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const faces={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
const earlier=[buildSedgewatchTidehookFishingLodge,buildDunewakeOasisReedworksFishingLodge,
 buildFrostlineEightWingIcewatchLodge,buildTidemarkForkedQuayFishingLodge,
 buildDriftgaleTLandingSnowLodge,buildCoppersaltTripleDrySlipLodge];
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
function iou(a,b){
 let hits=0;for(const k of a)if(b.has(k))hits++;
 return hits/(a.size+b.size-hits||1);
}
test('Cattailreach is an exclusive unused B115 1B slot, not D92 or historical 228, with no runtime mutation',()=>{
 const b=buildCattailreachThreeFingerFishingLodge(),own=getBuilderBServiceOwnership();
 assert.equal(b.id,CATTAILREACH_THREE_FINGER_ID);
 assert.equal(b.id,'r1:fishing-lodge:temperate:small:003');
 assert.ok(own.builderBIds.includes(b.id));
 assert.ok(!own.builderDAvailableIds.includes(b.id));
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.deepEqual([b.category,b.biome,b.size],['fishing-lodge','temperate','small']);
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.saveSchema1Written,false);
});
test('Original 5,490 placement source compiles with 14 named rooms, 16 two-high portals and 1,201 actual free grounded walks',()=>{
 const b=buildCattailreachThreeFingerFishingLodge(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 assert.deepEqual(b.footprint,{width:43,height:25,depth:50});
 assert.equal(b.placements.length,5490);
 assert.equal(b.rooms.length,14);assert.equal(b.portals.length,16);
 assert.equal(b.walkable.length,1201);
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.role,'foundation','portal lacks foundation');
  assert.ok(walk.has(K(x,y,z)),'portal collides with source');
  assert.ok(!m.has(K(x,y+1,z)),'two-high source opening blocked');
 }
});
test('Seven independently marked Pack3 roof wings have 1,119 distinct immediately solid-backed candidate roof cells',()=>{
 const b=buildCattailreachThreeFingerFishingLodge(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roofs=b.placements.filter(p=>p.role==='roof');
 assert.equal(roofs.length,1119);
 assert.equal(new Set(roofs.map(p=>p.cattailreachIndividualRoofWing)).size,7);
 for(const p of roofs){
  const [x,y,z]=p.at,under=m.get(K(x,y-1,z));
  assert.ok(p.asset.startsWith('pack3:'));
  assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(under&&['support','wall','partition'].includes(under.role),
   'true immediate backing missing '+K(x,y,z));
 }
});
test('All 136 columns across three distinct paved courts are actually fully sky-open and grounded',()=>{
 const b=buildCattailreachThreeFingerFishingLodge(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let count=0;
 for(const [x0,z0,x1,z1] of [[17,13,24,20],[8,28,13,33],[31,29,36,34]]){
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   count++;
   assert.equal(m.get(K(x,0,z))?.role,'foundation');
   assert.ok(walk.has(K(x,1,z)));
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!m.has(K(x,y,z)),'false roofless court '+K(x,y,z));
  }
 }
 assert.equal(count,136);
});
test('Three wooden jetty fingers join one genuinely external-only transverse walk from west to east',()=>{
 const b=buildCattailreachThreeFingerFishingLodge(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 for(const x of [8,21,36])for(const z of [42,47]){
  assert.equal(m.get(K(x,0,z))?.asset,'live:wood');
  assert.ok(walk.has(K(x,1,z)));
 }
 const start=K(8,1,47),goal=K(36,1,47),q=[start],seen=new Set(q);
 for(let i=0;i<q.length;i++){
  const [x,,z]=q[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const X=x+dx,Z=z+dz,k=K(X,1,Z);
   if(Z<46||seen.has(k)||!walk.has(k))continue;
   seen.add(k);q.push(k);
  }
 }
 assert.ok(seen.has(goal),'external-only crosswalk disconnected');
 assert.ok(seen.size>=90,'crosswalk relies on an indoor shortcut');
});
test('Six individual source-grounded mooring posts are physical five-high timber, never pretend boats',()=>{
 const b=buildCattailreachThreeFingerFishingLodge(),m=new Map(b.placements.map(p=>[p.at.join(','),p]));
 for(const [x,z] of [[6,44],[10,44],[19,43],[23,43],[34,44],[38,44]]){
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
  for(let y=1;y<=5;y++){
   const p=m.get(K(x,y,z));
   assert.equal(p?.role,'support');assert.equal(p?.asset,'live:wood');
   assert.equal(p?.physicalDryMooringPost,true);
  }
 }
 assert.equal(b.architecturalIdentity.workingFishing,false);
 assert.equal(b.architecturalIdentity.waterGenerated,false);
});
test('66 real outward Pack4 candidate panes form 22 complete three-high wood-framed bays, not fake approved AABBs',()=>{
 const b=buildCattailreachThreeFingerFishingLodge(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  glass=b.placements.filter(p=>p.role==='window'),groups=new Map();
 assert.equal(glass.length,66);
 for(const p of glass){
  const [x,y,z]=p.at,[dx,dz]=faces[p.orientation];
  assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,5,z))?.role,'wall');
  assert.ok(!m.has(K(x+dx,y,z+dz)),'glass faces occupied source');
  const key=x+','+z;if(!groups.has(key))groups.set(key,new Set());
  groups.get(key).add(y);
 }
 assert.equal(groups.size,22);
 for(const ys of groups.values())assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4]);
});
test('Wave46 remains structurally distinct against six genuine previous fishing-lodge originals through 48 unchanged strict D4 transforms',()=>{
 const b=buildCattailreachThreeFingerFishingLodge(),source=d4(b,false,0);
 let count=0,max=0;
 for(const fn of earlier){
  const prior=fn();
  assert.notEqual(prior.id,b.id);
  assert.notEqual(structuralFingerprint(prior),structuralFingerprint(b));
  for(const flip of [false,true])for(let turn=0;turn<4;turn++){
   const score=iou(source,d4(prior,flip,turn));count++;max=Math.max(max,score);
   assert.ok(score<0.85,'D4 duplicate source '+prior.id+' '+score);
  }
 }
 assert.equal(count,48);
 console.log('CATTAILREACH_STRICT_SIX_PEER_D4_SOURCE_ONLY '+JSON.stringify({comparisons:count,maxIoU:max}));
});
