// :12 opt-in sidecar bridge witness. Never imports unmerged producers or touches save core.
// The caller must inject real :48 exports and a verified source provenance record.
const safe=Number.isSafeInteger;
const fail=(code)=>({ok:false,live:false,sourceReady:false,breakabilityReady:false,code});
export async function auditProducerSidecar({producer,provenance,seed=17}={}){
 if(!provenance||provenance.verifiedByRunner!==true||!(/^[a-f0-9]{40}$/.test(provenance.headSha||''))||!(/^[a-f0-9]{40}$/.test(provenance.blobSha||''))||provenance.path!=='src/nonblock-scene48/nonblock-object-v1.mjs')return fail('SOURCE_NOT_AUTHENTICATED');
 const required=['describeNonblockObject','nonblockInstanceKey','createNonblockSidecar','pickNonblockRay'];
 if(required.some(k=>typeof producer?.[k]!=='function')||producer?.NONBLOCK_OBJECT_VERSION!=='nonblock-object-v1')return fail('EXPORT_ABI_MISMATCH');
 if(!safe(seed))return fail('INVALID_SEED');
 try{
  const ids=['scene48:low-grass','scene48:short-fern'];
  const anchors=[[0,0,0],[4,0,0]];
  const objects=ids.map((sceneId,i)=>producer.describeNonblockObject({sceneId,seed,anchor:anchors[i]}));
  for(let i=0;i<objects.length;i++){
   const o=objects[i];
   const key=producer.nonblockInstanceKey({sceneId:o.sceneId,seed,anchor:o.anchor,variant:o.variant});
   if(o.contract!=='nonblock-object-v1'||o.instanceKey!==key||o.breakIntent?.targetKey!==key||o.persistence?.key!==key||!Array.isArray(o.selectionAabbs)||!o.selectionAabbs.length) return fail('DESCRIPTOR_ABI_MISMATCH');
  }
  if(objects[0].instanceKey===objects[1].instanceKey)return fail('DUPLICATE_IDENTITY');
  const sidecar=producer.createNonblockSidecar(seed);
  const before=sidecar.visible(objects);
  if(before.length!==2)return fail('INITIAL_VISIBILITY');
  const target=objects[0],neighbor=objects[1];
  const rayBox=target.selectionAabbs[0];
  const origin=[(rayBox.min[0]+rayBox.max[0])/2,(rayBox.min[1]+rayBox.max[1])/2,rayBox.min[2]-0.1];
  const picked=producer.pickNonblockRay([target],origin,[0,0,1],6);
  if(picked?.instanceKey!==target.instanceKey)return fail('PICK_MISMATCH');
  sidecar.breakObject(target);
  if(sidecar.visible(objects).map(o=>o.instanceKey).join(',')!==neighbor.instanceKey)return fail('BREAK_ISOLATION');
  const snapshot=JSON.parse(JSON.stringify(sidecar.snapshot()));
  if(!snapshot.tombstones?.includes(target.instanceKey))return fail('MISSING_TOMBSTONE');
  const restored=producer.createNonblockSidecar(seed);
  restored.restore(snapshot);
  if(restored.visible(objects).map(o=>o.instanceKey).join(',')!==neighbor.instanceKey)return fail('RELOAD_RESPAWN');
  let rejected=false;
  try{producer.createNonblockSidecar(seed+1).restore(snapshot);}catch{rejected=true;}
  if(!rejected)return fail('CROSS_SEED_LEAK');
  return {ok:true,live:false,sourceReady:true,breakabilityReady:false,code:'REAL_PRODUCER_SIDECAR_FIXTURE_ONLY',instanceKeys:objects.map(o=>o.instanceKey)};
 }catch(e){return fail('PRODUCER_EXCEPTION:'+String(e?.message||e));}
}
