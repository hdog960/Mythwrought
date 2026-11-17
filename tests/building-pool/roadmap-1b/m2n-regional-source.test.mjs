// Mythwrought Builder 1B M2N — six individually authored second variants.
// Draft source only: no world placement, production registration or shared runtime.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2NRegional1BPlans} from '../../../src/building-pool/roadmap-1b/m2n-regional-source.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const k=p=>p.join(',');
const newer=()=>getM2NRegional1BPlans();
const occupancy=b=>new Map(b.placements.map(p=>[k(p.at),p]));
function connected(b){
 const walk=new Set(b.walkable.map(k)),queue=[b.walkable[0]],seen=new Set([k(queue[0])]);
 for(let i=0;i<queue.length;i++){
  const [x,y,z]=queue[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const p=[x+dx,y,z+dz],id=k(p);
   if(walk.has(id)&&!seen.has(id)){seen.add(id);queue.push(p);}
  }
 }
 return seen.size===walk.size;
}
function shape(b,flip,rot){
 const out=new Set(),{width:w,depth:d}=b.footprint;
 for(const p of b.placements){
  let[x,y,z]=p.at;if(flip)x=w-1-x;
  if(rot===1)[x,z]=[z,w-1-x];
  if(rot===2)[x,z]=[w-1-x,d-1-z];
  if(rot===3)[x,z]=[d-1-z,x];
  out.add([x,y,z,p.role].join('/'));
 }
 return out;
}
test('M2N 164/435 authored, 271 outstanding, 15 byte-exact inherited stables, unique variant 002 slots',()=>{
 const all=get1BCandidates(),fresh=newer(),original=getInheritedStables(),v=validateAllocation(all);
 assert.equal(fresh.length,6);assert.equal(original.length,15);assert.equal(all.length,164);
 assert.equal(v.authored,164);assert.equal(v.remaining,271);
 assert.equal(new Set(all.map(p=>p.id)).size,164);
 assert.equal(new Set(all.map(structuralFingerprint)).size,164);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(c=>[c,all.filter(p=>p.category===c).length])),
  {bathhouse:24,stable:28,'farm-barn':23,greenhouse:24,'fishing-lodge':22,'harbor-office':21,lighthouse:22});
 for(const old of original)assert.equal(stableBlueprintJSON(all.find(x=>x.id===old.id)),stableBlueprintJSON(old),'stable parity '+old.id);
 for(const c of Object.keys(QUOTAS))for(const biome of BIOMES)for(const size of SIZES)
  assert.ok(all.filter(p=>p.category===c&&p.biome===biome&&p.size===size).length<=QUOTAS[c],c+'/'+biome+'/'+size);
 for(const p of fresh){
  assert.equal(p.index,2,'only second variants authorized');
  assert.ok(p.id.endsWith(':002'),p.id);
  assert.ok(all.some(x=>x.id===p.id.replace(/:002$/,':001')),'first-variant peer missing '+p.id);
 }
});
test('M2N six independently authored 3D regional services retain connected two-high rooms and real multi-region roofs',()=>{
 let voxels=0;const family=new Set();
 for(const b of newer()){
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>=2500&&b.walkable.length>=600,b.id+' insufficient actual source cells');
  voxels+=b.placements.length;
  assert.ok(b.rooms.length>=5&&b.portals.length>=6,b.id+' insufficient room/portal programme');
  assert.ok(connected(b),b.id+' disconnected floor');
  const map=occupancy(b),floor=b.placements.filter(p=>p.role==='foundation');
  const density=floor.length/((b.footprint.width-2)*(b.footprint.depth-2));
  assert.ok(density>.35&&density<.87,b.id+' notched architecture invalid density '+density);
  assert.ok(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile)).size>=6,b.id+' monolithic source roof');
  const posts=b.placements.filter(p=>p.role==='support'&&map.get(k([p.at[0],p.at[1]+1,p.at[2]]))?.role==='roof');
  assert.ok(posts.length>=7,b.id+' roof-bearing columns absent');
  for(const p of posts)assert.equal(map.get(k([p.at[0],0,p.at[2]]))?.role,'foundation',b.id+' floating roof bearing');
  for(const portal of b.portals){
   assert.ok(b.walkable.some(p=>k(p)===k(portal.at)),b.id+' nonwalkable doorway');
   assert.ok(!map.has(k(portal.at))&&!map.has(k([portal.at[0],portal.at[1]+1,portal.at[2]])),b.id+' obstructed two-high doorway');
  }
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'),b.id+' missing source-window Pack4');
  assert.ok(b.dependencies.some(d=>d.asset==='pack4:030'));
  assert.ok(b.dependencies.some(d=>/^pack[125]:/.test(d.asset)));
  for(const d of b.dependencies){assert.equal(d.status,'unresolved');family.add(d.asset.slice(0,5));}
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.creatorArtApproved,false);
  assert.equal(b.architecturalIdentity.certifiedLoadPath,false);
 }
 assert.ok(voxels>=24500,'not substantial enough distinct source XYZ voxel volume');
 assert.deepEqual([...family].filter(f=>/^pack[1-5]$/.test(f)).sort(),['pack1','pack2','pack3','pack4','pack5']);
});
test('M2N all 8 D4 role-specific XYZ transforms reject same-category near-duplicates at Jaccard 0.89',()=>{
 const all=get1BCandidates();
 for(const b of newer()){
  const a=shape(b,false,0);
  for(const other of all){
   if(b.id===other.id||b.category!==other.category)continue;
   for(const flip of [false,true])for(let turn=0;turn<4;turn++){
    const rotated=shape(other,flip,turn);
    if(Math.abs(a.size-rotated.size)>Math.max(a.size,rotated.size)*.25)continue;
    let overlap=0;for(const p of a)if(rotated.has(p))overlap++;
    const iou=overlap/(a.size+rotated.size-overlap);
    assert.ok(iou<0.89,'M2N source D4 near-copy '+b.id+' and '+other.id+' iou='+iou);
   }
  }
 }
});
test('M2N Thornmere radial spa, Alderfield 6-way barn and Wispglass crystal spine retain distinct real negative spaces',()=>{
 const get=n=>occupancy(newer().find(p=>p.title===n));
 assert.ok(!get('Thornmere Petal-Court Baths').has('6,0,8'));
 assert.ok(!get('Alderfield Windmill-Cross Barn').has('8,0,8'));
 assert.ok(!get('Wispglass Split-Orchid Conservatory').has('32,0,14'));
});
test('M2N Stonehook, Snowguard and Dunebeacon maintain independently authored sky courts, real source necks',()=>{
 const get=n=>occupancy(newer().find(p=>p.title===n));
 assert.ok(!get('Stonehook Gorge-Zigzag Fishery').has('20,0,5'));
 assert.ok(!get('Snowguard C-Court Harbor Bureau').has('20,0,19'));
 assert.ok(get('Dunebeacon Scarp-Step Observatory').has('23,0,27'));
});
test('M2N Dunebeacon original two-tier desert shaft is roof-cap supported; upper tower and signalling unimplemented',()=>{
 const b=newer().find(x=>x.category==='lighthouse'),map=occupancy(b);
 assert.equal(b.id,'r1:lighthouse:desert:medium:002');
 const parts=b.placements.filter(x=>x.towerProfile),caps=b.placements.filter(x=>x.beaconCap);
 assert.equal(new Set(parts.map(x=>x.towerProfile)).size,2);
 assert.ok(parts.length>=100&&caps.length>=250);
 for(const p of parts.filter(x=>[10,22].includes(x.at[1])))
  assert.equal(map.get(k([p.at[0],p.at[1]-1,p.at[2]]))?.role,'roof',b.id+' stacked cap missing bearing '+k(p.at));
 assert.equal(b.architecturalIdentity.upperTowerAccess,false);
 assert.equal(b.architecturalIdentity.signalLightEnabled,false);
});
