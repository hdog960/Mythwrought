import test from 'node:test';
import assert from 'node:assert/strict';
import {auditOriginalPack5ContactGapCandidates} from
 '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-contact-gap-producer.mjs';
import {PACK5_BUILDER_CATALOG} from '../../../src/pack5-integration/catalog.mjs';
const p=(symbol,variant,at,orientation=0)=>({previewFixtureOnly:true,symbol,variant,at,orientation});
const approx=(got,want)=>assert.ok(got!==null&&Math.abs(got-want)<0.000001,
 `authentic preview expected gap about ${want} block units, got ${got}`);
test('original Manual Pack5 plaster-to-brick preview has FULL backing collision but positive 0.025-block collision clearance',()=>{
 const r=auditOriginalPack5ContactGapCandidates([
  p('pack5:079','chalk-lime',[0,0,0]),
  p('pack5:080','hearth-running-bond',[0,0,-1])]);
 assert.equal(r.originalCandidateAttachmentEdges,1);
 assert.equal(r.candidatesWithPositiveColliderFaceClearance,1);
 approx(r.perOriginalSourceCandidate[0].originalCollision.nearestFaceGapBlockUnits,.025);
 approx(r.perOriginalSourceCandidate[0].originalAuthoredBoxGeometry.nearestFaceGapBlockUnits,.025);
 assert.equal(r.perOriginalSourceCandidate[0].contactHold,'POSITIVE_COLLIDER_TO_BACKING_FACE_CLEARANCE');
 assert.equal(r.liveRendererOrSourceWorldModified,false);
 assert.equal(r.unalteredOriginalManualFivePackResolver,true);
 assert.equal(r.readyForWorldPlacement,false);
});
test('original Pack5 ceramic floor-to-brick preview has 0.015-block physical clearance; 1-instance split is hypothetical',()=>{
 const r=auditOriginalPack5ContactGapCandidates([
  p('pack5:081','sunburst-encaustic',[0,1,0]),
  p('pack5:080','kiln-soldier-course',[0,0,0])],{maxInstances:1});
 assert.equal(r.originalCandidateAttachmentEdges,1);
 assert.equal(r.conditionalCrossHypotheticalBatchCandidates,1);
 approx(r.perOriginalSourceCandidate[0].originalCollision.nearestFaceGapBlockUnits,.015);
 approx(r.perOriginalSourceCandidate[0].originalAuthoredBoxGeometry.nearestFaceGapBlockUnits,.015);
 assert.equal(r.variantYawSourceAssignmentPerformed,false);
 assert.equal(r.schema1SavesWritten,false);
});
test('authentic four yaw wall mounts x both explicit plaster variants report no contact approval',()=>{
 const offsets=[[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]];
 let n=0;
 for(const row of PACK5_BUILDER_CATALOG.find(x=>x.symbolicId==='pack5:079').variants)
  for(let yaw=0;yaw<4;yaw++){
   const r=auditOriginalPack5ContactGapCandidates([
    p('pack5:079',row,[0,0,0],yaw),
    p('pack5:080','hearth-running-bond',offsets[yaw])]);
   assert.equal(r.originalCandidateAttachmentEdges,1);
   approx(r.perOriginalSourceCandidate[0].originalCollision.nearestFaceGapBlockUnits,.025);
   assert.equal(r.perOriginalSourceCandidate[0].originalCollision.axis,offsets[yaw].findIndex(x=>x!==0));
   assert.equal(r.realWorldStructuralSupportCertified,false);n++;
  }
 assert.equal(n,8);
});
test('original non-full plaster backer, invented variants and A5 source assignment fail closed',()=>{
 const r=auditOriginalPack5ContactGapCandidates([
  p('pack5:079','chalk-lime',[0,0,0]),
  p('pack5:079','hand-troweled',[0,0,-1])]);
 assert.equal(r.originalCandidateAttachmentEdges,0);
 const bad=p('pack5:079','unapproved',[0,0,0]);
 assert.throws(()=>auditOriginalPack5ContactGapCandidates([bad]));
 assert.throws(()=>auditOriginalPack5ContactGapCandidates([
  {...p('pack5:079','chalk-lime',[0,0,0]),sourceBlueprintId:'r2:example'}]));
 assert.throws(()=>auditOriginalPack5ContactGapCandidates([
  {...p('pack5:079','chalk-lime',[0,0,0]),orientation:undefined}]));
 assert.throws(()=>auditOriginalPack5ContactGapCandidates([p('pack5:080','hearth-running-bond',[0,0,0])],{maxInstances:4097}));
});
