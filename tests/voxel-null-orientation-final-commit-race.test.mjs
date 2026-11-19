import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

const initial = () => [{cell:[0,0,0],id:1},{cell:[1,0,0],id:1}];
const receipt = x => ({cell:[x,0,0],expectedId:1,expectedRevision:0,expectedTurn:null,nextId:2});
const deferred = () => {
  let release;
  const promise = new Promise(resolve => { release = resolve; });
  return {promise,release};
};

test('explicit null orientation is a final-commit precondition, not a wildcard', async () => {
  const host=createAtomicVoxelHost(initial());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  const wait=deferred();
  const pending=bridge.editMany([receipt(0),receipt(1)],()=>wait.promise);
  await Promise.resolve();
  assert.equal(host.setOrientation([1,0,0],1,0,2,null),true);
  wait.release();
  assert.equal(await pending,false);
  assert.deepEqual(host.exportLegacyCells(),initial());
  assert.equal(host.read([0,0,0]).revision,0);
  assert.equal(host.read([1,0,0]).revision,0);
  assert.equal(host.read([1,0,0]).turn,2);
});

test('null orientation receipt succeeds only after a fresh null-state snapshot', async () => {
  const host=createAtomicVoxelHost(initial());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(host.setOrientation([1,0,0],1,0,3,null),true);
  assert.equal(await bridge.editMany([receipt(0),receipt(1)]),false);
  assert.equal(host.externalWrite([1,0,0],1),true);
  const refreshed=[receipt(0),{...receipt(1),expectedRevision:1}];
  assert.equal(await bridge.editMany(refreshed),true);
  assert.deepEqual(host.exportLegacyCells(),[{cell:[0,0,0],id:2},{cell:[1,0,0],id:2}]);
  assert.equal(host.read([1,0,0]).turn,null);
});

test('legacy orientation-free cells retain schema-1-shaped exports', () => {
  const host=createAtomicVoxelHost(initial());
  assert.deepEqual(host.exportLegacyCells(),initial());
  assert.equal(JSON.stringify(host.exportLegacyCells()).includes('turn'),false);
  assert.equal(JSON.stringify(host.exportLegacyCells()).includes('orientationEpoch'),false);
});
