/** Isolated, caller-explicit original Manual Pack5 mesh/support cross-check.
 * Independent producer paths must agree on every candidate's source identity,
 * yaw and world contact face. Never imports or chooses A5 source assignments.
 */
import {auditOriginalPack5PreviewPhysicalSupports} from './roadmap-a-physical-preview-support-producer.mjs';
import {auditRoadmapAPreviewSupportDependencyHolds} from './roadmap-a-physical-preview-dependency-core.mjs';
import {resolveExplicitPack5PreviewFixture} from './roadmap-a-physical-source-seam-producer.mjs';
import {auditRoadmapAPack5MeshBackingBoundary} from './roadmap-a-pack5-mesh-backing-core.mjs';
export function auditOriginalPack5MeshBackingBoundary(requests,{maxInstances=4096}={}){
 const supports=auditOriginalPack5PreviewPhysicalSupports(requests);
 if(supports.allCollidersAndOffsetsFromOriginalManualFivePack!==true||
    supports.allAlternativesExplicitlyProvidedByPreviewCaller!==true||
    supports.testOnlyNoOriginalA5BuildingMaterialsSelected!==true||
    supports.originalGameRuntimeAcceptance!==false||
    supports.worldPhysicalStructuralLoadAcceptance!==false)
   throw Error('Roadmap A original mesh-backing producer: source support provenance required');
 const dependency=auditRoadmapAPreviewSupportDependencyHolds(supports,{maxInstances});
 const meshes=requests.map(resolveExplicitPack5PreviewFixture);
 const result=auditRoadmapAPack5MeshBackingBoundary(supports,dependency,meshes);
 return {...result,originalUnchangedManualFivePackColliderSourceUsed:true,
  originalUnchangedPack5SurfaceBoxMeshUsed:true,
  explicitPreviewChoicesOnly:true,
  hypotheticalBatchCrossings:dependency.conditionalEdgesAcrossHypotheticalBatches.length,
  sourceSupportDependencyHolds:dependency.fixtureHolds.map(h=>h.supportHold),
  noRealBlueprintOrActualInstanceBatchCreated:true,
  realPhysicalRendererOrIPhoneVerified:false,creatorAccepted:false};
}
