// Mountain V8 source-only IndexedDB existence / owner evidence preparation.
// NEVER calls indexedDB.open/databases/deleteDatabase, never creates or upgrades
// databases, never writes, never closes a caller-owned connection. All reads
// require externally BORROWED, already-open original IDBDatabase connections.
// This is not an authorized new-world creation path: localStorage and the two
// independent IndexedDB stores cannot be checked atomically across tabs.
// Missing/invalid original connections and transaction errors FAIL CLOSED.
import {VAULT_DB,VAULT_STORE} from '../vault.mjs';
import {MIRROR_DB,MIRROR_STORE} from '../mirror.mjs';
import {auditMountainV8SuppliedIndexedDBEvidence}
  from './mountain-v8-indexeddb-owner-evidence.mjs';

const originalSeed=n=>Number.isSafeInteger(n)&&n===(n|0);
const freeze=Object.freeze;
const failed=(seed,reason)=>freeze({
  seed,reason,readOnlyTransactionsCompleted:0,
  originalEvidence:null,crossStoreAtomicSnapshot:false,
  crossStoreAdmissionApproved:false,knownDeviceStorageUnclaimed:false,
  safeToIntegrate:false,runtimeActivationAuthorized:false
});
function checkConnection(db,name,storeName){
  // Only the exact original owner's database version and store are supported.
  // A future upgraded schema requires a separately reviewed source owner ABI.
  if(!db||db.name!==name||db.version!==1||
     typeof db.transaction!=='function'||
     typeof db.objectStoreNames?.contains!=='function'||
     !db.objectStoreNames.contains(storeName))
    throw Error('Missing or incompatible original borrowed IndexedDB owner connection');
}
function readOriginalStore(db,name,storeName,method,arg){
  return new Promise((resolve,reject)=>{
    let tx,request,settled=false,readSucceeded=false,value;
    const failure=reason=>{
      if(settled)return;
      settled=true;reject(Error(reason));
    };
    try{
      checkConnection(db,name,storeName);
      // Only this explicit read-only operation is allowed. NO open, upgrade,
      // abort, add, put, clear, delete, cursor changes or close.
      tx=db.transaction([storeName],'readonly');
      if(!tx||tx.mode!=='readonly'||typeof tx.objectStore!=='function')
        throw Error('Original owner transaction not read-only');
      const store=tx.objectStore(storeName);
      if(!store||typeof store[method]!=='function')
        throw Error('Original owner read API missing');
      request=method==='getAll'?store.getAll():store.get(arg);
      if(!request||typeof request!=='object')
        throw Error('Original owner request missing');
      request.onsuccess=()=>{value=request.result;readSucceeded=true;};
      request.onerror=()=>failure('Original owner request error');
      tx.onerror=()=>failure('Original owner transaction error');
      tx.onabort=()=>failure('Original owner read-only transaction aborted');
      tx.oncomplete=()=>{
        if(!readSucceeded){failure('Original owner request not completed');return;}
        if(settled)return;
        settled=true;resolve(value);
      };
    }catch{failure('Original owner read-only transaction unavailable');}
  });
}
/** No database factory is accepted. Both borrowed connections are required.
 * Even a complete clean scan does NOT prove absence of future or concurrent
 * owner writes. In particular it is NOT an atomic cross-database snapshot.
 */
export async function inspectMountainV8BorrowedOriginalIndexedDB(seed,{
  vaultDb=null,mirrorDb=null
}={}){
  if(!originalSeed(seed))throw new TypeError('Invalid original world seed');
  try{
    checkConnection(vaultDb,VAULT_DB,VAULT_STORE);
    checkConnection(mirrorDb,MIRROR_DB,MIRROR_STORE);
  }catch{return failed(seed,'original-borrowed-owner-connections-unverified');}
  try{
    const [vaultRecords,mirrorRecord]=await Promise.all([
      readOriginalStore(vaultDb,VAULT_DB,VAULT_STORE,'getAll'),
      readOriginalStore(mirrorDb,MIRROR_DB,MIRROR_STORE,'get',seed)
    ]);
    // Original source record validators are pure. Corrupt matching records
    // still claim their world; malformed unrelated records leave uncertainty.
    const evidence=auditMountainV8SuppliedIndexedDBEvidence(seed,
      {vaultRecords,mirrorRecord});
    return freeze({
      seed,reason:evidence.reason,readOnlyTransactionsCompleted:2,
      originalEvidence:evidence,
      crossStoreAtomicSnapshot:false,
      crossStoreAdmissionApproved:false,knownDeviceStorageUnclaimed:false,
      safeToIntegrate:false,runtimeActivationAuthorized:false
    });
  }catch{return failed(seed,'original-readonly-owner-transactions-failed');}
}
