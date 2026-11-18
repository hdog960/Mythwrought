import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

const initial=()=>[{cell:[0,0,0],id:1},{cell:[1,0,0],id:1},{cell:[2,0,0],id:1}];
const receipt=(x,revision=0,epoch=0,turn=null)=>({
  cell:[x,0,0],expectedId:1,expectedRevision:revision,
  expectedOrientationEpoch:epoch,expectedTurn:turn,nextId:2
});
test('stale orientation epoch on final cell rejects whole three-cell transaction',async()=>{
  const host=createAtomicVoxelHost(initial());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(host.setOrientation([2,0,0],1,0,1),true);
  const epoch=host.readOrientationEpoch([2,0,0]);
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  const pending=bridge.editMany([receipt(0),receipt(1),receipt(2,0,epoch,1)],()=>gate);
  await Promise.resolve();
  assert.equal(host.setOrientation([2,0,0],1,0,2,1),true);
  assert.equal(host.setOrientation([2,0,0],1,0,1,2),true);
  release();
  assert.equal(await pending,false);
  assert.deepEqual(host.exportLegacyCells(),initial());
  for(let x=0;x<3;x++) assert.equal(host.read([x,0,0]).revision,0);
  assert.equal(await bridge.editMany([receipt(0),receipt(1),receipt(2,0,epoch+2,1)]),true);
  assert.deepEqual(host.exportLegacyCells(),initial().map(e=>({...e,id:2})));
  for(let x=0;x<3;x++) assert.equal(host.read([x,0,0]).turn,null);
});
test('invalid or duplicate receipts never partially mutate legacy cells',async()=>{
  const host=createAtomicVoxelHost(initial());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  await assert.rejects(bridge.editMany([receipt(0),receipt(0)]),TypeError);
  await assert.rejects(bridge.editMany([receipt(0),{...receipt(1),nextId:255}]),TypeError);
  assert.equal(await bridge.editMany([receipt(0),receipt(1),receipt(2,1)]),false);
  assert.deepEqual(host.exportLegacyCells(),initial());
  for(let x=0;x<3;x++) assert.equal(host.read([x,0,0]).revision,0);
});
test('failed asynchronous preparation never commits or changes legacy projection',async()=>{
  const host=createAtomicVoxelHost(initial());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  await assert.rejects(bridge.editMany([receipt(0),receipt(1)],async()=>{
    throw new Error('preparation failed');
  }),/preparation failed/);
  assert.deepEqual(host.exportLegacyCells(),initial());
  assert.equal(JSON.stringify(host.exportLegacyCells()),JSON.stringify(initial()));
});
