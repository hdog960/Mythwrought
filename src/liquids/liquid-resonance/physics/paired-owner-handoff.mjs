// Lane-local companion to the shared owner handoff and persistence adapters.
// Both adapters must be the authentic, matching-policy Water A implementations
// (via the existing Resonance pair validator), with staged pure host readiness.
// This returns a transient candidate, not a save, lease, or live owner switch.
export function stageResonanceOwnerTransition({persistence,ownerHandoff,pair,
  expectedRevision,owner,mode}={}){
  if(typeof persistence?.validatePair!=='function'||typeof ownerHandoff?.stage!=='function')
    throw new TypeError('Explicit paired persistence and shared handoff required');
  if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0)
    throw new TypeError('Invalid expected revision');
  if(mode!=='detach'&&mode!=='attach')throw new TypeError('Invalid owner transition mode');
  const before=persistence.validatePair(pair),s=before.pair.liquidState;
  if(s.revision!==expectedRevision)return null;
  if(s.revision===Number.MAX_SAFE_INTEGER)throw new RangeError('Owner transition revision exhausted');
  // Only the shared adapter determines ownership, capacity and queue wakes.
  // No source visit occurs during attach/detach, even for an empty shard.
  const moved=ownerHandoff.stage({state:{version:1,resident:s.resident,parked:s.parked},owner,mode});
  if(moved===null)return null;
  const next=persistence.validatePair({liquidState:{...s,revision:s.revision+1,
    resident:moved.state.resident,parked:moved.state.parked},sourceSnapshot:before.pair.sourceSnapshot});
  if(next.totals.units!==before.totals.units||next.totals.energy!==before.totals.energy)
    throw new Error('Resonance owner handoff conservation mismatch');
  // The authentic shared handoff receipt is immutable. Retain all dirty cells
  // and boundary wake counts, but never expose its incomplete state projection.
  const receipt=Object.freeze({owner:moved.owner,mode:moved.mode,movedCells:moved.movedCells,
    movedUnits:moved.movedUnits,boundaryWoken:moved.boundaryWoken,changed:moved.changed});
  return Object.freeze({expectedRevision,stateRevision:s.revision+1,pair:next.pair,
    totals:next.totals,receipt});
}
// Host must authenticate world/policy/revision and atomically adopt this whole
// pair together with actual terrain/readiness and any other ledgers; rollback
// staged readiness on refusal/fault. Keep the old scheduler parked until the
// new engine is adopted; consume the dirty receipt once, then rebind readers.
// This adapter cannot prevent replay if the host reinstalls an old whole pair.
