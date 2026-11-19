import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

const at = x => [x,0,0];
const start = () => [{cell:at(0),id:1},{cell:at(1),id:1}];
const receipt = (x, epoch=0, turn=null, nextId=2) => ({
  cell:at(x),expectedId:1,expectedRevision:0,
  expectedTurn:turn,expectedOrientationEpoch:epoch,nextId
});

test('orientation-only ABA during async preparation invalidates entire transaction', async () => {
  const host=createAtomicVoxelHost(start());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(await bridge.editMany([receipt(0),receipt(1)],async()=>{
    assert.equal(host.setOrientation(at(1),1,0,2,null),true);
    assert.equal(host.setOrientation(at(1),1,0,0,2),true);
  }),false);
  assert.deepEqual(host.exportLegacyCells(),start());
  assert.equal(host.read(at(0)).revision,0);
  assert.equal(host.read(at(1)).revision,0);
  assert.equal(host.readOrientationEpoch(at(1)),2);
  assert.equal(host.read(at(1)).turn,0);
});

test('same-ID external replacement invalidates stale orientation and rejects atomic edit',async()=>{
  const host=createAtomicVoxelHost(start());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  assert.equal(host.setOrientation(at(0),1,0,3,null),true);
  assert.equal(await bridge.editMany([receipt(0,1,3),receipt(1)],async()=>{
    assert.equal(host.externalWrite(at(0),1),true);
  }),false);
  assert.deepEqual(host.exportLegacyCells(),start());
  assert.deepEqual(host.read(at(0)),{id:1,revision:1,turn:null});
  assert.equal(host.readOrientationEpoch(at(0)),2);
  assert.equal(host.read(at(1)).revision,0);
});

test('mutating caller receipts during preparation cannot redirect the atomic write',async()=>{
  const host=createAtomicVoxelHost(start());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  const edits=[receipt(0),receipt(1)];
  assert.equal(await bridge.editMany(edits,async()=>{
    edits[0].cell[0]=999;
    edits[0].nextId=7;
    edits[1].expectedRevision=99;
    edits.pop();
  }),true);
  assert.deepEqual(host.exportLegacyCells(),[{cell:at(0),id:2},{cell:at(1),id:2}]);
});

test('pre-aborted edit never invokes preparation or writes',async()=>{
  const host=createAtomicVoxelHost(start());
  const bridge=createAuthoritativeVoxelEditBridge(host);
  const abort=new AbortController();
  abort.abort();
  let prepared=false;
  await assert.rejects(bridge.editMany([receipt(0)],()=>{prepared=true;},abort.signal),{name:'AbortError'});
  assert.equal(prepared,false);
  assert.deepEqual(host.exportLegacyCells(),start());
});
