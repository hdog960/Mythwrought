import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {BIOMES,SIZES,slotId} from '../../../src/building-pool/roadmap-3a/roster.mjs';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {geometryFingerprint} from '../../../src/building-pool/roadmap-3a/legacy-validation.mjs';
import {createM1OriginalWorkshopPool} from '../../../src/building-pool/roadmap-3a/m1-workshop-exemplars.mjs';
import {createM1RegionalPool} from '../../../src/building-pool/roadmap-3a/m1-regional-workshops.mjs';
import {createM1CompletionPool} from '../../../src/building-pool/roadmap-3a/m1-coverage-workshops.mjs';
import {validateAuthoredPool,validateBlueprint} from '../../../src/building-pool/roadmap-3a/contract.mjs';
import {M2_METALWORK_SPECIFICATIONS,createM2MetalworkPool,createM2MetalworkBlueprint} from '../../../src/building-pool/roadmap-3a/m2-metalwork-second-variants.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
const models=createM2MetalworkPool();
const cells=b=>b.modules.flatMap(m=>m.cells);
const key=(x,y,z)=>x+','+y+','+z;
const occupied=b=>new Set(cells(b).map(c=>key(...c.slice(0,3))));
function fingerprint(b){
 const input=cells(b).map(c=>c.slice(0,3)),projections=[];
 for(let r=0;r<4;r++)for(const mirror of [false,true]){
  const points=input.map(([x,y,z])=>{
   if(mirror)x=-x;for(let i=0;i<r;i++){const v=-z;z=x;x=v;}
   return [x,y,z];
  });
  const mins=[0,1,2].map(i=>Math.min(...points.map(c=>c[i])));
  projections.push(createHash('sha256').update(
   points.map(c=>c.map((v,i)=>v-mins[i]).join(',')).sort().join('|')).digest('hex'));
 }
 return projections.sort()[0];
}
test('30 M2 independently allocated blacksmith and armorer second variants, all five biomes and sizes',()=>{
 assert.equal(M2_METALWORK_SPECIFICATIONS.length,30);
 assert.equal(models.length,30);assert.equal(validateAuthoredPool(models).authored,30);
 assert.equal(new Set(models.map(b=>b.architecture.brief)).size,30);
 for(const type of ['blacksmith','armorer'])for(const biome of BIOMES)for(const size of SIZES){
  const b=createM2MetalworkBlueprint(type,biome,size);
  assert.equal(b.id,slotId(type,biome,size,2));
  assert.ok(models.some(x=>x.id===b.id));
  assert.equal(b.status,'theoretical');assert.equal(b.activated,false);
  assert.equal(b.worldPlaced,false);assert.equal(b.productionRegistered,false);
  assert.ok(b.architecture.finalSourceOnly);assert.equal(b.architecture.heatApproved,false);
  assert.ok(cells(b).length>1500);
 }
 assert.throws(()=>createM2MetalworkBlueprint('watchtower','snow','small'),RangeError);
});
test('grounded two-wide/three-high passage and physically occupied foundation, walls, roof, separate work bays',()=>{
 for(const b of models){
  const set=occupied(b),d=b.envelope.depth;
  assert.equal(set.size,cells(b).length);
  assert.equal(validateBlueprint(b).coordinateCells,set.size);
  assert.equal(b.spaces.length,2);
  const entry=b.navigation.nodes.find(n=>n.id==='entry');
  for(let z=2;z<d;z++)for(const x of [entry.x,entry.x+1]){
   assert.ok(set.has(key(x,1,z)),'walkable floor missing '+b.id);
   for(let y=2;y<=4;y++)assert.ok(!set.has(key(x,y,z)),'blocked corridor '+b.id+' '+key(x,y,z));
  }
  for(const role of ['foundation','floor','wall','roof','support-pier','roof-purlin','internal-bay-separation','fixture'])
   assert.ok(b.modules.find(m=>m.role===role)?.cells.length>0,'missing structural '+role);
  assert.ok(b.spaces.every(s=>b.navigation.nodes.some(n=>n.id===s.accessNode)));
 }
});
test('15 new cold smithy shafts have 3x3 grounded hollow masonry shell, clear vertical smoke path, source-authored fireplace rear support',()=>{
 for(const b of models.filter(b=>b.type==='blacksmith')){
  const set=occupied(b),[x,z]=b.architecture.flueVoid;
  const ring=b.modules.find(m=>m.role==='flue-masonry');
  assert.ok(ring?.cells.length>=144);
  for(let y=3;y<=20;y++){
   assert.ok(!set.has(key(x,y,z)),'sealed flue '+b.id);
   for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
    if(dx!==0||dz!==0)assert.ok(set.has(key(x+dx,y,z+dz)),'unsupported chimney ring '+b.id);
  }
  const f=cells(b).find(c=>c[3]==='pack4:064');
  assert.deepEqual(f.slice(0,3),[x,2,z]);
  assert.equal(f[4].orientation,'north');
  assert.ok(set.has(key(x,2,z+1)),'fireplace backing absent');
  assert.equal(cells(b).filter(c=>c[3]==='pack4:063').length,0);
  assert.ok(b.dependencies.some(s=>s.includes('pack4:063')&&s.includes('SYMBOLIC')));
 }
});
test('real integrated producer Pack4 fireplace/crate and Pack5 anvil oriented variant/support contract',()=>{
 for(const b of models){
  const set=occupied(b);
  for(const c of cells(b).filter(c=>['pack4:064','pack4:057','pack5:088'].includes(c[3]))){
   assert.equal(c.length,5);assert.equal(c[4].orientation,'north');
   const p=resolveManualFivePackAsset(c[3],c[4].variant?
     {variant:c[4].variant,orientation:'north'}:{orientation:'north'});
   assert.equal(p.builderResolvable,true);assert.equal(p.livePlaceable,false);
   assert.ok(p.visibleBoxes.length);
   for(const [dx,dy,dz] of p.supportOffsets)
    assert.ok(set.has(key(c[0]+dx,c[1]+dy,c[2]+dz)),'missing physical support '+b.id+' '+c[3]);
  }
 }
});
test('all 105 candidate physical masses are unique under translation, mirror and cardinal rotations; inherited blacksmiths unchanged',()=>{
 const old=createLegacyBlacksmithPool(),fixed=old.map(b=>[b.id,geometryFingerprint(b)]);
 const all=[...old,...createM1OriginalWorkshopPool(),...createM1RegionalPool(),...createM1CompletionPool(),...models];
 assert.equal(all.length,105);
 const shapes=new Map(),ids=new Set();
 for(const b of all){
  assert.ok(!ids.has(b.id));ids.add(b.id);
  const h=fingerprint(b);
  assert.ok(!shapes.has(h),'duplicate/mirror/rotation '+b.id+' and '+shapes.get(h));
  shapes.set(h,b.id);
 }
 assert.equal(shapes.size,105);
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]),fixed);
});
test('180 sourced diagnostic mesh/camera checks across two views and three iPhone-like landscape sizes',()=>{
 let n=0;
 for(const b of models)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.ok(mesh.vertices.length>1000&&mesh.vertices.every(Number.isFinite));
  assert.equal(mesh.isDiagnosticEnvelope,true);assert.equal(mesh.notAssetShapeProof,true);
  for(const [width,height] of [[667,375],[844,390],[932,430]]){
   const fit=fitPreviewCamera(b.envelope,mesh.vertices,width,height);
   assert.ok(fit.projectedHalfWidth<1&&fit.projectedHalfHeight<1);n++;
  }
 }
 assert.equal(n,180);
});
test('accurate source-only 105/345 census, 240 unauthored and zero creator-approved or world-integrated',()=>{
 const all=[...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool(),...createM1RegionalPool(),...createM1CompletionPool(),...models];
 assert.equal(all.length,105);
 const counts=Object.fromEntries(['blacksmith','armorer','carpenter','stonemason','mining-workshop'].map(t=>[t,all.filter(b=>b.type===t).length]));
 assert.deepEqual(counts,{blacksmith:30,armorer:30,carpenter:15,stonemason:15,'mining-workshop':15});
 const sourcePositions=all.reduce((n,b)=>n+cells(b).length,0);
 assert.equal(345-all.length,240);
 assert.ok(all.every(b=>b.status==='theoretical'&&b.activated===false&&b.worldPlaced!==true));
 const dir=join(process.cwd(),'artifacts/building-roadmap-3a-m2');
 mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'M2_SOURCE_CENSUS.json'),JSON.stringify({schema:'mythwrought.builder3a.M2.source-v1',
  authored:105,remaining:240,accepted:0,integrated:0,M2new:30,sourcePositions,
  categoryCounts:counts,designs:all.map(b=>({id:b.id,type:b.type,biome:b.biome,size:b.size,
   variant:b.variant,sourceCells:cells(b).length,sourceOnly:true}))},null,2)+'\n');
 console.log('M2 3A source-only census 105/345 cells '+sourcePositions);
});
