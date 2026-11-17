import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_LANDMARK_SHOPS,M1_LANDMARK_SPECS} from '../../../src/building-pool/roadmap-2a/m1-landmark-shops.mjs';
import {M1_D4_AUDIT_ALL,inspect2AD4FloorDebt} from '../../../src/building-pool/roadmap-2a/m1-d4-debt-audit.mjs';
import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
const K=(x,y,z)=>x+','+y+','+z;
function floorMask(s){const set=new Set();for(const [a,b,c,d] of s.rects)for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)set.add(x+','+z);
 for(const [a,b,c,d] of s.cuts)for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)set.delete(x+','+z);return set;}
const floor=b=>b.voxels.filter(v=>v.y===1&&v.kind==='floor').map(v=>[v.x,v.z]);
function normalize(points){const x0=Math.min(...points.map(p=>p[0])),z0=Math.min(...points.map(p=>p[1]));return new Set(points.map(([x,z])=>(x-x0)+','+(z-z0)));}
function d4(p){const out=[];for(let mirror=0;mirror<2;mirror++)for(let rot=0;rot<4;rot++){
 const pt=p.map(([x0,z0])=>{let x=mirror?-x0:x0,z=z0;for(let n=0;n<rot;n++){const t=x;x=-z;z=t;}return [x,z]});out.push(normalize(pt));
}return out;}
const iou=(a,b)=>{let shared=0;for(const k of a)if(b.has(k))shared++;return shared/(a.size+b.size-shared);};
test('six new standalone non-cross landmarks preserve 92 earlier 2A designs, 98-source preserved cohort within 104, including 15 exact inherited stores',()=>{
 assert.equal(M1_LANDMARK_SPECS.length,6);assert.equal(M1_LANDMARK_SHOPS.length,6);
 assert.equal(M1_D4_AUDIT_ALL.length,128);assert.equal(inventory().authoredCandidateTotal,128);
 assert.equal(inventory().newlyAuthored,113);assert.equal(inventory().unwrittenNewCandidates,292);
 assert.equal(plannedSlots().filter(s=>s.authoredHere).length,128);
 assert.equal(assertDistinctArchitecture(M1_D4_AUDIT_ALL).distinctArchitectures,128);
 for(const b of M1_LANDMARK_SHOPS){assert(validateBlueprint(b).valid);assert.equal(b.rooms.length,4);
  assert.equal(b.numericIdsAssigned,false);assert.equal(b.worldPlaced,false);assert.equal(b.status,'authored-candidate');}
});
test('distinct shape source mask is losslessly placed in foundations, walkable floors and contour roofs, not a rectangular façade',()=>{
 for(let i=0;i<6;i++){
  const b=M1_LANDMARK_SHOPS[i],s=M1_LANDMARK_SPECS[i],mask=floorMask(s),root=b.voxels.filter(v=>v.y===s.h+1&&v.kind==='roof');
  const observed=new Set(floor(b).map(p=>p.join(','))),found=new Set(b.voxels.filter(v=>v.kind==='foundation'&&v.y===0).map(v=>v.x+','+v.z));
  assert.deepEqual(observed,mask,b.id+' actual floor differs from original noncross footprint');
  assert.deepEqual(found,mask,b.id+' actual foundation not weather-bound to floor');
  assert.deepEqual(new Set(root.map(v=>v.x+','+v.z)),mask,b.id+' source roof overlaps open-air courtyard');
  for(const [a,c,d,e] of s.cuts)for(let x=a;x<=c;x++)for(let z=d;z<=e;z++){
    assert(!b.voxels.some(v=>v.x===x&&v.z===z),b.id+' non-empty sky courtyard '+x+','+z);
  }
  assert(mask.size>950,b.id+' no substantial source-built landmark');
  assert(s.rects.length>=5&&s.cuts.length>=2);
 }
});
test('gable, sawtooth, tower and terrace form separate 3D pitched silhouettes with actual vertical roof support',()=>{
 for(let i=0;i<6;i++){
  const b=M1_LANDMARK_SHOPS[i],s=M1_LANDMARK_SPECS[i],vox=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v]));
  const heights=b.voxels.filter(v=>v.kind==='roof'&&v.y>s.h+1);
  assert(heights.length>250,b.id+' only flat roof or insufficient pitched sections');
  assert(new Set(heights.map(v=>v.architecturalRole)).size>=4,b.id+' missing independent roof sections');
  assert(new Set(heights.map(v=>v.roofStyle)).size>=3,b.id+' lacks multiple roof profiles');
  assert(Math.max(...heights.map(v=>v.y))>=s.h+6,b.id+' silhouette low');
  for(const v of heights)assert.equal(vox.get(K(v.x,v.y-1,v.z))?.kind,'roof',b.id+' floating roof cell '+K(v.x,v.y,v.z));
  const structuralPiers=b.voxels.filter(v=>v.y===2&&v.architecturalRole==='floor-founded-internal-roof-pier');
  assert(structuralPiers.length>=4,b.id+' no internal floor-founded roof supports');
  for(const v of structuralPiers)for(let y=3;y<=s.h;y++){
    assert.equal(vox.get(K(v.x,y,v.z))?.kind,'wall',b.id+' incomplete roof-bearing pier '+K(v.x,y,v.z));
  }
 }
});
test('all twenty-four room anchors are reachable with real producer-derived Pack5 fixture footprints',()=>{
 for(const b of M1_LANDMARK_SHOPS){
  const map=new Map(b.voxels.map(v=>[K(v.x,v.y,v.z),v])),blocked=new Set(b.voxels.filter(v=>v.y===2).map(v=>v.x+','+v.z));
  const occupancy=new Map();
  for(const v of b.voxels.filter(v=>v.kind==='fixture'&&v.material.startsWith('pack5:'))){
   const p=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing??'north'});
   assert(p.occupiedOffsets.length>0);
   for(const [dx,dy,dz] of p.occupiedOffsets){
    const x=v.x+dx,y=v.y+dy,z=v.z+dz,key=K(x,y,z),old=map.get(key);
    assert(!old||key===K(v.x,v.y,v.z)||old.kind==='floor',b.id+' producer footprint overlaps occupied solid '+key);
    assert.equal(map.get(K(x,1,z))?.kind,'floor',b.id+' producer item has no source floor support '+key);
    assert(!occupancy.has(key),b.id+' two fixtures share an occupied cell '+key);
    occupancy.set(key,v.material);blocked.add(x+','+z);
   }
  }
  const entry=b.openings.find(o=>o.type==='entrance');
  const queue=[[entry.x,1]],seen=new Set();
  for(let i=0;i<queue.length;i++){const [x,z]=queue[i],k=x+','+z;
   if(seen.has(k)||blocked.has(k)||x<0||x>=b.extents.x||z<0||z>=b.extents.z||
      map.get(K(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>map.has(K(x,y,z))))continue;
   seen.add(k);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
  }
  for(const room of b.rooms)assert(seen.has(room.access.join(',')),b.id+' room inaccessible with real Pack footprint: '+room.name+' '+room.access);
  assert(occupancy.size>=3,b.id+' has no real producer backed fixtures');
  if(b.category==='bank'){
   const gate=b.openings.find(o=>o.role==='vault-threshold');assert(gate);
   const shape=resolveManualFivePackAsset(gate.doorSymbol,{variant:gate.physicalVariant,orientation:gate.intendedFacing});
   assert.equal(shape.occupiedOffsets.length,2,b.id+' vault door must span two actual producer cells');
   for(const [dx,dy,dz] of shape.occupiedOffsets)for(let height=0;height<3;height++)
    assert(!map.has(K(gate.x+dx,gate.y+dy+height,gate.z+dz)),b.id+' two-leaf vault threshold obstructed');
  }
 }
});
test('strict whole-library D4 floor IoU <0.89 for each of the six new buildings; 269 inherited pairs unchanged',()=>{
 const all=M1_D4_AUDIT_ALL,forms=all.map(b=>({id:b.id,normal:normalize(floor(b))}));
 for(const bp of M1_LANDMARK_SHOPS){
  let closest='',max=0;
  const moves=d4(floor(bp));
  for(const other of forms)if(other.id!==bp.id){const n=Math.max(...moves.map(p=>iou(p,other.normal)));if(n>max){max=n;closest=other.id;}}
  assert(max<.89,bp.id+' near-clone of '+closest+' score '+max);
 }
 const debt=inspect2AD4FloorDebt();
 assert.equal(debt.sources,128);assert.equal(debt.protectedOriginals,74);assert.equal(debt.grandfatheredHighOverlapPairs,269);
 assert.equal(debt.exactMatchingFloorPairs,30);assert.equal(debt.newHighOverlapPairs,0);
});
test('reject detached no-source courtyard, blocked front entry and missing physical dependencies',()=>{
 const b=M1_LANDMARK_SHOPS[0],entry=b.openings.find(o=>o.type==='entrance');
 assert.throws(()=>validateBlueprint({...b,voxels:[...b.voxels,{x:entry.x,y:2,z:0,kind:'wall',material:'pack1:005'}]}),/blocked entrance/);
 assert.throws(()=>validateBlueprint({...b,unresolvedDependencies:[]}),/unresolved asset ABI/);
 const c=b.courtyardGeometry[0].bounds,solid={...b,voxels:[...b.voxels,{x:c[0],y:2,z:c[2],kind:'wall',material:'pack1:005'}]};
 const src=new Set(solid.voxels.map(v=>K(v.x,v.y,v.z)));
 assert.throws(()=>{for(let x=c[0];x<=c[1];x++)for(let z=c[2];z<=c[3];z++)for(let y=0;y<b.extents.y;y++)if(src.has(K(x,y,z)))throw Error('fake sky courtyard');},/fake sky courtyard/);
});
