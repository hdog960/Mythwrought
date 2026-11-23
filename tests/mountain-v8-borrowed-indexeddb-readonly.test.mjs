import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {makeVaultRecord,VAULT_DB,VAULT_STORE} from '../src/vault.mjs';
import {mirrorSnapshot,MIRROR_DB,MIRROR_STORE} from '../src/mirror.mjs';
import {inspectMountainV8BorrowedOriginalIndexedDB as inspect}
  from '../src/manual-biomes/mountain-v8-borrowed-indexeddb-readonly.mjs';

const stamp='2026-11-23T00:00:00.000Z';
const raw=seed=>{
  const w=new VoxelWorld(seed);
  assert.equal(w.set(0,-100,0,BLOCK.AIR),true);
  return JSON.stringify(w.save());
};
const vault=seed=>makeVaultRecord(raw(seed),'v010:abc:abcdefgh',stamp);
const mirror=seed=>({version:1,seed,
  current:mirrorSnapshot(raw(seed),seed,stamp),previous:null});
const stats=()=>({transactions:[],requests:[],open:0,write:0,closed:0});
function borrowed(name,store,value,statsObj,{event='complete',txMode='readonly',
  dbVersion=1,hasStore=true,hasMethod=true}={}){
  return {name,version:dbVersion,
    objectStoreNames:{contains:x=>hasStore&&x===store},
    transaction(names,mode){
      statsObj.transactions.push({name,names:[...names],mode});
      const tx={mode:txMode,oncomplete:null,onerror:null,onabort:null,
        objectStore(x){
          if(x!==store)throw Error('Unexpected original store');
          const request=(kind,key)=>{
            statsObj.requests.push({name,kind,key});
            const req={result:undefined,onerror:null,onsuccess:null};
            queueMicrotask(()=>{
              if(event==='error'){req.onerror?.({});tx.onerror?.({});return;}
              req.result=value;
              req.onsuccess?.({});
              queueMicrotask(()=>{
                if(event==='abort')tx.onabort?.({});
                else tx.oncomplete?.({});
              });
            });
            return req;
          };
          return {
            getAll:hasMethod?()=>request('getAll'):undefined,
            get:hasMethod?k=>request('get',k):undefined
          };
        }
      };
      return tx;
    }
  };
}
const pair=(v,m,s,opt={})=>({
  vaultDb:borrowed(VAULT_DB,VAULT_STORE,v,s,opt.vault??{}),
  mirrorDb:borrowed(MIRROR_DB,MIRROR_STORE,m,s,opt.mirror??{})
});
function denied(r){
  assert.ok(Object.isFrozen(r));
  assert.equal(r.safeToIntegrate,false);
  assert.equal(r.runtimeActivationAuthorized,false);
  assert.equal(r.crossStoreAdmissionApproved,false);
  assert.equal(r.crossStoreAtomicSnapshot,false);
  assert.equal(r.knownDeviceStorageUnclaimed,false);
  return r;
}
function readOnly(s,count){
  assert.equal(s.transactions.length,count);
  assert.ok(s.transactions.every(q=>q.mode==='readonly'));
  assert.equal(s.write,0);
  assert.equal(s.open,0);
  assert.equal(s.closed,0);
}
test('missing borrowed source connections never opens or creates original databases',async()=>{
  const r=denied(await inspect(179));
  assert.equal(r.readOnlyTransactionsCompleted,0);
  assert.equal(r.reason,'original-borrowed-owner-connections-unverified');
});
test('existing original Vault record claims the seed via read-only borrowed connection',async()=>{
  const s=stats(),record=vault(179),before=JSON.stringify(record);
  const r=denied(await inspect(179,pair([record],undefined,s)));
  assert.equal(r.readOnlyTransactionsCompleted,2);
  assert.equal(r.originalEvidence.ownerClaim,true);
  assert.equal(r.reason,'existing-indexeddb-snapshot-or-mirror');
  assert.equal(JSON.stringify(record),before);
  readOnly(s,2);
  assert.deepEqual(s.requests.map(q=>q.kind),['getAll','get']);
  assert.equal(s.requests[1].key,179);
});
test('empty original records never create new-world entitlement or atomicity',async()=>{
  const s=stats(),r=denied(await inspect(2026,pair([],undefined,s)));
  assert.equal(r.readOnlyTransactionsCompleted,2);
  assert.equal(r.originalEvidence.ownerClaim,false);
  assert.equal(r.originalEvidence.uncertain,false);
  readOnly(s,2);
});
test('damaged original Vault record still claims ownership without writes',async()=>{
  const s=stats(),record={...vault(179),checksum:'bad'};
  const before=JSON.stringify(record);
  const r=denied(await inspect(179,pair([record],undefined,s)));
  assert.equal(r.originalEvidence.ownerClaim,true);
  assert.equal(r.originalEvidence.uncertain,true);
  assert.equal(JSON.stringify(record),before);
  readOnly(s,2);
});
test('original mirror current or previous save claims even when damaged',async()=>{
  const s=stats(),record=mirror(179);
  record.current.checksum='damaged';
  const before=JSON.stringify(record);
  const r=denied(await inspect(179,pair([],record,s)));
  assert.equal(r.originalEvidence.ownerClaim,true);
  assert.equal(r.originalEvidence.mirrorExists,true);
  assert.equal(JSON.stringify(record),before);
  readOnly(s,2);
});
test('request errors fail closed, never fabricating completed read-only evidence',async()=>{
  const s=stats(),r=denied(await inspect(179,pair([],undefined,s,
    {vault:{event:'error'}})));
  assert.equal(r.reason,'original-readonly-owner-transactions-failed');
  assert.equal(r.readOnlyTransactionsCompleted,0);
  readOnly(s,2);
});
test('an aborted read-only transaction does not certify original owner absence',async()=>{
  const s=stats(),r=denied(await inspect(179,pair([],undefined,s,
    {mirror:{event:'abort'}})));
  assert.equal(r.reason,'original-readonly-owner-transactions-failed');
  readOnly(s,2);
});
test('wrong name/version/owner store rejects without beginning any transaction',async()=>{
  for(const variant of [
    {name:'not-mythwrought',version:1,store:true},
    {name:VAULT_DB,version:2,store:true},
    {name:VAULT_DB,version:1,store:false}
  ]){
    const s=stats(),p=pair([],undefined,s);
    p.vaultDb.name=variant.name;
    p.vaultDb.version=variant.version;
    if(!variant.store)p.vaultDb.objectStoreNames.contains=()=>false;
    const r=denied(await inspect(179,p));
    assert.equal(r.reason,'original-borrowed-owner-connections-unverified');
    readOnly(s,0);
  }
});
test('injected fake readwrite transaction is refused rather than accepted',async()=>{
  const s=stats(),r=denied(await inspect(179,pair([],undefined,s,
    {vault:{txMode:'readwrite'}})));
  assert.equal(r.reason,'original-readonly-owner-transactions-failed');
  assert.equal(r.readOnlyTransactionsCompleted,0);
});
test('missing original getAll implementation fails closed without writing',async()=>{
  const s=stats(),r=denied(await inspect(179,pair([],undefined,s,
    {vault:{hasMethod:false}})));
  assert.equal(r.reason,'original-readonly-owner-transactions-failed');
});
test('only int32 original world seeds may be inspected',async()=>{
  for(const seed of ['179',2**33,1.5,NaN,Infinity])
    await assert.rejects(inspect(seed),/Invalid original world seed/);
});
