import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {makeVaultRecord,validateVaultRecord} from '../src/vault.mjs';
import {mirrorSnapshot,inspectMirrorRecord} from '../src/mirror.mjs';
import {auditMountainV8SuppliedIndexedDBEvidence as audit}
  from '../src/manual-biomes/mountain-v8-indexeddb-owner-evidence.mjs';

const stamp='2026-11-23T00:00:00.000Z';
const rawFor=seed=>{
  const world=new VoxelWorld(seed);
  assert.equal(world.set(0,-100,0,BLOCK.AIR),true);
  return JSON.stringify(world.save());
};
const vault=(seed,id='v010:abc:abcdefgh')=>makeVaultRecord(rawFor(seed),id,stamp);
const mirror=(seed)=>({version:1,seed,current:mirrorSnapshot(rawFor(seed),seed,stamp),
  previous:null});
const check=r=>{
  assert.equal(r.runtimeActivationAuthorized,false);
  assert.equal(r.safeToIntegrate,false);
  assert.equal(r.crossStoreReadOnlyTransactionAttested,false);
  assert.equal(r.requiresOwnerApprovedIndexedDBReadOnlyTransactions,true);
  assert.equal(r.distinctV8ProfileApproved,false);
  assert.equal(Object.isFrozen(r),true);
  return r;
};
test('exact original Vault backup claims existing V8 seed without any I/O',()=>{
  const record=vault(179);
  const original=JSON.stringify(record);
  assert.equal(validateVaultRecord(record).seed,179);
  const r=check(audit(179,{vaultRecords:[record],mirrorRecord:undefined}));
  assert.equal(r.ownerClaim,true);
  assert.equal(r.vaultRecordsChecked,1);
  assert.equal(r.reason,'existing-indexeddb-snapshot-or-mirror');
  assert.equal(JSON.stringify(record),original);
});
test('corrupt original Vault backup retains seed ownership even on bad checksum',()=>{
  const record={...vault(2026),checksum:'corrupted'};
  const original=JSON.stringify(record);
  const r=check(audit(2026,{vaultRecords:[record],mirrorRecord:undefined}));
  assert.equal(r.ownerClaim,true);
  assert.equal(r.uncertain,true);
  assert.equal(JSON.stringify(record),original);
});
test('original Mirror record claims ownership even when current slot is damaged',()=>{
  const record=mirror(-88);
  const before=JSON.stringify(record);
  assert.equal(inspectMirrorRecord(record,-88).exists,true);
  const r=check(audit(-88,{vaultRecords:[],mirrorRecord:record}));
  assert.equal(r.mirrorExists,true);
  assert.equal(r.ownerClaim,true);
  record.current.checksum='bad';
  const bad=check(audit(-88,{vaultRecords:[],mirrorRecord:record}));
  assert.equal(bad.ownerClaim,true);
  assert.equal(bad.reason,'existing-indexeddb-snapshot-or-mirror');
  assert.notEqual(JSON.stringify(record),before);
});
test('an unrelated valid Vault seed does not falsely claim this V8 seed',()=>{
  const r=check(audit(179,{vaultRecords:[vault(2026)],mirrorRecord:undefined}));
  assert.equal(r.ownerClaim,false);
  assert.equal(r.uncertain,false);
  assert.equal(r.reason,'supplied-indexeddb-records-have-no-known-claims');
  // Clean caller-supplied snapshots are NOT a trustworthy DB transaction.
  assert.equal(r.safeToIntegrate,false);
});
test('unknown/damaged Vault record without a seed fails closed',()=>{
  const r=check(audit(179,{vaultRecords:[{id:'damaged'}],mirrorRecord:undefined}));
  assert.equal(r.ownerClaim,false);
  assert.equal(r.uncertain,true);
  assert.equal(r.reason,'damaged-or-ambiguous-indexeddb-evidence');
});
test('missing or ambiguous original Mirror input cannot certify empty database',()=>{
  const incomplete=check(audit(179,{vaultRecords:[]}));
  assert.equal(incomplete.uncertain,true);
  assert.equal(incomplete.reason,'missing-or-unverifiable-cross-store-evidence');
  const malformed=check(audit(179,{vaultRecords:[],mirrorRecord:null}));
  assert.equal(malformed.uncertain,true);
  assert.equal(malformed.safeToIntegrate,false);
});
test('duplicate Vault IDs and unknown malformed entries block admission',()=>{
  const a=vault(2026),b={...vault(-88),id:a.id};
  const r=check(audit(179,{vaultRecords:[a,b],mirrorRecord:undefined}));
  assert.equal(r.uncertain,true);
  assert.equal(r.vaultRecordsChecked,2);
  assert.equal(r.safeToIntegrate,false);
});
test('validation rejects non-int32 seeds and never opens owner databases',()=>{
  for(const seed of [2**33,1.5,'179',NaN,Infinity])
    assert.throws(()=>audit(seed,{vaultRecords:[],mirrorRecord:undefined}),
      /Invalid original world seed/);
  // No factory/IndexedDB parameter exists: only plain raw source records are
  // accepted, and even an empty collection cannot authorize V8 activation.
  const result=check(audit(179,{vaultRecords:[],mirrorRecord:undefined}));
  assert.equal(result.ownerClaim,false);
  assert.equal(result.safeToIntegrate,false);
});
