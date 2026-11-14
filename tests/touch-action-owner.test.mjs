import test from 'node:test';
import assert from 'node:assert/strict';
import {createTouchActionOwner} from '../src/touch-action-owner.mjs';

test('a second touch on Mine or Place cannot repeat a held action',()=>{
  const action=createTouchActionOwner();
  assert.equal(action.claim(11),true);
  assert.equal(action.claim(12),false);
  assert.equal(action.release(12),false);
  assert.equal(action.active,true);
  assert.equal(action.claim(12),false);
  assert.equal(action.release(11),true);
  assert.equal(action.claim(12),true);
});
test('independent Jump and Mine buttons accept simultaneous fingers',()=>{
  const jump=createTouchActionOwner(),mine=createTouchActionOwner();
  assert.equal(jump.claim(1),true);
  assert.equal(mine.claim(2),true);
  assert.equal(jump.release(2),false);
  assert.equal(mine.release(2),true);
  assert.equal(jump.active,true);
  assert.equal(mine.claim(3),true);
});
test('blur, hidden page and touch cancellation clear owner safely',()=>{
  const action=createTouchActionOwner();
  assert.equal(action.claim(7),true);
  action.cancel();
  assert.equal(action.active,false);
  assert.equal(action.claim(8),true);
  assert.equal(action.release(8),true);
  assert.equal(action.release(8),false);
  assert.equal(action.claim(NaN),false);
});
