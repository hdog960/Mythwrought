/**
 * Producer-authentic, caller-explicit Pack5 source-only projected footprint.
 * Original physical/selection geometry and the authored mesh are cross-checked
 * before computing candidate areas. Never chooses a Roadmap A variant or yaw.
 */
import {auditOriginalPack5PreviewPhysicalSupports,resolveOriginalPack5SupportPreview}
 from './roadmap-a-physical-preview-support-producer.mjs';
import {auditRoadmapAPreviewSupportDependencyHolds} from './roadmap-a-physical-preview-dependency-core.mjs';
import {resolveExplicitPack5PreviewFixture}
 from './roadmap-a-physical-source-seam-producer.mjs';
import {auditRoadmapAPack5ProjectedContactFootprints}
 from './roadmap-a-pack5-footprint-core.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
const deny=(ok,reason)=>{if(!ok)throw Error('Roadmap A Pack5 footprint producer denied: '+reason);};
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

export function auditOriginalPack5ProjectedContactFootprints(requests,{maxInstances=4096}={}){
 const source=auditOriginalPack5PreviewPhysicalSupports(requests);
 deny(source.allCollidersAndOffsetsFromOriginalManualFivePack===true&&
  source.allAlternativesExplicitlyProvidedByPreviewCaller===true&&
  source.testOnlyNoOriginalA5BuildingMaterialsSelected===true&&
  source.worldPhysicalStructuralLoadAcceptance===false&&
  source.originalGameRuntimeAcceptance===false,
  'authentic original source-only support path required');
 const dependencies=auditRoadmapAPreviewSupportDependencyHolds(source,{maxInstances});
 const meshes=requests.map(resolveExplicitPack5PreviewFixture);
 const colliders=requests.map(resolveOriginalPack5SupportPreview);
 let totalOriginalSelectionBoxes=0,totalOriginalVisibleBoxes=0,totalOriginalColliderBoxes=0;
 for(const [i,r] of requests.entries()){
  const original=resolveManualFivePackAsset(r.symbol,{variant:r.variant,orientation:r.orientation});
  const support=colliders[i];
  deny(original.sourcePack===5&&original.livePlaceable===false&&original.saveWritten===false&&
   original.builderResolvable===true&&original.physical===true&&
   original.symbol===meshes[i].symbol&&original.variant===meshes[i].variant&&
   original.orientation===meshes[i].orientation&&
   original.supportPolicy===support.supportPolicy&&
   equal(original.supportOffsets,support.supportOffsets)&&
   equal(original.collisionBoxes,support.collisionBoxes)&&
   equal(original.selectionBoxes,original.visibleBoxes)&&
   original.visibleBoxes.length===meshes[i].art.length,
   'independent ORIGINAL selection/visible/collider/support producer drift');
  totalOriginalSelectionBoxes+=original.selectionBoxes.length;
  totalOriginalVisibleBoxes+=original.visibleBoxes.length;
  totalOriginalColliderBoxes+=original.collisionBoxes.length;
 }
 const result=auditRoadmapAPack5ProjectedContactFootprints(source,dependencies,meshes,colliders);
 return {...result,originalManualFivePackSelectionGeometryCrosschecked:true,
  sourceSelectionBoxesEqualOriginalVisibleBoxes:true,
  originalUnchangedPack5PhysicalMeshUsed:true,
  originalUnchangedManualFivePackColliderUsed:true,
  originalSourceVisibleBoxes:totalOriginalVisibleBoxes,
  originalSourceSelectionBoxes:totalOriginalSelectionBoxes,
  originalSourceCollisionBoxes:totalOriginalColliderBoxes,
  conditionalCrossHypotheticalBatchAttachments:dependencies.conditionalEdgesAcrossHypotheticalBatches.length,
  explicitPreviewAlternativesOnly:true,realWorldLoadBearingCertified:false,
  sourceA5MaterialOrOrientationChosen:false,physicalBlueprintCreated:false,
  actualGamePlayerSelectionOrCollisionMeasured:false,
  realIPhoneOrWebGL2Measured:false,creatorAccepted:false};
}
