import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {auditRoadmapAProducerFidelity} from '../../../src/building-pool/roadmap-2a/roadmap-a-physical-producer-fidelity.mjs';
import {MANUAL_FIVE_PACK_CATALOG,MANUAL_FIVE_PACK_COUNTS,resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
const material=(report,kind,symbol)=>report.sourceKindMaterialPairs[kind+'|'+symbol]??0;
test('Roadmap A all79 exact original source units are tracked against real five-pack catalog, not cube proxy artwork',{timeout:240000},()=>{
 const d=auditRoadmapAProducerFidelity();
 assert.equal(d.sourceCandidateCount,79);
 assert.equal(d.sourceWaves,7);
 assert.equal(d.sourceDesigns.length,79);
 assert.equal(new Set(d.sourceDesigns.map(x=>x.id)).size,79);
 assert.equal(MANUAL_FIVE_PACK_COUNTS.families,96);
 assert.equal(MANUAL_FIVE_PACK_CATALOG.length,106);
 assert.equal(d.physicalProducerFamilies,106);
 assert.deepEqual(d.unknownManualAssetSymbols,[], 'Source material must actually belong to the real Manual Pack catalog');
 assert.ok(d.totalSourceVoxels>=100000,'79 source-only structures must be real populated geometry');
 assert.equal(Object.values(d.sourceKinds).reduce((a,b)=>a+b,0),d.totalSourceVoxels);
 assert.equal(Object.values(d.sourceMaterials).reduce((a,b)=>a+b,0),d.totalSourceVoxels);
 assert.ok(d.sourceDesigns.every(b=>b.sourceVoxels>1000&&b.sourceOnly&& !b.producerSupportCertified&&!b.physicalBuildingAccepted));
 assert.equal(new Set(d.sourceDesigns.map(x=>x.category)).size,6);
 assert.equal(Object.keys(d.perCategoryBiomeCoverage).length,5);
 assert.equal(d.industrial345Changed,false);
 assert.equal(d.government315Changed,false);
 assert.equal(d.original128CommerceChanged,false);
 assert.equal(d.staged207A5RecordsChanged,false);
 assert.equal(d.implementationBlockedUntilPhysicalProducerReview,true);
});
test('Real Pack5 producer disproves naive material_kind->full_cube interpretation; no silent variant assignment',{timeout:240000},()=>{
 const d=auditRoadmapAProducerFidelity();
 assert.ok(material(d,'wall','pack5:079')>0,'Physical wall-mounted plaster used as source wall must be audited');
 assert.ok(material(d,'roof','pack5:080')>0,'Full brick masonry used as source roof must be audited');
 assert.ok(material(d,'floor','pack5:081')>0,'Thin ceramic floor tile used as full source floor must be audited');
 assert.equal(d.wallMountedPack5PlasterUsedAsFullSourceWallCells,material(d,'wall','pack5:079'));
 assert.equal(d.actualProducerFiredBrickUsedAsSourceRoofCells,material(d,'roof','pack5:080'));
 assert.equal(d.actualProducerThinCeramicTileUsedAsSourceFloorCells,material(d,'floor','pack5:081'));
 assert.ok(d.mandatoryVariantUnspecifiedSourceCellCount>0);
 assert.ok(d.sourceBaseRoofColumns>0);
 assert.ok(d.roofBaseColumnsWithoutImmediateFullWallBelow>0);
 assert.ok(d.symbolicDoorOpeningsNotActualPlacedDoors>0);
 assert.throws(()=>resolveManualFivePackAsset('pack5:079'),/explicit authored variant/);
 for(const [symbol,policy] of [['pack5:079','wall'],['pack5:080','none'],['pack5:081','floor']]){
  const variants=d.actualPack5ProducerVariantExamples[symbol];
  assert.equal(variants.length,2);
  assert.equal(new Set(variants.map(x=>x.variant)).size,2);
  for(const v of variants){
   assert.equal(v.supportPolicy,policy);
   assert.equal(v.selectedByRoadmapASource,false,'Demonstration variants may not rewrite authored source');
   assert.equal(v.physicalPackApprovedForSettlementUse,false);
   assert.ok(v.visiblePhysicalBoxesPerInstance>0);
   assert.ok(v.collisionPhysicalBoxesPerInstance>0);
  }
 }
 for(const v of d.actualPack5ProducerVariantExamples['pack5:079']){
  assert.ok(v.supportOffsets.length>0,'Wall plaster demands backing not proven by cube world');
  assert.ok(v.collisionBoxes.every(b=>b[5]-b[2]<.25),'Plaster does NOT occupy full solid collision cube');
 }
 for(const v of d.actualPack5ProducerVariantExamples['pack5:080']){
  assert.ok(v.collisionBoxes.some(b=>[0,0,0,1,1,1].every((n,i)=>b[i]===n)),'Actual masonry uses full cube collision');
 }
 for(const v of d.actualPack5ProducerVariantExamples['pack5:081']){
  assert.ok(v.supportOffsets.length>0,'Thin floor-tile needs grounded support');
  assert.ok(v.collisionBoxes.every(b=>b[4]-b[1]<.3),'Floor tile is NOT a full cube');
 }
 assert.equal(d.runtimeTriangleAndGpuCostMeasured,false);
});
test('Roadmap A read-only producer blocker artifact: source cells, support/variant/collision risks, no false gameplay acceptance',{timeout:240000},()=>{
 const d=auditRoadmapAProducerFidelity();
 assert.equal(d.physicalWallBackingProven,false);
 assert.equal(d.longRoofSpansBearingProven,false);
 assert.equal(d.physicalBlockCollisionsProven,false);
 assert.equal(d.runtimeTriangleAndGpuCostMeasured,false);
 assert.equal(d.sourceCubeVisualArtAccepted,false);
 assert.equal(d.physicalIPhoneAccepted,false);
 assert.equal(d.creatorAccepted,false);
 assert.equal(d.sourceCatalogToMixedOwnerWorldPlacementProven,false);
 const dir=join(process.cwd(),'artifacts','roadmap-a-producer-fidelity');
 mkdirSync(dir,{recursive:true});
 const raw=JSON.stringify(d,null,2)+'\n';
 writeFileSync(join(dir,'ROADMAP_A_ALL79_REAL_MANUAL_PACK_PRODUCER_RISK.json'),raw);
 console.log('ROADMAP_A_REAL_PACK_PRODUCER_RISK '+JSON.stringify({
  designs:d.sourceCandidateCount,sourceVoxels:d.totalSourceVoxels,
  mountedPlasterWallCells:d.wallMountedPack5PlasterUsedAsFullSourceWallCells,
  masonryCellsActingAsRoof:d.actualProducerFiredBrickUsedAsSourceRoofCells,
  thinTileCellsActingAsFloor:d.actualProducerThinCeramicTileUsedAsSourceFloorCells,
  missingExplicitVariants:d.mandatoryVariantUnspecifiedSourceCellCount,
  roofBaseWithoutDirectWallBelow:d.roofBaseColumnsWithoutImmediateFullWallBelow,
  overSingleBlueprintLimitIfOnePlacementPerCell:d.sourceDesignsExceed4096IndividualCells,
  sha256:createHash('sha256').update(raw).digest('hex'),
  physicalSupportAccepted:false,actualGpuMeasured:false,worldRegistered:false
 }));
});
