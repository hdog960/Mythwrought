/**
 * Conservative physical-contact distance witness for caller-explicit original
 * Pack5 PREVIEW fixtures only. The existing full-face source collider candidate
 * describes the BACKING cell; this additionally checks if dependent material's
 * actual collision and authored visual box geometry reaches that backing face.
 * Never places a block, selects an A5 source variant, or certifies a load.
 */
import {auditRoadmapAPack5MeshBackingBoundary} from './roadmap-a-pack5-mesh-backing-core.mjs';
const required=(ok,why)=>{if(!ok)throw Error('Roadmap A contact gap denied: '+why);};
const same=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>v===b[i]);
const inCell=b=>Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
 [0,1,2].every(i=>b[i]>=0&&b[i+3]<=1&&b[i]<b[i+3]);
const validBoxFixture=f=>f?.previewFixtureOnly===true&&f.selectedForRoadmapASource===false&&
 ['pack5:079','pack5:080','pack5:081'].includes(f.symbol)&&typeof f.variant==='string'&&
 Number.isInteger(f.orientation)&&f.orientation>=0&&f.orientation<=3&&
 Array.isArray(f.collisionBoxes)&&f.collisionBoxes.length>0&&f.collisionBoxes.length<=64&&
 f.collisionBoxes.every(inCell);
/** For adjacent unit cells, determine nearest pair of source boxes whose
 * tangential projections have positive AREA overlap. A 2D corner touch is not
 * physical face contact. NULL means no overlapping projected boxes exist.
 * Gap is in original BLOCK UNITS. Even exact zero is not load-bearing proof.
 */
export function closestOriginalPack5FaceGap(dependentBoxes,backingBoxes,dependentAt,backingAt){
 required(Array.isArray(dependentBoxes)&&dependentBoxes.length>0&&dependentBoxes.length<=64&&
  dependentBoxes.every(inCell)&&Array.isArray(backingBoxes)&&backingBoxes.length>0&&
  backingBoxes.length<=64&&backingBoxes.every(inCell),'source boxes must be genuine in-cell bounds');
 required([dependentAt,backingAt].every(a=>Array.isArray(a)&&a.length===3&&
  a.every(Number.isSafeInteger)&&a.every(x=>Math.abs(x)<=4096)),
 'explicit bounded integer source previews required');
 const delta=dependentAt.map((v,i)=>v-backingAt[i]);
 required(delta.reduce((sum,v)=>sum+Math.abs(v),0)===1,
  'dependent must be in a distinct face-adjacent source cell');
 const axis=delta.findIndex(v=>v!==0),positive=delta[axis]===1;
 const [u,v]=[0,1,2].filter(i=>i!==axis);
 let best=null,projectedPairs=0;
 for(const a of dependentBoxes)for(const b of backingBoxes){
  const overlaps=[u,v].every(k=>Math.min(dependentAt[k]+a[k+3],backingAt[k]+b[k+3])>
   Math.max(dependentAt[k]+a[k],backingAt[k]+b[k]));
  if(!overlaps)continue;
  projectedPairs++;
  const dependentInset=positive?a[axis]:1-a[axis+3];
  const backingInset=positive?1-b[axis+3]:b[axis];
  const total=dependentInset+backingInset;
  required(total>=0&&total<=2,'invalid original adjacent contact clearance');
  if(best===null||total<best.total){best={total,dependentInset,backingInset};}
 }
 return {axis,dependentOnPositiveSide:positive,positiveAreaProjectedBoxPairs:projectedPairs,
  nearestFaceGapBlockUnits:best?.total??null,
  dependentOwnCellInsetBlockUnits:best?.dependentInset??null,
  backingOwnCellInsetBlockUnits:best?.backingInset??null,
  exactFaceContactCandidate:best!==null&&best.total===0,
  noTangentialFaceOverlap:best===null};
}
export function auditRoadmapAPack5ContactGapCandidates(support,dependency,meshes,colliderFixtures){
 const boundary=auditRoadmapAPack5MeshBackingBoundary(support,dependency,meshes);
 required(Array.isArray(colliderFixtures)&&colliderFixtures.length===meshes.length&&
  colliderFixtures.length===boundary.previewFixtures&&
  colliderFixtures.every((f,i)=>validBoxFixture(f)&&f.symbol===meshes[i].symbol&&
   f.variant===meshes[i].variant&&f.orientation===meshes[i].orientation&&
   same(f.at,meshes[i].at)),
  'complete independently authenticated source collider/mesh preview identities required');
 const reports=[];let gappedColliders=0,exactColliderContacts=0,disjointColliders=0;
 let gappedVisuals=0,exactVisualContacts=0,disjointVisuals=0;
 for(const witness of boundary.candidateBoundaryWitnesses){
  const dep=witness.dependentFixture,back=witness.backingFixture;
  const d=colliderFixtures[dep],b=colliderFixtures[back];
  const c=closestOriginalPack5FaceGap(d.collisionBoxes,b.collisionBoxes,d.at,b.at);
  const a=closestOriginalPack5FaceGap(meshes[dep].art.map(x=>x.bounds),
   meshes[back].art.map(x=>x.bounds),d.at,b.at);
  required(c.axis===witness.contactAxis&&c.dependentOnPositiveSide===witness.contactIsPositiveBackingFace&&
   a.axis===witness.contactAxis&&a.dependentOnPositiveSide===witness.contactIsPositiveBackingFace,
   'physical contact axis disagrees with original source attachment');
  if(c.noTangentialFaceOverlap)disjointColliders++;
  else if(c.exactFaceContactCandidate)exactColliderContacts++;
  else gappedColliders++;
  if(a.noTangentialFaceOverlap)disjointVisuals++;
  else if(a.exactFaceContactCandidate)exactVisualContacts++;
  else gappedVisuals++;
  const hold=c.noTangentialFaceOverlap?'NO_PROJECTED_COLLIDER_FACE_CONTACT':
   !c.exactFaceContactCandidate?'POSITIVE_COLLIDER_TO_BACKING_FACE_CLEARANCE':
   a.noTangentialFaceOverlap?'NO_PROJECTED_AUTHORED_ART_FACE_CONTACT':
   !a.exactFaceContactCandidate?'POSITIVE_AUTHORED_ART_FACE_CLEARANCE':
   'EXACT_SOURCE_BOX_CONTACT_CANDIDATE_ONLY';
  reports.push({dependentFixture:dep,backingFixture:back,
   dependentExplicitSymbol:d.symbol,dependentExplicitVariant:d.variant,dependentExplicitYaw:d.orientation,
   backingExplicitSymbol:b.symbol,backingExplicitVariant:b.variant,backingExplicitYaw:b.orientation,
   supportDependencyHold:dependency.fixtureHolds[dep].supportHold,
   authoredBackingBoundaryFraction:witness.projectedBoundaryFraction,
   originalCollision:c,originalAuthoredBoxGeometry:a,contactHold:hold,
   collisionOrMeshGapIsNotStructuralApproval:true,actualGameWorldCollisionMeasured:false,
   readyForWorldPlacement:false});
 }
 required(reports.length===boundary.fullColliderCandidatesWithMeshCrosscheck,
  'missing source candidate physical-contact witnesses');
 return {schema:'mythwrought.roadmap-a.pack5-original-face-contact-gaps.v1',sourceOnly:true,
  originalExplicitPreviewFixtures:boundary.previewFixtures,
  originalCandidateAttachmentEdges:reports.length,
  candidatesWithPositiveColliderFaceClearance:gappedColliders,
  candidatesWithExactColliderFaceContactOnly:exactColliderContacts,
  candidatesWithNoTangentialColliderOverlap:disjointColliders,
  candidatesWithPositiveAuthoredArtClearance:gappedVisuals,
  candidatesWithExactAuthoredArtContactOnly:exactVisualContacts,
  candidatesWithNoTangentialAuthoredArtOverlap:disjointVisuals,
  perOriginalSourceCandidate:reports,
  allOffsetsFromExplicitOriginalTestFixtures:true,
  variantYawSourceAssignmentPerformed:false,originalA5BuildersModified:false,
  liveRendererOrSourceWorldModified:false,realWorldStructuralSupportCertified:false,
  iPhoneGpuOrWebGL2Measured:false,schema1SavesWritten:false,readyForWorldPlacement:false};
}
