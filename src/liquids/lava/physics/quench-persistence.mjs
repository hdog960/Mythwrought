// Lava A: compose the existing quench batch and shared persistence bridge.
// No live mutation, terrain writes or new save schema. Host owns revision/lease.
import {createLavaPersistenceBridge} from './persistence-bridge.mjs';
import {createLavaQuenchBatch} from './quench-batch.mjs';
const token=s=>typeof s==='string'&&/^[a-z0-9][a-z0-9-]{0,127}$/.test(s);

export function createLavaQuenchPersistence({codec,ventOptions={},thermalOptions={},
  createEngine,isLoaded,isOpen,canQuench,allowQuench=false,maxPairs=32,maxReceipts=1024}={}){
  if(typeof codec?.encode!=='function')throw new TypeError('Shared persistence codec required');
  const bridge=createLavaPersistenceBridge({codec,ventOptions,thermalOptions,maxReceipts});
  const batcher=createLavaQuenchBatch({createEngine,isLoaded,isOpen,canQuench,
    allowQuench,maxPairs,maxReceipts,thermalOptions});
  // Reserve receipt IDs without mutating any host allocator. Only a successful
  // whole-state adoption under the exclusive lease spends usedReceiptIds.
  function stage({shared,lava,pairs,receiptIds=[]}={}){
    if(!Array.isArray(receiptIds)||receiptIds.length>maxPairs)throw new RangeError('Receipt reservation budget');
    const reserved=Array.from(receiptIds);
    if(reserved.some(id=>!token(id))||new Set(reserved).size!==reserved.length)
      throw new TypeError('Invalid receipt reservation');
    const before=bridge.restore({shared,lava});
    const existing=new Set(before.shared.products.map(p=>p.id));
    if(reserved.some(id=>existing.has(id)))throw new TypeError('Receipt ID already persisted');
    // Derive the batch inside this call from the canonical input revision.
    // Never accept externally staged resident or receipt histories here.
    const batch=batcher.stage({state:before.quenchState,pairs});
    if(batch===null)return null;
    const count=batch.newReceipts.length;
    if(count>reserved.length)return null;
    const usedReceiptIds=Object.freeze(reserved.slice(0,count));
    const unusedReceiptIds=Object.freeze(reserved.slice(count));
    const report=Object.freeze({visited:batch.visited,denied:batch.denied,
      unavailable:batch.unavailable,duplicates:batch.duplicates,
      remainingPairs:batch.remainingPairs,changed:batch.changed});
    if(!count)return Object.freeze({status:'unchanged',state:null,usedReceiptIds,unusedReceiptIds,report});
    const result=bridge.stageQuench({shared:before.shared,lava:before.lava,batch,receiptIds:usedReceiptIds});
    // validate alone does not enforce maxChars; preflight actual codec encoding.
    const encoded=codec.encode(result.shared);
    return Object.freeze({status:'staged',expectedRevision:before.shared.revision,
      state:Object.freeze({shared:result.shared,lava:result.lava}),encoded,
      usedReceiptIds,unusedReceiptIds,report});
  }
  return Object.freeze({stage,restore:bridge.restore});
}
