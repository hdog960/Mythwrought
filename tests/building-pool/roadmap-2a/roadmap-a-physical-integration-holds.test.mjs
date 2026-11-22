import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {auditRoadmapAAll79PackBacking} from '../../../src/building-pool/roadmap-2a/roadmap-a-all79-original-pack5-backing-census.mjs';
import {auditRoadmapA79PhysicalIntegrationHolds,inspectRoadmapAUnassignedPack5Options} from '../../../src/building-pool/roadmap-2a/roadmap-a-physical-integration-holds.mjs';
import {buildRoadmapA79PhysicalHoldMatrix,requireRoadmapA79PhysicalWorldPlacement} from '../../../src/building-pool/roadmap-2a/roadmap-a-physical-integration-holds-core.mjs';
test('all79 genuine A5 original designs have exact source-backed physical producer release holds, no guessed choices',{timeout:180000},()=>{
 const x=auditRoadmapA79PhysicalIntegrationHolds();
 assert.equal(x.schema,'mythwrought.roadmap-a.2a-real-producer-physical-integration-holds.v1');
 assert.equal(x.original79Count,79);
 assert.equal(x.acceptedA5SourceCandidates,207);
 assert.equal(x.remainingUnwrittenSourceCandidates,213);
 assert.equal(x.originalSourceCells,1115590);
 assert.equal(x.sourcePack5VariantChoicesRequired,257449);
 assert.equal(x.plasterCellsRequireStructuralReview,105584);
 assert.equal(x.brickSourceRoofCellsRequireEngineering,117048);
 assert.equal(x.thinTileSourceFloorCellsRequireAssemblyReview,34751);
 assert.equal(x.roofBaseNoDirectSourceWallCountIsNotStructuralFailureProof,138698);
 assert.equal(x.tickets.length,79);
 assert.equal(Object.keys(x.byBiome).length,5);
 assert.equal(Object.keys(x.byWave).length,7);
 assert.equal(x.tickets.filter(t=>t.unassignedPack5SourceCells>0).length,71);
 assert.equal(x.tickets.filter(t=>t.plasterSourceWallCells>0).length,33);
 assert.equal(x.tickets.filter(t=>t.brickSourceRoofCells>0).length,17);
 assert.equal(x.tickets.filter(t=>t.thinTileSourceFloorCells>0).length,17);
 assert.equal(x.realWorldPlacementAllowed,false);
 assert.equal(x.physicalVariantsAutoAssigned,false);
 assert.equal(x.physicalIphoneGpuAccepted,false);
 assert.equal(x.saveSchema1Changed,false);
 for(const row of x.tickets){
  assert.equal(row.physicalVariantChosen,false,row.id);
  assert.equal(row.sourceOrientationChosen,false,row.id);
  assert.equal(row.realStructuralSupportCertified,false,row.id);
  assert.equal(row.physicalWorldRegistered,false,row.id);
  assert.equal(row.creatorArtApproved,false,row.id);
  assert.equal(row.realProducerPossibleYawBackings.length,4,row.id);
  assert.equal(row.sourceCellCountGreaterThan4096DoesNotProveInstanceOverflow,true,row.id);
  assert.ok(row.physicalIntegrationHolds.includes('MIXED_PACK_WORLD_PLACEMENT_NOT_VERIFIED'),row.id);
  assert.ok(row.physicalIntegrationHolds.includes('REAL_IPHONE_AND_CREATOR_ART_ON_HOLD'),row.id);
  assert.ok(row.physicalIntegrationHolds.every(s=>typeof s==='string'),row.id);
 }
});
test('original physical Pack5 variant geometries and all four support rotations are sampled but NEVER selected for any building',{timeout:180000},()=>{
 const options=inspectRoadmapAUnassignedPack5Options();
 assert.deepEqual(Object.keys(options),['pack5:079','pack5:080','pack5:081']);
 for(const [symbol,policy] of [['pack5:079','wall'],['pack5:080','none'],['pack5:081','floor']]){
  assert.equal(options[symbol].length,2);
  const names=new Set();
  for(const variant of options[symbol]){
   assert.equal(variant.chosenForRoadmapA,false);
   assert.equal(variant.supportPolicy,policy);
   assert.ok(variant.visibleBoxes>0&&variant.collisionBoxes>0);
   assert.equal(variant.supportByYaw.length,4);
   assert.ok(variant.paletteMaterialKeys.length>0);
   assert.ok(!names.has(variant.variant));names.add(variant.variant);
   if(symbol==='pack5:079')assert.deepEqual(variant.supportByYaw,[
    [[0,0,-1]],[[1,0,0]],[[0,0,1]],[[-1,0,0]]
   ]);
  }
 }
});
test('fail closed on A5 source fingerprint changes, source spoofing, silent variant choices and world placement attempts',{timeout:180000},()=>{
 const census=auditRoadmapAAll79PackBacking();
 const producer=inspectRoadmapAUnassignedPack5Options();
 const valid=buildRoadmapA79PhysicalHoldMatrix(census,producer);
 assert.throws(()=>requireRoadmapA79PhysicalWorldPlacement(valid),/integration prohibited/);
 assert.throws(()=>requireRoadmapA79PhysicalWorldPlacement({}),/unknown physical approval report/);
 const mutated={...census,buildings:[{...census.buildings[0],sourceGeometrySHA256:'invalid'},...census.buildings.slice(1)]};
 assert.throws(()=>buildRoadmapA79PhysicalHoldMatrix(mutated,producer),/geometry\/source SHA/);
 assert.throws(()=>buildRoadmapA79PhysicalHoldMatrix({...census,totals:{...census.totals,plasterAsWholeWall:1}},producer),/original source material count/);
 const injected={...producer,'pack5:079':[{...producer['pack5:079'][0],chosenForRoadmapA:true},producer['pack5:079'][1]]};
 assert.throws(()=>buildRoadmapA79PhysicalHoldMatrix(census,injected),/invented physical source variant/);
});
test('emit exact source-only all79 production hold tickets for separately authenticated focused native acceptance',{timeout:180000},()=>{
 const report=auditRoadmapA79PhysicalIntegrationHolds();
 const raw=JSON.stringify(report,null,2)+'\n';
 const hash=createHash('sha256').update(raw).digest('hex');
 const folder=join(process.cwd(),'artifacts','roadmap-a-physical-holds');
 mkdirSync(folder,{recursive:true});
 writeFileSync(join(folder,'ROADMAP_A_79_IMMUTABLE_SOURCE_REAL_PACK_INTEGRATION_HOLDS.json'),raw);
 console.log('ROADMAP_A_79_TRUE_PACK_PLACEMENT_HOLDS '+JSON.stringify({
  designs:79,cells:report.originalSourceCells,
  unresolvedExplicitVariantCells:report.sourcePack5VariantChoicesRequired,
  plasterWholeWallCells:report.plasterCellsRequireStructuralReview,
  fullMasonryUsedAsRoofCells:report.brickSourceRoofCellsRequireEngineering,
  thinTileFloorCells:report.thinTileSourceFloorCellsRequireAssemblyReview,
  sha256:hash,sourceOnly:true,realIphone:false,creatorArt:false,gamePlaced:false
 }));
});
