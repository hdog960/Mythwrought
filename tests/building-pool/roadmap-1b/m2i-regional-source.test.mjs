// Builder 1B M2i: independent source-native architectural acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2IRegional1BPlans} from '../../../src/building-pool/roadmap-1b/m2i-regional-source.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const key=p=>p.join(',');
const batch=()=>getM2IRegional1BPlans();
const occupied=b=>new Map(b.placements.map(p=>[key(p.at),p]));
function shape(b,flip,rot){
 const w=b.footprint.width,d=b.footprint.depth,ret=new Set();
 for(const p of b.placements){
  let [x,y,z]=p.at;if(flip)x=w-1-x;
  if(rot===1)[x,z]=[z,w-1-x];
  if(rot===2)[x,z]=[w-1-x,d-1-z];
  if(rot===3)[x,z]=[d-1-z,x];
  ret.add([x,y,z,p.role].join('/'));
 }
 return ret;
}
function connected(b){
 const walk=new Set(b.walkable.map(key)),visited=new Set([key(b.walkable[0])]),queue=[b.walkable[0]];
 for(let i=0;i<queue.length;i++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const [x,y,z]=queue[i],n=key([x+dx,1,z+dz]);
  if(walk.has(n)&&!visited.has(n)){visited.add(n);queue.push([x+dx,1,z+dz]);}
 }
 return visited.size===walk.size;
}
test('M2i 100 original blueprint IDs, 15 byte-exact inherited stable sources and exact quota inventory',()=>{
 const all=get1BCandidates(),old=getInheritedStables(),fresh=batch(),count=validateAllocation(all);
 assert.equal(old.length,15);assert.equal(fresh.length,9);
 assert.equal(all.length,100);assert.equal(count.authored,100);assert.equal(count.remaining,335);
 assert.equal(new Set(all.map(p=>p.id)).size,100);
 assert.equal(new Set(all.map(structuralFingerprint)).size,100);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(c=>[c,all.filter(p=>p.category===c).length])),
 {'bathhouse':14,stable:28,'farm-barn':14,greenhouse:14,'fishing-lodge':10,'harbor-office':10,lighthouse:10});
 for(const b of old)assert.equal(stableBlueprintJSON(all.find(p=>p.id===b.id)),stableBlueprintJSON(b));
 for(const c of Object.keys(QUOTAS))for(const biome of BIOMES)for(const size of SIZES)
  assert.ok(all.filter(b=>b.category===c&&b.biome===biome&&b.size===size).length<=QUOTAS[c]);
});
test('M2i nine physically occupied source masks, grounded roofs, traversable portals and unresolved real Pack1-5 contracts',()=>{
 let count=0;
 for(const b of batch()){
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>=850,b.id+' insufficient authored 3D source volume');
  count+=b.placements.length;
  const floor=b.placements.filter(p=>p.role==='foundation');
  assert.ok(floor.length/((b.footprint.width-2)*(b.footprint.depth-2))<.82,b.id+' rectangular placeholder');
  assert.ok(b.rooms.length>=3&&b.portals.length>=3&&b.walkable.length>=160,b.id+' unusable room program');
  assert.ok(connected(b),b.id+' disconnected two-high walk');
  assert.ok(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile)).size>=3,b.id+' roof profile collapsed');
  const occ=occupied(b),walk=new Set(b.walkable.map(key));
  for(const portal of b.portals){
   assert.ok(walk.has(key(portal.at)),b.id+' blocked doorway '+key(portal.at));
   assert.ok(!occ.has(key(portal.at))&&!occ.has(key([portal.at[0],portal.at[1]+1,portal.at[2]])),
     b.id+' doorway two-high obstruction');
  }
  const posts=b.placements.filter(p=>p.role==='support'&&occ.get(key([p.at[0],p.at[1]+1,p.at[2]]))?.role==='roof');
  assert.ok(posts.length>=4,b.id+' missing real roof load posts');
  for(const p of posts)assert.equal(occ.get(key([p.at[0],0,p.at[2]]))?.role,'foundation',b.id+' floating post');
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'));
  assert.ok(b.dependencies.some(d=>d.asset==='pack4:030'));
  assert.ok(b.dependencies.some(d=>/^pack[1235]:/.test(d.asset)),b.id+' missing other physical Pack asset');
  for(const dep of b.dependencies)assert.equal(dep.status,'unresolved');
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.creatorApproval,false);
  assert.equal(stableBlueprintJSON(b),stableBlueprintJSON(batch().find(p=>p.id===b.id)));
 }
 assert.ok(count>14000,'new source count too small for nine unique full buildings');
});
test('M2i D4 full reflection and 90-degree turn checks reject source-XYZ role duplicates and near-copies',()=>{
 const all=get1BCandidates();
 for(const b of batch()){
  const a=shape(b,false,0);
  for(const other of all){
   if(other.id===b.id||other.category!==b.category)continue;
   for(const flip of [false,true])for(let rotation=0;rotation<4;rotation++){
    const c=shape(other,flip,rotation);
    if(Math.abs(a.size-c.size)>Math.max(a.size,c.size)*.25)continue;
    let common=0;for(const at of a)if(c.has(at))common++;
    const score=common/(a.size+c.size-common);
    assert.ok(score<.89,'M2i D4 near-match '+b.id+' '+other.id+' '+score);
   }
  }
 }
});
test('M2i hand-carved H snow glasshouse contains two truly absent central courtyards',()=>{
 const b=batch().find(p=>p.title==='Snowglen Twin-Court H-Glass Cloister'),o=occupied(b);
 assert.ok(!o.has('14,0,14')&&!o.has('14,0,29'));
 assert.ok(o.has('14,0,23')&&o.has('5,0,21')&&o.has('23,0,21'));
 assert.equal(b.rooms.length,4);assert.equal(b.portals.length,5);
});
test('M2i radically separate greenhouse, fishing lodge, mountain bureau and ice office footprint silhouettes',()=>{
 const all=batch(),get=title=>occupied(all.find(b=>b.title===title));
 assert.ok(!get('Thornwhorl Open-Ring Fernery').has('15,0,17'));
 assert.ok(!get('Kestrel Sandglass Backturn Nursery').has('5,0,13'));
 assert.ok(!get('Frostquay Pinwheel Net Station').has('18,0,23'));
 assert.ok(!get('Willowwhorl Split-Estuary River Guild').has('18,0,20'));
 assert.ok(!get('Cragchain Terraced Customs Bureau').has('9,0,19'));
 assert.ok(get('Cragchain Terraced Customs Bureau').has('23,0,19'));
 assert.ok(!get('Frostmark Offset Ice-Quay Registry').has('12,0,14'));
 assert.ok(get('Frostmark Offset Ice-Quay Registry').has('12,0,22'));
});
test('M2i desert/enchanted lighthouses contain 2 real stacked source tower rings and supported physical roof caps',()=>{
 const lights=batch().filter(b=>b.category==='lighthouse');assert.equal(lights.length,2);
 for(const b of lights){
  const occ=occupied(b);
  assert.equal(new Set(b.placements.filter(p=>p.towerProfile).map(p=>p.towerProfile)).size,2);
  assert.ok(b.placements.filter(p=>p.towerCap).length>=350);
  for(const p of b.placements.filter(p=>p.towerProfile)){
   if(p.at[1]===9)assert.equal(occ.get(key([p.at[0],8,p.at[2]]))?.role,'roof','ring missing base plate');
   if(p.at[1]===(b.biome==='desert'?22:21))
    assert.equal(occ.get(key([p.at[0],p.at[1]-1,p.at[2]]))?.role,'roof','top ring missing lower plate');
  }
  assert.equal(b.architecturalIdentity.beaconOperational,false);
  assert.equal(b.architecturalIdentity.upperTowerTraversalApproved,false);
 }
});
