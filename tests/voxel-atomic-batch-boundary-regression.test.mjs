import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

const cell = x => [x,0,0];
const legacy = count => Array.from({length:count},(_,x)=>({cell:cell(x),id:1}));
const receipt = (x,epoch=0) => ({cell:cell(x),expectedId:1,expectedRevision:0,
  expectedTurn:null,expectedOrientationEpoch:epoch,nextId:2});

test('maximum 256-cell transaction is all-or-nothing across final orientation ABA', async () => {
  const host=createAtomicVoxelHost(legacy(256));
  const bridge=createAuthoritativeVoxelEditBridge(host);
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  const pending=bridge.editMany(Array.from({length:256},(_,x)=>receipt(x)),()=>gate);
  await Promise.resolve();
  assert.equal(host.setOrientation(cell(255),1,0,2,null),true);
  assert.equal(host.externalWrite(cell(255),1),true);
  release();
  assert.equal(await pending,false);
  assert.deepEqual(host.exportLegacyCells(),legacy(256));
  for(let x=0;x<256;x++) assert.equal(host.read(cell(x)).id,1);
  assert.equal(host.readOrientationEpoch(cell(255)),2);
  assert.equal(host.read(cell(0)).revision,0);
});

test('receipt mutation during async preparation cannot redirect or expand the committed batch', async () => {
  const host=createAtomicVoxelHost(legacy(3));
  const bridge=createAuthoritativeVoxelEditBridge(host);
  const a=receipt(0),b=receipt(1);
  const receipts=[a,b];
  const result=await bridge.editMany(receipts,async()=>{
    a.cell[0]=2;
    a.nextId=7;
    b.expectedRevision=999;
    receipts.push(receipt(2));
    receipts.length=0;
  });
  assert.equal(result,true);
  assert.deepEqual(host.exportLegacyCells(),[
    {cell:cell(0),id:2},{cell:cell(1),id:2},{cell:cell(2),id:1}
  ]);
});

test('duplicate cell and oversized batches fail before any mutation', async () => {
  const host=createAtomicVoxelHost(legacy(257));
  const bridge=createAuthoritativeVoxelEditBridge(host);
  await assert.rejects(bridge.editMany([receipt(0),receipt(0)]),TypeError);
  await assert.rejects(bridge.editMany(Array.from({length:257},(_,x)=>receipt(x))),TypeError);
  assert.deepEqual(host.exportLegacyCells(),legacy(257));
});
