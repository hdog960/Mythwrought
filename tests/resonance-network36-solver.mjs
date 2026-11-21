import test from 'node:test';
import assert from 'node:assert/strict';
import {solveResonance} from '../src/resonance/network36/solver.mjs';
const at=(x,y=0,z=0)=>({x,y,z});
const channel=(id,x)=>({id,kind:'channel',anchor:at(x)});
const generator=(id,x,output)=>({id,anchor:at(x),output});
const device=(id,x,demand,priority)=>({id,anchor:at(x),demand,priority});
const store=(id,x,charge,capacity=10,maxInput=3,maxOutput=4)=>({id,anchor:at(x),charge,capacity,maxInput,maxOutput});
test('stable deterministic shortage and automatic restoration',()=>{
 const args={nodes:[channel('c',0)],generators:[generator('g',1,5)],devices:[device('optional',-1,4,50),device('safety',0,3,0)]};
 const a=solveResonance(args);
 assert.equal(a.deviceStates.safety,'active');assert.equal(a.deviceStates.optional,'shortage');
 assert.deepEqual(a,solveResonance(args));
 assert.equal(solveResonance({...args,generators:[generator('g',1,8)]}).deviceStates.optional,'active');
});
test('finite storage discharges then recharges without input mutation',()=>{
 const s=store('battery',-1,5);
 const args={nodes:[channel('c',0)],generators:[generator('g',1,1)],devices:[device('safety',0,4,0)],stores:[s]};
 const a=solveResonance(args);
 assert.equal(a.nextCharges.battery,2);assert.equal(s.charge,5);
 const b=solveResonance({...args,generators:[generator('g',1,9)],stores:[{...s,charge:2}]});
 assert.equal(b.nextCharges.battery,5);assert.equal(b.networks[0].surplus,2);
});
test('split and wireless auto-link without explicit links',()=>{
 const nodes=[channel('a',0),channel('b',1),channel('far',8)];
 assert.equal(solveResonance({nodes}).networks.length,2);
 assert.equal(solveResonance({nodes:[...nodes,{id:'radio',kind:'wireless',anchor:at(4),radius:4}]}).networks.length,1);
 assert.equal(solveResonance({nodes:[channel('a',0),channel('far',8)]}).networks.length,2);
});
test('reject malformed, duplicated and overfilled input',()=>{
 assert.throws(()=>solveResonance({nodes:[channel('x',0),channel('x',1)]}));
 assert.throws(()=>solveResonance({nodes:[channel('x',0),channel('y',0)]}));
 assert.throws(()=>solveResonance({stores:[store('s',0,11)]}));
});
