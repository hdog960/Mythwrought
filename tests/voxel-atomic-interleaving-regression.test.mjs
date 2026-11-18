import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

const initial = () => [{cell:[0,0,0],id:1},{cell:[1,0,0],id:1}];
const receipt = (cell, extra={}) => ({cell,expectedId:1,expectedRevision:0,nextId:2,...extra});

test('external same-ID write during async preparation invalidates entire transaction', async () => {
  const host=createAtomicVoxelHost(initial());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  let release;
  const gate=new Promise(resolve => {release=resolve;});
  const pending=bridge.editMany([receipt([0,0,0]),receipt([1,0,0])],()=>gate);
  await Promise.resolve();
  assert.equal(host.externalWrite([1,0,0],1),true);
  release();
  assert.equal(await pending,false);
  assert.deepEqual(host.exportLegacyCells(),initial());
  assert.equal(host.read([0,0,0]).revision,0);
  assert.equal(host.read([1,0,0]).revision,1);
  assert.equal(await bridge.editMany([receipt([0,0,0]),receipt([1,0,0],{expectedRevision:1})]),true);
  assert.deepEqual(host.exportLegacyCells(),[{cell:[0,0,0],id:2},{cell:[1,0,0],id:2}]);
});

test('abort during preparation prevents every write and leaves schema-1 projection untouched', async () => {
  const host=createAtomicVoxelHost(initial());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  const controller=new AbortController();
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  const pending=bridge.editMany([receipt([0,0,0]),receipt([1,0,0])],()=>gate,controller.signal);
  await Promise.resolve();
  controller.abort();
  release();
  await assert.rejects(pending,{name:'AbortError'});
  assert.deepEqual(host.exportLegacyCells(),initial());
  assert.equal(host.read([0,0,0]).revision,0);
  assert.equal(host.read([1,0,0]).revision,0);
});

test('caller mutation after submission cannot change the atomic write receipt', async () => {
  const host=createAtomicVoxelHost(initial());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  const cell=[0,0,0];
  const edits=[receipt(cell),receipt([1,0,0])];
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  const pending=bridge.editMany(edits,()=>gate);
  await Promise.resolve();
  cell[0]=100;
  edits[0].nextId=99;
  edits[1].expectedRevision=77;
  release();
  assert.equal(await pending,true);
  assert.deepEqual(host.exportLegacyCells(),[{cell:[0,0,0],id:2},{cell:[1,0,0],id:2}]);
  assert.equal(host.read([100,0,0]),null);
});
