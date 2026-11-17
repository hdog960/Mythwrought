// Mythwrought Builder 1B M2L — nine individually source-authored SECOND variants.
// Never merge/deploy/register. Validate physical XYZ source rather than invented placeholders.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2LRegional1BPlans} from '../../../src/building-pool/roadmap-1b/m2l-regional-source.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';

const key=p=>p.join(',');
const newOnes=()=>getM2LRegional1BPlans();
const occupancy=b=>new Map(b.placements.map(p=>[key(p.at),p]));
function connected(b){
 const walk=new Set(b.walkable.map(key));
 const q=[b.walkable[0]],seen=new Set([key(q[0])]);
 for(let i=0;i<q.length;i++){
  const [x,y,z]=q[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const n=[x+dx,y,z+dz],id=key(n);
   if(walk.has(id)&&!seen.has(id)){seen.add(id);q.push(n);}
  }
 }
 return seen.size===walk.size;
}
function shape(b,flip,rotation){
 const out=new Set(),{width:w,depth:d}=b.footprint;
 for(const p of b.placements){
  let [x,y,z]=p.at;if(flip)x=w-1-x;
  if(rotation===1)[x,z]=[z,w-1-x];
  if(rotation===2)[x,z]=[w-1-x,d-1-z];
  if(rotation===3)[x,z]=[d-1-z,x];
  out.add([x,y,z,p.role].join('/'));
 }
 return out;
}
test('M2L 142/435 authored, 293 outstanding, unique 002 IDs, 15 untouched inherited originals',()=>{
 const all=get1BCandidates(),fresh=newOnes(),old=getInheritedStables(),v=validateAllocation(all);
 assert.equal(fresh.length,9);assert.equal(old.length,15);assert.equal(all.length,142);
 assert.equal(v.authored,142);assert.equal(v.remaining,293);
 assert.equal(new Set(all.map(b=>b.id)).size,142);
 assert.equal(new Set(all.map(structuralFingerprint)).size,142);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(c=>[c,all.filter(p=>p.category===c).length])),
  {bathhouse:20,stable:28,'farm-barn':19,greenhouse:20,'fishing-lodge':19,'harbor-office':18,lighthouse:18});
 for(const b of old)assert.equal(stableBlueprintJSON(all.find(p=>p.id===b.id)),stableBlueprintJSON(b),'changed inherited stable '+b.id);
 for(const c of Object.keys(QUOTAS))for(const biome of BIOMES)for(const size of SIZES)
  assert.ok(all.filter(b=>b.category===c&&b.biome===biome&&b.size===size).length<=QUOTAS[c],c+'/'+biome+'/'+size+' quota exceeded');
 for(const b of fresh){
  assert.equal(b.index,2,'new source not variant two');
  assert.ok(b.id.endsWith(':002'),b.id+' source identity collided with first variant');
  assert.equal(all.find(p=>p.id===b.id)?.title,b.title);
  assert.ok(all.some(p=>p.id===b.id.replace(/:002$/,':001')),'missing original first-variant peer');
 }
});
test('M2L independent nine complete 3D structures: connected rooms, 2-high portals and real supported multi-roofs',()=>{
 let vox=0;const physicalFamilies=new Set();
 for(const b of newOnes()){
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>=1800,b.id+' missing XYZ construction');
  vox+=b.placements.length;
  assert.ok(b.rooms.length>=4&&b.portals.length>=5&&b.walkable.length>=325,b.id+' deficient floor program');
  assert.ok(connected(b),b.id+' disconnected ground-source walking');
  const o=occupancy(b),foundation=b.placements.filter(p=>p.role==='foundation');
  const density=foundation.length/((b.footprint.width-2)*(b.footprint.depth-2));
  assert.ok(density>.35&&density<.85,b.id+' rectangular/source-less footprint density '+density);
  const profiles=new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile));
  assert.ok(profiles.size>=4,b.id+' repeated monolithic roof');
  const supported=b.placements.filter(p=>p.role==='support'&&o.get(key([p.at[0],p.at[1]+1,p.at[2]]))?.role==='roof');
  assert.ok(supported.length>=5,b.id+' roof without real bearing posts');
  for(const p of supported)assert.equal(o.get(key([p.at[0],0,p.at[2]]))?.role,'foundation',b.id+' post not grounded');
  for(const portal of b.portals){
   assert.ok(b.walkable.some(q=>key(q)===key(portal.at)),b.id+' nonwalkable portal');
   assert.ok(!o.has(key(portal.at))&&!o.has(key([portal.at[0],portal.at[1]+1,portal.at[2]])),b.id+' doorway headroom blocked');
  }
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'),b.id+' missing true source-cell Pack4 window');
  assert.ok(b.dependencies.some(d=>d.asset==='pack4:030'));
  assert.ok(b.dependencies.some(d=>/^pack[1235]:/.test(d.asset)));
  for(const d of b.dependencies){assert.equal(d.status,'unresolved');physicalFamilies.add(d.asset.slice(0,5));}
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.creatorArtApproved,false);
  assert.equal(b.architecturalIdentity.certifiedLoadPath,false);
 }
 assert.ok(vox>30000,'insufficient distinct authored source-cell volume');
 assert.deepEqual([...physicalFamilies].filter(x=>/^pack[1-5]$/.test(x)).sort(),['pack1','pack2','pack3','pack4','pack5']);
});
test('M2L strict source-role XYZ D4 eight-way near-duplicate rejection vs all 142 candidates',()=>{
 const all=get1BCandidates();
 for(const b of newOnes()){
  const first=shape(b,false,0);
  for(const other of all){
   if(b.id===other.id||b.category!==other.category)continue;
   for(const flip of [false,true])for(let rot=0;rot<4;rot++){
    const second=shape(other,flip,rot);
    if(Math.abs(first.size-second.size)>Math.max(first.size,second.size)*.25)continue;
    let common=0;for(const p of first)if(second.has(p))common++;
    const iou=common/(first.size+second.size-common);
    assert.ok(iou<.89,'D4 source near-copy '+b.id+' vs '+other.id+' IoU='+iou.toFixed(4));
   }
  }
 }
});
test('M2L second variant bathhouses and granaries have actual absent courtyard foundations',()=>{
 const find=name=>occupancy(newOnes().find(b=>b.title===name));
 assert.ok(!find('Wrenstep Reed-Braid Bath Gallery').has('12,0,13'));
 assert.ok(!find('Whitefall Horseshoe Thermal Archive').has('17,0,16'));
 assert.ok(!find('Sunbreak Serrated Granary').has('14,0,12'));
 assert.ok(!find('Glimmerroot Staggered Canopy Barn').has('18,0,18'));
});
test('M2L glasshouses and dock registry have independently absent-source center courts',()=>{
 const find=name=>occupancy(newOnes().find(b=>b.title===name));
 assert.ok(!find('Cragsprig Sheltered Fern Switchback').has('13,0,13'));
 assert.ok(!find('Frostveil Twin-Courtyard Seed Library').has('21,0,17'));
 assert.ok(!find('Saltwind Off-Axis Dry Quay Guild').has('20,0,17'));
 assert.ok(!find('Reedmark Folded Canal Ledger').has('12,0,14'));
});
test('M2L Peakbind uses a supported multi-cap authored mountain beacon and no fake tower access',()=>{
 const b=newOnes().find(p=>p.category==='lighthouse'),o=occupancy(b);
 assert.equal(b.index,2);assert.equal(b.id,'r1:lighthouse:mountain:large:002');
 const walls=b.placements.filter(p=>p.towerProfile),caps=b.placements.filter(p=>p.beaconCap);
 assert.equal(new Set(walls.map(p=>p.towerProfile)).size,2);
 assert.ok(caps.length>=400&&walls.length>=150);
 for(const p of walls.filter(p=>[10,24].includes(p.at[1])))
  assert.equal(o.get(key([p.at[0],p.at[1]-1,p.at[2]]))?.role,'roof','unsupported top tower wall '+key(p.at));
 assert.equal(b.architecturalIdentity.upperTowerAccess,false);
 assert.equal(b.architecturalIdentity.signalLightEnabled,false);
});
