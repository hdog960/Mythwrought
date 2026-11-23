import test from 'node:test';
import assert from 'node:assert/strict';
import {captureOriginalRegionalInputs,assertOriginalRegionalInputsUnchanged}
  from '../src/mobs/ecosystem-region-input-fence.mjs';

const stable=()=>({cx:0,cz:0,section:0,feet:4});
const position=()=>[8,4,8];

test('original regional source snapshot is frozen and remains valid when unchanged',()=>{
  const region=stable(),observer=position();
  const ticket=captureOriginalRegionalInputs(region,observer);
  assert.ok(Object.isFrozen(ticket));
  assert.ok(Object.isFrozen(ticket.region));
  assert.ok(Object.isFrozen(ticket.observer));
  assert.deepEqual(ticket.region,region);
  assert.deepEqual(ticket.observer,observer);
  assert.equal(assertOriginalRegionalInputsUnchanged(ticket,region,observer),true);
});

test('changing chunk getter cannot validate chunk zero but capture chunk one',()=>{
  let reads=0;
  const region={get cx(){return ++reads===1?0:1;},cz:0,section:0,feet:4};
  assert.throws(()=>captureOriginalRegionalInputs(region,position()),
    /Original regional source inputs changed during capture/);
  assert.equal(reads,2);
});

test('changing feet getter cannot certify a different original physical floor',()=>{
  let reads=0;
  const region={...stable(),get feet(){return ++reads===1?4:12;}};
  assert.throws(()=>captureOriginalRegionalInputs(region,position()),
    /Original regional source inputs changed during capture/);
  assert.equal(reads,2);
});

test('observer getter cannot change from 8 to 100 while creating the certificate',()=>{
  let reads=0;
  const observer=position();
  Object.defineProperty(observer,0,{get(){return ++reads===1?8:100;}});
  assert.throws(()=>captureOriginalRegionalInputs(stable(),observer),
    /Original regional source inputs changed during capture/);
  assert.equal(reads,2);
});

test('field-mutation during another getter is rejected even when its own value is stable',()=>{
  const region=stable();
  Object.defineProperty(region,'cz',{get(){region.cx=1;return 0;}});
  assert.throws(()=>captureOriginalRegionalInputs(region,position()),
    /Original regional source inputs changed during capture/);
});

test('canonical source observer detects signed zero changes during capture',()=>{
  let reads=0;
  const observer=position();
  Object.defineProperty(observer,0,{get(){return ++reads===1?0:-0;}});
  assert.throws(()=>captureOriginalRegionalInputs(stable(),observer),
    /Original regional source inputs changed during capture/);
});

test('post-capture mutable region and observer still fail closed',()=>{
  const region=stable(),observer=position();
  const ticket=captureOriginalRegionalInputs(region,observer);
  region.cz=1;
  assert.throws(()=>assertOriginalRegionalInputsUnchanged(ticket,region,observer),
    /Original regional source inputs changed during poll/);
  region.cz=0;
  observer[2]=11;
  assert.throws(()=>assertOriginalRegionalInputsUnchanged(ticket,region,observer),
    /Original regional source inputs changed during poll/);
});

test('forged frozen ticket cannot manufacture original regional source ownership',()=>{
  const region=stable(),observer=position();
  const fake=Object.freeze({region:Object.freeze({...region}),
    observer:Object.freeze([...observer])});
  assert.throws(()=>assertOriginalRegionalInputsUnchanged(fake,region,observer),
    /Original regional source inputs changed during poll/);
});

test('reject invalid fields, malformed observer and bad dimensions before a ticket',()=>{
  for(const region of [null,{...stable(),cx:1.5},{...stable(),feet:Infinity}]){
    assert.throws(()=>captureOriginalRegionalInputs(region,position()),
      /Invalid original regional input snapshot/);
  }
  for(const observer of [[],[8,4],[8,NaN,8],[8,4,Infinity]]){
    assert.throws(()=>captureOriginalRegionalInputs(stable(),observer),
      /Invalid original regional input snapshot/);
  }
});

test('stable getter region retains original coordinates with two bounded reads',()=>{
  const region=stable(),reads={cx:0,cz:0,section:0,feet:0};
  for(const key of Object.keys(reads)){
    const n=region[key];
    Object.defineProperty(region,key,{get(){reads[key]++;return n;}});
  }
  const observer=position();
  const ticket=captureOriginalRegionalInputs(region,observer);
  assert.deepEqual(reads,{cx:2,cz:2,section:2,feet:2});
  assert.deepEqual(ticket.region,stable());
  assert.equal(assertOriginalRegionalInputsUnchanged(ticket,region,observer),true);
  assert.deepEqual(reads,{cx:3,cz:3,section:3,feet:3});
});
