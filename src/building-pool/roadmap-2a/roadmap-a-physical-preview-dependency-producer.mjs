/** Read-only original Manual Five Pack producer path: isolated fixture support
 * dependencies and hypothetical max-instance partition boundaries only.
 * Not a source A5 building selector or construction authorization.
 */
import {auditOriginalPack5PreviewPhysicalSupports} from './roadmap-a-physical-preview-support-producer.mjs';
import {auditRoadmapAPreviewSupportDependencyHolds} from './roadmap-a-physical-preview-dependency-core.mjs';
export function auditOriginalPack5PreviewDependencyHolds(requests,{maxInstances=4096}={}){
 const upstream=auditOriginalPack5PreviewPhysicalSupports(requests);
 if(upstream.allCollidersAndOffsetsFromOriginalManualFivePack!==true||
    upstream.allAlternativesExplicitlyProvidedByPreviewCaller!==true||
    upstream.testOnlyNoOriginalA5BuildingMaterialsSelected!==true||
    upstream.worldPhysicalStructuralLoadAcceptance!==false||
    upstream.originalGameRuntimeAcceptance!==false)
  throw Error('Roadmap A dependency source: authentic Pack5 preview evidence required');
 const report=auditRoadmapAPreviewSupportDependencyHolds(upstream,{maxInstances});
 return {...report,originalUnmodifiedPack5ResolverUsedForPreview:true,
  originalPack5VariantsWereExplicitFixtureOnly:true,
  realManualPackInstanceBatchCreated:false,
  originalRoadmapAStructureRegistered:false,originalGameRendererChanged:false,
  actualMobileGPUCostMeasured:false,creatorAccepted:false};
}
