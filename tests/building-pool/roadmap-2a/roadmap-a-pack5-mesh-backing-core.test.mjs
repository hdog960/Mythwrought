import test from 'node:test';
import assert from 'node:assert/strict';
import {authoredBoundaryCoverage,auditRoadmapAPack5MeshBackingBoundary} from
 '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-mesh-backing-core.mjs';
const mesh=(symbol,variant,at,boxes,orientation=0)=>({previewFixtureOnly:true,symbol,
 variant,at,orientation,art:boxes.map(bounds=>({bounds}))});
const mk=()=>{
 const meshes=[mesh('pack5:079','chalk-lime',[0,0,0],[[0,0,0.1,1,1,0.2]]),
  mesh('pack5:080','hearth-running-bond',[0,0,-1],[[0,0,0,0.49,1,1],[0.51,0,0,1,1,1]])];
 const detail={fixtureIndex:0,symbol:'pack5:079',explicitPreviewVariant:'chalk-lime',
  explicitPreviewOrientation:0,at:[0,0,0],requiredSourceSupportAt:[0,0,-1],
  neighborPreviewIndex:1,neighborPreviewPhysicalAsset:'pack5:080',
  classification:'source-only-full-face-collider-candidate',physicalLoadBearingCertified:false,
  worldSupportCertified:false,variantChosenForRoadmapABuilding:false};
 const support={schema:'mythwrought.roadmap-a.preview-real-pack5-support-candidates.v1',
  original79RoadmapASourcesTouched:false,physicalLoadBearingCertified:false,
  physicalWorldBuilt:false,readyForWorldPlacement:false,sourceVariantsAutomaticallySelected:false,
  previewAssets:2,attachmentRequirements:1,details:[detail]};
 const dependency={schema:'mythwrought.roadmap-a.preview-support-dependency-holds.v1',
  sourceOnly:true,realWorldSupportsCertified:false,readyForGamePlacement:false,
  worldOrSavesModified:false,inputPreviewAssets:2,originalSourceSupportChecks:1,
  conditionalAttachmentEdges:[{dependentFixture:0,potentialBackingFixture:1,sourceSupportCertified:false}],
  originalCandidateAttachmentEdges:1,
  fixtureHolds:[0,1].map(fixtureIndex=>({fixtureIndex,physicalSupportCertified:false}))};
 return {support,dependency,meshes};
};
test('exact authored source AABB face union covers split but touching full side',()=>{
 const r=authoredBoundaryCoverage([[0,0,0.5,0.5,1,1],[0.5,0,0.5,1,1,1]],2,true);
 assert.equal(r.projectedBoundaryFraction,1);
 assert.equal(r.boundaryEntirelyCovered,true);
 assert.equal(r.faceBoxesTouchingBoundary,2);
});
test('gapped authored art cannot inherit full-area status from full-cell collider',()=>{
 const r=authoredBoundaryCoverage([[0,0,0.5,0.49,1,1],[0.51,0,0.5,1,1,1]],2,true);
 assert.ok(Math.abs(r.projectedBoundaryFraction-0.98)<1e-12);
 assert.equal(r.boundaryEntirelyCovered,false);
});
test('near-coincident plane is not promoted to exact exterior boundary',()=>{
 const r=authoredBoundaryCoverage([[0,0,0.25,1,1,0.99999994]],2,true);
 assert.equal(r.faceBoxesTouchingBoundary,0);
 assert.equal(r.projectedBoundaryFraction,0);
});
test('all three axes and both exterior directions use precise authored-box boundaries',()=>{
 for(let axis=0;axis<3;axis++)for(const positive of [false,true]){
  const b=[0,0,0,1,1,1];
  const result=authoredBoundaryCoverage([b],axis,positive);
  assert.equal(result.projectedBoundaryFraction,1);
 }
});
test('cross-authenticated hypothetical brick backing reports physical collider but gapped authored visual boundary',()=>{
 const f=mk(),r=auditRoadmapAPack5MeshBackingBoundary(f.support,f.dependency,f.meshes);
 assert.equal(r.fullColliderCandidatesWithMeshCrosscheck,1);
 assert.equal(r.insetOrGappedAuthoredBoundaryCandidates,1);
 assert.equal(r.candidateBoundaryWitnesses[0].projectedBoundaryFraction,0.98);
 assert.equal(r.candidateBoundaryWitnesses[0].contactAxis,2);
 assert.equal(r.candidateBoundaryWitnesses[0].contactIsPositiveBackingFace,true);
 assert.equal(r.actualWorldSupportsCertified,false);
 assert.equal(r.readyForWorldPlacement,false);
});
test('full authored boundary coverage remains source-only, not structural/renderer approval',()=>{
 const f=mk();f.meshes[1].art=[{bounds:[0,0,0,1,1,1]}];
 const r=auditRoadmapAPack5MeshBackingBoundary(f.support,f.dependency,f.meshes);
 assert.equal(r.fullAuthoredBoundaryCoverageCandidates,1);
 assert.equal(r.candidateBoundaryWitnesses[0].authoredMeshCannotCertifyStructuralBacking,true);
 assert.equal(r.candidateBoundaryWitnesses[0].realWebGL2PixelOcclusionMeasured,false);
});
test('missing authored neighbor fixture or altered source variant/yaw cannot be matched to producer support',()=>{
 const f=mk();f.meshes[1].at=[0,0,-2];
 assert.throws(()=>auditRoadmapAPack5MeshBackingBoundary(f.support,f.dependency,f.meshes),/disagrees/);
 const g=mk();g.meshes[0].variant='hand-troweled';
 assert.throws(()=>auditRoadmapAPack5MeshBackingBoundary(g.support,g.dependency,g.meshes),/identity/);
});
test('a false dependency edge or missing candidate edge fails closed',()=>{
 const f=mk();f.dependency.conditionalAttachmentEdges=[];
 assert.throws(()=>auditRoadmapAPack5MeshBackingBoundary(f.support,f.dependency,f.meshes),/disagrees/);
 const g=mk();g.dependency.conditionalAttachmentEdges[0].sourceSupportCertified=true;
 assert.throws(()=>auditRoadmapAPack5MeshBackingBoundary(g.support,g.dependency,g.meshes),/already-approved/);
});
test('no absolute-world placement, invalid non-cell mesh, or fake approval flags permitted',()=>{
 const f=mk();f.meshes[1].art[0].bounds[0]=-0.2;
 assert.throws(()=>auditRoadmapAPack5MeshBackingBoundary(f.support,f.dependency,f.meshes),/source mesh identity/);
 const g=mk();g.support.physicalLoadBearingCertified=true;
 assert.throws(()=>auditRoadmapAPack5MeshBackingBoundary(g.support,g.dependency,g.meshes),/original unapproved/);
 assert.throws(()=>authoredBoundaryCoverage([[0,0,0,1,0,1]],2,true),/bounded/);
});
