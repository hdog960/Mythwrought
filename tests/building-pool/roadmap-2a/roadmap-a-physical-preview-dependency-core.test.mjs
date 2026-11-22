import test from 'node:test';
import assert from 'node:assert/strict';
import {auditExplicitPack5PreviewSupports} from '../../../src/building-pool/roadmap-2a/roadmap-a-physical-preview-support-core.mjs';
import {auditRoadmapAPreviewSupportDependencyHolds as audit} from '../../../src/building-pool/roadmap-2a/roadmap-a-physical-preview-dependency-core.mjs';
const fx=(symbol,at,over={})=>({previewFixtureOnly:true,selectedForRoadmapASource:false,
 symbol,variant:symbol==='pack5:079'?'chalk-lime':symbol==='pack5:080'?'hearth-running-bond':'sunburst-encaustic',
 orientation:0,at,occupiedOffsets:[[0,0,0]],supportOffsets:symbol==='pack5:079'?[[0,0,-1]]:symbol==='pack5:081'?[[0,-1,0]]:[],
 supportPolicy:symbol==='pack5:079'?'wall':symbol==='pack5:081'?'floor':'none',
 collisionBoxes:symbol==='pack5:080'?[[0,0,0,1,1,1]]:symbol==='pack5:079'?[[.025,.025,.025,.975,.975,.141]]:[[0,.015,0,1,.15,1]],...over});
const from=a=>auditExplicitPack5PreviewSupports(a);
test('real brick preview supports original plaster only as an uncertified conditional source chain',()=>{
 const r=audit(from([fx('pack5:079',[0,0,0]),fx('pack5:080',[0,0,-1])]));
 assert.equal(r.originalCandidateAttachmentEdges,1);
 assert.equal(r.conditionalCycles.length,0);
 assert.equal(r.fixtureHolds[0].supportHold,'PREVIEW_CHAIN_ENDS_AT_UNCERTIFIED_NO_ATTACHMENT_ROOT');
 assert.equal(r.fixtureHolds[0].terminalPreviewRoot,1);
 assert.equal(r.fixtureHolds[0].preliminaryDependencyDepth,1);
 assert.equal(r.fixtureHolds[1].supportHold,'NO_REQUIRED_PREVIEW_ATTACHMENT_NOT_WORLD_ANCHOR_PROOF');
 assert.equal(r.readyForGamePlacement,false);
});
test('two preview fixtures split into separate bounded batches expose cross-batch attachment dependency',()=>{
 const r=audit(from([fx('pack5:081',[0,1,0]),fx('pack5:080',[0,0,0])]),{maxInstances:1});
 assert.equal(r.hypotheticalBatches.length,2);
 assert.equal(r.conditionalEdgesAcrossHypotheticalBatches.length,1);
 assert.equal(r.conditionalEdgesAcrossHypotheticalBatches[0].dependentHypotheticalBatch,0);
 assert.equal(r.conditionalEdgesAcrossHypotheticalBatches[0].backingHypotheticalBatch,1);
 assert.equal(r.actualManualFivePackBlueprintPlanCreated,false);
});
test('thin plaster or ceramic neighboring collision never becomes a certified full-face backing',()=>{
 const r=audit(from([fx('pack5:079',[0,0,0]),fx('pack5:079',[0,0,-1])]));
 assert.equal(r.originalCandidateAttachmentEdges,0);
 assert.equal(r.fixtureHolds[0].supportHold,'PARTIAL_COLLIDER_NOT_FULL_FACE_SUPPORT');
 assert.equal(r.partialOrMissingSourceSupportCount,2);
});
test('genuine empty support target is still an unresolved source preview dependency',()=>{
 const r=audit(from([fx('pack5:081',[0,1,0])]));
 assert.equal(r.fixtureHolds[0].supportHold,'MISSING_EXPLICIT_PREVIEW_SUPPORT');
 assert.equal(r.originalCandidateAttachmentEdges,0);
});
test('synthetic full-cell wall-like collider support cycles fail closed, never certify structure',()=>{
 const r=audit(from([
  fx('pack5:079',[0,0,0],{collisionBoxes:[[0,0,0,1,1,1]]}),
  fx('pack5:079',[0,0,-1],{orientation:2,supportOffsets:[[0,0,1]],collisionBoxes:[[0,0,0,1,1,1]]})]));
 assert.equal(r.originalCandidateAttachmentEdges,2);
 assert.deepEqual(r.conditionalCycles,[0,1]);
 assert.ok(r.fixtureHolds.every(x=>x.supportHold==='CYCLIC_PREVIEW_ATTACHMENT'));
 assert.equal(r.realWorldSupportsCertified,false);
});
test('fail-closed malformed input reports, silent physical acceptance, spoofed neighbors, and instance caps',()=>{
 const base=from([fx('pack5:079',[0,0,0]),fx('pack5:080',[0,0,-1])]);
 for(const bad of [{...base,readyForWorldPlacement:true},{...base,classificationTotals:{}},
  {...base,details:[{...base.details[0],neighborPreviewIndex:99}]},
  {...base,details:[{...base.details[0],physicalLoadBearingCertified:true}]},
  {...base,details:[{...base.details[0],neighborPreviewIndex:0}]}])
   assert.throws(()=>audit(bad),/dependency denied/);
 for(const maxInstances of [0,4097,1.25])assert.throws(()=>audit(base,{maxInstances}),/maximum instance size/);
});
