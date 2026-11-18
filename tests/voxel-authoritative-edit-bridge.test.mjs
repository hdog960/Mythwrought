import test from 'node:test';
import assert from 'node:assert/strict';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

// Fixture models the minimum authoritative host contract, not live wiring.
function hostFixture() {
  const states = new Map([['0,0,0',{id:1,revision:0,turn:2}],
    ['1,0,0',{id:1,revision:0,turn:3}],['2,0,0',{id:1,revision:0,turn:1}]]);
  const key = c => c.join(',');
  const read = c => {const s=states.get(key(c));return s && {...s};};
  const compareAndWriteMany = receipts => {
    if (receipts.some(r => {const s=read(r.cell);return !s ||
      s.id!==r.expectedId || s.revision!==r.expectedRevision;})) return false;
    for (const r of receipts) {
      const s=states.get(key(r.cell));
      states.set(key(r.cell),{id:r.nextId,revision:s.revision+1,turn:null});
    }
    return true;
  };
  return {read,compareAndWriteMany,externalWrite(c,id) {
    const s=states.get(key(c));states.set(key(c),{id,revision:s.revision+1,turn:null});
  }};
}
const cell = i => [i,0,0];
const receipt = i => ({cell:cell(i),expectedId:1,expectedRevision:0,nextId:2});

test('authoritative atomic host rejects external writer after preparation without partial writes',async()=>{
  const host=hostFixture(),bridge=createAuthoritativeVoxelEditBridge(host);
  let release;const gate=new Promise(resolve=>{release=resolve;});
  const pending=bridge.editMany([receipt(0),receipt(1)],()=>gate);
  await Promise.resolve();
  host.externalWrite(cell(1),4);
  release();
  assert.equal(await pending,false);
  assert.deepEqual(host.read(cell(0)),{id:1,revision:0,turn:2});
  assert.deepEqual(host.read(cell(1)),{id:4,revision:1,turn:null});
  assert.deepEqual(host.read(cell(2)),{id:1,revision:0,turn:1});
  assert.equal(await bridge.editMany([
    receipt(0),{cell:cell(1),expectedId:4,expectedRevision:1,nextId:2}
  ]),true);
  assert.equal(host.read(cell(0)).turn,null);
  assert.equal(host.read(cell(1)).turn,null);
  assert.equal(host.read(cell(2)).turn,1);
});

test('snapshots untrusted receipts across asynchronous preparation',async()=>{
  const host=hostFixture(),bridge=createAuthoritativeVoxelEditBridge(host);
  const r=receipt(0);
  let release;const gate=new Promise(resolve=>{release=resolve;});
  const pending=bridge.editMany([r],()=>gate);
  r.cell[0]=2;r.nextId=8;r.expectedRevision=77;
  release();
  assert.equal(await pending,true);
  assert.equal(host.read(cell(0)).id,2);
  assert.equal(host.read(cell(2)).id,1);
});

test('rejects invalid receipts, missing atomic host, stale revisions and aborted edits',async()=>{
  assert.throws(()=>createAuthoritativeVoxelEditBridge({read:()=>({id:1})}),TypeError);
  const host=hostFixture(),bridge=createAuthoritativeVoxelEditBridge(host);
  await assert.rejects(bridge.editMany([receipt(0),receipt(0)]),TypeError);
  await assert.rejects(bridge.editMany([{...receipt(0),nextId:255}]),TypeError);
  const controller=new AbortController();
  const pending=bridge.editMany([receipt(0)],()=>{controller.abort();},controller.signal);
  await assert.rejects(pending,{name:'AbortError'});
  assert.deepEqual(host.read(cell(0)),{id:1,revision:0,turn:2});
  host.externalWrite(cell(0),1);
  assert.equal(await bridge.editMany([receipt(0)]),false);
});
