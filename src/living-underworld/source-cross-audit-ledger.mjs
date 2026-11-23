// MYTHWROUGHT Living Underworld Phase29. Read-only, bounded observation of
// one caller-provided original-world reader cohort across the earlier city
// source survey and later proposed bridge/pad survey. NO additional M7 reads.
// This does NOT authenticate FourRegionWorld or certify actual player walking.
const ROLES=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
const INT=Number.isSafeInteger;
const key=(x,y,z)=>x+','+y+','+z;
const readonlyCounts=c=>Object.freeze({...c});
export function createCitySourceCrossAuditLedger(source,{
 maxCoordinatesPerRole=160000,maxTotalCalls=1200000
}={}){
 if(!source||typeof source!=='object'||
    ROLES.some(role=>typeof source[role]!=='function')||
    !INT(maxCoordinatesPerRole)||maxCoordinatesPerRole<1||
    maxCoordinatesPerRole>200000||
    !INT(maxTotalCalls)||maxTotalCalls<4||
    maxTotalCalls>2000000)
  throw TypeError('Invalid original-world cross-audit ledger');
 const original=Object.freeze(Object.fromEntries(
  ROLES.map(role=>[role,source[role]])));
 const observed=Object.fromEntries(ROLES.map(role=>[role,new Map()]));
 const prior=Object.fromEntries(ROLES.map(role=>[role,0]));
 const later=Object.fromEntries(ROLES.map(role=>[role,0]));
 const cross=Object.fromEntries(ROLES.map(role=>[role,0]));
 const distinctPrior=Object.fromEntries(ROLES.map(role=>[role,0]));
 let phase='prior',total=0,closed=false,refusal=null,firstMismatch=null;
 const fail=(reason,details={})=>{
  if(!refusal){refusal=reason;firstMismatch=Object.freeze(details);}
 };
 const bindingsUnchanged=()=>ROLES.every(role=>
  source[role]===original[role]);
 function visit(role,x,y,z){
  if(closed||![x,y,z].every(INT))
   throw TypeError('Invalid original-world source ledger observation');
  // The snapshot is stable even if a caller tries to replace a source method.
  // Refuse that change, rather than silently changing the reader authority.
  if(source[role]!==original[role])
   fail('ORIGINAL_SOURCE_CALLBACK_BINDING_CHANGED',{role,coordinate:key(x,y,z)});
  const value=original[role].call(source,x,y,z);
  total++;
  (phase==='prior'?prior:later)[role]++;
  if(total>maxTotalCalls)
   fail('ORIGINAL_SOURCE_LEDGER_TOTAL_CALL_BUDGET',{role,coordinate:key(x,y,z)});
  const valid=role==='naturalAt'?INT(value)&&value>=0:
   role==='authoredAt'?value===undefined||(INT(value)&&value>=0):
   typeof value==='boolean';
  if(!valid)fail('ORIGINAL_SOURCE_LEDGER_INVALID_ROLE_VALUE',{
   role,coordinate:key(x,y,z)});
  const k=key(x,y,z),records=observed[role];
  const old=records.get(k);
  if(old){
   if(!Object.is(old.value,value))
    fail('ORIGINAL_SOURCE_LEDGER_VALUE_CHANGED',{
     role,coordinate:k,firstPhase:old.phase,secondPhase:phase,
     priorValue:old.value,newValue:value});
   if(phase==='underpass'&&old.phase==='prior'&&!old.crossCompared){
    old.crossCompared=true;cross[role]++;
   }
  }else if(records.size>=maxCoordinatesPerRole){
   fail('ORIGINAL_SOURCE_LEDGER_CELL_BUDGET',{role,coordinate:k});
  }else {
   records.set(k,{value,phase,crossCompared:false});
   if(phase==='prior')distinctPrior[role]++;
  }
  return value;
 }
 const readers=Object.freeze(Object.fromEntries(
  ROLES.map(role=>[role,(x,y,z)=>visit(role,x,y,z)])));
 function beginUnderpass(){
  if(closed||phase!=='prior'||!ROLES.every(role=>prior[role]>0))
   throw Error('Original source ledger prior audit incomplete');
  if(!bindingsUnchanged())
   fail('ORIGINAL_SOURCE_CALLBACK_BINDING_CHANGED',{phase:'prior'});
  phase='underpass';
 }
 function audit(){
  if(closed||phase!=='underpass')
   throw Error('Original source ledger underpass not complete');
  closed=true;
  if(!bindingsUnchanged())
   fail('ORIGINAL_SOURCE_CALLBACK_BINDING_CHANGED',{phase:'underpass'});
  const priorCalls=readonlyCounts(prior),underpassCalls=readonlyCounts(later),
   priorUniqueCellsByRole=readonlyCounts(distinctPrior),
   crossPhaseComparedCellsByRole=readonlyCounts(cross);
  const uniqueCellsByRole=Object.freeze(Object.fromEntries(
   ROLES.map(role=>[role,observed[role].size])));
  return Object.freeze({ok:refusal===null,reason:refusal,
   firstMismatch,priorCalls,underpassCalls,priorUniqueCellsByRole,
   uniqueCellsByRole,crossPhaseComparedCellsByRole,
   comparedSourceReturnsAcrossPhases:ROLES.reduce((n,role)=>n+cross[role],0),
   totalSourceCallbackCalls:total,originalCallbackBindingsUnchanged:bindingsUnchanged(),
   readerFunctionsSharedAcrossPhases:true,callerSourceWorldIdentityUnverified:true,
   authenticM7WorldExecuted:false,noExtraOriginalWorldReads:true,
   worldChanged:false,noWorldWrites:true});
 }
 return Object.freeze({readers,beginUnderpass,audit});
}
