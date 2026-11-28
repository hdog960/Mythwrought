// Shared read-only dirty handoff; caller owns the physical batch mapping.
import {expandLiquidDirty} from './mesh.mjs';
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const validId=id=>typeof id==='string'&&id.length>0&&id.length<=128;

// Each dirty cell may touch multiple existing render batches. Null means
// mapping unavailable; [] explicitly means no resident batch to invalidate.
// Caller retains the entire input on rejection and retries under a stable lease.
export function invalidateLiquidChanges({cache,changed,batchesForCell,
  maxChanged=256,maxDirty=1792,maxBatchIds=128,maxIdsPerCell=8}={}){
  if(typeof cache?.invalidate!=='function'||typeof batchesForCell!=='function')
    throw TypeError('Explicit dirty handoff host required');
  if(!int(maxBatchIds,1,4096)||!int(maxIdsPerCell,1,64))
    throw RangeError('Invalid dirty routing budget');
  const dirty=expandLiquidDirty(changed,{maxChanged,maxDirty});
  const ids=new Set();
  const reject=reason=>Object.freeze({accepted:false,reason,dirtyCount:dirty.length,ids:Object.freeze([])});
  for(const p of dirty){
    const mapped=batchesForCell(...p);
    if(mapped===null)return reject('mapping-unavailable');
    if(!Array.isArray(mapped)||mapped.length>maxIdsPerCell)
      throw RangeError('Invalid physical batch mapping');
    for(const id of mapped){
      if(!validId(id))throw TypeError('Invalid physical batch ID');
      ids.add(id);
      if(ids.size>maxBatchIds)return reject('routing-budget');
    }
  }
  const unique=Object.freeze([...ids]);
  // Exactly one admission call; no partial queue writes on routing rejection.
  if(unique.length&&cache.invalidate(unique)!==true)return reject('cache-budget');
  return Object.freeze({accepted:true,reason:null,dirtyCount:dirty.length,ids:unique});
}
