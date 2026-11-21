import test from 'node:test';
import assert from 'node:assert/strict';
import {solveVisibleResonance} from '../src/resonance/network36/chunk-solver.mjs';
const a=(x,y=0,z=0)=>({x,y,z});
const snapshot=()=>({tick:7,nodes:[{id:'left',kind:'channel',anchor:a(15)},{id:'right',kind:'channel',anchor:a(16)}],
  generators:[{id:'gen',anchor:a(16),output:6}],
  devices:[{id:'machine',anchor:a(15),demand:4,priority:20}],
  stores:[{id:'battery',anchor:a(15),capacity:10,charge:5,maxInput:3,maxOutput:3}]});
test('unloaded generator cannot provide phantom energy, but stored reserve is finite',()=>{
 const input=snapshot(), before=structuredClone(input);
 const r=solveVisibleResonance(input,[[0,0,0]]);
 assert.equal(r.deviceStates.machine,'shortage');
 assert.equal(r.nextCharges.battery,5);
 assert.ok(r.excluded.includes('gen'));
 assert.deepEqual(input,before);
});
test('cold reload restores source and charges only in returned candidate state',()=>{
 const s=snapshot();
 const full=solveVisibleResonance(s,[[0,0,0],[1,0,0]]);
 assert.equal(full.deviceStates.machine,'active');
 assert.equal(full.nextCharges.battery,7);
 assert.equal(s.stores[0].charge,5);
 assert.deepEqual(full,solveVisibleResonance(s,[[1,0,0],[0,0,0]]));
});
test('unloaded battery cannot supply a disconnected consumer',()=>{
 const s=snapshot();s.generators=[];s.stores[0].anchor=a(16);
 const r=solveVisibleResonance(s,[[0,0,0]]);
 assert.equal(r.deviceStates.machine,'shortage');
 assert.equal(r.nextCharges.battery,undefined);
 assert.ok(r.excluded.includes('battery'));
});
test('fail closed on chunk budget and preserve original input',()=>{
 const s=snapshot(), before=structuredClone(s);
 assert.throws(()=>solveVisibleResonance(s,Array.from({length:26},(_,i)=>[i,0,0])),/budget/);
 assert.throws(()=>solveVisibleResonance(s,[],{failOnMissing:true}),/unloaded/);
 assert.deepEqual(s,before);
});
