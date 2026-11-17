import test from 'node:test';
import assert from 'node:assert/strict';
import {withVoxelCellLease} from '../src/voxel-cell-lease.mjs';
const a=[1,2,3], b=[2,2,3], c=[3,2,3];
test('overlapping host-scoped writers fail closed even across separate adapters', async () => {
  const host={}; let release;
  const gate=new Promise(resolve=>{release=resolve;});
  const first=withVoxelCellLease(host,[a,b],async()=>{await gate;return 7;});
  await assert.rejects(withVoxelCellLease(host,[b,c],()=>true),/lease conflict/);
  assert.equal(await withVoxelCellLease(host,[c],()=>9),9);
  release();assert.equal(await first,7);
  assert.equal(await withVoxelCellLease(host,[b],()=>11),11);
});
test('rejection and thrown callbacks release every cell', async()=>{
  const host={};
  await assert.rejects(withVoxelCellLease(host,[a,b],async()=>{throw Error('edit failed');}),/edit failed/);
  assert.equal(await withVoxelCellLease(host,[b,a],()=>true),true);
});
test('separate worlds do not block one another', async()=>{
  const host1={},host2={};let release;
  const gate=new Promise(resolve=>{release=resolve;});
  const pending=withVoxelCellLease(host1,[a],()=>gate);
  assert.equal(await withVoxelCellLease(host2,[a],()=>42),42);
  release();await pending;
});
test('invalid, duplicate and oversized requests cannot execute callback',async()=>{
  const host={};let called=false;
  for(const cells of [[a,a],[[1,2,Infinity]],[],Array.from({length:257},(_,i)=>[i,0,0])])
    await assert.rejects(withVoxelCellLease(host,cells,()=>{called=true;}));
  assert.equal(called,false);
});
