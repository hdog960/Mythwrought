/**
 * Roadmap A ORIGINAL Pack5 hearth yaw3: cross-tab ALL 208 genuine source
 * both-hit depth warnings. This is read-only source-analytic work, not
 * GPU fragment, browser HUD, player mining or physical iPhone evidence.
 *
 * Cross 3 independent original physical measurements:
 * nearest rendered strict triangle box OWNER (same/different selected box),
 * selected AABB tangential SEAM (<=2e-6/greater),
 * actual selected AABB ray THICKNESS (<=1e-5/greater).
 *
 * In addition, probe only a bounded, nonduplicate set of robust first-face
 * hypotheses at 3x3 tiny Y/Z angles using the ORIGINAL layer.raycast and
 * original world-GPU Float32 staged vertices, not an invented picker.
 */
import {
 auditOriginalHearthYaw3SourceFirstFaceOwnership,
 createOriginalHearthYaw3SourceFaceProbe
} from './roadmap-a-pack5-hearth-yaw3-face-occlusion-audit.mjs';

const verify=(ok,msg)=>{if(!ok)throw Error('Roadmap A exact original hearth source cross-tab: '+msg);};
const BASE=Object.freeze({expectedWarnings:208,expectedRays:2610,
 expectedOriginalSelectedThin:48,expectedDifferentOwner:97,
 expectedNonSeam:115,expectedStableThreeYGroups:19,
 thresholdSeam:2e-6,thresholdThin:1e-5,
 minSourceBarycentricForCandidate:1e-5,
 minSourceFirstDistanceDelta:0.002,
 jitter:2e-6,maxUniqueCandidates:6});
const dims=[...Array(2)].flatMap((_,o)=>[...Array(2)].flatMap((_,s)=>[...Array(2)].map((_,t)=>
 [o?'different':'same',s?'far':'near',t?'robust':'thin'].join('|'))));
function keyOf(w){
 return [
  w.originalSelectionSourceBox!==w.originalTriangleSourceBox?'different':'same',
  w.originalSelectedBoxNearTangentialEdge?'near':'far',
  w.authoredSelectedBoxThicknessAlongRay<=BASE.thresholdThin?'thin':'robust'
 ].join('|');
}
function sign(w){return Math.sign(w.signedTriangleMinusSelectionDistance);}
function ownerSignature(w){return [w.originalSelectionSourceBox,w.originalTriangleSourceBox,
 w.boxFaceIndex,sign(w)].join('/');}
function summarizeNine(w,evaluate){
 const deltas=[-BASE.jitter,0,BASE.jitter],rows=[];
 for(const dy of deltas)for(const dz of deltas){
  const aim=[0,w.localTarget[1]+dy,w.localTarget[2]+dz];
  const hit=evaluate(aim),robust=hit.sameHitMembership&&
   Number.isFinite(hit.selected)&&Number.isFinite(hit.rendered)&&
   hit.originalDetailedSelectionBox===w.originalSelectionSourceBox&&
   hit.originalStrictTriangleBox===w.originalTriangleSourceBox&&
   hit.originalStrictTriangleFace===w.boxFaceIndex&&
   Math.sign(hit.signedTriangleMinusSelection)===sign(w)&&
   Math.abs(hit.signedTriangleMinusSelection)>=BASE.minSourceFirstDistanceDelta&&
   hit.originalStrictBarycentricMinimum>=BASE.minSourceBarycentricForCandidate;
  rows.push({dy,dz,strictAndSelectionBothHit:hit.sameHitMembership&&
   hit.selected!==null&&hit.rendered!==null,
   originalFaceOwnerAndSignPreserved:robust,
   selectedSourceBox:hit.originalDetailedSelectionBox??null,
   strictTriangleSourceBox:hit.originalStrictTriangleBox??null,
   strictTriangleFace:hit.originalStrictTriangleFace??null,
   signedDepth:hit.signedTriangleMinusSelection??null,
   barycentricMinimum:hit.originalStrictBarycentricMinimum??null});
 }
 verify(rows.length===9,'three by three original source perturbation incomplete');
 return {originalAuthoredLocalCenter:w.localTarget,selectedBox:w.originalSelectionSourceBox,
  triangleBox:w.originalTriangleSourceBox,triangleFace:w.boxFaceIndex,
  signedDepth:w.signedTriangleMinusSelectionDistance,
  sourceSelectedBoxThickness:w.authoredSelectedBoxThicknessAlongRay,
  selectedBoxTangentialMargin:w.originalSelectedBoxTangentialClearance,
  strictBarycentricMargin:w.sourceStrictTriangleMinimumBarycentric,
  stableAllNine:rows.every(r=>r.originalFaceOwnerAndSignPreserved),
  nineProbeOriginalSourceRows:rows,
  actualGameGpuFragmentsOrPlayerHudObserved:false};
}
export function auditOriginalHearthYaw3Full208CrossTab(){
 const prior=auditOriginalHearthYaw3SourceFirstFaceOwnership({includeFullWarningRows:true});
 const raw=prior.fullWarningRows,base=prior.totals;
 verify(raw?.length===BASE.expectedWarnings&&base.rays===BASE.expectedRays,
  'full 208 source witness ledger missing or original 2610-ray provenance changed');
 const tab=Object.fromEntries(dims.map(k=>[k,{n:0,selectedFirst:0,triangleFirst:0,
  signedDepthSum:0,maxAbsSignedDepth:0,sourceGroupKeys:new Set()}]));
 const byGroup=new Map();
 const totals={warnings:0,differentOwner:0,sameOwner:0,nearSeam:0,nonSeam:0,
  thin:0,robust:0,selectedFirst:0,triangleFirst:0,
  differentAndNonSeam:0,differentAndRobust:0,robustAndNonSeam:0,
  differentAndNonSeamAndRobust:0,
  robustNonSeamDifferentWithNonTinyStrictMargin:0,
  stableThreeYOffsetOwnerGroups:0,stableThreeOffsetWarnings:0,
  stableOwnerGroupsContainingRobustDifferentNonSeam:0,
  selectedFirstAndRobustDifferentNonSeam:0,
  triangleFirstAndRobustDifferentNonSeam:0};
 const qualified=[];
 const groupKey=w=>w.originalGridYIndex+','+w.originalGridZIndex;
 for(const w of raw){
  verify(w.mathematicallyStrictSourceOnly===true&&
   w.actualGpuRasterPixelMeasured===false&&
   Number.isFinite(w.originalDetailedDistance)&&
   Number.isFinite(w.strictOriginalGpuWorldTriangleDistance)&&
   w.sourceStrictTriangleMinimumBarycentric>=0&&
   w.originalDetailedDistance<=6&&w.strictOriginalGpuWorldTriangleDistance<=6,
   'source row provenance/strict math/6-block reach failed');
  const key=keyOf(w),bin=tab[key];
  verify(bin!==undefined&&sign(w)!==0,'source three-way category absent');
  bin.n++;bin.signedDepthSum+=w.signedTriangleMinusSelectionDistance;
  bin.maxAbsSignedDepth=Math.max(bin.maxAbsSignedDepth,Math.abs(w.signedTriangleMinusSelectionDistance));
  bin.sourceGroupKeys.add(groupKey(w));
  totals.warnings++;
  if(key.startsWith('different'))totals.differentOwner++;
  else totals.sameOwner++;
  if(key.includes('|near|'))totals.nearSeam++;
  else totals.nonSeam++;
  if(key.endsWith('|thin'))totals.thin++;
  else totals.robust++;
  if(sign(w)>0){bin.selectedFirst++;totals.selectedFirst++;}
  else{bin.triangleFirst++;totals.triangleFirst++;}
  const different=key.startsWith('different'),nonSeam=key.includes('|far|'),
   robust=key.endsWith('|robust'),strongMargin=w.sourceStrictTriangleMinimumBarycentric>=BASE.minSourceBarycentricForCandidate;
  if(different&&nonSeam)totals.differentAndNonSeam++;
  if(different&&robust)totals.differentAndRobust++;
  if(robust&&nonSeam)totals.robustAndNonSeam++;
  if(different&&nonSeam&&robust){
   totals.differentAndNonSeamAndRobust++;
   if(strongMargin)totals.robustNonSeamDifferentWithNonTinyStrictMargin++;
   if(sign(w)>0)totals.selectedFirstAndRobustDifferentNonSeam++;
   else totals.triangleFirstAndRobustDifferentNonSeam++;
   if(strongMargin&&Math.abs(w.signedTriangleMinusSelectionDistance)>=BASE.minSourceFirstDistanceDelta)
    qualified.push(w);
  }
  const g=groupKey(w);
  if(!byGroup.has(g))byGroup.set(g,[]);
  byGroup.get(g).push(w);
 }
 verify(totals.warnings===208&&totals.differentOwner===97&&totals.sameOwner===111&&
  totals.nearSeam===93&&totals.nonSeam===115&&totals.thin===48&&
  totals.robust===160&&totals.selectedFirst===139&&totals.triangleFirst===69,
  'original independently verified prior ownership/seam/thickness totals changed');
 const stableGroups=[];
 for(const [id,rows] of byGroup){
  if(rows.length!==3)continue;
  const s=new Set(rows.map(w=>w.originalOffsetSourceY));
  if(s.size!==3||![...BASE_SAMPLE_Y_OFFSETS].every(x=>s.has(x)))continue;
  if(rows.every(w=>ownerSignature(w)===ownerSignature(rows[0]))){
   totals.stableThreeYOffsetOwnerGroups++;totals.stableThreeOffsetWarnings+=3;
   const strong=rows.some(w=>keyOf(w)==='different|far|robust');
   if(strong)totals.stableOwnerGroupsContainingRobustDifferentNonSeam++;
   stableGroups.push({originalSourceGroup:id,
    localTarget:[0,rows[1].localTarget[1],rows[1].localTarget[2]],
    sourceSelectedBox:rows[0].originalSelectionSourceBox,
    sourceStrictTriangleBox:rows[0].originalTriangleSourceBox,
    sourceTriangleFace:rows[0].boxFaceIndex,
    allOffsetsIdenticalOwnerFaceAndDistanceSign:true,
    warningRowCount:3,includesRobustDifferentNonSeam:strong});
  }
 }
 verify(totals.stableThreeYOffsetOwnerGroups===19,
  'earlier genuine original 19 stable Y-offset groups no longer reproduced');
 const sorted=qualified.slice().sort((a,b)=>
  Math.abs(b.signedTriangleMinusSelectionDistance)-
  Math.abs(a.signedTriangleMinusSelectionDistance)||
  b.sourceStrictTriangleMinimumBarycentric-a.sourceStrictTriangleMinimumBarycentric);
 const chosen=[],used=new Set();
 for(const w of sorted){
  const g=groupKey(w);
  if(used.has(g))continue;used.add(g);chosen.push(w);
  if(chosen.length===BASE.maxUniqueCandidates)break;
 }
 const evaluate=createOriginalHearthYaw3SourceFaceProbe();
 const nineSamples=chosen.map(w=>summarizeNine(w,evaluate));
 const resultBins=Object.fromEntries(Object.entries(tab).map(([key,bin])=>[key,{
  count:bin.n,selectedFirst:bin.selectedFirst,triangleFirst:bin.triangleFirst,
  signedDepthSum:bin.signedDepthSum,maxAbsSignedDepth:bin.maxAbsSignedDepth,
  uniqueSourceYZGroups:bin.sourceGroupKeys.size}]));
 verify(Object.values(resultBins).reduce((n,b)=>n+b.count,0)===208&&
  Object.values(resultBins).every(b=>b.count===b.selectedFirst+b.triangleFirst),
  'cross-tab warning/sign accounting incomplete');
 return {schema:'mythwrought.roadmap-a.hearth-yaw3-original-208-thickness-owner-seam.v1',
  exactSource:{originalVariant:'hearth-running-bond',yaw:3,
   originalBrick:'pack5:080',originalReadOnlyWorld:true,
   sourceRayGrid:2610,originalGPUWorldFloat32Vertices:1512,authoredBoxes:42,
   originalSourceRigEye:[.5,13.55,.5],authoringAnchor:[3,14,0]},
  thresholds:BASE,totals,originalEightBinCrossTab:resultBins,
  allNineteenStableThreeYOffsetGroups:stableGroups,
  boundedNineRaySourcePerturbationResults:nineSamples,
  scannedDistinctOriginalSourceGroups:byGroup.size,
  result:{
   genuineStrictTriangleOnlyOriginalSelectionMisses:base.actualStrictMeshVsOriginalSelectionHitMissDisagreement,
   originalSourceSelectionVsIndependentBoxParityDifferences:base.exactOriginalSelectionVsIndependentFirstBoxDisagreement,
   qualifiedOriginalSourceCandidateRows:qualified.length,
   distinctNineRayCandidates:chosen.length,
   originalNineRayCandidatesStable:nineSamples.filter(x=>x.stableAllNine).length,
   originalNineRayClaimsAreSourceMathOnly:true,
   actualWebGL2RasterAndDepthUnobserved:true,
   actualPlayerMineHudUnobserved:true,
   realTerrainNonAirOcclusionUnobserved:true,
   actualPhysicalIphoneHomeScreenPwaUnobserved:true,
   noProductionGeometryOrRaycasterChange:true,
   noProductionArtYawDecision:true,
   noUserWorldOrSaveWrites:true,
   noMergeOrDeploy:true}};
}
const BASE_SAMPLE_Y_OFFSETS=Object.freeze([-.000002,0,.000002]);
