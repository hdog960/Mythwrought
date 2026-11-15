import test from 'node:test';
import assert from 'node:assert/strict';
import {createRegionalIndustryBlueprint,createRegionalIndustryPool}
 from '../../../src/building-pool/roadmap-3b/m2-regional.mjs';
import {createM2IndustryPool} from '../../../src/building-pool/roadmap-3b/m2-industry.mjs';
import {createLegacyWatchtowerPool} from '../../../src/building-pool/roadmap-3b/legacy-watchtowers.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {validatePool,validateBlueprint,geometryFingerprint,serializeBlueprint}
 from '../../../src/building-pool/roadmap-3b/contract.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
import {reviewM2IndustryDependencies} from '../../../src/building-pool/roadmap-3b/m2-dependency-review.mjs';

const newer=createRegionalIndustryPool(),previous=createM2IndustryPool(),legacy=createLegacyWatchtowerPool();
const key=(x,y,z)=>x+','+y+','+z;
function auditOccupied(b){
 const solids=new Map();
 for(const m of b.modules)for(const c of m.cells){const k=key(...c.slice(0,3));assert.ok(!solids.has(k),b.id+' overlap '+k);solids.set(k,{coords:c,role:m.role});}
 return solids;
}
function twoWideFlood(b,solids){
 function walk(x,y,z){
  if(x<0||x+1>=b.envelope.width||z<0||z>=b.envelope.depth||y<2)return false;
  return [x,x+1].every(a=>!solids.has(key(a,y,z))&&!solids.has(key(a,y+1,z))&&solids.has(key(a,y-1,z)));
 }
 const entry=b.navigation.nodes.find(n=>n.id===b.navigation.entry);
 assert.ok(walk(entry.x,entry.y,entry.z),b.id+' entry physically blocked');
 const seen=new Set([key(entry.x,entry.y,entry.z)]),queue=[[entry.x,entry.y,entry.z]];
 for(let i=0;i<queue.length;i++){const [x,y,z]=queue[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const p=key(x+dx,y,z+dz);if(!seen.has(p)&&walk(x+dx,y,z+dz)){seen.add(p);queue.push([x+dx,y,z+dz]);}
 }}
 for(const n of b.navigation.nodes)assert.ok(seen.has(key(n.x,n.y,n.z)),b.id+' unreachable workspace '+n.id);
 return seen.size;
}
function structuralAnchors(b,solids){
 const stack=[],seen=new Set();
 for(const [k,c] of solids)if(c.role==='foundation'){seen.add(k);stack.push(c.coords);}
 for(let i=0;i<stack.length;i++){const [x,y,z]=stack[i];for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
  const k=key(x+dx,y+dy,z+dz),part=solids.get(k);
  if(part&&!seen.has(k)){seen.add(k);stack.push(part.coords);}
 }}
 assert.equal(seen.size,solids.size,b.id+' floating/isolated structural island');
}
test('M2 adds exactly four original biome/size spatial programs without changing the first two or 15 original watchtowers',()=>{
 assert.deepEqual(newer.map(b=>b.id),[
  'r3:lumberyard:temperate:medium:1',
  'r3:lumberyard:desert:small:1',
  'r3:mill:temperate:medium:1',
  'r3:mill:mountain:small:1'
 ]);
 assert.deepEqual(newer.map(b=>b.architecture.occupiedCoordinates),[2767,1806,4000,2692]);
 assert.equal(legacy.length,15);assert.equal(previous.length,2);
 const all=[...legacy,...previous,...newer];
 assert.deepEqual(validatePool(all,ASSET_CATALOG),{authored:21,remaining:339});
 assert.equal(new Set(all.map(x=>x.id)).size,21);
 assert.equal(new Set(all.map(geometryFingerprint)).size,21,'palette-only copies or repeated geometry');
 assert.deepEqual(newer.map(x=>x.envelope.width),[32,26,31,23]);
 assert.deepEqual(newer.map(x=>x.envelope.depth),[29,22,28,25]);
 for(const b of newer){assert.equal(b.status,'theoretical');assert.equal(b.activated,false);assert.equal(b.architecture.worldPlaced,false);
  assert.equal(b.architecture.perCellVariantResolved,false);
  assert.ok(b.dependencies.length>=5);assert.ok(b.features.some(x=>x.assetRef===null),'genuinely missing mechanics must remain symbolic');
 }
});
test('all four coordinate-authored original layouts include distinct roofs, actual floors, supports and functional spaces',()=>{
 const kinds=new Set(newer.map(b=>b.architecture.kind));
 assert.equal(kinds.size,4);
 for(const b of newer){
  assert.ok(validateBlueprint(b,ASSET_CATALOG).cellCount>1700,b.id);
  for(const role of ['foundation','floor','wall','roof'])assert.ok(b.modules.some(m=>m.role===role),b.id+' '+role);
  assert.ok(b.spaces.length>=3&&b.features.length>=5&&b.openings.length===1,b.id);
  assert.ok(b.envelope.height>=17);
  assert.ok(b.modules.some(m=>m.role.includes('post')||m.role.includes('column')),b.id+' no supported roof');
 }
 assert.ok(newer.find(b=>b.biome==='desert').architecture.roofStyle.includes('pergola'));
 assert.ok(newer.find(b=>b.biome==='mountain').architecture.roofStyle.includes('terraced'));
});
test('all new authored spaces are physically accessible via actual two-wide collision-free grounded cells',()=>{
 for(const b of newer)assert.ok(twoWideFlood(b,auditOccupied(b))>300,b.id);
});
test('every four-new blueprint structural roof/rafter/fence block remains face-connected to real stone foundations',()=>{
 for(const b of newer)structuralAnchors(b,auditOccupied(b));
});
test('four original layouts reproduce byte-identical serialized source geometry and reject unwritten variants',()=>{
 const copied=createRegionalIndustryPool();
 for(let i=0;i<newer.length;i++)assert.equal(serializeBlueprint(newer[i]),serializeBlueprint(copied[i]));
 assert.throws(()=>createRegionalIndustryBlueprint('mill','desert','large',1),/Unwritten/);
 assert.throws(()=>createRegionalIndustryBlueprint('mill','mountain','small',2),/four/);
});
test('all four regional buildings pass 24 native diagnostic cube mesh and landscape camera checks',()=>{
 let views=0;
 for(const b of newer)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.ok(mesh.sourceCells>1000);
  assert.ok(mesh.triangleCount>300&&mesh.triangleCount<30000,b.id+' excessive diagnostic mesh');
  assert.equal(mesh.notAssetShapeProof,true);
  if(cutaway)assert.ok(mesh.sourceCells<b.architecture.occupiedCoordinates);
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const fit=fitPreviewCamera(b.envelope,mesh.vertices,w-16,h-127);
   assert.ok(fit.projectedHalfHeight<.87&&fit.projectedHalfWidth<.87,b.id+' clipped '+w+'x'+h);
   views++;
  }
 }
 assert.equal(views,24);
});
test('M2 physical catalog handoff remains truthful: six industry designs, shape diagnostics only, zero creator approval',()=>{
 const review=reviewM2IndustryDependencies();
 assert.equal(review.authoredIndustryBlueprints,6);
 assert.equal(review.totalAuthoredCoordinateSlots,15447);
 assert.equal(review.manualCatalog.families,96);
 assert.equal(review.manualCatalog.numericVariants,106);
 assert.equal(review.perCellNumericVariantResolved,false);
 assert.equal(review.perCellYawResolved,false);
 assert.equal(review.perCellSupportProven,false);
 assert.equal(review.livePlacementReady,false);
 assert.equal(review.noWorldWrites,true);
 assert.equal(review.creatorAccepted,0);assert.equal(review.integrated,0);
 assert.ok(review.assets.some(a=>a.symbol==='biome130:006'&&a.status==='registry-shape-inspected'));
 for(const asset of review.assets){
  assert.ok(asset.occupiedPositions>0);
  assert.equal(asset.physicalReady,false);
  assert.ok(!['family-not-present','unregistered-symbolic-dependency'].includes(asset.status),asset.symbol);
 }
});
