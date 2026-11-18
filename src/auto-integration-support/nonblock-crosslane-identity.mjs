// :12 cross-lane identity admission. Opt-in only; no producer imports or runtime/save writes.
// Exact producer source bytes must be authenticated by the caller independently.
const namespaces=Object.freeze({':48':/^scene48:[a-z0-9-]+$/,':24':/^nonblock:[de]:[a-z0-9-]+$/,':36':/^scene36:[a-z0-9-]+$/});
const reject=(code,details={})=>Object.freeze({ok:false,live:false,breakabilityReady:false,code,...details});
const integer=Number.isSafeInteger;
const bounds=b=>Array.isArray(b?.min)&&Array.isArray(b?.max)&&b.min.length===3&&b.max.length===3&&b.min.every((n,i)=>Number.isFinite(n)&&Number.isFinite(b.max[i])&&n<b.max[i]);
export function auditCrossLaneIdentity({lanes,descriptors,seed,sourceAuthenticated=false}={}){
 if(!sourceAuthenticated)return reject('SOURCE_BYTES_NOT_AUTHENTICATED');
 if(!integer(seed)||!Array.isArray(lanes)||!Array.isArray(descriptors))return reject('INVALID_INPUT');
 const byLane=new Map();
 for(const lane of lanes){
  if(!namespaces[lane?.name]||byLane.has(lane.name)||!/^[a-f0-9]{40}$/.test(lane.headSha||'')||!/^[a-f0-9]{40}$/.test(lane.blobSha||'')||lane.byteVerified!==true)return reject('INVALID_SOURCE_ATTESTATION');
  byLane.set(lane.name,lane);
 }
 if(byLane.size!==3)return reject('MISSING_PRODUCER');
 const keys=new Set(),familyOwners=new Map();
 for(const entry of descriptors){
  const {lane,object:o}=entry||{};
  if(!byLane.has(lane)||!o||!namespaces[lane].test(o.sceneId||''))return reject('WRONG_FAMILY_NAMESPACE');
  if(o.contract!=='nonblock-object-v1'||o.seed!==seed||!Array.isArray(o.anchor)||o.anchor.length!==3||!o.anchor.every(integer)||!integer(o.variant)||o.variant<0||o.variant>3)return reject('INVALID_IDENTITY');
  const base='nb1:'+encodeURIComponent(o.sceneId)+':'+seed+':'+o.anchor.join(',')+':'+o.variant;
  // :36 currently adds :rN orientation; :48 canonical sidecar cannot parse it.
  if(lane===':36'&&o.instanceKey!==base)return reject('ORIENTATION_KEY_REQUIRES_00_AGREEMENT',{lane});
  if(o.instanceKey!==base)return reject('NONCANONICAL_KEY',{lane});
  if(keys.has(o.instanceKey))return reject('DUPLICATE_INSTANCE_KEY');
  keys.add(o.instanceKey);
  if(familyOwners.has(o.sceneId)&&familyOwners.get(o.sceneId)!==lane)return reject('DOUBLE_FAMILY_OWNERSHIP');
  familyOwners.set(o.sceneId,lane);
  if(o.breakIntent?.action!=='remove-object'||o.breakIntent?.targetKey!==base||o.breakIntent?.requiresOwner!==':00'||o.persistence?.key!==base||o.persistence?.defaultRespawn!=='never-until-explicit-reset')return reject('NOT_INDIVIDUALLY_REMOVABLE');
  if(!Array.isArray(o.selectionAabbs)||o.selectionAabbs.length===0||!o.selectionAabbs.every(bounds))return reject('INVALID_PICK_BOUNDS');
  const m=o.render?.mesh;
  if(!(m?.positions instanceof Float32Array)||!(m.materials instanceof Uint8Array)||!integer(m.triangleCount)||m.triangleCount<1||m.positions.length!==m.triangleCount*9||m.materials.length!==m.triangleCount||m.positions.some(n=>!Number.isFinite(n)))return reject('INVALID_TRIANGLE_MESH');
  if(o.render?.triangleCount!==m.triangleCount||o.render?.instanced!==true||!integer(o.render?.maxInstancesPerBatch)||o.render.maxInstancesPerBatch<1||o.render.maxInstancesPerBatch>512)return reject('INVALID_BATCH_BUDGET');
 }
 return Object.freeze({ok:true,live:false,breakabilityReady:false,code:'SOURCE_DECLARATION_ADMITTED_NOT_CORE_INTEGRATION',count:keys.size});
}
