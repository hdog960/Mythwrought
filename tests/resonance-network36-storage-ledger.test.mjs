import test from 'node:test';
import assert from 'node:assert/strict';
import {settleStorage} from '../src/resonance/network36/storage-ledger.mjs';
const s=(id,charge,extra={})=>({id,capacity:10,charge,maxInput:3,maxOutput:4,...extra});
test('surplus charges up to input and capacity limits without free energy',()=>{
 const r=settleStorage({production:12,consumption:5,stores:[s('a',8),s('b',0)]});
 assert.deepEqual(r.nextCharges,{a:10,b:3});assert.equal(r.curtailed,2);assert.equal(r.storedAfter-r.storedBefore,5);
});
test('deficit drains deterministically with per-store output limits',()=>{
 const r=settleStorage({production:1,consumption:10,stores:[s('b',9),s('a',3)]});
 assert.deepEqual(r.discharged,{a:3,b:4});assert.equal(r.unmet,2);assert.equal(r.storedBefore-r.storedAfter,7);
});
test('empty stores cannot provide free energy; no mutation',()=>{
 const stores=[s('a',0)];const before=JSON.stringify(stores);
 const r=settleStorage({production:0,consumption:5,stores});
 assert.equal(r.supplied,0);assert.equal(r.unmet,5);assert.equal(JSON.stringify(stores),before);
});
test('stable under input order, no charge during shortage',()=>{
 const a=[s('b',2),s('a',1)];const input={production:2,consumption:7};
 assert.deepEqual(settleStorage({...input,stores:a}),settleStorage({...input,stores:[...a].reverse()}));
 assert.equal(settleStorage({...input,stores:a}).storedSurplus,0);
});
test('rejects invalid, duplicate, overflow and overfilled stores',()=>{
 assert.throws(()=>settleStorage({stores:[s('a',11)]}),/invalid storage/);
 assert.throws(()=>settleStorage({stores:[s('a',1),s('a',2)]}),/invalid storage/);
 assert.throws(()=>settleStorage({production:-1}),/invalid ledger/);
 assert.throws(()=>settleStorage({stores:[s('a',10,{capacity:Number.MAX_SAFE_INTEGER}),s('b',10,{charge:Number.MAX_SAFE_INTEGER,capacity:Number.MAX_SAFE_INTEGER})]}),/overflow/);
});
