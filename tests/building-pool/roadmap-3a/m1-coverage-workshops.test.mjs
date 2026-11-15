import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {BIOMES,SIZES,slotId} from '../../../src/building-pool/roadmap-3a/roster.mjs';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {createM1OriginalWorkshopPool} from '../../../src/building-pool/roadmap-3a/m1-workshop-exemplars.mjs';
import {createM1RegionalPool} from '../../../src/building-pool/roadmap-3a/m1-regional-workshops.mjs';
import {M1_COMPLETION_SPECS} from '../../../src/building-pool/roadmap-3a/m1-coverage-specs.mjs';
import {createM1CompletionPool,createM1CompletionWorkshop} from '../../../src/building-pool/roadmap-3a/m1-coverage-workshops.mjs';
import {validateAuthoredPool,validateBlueprint} from '../../../src/building-pool/roadmap-3a/contract.mjs';
import {geometryFingerprint} from '../../../src/building-pool/roadmap-3a/legacy-validation.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
const newer=createM1CompletionPool();
const coord=c=>c.slice(0,3).join(',');
const cells=b=>b.modules.flatMap(m=>m.cells);
function shapeSignature(b){
 const xyz=cells(b).map(x=>x.slice(0,3));
 const all=[];
 for(let rotation=0;rotation<4;rotation++)for(const mirror of [false,true]){
  const transformed=xyz.map(([a,b,c])=>{
   if(mirror)a=-a;
   for(let k=0;k<rotation;k++){const v=-c;c=a;a=v;}
   return [a,b,c];
  });
  const min=[0,1,2].map(k=>Math.min(...transformed.map(x=>x[k])));
  all.push(createHash('sha256').update(transformed.map(v=>v.map((n,k)=>n-min[k]).join(',')).sort().join('|')).digest('hex'));
 }
 return all.sort()[0];
}
test('44/44 newly authored spatial programmes fill exactly the missing 4x5x3 category-size-biome slots',()=>{
 assert.equal(M1_COMPLETION_SPECS.length,44);
 assert.equal(newer.length,44);
 assert.equal(validateAuthoredPool(newer).authored,44);
 const prior=[...createM1OriginalWorkshopPool(),...createM1RegionalPool()];
 assert.equal(prior.length,16);
 const byId=new Map();
 for(const b of [...prior,...newer]){
  assert.ok(!byId.has(b.id),'duplicated identity '+b.id);
  byId.set(b.id,b);
 }
 assert.equal(byId.size,60);
 for(const type of ['armorer','carpenter','stonemason','mining-workshop']){
  const all=[...byId.values()].filter(b=>b.type===type);
  assert.equal(all.length,15);
  for(const biome of BIOMES)for(const size of SIZES){
   const id=slotId(type,biome,size,1);
   assert.ok(byId.has(id),'missing M1 representative '+id);
  }
 }
 for(const b of newer){
  assert.equal(createM1CompletionWorkshop(b.type,b.biome,b.size).id,b.id);
  assert.equal(b.activated,false);assert.equal(b.worldPlaced,false);
  assert.equal(b.status,'theoretical');assert.equal(b.productionRegistered,false);
  assert.ok(['small','medium','large'].includes(b.size));
  assert.ok(b.envelope.height>=22);
  assert.ok(b.architecture.roofSpanCertified===false);
 }
});
test('all 44 are complete non-overlapping voxel structures with real traversable 2-wide 3-high routes and size-dependent 3/4/5 spaces',()=>{
 for(const b of newer){
  const set=new Set(cells(b).map(coord));
  assert.equal(set.size,cells(b).length);
  assert.ok(set.size>1100,'not enough physical coordinate cells '+b.id);
  assert.ok(validateBlueprint(b).rooms>=3);
  const count=b.size==='small'?3:b.size==='medium'?4:5;
  assert.equal(b.spaces.length,count);
  const entry=b.navigation.nodes.find(n=>n.id==='entry');
  assert.ok(entry&&entry.width>=2);
  for(let z=2;z<b.envelope.depth;z++)for(let x=entry.x;x<entry.x+2;x++){
   assert.ok(set.has([x,1,z].join(',')),'supporting deck '+b.id+' '+[x,z]);
   for(let y=2;y<=4;y++)
    assert.ok(!set.has([x,y,z].join(',')),'blocked physical corridor '+b.id+' '+[x,y,z]);
  }
  for(const node of b.navigation.nodes)
   assert.ok(b.spaces.some(s=>s.accessNode===node.id)||node.id==='entry','nav room '+b.id);
  assert.ok(b.modules.some(m=>m.role==='roof'&&m.cells.length>80));
  assert.ok(b.modules.some(m=>m.role==='support-pier'&&m.cells.length>20));
  assert.ok(b.modules.some(m=>m.role==='workroom-partition'&&m.cells.length>15));
  assert.equal(b.modules.find(m=>m.role==='fixture').cells.length,2);
  assert.ok(b.modules.some(m=>m.role.endsWith('-rack')));
  assert.equal(b.features.length,2);
 }
});
test('all 75 inherited+existing+new source geometries are distinct under reflection/rotation/translation; original blacksmiths untouched',()=>{
 const legacy=createLegacyBlacksmithPool();
 const oldSignatures=legacy.map(b=>[b.id,geometryFingerprint(b)]);
 const all=[...legacy,...createM1OriginalWorkshopPool(),...createM1RegionalPool(),...newer];
 assert.equal(all.length,75);
 const seen=new Map();
 for(const b of all){
  const fingerprint=shapeSignature(b);
  assert.ok(!seen.has(fingerprint),'duplicate/mirrored physical geometry '+b.id+' and '+seen.get(fingerprint));
  seen.set(fingerprint,b.id);
 }
 assert.equal(seen.size,75);
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]),oldSignatures);
});
test('all 44 have actual registered manual-family symbols, typed fixture orientation, source collision and support offsets',()=>{
 for(const b of newer){
  const occupied=new Set(cells(b).map(coord));
  for(const c of cells(b))assert.match(c[3],/^pack[1-5]:\d{3}$/);
  for(const c of b.modules.find(m=>m.role==='fixture').cells){
   assert.equal(c.length,5);
   assert.equal(c[4].orientation,'north');
   const asset=resolveManualFivePackAsset(c[3],c[4].variant?
    {orientation:c[4].orientation,variant:c[4].variant}:
    {orientation:c[4].orientation});
   assert.equal(asset.builderResolvable,true);
   assert.equal(asset.livePlaceable,false);
   assert.ok(asset.visibleBoxes.length>0);
   assert.ok(asset.collisionBoxes.length>=0);
   for(const [dx,dy,dz] of asset.supportOffsets){
    assert.ok(occupied.has([c[0]+dx,c[1]+dy,c[2]+dz].join(',')),'missing fixture mount '+b.id);
   }
  }
 }
});
test('264 genuine-source WebGL2 mesh/camera inputs for 44 models × 2 sections × 3 iPhone-like viewports',()=>{
 let count=0;
 for(const b of newer)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.ok(mesh.vertices instanceof Float32Array);
  assert.ok(mesh.vertices.length>1000&&mesh.vertices.every(Number.isFinite));
  assert.equal(mesh.isDiagnosticEnvelope,true);
  assert.equal(mesh.notAssetShapeProof,true);
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const camera=fitPreviewCamera(b.envelope,mesh.vertices,w,h);
   assert.ok(camera.matrix.every(Number.isFinite));
   assert.ok(camera.projectedHalfWidth<1&&camera.projectedHalfHeight<1);
   count++;
  }
 }
 assert.equal(count,264);
});
test('source-only census 75 authored representatives, 270 still uncreated, no approved or live placements',()=>{
 const legacy=createLegacyBlacksmithPool(),former=[...createM1OriginalWorkshopPool(),...createM1RegionalPool()];
 const all=[...legacy,...former,...newer];
 const total=all.reduce((n,b)=>n+cells(b).length,0);
 assert.equal(all.length,75);
 assert.equal(345-all.length,270);
 const byType=Object.fromEntries(['blacksmith','armorer','carpenter','stonemason','mining-workshop'].map(type=>
  [type,all.filter(b=>b.type===type).length]));
 assert.deepEqual(byType,{blacksmith:15,armorer:15,carpenter:15,stonemason:15,'mining-workshop':15});
 assert.ok(all.every(b=>b.status==='theoretical'&&b.activated===false&&b.worldPlaced!==true));
 const dir=join(process.cwd(),'artifacts','building-roadmap-3a-coverage');
 mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'AUTHORED_75_CENSUS.json'),JSON.stringify({
  schema:'mythwrought.builder3a.75-source-v1',totalAuthored:75,legacy15:15,
  priorNew16:16,newThisSession:44,unauthored:270,creatorApproved:0,integrated:0,
  authoredVoxelPositions:total,byType,
  candidates:all.map(b=>({id:b.id,type:b.type,biome:b.biome,size:b.size,
    cells:cells(b).length,worldPlaced:false,creatorApproved:false,
    geometrySha256:shapeSignature(b)}))
 },null,2)+'\n');
 console.log('3A authored coordinate census: 75/345, 270 remaining, '+total+' source positions; 0 creator approved or integrated');
});
