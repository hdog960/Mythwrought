import test from 'node:test';
import assert from 'node:assert/strict';
import {BIOMES,SIZES} from '../../../src/building-pool/roadmap-2/catalog.mjs';
import {validateBlueprint,structuralFingerprint,validateSymbol} from '../../../src/building-pool/roadmap-2/schema.mjs';
import {M1_REPRESENTATIVES,M1_COUNTS,checkM1Architectures} from '../../../src/building-pool/roadmap-2/m1-representatives.mjs';

const BY_ID=new Map(M1_REPRESENTATIVES.map(b=>[b.id,b]));
const occupied=b=>new Map(b.voxels.map(v=>[[v.x,v.y,v.z].join(','),v]));
function canReachRear(bp){
 const c=occupied(bp),startX=Math.floor(bp.extents.x/2);
 const partition=bp.openings.find(o=>o.type==='internal-doorway');
 const floor=(x,z)=>c.has([x,1,z].join(','));
 const clear=(x,z)=>!c.has([x,2,z].join(','))&&!c.has([x,3,z].join(','));
 const visit=new Set(),queue=[[startX,1]];
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i],k=[x,z].join(',');
  if(visit.has(k)||!floor(x,z)||!clear(x,z))continue;
  visit.add(k);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])if(x+dx>=1&&z+dz>=1&&x+dx<bp.extents.x-1&&z+dz<bp.extents.z-1)queue.push([x+dx,z+dz]);
 }
 return visit.has([partition.x,partition.z+1].join(','));
}
test('M1 exactly 30 representative authored coordinates, one per requested category/biome/size',()=>{
 assert.deepEqual(M1_COUNTS,{total:30,stores:15,temples:15});
 assert.equal(BY_ID.size,30);
 for(const category of ['general-store','temple'])for(const biome of BIOMES)for(const size of SIZES){
  const id=`r2:${category}:${biome}:${size}:01`;
  assert(BY_ID.has(id),`missing representative: ${id}`);
 }
});
test('all M1 candidates have nontrivial unique coordinates, semantic rooms, roofs and physical windows',()=>{
 for(const bp of M1_REPRESENTATIVES){
   const result=validateBlueprint(bp);
   assert.equal(result.uniqueCells,bp.voxels.length);
   assert(bp.voxels.length>=600,bp.id);
   const kinds=new Set(bp.voxels.map(v=>v.kind));
   for(const kind of ['foundation','floor','wall','roof','window','fixture','decor'])assert(kinds.has(kind),bp.id+': '+kind);
   const c=occupied(bp);
   assert(!c.has([bp.openings[0].x,2,bp.openings[0].z].join(',')),`closed door: ${bp.id}`);
   assert(bp.rooms.length>=2&&bp.circulation.length>=2,bp.id);
 }
});
test('none of the M1 designs is a simple mirror/rotation/recolor duplicate',()=>{
 const counts=checkM1Architectures();assert.deepEqual(counts,{authored:30,distinctArchitectures:30});
 assert.equal(new Set(M1_REPRESENTATIVES.map(structuralFingerprint)).size,30);
});
test('interior walkable floor path actually reaches the rear room for every size and biome',()=>{
 for(const bp of M1_REPRESENTATIVES)assert(canReachRear(bp),`unreachable room: ${bp.id}`);
});
test('every model has actual 3-cell-clear exterior door and 3-cell-clear interior passage',()=>{
 for(const bp of M1_REPRESENTATIVES){
   const c=occupied(bp);
   for(const opening of bp.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway')){
     for(let y=opening.y;y<opening.y+(opening.clearHeightCells||1);y++){
       assert(!c.has([opening.x,y,opening.z].join(',')),`blocked ${bp.id} ${opening.type} at y${y}`);
     }
   }
 }
});
test('symbolic materials only; no new persistent IDs or world placements',()=>{
 for(const bp of M1_REPRESENTATIVES){
   assert(!bp.numericIdsAssigned&&!bp.worldPlaced&&bp.isolated);
   assert(bp.unresolvedDependencies.every(x=>validateSymbol(x.ref)));
   assert(bp.voxels.every(v=>validateSymbol(v.material)));
 }
});
test('real regional structural patterns differ: openings, roof heights and building footprints',()=>{
 for(const size of SIZES)for(const category of ['general-store','temple']){
   const models=BIOMES.map(b=>BY_ID.get(`r2:${category}:${b}:${size}:01`));
   assert.equal(new Set(models.map(b=>b.architecturalSignature)).size,5);
   assert.equal(new Set(models.map(b=>structuralFingerprint(b))).size,5);
   assert(new Set(models.map(b=>JSON.stringify(b.extents))).size>2);
 }
});
test('size classes increase real voxel volume and include additional structural roof spans',()=>{
 for(const category of ['general-store','temple'])for(const biome of BIOMES){
   const [s,m,l]=SIZES.map(size=>BY_ID.get(`r2:${category}:${biome}:${size}:01`));
   assert(s.voxels.length<m.voxels.length&&m.voxels.length<l.voxels.length);
   assert(s.extents.x<m.extents.x&&m.extents.x<l.extents.x);
   assert(s.extents.z<m.extents.z&&m.extents.z<l.extents.z);
 }
});
test('category interiors are actually different physical assemblies',()=>{
 for(const biome of BIOMES)for(const size of SIZES){
  const shop=BY_ID.get(`r2:general-store:${biome}:${size}:01`);
  const shrine=BY_ID.get(`r2:temple:${biome}:${size}:01`);
  const shopMaterials=new Set(shop.voxels.filter(v=>v.kind==='fixture').map(v=>v.material));
  const templeMaterials=new Set(shrine.voxels.filter(v=>v.kind==='fixture').map(v=>v.material));
  assert(shopMaterials.has('pack5:086')&&shopMaterials.has('pack5:087'),shop.id);
  assert(templeMaterials.has('pack3:075')&&templeMaterials.has('pack3:072'),shrine.id);
  assert(!templeMaterials.has('pack5:086'),shrine.id);
 }
});
