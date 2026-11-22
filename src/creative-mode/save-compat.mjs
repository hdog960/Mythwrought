// Mythwrought Roadmap 9 M5 — DETACHED schema-1-compatibility envelope.
// Does NOT import, write or alter Mythwrought's production schema-1 saves.
import {BUILD_ABI,MAX_WORLD_CELLS,createBuildState,planBuildBatch} from './build-model.mjs';
import {HISTORY_ABI,buildFingerprint,rehydrateHistorySession} from './history-model.mjs';

export const DETACHED_SAVE_ABI='mythwrought.creative.detached-save.v1';
export const PRODUCTION_SCHEMA_COMPATIBILITY=1;
export const DETACHED_SAVE_KEYS=Object.freeze({
  primary:'mythwrought.creative.detached.m5.primary',
  backup:'mythwrought.creative.detached.m5.backup',
  pending:'mythwrought.creative.detached.m5.pending'
});
export const MAX_SAVE_BYTES=800000;
const int=Number.isSafeInteger;
const vec=p=>p&&int(p.x)&&int(p.y)&&int(p.z);

// Non-cryptographic checksum for deterministic corruption detection, not authenticity.
export function detachedChecksum(text) {
  let h=0xcbf29ce484222325n;
  for(let i=0;i<text.length;i++) {h^=BigInt(text.charCodeAt(i));h=BigInt.asUintN(64,h*0x100000001b3n);}
  return h.toString(16).padStart(16,'0');
}
const stablePoint=p=>({x:p.x,y:p.y,z:p.z});
function stableAction(a){return a.type==='remove'?{type:'remove',at:stablePoint(a.at)}:
  {type:'place',id:a.id,at:stablePoint(a.at),rotation:a.rotation};}
function stableEntry(e){return {forward:e.forward.map(stableAction),inverse:e.inverse.map(stableAction),
  beforeFingerprint:e.beforeFingerprint,afterFingerprint:e.afterFingerprint};}
function stablePlacement(p){return {id:p.id,kind:p.kind,at:stablePoint(p.at),rotation:p.rotation,
  cells:p.cells.map(stablePoint)};}
export function serializeDetachedHistory(session){
  if (session?.abi!==HISTORY_ABI || session.state?.abi!==BUILD_ABI || !int(session.state.revision) ||
      session.state.revision<0 || !int(session.limit) || session.limit<1 || session.limit>64 ||
      !Array.isArray(session.past) || !Array.isArray(session.future) ||
      session.past.length+session.future.length>session.limit ||
      !Array.isArray(session.state.placements) || session.state.placements.length>MAX_WORLD_CELLS)
    throw TypeError('Invalid detached session for serialization');
  buildFingerprint(session.state);
  const state=session.state;
  const payload={abi:DETACHED_SAVE_ABI,compatibleWorldSchema:PRODUCTION_SCHEMA_COMPATIBILITY,
    owner:'creative-standalone-only',historyAbi:HISTORY_ABI,revision:state.revision,
    bounds:{minX:state.bounds.minX,maxX:state.bounds.maxX,minY:state.bounds.minY,
      maxY:state.bounds.maxY,minZ:state.bounds.minZ,maxZ:state.bounds.maxZ},
    chunkSize:state.chunkSize,maxBatch:state.maxBatch,historyLimit:session.limit,
    placements:state.placements.map(stablePlacement),past:session.past.map(stableEntry),
    future:session.future.map(stableEntry)};
  const canonical=JSON.stringify(payload),checksum=detachedChecksum(canonical);
  const encoded=JSON.stringify({payload,checksum});
  if (encoded.length>MAX_SAVE_BYTES)throw RangeError('Detached save size budget exceeded');
  return encoded;
}
export function deserializeDetachedHistory(encoded,{catalog,ports}={}){
  if (typeof encoded!=='string'||encoded.length>MAX_SAVE_BYTES||encoded.length<20)
    throw TypeError('Missing or oversized detached save');
  const data=JSON.parse(encoded);const body=data?.payload;
  if (!body||body.abi!==DETACHED_SAVE_ABI||body.compatibleWorldSchema!==1||
      body.owner!=='creative-standalone-only'||body.historyAbi!==HISTORY_ABI||
      !/^[0-9a-f]{16}$/.test(data.checksum||'')||detachedChecksum(JSON.stringify(body))!==data.checksum)
    throw TypeError('Detached save integrity or schema mismatch');
  if (!int(body.revision)||body.revision<0||!Array.isArray(body.placements)||
      body.placements.length>MAX_WORLD_CELLS||!int(body.historyLimit)||
      body.historyLimit<1||body.historyLimit>64)
    throw TypeError('Invalid persisted revision or limits');
  let replay=createBuildState({bounds:body.bounds,chunkSize:body.chunkSize,maxBatch:body.maxBatch});
  for(const item of body.placements){
    if(!item||!vec(item.at)||!Array.isArray(item.cells)||
       !(typeof item.id==='string'||int(item.id))||!['block','object'].includes(item.kind)||
       !int(item.rotation)||item.rotation<0||item.rotation>3)
      throw TypeError('Invalid serialized placement');
    const result=planBuildBatch(replay,[{type:'place',id:item.id,at:item.at,rotation:item.rotation}],{catalog,ports});
    if(!result.ok)throw TypeError('Serialized world rejected by build adapters: '+result.reason);
    const expected=result.state.placements.at(-1);
    if(expected.kind!==item.kind || JSON.stringify(expected.cells.map(stablePoint))!==JSON.stringify(item.cells.map(stablePoint)))
      throw TypeError('Serialized physical footprint mismatch');
    replay=result.state;
  }
  if(body.revision<0||!int(body.revision))throw TypeError('Invalid revision');
  const exact=Object.freeze({...replay,revision:body.revision});
  return rehydrateHistorySession(exact,body.historyLimit,body.past,body.future);
}
// The caller injects an isolated storage double. A live game save driver must
// NEVER be passed. No window/localStorage/global access exists in this module.
export function createDetachedMemoryStore(){
  const values=new Map();
  return Object.freeze({read:key=>values.get(key)??null,write:(key,value)=>{values.set(key,value);},
    remove:key=>{values.delete(key);},snapshot:()=>Object.freeze(Object.fromEntries(values))});
}
// A corrupt primary MUST NOT replace the last complete backup on a later save.
// This lightweight check verifies ownership/schema/checksum before rotating slots;
// complete physical-footprint replay occurs only when loading with explicit ports.
function verifiedEnvelope(raw){
  if(typeof raw!=='string'||raw.length>MAX_SAVE_BYTES||raw.length<20)return false;
  try{
    const doc=JSON.parse(raw),p=doc?.payload;
    return p?.abi===DETACHED_SAVE_ABI && p.compatibleWorldSchema===1 &&
      p.owner==='creative-standalone-only' && p.historyAbi===HISTORY_ABI &&
      typeof doc.checksum==='string' && /^[0-9a-f]{16}$/.test(doc.checksum) &&
      detachedChecksum(JSON.stringify(p))===doc.checksum;
  }catch{return false;}
}
function requireStore(store){if(!store||['read','write','remove'].some(k=>typeof store[k]!=='function'))
  throw TypeError('Missing isolated read/write/remove save adapter');}
export function saveDetachedCheckpoint(store,session){
  requireStore(store);let encoded;try{encoded=serializeDetachedHistory(session);}catch(e){return Object.freeze({ok:false,reason:'invalid-session',stage:'serialize',error:String(e.message)});}
  let stage='read';
  try{
    const previous=store.read(DETACHED_SAVE_KEYS.primary);
    stage='pending';store.write(DETACHED_SAVE_KEYS.pending,encoded);
    if(verifiedEnvelope(previous)){
      stage='backup';store.write(DETACHED_SAVE_KEYS.backup,previous);
    }
    stage='primary';store.write(DETACHED_SAVE_KEYS.primary,encoded);
    stage='cleanup';store.remove(DETACHED_SAVE_KEYS.pending);
    return Object.freeze({ok:true,revision:session.state.revision,bytes:encoded.length,persisted:'detached-memory-only'});
  }catch(e){
    return Object.freeze({ok:false,reason:'storage-failure',stage,error:String(e?.message??e),
      recoveryRequired:true});
  }
}
export function loadDetachedCheckpoint(store,ctx){
  requireStore(store);
  for(const slot of ['primary','backup']){
    let raw;try{raw=store.read(DETACHED_SAVE_KEYS[slot]);}catch{return Object.freeze({ok:false,reason:'storage-read-failure'});}
    if(typeof raw!=='string')continue;
    try{return Object.freeze({ok:true,session:deserializeDetachedHistory(raw,ctx),source:slot,
      recovered:slot==='backup'});}catch{/* Reject damaged or incompatible slot and try verified backup. */}
  }
  return Object.freeze({ok:false,reason:'no-valid-committed-checkpoint'});
}
