/**
 * Roadmap A read-only projected-contact footprint, not world physics.
 * A nearest-gap witness can be produced by a tiny decorative box. Measure the
 * EXACT union of original source AABB projected overlaps AT that minimum gap
 * as well as the upper bound of ALL tangential box-pair projections.
 * A reported area is NOT load-bearing capacity, visible pixel occlusion,
 * support validation, scene placement, or source A5 variant selection.
 */
import {closestOriginalPack5FaceGap,auditRoadmapAPack5ContactGapCandidates} from './roadmap-a-pack5-contact-gap-core.mjs';
const deny=(ok,why)=>{if(!ok)throw Error('Roadmap A source footprint denied: '+why);};
const box=b=>Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
 [0,1,2].every(i=>b[i]>=0&&b[i+3]<=1&&b[i]<b[i+3]);
const point=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger)&&p.every(v=>Math.abs(v)<=4096);
const equalNullable=(a,b)=>a===b;
const clamp01=v=>Math.max(0,Math.min(1,v));

/** Stable planar union, with overlapping original material boxes counted ONCE.
 * Exact source Float32 mesh bounds are accepted without snapping/rounding.
 * A corner line is never counted as positive-area contact.
 */
export function originalPack5ProjectedUnionArea(rectangles,{maxRectangles=4096}={}){
 deny(Number.isSafeInteger(maxRectangles)&&maxRectangles>=1&&maxRectangles<=4096,
  'invalid source-only projected rectangle cap');
 deny(Array.isArray(rectangles)&&rectangles.length<=maxRectangles&&
  rectangles.every(r=>Array.isArray(r)&&r.length===4&&r.every(Number.isFinite)&&
    r[0]>=0&&r[1]>=0&&r[2]<=1&&r[3]<=1&&r[0]<r[2]&&r[1]<r[3]),
  'invalid projected source face rectangles');
 if(!rectangles.length)return 0;
 const cut=[...new Set([0,1,...rectangles.flatMap(r=>[r[0],r[2]])])].sort((a,b)=>a-b);
 let area=0;
 for(let i=1;i<cut.length;i++){
  const left=cut[i-1],right=cut[i];if(right<=left)continue;
  const center=(left+right)/2;
  const intervals=rectangles.filter(r=>r[0]<=center&&center<r[2])
   .map(r=>[r[1],r[3]]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  let top=0,height=0;
  for(const [lo,hi] of intervals){
   const base=Math.max(top,lo);
   if(hi>base)height+=hi-base;
   top=Math.max(top,hi);
  }
  area+=(right-left)*height;
 }
 deny(Number.isFinite(area)&&area>=0&&area<=1.0000001,'projected area overflow');
 return clamp01(area);
}

/** Compare both original source collision or authored mesh AABB lists.
 * All results are geometric bounds: no ability to approve a supported world.
 */
export function originalPack5FaceFootprint(dependentBoxes,backingBoxes,dependentAt,backingAt){
 deny(Array.isArray(dependentBoxes)&&dependentBoxes.length>=1&&dependentBoxes.length<=64&&
  dependentBoxes.every(box)&&Array.isArray(backingBoxes)&&backingBoxes.length>=1&&
  backingBoxes.length<=64&&backingBoxes.every(box)&&point(dependentAt)&&point(backingAt),
  'only bounded original single-cell source preview geometry');
 const nearest=closestOriginalPack5FaceGap(dependentBoxes,backingBoxes,dependentAt,backingAt);
 const axis=nearest.axis,[u,v]=[0,1,2].filter(k=>k!==axis),positive=nearest.dependentOnPositiveSide;
 const dependentProjection=dependentBoxes.map(a=>[a[u],a[v],a[u+3],a[v+3]]);
 const backingProjection=backingBoxes.map(a=>[a[u],a[v],a[u+3],a[v+3]]);
 const all=[],atNearest=[];
 for(const a of dependentBoxes)for(const b of backingBoxes){
  const rectangle=[Math.max(a[u],b[u]),Math.max(a[v],b[v]),
   Math.min(a[u+3],b[u+3]),Math.min(a[v+3],b[v+3])];
  if(rectangle[0]>=rectangle[2]||rectangle[1]>=rectangle[3])continue;
  all.push(rectangle);
  const dependentInset=positive?a[axis]:1-a[axis+3];
  const backingInset=positive?1-b[axis+3]:b[axis];
  if(dependentInset+backingInset===nearest.nearestFaceGapBlockUnits)
   atNearest.push(rectangle);
 }
 deny(all.length<=4096&&atNearest.length<=4096,
  'excessive Pack5 test-only original paired box surfaces');
 const dependentArea=originalPack5ProjectedUnionArea(dependentProjection);
 const backingArea=originalPack5ProjectedUnionArea(backingProjection);
 const totalOverlap=originalPack5ProjectedUnionArea(all);
 const nearestOverlap=originalPack5ProjectedUnionArea(atNearest);
 deny(nearestOverlap<=totalOverlap+0.0000001&&totalOverlap<=dependentArea+0.0000001&&
  totalOverlap<=backingArea+0.0000001,
  'original footprint union inconsistent with producer geometry');
 const coverage=dependentArea===0?0:clamp01(nearestOverlap/dependentArea);
 return {axis,dependentOnPositiveSide:positive,
  nearestOriginalFaceGapBlockUnits:nearest.nearestFaceGapBlockUnits,
  projectedDependentFaceArea:dependentArea,
  projectedBackingFaceArea:backingArea,
  possibleTangentialProjectionOverlapArea:totalOverlap,
  nearestGapPairProjectedUnionArea:nearestOverlap,
  nearestGapProjectedCoverageOfDependent:coverage,
  totalPositiveAreaPairProjections:all.length,
  closestPairProjectionCount:atNearest.length,
  backingFootprintLacksFullDependentFaceContact:nearestOverlap!==dependentArea,
  fullFaceAreaAtClosestGapOnly:nearestOverlap===1,
  geometricContactIsNotPhysicalLoadCertification:true,
  originalSourceMeshFaceOcclusionNotProven:true,
  actualWorldCollisionWasNotRun:true};
}

/** An additional source-only strict witness consuming the original native
 * dependency/mesh/collider producer and preserving ALL prior blocked cases.
 */
export function auditRoadmapAPack5ProjectedContactFootprints(support,dependency,meshes,colliders){
 const prior=auditRoadmapAPack5ContactGapCandidates(support,dependency,meshes,colliders);
 deny(prior.sourceOnly===true&&prior.readyForWorldPlacement===false&&
  prior.realWorldStructuralSupportCertified===false&&prior.liveRendererOrSourceWorldModified===false,
  'unapproved original preview contact report required');
 const rows=[];
 let fullCollisionProjection=0,partialCollisionProjection=0,noCollisionProjection=0;
 let fullArtProjection=0,partialArtProjection=0,noArtProjection=0;
 for(const old of prior.perOriginalSourceCandidate){
  const i=old.dependentFixture,j=old.backingFixture;
  const d=colliders[i],b=colliders[j],md=meshes[i],mb=meshes[j];
  const collision=originalPack5FaceFootprint(d.collisionBoxes,b.collisionBoxes,d.at,b.at);
  const authored=originalPack5FaceFootprint(md.art.map(x=>x.bounds),
   mb.art.map(x=>x.bounds),md.at,mb.at);
  deny(equalNullable(collision.nearestOriginalFaceGapBlockUnits,
      old.originalCollision.nearestFaceGapBlockUnits),
   'earlier independently verified collider clearance drifted');
  deny(equalNullable(authored.nearestOriginalFaceGapBlockUnits,
      old.originalAuthoredBoxGeometry.nearestFaceGapBlockUnits),
   'earlier independently verified source art clearance drifted');
  deny(collision.axis===old.originalCollision.axis&&authored.axis===old.originalAuthoredBoxGeometry.axis,
   'original rotated producer orientation drifted');
  const classification=x=>x.nearestGapPairProjectedUnionArea===0?'NO_POSITIVE_PROJECTED_FACE':
   x.backingFootprintLacksFullDependentFaceContact?'PARTIAL_PROJECTED_ATTACHMENT_FOOTPRINT':
   'FULL_DEPENDENT_PROJECTION_AT_NEAREST_GAP_ONLY';
  const cc=classification(collision),ac=classification(authored);
  if(cc==='NO_POSITIVE_PROJECTED_FACE')noCollisionProjection++;
  else if(cc==='PARTIAL_PROJECTED_ATTACHMENT_FOOTPRINT')partialCollisionProjection++;
  else fullCollisionProjection++;
  if(ac==='NO_POSITIVE_PROJECTED_FACE')noArtProjection++;
  else if(ac==='PARTIAL_PROJECTED_ATTACHMENT_FOOTPRINT')partialArtProjection++;
  else fullArtProjection++;
  rows.push({dependentFixture:i,backingFixture:j,
   explicitDependentSourceSymbol:d.symbol,explicitDependentVariant:d.variant,
   explicitDependentYaw:d.orientation,explicitBackingSourceSymbol:b.symbol,
   explicitBackingVariant:b.variant,explicitBackingYaw:b.orientation,
   previousSourceAttachmentHold:old.supportDependencyHold,
   priorPositiveGapHold:old.contactHold,colliderFootprint:collision,
   authoredMeshFootprint:authored,colliderProjectionHold:cc,authoredProjectionHold:ac,
   realStructuralLoadAccepted:false,readyForWorldPlacement:false});
 }
 deny(rows.length===prior.originalCandidateAttachmentEdges,
  'source candidate edge count changed without original source');
 return {schema:'mythwrought.roadmap-a.pack5-source-projected-contact-footprints.v1',
  onlyExplicitOriginalPack5FixtureSelections:true,sourceOnly:true,
  inputFixtures:prior.originalExplicitPreviewFixtures,originalCandidateAttachments:rows.length,
  fullCollisionProjectionOnly:fullCollisionProjection,
  partialCollisionProjectionHolds:partialCollisionProjection,
  noCollisionProjectedFaceHolds:noCollisionProjection,
  fullAuthoredProjectionOnly:fullArtProjection,
  partialAuthoredProjectionHolds:partialArtProjection,
  noAuthoredProjectedFaceHolds:noArtProjection,
  individualOriginalCandidateFootprints:rows,
  usedOriginalSourceAABBFacePairsOnly:true,
  variantsOrYawsAssignedToRoadmapA:false,original79A5SourcesChanged:false,
  realLoadBearingCertified:false,worldPlacementOrGameplayAllowed:false,
  liveRendererOrSavesChanged:false,originalGameWebGL2OrIPhoneMeasured:false,
  creatorAccepted:false,readyForWorldPlacement:false};
}
