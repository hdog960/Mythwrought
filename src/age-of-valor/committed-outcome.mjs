// AV4 trusted owner lookup seam; not a persistent transaction ledger.
export function verifyCommittedDamage({request,definition,lookupCommitted,validateReceipt}){
 if(!request||!definition||request.definitionId!==definition.id||!['fixture','content'].includes(definition.scope)||request.fixture!==(definition.scope==='fixture')||typeof lookupCommitted!=='function'||typeof validateReceipt!=='function')throw Error('invalid provenance');
 // The lookup is an injected trusted owner boundary, never a supplied client receipt.
 const identity=Object.freeze(Object.fromEntries(['worldId','profileId','transactionId','actionId','sourceId','targetId','definitionId'].map(k=>[k,request[k]])));
 const stored=lookupCommitted(identity);
 if(!stored||stored.committed!==true||stored.requestAmount!==request.amount)throw Error('unconfirmed commit');
 const checked=validateReceipt(request,stored.receipt);
 if(!checked.accepted)return Object.freeze({status:'rejected',outcome:null});
 return Object.freeze({status:'verified-owner-receipt',outcome:checked}); // durable dedup still belongs to owner
}
