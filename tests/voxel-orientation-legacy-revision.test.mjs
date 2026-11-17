import test from 'node:test';
import assert from 'node:assert/strict';
import {applyLegacyVoxelEdit} from '../src/voxel-orientation-legacy-guard.mjs';

function fixture() {
 let id=7, revision=3, invalidations=0;
 const sidecar={invalidateEdit:()=>{invalidations++;}};
 const base={cell:[2,3,4],sidecar,nextId:7,readBlock:()=>id,readRevision:()=>revision};
 return {base, mutate:()=>{revision++;}, setId:v=>{id=v;}, invalidations:()=>invalidations};
}
test('rejected same-ID write with revision advance invalidates stale orientation',async()=>{
 const f=fixture();
 assert.equal(await applyLegacyVoxelEdit({...f.base,writeBlock:()=>{f.mutate();return false;}}),false);
 assert.equal(f.invalidations(),1);
});
test('throw after same-ID write invalidates optional turns and preserves original error',async()=>{
 const f=fixture();
 await assert.rejects(applyLegacyVoxelEdit({...f.base,writeBlock:()=>{f.mutate();throw Error('write failed');}}),/write failed/);
 assert.equal(f.invalidations(),1);
});
test('clean rejection with unchanged revision preserves optional orientation',async()=>{
 const f=fixture();
 assert.equal(await applyLegacyVoxelEdit({...f.base,writeBlock:()=>false}),false);
 assert.equal(f.invalidations(),0);
});
test('unreadable post-write identity fails closed on rejected edit',async()=>{
 const f=fixture();let reads=0;
 assert.equal(await applyLegacyVoxelEdit({...f.base,readBlock:()=>{if(++reads>1)throw Error('offline');return 7;},writeBlock:()=>false}),false);
 assert.equal(f.invalidations(),1);
});
test('revision and identity preflight validation prevent edits',async()=>{
 const f=fixture();let writes=0;
 await assert.rejects(applyLegacyVoxelEdit({...f.base,readRevision:()=>-1,writeBlock:()=>{writes++;return true;}}),TypeError);
 assert.equal(writes,0);
});
test('successful same-ID replacement always invalidates optional turns',async()=>{
 const f=fixture();
 assert.equal(await applyLegacyVoxelEdit({...f.base,writeBlock:()=>true}),true);
 assert.equal(f.invalidations(),1);
});

test('stale revision between reads refuses writer and invalidates old turns',async()=>{
 const f=fixture();let reads=0,writes=0;
 const result=await applyLegacyVoxelEdit({...f.base,
  readRevision:()=>{if(++reads===2)f.mutate();return reads===1?3:4;},
  writeBlock:()=>{writes++;return true;}
 });
 assert.equal(result,false);
 assert.equal(writes,0);
 assert.equal(f.invalidations(),1);
});
test('unchanged cooperative preflight allows writer with expected revision',async()=>{
 const f=fixture();let expected;
 const result=await applyLegacyVoxelEdit({...f.base,
  writeBlock:(_cell,_id,_before,revision)=>{expected=revision;return true;}
 });
 assert.equal(result,true);
 assert.equal(expected,3);
 assert.equal(f.invalidations(),1);
});
test('unreadable second preflight fails closed before invoking writer',async()=>{
 const f=fixture();let reads=0,writes=0;
 const result=await applyLegacyVoxelEdit({...f.base,
  readRevision:()=>{if(++reads===2)throw Error('unavailable');return 3;},
  writeBlock:()=>{writes++;return true;}
 });
 assert.equal(result,false);
 assert.equal(writes,0);
 assert.equal(f.invalidations(),1);
});
