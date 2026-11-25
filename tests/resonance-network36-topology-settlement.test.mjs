import test from 'node:test';
import assert from 'node:assert/strict';
import {settleTopologyStorage as solve} from '../src/resonance/network36/topology-settlement.mjs';
const node=id=>({id});
const edge=(from,to,capacity=5)=>({from,to,capacity});
const store=(id,at,charge=0)=>({id,at,charge,capacity:10,maxInput:4,maxOutput:3});
test('disconnected islands cannot exchange energy or charge',()=>{
 const r=solve({nodes:[node('a'),node('b')],generators:[{id:'g',at:'a',output:9}],devices:[{id:'d',at:'b',demand:3}],stores:[store('s','b',2)]});
 assert.equal(r.islands.length,2);
 assert.equal(r.islands[0].curtailed,9);
 assert.equal(r.islands[1].usedFromStores,2);
 assert.equal(r.islands[1].unmet,1);
 assert.equal(r.islands[1].storedAfter,0);
});
test('joining channels permits surplus charging; splitting removes it',()=>{
 const input={nodes:[node('a'),node('b')],generators:[{id:'g',at:'a',output:8}],devices:[{id:'d',at:'b',demand:2}],stores:[store('s','b',1)]};
 const joined=solve({...input,edges:[edge('a','b')]});
 assert.equal(joined.islands.length,1);
 assert.equal(joined.islands[0].nextCharges.s,5);
 const split=solve({...input,edges:[edge('a','b',0)]});
 assert.equal(split.islands.length,2);
 assert.equal(split.islands[1].nextCharges.s,0);
 assert.equal(split.islands[1].unmet,1);
});
test('input order does not change settlement and input is immutable',()=>{
 const nodes=Object.freeze([Object.freeze(node('b')),Object.freeze(node('a'))]);
 const s=Object.freeze(store('s','b',2));
 const a=solve({nodes,edges:[edge('b','a')],stores:[s],generators:[{id:'g',at:'a',output:4}]});
 const b=solve({nodes:[node('a'),node('b')],edges:[edge('a','b')],stores:[store('s','b',2)],generators:[{id:'g',at:'a',output:4}]});
 assert.deepEqual(a,b);assert.equal(s.charge,2);
});
test('unknown generator does not contribute and invalid storage is rejected',()=>{
 const r=solve({nodes:[node('a')],generators:[{id:'g',at:'missing',output:9}],devices:[{id:'d',at:'a',demand:1}]});
 assert.deepEqual(r.disconnected,['g']);assert.equal(r.islands[0].unmet,1);
 assert.throws(()=>solve({nodes:[node('a')],stores:[{...store('s','a'),charge:11}]}),/invalid storage/);
});
