/** Authentic original Manual Five-Pack dry-run test-only, source-geometry
 * contact gap witness. No gameplay selection or mutations. */
import {resolveOriginalPack5SupportPreview,auditOriginalPack5PreviewPhysicalSupports} from './roadmap-a-physical-preview-support-producer.mjs';
import {auditRoadmapAPreviewSupportDependencyHolds} from './roadmap-a-physical-preview-dependency-core.mjs';
import {resolveExplicitPack5PreviewFixture} from './roadmap-a-physical-source-seam-producer.mjs';
import {auditRoadmapAPack5ContactGapCandidates} from './roadmap-a-pack5-contact-gap-core.mjs';
export function auditOriginalPack5ContactGapCandidates(requests,{maxInstances=4096}={}){
 const support=auditOriginalPack5PreviewPhysicalSupports(requests);
 if(support.allCollidersAndOffsetsFromOriginalManualFivePack!==true||
    support.allAlternativesExplicitlyProvidedByPreviewCaller!==true||
    support.testOnlyNoOriginalA5BuildingMaterialsSelected!==true||
    support.worldPhysicalStructuralLoadAcceptance!==false||
    support.originalGameRuntimeAcceptance!==false)
  throw Error('Roadmap A original Pack5 contact gaps require genuine unapproved preview sources');
 const dependency=auditRoadmapAPreviewSupportDependencyHolds(support,{maxInstances});
 const meshes=requests.map(resolveExplicitPack5PreviewFixture);
 const colliders=requests.map(resolveOriginalPack5SupportPreview);
 const report=auditRoadmapAPack5ContactGapCandidates(support,dependency,meshes,colliders);
 return {...report,unalteredOriginalManualFivePackResolver:true,
  unalteredOriginalPack5ArtMeshResolver:true,callerExplicitTestVariantsAndYaws:true,
  conditionalCrossHypotheticalBatchCandidates:dependency.conditionalEdgesAcrossHypotheticalBatches.length,
  physicalProductionOrSettlementAuthorization:false,creatorAccepted:false};
}
