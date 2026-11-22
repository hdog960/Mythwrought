import test from 'node:test';
import assert from 'node:assert/strict';
import {closestOriginalPack5FaceGap,auditRoadmapAPack5ContactGapCandidates} from
 '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-contact-gap-core.mjs';
const p=(symbol,variant,at,art,collisionBoxes,orientation=0)=>({
 previewFixtureOnly:true,selectedForRoadmapASource:false,symbol,variant,at,orientation,
 art:art.map(bounds=>({bounds})),collisionBoxes});
function sourceFixturePair(){
 const dependent=p('pack5:079','chalk-lime',[0,0,0],
  [[.025,.025,.025,.975,.975,.105]],[[.025,.025,.025,.975,.975,.141]]);
 const backing=p('pack5:080','hearth-running-bond',[0,0,-1],
  [[0,0,0,1,1,1]],[[0,0,0,1,1,1]]);
 const details=[{fixtureIndex:0,symbol:'pack5:079',explicitPreviewVariant:'chalk-lime',
  explicitPreviewOrientation:0,at:[0,0,0],requiredSourceSupportAt:[0,0,-1],
  neighborPreviewIndex:1,neighborPreviewPhysicalAsset:'pack5:080',
  classification:'source-only-full-face-collider-candidate',physicalLoadBearingCertified:false,
  worldSupportCertified:false,variantChosenForRoadmapABuilding:false}];
 const support={schema:'mythwrought.roadmap-a.preview-real-pack5-support-candidates.v1',
  original79RoadmapASourcesTouched:false,physicalLoadBearingCertified:false,
  physicalWorldBuilt:false,readyForWorldPlacement:false,sourceVariantsAutomaticallySelected:false,
  previewAssets:2,attachmentRequirements:1,details};
 const dependency={schema:'mythwrought.roadmap-a.preview-support-dependency-holds.v1',
  sourceOnly:true,realWorldSupportsCertified:false,readyForGamePlacement:false,
  worldOrSavesModified:false,inputPreviewAssets:2,originalSourceSupportChecks:1,
  conditionalAttachmentEdges:[{dependentFixture:0,potentialBackingFixture:1,sourceSupportCertified:false}],
  originalCandidateAttachmentEdges:1,
  fixtureHolds:[0,1].map(fixtureIndex=>({fixtureIndex,physicalSupportCertified:false,
   supportHold:'PREVIEW_CHAIN_ENDS_AT_UNCERTIFIED_NO_ATTACHMENT_ROOT'}))};
 return {support,dependency,meshes:[dependent,backing].map(({collisionBoxes,...rest})=>rest),
  colliders:[dependent,backing].map(({art,...rest})=>rest)};
}
const cube=[0,0,0,1,1,1];
test('original-style inset wall collider stays 0.025 block units from true full-cube backing',()=>{
 const r=closestOriginalPack5FaceGap([[.025,.025,.025,.975,.975,.141]],[cube],[0,0,0],[0,0,-1]);
 assert.equal(r.nearestFaceGapBlockUnits,.025);
 assert.equal(r.dependentOwnCellInsetBlockUnits,.025);
 assert.equal(r.backingOwnCellInsetBlockUnits,0);
 assert.equal(r.exactFaceContactCandidate,false);
});
test('original-style thin tile is 0.015 block units above its full cube below',()=>{
 const r=closestOriginalPack5FaceGap([[0,.015,0,1,.15,1]],[cube],[0,1,0],[0,0,0]);
 assert.equal(r.nearestFaceGapBlockUnits,.015);
 assert.equal(r.axis,1);
});
test('perfectly touching source faces remain only contact candidates, never structural approval',()=>{
 const r=closestOriginalPack5FaceGap([cube],[cube],[1,0,0],[0,0,0]);
 assert.equal(r.nearestFaceGapBlockUnits,0);
 assert.equal(r.exactFaceContactCandidate,true);
 assert.equal(r.positiveAreaProjectedBoxPairs,1);
});
test('face candidates with zero tangential projected-area overlap report NULL, not contact',()=>{
 const a=[0,0,0,.5,.5,1],b=[.5,.5,0,1,1,1];
 const r=closestOriginalPack5FaceGap([a],[b],[0,0,1],[0,0,0]);
 assert.equal(r.nearestFaceGapBlockUnits,null);
 assert.equal(r.noTangentialFaceOverlap,true);
 assert.equal(r.positiveAreaProjectedBoxPairs,0);
});
test('all six opposing source cell face orientations compute exact bounded proximity',()=>{
 for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){
  const at=[0,0,0];at[axis]=sign;
  const r=closestOriginalPack5FaceGap([cube],[cube],at,[0,0,0]);
  assert.equal(r.axis,axis);
  assert.equal(r.dependentOnPositiveSide,sign===1);
  assert.equal(r.nearestFaceGapBlockUnits,0);
 }
});
test('closest actual overlapping physical boxes, not nearest disjoint decorations, win',()=>{
 const a=[[0,0,.10,.4,.4,.9],[.3,.3,.025,1,1,.6]];
 const b=[[.3,.3,0,1,1,1]];
 const r=closestOriginalPack5FaceGap(a,b,[0,0,0],[0,0,-1]);
 assert.equal(r.nearestFaceGapBlockUnits,.025);
});
test('new complete source-only candidate report preserves 0.025 collision and authored art gap',()=>{
 const f=sourceFixturePair();
 const r=auditRoadmapAPack5ContactGapCandidates(f.support,f.dependency,f.meshes,f.colliders);
 assert.equal(r.originalCandidateAttachmentEdges,1);
 assert.equal(r.candidatesWithPositiveColliderFaceClearance,1);
 assert.equal(r.candidatesWithPositiveAuthoredArtClearance,1);
 assert.equal(r.perOriginalSourceCandidate[0].originalCollision.nearestFaceGapBlockUnits,.025);
 assert.equal(r.perOriginalSourceCandidate[0].originalAuthoredBoxGeometry.nearestFaceGapBlockUnits,.025);
 assert.equal(r.perOriginalSourceCandidate[0].contactHold,'POSITIVE_COLLIDER_TO_BACKING_FACE_CLEARANCE');
 assert.equal(r.realWorldStructuralSupportCertified,false);
 assert.equal(r.readyForWorldPlacement,false);
});
test('source-only contiguous collider and visible box faces do not escalate placement approval',()=>{
 const f=sourceFixturePair();
 f.colliders[0].collisionBoxes=[cube];f.meshes[0].art=[{bounds:cube}];
 const r=auditRoadmapAPack5ContactGapCandidates(f.support,f.dependency,f.meshes,f.colliders);
 assert.equal(r.candidatesWithExactColliderFaceContactOnly,1);
 assert.equal(r.candidatesWithExactAuthoredArtContactOnly,1);
 assert.equal(r.perOriginalSourceCandidate[0].contactHold,'EXACT_SOURCE_BOX_CONTACT_CANDIDATE_ONLY');
 assert.equal(r.physicalProductionOrSettlementAuthorization,undefined);
 assert.equal(r.readyForWorldPlacement,false);
});
test('physical collider identity must match independent original authored mesh provenance',()=>{
 const f=sourceFixturePair();f.colliders[1].variant='kiln-soldier-course';
 assert.throws(()=>auditRoadmapAPack5ContactGapCandidates(f.support,f.dependency,f.meshes,f.colliders),/independently authenticated/);
});
test('face-adjacent source-only requirement rejects fabricated world geometry, ranges and coordinates',()=>{
 assert.throws(()=>closestOriginalPack5FaceGap([cube],[cube],[1,1,0],[0,0,0]),/face-adjacent/);
 assert.throws(()=>closestOriginalPack5FaceGap([[-.2,0,0,1,1,1]],[cube],[1,0,0],[0,0,0]),/source boxes/);
 assert.throws(()=>closestOriginalPack5FaceGap([cube],[cube],[5000,0,0],[4999,0,0]),/bounded integer/);
});
test('bad source approval flags or incomplete fixture lists are rejected',()=>{
 const f=sourceFixturePair();
 f.dependency.realWorldSupportsCertified=true;
 assert.throws(()=>auditRoadmapAPack5ContactGapCandidates(f.support,f.dependency,f.meshes,f.colliders),/unapproved/);
 const g=sourceFixturePair();g.colliders.pop();
 assert.throws(()=>auditRoadmapAPack5ContactGapCandidates(g.support,g.dependency,g.meshes,g.colliders),/independently authenticated/);
});
