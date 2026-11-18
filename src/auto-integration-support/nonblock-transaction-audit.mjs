// Opt-in :12 removal transaction auditor; injected adapters only, never production hooks.
const safe = Number.isSafeInteger;
const canonical = o => o && typeof o.sceneId === 'string' && /^scene(24|36|48):[a-z0-9-]+$/.test(o.sceneId) && safe(o.seed) && Array.isArray(o.anchor) && o.anchor.length===3 && o.anchor.every(safe) && safe(o.variant) && o.variant>=0 && o.variant<=3 && o.instanceKey === 'nb1:'+encodeURIComponent(o.sceneId)+':'+o.seed+':'+o.anchor.join(',')+':'+o.variant;
const clone = v => JSON.parse(JSON.stringify(v));
export async function auditRemovalTransaction({objects,seed,callbacks,sourceProof}={}) {
 const errors=[];
 if (!safe(seed)) errors.push('INVALID_SEED');
 if (!sourceProof || sourceProof.authenticated !== true || ![':24',':36',':48'].every(k=>typeof sourceProof[k]==='string' && /^[a-f0-9]{40}$/.test(sourceProof[k]))) errors.push('UNAUTHENTICATED_PRODUCERS');
 if (!Array.isArray(objects)||objects.length<2) errors.push('NEED_NEIGHBOR_WITNESS');
 const keys=new Set();
 for(const o of Array.isArray(objects)?objects:[]) {
  if(!canonical(o)||o.seed!==seed||o.breakIntent?.targetKey!==o.instanceKey||o.breakIntent?.requiresOwner!==':00'||o.breakIntent?.action!=='remove-object'||o.persistence?.key!==o.instanceKey) errors.push('INVALID_INDIVIDUAL_OBJECT');
  if(keys.has(o?.instanceKey))errors.push('DUPLICATE_KEY');keys.add(o?.instanceKey);
 }
 const required=['pick','breakObject','snapshot','restore','visible'];
 if(required.some(k=>typeof callbacks?.[k]!=='function'))errors.push('MISSING_REAL_CALLBACK_ADAPTER');
 if(errors.length)return {ok:false,status:'NOT_VERIFIED',errors:[...new Set(errors)],live:false};
 const target=objects[0],neighbor=objects[1];
 try {
  const before=await callbacks.visible(objects);
  if(!Array.isArray(before)||before.length!==objects.length)throw Error('PREEXISTING_VISIBILITY');
  const picked=await callbacks.pick(target,objects);
  if(picked?.instanceKey!==target.instanceKey)throw Error('PICK_WRONG_TARGET');
  await callbacks.breakObject(target);
  const after=await callbacks.visible(objects);
  if(!Array.isArray(after)||after.some(o=>o.instanceKey===target.instanceKey)||!after.some(o=>o.instanceKey===neighbor.instanceKey))throw Error('REMOVAL_ISOLATION');
  const snapshot=clone(await callbacks.snapshot());
  await callbacks.restore(snapshot);
  const reloaded=await callbacks.visible(objects);
  if(!Array.isArray(reloaded)||reloaded.some(o=>o.instanceKey===target.instanceKey)||!reloaded.some(o=>o.instanceKey===neighbor.instanceKey))throw Error('TOMBSTONE_RELOAD');
  return {ok:true,status:'INJECTED_CALLBACK_FIXTURE_ONLY_NOT_LIVE',errors:[],live:false};
 }catch(e){return {ok:false,status:'NOT_VERIFIED',errors:[String(e?.message||e)],live:false};}
}
