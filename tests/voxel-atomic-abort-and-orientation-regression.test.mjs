import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

const cell = x => [x, 0, 0];
const initial = () => [{cell:cell(0),id:1},{cell:cell(1),id:1}];
const receipt = (x, epoch=0, turn=null) => ({
  cell:cell(x),expectedId:1,expectedRevision:0,
  expectedTurn:turn,expectedOrientationEpoch:epoch,nextId:2
});

test('successful atomic edit clears both orientations and retains legacy-only export', async () => {
  const host=createAtomicVoxelHost(initial());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(host.setOrientation(cell(0),1,0,3,null),true);
  assert.equal(host.setOrientation(cell(1),1,0,1,null),true);
  assert.equal(await bridge.editMany([receipt(0,1,3),receipt(1,1,1)]),true);
  assert.deepEqual(host.read(cell(0)),{id:2,revision:1,turn:null});
  assert.deepEqual(host.read(cell(1)),{id:2,revision:1,turn:null});
  assert.equal(host.readOrientationEpoch(cell(0)),2);
  assert.equal(host.readOrientationEpoch(cell(1)),2);
  assert.deepEqual(host.exportLegacyCells(),[{cell:cell(0),id:2},{cell:cell(1),id:2}]);
});

test('abort during asynchronous preparation never commits either cell', async () => {
  const host=createAtomicVoxelHost(initial());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  const controller=new AbortController();
  await assert.rejects(bridge.editMany([receipt(0),receipt(1)],async()=>{
    controller.abort();
  },controller.signal),{name:'AbortError'});
  assert.deepEqual(host.exportLegacyCells(),initial());
  assert.equal(host.read(cell(0)).revision,0);
  assert.equal(host.read(cell(1)).revision,0);
});

test('preparation failure cannot partially write or invalidate orientation', async () => {
  const host=createAtomicVoxelHost(initial());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(host.setOrientation(cell(1),1,0,2,null),true);
  await assert.rejects(bridge.editMany([receipt(0),receipt(1,1,2)],async()=>{
    throw new Error('preparation failed');
  }),/preparation failed/);
  assert.deepEqual(host.exportLegacyCells(),initial());
  assert.equal(host.read(cell(1)).turn,2);
  assert.equal(host.readOrientationEpoch(cell(1)),1);
});
