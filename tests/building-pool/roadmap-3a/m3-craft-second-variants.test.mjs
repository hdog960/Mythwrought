import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {BIOMES,SIZES,slotId} from '../../../src/building-pool/roadmap-3a/roster.mjs';
import {validateBlueprint,validateAuthoredPool} from '../../../src/building-pool/roadmap-3a/contract.mjs';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {geometryFingerprint} from '../../../src/building-pool/roadmap-3a/legacy-validation.mjs';
import {createM1OriginalWorkshopPool} from '../../../src/building-pool/roadmap-3a/m1-workshop-exemplars.mjs';
import {createM1RegionalPool} from '../../../src/building-pool/roadmap-3a/m1-regional-workshops.mjs';
import {createM1CompletionPool} from '../../../src/building-pool/roadmap-3a/m1-coverage-workshops.mjs';
import {createM2MetalworkPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-second-variants.mjs';
import {createM2ThirdVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-third-variants.mjs';
import {createM2FourthVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-fourth-variants.mjs';
import {createM2FifthVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-fifth-variants.mjs';
import {M3_CRAFT_SECOND_SPECS,createM3CraftSecondPool,createM3CraftSecondVariant} from '../../../src/building-pool/roadmap-3a/m3-craft-second-variants.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';

const newer=createM3CraftSecondPool();
const coords=b=>b.modules.flatMap(m=>m.cells);
const pos=(x,y,z)=>[x,y,z].join(',');
function canonicalMass(b){
 const points=coords(b).map(c=>c.slice(0,3)),hashes=[];
 for(let rotation=0;rotation<4;rotation++)for(const mirror of [false,true]){
  const transformed=points.map(([x,y,z])=>{
   if(mirror)x=-x;
   for(let k=0;k<rotation;k++){const t=-z;z=x;x=t;}
   return [x,y,z];
  });
  const mins=[0,1,2].map(i=>Math.min(...transformed.map(p=>p[i])));
  hashes.push(createHash('sha256').update(transformed.map(p=>p.map((n,i)=>n-mins[i]).join(',')).sort().join('|')).digest('hex'));
 }
 return hashes.sort()[0];
}
test('30 independently authored M3 second variants, carpenter and stonemason × 5 biomes × 3 sizes',()=>{
 assert.equal(M3_CRAFT_SECOND_SPECS.length,30);
 assert.equal(newer.length,30);
 assert.equal(validateAuthoredPool(newer).authored,30);
 assert.equal(new Set(newer.map(b=>b.architecture.name)).size,30);
 for(const type of ['carpenter','stonemason'])for(const biome of BIOMES)for(const size of SIZES){
  const b=createM3CraftSecondVariant(type,biome,size);
  assert.equal(b.id,slotId(type,biome,size,2));
  assert.ok(newer.some(n=>n.id===b.id));
  assert.equal(b.status,'theoretical');
  assert.equal(b.activated,false);assert.equal(b.worldPlaced,false);
  assert.equal(b.productionRegistered,false);
  assert.equal(b.architecture.actualIndependentWorkrooms,4);
  assert.equal(b.architecture.physicalLoadApproved,false);
  assert.equal(b.architecture.weatherproofApproved,false);
  assert.ok(coords(b).length>1500);
 }
 assert.throws(()=>createM3CraftSecondVariant('armorer','temperate','small'),RangeError);
 assert.throws(()=>createM3CraftSecondVariant('mining-workshop','desert','large'),RangeError);
});
test('real floor/foundation, full walls, covered roof, joinery/carving fixtures, and source nonoverlap',()=>{
 for(const b of newer){
  const occ=new Set(coords(b).map(c=>pos(...c.slice(0,3))));
  assert.equal(occ.size,coords(b).length,'duplicate occupied physical voxel '+b.id);
  assert.equal(validateBlueprint(b).coordinateCells,occ.size);
  for(const role of ['foundation','floor','wall','roof','bearing-pier','roof-purlin','workflow-divider','fixture']){
   assert.ok(b.modules.find(m=>m.role===role)?.cells.length>0,'missing '+role+' '+b.id);
  }
  assert.ok(b.modules.some(m=>m.role===(b.type==='carpenter'?'seasoning-lumber-upright':'column-carving-backstop')));
  assert.ok(b.modules.some(m=>m.role===(b.type==='carpenter'?'dry-joinery-workbench':'stone-dressing-plinth')));
  assert.equal(b.spaces.length,4);
  assert.equal(b.navigation.nodes.length,5);
  assert.equal(b.navigation.edges.length,4);
  assert.equal(b.features.length,2);
 }
});
test('the central main aisle and perpendicular west/east workshop routes have actual 2-wide decks, 3-high clear headroom',()=>{
 for(const b of newer){
  const set=new Set(coords(b).map(c=>pos(...c.slice(0,3))));
  const middle=b.navigation.nodes[0].x,d=b.envelope.depth,w=b.envelope.width;
  for(let z=2;z<d;z++)for(const x of [middle,middle+1]){
   assert.ok(set.has(pos(x,1,z)),'missing central walkable deck '+b.id+' '+[x,z]);
   for(let y=2;y<=4;y++)assert.ok(!set.has(pos(x,y,z)),'blocked main aisle '+b.id+' '+[x,y,z]);
  }
  for(const part of ['tool-wing','load-yard']){
   const n=b.navigation.nodes.find(x=>x.id===part);
   assert.ok(n&&n.width>=2&&n.headroom>=3);
   for(let z=n.z;z<=n.z+1;z++){
    const x0=part==='tool-wing'?3:middle+1;
    const x1=part==='tool-wing'?middle:w-4;
    for(let x=x0;x<=x1;x++){
     assert.ok(set.has(pos(x,1,z)),'missing side-workshop supported floor '+b.id+' '+[x,z]);
     for(let y=2;y<=4;y++)assert.ok(!set.has(pos(x,y,z)),'blocked lateral access '+b.id+' '+[x,y,z]);
    }
   }
  }
 }
});
test('source-referenced Pack crates and joinery/stone carving stations are physically placed with cardinal metadata and floor supports',()=>{
 for(const b of newer){
  const set=new Set(coords(b).map(c=>pos(...c.slice(0,3))));
  const pieces=b.modules.find(m=>m.role==='fixture').cells;
  assert.equal(pieces.length,2);
  for(const c of pieces){
   assert.equal(c.length,5);
   assert.equal(c[4].orientation,'north');
   assert.ok(set.has(pos(c[0],1,c[2])),'unmounted floor-supported source fixture '+b.id);
   assert.ok(!b.worldPlaced&&b.status==='theoretical');
  }
  assert.ok(pieces.some(c=>c[3]==='pack4:057'));
 }
});
test('225 occupied source structures remain distinct under translation, cardinal rotation and reflection, inherited 15 legacy blacksmiths unchanged',()=>{
 const legacy=createLegacyBlacksmithPool(),fixed=legacy.map(b=>[b.id,geometryFingerprint(b)]);
 const all=[...legacy,...createM1OriginalWorkshopPool(),...createM1RegionalPool(),
 ...createM1CompletionPool(),...createM2MetalworkPool(),...createM2ThirdVariantPool(),
 ...createM2FourthVariantPool(),...createM2FifthVariantPool(),...newer];
 assert.equal(all.length,225);
 const shapes=new Map(),ids=new Set();
 for(const b of all){
  assert.ok(!ids.has(b.id),'duplicate owned ID '+b.id);ids.add(b.id);
  const signature=canonicalMass(b);
  assert.ok(!shapes.has(signature),'duplicate/mirrored/rotated geometry '+b.id+' '+shapes.get(signature));
  shapes.set(signature,b.id);
 }
 assert.equal(shapes.size,225);
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]),fixed);
});
test('180 native source/camera proofs at genuine three landscape preview dimensions without calling cube proxy producer art',()=>{
 let count=0;
 for(const b of newer)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.ok(mesh.vertices.length>1000&&mesh.vertices.every(Number.isFinite));
  assert.equal(mesh.isDiagnosticEnvelope,true);assert.equal(mesh.notAssetShapeProof,true);
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const c=fitPreviewCamera(b.envelope,mesh.vertices,w,h);
   assert.ok(c.projectedHalfWidth<1&&c.projectedHalfHeight<1);
   count++;
  }
 }
 assert.equal(count,180);
});
test('source-only M3 census 225/345, carpenters+stonemasons 30 each, mining workshop remains 15, creator accepted 0 integrated 0',()=>{
 const all=[...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool(),...createM1RegionalPool(),...createM1CompletionPool(),
 ...createM2MetalworkPool(),...createM2ThirdVariantPool(),...createM2FourthVariantPool(),...createM2FifthVariantPool(),...newer];
 assert.equal(all.length,225);assert.equal(345-all.length,120);
 const count=Object.fromEntries(['blacksmith','armorer','carpenter','stonemason','mining-workshop'].map(t=>[t,all.filter(b=>b.type===t).length]));
 assert.deepEqual(count,{blacksmith:75,armorer:75,carpenter:30,stonemason:30,'mining-workshop':15});
 assert.ok(all.every(b=>b.status==='theoretical'&&!b.activated&&b.worldPlaced!==true));
 const coordinateCells=all.reduce((sum,b)=>sum+coords(b).length,0);
 const dir=join(process.cwd(),'artifacts/building-roadmap-3a-m3-second');mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'M3_225_CENSUS.json'),JSON.stringify({
  schema:'mythwrought.builder3a.m3.second-census-v1',authored:225,newM3:30,
  stillUnauthored:120,creatorApproved:0,integrated:0,sourcePositions:coordinateCells,
  byType:count,blueprints:all.map(b=>({id:b.id,type:b.type,biome:b.biome,size:b.size,
   variant:b.variant,coordinates:coords(b).length,physicalMassSha256:canonicalMass(b)}))
 },null,2)+'\n');
 console.log('Builder 3A M3 theoretical census: 225/345, 120 unauthored, '+coordinateCells+' source coordinate cells, creator approved 0 integrated 0');
});
