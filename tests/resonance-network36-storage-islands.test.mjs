import test from 'node:test';
import assert from 'node:assert/strict';
import {settleStorageIslands} from '../src/resonance/network36/storage-islands.mjs';
const s=(id,charge)=>({id,capacity:10,charge,maxInput:5,maxOutput:5});
test('disconnected islands never transfer power or charge',()=>{
 const result=settleStorageIslands({islands:[{id:'A',production:0,consumption:5,stores:[s('a',2)]},{id:'B',production:10,consumption:0,stores:[s('b',0)]}]});
 assert.equal(result.islands.A.unmet,3);
 assert.equal(result.islands.A.nextCharges.a,0);
 assert.equal(result.islands.B.nextCharges.b,5);
 assert.equal(result.islands.B.curtailed,5);
});
test('island ordering is deterministic and input stays frozen',()=>{
 const a=Object.freeze({id:'A',production:1,consumption:2,stores:Object.freeze([Object.freeze(s('a',2))])});
 const b=Object.freeze({id:'B',production:3,consumption:0,stores:Object.freeze([Object.freeze(s('b',0))])});
 assert.deepEqual(settleStorageIslands({islands:[a,b]}),settleStorageIslands({islands:[b,a]}));
 assert.equal(a.stores[0].charge,2);
});
test('rejects duplicate storage across islands and invalid budgets',()=>{
 assert.throws(()=>settleStorageIslands({islands:[{id:'A',production:0,consumption:0,stores:[s('x',1)]},{id:'B',production:0,consumption:0,stores:[s('x',1)]}]}),/duplicate storage/);
 assert.throws(()=>settleStorageIslands({islands:[{id:'A',production:-1,consumption:0,stores:[]}]}),/invalid island/);
 assert.throws(()=>settleStorageIslands({islands:[{id:'A',production:0,consumption:0,stores:[]},{id:'A',production:0,consumption:0,stores:[]}]}),/invalid island/);
});
