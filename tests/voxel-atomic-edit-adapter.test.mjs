import test from 'node:test';
import assert from 'node:assert/strict';
import {atomicLegacyWriter} from '../src/voxel-atomic-edit-adapter.mjs';
import {applyLegacyVoxelEdit} from '../src/voxel-orientation-legacy-guard.mjs';
function host() {
  let id=7,revision=1,invalidations=0;
  const compareAndWrite=({expectedId,expectedRevision,nextId})=>{
    if (id!==expectedId || revision!==expectedRevision) return false;
    id=nextId;revision++;return true;
  };
  return {compareAndWrite, readBlock:()=>id,readRevision:()=>revision,
    sidecar:{invalidateEdit:()=>{invalidations++;}},
    mutate:()=>{revision++;},snapshot:()=>({id,revision,invalidations})};
}
test('atomic host commits same-ID replacement and invalidates turns',async()=>{
 const h=host(),writeBlock=atomicLegacyWriter(h);
 assert.equal(await applyLegacyVoxelEdit({cell:[1,2,3],nextId:7,...h,writeBlock}),true);
 assert.deepEqual(h.snapshot(),{id:7,revision:2,invalidations:1});
});
test('mutation after preflight cannot overwrite a newer same-ID edit',async()=>{
 const h=host();let calls=0;
 const writeBlock=atomicLegacyWriter({compareAndWrite:receipt=>{h.mutate();calls++;return h.compareAndWrite(receipt);}});
 assert.equal(await applyLegacyVoxelEdit({cell:[1,2,3],nextId:6,...h,writeBlock}),false);
 assert.equal(calls,1);
 assert.deepEqual(h.snapshot(),{id:7,revision:2,invalidations:1});
});
test('stale original identity is rejected at atomic commit',async()=>{
 const h=host();
 const writeBlock=atomicLegacyWriter({compareAndWrite:receipt=>{h.compareAndWrite({cell:receipt.cell,expectedId:7,expectedRevision:1,nextId:6});return h.compareAndWrite(receipt);}});
 assert.equal(await applyLegacyVoxelEdit({cell:[1,2,3],nextId:7,...h,writeBlock}),false);
 assert.deepEqual(h.snapshot(),{id:6,revision:2,invalidations:1});
});
test('non-boolean receipt is never accepted as successful commit',async()=>{
 const h=host(),writeBlock=atomicLegacyWriter({compareAndWrite:()=>({ok:true})});
 await assert.rejects(applyLegacyVoxelEdit({cell:[1,2,3],nextId:6,...h,writeBlock}),/boolean receipt/);
 assert.equal(h.snapshot().invalidations,0);
});
test('invalid revision and cell cannot reach host writer',async()=>{
 let calls=0;const writeBlock=atomicLegacyWriter({compareAndWrite:()=>{calls++;return true;}});
 await assert.rejects(writeBlock([1,2,3],6,7,undefined),TypeError);
 await assert.rejects(writeBlock([1,2,3.5],6,7,1),TypeError);
 assert.equal(calls,0);
});
