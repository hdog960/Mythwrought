// Builder 1B M2P -- six separately authored second-variant regional service sources.
// Candidate geometry is not physically Pack-certified or available for world placement.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2PRegional1BPlans} from '../../../src/building-pool/roadmap-1b/m2p-regional-source.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const key=p=>p.join(',');
const batch=()=>getM2PRegional1BPlans();
const cells=b=>new Map(b.placements.map(p=>[key(p.at),p]));
function connected(b){
 const walk=new Set(b.walkable.map(key)),q=[b.walkable[0]],seen=new Set([key(q[0])]);
 for(let i=0;i<q.length;i++){
  const [x,y,z]=q[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const n=[x+dx,y,z+dz],k=key(n);
   if(walk.has(k)&&!seen.has(k)){seen.add(k);q.push(n);}
  }
 }
 return seen.size===walk.size;
}
function d4(b,mirror,rotation){
 const out=new Set(),{width:w,depth:d}=b.footprint;
 for(const p of b.placements){
  let[x,y,z]=p.at;if(mirror)x=w-1-x;
  if(rotation===1)[x,z]=[z,w-1-x];
  if(rotation===2)[x,z]=[w-1-x,d-1-z];
  if(rotation===3)[x,z]=[d-1-z,x];
  out.add([x,y,z,p.role].join('/'));
 }
 return out;
}
test('M2P 158/435 authored, 277 remaining, 15 exact inherited stables and distinct original variant 002',()=>{
 const all=get1BCandidates(),old=getInheritedStables(),newer=batch(),v=validateAllocation(all);
 assert.equal(all.length,158);assert.equal(v.authored,158);assert.equal(v.remaining,277);
 assert.equal(old.length,15);assert.equal(newer.length,6);
 assert.equal(new Set(all.map(b=>b.id)).size,158);
 assert.equal(new Set(all.map(structuralFingerprint)).size,158);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(c=>[c,all.filter(b=>b.category===c).length])),
  {bathhouse:23,stable:28,'farm-barn':22,greenhouse:23,'fishing-lodge':21,'harbor-office':20,lighthouse:21});
 for(const p of old)assert.equal(stableBlueprintJSON(all.find(b=>b.id===p.id)),stableBlueprintJSON(p),p.id+' altered inherited source');
 for(const c of Object.keys(QUOTAS))for(const bio of BIOMES)for(const size of SIZES)
  assert.ok(all.filter(b=>b.category===c&&b.biome===bio&&b.size===size).length<=QUOTAS[c],c+'/'+bio+'/'+size);
 for(const b of newer){
  assert.equal(b.index,2);assert.ok(b.id.endsWith(':002'));
  assert.equal(all.find(p=>p.id===b.id)?.title,b.title);
  assert.ok(all.some(p=>p.id===b.id.replace(/:002$/,':001')),b.id+' first-variant source missing');
 }
});
test('M2P six deep physically notched 3D source structures, real connected walkways, supported roofs, and symbolic Pack ABI',()=>{
 let volume=0;const packFamilies=new Set();
 for(const b of batch()){
  assert.equal(validateBlueprint(b),true);
  volume+=b.placements.length;
  assert.ok(b.placements.length>=3200&&b.walkable.length>=600,b.id+' underauthored physical source');
  assert.ok(b.rooms.length>=6&&b.portals.length>=7,b.id+' missing functional source room program');
  assert.ok(connected(b),b.id+' disconnected 2-high ground circulation');
  const o=cells(b),found=b.placements.filter(p=>p.role==='foundation');
  const density=found.length/((b.footprint.width-2)*(b.footprint.depth-2));
  assert.ok(density>.27&&density<.88,b.id+' overly sparse/rectangular foundation '+density);
  assert.ok(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile)).size>=6,b.id+' monolithic roof');
  const posts=b.placements.filter(p=>p.role==='support'&&o.get(key([p.at[0],p.at[1]+1,p.at[2]]))?.role==='roof');
  assert.ok(posts.length>=6,b.id+' roof has inadequate source posts');
  for(const p of posts)assert.equal(o.get(key([p.at[0],0,p.at[2]]))?.role,'foundation',b.id+' ungrounded post');
  for(const portal of b.portals){
   assert.ok(b.walkable.some(p=>key(p)===key(portal.at)),b.id+' portal not walkable');
   assert.ok(!o.has(key(portal.at))&&!o.has(key([portal.at[0],portal.at[1]+1,portal.at[2]])),
    b.id+' source portal lacks 2-high clearance');
  }
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'),b.id+' no actual Pack4 window source cell');
  assert.ok(b.dependencies.some(p=>p.asset==='pack4:030'));
  assert.ok(b.dependencies.some(p=>/^pack[1235]:/.test(p.asset)));
  for(const dep of b.dependencies){assert.equal(dep.status,'unresolved');packFamilies.add(dep.asset.slice(0,5));}
  assert.equal(b.architecturalIdentity.creatorArtApproved,false);
  assert.equal(b.architecturalIdentity.certifiedLoadPath,false);
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
 }
 assert.ok(volume>28000,'M2P not substantively authored in real XYZ source cells');
 assert.deepEqual([...packFamilies].filter(p=>/^pack[1-5]$/.test(p)).sort(),['pack1','pack2','pack3','pack4','pack5']);
});
test('M2P all eight D4 transformed source role XYZ sets reject near-duplicates under Jaccard 0.89',()=>{
 const all=get1BCandidates();
 for(const b of batch()){
  const a=d4(b,false,0);
  for(const other of all){
   if(b.id===other.id||b.category!==other.category)continue;
   for(const mirror of [false,true])for(let rot=0;rot<4;rot++){
    const t=d4(other,mirror,rot);
    if(Math.abs(a.size-t.size)>Math.max(a.size,t.size)*.25)continue;
    let intersection=0;for(const p of a)if(t.has(p))intersection++;
    const iou=intersection/(a.size+t.size-intersection);
    assert.ok(iou<.89,b.id+' near-duplicate of '+other.id+' IoU='+iou);
   }
  }
 }
});
test('M2P dry bath, rocky barn and sun-glass conservatory have physically unbuilt courtyard ground',()=>{
 const by=n=>cells(batch().find(p=>p.title===n));
 assert.ok(!by('Briarloop Crescent Baths').has('24,0,19'));
 assert.ok(!by('Basaltstep Sawtooth Fold Barn').has('20,0,15'));
 assert.ok(!by('Sundial Split-Loop Glassworks').has('21,0,15'));
 assert.ok(by('Briarloop Crescent Baths').has('24,0,46'));
 assert.ok(by('Sundial Split-Loop Glassworks').has('20,0,38'));
});
test('M2P 2-street winter wharf and zigzag enchanted river registry retain true absent sky cells',()=>{
 const fish=batch().find(p=>p.title==='Icewater Two-Quay Guildhouse'),harbor=batch().find(p=>p.title==='Brookshade Offset Civic Ledger');
 assert.ok(!cells(fish).has('30,0,18'));
 assert.ok(!cells(harbor).has('18,0,14'));
 assert.equal(fish.portals.filter(p=>p.from==='outside').length,2,'two source-authored dock approaches required');
 assert.ok(connected(fish)&&connected(harbor));
});
test('M2P Crownspire high tier really rests on producer-source roof cap without pretending light or upper navigation',()=>{
 const b=batch().find(p=>p.category==='lighthouse'),o=cells(b);
 assert.equal(b.id,'r1:lighthouse:temperate:large:002');
 const walls=b.placements.filter(p=>p.towerProfile),caps=b.placements.filter(p=>p.beaconCap);
 assert.equal(new Set(walls.map(p=>p.towerProfile)).size,2);
 assert.ok(walls.length>=180&&caps.length>=430);
 for(const p of walls.filter(p=>[10,29].includes(p.at[1])))
  assert.equal(o.get(key([p.at[0],p.at[1]-1,p.at[2]]))?.role,'roof',b.id+' upper tower lacks full source cap');
 assert.equal(b.architecturalIdentity.upperTowerAccess,false);
 assert.equal(b.architecturalIdentity.signalLightEnabled,false);
});
