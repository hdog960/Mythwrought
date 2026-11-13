// Mythwrought v0.10 Gate A: OPTIONAL IndexedDB snapshot vault.
// No automatic migration or write-through: canonical v0.02 schema-1 localStorage
// slots and v0.09 checksum journals remain the authoritative live save.
import {parseWorldData,saveFingerprint,MAX_IMPORT_BYTES} from './persistence.mjs';

export const VAULT_DB='mythwrought-v010-optional-vault';
export const VAULT_STORE='snapshots';
export const MAX_SNAPSHOTS_PER_SEED=6;

function problem(error){
  return error instanceof Error?error.message:String(error||'Unknown IndexedDB failure');
}
function openVault(factory=globalThis.indexedDB){
  if(!factory||typeof factory.open!=='function')
    return Promise.reject(Error('IndexedDB unavailable in this browser. Export JSON instead.'));
  return new Promise((resolve,reject)=>{
    let req,settled=false;
    try{req=factory.open(VAULT_DB,1);}catch(error){reject(Error('Cannot open device vault: '+problem(error)));return;}
    req.onupgradeneeded=()=>{
      // A previously blocked open may complete after its caller has given up.
      // Never mutate the schema for an abandoned request.
      if(settled)return;
      const db=req.result;
      if(!db.objectStoreNames.contains(VAULT_STORE))db.createObjectStore(VAULT_STORE,{keyPath:'id'});
    };
    req.onsuccess=()=>{
      // IndexedDB can unblock after onblocked rejected the operation. Close
      // that late connection instead of leaking it and blocking other tabs.
      if(settled){req.result?.close();return;}
      settled=true;resolve(req.result);
    };
    req.onerror=()=>{
      if(settled)return;
      settled=true;reject(Error('Device vault unavailable: '+problem(req.error)));
    };
    req.onblocked=()=>{
      if(settled)return;
      settled=true;reject(Error('Device vault is blocked by another tab; close other tabs and retry.'));
    };
  });
}
function requestResult(req){
  return new Promise((resolve,reject)=>{
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(Error('Device vault request failed: '+problem(req.error)));
  });
}
function transactionFinished(tx){
  return new Promise((resolve,reject)=>{
    tx.oncomplete=()=>resolve();
    tx.onabort=()=>reject(Error('Device vault transaction aborted: '+problem(tx.error)));
    tx.onerror=()=>reject(Error('Device vault transaction failed: '+problem(tx.error)));
  });
}
async function withVault(factory,task){
  const db=await openVault(factory);
  try{return await task(db);}finally{db.close();}
}
function assertRecordId(id){
  if(typeof id!=='string'||!/^v010:[0-9a-z]+:[0-9a-z]{8,}$/i.test(id))throw Error('Invalid vault snapshot identifier');
}
export function makeVaultRecord(raw,id,createdAt=new Date().toISOString()){
  assertRecordId(id);
  if(typeof raw!=='string'||raw.length>MAX_IMPORT_BYTES)throw Error('Vault payload is too large');
  const world=parseWorldData(raw);
  return {id,seed:world.seed,raw,checksum:saveFingerprint(raw),edits:world.edits.size,
    format:1,createdAt};
}
export function validateVaultRecord(record){
  if(!record||record.format!==1)throw Error('Unsupported or missing vault record format');
  assertRecordId(record.id);
  if(typeof record.raw!=='string'||record.raw.length>MAX_IMPORT_BYTES||
      record.checksum!==saveFingerprint(record.raw))throw Error('Vault checksum mismatch');
  const world=parseWorldData(record.raw,record.seed);
  if(!Number.isInteger(record.edits)||record.edits!==world.edits.size)throw Error('Vault edit count mismatch');
  if(typeof record.createdAt!=='string'||!Number.isFinite(Date.parse(record.createdAt)))
    throw Error('Vault snapshot has invalid timestamp');
  return {id:record.id,seed:world.seed,raw:record.raw,checksum:record.checksum,
    edits:world.edits.size,createdAt:record.createdAt};
}
export async function listVaultBackups(factory=globalThis.indexedDB){
  return withVault(factory,async db=>{
    const tx=db.transaction(VAULT_STORE,'readonly');
    const done=transactionFinished(tx),records=await requestResult(tx.objectStore(VAULT_STORE).getAll());
    await done;
    return records.map(record=>{
      try{
        const valid=validateVaultRecord(record);
        return {id:valid.id,seed:valid.seed,edits:valid.edits,createdAt:valid.createdAt,valid:true};
      }catch(error){
        return {id:String(record?.id??''),seed:Number.isInteger(record?.seed)?record.seed:null,
          createdAt:record?.createdAt||'Unknown',valid:false,error:problem(error)};
      }
    }).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
  });
}
export async function inspectVaultBackup(id,factory=globalThis.indexedDB){
  assertRecordId(id);
  return withVault(factory,async db=>{
    const tx=db.transaction(VAULT_STORE,'readonly');
    const done=transactionFinished(tx),record=await requestResult(tx.objectStore(VAULT_STORE).get(id));
    await done;
    if(!record)throw Error('Selected device backup no longer exists');
    return validateVaultRecord(record);
  });
}
// Corrupt records claiming a seed still occupy capacity: never rotate away
// or silently discard user-owned bytes during an unrelated backup write.
export function vaultSeedAtCapacity(records,seed){
  if(!Array.isArray(records)||!Number.isInteger(seed))throw Error('Invalid vault capacity inputs');
  return records.filter(item=>item?.seed===seed).length>=MAX_SNAPSHOTS_PER_SEED;
}
export async function createVaultBackup(raw,factory=globalThis.indexedDB){
  // Snapshot construction/validation is outside the transaction, so an invalid
  // world can never touch a healthy prior IndexedDB snapshot.
  const stamp=new Date().toISOString();
  const id='v010:'+Date.now().toString(36)+':'+Math.random().toString(36).slice(2,12);
  const record=makeVaultRecord(raw,id,stamp);
  // Check capacity in the SAME readwrite transaction as insertion.
  // Separate reads allow two tabs to both see five backups and create seven.
  await withVault(factory,async db=>{
    const tx=db.transaction(VAULT_STORE,'readwrite');
    const done=transactionFinished(tx);
    const store=tx.objectStore(VAULT_STORE);
    const existing=await requestResult(store.getAll());
    if(vaultSeedAtCapacity(existing,record.seed)){
      tx.abort();
      await done.catch(()=>{});
      throw Error('This seed already has six device backups. Download one and delete an old snapshot before making another.');
    }
    store.add(record);
    await done;
  });
  const saved=await inspectVaultBackup(record.id,factory);
  if(saved.raw!==raw||saved.checksum!==record.checksum)
    throw Error('Device backup read-back does not match the original bytes');
  return {id:record.id,seed:record.seed,createdAt:record.createdAt,edits:record.edits};
}
export function requireVaultBackup(record){
  if(record===undefined)throw Error('Selected device backup no longer exists; nothing was deleted');
  return record;
}
export async function deleteVaultBackup(id,factory=globalThis.indexedDB){
  assertRecordId(id);
  await withVault(factory,async db=>{
    const tx=db.transaction(VAULT_STORE,'readwrite');
    const done=transactionFinished(tx);
    const store=tx.objectStore(VAULT_STORE);
    // Never report success for an absent snapshot. Read and delete inside one
    // write transaction so another tab cannot remove it between those steps.
    const existing=await requestResult(store.get(id));
    if(existing===undefined){
      tx.abort();
      await done.catch(()=>{});
      requireVaultBackup(existing);
    }
    store.delete(id);
    await done;
  });
  // Verify deletion without altering any other backup or live save.
  await withVault(factory,async db=>{
    const tx=db.transaction(VAULT_STORE,'readonly');
    const done=transactionFinished(tx),record=await requestResult(tx.objectStore(VAULT_STORE).get(id));
    await done;
    if(record!==undefined)throw Error('Device backup deletion could not be verified');
  });
}
