// MYTHWROUGHT Builder B Roadmap B Wave52 — focused native Node22 tests.
// Unrun natively until authenticated complete original checkout is available.
// Original-source V8 adaptation may validate here without misclaiming Node.
// Never relax original D4 <0.85, source-owner B115/D92 or production safety.
// No actual horses, live water, Pack3/4 collider, settlements, saves or PWA.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSunmantleSixPaddockCaravansary,SUNMANTLE_SIX_PADDOCK_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave52.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildMeadowstepSplitAisleStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave4.mjs';
import {buildSunspokeForkedShelterCorralStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave12.mjs';
import {buildBramblecrossSplitRailCoachStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave20.mjs';
import {buildRimehookWindShelterStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave25.mjs';
import {buildSunfallBraidedSandCaravanStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave33.mjs';
import {buildAlderbrookDoubleHorseshoeCoachingStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave44.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const pens=[
 ['west-inner-camel-free',9,74],
 ['west-outer-camel-free',18,74],
 ['central-west-pack-free',30,74],
 ['central-east-pack-free',41,74],
 ['east-inner-horse-free',55,74],
 ['east-outer-horse-free',65,74]
];
const peers=[
 buildMeadowstepSplitAisleStables,
 buildSunspokeForkedShelterCorralStables,
 buildBramblecrossSplitRailCoachStables,
 buildRimehookWindShelterStables,
 buildSunfallBraidedSandCaravanStables,
 buildAlderbrookDoubleHorseshoeCoachingStables
];
function d4(b,flip,turn){
 const s=new Set(),{width:w,height:h,depth:d}=b.footprint;
 for(const p of b.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d);
  const A=flip?15-X:X;let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  s.add([x,Y,z,p.role].join('/'));
 }return s;
}
function iou(a,b){let n=0;for(const key of a)if(b.has(key))n++;return n/(a.size+b.size-n||1)}
test('B115-exclusive desert LARGE stable #005, not D92/accepted228, unchanged candidate lifecycle',()=>{
 const own=getBuilderBServiceOwnership(),b=buildSunmantleSixPaddockCaravansary();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(b.id,SUNMANTLE_SIX_PADDOCK_ID);
 assert.equal(b.id,'r1:stable:desert:large:005');
 assert.ok(own.builderBIds.includes(b.id));
 assert.ok(!own.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['stable','desert','large']);
 assert.equal(b.status,'candidate');
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.saveSchema1Written,false);
});
test('Original compiler: 18,152 genuinely unique source cells, 5,599 connected y1 walks, 25 rooms, 33 portals',()=>{
 const b=buildSunmantleSixPaddockCaravansary();
 assert.deepEqual(b.footprint,{width:78,height:38,depth:94});
 assert.equal(b.placements.length,18152);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,18152);
 assert.equal(b.walkable.length,5599);
 assert.equal(b.rooms.length,25);assert.equal(b.portals.length,33);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,52);
});
test('All 4,292 candidate original Pack3 roof cells have immediately solid backing and eleven nonempty distinctive wings',()=>{
 const b=buildSunmantleSixPaddockCaravansary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roofs=b.placements.filter(p=>p.role==='roof'),wings=new Map();
 assert.equal(roofs.length,4292);
 for(const p of roofs){
  const [x,y,z]=p.at;
  assert.match(p.asset,/^pack3:/);assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(['wall','support','partition'].includes(m.get(K(x,y-1,z))?.role),
   'unsupported roof source cell '+p.at);
  const name=p.sunmantleActualRoofWing;
  assert.ok(name,'roof without actual wing identity');
  wings.set(name,(wings.get(name)||0)+1);
 }
 assert.equal(wings.size,11);
 for(const [name,n] of wings)assert.ok(n>=60,'ghost/occluded covered wing '+name);
});
test('All 11 full ground-to-roof load-bearing stone post positions survive portals, partitions, late glass conversion',()=>{
 const b=buildSunmantleSixPaddockCaravansary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  posts=b.placements.filter(p=>p.purpose?.startsWith('sunmantle-contiguous-source-roof-bearing-')),
  sites=new Map();
 for(const p of posts){
  const name=p.purpose.slice('sunmantle-contiguous-source-roof-bearing-'.length);
  if(!sites.has(name))sites.set(name,p.at);
 }
 assert.equal(sites.size,11);
 for(const [name,[x,,z]] of sites){
  const yRoof=b.placements.find(p=>p.sunmantleActualRoofWing===name&&p.at[0]===x&&p.at[2]===z)?.at[1];
  assert.ok(Number.isInteger(yRoof),'no genuine roof over source-bearing column '+name);
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  for(let y=1;y<yRoof;y++)
   assert.ok(['wall','support','partition'].includes(m.get(K(x,y,z))?.role),
    'missing original solid source bearing tier '+name+' '+K(x,y,z));
 }
});
test('All four sky-open stone courts have exactly 451 really clear walkable floor-to-source-top columns',()=>{
 const b=buildSunmantleSixPaddockCaravansary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let count=0;
 for(const [x0,z0,x1,z1] of [[33,22,43,34],[13,42,22,51],[56,42,65,51],[34,53,45,61]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   count++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.ok(walk.has(K(x,1,z)),'court floor not walkable '+K(x,1,z));
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!m.has(K(x,y,z)),'court is falsely roofed '+K(x,y,z));
  }
 assert.equal(count,451);
});
test('Six distinct genuinely stone-founded 7x7 dry paddocks have exact 276 physical two-tier opaque wood rail cells and true two-high front gate openings',()=>{
 const b=buildSunmantleSixPaddockCaravansary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let total=0,gates=0;
 for(const [name,x0,z0] of pens){
  const gate=x0+3;
  for(let x=x0;x<=x0+6;x++)for(let z=z0;z<=z0+6;z++){
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   const fence=(x===x0||x===x0+6||z===z0||z===z0+6)&&!(x===gate&&z===z0);
   if(fence)for(let y=1;y<=2;y++){
    total++;
    assert.equal(m.get(K(x,y,z))?.sunmantleTwoHighRealDryWoodRail,name);
    assert.equal(m.get(K(x,y,z))?.asset,'live:wood');
    assert.ok(!walk.has(K(x,1,z)),'original rail is phantom walkable');
   }
  }
  assert.ok(walk.has(K(gate,1,z0)),'actual pen doorway walk is blocked');
  assert.ok(!m.has(K(gate,2,z0)),'actual pen gate lacks headroom');
  gates++;
 }
 assert.equal(total,276);assert.equal(gates,6);
});
test('All six physical pen gates admit connected original two-high y1 walks up to the side of the dry stone trough without walking through rails',()=>{
 const b=buildSunmantleSixPaddockCaravansary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let verified=0;
 for(const [name,x0,z0] of pens){
  const gate=x0+3,front=K(gate,1,z0),goal=K(gate,1,z0+3);
  const q=[front],seen=new Set(q);
  for(let i=0;i<q.length;i++){
   const [x,,z]=q[i].split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const X=x+dx,Z=z+dz,k=K(X,1,Z);
    if(X<x0||X>x0+6||Z<z0||Z>z0+6||seen.has(k)||!walk.has(k))continue;
    assert.ok(!m.has(K(X,2,Z)),'pen-headroom blocked by original upper fence');
    seen.add(k);q.push(k);
   }
  }
  assert.ok(seen.has(goal),'source pen not physically admitted from gate '+name);
  assert.equal(m.get(K(gate,1,z0+4))?.sunmantleAuthenticDryStoneTrough,name);
  verified++;
 }
 assert.equal(verified,6);
});
test('Six literal three-cell raised dry troughs occupy exactly 18 genuine grounded original stone cells, with no active water or livestock claim',()=>{
 const b=buildSunmantleSixPaddockCaravansary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let n=0;
 for(const [name,x0,z0] of pens){
  const center=x0+3,z=z0+4;
  for(let x=center-1;x<=center+1;x++){
   const p=m.get(K(x,1,z));
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.equal(p?.sunmantleAuthenticDryStoneTrough,name);
   assert.equal(p?.asset,'live:stone');
   assert.equal(p?.actualWaterAndHorseUse,false);
   assert.ok(!walk.has(K(x,1,z)),'solid trough phantom walkable');
   n++;
  }
 }
 assert.equal(n,18);
 assert.equal(b.architecturalIdentity.workingHorses,false);
 assert.equal(b.architecturalIdentity.liveWater,false);
});
test('All 33 original hall and paddock portals retain founded y1 movement and unblocked two-high y1/y2 entrance',()=>{
 const b=buildSunmantleSixPaddockCaravansary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,y,z)),'physical source portal is closed '+p.at);
  assert.ok(!m.has(K(x,y+1,z)),'source head clearance failed '+p.at);
 }
 assert.equal(b.portals.filter(p=>pens.some(([name])=>p.to===name)).length,6);
});
test('Three original exterior dry loading arms connect by outside-only four-neighbor source walk, not through the roofed halls',()=>{
 const b=buildSunmantleSixPaddockCaravansary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 const start=K(17,1,89),goal=K(61,1,89),q=[start],seen=new Set(q);
 for(let i=0;i<q.length;i++){
  const [x,,z]=q[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const Z=z+dz,k=K(x+dx,1,Z);
   if(Z<87||seen.has(k)||!walk.has(k))continue;
   seen.add(k);q.push(k);
  }
 }
 assert.ok(seen.has(goal),'genuine outside walk does not connect west and east');
 assert.equal(seen.size,330);
 for(const x of [17,39,61]){
  assert.equal(m.get(K(x,0,89))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,89)));
 }
});
test('76 source Pack4 unresolved glass candidates form 19 complete original outward four-high wall-framed bays without weakening roof posts',()=>{
 const b=buildSunmantleSixPaddockCaravansary(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  windows=b.placements.filter(p=>p.role==='window'),
  faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]},groups=new Map();
 assert.equal(windows.length,76);
 for(const p of windows){
  const [x,y,z]=p.at,[dx,dz]=faces[p.orientation];
  assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,6,z))?.role,'wall');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,6,z))?.asset,'live:stone');
  assert.ok(!m.has(K(x+dx,y,z+dz)),'source glass faces an adjacent solid');
  const k=x+','+z;if(!groups.has(k))groups.set(k,new Set());
  groups.get(k).add(y);
 }
 assert.equal(groups.size,19);
 for(const ys of groups.values())assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4,5]);
});
test('48 unchanged strict original-source eight-way D4 novelty checks against six genuine earlier stable constructors remain below 0.85',()=>{
 const b=buildSunmantleSixPaddockCaravansary(),s=d4(b,false,0);
 let count=0,maxIoU=0,nearest=null;
 for(const fn of peers){
  const old=fn();
  assert.notEqual(old.id,b.id);
  assert.notEqual(structuralFingerprint(old),structuralFingerprint(b));
  for(const flip of [false,true])for(let turn=0;turn<4;turn++){
   const v=iou(s,d4(old,flip,turn));
   if(v>maxIoU){maxIoU=v;nearest=old.id;}
   assert.ok(v<0.85,'actual original stable source D4 clone '+old.id+' '+v);
   count++;
  }
 }
 assert.equal(count,48);
 console.log('SUNMANTLE_ACTUAL_SIX_STABLE_48_D4_PASS '+JSON.stringify({count,maxIoU,nearest}));
});
