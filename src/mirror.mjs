// MYTHWROUGHT v0.10 Gate A: consented, separate IndexedDB live-save mirror.
// The existing v0.02 localStorage schema-1 slots stay authoritative. The mirror
// is disabled by default and NEVER automatically restores a world.
import {parseWorldData,saveFingerprint,MAX_IMPORT_BYTES} from './persistence.mjs';

export const MIRROR_DB='mythwrought-v010-save-mirror';
export const MIRROR_STORE='seeds';
export const MIRROR_PREF='mythwrought-v010-enable-mirror';

function detail(error){return error instanceof Error?error.message:String(error||'Unknown storage error');}
function checkSeed(seed){
  if(!Number.isInteger(seed)||seed<-2147483648||seed>2147483647)throw Error('Invalid mirror world seed');
}
export function mirrorSnapshot(raw,seed,createdAt=new Date().toISOString()){
  checkSeed(seed);
  if(typeof raw!=='string'||raw.length>MAX_IMPORT_BYTES)throw Error('Mirror save is oversized or invalid');
  const world=parseWorldData(raw,seed);
  if(!Number.isFinite(Date.parse(createdAt)))throw Error('Invalid mirror snapshot timestamp');
  return {raw,checksum:saveFingerprint(raw),seed,edits:world.edits.size,createdAt};
}
export function validateMirrorSnapshot(snapshot,seed){
  checkSeed(seed);
  if(!snapshot||snapshot.seed!==seed||typeof snapshot.raw!=='string'||
    snapshot.raw.length>MAX_IMPORT_BYTES||snapshot.checksum!==saveFingerprint(snapshot.raw))
    throw Error('Mirror checksum, size or seed mismatch');
  const world=parseWorldData(snapshot.raw,seed);
  if(snapshot.edits!==world.edits.size)throw Error('Mirror edit count mismatch');
  if(typeof snapshot.createdAt!=='string'||!Number.isFinite(Date.parse(snapshot.createdAt)))
    throw Error('Mirror timestamp invalid');
  return {raw:snapshot.raw,seed,checksum:snapshot.checksum,edits:world.edits.size,
    createdAt:snapshot.createdAt};
}
export function inspectMirrorRecord(record,seed){
  checkSeed(seed);
  if(record===undefined)return {seed,current:null,previous:null,exists:false};
  if(!record||record.version!==1||record.seed!==seed)throw Error('Mirror record metadata damaged; no writes allowed');
  const inspect=slot=>{
    if(slot===null)return null;
    try{return {valid:true,...validateMirrorSnapshot(slot,seed)};}
    catch(error){return {valid:false,error:detail(error)};}
  };
  return {seed,current:inspect(record.current),previous:inspect(record.previous),exists:true};
}
function openDB(factory){
  if(!factory||typeof factory.open!=='function')
    return Promise.reject(Error('IndexedDB unavailable; local saves and JSON exports still work'));
  return new Promise((resolve,reject)=>{
    let request,done=false;
    const fail=error=>{if(!done){done=true;reject(error);}};
    try{request=factory.open(MIRROR_DB,1);}
    catch(error){fail(Error('Mirror database could not open: '+detail(error)));return;}
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(MIRROR_STORE))db.createObjectStore(MIRROR_STORE,{keyPath:'seed'});
    };
    request.onsuccess=()=>{
      if(done){request.result.close();return;}
      done=true;resolve(request.result);
    };
    request.onerror=()=>fail(Error('Mirror database open failed: '+detail(request.error)));
    request.onblocked=()=>fail(Error('Mirror database blocked by another tab'));
  });
}
async function useDB(factory,operation){
  const db=await openDB(factory);
  try{return await operation(db);}finally{db.close();}
}
function readRecord(db,seed){
  return new Promise((resolve,reject)=>{
    let tx,req;
    try{
      tx=db.transaction(MIRROR_STORE,'readonly');
      req=tx.objectStore(MIRROR_STORE).get(seed);
    }catch(error){reject(Error('Mirror read unavailable: '+detail(error)));return;}
    let record;
    req.onsuccess=()=>{record=req.result;};
    tx.oncomplete=()=>resolve(record);
    tx.onabort=()=>reject(Error('Mirror read aborted: '+detail(tx.error)));
    tx.onerror=()=>reject(Error('Mirror read failed: '+detail(tx.error)));
  });
}
export async function inspectMirror(seed,factory=globalThis.indexedDB){
  checkSeed(seed);
  return useDB(factory,async db=>inspectMirrorRecord(await readRecord(db,seed),seed));
}
export async function getMirrorCopy(seed,which='current',factory=globalThis.indexedDB){
  if(which!=='current'&&which!=='previous')throw Error('Choose a current or previous mirror');
  const state=await inspectMirror(seed,factory);
  const slot=state[which];
  if(!slot)throw Error('No '+which+' mirror exists for this world');
  if(!slot.valid)throw Error('Mirror copy rejected: '+slot.error);
  return slot;
}
// Read-modify-write runs within ONE native IndexedDB readwrite transaction;
// both the latest and previous-good copies commit or abort together.
export async function writeMirror(raw,factory=globalThis.indexedDB){
  const next=mirrorSnapshot(raw,parseWorldData(raw).seed);
  await useDB(factory,db=>new Promise((resolve,reject)=>{
    let tx,request,lastError=null,changed=false;
    try{
      tx=db.transaction(MIRROR_STORE,'readwrite');
      const store=tx.objectStore(MIRROR_STORE);
      request=store.get(next.seed);
      request.onsuccess=()=>{
        try{
          const previous=request.result;
          const health=inspectMirrorRecord(previous,next.seed);
          if(health.current&&!health.current.valid)throw Error('Current mirror damaged; preserve bytes and export backups');
          if(health.previous&&!health.previous.valid)throw Error('Previous mirror damaged; preserve bytes and export backups');
          if(health.current?.raw===next.raw)return; // no new version or rotation
          const oldCurrent=previous?.current||null;
          store.put({version:1,seed:next.seed,current:next,previous:oldCurrent});
          changed=true;
        }catch(error){lastError=error;try{tx.abort();}catch(_){}}
      };
    }catch(error){reject(Error('Mirror transaction unavailable: '+detail(error)));return;}
    tx.oncomplete=()=>resolve({changed});
    tx.onabort=()=>reject(Error('Mirror transaction aborted: '+detail(lastError||tx.error)));
    tx.onerror=()=>{if(!lastError)lastError=tx.error;};
  }));
  const actual=await getMirrorCopy(next.seed,'current',factory);
  if(actual.raw!==raw||actual.checksum!==next.checksum)
    throw Error('Mirror read-back mismatch; do not consider it verified');
  return {seed:next.seed,checksum:next.checksum,edits:next.edits,createdAt:actual.createdAt};
}
// Serializes writes for one seed: rapidly repeated edits must never allow an
// older async transaction to overwrite a newer verified checkpoint.
export class MirrorWriteQueue {
  constructor(writer=writeMirror){this.writer=writer;this.tails=new Map();}
  enqueue(raw){
    const seed=parseWorldData(raw).seed;
    const former=this.tails.get(seed)||Promise.resolve();
    const next=former.catch(()=>{}).then(()=>this.writer(raw));
    this.tails.set(seed,next);
    next.finally(()=>{if(this.tails.get(seed)===next)this.tails.delete(seed);}).catch(()=>{});
    return next;
  }
  async idle(){await Promise.allSettled([...this.tails.values()]);}
}
