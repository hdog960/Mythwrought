import test from 'node:test';
import assert from 'node:assert/strict';
import {captureOriginalRegionalInputs,assertOriginalRegionalInputsUnchanged,
  captureOriginalRegionalSettlementInputs,assertOriginalRegionalSettlementInputsUnchanged}
  from '../src/mobs/ecosystem-region-input-fence.mjs';

const region=()=>({cx:0,cz:0,section:0,feet:4});
const observer=()=>[8,4,8];
function own(){
  const r=region(),o=observer(),captured=captureOriginalRegionalInputs(r,o);
  const witness=captureOriginalRegionalSettlementInputs(captured,r,o);
  return {r,o,captured,witness};
}
test('original source regional settlement witness is private and frozen',()=>{
  const x=own();
  assert.ok(Object.isFrozen(x.witness));
  assert.equal(assertOriginalRegionalSettlementInputsUnchanged(x.witness),true);
  assert.equal(assertOriginalRegionalInputsUnchanged(x.captured,x.r,x.o),true);
});
test('observer walking away after source preparation refuses stale original birth settlement',()=>{
  const x=own();x.o[0]=100;
  assert.throws(()=>assertOriginalRegionalSettlementInputsUnchanged(x.witness),
    /Original regional source inputs changed during poll/);
});
test('changing source chunk after candidate preparation refuses a stale regional ledger',()=>{
  const x=own();x.r.cx=1;
  assert.throws(()=>assertOriginalRegionalSettlementInputsUnchanged(x.witness),
    /Original regional source inputs changed during poll/);
});
test('changed surface floor/section after source preparation refuses settlement',()=>{
  const x=own();x.r.feet=12;
  assert.throws(()=>assertOriginalRegionalSettlementInputsUnchanged(x.witness),
    /Original regional source inputs changed during poll/);
  x.r.feet=4;x.r.section=-1;
  assert.throws(()=>assertOriginalRegionalSettlementInputsUnchanged(x.witness),
    /Original regional source inputs changed during poll/);
});
test('late signed-zero observer change is detected',()=>{
  const x=own();x.o[0]=-0;
  assert.throws(()=>assertOriginalRegionalSettlementInputsUnchanged(x.witness),
    /Original regional source inputs changed during poll/);
});
test('a forged frozen settlement witness cannot be used for natural admission',()=>{
  const x=own();
  for(const invalid of [null,{},Object.freeze({}),
    Object.freeze({...x.witness}),Object.freeze({captured:x.captured,region:x.r,observer:x.o})]){
    assert.throws(()=>assertOriginalRegionalSettlementInputsUnchanged(invalid),
      /Uncertified original regional settlement inputs/);
  }
});
test('a forged source snapshot cannot bind to real mutable player coordinates',()=>{
  const r=region(),o=observer();
  const source=Object.freeze({region:Object.freeze({...r}),observer:Object.freeze([...o])});
  assert.throws(()=>captureOriginalRegionalSettlementInputs(source,r,o),
    /Original regional source inputs changed during poll/);
});
test('capture itself refuses stale regional input identity before making witness',()=>{
  const r=region(),o=observer(),captured=captureOriginalRegionalInputs(r,o);
  r.cz=7;
  assert.throws(()=>captureOriginalRegionalSettlementInputs(captured,r,o),
    /Original regional source inputs changed during poll/);
});
test('source getter mutation during witness binding is rejected',()=>{
  const r=region(),o=observer(),captured=captureOriginalRegionalInputs(r,o);
  let reads=0;
  Object.defineProperty(r,'cx',{get(){return ++reads===1?0:1;}});
  // The first read can look unchanged, but caller is no longer a stable
  // source: a second assert at settle will catch the drift.
  const witness=captureOriginalRegionalSettlementInputs(captured,r,o);
  assert.throws(()=>assertOriginalRegionalSettlementInputsUnchanged(witness),
    /Original regional source inputs changed during poll/);
});
test('local observer copies cannot replace the certified original live source',()=>{
  const x=own(),other=[...x.o];
  x.o[2]=200;
  assert.throws(()=>assertOriginalRegionalSettlementInputsUnchanged(x.witness),
    /Original regional source inputs changed during poll/);
  // The detached snapshot is unchanged and valid for its OWN frozen state,
  // but cannot certify the original caller after it changed.
  assert.deepEqual(other,[8,4,8]);
  assert.deepEqual(x.captured.observer,[8,4,8]);
});
