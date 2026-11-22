/**
 * Roadmap A: pure, conservative authored mesh-vs-collider boundary witness.
 * For explicitly chosen isolated Pack5 test fixtures ONLY. A solid collision
 * face is not evidence that the source-authored visible boxes cover that face.
 * This module does not approve support, choose variants or modify geometry.
 */
const schema='mythwrought.roadmap-a.pack5-mesh-backing-boundary-witness.v1';
const ensure=(ok,msg)=>{if(!ok)throw Error('Roadmap A mesh backing denied: '+msg);};
const point=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isSafeInteger)&&v.every(x=>Math.abs(x)<=4096);
const same=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>v===b[i]);
const boundedBox=b=>Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
 [0,1,2].every(i=>b[i]>=-0.000001&&b[i+3]<=1.000001&&b[i]<b[i+3]);
const candidates='source-only-full-face-collider-candidate';
const clip=x=>Math.max(0,Math.min(1,x));

/** Union of source-authored rectangles at the *exterior* cell boundary plane.
 * Uses strips of exact source mesh-box coordinates, not a sampling grid or
 * rounded face keys. Returns projected area, never a renderer visibility claim.
 */
export function authoredBoundaryCoverage(boxes,axis,positive){
 ensure(Array.isArray(boxes)&&boxes.length>0&&boxes.length<=64&&boxes.every(boundedBox),
  'original mesh boxes must be bounded nondegenerate in-cell geometry');
 ensure(Number.isInteger(axis)&&axis>=0&&axis<=2&&typeof positive==='boolean',
  'boundary orientation must be explicit');
 const [u,v]=[0,1,2].filter(i=>i!==axis),plane=positive?1:0;
 const rectangles=[];
 for(const b of boxes){
  if(b[positive?axis+3:axis]!==plane)continue;
  const r=[clip(b[u]),clip(b[v]),clip(b[u+3]),clip(b[v+3])];
  if(r[0]<r[2]&&r[1]<r[3])rectangles.push(r);
 }
 const xEdges=[...new Set([0,1,...rectangles.flatMap(r=>[r[0],r[2]])])].sort((a,b)=>a-b);
 let area=0;
 for(let i=1;i<xEdges.length;i++){
  const x0=xEdges[i-1],x1=xEdges[i];
  if(x1<=x0)continue;
  const xMid=(x0+x1)/2;
  const spans=rectangles.filter(r=>r[0]<=xMid&&xMid<r[2]).map(r=>[r[1],r[3]])
   .sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  let covered=0,start=-1,end=-1;
  for(const [lo,hi] of spans){
   if(start<0){start=lo;end=hi;}
   else if(lo<=end){end=Math.max(end,hi);}
   else {covered+=end-start;start=lo;end=hi;}
  }
  if(start>=0)covered+=end-start;
  area+=(x1-x0)*covered;
 }
 // Report stable arithmetic, never turn an inset wall into a full face by
 // rounding mesh values BEFORE the geometric test.
 ensure(Number.isFinite(area)&&area>=0&&area<=1.000001,'union area overflow');
 return {faceBoxesTouchingBoundary:rectangles.length,projectedBoundaryArea:Math.min(1,area),
  projectedBoundaryFraction:Math.min(1,area),boundaryEntirelyCovered:area===1};
}

/** Cross-authenticates the existing Pack5 support and dependency reports with
 * exact original-source mesh-box bounds supplied by the original mesh adapter.
 * No support hold is removed even when an authored boundary has full coverage.
 */
export function auditRoadmapAPack5MeshBackingBoundary(support,dependency,meshes){
 ensure(support?.schema==='mythwrought.roadmap-a.preview-real-pack5-support-candidates.v1'&&
  support.original79RoadmapASourcesTouched===false&&support.physicalLoadBearingCertified===false&&
  support.physicalWorldBuilt===false&&support.readyForWorldPlacement===false&&
  support.sourceVariantsAutomaticallySelected===false,
  'original unapproved support preview report required');
 ensure(dependency?.schema==='mythwrought.roadmap-a.preview-support-dependency-holds.v1'&&
  dependency.sourceOnly===true&&dependency.realWorldSupportsCertified===false&&
  dependency.readyForGamePlacement===false&&dependency.worldOrSavesModified===false&&
  dependency.inputPreviewAssets===support.previewAssets&&
  dependency.originalSourceSupportChecks===support.attachmentRequirements,
  'matching unapproved dependency witness required');
 const count=support.previewAssets;
 ensure(Number.isSafeInteger(count)&&count>=1&&count<=96&&Array.isArray(meshes)&&
  meshes.length===count&&Array.isArray(support.details)&&
  support.details.length===support.attachmentRequirements&&
  Array.isArray(dependency.conditionalAttachmentEdges)&&
  Array.isArray(dependency.fixtureHolds)&&dependency.fixtureHolds.length===count,
  'bounded, consistent original fixture and dependency counts required');
 for(const [i,m] of meshes.entries()){
  ensure(m?.previewFixtureOnly===true&&m.selectedForRoadmapASource!==true&&
   ['pack5:079','pack5:080','pack5:081'].includes(m.symbol)&&
   typeof m.variant==='string'&&m.variant.length>0&&
   Number.isInteger(m.orientation)&&m.orientation>=0&&m.orientation<=3&&point(m.at)&&
   Array.isArray(m.art)&&m.art.length>=1&&m.art.length<=64&&
   m.art.every(a=>boundedBox(a?.bounds))&&
   dependency.fixtureHolds[i]?.fixtureIndex===i&&
   dependency.fixtureHolds[i].physicalSupportCertified===false,
   'source mesh identity/art and unapproved fixture hold required');
 }
 const edgeKeys=new Set();
 for(const edge of dependency.conditionalAttachmentEdges){
  ensure(Number.isSafeInteger(edge?.dependentFixture)&&edge.dependentFixture>=0&&edge.dependentFixture<count&&
   Number.isSafeInteger(edge.potentialBackingFixture)&&edge.potentialBackingFixture>=0&&
   edge.potentialBackingFixture<count&&edge.dependentFixture!==edge.potentialBackingFixture&&
   edge.sourceSupportCertified===false,'invalid or already-approved dependency edge');
  const k=edge.dependentFixture+':'+edge.potentialBackingFixture;
  ensure(!edgeKeys.has(k),'duplicated dependency edge');edgeKeys.add(k);
 }
 const results=[];let candidateCount=0,fullArt=0,insetArt=0,zeroArt=0;
 for(const d of support.details){
  const i=d?.fixtureIndex,neighbor=d?.neighborPreviewIndex;
  ensure(Number.isSafeInteger(i)&&i>=0&&i<count&&
   d.physicalLoadBearingCertified===false&&d.worldSupportCertified===false&&
   d.variantChosenForRoadmapABuilding===false&&
   d.symbol===meshes[i].symbol&&d.explicitPreviewVariant===meshes[i].variant&&
   d.explicitPreviewOrientation===meshes[i].orientation&&same(d.at,meshes[i].at)&&
   point(d.requiredSourceSupportAt),'authored source attachment identity/coordinate drift');
  if(d.classification!==candidates){
   ensure(d.classification==='source-only-neighbor-partial-collider'||
    d.classification==='no-explicit-preview-neighbor','unknown support classification');
   ensure(!edgeKeys.has(i+':'+neighbor),'non-candidate attachment falsely introduced as dependency');
   continue;
  }
  ensure(Number.isSafeInteger(neighbor)&&neighbor>=0&&neighbor<count&&neighbor!==i&&
   d.neighborPreviewPhysicalAsset===meshes[neighbor].symbol&&
   same(d.requiredSourceSupportAt,meshes[neighbor].at)&&edgeKeys.has(i+':'+neighbor),
   'source full-collider neighbor disagrees with original mesh/dependency');
  const delta=meshes[i].at.map((v,j)=>v-meshes[neighbor].at[j]);
  ensure(delta.reduce((n,v)=>n+Math.abs(v),0)===1,
   'candidate faces must share one unambiguous source cell boundary');
  const axis=delta.findIndex(v=>v!==0),positive=delta[axis]>0;
  const measure=authoredBoundaryCoverage(meshes[neighbor].art.map(a=>a.bounds),axis,positive);
  const status=measure.boundaryEntirelyCovered?'FULL_AUTHORED_BOUNDARY_BOX_COVERAGE_ONLY':
   measure.faceBoxesTouchingBoundary===0?'FULL_COLLIDER_WITH_ZERO_AUTHORED_BOUNDARY_BOX_COVERAGE':
   'FULL_COLLIDER_WITH_INSET_OR_GAPPED_AUTHORED_BOUNDARY';
  candidateCount++;
  if(measure.boundaryEntirelyCovered)fullArt++;
  else if(measure.faceBoxesTouchingBoundary===0)zeroArt++;
  else insetArt++;
  results.push({dependentFixture:i,backingFixture:neighbor,backingSymbol:meshes[neighbor].symbol,
   backingExplicitVariant:meshes[neighbor].variant,backingExplicitYaw:meshes[neighbor].orientation,
   contactAxis:axis,contactIsPositiveBackingFace:positive,
   ...measure,visualBoundaryHold:status,collisionFullFaceCandidateOnly:true,
   authoredMeshCannotCertifyStructuralBacking:true,
   realWebGL2PixelOcclusionMeasured:false,readyForWorldPlacement:false});
 }
 ensure(candidateCount===edgeKeys.size&&candidateCount===dependency.originalCandidateAttachmentEdges,
  'source mesh candidate coverage incomplete');
 return {schema,sourceOnly:true,previewFixtures:count,checkedOriginalSourceAttachments:support.details.length,
  fullColliderCandidatesWithMeshCrosscheck:candidateCount,
  fullAuthoredBoundaryCoverageCandidates:fullArt,
  insetOrGappedAuthoredBoundaryCandidates:insetArt,
  zeroAuthoredBoundaryCoverageCandidates:zeroArt,
  candidateBoundaryWitnesses:results,
  originalManualFivePackAuthoredMeshBoundsOnly:true,
  collisionCandidatesAreNotRealStructuralApproval:true,
  authoredBoxFacesAreNotWebGL2PixelVisibilityProof:true,
  actualWorldSupportsCertified:false,realGpuOrIphoneMeasured:false,
  variantsOrYawsSelectedForRoadmapASources:false,sourceBlueprintsOrWorldChanged:false,
  rendererChanged:false,savesChanged:false,readyForWorldPlacement:false};
}
