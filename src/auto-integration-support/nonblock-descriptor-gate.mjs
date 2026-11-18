// Opt-in descriptor gate. No runtime imports, spawning, save writes or production registration.
const integer=Number.isSafeInteger;
const box=b=>b&&Array.isArray(b.min)&&Array.isArray(b.max)&&b.min.length===3&&b.max.length===3&&b.min.every(Number.isFinite)&&b.max.every(Number.isFinite)&&b.min.every((v,i)=>v<b.max[i]);
export function auditDescriptorBatch({objects,expectedSeed,expectedSourceSha,observedSourceSha,tombstones=[]}={}){
 const errors=[];
 if(!/^[a-f0-9]{40}$/.test(expectedSourceSha??'')||expectedSourceSha!==observedSourceSha)errors.push('SOURCE_IDENTITY_NOT_AUTHENTICATED');
 if(!integer(expectedSeed))errors.push('INVALID_SEED');
 if(!Array.isArray(objects)||!objects.length)errors.push('NO_DESCRIPTORS');
 if(!Array.isArray(tombstones)||tombstones.some(k=>typeof k!=='string')||new Set(tombstones).size!==tombstones.length)errors.push('INVALID_TOMBSTONES');
 const keys=new Set();
 for(const o of Array.isArray(objects)?objects:[]){
  if(!o||o.contract!=='nonblock-object-v1'||typeof o.sceneId!=='string'||!/^scene(24|36|48):[a-z0-9-]+$/.test(o.sceneId)){errors.push('INVALID_DESCRIPTOR_CONTRACT');continue;}
  const canonical=integer(o.seed)&&Array.isArray(o.anchor)&&o.anchor.length===3&&o.anchor.every(integer)&&integer(o.variant)&&o.variant>=0&&o.variant<=3?'nb1:'+encodeURIComponent(o.sceneId)+':'+o.seed+':'+o.anchor.join(',')+':'+o.variant:null;
  if(!canonical||o.instanceKey!==canonical||o.seed!==expectedSeed)errors.push('IDENTITY_MISMATCH');
  if(keys.has(o.instanceKey))errors.push('DUPLICATE_INSTANCE');keys.add(o.instanceKey);
  if(o.breakIntent?.action!=='remove-object'||o.breakIntent?.targetKey!==o.instanceKey||o.breakIntent?.requiresOwner!==':00')errors.push('NOT_INDIVIDUALLY_BREAKABLE');
  if(o.persistence?.key!==o.instanceKey||o.persistence?.kind!=='schema1-external-tombstone-sidecar'||o.persistence?.defaultRespawn!=='never-until-explicit-reset')errors.push('PERSISTENCE_HANDOFF_MISSING');
  if(!Array.isArray(o.selectionAabbs)||!o.selectionAabbs.length||!o.selectionAabbs.every(box))errors.push('INVALID_PICK_AABB');
  const r=o.render,m=r?.mesh;
  if(!integer(r?.triangleCount)||r.triangleCount<1||r.triangleCount>100000||!integer(r.maxInstancesPerBatch)||r.maxInstancesPerBatch<1||r.maxInstancesPerBatch>512||r.instanced!==true||!(m?.positions instanceof Float32Array)||!(m?.materials instanceof Uint8Array)||m.positions.length!==r.triangleCount*9||m.materials.length!==r.triangleCount)errors.push('INVALID_RENDER_BUDGET_OR_MESH');
 }
 return {ok:errors.length===0,status:errors.length?'NOT_VERIFIED':'SOURCE_SHA_DECLARED_DESCRIPTOR_FIXTURE_ONLY_NOT_LIVE',errors:[...new Set(errors)]};
}
