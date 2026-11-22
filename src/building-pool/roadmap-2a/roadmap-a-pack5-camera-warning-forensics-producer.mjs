/**
 * Roadmap A original 420-ray camera warning forensic census.
 * Uses original Pack5 detailed selection fixture and real authored Float32
 * mesh triangles; classifies source disagreements WITHOUT fixing/dismissing
 * them. Reconstructs every warning emitted by the accepted prior native audit.
 *
 * No world, game loop, GPU, browser, storage, author assignment or mutation.
 */
import {readFileSync} from 'node:fs';
import {clampLook,forwardVector} from '../../camera.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_FAMILIES,resolvePack5BuilderAsset} from '../../pack5-integration/catalog.mjs';
import {makePack5Fixture} from '../../block-packs/pack-5/fixture.mjs';
import {pack5TerrainVertices} from '../../pack5-integration/terrain-buffer.mjs';
import {sourceRayTriangleDistance} from './roadmap-a-pack5-ray-selection-core.mjs';
import {auditPack5OriginalGameCenterScreenProjection,
 originalShaderCenterTriangleDistance} from './roadmap-a-pack5-game-camera-projection-producer.mjs';

const requireTrue=(yes,why)=>{if(!yes)throw Error('Roadmap A Pack5 camera edge warning forensic: '+why);};
const variantRoster=Object.freeze(['hearth-running-bond','kiln-soldier-course']);
const allowedYaw=Object.freeze([2,3]);
const proximity=0.000002,delta=0.000001;
const distanceEqual=(a,b)=>a===null&&b===null||
 a!==null&&b!==null&&Math.abs(a-b)<=2e-7;
const rayPoint=(eye,dir,t)=>t===null?null:eye.map((v,i)=>v+dir[i]*t);
function originalClosestStagedTriangle(staged,eye,dir){
 let best=null;
 for(let i=0;i<staged.length;i+=27){
  const v=j=>[staged[i+j*9],staged[i+j*9+1],staged[i+j*9+2]];
  const t=sourceRayTriangleDistance(eye,dir,v(0),v(1),v(2));
  if(t!==null&&(best===null||t<best))best=t;
 }
 return best;
}
function originalClosestShaderCenter(staged,eye,yaw,pitch){
 let best=null;
 for(let i=0;i<staged.length;i+=27){
  const v=j=>[staged[i+j*9],staged[i+j*9+1],staged[i+j*9+2]];
  const h=originalShaderCenterTriangleDistance(v(0),v(1),v(2),eye,yaw,pitch);
  if(h!==null&&(best===null||h.distance<best))best=h.distance;
 }
 return best;
}
const encodeDist=v=>v===null?null:Math.round(v*1e10)/1e10;
function originalCandidate(symbol,variant,yaw){
 const source=resolveManualFivePackAsset(symbol,{variant,orientation:yaw});
 requireTrue(source.livePlaceable===false&&source.saveWritten===false&&
  source.sourcePack===5&&source.selectionBoxes.length>32&&
  source.collisionBoxes.length===1,'original candidate construction or physical contract drift');
 const fixture=makePack5Fixture(PACK5_BUILDER_FAMILIES);
 requireTrue(fixture.place(symbol,[0,0,0],yaw,variant)?.ok===true,
  'original in-memory physical selection fixture placement denied');
 const asset=resolvePack5BuilderAsset(symbol,variant);
 const staged=pack5TerrainVertices(asset.mesh(asset.descriptor,{rotation:yaw}));
 return {source,fixture,staged};
}
function compareRays(test,eyeX,dx,dy){
 const eye=[eyeX,.5,2],look=clampLook(Math.PI,0,dx,dy,1,.008),
  dir=forwardVector(look.yaw,look.pitch);
 const originalTriangles=originalClosestStagedTriangle(test.staged,eye,dir);
 const shaderCenter=originalClosestShaderCenter(test.staged,eye,look.yaw,look.pitch);
 const selection=test.fixture.raycast(eye,dir,6)?.distance??null;
 requireTrue(distanceEqual(originalTriangles,shaderCenter),
  'original staged triangle/analytical main terrain shader source unexpectedly diverged');
 const mismatch=!distanceEqual(selection,shaderCenter);
 return {eye,dir,selection,shaderCenter,mismatch};
}
export function classifyOriginalPack5SourceWarning(selection,mesh){
 requireTrue([selection,mesh].every(v=>v===null||Number.isFinite(v)&&v>=0),
  'invalid original source hit distance');
 if(selection===null&&mesh!==null)return 'staged-triangle-only';
 if(selection!==null&&mesh===null)return 'detailed-selection-only';
 if(selection!==null&&mesh!==null)return 'different-hit-distance';
 return 'both-miss-not-a-warning';
}
function closestOriginalAuthoredTangentialPlane(point,boxes){
 if(point===null)return null;
 // The look ray travels primarily along -Z: find the distance to ANY
 // original authored x/y rectangle boundary at the source hit point.
 // These are original DOUBLE precision authoring values, NOT GPU Float32.
 let minimum=Infinity;
 for(const b of boxes)for(const axis of [0,1])for(const edge of [b[axis],b[axis+3]])
  minimum=Math.min(minimum,Math.abs(point[axis]-edge));
 return minimum;
}
/** Read the unchanged original game HUD and editing ownership as textual
 * contracts. Does NOT execute or claim that a real player can see an outline.
 */
export function attestOriginalPack5HudFocusOwnership(){
 const main=readFileSync(new URL('../../main.mjs',import.meta.url),'utf8');
 const anchors=[
  "const focused=help.hidden?inspectBlockTarget(world,eye(),facing(),selected,player,selectedRotation):null;",
  "const focusKey=focused?.hit?.join(',')||'';",
  "canvas.dataset.targetBlock=focusKey;",
  "const mine=focused?.hit?outlineVertices(focused.hit,[.44,.90,.81]):new Float32Array();",
  "if(pack5Mode&&pack5Builder){",
  "const shape=pack5Builder.layer.raycast(eye(),facing(),6);",
  "pack5Builder.placeFacing(eye(),facing(),",
  "pack5Builder.removeFacing(eye(),facing());"
 ];
 for(const x of anchors)requireTrue(main.includes(x),'original HUD/editor source ownership drift: '+x);
 const draw=main.indexOf('const focused=help.hidden?inspectBlockTarget');
 const end=main.indexOf("const deg=compassDegrees(",draw);
 const region=main.slice(draw,end);
 requireTrue(draw>0&&end>draw&&region.includes("gl.drawArrays(gl.LINES,0,outlineCount)")&&
  !region.includes('pack5Builder.layer.raycast'),
  'original HUD focus block path uses Pack5 or its source context changed');
 return {originalMainSourceAnchors:anchors.length,
  originalGameHudWorldBlockTargetOwner:'inspectBlockTarget',
  originalHudDirectPack5LayerRaycastInOutlineRegion:false,
  originalPack5EditsUseSeparateModeAndLayer:true,
  originalHudPixelOrPack5InteractionObserved:false,sourceOnly:true};
}

export function auditOriginalPack5CameraWarningForensics(){
 const base=auditPack5OriginalGameCenterScreenProjection();
 requireTrue(base.sourceCameraRayProbes===420&&
  base.originalMeshRayVsShaderProjectionDisagreements===0,
  'cannot classify unsupported original source camera baseline');
 requireTrue(base.originalSelectionVsShaderProjectionWarnings===base.witnesses.length,
  'prior original camera warning witness cap truncated: cannot invent missing events');
 const target=new Map(),rows=[],counts={
  'staged-triangle-only':0,'detailed-selection-only':0,
  'different-hit-distance':0,'both-miss-not-a-warning':0
 };
 let nearAuthorTangentialPlane=0,nearProjectedEdge=0,afterShiftAnyMatch=0,
  microShiftBothMismatch=0,matchingBeforeAndAfter=0,
  totalOffsetProbes=0,closestDistance=Infinity,fartherDistance=0;
 const sourceBoundaryShiftAt=0.000002;
 for(const warning of base.witnesses){
  const {variant,yaw,eyeX}=warning,[dx,dy]=warning.pointerDelta;
  requireTrue(variantRoster.includes(variant)&&allowedYaw.includes(yaw)&&
   [eyeX,dx,dy].every(Number.isFinite),'warning is not an authenticated original source input');
  const key=variant+'|'+yaw;
  if(!target.has(key))target.set(key,originalCandidate('pack5:080',variant,yaw));
  const preview=target.get(key),result=compareRays(preview,eyeX,dx,dy);
  requireTrue(result.mismatch&&distanceEqual(result.shaderCenter,warning.originalShaderProjectedCenterDistance)&&
   distanceEqual(result.selection,warning.originalSelectionDistance),
   'original published warning not reproducible on exact source fixture');
  const cat=classifyOriginalPack5SourceWarning(result.selection,result.shaderCenter);
  requireTrue(cat!=='both-miss-not-a-warning','original source gave invalid warning');
  counts[cat]++;
  const nearestDistance=Math.abs((result.selection??0)-(result.shaderCenter??0));
  if(result.selection!==null&&result.shaderCenter!==null){
   closestDistance=Math.min(closestDistance,nearestDistance);
   fartherDistance=Math.max(fartherDistance,nearestDistance);
  }
  // Measure how close this original ray is to an *authored* X/Y brick seam
  // at its actual rendered-source hit point. Does not label a GPU bug.
  const closest=closestOriginalAuthoredTangentialPlane(
   rayPoint(result.eye,result.dir,result.shaderCenter),
   preview.source.selectionBoxes);
  const near=closest!==null&&closest<=proximity;
  if(near)nearAuthorTangentialPlane++;
  if(warning.nearNdcTriangleEdge)nearProjectedEdge++;
  const offsetRows=[];
  for(const shift of [-sourceBoundaryShiftAt,-delta,delta,sourceBoundaryShiftAt]){
   const shifted=compareRays(preview,eyeX+shift,dx,dy);
   offsetRows.push({eyeXShift:shift,selectionVsShaderWarning:shifted.mismatch,
    originalSelectionDistance:encodeDist(shifted.selection),
    stagedShaderTriangleDistance:encodeDist(shifted.shaderCenter)});
   totalOffsetProbes++;
  }
  const matches=offsetRows.filter(x=>!x.selectionVsShaderWarning).length;
  if(matches)afterShiftAnyMatch++;
  if(matches===0)microShiftBothMismatch++;
  if(matches===4)matchingBeforeAndAfter++;
  rows.push({symbol:'pack5:080',variant,yaw,eyeX,originalLookDelta:[dx,dy],
   originalSelectionDistance:encodeDist(result.selection),
   originalProjectedShaderDistance:encodeDist(result.shaderCenter),
   classification:cat,sourceTriangleRenderedHit:result.shaderCenter!==null,
   sourceSelectionHit:result.selection!==null,
   sourceDistanceSeparationBothHit:
    result.selection!==null&&result.shaderCenter!==null?nearestDistance:null,
   closestAuthoredTangentialSeamDistance:closest,
   withinTwoMicrounitsOfOriginalXOrYSeam:near,
   previouslyReportedNearProjectedTriangleEdge:warning.nearNdcTriangleEdge,
   sourceOnlyMicroEyeOffsets:offsetRows,
   atLeastOneOffsetEliminatesWarning:matches>0,
   originalSourceMeshModified:false,realGameplayObserved:false});
 }
 const classified=Object.values(counts).reduce((a,b)=>a+b,0);
 requireTrue(classified===base.originalSelectionVsShaderProjectionWarnings&&
  rows.length===12&&target.size<=4&&totalOffsetProbes===rows.length*4&&
  counts['both-miss-not-a-warning']===0,
  'source warning classification/perturbation ledger incomplete');
 return {schema:'mythwrought.roadmap-a.original-camera-render-selection-warning-forensics.v1',
  originalAuthenticatedBaselineRays:base.sourceCameraRayProbes,
  originalAuthenticatedSourceVsShaderDisagreements:base.originalMeshRayVsShaderProjectionDisagreements,
  originalSourceSelectionWarnings:base.originalSelectionVsShaderProjectionWarnings,
  individuallyReconstructedWarnings:rows.length,
  categories:counts,sourceNearAuthoredTangentialPlane:nearAuthorTangentialPlane,
  originalNearProjectedTriangleEdgeWarningCount:nearProjectedEdge,
  mismatchEliminatedByAtLeastOneMicrounitCameraOffset:afterShiftAnyMatch,
  mismatchSurvivedAllFourMicrounitCameraOffsets:microShiftBothMismatch,
  allFourShiftOffsetsWereMatching:matchingBeforeAndAfter,
  fourOffsetsPerWarning:4,totalSourceOnlyOffsetProbes:totalOffsetProbes,
  minBothHitDistanceGap:Number.isFinite(closestDistance)?closestDistance:null,
  maxBothHitDistanceGap:fartherDistance,
  provenance:attestOriginalPack5HudFocusOwnership(),
  warningRows:rows,historicalDifferentGridRawWarnings:88,
  originalSourceMathAndPhysicalMeshesUntouched:true,
  noNewA5BuildingVariantYawChoice:true,
  noRealGameCameraOrHudExecuted:true,noActualGpuRasterPixels:true,
  noWorldOrSaveOrSidecarModified:true,sourceOnly:true,
  structuralOrCreatorApproval:false,readyForProduction:false};
}
