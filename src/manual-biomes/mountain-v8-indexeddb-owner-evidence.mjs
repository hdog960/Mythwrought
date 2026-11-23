// Detached Mountain V8 cross-store evidence audit; NEVER opens IndexedDB.
// Original source Vault/Mirror open helpers may run onupgradeneeded when the
// database is absent; calling them as an existence probe could mutate a device.
// Instead analyze caller-supplied records from an independently owner-approved,
// pre-existing READONLY transaction. Even pristine supplied records are NOT
// proof that the two databases were checked or that creation is authorized.
import {validateVaultRecord} from '../vault.mjs';
import {inspectMirrorRecord} from '../mirror.mjs';

const isSeed=n=>Number.isSafeInteger(n)&&n===(n|0);
const freeze=Object.freeze;
const verdict=(seed,reason,{vaultRecordsChecked=0,ownerClaim=false,
  uncertain=false,mirrorExists=false}={})=>freeze({
  seed,reason,vaultRecordsChecked,ownerClaim,uncertain,mirrorExists,
  // No source in this research module can attest an atomic DB transaction,
  // absence of other namespaces, or consent for a new V8 seed.
  crossStoreReadOnlyTransactionAttested:false,
  requiresOwnerApprovedIndexedDBReadOnlyTransactions:true,
  distinctV8ProfileApproved:false,
  runtimeActivationAuthorized:false,safeToIntegrate:false
});
/** Evaluate ORIGINAL Vault and Mirror record shapes without any I/O.
 * mirrorRecord=undefined must be explicitly supplied to denote "no row" in
 * a trusted read-only collection; omitting the property is NOT equivalent.
 * A corrupted vault record of uncertain seed blocks further conclusions.
 */
export function auditMountainV8SuppliedIndexedDBEvidence(seed,input){
  if(!isSeed(seed))throw new TypeError('Invalid original world seed');
  if(!input||typeof input!=='object'||Array.isArray(input)||
     !Object.hasOwn(input,'vaultRecords')||
     !Object.hasOwn(input,'mirrorRecord')||
     !Array.isArray(input.vaultRecords)||
     input.vaultRecords.length>100000)
    return verdict(seed,'missing-or-unverifiable-cross-store-evidence',{uncertain:true});
  let unknown=false,claimed=false,checked=0;
  const ids=new Set();
  for(const record of input.vaultRecords){
    checked++;
    // A damaged record can be the ONLY surviving evidence of an old world.
    // Exact seed match always claims ownership, even if its checksum fails.
    if(record?.seed===seed)claimed=true;
    if(!record||typeof record!=='object'||Array.isArray(record)||
       typeof record.id!=='string'||ids.has(record.id)){
      unknown=true;continue;
    }
    ids.add(record.id);
    try{validateVaultRecord(record);}
    catch{unknown=true;}
  }
  let mirrorExists=false;
  try{
    // Accept only the actual original absence sentinel (undefined).
    const mirror=inspectMirrorRecord(input.mirrorRecord,seed);
    mirrorExists=mirror.exists;
    if(mirrorExists)claimed=true;
  }catch{unknown=true;}
  return verdict(seed,claimed?'existing-indexeddb-snapshot-or-mirror':
    unknown?'damaged-or-ambiguous-indexeddb-evidence':
    'supplied-indexeddb-records-have-no-known-claims',
    {vaultRecordsChecked:checked,ownerClaim:claimed,uncertain:unknown,mirrorExists});
}
