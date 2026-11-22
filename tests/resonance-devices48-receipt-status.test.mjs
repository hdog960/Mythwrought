import test from 'node:test';
import assert from 'node:assert/strict';
import {createReceiptLedger,appendReceiptFrame} from '../src/resonance/devices48/receipt-ledger-v1.mjs';
import {projectReceiptStatus} from '../src/resonance/devices48/receipt-status-v1.mjs';
const sha='0cc51c6a89fce1a9928216caeebf2930b5e07f45', contract='resonance-network36-delivery-v1';
const candidate={contract:'resonance-devices48-network36-candidate-v1',seed:7,tick:4,sourceSha:sha,delivered:false,productionBound:false,candidateGrants:[{id:'gate',granted:5},{id:'lamp',granted:3}]};
const receipt={contract,seed:7,tick:4,sourceSha:sha,grants:[{id:'lamp',delivered:3},{id:'gate',delivered:2}]};
const ledger=appendReceiptFrame(createReceiptLedger({seed:7,networkSha:sha}),candidate,receipt,{trustedReceiptContract:contract});
const demands=[{id:'lamp',demand:3},{id:'gate',demand:5}];
const opts={expectedSeed:7,expectedNetworkSha:sha,expectedTick:4};
test('project deterministic sorted supply and deficits without authority',()=>{
 const a=projectReceiptStatus(ledger,demands,opts),b=projectReceiptStatus(ledger,[...demands].reverse(),opts);
 assert.deepEqual(a,b); assert.equal(a.requested,8);assert.equal(a.delivered,5);assert.equal(a.deficit,3);
 assert.deepEqual(a.devices.map(x=>[x.id,x.state]),[['gate','stopped'],['lamp','supplied']]);
 assert.equal(a.authoritative,false);assert.equal(a.productionBound,false);assert.ok(Object.isFrozen(a.devices));
});
test('reject stale, foreign and falsely authoritative frames',()=>{
 assert.throws(()=>projectReceiptStatus(ledger,demands,{...opts,expectedTick:5}));
 assert.throws(()=>projectReceiptStatus(ledger,demands,{...opts,expectedSeed:8}));
 assert.throws(()=>projectReceiptStatus({...ledger,authoritative:true},demands,opts));
 assert.throws(()=>projectReceiptStatus({...ledger,frames:[{...ledger.frames[0],total:6}]},demands,opts));
});
test('reject duplicate, missing and excessive demands',()=>{
 assert.throws(()=>projectReceiptStatus(ledger,[demands[0],demands[0]],opts));
 assert.throws(()=>projectReceiptStatus(ledger,[demands[0]],opts));
 assert.throws(()=>projectReceiptStatus(ledger,[{id:'gate',demand:1},demands[0]],opts));
 assert.throws(()=>projectReceiptStatus(ledger,[{id:'gate',demand:1.5},demands[0]],opts));
});
test('reject forged history and malformed grants',()=>{
 assert.throws(()=>projectReceiptStatus({...ledger,frames:[{...ledger.frames[0],grants:[{id:'gate',delivered:2},{id:'gate',delivered:3}]}]},demands,opts));
 assert.throws(()=>projectReceiptStatus({...ledger,frames:[{...ledger.frames[0],authoritative:true}]},demands,opts));
});
