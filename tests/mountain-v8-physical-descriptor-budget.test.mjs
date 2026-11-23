import test from 'node:test';
import assert from 'node:assert/strict';
import {auditMountainV8PhysicalDescriptors as audit,
  MOUNTAIN_V8_PROXY_FACE_BYTES,MOUNTAIN_V8_DESCRIPTOR_MATERIALS}
  from '../src/manual-biomes/mountain-v8-physical-descriptor-budget.mjs';
import {planMountainV8PhysicalColumn as plan}
  from '../src/manual-biomes/mountain-v8-physical-column.mjs';
import {certifyMountainV8Seam as certify}
  from '../src/manual-biomes/mountain-v8-seam-certificate.mjs';
const ids={AIR:0,GRASS:1,DIRT:2,STONE:3};
const original=(x,y,z)=>y>5?ids.AIR:y===5?ids.GRASS:ids.DIRT;
const physical=p=>plan(p,{worldMaxY:19,ids,readOriginalBlock:original});
const proposal=(x,z,seed=179)=>({
  x,z,seed,legacyTop:5,top:z===1?11:x===1?9:10,
  cap:z===1?'snow':'alpine-grass',biome:'mountain',
  vegetation:'alpine-flower',estimatedExtraCells:2,
  safeToIntegrate:false,generatorIdentityRequired:'v8-new-opt-in'
});
function setup(){
  const p=proposal(0,0);
  const support=physical(p);
  const seam=certify(0,0,179,proposal,{readSupport:physical});
  assert.ok(support);
  assert.ok(seam);
  return {p,support,seam};
}
test('source-certified snow and alpine physical strata have reconciled materials and faces',()=>{
  const {p,support,seam}=setup();
  const result=audit(p,support,seam);
  assert.ok(result);
  assert.equal(MOUNTAIN_V8_PROXY_FACE_BYTES,216);
  assert.equal(result.terrainCells,6);
  assert.equal(result.plantCells,0);
  assert.equal(result.materialCells.stone,3);
  assert.equal(result.materialCells.dirt,2);
  assert.equal(result.materialCells['alpine-grass'],1);
  assert.equal(result.sourceCertifiedSeamFaces,2);
  assert.equal(result.exposedCubeProxyFaces,26);
  assert.equal(result.culledInternalPairs,5);
  assert.equal(result.exposedCubeProxyBytes,26*216);
  assert.equal(result.naiveCubeProxyBytes,36*216);
  assert.equal(result.actualV8GPUBytesMeasured,false);
  assert.equal(result.requiresApprovedV8MaterialRegistry,true);
  assert.equal(result.safeToIntegrate,false);
  assert.equal(Object.values(result.materialCubeProxyFaces)
    .reduce((a,b)=>a+b,0),26);
  const caps=new Set(MOUNTAIN_V8_DESCRIPTOR_MATERIALS);
  assert.ok(['snow','slate','gneiss','scree','alpine-grass'].every(k=>caps.has(k)));
  assert.deepEqual(result,audit(p,support,seam));
});
test('accepted sparse two-cell flower joins meadow geometry without duplicate faces',()=>{
  const {p,support,seam}=setup();
  const flower={kind:'alpine-flower',site:[0,10,0],estimatedCells:2,
    cells:[{x:0,y:11,z:0,material:'flower'},
      {x:0,y:12,z:0,material:'flower-petal'}],
    safeToIntegrate:false,needsApprovedV8MaterialRegistry:true};
  const result=audit(p,support,seam,{plant:flower});
  assert.ok(result);
  assert.equal(result.uniqueCells,8);
  assert.equal(result.exposedCubeProxyFaces,34);
  assert.equal(result.naiveCubeProxyFaces,48);
  assert.equal(result.culledInternalPairs,7);
  assert.equal(result.materialCells.flower,1);
  assert.equal(result.materialCells['flower-petal'],1);
  assert.equal(result.exposedCubeProxyBytes,34*216);
});
test('physical descriptors reject forged rock, missing support, 19 cells and wrong cap',()=>{
  const {p,support,seam}=setup();
  for(const altered of [
    {...support,cap:'slate'},
    {...support,estimatedCells:19},
    {...support,writes:[]},
    {...support,writes:support.writes.map((v,i)=>
      i===1?{...v,material:'snow'}:v)},
    {...support,requiresApprovedV8BlockMapping:false}
  ])assert.equal(audit(p,altered,seam),null);
});
test('seam contact requires exactly certified material, direction and topography',()=>{
  const {p,support,seam}=setup();
  assert.ok(seam.exposedFaces.some(v=>v.material==='snow'));
  const change=structuredClone(seam);
  change.exposedFaces[0].toward[0]*=-1;
  assert.equal(audit(p,support,change),null);
  const reverse=structuredClone(seam);
  reverse.exposedFaces[1].material='slate';
  assert.equal(audit(p,support,reverse),null);
  const missing=structuredClone(seam);
  missing.exposedFaces.pop();
  assert.equal(audit(p,support,missing),null);
  assert.equal(audit(p,support,{...seam,physicallyVerified:false}),null);
});
test('plant contact refuses duplicate cells, forged registry, foreign seed ownership and budgets',()=>{
  const {p,support,seam}=setup();
  const flower={kind:'alpine-flower',site:[0,10,0],estimatedCells:2,
    cells:[{x:0,y:11,z:0,material:'flower'},
      {x:0,y:12,z:0,material:'flower-petal'}],
    safeToIntegrate:false,needsApprovedV8MaterialRegistry:true};
  for(const malformed of [
    {...flower,cells:[flower.cells[0],flower.cells[0]]},
    {...flower,kind:'dwarf-conifer'},
    {...flower,site:[0,11,0]},
    {...flower,needsApprovedV8MaterialRegistry:false},
    {...flower,estimatedCells:19},
    {...flower,cells:[flower.cells[0],{...flower.cells[1],y:10}]},
    {...flower,cells:[flower.cells[0],{...flower.cells[1],material:'snow'}]}
  ])assert.equal(audit(p,support,seam,{plant:malformed}),null);
  assert.equal(audit({...p,safeToIntegrate:true},support,seam),null);
});
