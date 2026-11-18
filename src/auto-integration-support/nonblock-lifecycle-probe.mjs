// Opt-in lifecycle acceptance harness. Never modifies save core or registers objects.
// Callback provenance is external: passing does NOT certify a production :00 hook.
const fail=(reason)=>({ok:false,level:'NOT_VERIFIED',reason});
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const canonical=o=>'nb1:'+encodeURIComponent(o.sceneId)+':'+o.seed+':'+o.anchor.join(',')+':'+o.variant;
const validBox=b=>b&&Array.isArray(b.min)&&Array.isArray(b.max)&&b.min.length===3&&b.max.length===3&&b.min.every((n,i)=>Number.isFinite(n)&&Number.isFinite(b.max[i])&&n<b.max[i]);
export async function probeNonblockLifecycle({descriptor,seed,callbacks,sourceHeads,expectedNamespace}={}){
 if(!Number.isSafeInteger(seed)||!descriptor||!callbacks||!sourceHeads||typeof expectedNamespace!=='string')return fail('missing source contract');
 if(!Object.values(sourceHeads).every(s=>typeof s==='string'&&/^[a-f0-9]{40}$/.test(s))||Object.keys(sourceHeads).length!==2)return fail('unbound source heads');
 const o=descriptor;
 if(o.contract!=='nonblock-object-v1'||typeof o.sceneId!=='string'||!o.sceneId.startsWith(expectedNamespace+':')||!Number.isSafeInteger(o.seed)||o.seed!==seed||!Array.isArray(o.anchor)||o.anchor.length!==3||!o.anchor.every(Number.isSafeInteger)||!Number.isSafeInteger(o.variant)||o.variant<0||o.variant>3||o.instanceKey!==canonical(o))return fail('noncanonical identity');
 if(!Array.isArray(o.selectionAabbs)||!o.selectionAabbs.length||!o.selectionAabbs.every(validBox)||o.breakIntent?.action!=='remove-object'||o.breakIntent.targetKey!==o.instanceKey||o.breakIntent.requiresOwner!==':00'||o.persistence?.key!==o.instanceKey||o.persistence?.kind!=='schema1-external-tombstone-sidecar')return fail('unbreakable or unpickable object');
 const names=['pick','remove','snapshot','restore','visible','reload'];if(names.some(n=>typeof callbacks[n]!=='function'))return fail('missing lifecycle callback');
 const before=JSON.stringify(o);
 try{
  const picked=await callbacks.pick(o);
  if(picked!==o.instanceKey)return fail('pick did not select exact object');
  const removed=await callbacks.remove(o);
  if(removed?.instanceKey!==o.instanceKey||removed?.removed!==true)return fail('remove did not acknowledge exact object');
  if(await callbacks.visible(o)!==false)return fail('object visible after removal');
  const snapshot=await callbacks.snapshot();
  if(snapshot?.seed!==seed||!Array.isArray(snapshot.tombstones)||snapshot.tombstones.filter(k=>k===o.instanceKey).length!==1)return fail('missing or duplicate tombstone');
  const serialized=JSON.parse(JSON.stringify(snapshot));
  await callbacks.reload();
  await callbacks.restore(serialized);
  if(await callbacks.visible(o)!==false)return fail('object respawned after reload');
  if(!same(o,JSON.parse(before)))return fail('descriptor mutated');
  return {ok:true,level:'ISOLATED_CALLBACK_FIXTURE_ONLY',instanceKey:o.instanceKey,sourceHeads:{...sourceHeads}};
 }catch(e){return fail('lifecycle callback failed: '+String(e?.message||e));}
}
