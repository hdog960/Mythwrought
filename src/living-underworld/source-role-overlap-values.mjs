// Living Underworld Phase 27: read-only consistency witness for ORIGINAL
// old-world role values at cells used by BOTH the bridge and the pad.
// It does not authenticate original M7 readers or test live player motion.
const ROLES=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
const STAGES=Object.freeze(['bridge','pad']);
const INT=Number.isSafeInteger;
const key=(x,y,z)=>x+','+y+','+z;
const validKey=s=>typeof s==='string'&&s.split(',').length===3&&
 s.split(',').every(v=>INT(Number(v))&&String(Number(v))===v);
export function createUnderpassSourceOverlapValueWitness({
 bridgeCoordinates,padCoordinates,maxCells=20000
}={}){
 if(!INT(maxCells)||maxCells<1||maxCells>20000)
  throw TypeError('Invalid original source overlap witness budget');
 const sets=Object.create(null);
 for(const [stage,input] of [['bridge',bridgeCoordinates],['pad',padCoordinates]]){
  if(!Array.isArray(input)||input.length<1||input.length>maxCells||
     !input.every(validKey))
   throw TypeError('Invalid original source overlap coordinate manifest');
  const observed=new Set(input);
  if(observed.size!==input.length)
   throw TypeError('Duplicate original source overlap expected coordinate');
  sets[stage]=observed;
 }
 const overlap=new Set([...sets.bridge].filter(k=>sets.pad.has(k)));
 const values=Object.fromEntries(STAGES.map(stage=>[stage,
  Object.fromEntries(ROLES.map(role=>[role,new Map()]))]));
 const duplicate=Object.fromEntries(STAGES.map(stage=>[stage,
  Object.fromEntries(ROLES.map(role=>[role,0]))]));
 let active='bridge',sealed=false;
 const enterPad=()=>{
  if(sealed||active!=='bridge')throw Error('Invalid original source overlap stage transition');
  active='pad';
 };
 const observe=(stage,role,x,y,z,value)=>{
  const k=key(x,y,z);
  if(sealed||active!==stage||!STAGES.includes(stage)||
     !ROLES.includes(role)||![x,y,z].every(INT)||!sets[stage].has(k))
   throw TypeError('Invalid original source overlap observation');
  if(role==='naturalAt'&&(!INT(value)||value<0)||
     role==='authoredAt'&&value!==undefined&&(!INT(value)||value<0)||
     (role==='editedAt'||role==='protectedAt')&&typeof value!=='boolean')
   throw TypeError('Invalid original source overlap role value');
  const map=values[stage][role];
  if(map.has(k))duplicate[stage][role]++;
  else map.set(k,value);
 };
 const audit=()=>{
  if(sealed||active!=='pad')throw Error('Invalid completed original source overlap witness');
  sealed=true;
  const compared=Object.fromEntries(ROLES.map(role=>[role,0]));
  let reason=null,firstMismatch=null;
  for(const stage of STAGES){
   for(const role of ROLES){
    const observed=values[stage][role];
    if(!reason&&(duplicate[stage][role]!==0||observed.size!==sets[stage].size||
       [...sets[stage]].some(k=>!observed.has(k)))){
     reason='OVERLAP_VALUE_SOURCE_COVERAGE_REFUSED';
     firstMismatch={stage,role};
    }
   }
  }
  for(const role of ROLES){
   for(const k of overlap){
    const bridge=values.bridge[role],pad=values.pad[role];
    if(!bridge.has(k)||!pad.has(k))continue;
    compared[role]++;
    if(!Object.is(bridge.get(k),pad.get(k))&&!reason){
     reason='OVERLAP_SOURCE_ROLE_VALUE_CHANGED';
     firstMismatch={stage:'pad',role,coordinate:k};
    }
   }
  }
  const compares=Object.freeze({...compared});
  if(!reason&&ROLES.some(role=>compares[role]!==overlap.size)){
   reason='OVERLAP_VALUE_SOURCE_COVERAGE_REFUSED';
   firstMismatch={stage:'pad',role:ROLES.find(role=>compares[role]!==overlap.size)};
  }
  return Object.freeze({ok:reason===null,reason,
   firstMismatch:firstMismatch?Object.freeze(firstMismatch):null,
   independentSharedVoxels:overlap.size,
   overlapComparisonsByRole:compares,
   comparedSourceValues:ROLES.reduce((n,role)=>n+compares[role],0),
   readerRoleValuesConsistentAcrossStages:reason===null,
   callerSuppliedOriginalReaderIdentityUnverified:true,
   originalM7WorldTested:false,noWorldWrites:true,worldChanged:false});
 };
 return Object.freeze({enterPad,observe,audit});
}
