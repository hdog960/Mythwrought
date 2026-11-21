import test from 'node:test';
import assert from 'node:assert/strict';
import {solveResonance} from '../src/resonance/network36/solver.mjs';
const channel={id:'c',kind:'channel',anchor:{x:0,y:0,z:0}};
test('consumer budget is enforced before processing',()=>{
  for(const field of ['generators','devices','stores']) {
    const item=field==='generators'?{output:1}:field==='devices'?{demand:1}:{capacity:1,charge:0,maxInput:1,maxOutput:1};
    const values=Array.from({length:2049},(_,i)=>({id:field+i,anchor:{x:0,y:0,z:0},...item}));
    assert.throws(()=>solveResonance({nodes:[channel],[field]:values}),new RegExp(field+' budget exceeded'));
  }
});
test('conductor budget rejects 2049 before spatial indexing',()=>{
  const nodes=Array.from({length:2049},(_,i)=>({id:'c'+i,kind:'channel',anchor:{x:i,y:0,z:0}}));
  assert.throws(()=>solveResonance({nodes}),/conductor budget exceeded/);
});
test('exactly 2048 bounded devices remain accepted',()=>{
  const devices=Array.from({length:2048},(_,i)=>({id:'d'+i,anchor:{x:0,y:0,z:0},demand:0}));
  const r=solveResonance({nodes:[channel],devices});
  assert.equal(Object.keys(r.deviceStates).length,2048);
  assert.equal(r.networks[0].curtailed.length,0);
});
