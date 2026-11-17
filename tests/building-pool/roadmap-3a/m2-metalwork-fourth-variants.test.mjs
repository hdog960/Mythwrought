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
import {createM2MetalworkPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-second-variants.mjs';
import {createM2ThirdVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-third-variants.mjs';
import {createM2FourthVariantPool,createM2FourthVariant,M2_FOURTH_VARIANT_SPECS} from '../../../src/building-pool/roadmap-3a/m2-metalwork-fourth-variants.mjs';
import {validateAuthoredPool} from '../../../src/building-pool/roadmap-3a/contract.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
const variants=createM2FourthVariantPool();
const sourceCells=b=>b.modules.flatMap(m=>m.cells);
const key=(x,y,z)=>[x,y,z].join(',');
function canonicalMass(b){
 const xyz=sourceCells(b).map(c=>c.slice(0,3)),hashes=[];
 for(let r=0;r<4;r++)for(const reflection of [false,true]){
  const rotated=xyz.map(([x,y,z])=>{
   if(reflection)x=-x;
   for(let k=0;k<r;k++){const v=-z;z=x;x=v;}
   return [x,y,z];
  });
  const min=[0,1,2].map(i=>Math.min(...rotated.map(v=>v[i])));
  hashes.push(createHash('sha256').update(rotated.map(v=>v.map((n,i)=>n-min[i]).join(',')).sort().join('|')).digest('hex'));
 }
 return hashes.sort()[0];
}
test('30 exact new M2 variant-4 blacksmith and armorer designs occupy every exclusive biome-size slot',()=>{
 assert.equal(M2_FOURTH_VARIANT_SPECS.length,30);assert.equal(variants.length,30);
 assert.equal(validateAuthoredPool(variants).authored,30);
 assert.equal(new Set(M2_FOURTH_VARIANT_SPECS.map(q=>q.name)).size,30);
 for(const kind of ['blacksmith','armorer'])for(const biome of BIOMES)for(const size of SIZES){
  const b=createM2FourthVariant(kind,biome,size);
  assert.equal(b.id,slotId(kind,biome,size,4));
  assert.equal(b.variant,4);
  assert.equal(b.status,'theoretical');assert.equal(b.activated,false);
  assert.equal(b.worldPlaced,false);
  assert.equal(b.architecture.independentNamedSpaces,4);
  assert.ok(b.architecture.distinctRoofVolumes===3);
  assert.ok(sourceCells(b).length>1400);
 }
 assert.throws(()=>createM2FourthVariant('watchtower','snow','large'),RangeError);
});
test('nonrectangular full 3D source shells, passage widths, cross-wing circulation and load bearing purlin material',()=>{
 for(const b of variants){
  const occupied=new Set(sourceCells(b).map(c=>key(...c.slice(0,3))));
  const {width:w,depth:d}=b.envelope;
  const mid=b.navigation.nodes.find(n=>n.id==='gate').x;
  assert.equal(occupied.size,sourceCells(b).length,b.id+' duplicate occupied voxel');
  assert.equal(b.spaces.length,4);assert.equal(b.navigation.nodes.length,5);
  for(let z=2;z<d;z++)for(const x of [mid,mid+1]){
   assert.ok(occupied.has(key(x,1,z)),b.id+' missing walkway floor '+x+','+z);
   for(let y=2;y<=4;y++)assert.ok(!occupied.has(key(x,y,z)),b.id+' obstructed hall '+[x,y,z]);
  }
  for(const route of [b.navigation.nodes.find(n=>n.id==='west-bay'),b.navigation.nodes.find(n=>n.id==='east-bay')]){
   for(const z of [route.z,route.z+1]){
    const start=route.id==='west-bay'?3:mid+1;
    const stop=route.id==='west-bay'?mid:w-4;
    for(let x=start;x<=stop;x++){
     assert.ok(occupied.has(key(x,1,z)),b.id+' cross-wing deck missing');
     for(let y=2;y<=4;y++)assert.ok(!occupied.has(key(x,y,z)),b.id+' cross-wing access obstructed '+[x,y,z]);
    }
   }
  }
  for(const role of ['foundation','floor','wall','roof','roof-purlin','support-pier','room-divider','fixture']){
   assert.ok(b.modules.find(m=>m.role===role)?.cells.length,b.id+' missing true structural '+role);
  }
  assert.ok(sourceCells(b).some(c=>c[0]===1)&&sourceCells(b).some(c=>c[0]===w-2));
  assert.equal(b.architecture.roofEngineeringApproved,false);
  assert.equal(b.architecture.finalRoofWeatherApproved,false);
 }
});
test('15 new blacksmith cold masonry shafts traverse three separated roof volumes without a fabricated chimney cap',()=>{
 for(const b of variants.filter(b=>b.type==='blacksmith')){
  const filled=new Set(sourceCells(b).map(c=>key(...c.slice(0,3))));
  const f=b.architecture.hollowColdShaft;assert.ok(f);
  const c=sourceCells(b).find(c=>c[3]==='pack4:064');
  assert.deepEqual(c.slice(0,3),[f.x,2,f.z]);
  assert.equal(c[4].orientation,'north');
  assert.ok(filled.has(key(f.x,2,f.z+1)),'rear-face Pack4 fireplace bearing');
  for(let y=f.openFromY;y<=f.openThroughY;y++){
   assert.ok(!filled.has(key(f.x,y,f.z)),b.id+' blocked hollow chimney '+y);
   for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
    if(dx===0&&dz===0)continue;
    assert.ok(filled.has(key(f.x+dx,y,f.z+dz)),b.id+' masonry flue ring incomplete');
   }
  }
  assert.ok(!sourceCells(b).some(c=>c[3]==='pack4:063'));
  assert.equal(b.architecture.truePhysicalHeatApproved,false);
 }
});
test('old 135 distinct physical masses retained and 30 new fourth designs not mirrors, rotations or recolors',()=>{
 const originals=createLegacyBlacksmithPool(),fingerprints=originals.map(b=>[b.id,geometryFingerprint(b)]);
 const all=[...originals,...createM1OriginalWorkshopPool(),...createM1RegionalPool(),
 ...createM1CompletionPool(),...createM2MetalworkPool(),...createM2ThirdVariantPool(),...variants];
 assert.equal(all.length,165);assert.equal(345-all.length,180);
 const ids=new Set(),signatures=new Map();
 for(const b of all){
  assert.ok(!ids.has(b.id),'duplicate authored stable ID '+b.id);ids.add(b.id);
  const sig=canonicalMass(b);
  assert.ok(!signatures.has(sig),'original physical mass duplicated '+b.id+' <=> '+signatures.get(sig));
  signatures.set(sig,b.id);
 }
 assert.equal(signatures.size,165);
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]),fingerprints);
});
test('180 native real-coordinate source preview camera projections do not clip exterior or cutaway',()=>{
 let total=0;
 for(const b of variants)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.ok(mesh.vertices.length>900);
  assert.ok(mesh.vertices.every(Number.isFinite));
  assert.equal(mesh.isDiagnosticEnvelope,true);assert.equal(mesh.notAssetShapeProof,true);
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const camera=fitPreviewCamera(b.envelope,mesh.vertices,w,h);
   assert.ok(camera.projectedHalfWidth<1&&camera.projectedHalfHeight<1);
   total++;
  }
 }
 assert.equal(total,180);
});
test('M2 candidate census 165/345, 180 remaining, strict zero creator approval and zero integration',()=>{
 const all=[...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool(),...createM1RegionalPool(),
 ...createM1CompletionPool(),...createM2MetalworkPool(),...createM2ThirdVariantPool(),...variants];
 const counts=Object.fromEntries(['blacksmith','armorer','carpenter','stonemason','mining-workshop'].map(t=>[t,all.filter(b=>b.type===t).length]));
 assert.deepEqual(counts,{blacksmith:60,armorer:60,carpenter:15,stonemason:15,'mining-workshop':15});
 const cells=all.reduce((n,b)=>n+sourceCells(b).length,0);
 assert.equal(all.length,165);
 assert.ok(all.every(b=>b.status==='theoretical'&&!b.activated&&!b.worldPlaced));
 const root=join(process.cwd(),'artifacts/building-roadmap-3a-m2-fourth');
 mkdirSync(root,{recursive:true});
 writeFileSync(join(root,'SOURCE_CENSUS_165.json'),JSON.stringify({schema:'mythwrought.3a.m2.fourth-census.v1',
  authored:165,newFourth:30,remaining:180,approved:0,integrated:0,sourcePositions:cells,counts,
  models:all.map(b=>({id:b.id,type:b.type,biome:b.biome,size:b.size,variant:b.variant,
   cells:sourceCells(b).length,geometrySha256:canonicalMass(b)}))},null,2)+'\n');
 console.log('3A fourth M2 source census: 165/345, 180 still unauthored; coordinate cells '+cells);
});
