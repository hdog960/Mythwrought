import test from 'node:test';
import assert from 'node:assert/strict';
import {captureOriginalRegionalInputs,assertOriginalRegionalInputsUnchanged}
  from '../src/mobs/ecosystem-region-input-fence.mjs';
const region=()=>({cx:0,cz:0,section:0,feet:4});
const observer=()=>[8,4,8];

test('copies original source region and observer, freezes independent values',()=>{
  const input=captureOriginalRegionalInputs(region(),observer());
  assert.equal(Object.isFrozen(input),true);
  assert.equal(Object.isFrozen(input.region),true);
  assert.equal(Object.isFrozen(input.observer),true);
  assert.deepEqual(input.region,region());
  assert.deepEqual(input.observer,observer());
});

test('unchanged source region and observer pass repeated nonmutating inspections',()=>{
  const originalRegion=region(),originalObserver=observer();
  const input=captureOriginalRegionalInputs(originalRegion,originalObserver);
  assert.equal(assertOriginalRegionalInputsUnchanged(input,originalRegion,originalObserver),true);
  assert.equal(assertOriginalRegionalInputsUnchanged(input,originalRegion,originalObserver),true);
});

test('census protection callback changing chunk or feet fails closed',()=>{
  for(const changed of [{cx:1},{cz:-1},{section:1},{feet:5}]){
    const originalRegion=region(),originalObserver=observer();
    const input=captureOriginalRegionalInputs(originalRegion,originalObserver);
    Object.assign(originalRegion,changed);
    assert.throws(()=>assertOriginalRegionalInputsUnchanged(
      input,originalRegion,originalObserver),/Original regional source inputs changed/);
    assert.equal(input.region.cx,0);
    assert.equal(input.region.feet,4);
  }
});

test('protection callback changing 3D observer position fails closed',()=>{
  for(const axis of [0,1,2]){
    const originalRegion=region(),originalObserver=observer();
    const input=captureOriginalRegionalInputs(originalRegion,originalObserver);
    originalObserver[axis]++;
    assert.throws(()=>assertOriginalRegionalInputsUnchanged(
      input,originalRegion,originalObserver),/Original regional source inputs changed/);
  }
});

test('invalid observer and nonfinite or malformed source region fail closed',()=>{
  for(const [r,o] of [[null,observer()],[region(),[8,4]],
    [region(),[8,NaN,8]],[{...region(),cx:1.5},observer()],
    [{...region(),feet:Infinity},observer()]]){
    assert.throws(()=>captureOriginalRegionalInputs(r,o),/Invalid original regional input snapshot/);
  }
});

test('frozen snapshot retains original values after caller changes its inputs',()=>{
  const originalRegion=region(),originalObserver=observer();
  const input=captureOriginalRegionalInputs(originalRegion,originalObserver);
  originalRegion.cx=24;originalObserver[0]=-100;
  assert.deepEqual(input.region,region());
  assert.deepEqual(input.observer,observer());
  assert.throws(()=>assertOriginalRegionalInputsUnchanged(input,originalRegion,originalObserver),
    /Original regional source inputs changed/);
});
