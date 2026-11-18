// Opt-in, fail-closed source-callback deterministic identity and removal probe.
// Does not import or register producers. Caller-supplied SHA strings are declarations,
// not independently authenticated source identity.
const sha=s=>typeof s==='string'&&/^[a-f0-9]{40}$/.test(s);
const validBox=b=>b&&Array.isArray(b.min)&&Array.isArray(b.max)&&b.min.length===3&&b.max.length===3&&b.min.every(Number.isFinite)&&b.max.every(Number.isFinite)&&b.min.every((n,i)=>n<b.max[i]);
const identity=d=>d?.contract==='nonblock-object-v1'&&/^scene(24|36|48):[a-z0-9-]+$/.test(d.sceneId)&&Number.isSafeInteger(d.seed)&&Array.isArray(d.anchor)&&d.anchor.length===3&&d.anchor.every(Number.isSafeInteger)&&Number.isSafeInteger(d.variant)&&d.variant>=0&&d.variant<=3?'nb1:'+encodeURIComponent(d.sceneId)+':'+d.seed+':'+d.anchor.join(',')+':'+d.variant:null;
const fingerprint=d=>JSON.stringify([d.instanceKey,d.sceneId,d.seed,d.anchor,d.variant,d.selectionAabbs,d.breakIntent]);
export async function verifyNonblockDeterminism({provenance,source,seed,anchors,sceneIds,preexistingTombstones=[]}){
 const errors=[];
 for(const lane of ['scene48','environments24','fittings36','interaction00'])if(!sha(provenance?.[lane]))errors.push('MISSING_SOURCE_SHA_'+lane);
 for(const fn of ['describe','snapshot','restore','remove','visible'])if(typeof source?.[fn]!=='function')errors.push('MISSING_CALLBACK_'+fn);
 if(!Number.isSafeInteger(seed)||!Array.isArray(anchors)||!anchors.length||!anchors.every(a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger))||!Array.isArray(sceneIds)||!sceneIds.length||!sceneIds.every(s=>typeof s==='string'))errors.push('INVALID_FIXTURE');
 if(!Array.isArray(preexistingTombstones)||preexistingTombstones.some(k=>typeof k!=='string')||new Set(preexistingTombstones).size!==preexistingTombstones.length)errors.push('INVALID_EXISTING_TOMBSTONES');
 if(errors.length)return {ok:false,errors,status:'NOT_VERIFIED'};
 try{
  const inputs=sceneIds.flatMap(sceneId=>anchors.map(anchor=>({sceneId,seed,anchor:[...anchor]})));
  const collect=()=>Promise.all(inputs.map(i=>source.describe({...i,anchor:[...i.anchor]})));
  const first=await collect(),second=await collect();
  const keys=new Set();
  for(let i=0;i<first.length;i++){
   const d=first[i];
   if(!d||!second[i]||fingerprint(d)!==fingerprint(second[i]))errors.push('NONDETERMINISTIC_DESCRIPTOR');
   if(identity(d)!==d?.instanceKey||!identity(d))errors.push('NONCANONICAL_IDENTITY');
   if(keys.has(d?.instanceKey))errors.push('DUPLICATE_INSTANCE');
   keys.add(d?.instanceKey);
   if(d?.breakIntent?.action!=='remove-object'||d.breakIntent.targetKey!==d.instanceKey)errors.push('MISSING_INDIVIDUAL_BREAK');
   if(!Array.isArray(d?.selectionAabbs)||!d.selectionAabbs.length||!d.selectionAabbs.every(validBox))errors.push('INVALID_SELECTION_AABB');
  }
  if(errors.length)return {ok:false,errors:[...new Set(errors)],status:'NOT_VERIFIED'};
  const before=await source.snapshot();
  if(!Array.isArray(before?.tombstones)||preexistingTombstones.some(k=>!before.tombstones.includes(k)))errors.push('EXISTING_TOMBSTONES_MISSING');
  const target=first[0].instanceKey;
  await source.remove(first[0]);
  const after=await source.snapshot();
  if(!Array.isArray(after?.tombstones)||!after.tombstones.includes(target)||preexistingTombstones.some(k=>!after.tombstones.includes(k)))errors.push('TOMBSTONE_NOT_RETAINED');
  if(Array.isArray(after?.tombstones)){await source.restore(after);const visible=await source.visible(first);
   if(!Array.isArray(visible))errors.push('INVALID_VISIBLE_RESULT');
   else{const v=new Set(visible.map(d=>d.instanceKey));if(v.has(target))errors.push('REMOVED_OBJECT_RESPAWNED');for(const d of first.slice(1))if(!after.tombstones.includes(d.instanceKey)&&!v.has(d.instanceKey))errors.push('NEIGHBOR_LOST');}
  }
  const replay=await collect();if(first.some((d,i)=>fingerprint(d)!==fingerprint(replay[i])))errors.push('SOURCE_CHANGED_AFTER_REMOVAL');
 }catch(e){errors.push('CALLBACK_FAILURE:'+String(e?.message??e).slice(0,120));}
 return {ok:errors.length===0,errors:[...new Set(errors)],status:errors.length?'NOT_VERIFIED':'ISOLATED_CALLBACK_FIXTURE_ONLY_NOT_SCHEMA1_OR_BROWSER_PROOF'};
}
