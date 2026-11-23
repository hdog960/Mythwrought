// MYTHWROUGHT Builder B Wave48 authentic original-source Node22 focused gates.
// DO NOT run the immutable 228-history sweep per wave. Source-only building
// candidate: never implies live Pack3/4 shader/selection/collider, actual
// snow/heat/crop growth, game settlement placement, saves or iPhone approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildFrostmerefoldFourCourtWinterConservatory,FROSTMEREFOLD_FOUR_COURT_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave48.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildRimeglassCrescentSunGreenhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave7.mjs';
import {buildGlimmerboughSplitSunOrchidHouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave13.mjs';
import {buildAmberwellSandglassConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave17.mjs';
import {buildAuroracrestFoldedFrostSeedhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave19.mjs';
import {buildCrystalfenStaggeredWinterglass} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave23.mjs';
import {buildStarpetalDoubleGardenOrchidarium} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave29.mjs';
import {buildWillowglassTripleAtriumConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave31.mjs';
import {buildSilverpineFourCourtWinterglass} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave37.mjs';
import {buildMoonfernTriskelionArboretum} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave40.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
const old=[
 buildAlderglassTrellisConservatory,buildRimeglassCrescentSunGreenhouse,
 buildGlimmerboughSplitSunOrchidHouse,buildAmberwellSandglassConservatory,
 buildAuroracrestFoldedFrostSeedhouse,buildCrystalfenStaggeredWinterglass,
 buildStarpetalDoubleGardenOrchidarium,buildWillowglassTripleAtriumConservatory,
 buildSilverpineFourCourtWinterglass,buildMoonfernTriskelionArboretum
];
function d4(b,flip,turn){
 const pts=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d);
  const A=flip?15-X:X;let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  pts.add([x,Y,z,p.role].join('/'));
 }return pts;
}
const iou=(a,b)=>{let n=0;for(const k of a)if(b.has(k))n++;return n/(a.size+b.size-n||1)};
test('B115 original snow large greenhouse #004 is exclusively ours, not accepted228 or D92, and never integrates',()=>{
 const own=getBuilderBServiceOwnership(),b=buildFrostmerefoldFourCourtWinterConservatory();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(b.id,FROSTMEREFOLD_FOUR_COURT_ID);
 assert.equal(b.id,'r1:greenhouse:snow:large:004');
 assert.ok(own.builderBIds.includes(b.id));
 assert.ok(!own.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['greenhouse','snow','large']);
 assert.equal(b.status,'candidate');
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.saveSchema1Written,false);
});
test('Authentic original blueprint compiler validates 14,302 unique source placements, 3,902 walks, 19 rooms and 25 actual portals',()=>{
 const b=buildFrostmerefoldFourCourtWinterConservatory();
 assert.deepEqual(b.footprint,{width:68,height:36,depth:78});
 assert.equal(b.placements.length,14302);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,14302);
 assert.equal(b.walkable.length,3902);
 assert.equal(b.rooms.length,19);assert.equal(b.portals.length,25);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,48);
});
test('All ELEVEN independently occupied candidate Pack3 roof regions have actual immediate solid source backing, no fabricated physical approval',()=>{
 const b=buildFrostmerefoldFourCourtWinterConservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roofs=b.placements.filter(p=>p.role==='roof'),wingCounts=new Map();
 assert.equal(roofs.length,3471);
 for(const p of roofs){
  const [x,y,z]=p.at,name=p.frostmerefoldElevenDistinctRoofWing;
  assert.ok(name,'roof missing actual wing attribution');
  wingCounts.set(name,(wingCounts.get(name)||0)+1);
  assert.match(p.asset,/^pack3:/);assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(['wall','partition','support'].includes(m.get(K(x,y-1,z))?.role),'unbacked candidate Pack3 '+p.at);
 }
 assert.equal(wingCounts.size,11,'overlapping wings lost source cells');
 for(const [name,count] of wingCounts)assert.ok(count>=80,'wing is only a duplicate shadow '+name);
});
test('All 396 original FOUR stone-founded open courts actually walk and are fully sky-open to source top',()=>{
 const b=buildFrostmerefoldFourCourtWinterConservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 let total=0;
 for(const [x0,z0,x1,z1] of [[29,20,38,31],[12,46,20,55],[47,46,55,55],[28,50,39,57]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   total++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.ok(walks.has(K(x,1,z)),'false court source path');
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!m.has(K(x,y,z)),'false open garden has solid source overhead '+K(x,y,z));
  }
 assert.equal(total,396);
});
test('Four original empty stone specimen plinths genuinely sit on an original stone floor, no crop power or water claim',()=>{
 const b=buildFrostmerefoldFourCourtWinterConservatory(),m=new Map(b.placements.map(p=>[p.at.join(','),p]));
 for(const [x,z] of [[17,17],[51,17],[16,57],[52,57]]){
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  const p=m.get(K(x,1,z));
  assert.equal(p?.role,'furnishing');assert.equal(p?.asset,'live:stone');
  assert.equal(p?.dryOriginalSeedPlinth,true);
  assert.equal(p?.seedGrowth,false);
 }
 assert.equal(b.architecturalIdentity.realHeating,false);
 assert.equal(b.architecturalIdentity.liveCrops,false);
 assert.equal(b.architecturalIdentity.waterPumps,false);
});
test('All 25 original named portals physically have actual source foundation, y1 opening and y2 head clearance',()=>{
 const b=buildFrostmerefoldFourCourtWinterConservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
  assert.ok(walks.has(K(x,y,z)),'portal not really walkable '+p.at);
  assert.ok(!m.has(K(x,y+1,z)),'last source step closed the real portal '+p.at);
 }
});
test('Three individually founded snow return corridors join through exterior-only z>=72 stone crosspass without borrowing internal roof routes',()=>{
 const b=buildFrostmerefoldFourCourtWinterConservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 for(const [x,z] of [[18,74],[34,74],[50,74]]){
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walks.has(K(x,1,z)));
 }
 assert.equal(b.architecturalIdentity.actualSourceOutdoorUnroofedReturnCells,398);
 const start=K(18,1,74),end=K(50,1,74),q=[start],seen=new Set(q);
 for(let i=0;i<q.length;i++){
  const [x,,z]=q[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const X=x+dx,Z=z+dz,k=K(X,1,Z);
   if(Z<72||seen.has(k)||!walks.has(k))continue;
   seen.add(k);q.push(k);
  }
 }
 assert.ok(seen.has(end),'no truly outside west-east physical connection');
 assert.equal(seen.size,225);
});
test('Original 95 outward candidate Pack4 panes form 19 five-high source-framed bays with stone sill/header and unresolved ABI',()=>{
 const b=buildFrostmerefoldFourCourtWinterConservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  glass=b.placements.filter(p=>p.role==='window'),groups=new Map();
 assert.equal(glass.length,95);
 for(const p of glass){
  const [x,y,z]=p.at,[dx,dz]=faces[p.orientation];
  assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,7,z))?.role,'wall');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,7,z))?.asset,'live:stone');
  assert.ok(!m.has(K(x+dx,y,z+dz)),'window faces occupied original wall');
  const k=x+','+z;if(!groups.has(k))groups.set(k,new Set());
  groups.get(k).add(y);
 }
 assert.equal(groups.size,19);
 for(const ys of groups.values())assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4,5,6]);
});
test('Original strict D4 originality: 10 actual older same-category constructors, 80 real mirror/rotation comparisons <0.85',()=>{
 const b=buildFrostmerefoldFourCourtWinterConservatory(),source=d4(b,false,0);
 let count=0,max=0,nearest=null;
 for(const fn of old){
  const peer=fn();
  assert.notEqual(peer.id,b.id);
  assert.notEqual(structuralFingerprint(peer),structuralFingerprint(b));
  for(const flip of [false,true])for(let t=0;t<4;t++){
   const score=iou(source,d4(peer,flip,t));count++;
   if(score>max){max=score;nearest=peer.id;}
   assert.ok(score<0.85,'genuine older greenhouse design near-clone '+peer.id+' '+score);
  }
 }
 assert.equal(count,80);
 console.log('FROSTMEREFOLD_ACTUAL_ORIGINAL_10PEER_D4_PASS '+JSON.stringify({comparisons:count,maxIoU:max,nearest}));
});
