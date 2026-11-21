import test from 'node:test';
import assert from 'node:assert/strict';
import {createReceiptLedger,appendReceiptFrame} from '../src/resonance/devices48/receipt-ledger-v1.mjs';
const sourceSha='0cc51c6a89fce1a9928216caeebf2930b5e07f45';
const contract='resonance-network36-delivery-v1';
const candidate=tick=>({contract:'resonance-devices48-network36-candidate-v1',seed:7,tick,sourceSha,delivered:false,productionBound:false,candidateGrants:[{id:'lamp',granted:3},{id:'gate',granted:5}]});
const receipt=tick=>({contract,seed:7,tick,sourceSha,grants:[{id:'gate',delivered:4},{id:'lamp',delivered:3}]});
const add=(ledger,tick,r=receipt(tick))=>appendReceiptFrame(ledger,candidate(tick),r,{trustedReceiptContract:contract});
test('ledger is immutable and never authoritative',()=>{
 const first=createReceiptLedger({seed:7,networkSha:sourceSha});
 const second=add(first,1);assert.equal(first.frames.length,0);assert.equal(second.frames.length,1);
 assert.equal(second.frames[0].total,7);assert.equal(second.authoritative,false);assert.equal(second.productionBound,false);
 assert.ok(Object.isFrozen(second.frames));assert.ok(Object.isFrozen(second.frames[0]));
});
test('reject replay, tick reversal, foreign world and untrusted receipts',()=>{
 const ledger=add(createReceiptLedger({seed:7,networkSha:sourceSha}),4);
 for(const tick of [4,3])assert.throws(()=>add(ledger,tick));
 assert.throws(()=>add(ledger,5,{...receipt(5),seed:8}));
 assert.throws(()=>appendReceiptFrame(ledger,candidate(5),receipt(5),{}));
});
test('reject forged ledger history and mismatched tip',()=>{
 const ledger=add(createReceiptLedger({seed:7,networkSha:sourceSha}),1);
 assert.throws(()=>add({...ledger,lastTick:2},3));
 assert.throws(()=>add({...ledger,frames:[{...ledger.frames[0],total:99}]},2));
 assert.throws(()=>add({...ledger,authoritative:true},2));
});
test('retain only last 32 verified frames, deterministic order',()=>{
 let ledger=createReceiptLedger({seed:7,networkSha:sourceSha});
 for(let tick=0;tick<40;tick++)ledger=add(ledger,tick);
 assert.equal(ledger.frames.length,32);assert.equal(ledger.frames[0].tick,8);
 assert.equal(ledger.lastTick,39);assert.deepEqual(ledger.frames[31].grants.map(x=>x.id),['gate','lamp']);
});
test('reject malformed energy and invalid provenance',()=>{
 assert.throws(()=>createReceiptLedger({seed:-1,networkSha:sourceSha}));
 assert.throws(()=>createReceiptLedger({seed:7,networkSha:'bad'}));
 const ledger=createReceiptLedger({seed:7,networkSha:sourceSha});
 assert.throws(()=>add(ledger,1,{...receipt(1),grants:[{id:'gate',delivered:9},{id:'lamp',delivered:3}]}));
});
