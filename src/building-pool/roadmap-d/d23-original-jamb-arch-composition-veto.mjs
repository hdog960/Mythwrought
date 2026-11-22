// MYTHWROUGHT Builder D23 — source-honest in-cell jamb versus exterior arch policy.
// D22 paired Pack2 source jambs can touch original stone sill / wood lintel,
// but the D21 original Pack3 sculpted arch shell occupies much of that volume.
// A decorative part which survives AABB intersection culling yet is disconnected
// from masonry/jambs is NOT safe physical ornament. Never stack without proof.
// This is a pure read-only architectural admission gate, not live integration.
const K=a=>a.join(',');
const pt=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const AABB=a=>Array.isArray(a)&&a.length===6&&a.every(Number.isFinite)&&
 [0,1,2].every(i=>a[i]>=0&&a[i]<a[i+3]&&a[i+3]<=1);
const collide=(a,b)=>[0,1,2].every(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i])>1e-6);
const contact=(a,b)=>{const x=[0,1,2].map(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i]));
 return x.every(v=>v>=-1e-6)&&x.filter(v=>v>1e-6).length>=2;};
export function auditD23OriginalJambArchCompatibility(blueprint,exclusive,d21,d22,{
 resolveOriginalPack2PostShape,resolveOriginalPack3Ornament
}={}){
 if(typeof resolveOriginalPack2PostShape!=='function'||
    typeof resolveOriginalPack3Ornament!=='function')
   throw TypeError('D23 original Pack2 and Pack3 physical owner resolvers required');
 const originalPost=resolveOriginalPack2PostShape(62,0);
 if(!originalPost||originalPost.id!==62||!Array.isArray(originalPost.boxes)||
    originalPost.boxes.length!==3||originalPost.boxes.some(b=>!AABB(b)))
   throw Error('D23 physical source owner Pack2 ID62 changed');
 if(!blueprint||blueprint.worldPlaced!==false||blueprint.creatorApproved!==false||
    blueprint.integrated!==false||!Array.isArray(blueprint.cells)||
    !Array.isArray(blueprint.openings))
   throw Error('D23 jamb-arch source audit requires original unregistered W16/17 building');
 if(!exclusive||exclusive.blueprintId!==blueprint.id||
    exclusive.glazingMutuallyExclusive!==true||
    !Array.isArray(exclusive.plannedOriginalWindowChoices)||
    !d21||d21.blueprintId!==blueprint.id||
    d21.actualStructuralJambAcceptance!==false||
    !Array.isArray(d21.supportedExteriorDecorativeSamples)||
    !d22||d22.blueprintId!==blueprint.id||
    d22.fullStructuralLoadAcceptance!==false||
    d22.zeroOriginal4BCellOverwrites!==true||
    d22.noAdjacentNavigationCellEntered!==true||
    !Array.isArray(d22.sourceDerivedJambCandidates))
   throw Error('D23 requires original D19, D21 and D22 unaccepted source evidence for SAME building');
 const cells=new Map();
 for(const c of blueprint.cells){
  if(!pt(c.at)||cells.has(K(c.at)))throw Error('D23 original source cell position invalid');
  cells.set(K(c.at),c);
 }
 const opening=new Map(blueprint.openings.filter(o=>o.kind==='window').map(o=>[K(o.at),o]));
 if(opening.size!==exclusive.plannedOriginalWindowChoices.length)
   throw Error('D23 exclusive glass original source window census changed');
 const choice=new Map();
 for(const c of exclusive.plannedOriginalWindowChoices){
  if(!pt(c.at)||choice.has(K(c.at))||
     ![159,160,161].includes(c.candidateId)||
     c.originalCellRetained!==true||c.neverOverlayOriginalGlass!==true||
     opening.get(K(c.at))?.facing!==c.authoritativeFacadeFacing)
   throw Error('D23 exclusive source-owned physical glass choice invalid');
  choice.set(K(c.at),c);
 }
 const jambs=new Map();
 for(const j of d22.sourceDerivedJambCandidates){
  if(!pt(j.at)||jambs.has(K(j.at))||j.addedWorldCellCount!==0||
     j.noGlassPositiveVolumeOverlap!==true||
     j.originalWallSillAndLintelCellBoundaryContact!==true||
     j.notTheD21DecorativeArch!==true||j.sourceParts?.length!==6||
     j.sideSplices?.length!==2||j.sideSplices.some(s=>s.connectedParts!==3||
      s.originalMasonrySillContactArea<=0||s.originalUpperBeamContactArea<=0))
   throw Error('D23 rejected ungrounded, duplicate or source-mutating jamb');
  const c=choice.get(K(j.at)),p=cells.get(K(j.at)),[x,y,z]=j.at;
  if(!c||c.structuralJambCount>=2||c.candidateId!==j.candidateGlazingId||
     p?.role!=='window'||p.asset!=='pack4:030'||y!==3||
     cells.get(K([x,2,z]))?.asset!=='live:stone'||
     cells.get(K([x,4,z]))?.asset!=='live:wood'||
     cells.get(K([x,4,z]))?.feature!=='lintel')
    throw Error('D23 original in-cell structural source ownership or material differs');
  for(const piece of j.sourceParts){
   const original=originalPost.boxes[piece.sourcePart];
   if(!AABB(piece.physicalJambAabb)||piece.originalPack2Id62!==true||
      !original||!AABB(piece.authenticPostSourceBox)||
      original.some((v,i)=>Math.abs(v-piece.authenticPostSourceBox[i])>1e-7))
    throw Error('D23 invalid source geometry in true original Pack2 ID62 jamb');
  }
  jambs.set(K(j.at),j);
 }
 const deficient=exclusive.plannedOriginalWindowChoices.filter(c=>c.structuralJambCount<2);
 if(deficient.length!==jambs.size||deficient.some(c=>!jambs.has(K(c.at)))||
    d22.originalWeakSideJambs!==jambs.size)
   throw Error('D23 must cover every original deficient jamb site without fake omission');
 const comparisons=[],touched=new Set();
 for(const p of d21.supportedExteriorDecorativeSamples){
  const k=K(p.at),j=jambs.get(k),c=choice.get(k);
  if(!pt(p.at)||touched.has(k)||!j||!c||
     c.candidateId!==p.originalGlazingId||c.authoritativeFacadeFacing!==p.facing||
     p.originalPack3SourceId!==121||p.sourceShapeParts?.length!==13||
     p.derivedNonRegisteredVisual!==true||p.originalGlassNoIntersection!==true||
     p.sourceConnectedParts!==13)
   throw Error('D23 cannot compare forged decorative arch source to original Pack2/4 jamb');
  touched.add(k);
  const angle=({north:0,east:1,south:2,west:3})[p.facing];
  const genuineArch=resolveOriginalPack3Ornament(121,angle);
  if(!genuineArch||genuineArch.id!==121||genuineArch.parts?.length!==13||
     genuineArch.rotation!==angle)throw Error('D23 original Pack3 ID121 sculpted arch owner missing');
  let interfering=0;const leftover=[];
  const seenPart=new Set();
  for(const part of p.sourceShapeParts){
   const raw=genuineArch.parts[part.index];
   if(!AABB(part.sourceBox)||part.originalPack3Id121!==true||
      !Number.isSafeInteger(part.index)||part.index<0||part.index>12||
      seenPart.has(part.index)||!raw||part.tone!==raw.tone||
      part.color!==genuineArch.colors[raw.tone]||
      !Array.isArray(part.originalBox)||part.originalBox.length!==6||
      raw.box.some((v,i)=>Math.abs(v-part.originalBox[i])>1e-7)||
      [0,1,2].some(i=>part.sourceBox[i]<raw.box[i]-1e-7||
        part.sourceBox[i+3]>raw.box[i+3]+1e-7))
    throw Error('D23 counterfeit, duplicate or overextended original Pack3 source ornament');
   seenPart.add(part.index);
   const hit=j.sourceParts.some(x=>collide(part.sourceBox,x.physicalJambAabb));
   if(hit)interfering++;
   else leftover.push(part);
  }
  const joined=leftover.filter(part=>j.sourceParts.some(x=>contact(part.sourceBox,x.physicalJambAabb)));
  const wallContact=leftover.filter(part=>part.sourceBox[1]<=1e-6||
    part.sourceBox[4]>=1-1e-6);
  const orphan=leftover.length-joined.length;
  if(interfering<1||orphan<1||joined.length>0||wallContact.length>0)
   throw Error('D23 source jamb and decorative glass may have changed; never quietly approve layering');
  comparisons.push(Object.freeze({at:Object.freeze([...p.at]),originalGlazingId:p.originalGlazingId,
    authoritativeFacing:p.facing,sourceArchParts:p.sourceShapeParts.length,
    originalArchPartsIntersectingTrueJamb:interfering,
    sourceArchPartsWithoutPositiveIntersection:leftover.length,
    survivingOriginalArchPartsDirectlyJoinedToJamb:joined.length,
    survivingOriginalArchPartsTouchingMasonryOrLintel:wallContact.length,
    survivingOriginalArchPartsFloating:orphan,
    noStackingAllowed:true,derivedVisualRejectedForThisWeakJamb:true}));
 }
 if(!comparisons.length||comparisons.length!==d21.sampleCount)
   throw Error('D23 requires actual source-authored D21 comparative physical samples');
 const sourceWeak=Object.freeze(deficient.map(c=>Object.freeze({
  at:Object.freeze([...c.at]),originalPack4Id:159,
  permittedExclusivePhysicalPreview:'D22 Pack2 ID62 jamb + sole Pack4 159/160/161 glazing',
  excludedDecorativePhysicalPreview:'D21 Pack3 ID121 arch overlay (intersects real jamb)',
  originalUnmodified:true,wallLoadAcceptance:false,
  originalGameCollisionAcceptance:false,worldPlaced:false
 })));
 return Object.freeze({format:'mythwrought.builder-d.d23.original-source-jamb-versus-arch-exclusion.v1',
  blueprintId:blueprint.id,originalWindowCount:choice.size,
  deficientJambSourceCount:deficient.length,
  provisionalSingleJambProposalCount:jambs.size,
  originalArchVsJambSourceComparisonCount:comparisons.length,
  genuineArchJambCollisionSamples:Object.freeze(comparisons),
  safeOriginalWindowSourcePolicy:Object.freeze(sourceWeak),
  dangerousMixedPack2AndPack3ArchesExplicitlyExcluded:true,
  unapprovedDerivedDecorationsNeverRegistered:true,
  originalLiveWoodLintelAndStoneSillRetained:true,
  actualMechanicalJambLoadAccepted:false,originalGameCollisionAccepted:false,
  originalGameWebGL2Accepted:false,
  originalSourceVoxelsPreserved:true,originalAuthoredNavigationPreserved:true,
  iPhoneHomeScreenPwaAccepted:false,worldPlaced:false
 });
}
