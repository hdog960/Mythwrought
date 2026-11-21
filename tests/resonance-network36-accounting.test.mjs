import test from 'node:test';
import assert from 'node:assert/strict';
import {solveResonance} from '../src/resonance/network36/solver.mjs';
const anchor={x:0,y:0,z:0};
const channel={id:'channel',kind:'channel',anchor};
const store=(id,charge)=>({id,anchor,capacity:charge,charge,maxInput:0,maxOutput:charge});
test('N1 rejects aggregate reserve overflow before allocation',()=>{
  assert.throws(()=>solveResonance({nodes:[channel],stores:[store('a',Number.MAX_SAFE_INTEGER),store('b',1)]}),/reserve overflow/);
});
test('N1 rejects aggregate stored overflow even with zero discharge',()=>{
  const a={...store('a',Number.MAX_SAFE_INTEGER),maxOutput:0};
  const b={...store('b',1),maxOutput:0};
  assert.throws(()=>solveResonance({nodes:[channel],stores:[a,b]}),/stored overflow/);
});
test('N1 retains exact accounting at safe integer boundary',()=>{
  const r=solveResonance({nodes:[channel],generators:[{id:'g',anchor,output:Number.MAX_SAFE_INTEGER}],devices:[{id:'d',anchor,demand:Number.MAX_SAFE_INTEGER}]});
  assert.equal(r.networks[0].use,Number.MAX_SAFE_INTEGER);
  assert.equal(r.networks[0].surplus,0);
});
