// MYTHWROUGHT Roadmap B Wave58 original-source focused native Node22 tests.
// NOT native Node results until complete original repository checkout available.
// Isolated V8 evaluation must not be misrepresented as installed Pack3/4,
// full 228 historical originality, WebGL2 or iPhone Home Screen PWA.
// Original near duplicate rejection remains >=0.85; ownership frozen.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildRimeboundTwinArcCorralStable,RIMEBOUND_TWIN_ARC_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave58.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildMeadowstepSplitAisleStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave4.mjs';
import {buildSunspokeForkedShelterCorralStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave12.mjs';
import {buildBramblecrossSplitRailCoachStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave20.mjs';
import {buildRimehookWindShelterStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave25.mjs';
import {buildSunfallBraidedSandCaravanStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave33.mjs';
import {buildAlderbrookDoubleHorseshoeCoachingStables} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave44.mjs';
import {buildSunmantleSixPaddockCaravansary} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave52.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const pens=[
 ['west-elongated-snow-corral',8,65,18,77,13,71],
 ['east-broad-rime-corral',43,63,55,77,49,70]
];
const peers=[
 buildMeadowstepSplitAisleStables,buildSunspokeForkedShelterCorralStables,
 buildBramblecrossSplitRailCoachStables,buildRimehookWindShelterStables,
 buildSunfallBraidedSandCaravanStables,buildAlderbrookDoubleHorseshoeCoachingStables,
 buildSunmantleSixPaddockCaravansary
];
function d4(v,flip,t){
 const out=new Set(),{width:w,height:h,depth:d}=v.footprint;
 for(const p of v.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),
   Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(t===1)[x,z]=[Z,15-A];
  if(t===2)[x,z]=[15-A,15-Z];
  if(t===3)[x,z]=[15-Z,A];
  out.add([x,Y,z,p.role].join('/'));
 }
 return out;
}
function iou(a,b){let n=0;for(const v of a)if(b.has(v))n++;return n/(a.size+b.size-n||1)}
test('Frozen Builder B B115-exclusive snow small stable ID #005, no D92/accepted228 or game registration',()=>{
 const b=buildRimeboundTwinArcCorralStable(),o=getBuilderBServiceOwnership();
 assert.deepEqual([o.existing,o.forBuilderB,o.forBuilderD],[228,115,92]);
 assert.equal(b.id,RIMEBOUND_TWIN_ARC_ID);
 assert.equal(b.id,'r1:stable:snow:small:005');
 assert.ok(o.builderBIds.includes(b.id));
 assert.ok(!o.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['stable','snow','small']);
 assert.equal(b.status,'candidate');assert.equal(b.worldPlacement,false);
 assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.schema1SaveWritten,false);
});
test('Authentic original compiler exactly 11145 unique cells, 4093 connected source walks, 21 rooms and 31 real portals',()=>{
 const b=buildRimeboundTwinArcCorralStable();
 assert.deepEqual(b.footprint,{width:64,height:35,depth:84});
 assert.equal(b.placements.length,11145);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,11145);
 assert.equal(b.walkable.length,4093);
 assert.equal(b.rooms.length,21);assert.equal(b.portals.length,31);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,58);
});
test('Entire 4424-cell continuous original stone yard has actual y0 footing without disconnected decorative islands',()=>{
 const b=buildRimeboundTwinArcCorralStable(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p]));
 let n=0;
 for(let x=4;x<=59;x++)for(let z=3;z<=81;z++){
  n++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
 }
 assert.equal(n,4424);
});
test('All 2674 unresolved source Pack3 roof cells have real immediately solid backing and eleven non-ghost distinct wings each >=30 cells',()=>{
 const b=buildRimeboundTwinArcCorralStable(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roofs=b.placements.filter(p=>p.role==='roof'),wings=new Map();
 assert.equal(roofs.length,2674);
 for(const p of roofs){
  const [x,y,z]=p.at;
  assert.match(p.asset,/^pack3:/);assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(['wall','support','partition'].includes(m.get(K(x,y-1,z))?.role),
   'source Pack3 immediate solid support missing '+p.at);
  const name=p.rimeboundActualUniqueRoofWing;
  assert.ok(name,'roof has no original authored wing');
  wings.set(name,(wings.get(name)||0)+1);
 }
 assert.equal(wings.size,11);
 for(const [name,n] of wings)assert.ok(n>=30,'overlapped source ghost roof '+name);
 assert.equal(wings.get('west-fir-side-vault'),68);
 assert.equal(wings.get('east-fir-side-vault'),55);
});
test('Every one of eleven original stone roof bearing posts is actually solid from y0 up to its named roof after all portals/glass',()=>{
 const b=buildRimeboundTwinArcCorralStable(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  parts=b.placements.filter(p=>p.purpose?.startsWith('rimebound-source-continuous-roof-bearing-')),
  first=new Map();
 for(const p of parts){
  const name=p.purpose.slice('rimebound-source-continuous-roof-bearing-'.length);
  if(!first.has(name))first.set(name,p.at);
 }
 assert.equal(first.size,11);
 for(const [name,[x,,z]] of first){
  const top=b.placements.find(p=>p.rimeboundActualUniqueRoofWing===name&&p.at[0]===x&&p.at[2]===z)?.at[1];
  assert.ok(Number.isInteger(top),'original roof missing on support '+name);
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  for(let y=1;y<top;y++)
   assert.ok(['wall','support','partition'].includes(m.get(K(x,y,z))?.role),
    'gapped original structural post '+name+' '+K(x,y,z));
 }
});
test('Four original full-height open-sky founded courts contain 310 physically clear y1 walking columns to source top y34',()=>{
 const b=buildRimeboundTwinArcCorralStable(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let n=0;
 for(const [x0,z0,x1,z1] of [
  [27,24,36,34],[14,38,21,45],[43,38,50,45],[28,48,36,55]
 ])for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  n++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,z)),'falsely walkable original court '+K(x,1,z));
  for(let y=1;y<b.footprint.height;y++)
   assert.ok(!m.has(K(x,y,z)),'source sky court blocked '+K(x,y,z));
 }
 assert.equal(n,310);
});
test('Two asymmetric original 11x13 and 13x15 stone-founded corrals carry 176 real two-tier opaque timber rail cells with eight clear gates',()=>{
 const b=buildRimeboundTwinArcCorralStable(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let rails=0,gates=0,founded=0;
 for(const [name,x0,z0,x1,z1,cx] of pens)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   founded++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   const edge=x===x0||x===x1||z===z0||z===z1,
    gate=(x===cx-1||x===cx)&&(z===z0||z===z1);
   if(edge&&!gate)for(let y=1;y<=2;y++){
    rails++;assert.equal(m.get(K(x,y,z))?.rimeboundPhysicalOpaqueTwoHighCorralRail,name);
    assert.equal(m.get(K(x,y,z))?.asset,'live:wood');
    assert.ok(!walk.has(K(x,1,z)),'original rail is phantom passable');
   }
   if(gate){
    gates++;assert.ok(walk.has(K(x,1,z)),'closed gate original y1');
    assert.ok(!m.has(K(x,2,z)),'closed gate source headroom');
   }
  }
 assert.deepEqual([founded,rails,gates],[338,176,8]);
});
test('Original player-body sized y1/y2 four-neighbor source paths really connect each corral north to south and reverse around stone feeders',()=>{
 const b=buildRimeboundTwinArcCorralStable(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let traversed=0;
 for(const [name,x0,z0,x1,z1,cx] of pens)for(const z of [z0,z1]){
  const start=K(cx-1,1,z),goal=K(cx-1,1,z===z0?z1:z0),
   q=[start],seen=new Set(q);
  for(let i=0;i<q.length;i++){
   const [x,,zz]=q[i].split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const X=x+dx,Z=zz+dz,k=K(X,1,Z);
    if(X<x0||X>x1||Z<z0||Z>z1||seen.has(k)||!walk.has(k)||m.has(K(X,2,Z)))continue;
    seen.add(k);q.push(k);
   }
  }
  assert.ok(seen.has(goal),'real source corral not traversable '+name);
  traversed++;
 }
 assert.equal(traversed,4);
});
test('Two 5x5 physically raised dry feed platforms have 50 actual original grounded y1 stone bodies, 32 raised y2 rims and 18 air-only upper inner cells',()=>{
 const b=buildRimeboundTwinArcCorralStable(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let bottoms=0,rims=0,open=0;
 for(const [name,,,,,cx,cz] of pens)
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
   bottoms++;
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.equal(m.get(K(x,1,z))?.rimeboundTrueStoneFoundedDryFiveByFiveFeeder,name);
   assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
   assert.ok(!walk.has(K(x,1,z)),'dry feed stone is phantom walk');
   if(x===cx-2||x===cx+2||z===cz-2||z===cz+2){
    rims++;assert.equal(m.get(K(x,2,z))?.rimeboundActualRaisedStoneFeederRim,name);
   }else{open++;assert.ok(!m.has(K(x,2,z)),'original dry feeder upper center obstructed');}
  }
 assert.deepEqual([bottoms,rims,open],[50,32,18]);
 assert.equal(b.architecturalIdentity.workingAnimalFeeding,false);
});
test('Two true 3x3x3 solid snowwind baffles contain 54 source stone cells and cannot be walked through',()=>{
 const b=buildRimeboundTwinArcCorralStable(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let n=0;
 for(const [name,cx,cz] of [['west-original-snowwall',29,65],['east-original-snowwall',36,65]])
  for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.ok(!walk.has(K(x,1,z)),'solid wind baffle phantom walk');
   for(let y=1;y<=3;y++){
    n++;assert.equal(m.get(K(x,y,z))?.rimeboundTrueGroundedThreeHighWindBaffle,name);
    assert.equal(m.get(K(x,y,z))?.asset,'live:stone');
   }
  }
 assert.equal(n,54);
 assert.equal(b.architecturalIdentity.liveWeather,false);
});
test('Center dry stone tack-sorting plinth is genuinely raised on nine stone-founded original y1 cells, not a live stable automation',()=>{
 const b=buildRimeboundTwinArcCorralStable(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let n=0;
 for(let x=31;x<=33;x++)for(let z=72;z<=74;z++){
  n++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,1,z))?.rimeboundRealNineStoneDryTackPlinth,true);
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.ok(!walk.has(K(x,1,z)),'solid tack plinth falsely source walkable');
  assert.ok(!m.has(K(x,2,z)),'source above tack plinth obstructed');
 }
 assert.equal(n,9);
});
test('All 31 authentic source portals have original stone y0 and two-high clear y1/y2; outside-only 168-cell three-way crosswalk is connected',()=>{
 const b=buildRimeboundTwinArcCorralStable(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 assert.equal(b.portals.length,31);
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,y,z)),'portal y1 blocked '+p.at);
  assert.ok(!m.has(K(x,y+1,z)),'portal source y2 head obstructed '+p.at);
 }
 const q=[K(12,1,80)],seen=new Set(q);
 for(let i=0;i<q.length;i++){
  const [x,,z]=q[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const X=x+dx,Z=z+dz,k=K(X,1,Z);
   if(Z<79||Z>81||seen.has(k)||!walk.has(k))continue;
   seen.add(k);q.push(k);
  }
 }
 assert.ok(seen.has(K(50,1,80)),'outside source crossyard is disconnected');
 assert.equal(seen.size,168);
});
test('45 actual unresolved Pack4 candidate panes make nine complete original outward five-high source stone-framed bays',()=>{
 const b=buildRimeboundTwinArcCorralStable(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  panes=b.placements.filter(p=>p.role==='window'),
  dirs={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]},groups=new Map();
 assert.equal(panes.length,45);
 for(const p of panes){
  const [x,y,z]=p.at,d=dirs[p.orientation],k=x+','+z;
  assert.ok(d,'candidate glass has no outward facing');
  assert.equal(p.asset,'pack4:030');
  assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,7,z))?.role,'wall');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,7,z))?.asset,'live:stone');
  assert.ok(!m.has(K(x+d[0],y,z+d[1])),'glass facing original source obstruction');
  if(!groups.has(k))groups.set(k,new Set());
  groups.get(k).add(y);
 }
 assert.equal(groups.size,9);
 for(const ys of groups.values())assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4,5,6]);
});
test('Seven genuine earlier original stable constructors retain strict 0.85 D4 novelty in 56 eight-way comparisons; distinct original fingerprints',()=>{
 const b=buildRimeboundTwinArcCorralStable(),original=d4(b,false,0);
 let count=0,maxIoU=0,nearest=null;
 for(const fn of peers){
  const other=fn();
  assert.notEqual(other.id,b.id);
  assert.notEqual(structuralFingerprint(other),structuralFingerprint(b));
  for(const flip of [false,true])for(let t=0;t<4;t++){
   const v=iou(original,d4(other,flip,t));
   count++;
   if(v>maxIoU){maxIoU=v;nearest=other.id;}
   assert.ok(v<.85,'original near-duplicate stable '+other.id+' '+v);
  }
 }
 assert.equal(count,56);
 console.log('RIMEBOUND_GENUINE_7_ORIGINAL_STABLE_PEERS_56_D4_PASS '+JSON.stringify({count,maxIoU,nearest}));
});
