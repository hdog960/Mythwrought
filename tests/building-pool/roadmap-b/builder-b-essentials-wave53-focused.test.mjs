// MYTHWROUGHT Builder B Wave53 — original-source focused native Node22 cases.
// Staged for actual original full checkout; isolated V8 source verification
// does NOT mean original native Node or PWA acceptance. Run targeted first.
// Original 228 historical D4 sweep must be coordinated, not repeated per wave.
// NO live water, beacon lights, ships, Pack3/4 physical collider/selection,
// trade/economy, generated settlements, live saves or iPhone acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMirageglassTripleTideRegistry,MIRAGEGLASS_TRIPLE_LEDGER_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave53.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildTidehollowCrosswharfHarborOffice} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave6.mjs';
import {buildGlassduneSplitQuayRegistry} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave14.mjs';
import {buildIcehavenBifurcatedSnowCustoms} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave15.mjs';
import {buildSaffronwindDoubleTowerHarborRegistry} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave27.mjs';
import {buildAlderquaySplitPierHarborOffice} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave32.mjs';
import {buildSaltglassTernForkCustomsHouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave41.mjs';
import {buildHearthquayThreeFingerRegistry} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave47.mjs';
const K=(x,y,z)=>[x,y,z].join(',');
const peers=[
 buildTidehollowCrosswharfHarborOffice,buildGlassduneSplitQuayRegistry,
 buildIcehavenBifurcatedSnowCustoms,buildSaffronwindDoubleTowerHarborRegistry,
 buildAlderquaySplitPierHarborOffice,buildSaltglassTernForkCustomsHouse,
 buildHearthquayThreeFingerRegistry
];
const towers=[
 ['west-unlit-tide-register',19,83],
 ['central-unlit-tide-register',42,83],
 ['east-unlit-tide-register',67,83]
];
const dais=[
 ['west-stone-manifest-plinth',20,26],
 ['center-stone-manifest-plinth',41,45],
 ['east-stone-manifest-plinth',65,26]
];
function d4(v,flip,t){
 const o=new Set(),{width:w,height:h,depth:d}=v.footprint;
 for(const p of v.placements){
  const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d);
  const A=flip?15-X:X;let x=A,z=Z;
  if(t===1)[x,z]=[Z,15-A];
  if(t===2)[x,z]=[15-A,15-Z];
  if(t===3)[x,z]=[15-Z,A];
  o.add([x,Y,z,p.role].join('/'));
 }
 return o;
}
function iou(a,b){let n=0;for(const x of a)if(b.has(x))n++;return n/(a.size+b.size-n||1)}
test('Frozen B115-exclusive r1:harbor-office:desert:large:004, not D92 or accepted228, candidate-only lifecycle',()=>{
 const own=getBuilderBServiceOwnership(),b=buildMirageglassTripleTideRegistry();
 assert.deepEqual([own.existing,own.forBuilderB,own.forBuilderD],[228,115,92]);
 assert.equal(b.id,MIRAGEGLASS_TRIPLE_LEDGER_ID);
 assert.equal(b.id,'r1:harbor-office:desert:large:004');
 assert.ok(own.builderBIds.includes(b.id));
 assert.ok(!own.builderDAvailableIds.includes(b.id));
 assert.deepEqual([b.category,b.biome,b.size],['harbor-office','desert','large']);
 assert.equal(b.status,'candidate');
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.productionRegistered,false);
 assert.equal(b.architecturalIdentity.saveSchema1Written,false);
});
test('Real original source compiler validates 21,161 individually unique placements, 6,136 connected walks, 19 rooms, 27 portals',()=>{
 const b=buildMirageglassTripleTideRegistry();
 assert.deepEqual(b.footprint,{width:84,height:39,depth:96});
 assert.equal(b.placements.length,21161);
 assert.equal(new Set(b.placements.map(p=>p.at.join(','))).size,21161);
 assert.equal(b.walkable.length,6136);
 assert.equal(b.rooms.length,19);
 assert.equal(b.portals.length,27);
 assert.equal(b.architecturalIdentity.originalBuilderBWave,53);
});
test('Original 4,923 candidate Pack3 roof cells are each backed by actual solid source; 11 different roof wings occupy real cells',()=>{
 const b=buildMirageglassTripleTideRegistry(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  roof=b.placements.filter(p=>p.role==='roof'),wings=new Map();
 assert.equal(roof.length,4923);
 for(const p of roof){
  const [x,y,z]=p.at;
  assert.match(p.asset,/^pack3:/);assert.equal(p.occupancy.kind,'unresolved');
  assert.ok(['wall','partition','support'].includes(m.get(K(x,y-1,z))?.role),
   'false immediately backed Pack3 cell '+p.at);
  if(p.mirageglassActuallyDistinctRoofWing)
   wings.set(p.mirageglassActuallyDistinctRoofWing,(wings.get(p.mirageglassActuallyDistinctRoofWing)||0)+1);
 }
 assert.equal(wings.size,11);
 for(const [name,count] of wings)assert.ok(count>=100,'entirely overlapped roof wing '+name);
});
test('All eleven physical original stone bearing columns remain solid from grounded y0 to real roof after doorways, glass and partitions',()=>{
 const b=buildMirageglassTripleTideRegistry(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  posts=b.placements.filter(p=>p.purpose?.startsWith('mirageglass-actual-ground-roof-bearing-')),
  first=new Map();
 for(const p of posts){
  const name=p.purpose.slice('mirageglass-actual-ground-roof-bearing-'.length);
  if(!first.has(name))first.set(name,p.at);
 }
 assert.equal(first.size,11);
 for(const [name,[x,,z]] of first){
  const roof=b.placements.find(p=>p.mirageglassActuallyDistinctRoofWing===name&&p.at[0]===x&&p.at[2]===z);
  assert.ok(roof,'no actual original roof above bearing column '+name);
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
  for(let y=1;y<roof.at[1];y++)
   assert.ok(['wall','partition','support'].includes(m.get(K(x,y,z))?.role),
    'gapped original bearing post '+name+' '+K(x,y,z));
 }
});
test('Four genuinely founded, sky-exposed courts have 434 walkable y1 columns and no source solids all the way to original sky top',()=>{
 const b=buildMirageglassTripleTideRegistry(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 let total=0;
 for(const [x0,z0,x1,z1] of [[35,22,46,33],[14,44,22,53],[61,44,69,53],[36,55,46,64]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   total++;
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.ok(walks.has(K(x,1,z)),'court floor not y1 walkable '+K(x,1,z));
   for(let y=1;y<b.footprint.height;y++)
    assert.ok(!m.has(K(x,y,z)),'open court is not physically sky clear '+K(x,y,z));
  }
 assert.equal(total,434);
});
test('Three 5x5 tower bases really contain all 300 original solid stone y1..4 cells, not passable ghost corridors',()=>{
 const b=buildMirageglassTripleTideRegistry(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 let count=0;
 for(const [name,cx,cz] of towers)
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   assert.ok(!walks.has(K(x,1,z)),'phantom y1 walking through fully solid tower');
   for(let y=1;y<=4;y++){
    count++;
    assert.equal(m.get(K(x,y,z))?.fullSolidOriginalLowerDryTideMarker,name);
   }
  }
 assert.equal(count,300);
});
test('True full 912-cell contiguous masonry high rings surround open stone tower cores with exactly 48 stone-backed unresolved Pack3 crowns',()=>{
 const b=buildMirageglassTripleTideRegistry(),m=new Map(b.placements.map(p=>[p.at.join(','),p]));
 let rings=0,capCells=0,openCoreCells=0;
 for(const [name,cx,cz] of towers)
  for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++){
   const boundary=x===cx-2||x===cx+2||z===cz-2||z===cz+2;
   for(let y=5;y<=23;y++){
    if(boundary){
     rings++;
     assert.equal(m.get(K(x,y,z))?.continuousTrueMirageglassStoneTowerRing,name);
    }else{
     openCoreCells++;
     assert.ok(!m.has(K(x,y,z)),'upper hollow tower has false solid core '+K(x,y,z));
    }
   }
   if(boundary){
    capCells++;
    const p=m.get(K(x,24,z));
    assert.equal(p?.directlyBackedUnpoweredPack3Crown,name);
    assert.equal(p?.asset,'pack3:025');
    assert.equal(p?.occupancy.kind,'unresolved');
    assert.equal(m.get(K(x,23,z))?.asset,'live:stone');
   }
  }
 assert.deepEqual([rings,capCells,openCoreCells],[912,48,513]);
 assert.equal(b.architecturalIdentity.workingBeaconLighting,false);
 assert.equal(b.architecturalIdentity.workingStairsToTowerTop,false);
});
test('Three separate real original 3x3 stone manifest platforms have all 27 raised y1 solids on stone foundations, not functioning trade counters',()=>{
 const b=buildMirageglassTripleTideRegistry(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 let count=0;
 for(const [name,cx,cz] of dais)
  for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
   count++;
   assert.equal(m.get(K(x,0,z))?.asset,'live:stone');
   const p=m.get(K(x,1,z));
   assert.equal(p?.asset,'live:stone');
   assert.equal(p?.genuineOriginalRaisedManifestDais,name);
   assert.ok(!walks.has(K(x,1,z)),'stone dais is phantom passable floor');
  }
 assert.equal(count,27);
 assert.equal(b.architecturalIdentity.realInventoryTrading,false);
 assert.equal(b.architecturalIdentity.realSeaOrWater,false);
});
test('All twenty-seven original room and outdoor portals have actual stone y0 and source-clear y1/y2 body and head, never inside tower footings',()=>{
 const b=buildMirageglassTripleTideRegistry(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walks=new Set(b.walkable.map(p=>p.join(',')));
 for(const p of b.portals){
  const [x,y,z]=p.at;
  assert.equal(m.get(K(x,0,z))?.role,'foundation');
  assert.ok(walks.has(K(x,y,z)),'nonwalkable portal '+K(x,y,z));
  assert.ok(!m.has(K(x,y+1,z)),'portal re-blocked headroom '+K(x,y+1,z));
  for(const [,cx,cz] of towers)
   assert.ok(Math.abs(x-cx)>2||Math.abs(z-cz)>2,'portal physically cuts true solid tower '+p.at);
 }
 assert.equal(b.portals.length,27);
});
test('Three dry outdoor crosswharf arms cardinally connect by wholly exterior 340-cell source walk without indoor roof shortcuts',()=>{
 const b=buildMirageglassTripleTideRegistry(),
  m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  walk=new Set(b.walkable.map(p=>p.join(','))),
  start=K(20,1,92),goal=K(66,1,92),q=[start],seen=new Set(q);
 for(let i=0;i<q.length;i++){
  const [x,,z]=q[i].split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const Z=z+dz,k=K(x+dx,1,Z);
   if(Z<90||seen.has(k)||!walk.has(k))continue;
   seen.add(k);q.push(k);
  }
 }
 assert.ok(seen.has(goal),'outside three-arm crosswharf disconnected');
 assert.equal(seen.size,340);
 for(const x of [20,42,66]){
  assert.equal(m.get(K(x,0,92))?.asset,'live:stone');
  assert.ok(walk.has(K(x,1,92)));
 }
});
test('Eighty-eight upright candidate Pack4 panes form 22 complete outward four-high true original stone-framed bays',()=>{
 const b=buildMirageglassTripleTideRegistry(),m=new Map(b.placements.map(p=>[p.at.join(','),p])),
  glass=b.placements.filter(p=>p.role==='window'),faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]},groups=new Map();
 assert.equal(glass.length,88);
 for(const p of glass){
  const [x,y,z]=p.at,[dx,dz]=faces[p.orientation],k=x+','+z;
  assert.equal(p.asset,'pack4:030');
  assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,6,z))?.asset,'live:stone');
  assert.equal(m.get(K(x,1,z))?.role,'wall');
  assert.equal(m.get(K(x,6,z))?.role,'wall');
  assert.ok(!m.has(K(x+dx,y,z+dz)),'candidate window faces a source blocker');
  if(!groups.has(k))groups.set(k,new Set());
  groups.get(k).add(y);
 }
 assert.equal(groups.size,22);
 for(const ys of groups.values())assert.deepEqual([...ys].sort((a,b)=>a-b),[2,3,4,5]);
});
test('Unchanged strict original-source D4 <0.85 novelty against seven actual earlier harbor offices, 56 orientations and no identical fingerprints',()=>{
 const b=buildMirageglassTripleTideRegistry(),src=d4(b,false,0);
 let comparisons=0,maxIoU=0,nearest=null;
 for(const fn of peers){
  const old=fn();
  assert.notEqual(old.id,b.id);
  assert.notEqual(structuralFingerprint(old),structuralFingerprint(b));
  for(const flipped of [false,true])for(let t=0;t<4;t++){
   const score=iou(src,d4(old,flipped,t));
   if(score>maxIoU){maxIoU=score;nearest=old.id;}
   assert.ok(score<.85,'genuine earlier original harbor office near clone '+old.id+' '+score);
   comparisons++;
  }
 }
 assert.equal(comparisons,56);
 console.log('MIRAGEGLASS_7_ACTUAL_HARBOR_SOURCE_PEERS_56_D4_PASS '+JSON.stringify({comparisons,maxIoU,nearest}));
});
