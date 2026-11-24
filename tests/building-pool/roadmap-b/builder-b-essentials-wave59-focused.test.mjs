// MYTHWROUGHT Builder B Wave59 source-backed, NATIVE NODE22-ELIGIBLE focused tests.
// STAGED for genuine complete original checkout: the isolated JS V8
// executor is not Node ESM imports, full accepted228 D4 historical,
 // actual Pack3/4 renderer/collider, real M7 player or iPhone PWA.
// Preserve immutable original B115 ownership and strict D4 reject >=0.85.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildRimeglassTwinBeaconObservatory,RIMEGLASS_TWIN_BEACON_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave59.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildFrostwakeCrownbridgeLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave8.mjs';
import {buildSaltreachTidalLanternStation} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave9.mjs';
import {buildSunscarOpenOculusLanternwatch} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave21.mjs';
import {buildBriarcliffCrescentWalkLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave30.mjs';
import {buildSunspireTwinCrownDesertLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave36.mjs';
import {buildGraywakeDoubleReturnBeaconLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave45.mjs';
import {buildSuncairnThreeCrownBeaconRelay} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave51.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const beacons=[
 ['west-high-solid-rime-beacon',11,68,7,28],
 ['east-low-solid-snow-beacon',50,68,5,22]
];
const peers=[
 buildFrostwakeCrownbridgeLighthouse,buildSaltreachTidalLanternStation,
 buildSunscarOpenOculusLanternwatch,buildBriarcliffCrescentWalkLighthouse,
 buildSunspireTwinCrownDesertLighthouse,buildGraywakeDoubleReturnBeaconLodge,
 buildSuncairnThreeCrownBeaconRelay
];
function d4(v,flip,t){
 const cells=new Set(),{width:w,height:h,depth:d}=v.footprint;
 for(const p of v.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),
   Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(t===1)[x,z]=[Z,15-A];
  if(t===2)[x,z]=[15-A,15-Z];
  if(t===3)[x,z]=[15-Z,A];
  cells.add([x,Y,z,p.role].join('/'));
 }
 return cells;
}
const iou=(a,b)=>{let overlap=0;for(const k of a)if(b.has(k))overlap++;return overlap/(a.size+b.size-overlap||1)};
test('Frozen B115-only snow small lighthouse #003, no D92 or accepted228 and no live runtime/settlement placement',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),o=getBuilderBServiceOwnership();
 assert.deepEqual([o.existing,o.forBuilderB,o.forBuilderD],[228,115,92]);
 assert.equal(b.id,RIMEGLASS_TWIN_BEACON_ID);
 assert.equal(b.id,'r1:lighthouse:snow:small:003');
 assert.ok(o.builderBIds.includes(b.id));
 assert.ok(!o.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['lighthouse','snow','small']);
 assert.equal(b.status,'candidate');assert.equal(b.worldPlacement,false);
 assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.schema1SaveWritten,false);
});
test('Authentic original schema accepts 18569 actual unique voxel cells, 5285 connected walks, 19 reachable rooms and 27 portals',()=>{
 const b=buildRimeglassTwinBeaconObservatory();
 assert.deepEqual(b.footprint,{width:70,height:42,depth:94});
 assert.equal(b.placements.length,18569);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,18569);
 assert.equal(b.walkable.length,5285);
 assert.equal(b.rooms.length,19);assert.equal(b.portals.length,27);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,59);
});
test('All 5940 original stone yard coordinates are physically founded with source live:stone at y0',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p]));
 let cells=0;
 for(let x=2;x<=67;x++)for(let z=2;z<=91;z++){
  cells++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
 }
 assert.equal(cells,5940);
});
test('3407 real unresolved Pack3 roof/crown cells have authored immediate solid support, including 3367 covered in 11 independently occupied wings',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roofs=b.placements.filter(p=>p.role==='roof'),wings=new Map();
 let crowns=0,covered=0;
 assert.equal(roofs.length,3407);
 for(const p of roofs){
  const [x,y,z]=p.at;
  assert.match(p.asset,/^pack3:/);assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(['wall','support','partition'].includes(m.get(K(x,y-1,z))?.role),
   'unbacked original source Pack3 candidate '+p.at);
  if(p.rimeglassTrueMasonryBackedTopCrown)crowns++;
  else{
   const n=p.rimeglassActualCoveredWing;assert.ok(n,'unattributed covered roof source');
   wings.set(n,(wings.get(n)||0)+1);covered++;
  }
 }
 assert.deepEqual([covered,crowns,wings.size],[3367,40,11]);
 for(const [n,count] of wings)assert.ok(count>=60,'real roof region overlapped '+n);
});
test('Eleven distinct original roof columns are solid from actual y0 foundation to original roof underside after late door/window cuts',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  posts=b.placements.filter(p=>p.purpose?.startsWith('rimeglass-grounded-original-hall-post-')),
  first=new Map();
 for(const p of posts){
  const n=p.purpose.slice('rimeglass-grounded-original-hall-post-'.length);
  if(!first.has(n))first.set(n,p.at);
 }
 assert.equal(first.size,11);
 for(const [n,[x,,z]] of first){
  const top=b.placements.find(p=>p.rimeglassActualCoveredWing===n&&p.at[0]===x&&p.at[2]===z)?.at[1];
  assert.ok(Number.isInteger(top),'missing actual roof over hall column '+n);
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  for(let y=1;y<top;y++)
   assert.ok(['wall','support','partition'].includes(m.get(K(x,y,z))?.role),
    'original stone load bearing post cut '+n+' '+K(x,y,z));
 }
});
test('Four real stone-founded full-height open-sky courts total 334 clear and y1-walkable original columns',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let n=0;
 for(const [x0,z0,x1,z1] of [
  [30,22,39,32],[15,36,22,44],[48,36,55,44],[30,49,39,56]
 ])for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  n++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,z)),'sky court not walkable '+K(x,1,z));
  for(let y=1;y<b.footprint.height;y++)
   assert.ok(!m.has(K(x,y,z)),'source sky court truly blocked '+K(x,y,z));
 }
 assert.equal(n,334);
});
test('Two distinct 7x7 and 5x5 masonry beacon towers have 296 truly solid original y1..4 lower-tier cells with zero phantom walking',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let total=0;
 for(const [name,cx,cz,span] of beacons){
  const R=(span-1)/2;
  for(let x=cx-R;x<=cx+R;x++)for(let z=cz-R;z<=cz+R;z++){
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.ok(!walk.has(K(x,1,z)),'solid tower base falsely walkable');
   for(let y=1;y<=4;y++){
    total++;assert.equal(m.get(K(x,y,z))?.rimeglassRealFourTierSolidTowerBase,name);
    assert.equal(m.get(K(x,y,z))?.asset,'live:stone');
   }
  }
 }
 assert.equal(total,296);
});
test('Two distinct unequal towers have 864 continuous actual stone upper-ring cells and 762 genuinely empty upper interior shaft cells, no false stairs',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p]));
 let ring=0,empty=0;
 for(const [name,cx,cz,span,top] of beacons){
  const R=(span-1)/2;
  for(let x=cx-R;x<=cx+R;x++)for(let z=cz-R;z<=cz+R;z++){
   const edge=x===cx-R||x===cx+R||z===cz-R||z===cz+R;
   for(let y=5;y<=top;y++){
    if(edge){
     ring++;assert.equal(m.get(K(x,y,z))?.rimeglassRealFullHeightContinuousTowerRing,name);
     assert.equal(m.get(K(x,y,z))?.asset,'live:stone');
    }else{empty++;assert.ok(!m.has(K(x,y,z)),'supposed hollow upper tower physically filled');}
   }
  }
 }
 assert.deepEqual([ring,empty],[864,762]);
 assert.equal(b.architecturalIdentity.upperTowerAccess,false);
});
test('40 actual unresolved Pack3 crown candidates sit immediately on 40 original full stone tower perimeter tops',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p]));
 let count=0;
 for(const [name,cx,cz,span,top] of beacons){
  const R=(span-1)/2;
  for(let x=cx-R;x<=cx+R;x++)for(let z=cz-R;z<=cz+R;z++){
   if(!(x===cx-R||x===cx+R||z===cz-R||z===cz+R))continue;
   const p=m.get(K(x,top+1,z)),below=m.get(K(x,top,z));
   count++;assert.equal(p?.rimeglassTrueMasonryBackedTopCrown,name);
   assert.equal(p?.role,'roof');assert.equal(p?.occupancy.kind,'unresolved');
   assert.equal(below?.rimeglassRealFullHeightContinuousTowerRing,name);
   assert.equal(below?.asset,'live:stone');
  }
 }
 assert.equal(count,40);
 assert.equal(b.architecturalIdentity.activeBeaconLight,false);
});
test('Three genuine 3x3x3 solid snow wind markers have 81 original masonry cells and no phantom y1 walk',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let n=0;
 for(const [name,cx,cz] of [
  ['western-stone-ice-marker',28,70],['central-stone-ice-marker',35,70],['eastern-stone-ice-marker',42,70]
 ])for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(!walk.has(K(x,1,z)),'solid marker phantom walk');
  for(let y=1;y<=3;y++){
   n++;assert.equal(m.get(K(x,y,z))?.rimeglassRealSolidSnowWindMarker,name);
   assert.equal(m.get(K(x,y,z))?.asset,'live:stone');
  }
 }
 assert.equal(n,81);
});
test('Two stone-founded raised dry 5x5 signal-tablet monuments contain 50 genuine solid y1 cells, with actual empty y2 headspace',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let n=0;
 for(const [name,cx,cz] of [['west-dry-signal-tablet',30,79],['east-dry-signal-tablet',42,79]])
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
   n++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.equal(m.get(K(x,1,z))?.rimeglassRealRaisedStoneDrySignaltablet,name);
   assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
   assert.ok(!walk.has(K(x,1,z)),'stone tablet falsely walkable');
   assert.ok(!m.has(K(x,2,z)),'stone tablet head not open');
  }
 assert.equal(n,50);
});
test('All 27 named source passages remain stone-founded, y1 walkable and clear at y2 after tower, crown and window authoring',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 assert.equal(b.portals.length,27);
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  assert.ok(walk.has(K(x,y,z)),'actual source passage not walkable '+p.at);
  assert.ok(!m.has(K(x,y+1,z)),'actual source passage lacks headroom '+p.at);
 }
});
test('Fully source-unroofed southern base path connects west and east across 528 real y1/y2 clear cardinal cells',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(','))),
  start=K(7,1,86),end=K(63,1,86),q=[start],seen=new Set(q);
 for(let i=0;i<q.length;i++){
  const [x,,z]=q[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const X=x+dx,Z=z+dz,k=K(X,1,Z);
   if(X<2||X>67||Z<84||Z>91||seen.has(k)||!walk.has(k)||m.has(K(X,2,Z)))continue;
   seen.add(k);q.push(k);
  }
 }
 assert.ok(seen.has(end),'real outside walking west/east disconnected');
 assert.equal(seen.size,528);
});
test('Authentic grounded source path goes around both physically solid beacon towers via 1761 real two-high-clear cardinal floor cells',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(','))),
  start=K(7,1,68),end=K(56,1,68),q=[start],seen=new Set(q);
 for(let i=0;i<q.length;i++){
  const [x,,z]=q[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const X=x+dx,Z=z+dz,k=K(X,1,Z);
   if(X<2||X>67||Z<62||Z>91||seen.has(k)||!walk.has(k)||m.has(K(X,2,Z)))continue;
   seen.add(k);q.push(k);
  }
 }
 assert.ok(seen.has(end),'solid beacons cut off the exterior observation route');
 assert.equal(seen.size,1761);
});
test('350 unresolved original Pack4 candidate panes form 70 complete five-high air-facing y1/y7 solid stone-framed windows',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  panes=b.placements.filter(p=>p.role==='window'),
  dirs={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]},frames=new Map();
 assert.equal(panes.length,350);
 for(const p of panes){
  const [x,y,z]=p.at,d=dirs[p.orientation],key=x+','+z;
  assert.ok(d,'source pane missing orientation');assert.equal(p.asset,'pack4:030');
  assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,7,z))?.role,'wall');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,7,z))?.asset,'live:stone');
  assert.ok(!m.has(K(x+d[0],y,z+d[1])),'glass faces a real source solid');
  if(!frames.has(key))frames.set(key,new Set());
  frames.get(key).add(y);
 }
 assert.equal(frames.size,70);
 for(const ys of frames.values())assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4,5,6]);
});
test('Seven genuine previously authored original lighthouse constructors pass 56 unchanged strict D4 comparisons, no matching fingerprints',()=>{
 const b=buildRimeglassTwinBeaconObservatory(),original=d4(b,false,0);
 let count=0,maxIoU=0,nearest=null;
 for(const ctor of peers){
  const old=ctor();
  assert.notEqual(old.id,b.id);
  assert.notEqual(structuralFingerprint(old),structuralFingerprint(b));
  for(const mirrored of [false,true])for(let t=0;t<4;t++){
   const value=iou(original,d4(old,mirrored,t));
   count++;if(value>maxIoU){maxIoU=value;nearest=old.id}
   assert.ok(value<0.85,'source original near-duplicate '+old.id+' '+value);
  }
 }
 assert.equal(count,56);
 console.log('RIMEGLASS_GENUINE_7_LIGHTHOUSE_PEERS_56_D4_PASS '+JSON.stringify({count,maxIoU,nearest}));
});
