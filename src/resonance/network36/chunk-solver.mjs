// Opt-in, read-only chunk-aware Resonance solver bridge. Never persists charge or edits worlds.
import {visibleResonanceSnapshot} from './chunk-lifecycle.mjs';
import {solveResonance} from './solver.mjs';
export const CHUNK_SOLVER_CONTRACT = 'resonance-network36-chunk-solver-v1';
export function solveVisibleResonance(snapshot, loadedChunks, options={}) {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) throw Error('invalid snapshot');
  const {tick=0, ...entities}=snapshot;
  const visible=visibleResonanceSnapshot(entities,loadedChunks,options);
  // The solver is pure. Missing entities are disconnected, never deleted from caller state.
  const result=solveResonance({nodes:visible.nodes,generators:visible.generators,
    devices:visible.devices,stores:visible.stores,tick});
  return {contract:CHUNK_SOLVER_CONTRACT,...result,
    excluded:[...visible.excluded], visibleCounts:Object.freeze({
      nodes:visible.nodes.length,generators:visible.generators.length,
      devices:visible.devices.length,stores:visible.stores.length})};
}
