// Lane-local proposal for host-owned atomic source/resident adoption.
// No live engine, global save, terrain, inventory or machinery writes.
import {createResonanceSources} from './finite-sources.mjs';
const freeze=Object.freeze;
const revision=n=>Number.isSafeInteger(n)&&n>=0;

// createLiquidEngine must be the trusted shared constructor, not a live-engine
// accessor. Options/authorization must be pure and stable under the host lease.
// The host authenticates the complete world/policy/revision and paired snapshots,
// including parked/frozen/product/other source ledgers, before staging. It must
// reject stale proposals at adoption; this function cannot establish provenance.
export function stageResonanceSourceStep({createLiquidEngine,engineOptions,sourceOptions,
  resident,sourceSnapshot,stateRevision,expectedRevision}={}){
  if(!revision(stateRevision)||!revision(expectedRevision))throw new TypeError('Invalid source transaction revision');
  if(stateRevision!==expectedRevision)return null;
  if(stateRevision===Number.MAX_SAFE_INTEGER)throw new RangeError('Source transaction revision exhausted');
  if(typeof createLiquidEngine!=='function'||!engineOptions||!sourceOptions||
    typeof sourceOptions.authorize!=='function'||!resident||!sourceSnapshot)
    throw new TypeError('Explicit paired source and resident snapshots required');
  const maxCells=engineOptions.maxCells??8192;
  if(!Number.isSafeInteger(maxCells)||maxCells<1||maxCells>65536)
    throw new RangeError('Invalid source staging resident budget');
  // The shared constructor validates the sparse resident state. Never restore
  // configured initial source stock in place of a missing persisted snapshot.
  const engine=createLiquidEngine({...engineOptions,maxCells,snapshot:resident});
  const scheduler=createResonanceSources({...sourceOptions,engine,snapshot:sourceSnapshot});
  let receipt;
  try{receipt=scheduler.step();}
  catch(error){
    // A successful prefix exists only in this private staging engine. Discard
    // both private states; do not hand its partial receipt to live dirty/accounting
    // consumers. The original live-scheduler fault contract remains unchanged.
    throw new Error('Resonance source staging discarded',{cause:error});
  }
  const next=engine.save(),stock=scheduler.save();
  return freeze({expectedRevision,stateRevision:stateRevision+1,
    resident:freeze({...next,cells:freeze(next.cells),pending:freeze(next.pending.map(p=>freeze(p))),
      ...(Object.hasOwn(next,'capacityBlocked')?{capacityBlocked:freeze(next.capacityBlocked.map(p=>freeze(p)))}:{}),
      ...(Object.hasOwn(next,'lateralPhases')?{lateralPhases:freeze(next.lateralPhases.map(p=>freeze(p)))}:{})}),
    sourceSnapshot:freeze({...stock,stores:freeze(stock.stores)}),receipt});
}
