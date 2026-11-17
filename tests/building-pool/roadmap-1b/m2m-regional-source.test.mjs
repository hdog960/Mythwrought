// Builder 1B M2M: source-authored second-variant regional services only.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2MRegional1BPlans} from '../../../src/building-pool/roadmap-1b/m2m-regional-source.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const key=p=>p.join(',');
const newer=()=>getM2MRegional1BPlans();
const occupied=b=>new Map(b.placements.map(p=>[key(p.at),p]));
function isConnected(b){
 const walk=new Set(b.walkable.map(key)),q=[b.walkable[0]],seen=new Set([key(q[0])]);
 for(let i=0;i<q.length;i++){
  const [x,y,z]=q[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const p=[x+dx,y,z+dz],k=key(p);
   if(walk.has(k)&&!seen.has(k)){seen.add(k);q.push(p);}
  }
 }
 return seen.size===walk.size;
}
function shape(b,mirror,turn){
 const out=new Set(),{width:w,depth:d}=b.footprint;
 for(const p of b.placements){
  let [x,y,z]=p.at;
  if(mirror)x=w-1-x;
  if(turn===1)[x,z]=[z,w-1-x];
  if(turn===2)[x,z]=[w-1-x,d-1-z];
  if(turn===3)[x,z]=[d-1-z,x];
  out.add([x,y,z,p.role].join('/'));
 }
 return out;
}
test('M2M 148/435 complete original source candidates, 287 outstanding, 15 exact inherited stables',()=>{
 const all=get1BCandidates(),batch=newer(),old=getInheritedStables(),v=validateAllocation(all);
 assert.equal(batch.length,9);assert.equal(old.length,15);assert.equal(all.length,148);
 assert.equal(v.authored,148);assert.equal(v.remaining,287);
 assert.equal(new Set(all.map(p=>p.id)).size,148);
 assert.equal(new Set(all.map(structuralFingerprint)).size,148);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(c=>[c,all.filter(p=>p.category===c).length])),
  {bathhouse:21,stable:28,'farm-barn':20,greenhouse:21,'fishing-lodge':20,'harbor-office':19,lighthouse:19});
 for(const b of old)assert.equal(stableBlueprintJSON(all.find(x=>x.id===b.id)),stableBlueprintJSON(b),b.id);
 for(const c of Object.keys(QUOTAS))for(const biome of BIOMES)for(const size of SIZES)
  assert.ok(all.filter(p=>p.category===c&&p.biome===biome&&p.size===size).length<=QUOTAS[c],c+'/'+biome+'/'+size);
 for(const p of batch){
  assert.equal(p.index,2,p.id+' not unique variant two');
  assert.ok(p.id.endsWith(':002'));
  assert.ok(all.some(q=>q.id===p.id.replace(/:002$/,':001')),'missing protected original sibling');
 }
});
test('M2M nine real multi-wing 3D source structures: walkable interconnected rooms, bearing roofs and unresolved Pack ABI',()=>{
 let voxelTotal=0;const families=new Set();
 for(const b of newer()){
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>=2000&&b.walkable.length>=375,b.id+' source too sparse');
  voxelTotal+=b.placements.length;
  assert.ok(b.rooms.length>=5&&b.portals.length>=6,b.id+' room/circulation program incomplete');
  assert.ok(isConnected(b),b.id+' disconnected ground-level source');
  const cells=occupied(b),foundation=b.placements.filter(p=>p.role==='foundation');
  const density=foundation.length/((b.footprint.width-2)*(b.footprint.depth-2));
  assert.ok(density>.36&&density<.88,b.id+' unsupported or rectangular source footprint density '+density);
  assert.ok(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile)).size>=5,
   b.id+' non-original single-roof silhouette');
  const posts=b.placements.filter(p=>p.role==='support'&&cells.get(key([p.at[0],p.at[1]+1,p.at[2]]))?.role==='roof');
  assert.ok(posts.length>=6,b.id+' no supported physical roof');
  for(const p of posts)assert.equal(cells.get(key([p.at[0],0,p.at[2]]))?.role,'foundation',b.id+' floating post');
  for(const door of b.portals){
   assert.ok(b.walkable.some(p=>key(p)===key(door.at)),b.id+' blocked source portal');
   assert.ok(!cells.has(key(door.at))&&!cells.has(key([door.at[0],door.at[1]+1,door.at[2]])),b.id+' no two-high doorway');
  }
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'),b.id+' absent symbolic window geometry');
  assert.ok(b.dependencies.some(d=>d.asset==='pack4:030'));
  assert.ok(b.dependencies.some(d=>/^pack[1235]:/.test(d.asset)));
  for(const dep of b.dependencies){assert.equal(dep.status,'unresolved');families.add(dep.asset.slice(0,5));}
  assert.equal(b.architecturalIdentity.creatorArtApproved,false);
  assert.equal(b.architecturalIdentity.certifiedLoadPath,false);
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 }
 assert.ok(voxelTotal>33000,'not enough authored 3D volume');
 assert.deepEqual([...families].filter(f=>/^pack[1-5]$/.test(f)).sort(),['pack1','pack2','pack3','pack4','pack5']);
});
test('M2M reject all same-category D4 XYZ-role collisions and near-copies in all eight rotations/reflections',()=>{
 const all=get1BCandidates();
 for(const b of newer()){
  const a=shape(b,false,0);
  for(const other of all){
   if(b.id===other.id||b.category!==other.category)continue;
   for(const flip of [false,true])for(let turn=0;turn<4;turn++){
    const transformed=shape(other,flip,turn);
    if(Math.abs(a.size-transformed.size)>Math.max(a.size,transformed.size)*.25)continue;
    let common=0;for(const p of a)if(transformed.has(p))common++;
    const iou=common/(a.size+transformed.size-common);
    assert.ok(iou<.89,'M2M D4 near-copy '+b.id+' vs '+other.id+' ('+iou+')');
   }
  }
 }
});
test('M2M bathhouse and 2 glasshouses have truly open, differentiated sky courts and no fake courtyard foundations',()=>{
 const find=name=>occupied(newer().find(b=>b.title===name));
 assert.ok(!find('Sirocco Rift-Court Thermae').has('19,0,19'));
 assert.ok(!find('Taluscrank Cliff-Bend Bath Lodge').has('12,0,14'));
 assert.ok(!find('Miragehook Open-Atrium Botanic House').has('22,0,18'));
 assert.ok(!find('Mossbell Double-Loop Fernery').has('22,0,16'));
 assert.ok(!find('Mossbell Double-Loop Fernery').has('22,0,30'));
});
test('M2M dry barn, forked snow net station, mountain tariff and river guild feature physically notched masks',()=>{
 const find=name=>occupied(newer().find(b=>b.title===name));
 assert.ok(!find('Rimecroft Forked Hay Depot').has('16,0,15'));
 assert.ok(!find('Driftwake Forked-Net Exchange').has('16,0,16'));
 assert.ok(!find('Ridgebar Cantilever Customs Registry').has('17,0,15'));
 assert.ok(!find('Fernwater Asymmetric River-Hook Guild').has('17,0,15'));
 const snow=newer().find(p=>p.title==='Driftwake Forked-Net Exchange');
 assert.ok(snow.portals.filter(p=>p.from==='outside').length>=2,'two genuinely separate street entrances required');
});
test('M2M giant enchanted Moonbranch beacon has actual supported 2-stage tower and no fake gameplay or upper access',()=>{
 const b=newer().find(p=>p.category==='lighthouse'),o=occupied(b);
 assert.equal(b.id,'r1:lighthouse:enchanted-forest:large:002');
 const wall=b.placements.filter(p=>p.towerProfile),caps=b.placements.filter(p=>p.beaconCap);
 assert.equal(new Set(wall.map(p=>p.towerProfile)).size,2);
 assert.ok(wall.length>=150&&caps.length>=350);
 for(const p of wall.filter(p=>[10,24].includes(p.at[1])))
  assert.equal(o.get(key([p.at[0],p.at[1]-1,p.at[2]]))?.role,'roof',b.id+' tower cap bearing failure');
 assert.equal(b.architecturalIdentity.upperTowerAccess,false);
 assert.equal(b.architecturalIdentity.signalLightEnabled,false);
});
