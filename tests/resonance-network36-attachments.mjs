import test from 'node:test';
import assert from 'node:assert/strict';
import {solveResonance} from '../src/resonance/network36/solver.mjs';
const at=x=>({x,y:0,z:0});
const channel=(id,x)=>({id,kind:'channel',anchor:at(x)});
const device=(id,x,demand=2)=>({id,anchor:at(x),demand,priority:0});
test('device on conductor anchor automatically receives finite Resonance',()=>{
 const r=solveResonance({nodes:[channel('c',0)],generators:[{id:'g',anchor:at(1),output:2}],devices:[device('safety',0)]});
 assert.equal(r.deviceStates.safety,'active');
 assert.equal(r.networks[0].use,2);
 assert.equal(r.networks[0].surplus,0);
});
test('touching disconnected networks is rejected instead of arbitrary power routing',()=>{
 const input={nodes:[channel('a',0),channel('b',2)],devices:[device('bridge',1)]};
 assert.throws(()=>solveResonance(input),/ambiguous multi-network attachment/);
 assert.deepEqual(input.nodes,[channel('a',0),channel('b',2)]);
});
test('disconnect and reconnect are deterministic and do not mutate input',()=>{
 const input={nodes:[channel('a',0)],devices:[device('safety',3)]};
 assert.equal(solveResonance(input).deviceStates.safety,'disconnected');
 const connected={...input,nodes:[...input.nodes,channel('b',1),channel('c',2)],generators:[{id:'g',anchor:at(-1),output:2}]};
 assert.equal(solveResonance(connected).deviceStates.safety,'active');
 assert.equal(solveResonance(input).deviceStates.safety,'disconnected');
});
