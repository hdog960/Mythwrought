// Opt-in, fail-closed identity and tombstone proof. No production imports or writes.
export function verifyNonblockRemovalIsolation({descriptors, removedKey, tombstonesBefore=[], tombstonesAfter=[], restoredKeys=[], provenance}) {
 const errors=[];
 const sha=s=>typeof s==='string'&&/^[a-f0-9]{40}$/.test(s);
 for(const lane of ['scene48','environments24','fittings36','interaction00'])
  if(!sha(provenance?.[lane]))errors.push('UNAUTHENTICATED_'+lane);
 if(!Array.isArray(descriptors)||!descriptors.length)errors.push('NO_DESCRIPTORS');
 const keys=new Set(), owners=new Map();
 for(const d of Array.isArray(descriptors)?descriptors:[]){
  if(!d||typeof d!=='object'||typeof d.instanceKey!=='string'||!d.instanceKey.startsWith('nb1:')){errors.push('INVALID_IDENTITY');continue;}
  if(keys.has(d.instanceKey))errors.push('DUPLICATE_INSTANCE_KEY');
  keys.add(d.instanceKey);
  if(![':24',':36',':48'].includes(d.owner))errors.push('INVALID_OWNER');
  if(!d.sceneId||typeof d.sceneId!=='string')errors.push('INVALID_SCENE_ID');
  if(owners.has(d.sceneId)&&owners.get(d.sceneId)!==d.owner)errors.push('DOUBLE_FAMILY_OWNERSHIP');
  owners.set(d.sceneId,d.owner);
  if(d.breakIntent?.action!=='remove-object'||d.breakIntent?.targetKey!==d.instanceKey)errors.push('UNBREAKABLE_OR_WRONG_TARGET');
  if(!Array.isArray(d.selectionAabbs)||!d.selectionAabbs.length)errors.push('UNPICKABLE');
 }
 if(!keys.has(removedKey))errors.push('TARGET_NOT_PRESENT');
 const before=new Set(tombstonesBefore),after=new Set(tombstonesAfter),restored=new Set(restoredKeys);
 if(after.size!==tombstonesAfter.length)errors.push('DUPLICATE_TOMBSTONE');
 if(!after.has(removedKey))errors.push('REMOVAL_NOT_PERSISTED');
 for(const k of before)if(!after.has(k))errors.push('PREVIOUS_TOMBSTONE_LOST');
 for(const k of keys){
  if(k===removedKey&&restored.has(k))errors.push('REMOVED_OBJECT_RESPAWNED');
  if(k!==removedKey&&!before.has(k)&&!restored.has(k))errors.push('NEIGHBOR_DISAPPEARED');
 }
 for(const k of after)if(!keys.has(k)&&!before.has(k))errors.push('FOREIGN_TOMBSTONE');
 return Object.freeze({ok:errors.length===0,errors:[...new Set(errors)],status:errors.length?'REJECTED':'DECLARED_CALLBACK_FIXTURE_ONLY_NOT_SCHEMA1_PROOF'});
}
