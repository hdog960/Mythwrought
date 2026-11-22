// Opt-in family allocation handshake. Never assigns numeric block IDs or registers assets.
// Producer source exports must be inspected externally; SHA strings are declarations only.
const SHA=/^[a-f0-9]{40}$/;
const RANGES=Object.freeze({scene24:[37,60],scene36:[61,84]});
export function auditNonblockFamilyAllocations({sources,registries,fxPolicy}={}){
 const errors=[], seenIds=new Map(),seenSlots=new Map();
 for(const owner of ['scene48','scene24','scene36']){
  if(!SHA.test(sources?.[owner]??''))errors.push('MISSING_SOURCE_SHA_'+owner);
  const families=registries?.[owner];
  if(!Array.isArray(families)||families.length===0){errors.push('MISSING_REGISTRY_'+owner);continue;}
  for(const f of families){
   const id=f?.sceneId,slot=f?.familyNumber,kind=f?.kind??'object';
   if(typeof id!=='string'||!new RegExp('^'+owner+':[a-z0-9-]+$').test(id))errors.push('INVALID_NAMESPACE');
   if(seenIds.has(id))errors.push('DUPLICATE_SCENE_ID');
   seenIds.set(id,owner);
   if(kind==='fx'){
    if(owner!=='scene48'||fxPolicy!=='explicit-ambient-or-parent-linked'||!['ambient','parent-linked'].includes(f?.removalMode))errors.push('INVALID_FX_REMOVAL');
    if(f?.removalMode==='parent-linked'&&typeof f.parentSceneId!=='string')errors.push('MISSING_FX_PARENT');
   }else if(kind!=='object'||f?.breakable!==true||f?.individualPick!==true||f?.tombstone!==true){
    errors.push('NONBREAKABLE_OBJECT');
   }
   // :48 owns the live source registry, including future FX H; never infer a numeric range.
   if(owner==='scene48'){
    if(slot!==undefined&&slot!==null)errors.push('SCENE48_NUMERIC_ALLOCATION_UNAUTHENTICATED');
   }else{
    const [lo,hi]=RANGES[owner];
    if(!Number.isSafeInteger(slot)||slot<lo||slot>hi)errors.push('OUT_OF_OWNER_RANGE');
    if(seenSlots.has(slot))errors.push('DUPLICATE_FAMILY_SLOT');
    seenSlots.set(slot,id);
   }
  }
 }
 return {ok:errors.length===0,status:errors.length?'NOT_VERIFIED':'DECLARED_REGISTRIES_ONLY_NOT_SOURCE_AUTHENTICATED_OR_LIVE',errors:[...new Set(errors)]};
}
