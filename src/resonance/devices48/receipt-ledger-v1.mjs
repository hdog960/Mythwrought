// Source-only replay guard for :48 energy receipt fixtures. No live network authority.
import {reconcileDelivery} from './delivery-receipt-v1.mjs';
export const RECEIPT_LEDGER_V1='resonance-devices48-receipt-ledger-v1';
const nat=n=>Number.isSafeInteger(n)&&n>=0;
const sha=s=>typeof s==='string'&&/^[a-f0-9]{40}$/.test(s);
export function createReceiptLedger({seed,networkSha}={}){
 if(!nat(seed)||!sha(networkSha))throw Error('invalid ledger provenance');
 return Object.freeze({contract:RECEIPT_LEDGER_V1,seed,networkSha,lastTick:null,frames:Object.freeze([]),productionBound:false,authoritative:false});
}
export function appendReceiptFrame(ledger,candidate,receipt,{trustedReceiptContract}={}){
 if(!ledger||ledger.contract!==RECEIPT_LEDGER_V1||!nat(ledger.seed)||!sha(ledger.networkSha)||!Array.isArray(ledger.frames)||ledger.frames.length>32||ledger.productionBound!==false||ledger.authoritative!==false)throw Error('invalid ledger');
 if(!candidate||!nat(candidate.tick)||(ledger.lastTick!==null&&(!nat(ledger.lastTick)||candidate.tick<=ledger.lastTick)))throw Error('stale or invalid tick');
 // Fail closed on altered history, even if a caller supplies a forged previous ledger.
 let prev=null;
 for(const frame of ledger.frames){
  if(!frame||!nat(frame.tick)||(prev!==null&&frame.tick<=prev)||frame.seed!==ledger.seed||frame.sourceSha!==ledger.networkSha||frame.authoritative!==false||frame.productionBound!==false||!nat(frame.total)||!Array.isArray(frame.grants)||frame.grants.length>16)throw Error('invalid ledger history');
  let sum=0,seen=new Set();
  for(const g of frame.grants){if(!g||typeof g.id!=='string'||seen.has(g.id)||!nat(g.delivered)||g.delivered>64)throw Error('invalid ledger grant');seen.add(g.id);sum+=g.delivered;}
  if(sum!==frame.total||sum>256)throw Error('invalid ledger sum');
  prev=frame.tick;
 }
 if(prev!==ledger.lastTick)throw Error('ledger tip mismatch');
 const reconciled=reconcileDelivery(candidate,receipt,{expectedSeed:ledger.seed,expectedTick:candidate.tick,expectedNetworkSha:ledger.networkSha,trustedReceiptContract});
 const frame=Object.freeze({tick:reconciled.tick,seed:reconciled.seed,sourceSha:reconciled.sourceSha,total:reconciled.total,grants:reconciled.grants,authoritative:false,productionBound:false});
 const frames=Object.freeze([...ledger.frames.slice(-31),frame]);
 return Object.freeze({contract:RECEIPT_LEDGER_V1,seed:ledger.seed,networkSha:ledger.networkSha,lastTick:frame.tick,frames,productionBound:false,authoritative:false});
}
