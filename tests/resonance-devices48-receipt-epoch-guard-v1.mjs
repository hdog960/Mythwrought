import test from 'node:test';
import assert from 'node:assert/strict';
import {auditReceiptEpoch,RECEIPT_EPOCH_GUARD_V1} from '../src/resonance/devices48/receipt-epoch-guard-v1.mjs';
const sha='a'.repeat(40),contract='resonance-network36-delivery-v1';
const opts={expectedSeed:179,expectedNetworkSha:sha,trustedReceiptContract:contract};
const receipt=(tick,grants=[{id:'lamp',delivered:2}])=>({contract,seed:179,sourceSha:sha,tick,grants,productionBound:false});
test('deterministic immutable non-authoritative history',()=>{
 const a=auditReceiptEpoch([receipt(2),receipt(4,[{id:'z',delivered:1},{id:'a',delivered:2}])],opts);
 assert.equal(a.contract,RECEIPT_EPOCH_GUARD_V1);assert.equal(a.authoritative,false);assert.equal(a.productionBound,false);
 assert.deepEqual(a.frames[1].grants.map(x=>x.id),['a','z']);assert.ok(Object.isFrozen(a.frames[1].grants));assert.ok(Object.isFrozen(a.frames));
 assert.deepEqual(a,auditReceiptEpoch([receipt(2),receipt(4,[{id:'a',delivered:2},{id:'z',delivered:1}])],opts));
});
for(const [name,rs,o] of [
 ['empty',[],opts],['duplicate tick',[receipt(2),receipt(2)],opts],['reverse tick',[receipt(4),receipt(3)],opts],
 ['negative tick',[receipt(-1)],opts],['missing trusted contract',[receipt(1)],{...opts,trustedReceiptContract:undefined}],
 ['source mismatch',[{...receipt(1),sourceSha:'b'.repeat(40)}],opts],['seed mismatch',[{...receipt(1),seed:180}],opts],
 ['production flag',[{...receipt(1),productionBound:true}],opts],['duplicate id',[receipt(1,[{id:'a',delivered:1},{id:'a',delivered:2}])],opts],
 ['negative grant',[receipt(1,[{id:'a',delivered:-1}])],opts],['oversized grant',[receipt(1,[{id:'a',delivered:65}])],opts],
 ['bad identity',[receipt(1,[{id:'A!',delivered:1}])],opts],['noninteger',[receipt(1,[{id:'a',delivered:1.2}])],opts],
 ['over 16 devices',[receipt(1,Array.from({length:17},(_,i)=>({id:'d'+i,delivered:1})))],opts],
 ['over 32 frames',Array.from({length:33},(_,i)=>receipt(i)),opts],['invalid bound',[receipt(1)],{...opts,maxFrames:33}]
]) test('fail closed: '+name,()=>assert.throws(()=>auditReceiptEpoch(rs,o)));
