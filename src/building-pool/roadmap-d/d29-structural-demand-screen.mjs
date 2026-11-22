// MYTHWROUGHT Builder D29: source-only explicit engineering demand screen.
// No strength, joint stiffness, roof loading or footing capacities are known.
// Supplying hypothetical numbers makes this only a numerical screening exercise,
// NEVER design approval. One-cell Pack2 face contact is NOT moment continuity.
const positive=n=>typeof n==='number'&&Number.isFinite(n)&&n>0;
const nonnegative=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
const requiredRatings=Object.freeze([
 'beamMoment','beamShear','beamEI','jointMoment','jointShear',
 'roofGravityTransferPerLength','roofUpliftTransferPerLength',
 'endBearingGravity','endBearingUplift','endBearingLateral'
]);
const requiredLoads=Object.freeze([
 'tributaryWidth','gravityAreaLoad','netUpliftAreaLoad','lateralAreaLoad',
 'maximumDeflectionRatio'
]);
function supplied(o,names){return names.filter(k=>o?.[k]===undefined||o[k]===null)}
function validInputs(o){
 for(const k of ['tributaryWidth','gravityAreaLoad','maximumDeflectionRatio'])
  if(!positive(o[k]))throw RangeError('D29 physical load input must be positive: '+k);
 for(const k of ['netUpliftAreaLoad','lateralAreaLoad'])
  if(!nonnegative(o[k]))throw RangeError('D29 physical load input must be nonnegative: '+k);
 if(o.maximumDeflectionRatio<1)throw RangeError('D29 deflection ratio cannot be below one');
}
/**
 * Screening formulas assume ONE ideal simply supported beam, continuous
 * flexural stiffness and a uniformly distributed tributary roof load.
 * They are NOT valid as a proof for face-joined ID61 segments or a truss.
 * Load and rating provenance must be authenticated in a separate gate.
 */
export function screenD29ExplicitRatedLongBay(interiorCells,{
 loads=null,ratings=null,loadEvidenceId=null,ratingEvidenceId=null,
 sourceLoadPathAuthenticated=false,physicalAssemblyTested=false,
 foundationCapacityTested=false,roofDiaphragmTested=false,
 lateralBracingTested=false,creatorApproved=false
}={}){
 if(!Number.isSafeInteger(interiorCells)||interiorCells<13||interiorCells>48)
  throw RangeError('D29 authentic long-bay clear span must have 13..48 interior cells');
 const L=interiorCells+1,missingLoadData=supplied(loads,requiredLoads),
  missingRatings=supplied(ratings,requiredRatings);
 if(loads&&missingLoadData.length===0)validInputs(loads);
 if(ratings&&missingRatings.length===0){for(const k of requiredRatings){
   if(!positive(ratings[k]))throw RangeError('D29 invalid nonpositive rating: '+k);
 }}
 let demands=null,requirements=null,capacitiesPass=null;
 if(missingLoadData.length===0){
  const q=loads.tributaryWidth*loads.gravityAreaLoad,
   qu=loads.tributaryWidth*loads.netUpliftAreaLoad,
   qlat=loads.tributaryWidth*loads.lateralAreaLoad,
   reaction=q*L/2,
   peakMoment=q*L*L/8,
   requiredEI=(5*q*L**4/384)/(L/loads.maximumDeflectionRatio);
  demands=Object.freeze({gravityLineLoad:q,netUpliftLineLoad:qu,lateralLineLoad:qlat,
   verticalReactionAtEachOriginalBearing:reaction,
   netUpliftReactionAtEachBearing:qu*L/2,
   lateralReactionAtEachBearing:qlat*L/2,
   maximumSimpleSpanMoment:peakMoment,maximumSimpleSpanShear:reaction,
   requiredContinuousEIAtSpecifiedDeflectionLimit:requiredEI,
   maximumPermittedDeflection:L/loads.maximumDeflectionRatio,
   roofAttachmentGravityLineLoad:q,roofAttachmentUpliftLineLoad:qu});
  if(!Object.values(demands).every(Number.isFinite))throw RangeError('D29 load demand overflow');
  requirements=Object.freeze({beamMoment:peakMoment,beamShear:reaction,beamEI:requiredEI,
   jointMoment:peakMoment,jointShear:reaction,
   roofGravityTransferPerLength:q,roofUpliftTransferPerLength:qu,
   endBearingGravity:reaction,endBearingUplift:qu*L/2,
   endBearingLateral:qlat*L/2});
 }
 if(requirements&&missingRatings.length===0){
  capacitiesPass=Object.freeze(Object.fromEntries(requiredRatings.map(k=>
   [k,ratings[k]>=requirements[k]])));
 }
 const missingProvenance=[];
 if(typeof loadEvidenceId!=='string'||loadEvidenceId.trim()==='')missingProvenance.push('authenticated load evidence');
 if(typeof ratingEvidenceId!=='string'||ratingEvidenceId.trim()==='')missingProvenance.push('authenticated rating evidence');
 for(const [k,ok] of Object.entries({sourceLoadPathAuthenticated,physicalAssemblyTested,
   foundationCapacityTested,roofDiaphragmTested,lateralBracingTested,creatorApproved})){
  if(ok!==true)missingProvenance.push(k);
 }
 const numericScreenPass=capacitiesPass?Object.values(capacitiesPass).every(Boolean):false;
 return Object.freeze({format:'mythwrought.builder-d.d29.explicit-unapproved-span-screen.v1',
  spanCenterlineCells:L,requiredLoadKeys:requiredLoads,requiredRatingKeys:requiredRatings,
  missingLoadData:Object.freeze(missingLoadData),missingRatings:Object.freeze(missingRatings),
  missingProvenance:Object.freeze(missingProvenance),
  demands,requirements,capacitiesPass,numericScreenPass,
  structuralReleaseAccepted:false,constructionAllowed:false,
  reason:'Unknown actual roof loads, tested timber and axial-joint ratings, foundation, uplift and runtime construction; even matching synthetic numerical criteria cannot authorize construction.'});
}
