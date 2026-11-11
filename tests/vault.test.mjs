import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {makeVaultRecord,validateVaultRecord,listVaultBackups,VAULT_DB,MAX_SNAPSHOTS_PER_SEED} from '../src/vault.mjs';
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
