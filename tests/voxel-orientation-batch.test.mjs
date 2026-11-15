import test from 'node:test';
import assert from 'node:assert/strict';
import {makeOrientationSidecar} from '../src/voxel-orientation-sidecar.mjs';
import {applyOrientedVoxelBatch,undoOrientedVoxelBatch,resumeOrientedVoxelUndo,redoOrientedVoxelBatch,resumeOrientedVoxelRedo} from '../src/voxel-orientation-batch.mjs';

function fixture() {
  const world=new Map([['0,0,0',4],['1,0,0',4],['2,0,0',4]]);
  const orientation=makeOrientationSidecar();
  for(let x=0;x<3;x++) orientation.set([x,0,0],4,3);
  const readBlock=(x,y,z)=>world.get([x,y,z].join(','))??0;
  const writeBlock=(x,y,z,id)=>{world.set([x,y,z].join(','),id);return true;};
  return {world,orientation,readBlock,writeBlock};
}
const edits=[{cell:[0,0,0],nextBlockId:6},{cell:[1,0,0],nextBlockId:5}];

test('batch commits ordered edits and preserves untouched orientation',()=>{
  const f=fixture();const r=applyOrientedVoxelBatch({...f,edits});
  assert.equal(r.ok,true);assert.equal(r.receipt.length,2);
  assert.equal(f.orientation.get([2,0,0],4),3);assert.equal(f.orientation.size(),1);
});
test('undo restores voxel IDs without resurrecting stale orientation',()=>{
  const f=fixture();const r=applyOrientedVoxelBatch({...f,edits});
  assert.equal(undoOrientedVoxelBatch({...f,receipt:r.receipt}).ok,true);
  assert.equal(f.readBlock(0,0,0),4);assert.equal(f.readBlock(1,0,0),4);
  assert.equal(f.orientation.get([0,0,0],4),0);
});
test('conflicting undo is rejected before any write',()=>{
  const f=fixture();const r=applyOrientedVoxelBatch({...f,edits});
  f.world.set('1,0,0',6);
  assert.equal(undoOrientedVoxelBatch({...f,receipt:r.receipt}).reason,'conflict');
  assert.equal(f.readBlock(0,0,0),6);
});
test('partial failure reports only verified earlier writes',()=>{
  const f=fixture();let n=0;
  const r=applyOrientedVoxelBatch({...f,edits,writeBlock:(...args)=>{if(++n===2) throw Error('disk');return f.writeBlock(...args);}});
  assert.equal(r.ok,false);assert.equal(r.failedIndex,1);assert.equal(r.receipt.length,1);
  assert.equal(f.readBlock(0,0,0),6);assert.equal(f.readBlock(1,0,0),4);
  assert.equal(f.orientation.get([1,0,0],4),3);
});
test('partial mutation followed by throw invalidates failed cell orientation',()=>{
  const f=fixture();let n=0;
  const r=applyOrientedVoxelBatch({...f,edits,writeBlock:(...args)=>{f.writeBlock(...args);if(++n===2) throw Error('disk');return true;}});
  assert.equal(r.ok,false);assert.equal(r.receipt.length,1);
  assert.equal(f.readBlock(1,0,0),5);assert.equal(f.orientation.get([1,0,0],4),0);
});
test('duplicate and invalid edits reject before any write',()=>{
  const f=fixture();
  assert.throws(()=>applyOrientedVoxelBatch({...f,edits:[edits[0],edits[0]]}),/Duplicate/);
  assert.throws(()=>applyOrientedVoxelBatch({...f,edits:[edits[0],{cell:[1,0,0],nextBlockId:255}]}),/Invalid/);
  assert.throws(()=>applyOrientedVoxelBatch({...f,edits,maxEdits:1}),/Invalid/);
  assert.equal(f.readBlock(0,0,0),4);
});
test('empty and negative-coordinate batches work without save payload changes',()=>{
  const f=fixture();const legacy='{"schema":1,"seed":42,"edits":[]}';
  assert.deepEqual(applyOrientedVoxelBatch({...f,edits:[]}),{ok:true,receipt:[]});
  assert.equal(applyOrientedVoxelBatch({...f,edits:[{cell:[-2,3,5],nextBlockId:6}]}).ok,true);
  assert.equal(f.readBlock(-2,3,5),6);assert.equal(legacy,'{"schema":1,"seed":42,"edits":[]}');
});
test('undo partial failure reports verified rollback and stops',()=>{
  const f=fixture();const r=applyOrientedVoxelBatch({...f,edits});let n=0;
  const undone=undoOrientedVoxelBatch({...f,receipt:r.receipt,writeBlock:(...args)=>{if(++n===2) return false;return f.writeBlock(...args);}});
  assert.equal(undone.ok,false);assert.equal(undone.reason,'partial-undo');
  assert.equal(undone.receipt.length,1);
  assert.equal(f.readBlock(1,0,0),4);assert.equal(f.readBlock(0,0,0),6);
});

test('recovery completes partial undo without replaying restored cells',()=>{
  const f=fixture();const initial=applyOrientedVoxelBatch({...f,edits});let n=0;
  const partial=undoOrientedVoxelBatch({...f,receipt:initial.receipt,writeBlock:(...args)=>{
    if(++n===2)return false;return f.writeBlock(...args);
  }});
  assert.equal(partial.reason,'partial-undo');
  const calls=[];
  const recovered=resumeOrientedVoxelUndo({...f,receipt:initial.receipt,writeBlock:(...args)=>{
    calls.push(args.slice(0,3));return f.writeBlock(...args);
  }});
  assert.equal(recovered.ok,true);assert.deepEqual(calls,[[0,0,0]]);
  assert.equal(f.readBlock(0,0,0),4);assert.equal(f.readBlock(1,0,0),4);
  assert.equal(f.orientation.get([0,0,0],4),0);
});
test('recovery rejects third-party edits before writing any cell',()=>{
  const f=fixture();const initial=applyOrientedVoxelBatch({...f,edits});
  f.world.set('1,0,0',3);let writes=0;
  const result=resumeOrientedVoxelUndo({...f,receipt:initial.receipt,writeBlock:()=>{writes++;return true;}});
  assert.equal(result.reason,'conflict');assert.equal(writes,0);
  assert.equal(f.readBlock(0,0,0),6);
});
test('recovery is idempotent after successful undo',()=>{
  const f=fixture();const initial=applyOrientedVoxelBatch({...f,edits});
  undoOrientedVoxelBatch({...f,receipt:initial.receipt});
  const result=resumeOrientedVoxelUndo({...f,receipt:initial.receipt,writeBlock:()=>{throw Error('unexpected write')}});
  assert.deepEqual(result,{ok:true,receipt:[]});
});
test('recovery rejects malformed and duplicate receipts without writing',()=>{
  const f=fixture();let writes=0;const writeBlock=()=>{writes++;return true;};
  assert.throws(()=>resumeOrientedVoxelUndo({...f,receipt:[{cell:[0,0,0],before:4,after:5},{cell:[0,0,0],before:4,after:5}],writeBlock}),/Duplicate/);
  assert.throws(()=>resumeOrientedVoxelUndo({...f,receipt:[{cell:[0,0,0],before:4,after:255}],writeBlock}),/Invalid/);
  assert.equal(writes,0);
});

test('guarded redo restores edited IDs after undo without restoring yaw',()=>{
  const f=fixture();const first=applyOrientedVoxelBatch({...f,edits});
  assert.equal(undoOrientedVoxelBatch({...f,receipt:first.receipt}).ok,true);
  const redo=redoOrientedVoxelBatch({...f,receipt:first.receipt});
  assert.equal(redo.ok,true);assert.equal(f.readBlock(0,0,0),6);
  assert.equal(f.readBlock(1,0,0),5);assert.equal(f.orientation.get([0,0,0],6),0);
});
test('redo rejects third-party conflict before any write',()=>{
  const f=fixture();const first=applyOrientedVoxelBatch({...f,edits});
  undoOrientedVoxelBatch({...f,receipt:first.receipt});
  f.world.set('1,0,0',3);let writes=0;
  const result=redoOrientedVoxelBatch({...f,receipt:first.receipt,writeBlock:()=>{writes++;return true;}});
  assert.equal(result.reason,'conflict');assert.equal(writes,0);
  assert.equal(f.readBlock(0,0,0),4);
});
test('partial redo can resume without replaying completed writes',()=>{
  const f=fixture();const first=applyOrientedVoxelBatch({...f,edits});
  undoOrientedVoxelBatch({...f,receipt:first.receipt});let n=0;
  const partial=redoOrientedVoxelBatch({...f,receipt:first.receipt,writeBlock:(...args)=>{
    if(++n===2)return false;return f.writeBlock(...args);
  }});
  assert.equal(partial.reason,'partial-redo');assert.equal(partial.receipt.length,1);
  const calls=[];const resumed=resumeOrientedVoxelRedo({...f,receipt:first.receipt,writeBlock:(...args)=>{
    calls.push(args.slice(0,3));return f.writeBlock(...args);
  }});
  assert.equal(resumed.ok,true);assert.deepEqual(calls,[[1,0,0]]);
  assert.equal(f.readBlock(0,0,0),6);assert.equal(f.readBlock(1,0,0),5);
});
test('redo recovery is repeat-safe and rejects unexpected IDs',()=>{
  const f=fixture();const first=applyOrientedVoxelBatch({...f,edits});
  undoOrientedVoxelBatch({...f,receipt:first.receipt});
  redoOrientedVoxelBatch({...f,receipt:first.receipt});
  assert.deepEqual(resumeOrientedVoxelRedo({...f,receipt:first.receipt,writeBlock:()=>{throw Error('unexpected');}}),{ok:true,receipt:[]});
  f.world.set('1,0,0',2);
  assert.equal(resumeOrientedVoxelRedo({...f,receipt:first.receipt}).reason,'conflict');
});
test('redo rejects malformed duplicate receipts and preserves schema-1 fixture',()=>{
  const f=fixture(),legacy='{"schema":1,"seed":42,"edits":[]}';
  assert.throws(()=>redoOrientedVoxelBatch({...f,receipt:[{cell:[0,0,0],before:4,after:6},{cell:[0,0,0],before:4,after:6}]}),/Duplicate/);
  assert.throws(()=>resumeOrientedVoxelRedo({...f,receipt:[{cell:[0,0,0],before:4,after:255}]}),/Invalid/);
  assert.equal(legacy,'{"schema":1,"seed":42,"edits":[]}');
});
