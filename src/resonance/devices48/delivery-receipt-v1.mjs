// Fail-closed opt-in receipt reconciliation; never evidence of production power.
export const DELIVERY_V1='resonance-devices48-delivery-v1';
const nat=n=>Number.isSafeInteger(n)&&n>=0;
const id=s=>typeof s==='string'&&/^[a-z0-9_-]{1,48}$/.test(s);
const sha=s=>typeof s==='string'&&/^[a-f0-9]{40}$/.test(s);
export function reconcileDelivery(candidate,receipt,{expectedSeed,expectedTick,expectedNetworkSha,trustedReceiptContract}={}){
 if(!candidate||candidate.contract!=='resonance-devices48-network36-candidate-v1'||candidate.delivered!==false||candidate.productionBound!==false||!Array.isArray(candidate.candidateGrants)||!nat(candidate.seed)||!nat(candidate.tick)||!sha(candidate.sourceSha))throw Error('invalid candidate');
 if(candidate.seed!==expectedSeed||candidate.tick!==expectedTick||candidate.sourceSha!==expectedNetworkSha)throw Error('candidate provenance mismatch');
 // :36 has not agreed to a receipt schema. Explicitly pinned contract is mandatory.
 if(typeof trustedReceiptContract!=='string'||!/^resonance-network36-delivery-[a-z0-9-]{1,32}$/.test(trustedReceiptContract))throw Error('no trusted delivery contract');
 if(!receipt||receipt.contract!==trustedReceiptContract||receipt.seed!==expectedSeed||receipt.tick!==expectedTick||receipt.sourceSha!==expectedNetworkSha||!Array.isArray(receipt.grants))throw Error('invalid receipt');
 if(candidate.candidateGrants.length>16||receipt.grants.length!==candidate.candidateGrants.length)throw Error('receipt cardinality mismatch');
 const expected=new Map();let demand=0;
 for(const g of candidate.candidateGrants){if(!g||!id(g.id)||expected.has(g.id)||!nat(g.granted)||g.granted>64)throw Error('invalid candidate grant');expected.set(g.id,g.granted);demand+=g.granted;}
 if(demand>256)throw Error('candidate demand exceeded');
 const seen=new Set(),grants=[];let total=0;
 for(const g of receipt.grants){if(!g||!id(g.id)||seen.has(g.id)||!expected.has(g.id)||!nat(g.delivered)||g.delivered>expected.get(g.id))throw Error('invalid delivered grant');seen.add(g.id);total+=g.delivered;grants.push(Object.freeze({id:g.id,delivered:g.delivered}));}
 if(total>256)throw Error('delivered total exceeded');
 grants.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
 // A structurally valid fixture is not cryptographic proof of delivered energy.
 return Object.freeze({contract:DELIVERY_V1,seed:expectedSeed,tick:expectedTick,sourceSha:expectedNetworkSha,grants:Object.freeze(grants),total,productionBound:false,authoritative:false});
}
