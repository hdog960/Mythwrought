// Builder 1B M2S: five original second-variant stables, independently grounded XYZ-source audits.
// Symbolic Pack sources are NOT real physical AABB/collider/yaw/opaque-glazing certification.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getM2SRegionalStable1BPlans} from '../../../src/building-pool/roadmap-1b/m2s-regional-stables.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,BIOMES,SIZES,QUOTAS} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const K=p=>p.join(',');
const fresh=()=>getM2SRegionalStable1BPlans();
const occupancy=b=>new Map(b.placements.map(p=>[K(p.at),p]));
function d4(b,mirror,rotation){
 const out=new Set(),{width:w,depth:d}=b.footprint;
 for(const p of b.placements){let[x,y,z]=p.at;if(mirror)x=w-1-x;
  if(rotation===1)[x,z]=[z,w-1-x];
  if(rotation===2)[x,z]=[w-1-x,d-1-z];
  if(rotation===3)[x,z]=[d-1-z,x];
  out.add([x,y,z,p.role].join('/'));
 }
 return out;
}
test('M2S exact 169/435 census, five collision-free new stable IDs and unchanged 15 original source-exact stables',()=>{
 const all=get1BCandidates(),newer=fresh(),prior=getInheritedStables(),n=validateAllocation(all);
 assert.equal(all.length,169);assert.equal(n.authored,169);assert.equal(n.remaining,266);
 assert.equal(newer.length,5);assert.equal(prior.length,15);
 assert.equal(new Set(all.map(x=>x.id)).size,169);
 assert.equal(new Set(all.map(structuralFingerprint)).size,169);
 assert.deepEqual(Object.fromEntries(Object.keys(QUOTAS).map(c=>[c,all.filter(x=>x.category===c).length])),
  {bathhouse:24,stable:33,'farm-barn':23,greenhouse:24,'fishing-lodge':22,'harbor-office':21,lighthouse:22});
 for(const p of prior)assert.equal(stableBlueprintJSON(all.find(q=>q.id===p.id)),stableBlueprintJSON(p),
  p.id+' inherited PR #121 building changed');
 for(const category of Object.keys(QUOTAS))for(const biome of BIOMES)for(const size of SIZES)
  assert.ok(all.filter(x=>x.category===category&&x.biome===biome&&x.size===size).length<=QUOTAS[category]);
 for(const b of newer){
  const expectedIndex=b.size==='medium'?5:2;
  assert.equal(b.index,expectedIndex);assert.ok(b.id.endsWith(':'+String(expectedIndex).padStart(3,'0')));assert.equal(b.category,'stable');
  assert.ok(prior.some(x=>x.category==='stable'&&x.biome===b.biome&&x.size===b.size),b.id+' inherited original stable missing');
  assert.equal(all.find(x=>x.id===b.id)?.title,b.title);
 }
});
test('M2S five independently authored actual voxel stables: grounded source posts, seven diverse roofs, 2-high rooms, unresolved Pack ABI',()=>{
 let sourceCount=0;const packFamilies=new Set();
 for(const b of fresh()){
  assert.equal(validateBlueprint(b),true);
  sourceCount+=b.placements.length;
  assert.ok(b.placements.length>=3500,b.id+' missing authored coordinate geometry');
  assert.ok(b.walkable.length>=700,b.id+' underbuilt walkable footprint');
  assert.ok(b.rooms.length>=9&&b.portals.length>=10,b.id+' insufficient genuine regional stable rooms');
  const map=occupancy(b),foundations=b.placements.filter(p=>p.role==='foundation');
  const density=foundations.length/((b.footprint.width-2)*(b.footprint.depth-2));
  assert.ok(density>.29&&density<.8,b.id+' nonrectangular courtyard not present: '+density);
  const roof=b.placements.filter(p=>p.role==='roof'),profiles=new Set(roof.map(p=>p.roofProfile));
  assert.ok(profiles.size>=7,b.id+' lacks seven distinct authored roof zones');
  const heights=roof.map(p=>p.at[1]);
  assert.ok(Math.max(...heights)-Math.min(...heights)>=7,b.id+' low/high roof contrast not real');
  const posts=b.placements.filter(p=>p.role==='support'&&map.get(K([p.at[0],p.at[1]+1,p.at[2]]))?.role==='roof');
  assert.ok(posts.length>=8,b.id+' missing source-grounded roof piers');
  for(const p of posts)assert.equal(map.get(K([p.at[0],0,p.at[2]]))?.role,'foundation',b.id+' load post lacks real foundation');
  assert.ok(b.placements.filter(p=>p.role==='partition').length>=40,b.id+' stall divides are only metadata');
  const walk=new Set(b.walkable.map(K));
  for(const portal of b.portals){
   assert.ok(walk.has(K(portal.at)),b.id+' portal not physically reachable');
   assert.ok(!map.has(K(portal.at))&&!map.has(K([portal.at[0],portal.at[1]+1,portal.at[2]])),
    b.id+' 2-high portal obstructed');
  }
  for(const room of b.rooms){
   assert.ok(b.walkable.some(([x,y,z])=>x>=room.min[0]&&x<=room.max[0]&&z>=room.min[2]&&z<=room.max[2]),
    b.id+' room has no physically standable source cells '+room.id);
  }
  assert.ok(b.placements.some(p=>p.role==='window'&&p.asset==='pack4:030'));
  assert.ok(b.dependencies.some(p=>p.asset==='pack4:030'));
  assert.ok(b.dependencies.some(p=>/^pack[1235]:/.test(p.asset)));
  for(const dep of b.dependencies){assert.equal(dep.status,'unresolved');packFamilies.add(dep.asset.slice(0,5));}
  assert.equal(b.architecturalIdentity.creatorArtApproved,false);
  assert.equal(b.architecturalIdentity.certifiedLoadPath,false);
  assert.equal(b.architecturalIdentity.physicalPackProducerABIApproved,false);
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
 }
 assert.ok(sourceCount>=23000,'five M2S stables were not substantially coordinate-authored');
 assert.deepEqual([...packFamilies].filter(x=>/^pack[1-5]$/.test(x)).sort(),['pack1','pack2','pack3','pack4','pack5']);
});
test('M2S all five stables reject each of eight source-role XYZ D4 near copies below strict 0.89 IoU',()=>{
 const all=get1BCandidates();
 for(const b of fresh()){
  const shape=d4(b,false,0);
  for(const other of all){
   if(other.id===b.id||other.category!==b.category)continue;
   for(const mirror of [false,true])for(let turn=0;turn<4;turn++){
    const t=d4(other,mirror,turn);
    if(Math.abs(shape.size-t.size)>Math.max(shape.size,t.size)*.25)continue;
    let overlap=0;for(const v of shape)if(t.has(v))overlap++;
    const iou=overlap/(shape.size+t.size-overlap);
    assert.ok(iou<.89,b.id+' near duplicate '+other.id+' D4 '+mirror+'/'+turn+' IoU='+iou);
   }
  }
 }
});
test('M2S sky-open courtyards really have absent ground, surrounded by separately grounded rear stable wings',()=>{
 const gaps={
  'Cloverhollow Horseshoe Livery':[[21,16],[22,35]],
  'Saffron Seven-Court Caravan Stable':[[24,16],[19,50]],
  'Hoarcurve Fold-Back Mule Yard':[[20,14],[19,35]],
  'Brambleclasp Twin-Bough Livery':[[23,16],[20,40]],
  'Basaltwind Split-Ridge Packhouse':[[26,17],[25,45]]
 };
 for(const b of fresh()){
  const m=occupancy(b),[gap,back]=gaps[b.title];
  assert.ok(!m.has(K([gap[0],0,gap[1]])),b.id+' fake covered courtyard');
  assert.equal(m.get(K([back[0],0,back[1]]))?.role,'foundation',b.id+' rear return not physically grounded');
 }
});
test('M2S two-wide pen doors are physically flanked by real 4-high partitions and preserve two-high passage',()=>{
 const divides={
  'Cloverhollow Horseshoe Livery':[[18,8,9],[17,34,35]],
  'Saffron Seven-Court Caravan Stable':[[20,9,10],[19,39,40]],
  'Hoarcurve Fold-Back Mule Yard':[[18,8,9],[17,32,33]],
  'Brambleclasp Twin-Bough Livery':[[21,9,10],[20,35,36]],
  'Basaltwind Split-Ridge Packhouse':[[24,10,11],[20,42,43]]
 };
 for(const b of fresh()){
  const m=occupancy(b);
  for(const [z,x0,x1] of divides[b.title]){
   for(const x of [x0,x1])for(const y of [1,2])
    assert.ok(!m.has(K([x,y,z])),b.id+' real stall aperture blocked '+x+'/'+z);
   for(const x of [x0-1,x1+1])for(let y=1;y<=4;y++)
    assert.ok(['partition','wall'].includes(m.get(K([x,y,z]))?.role),
      b.id+' pen wall not enclosing two-wide door '+x+'/'+z+'/'+y);
  }
 }
});
test('M2S stable variants remain deterministic in all authored XYZ, portals and unresolved dependencies',()=>{
 for(const b of fresh()){
  assert.equal(stableBlueprintJSON(b),stableBlueprintJSON(fresh().find(x=>x.id===b.id)),
   b.id+' nondeterministic rebuilt source');
  assert.equal(b.architecturalIdentity.stableAnimalsDisabled,true);
  assert.equal(b.architecturalIdentity.hardwareIphoneApproved,false);
 }
});
