// Candidate-only, no producer imports or world/save writes.
// Source-exact interface differences observed on :48 #226, :24 #247, :36 #249.
// Caller must independently authenticate commit/blob SHA before accepting input.
const fail=(code,detail)=>({code,detail});
const isBox=b=>b&&Array.isArray(b.min)&&Array.isArray(b.max)&&b.min.length===3&&b.max.length===3&&b.min.every((n,i)=>Number.isFinite(n)&&Number.isFinite(b.max[i])&&n<b.max[i]);
const key48=o=>'nb1:'+encodeURIComponent(o.sceneId)+':'+o.seed+':'+o.anchor.join(',')+':'+o.variant;
export function auditNonblockProducerHandshake({producer,descriptor,expectedHead,actualHead,sourceBlob,expectedBlob}={}){
 const issues=[];
 if(![':24',':36',':48'].includes(producer))issues.push(fail('UNKNOWN_PRODUCER',producer));
 if(![expectedHead,actualHead,sourceBlob,expectedBlob].every(s=>typeof s==='string'&&/^[a-f0-9]{40}$/.test(s))||expectedHead!==actualHead||sourceBlob!==expectedBlob)issues.push(fail('SOURCE_UNAUTHENTICATED','Exact commit and source blob must match'));
 if(!descriptor||typeof descriptor!=='object')return {ok:false,level:'NOT_VERIFIED',issues:[...issues,fail('MISSING_DESCRIPTOR','No source descriptor')]};
 const o=descriptor;
 if(o.contract!=='nonblock-object-v1')issues.push(fail('CONTRACT_VERSION',o.contract));
 const prefix={':24':'nonblock:',':36':'scene36:',':48':'scene48:'}[producer];
 if(prefix&&!o.sceneId?.startsWith(prefix))issues.push(fail('NAMESPACE',o.sceneId));
 if(!Number.isSafeInteger(o.seed)||!Array.isArray(o.anchor)||o.anchor.length!==3||!o.anchor.every(Number.isSafeInteger)||!Number.isSafeInteger(o.variant)||o.variant<0||o.variant>3)issues.push(fail('IDENTITY_FIELDS','Seed, anchor, variant must match v1'));
 else if(o.instanceKey!==key48(o))issues.push(fail('CANONICAL_KEY',o.instanceKey));
 if(!Array.isArray(o.selectionAabbs)||!o.selectionAabbs.length||!o.selectionAabbs.every(isBox))issues.push(fail('PICK_AABB','Missing world-space v1 selection AABBs'));
 if(o.breakIntent?.action!=='remove-object'||o.breakIntent?.targetKey!==o.instanceKey||o.breakIntent?.requiresOwner!==':00')issues.push(fail('BREAK_INTENT','Must target this instance via :00'));
 if(o.persistence?.kind!=='schema1-external-tombstone-sidecar'||o.persistence?.key!==o.instanceKey)issues.push(fail('TOMBSTONE','Must use canonical instance key'));
 const mesh=o.render?.mesh;
 if(!(mesh?.positions instanceof Float32Array)||!(mesh?.materials instanceof Uint8Array)||!Number.isSafeInteger(mesh?.triangleCount)||mesh.triangleCount<1||mesh.positions.length!==mesh.triangleCount*9||mesh.materials.length!==mesh.triangleCount||!Array.from(mesh.positions).every(Number.isFinite))issues.push(fail('MESH_ABI','Typed triangles/materials required'));
 if(o.render?.instanced!==true||!Number.isSafeInteger(o.render?.maxInstancesPerBatch)||o.render.maxInstancesPerBatch<1||o.render.maxInstancesPerBatch>512)issues.push(fail('BATCH_BUDGET','Instancing and <=512 batch cap required'));
 return {ok:issues.length===0,level:issues.length?'NOT_VERIFIED':'DESCRIPTOR_SHAPE_ONLY_NOT_LIVE',issues,producer,sourceHead:actualHead};
}
