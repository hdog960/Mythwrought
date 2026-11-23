// Phase28: ephemeral, identity-only proof that the successful prior deep-city
// source selection and the candidate underpass use the SAME four callbacks.
// This does not authenticate the callbacks as actual M7 or take world reads.
const ROLES=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
const INT=Number.isSafeInteger;
const cohorts=new WeakMap();
const refusal=(reason,extra={})=>Object.freeze({ok:false,reason,...extra,
 sourceReaderIdentityCallerOnly:true,authenticOriginalM7WorldVerified:false,
 sourceCallbackCalls:0,worldChanged:false,noWorldWrites:true});
const valid=(selection,source)=>selection!==null&&
 typeof selection==='object'&&selection.ok===true&&
 selection.joined?.ok===true&&
 INT(selection.seed)&&INT(selection.rx)&&INT(selection.rz)&&
 INT(selection.sourceChecks)&&selection.sourceChecks>0&&
 source!==null&&typeof source==='object'&&
 ROLES.every(role=>typeof source[role]==='function');
export function bindCityDeepSourceReaderCohort(selection,source){
 if(!valid(selection,source))
  throw TypeError('Invalid original city deep reader provenance');
 const existing=cohorts.get(selection);
 if(existing&&ROLES.some(role=>existing[role]!==source[role]))
  throw Error('Deep source reader cohort already bound to different callbacks');
 if(!existing){
  cohorts.set(selection,Object.freeze(Object.fromEntries(
   ROLES.map(role=>[role,source[role]]))));
 }
 return selection;
}
export function auditCityDeepSourceReaderCohort(selection,source,{seed,rx,rz}={}){
 if(!valid(selection,source))
  return refusal('DEEP_SOURCE_READER_COHORT_INPUT_INVALID');
 if(![seed,rx,rz].every(INT)||
  selection.seed!==seed||selection.rx!==rx||selection.rz!==rz)
  return refusal('DEEP_SOURCE_READER_COHORT_SITE_MISMATCH');
 const stored=cohorts.get(selection);
 if(!stored)return refusal('DEEP_SOURCE_READER_COHORT_UNBOUND');
 for(const role of ROLES){
  if(stored[role]!==source[role])
   return refusal('DEEP_SOURCE_READER_COHORT_ROLE_CHANGED',{role});
 }
 return Object.freeze({ok:true,matchingRoles:4,
 sourceReaderCohortInProcessOnly:true,
 sourceReaderIdentityCallerOnly:true,
 authenticOriginalM7WorldVerified:false,sourceCallbackCalls:0,
 worldChanged:false,noWorldWrites:true});
}
