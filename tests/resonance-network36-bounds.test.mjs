import test from 'node:test';
import assert from 'node:assert/strict';
import {solveResonance} from '../src/resonance/network36/solver.mjs';
const anchor={x:0,y:0,z:0};
const channel={id:'c',kind:'channel',anchor};
test('N1 rejects unbounded consumers before graph traversal',()=>{
  const devices=Array.from({length:2049},(_,i)=>({id:'d'+i,anchor,demand:1}));
  assert.throws(()=>solveResonance({nodes:[channel],devices}),/devices budget exceeded/);
});
test('N1 rejects out-of-bounds anchors before indexing',()=>{
  assert.throws(()=>solveResonance({nodes:[{...channel,anchor:{x:1000001,y:0,z:0}}]}),/anchor bounds/);
  assert.throws(()=>solveResonance({nodes:[channel],generators:[{id:'g',anchor:{x:-1000001,y:0,z:0},output:1}]}),/anchor bounds/);
});
test('N1 accepts bounded connected consumers and preserves accounting',()=>{
  const result=solveResonance({nodes:[channel],generators:[{id:'g',anchor,output:3}],devices:[{id:'d',anchor,demand:2}]});
  assert.equal(result.deviceStates.d,'active');
  assert.equal(result.networks[0].surplus,1);
});
