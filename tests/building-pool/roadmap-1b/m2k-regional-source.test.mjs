// Builder 1B M2k — fully fixed XYZ candidate-source acceptance, no runtime.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2KRegional1BPlans} from '../../../src/building-pool/roadmap-1b/m2k-regional-source.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const k=p=>p.join(',');
const fresh=()=>getM2KRegional1BPlans();
const occ=b=>new Map(b.placements.map(p=>[k(p.at),p]));
function connected(b){
 const walk=new Set(b.walkable.map(k)),start=b.walkable[0],queue=[start],seen=new Set([k(start)]);
 for(let i=0;i<queue.length;i++){
  const [x,y,z]=queue[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const n=[x+dx,y,z+dz],id=k(n);
   if(walk.has(id)&&!seen.has(id)){seen.add(id);queue.push(n);}
  }
 }
 return seen.size===walk.size;
}
function d4(b,mirror,rot){
 const out=new Set(),{width:w,depth:d}=b.footprint;
 for(const p of b.placements){
  let [x,y,z]=p.at;if(mirror)x=w-1-x;
  if(rot===1)[x,z]=[z,w-1-x];
  if(rot===2)[x,z]=[w-1-x,d-1-z];
  if(rot===3)[x,z]=[d-1-z,x];
  out.add([x,y,z,p.role].join('/'));
 }
 return out;
}
test('M2k 148/435 authored; 15 exact original inherited stables; nine new unoccupied first slots',()=>{
 const all=get1BCandidates(),old=getInheritedStables(),next=fresh(),v=validateAllocation(all);
 assert.equal(all.length,148);assert.equal(old.length,15);assert.equal(next.length,9);
 assert.equal(v.authored,148);assert.equal(v.remaining,287);
 assert.equal(new Set(all.map(b=>b.id)).size,148);
 assert.equal(new Set(all.map(structuralFingerprint)).size,148);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(c=>[c,all.filter(b=>b.category===c).length])),
  {bathhouse:21,stable:28,'farm-barn':20,greenhouse:21,'fishing-lodge':20,'harbor-office':19,lighthouse:19});
 for(const prior of old)assert.equal(stableBlueprintJSON(all.find(b=>b.id===prior.id)),stableBlueprintJSON(prior));
 for(const c of Object.keys(QUOTAS))for(const biome of BIOMES)for(const size of SIZES)
  assert.ok(all.filter(b=>b.category===c&&b.biome===biome&&b.size===size).length<=QUOTAS[c],c+'/'+biome+'/'+size);
 for(const b of next)assert.equal(all.find(p=>p.id===b.id)?.title,b.title);
});
test('M2k nine complete irregular 3D sources have genuine accessible rooms, supported roof posts, and unresolved Pack contracts',()=>{
 let voxels=0;const packFamilies=new Set();
 for(const b of fresh()){
  assert.equal(validateBlueprint(b),true,b.id);
  voxels+=b.placements.length;
  assert.ok(b.placements.length>=1500&&b.walkable.length>=300,b.id+' full source absent');
  assert.ok(b.rooms.length>=3&&b.portals.length>=3,b.id+' insufficient real room program');
  assert.ok(connected(b),b.id+' disconnected source walkable components');
  const map=occ(b),floor=b.placements.filter(p=>p.role==='foundation');
  const density=floor.length/((b.footprint.width-2)*(b.footprint.depth-2));
  assert.ok(density>.38&&density<.88,b.id+' missing concave open-space topology '+density);
  assert.ok(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile)).size>=3,b.id+' monolithic roof');
  const bearing=b.placements.filter(p=>p.role==='support'&&map.get(k([p.at[0],p.at[1]+1,p.at[2]]))?.role==='roof');
  assert.ok(bearing.length>=4,b.id+' no source-bearing structural posts');
  for(const p of bearing)assert.equal(map.get(k([p.at[0],0,p.at[2]]))?.role,'foundation',b.id+' post without foundational bearing');
  for(const p of b.portals){
   assert.ok(b.walkable.some(q=>k(q)===k(p.at)),b.id+' portal not in traversable room');
   assert.ok(!map.has(k(p.at))&&!map.has(k([p.at[0],p.at[1]+1,p.at[2]])),b.id+' blocked two-high portal');
  }
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'),b.id+' missing physical symbolic glass cell');
  assert.ok(b.dependencies.some(d=>d.asset==='pack4:030'));
  assert.ok(b.dependencies.some(d=>/^pack[1235]:/.test(d.asset)));
  for(const d of b.dependencies){assert.equal(d.status,'unresolved');packFamilies.add(d.asset.slice(0,5));}
  assert.equal(b.architecturalIdentity.creatorArtApproved,false);
  assert.equal(b.architecturalIdentity.certifiedLoadPath,false);
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 }
 assert.ok(voxels>23000,'M2k must genuinely author substantial source volume');
 assert.deepEqual([...packFamilies].filter(p=>/^pack[1-5]$/.test(p)).sort(),['pack1','pack2','pack3','pack4','pack5']);
});
test('M2k all 8 source-XYZ role D4 transforms reject same-category Jaccard near-duplicates at 0.89',()=>{
 const all=get1BCandidates();
 for(const b of fresh()){
  const a=d4(b,false,0);
  for(const other of all){
   if(b.id===other.id||b.category!==other.category)continue;
   for(const mirror of [false,true])for(let rotation=0;rotation<4;rotation++){
    const t=d4(other,mirror,rotation);
    if(Math.abs(a.size-t.size)>Math.max(a.size,t.size)*.25)continue;
    let same=0;for(const v of a)if(t.has(v))same++;
    assert.ok(same/(a.size+t.size-same)<.89,b.id+' overlaps '+other.id);
   }
  }
 }
});
test('M2k mountain therma and cliff barn are separately authored stone-service rooms with open courts',()=>{
 const thermal=occ(fresh().find(b=>b.category==='bathhouse'));
 const barn=occ(fresh().find(b=>b.category==='farm-barn'));
 assert.ok(!thermal.has('17,0,16')&&thermal.has('17,0,28'));
 assert.ok(!barn.has('20,0,18')&&barn.has('20,0,28'));
});
test('M2k three source fishing lodges and two customs offices have physical negative-space notches',()=>{
 const byName=n=>occ(fresh().find(b=>b.title===n));
 assert.ok(!byName('Brookdock Crescent Net House').has('17,0,16'));
 assert.ok(!byName('Icehook Snow-Net Return Lodge').has('7,0,13'));
 assert.ok(!byName('Willowshade Three-Bend Reed Lodge').has('13,0,12'));
 assert.ok(!byName('Brinehaven Lattice-Harbor Registry').has('16,0,16'));
 assert.ok(!byName('Highpass Cliff-Edge Harbor Ledger').has('5,0,13'));
});
test('M2k two lighthouses physically stack multiple roof caps with supported start rings and no fake upper traversal',()=>{
 const towers=fresh().filter(b=>b.category==='lighthouse');assert.equal(towers.length,2);
 for(const b of towers){
  const map=occ(b),walls=b.placements.filter(p=>p.towerProfile),caps=b.placements.filter(p=>p.beaconCap);
  assert.equal(new Set(walls.map(p=>p.towerProfile)).size,2);
  assert.ok(caps.length>=220&&walls.length>=100,b.id+' fake shaft');
  for(const p of walls){
   const y=p.at[1],base=b.biome==='desert'?[10,21]:[10,23];
   if(base.includes(y))
    assert.equal(map.get(k([p.at[0],y-1,p.at[2]]))?.role,'roof',b.id+' upper source wall unsupported');
  }
  assert.equal(b.architecturalIdentity.upperTowerAccess,false);
  assert.equal(b.architecturalIdentity.signalLightEnabled,false);
 }
});
