import test from 'node:test';
import assert from 'node:assert/strict';
import {settlePriorityNetworks as solve} from '../src/resonance/network36/priority-settlement.mjs';
const n=id=>({id});
const d=(id,at,demand,priority)=>({id,at,demand,priority});
const s=(at,charge)=>({id:'storage',at,capacity:10,charge,maxInput:4,maxOutput:3});
test('safety machines survive shortage; optional machines stop and automatically resume',()=>{
 const base={nodes:[n('a')],generators:[{id:'g',at:'a',output:3}],devices:[d('production','a',3,3),d('safety','a',2,0)]};
 const low=solve(base).islands[0];assert.deepEqual(low.active,['safety']);assert.deepEqual(low.stopped,['production']);assert.equal(low.unmet,0);
 const high=solve({...base,generators:[{id:'g',at:'a',output:5}]}).islands[0];assert.deepEqual(high.active,['safety','production']);
});
test('storage discharges only for actually active loads and preserves energy',()=>{
 const r=solve({nodes:[n('a')],generators:[{id:'g',at:'a',output:2}],devices:[d('safety','a',4,0),d('optional','a',3,4)],stores:[s('a',3)]}).islands[0];
 assert.deepEqual(r.active,['safety']);assert.equal(r.usedFromStores,2);assert.equal(r.storedAfter,1);assert.equal(r.unmet,0);
});
test('split networks cannot borrow power or storage',()=>{
 const input={nodes:[n('a'),n('b')],generators:[{id:'g',at:'a',output:9}],devices:[d('safety','b',2,0)],stores:[s('b',1)]};
 assert.deepEqual(solve(input).islands.find(x=>x.id==='b').stopped,['safety']);
 assert.deepEqual(solve({...input,edges:[{from:'a',to:'b',capacity:1}]}).islands[0].active,['safety']);
});
test('stable ties, frozen inputs, invalid priorities and overflow rejected',()=>{
 const devices=Object.freeze([Object.freeze(d('z','a',2,1)),Object.freeze(d('alpha','a',2,1))]);
 const input={nodes:[n('a')],generators:[{id:'g',at:'a',output:2}],devices};
 assert.deepEqual(solve(input).islands[0].active,['alpha']);
 assert.deepEqual(solve({...input,devices:[...devices].reverse()}),solve(input));
 assert.throws(()=>solve({...input,devices:[d('bad','a',1,-1)]}),/invalid device priority/);
 assert.throws(()=>solve({...input,generators:[{id:'g',at:'a',output:Number.MAX_SAFE_INTEGER}],stores:[s('a',3)]}),/energy overflow/);
});
test('invalid storage cannot bypass validation by being disconnected',()=>{
 const input={nodes:[n('a')],stores:[{id:'remote',at:'unloaded',capacity:1,charge:2,maxInput:1,maxOutput:1}]};
 assert.throws(()=>solve(input),/invalid storage/);
});
