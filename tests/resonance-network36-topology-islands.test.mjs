import test from 'node:test';
import assert from 'node:assert/strict';
import {topologyStorageIslands as solve} from '../src/resonance/network36/topology-islands.mjs';
const n=id=>({id}),e=(from,to,capacity=5)=>({from,to,capacity});
test('joins and splits; zero capacity does not connect',()=>{
 const b={nodes:[n('a'),n('b'),n('c')],generators:[{id:'g',at:'a',output:7}],devices:[{id:'d',at:'b',demand:3}],stores:[{id:'s',at:'c',charge:2,capacity:10,maxInput:5,maxOutput:5}]};
 const r=solve({...b,edges:[e('a','b'),e('b','c',0)]});
 assert.equal(r.islands.length,2);
 assert.deepEqual(r.islands.map(x=>[x.production,x.consumption,x.stores.length]),[[7,3,0],[0,0,1]]);
 assert.equal(solve({...b,edges:[e('a','b'),e('b','c')]}).islands.length,1);
});
test('unknown endpoints do not bridge or grant free energy',()=>{
 const r=solve({nodes:[n('a'),n('b')],edges:[e('a','missing'),e('missing','b')],generators:[{id:'g',at:'missing',output:20}]});
 assert.equal(r.islands.length,2);assert.deepEqual(r.disconnected,['g']);assert.equal(r.islands.reduce((s,x)=>s+x.production,0),0);
});
test('stable order and frozen input remain intact',()=>{
 const nodes=Object.freeze([Object.freeze(n('b')),Object.freeze(n('a'))]);
 const x=solve({nodes,edges:[e('b','a')],stores:[Object.freeze({id:'s',at:'a',charge:4})]});
 assert.deepEqual(x,solve({nodes:[n('a'),n('b')],edges:[e('a','b')],stores:[{id:'s',at:'a',charge:4}]}));
 assert.equal(x.islands[0].stores[0].charge,4);
});
test('reject duplicate IDs, invalid demand, and overflow',()=>{
 assert.throws(()=>solve({nodes:[n('a'),n('a')]}),/invalid node/);
 assert.throws(()=>solve({nodes:[n('a')],devices:[{id:'d',at:'a',demand:-1}]}),/invalid energy/);
 assert.throws(()=>solve({nodes:[n('a')],generators:[{id:'g',at:'a',output:Number.MAX_SAFE_INTEGER},{id:'h',at:'a',output:1}]}),/overflow/);
});
