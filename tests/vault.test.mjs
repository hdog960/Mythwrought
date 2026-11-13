import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {makeVaultRecord,validateVaultRecord,listVaultBackups,vaultSeedAtCapacity,requireVaultBackup,VAULT_DB,MAX_SNAPSHOTS_PER_SEED} from '../src/vault.mjs';
function sample(){const w=new VoxelWorld(179);w.set(15,19,-1,BLOCK.WOOD);return JSON.stringify(w.save());}
test('vault records preserve exact original schema-1 JSON and independent checksum',()=>{
 const raw=sample(),r=makeVaultRecord(raw,'v010:fixed:abcdefghij','2026-11-11T19:00:00.000Z');
 assert.equal(validateVaultRecord(r).raw,raw);
 assert.equal(validateVaultRecord(r).seed,179);
 assert.equal(validateVaultRecord(r).edits,1);
 assert.equal(JSON.parse(r.raw).schema,1);
});
test('rejects tampered backup bytes, edit counts, cross-seed tags and invalid formats',()=>{
 const r=makeVaultRecord(sample(),'v010:fixed:abcdefghij');
 assert.throws(()=>validateVaultRecord({...r,raw:r.raw+' '}),/checksum/);
 assert.throws(()=>validateVaultRecord({...r,edits:99}),/edit count/);
 assert.throws(()=>validateVaultRecord({...r,seed:180}),/seed mismatch/);
 assert.throws(()=>validateVaultRecord({...r,format:2}),/format/);
 assert.throws(()=>validateVaultRecord({...r,createdAt:'not-a-date'}),/timestamp/);
 assert.throws(()=>validateVaultRecord({...r,id:'../unsafe'}),/identifier/);
});
test('invalid records cannot be constructed or persisted',()=>{
 assert.throws(()=>makeVaultRecord('not-json','v010:fixed:abcdefghij'));
 assert.throws(()=>makeVaultRecord(sample(),'localStorage-key'),/identifier/);
 assert.equal(MAX_SNAPSHOTS_PER_SEED,6);
 assert.match(VAULT_DB,/optional-vault/);
});
test('unavailable IndexedDB rejects without changing world state',async()=>{
 const storage={['mythwrought-v002-world-179']:sample()};
 await assert.rejects(listVaultBackups(null),/unavailable/);
 assert.equal(JSON.parse(storage['mythwrought-v002-world-179']).seed,179);
});

test('optional vault cap counts same-seed records including damaged records, never other seeds',()=>{
 const seed=179;
 const five=Array.from({length:5},(_,i)=>({id:'a'+i,seed}));
 assert.equal(vaultSeedAtCapacity(five,seed),false);
 assert.equal(vaultSeedAtCapacity([...five,{id:'other',seed:-201}],seed),false);
 assert.equal(vaultSeedAtCapacity([...five,{id:'corrupt',seed,raw:'damaged'}],seed),true);
 assert.equal(vaultSeedAtCapacity([...five,{id:'corrupt',seed,raw:'damaged'}],-201),false);
 assert.throws(()=>vaultSeedAtCapacity(null,seed),/Invalid/);
 assert.throws(()=>vaultSeedAtCapacity(five,'179'),/Invalid/);
});

test('missing optional vault backup cannot be silently reported as deleted',()=>{
 assert.throws(()=>requireVaultBackup(undefined),/no longer exists; nothing was deleted/);
 const corrupt={id:'v010:fixed:abcdefghij',raw:'damaged'};
 assert.equal(requireVaultBackup(corrupt),corrupt,'damaged user-owned snapshot may still be explicitly deleted');
});

test('blocked optional vault open closes a late connection without touching canonical saves',async()=>{
 const {inspectVaultBackup}=await import('../src/vault.mjs');
 const request={result:null,error:null};
 const factory={open(){return request;}};
 const pending=inspectVaultBackup('v010:fixed:abcdefghij',factory);
 // Wait for the async open to register its handlers.
 await Promise.resolve();
 request.onblocked();
 await assert.rejects(pending,/blocked by another tab/);
 let closes=0,upgrades=0,aborts=0;
 request.transaction={abort(){aborts++;}};
 request.result={close(){closes++;},objectStoreNames:{contains(){return false;}},createObjectStore(){upgrades++;}};
 request.onupgradeneeded();
 request.onsuccess();
 assert.equal(closes,1,'late IndexedDB connection must not hold the vault lock');
 assert.equal(upgrades,0,'abandoned open must not upgrade the vault');
 assert.equal(aborts,1,'abandoned versionchange must abort rather than commit an empty database');
});


test('blocked vault upgrade is aborted even when no database connection is delivered',async()=>{
 const {inspectVaultBackup}=await import('../src/vault.mjs');
 const request={result:null,error:null};
 const pending=inspectVaultBackup('v010:fixed:abcdefghij',{open(){return request;}});
 await Promise.resolve();
 request.onblocked();
 await assert.rejects(pending,/blocked by another tab/);
 let aborted=0;
 request.transaction={abort(){aborted++;}};
 request.result={objectStoreNames:{contains(){throw Error('abandoned upgrade must not inspect schema');}}};
 request.onupgradeneeded();
 request.onerror();
 assert.equal(aborted,1);
});
