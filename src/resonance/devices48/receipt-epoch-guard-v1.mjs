// Source-only guard for a monotonic :36 delivery receipt sequence. No runtime authority.
export const RECEIPT_EPOCH_GUARD_V1 = 'resonance-devices48-receipt-epoch-guard-v1';
const nat = n => Number.isSafeInteger(n) && n >= 0;
const sha = s => typeof s === 'string' && /^[a-f0-9]{40}$/.test(s);
const ident = s => typeof s === 'string' && /^[a-z0-9_-]{1,48}$/.test(s);
export function auditReceiptEpoch(receipts, {expectedSeed, expectedNetworkSha, trustedReceiptContract, maxFrames=32}={}) {
 if(!Array.isArray(receipts)||!receipts.length||!nat(maxFrames)||maxFrames<1||maxFrames>32||receipts.length>maxFrames) throw Error('invalid receipt history');
 if(!nat(expectedSeed)||!sha(expectedNetworkSha)||typeof trustedReceiptContract!=='string'||!/^resonance-network36-delivery-[a-z0-9-]{1,32}$/.test(trustedReceiptContract)) throw Error('untrusted provenance');
 let lastTick=-1;const frames=[];
 for(const r of receipts){
  if(!r||r.contract!==trustedReceiptContract||r.seed!==expectedSeed||r.sourceSha!==expectedNetworkSha||!nat(r.tick)||r.tick<=lastTick||!Array.isArray(r.grants)||r.grants.length>16||r.productionBound!==false) throw Error('invalid receipt epoch');
  const seen=new Set();let total=0;const grants=[];
  for(const g of r.grants){
   if(!g||!ident(g.id)||seen.has(g.id)||!nat(g.delivered)||g.delivered>64)throw Error('invalid receipt grant');
   seen.add(g.id);total+=g.delivered;if(total>256)throw Error('receipt capacity exceeded');
   grants.push(Object.freeze({id:g.id,delivered:g.delivered}));
  }
  grants.sort((a,b)=>a.id.localeCompare(b.id,'en'));
  frames.push(Object.freeze({tick:r.tick,total,grants:Object.freeze(grants)}));lastTick=r.tick;
 }
 return Object.freeze({contract:RECEIPT_EPOCH_GUARD_V1,seed:expectedSeed,sourceSha:expectedNetworkSha,frames:Object.freeze(frames),authoritative:false,productionBound:false});
}
