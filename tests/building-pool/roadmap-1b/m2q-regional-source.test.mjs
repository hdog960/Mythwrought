// Mythwrought Builder 1B M2Q: independently source-authored variant 002 designs.
// No claims of Pack producer ABI approval, world placement, active gameplay or visual sign-off.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2QRegional1BPlans} from '../../../src/building-pool/roadmap-1b/m2q-regional-source.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const key=x=>x.join(',');
const batch=()=>getM2QRegional1BPlans(),cells=b=>new Map(b.placements.map(p=>[key(p.at),p]));
function groundConnected(b){
 const walk=new Set(b.walkable.map(key)),seen=new Set([key(b.walkable[0])]),q=[b.walkable[0]];
 for(let i=0;i<q.length;i++){
  const [x,y,z]=q[i];
  for(const [dx,dz] of [[0,1],[0,-1],[1,0],[-1,0]]){
   const p=[x+dx,y,z+dz],k=key(p);
   if(walk.has(k)&&!seen.has(k)){seen.add(k);q.push(p)}
  }
 }
 return seen.size===walk.size;
}
function d4(b,mirror,rot){
 const a=new Set(),{width:w,depth:d}=b.footprint;
 for(const p of b.placements){
  let[x,y,z]=p.at;if(mirror)x=w-1-x;
  if(rot===1)[x,z]=[z,w-1-x];
  if(rot===2)[x,z]=[w-1-x,d-1-z];
  if(rot===3)[x,z]=[d-1-z,x];
  a.add([x,y,z,p.role].join('/'));
 }
 return a;
}
test('M2Q census: 164/435 independent candidate IDs, 271 remaining, unchanged original 15 inherited stables',()=>{
 const all=get1BCandidates(),old=getInheritedStables(),next=batch(),a=validateAllocation(all);
 assert.equal(all.length,164);assert.equal(a.authored,164);assert.equal(a.remaining,271);
 assert.equal(next.length,4);assert.equal(old.length,15);
 assert.equal(new Set(all.map(x=>x.id)).size,164);
 assert.equal(new Set(all.map(structuralFingerprint)).size,164);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(k=>[k,all.filter(x=>x.category===k).length])),
  {bathhouse:24,stable:28,'farm-barn':23,greenhouse:24,'fishing-lodge':22,'harbor-office':21,lighthouse:22});
 for(const p of old)assert.equal(stableBlueprintJSON(all.find(x=>x.id===p.id)),stableBlueprintJSON(p),p.id+' inherited source changed');
 for(const c of Object.keys(QUOTAS))for(const bio of BIOMES)for(const size of SIZES)
  assert.ok(all.filter(p=>p.category===c&&p.biome===bio&&p.size===size).length<=QUOTAS[c],c+'/'+bio+'/'+size);
 for(const b of next){assert.equal(b.index,2);assert.ok(b.id.endsWith(':002'));assert.ok(all.some(p=>p.id===b.id.replace(/:002$/,':001')),b.id+' original first variant missing');}
});
test('M2Q four genuine XYZ architecture designs retain connected 2-high routes, grounded roofs, Pack symbolic ledgers',()=>{
 let total=0;const packs=new Set();
 for(const b of batch()){
  assert.equal(validateBlueprint(b),true);
  total+=b.placements.length;
  assert.ok(b.placements.length>=2300&&b.walkable.length>=375,b.id+' incomplete XYZ source');
  assert.ok(groundConnected(b),b.id+' disconnected ground circulation');
  assert.ok(b.rooms.length>=5&&b.portals.length>=6,b.id+' insufficient walkable room program');
  const o=cells(b),foundation=b.placements.filter(p=>p.role==='foundation'),density=foundation.length/((b.footprint.width-2)*(b.footprint.depth-2));
  assert.ok(density>.25&&density<.9,b.id+' invalid irregular footprint density');
  const roofs=b.placements.filter(p=>p.role==='roof'),mass=new Set(roofs.map(p=>p.roofProfile));
  assert.ok(mass.size>=5,b.id+' repetitive single-roof structure');
  const heights=roofs.map(p=>p.at[1]);assert.ok(Math.max(...heights)-Math.min(...heights)>=6,b.id+' roof heights visually flattened');
  const support=b.placements.filter(p=>p.role==='support'&&o.get(key([p.at[0],p.at[1]+1,p.at[2]]))?.role==='roof');
  assert.ok(support.length>=5,b.id+' roof load witness absent');
  for(const p of support)assert.equal(o.get(key([p.at[0],0,p.at[2]]))?.role,'foundation',b.id+' floating support');
  for(const entry of b.portals){
   assert.ok(b.walkable.some(p=>key(p)===key(entry.at)),b.id+' portal has no walkable floor');
   assert.ok(!o.has(key(entry.at))&&!o.has(key([entry.at[0],entry.at[1]+1,entry.at[2]])),b.id+' two-high doorway blocked');
  }
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'),b.id+' no physical source-cell window');
  assert.ok(b.dependencies.some(d=>d.asset==='pack4:030'));
  assert.ok(b.dependencies.some(d=>/^pack[125]:/.test(d.asset)));
  for(const dep of b.dependencies){assert.equal(dep.status,'unresolved');packs.add(dep.asset.slice(0,5));}
  assert.equal(b.architecturalIdentity.creatorArtApproved,false);
  assert.equal(b.architecturalIdentity.certifiedLoadPath,false);
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 }
 assert.ok(total>=13000,'insufficient independent authored source geometry');
 assert.deepEqual([...packs].filter(f=>/^pack[1-5]$/.test(f)).sort(),['pack1','pack2','pack3','pack4','pack5']);
});
test('M2Q source role XYZ eight-way D4 reflection and rotation near-copy comparison strictly below IoU 0.89',()=>{
 const all=get1BCandidates();
 for(const b of batch()){
  const a=d4(b,false,0);
  for(const other of all){
   if(b.id===other.id||b.category!==other.category)continue;
   for(const flip of [false,true])for(let rot=0;rot<4;rot++){
    const x=d4(other,flip,rot);
    if(Math.abs(a.size-x.size)>Math.max(a.size,x.size)*.25)continue;
    let common=0;for(const k of a)if(x.has(k))common++;
    const iou=common/(a.size+x.size-common);
    assert.ok(iou<.89,b.id+' too close to '+other.id+' in D4 transform '+flip+'/'+rot+' IoU='+iou.toFixed(5));
   }
  }
 }
});
test('M2Q Sunharp and Snowcoil carry visibly elevated off-axis wings and actual sky-open courts',()=>{
 const list=batch(),bath=list.find(p=>p.title==='Sunharp Fan-Court Baths'),barn=list.find(p=>p.title==='Snowcoil Staggered Haymill');
 assert.ok(!cells(bath).has('15,0,13')&&!cells(barn).has('16,0,12'));
 assert.ok(cells(bath).has('15,0,27')&&cells(barn).has('15,0,29'));
 assert.ok(bath.placements.some(p=>p.role==='roof'&&p.roofProfile==='sunharp-east-raised-dry-therapy'));
 assert.ok(barn.placements.some(p=>p.role==='roof'&&p.roofProfile==='snowcoil-short-high-feed-silo'));
});
test('M2Q Glasswick has two real courtyard voids, an east raised seed lab and source-braided return rooms',()=>{
 const b=batch().find(p=>p.title==='Glasswick Six-Wing Seedhouse'),o=cells(b);
 assert.ok(!o.has('20,0,14')&&!o.has('24,0,16'));
 assert.ok(o.has('18,0,35')&&o.has('30,0,34'));
 assert.ok(b.rooms.length>=6&&groundConnected(b));
 assert.ok(b.placements.some(p=>p.role==='roof'&&p.roofProfile==='glasswick-tall-east-seed-vault'));
});
test('M2Q Mossneedle high tower has real bearing caps, unlit prism finial and no invented upper access',()=>{
 const b=batch().find(p=>p.title==='Mossneedle Spiral-Root Beacon'),o=cells(b);
 assert.equal(b.id,'r1:lighthouse:enchanted-forest:small:002');
 const tower=b.placements.filter(p=>p.towerProfile),caps=b.placements.filter(p=>p.beaconCap);
 assert.equal(new Set(tower.map(p=>p.towerProfile)).size,2);
 assert.ok(tower.length>=100&&caps.length>=420);
 for(const p of tower.filter(p=>[10,25].includes(p.at[1])))
  assert.equal(o.get(key([p.at[0],p.at[1]-1,p.at[2]]))?.role,'roof',b.id+' invalid cap-supported upper tower wall');
 assert.equal(b.architecturalIdentity.upperTowerAccess,false);
 assert.equal(b.architecturalIdentity.signalLightEnabled,false);
});
