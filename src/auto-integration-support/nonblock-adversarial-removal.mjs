// :12 opt-in adversarial source/identity acceptance. No producer imports or production writes.
// Source authentication MUST be performed by the runner against Git object bytes.
const fail=(code)=>({ok:false,live:false,breakabilityReady:false,code});
const validKey=(o)=>o && /^scene(24|36|48):[a-z0-9-]+$/.test(o.sceneId||'') &&
 Number.isSafeInteger(o.seed) && Array.isArray(o.anchor) && o.anchor.length===3 &&
 o.anchor.every(Number.isSafeInteger) && Number.isSafeInteger(o.variant) &&
 o.variant>=0 && o.variant<=3 &&
 o.instanceKey==='nb1:'+encodeURIComponent(o.sceneId)+':'+o.seed+':'+o.anchor.join(',')+':'+o.variant;
const validBox=b=>b&&Array.isArray(b.min)&&Array.isArray(b.max)&&b.min.length===3&&b.max.length===3&&
 b.min.every((v,i)=>Number.isFinite(v)&&Number.isFinite(b.max[i])&&v<b.max[i]);
export async function auditAdversarialRemoval({producer,provenance,seed=17,descriptors}={}){
 if(!provenance?.verifiedByRunner||!Array.isArray(provenance.sources)||provenance.sources.length!==3||
   ![':24',':36',':48'].every(l=>provenance.sources.some(s=>s.lane===l&&/^[a-f0-9]{40}$/.test(s.headSha||'')&&/^[a-f0-9]{40}$/.test(s.blobSha||'')&&s.byteVerified===true)))return fail('UNAUTHENTICATED_SOURCE_BYTES');
 if(!Number.isSafeInteger(seed)||!Array.isArray(descriptors)||descriptors.length<2)return fail('INVALID_FIXTURE');
 if(typeof producer?.createNonblockSidecar!=='function'||typeof producer?.pickNonblockRay!=='function')return fail('MISSING_PRODUCER_EXPORT');
 const keys=new Set();
 for(const o of descriptors){
  if(!validKey(o)||o.seed!==seed||o.contract!=='nonblock-object-v1'||o.breakIntent?.targetKey!==o.instanceKey||
    o.breakIntent?.requiresOwner!==':00'||o.breakIntent?.action!=='remove-object'||
    o.persistence?.key!==o.instanceKey||o.persistence?.defaultRespawn!=='never-until-explicit-reset'||
    !Array.isArray(o.selectionAabbs)||!o.selectionAabbs.length||!o.selectionAabbs.every(validBox))return fail('INVALID_OBJECT_CONTRACT');
  if(keys.has(o.instanceKey))return fail('DUPLICATE_INSTANCE_KEY');
  keys.add(o.instanceKey);
 }
 try{
  const sidecar=producer.createNonblockSidecar(seed);
  const first=descriptors[0],neighbor=descriptors[1];
  const box=first.selectionAabbs[0];
  const origin=[(box.min[0]+box.max[0])/2,(box.min[1]+box.max[1])/2,box.min[2]-0.01];
  const picked=producer.pickNonblockRay([first],origin,[0,0,1],6);
  if(picked?.instanceKey!==first.instanceKey)return fail('PICK_FAILED');
  if(sidecar.visible(descriptors).length!==descriptors.length)return fail('INITIAL_VISIBILITY');
  sidecar.breakObject(first);
  const after=sidecar.visible(descriptors);
  if(after.some(o=>o.instanceKey===first.instanceKey)||!after.some(o=>o.instanceKey===neighbor.instanceKey))return fail('NEIGHBOR_OR_REMOVAL_FAILED');
  const snap=JSON.parse(JSON.stringify(sidecar.snapshot()));
  if(!snap.tombstones?.includes(first.instanceKey))return fail('TOMBSTONE_MISSING');
  const restored=producer.createNonblockSidecar(seed);
  restored.restore(snap);
  if(restored.visible(descriptors).some(o=>o.instanceKey===first.instanceKey)||!restored.visible(descriptors).some(o=>o.instanceKey===neighbor.instanceKey))return fail('RELOAD_FAILED');
  let crossSeedRejected=false;
  try{producer.createNonblockSidecar(seed+1).restore(snap);}catch{crossSeedRejected=true;}
  if(!crossSeedRejected)return fail('CROSS_SEED_ACCEPTED');
  return {ok:true,live:false,breakabilityReady:false,code:'AUTHENTICATED_DECLARATION_FIXTURE_ONLY_NOT_CORE_SAVE'};
 }catch(e){return fail('ADAPTER_EXCEPTION:'+String(e?.message||e));}
}
