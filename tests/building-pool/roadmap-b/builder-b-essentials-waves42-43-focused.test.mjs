// Builder B Waves42-43 exact original source contracts. Not live-game tests.
// No native Node run or 228 accepted historical D4 execution claimed here.
// Original Pack3/Pack4 occupancy MUST stay unresolved until physical review.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildGreenbarrowThreeLaneStonecropGranary,GREENBARROW_STONECROP_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave42.mjs';
import {buildSuncradleOffsetBasinBathhouse,SUNCRADLE_OFFSET_BASIN_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave43.mjs';
import {buildBriarfordSwitchwingBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {buildDuneharpSpiralGranary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave22.mjs';
import {buildSleetgroveRafterLatticeBarn} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave38.mjs';
import {buildSunshardSplitWellBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave5.mjs';
import {buildHearthspanDoubleCourtWinterBathhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave18.mjs';
import {buildFrostmereThreeCourtBathLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave35.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=(x,y,z)=>x+','+y+','+z,face={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
const specs=[
 {wave:42,fn:buildGreenbarrowThreeLaneStonecropGranary,id:GREENBARROW_STONECROP_ID,
  category:'farm-barn',biome:'temperate',size:'medium',cells:12031,roofs:3084,walk:3192,
  roofField:'originalGreenbarrowRoofWing',wingCount:8,glass:60,bays:20,rooms:15,portals:22,
  courts:[[27,25,37,35],[12,43,19,49],[46,43,53,49]],
  left:[17,65],right:[51,65],minZ:63,
  older:[buildBriarfordSwitchwingBarn,buildDuneharpSpiralGranary,buildSleetgroveRafterLatticeBarn]},
 {wave:43,fn:buildSuncradleOffsetBasinBathhouse,id:SUNCRADLE_OFFSET_BASIN_ID,
  category:'bathhouse',biome:'desert',size:'medium',cells:8056,roofs:2018,walk:2037,
  roofField:'originalSuncradleRoofWing',wingCount:7,glass:42,bays:14,rooms:14,portals:21,
  courts:[[22,22,30,30],[10,36,16,43],[37,35,43,42]],
  left:[13,53],right:[40,53],minZ:51,
  older:[buildSunshardSplitWellBathhouse,buildHearthspanDoubleCourtWinterBathhouse,buildFrostmereThreeCourtBathLodge]}
];
function d4(b,flip,t){
 const out=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;if(t===1)[x,z]=[Z,15-A];if(t===2)[x,z]=[15-A,15-Z];if(t===3)[x,z]=[15-Z,A];
  out.add([x,Y,z,p.role].join('/'));
 }return out;
}
const iou=(a,b)=>{let n=0;for(const v of a)if(b.has(v))n++;return n/(a.size+b.size-n||1)};
test('New original IDs are genuinely unused among earlier authored same-category services, B115-only and not historical or D92',()=>{
 const own=getBuilderBServiceOwnership();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(GREENBARROW_STONECROP_ID,'r1:farm-barn:temperate:medium:004');
 assert.equal(SUNCRADLE_OFFSET_BASIN_ID,'r1:bathhouse:desert:medium:003');
 const alreadyAuthored=[...new Set(specs.flatMap(s=>s.older.map(f=>f().id)))];
 for(const s of specs){
  const b=s.fn();
  assert.equal(b.id,s.id);assert.equal(b.category,s.category);
  assert.equal(b.biome,s.biome);assert.equal(b.size,s.size);
  assert.ok(own.builderBIds.includes(b.id));
  assert.ok(!own.builderDAvailableIds.includes(b.id));
  assert.ok(!alreadyAuthored.includes(b.id),'regression: Wave43 may not reuse original Wave5 desert small bathhouse ID');
  assert.equal(b.status,'candidate');assert.equal(b.liveIntegration,false);
  assert.equal(b.worldPlacement,false);assert.equal(b.architecturalIdentity.productionRegistered,false);
  assert.equal(b.architecturalIdentity.saveSchema1Written,false);
  for(const older of s.older)assert.notEqual(structuralFingerprint(b),structuralFingerprint(older()));
 }
});
test('Exactly 5102 source Pack3 roofs have real immediate backed solid source y-1 material, no accepted producer AABB',()=>{
 let total=0;
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
   roofs=b.placements.filter(p=>p.role==='roof');
  assert.equal(b.placements.length,s.cells);assert.equal(b.walkable.length,s.walk);
  assert.equal(b.rooms.length,s.rooms);assert.equal(b.portals.length,s.portals);
  assert.equal(roofs.length,s.roofs);
  assert.equal(new Set(roofs.map(p=>p[s.roofField]).filter(Boolean)).size,s.wingCount);
  for(const p of roofs){
   const [x,y,z]=p.at,back=m.get(K(x,y-1,z));
   assert.ok(p.asset.startsWith('pack3:'));assert.equal(p.occupancy.kind,'unresolved');
   assert.ok(back&&['support','wall','partition'].includes(back.role),
    'source Pack3 roof has no genuine immediately supporting y-1 original cell');
  }
  total+=roofs.length;
 }
 assert.equal(total,5102);
});
test('All 426 original court columns are paved y0, walkable y1 and truly open sky for the entire source height',()=>{
 let total=0;
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
   walk=new Set(b.walkable.map(x=>x.join(',')));
  for(const [x0,z0,x1,z1] of s.courts)
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
    total++;assert.equal(m.get(K(x,0,z))?.role,'foundation');
    assert.ok(walk.has(K(x,1,z)));
    for(let y=1;y<b.footprint.height;y++)
     assert.ok(!m.has(K(x,y,z)),'claimed source open courtyard has roof, post or glass');
   }
  for(const p of b.portals){
   const [x,y,z]=p.at;assert.ok(walk.has(K(x,y,z)));
   assert.ok(!m.has(K(x,y+1,z)),'source original two-high portal obstructed');
  }
 }
 assert.equal(total,426);
});
test('Both outdoor lane networks join opposite endpoints with exterior-only cardinal walking, never routing through interior roofs',()=>{
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
   walk=new Set(b.walkable.map(x=>x.join(','))),
   [lx,lz]=s.left,[rx,rz]=s.right;
  for(const [x,z] of [s.left,s.right]){
   assert.equal(m.get(K(x,0,z))?.role,'foundation');
   assert.ok(walk.has(K(x,1,z)));
   for(let y=1;y<b.footprint.height;y++)assert.ok(!m.has(K(x,y,z)));
  }
  const start=K(lx,1,lz),goal=K(rx,1,rz),seen=new Set([start]),q=[start];
  for(let i=0;i<q.length;i++){
   const [x,y,z]=q[i].split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const X=x+dx,Z=z+dz,n=K(X,1,Z);
    if(Z<s.minZ||!walk.has(n)||seen.has(n))continue;
    seen.add(n);q.push(n);
   }
  }
  assert.ok(seen.has(goal),'decorative claimed exterior crosswalk not truly linked');
 }
});
test('All 102 upright Pack4 glass cells form exactly 34 complete outward-facing three-tier window bays with original frames',()=>{
 let total=0,bayTotal=0;
 for(const s of specs){
  const b=s.fn(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
   glass=b.placements.filter(p=>p.role==='window'),bays=new Map();
  assert.equal(glass.length,s.glass);
  for(const p of glass){
   const [x,y,z]=p.at,[dx,dz]=face[p.orientation],key=x+','+z;
   assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
   assert.ok(!m.has(K(x+dx,y,z+dz)),'window faces original source wall');
   assert.equal(m.get(K(x,1,z))?.role,'wall','window sill missing');
   assert.equal(m.get(K(x,5,z))?.role,'wall','window lintel missing');
   if(!bays.has(key))bays.set(key,new Set());
   bays.get(key).add(y);
  }
  assert.equal(bays.size,s.bays);
  for(const levels of bays.values())assert.deepEqual([...levels].sort((a,b)=>a-b),[2,3,4]);
  total+=glass.length;bayTotal+=bays.size;
 }
 assert.deepEqual([total,bayTotal],[102,34]);
});
test('Twin grounded Greenbarrow eight-tier stonecrop markers and Suncradle 30 genuine empty stone basin segments are physically authored',()=>{
 const g=buildGreenbarrowThreeLaneStonecropGranary(),
  gm=new Map(g.placements.map(p=>[p.at.join(','),p]));
 for(const [x,z] of [[16,23],[49,24]]){
  assert.equal(gm.get(K(x,0,z))?.role,'foundation');
  for(let y=1;y<=8;y++)assert.equal(gm.get(K(x,y,z))?.asset,'live:stone');
  assert.ok(gm.get(K(x,9,z))?.actualSourceBackedGreenbarrowMarkerCap);
 }
 const s=buildSuncradleOffsetBasinBathhouse(),m=new Map(s.placements.map(p=>[p.at.join(','),p]));
 let n=0;
 for(const [name,x0,z0] of [['west-empty-cool-basin',7,30],['east-empty-cool-basin',43,29]]){
  for(let x=x0;x<=x0+4;x++)for(let z=z0;z<=z0+4;z++){
   if(x!==x0&&x!==x0+4&&z!==z0&&z!==z0+4)continue;
   if(z===z0&&x===x0+2)continue;n++;
   const p=m.get(K(x,1,z));
   assert.equal(p?.asset,'live:stone');
   assert.equal(p?.realEmptyOriginalBasinRing,name);
   assert.equal(p?.noActualWater,true);
  }
 }
 assert.equal(n,30);assert.equal(s.architecturalIdentity.operatingBathWater,false);
});
test('48 strict same-category original eight-way D4 transforms, no unearned relaxation of 0.85 uniqueness threshold',()=>{
 let checked=0;
 for(const s of specs){
  const b=s.fn(),a=d4(b,false,0);
  for(const fn of s.older){const p=fn();for(const mirror of [false,true])for(let turn=0;turn<4;turn++){
   const score=iou(a,d4(p,mirror,turn));checked++;
   assert.ok(score<.85,'original source structural near-clone '+b.id+' vs '+p.id+' '+score);
  }}
 }
 assert.equal(checked,48);
});
