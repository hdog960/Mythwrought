import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

// :00 opt-in regression: caller-owned receipts must never mutate a pending
// authoritative transaction, including its expected orientation precondition.
test('pending transaction snapshots cell, IDs, revision and expected turn', async () => {
  const host=createAtomicVoxelHost([{cell:[8,-3,12],id:1}]);
  assert.equal(host.setOrientation([8,-3,12],1,0,2,null),true);
  const bridge=createAuthoritativeVoxelEditBridge(host);
  const r={cell:[8,-3,12],expectedId:1,expectedRevision:0,expectedTurn:2,nextId:3};
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  const pending=bridge.editMany([r],()=>gate);
  await Promise.resolve();
  r.cell[0]=999;
  r.expectedId=4;
  r.expectedRevision=9;
  r.expectedTurn=1;
  r.nextId=5;
  release();
  assert.equal(await pending,true);
  assert.deepEqual(host.read([8,-3,12]),{id:3,revision:1,turn:null});
  assert.equal(host.read([999,-3,12]),null);
});

test('abort between prepare and final atomic write preserves old-world cells',async()=>{
  const host=createAtomicVoxelHost([{cell:[0,0,0],id:1},{cell:[1,0,0],id:2}]);
  const bridge=createAuthoritativeVoxelEditBridge(host);
  const controller=new AbortController();
  const before=JSON.stringify(host.exportLegacyCells());
  await assert.rejects(bridge.editMany([
    {cell:[0,0,0],expectedId:1,expectedRevision:0,expectedTurn:null,nextId:3},
    {cell:[1,0,0],expectedId:2,expectedRevision:0,expectedTurn:null,nextId:4}
  ],()=>controller.abort(),controller.signal),{name:'AbortError'});
  assert.equal(JSON.stringify(host.exportLegacyCells()),before);
  assert.deepEqual(host.read([0,0,0]),{id:1,revision:0,turn:null});
  assert.deepEqual(host.read([1,0,0]),{id:2,revision:0,turn:null});
});

test('legacy schema-1 roundtrip excludes orientation and edit revisions',()=>{
  const host=createAtomicVoxelHost([{cell:[-2,-210,7],id:6}]);
  assert.equal(host.setOrientation([-2,-210,7],6,0,3,null),true);
  const json=JSON.stringify(host.exportLegacyCells());
  assert.equal(json,'[{"cell":[-2,-210,7],"id":6}]');
  const recovered=createAtomicVoxelHost(JSON.parse(json));
  assert.deepEqual(recovered.read([-2,-210,7]),{id:6,revision:0,turn:null});
});
