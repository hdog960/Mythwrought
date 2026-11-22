/**
 * Authentic original Pack5 physical producer, source-only alternative census.
 * Enumerates EVERY authored variant and yaw as preview evidence; selects NONE
 * for the original 79 A5 source designs and makes no actual world instances.
 */
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../../pack5-integration/catalog.mjs';
import {getPack5Surface,surfaceBoxMesh} from '../../block-packs/pack-5/architectural-surfaces.mjs';
import {resolveOriginalPack5SupportPreview} from './roadmap-a-physical-preview-support-producer.mjs';
import {resolveExplicitPack5PreviewFixture} from './roadmap-a-physical-source-seam-producer.mjs';
import {auditSourceOnlyPack5AxisRayFidelity} from './roadmap-a-pack5-ray-selection-core.mjs';
const requireTrue=(ok,why)=>{if(!ok)throw Error('Roadmap A source ray producer denied: '+why);};
const symbols=['pack5:079','pack5:080','pack5:081'];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

/** Explicit caller fixture; no default material/variant/rotation inference.
 * This preview audit independently reconciles mesh/art, selection,
 * collision, orientation and mounted original source support policy.
 */
export function inspectOriginalPack5SourceRayFixture(request){
 const preview=resolveOriginalPack5SupportPreview(request);
 const seam=resolveExplicitPack5PreviewFixture(request);
 const asset=resolveManualFivePackAsset(request.symbol,{
  variant:request.variant,orientation:request.orientation});
 const surface=getPack5Surface(request.symbol,request.variant);
 const mesh=surfaceBoxMesh(surface,{rotation:request.orientation});
 requireTrue(asset.sourcePack===5&&asset.physical===true&&asset.builderResolvable===true&&
  asset.livePlaceable===false&&asset.saveWritten===false&&
  asset.occupiedOffsets.length===1&&same(asset.occupiedOffsets,[[0,0,0]])&&
  asset.symbol===preview.symbol&&asset.variant===preview.variant&&
  asset.orientation===preview.orientation&&
  same(asset.selectionBoxes,asset.visibleBoxes)&&
  same(asset.collisionBoxes,preview.collisionBoxes)&&
  same(asset.supportOffsets,preview.supportOffsets)&&
  asset.supportPolicy===preview.supportPolicy&&
  asset.visibleBoxes.length===seam.art.length&&
  asset.visibleBoxes.length===surface.art.length&&
  mesh.vertexCount===24*asset.visibleBoxes.length&&
  mesh.triangles===12*asset.visibleBoxes.length,
  'original visible/selection/collider/mesh/support producer shape changed');
 const report=auditSourceOnlyPack5AxisRayFidelity({
  previewFixtureOnly:true,selectedForRoadmapASource:false,
  symbol:asset.symbol,variant:asset.variant,orientation:asset.orientation,
  selectionBoxes:asset.selectionBoxes,collisionBoxes:asset.collisionBoxes,
  mesh,livePlaceable:false,saveWritten:false,worldPlaced:false,creatorAccepted:false
 });
 return {...report,originalUnchangedManualFivePackSelectionUsed:true,
  originalUnchangedManualFivePackCollisionUsed:true,
  originalUnchangedSourceAuthoredTriangleMeshUsed:true,
  originalManualPackSupportPolicy:asset.supportPolicy,
  originalManualPackSupportOffsets:asset.supportOffsets.map(x=>[...x]),
  sourcePreviewFixtureOnly:true,realGameRaycastExecuted:false,
  originalA5SourceMaterialsChosen:false};
}

/** All six genuine Pack5 surface variants and four yaws — NEVER an A5 choice. */
export function auditOriginalPack5AllVariantYawRaySelection(){
 const out=[],bySymbol={};
 for(const symbol of symbols){
  const family=PACK5_BUILDER_CATALOG.find(x=>x.symbolicId===symbol);
  requireTrue(family?.variants?.length===2,'original Pack5 catalog variants changed '+symbol);
  bySymbol[symbol]={authoredVariants:0,explicitYawWitnesses:0,
   sampleRays:0,colliderWithoutSelection:0,selectionRecessedBehindCollider:0,
   selectionWithoutCollider:0,selectionTriangleMismatch:0,
   sourceBoundaryGrazingRayDisagreements:0,interiorTriangleSelectionDisagreements:0};
  for(const variant of family.variants){
   bySymbol[symbol].authoredVariants++;
   for(let orientation=0;orientation<4;orientation++){
    const r=inspectOriginalPack5SourceRayFixture({
     previewFixtureOnly:true,symbol,variant,orientation,at:[0,0,0]});
    const agg=bySymbol[symbol];
    agg.explicitYawWitnesses++;agg.sampleRays+=r.raySummary.sampleRays;
    for(const key of ['colliderWithoutSelection','selectionRecessedBehindCollider',
     'selectionWithoutCollider','selectionTriangleMismatch',
     'sourceBoundaryGrazingRayDisagreements','interiorTriangleSelectionDisagreements'])
     agg[key]+=r.raySummary[key];
    out.push(r);
   }
  }
 }
 requireTrue(out.length===24&&new Set(out.map(r=>r.symbol+'|'+r.explicitPreviewVariant+'|'+r.explicitPreviewYaw)).size===24&&
  out.every(r=>r.raySummary.sampleRays===150)&&
  Object.values(bySymbol).every(x=>x.explicitYawWitnesses===8&&x.sampleRays===1200),
  'incomplete source-authentic all-variant/all-yaw evidence');
 return {schema:'mythwrought.roadmap-a.pack5-all-physical-selection-ray-alternatives.v1',
  originalSourceAlternatives:24,sourcePreviewRaySamples:3600,
  allSourceFamiliesCovered:3,byOriginalSymbol:bySymbol,
  originalSourceAlternativeWitnesses:out,
  variantsAndYawsExhaustivelyExaminedNotChosen:true,
  originalProducerMeshesSelectionsCollidersSupportCrosschecked:true,
  boundaryGrazingDisagreementsRemainVisibleNotSilentlyAccepted:true,
  originalInteriorTriangleDisagreementCount:Object.values(bySymbol).reduce(
   (n,row)=>n+row.interiorTriangleSelectionDisagreements,0),
  actualGameOrPwaRaycasterNotExecuted:true,
  originalA5PhysicalMaterialOrYawChosen:false,
  actualRendererOrGameplayApprovalGranted:false,
  roadMapASourcesChanged:false,
  liveRendererOrSaveWritten:false,realIPhoneGPUOrWebGL2Measured:false,
  readyForWorldPlacement:false,creatorAccepted:false};
}
