// Mythwrought Builder 1B M2O -- six independently authored second variants.
// These are source-voxel proofs, not Pack1-5 producer approval or live registration.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2ORegional1BPlans} from '../../../src/building-pool/roadmap-1b/m2o-regional-source.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,QUOTAS,BIOMES,SIZES} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';

const key=p=>p.join(',');
const fresh=()=>getM2ORegional1BPlans();
const indexed=b=>new Map(b.placements.map(p=>[key(p.at),p]));
function connected(b){
 const walk=new Set(b.walkable.map(key));
 const q=[b.walkable[0]],visited=new Set([key(q[0])]);
 for(let i=0;i<q.length;i++){
  const [x,y,z]=q[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const dest=[x+dx,y,z+dz],id=key(dest);
   if(walk.has(id)&&!visited.has(id)){visited.add(id);q.push(dest);}
  }
 }
 return visited.size===walk.size;
}
function d4(b,mirror,turn){
 const set=new Set(),{width:w,depth:d}=b.footprint;
 for(const p of b.placements){
  let [x,y,z]=p.at;if(mirror)x=w-1-x;
  if(turn===1)[x,z]=[z,w-1-x];
  if(turn===2)[x,z]=[w-1-x,d-1-z];
  if(turn===3)[x,z]=[d-1-z,x];
  set.add([x,y,z,p.role].join('/'));
 }
 return set;
}
test('M2O census 158/435; six new variant 002 source blueprints, 15 inherited stables byte-exact',()=>{
 const all=get1BCandidates(),prev=getInheritedStables(),next=fresh(),a=validateAllocation(all);
 assert.equal(all.length,158);assert.equal(a.authored,158);assert.equal(a.remaining,277);
 assert.equal(prev.length,15);assert.equal(next.length,6);
 assert.equal(new Set(all.map(x=>x.id)).size,158);
 assert.equal(new Set(all.map(structuralFingerprint)).size,158);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(c=>[c,all.filter(x=>x.category===c).length])),
  {bathhouse:23,stable:28,'farm-barn':22,greenhouse:23,
   'fishing-lodge':21,'harbor-office':20,lighthouse:21});
 for(const x of prev)assert.equal(stableBlueprintJSON(all.find(p=>p.id===x.id)),stableBlueprintJSON(x),
  x.id+' inherited source changed');
 for(const c of Object.keys(QUOTAS))for(const bio of BIOMES)for(const size of SIZES){
  assert.ok(all.filter(p=>p.category===c&&p.biome===bio&&p.size===size).length<=QUOTAS[c],c+'/'+bio+'/'+size);
 }
 for(const b of next){
  assert.equal(b.index,2);assert.ok(b.id.endsWith(':002'));
  assert.ok(all.some(x=>x.id===b.id.replace(/:002$/,':001')),b.id+' missing protected original');
  assert.equal(all.find(x=>x.id===b.id)?.title,b.title);
 }
});
test('M2O six nonrectangular real coordinate sources: multi-roofs, accessible rooms, bearing posts and unresolved Pack1-5',()=>{
 let volume=0;const families=new Set();
 for(const b of fresh()){
  assert.equal(validateBlueprint(b),true,b.id);
  volume+=b.placements.length;
  assert.ok(b.placements.length>=2200&&b.walkable.length>=420,b.id+' geometry too small');
  assert.ok(b.rooms.length>=6&&b.portals.length>=7,b.id+' missing walkable room program');
  assert.ok(connected(b),b.id+' disconnected ground circulation');
  const cells=indexed(b),foundation=b.placements.filter(p=>p.role==='foundation');
  const density=foundation.length/((b.footprint.width-2)*(b.footprint.depth-2));
  assert.ok(density>.25&&density<.87,b.id+' rectangular slab or sparse foundation '+density);
  const roofs=new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile));
  assert.ok(roofs.size>=6,b.id+' lacks six distinctly authored roof regions');
  const posts=b.placements.filter(p=>p.role==='support'&&cells.get(key([p.at[0],p.at[1]+1,p.at[2]]))?.role==='roof');
  assert.ok(posts.length>=6,b.id+' lacks roof bearing columns');
  for(const p of posts)assert.equal(cells.get(key([p.at[0],0,p.at[2]]))?.role,'foundation',b.id+' floating column');
  for(const door of b.portals){
   assert.ok(b.walkable.some(p=>key(p)===key(door.at)),b.id+' inaccessible doorway');
   assert.ok(!cells.has(key(door.at))&&!cells.has(key([door.at[0],door.at[1]+1,door.at[2]])),
    b.id+' two-high headroom blocked');
  }
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'),b.id+' missing producer-facing glass sample');
  assert.ok(b.dependencies.some(p=>p.asset==='pack4:030'));
  assert.ok(b.dependencies.some(p=>/^pack[1235]:/.test(p.asset)));
  for(const dep of b.dependencies){assert.equal(dep.status,'unresolved');families.add(dep.asset.slice(0,5));}
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.creatorArtApproved,false);
  assert.equal(b.architecturalIdentity.certifiedLoadPath,false);
 }
 assert.ok(volume>27000,'M2O must author substantial XYZ occupied physical volume');
 assert.deepEqual([...families].filter(f=>/^pack[1-5]$/.test(f)).sort(),['pack1','pack2','pack3','pack4','pack5']);
});
test('M2O all eight D4 XYZ-role transformations reject duplicates and near-copies below 0.89',()=>{
 const all=get1BCandidates();
 for(const b of fresh()){
  const a=d4(b,false,0);
  for(const other of all){
   if(b.id===other.id||b.category!==other.category)continue;
   for(const flip of [false,true])for(let rot=0;rot<4;rot++){
    const transformed=d4(other,flip,rot);
    if(Math.abs(a.size-transformed.size)>Math.max(a.size,transformed.size)*.25)continue;
    let matches=0;for(const cell of a)if(transformed.has(cell))matches++;
    const iou=matches/(a.size+transformed.size-matches);
    assert.ok(iou<.89,b.id+' D4 near-duplicate '+other.id+' '+iou.toFixed(4));
   }
  }
 }
});
test('M2O baths, silo and mountain greenhouse expose actual missing-ground courtyards',()=>{
 const by=n=>indexed(fresh().find(p=>p.title===n));
 assert.ok(!by('Rimewheel Cross-Court Snow Thermae').has('18,0,14'));
 assert.ok(!by('Duneshift Crooked Grain Silo').has('14,0,12'));
 assert.ok(!by('Skyterrace Seven-Range Cliff Conservatory').has('25,0,17'));
 assert.ok(by('Rimewheel Cross-Court Snow Thermae').has('18,0,28'));
 assert.ok(by('Skyterrace Seven-Range Cliff Conservatory').has('23,0,46'));
});
test('M2O twin fishing quay and split forest customs physically preserve open courtyards and distinct entrances',()=>{
 const fish=fresh().find(p=>p.title==='Tidegate Twin-Quay Fisher Cooperative');
 const office=fresh().find(p=>p.title==='Rootcourt Split-Canal Forest Registry');
 assert.ok(!indexed(fish).has('22,0,7')&&!indexed(fish).has('16,0,18'));
 assert.ok(!indexed(office).has('19,0,19'));
 assert.ok(!indexed(office).has('16,0,36'));
 assert.equal(fish.portals.filter(p=>p.from==='outside').length,2,'two real independent dock entrances');
 assert.ok(connected(fish)&&connected(office),'each must have connected two-high circulation');
});
test('M2O Frostneedle snow beacon has physically supported multi-stage source caps without false upper access',()=>{
 const b=fresh().find(p=>p.category==='lighthouse'),o=indexed(b);
 assert.equal(b.id,'r1:lighthouse:snow:large:002');
 const walls=b.placements.filter(p=>p.towerProfile),caps=b.placements.filter(p=>p.beaconCap);
 assert.equal(new Set(walls.map(p=>p.towerProfile)).size,2);
 assert.ok(walls.length>=150&&caps.length>=400,b.id+' no source high cap');
 for(const p of walls.filter(p=>[10,26].includes(p.at[1])))
  assert.equal(o.get(key([p.at[0],p.at[1]-1,p.at[2]]))?.role,'roof',b.id+' floating beacon tower wall');
 assert.equal(b.architecturalIdentity.upperTowerAccess,false);
 assert.equal(b.architecturalIdentity.signalLightEnabled,false);
});
