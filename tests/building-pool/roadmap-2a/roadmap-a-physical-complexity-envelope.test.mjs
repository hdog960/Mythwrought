import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {auditRoadmapAAll79PackBacking} from '../../../src/building-pool/roadmap-2a/roadmap-a-all79-original-pack5-backing-census.mjs';
import {readRoadmapAOriginalPack5GeometryAlternatives,auditRoadmapAConditionalSourceGeometryCost} from '../../../src/building-pool/roadmap-2a/roadmap-a-physical-complexity-envelope.mjs';
import {buildRoadmapAConditionalPack5GeometryEnvelope} from '../../../src/building-pool/roadmap-2a/roadmap-a-physical-complexity-envelope-core.mjs';
test('all79 authentic A5 source roles: exact conditional unchosen Pack5 physical triangle/box bounds, not runtime GPU',{timeout:240000},()=>{
 const d=auditRoadmapAConditionalSourceGeometryCost();
 assert.equal(d.schema,'mythwrought.roadmap-a.conditional-original-pack5-geometry-envelope.v1');
 assert.equal(d.originalSourceDesigns,79);
 assert.equal(d.originalSourceOnlyA5207,207);
 assert.equal(d.unwrittenCanonicalSourceDesigns,213);
 assert.equal(d.originalSourceVoxels,1115590);
 assert.equal(d.modelledThreeRoleSourceCells,257383);
 assert.equal(d.unresolvedOtherPack5VariantSourceCells,66);
 assert.deepEqual(d.hypotheticalSingleAssetPerOriginalCellEnvelope,{
  sourceCells:257383,
  conditionalMinBoxes:6281953,conditionalMaxBoxes:8061319,
  conditionalMinTriangles:75383436,conditionalMaxTriangles:96735828,
  conditionalMinVertices:150766872,conditionalMaxVertices:193471656
 });
 assert.equal(d.validForRealGpuOrFpsPredictions,false);
 assert.equal(d.validForRuntimeTriangleCounts,false);
 assert.equal(d.physicalGeometryInstantiated,false);
 assert.equal(d.gameplayStructureRegistrationAllowed,false);
 assert.equal(d.realWorldCollisionCertified,false);
 assert.equal(d.creatorArtApproved,false);
 assert.equal(d.buildings.length,79);
 assert.equal(new Set(d.buildings.map(x=>x.id)).size,79);
 for(const b of d.buildings){
  assert.equal(b.variantsChosen,false,b.id);
  assert.equal(b.instantiatedPhysicalAssets,0,b.id);
  assert.equal(b.actualCollisionWorldBuilt,false,b.id);
  assert.equal(b.realGPUUploaded,false,b.id);
  assert.equal(b.physicalIPhoneTested,false,b.id);
  assert.equal(b.creatorArtworkApproved,false,b.id);
  assert.equal(b.conditionalRoleEnvelopes.length,3,b.id);
  assert.equal(b.conditionalComplexityEnvelope.conditionalMinTriangles,
   12*b.conditionalComplexityEnvelope.conditionalMinBoxes,b.id);
  assert.equal(b.conditionalComplexityEnvelope.conditionalMaxTriangles,
   12*b.conditionalComplexityEnvelope.conditionalMaxBoxes,b.id);
  assert.equal(b.conditionalComplexityEnvelope.conditionalMinVertices,
   24*b.conditionalComplexityEnvelope.conditionalMinBoxes,b.id);
  assert.equal(b.conditionalComplexityEnvelope.conditionalMaxVertices,
   24*b.conditionalComplexityEnvelope.conditionalMaxBoxes,b.id);
 }
});
test('real authored Pack5 six variants, original 12-triangle per AABB mesh, physical support and no chosen source identity',{timeout:240000},()=>{
 const real=readRoadmapAOriginalPack5GeometryAlternatives();
 assert.deepEqual(Object.keys(real),['pack5:079','pack5:080','pack5:081']);
 for(const [symbol,counts,policy] of [
  ['pack5:079',[8,12],'wall'],
  ['pack5:080',[42,53],'none'],
  ['pack5:081',[17,15],'floor']
 ]){
  const examples=real[symbol];
  assert.deepEqual(examples.map(x=>x.visibleBoxCount),counts);
  for(const x of examples){
   assert.equal(x.sampledFromActualPack5Surface,true);
   assert.equal(x.chosenForBlueprint,false);
   assert.equal(x.supportPolicy,policy);
   assert.equal(x.supportByYaw.length,4);
   assert.equal(x.meshTriangleCount,12*x.visibleBoxCount);
   assert.equal(x.meshVertexCount,24*x.visibleBoxCount);
   assert.equal(x.collisionBoxCount,1);
   if(symbol==='pack5:079')assert.deepEqual(x.supportByYaw,[
    [[0,0,-1]],[[1,0,0]],[[0,0,1]],[[-1,0,0]]
   ]);
  }
 }
});
test('fail-closed for fabricated physical variants, altered source geometry and changed real Pack5 mesh counts',{timeout:240000},()=>{
 const census=auditRoadmapAAll79PackBacking(),real=readRoadmapAOriginalPack5GeometryAlternatives();
 assert.throws(()=>buildRoadmapAConditionalPack5GeometryEnvelope({...census,
  buildings:[{...census.buildings[0],sourceGeometrySHA256:'fake'},...census.buildings.slice(1)]},real),/SHA provenance/);
 assert.throws(()=>buildRoadmapAConditionalPack5GeometryEnvelope({...census,
  totals:{...census.totals,plasterAsWholeWall:1}},real),/source material census/);
 assert.throws(()=>buildRoadmapAConditionalPack5GeometryEnvelope(census,{...real,
  'pack5:080':[{...real['pack5:080'][0],chosenForBlueprint:true},real['pack5:080'][1]]}),/silently selected/);
 assert.throws(()=>buildRoadmapAConditionalPack5GeometryEnvelope(census,{...real,
  'pack5:079':[{...real['pack5:079'][0],meshTriangleCount:1},real['pack5:079'][1]]}),/triangle\/vertex identity/);
 assert.throws(()=>buildRoadmapAConditionalPack5GeometryEnvelope(census,{...real,
  'pack5:079':[{...real['pack5:079'][0],supportByYaw:[[[0,0,1]],...real['pack5:079'][0].supportByYaw.slice(1)]},real['pack5:079'][1]]}),/yaw mismatch/);
});
test('emit authentic source-only 79-design conditional geometry envelope for later focused exact-head verification',{timeout:240000},()=>{
 const report=auditRoadmapAConditionalSourceGeometryCost();
 const raw=JSON.stringify(report,null,2)+'\n';
 const dir=join(process.cwd(),'artifacts','roadmap-a-pack5-conditional-geometry');
 mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'ROADMAP_A_79_UNCHOSEN_REAL_PACK5_CONDITIONAL_GEOMETRY_ENVELOPE.json'),raw);
 console.log('ROADMAP_A_REAL_PACK5_CONDITIONAL_GEOMETRY_ENVELOPE '+JSON.stringify({
  designs:report.originalSourceDesigns,sourceRoleCells:report.modelledThreeRoleSourceCells,
  otherUnresolvedVariantCells:report.unresolvedOtherPack5VariantSourceCells,
  hypotheticalUnmergedBoxes:report.hypotheticalSingleAssetPerOriginalCellEnvelope,
  sha256:createHash('sha256').update(raw).digest('hex'),
  sourceOnly:true,physicalAssetsPlaced:0,realGpuMeasured:false,creatorAccepted:false
 }));
});
