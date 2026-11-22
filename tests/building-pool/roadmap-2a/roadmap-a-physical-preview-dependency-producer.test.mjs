import test from 'node:test';
import assert from 'node:assert/strict';
import {auditOriginalPack5PreviewDependencyHolds} from '../../../src/building-pool/roadmap-2a/roadmap-a-physical-preview-dependency-producer.mjs';
const p=(symbol,variant,at,orientation=0)=>({previewFixtureOnly:true,symbol,variant,at,orientation});
test('original source Pack5 mounted plaster to brick: one preview dependency and NO structural authorization',()=>{
 const r=auditOriginalPack5PreviewDependencyHolds([
  p('pack5:079','chalk-lime',[0,0,0]),
  p('pack5:080','hearth-running-bond',[0,0,-1])]);
 assert.equal(r.originalCandidateAttachmentEdges,1);
 assert.equal(r.fixtureHolds[0].supportHold,'PREVIEW_CHAIN_ENDS_AT_UNCERTIFIED_NO_ATTACHMENT_ROOT');
 assert.equal(r.originalUnmodifiedPack5ResolverUsedForPreview,true);
 assert.equal(r.realWorldSupportsCertified,false);
 assert.equal(r.actualMobileGPUCostMeasured,false);
 assert.equal(r.readyForGamePlacement,false);
});
test('authentic ceramic floor preview: a hypothetical one-instance split separates its unchosen brick backing',()=>{
 const r=auditOriginalPack5PreviewDependencyHolds([
  p('pack5:081','sunburst-encaustic',[0,1,0]),
  p('pack5:080','kiln-soldier-course',[0,0,0])],{maxInstances:1});
 assert.equal(r.hypotheticalBatches.length,2);
 assert.equal(r.conditionalEdgesAcrossHypotheticalBatches.length,1);
 assert.equal(r.realManualPackInstanceBatchCreated,false);
 assert.equal(r.originalRoadmapAStructureRegistered,false);
});
test('real thin plaster original producer cannot certify another plaster source-preview mounting',()=>{
 const r=auditOriginalPack5PreviewDependencyHolds([
  p('pack5:079','chalk-lime',[0,0,0]),
  p('pack5:079','hand-troweled',[0,0,-1])]);
 assert.equal(r.originalCandidateAttachmentEdges,0);
 assert.equal(r.fixtureHolds[0].supportHold,'PARTIAL_COLLIDER_NOT_FULL_FACE_SUPPORT');
 assert.equal(r.creatorAccepted,false);
});
test('invalid variants and invented source IDs, rotations or capacities are rejected',()=>{
 for(const a of [p('pack5:079','invented',[0,0,0]),
  {...p('pack5:079','chalk-lime',[0,0,0]),sourceBlueprintId:'r2:bakery:enchanted-forest:large:05'},
  {...p('pack5:079','chalk-lime',[0,0,0]),orientation:undefined}])
   assert.throws(()=>auditOriginalPack5PreviewDependencyHolds([a]));
 const good=[p('pack5:080','hearth-running-bond',[0,0,0])];
 assert.throws(()=>auditOriginalPack5PreviewDependencyHolds(good,{maxInstances:4097}),/instance size/);
});
