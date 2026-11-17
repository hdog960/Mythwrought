// Builder 1B M2j — original, real integer voxel source geometry acceptance.
// No production world, shared state, Pack mutations, or creator art approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2JRegional1BPlans} from '../../../src/building-pool/roadmap-1b/m2j-regional-source.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const k=p=>p.join(',');
const newOnes=()=>getM2JRegional1BPlans();
const byId=(b)=>new Map(b.placements.map(p=>[k(p.at),p]));
function d4(b,flip,rotation){
 const set=new Set(),{width:w,depth:d}=b.footprint;
 for(const {at:[ax,y,az],role} of b.placements){
  let x=flip?w-1-ax:ax,z=az;
  if(rotation===1)[x,z]=[z,w-1-x];
  else if(rotation===2)[x,z]=[w-1-x,d-1-z];
  else if(rotation===3)[x,z]=[d-1-z,x];
  set.add(x+','+y+','+z+':'+role);
 }
 return set;
}
function layoutConnected(b){
 const nodes=new Set(b.walkable.map(k)),q=[b.walkable[0]],seen=new Set([k(b.walkable[0])]);
 for(let i=0;i<q.length;i++){
  const [x,y,z]=q[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const dest=[x+dx,y,z+dz],id=k(dest);
   if(nodes.has(id)&&!seen.has(id)){seen.add(id);q.push(dest);}
  }
 }
 return seen.size===nodes.size;
}
test('M2j exactly 169/435 source candidates, nine genuinely new slots and 15 inherited stables byte-identical',()=>{
 const all=get1BCandidates(),previous=getInheritedStables(),fresh=newOnes(),v=validateAllocation(all);
 assert.equal(previous.length,15);assert.equal(fresh.length,9);
 assert.equal(all.length,169);assert.equal(v.authored,169);assert.equal(v.remaining,266);
 assert.equal(new Set(all.map(x=>x.id)).size,169);
 assert.equal(new Set(all.map(structuralFingerprint)).size,169);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(c=>[c,all.filter(x=>x.category===c).length])),
  {bathhouse:24,stable:33,'farm-barn':23,greenhouse:24,'fishing-lodge':22,'harbor-office':21,lighthouse:22});
 for(const b of previous)assert.equal(stableBlueprintJSON(all.find(x=>x.id===b.id)),stableBlueprintJSON(b),b.id+' prior PR #121 stable modified');
 for(const c of Object.keys(QUOTAS))for(const biome of BIOMES)for(const size of SIZES){
  const group=all.filter(b=>b.category===c&&b.biome===biome&&b.size===size);
  assert.ok(group.length<=QUOTAS[c],c+'/'+biome+'/'+size+' quota exceeded');
 }
 for(const b of fresh)assert.equal(all.find(x=>x.id===b.id)?.title,b.title);
});
test('M2j nine nonrectangular full 3D source designs have two-high connected rooms, real roof posts, and physically unresolved Pack manifests',()=>{
 let count=0;const packs=new Set();
 for(const b of newOnes()){
  assert.equal(validateBlueprint(b),true);
  count+=b.placements.length;
  assert.ok(b.placements.length>=1500,b.id+' source volume missing');
  assert.ok(b.rooms.length>=3&&b.portals.length>=3&&b.walkable.length>=250,b.id+' room or aisle missing');
  assert.ok(layoutConnected(b),b.id+' disconnected ground floor');
  const occ=byId(b),floor=b.placements.filter(p=>p.role==='foundation');
  const density=floor.length/((b.footprint.width-2)*(b.footprint.depth-2));
  assert.ok(density<.81&&density>.45,b.id+' rectangular shell or unrealistically sparse unsupported plan density '+density);
  const roofing=b.placements.filter(p=>p.role==='roof');
  assert.ok(new Set(roofing.map(p=>p.roofProfile)).size>=3,b.id+' monolithic roof');
  const posts=b.placements.filter(p=>p.role==='support'&&occ.get(k([p.at[0],p.at[1]+1,p.at[2]]))?.role==='roof');
  assert.ok(posts.length>=4,b.id+' missing roof-bearing posts');
  for(const p of posts)
   assert.equal(occ.get(k([p.at[0],0,p.at[2]]))?.role,'foundation',b.id+' unsupported column');
  for(const p of b.portals){
   assert.ok(b.walkable.some(w=>k(w)===k(p.at)),b.id+' blocked portal '+k(p.at));
   assert.ok(!occ.has(k(p.at))&&!occ.has(k([p.at[0],p.at[1]+1,p.at[2]])),
    b.id+' no two-high portal clearance');
  }
  assert.ok(b.placements.some(p=>p.asset==='pack4:030'&&p.role==='window'),b.id+' missing real Pack4 source cell');
  assert.ok(b.dependencies.some(x=>x.asset==='pack4:030'),b.id+' Pack4 absent from ABI ledger');
  assert.ok(b.dependencies.some(x=>/^pack[1235]:/.test(x.asset)),b.id+' no other Pack family');
  for(const d of b.dependencies){packs.add(d.asset.slice(0,5));assert.equal(d.status,'unresolved');}
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.creatorArtApproved,false);
  assert.equal(b.architecturalIdentity.certifiedLoadPath,false);
  assert.equal(stableBlueprintJSON(b),stableBlueprintJSON(newOnes().find(x=>x.id===b.id)));
 }
 assert.ok(count>22000,'M2j authored XYZ volume did not qualify as substantial');
 assert.deepEqual([...packs].filter(p=>/^pack[1-5]$/.test(p)).sort(),['pack1','pack2','pack3','pack4','pack5']);
});
test('M2j all 8 D4 reflection/rotations reject exact and near-matching same-category source XYZ role structures',()=>{
 const all=get1BCandidates();
 for(const b of newOnes()){
  const target=d4(b,false,0);
  for(const other of all){
   if(other.id===b.id||other.category!==b.category)continue;
   for(const flip of [false,true])for(let turn=0;turn<4;turn++){
    const rotated=d4(other,flip,turn);
    if(Math.abs(target.size-rotated.size)>Math.max(target.size,rotated.size)*.25)continue;
    let intersection=0;for(const x of target)if(rotated.has(x))intersection++;
    const iou=intersection/(target.size+rotated.size-intersection);
    assert.ok(iou<.89,'D4 near-duplicate rejected '+b.id+' vs '+other.id+' '+iou.toFixed(4));
   }
  }
 }
});
test('M2j rainwold closed-loop footprint truly leaves 2 unbuilt courtyards and opens every join',()=>{
 const b=newOnes().find(x=>x.title==='Rainwold Spiral-Return Nursery'),occ=byId(b);
 assert.ok(!occ.has('12,0,10')&&!occ.has('10,0,15'));
 assert.ok(occ.has('18,0,22')&&occ.has('5,0,18'));
 assert.equal(b.rooms.length,5);assert.equal(b.portals.length,6);
});
test('M2j desert guild switchback, mountain cliff fishery and 3 distinct customs bureaus create actual missing-source courtyards',()=>{
 const find=t=>byId(newOnes().find(b=>b.title===t));
 assert.ok(!find('Dunetide Crooked Quay Guild').has('5,0,13'));
 assert.ok(!find('Cloudhook Cliffstep Fisher Cooperative').has('19,0,18'));
 assert.ok(!find('Rimebreak Split-Court Customs Starhall').has('15,0,17'));
 assert.ok(!find('Rootglass Riverbend Canal Office').has('11,0,14'));
 assert.ok(!find('Saltbridge Open-Atrium Tariff Court').has('15,0,13'));
});
test('M2j three lighthouse source towers have supported multi-stage roof platforms and do not fake upper access',()=>{
 const towers=newOnes().filter(x=>x.category==='lighthouse');
 assert.equal(towers.length,3);
 for(const b of towers){
  const occ=byId(b),rings=new Set(b.placements.filter(p=>p.towerProfile).map(p=>p.towerProfile));
  assert.equal(rings.size,2,b.id+' tower stages missing');
  const caps=b.placements.filter(p=>p.beaconCap);
  assert.ok(caps.length>=250,b.id+' fabricated floating cap');
  const stageBases=b.biome==='snow'?[9,18]:b.biome==='mountain'?[10,22]:[11,26];
  for(const p of b.placements.filter(p=>p.towerProfile&&stageBases.includes(p.at[1]))){
   const below=occ.get(k([p.at[0],p.at[1]-1,p.at[2]]));
   assert.equal(below?.role,'roof',b.id+' physical tower wall missing roof cap support at '+k(p.at));
  }
  assert.equal(b.architecturalIdentity.upperTowerAccess,false);
  assert.equal(b.architecturalIdentity.signalLightEnabled,false);
 }
});
