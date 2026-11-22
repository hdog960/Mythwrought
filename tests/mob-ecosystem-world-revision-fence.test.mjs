import test from 'node:test';
import assert from 'node:assert/strict';
import {captureOriginalWorldRevision,assertOriginalWorldRevisionUnchanged}
  from '../src/mobs/ecosystem-world-revision-fence.mjs';

test('authoritative source revision remains stable across read-only callbacks',()=>{
  const world={revision:()=>3};
  const baseline=captureOriginalWorldRevision(world);
  assert.equal(baseline,3);
  assert.equal(assertOriginalWorldRevisionUnchanged(world,baseline),true);
});

test('real source edit during first protection/census callback fails closed',()=>{
  let edits=0;
  const world={revision:()=>edits};
  const baseline=captureOriginalWorldRevision(world);
  const isProtected=()=>{edits++;return false;};
  assert.equal(isProtected(),false);
  assert.throws(()=>assertOriginalWorldRevisionUnchanged(world,baseline),
    /Original world changed during regional poll/);
});

test('changed original terrain during later physical query fails closed',()=>{
  let edits=8;
  const world={revision:()=>edits};
  const baseline=captureOriginalWorldRevision(world);
  assert.equal(assertOriginalWorldRevisionUnchanged(world,baseline),true);
  const grounded=()=>{edits++;return true;};
  assert.equal(grounded(),true);
  assert.throws(()=>assertOriginalWorldRevisionUnchanged(world,baseline),
    /Original world changed during regional poll/);
});

test('missing and invalid original revision callbacks refuse admission',()=>{
  for(const world of [{},null,{revision:0},{revision:()=>NaN},
    {revision:()=>-1},{revision:()=>Infinity},
    {revision:()=>1.5},{revision:()=>Number.MAX_SAFE_INTEGER+1}]){
    assert.throws(()=>captureOriginalWorldRevision(world),
      /Original world edit revision is required|Invalid original world revision/);
  }
});

test('forged negative or noninteger baseline cannot pass validation',()=>{
  for(const original of [-1,NaN,1.2,Infinity,'0'])
    assert.throws(()=>assertOriginalWorldRevisionUnchanged({revision:()=>0},original),
      /Invalid original world revision baseline/);
});

test('revision callback read failures remain fail-closed and do not write',()=>{
  let reads=0,writes=0;
  const world={revision(){reads++;if(reads===2)throw new Error('read failed');return 0;},
    set(){writes++;}};
  const baseline=captureOriginalWorldRevision(world);
  assert.throws(()=>assertOriginalWorldRevisionUnchanged(world,baseline),/read failed/);
  assert.equal(writes,0);
});
