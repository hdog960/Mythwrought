import test from 'node:test';
import assert from 'node:assert/strict';
import {SOURCE_MAX_ECOLOGY_TIME_ADVANCE,previewSourceEcologyTick}
  from '../src/mobs/ecosystem-tick-preview.mjs';

test('original half-second boundary and early fractional ticks are non-consuming',()=>{
  assert.equal(SOURCE_MAX_ECOLOGY_TIME_ADVANCE,1);
  const input=Object.freeze({time:0,next:.5,seconds:.49});
  const early=previewSourceEcologyTick(input);
  assert.deepEqual(early,{time:.49,due:false});
  assert.equal(Object.isFrozen(early),true);
  assert.deepEqual(input,{time:0,next:.5,seconds:.49});
  assert.deepEqual(previewSourceEcologyTick({time:.49,next:.5,seconds:.01}),
    {time:.5,due:true});
});

test('original advance clamps long frame deltas to one second',()=>{
  assert.deepEqual(previewSourceEcologyTick({time:.5,next:1.5,seconds:40}),
    {time:1.5,due:true});
  assert.deepEqual(previewSourceEcologyTick({time:.5,next:1.6,seconds:40}),
    {time:1.5,due:false});
});

test('peek does not consume clock inputs, and repeated previews are stable',()=>{
  const input={time:0,next:.5,seconds:.5};
  const first=previewSourceEcologyTick(input);
  const second=previewSourceEcologyTick(input);
  assert.notEqual(first,second);
  assert.deepEqual(first,second);
  assert.equal(input.time,0);
  assert.equal(input.next,.5);
});

test('invalid, negative and nonfinite clock inputs fail before admission',()=>{
  for(const input of [null,{time:0,next:.5,seconds:NaN},
    {time:Infinity,next:.5,seconds:1},{time:0,next:-.1,seconds:1},
    {time:0,next:.5,seconds:-1},{time:'0',next:.5,seconds:.5},
    {time:1e308,next:1e308,seconds:1e308}]){
    if(input===null){
      assert.throws(()=>previewSourceEcologyTick(null),/Invalid original ecology clock preview/);
    }else if(input.time===1e308){
      assert.deepEqual(previewSourceEcologyTick(input),{time:1e308,due:true});
    }else{
      assert.throws(()=>previewSourceEcologyTick(input),/Invalid original ecology clock preview/);
    }
  }
});

test('zero-seconds due tick remains due; zero-seconds early tick remains early',()=>{
  assert.equal(previewSourceEcologyTick({time:.5,next:.5,seconds:0}).due,true);
  assert.equal(previewSourceEcologyTick({time:.49,next:.5,seconds:0}).due,false);
});
