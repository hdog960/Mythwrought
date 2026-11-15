import test from 'node:test';
import assert from 'node:assert/strict';
import {makeOrientationSidecar,restoreOrientationSidecar} from '../src/voxel-orientation-sidecar.mjs';
test('round trip rotates without modifying legacy save',()=>{
 const legacy={schema:1,edits:[[1,2,3,4]]};const before=JSON.stringify(legacy);
 const world=new Map([['1,2,3',4]]);
 const s=makeOrientationSidecar();s.set([1,2,3],4,3);
 const data=s.snapshot((x,y,z)=>world.get([x,y,z].join(',')));
 assert.deepEqual(data,[{cell:[1,2,3],blockId:4,turns:3}]);
 const restored=restoreOrientationSidecar(data,(x,y,z)=>world.get([x,y,z].join(',')));
 assert.equal(restored.get([1,2,3],4),3);
 assert.equal(restored.get([1,2,3],5),0);
 assert.equal(JSON.stringify(legacy),before);
});
test('stale edited blocks cannot inherit orientation',()=>{
 const s=makeOrientationSidecar([{cell:[-1,0,2],blockId:3,turns:2}]);
 assert.deepEqual(s.snapshot(()=>0),[]);
 assert.equal(restoreOrientationSidecar(s.snapshot(()=>3),()=>4).size(),0);
 s.clear([-1,0,2]);assert.equal(s.size(),0);
});
test('rejects malformed, duplicate, unbounded, and sentinel records',()=>{
 assert.throws(()=>makeOrientationSidecar([{cell:[0,0,0],blockId:255,turns:1}]));
 assert.throws(()=>makeOrientationSidecar([{cell:[0,0,0],blockId:1,turns:0},{cell:[0,0,0],blockId:1,turns:1}]));
 const s=makeOrientationSidecar([],{maxEntries:1});s.set([0,0,0],1,0);
 assert.throws(()=>s.set([1,0,0],1,0),RangeError);
 assert.throws(()=>s.set([0,0,0],1,4));
 assert.throws(()=>restoreOrientationSidecar('bad',()=>1));
});

test('successful same-ID replacements, removals and undo invalidate orientation',()=>{
 const world=new Map([['2,0,-1',6]]);
 const read=(x,y,z)=>world.get([x,y,z].join(','))??0;
 const s=makeOrientationSidecar();
 const cell=[2,0,-1];
 s.set(cell,6,3);
 assert.equal(s.applyEdit(cell,()=>{world.set('2,0,-1',6);return true;}),true);
 assert.equal(s.get(cell,6),0,'same-ID replacement must not inherit old turns');
 s.set(cell,6,1);
 assert.equal(s.applyEdit(cell,()=>{world.delete('2,0,-1');return true;}),true);
 assert.equal(s.get(cell,6),0,'removal clears orientation');
 s.set(cell,6,2);
 assert.equal(s.invalidateEdit(cell),true,'undo must explicitly invalidate');
 assert.equal(s.invalidateEdit(cell),false,'invalidation is idempotent');
 assert.deepEqual(s.snapshot(read),[]);
});
test('failed and throwing edits preserve state, invalid edits cannot execute',()=>{
 const s=makeOrientationSidecar();
 const cell=[-4,2,9];
 s.set(cell,5,3);
 assert.equal(s.applyEdit(cell,()=>false),false);
 assert.equal(s.get(cell,5),3);
 assert.throws(()=>s.applyEdit(cell,()=>{throw new Error('world rejected edit');}),/world rejected edit/);
 assert.equal(s.get(cell,5),3);
 assert.throws(()=>s.applyEdit([0.5,0,0],()=>true),TypeError);
 assert.throws(()=>s.applyEdit(cell,null),TypeError);
 assert.equal(s.get(cell,5),3);
});

test('reconcile prunes stale orientations after legacy schema-1 recovery without changing saves',()=>{
 const legacy={schema:1,edits:[[1,2,3,4],[-1,0,2,0]]};
 const original=JSON.stringify(legacy);
 const world=new Map([['1,2,3',4],['5,0,0',7]]);
 const read=(x,y,z)=>world.get([x,y,z].join(','))??0;
 const s=makeOrientationSidecar([
  {cell:[1,2,3],blockId:4,turns:1},
  {cell:[-1,0,2],blockId:3,turns:3},
  {cell:[5,0,0],blockId:7,turns:2}
 ]);
 assert.equal(s.reconcile(read),1);
 assert.equal(s.size(),2);
 assert.equal(s.get([-1,0,2],3),0);
 assert.equal(s.get([1,2,3],4),1);
 assert.equal(s.get([5,0,0],7),2);
 assert.equal(s.reconcile(read),0,'recovery is idempotent');
 assert.equal(JSON.stringify(legacy),original,'legacy save remains byte-identical');
});
test('reconcile validates world reader and leaves state untouched on reader error',()=>{
 const s=makeOrientationSidecar([{cell:[0,0,0],blockId:2,turns:1}]);
 assert.throws(()=>s.reconcile(null),TypeError);
 assert.throws(()=>s.reconcile(()=>{throw new Error('unloaded chunk');}),/unloaded chunk/);
 assert.equal(s.get([0,0,0],2),1);
});

test('async same-ID edits invalidate only after successful commit',async()=>{
 const s=makeOrientationSidecar();
 const cell=[3,-2,5];s.set(cell,4,2);
 let commit;
 const pending=s.applyEditAsync(cell,()=>new Promise(resolve=>{commit=resolve;}));
 assert.equal(s.get(cell,4),2,'in-flight edit must not clear state');
 commit(true);
 assert.equal(await pending,true);
 assert.equal(s.get(cell,4),0,'committed replacement invalidates even same ID');
 s.set(cell,4,3);
 assert.equal(await s.applyEditAsync(cell,async()=>false),false);
 assert.equal(s.get(cell,4),3,'rejected world edit keeps rotation');
 await assert.rejects(s.applyEditAsync(cell,async()=>{throw new Error('write failed');}),/write failed/);
 assert.equal(s.get(cell,4),3,'throwing edit keeps rotation');
 await assert.rejects(s.applyEditAsync([1.5,0,0],async()=>true),TypeError);
 await assert.rejects(s.applyEditAsync(cell,null),TypeError);
});

test('late asynchronous edit cannot erase a newer orientation or undo state',async()=>{
 const s=makeOrientationSidecar(),cell=[7,1,-3];
 s.set(cell,4,1);
 let finish;
 const pending=s.applyEditAsync(cell,()=>new Promise(resolve=>{finish=resolve;}));
 s.set(cell,4,3);
 finish(true);
 assert.equal(await pending,true);
 assert.equal(s.get(cell,4),3,'late success must preserve a newer rotation');
 let finishUndo;
 const pendingUndo=s.applyEditAsync(cell,()=>new Promise(resolve=>{finishUndo=resolve;}));
 s.invalidateEdit(cell);
 s.set(cell,4,2);
 finishUndo(true);
 assert.equal(await pendingUndo,true);
 assert.equal(s.get(cell,4),2,'late success must preserve post-undo replacement');
});
