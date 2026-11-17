import test from 'node:test';
import assert from 'node:assert/strict';
import {commitLeasedOrientedBatch} from '../src/voxel-leased-orientation-batch.mjs';
import {withVoxelCellLease} from '../src/voxel-cell-lease.mjs';

function fixture() {
  const values = new Map([['0,0,0',1],['1,0,0',2]]);
  const invalidated=[];
  const sidecar={get:()=>null,invalidateEdit:c=>invalidated.push(c.join(','))};
  const options={
    cells:[[0,0,0],[1,0,0]],sidecar,
    readIdentity:c=>values.get(c.join(',')),
    edit:c=>{values.set(c.join(','),3);return true;},
    rollback:(c,i)=>{values.set(c.join(','),i+1);return true;}
  };
  return {values,invalidated,options};
}

test('lease covers entire successful multi-cell batch and releases afterwards',async()=>{
  const scope={},f=fixture();
  let release,entered;
  const gate=new Promise(r=>release=r);
  const started=new Promise(r=>entered=r);
  f.options.edit=async(c)=>{entered();await gate;f.values.set(c.join(','),3);return true;};
  const pending=commitLeasedOrientedBatch(scope,f.options);
  await started;
  await assert.rejects(withVoxelCellLease(scope,[[1,0,0]],()=>true),/lease conflict/);
  release();
  assert.equal(await pending,true);
  assert.equal(await withVoxelCellLease(scope,[[1,0,0]],()=>42),42);
  assert.deepEqual(f.invalidated,['0,0,0','1,0,0']);
});

test('lease remains held through failed edit rollback, then releases',async()=>{
  const scope={},f=fixture();
  let release,entered;
  const gate=new Promise(r=>release=r);
  const started=new Promise(r=>entered=r);
  f.options.edit=(c,i)=>{if(i===1)throw Error('deliberate failure');f.values.set(c.join(','),3);return true;};
  f.options.rollback=async(c,i)=>{entered();await gate;f.values.set(c.join(','),i+1);return true;};
  const pending=commitLeasedOrientedBatch(scope,f.options);
  await started;
  await assert.rejects(withVoxelCellLease(scope,[[0,0,0]],()=>true),/lease conflict/);
  release();
  await assert.rejects(pending,/deliberate failure/);
  assert.equal(f.values.get('0,0,0'),1);
  assert.equal(await withVoxelCellLease(scope,[[0,0,0]],()=>true),true);
});

test('bad requests never mutate cells',async()=>{
  const f=fixture(),scope={};
  await assert.rejects(commitLeasedOrientedBatch(scope,{...f.options,cells:[[0,0,0],[0,0,0]]}),/Duplicate/);
  assert.equal(f.values.get('0,0,0'),1);
});
