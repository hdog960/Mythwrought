// Opt-in contract probe. Never imports producer branches or touches production saves.
const SHA=/^[a-f0-9]{40}$/;
const OWNERS=Object.freeze({scene48:'src/nonblock-scene48/',environments24:'src/nonblock-environments24/',fittings36:'src/nonblock-fittings36/'});
const finiteBox=b=>b&&Array.isArray(b.min)&&Array.isArray(b.max)&&b.min.length===3&&b.max.length===3&&b.min.every((v,i)=>Number.isFinite(v)&&Number.isFinite(b.max[i])&&v<b.max[i]);
export function probeNonblockHandoff({sources,instances,seed,callbacks,saveWitness}={}){
 const errors=[], seen=new Set(), anchors=new Map();
 for(const [owner,prefix] of Object.entries(OWNERS)){
  const s=sources?.[owner];
  if(!s||!SHA.test(s.head||'')||!Array.isArray(s.files)||!s.files.length||s.files.some(f=>!f.path?.startsWith(prefix)||f.path.includes('..')||!SHA.test(f.blobSha||'')||f.verifiedAtHead!==true)) errors.push(owner+': unauthenticated source');
 }
 if(!Number.isSafeInteger(seed))errors.push('invalid world seed');
 if(!Array.isArray(instances)||!instances.length)errors.push('no instances');
 for(const o of instances||[]){
  if(!OWNERS[o.owner]||typeof o.instanceKey!=='string'||!o.instanceKey||seen.has(o.instanceKey))errors.push('invalid/duplicate instance identity');
  seen.add(o.instanceKey);
  if(o.seed!==seed||!Array.isArray(o.anchor)||o.anchor.length!==3||!o.anchor.every(Number.isSafeInteger))errors.push('seed/anchor mismatch');
  if(o.numericBlockId!==undefined||o.autoSpawn===true||o.renderOnly===true)errors.push('forbidden block/spawn/render-only object');
  if(o.breakIntent?.action!=='remove-object'||o.breakIntent?.targetKey!==o.instanceKey||o.breakIntent?.requiresOwner!==':00')errors.push('missing individual break intent');
  if(!Array.isArray(o.selectionAabbs)||!o.selectionAabbs.length||!o.selectionAabbs.every(finiteBox))errors.push('invalid pick bounds');
  if(o.collisionIntent===undefined||o.attachment===undefined)errors.push('missing collision/attachment intent');
  if(!Number.isSafeInteger(o.render?.triangleCount)||o.render.triangleCount<=0||o.render.maxInstancesPerBatch>512||o.render.maxInstancesPerBatch<1||!o.render.instanced)errors.push('render budget');
  if(o.protectedEdit===true)errors.push('protected world edit');
  if(o.kind==='fx'&&!o.ambient&&!(o.parentKey&&o.parentRemovalAware))errors.push('unlinked FX');
  const anchorKey=JSON.stringify([o.seed,o.anchor]);
  const prior=anchors.get(anchorKey)||[];
  if(prior.some(p=>o.allowOverlap!==true&&p.allowOverlap!==true&&o.attachment===p.attachment&&o.occupancyGroup===p.occupancyGroup))errors.push('overlapping anchor placement');
  prior.push(o);anchors.set(anchorKey,prior);
 }
 if(!callbacks||['pick','remove','snapshot','restore','visible'].some(k=>typeof callbacks[k]!=='function'))errors.push('missing real interaction callback');
 if(saveWitness?.source!==':00-real-schema1'||saveWitness?.backupPreserved!==true||saveWitness?.oldSaveCompatible!==true)errors.push('schema-1 persistence not authenticated');
 return Object.freeze({ok:errors.length===0,live:false,errors});
}
// Even when the static gate passes, execute actual injected callbacks before acceptance.
// No synthetic callback is ever represented as a production bridge.
export async function witnessIndividualRemoval({probe,objects,callbacks,targetKey,neighborKey}={}){
 if(!probe?.ok)return {ok:false,live:false,errors:['preflight failed']};
 const errors=[];
 try{
  if(targetKey===neighborKey||!objects.some(o=>o.instanceKey===targetKey)||!objects.some(o=>o.instanceKey===neighborKey))throw Error('invalid target/neighbor');
  const picked=await callbacks.pick(targetKey);
  if(picked?.instanceKey!==targetKey)throw Error('wrong pick');
  const removed=await callbacks.remove(targetKey);
  if(removed?.instanceKey!==targetKey||removed.removed!==true)throw Error('wrong removal');
  const snapshot=await callbacks.snapshot();
  await callbacks.restore(structuredClone(snapshot));
  const visible=await callbacks.visible(objects);
  if(!Array.isArray(visible)||visible.some(o=>o.instanceKey===targetKey)||!visible.some(o=>o.instanceKey===neighborKey))throw Error('tombstone/neighbor failure');
 }catch(e){errors.push(String(e?.message||e));}
 return {ok:errors.length===0,live:false,errors};
}
