import test from 'node:test';
import assert from 'node:assert/strict';
import {plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,assertDistinctArchitecture,structuralFingerprint}
 from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {buildRoadmapA399ProvisionalSettlementManifest}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-a5-399-provisional.mjs';
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
import {ROADMAP_A_WAVE14_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave14.mjs';
import {ROADMAP_A_WAVE15_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave15.mjs';
import {ROADMAP_A_WAVE16_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave16.mjs';
import {ROADMAP_A_WAVE17_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave17.mjs';
import {ROADMAP_A_WAVE18_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave18.mjs';
import {ROADMAP_A_WAVE19_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave19.mjs';
import {ROADMAP_A_WAVE20_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave20.mjs';
import {ROADMAP_A_WAVE21_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave21.mjs';
import {ROADMAP_A_WAVE22_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave22.mjs';
import {ROADMAP_A_WAVE23_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave23.mjs';
import {ROADMAP_A_WAVE24_SHOPS,ROADMAP_A_WAVE24_SPECS,ROADMAP_A_WAVE24_IDS}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-wave24.mjs';

const old=[...ROADMAP_A_WAVE01_SHOPS,...ROADMAP_A_WAVE02_SHOPS,
 ...ROADMAP_A_WAVE03_SHOPS,...ROADMAP_A_WAVE04_SHOPS,...ROADMAP_A_WAVE05_SHOPS,
 ...ROADMAP_A_WAVE06_SHOPS,...ROADMAP_A_WAVE07_SHOPS,...ROADMAP_A_WAVE08_SHOPS,...ROADMAP_A_WAVE09_SHOPS,...ROADMAP_A_WAVE10_SHOPS,...ROADMAP_A_WAVE11_SHOPS,...ROADMAP_A_WAVE12_SHOPS,...ROADMAP_A_WAVE13_SHOPS,...ROADMAP_A_WAVE14_SHOPS,...ROADMAP_A_WAVE15_SHOPS,...ROADMAP_A_WAVE16_SHOPS,...ROADMAP_A_WAVE17_SHOPS,...ROADMAP_A_WAVE18_SHOPS,...ROADMAP_A_WAVE19_SHOPS,...ROADMAP_A_WAVE20_SHOPS,...ROADMAP_A_WAVE21_SHOPS,...ROADMAP_A_WAVE22_SHOPS,...ROADMAP_A_WAVE23_SHOPS];
const now=ROADMAP_A_WAVE24_SHOPS;
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
test('Wave24 12 original new source-only blueprints use canonical 399-yet-unwritten IDs across five non-bank categories',{timeout:240000},()=>{
 assert.equal(old.length,271);assert.equal(now.length,12);assert.equal(ROADMAP_A_WAVE24_IDS.length,12);
 const prior=buildRoadmapA399ProvisionalSettlementManifest();
 assert.equal(prior.blueprints.length,399);assert.equal(prior.remainingCanonicalIDs.length,21);
 const missing=new Set(prior.remainingCanonicalIDs);
 const registry=new Map(plannedSlots().map(s=>[s.id,s]));
 const oldIds=new Set(prior.blueprints.map(x=>x.id));
 assert.equal(new Set(now.map(b=>b.id)).size,12);
 // The accepted registry has exhausted all bank slots; new bank IDs are forbidden.
 assert.equal(prior.blueprints.filter(b=>b.category==='bank').length,45);
 assert.deepEqual(prior.remainingCanonicalIDs.filter(id=>id.startsWith('r2:bank:')),[]);
 assert.equal(now.filter(b=>b.category==='bank').length,0);
 for(const bp of now){
  assert.ok(missing.has(bp.id),'canonical prior 399 already claimed '+bp.id);
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
  { 'general-store':1,'pet-shop':3,'magic-shop':3,'potion-shop':3,bakery:2,bank:0});
 assert.equal(new Set([...old.map(b=>b.id),...now.map(b=>b.id)]).size,283);
});
test('Wave24 physical source paths are continuous from open front doors to all four functional rooms and fixtures',{timeout:240000},()=>{
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
test('Wave24 each original authored shell has sky-open court, four real source-region roof profiles and untouched symbolic dependencies',{timeout:240000},()=>{
 for(let i=0;i<now.length;i++){
  const bp=now[i],spec=ROADMAP_A_WAVE24_SPECS[i],floor=new Set(bp.voxels.filter(v=>v.y===1).map(v=>key(v.x,v.z)));
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
test('Wave24 source strict D4 comparison to all 271 prior wave source plans and twelve own peers, same category <0.85',{timeout:240000},()=>{
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
 console.log('ROADMAP_A_WAVE24_D4_OLD271_AND_NEW12 '+JSON.stringify({
  comparedSameCategoryPairs:count,maxIoU:max,maxPair,threshold:.85,
  realHistorical128StrictD4NotExecutedHere:true,
  installedMeshesAndStructuralSupportNotCertified:true
 }));
});


test('Wave24 genuine three-high source entrances, full supported room routes, and no new bank vaults',{timeout:240000},()=>{
 for(const bp of now){
  assert.notEqual(bp.category,'bank');
  assert.equal(bp.openings.filter(o=>o.type==='internal-doorway').length,0);
  const cells=new Map(bp.voxels.map(v=>[v.x+','+v.y+','+v.z,v]));
  const doors=bp.openings.filter(o=>o.type==='entrance').sort((a,b)=>a.x-b.x);
  assert.equal(doors.length,2);
  assert.equal(doors[1].x,doors[0].x+1);
  assert.equal(doors[0].z,0);assert.equal(doors[1].z,0);
  for(const door of doors){
   assert.equal(door.clearHeightCells,3);
   for(let y=2;y<=4;y++)assert.equal(cells.has(door.x+','+y+',0'),false,bp.id+' blocked source front door');
   for(let z=0;z<=1;z++){
    assert.equal(cells.get(door.x+',0,'+z)?.kind,'foundation',bp.id);
    assert.equal(cells.get(door.x+',1,'+z)?.kind,'floor',bp.id);
   }
  }
  const floor=new Set(bp.voxels.filter(v=>v.y===1&&v.kind==='floor').map(v=>key(v.x,v.z)));
  const solid=new Set(bp.voxels.filter(v=>v.y>=2&&v.y<=4).map(v=>key(v.x,v.z)));
  const q=[[doors[0].x,0]],seen=new Set([key(...q[0])]);
  for(let i=0;i<q.length;i++){const [x,z]=q[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const a=x+dx,b=z+dz,k=key(a,b);
   if(floor.has(k)&&!solid.has(k)&&!seen.has(k)){seen.add(k);q.push([a,b]);}
  }}
  for(const room of bp.rooms)assert.ok(seen.has(key(...room.access)),bp.id+' three-high route blocked '+room.name);
  for(const v of bp.voxels.filter(v=>v.kind==='floor'&&v.y===1))assert.equal(cells.get(v.x+',0,'+v.z)?.kind,'foundation',bp.id+' unsupported source floor');
  for(const v of bp.voxels.filter(v=>v.kind==='fixture'&&v.y===2))assert.ok([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>seen.has(key(v.x+dx,v.z+dz))),bp.id+' no three-high source fixture approach');
  assert.ok(seen.has(key(doors[1].x,0)),bp.id);
  console.log('ROADMAP_A_WAVE24_CLEARANCE '+JSON.stringify({id:bp.id,sourceThreeHighReachable:seen.size,physicalPackAccepted:false}));
 }
});
