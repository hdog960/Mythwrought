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

test('all temples have substantial paired 2x2 high belfries rather than antenna-like roof posts',()=>{
 for(const temple of M1_REPRESENTATIVES.filter(b=>b.category==='temple')){
  const cells=occupied(temple),width=temple.extents.x,center=Math.floor(width/2);
  const towerTop=temple.extents.y-2; // a full cell below central lantern pinnacle
  for(const x0 of [1,width-3])for(const dx of [0,1])for(const z of [0,1]){
   assert.equal(cells.get([x0+dx,0,z].join(','))?.kind,'foundation',`missing supported belfry footing ${temple.id} at ${x0+dx},${z}`);
   assert.equal(cells.get([x0+dx,1,z].join(','))?.kind,'floor',`missing belfry floor ${temple.id} at ${x0+dx},${z}`);
   assert(cells.has([x0+dx,towerTop,z].join(',')),`missing tall belfry ${temple.id} at ${x0+dx},${z}`);
  }
  assert(temple.voxels.filter(v=>v.kind==='window'&&v.y>=towerTop-3).length>=1,`no belfry aperture: ${temple.id}`);
 }
});
test('all temple processional portals are three cells wide and physically clear',()=>{
 for(const bp of M1_REPRESENTATIVES.filter(b=>b.category==='temple')){
  const cells=occupied(bp),center=Math.floor(bp.extents.x/2);
  for(let dx=-1;dx<=1;dx++)for(let y=2;y<=4;y++)
   assert(!cells.has([center+dx,y,0].join(',')),`blocked ${bp.id} portal at ${center+dx},${y}`);
  assert(cells.has([center,5,0].join(',')),`no true portal lintel: ${bp.id}`);
 }
});
test('temples have genuinely raised ceremonial dais and an accessible approach',()=>{
 for(const bp of M1_REPRESENTATIVES.filter(b=>b.category==='temple')){
  const cells=occupied(bp),center=Math.floor(bp.extents.x/2),z=bp.extents.z-3;
  for(let dx=-2;dx<=2;dx++)
   assert.equal(cells.get([center+dx,2,z].join(','))?.kind,'fixture',`dais absent: ${bp.id}`);
  assert.equal(cells.get([center,3,z].join(','))?.material,'pack3:075',`raised altar absent: ${bp.id}`);
  assert(canReachRear(bp),`ceremonial aisle blocked by dais: ${bp.id}`);
 }
});

test('all 30 models have a physically clear three-high passage from entry to rear room',()=>{
 for(const bp of M1_REPRESENTATIVES){
  const c=occupied(bp),entry=bp.openings.find(o=>o.type==='entrance');
  const rear=bp.openings.find(o=>o.type==='internal-doorway');
  const floor=(x,z)=>c.get([x,1,z].join(','))?.kind==='floor';
  const clear=(x,z)=>[2,3,4].every(y=>!c.has([x,y,z].join(',')));
  const seen=new Set(),queue=[[entry.x,1]];
  for(let i=0;i<queue.length;i++){
   const [x,z]=queue[i],k=x+','+z;
   if(seen.has(k)||x<1||z<1||x>=bp.extents.x-1||z>=bp.extents.z-1||!floor(x,z)||!clear(x,z))continue;
   seen.add(k);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
  }
  assert(seen.has(rear.x+','+(rear.z+1)),`three-high rear circulation blocked: ${bp.id}`);
 }
});
test('all advertised windows remain actual occupied window cells after biome facades',()=>{
 for(const bp of M1_REPRESENTATIVES){
  const c=occupied(bp);
  for(const o of bp.openings.filter(o=>o.type==='window'))
   assert.equal(c.get([o.x,o.y,o.z].join(','))?.kind,'window',`incorrect window location: ${bp.id}`);
 }
});

test('raised temple dais has two adjacent symbolic stair approach cells but no claim of physical stair ABI',()=>{
 for(const bp of M1_REPRESENTATIVES.filter(b=>b.category==='temple')){
  const cells=occupied(bp),center=Math.floor(bp.extents.x/2),z=bp.extents.z-4;
  for(const x of [center-2,center+2]){
   assert.equal(cells.get([x,2,z].join(','))?.material,'pack1:008',`missing side stair plan: ${bp.id}`);
   assert.equal(cells.get([x,2,z+1].join(','))?.kind,'fixture',`stair does not face dais: ${bp.id}`);
  }
  assert(bp.unresolvedDependencies.some(d=>d.ref==='pack1:008'),`stair ABI not listed as unverified: ${bp.id}`);
 }
});

// Structural QA, not gameplay/collision certification: the high-level ribs are
 // actual voxel cells and cannot be substituted by a plan label.
test('generated pitched and stepped roofs have linked high truss rows across actual footprint',()=>{
 for(const bp of M1_REPRESENTATIVES.filter(b=>b.biome!=='desert'&&b.id!=='r2:general-store:temperate:small:01')){
  const c=occupied(bp);
  const sizeTop={small:6,medium:7,large:9}[bp.size]+(bp.category==='temple'?1:0);
  let ribs=0,posted=0;
  for(let z=3;z<bp.extents.z-2;z+=4){
   const xs=[];
   for(let x=0;x<bp.extents.x;x++){
    if(c.get([x,0,z].join(','))?.kind!=='foundation')continue;
    const floors=c.get([x,1,z].join(','));
    assert.equal(floors?.kind,'floor',`missing truss foot support: ${bp.id} x${x} z${z}`);
    assert(c.has([x,sizeTop,z].join(',')),`missing high tie beam: ${bp.id} x${x} z${z}`);
    const roofCells=bp.voxels.filter(v=>v.x===x&&v.z===z&&v.kind==='roof'&&v.y>sizeTop);
    assert(roofCells.length>0,`no roof above rib: ${bp.id} x${x} z${z}`);
    const roofY=Math.min(...roofCells.map(v=>v.y));
    for(let y=sizeTop+1;y<roofY;y++){
     assert(c.has([x,y,z].join(',')),`floating roof above rib: ${bp.id} at ${x},${y},${z}`);
     posted++;
    }
    xs.push(x);
   }
   assert(xs.length>=bp.extents.x-4,`short roof rib: ${bp.id} z${z}`);
   ribs++;
  }
  assert(ribs>=2&&posted>0,`no modeled pitched roof posts: ${bp.id}`);
 }
});
test('open Desert courtyard remains skylit and no cross-roof truss fills it',()=>{
 for(const bp of M1_REPRESENTATIVES.filter(b=>b.biome==='desert')){
  const c=occupied(bp),cx=Math.floor(bp.extents.x/2),top={small:6,medium:7,large:9}[bp.size]+(bp.category==='temple'?1:0);
  for(let z=3;z<=Math.min(bp.extents.z-6,8);z++)
   assert(!c.has([cx,top+1,z].join(',')),`Desert courtyard skylight covered: ${bp.id} z${z}`);
 }
});
