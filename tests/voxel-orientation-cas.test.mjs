import test from 'node:test';
import assert from 'node:assert/strict';
import {commitOrientedCAS} from '../src/voxel-orientation-cas.mjs';

const setup = () => {
  const state={id:2,revision:0,orientation:1};
  const invalidated=[];
  const sidecar={invalidateEdit:c=>invalidated.push([...c])};
  const readSnapshot=async()=>({...state});
  const compareAndSwap=async(_cell,expected,next)=>{
    if (expected.revision!==state.revision || expected.id!==state.id ||
        expected.orientation!==state.orientation) return {ok:false};
    Object.assign(state,next,{revision:state.revision+1});
    return {ok:true,revision:state.revision};
  };
  return {state,invalidated,sidecar,readSnapshot,compareAndSwap};
};
test('atomic oriented edit invalidates stale cached orientation',async()=>{
  const s=setup();
  assert.equal(await commitOrientedCAS({...s,cell:[0,0,0],next:()=>({id:3,orientation:2})}),true);
  assert.deepEqual(s.state,{id:3,revision:1,orientation:2});
  assert.deepEqual(s.invalidated,[[0,0,0]]);
});
test('foreign edit during async preflight is never overwritten',async()=>{
  const s=setup();
  const compareAndSwap=async(c,expected,next)=>{
    s.state.orientation=3;s.state.revision++;
    return s.compareAndSwap(c,expected,next);
  };
  assert.equal(await commitOrientedCAS({...s,compareAndSwap,cell:[1,0,0],
    next:()=>({id:4,orientation:0})}),false);
  assert.deepEqual(s.state,{id:2,revision:1,orientation:3});
  assert.equal(s.invalidated.length,1);
});
test('old orientation snapshot remains safe and malformed receipts fail closed',async()=>{
  const s=setup();
  await assert.rejects(commitOrientedCAS({...s,cell:[0,0,0],
    compareAndSwap:async()=>({ok:true,revision:0}),
    next:()=>({id:2,orientation:0})}),/revision receipt/);
  assert.equal(s.state.orientation,1);
  assert.equal(s.invalidated.length,1);
});
test('invalid proposed state never reaches writer',async()=>{
  const s=setup();let writes=0;
  await assert.rejects(commitOrientedCAS({...s,cell:[0,0,0],
    compareAndSwap:async()=>{writes++;return {ok:true,revision:1};},
    next:()=>({id:255,orientation:4})}),/proposed state/);
  assert.equal(writes,0);
});
test('host errors invalidate sidecar without pretending rollback',async()=>{
  const s=setup();
  await assert.rejects(commitOrientedCAS({...s,cell:[0,0,0],
    compareAndSwap:async()=>{throw new Error('host offline');},
    next:()=>({id:2,orientation:2})}),/host offline/);
  assert.equal(s.invalidated.length,1);
});

test('explicit legacy full-cube snapshot recovers default orientation without changing schema-1',async()=>{
  const s=setup();
  const readSnapshot=async()=>({id:2,revision:0,legacyFullCube:true});
  assert.equal(await commitOrientedCAS({...s,readSnapshot,cell:[4,0,0],
    next:before=>{assert.equal(before.orientation,0);return {id:2,orientation:2};},
    compareAndSwap:async(_cell,expected,next)=>{
      assert.equal(expected.orientation,0);
      assert.equal(expected.legacyFullCube,true);
      Object.assign(s.state,next,{revision:1});
      return {ok:true,revision:1};
    }}),true);
  assert.equal(s.state.orientation,2);
  assert.deepEqual(s.invalidated,[[4,0,0]]);
});
test('missing orientation without explicit legacy marker fails closed and invalidates',async()=>{
  const s=setup();let writes=0;
  await assert.rejects(commitOrientedCAS({...s,cell:[5,0,0],
    readSnapshot:async()=>({id:2,revision:0}),
    compareAndSwap:async()=>{writes++;return {ok:true,revision:1};},
    next:()=>({id:2,orientation:0})}),/original snapshot/);
  assert.equal(writes,0);
  assert.deepEqual(s.invalidated,[[5,0,0]]);
});
test('failed old-save snapshot read invalidates cached orientation',async()=>{
  const s=setup();
  await assert.rejects(commitOrientedCAS({...s,cell:[6,0,0],
    readSnapshot:async()=>{throw new Error('corrupt old save');},
    next:()=>({id:2,orientation:1})}),/corrupt old save/);
  assert.deepEqual(s.invalidated,[[6,0,0]]);
});
