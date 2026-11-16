import test from 'node:test';
import assert from 'node:assert/strict';
import {createMissingSlotIndustryBlueprint,createMissingSlotIndustryPool} from '../../../src/building-pool/roadmap-3b/m2-missing-sizes.mjs';
import {createLegacyWatchtowerPool} from '../../../src/building-pool/roadmap-3b/legacy-watchtowers.mjs';
import {createM2IndustryPool} from '../../../src/building-pool/roadmap-3b/m2-industry.mjs';
import {createRegionalIndustryPool} from '../../../src/building-pool/roadmap-3b/m2-regional.mjs';
import {createFrontierIndustryPool} from '../../../src/building-pool/roadmap-3b/m2-frontier.mjs';
import {createHinterlandPool} from '../../../src/building-pool/roadmap-3b/m2-hinterland.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {BIOMES,SIZES} from '../../../src/building-pool/roadmap-3b/roster.mjs';
import {validatePool,validateBlueprint,geometryFingerprint,serializeBlueprint} from '../../../src/building-pool/roadmap-3b/contract.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
import {reviewMissingSlotPhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m2-missing-sizes-dependencies.mjs';

const earlier=[...createLegacyWatchtowerPool(),...createM2IndustryPool(),...createRegionalIndustryPool(),...createFrontierIndustryPool(),...createHinterlandPool()];
const newest=createMissingSlotIndustryPool(),all=[...earlier,...newest];
const sig=(x,y,z)=>x+','+y+','+z;
function voxels(b){
 const m=new Map();
 for(const mod of b.modules)for(const c of mod.cells){
  const p=sig(c[0],c[1],c[2]);
  assert.ok(!m.has(p),b.id+' overlapping voxel '+p);m.set(p,{c,role:mod.role});
 }
 return m;
}
const neighborhood=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
function structural(b,vox){
 const visited=new Set(),queue=[];
 for(const [key,value] of vox)if(value.role==='foundation'){visited.add(key);queue.push(value.c);}
 assert.ok(queue.length>100,b.id+' insufficient structural foundation');
 for(let i=0;i<queue.length;i++){
  const [x,y,z]=queue[i];
  for(const [dx,dy,dz] of neighborhood){
   const p=sig(x+dx,y+dy,z+dz),v=vox.get(p);
   if(v&&!visited.has(p)){visited.add(p);queue.push(v.c);}
  }
 }
 assert.equal(visited.size,vox.size,b.id+' unsupported or floating structural island');
}
function routes(b,vox){
 const walk=(x,y,z)=>x>=0&&x+1<b.envelope.width&&z>=0&&z<b.envelope.depth&&y>=2&&y+1<b.envelope.height
  &&[x,x+1].every(a=>vox.has(sig(a,y-1,z))&&!vox.has(sig(a,y,z))&&!vox.has(sig(a,y+1,z)));
 const start=b.navigation.nodes.find(n=>n.id===b.navigation.entry);
 assert.ok(walk(start.x,start.y,start.z),b.id+' obstructed entrance');
 const seen=new Set([sig(start.x,start.y,start.z)]),queue=[[start.x,start.y,start.z]];
 for(let i=0;i<queue.length;i++){
  const [x,y,z]=queue[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=x+dx,nz=z+dz,k=sig(nx,y,nz);
   if(!seen.has(k)&&walk(nx,y,nz)){seen.add(k);queue.push([nx,y,nz]);}
  }
 }
 for(const n of b.navigation.nodes)assert.ok(seen.has(sig(n.x,n.y,n.z)),b.id+' disconnected functional space '+n.id);
 for(const room of b.spaces)assert.ok(b.navigation.nodes.some(n=>n.id===room.accessNode),b.id+' lacks room access point');
 for(const c of b.clearances)for(let x=c.x;x<c.x+c.width;x++)for(let y=c.y;y<c.y+c.height;y++)for(let z=c.z;z<c.z+c.depth;z++)
  assert.ok(!vox.has(sig(x,y,z)),b.id+' declared 2-wide clearance obstructed '+[x,y,z]);
 return seen.size;
}
test('M2 first-variant completeness: precisely one new original each missing 10 biome/size slots, full 45-design unique source pool',()=>{
 assert.equal(earlier.length,35);
 assert.equal(newest.length,10);
 assert.deepEqual(newest.map(b=>b.id),[
  'r3:lumberyard:temperate:large:1','r3:lumberyard:desert:medium:1',
  'r3:lumberyard:snow:medium:1','r3:lumberyard:enchanted-forest:large:1',
  'r3:lumberyard:mountain:small:1','r3:mill:temperate:large:1',
  'r3:mill:desert:small:1','r3:mill:snow:small:1',
  'r3:mill:enchanted-forest:medium:1','r3:mill:mountain:large:1'
 ]);
 assert.deepEqual(validatePool(all,ASSET_CATALOG),{authored:45,remaining:315});
 assert.equal(new Set(all.map(b=>b.id)).size,45);
 assert.equal(new Set(all.map(geometryFingerprint)).size,45,'no source-only palette swaps or repeated geometry');
 assert.equal(all.filter(b=>b.type==='watchtower').length,15);
 for(const type of ['lumberyard','mill'])for(const biome of BIOMES)for(const size of SIZES){
  assert.equal(all.filter(b=>b.type===type&&b.biome===biome&&b.size===size&&b.variant===1).length,1,
    'missing or duplicate first-variant '+[type,biome,size].join(':'));
 }
});
test('ten individually authored industrial layouts have exact source coordinate counts, distinctive roof spans and usable room programs',()=>{
 const expected=[7188,3649,4464,7121,3308,11465,2993,4548,6558,12203];
 assert.deepEqual(newest.map(b=>b.architecture.occupiedCoordinates),expected);
 assert.equal(expected.reduce((a,b)=>a+b,0),63497);
 assert.equal(new Set(newest.map(b=>b.architecture.kind)).size,10);
 for(const b of newest){
  assert.equal(validateBlueprint(b,ASSET_CATALOG).cellCount,b.architecture.occupiedCoordinates);
  assert.ok(b.modules.length>=10,b.id+' insufficient structure');
  for(const role of ['foundation','floor','wall','roof'])assert.ok(b.modules.some(m=>m.role===role),b.id+' no '+role);
  assert.ok(b.modules.some(m=>m.role.startsWith('bearing-pier')),b.id+' no authored real roof pier');
  assert.ok(b.modules.filter(m=>m.role.startsWith('bearing-pier')).reduce((n,m)=>n+m.cells.length,0)>80,b.id);
  assert.equal(b.status,'theoretical');assert.equal(b.activated,false);
  assert.equal(b.architecture.worldPlaced,false);assert.equal(b.architecture.perCellVariantSelected,false);
  assert.equal(b.architecture.perCellOrientationSelected,false);
  assert.equal(b.spaces.length,3);assert.equal(b.openings.length,1);
  assert.equal(b.navigation.nodes.length,4);
  assert.ok(b.features.some(f=>f.assetRef===null&&f.unresolvedDependency.includes('No working')));
  assert.ok(b.dependencies.length>=6);
 }
});
test('10 genuine first-variant floorplans provide complete two-wide ground-supported navigable corridors to every room',()=>{
 for(const b of newest)assert.ok(routes(b,voxels(b))>450,b.id);
});
test('10 roofs, slabs, columns, partitions and occupied work fixtures join real foundation with 6-face voxel support',()=>{
 for(const b of newest)structural(b,voxels(b));
});
test('10 first-variant original geometries regenerate byte-deterministically and reject unbuilt variant 2 or missing slots',()=>{
 const again=createMissingSlotIndustryPool();
 for(let i=0;i<10;i++){
  assert.equal(serializeBlueprint(newest[i]),serializeBlueprint(again[i]));
  assert.equal(geometryFingerprint(newest[i]),geometryFingerprint(again[i]));
 }
 assert.throws(()=>createMissingSlotIndustryBlueprint('mill','temperate','small',1),/No authored/);
 assert.throws(()=>createMissingSlotIndustryBlueprint('mill','mountain','large',2),/variant one only/);
});
test('60 native source viewport/cube diagnostic camera combinations fit actual source blueprints without clipping',()=>{
 let total=0;
 for(const b of newest)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.ok(mesh.sourceCells>=1200,b.id);
  assert.equal(mesh.notAssetShapeProof,true);
  assert.equal(mesh.isDiagnosticEnvelope,true);
  assert.ok(mesh.triangleCount>300&&mesh.triangleCount<60000,b.id+' excessive exposed triangles');
  if(cutaway)assert.ok(mesh.sourceCells<b.architecture.occupiedCoordinates,b.id+' cutaway not meaningful');
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const view=fitPreviewCamera(b.envelope,mesh.vertices,w-16,h-127);
   assert.ok(view.projectedHalfWidth<.87&&view.projectedHalfHeight<.87,b.id+' clipping '+w+'x'+h);
   total++;
  }
 }
 assert.equal(total,60);
});
test('read-only actual 96-family/106-variant physical ABI review does not imply integrated production blocks',()=>{
 const report=reviewMissingSlotPhysicalDependencies();
 assert.equal(report.authored,10);
 assert.equal(report.occupiedConceptualPositions,63497);
 assert.equal(report.families.families,96);
 assert.equal(report.families.numericVariants,106);
 assert.equal(report.readOnly,true);assert.equal(report.productionReady,false);
 assert.equal(report.creatorApproved,0);assert.equal(report.worldIntegrated,0);
 assert.equal(report.perCellNumericVariantSelected,false);
 assert.equal(report.perCellYawSelected,false);
 assert.equal(report.realSelectionAndCollisionCertified,false);
 assert.equal(report.realMountAndSupportCertified,false);
 assert.equal(report.multiVoxelReservationCertified,false);
 assert.ok(report.assets.every(a=>a.used>0&&a.usedBy.length>0&&!a.physicalFinalApproved));
 assert.ok(report.assets.every(a=>a.status!=='not-live-registered'));
 for(const sym of ['biome130:094','biome130:096','biome130:098']){
  const a=report.symbolicDependencies.find(x=>x.symbol===sym);
  assert.ok(a,sym);assert.equal(a.registeredNow,false);assert.equal(a.placedAsBuiltVoxel,false);
 }
 console.log('MYTHWROUGHT_3B_M2_FIRST_VARIANT_COMPLETION='+JSON.stringify(newest.map(b=>({
  id:b.id,cells:b.architecture.occupiedCoordinates,envelope:[b.envelope.width,b.envelope.height,b.envelope.depth],
  roofShapes:b.architecture.roofCrossSections,sourceModules:b.modules.length
 }))));
});
