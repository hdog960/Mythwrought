// MYTHWROUGHT Builder B Waves40-41 original-source focused Node contracts.
// No native execution has occurred merely by staging this test.
// No 228 accepted-source corpus scan here: exactly one waves9-41 shared gate.
// Does not certify Pack3/4 producer meshes/collisions, world placement,
// engine renders, settlement ownership, performance, iPhone or schema-1 saves.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMoonfernTriskelionArboretum,MOONFERN_TRISKELION_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave40.mjs';
import {buildSaltglassTernForkCustomsHouse,SALTGLASS_TERN_FORK_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave41.mjs';
import {buildGlimmerboughSplitSunOrchidHouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave13.mjs';
import {buildAmberwellSandglassConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave17.mjs';
import {buildStarpetalDoubleGardenOrchidarium} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave29.mjs';
import {buildTidehollowCrosswharfHarborOffice} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave6.mjs';
import {buildGlassduneSplitQuayRegistry} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave14.mjs';
import {buildAlderquaySplitPierHarborOffice} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave32.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=a=>a.join(',');
const faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
const specs=[
 {wave:40,fn:buildMoonfernTriskelionArboretum,id:MOONFERN_TRISKELION_ID,
  category:'greenhouse',biome:'enchanted-forest',size:'small',cells:8605,
  roofs:2195,walkable:2291,glass:68,bays:17,glassHeight:4,rooms:15,portals:19,
  wings:8,roofKey:'originalMoonfernRadialWing',
  courts:[[23,22,31,30],[11,39,17,45],[37,38,43,45]],
  externalCells:158,externalField:'outsideGroundedMoonPaths',
  exteriorEnd:[8,54,48,54,53],
  previous:[buildGlimmerboughSplitSunOrchidHouse,buildAmberwellSandglassConservatory,buildStarpetalDoubleGardenOrchidarium]},
 {wave:41,fn:buildSaltglassTernForkCustomsHouse,id:SALTGLASS_TERN_FORK_ID,
  category:'harbor-office',biome:'temperate',size:'small',cells:9211,
  roofs:2336,walkable:2450,glass:34,bays:17,glassHeight:2,rooms:14,portals:21,
  wings:7,roofKey:'originalSaltglassTernRoofWing',
  courts:[[24,22,32,31],[11,41,17,47],[39,36,45,42]],
  externalCells:197,externalField:'groundedOuterQuayCrosswalkCells',
  exteriorEnd:[11,58,48,58,57],
  previous:[buildTidehollowCrosswharfHarborOffice,buildGlassduneSplitQuayRegistry,buildAlderquaySplitPierHarborOffice]}
];
function d4(b,mirror,turn){
 const out=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),
   Z=Math.floor(16*p.at[2]/d),A=mirror?15-X:X;let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  out.add([x,Y,z,p.role].join('/'));
 }
 return out;
}
const iou=(a,b)=>{let hit=0;for(const k of a)if(b.has(k))hit++;return hit/(a.size+b.size-hit||1)};
test('Both new originals occupy exclusive frozen B115 ownership slots and remain detached and provisional',()=>{
 const own=getBuilderBServiceOwnership();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 for(const s of specs){
  const b=s.fn();
  assert.equal(b.id,s.id);assert.equal(b.category,s.category);
  assert.equal(b.biome,s.biome);assert.equal(b.size,s.size);
  assert.equal(b.status,'candidate');
  assert.ok(own.builderBIds.includes(b.id));
  assert.ok(!own.builderDAvailableIds.includes(b.id));
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
  assert.equal(b.architecturalIdentity.productionRegistered,false);
  assert.equal(b.architecturalIdentity.saveSchema1Written,false);
  for(const fn of s.previous)
   assert.notEqual(structuralFingerprint(b),structuralFingerprint(fn()));
 }
});
test('All 4531 original Pack3 roofs have immediately authored solid y-minus-one backing and unresolved physical approval',()=>{
 let roofTotal=0;
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   roofs=b.placements.filter(p=>p.role==='roof');
  assert.equal(b.placements.length,s.cells);
  assert.equal(b.walkable.length,s.walkable);
  assert.equal(b.rooms.length,s.rooms);assert.equal(b.portals.length,s.portals);
  assert.equal(roofs.length,s.roofs);
  assert.equal(new Set(roofs.map(p=>p[s.roofKey]).filter(Boolean)).size,s.wings);
  for(const p of roofs){
   const [x,y,z]=p.at,back=m.get(K([x,y-1,z]));
   assert.ok(p.asset.startsWith('pack3:'));
   assert.equal(p.occupancy.kind,'unresolved');
   assert.ok(back&&['wall','support','partition'].includes(back.role),
    'source roof missing genuine directly-underfoot material at '+K(p.at));
  }
  roofTotal+=roofs.length;
 }
 assert.equal(roofTotal,4531);
});
test('All 374 original paved sky-open courtyard cells are literally unoccupied through full source height',()=>{
 let count=0;
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K));
  for(const [x0,z0,x1,z1] of s.courts)
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
    count++;
    assert.equal(m.get(K([x,0,z]))?.role,'foundation','fake sky court slab');
    assert.ok(walk.has(K([x,1,z])),'court not really walkable');
    for(let y=1;y<b.footprint.height;y++)
     assert.ok(!m.has(K([x,y,z])),'source full sky openness violated');
   }
  for(const portal of b.portals){
   assert.ok(walk.has(K(portal.at)),'actual two-high portal floor not walkable');
   assert.ok(!m.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),
    'original source doorway obstructed at head height');
  }
 }
 assert.equal(count,374);
});
test('External-only cardinal walking joins real three-spoke Moonfern route and three Tern piers without cheating through interiors',()=>{
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   walk=new Set(b.walkable.map(K)),[x0,z0,x1,z1,minZ]=s.exteriorEnd;
  assert.equal(b.architecturalIdentity[s.externalField],s.externalCells);
  for(const [x,z] of [[x0,z0],[x1,z1]]){
   assert.equal(m.get(K([x,0,z]))?.role,'foundation');
   assert.ok(walk.has(K([x,1,z])));
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!m.has(K([x,y,z])),'claimed outside route is actually under source roof');
  }
  const start=K([x0,1,z0]),end=K([x1,1,z1]),
   q=[start],seen=new Set(q);
  for(let i=0;i<q.length;i++){
   const [x,y,z]=q[i].split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const xx=x+dx,zz=z+dz,next=K([xx,y,zz]);
    if(zz<minZ||!walk.has(next)||seen.has(next))continue;
    seen.add(next);q.push(next);
   }
  }
  assert.ok(seen.has(end),'external corridor cannot connect without crossing internal roofed aisle');
 }
});
test('Original 102 upright Pack4 panes belong to 34 complete framed exterior source bays of correct height',()=>{
 let windows=0,bays=0;
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[K(p.at),p])),
   panes=b.placements.filter(p=>p.role==='window'),groups=new Map();
  assert.equal(panes.length,s.glass);
  for(const p of panes){
   const [x,y,z]=p.at,[dx,dz]=faces[p.orientation];
   assert.equal(p.asset,'pack4:030');
   assert.equal(p.occupancy.kind,'unresolved');
   assert.ok(!m.has(K([x+dx,y,z+dz])),'glass faces an exterior wall');
   assert.equal(m.get(K([x,1,z]))?.role,'wall','glass sill absent');
   assert.equal(m.get(K([x,s.glassHeight+2,z]))?.role,'wall','glass lintel absent');
   const key=x+','+z;
   if(!groups.has(key))groups.set(key,new Set());
   groups.get(key).add(y);
  }
  assert.equal(groups.size,s.bays);
  for(const v of groups.values())
   assert.deepEqual([...v].sort((a,b)=>a-b),
    Array.from({length:s.glassHeight},(_,i)=>i+2));
  windows+=panes.length;bays+=groups.size;
 }
 assert.deepEqual([windows,bays],[102,34]);
});
test('Moonfern grounded nine-tier marker and Saltglass four grounded six-tier stone baffles are physically authored',()=>{
 const moon=buildMoonfernTriskelionArboretum(),
  m=new Map(moon.placements.map(p=>[K(p.at),p]));
 assert.equal(m.get(K([7,0,22]))?.role,'foundation');
 for(let y=1;y<=9;y++){
  const p=m.get(K([7,y,22]));
  assert.equal(p?.role,'support');
  assert.equal(p?.asset,'live:stone');
 }
 assert.equal(m.get(K([7,10,22]))?.directlySourceBackedMoonDialCap,true);
 assert.equal(moon.architecturalIdentity.workingMagicalMoondial,false);
 const tern=buildSaltglassTernForkCustomsHouse(),
  t=new Map(tern.placements.map(p=>[K(p.at),p]));
 assert.equal(tern.architecturalIdentity.originalGroundedStoneSemaphorePiers,4);
 for(const [x,z] of [[19,20],[37,20],[19,39],[37,43]]){
  assert.equal(t.get(K([x,0,z]))?.role,'foundation');
  for(let y=1;y<=6;y++){
   const p=t.get(K([x,y,z]));
   assert.ok(p&&['support','wall','partition'].includes(p.role));
  }
 }
 assert.equal(tern.architecturalIdentity.operationalCustoms,false);
});
test('Exactly 48 strict original same-category D4 reflections/rotations pass unrelaxed IoU below 0.85',()=>{
 let count=0;
 for(const s of specs){
  const b=s.fn(),orig=d4(b,false,0);
  for(const prior of s.previous){
   const old=prior();
   for(const flip of [false,true])for(let turn=0;turn<4;turn++){
    const score=iou(orig,d4(old,flip,turn));count++;
    assert.ok(score<.85,'original architectural near-clone '+b.id+' vs '+old.id+' '+score);
   }
  }
 }
 assert.equal(count,48);
});
