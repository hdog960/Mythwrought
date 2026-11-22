import test from 'node:test';
import assert from 'node:assert/strict';
import {auditOriginalPack5AllVariantYawRaySelection,inspectOriginalPack5SourceRayFixture}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-ray-selection-producer.mjs';
import {PACK5_BUILDER_CATALOG} from '../../../src/pack5-integration/catalog.mjs';
const p=(symbol,variant,orientation=0)=>({
 previewFixtureOnly:true,symbol,variant,orientation,at:[0,0,0]});
test('all original Pack5 079/080/081 variants and four yaws: exact 24 previews and 3600 source rays',()=>{
 const r=auditOriginalPack5AllVariantYawRaySelection();
 assert.equal(r.originalSourceAlternatives,24);
 assert.equal(r.sourcePreviewRaySamples,3600);
 assert.equal(r.originalSourceAlternativeWitnesses.length,24);
 assert.deepEqual(Object.keys(r.byOriginalSymbol).sort(),['pack5:079','pack5:080','pack5:081']);
 for(const row of Object.values(r.byOriginalSymbol)){
  assert.equal(row.authoredVariants,2);
  assert.equal(row.explicitYawWitnesses,8);
  assert.equal(row.sampleRays,1200);
 }
 assert.equal(r.variantsAndYawsExhaustivelyExaminedNotChosen,true);
 assert.equal(r.originalA5PhysicalMaterialOrYawChosen,false);
 assert.equal(r.readyForWorldPlacement,false);
});
test('authentic source authored mesh triangles geometrically agree with selection boxes at fixed analytical rays',()=>{
 const r=auditOriginalPack5AllVariantYawRaySelection();
 const raw=r.originalSourceAlternativeWitnesses.reduce(
  (n,row)=>n+row.raySummary.selectionTriangleMismatch,0);
 const grazing=r.originalSourceAlternativeWitnesses.reduce(
  (n,row)=>n+row.raySummary.sourceBoundaryGrazingRayDisagreements,0);
 const interior=r.originalSourceAlternativeWitnesses.reduce(
  (n,row)=>n+row.raySummary.interiorTriangleSelectionDisagreements,0);
 assert.equal(raw,grazing+interior,'preserve raw original source ray mismatch evidence');
 assert.equal(interior,0,'interior mismatch requires engineering, not float edge reclassification');
 assert.ok(raw>0,'original source authored boundary-grazing disagreements must be retained');
 assert.equal(r.originalInteriorTriangleDisagreementCount,0);
 assert.ok(r.originalSourceAlternativeWitnesses.every(row=>
  row.originalUnchangedManualFivePackSelectionUsed===true&&
  row.originalUnchangedManualFivePackCollisionUsed===true&&
  row.originalUnchangedSourceAuthoredTriangleMeshUsed===true&&
  row.realGameRaycastExecuted===false));
});
test('original full-cell fired brick collider covers all 150 axial rays while geometry/selection remains separately audited',()=>{
 const r=auditOriginalPack5AllVariantYawRaySelection();
 const brick=r.originalSourceAlternativeWitnesses.filter(x=>x.symbol==='pack5:080');
 assert.equal(brick.length,8);
 assert.ok(brick.every(x=>x.raySummary.collisionHits===150));
 assert.equal(brick.reduce((n,x)=>n+x.raySummary.sampleRays,0),1200);
 assert.ok(brick.every(x=>x.raySummary.selectionHits<=150));
 assert.equal(r.realWorldCollisionOrTargetingAccepted,undefined);
});
test('original plaster and ceramic variants retain authentic wall and floor support offset directions',()=>{
 const row=PACK5_BUILDER_CATALOG.find(x=>x.symbolicId==='pack5:079');
 const offsets=[[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]];
 let sampled=0;
 for(const variant of row.variants)for(let yaw=0;yaw<4;yaw++){
  const r=inspectOriginalPack5SourceRayFixture(p('pack5:079',variant,yaw));
  assert.equal(r.originalManualPackSupportPolicy,'wall');
  assert.deepEqual(r.originalManualPackSupportOffsets,[offsets[yaw]]);
  assert.ok(r.raySummary.collisionHits>0);
  assert.ok(r.raySummary.selectionHits<=r.raySummary.sampleRays);
  assert.equal(r.originalA5SourceMaterialsChosen,false);
  sampled++;
 }
 for(const variant of PACK5_BUILDER_CATALOG.find(x=>x.symbolicId==='pack5:081').variants){
  const r=inspectOriginalPack5SourceRayFixture(p('pack5:081',variant,3));
  assert.equal(r.originalManualPackSupportPolicy,'floor');
  assert.deepEqual(r.originalManualPackSupportOffsets,[[0,-1,0]]);
  sampled++;
 }
 assert.equal(sampled,10);
});
test('invalid original variants, omitted yaw, inferred actual source building or foreign family fail closed',()=>{
 const good=p('pack5:079','chalk-lime',0);
 for(const bad of [
  {...good,orientation:undefined},
  {...good,variant:'invented'},
  {...good,symbol:'pack5:096'},
  {...good,sourceBlueprintId:'r2:shop:desert:large:05'},
  {...good,buildingId:'new-settlement'},
  {...good,previewFixtureOnly:false},
  {...good,at:[5000,0,0]}
 ])assert.throws(()=>inspectOriginalPack5SourceRayFixture(bad));
});
