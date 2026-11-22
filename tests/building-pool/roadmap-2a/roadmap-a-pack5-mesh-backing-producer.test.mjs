import test from 'node:test';
import assert from 'node:assert/strict';
import {auditOriginalPack5MeshBackingBoundary} from
 '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-mesh-backing-producer.mjs';
import {PACK5_BUILDER_CATALOG} from '../../../src/pack5-integration/catalog.mjs';
const p=(symbol,variant,at,orientation=0)=>({previewFixtureOnly:true,symbol,variant,at,orientation});
test('original Pack5 full brick collider vs actual rotated mesh art contact discrepancy, not support certification',()=>{
 const report=auditOriginalPack5MeshBackingBoundary([
  p('pack5:079','chalk-lime',[0,0,0]),
  p('pack5:080','hearth-running-bond',[0,0,-1])]);
 assert.equal(report.fullColliderCandidatesWithMeshCrosscheck,1);
 assert.equal(report.candidateBoundaryWitnesses[0].backingSymbol,'pack5:080');
 assert.ok(report.candidateBoundaryWitnesses[0].projectedBoundaryFraction<1);
 assert.equal(report.originalUnchangedManualFivePackColliderSourceUsed,true);
 assert.equal(report.originalUnchangedPack5SurfaceBoxMeshUsed,true);
 assert.equal(report.realPhysicalRendererOrIPhoneVerified,false);
 assert.equal(report.readyForWorldPlacement,false);
});
test('original two ceramic/brick variants across all 4 yaws stay explicit and do not certify vertical bearing',()=>{
 let n=0;
 for(const variant of PACK5_BUILDER_CATALOG.find(x=>x.symbolicId==='pack5:081').variants)
  for(let orientation=0;orientation<4;orientation++){
   const brick=PACK5_BUILDER_CATALOG.find(x=>x.symbolicId==='pack5:080').variants[orientation%2];
   const report=auditOriginalPack5MeshBackingBoundary([
    p('pack5:081',variant,[0,1,0],orientation),
    p('pack5:080',brick,[0,0,0])],{maxInstances:1});
   assert.equal(report.fullColliderCandidatesWithMeshCrosscheck,1);
   assert.equal(report.hypotheticalBatchCrossings,1);
   assert.equal(report.realPhysicalRendererOrIPhoneVerified,false);
   assert.equal(report.creatorAccepted,false);n++;
  }
 assert.equal(n,8);
});
test('real thin plaster backing remains partial collider; no mesh contact promotion permitted',()=>{
 const r=auditOriginalPack5MeshBackingBoundary([
  p('pack5:079','chalk-lime',[0,0,0]),
  p('pack5:079','hand-troweled',[0,0,-1])]);
 assert.equal(r.fullColliderCandidatesWithMeshCrosscheck,0);
 assert.equal(r.sourceSupportDependencyHolds[0],'PARTIAL_COLLIDER_NOT_FULL_FACE_SUPPORT');
 assert.equal(r.readyForWorldPlacement,false);
});
test('unknown variants, omitted rotations, actual A5 source IDs and invalid real instance caps rejected',()=>{
 const base=p('pack5:079','chalk-lime',[0,0,0]);
 for(const bad of [{...base,variant:'unapproved'},{...base,orientation:undefined},
  {...base,sourceBlueprintId:'r2:general-store:desert:large:05'}])
  assert.throws(()=>auditOriginalPack5MeshBackingBoundary([bad]));
 assert.throws(()=>auditOriginalPack5MeshBackingBoundary([base],{maxInstances:4097}));
});
