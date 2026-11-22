/** :12 opt-in immutable transaction preflight; synthetic callbacks only. */
export function auditImmutableRemoval({objects, keyOf, snapshot, remove, restore, tombstonesOf}) {
 const errors=[];
 if(!Array.isArray(objects)||objects.length<2) errors.push('two-objects-required');
 for(const [name,fn] of Object.entries({keyOf,snapshot,remove,restore,tombstonesOf}))
  if(typeof fn!=='function') errors.push('missing-'+name);
 if(errors.length)return {ok:false,errors,live:false};
 try {
  const keys=objects.map(keyOf);
  if(keys.some(k=>typeof k!=='string'||!k.includes(':')))errors.push('invalid-key');
  if(new Set(keys).size!==keys.length)errors.push('duplicate-key');
  if(errors.length)return {ok:false,errors,live:false};
  const before=snapshot(objects), frozen=JSON.stringify(before);
  const after=remove(before,keys[0]);
  if(JSON.stringify(before)!==frozen)errors.push('snapshot-mutated');
  if(after===before)errors.push('snapshot-aliased');
  const tombstones=tombstonesOf(after);
  if(!Array.isArray(tombstones)||!tombstones.includes(keys[0]))errors.push('missing-tombstone');
  if(Array.isArray(tombstones)&&tombstones.includes(keys[1]))errors.push('neighbor-tombstoned');
  const active=restore(after);
  if(!Array.isArray(active))errors.push('invalid-restore');
  else {
   const restored=active.map(keyOf);
   if(restored.includes(keys[0]))errors.push('respawned');
   for(const k of keys.slice(1))if(!restored.includes(k))errors.push('neighbor-lost');
  }
 }catch{errors.push('callback-threw');}
 return {ok:errors.length===0,errors,live:false,fixtureOnly:true,breakabilityReady:false};
}
