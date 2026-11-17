import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverLegacyVoxelSession} from '../src/voxel-legacy-recovery-fixture.mjs';
import {createLeasedLegacyEditor} from '../src/voxel-lease-edit-fixture.mjs';
import {VoxelCellLeaseConflictError} from '../src/voxel-cell-lease.mjs';

const entry = (x,id=1) => ({cell:[x,0,0],id});
const receipt = (x,id=1,rev=0,next=2) =>
  ({cell:[x,0,0],expectedId:id,expectedRevision:rev,nextId:next});
const gate = () => {
  let release;
  const pending = new Promise(resolve => { release=resolve; });
  return {pending,release};
};

test('overlapping asynchronous edits fail closed; release restores progress', async () => {
  const session=recoverLegacyVoxelSession([entry(0),entry(1)]);
  const scope={};
  const a=createLeasedLegacyEditor(session,scope);
  const b=createLeasedLegacyEditor(session,scope);
  assert.equal(session.setOrientation([0,0,0],1,0,3),true);
  const g=gate();
  const pending=a.editMany([receipt(0)],()=>g.pending);
  await assert.rejects(b.editMany([receipt(0)]),VoxelCellLeaseConflictError);
  assert.deepEqual(a.read([0,0,0]),{id:1,revision:0});
  assert.equal(a.orientation([0,0,0]),3);
  assert.equal(await b.editMany([receipt(1)]),true);
  g.release();
  assert.equal(await pending,true);
  assert.equal(a.orientation([0,0,0]),null);
  assert.equal(await b.editMany([receipt(0,2,1,3)]),true);
});

test('callback failure releases leases without editing cells or orientation', async () => {
  const s=recoverLegacyVoxelSession([entry(0)]);
  const a=createLeasedLegacyEditor(s);
  s.setOrientation([0,0,0],1,0,2);
  await assert.rejects(a.editMany([receipt(0)],async()=>{throw Error('interrupted');}),/interrupted/);
  assert.deepEqual(s.read([0,0,0]),{id:1,revision:0});
  assert.equal(s.orientation([0,0,0]),2);
  assert.equal(await a.editMany([receipt(0)]),true);
});

test('caller mutation while awaiting cannot redirect or change edit receipt', async () => {
  const s=recoverLegacyVoxelSession([entry(0),entry(1)]);
  const a=createLeasedLegacyEditor(s);
  const r=receipt(0), g=gate();
  const pending=a.editMany([r],()=>g.pending);
  r.cell[0]=1; r.nextId=9; r.expectedRevision=99;
  g.release();
  assert.equal(await pending,true);
  assert.deepEqual(s.read([0,0,0]),{id:2,revision:1});
  assert.deepEqual(s.read([1,0,0]),{id:1,revision:0});
});

test('stale batch never partially commits or invalidates orientation', async () => {
  const s=recoverLegacyVoxelSession([entry(0),entry(1)]);
  const a=createLeasedLegacyEditor(s);
  s.setOrientation([0,0,0],1,0,1);
  assert.equal(await a.editMany([receipt(0),receipt(1,1,7)]),false);
  assert.equal(s.orientation([0,0,0]),1);
  assert.deepEqual(s.exportLegacyCells(),[entry(0),entry(1)]);
  assert.deepEqual(recoverLegacyVoxelSession(s.exportLegacyCells()).read([0,0,0]),{id:1,revision:0});
});

test('independent default editors on one session share leases and cannot overlap', async () => {
  const session=recoverLegacyVoxelSession([entry(0),entry(1)]);
  const first=createLeasedLegacyEditor(session);
  const second=createLeasedLegacyEditor(session);
  const g=gate();
  const pending=first.editMany([receipt(0)],()=>g.pending);
  await assert.rejects(second.editMany([receipt(0)]),VoxelCellLeaseConflictError);
  assert.deepEqual(second.read([0,0,0]),{id:1,revision:0});
  assert.equal(await second.editMany([receipt(1)]),true);
  g.release();
  assert.equal(await pending,true);
  assert.equal(await second.editMany([receipt(0,2,1,3)]),true);
});

test('default lease scopes remain independent for distinct recovered worlds', async () => {
  const worldA=recoverLegacyVoxelSession([entry(0)]);
  const worldB=recoverLegacyVoxelSession([entry(0)]);
  const first=createLeasedLegacyEditor(worldA);
  const second=createLeasedLegacyEditor(worldB);
  const g=gate();
  const pending=first.editMany([receipt(0)],()=>g.pending);
  assert.equal(await second.editMany([receipt(0)]),true);
  g.release();
  assert.equal(await pending,true);
  assert.deepEqual(worldA.read([0,0,0]),{id:2,revision:1});
  assert.deepEqual(worldB.read([0,0,0]),{id:2,revision:1});
});

test('abort releases pending lease and never commits after late preparation', async () => {
  const s=recoverLegacyVoxelSession([entry(0)]);
  const editor=createLeasedLegacyEditor(s);
  assert.equal(s.setOrientation([0,0,0],1,0,2),true);
  const controller=new AbortController(), g=gate();
  const pending=editor.editMany([receipt(0)],()=>g.pending,controller.signal);
  await assert.rejects(editor.editMany([receipt(0)]),VoxelCellLeaseConflictError);
  controller.abort();
  await assert.rejects(pending,{name:'AbortError'});
  assert.deepEqual(s.read([0,0,0]),{id:1,revision:0});
  assert.equal(s.orientation([0,0,0]),2);
  g.release();
  await Promise.resolve();
  assert.deepEqual(s.read([0,0,0]),{id:1,revision:0});
  assert.equal(await editor.editMany([receipt(0)]),true);
  assert.equal(s.orientation([0,0,0]),null);
});

test('already-aborted edit cannot mutate or poison a lease', async () => {
  const s=recoverLegacyVoxelSession([entry(0)]);
  const editor=createLeasedLegacyEditor(s);
  const controller=new AbortController();
  controller.abort();
  let called=false;
  await assert.rejects(editor.editMany([receipt(0)],()=>{called=true;},controller.signal),{name:'AbortError'});
  assert.equal(called,false);
  assert.deepEqual(s.read([0,0,0]),{id:1,revision:0});
  assert.equal(await editor.editMany([receipt(0)]),true);
});

test('interrupted stale receipt stays rejected after another edit and recovery', async () => {
  const s=recoverLegacyVoxelSession([entry(0)]);
  const editor=createLeasedLegacyEditor(s), g=gate(), controller=new AbortController();
  const pending=editor.editMany([receipt(0)],()=>g.pending,controller.signal);
  controller.abort();
  await assert.rejects(pending,{name:'AbortError'});
  assert.equal(await editor.editMany([receipt(0)]),true);
  g.release();
  await Promise.resolve();
  assert.deepEqual(s.read([0,0,0]),{id:2,revision:1});
  assert.equal(await editor.editMany([receipt(0)]),false);
  const restored=recoverLegacyVoxelSession(s.exportLegacyCells());
  assert.deepEqual(restored.read([0,0,0]),{id:2,revision:0});
  assert.equal(restored.orientation([0,0,0]),null);
});

test('abort before queued preparation suppresses callback side effects', async () => {
  const s=recoverLegacyVoxelSession([entry(0)]);
  const editor=createLeasedLegacyEditor(s);
  const controller=new AbortController();
  let preparations=0;
  const pending=editor.editMany([receipt(0)],()=>{preparations++;},controller.signal);
  controller.abort();
  await assert.rejects(pending,{name:'AbortError'});
  assert.equal(preparations,0);
  assert.deepEqual(s.read([0,0,0]),{id:1,revision:0});
  assert.equal(await editor.editMany([receipt(0)]),true);
});

test('cancelled multi-cell preparation cannot invalidate either orientation', async () => {
  const s=recoverLegacyVoxelSession([entry(0),entry(1)]);
  const editor=createLeasedLegacyEditor(s), controller=new AbortController(), g=gate();
  assert.equal(s.setOrientation([0,0,0],1,0,1),true);
  assert.equal(s.setOrientation([1,0,0],1,0,3),true);
  const pending=editor.editMany([receipt(0),receipt(1)],()=>g.pending,controller.signal);
  controller.abort();
  await assert.rejects(pending,{name:'AbortError'});
  assert.deepEqual(s.exportLegacyCells(),[entry(0),entry(1)]);
  assert.equal(editor.orientation([0,0,0]),1);
  assert.equal(editor.orientation([1,0,0]),3);
  assert.equal(await editor.editMany([receipt(1)]),true);
  assert.equal(editor.orientation([0,0,0]),1);
  assert.equal(editor.orientation([1,0,0]),null);
  g.release();
});

test('stale receipt rejects before preparation and leaves orientation intact', async () => {
  const s=recoverLegacyVoxelSession([entry(0),entry(1)]);
  const editor=createLeasedLegacyEditor(s);
  assert.equal(s.setOrientation([0,0,0],1,0,3),true);
  let preparations=0;
  assert.equal(await editor.editMany([receipt(0,1,7),receipt(1)],()=>{preparations++;}),false);
  assert.equal(preparations,0);
  assert.deepEqual(s.exportLegacyCells(),[entry(0),entry(1)]);
  assert.equal(editor.orientation([0,0,0]),3);
  assert.equal(await editor.editMany([receipt(0)]),true);
});

test('invalid and duplicate receipts never enter asynchronous preparation', async () => {
  const s=recoverLegacyVoxelSession([entry(0)]);
  const editor=createLeasedLegacyEditor(s);
  let preparations=0;
  const prepare=()=>{preparations++;};
  await assert.rejects(editor.editMany([receipt(0),receipt(0)],prepare),/Duplicate/);
  await assert.rejects(editor.editMany([{...receipt(0),nextId:255}],prepare),/Invalid edit receipt/);
  assert.equal(preparations,0);
  assert.deepEqual(s.read([0,0,0]),{id:1,revision:0});
});

test('external edit during async preparation fails final CAS without clearing new orientation', async () => {
  const s=recoverLegacyVoxelSession([entry(0)]);
  const editor=createLeasedLegacyEditor(s), g=gate();
  const pending=editor.editMany([receipt(0)],()=>g.pending);
  assert.equal(s.edit([0,0,0],1,0,3),true);
  assert.equal(s.setOrientation([0,0,0],3,1,2),true);
  g.release();
  assert.equal(await pending,false);
  assert.deepEqual(editor.read([0,0,0]),{id:3,revision:1});
  assert.equal(editor.orientation([0,0,0]),2);
});
