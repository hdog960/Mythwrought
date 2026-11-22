import test from 'node:test';
import assert from 'node:assert/strict';
import {auditOriginalPack5ProjectedContactFootprints}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-footprint-producer.mjs';
import {PACK5_BUILDER_CATALOG} from '../../../src/pack5-integration/catalog.mjs';
const p=(symbol,variant,at,orientation=0)=>({previewFixtureOnly:true,symbol,variant,at,orientation});
const variants=symbol=>PACK5_BUILDER_CATALOG.find(x=>x.symbolicId===symbol).variants;
const near=(got,expected)=>assert.ok(Math.abs(got-expected)<0.000001,`expected ${expected}, got ${got}`);

test('16 explicit authentic original plaster-to-brick previews: four yaws, both variants and backing variants',()=>{
 const mount=[[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]];
 let samples=0;
 for(const variant of variants('pack5:079'))for(let yaw=0;yaw<4;yaw++)
  for(const brick of variants('pack5:080')){
   const r=auditOriginalPack5ProjectedContactFootprints([
    p('pack5:079',variant,[0,0,0],yaw),p('pack5:080',brick,mount[yaw])]);
   assert.equal(r.originalCandidateAttachments,1);
   assert.equal(r.originalManualFivePackSelectionGeometryCrosschecked,true);
   assert.equal(r.sourceSelectionBoxesEqualOriginalVisibleBoxes,true);
   const row=r.individualOriginalCandidateFootprints[0];
   near(row.colliderFootprint.nearestOriginalFaceGapBlockUnits,.025);
   near(row.colliderFootprint.nearestGapPairProjectedUnionArea,.9025);
   assert.equal(row.colliderFootprint.fullFaceAreaAtClosestGapOnly,false);
   assert.equal(row.colliderProjectionHold,'FULL_DEPENDENT_PROJECTION_AT_NEAREST_GAP_ONLY');
   assert.equal(row.realStructuralLoadAccepted,false);
   assert.equal(r.sourceA5MaterialOrOrientationChosen,false);samples++;
  }
 assert.equal(samples,16);
});
test('16 authentic ceramic-to-brick previews retain full COLLIDER projected area but 0.015 block gap',()=>{
 let samples=0;
 for(const tile of variants('pack5:081'))for(let yaw=0;yaw<4;yaw++)
  for(const brick of variants('pack5:080')){
   const r=auditOriginalPack5ProjectedContactFootprints([
    p('pack5:081',tile,[0,1,0],yaw),p('pack5:080',brick,[0,0,0])],{maxInstances:1});
   assert.equal(r.originalCandidateAttachments,1);
   assert.equal(r.conditionalCrossHypotheticalBatchAttachments,1);
   const row=r.individualOriginalCandidateFootprints[0];
   near(row.colliderFootprint.nearestOriginalFaceGapBlockUnits,.015);
   near(row.colliderFootprint.nearestGapPairProjectedUnionArea,1);
   assert.ok(row.authoredMeshFootprint.nearestGapPairProjectedUnionArea>=0);
   assert.ok(row.authoredMeshFootprint.nearestGapPairProjectedUnionArea<=1);
   assert.equal(r.physicalBlueprintCreated,false);
   assert.equal(r.realWorldLoadBearingCertified,false);samples++;
  }
 assert.equal(samples,16);
});
test('real original physical selection is exact visible producer geometry, never player targeting proof',()=>{
 const r=auditOriginalPack5ProjectedContactFootprints([
  p('pack5:079','hand-troweled',[0,0,0]),
  p('pack5:080','hearth-running-bond',[0,0,-1])]);
 assert.equal(r.originalSourceVisibleBoxes,r.originalSourceSelectionBoxes);
 assert.ok(r.originalSourceVisibleBoxes>r.originalSourceCollisionBoxes);
 assert.equal(r.actualGamePlayerSelectionOrCollisionMeasured,false);
 assert.equal(r.originalGameWebGL2OrIPhoneMeasured,undefined);
 assert.equal(r.realIPhoneOrWebGL2Measured,false);
 assert.equal(r.readyForWorldPlacement,false);
});
test('original half-face/partial plaster backing does not become a candidate by projection arithmetic',()=>{
 const r=auditOriginalPack5ProjectedContactFootprints([
  p('pack5:079','chalk-lime',[0,0,0]),
  p('pack5:079','hand-troweled',[0,0,-1])]);
 assert.equal(r.originalCandidateAttachments,0);
 assert.equal(r.individualOriginalCandidateFootprints.length,0);
 assert.equal(r.worldPlacementOrGameplayAllowed,false);
});
test('authored source variants or yaws must be explicit; no real A5 ID or unsafe batch accepted',()=>{
 const good=p('pack5:079','chalk-lime',[0,0,0]);
 for(const bad of [{...good,variant:'invented'}, {...good,orientation:undefined},
  {...good,sourceBlueprintId:'r2:general-store:desert:large:05'},
  {...good,buildingId:'A5'}, {...good,previewFixtureOnly:false}])
  assert.throws(()=>auditOriginalPack5ProjectedContactFootprints([bad]));
 assert.throws(()=>auditOriginalPack5ProjectedContactFootprints([good],{maxInstances:4097}));
});
