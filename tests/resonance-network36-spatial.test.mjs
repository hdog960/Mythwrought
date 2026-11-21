import test from 'node:test';
import assert from 'node:assert/strict';
import {solveResonance} from '../src/resonance/network36/solver.mjs';
const node=(id,x,kind='channel',radius)=>({id,kind,anchor:{x,y:0,z:0},...(radius===undefined?{}:{radius})});
test('N1 long channel chain joins regardless of insertion order',()=>{
 const nodes=Array.from({length:256},(_,i)=>node('c'+i,i));
 const a=solveResonance({nodes});
 const b=solveResonance({nodes:[...nodes].reverse()});
 assert.equal(a.networks.length,1);
 assert.deepEqual(a,b);
});
test('N1 removal splits and reconnection joins without mutating inputs',()=>{
 const nodes=[node('a',0),node('bridge',1),node('b',2)];
 assert.equal(solveResonance({nodes}).networks.length,1);
 assert.equal(solveResonance({nodes:[nodes[0],nodes[2]]}).networks.length,2);
 assert.equal(nodes.length,3);
});
test('N1 wireless bridge reaches both sides within bounded radius',()=>{
 const nodes=[node('a',0),node('b',8),node('radio',4,'wireless',4)];
 assert.equal(solveResonance({nodes}).networks.length,1);
 assert.equal(solveResonance({nodes:nodes.slice(0,2)}).networks.length,2);
});
test('N1 fail closed for oversized wireless radius or conductor count',()=>{
 assert.throws(()=>solveResonance({nodes:[node('radio',0,'wireless',9)]}),/radius budget/);
 assert.throws(()=>solveResonance({nodes:Array.from({length:2049},(_,i)=>node('c'+i,i))}),/conductor budget/);
});
test('N1 same-anchor device still receives finite supply',()=>{
 const r=solveResonance({nodes:[node('c',0)],generators:[{id:'g',anchor:{x:0,y:0,z:0},output:3}],devices:[{id:'d',anchor:{x:0,y:0,z:0},demand:3}]});
 assert.equal(r.deviceStates.d,'active');
 assert.equal(r.networks[0].use,3);
});
