// Opt-in cross-producer identity and lifecycle manifest preflight. No runtime imports.
const SHA=/^[0-9a-f]{40}$/;
// :48 exports namespaced family IDs, not numeric slots. Numeric allocations belong only to :24/:36.
const OWNERS=Object.freeze({scene24:[37,60],scene36:[61,84]});
const box=b=>b&&Array.isArray(b.min)&&Array.isArray(b.max)&&b.min.length===3&&b.max.length===3&&b.min.every(Number.isFinite)&&b.max.every(Number.isFinite)&&b.min.every((v,i)=>v<b.max[i]);
export function auditNonblockManifest({sources,entries,existingTombstones=[]}={}){
 const errors=[];
 for(const lane of ['scene48','scene24','scene36','interaction00'])if(!SHA.test(sources?.[lane]??''))errors.push('UNAUTHENTICATED_'+lane);
 if(!Array.isArray(entries)||!entries.length)return {ok:false,status:'NOT_VERIFIED',errors:[...errors,'NO_SOURCE_ENTRIES']};
 if(!Array.isArray(existingTombstones)||existingTombstones.some(k=>typeof k!=='string')||new Set(existingTombstones).size!==existingTombstones.length)errors.push('INVALID_TOMBSTONES');
 const keys=new Set(),families=new Map(),familyIds=new Map();
 for(const e of entries){
  const owner=e?.owner,range=OWNERS[owner],number=e?.familyNumber;
  if(owner==='scene48'){
   if(number!==undefined&&number!==null)errors.push('SCENE48_NUMERIC_ALLOCATION_UNAUTHENTICATED');
  }else if(!range||!Number.isSafeInteger(number)||number<range[0]||number>range[1])errors.push('FAMILY_OWNER_MISMATCH');
  if(typeof e?.sceneId!=='string'||!e.sceneId.startsWith(owner+':')||!/^(scene24|scene36|scene48):[a-z0-9-]+$/.test(e.sceneId))errors.push('INVALID_SCENE_NAMESPACE');
  if(owner!=='scene48'&&Number.isSafeInteger(number)){
   if(families.has(number)&&families.get(number)!==e.sceneId)errors.push('DUPLICATE_FAMILY_NUMBER');
   else families.set(number,e.sceneId);
  }
  if(familyIds.has(e.sceneId)&&familyIds.get(e.sceneId)!==owner)errors.push('DUPLICATE_FAMILY_OWNER');
  else familyIds.set(e.sceneId,owner);
  const canonical=Number.isSafeInteger(e?.seed)&&Array.isArray(e.anchor)&&e.anchor.length===3&&e.anchor.every(Number.isSafeInteger)&&Number.isSafeInteger(e.variant)&&e.variant>=0&&e.variant<=3
   ?'nb1:'+encodeURIComponent(e.sceneId??'')+':'+e.seed+':'+e.anchor.join(',')+':'+e.variant:null;
  if(!canonical||e.instanceKey!==canonical)errors.push('NONCANONICAL_INSTANCE');
  if(keys.has(e.instanceKey))errors.push('DUPLICATE_INSTANCE');
  keys.add(e.instanceKey);
  if(e?.breakIntent?.action!=='remove-object'||e.breakIntent.targetKey!==e.instanceKey||e.breakIntent.requiresOwner!==':00')errors.push('UNBREAKABLE_OBJECT');
  if(!Array.isArray(e?.selectionAabbs)||!e.selectionAabbs.length||!e.selectionAabbs.every(box))errors.push('INVALID_PICK_BOUNDS');
  if(!Number.isSafeInteger(e?.triangleCount)||e.triangleCount<1||e.triangleCount>100000||!Number.isSafeInteger(e?.maxInstancesPerBatch)||e.maxInstancesPerBatch<1||e.maxInstancesPerBatch>512)errors.push('RENDER_BUDGET_UNDECLARED');
 }
 return {ok:errors.length===0,status:errors.length?'NOT_VERIFIED':'DECLARED_MANIFEST_ONLY_NOT_SOURCE_AUTHENTICATED_OR_LIVE',errors:[...new Set(errors)]};
}
