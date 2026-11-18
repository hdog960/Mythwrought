import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverLegacyVoxelSession} from '../src/voxel-legacy-recovery-fixture.mjs';
import {createLeasedLegacyEditor} from '../src/voxel-lease-edit-fixture.mjs';

const cell = i => [i, -2, 7];
const receipt = (i, expectedId=1, expectedRevision=0, nextId=2) =>
  ({cell:cell(i), expectedId, expectedRevision, nextId});
const deferred = () => {
  let release;
  const promise = new Promise(resolve => {release=resolve;});
  return {promise,release};
};

test('256-cell leased transaction rejects a last-cell external write without partial edits', async () => {
  const initial=Array.from({length:256},(_,i)=>({cell:cell(i),id:1}));
  const session=recoverLegacyVoxelSession(initial);
  const editor=createLeasedLegacyEditor(session);
  for(let i=0;i<256;i++)
    assert.equal(session.setOrientation(cell(i),1,0,i%4),true);
  const gate=deferred();
  const receipts=Array.from({length:256},(_,i)=>receipt(i));
  const pending=editor.editMany(receipts,()=>gate.promise);
  assert.equal(session.edit(cell(255),1,0,4),true);
  assert.equal(session.setOrientation(cell(255),4,1,3),true);
  gate.release();
  assert.equal(await pending,false);
  for(let i=0;i<255;i++){
    assert.deepEqual(session.read(cell(i)),{id:1,revision:0});
    assert.equal(session.orientation(cell(i)),i%4);
  }
  assert.deepEqual(session.read(cell(255)),{id:4,revision:1});
  assert.equal(session.orientation(cell(255)),3);
  assert.deepEqual(session.exportLegacyCells(),initial.map((entry,i)=>
    ({cell:[...entry.cell],id:i===255?4:1})));
  const reloaded=recoverLegacyVoxelSession(session.exportLegacyCells());
  for(let i=0;i<256;i++){
    assert.equal(reloaded.orientation(cell(i)),null);
    assert.equal(reloaded.read(cell(i)).revision,0);
  }
  assert.equal(await editor.editMany(receipts),false);
  receipts[255]=receipt(255,4,1,2);
  assert.equal(await editor.editMany(receipts),true);
  for(let i=0;i<256;i++){
    assert.deepEqual(session.read(cell(i)),{id:2,revision:i===255?2:1});
    assert.equal(session.orientation(cell(i)),null);
  }
});

test('invalid 257-cell batch never calls preparation or alters legacy state', async () => {
  const initial=Array.from({length:256},(_,i)=>({cell:cell(i),id:1}));
  const session=recoverLegacyVoxelSession(initial);
  const editor=createLeasedLegacyEditor(session);
  let prepared=0;
  await assert.rejects(editor.editMany(
    Array.from({length:257},(_,i)=>receipt(i)),
    ()=>{prepared++;}
  ),/Invalid transaction/);
  assert.equal(prepared,0);
  assert.deepEqual(session.exportLegacyCells(),initial);
});
