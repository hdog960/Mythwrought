// MYTHWROUGHT - isolated source-compatible sky renderer ownership bridge.
// The original main.mjs owns a `const chunks = new Map()` and the native
// depth section/queue. A sky producer MUST NOT silently replace that Map,
// shrink its 25 surface slots, or delete its 27/34 underground buffers.
// No production entrypoint imports this file; original renderer must explicitly
// hand over its native desired-key set and grant an epoch-fenced sky budget.
import {depthMeshKey,sectionBounds} from '../depth.mjs';
import {uploadChunkBuffer} from '../gpu-recovery.mjs';
import {skyIslandBodyRegions,skyIslandMeshKey,SKY_ISLAND_LIGHTING_POLICY,
  SKY_ISLAND_MAX_VIEW_RADIUS_CHUNKS} from './sky-runtime-adapter.mjs';
import {stageSkyIslandGpuTransaction} from './sky-gpu-transaction.mjs';

export const SKY_NATIVE_SHARED_LIMIT=25;
export const SKY_NATIVE_MAX_UPLOADS=2;
export const SKY_NATIVE_MAX_BATCH_BYTES=2*1024*1024;
const safe=Number.isSafeInteger;
const valid=n=>typeof n==='number'&&Number.isFinite(n);
const fail=s=>{throw new TypeError('Sky native owner: '+s);};
const sameKeys=(a,b)=>a.length===b.length&&new Set(a).size===a.length&&
  a.every(k=>b.includes(k));
const unique=a=>new Set(a).size===a.length;
const toRows=rows=>Object.freeze(rows.map(row=>Object.freeze({...row})));
const request=reason=>Object.freeze({mode:'blocked',reason,readyForStage:false,
  canAdmitFlight:false,desiredKeys:Object.freeze([]),skyJobs:Object.freeze([])});
const keyRegex=/^-?(?:0|[1-9]\d*),-?(?:0|[1-9]\d*)(?:,-[1-9]\d*)?$/;
export function inspectNativeDepthKey(key){
  if(typeof key!=='string'||!keyRegex.test(key))fail('invalid native renderer chunk key');
  const parts=key.split(',').map(Number);
  if(!parts.every(safe))fail('unsafe native chunk coordinates');
  const [cx,cz,section=0]=parts;
  sectionBounds(section);
  if(depthMeshKey(cx,cz,section)!==key)fail('noncanonical native depth key');
  return Object.freeze({cx,cz,section,key});
}
// grant comes from the ORIGINAL renderer after it has independently reduced
// its OWN native-wanted plan, not an invitation to silently evict ground.
export function planSkyNativeOwner({position,nativeWanted=[],nativeChunks,
  skyCandidates=[],worldToken,rendererEpoch,nativeRevision,grant,
  maxSkyResident=8}={}){
  if(!position||![position.x,position.feet,position.z].every(valid)||
    Math.abs(position.x)>1e7||Math.abs(position.z)>1e7||
    !Array.isArray(nativeWanted)||nativeWanted.length>64||!unique(nativeWanted)||
    !(nativeChunks instanceof Map)||!Array.isArray(skyCandidates)||
    skyCandidates.length>256||typeof worldToken!=='string'||!worldToken||
    !safe(rendererEpoch)||rendererEpoch<0||!safe(nativeRevision)||nativeRevision<0||
    !safe(maxSkyResident)||maxSkyResident<8||maxSkyResident>SKY_NATIVE_SHARED_LIMIT)
    fail('authentic bounded renderer identity and desired keys required');
  for(const key of nativeWanted)inspectNativeDepthKey(key);
  // The original depth engine remains sole GPU owner underground. In
  // particular its real 27-section and 34-shaft budgets are NOT truncated.
  if(position.feet<20)return Object.freeze({mode:'native-depth-pass-through',
    reason:'Original depth renderer owns ground and underground streaming',
    readyForStage:false,canAdmitFlight:false,
    desiredKeys:Object.freeze([...nativeWanted]),skyJobs:Object.freeze([])});
  if(position.feet>256)return request('Sky physics altitude ceiling reached');
  const required=skyIslandBodyRegions(position);
  if(required.length>maxSkyResident)return request('Not enough full-body sky section slots');
  if(!grant||grant.worldToken!==worldToken||grant.rendererEpoch!==rendererEpoch||
    grant.nativeRevision!==nativeRevision||grant.skyBudgetApproved!==true||
    !Array.isArray(grant.nativeWanted)||!sameKeys(grant.nativeWanted,nativeWanted))
    return request('Original renderer has not granted this exact native desired plan');
  const candidates=new Map();
  for(const p of skyCandidates){
    if(!p||![p.cx,p.cz,p.section].every(safe))fail('invalid authoritative sky candidate');
    const key=skyIslandMeshKey(p.cx,p.cz,p.section);
    if(Math.abs(p.cx)>625001||Math.abs(p.cz)>625001)fail('sky candidate outside bounded world');
    if(candidates.has(key))fail('duplicate source sky section');
    candidates.set(key,Object.freeze({...p,key}));
  }
  const missingSource=required.filter(r=>!candidates.has(r.key));
  if(missingSource.length)return request('Sky generator did not certify all required body sections');
  const remaining=SKY_NATIVE_SHARED_LIMIT-nativeWanted.length;
  if(remaining<required.length)return request('Original renderer has not released enough native GPU slots');
  // Never publish a scene that drops an original ground/depth chunk before
  // its own renderer has marked it ready and consented to reduced residency.
  for(const k of nativeWanted){
    const chunk=nativeChunks.get(k);
    if(!chunk||!chunk.buffer)return request('Original renderer has pending/unresident native chunk');
  }
  const chosen=[...required],seen=new Set(required.map(r=>r.key));
  const cx=Math.floor(position.x/16),cz=Math.floor(position.z/16);
  const optional=[...candidates.values()].filter(p=>!seen.has(p.key)&&
      Math.max(Math.abs(p.cx-cx),Math.abs(p.cz-cz))<=SKY_ISLAND_MAX_VIEW_RADIUS_CHUNKS)
    .sort((a,b)=>(a.cx-cx)**2+(a.cz-cz)**2-( (b.cx-cx)**2+(b.cz-cz)**2 )||
      Math.abs(a.section*16+27-position.feet)-Math.abs(b.section*16+27-position.feet)||
      a.cx-b.cx||a.cz-b.cz||a.section-b.section);
  for(const p of optional){
    if(chosen.length>=maxSkyResident||chosen.length>=remaining)break;
    chosen.push(p);seen.add(p.key);
  }
  const desiredKeys=Object.freeze([...nativeWanted,...chosen.map(p=>p.key)]);
  if(desiredKeys.length>SKY_NATIVE_SHARED_LIMIT||!unique(desiredKeys))fail('native+sky budget alias');
  const resident=(k)=>Boolean(nativeChunks.get(k)?.buffer);
  const jobs=chosen.filter(p=>!resident(p.key)).slice(0,SKY_NATIVE_MAX_UPLOADS)
    .map(p=>({cx:p.cx,cz:p.cz,section:p.section,key:p.key}));
  const missingResident=required.filter(p=>!resident(p.key));
  return Object.freeze({mode:'sky-authorized',readyForStage:true,
    reason:'Native renderer consent and source sections verified',
    desiredKeys,skyJobs:toRows(jobs),required:toRows(required),
    canAdmitFlight:!missingResident.length,
    missingResident:toRows(missingResident),nativeCount:nativeWanted.length,
    skyCount:chosen.length,slots:desiredKeys.length,rendererEpoch,nativeRevision,
    worldToken,shadowPolicy:SKY_ISLAND_LIGHTING_POLICY});
}

// This phase uses the REAL src/gpu-recovery.mjs uploadChunkBuffer. A fake
// WebGL2 context can exercise this exact native upload path in focused tests.
// Actual WebGL2/browser acceptance remains a separate integration gate.
export function stageSkyNativeOwnerFrame({plan,gl,chunks,meshSection,
  contextToken,worldToken,rendererEpoch,nativeRevision}={}){
  if(!plan||plan.readyForStage!==true||plan.mode!=='sky-authorized'||
     !(chunks instanceof Map)||typeof meshSection!=='function'||
     typeof contextToken!=='string'||!contextToken||
     plan.worldToken!==worldToken||plan.rendererEpoch!==rendererEpoch||
     plan.nativeRevision!==nativeRevision)
    fail('stale or unauthorized native renderer staging plan');
  const meshes=[],seen=new Set();let total=0;
  for(const job of plan.skyJobs){
    if(seen.has(job.key))fail('duplicate staged sky section');seen.add(job.key);
    const m=meshSection(job.cx,job.cz,job.section);
    if(!m||m.key!==job.key||!(m.vertices instanceof Float32Array)||
      m.vertexCount!==m.vertices.length/9||m.vertices.byteLength>884736)
      fail('mesh producer returned stale or unauthenticated upper geometry');
    total+=m.vertices.byteLength;
    if(total>SKY_NATIVE_MAX_BATCH_BYTES)fail('sky mesh preparation exceeded iPhone batch bytes');
    meshes.push(m);
  }
  const transaction=stageSkyIslandGpuTransaction({gl,existingChunks:chunks,
    batch:{meshes},desiredKeys:[...plan.desiredKeys],uploadBuffer:uploadChunkBuffer,
    maxResident:SKY_NATIVE_SHARED_LIMIT});
  return Object.freeze({transaction,worldToken,contextToken,rendererEpoch,nativeRevision,
    stagedKeys:Object.freeze(meshes.map(m=>m.key)),totalBytes:total,
    originalSourceUpload:true,published:false});
}

const consumed=new WeakSet();
const matches=(map,entries)=>map instanceof Map&&map.size===entries.length&&
  entries.every(([k,v])=>map.has(k)&&map.get(k)===v);
const verdict=(status,reason,extra={})=>Object.freeze({status,reason,...extra});
// Unlike previous proposed setChunks(new Map), this can publish into the
// original renderer's constant Map IN PLACE, with CAS and rollback. Caller
// alone must own the renderer at a safe synchronous frame boundary.
export function publishSkyNativeFrameInPlace({stage,chunks,gl,readIdentity}={}){
  if(!stage?.transaction||!(chunks instanceof Map)||
     Object.getPrototypeOf(chunks)!==Map.prototype||
     !gl||typeof gl.deleteBuffer!=='function'||typeof readIdentity!=='function')
    fail('original-owned plain Map and live context identity required');
  if(consumed.has(stage))return verdict('refused','Frame transaction already consumed');
  const t=stage.transaction;
  if(chunks!==t.baseChunks||!matches(t.nextChunks,t.nextEntries))
    fail('renderer map or staged geometry was replaced before CAS');
  consumed.add(stage);
  const released=[],failed=[];
  const release=arr=>{for(const buffer of arr){try{gl.deleteBuffer(buffer);released.push(buffer);}catch(_){failed.push(buffer);}}};
  let live;
  try{live=readIdentity();}catch(_){return verdict('fatal','Cannot verify live WebGL context',
    {needsRendererReset:true});}
  if(!live||live.contextToken!==stage.contextToken)
    return verdict('stale','WebGL context changed; buffers abandoned for context recovery',
      {abandonedOnContextLoss:true});
  if(live.worldToken!==stage.worldToken||live.rendererEpoch!==stage.rendererEpoch||
     live.nativeRevision!==stage.nativeRevision||!matches(chunks,t.baseEntries)){
    release(t.stagedBuffers);
    return verdict('stale','Native renderer identity/desired map changed; original scene retained',
      {released:Object.freeze(released),failed:Object.freeze(failed)});
  }
  const old=[...t.baseEntries];
  const restore=()=>{try{chunks.clear();for(const [k,v] of old)chunks.set(k,v);
    return matches(chunks,old);}catch(_){return false;}};
  try{
    chunks.clear();for(const [k,v] of t.nextEntries)chunks.set(k,v);
    if(!matches(chunks,t.nextEntries))throw Error('native in-place map commit incomplete');
  }catch(_){
    const recovered=restore();
    if(recovered)release(t.stagedBuffers);
    return verdict(recovered?'refused':'fatal','Native in-place GPU swap failed',
      {needsRendererReset:!recovered,released:Object.freeze(released)});
  }
  let after;
  try{after=readIdentity();}catch(_){after=null;}
  if(!after||after.contextToken!==stage.contextToken){
    return verdict('fatal','Context changed during publication; no GPU resources disposed',
      {needsRendererReset:true});
  }
  if(after.worldToken!==stage.worldToken||after.rendererEpoch!==stage.rendererEpoch||
     after.nativeRevision!==stage.nativeRevision){
    if(!restore())return verdict('fatal','Native renderer changed during commit and rollback failed',
      {needsRendererReset:true});
    release(t.stagedBuffers);
    return verdict('stale','Native renderer changed during commit; old scene restored',
      {released:Object.freeze(released),failed:Object.freeze(failed)});
  }
  // Original src/main.mjs deleteChunkBuffers deletes BOTH opaque buffer and
  // waterBuffer. The earlier transaction only enumerated `old.buffer`, which
  // would leak water assets when ground chunks are deliberately released.
  // Avoid deleting ANY buffer retained by another chunk, even if buffers
  // were shared by an old water/opaque entry.
  const protectedBuffers=new Set();
  for(const [,chunk] of t.nextEntries){
    if(chunk?.buffer)protectedBuffers.add(chunk.buffer);
    if(chunk?.waterBuffer)protectedBuffers.add(chunk.waterBuffer);
  }
  const obsolete=new Set();
  for(const [,chunk] of t.baseEntries){
    if(chunk?.buffer&&!protectedBuffers.has(chunk.buffer))obsolete.add(chunk.buffer);
    if(chunk?.waterBuffer&&!protectedBuffers.has(chunk.waterBuffer))obsolete.add(chunk.waterBuffer);
  }
  release(obsolete);
  return verdict('published','Original const Map updated and superseded buffers retired',
    {resident:chunks.size,released:Object.freeze(released),failed:Object.freeze(failed)});
}
