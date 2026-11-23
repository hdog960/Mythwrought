// MYTHWROUGHT Builder B Wave51 native Node22 focused original-source gates.
// Run once from a genuine full checkout; staging this file does NOT mean native
// Node was executed. No expensive full 228-original sweep per local wave.
// Pack3/Pack4 physical mesh/collider/selection, true beacon light, ships,
// water, elevated stairs, climate, settlements, saves and iPhone PWA unrun.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSuncairnThreeCrownBeaconRelay,SUNCAIRN_THREE_CROWN_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave51.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildFrostwakeCrownbridgeLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave8.mjs';
import {buildSaltreachTidalLanternStation} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave9.mjs';
import {buildSunscarOpenOculusLanternwatch} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave21.mjs';
import {buildBriarcliffCrescentWalkLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave30.mjs';
import {buildSunspireTwinCrownDesertLighthouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave36.mjs';
import {buildGraywakeDoubleReturnBeaconLodge} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave45.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const peers=[
 buildFrostwakeCrownbridgeLighthouse,buildSaltreachTidalLanternStation,
 buildSunscarOpenOculusLanternwatch,buildBriarcliffCrescentWalkLighthouse,
 buildSunspireTwinCrownDesertLighthouse,buildGraywakeDoubleReturnBeaconLodge
];
function d4(v,flip,turn){
 const set=new Set(),{width:w,height:h,depth:d}=v.footprint;
 for(const p of v.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),
   Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
  let x=A,z=Z;
  if(turn===1)[x,z]=[Z,15-A];
  if(turn===2)[x,z]=[15-A,15-Z];
  if(turn===3)[x,z]=[15-Z,A];
  set.add([x,Y,z,p.role].join('/'));
 }
 return set;
}
const iou=(a,b)=>{let n=0;for(const k of a)if(b.has(k))n++;return n/(a.size+b.size-n||1)};
test('Frozen source-only B115 lighthouse:desert:large:003 is not D92 or accepted228',()=>{
 const own=getBuilderBServiceOwnership(),b=buildSuncairnThreeCrownBeaconRelay();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(b.id,SUNCAIRN_THREE_CROWN_ID);
 assert.equal(b.id,'r1:lighthouse:desert:large:003');
 assert.ok(own.builderBIds.includes(b.id));
 assert.ok(!own.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['lighthouse','desert','large']);
 assert.equal(b.status,'candidate');
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.saveSchema1Written,false);
});
test('Actual original compiled authored cells are unique, 19 rooms and 27 reachable source-graph portals',()=>{
 const b=buildSuncairnThreeCrownBeaconRelay();
 assert.deepEqual(b.footprint,{width:80,height:40,depth:86});
 assert.equal(b.placements.length,19500);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,19500);
 assert.equal(b.walkable.length,4874);
 assert.equal(b.rooms.length,19);assert.equal(b.portals.length,27);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,51);
});
test('All 4,562 source Pack3 roof candidates are immediately solid backed, including real 11 distinct covered wing tags',()=>{
 const b=buildSuncairnThreeCrownBeaconRelay(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roofs=b.placements.filter(p=>p.role==='roof'),wings=new Map();
 assert.equal(roofs.length,4562);
 for(const p of roofs){
  const [x,y,z]=p.at;
  assert.match(p.asset,/^pack3:/);assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(['support','partition','wall'].includes(m.get(K(x,y-1,z))?.role),
   'unbacked actual original roof '+p.at);
  if(p.suncairnRealDifferentiatedRoofWing)
   wings.set(p.suncairnRealDifferentiatedRoofWing,
    (wings.get(p.suncairnRealDifferentiatedRoofWing)||0)+1);
 }
 assert.equal(wings.size,11);
 for(const [name,n] of wings)assert.ok(n>=70,'overlapped shadow roof wing '+name);
});
test('All eleven actual foundation-to-underroof source stone bearing columns have no missing tiers or later glass cuts',()=>{
 const b=buildSuncairnThreeCrownBeaconRelay(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  posts=b.placements.filter(p=>p.purpose?.startsWith('suncairn-ground-to-real-roof-stone-post-')),
  first=new Map();
 for(const p of posts){
  const n=p.purpose.slice('suncairn-ground-to-real-roof-stone-post-'.length);
  if(!first.has(n))first.set(n,p.at);
 }
 assert.equal(first.size,11);
 for(const [name,[x,,z]]of first){
  const roof=b.placements.find(p=>p.suncairnRealDifferentiatedRoofWing===name&&p.at[0]===x&&p.at[2]===z);
  assert.ok(roof,'false tower hall roof source '+name);
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  for(let y=1;y<roof.at[1];y++)
   assert.ok(['wall','support','partition'].includes(m.get(K(x,y,z))?.role),
    'source column cut by late portal, pane or object '+name+' '+K(x,y,z));
 }
});
test('Four founded open-sky interior courtyards have 396 truly clear floor-to-sky walkable source columns',()=>{
 const b=buildSuncairnThreeCrownBeaconRelay(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let n=0;
 for(const [x0,z0,x1,z1] of [[34,22,45,33],[14,43,22,51],[57,43,65,51],[35,53,44,61]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   n++;assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.ok(walk.has(K(x,1,z)),'not physically original walkable');
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!m.has(K(x,y,z)),'phantom open courtyard '+K(x,y,z));
  }
 assert.equal(n,396);
});
test('Three beacon towers are actually stone-founded solid 5x5 lower bodies with 300 original filled cells and no false walking',()=>{
 const b=buildSuncairnThreeCrownBeaconRelay(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 let n=0;
 for(const [name,cx,cz] of [['west-dry-crown',20,77],['center-dry-crown',40,77],['east-dry-crown',60,77]])
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   for(let y=1;y<=4;y++){
    n++;
    assert.equal(m.get(K(x,y,z))?.solidFullLowerMasonryBeacon,name,
     'false lower stone tower tier '+K(x,y,z));
   }
   assert.ok(!walk.has(K(x,1,z)),'false walk through solid masonry');
  }
 assert.equal(n,300);
});
test('Three original towers have 1,056 continuous high stone perimeter blocks and exactly 48 directly backed candidate Pack3 crown cells',()=>{
 const b=buildSuncairnThreeCrownBeaconRelay(),m=new Map(b.placements.map(p=>[p.at.join(','),p]));
 let rings=0,caps=0,centerVacuum=0;
 for(const [name,cx,cz] of [['west-dry-crown',20,77],['center-dry-crown',40,77],['east-dry-crown',60,77]])
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
   const boundary=x===cx-2||x===cx+2||z===cz-2||z===cz+2;
   for(let y=5;y<=26;y++){
    if(boundary){rings++;assert.equal(m.get(K(x,y,z))?.originalContinuousHighStoneBeaconRing,name);}
    else{centerVacuum++;assert.ok(!m.has(K(x,y,z)),'false navigable filled tower interior '+K(x,y,z));}
   }
   if(boundary){
    caps++;
    const p=m.get(K(x,27,z));
    assert.equal(p?.immediatelyStoneBackedUnlitBeaconCrown,name);
    assert.equal(p?.asset,'pack3:025');
    assert.equal(p?.occupancy.kind,'unresolved');
    assert.equal(m.get(K(x,26,z))?.asset,'live:stone');
   }
  }
 assert.deepEqual([rings,caps,centerVacuum],[1056,48,594]);
 assert.equal(b.architecturalIdentity.actualTowerUpperStairs,false);
 assert.equal(b.architecturalIdentity.workingBeaconLighting,false);
});
test('Every one of 27 original graph portals remains actually founded with a true two-high y1 head-clear opening',()=>{
 const b=buildSuncairnThreeCrownBeaconRelay(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(',')));
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
  assert.ok(walk.has(K(x,y,z)),'portal lacks physical clear y1 body');
  assert.ok(!m.has(K(x,y+1,z)),'portal cut into upper blocker');
 }
 assert.ok(b.portals.some(p=>p.at[0]===36&&p.at[2]===75),
  'center tower doorway incorrectly reinserted into the real tower foundation');
 assert.ok(!b.portals.some(p=>p.at[0]===40&&p.at[2]===75),
  'old physically damaging tower door reappeared');
 assert.ok(!b.portals.some(p=>p.at[0]===46&&p.at[2]===65),
  'old roof-post-breaking door reappeared');
});
test('Stone exterior crosswalk connects all three arms by outdoor-only four-neighbor movement beyond z81',()=>{
 const b=buildSuncairnThreeCrownBeaconRelay(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(','))),
  start=K(20,1,83),goal=K(60,1,83),queue=[start],seen=new Set(queue);
 for(let i=0;i<queue.length;i++){
  const [x,,z]=queue[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const X=x+dx,Z=z+dz,k=K(X,1,Z);
   if(Z<81||seen.has(k)||!walk.has(k))continue;
   seen.add(k);queue.push(k);
  }
 }
 assert.ok(seen.has(goal),'outside-only triple beacon route is disconnected');
 assert.ok(seen.size>=170);
 for(const x of [20,40,60]){
  assert.equal(m.get(K(x,0,83))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,83)));
 }
});
test('Original 84 unresolved Pack4 panes comprise exactly 21 outward-facing four-high stone-framed glass bays',()=>{
 const b=buildSuncairnThreeCrownBeaconRelay(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  glass=b.placements.filter(p=>p.role==='window'),faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]},groups=new Map();
 assert.equal(glass.length,84);
 for(const p of glass){
  const [x,y,z]=p.at,[dx,dz]=faces[p.orientation],k=x+','+z;
  assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,6,z))?.role,'wall');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,6,z))?.asset,'live:stone');
  assert.ok(!m.has(K(x+dx,y,z+dz)),'window looks at source solid wall');
  if(!groups.has(k))groups.set(k,new Set());
  groups.get(k).add(y);
 }
 assert.equal(groups.size,21);
 for(const ys of groups.values())assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4,5]);
});
test('STRICT unchanged source originality: 48 D4 comparisons across six real original same-category lighthouse constructors <0.85',()=>{
 const b=buildSuncairnThreeCrownBeaconRelay(),source=d4(b,false,0);
 let count=0,maxIoU=0,nearest=null;
 for(const fn of peers){
  const peer=fn();
  assert.notEqual(peer.id,b.id);
  assert.notEqual(structuralFingerprint(peer),structuralFingerprint(b));
  for(const flipped of [false,true])for(let orientation=0;orientation<4;orientation++){
   const v=iou(source,d4(peer,flipped,orientation));
   count++;if(v>maxIoU){maxIoU=v;nearest=peer.id;}
   assert.ok(v<.85,'genuine lighthouse near-clone '+peer.id+' '+v);
  }
 }
 assert.equal(count,48);
 console.log('SUNCAIRN_REAL_48_D4_PASS '+JSON.stringify({count,maxIoU,nearest}));
});
