import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_DISTINCT_WING_SHOPS,M1_DISTINCT_WING_SPECS} from '../../../src/building-pool/roadmap-2a/m1-distinct-wing-shops.mjs';
import {M1_D4_AUDIT_ALL,inspect2AD4FloorDebt} from '../../../src/building-pool/roadmap-2a/m1-d4-debt-audit.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
const k=(x,y,z)=>x+','+y+','+z;
function sourceMask(s){
 const pts=new Set();
 for(const [x0,x1,z0,z1] of s.rects)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)pts.add(x+','+z);
 for(const [x0,x1,z0,z1] of s.voids)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)pts.delete(x+','+z);
 return pts;
}
function reachable(b){
 const vox=new Map(b.voxels.map(v=>[k(v.x,v.y,v.z),v])),
  blocked=new Set(b.voxels.filter(v=>v.y===2).map(v=>v.x+','+v.z)),physicalAnchors=new Map();
 for(const v of b.voxels.filter(v=>v.kind==='fixture'&&v.material.startsWith('pack5:'))){
  const shape=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing??'north'});
  assert(shape.occupiedOffsets.length>0,b.id+' missing real producer footprint');
  for(const [dx,dy,dz] of shape.occupiedOffsets){
   const x=v.x+dx,y=v.y+dy,z=v.z+dz,at=k(x,y,z),prior=vox.get(at);
   assert(!prior||at===k(v.x,v.y,v.z)||prior.kind==='floor',b.id+' fixture intersects physical solid at '+at);
   assert.equal(vox.get(k(x,1,z))?.kind,'floor',b.id+' fixture unsupported at '+at);
   assert(!physicalAnchors.has(at),b.id+' two fixtures occupy '+at);
   physicalAnchors.set(at,v.material);blocked.add(x+','+z);
  }
 }
 const entry=b.openings.find(o=>o.type==='entrance'),todo=[[entry.x,1]],seen=new Set();
 assert(entry,b.id+' no entry');
 for(let n=0;n<todo.length;n++){
  const [x,z]=todo[n],at=x+','+z;
  if(x<0||z<0||x>=b.extents.x||z>=b.extents.z||seen.has(at)||blocked.has(at)||
   vox.get(k(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>vox.has(k(x,y,z))))continue;
  seen.add(at);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])todo.push([x+dx,z+dz]);
 }
 return {seen,vox,physicalAnchors};
}
function d4(points){
 const out=[];for(let mirror=0;mirror<2;mirror++)for(let r=0;r<4;r++){
  const moved=points.map(([x0,z0])=>{let x=mirror?-x0:x0,z=z0;for(let i=0;i<r;i++){const n=x;x=-z;z=n;}return[x,z]});
  const x0=Math.min(...moved.map(a=>a[0])),z0=Math.min(...moved.map(a=>a[1]));
  out.push(new Set(moved.map(([x,z])=>(x-x0)+','+(z-z0))));
 }return out;
}
const iou=(a,b)=>{let shared=0;for(const v of a)if(b.has(v))shared++;return shared/(a.size+b.size-shared)};
test('preserve 86 older sources and six distinct-wing blueprints as an unchanged 92-design cohort inside 98/420',()=>{
 assert.equal(M1_DISTINCT_WING_SHOPS.length,6);
 assert.equal(M1_DISTINCT_WING_SPECS.length,6);
 assert.equal(M1_D4_AUDIT_ALL.length,98);
 assert.equal(inventory().authoredCandidateTotal,98);
 assert.equal(inventory().newlyAuthored,83);
 assert.equal(inventory().unwrittenNewCandidates,322);
 assert.equal(plannedSlots().filter(x=>x.authoredHere).length,98);
 assert.equal(assertDistinctArchitecture(M1_D4_AUDIT_ALL).distinctArchitectures,98);
 for(const b of M1_DISTINCT_WING_SHOPS){
  assert(validateBlueprint(b).valid);
  assert.equal(b.worldPlaced,false);assert.equal(b.numericIdsAssigned,false);
  assert.equal(b.rooms.length,4);assert.equal(b.courtyardGeometry.length>=2,true);
 }
});
test('six original dissimilar L/C/H footprints have actual floor/foundation/roof/sky-void masks',()=>{
 const old=M1_D4_AUDIT_ALL.slice(0,86);
 assert.equal(old.length,86);
 const expectedFootprints=new Set();
 for(let i=0;i<6;i++){
  const b=M1_DISTINCT_WING_SHOPS[i],s=M1_DISTINCT_WING_SPECS[i],
  mask=sourceMask(s),base=new Set(b.voxels.filter(v=>v.kind==='floor'&&v.y===1).map(v=>v.x+','+v.z)),
  foundation=new Set(b.voxels.filter(v=>v.kind==='foundation'&&v.y===0).map(v=>v.x+','+v.z)),
  roof=new Set(b.voxels.filter(v=>v.kind==='roof'&&v.y===s.h+1).map(v=>v.x+','+v.z));
  assert.deepEqual(base,mask,b.id+' floor coordinates not source-authored');
  assert.deepEqual(foundation,mask,b.id+' foundation mismatch');
  assert.deepEqual(roof,mask,b.id+' base roof covers a true courtyard');
  for(const rect of s.voids)for(let x=rect[0];x<=rect[1];x++)for(let z=rect[2];z<=rect[3];z++){
   assert(!b.voxels.some(v=>v.x===x&&v.z===z),b.id+' void contains occupied source column '+x+','+z);
  }
  expectedFootprints.add([...base].sort().join(';'));
  assert(b.voxels.length>1000,b.id+' too little source geometry');
 }
 assert.equal(expectedFootprints.size,6);
});
test('architecturally varied ridge heights remain physically vertically supported; perimeter wall columns bear base roofs',()=>{
 for(let i=0;i<6;i++){
  const b=M1_DISTINCT_WING_SHOPS[i],s=M1_DISTINCT_WING_SPECS[i],cells=new Map(b.voxels.map(v=>[k(v.x,v.y,v.z),v])),
   elevated=b.voxels.filter(v=>v.kind==='roof'&&v.y>s.h+1);
  assert(elevated.length>200,b.id+' no actual pitched volume');
  assert(new Set(elevated.map(v=>v.architecturalRole)).size>=3,b.id+' roof masses not independently shaped');
  assert(Math.max(...elevated.map(v=>v.y))>=s.h+6,b.id+' low roof elevation');
  for(const v of elevated)assert.equal(cells.get(k(v.x,v.y-1,v.z))?.kind,'roof',b.id+' unsupported raised roof '+k(v.x,v.y,v.z));
  let rooted=0;
  for(const v of b.voxels.filter(v=>v.kind==='roof'&&v.y===s.h+1))if(cells.get(k(v.x,s.h,v.z))?.kind==='wall')rooted++;
  assert(rooted>55,b.id+' few vertically rooted roof bays');
  const piers=b.voxels.filter(v=>v.y===2&&v.architecturalRole==='floor-founded-internal-roof-support-pier');
  assert(piers.length>=2,b.id+' lacking internal supported aisle piers');
 }
});
test('every one of 24 new room access points truly walkable, with actual Pack5 occupied offsets, and double-leaf bank vault',()=>{
 for(const b of M1_DISTINCT_WING_SHOPS){
  const {seen,vox,physicalAnchors}=reachable(b);
  assert(physicalAnchors.size>=3,b.id+' producer physical fixtures missing');
  for(const r of b.rooms)assert(seen.has(r.access.join(',')),b.id+' inaccessible room '+r.name+' '+r.access);
  if(b.category==='bank'){
   const gate=b.openings.find(o=>o.role==='vault-threshold');
   assert(gate,'bank must author actual producer-backed vault gate');
   const asset=resolveManualFivePackAsset(gate.doorSymbol,{variant:gate.physicalVariant,orientation:gate.intendedFacing});
   assert.equal(asset.occupiedOffsets.length,2);
   for(const [dx,dy,dz] of asset.occupiedOffsets)for(let h=0;h<3;h++)
    assert(!vox.has(k(gate.x+dx,gate.y+dy+h,gate.z+dz)),b.id+' actual two-cell vault gate collides with solid');
   assert(seen.has('36,23'),'vault interior not reachable');
  }
 }
});
test('new six floorplates stay below strict 0.89 D4 near-duplicate IoU versus every 98 actual source building',()=>{
 const all=M1_D4_AUDIT_ALL;
 const forms=all.map(bp=>({id:bp.id,pts:new Set(bp.voxels.filter(v=>v.kind==='floor'&&v.y===1).map(v=>v.x+','+v.z))}));
 for(const bp of M1_DISTINCT_WING_SHOPS){
  const moves=d4(bp.voxels.filter(v=>v.kind==='floor'&&v.y===1).map(v=>[v.x,v.z]));
  let max=0,closest='';
  for(const other of forms)if(other.id!==bp.id){
   const overlap=Math.max(...moves.map(p=>iou(p,other.pts)));
   if(overlap>max){max=overlap;closest=other.id;}
  }
  assert(max<.89,bp.id+' too close to '+closest+' floor IoU '+max);
 }
 const d=inspect2AD4FloorDebt();
 assert.equal(d.sources,98);assert.equal(d.grandfatheredHighOverlapPairs,269);
 assert.equal(d.newHighOverlapPairs,0,'introduced floorplan overlap without baseline exception');
});
test('negative source mutations reject blocked door, duplicate occupied source, and altered physical dependency',()=>{
 const b=M1_DISTINCT_WING_SHOPS[0],door=b.openings.find(o=>o.type==='entrance');
 assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,{x:door.x,y:2,z:door.z,material:'pack1:005',kind:'wall'}]}),/blocked entrance/);
 const v=b.voxels[0];
 assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,{...v}]}),/overlapping voxel/);
 assert.throws(()=>validateBlueprint({...b,unresolvedDependencies:[]}),/unresolved asset ABI/);
});
