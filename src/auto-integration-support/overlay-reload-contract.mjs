// Candidate-only reload/seed contract for surface overlays. Does not touch saves.
import { arbitrateNaturalOverlay } from './player-edit-overlay-arbitration.mjs';
const bad = reason => Object.freeze({ok:false,status:'NOT_VERIFIED',reason,integrationVerified:false});
const validSeed = s => typeof s==='string' && s.length>0 && s.length<=128;
const coordKey = p => `${p.x},${p.y},${p.z}`;
const validCell = p => p && [p.x,p.y,p.z].every(Number.isSafeInteger);
const ordered = cells => [...cells].sort((a,b)=>coordKey(a).localeCompare(coordKey(b)));
function canonical(cells) {
  return JSON.stringify(cells.map(({key,blockId,source})=>[key,blockId,source]));
}
/**
 * Compare two independently supplied, fixed-seed generator snapshots and replayed
 * durable edits. A caller must provide actual producer snapshots; no generator is mocked.
 * This proves only the supplied fixture's determinism, not schema-1 persistence.
 */
export function verifyOverlayReload({seed,initial,reloaded,edits,registry}={}) {
  if (!validSeed(seed) || !Array.isArray(edits) || !Array.isArray(registry) ||
      !initial || !reloaded) return bad('invalid-input');
  for (const snapshot of [initial,reloaded]) {
    if (snapshot.seed!==seed || !Array.isArray(snapshot.natural) ||
        !Array.isArray(snapshot.overlay)) return bad('seed-or-snapshot-mismatch');
  }
  if (!edits.every(e=>validCell(e) && e.intent==='player')) return bad('missing-durable-edit-intent');
  const first=arbitrateNaturalOverlay({...initial,edits,registry});
  const second=arbitrateNaturalOverlay({...reloaded,edits,registry});
  if (!first.ok || !second.ok) return bad('arbitration-rejected');
  const baseline=arbitrateNaturalOverlay({...initial,edits:[],registry});
  const after=arbitrateNaturalOverlay({...reloaded,edits:[],registry});
  if (!baseline.ok || !after.ok) return bad('baseline-rejected');
  if (canonical(baseline.cells)!==canonical(after.cells)) return bad('seeded-world-drift');
  if (canonical(first.cells)!==canonical(second.cells)) return bad('reload-output-drift');
  const playerKeys=new Set(edits.map(coordKey));
  if (first.cells.filter(c=>c.source==='player').length!==playerKeys.size ||
      !first.cells.filter(c=>playerKeys.has(c.key)).every(c=>c.source==='player'))
    return bad('player-intent-lost');
  return Object.freeze({ok:true,status:'FIXTURE_RELOAD_MATCH_ONLY',
    integrationVerified:false,saveSchemaVerified:false,browserVerified:false,
    cellCount:first.cells.length,playerEditCount:playerKeys.size});
}
