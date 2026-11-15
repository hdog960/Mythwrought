import test from 'node:test';
import assert from 'node:assert/strict';
import {createFrontierIndustryBlueprint,createFrontierIndustryPool} from '../../../src/building-pool/roadmap-3b/m2-frontier.mjs';
import {createLegacyWatchtowerPool} from '../../../src/building-pool/roadmap-3b/legacy-watchtowers.mjs';
import {createM2IndustryPool} from '../../../src/building-pool/roadmap-3b/m2-industry.mjs';
import {createRegionalIndustryPool} from '../../../src/building-pool/roadmap-3b/m2-regional.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {validatePool,validateBlueprint,serializeBlueprint,geometryFingerprint}
 from '../../../src/building-pool/roadmap-3b/contract.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
import {reviewFrontierPhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m2-frontier-dependencies.mjs';

const additions=createFrontierIndustryPool();
const coord=(x,y,z)=>x+','+y+','+z;
const all=[...createLegacyWatchtowerPool(),...createM2IndustryPool(),...createRegionalIndustryPool(),...additions];
function cellMap(b){
 const result=new Map();
 for(const m of b.modules)for(const cell of m.cells){
  const k=coord(...cell.slice(0,3));
  assert.ok(!result.has(k),b.id+' duplicate coordinate '+k);
  result.set(k,{cell,role:m.role});
 }
 return result;
}
function clearTwoWide(b,occupied,x,y,z){
 if(x<0||x+1>=b.envelope.width||z<0||z>=b.envelope.depth||y<2||y+1>=b.envelope.height)return false;
 return [x,x+1].every(xx=>!occupied.has(coord(xx,y,z))&&!occupied.has(coord(xx,y+1,z))&&occupied.has(coord(xx,y-1,z)));
}
function provenReach(b,occupied){
 const entry=b.navigation.nodes.find(n=>n.id===b.navigation.entry);
 assert.ok(clearTwoWide(b,occupied,entry.x,entry.y,entry.z),b.id+' entry obstructed');
 const seen=new Set([coord(entry.x,entry.y,entry.z)]);
 const queue=[[entry.x,entry.y,entry.z]];
 for(let i=0;i<queue.length;i++){
  const [x,y,z]=queue[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const [nx,nz]=[x+dx,z+dz],k=coord(nx,y,nz);
   if(!seen.has(k)&&clearTwoWide(b,occupied,nx,y,nz)){seen.add(k);queue.push([nx,y,nz]);}
  }
 }
 for(const n of b.navigation.nodes){
  assert.ok(seen.has(coord(n.x,n.y,n.z)),b.id+' unreached '+n.id);
  assert.ok(clearTwoWide(b,occupied,n.x,n.y,n.z),b.id+' headroom '+n.id);
 }
 return seen.size;
}
function foundationAnchoring(b,occupied){
 const reached=new Set(),queue=[];
 for(const [k,p] of occupied)if(p.role==='foundation'){reached.add(k);queue.push(p.cell);}
 assert.ok(queue.length>100,b.id+' no real foundation');
 for(let i=0;i<queue.length;i++){
  const [x,y,z]=queue[i];
  for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
   const k=coord(x+dx,y+dy,z+dz);
   if(occupied.has(k)&&!reached.has(k)){reached.add(k);queue.push(occupied.get(k).cell);}
  }
 }
 assert.equal(reached.size,occupied.size,b.id+' orphan or floating block island');
}
test('all six new frontier candidates are strictly original slots; 27 of 360 and 333 unbuilt',()=>{
 const ids=additions.map(x=>x.id);
 assert.deepEqual(ids,[
  'r3:lumberyard:snow:small:1',
  'r3:lumberyard:enchanted-forest:medium:1',
  'r3:lumberyard:mountain:large:1',
  'r3:mill:desert:medium:1',
  'r3:mill:snow:medium:1',
  'r3:mill:enchanted-forest:large:1']);
 assert.deepEqual(validatePool(all,ASSET_CATALOG),{authored:27,remaining:333});
 assert.equal(new Set(all.map(b=>b.id)).size,27);
 assert.equal(new Set(all.map(geometryFingerprint)).size,27,'geometry cannot be just recolored/repeated');
 assert.deepEqual([6,6,15],['lumberyard','mill','watchtower'].map(t=>all.filter(b=>b.type===t).length));
});
test('six frontier layouts are physically authored integer coordinates with distinct architecture and multi-room purposes',()=>{
 assert.equal(new Set(additions.map(b=>b.architecture.kind)).size,6);
 for(const b of additions){
  const v=validateBlueprint(b,ASSET_CATALOG),cells=cellMap(b);
  assert.equal(v.cellCount,cells.size);
  assert.equal(b.architecture.occupiedCoordinates,cells.size);
  assert.ok(v.cellCount>=1900,b.id+' too little authored geometry');
  assert.ok(b.envelope.height>=21,b.id);
  assert.ok(b.spaces.length>=3&&b.features.length>=5&&b.openings.length===1,b.id);
  for(const role of ['foundation','floor','wall','roof'])assert.ok(b.modules.some(m=>m.role===role),b.id+' '+role);
  assert.ok(b.modules.some(m=>m.role.includes('post')||m.role.includes('column')||m.role.includes('pier')),b.id+' no real structural pier');
  assert.equal(b.status,'theoretical');assert.equal(b.activated,false);
  assert.equal(b.architecture.worldPlaced,false);
  assert.equal(b.architecture.numericVariantSelected,false);
  assert.equal(b.architecture.perCellYawSelected,false);
  assert.match(b.implementation,/THEORETICAL_ONLY/);
  assert.ok(b.dependencies.every(s=>typeof s==='string'&&s.length>5));
  assert.ok(b.features.some(f=>f.assetRef===null&&f.unresolvedDependency.length>8),b.id+' missing honest machinery dependencies');
 }
});
test('every frontier work zone is physically reachable with genuinely unoccupied two-wide and two-headroom aisles',()=>{
 for(const b of additions){
  const reached=provenReach(b,cellMap(b));
  assert.ok(reached>180,b.id+' walkable path too small');
 }
});
test('every post, roof, terrace seam, fence, rack and millstone connects by real voxel faces to a foundation',()=>{
 for(const b of additions)foundationAnchoring(b,cellMap(b));
});
test('original six frontier plans are deterministic; no imaginary extra variants or regions',()=>{
 const copies=createFrontierIndustryPool();
 for(let i=0;i<additions.length;i++){
  assert.equal(serializeBlueprint(additions[i]),serializeBlueprint(copies[i]),additions[i].id);
  assert.equal(geometryFingerprint(additions[i]),geometryFingerprint(copies[i]));
 }
 assert.throws(()=>createFrontierIndustryBlueprint('lumberyard','snow','medium',1),/No coordinate-authored/);
 assert.throws(()=>createFrontierIndustryBlueprint('mill','enchanted-forest','large',2),/No variant/);
});
test('36 native voxel-envelope mesh and landscape camera combinations fit the six frontier designs',()=>{
 let count=0;
 for(const b of additions)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.ok(mesh.sourceCells>1000);
  assert.equal(mesh.isDiagnosticEnvelope,true);assert.equal(mesh.notAssetShapeProof,true);
  assert.ok(mesh.triangleCount>450&&mesh.triangleCount<36000,b.id+' budget exceeded');
  if(cutaway)assert.ok(mesh.sourceCells<b.architecture.occupiedCoordinates);
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const view=fitPreviewCamera(b.envelope,mesh.vertices,w-16,h-127);
   assert.ok(view.projectedHalfWidth<.87&&view.projectedHalfHeight<.87,b.id+' clip '+w+'x'+h);
   count++;
  }
 }
 assert.equal(count,36);
});
test('frontier physical-family audit is accurate and fail-closed: 96/106 catalog, symbolic biome130, zero world integration',()=>{
 const review=reviewFrontierPhysicalDependencies();
 assert.equal(review.authored,6);
 assert.equal(review.families.families,96);
 assert.equal(review.families.numericVariants,106);
 assert.equal(review.productionReady,false);
 assert.equal(review.readOnly,true);
 assert.equal(review.perCellNumericVariantSelected,false);
 assert.equal(review.perCellYawSelected,false);
 assert.equal(review.realSelectionAndCollisionCertified,false);
 assert.equal(review.realMountAndSupportCertified,false);
 assert.equal(review.multiVoxelReservationCertified,false);
 assert.equal(review.creatorApproved,0);
 assert.equal(review.worldIntegrated,0);
 assert.ok(review.occupiedConceptualPositions>16000);
 for(const a of review.assets){
  assert.ok(a.used>0&&a.usedBy.length>0,a.symbol);
  assert.equal(a.physicalFinalApproved,false);
  assert.notEqual(a.status,'not-live-registered',a.symbol+' actual usage must be source-registered');
 }
 for(const id of ['biome130:094','biome130:096','biome130:098']){
  const requirement=review.symbolicDependencies.find(x=>x.symbol===id);
  assert.ok(requirement,id);
  assert.equal(requirement.registeredNow,false,id);
  assert.equal(requirement.placedAsBuiltVoxel,false,id);
 }
 console.log('MYTHWROUGHT_3B_M2_FRONTIER_COUNTS='+JSON.stringify(additions.map(b=>({
  id:b.id,cells:b.architecture.occupiedCoordinates,
  envelope:[b.envelope.width,b.envelope.height,b.envelope.depth],
  structuralModules:b.modules.length,
  rooms:b.spaces.length,
  geometricSignatureLength:geometryFingerprint(b).length
 }))));
 console.log('MYTHWROUGHT_3B_M2_FRONTIER_ASSET_AUDIT='+JSON.stringify(review.assets.map(a=>({
  symbol:a.symbol,used:a.used,status:a.status,shapeBoxCount:a.visibleBoxCount,
  collisionBoxCount:a.collisionBoxCount,physicalSupportOffsets:a.physicalSupportOffsets
 }))));
});
