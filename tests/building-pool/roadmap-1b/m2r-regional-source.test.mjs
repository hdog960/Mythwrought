// M2R: six independent, source-coordinate authored variant 003 service buildings.
// No physical Pack ABI approval, live placement, gameplay, new save ABI, or creator art sign-off.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2RRegional1BPlans} from '../../../src/building-pool/roadmap-1b/m2r-regional-source.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
const K=p=>p.join(',');
const cells=b=>new Map(b.placements.map(p=>[K(p.at),p]));
const newBatch=()=>getM2RRegional1BPlans();
function d4(p,flip,turn){
 const s=new Set(),{width:w,depth:d}=p.footprint;
 for(const voxel of p.placements){
  let [x,y,z]=voxel.at;
  if(flip)x=w-1-x;
  if(turn===1)[x,z]=[z,w-1-x];
  if(turn===2)[x,z]=[w-1-x,d-1-z];
  if(turn===3)[x,z]=[d-1-z,x];
  s.add([x,y,z,voxel.role].join('/'));
 }
 return s;
}
test('M2R is 169/435 unique original authored candidates; 15 source-exact inherited stables are unchanged',()=>{
 const all=get1BCandidates(),fresh=newBatch(),old=getInheritedStables(),c=validateAllocation(all);
 assert.equal(all.length,169);assert.equal(c.authored,169);assert.equal(c.remaining,266);
 assert.equal(fresh.length,6);assert.equal(old.length,15);
 assert.equal(new Set(all.map(p=>p.id)).size,169);
 assert.equal(new Set(all.map(structuralFingerprint)).size,169);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(category=>
  [category,all.filter(p=>p.category===category).length])),
  {bathhouse:24,stable:33,'farm-barn':23,greenhouse:24,'fishing-lodge':22,'harbor-office':21,lighthouse:22});
 for(const item of old)
  assert.equal(stableBlueprintJSON(all.find(p=>p.id===item.id)),stableBlueprintJSON(item),item.id+' original source mutated');
 for(const category of Object.keys(QUOTAS))for(const biome of BIOMES)for(const size of SIZES)
  assert.ok(all.filter(p=>p.category===category&&p.biome===biome&&p.size===size).length<=QUOTAS[category],
   category+'/'+biome+'/'+size+' quota breach');
 for(const p of fresh){
  assert.equal(p.index,3);assert.ok(p.id.endsWith(':003'));
  assert.equal(all.find(x=>x.id===p.id)?.title,p.title);
  assert.ok(all.find(x=>x.id===p.id.replace(':003',':001')),p.id+' first source absent');
  assert.ok(all.find(x=>x.id===p.id.replace(':003',':002')),p.id+' second source absent');
 }
});
test('All six M2R 3D authored silhouettes have genuinely empty courts, connected two-high floor paths, roof bearing and symbolic Packs',()=>{
 const families=new Set();let volume=0;
 for(const b of newBatch()){
  assert.equal(validateBlueprint(b),true);
  volume+=b.placements.length;
  assert.ok(b.placements.length>2400,b.id+' not enough source xyz geometry');
  assert.ok(b.walkable.length>=400,b.id+' missing broad connected floor');
  assert.ok(b.rooms.length>=7&&b.portals.length>=8,b.id+' insufficient independent room routes');
  const map=cells(b),ground=b.placements.filter(p=>p.role==='foundation'),
   density=ground.length/((b.footprint.width-2)*(b.footprint.depth-2));
  assert.ok(density>.28&&density<.88,b.id+' unconvincing nonrectangular density '+density);
  const roofs=b.placements.filter(p=>p.role==='roof'),profiles=new Set(roofs.map(p=>p.roofProfile));
  assert.ok(profiles.size>=6,b.id+' does not have six real roof zones');
  assert.ok(Math.max(...roofs.map(p=>p.at[1]))-Math.min(...roofs.map(p=>p.at[1]))>=7,
   b.id+' insufficient silhouette height contrast');
  const bearing=b.placements.filter(p=>p.role==='support'&&map.get(K([p.at[0],p.at[1]+1,p.at[2]]))?.role==='roof');
  assert.ok(bearing.length>=6,b.id+' no real grounded roof witness');
  for(const p of bearing)
   assert.equal(map.get(K([p.at[0],0,p.at[2]]))?.role,'foundation',b.id+' ungrounded post '+p.at);
  for(const portal of b.portals){
   assert.ok(b.walkable.some(p=>K(p)===K(portal.at)),b.id+' portal not walkable');
   assert.ok(!map.has(K(portal.at))&&!map.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),
    b.id+' portal two-high obstruction '+portal.at);
  }
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'),b.id+' no physical Pack4 candidate source');
  assert.ok(b.dependencies.some(d=>d.asset==='pack4:030'));
  for(const dep of b.dependencies){assert.equal(dep.status,'unresolved');families.add(dep.asset.slice(0,5));}
  assert.equal(b.architecturalIdentity.certifiedLoadPath,false);
  assert.equal(b.architecturalIdentity.creatorArtApproved,false);
  assert.equal(b.architecturalIdentity.pack4GlazingApproved,false);
  assert.equal(b.architecturalIdentity.orientationYawApproved,false);
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
 }
 assert.ok(volume>20000,'M2R has insufficient new source cells');
 assert.deepEqual([...families].filter(x=>/^pack[1-5]$/.test(x)).sort(),['pack1','pack2','pack3','pack4','pack5']);
});
test('M2R each new source XYZ role geometry rejects eight-way D4 near copies below strict 0.89 IoU',()=>{
 const all=get1BCandidates();
 for(const b of newBatch()){
  const original=d4(b,false,0);
  for(const other of all){
   if(other.id===b.id||other.category!==b.category)continue;
   for(const mirror of [false,true])for(let rot=0;rot<4;rot++){
    const rotated=d4(other,mirror,rot);
    if(Math.abs(rotated.size-original.size)>Math.max(rotated.size,original.size)*.25)continue;
    let overlap=0;for(const k of original)if(rotated.has(k))overlap++;
    const iou=overlap/(original.size+rotated.size-overlap);
    assert.ok(iou<.89,b.id+' D4 near copy '+other.id+' '+mirror+'/'+rot+' IoU='+iou);
   }
  }
 }
});
test('M2R six designs show real source-unbuilt negative ground and nonidentical high/low wings',()=>{
 const byName=Object.fromEntries(newBatch().map(x=>[x.title,x]));
 for(const [title,voidAt,backAt] of [
  ['Dunewave Cleft Arcade Baths',[21,20],[20,33]],
  ['Whitehook Crooked-Hook Winter Granary',[25,15],[30,40]],
  ['Starfield Forklight Conservatory',[23,16],[30,40]],
  ['Tideknife Twin-Landing Icefish Hall',[23,24],[30,47]],
  ['Copperleaf Zigzag Customs Registry',[23,15],[30,38]],
  ['Wispcrest Counterweight Moon Beacon',[22,24],[20,42]]
 ]){
  const b=byName[title];assert.ok(b,title+' missing');
  const c=cells(b);
  assert.ok(!c.has(K([voidAt[0],0,voidAt[1]])),title+' sky void covered by foundation');
  assert.equal(c.get(K([backAt[0],0,backAt[1]]))?.role,'foundation',title+' separate rear source missing');
  assert.ok(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile)).size>=6);
 }
});
test('M2R Wispcrest tiered beacon real caps carry each start wall ring; no claimed light or upper navigation',()=>{
 const b=newBatch().find(p=>p.title==='Wispcrest Counterweight Moon Beacon'),m=cells(b);
 assert.equal(b.id,'r1:lighthouse:enchanted-forest:small:003');
 const caps=b.placements.filter(p=>p.beaconCap),walls=b.placements.filter(p=>p.towerProfile);
 assert.ok(caps.length>450);
 assert.equal(new Set(walls.map(p=>p.towerProfile)).size,2);
 for(const p of walls.filter(p=>[10,24].includes(p.at[1])))
  assert.equal(m.get(K([p.at[0],p.at[1]-1,p.at[2]]))?.role,'roof',b.id+' unsupported new tower tier '+p.at);
 assert.equal(b.architecturalIdentity.upperTowerAccess,false);
 assert.equal(b.architecturalIdentity.signalLightEnabled,false);
});
