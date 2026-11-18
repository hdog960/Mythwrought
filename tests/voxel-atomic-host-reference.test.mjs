import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtomicVoxelHost} from '../src/voxel-atomic-host-reference.mjs';
import {createAuthoritativeVoxelEditBridge} from '../src/voxel-authoritative-edit-bridge.mjs';

const cell = i => [i,0,0];
const receipt = (i,revision=0,nextId=2) =>
  ({cell:cell(i),expectedId:1,expectedRevision:revision,nextId});

test('256-cell authoritative commit clears all orientation without changing schema-1 export',async()=>{
  const legacy=Array.from({length:256},(_,i)=>({cell:cell(i),id:1}));
  const host=createAtomicVoxelHost(legacy);
  const bridge=createAuthoritativeVoxelEditBridge(host);
  for(let i=0;i<256;i++) assert.equal(host.setOrientation(cell(i),1,0,i%4),true);
  assert.equal(await bridge.editMany(legacy.map((_,i)=>receipt(i))),true);
  for(let i=0;i<256;i++) assert.deepEqual(host.read(cell(i)),{id:2,revision:1,turn:null});
  assert.deepEqual(host.exportLegacyCells(),legacy.map(x=>({cell:x.cell,id:2})));
  const reloaded=createAtomicVoxelHost(host.exportLegacyCells());
  assert.deepEqual(reloaded.read(cell(0)),{id:2,revision:0,turn:null});
});

test('external writer at final cell causes all-or-nothing rejection, then fresh retry',async()=>{
  const host=createAtomicVoxelHost(Array.from({length:256},(_,i)=>({cell:cell(i),id:1})));
  const bridge=createAuthoritativeVoxelEditBridge(host);
  host.setOrientation(cell(0),1,0,3);
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  const pending=bridge.editMany(Array.from({length:256},(_,i)=>receipt(i)),()=>gate);
  await Promise.resolve();
  assert.equal(host.externalWrite(cell(255),4),true);
  release();
  assert.equal(await pending,false);
  assert.deepEqual(host.read(cell(0)),{id:1,revision:0,turn:3});
  assert.deepEqual(host.read(cell(255)),{id:4,revision:1,turn:null});
  const retry=Array.from({length:256},(_,i)=>i===255?
    {cell:cell(i),expectedId:4,expectedRevision:1,nextId:2}:receipt(i));
  assert.equal(await bridge.editMany(retry),true);
  assert.deepEqual(host.read(cell(0)),{id:2,revision:1,turn:null});
  assert.deepEqual(host.read(cell(255)),{id:2,revision:2,turn:null});
});

test('duplicate, invalid and stale batches never partially mutate authoritative state',()=>{
  const host=createAtomicVoxelHost([{cell:cell(0),id:1},{cell:cell(1),id:1}]);
  assert.throws(()=>host.compareAndWriteMany([receipt(0),receipt(0)]),/Duplicate/);
  assert.throws(()=>host.compareAndWriteMany([receipt(0),{...receipt(1),nextId:255}]),/Invalid/);
  assert.equal(host.compareAndWriteMany([receipt(0),receipt(1,1)]),false);
  assert.deepEqual(host.exportLegacyCells(),[{cell:cell(0),id:1},{cell:cell(1),id:1}]);
  assert.equal(host.externalWrite(cell(1),3),true);
  assert.equal(host.compareAndWriteMany([receipt(0),receipt(1)]),false);
  assert.deepEqual(host.read(cell(0)),{id:1,revision:0,turn:null});
  assert.equal(host.setOrientation(cell(1),1,0,2),false);
  assert.equal(host.setOrientation(cell(1),3,1,2),true);
  assert.equal(host.externalWrite(cell(1),3),true);
  assert.equal(host.read(cell(1)).turn,null);
});

test('legacy input and exported arrays cannot alias authoritative state',()=>{
  const input=[{cell:cell(0),id:1}];
  const host=createAtomicVoxelHost(input);
  input[0].cell[0]=99;input[0].id=7;
  assert.equal(host.read(cell(0)).id,1);
  const output=host.exportLegacyCells();
  output[0].cell[0]=42;output[0].id=8;
  assert.equal(host.read(cell(0)).id,1);
});
