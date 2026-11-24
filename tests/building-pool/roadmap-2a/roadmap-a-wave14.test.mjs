import test from 'node:test';
import assert from 'node:assert/strict';
import {plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,assertDistinctArchitecture,structuralFingerprint}
 from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {buildRoadmapA279ProvisionalSettlementManifest}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-a5-279-provisional.mjs';
import {ROADMAP_A_WAVE01_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave01.mjs';
import {ROADMAP_A_WAVE02_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave02.mjs';
import {ROADMAP_A_WAVE03_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave03.mjs';
import {ROADMAP_A_WAVE04_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave04.mjs';
import {ROADMAP_A_WAVE05_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave05.mjs';
import {ROADMAP_A_WAVE06_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave06.mjs';
import {ROADMAP_A_WAVE07_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave07.mjs';
import {ROADMAP_A_WAVE08_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave08.mjs';
import {ROADMAP_A_WAVE09_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave09.mjs';
import {ROADMAP_A_WAVE10_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave10.mjs';
import {ROADMAP_A_WAVE11_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave11.mjs';
import {ROADMAP_A_WAVE12_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave12.mjs';
import {ROADMAP_A_WAVE13_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave13.mjs';
import {ROADMAP_A_WAVE14_SHOPS,ROADMAP_A_WAVE14_SPECS,ROADMAP_A_WAVE14_IDS}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-wave14.mjs';

const old=[...ROADMAP_A_WAVE01_SHOPS,...ROADMAP_A_WAVE02_SHOPS,
 ...ROADMAP_A_WAVE03_SHOPS,...ROADMAP_A_WAVE04_SHOPS,...ROADMAP_A_WAVE05_SHOPS,
 ...ROADMAP_A_WAVE06_SHOPS,...ROADMAP_A_WAVE07_SHOPS,...ROADMAP_A_WAVE08_SHOPS,...ROADMAP_A_WAVE09_SHOPS,...ROADMAP_A_WAVE10_SHOPS,...ROADMAP_A_WAVE11_SHOPS,...ROADMAP_A_WAVE12_SHOPS,...ROADMAP_A_WAVE13_SHOPS];
const now=ROADMAP_A_WAVE14_SHOPS;
const key=(x,z)=>x+','+z;
function floorReach(bp){
 const occupied=new Map(bp.voxels.filter(v=>v.y===2).map(v=>[key(v.x,v.z),v]));
 const floor=new Set(bp.voxels.filter(v=>v.y===1&&v.kind==='floor').map(v=>key(v.x,v.z)));
 const start=bp.openings.find(o=>o.type==='entrance');
 assert.ok(start,'missing true front source doorway');
 const origin=[start.x,start.z];assert.ok(floor.has(key(...origin)));
 const q=[origin],seen=new Set([key(...origin)]);
 while(q.length){
  const [x,z]=q.shift();
  for(const [dx,dz] of [[0,1],[0,-1],[1,0],[-1,0]]){
   const a=x+dx,b=z+dz,k=key(a,b);
   if(!floor.has(k)||occupied.has(k)||seen.has(k))continue;
   seen.add(k);q.push([a,b]);
  }
 }
 return {seen,floor,occupied};
}
function rotations(bp){
 const raw=bp.voxels.filter(v=>v.kind==='foundation'&&v.y===0).map(v=>[v.x,v.z]);
 return Array.from({length:8},(_,i)=>{
  const pts=raw.map(([xx,zz])=>{
   let x=i>=4?-xx:xx,z=zz;
   for(let r=0;r<i%4;r++)[x,z]=[-z,x];
   return [x,z];
  }),minX=Math.min(...pts.map(p=>p[0])),minZ=Math.min(...pts.map(p=>p[1]));
  return new Set(pts.map(([x,z])=>key(x-minX,z-minZ)));
 });
}
function bestD4(a,b){
 let best=0;
 for(const x of a)for(const y of b){
  let n=0,small=x.size<=y.size?x:y,large=x.size<=y.size?y:x;
  for(const cell of small)if(large.has(cell))n++;
  best=Math.max(best,n/(x.size+y.size-n));
 }
 return best;
}
test('Wave14 12 original new source-only blueprints use canonical 279-yet-unwritten IDs across all six categories',{timeout:240000},()=>{
 assert.equal(old.length,151);assert.equal(now.length,12);assert.equal(ROADMAP_A_WAVE14_IDS.length,12);
 const prior=buildRoadmapA279ProvisionalSettlementManifest();
 assert.equal(prior.blueprints.length,279);assert.equal(prior.remainingCanonicalIDs.length,141);
 const missing=new Set(prior.remainingCanonicalIDs);
 const registry=new Map(plannedSlots().map(s=>[s.id,s]));
 const oldIds=new Set(prior.blueprints.map(x=>x.id));
 assert.equal(new Set(now.map(b=>b.id)).size,12);
 // Preserve both repaired historical identities and exhaust only the final registered bank.
 assert.ok(oldIds.has('r2:general-store:snow:large:01'));
 assert.ok(oldIds.has('r2:general-store:mountain:large:03'));
 assert.deepEqual(prior.remainingCanonicalIDs.filter(id=>id.startsWith('r2:bank:')),['r2:bank:mountain:small:02']);
 assert.deepEqual(now.filter(b=>b.category==='bank').map(b=>b.id),['r2:bank:mountain:small:02']);
 for(const bp of now){
  assert.ok(missing.has(bp.id),'canonical prior 279 already claimed '+bp.id);
  assert.ok(!oldIds.has(bp.id),'previous source changed '+bp.id);
  assert.equal(registry.get(bp.id)?.authoredHere,false,bp.id);
  assert.equal(bp.status,'authored-candidate');
  assert.equal(bp.isolated,true);
  assert.equal(bp.worldPlaced,false);assert.equal(bp.numericIdsAssigned,false);
  assert.equal(validateBlueprint(bp).valid,true,bp.id);
  assert.ok(bp.voxels.length>1000,bp.id);
  assert.equal(bp.rooms.length,4,bp.id);
  assert.equal(bp.openings.filter(x=>x.type==='entrance').length,2,bp.id);
  assert.ok(bp.openings.filter(x=>x.type==='window').length>=6,bp.id);
  assert.ok(bp.unresolvedDependencies.length>=3,bp.id);
  assert.ok(bp.voxels.some(v=>v.kind==='roof'&&v.architecturalRole!=='irregular-courtyard-weather-plate'),bp.id);
 }
 assert.deepEqual(Object.fromEntries(['general-store','pet-shop','magic-shop','potion-shop','bakery','bank']
   .map(c=>[c,now.filter(bp=>bp.category===c).length])),
  { 'general-store':2,'pet-shop':2,'magic-shop':2,'potion-shop':2,bakery:3,bank:1});
 assert.equal(new Set([...old.map(b=>b.id),...now.map(b=>b.id)]).size,163);
});
test('Wave14 physical source paths are continuous from open front doors to all four functional rooms and fixtures',{timeout:240000},()=>{
 for(const bp of now){
  const {seen,floor,occupied}=floorReach(bp);
  assert.ok(seen.size>=30,bp.id+' walkable floor too small');
  for(const room of bp.rooms){
   const [x,z]=room.access;
   assert.ok(floor.has(key(x,z)),bp.id+' room missing source floor '+key(x,z));
   assert.ok(!occupied.has(key(x,z)),bp.id+' room blocked by source voxel '+key(x,z));
   assert.ok(seen.has(key(x,z)),bp.id+' room cannot be reached from front '+key(x,z));
  }
  for(const v of bp.voxels.filter(v=>v.kind==='fixture'&&v.y===2)){
   assert.ok(floor.has(key(v.x,v.z)),bp.id+' fixture lacks support');
   assert.ok(seen.has(key(v.x+1,v.z))||seen.has(key(v.x-1,v.z))||
    seen.has(key(v.x,v.z+1))||seen.has(key(v.x,v.z-1)),
    bp.id+' source fixture cannot be approached');
  }
 }
});
test('Wave14 each original authored shell has sky-open court, four real source-region roof profiles and untouched symbolic dependencies',{timeout:240000},()=>{
 for(let i=0;i<now.length;i++){
  const bp=now[i],spec=ROADMAP_A_WAVE14_SPECS[i],floor=new Set(bp.voxels.filter(v=>v.y===1).map(v=>key(v.x,v.z)));
  assert.equal(bp.category,spec.category);assert.equal(bp.biome,spec.biome);
  assert.equal(bp.title,spec.name);
  assert.equal(bp.courtyardGeometry.length,spec.cuts.length);
  assert.equal(spec.roofs.length,4);
  assert.ok(spec.rects.length>=5);
  for(const [x0,x1,z0,z1] of spec.cuts)
   assert.ok(Array.from({length:(x1-x0+1)*(z1-z0+1)},(_,t)=>
    key(x0+t%(x1-x0+1),z0+Math.floor(t/(x1-x0+1))))
    .some(k=>!floor.has(k)),bp.id+' sky court not open');
  assert.ok(bp.unresolvedDependencies.every(x=>x.issue.includes('separate acceptance')));
  assert.ok(bp.roof.form.includes('multiple'));
  assert.equal(bp.numericIdsAssigned,false);
 }
});
test('Wave14 source strict D4 comparison to all 151 prior wave source plans and twelve own peers, same category <0.85',{timeout:240000},()=>{
 const all=[...old,...now],indexed=new Map(all.map(bp=>[bp.id,rotations(bp)]));
 const previousOriginal=new Set(old.map(x=>structuralFingerprint(x)));
 let max=0,count=0,maxPair=null;
 for(const bp of now){
  assert.ok(!previousOriginal.has(structuralFingerprint(bp)),bp.id+' original D4 duplicate');
  for(const peer of all)if(bp!==peer&&bp.category===peer.category){
   const score=bestD4(indexed.get(bp.id),indexed.get(peer.id));
   count++;
   if(score>max){max=score;maxPair=[bp.id,peer.id];}
   assert.ok(score<0.85,bp.id+' vs '+peer.id+' D4 '+score);
  }
 }
 assert.equal(assertDistinctArchitecture(now).distinctArchitectures,12);
 console.log('ROADMAP_A_WAVE14_D4_OLD151_AND_NEW12 '+JSON.stringify({
  comparedSameCategoryPairs:count,maxIoU:max,maxPair,threshold:.85,
  realHistorical128StrictD4NotExecutedHere:true,
  installedMeshesAndStructuralSupportNotCertified:true
 }));
});


test('Wave14 final original bank vault have genuine physically OPEN 2x3 internal passages and reachable source floor from front',{timeout:240000},()=>{
 const candidates=now.filter(bp=>bp.category==='bank');
 assert.equal(candidates.length,1);
 for(const bp of candidates){
  const spec=ROADMAP_A_WAVE14_SPECS.find(s=>s.name===bp.title);
  assert.ok(spec?.vault,'missing source-owned bank vault geometry '+bp.id);
  const [x0,x1,z0,z1,a,b]=spec.vault;
  assert.ok(x1>x0+4&&z1>z0+4,'bounded positive source vault volume '+bp.id);
  assert.equal(b,a+1,'two adjacent original internal vault entrances '+bp.id);
  const voxel=new Map(bp.voxels.map(v=>[v.x+','+v.y+','+v.z,v]));
  const {seen,floor,occupied}=floorReach(bp);
  // Stronger original-source regression: the entire authored vault footprint,
  // not just the two door columns, must stand on genuine y=1 source floor.
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   assert.ok(floor.has(key(x,z)),bp.id+' unsupported vault shell/interior floor '+key(x,z));
  for(const z of [a,b]){
   assert.ok(floor.has(key(x0-1,z))&&floor.has(key(x0,z))&&floor.has(key(x0+1,z)),
    'missing source-supported outside/threshold/inside vault floor '+bp.id);
   for(let y=2;y<=4;y++){
    assert.equal(voxel.has(x0+','+y+','+z),false,
     'source vault threshold is not a genuinely three-high AIR opening '+bp.id);
   }
   assert.ok(seen.has(key(x0-1,z))&&seen.has(key(x0,z))&&seen.has(key(x0+1,z)),
    'vault threshold cannot be walked from original actual front entrance '+bp.id);
  }
  const openings=bp.openings.filter(o=>o.type==='internal-doorway'&&o.x===x0);
  assert.equal(openings.length,2,'two genuine original source vault openings '+bp.id);
  assert.equal(openings[0].doorOpenState,'symbolic-unverified');
  assert.ok(bp.unresolvedDependencies.length>=3);
  assert.equal(bp.worldPlaced,false);
  console.log('ROADMAP_A_WAVE14_ORIGINAL_VAULT_SOURCE_'+bp.id+' '+JSON.stringify({
   sourceVault:spec.vault,walkableFloorNodes:seen.size,
   genuineAIR3High2Wide:true,producerManualPackGateAccepted:false,
   realGameMiningCollisionTested:false
  }));
 }
});
