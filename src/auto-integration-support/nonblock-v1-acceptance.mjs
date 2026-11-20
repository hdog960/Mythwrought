// Opt-in v1 boundary; deliberately does not import unmerged producer or save code.
export const CONTRACT = 'nonblock-object-v1';
const fail = (reason) => ({ok:false,reason,level:'NOT_VERIFIED'});
const finite3 = a => Array.isArray(a) && a.length===3 && a.every(Number.isFinite);
const integer3 = a => finite3(a) && a.every(Number.isSafeInteger);
const box = b => b && finite3(b.min) && finite3(b.max) && b.min.every((v,i)=>v<b.max[i]);
const overlaps = (a,b) => a.min.every((v,i)=>v<b.max[i] && b.min[i]<a.max[i]);
export function validateNonblockCandidates({objects,seed,registeredBlockIds=[],removedKeys=[],maxTriangles=50000,maxInstancesPerBatch=512}={}) {
 if (!Number.isSafeInteger(seed) || !Array.isArray(objects) || !Array.isArray(removedKeys) || !Array.isArray(registeredBlockIds)) return fail('invalid input');
 const seen=new Set(), ids=new Set(), removed=new Set(removedKeys);
 if (removed.size!==removedKeys.length || removedKeys.some(k=>typeof k!=='string')) return fail('invalid tombstones');
 let triangles=0;
 for(const o of objects) {
  if (!o || o.contract!==CONTRACT || typeof o.sceneId!=='string' || !/^[a-z][a-z0-9]*:[a-z0-9-]+$/.test(o.sceneId) || typeof o.instanceKey!=='string' || !o.instanceKey.startsWith('nb1:'+encodeURIComponent(o.sceneId)+':')) return fail('invalid identity');
  if (registeredBlockIds.includes(o.sceneId) || /^\\d+$/.test(o.sceneId)) return fail('physical block ID collision');
  if (o.seed!==seed || !integer3(o.anchor) || !Number.isSafeInteger(o.variant) || o.variant<0 || o.variant>3) return fail('invalid seed/anchor/variant');
  if(o.instanceKey!== 'nb1:'+encodeURIComponent(o.sceneId)+':'+seed+':'+o.anchor.join(',')+':'+o.variant || seen.has(o.instanceKey)) return fail('noncanonical or duplicate instance key');
  seen.add(o.instanceKey); ids.add(o.sceneId);
  if(!Array.isArray(o.selectionAabbs) || o.selectionAabbs.length===0 || !o.selectionAabbs.every(box)) return fail('missing pick AABB');
  if(o.breakIntent?.action!=='remove-object' || o.breakIntent.targetKey!==o.instanceKey || o.breakIntent.requiresOwner!==':00') return fail('unbreakable candidate');
  if(o.persistence?.kind!=='schema1-external-tombstone-sidecar' || o.persistence.key!==o.instanceKey || o.persistence.defaultRespawn!=='never-until-explicit-reset') return fail('missing removal intent');
  if(!o.render || !Number.isSafeInteger(o.render.triangleCount) || o.render.triangleCount<1 || o.render.triangleCount>maxTriangles || o.render.maxInstancesPerBatch>maxInstancesPerBatch || o.render.maxInstancesPerBatch<1 || !o.render.instanced) return fail('render budget/metadata');
  triangles+=o.render.triangleCount;
  if(!['none','pass-through','solid','trigger'].includes(o.collisionIntent)) return fail('collision intent unknown');
 }
 if(removedKeys.some(k=>!seen.has(k))) return fail('tombstone has no matching candidate in supplied snapshot');
 return {ok:true,level:'DESCRIPTOR_FIXTURE_ONLY',families:ids.size,instances:seen.size,visible:objects.filter(o=>!removed.has(o.instanceKey)).length,triangles};
}
export function verifyRemovalRoundTrip({objects,seed,sidecar,pick,origin,direction}={}) {
 const initial=validateNonblockCandidates({objects,seed});
 if(!initial.ok) return initial;
 if(typeof pick!=='function' || !sidecar || typeof sidecar.breakObject!=='function' || typeof sidecar.snapshot!=='function' || typeof sidecar.restore!=='function' || typeof sidecar.visible!=='function') return fail('missing external pick/removal callbacks');
 if(!finite3(origin)||!finite3(direction)) return fail('invalid ray');
 const hit=pick(objects,origin,direction);
 if(!hit || !objects.some(o=>o.instanceKey===hit.instanceKey)) return fail('no source pick hit');
 const target=objects.find(o=>o.instanceKey===hit.instanceKey);
 const event=sidecar.breakObject(target);
 if(event?.instanceKey!==target.instanceKey || event.removed!==true) return fail('break callback mismatch');
 const snapshot=sidecar.snapshot();
 if(snapshot?.seed!==seed || snapshot.contract!==CONTRACT || !snapshot.tombstones?.includes(target.instanceKey)) return fail('missing tombstone');
 sidecar.restore(snapshot);
 if(sidecar.visible(objects).some(o=>o.instanceKey===target.instanceKey)) return fail('removed object respawned');
 return {ok:true,level:'EXTERNAL_CALLBACK_FIXTURE_ONLY',instanceKey:target.instanceKey};
}
