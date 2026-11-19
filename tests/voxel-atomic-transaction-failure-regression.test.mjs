import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

const cell = x => [x,0,0];
const initial = () => [{cell:cell(0),id:1},{cell:cell(1),id:1},{cell:cell(2),id:1}];
const receipt = x => ({cell:cell(x),expectedId:1,expectedRevision:0,
  expectedTurn:null,expectedOrientationEpoch:0,nextId:2});

test('rejected asynchronous preparation cannot partially commit or erase orientation',async()=>{
  const host=createAtomicVoxelHost(initial());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(host.setOrientation(cell(2),1,0,3,null),true);
  const before=host.exportLegacyCells();
  await assert.rejects(bridge.editMany([receipt(0),receipt(1)],async()=>{
    throw new Error('preparation failed');
  }),/preparation failed/);
  assert.deepEqual(host.exportLegacyCells(),before);
  assert.equal(host.read(cell(2)).turn,3);
  assert.equal(host.readOrientationEpoch(cell(2)),1);
  assert.equal(host.read(cell(0)).revision,0);
});

test('late stale receipt rejects whole transaction after preparation, preserving unrelated orientation',async()=>{
  const host=createAtomicVoxelHost(initial());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(await bridge.editMany([receipt(0),receipt(1)],async()=>{
    assert.equal(host.externalWrite(cell(1),1),true);
  }),false);
  assert.equal(host.read(cell(0)).revision,0);
  assert.equal(host.read(cell(0)).id,1);
  assert.equal(host.read(cell(1)).revision,1);
  assert.equal(host.readOrientationEpoch(cell(1)),1);
  assert.equal(host.read(cell(2)).revision,0);
});

test('malformed late receipt fails preflight without mutating earlier cells',()=>{
  const host=createAtomicVoxelHost(initial());
  const first=receipt(0);
  assert.throws(()=>host.compareAndWriteMany([first,{...receipt(1),nextId:255}]),TypeError);
  assert.deepEqual(host.exportLegacyCells(),initial());
  assert.equal(host.read(cell(0)).revision,0);
});

test('duplicate coordinates in an atomic batch fail before any write',()=>{
  const host=createAtomicVoxelHost(initial());
  assert.throws(()=>host.compareAndWriteMany([receipt(0),receipt(0)]),TypeError);
  assert.deepEqual(host.exportLegacyCells(),initial());
});
