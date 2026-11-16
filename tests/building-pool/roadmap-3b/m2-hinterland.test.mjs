import test from 'node:test';
import assert from 'node:assert/strict';
import {createHinterlandBlueprint,createHinterlandPool} from '../../../src/building-pool/roadmap-3b/m2-hinterland.mjs';
import {createLegacyWatchtowerPool} from '../../../src/building-pool/roadmap-3b/legacy-watchtowers.mjs';
import {createM2IndustryPool} from '../../../src/building-pool/roadmap-3b/m2-industry.mjs';
import {createRegionalIndustryPool} from '../../../src/building-pool/roadmap-3b/m2-regional.mjs';
import {createFrontierIndustryPool} from '../../../src/building-pool/roadmap-3b/m2-frontier.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {validatePool,validateBlueprint,serializeBlueprint,geometryFingerprint} from '../../../src/building-pool/roadmap-3b/contract.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
import {reviewHinterlandPhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m2-hinterland-dependencies.mjs';

const originals=createLegacyWatchtowerPool(),early=createM2IndustryPool(),regional=createRegionalIndustryPool(),frontier=createFrontierIndustryPool();
const additions=createHinterlandPool(),all=[...originals,...early,...regional,...frontier,...additions];
const key=(x,y,z)=>x+','+y+','+z;
const neighbors=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
function ownedCells(building){
 const occupied=new Map();
 for(const module of building.modules)for(const c of module.cells){
  const position=key(c[0],c[1],c[2]);
  assert.ok(!occupied.has(position),building.id+' overlapping authored position '+position);
  occupied.set(position,{cell:c,role:module.role});
 }
 return occupied;
}
function walkable(building,occupied,x,y,z){
 if(x<0||x+1>=building.envelope.width||z<0||z>=building.envelope.depth||y<2)return false;
 return [x,x+1].every(a=>occupied.has(key(a,y-1,z))&&!occupied.has(key(a,y,z))&&!occupied.has(key(a,y+1,z)));
}
function checkReach(building,occupied){
 const start=building.navigation.nodes.find(n=>n.id===building.navigation.entry);
 assert.ok(walkable(building,occupied,start.x,start.y,start.z),building.id+' blocked entry');
 const seen=new Set([key(start.x,start.y,start.z)]),queue=[[start.x,start.y,start.z]];
 for(let i=0;i<queue.length;i++){
  const [x,y,z]=queue[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=x+dx,nz=z+dz,k=key(nx,y,nz);
   if(!seen.has(k)&&walkable(building,occupied,nx,y,nz)){seen.add(k);queue.push([nx,y,nz]);}
  }
 }
 for(const n of building.navigation.nodes){
  assert.ok(seen.has(key(n.x,n.y,n.z)),building.id+' unreachable '+n.id);
  assert.ok(walkable(building,occupied,n.x,n.y,n.z),building.id+' wrong headroom '+n.id);
 }
 for(const c of building.clearances)for(let x=c.x;x<c.x+c.width;x++)
  for(let y=c.y;y<c.y+c.height;y++)for(let z=c.z;z<c.z+c.depth;z++)
   assert.ok(!occupied.has(key(x,y,z)),building.id+' blocked two-wide corridor at '+[x,y,z]);
 return seen.size;
}
function checkSupport(building,occupied){
 const visited=new Set(),queue=[];
 for(const [p,v] of occupied)if(v.role==='foundation'){visited.add(p);queue.push(v.cell);}
 for(let i=0;i<queue.length;i++){
  const [x,y,z]=queue[i];
  for(const [dx,dy,dz] of neighbors){
   const k=key(x+dx,y+dy,z+dz);
   if(occupied.has(k)&&!visited.has(k)){visited.add(k);queue.push(occupied.get(k).cell);}
  }
 }
 assert.equal(visited.size,occupied.size,building.id+' orphan or unsupported structural island');
 return visited.size;
}
test('M2 adds eight genuine, specifically authored desert/snow/enchanted/mountain biome-size industrial slots',()=>{
 assert.deepEqual(additions.map(b=>b.id),[
  'r3:lumberyard:desert:large:1','r3:lumberyard:snow:large:1',
  'r3:lumberyard:enchanted-forest:small:1','r3:lumberyard:mountain:medium:1',
  'r3:mill:desert:large:1','r3:mill:snow:large:1',
  'r3:mill:enchanted-forest:small:1','r3:mill:mountain:medium:1'
 ]);
 assert.equal(originals.length,15);
 assert.equal(early.length,2);
 assert.equal(regional.length,4);
 assert.equal(frontier.length,6);
 assert.deepEqual(validatePool(all,ASSET_CATALOG),{authored:35,remaining:325});
 assert.equal(new Set(all.map(b=>b.id)).size,35);
 assert.equal(new Set(all.map(geometryFingerprint)).size,35,'palette-only copies cannot count');
 assert.deepEqual(['lumberyard','mill','watchtower'].map(t=>all.filter(b=>b.type===t).length),[10,10,15]);
});
test('eight authored spatial programs have real original voxel coordinates, rooms, roofs, entrance and feature fixtures',()=>{
 assert.equal(new Set(additions.map(b=>b.architecture.kind)).size,8);
 assert.deepEqual(additions.map(b=>b.architecture.occupiedCoordinates),[5483,5534,1818,3971,9173,8948,3404,6110]);
 assert.equal(additions.reduce((n,b)=>n+b.architecture.occupiedCoordinates,0),44441);
 for(const b of additions){
  const stats=validateBlueprint(b,ASSET_CATALOG),cells=ownedCells(b);
  assert.equal(stats.cellCount,cells.size,b.id);
  assert.ok(stats.cellCount>=1800,b.id+' incomplete');
  assert.equal(b.status,'theoretical');assert.equal(b.activated,false);
  assert.equal(b.architecture.perCellPhysicalVariantsSelected,false);
  assert.equal(b.architecture.worldPlaced,false);
  for(const role of ['foundation','floor','wall','roof'])assert.ok(b.modules.some(m=>m.role===role),b.id+' missing '+role);
  assert.ok(b.modules.some(m=>m.role.startsWith('roof-pier-')),b.id+' no load-bearing pillars');
  if(b.type==='mill' && b.size!=='small'){
   const p=b.modules.filter(m=>m.role.startsWith('roof-pier-interior-'));
   assert.ok(p.reduce((n,m)=>n+m.cells.length,0)>=40,b.id+' inadequate independent internal piers');
  }
  assert.equal(b.openings.length,1);
  assert.equal(b.spaces.length,3);
  assert.ok(b.features.length>=5);
  assert.ok(b.features.some(f=>f.assetRef===null&&f.unresolvedDependency.length>10));
 }
});
test('all original hinterland doors/rooms reachable on actual grounded 2-wide empty voxel routes',()=>{
 for(const b of additions)assert.ok(checkReach(b,ownedCells(b))>120,b.id+' access region too small');
});
test('every roof section, supporting pillar, stockpile and partition is face-connected to source-exact physical foundation voxels',()=>{
 for(const b of additions)assert.ok(checkSupport(b,ownedCells(b))===b.architecture.occupiedCoordinates);
});
test('hinterland source IDs, layout fingerprints and canonical serializations are deterministic with no invented variants',()=>{
 const second=createHinterlandPool();
 for(let i=0;i<8;i++){
  assert.equal(serializeBlueprint(additions[i]),serializeBlueprint(second[i]),additions[i].id);
  assert.equal(geometryFingerprint(additions[i]),geometryFingerprint(second[i]));
 }
 assert.throws(()=>createHinterlandBlueprint('mill','desert','small',1),/Unwritten/);
 assert.throws(()=>createHinterlandBlueprint('lumberyard','snow','large',2),/only has authored version 1/);
});
test('48 native source-driven proxy mesh/camera checks over the eight new genuine geometries at three phone landscape sizes',()=>{
 let checked=0;
 for(const b of additions)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.ok(mesh.sourceCells>800);
  assert.equal(mesh.notAssetShapeProof,true);
  assert.equal(mesh.isDiagnosticEnvelope,true);
  assert.ok(mesh.triangleCount>400&&mesh.triangleCount<45000,b.id+' excessive exposed triangles');
  if(cutaway)assert.ok(mesh.sourceCells<b.architecture.occupiedCoordinates,b.id);
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const fit=fitPreviewCamera(b.envelope,mesh.vertices,w-16,h-127);
   assert.ok(fit.projectedHalfWidth<.87&&fit.projectedHalfHeight<.87,b.id+' clipped at '+w+'x'+h);
   checked++;
  }
 }
 assert.equal(checked,48);
});
test('physical bridge audit keeps all manual/biome shapes diagnostic, and future assets symbolic',()=>{
 const review=reviewHinterlandPhysicalDependencies();
 assert.equal(review.authored,8);
 assert.equal(review.occupiedConceptualPositions,44441);
 assert.equal(review.families.families,96);
 assert.equal(review.families.numericVariants,106);
 assert.equal(review.productionReady,false);
 assert.equal(review.creatorApproved,0);assert.equal(review.worldIntegrated,0);
 assert.equal(review.perCellNumericVariantSelected,false);
 assert.equal(review.perCellYawSelected,false);
 assert.equal(review.realSelectionAndCollisionCertified,false);
 assert.equal(review.realMountAndSupportCertified,false);
 assert.equal(review.multiVoxelReservationCertified,false);
 for(const b of review.assets){
  assert.ok(b.used>0&&b.usedBy.length>0);
  assert.equal(b.physicalFinalApproved,false,b.symbol);
  assert.notEqual(b.status,'not-live-registered',b.symbol+' built-in occupied families should be registered');
 }
 for(const symbol of ['biome130:094','biome130:096','biome130:098']){
  const d=review.symbolicDependencies.find(x=>x.symbol===symbol);
  assert.ok(d,symbol);
  assert.equal(d.registeredNow,false,symbol);
  assert.equal(d.placedAsBuiltVoxel,false,symbol);
 }
 console.log('MYTHWROUGHT_3B_M2_HINTERLAND_COUNTS='+JSON.stringify(additions.map(b=>({
  id:b.id,cells:b.architecture.occupiedCoordinates,
  envelope:[b.envelope.width,b.envelope.height,b.envelope.depth],
  modules:b.modules.length,roofStyles:b.architecture.roofStyles
 }))));
 console.log('MYTHWROUGHT_3B_M2_HINTERLAND_DEPENDENCY_AUDIT='+JSON.stringify({
  materials:review.assets.map(a=>({symbol:a.symbol,used:a.used,status:a.status})),
  symbolic:review.symbolicDependencies
 }));
});
