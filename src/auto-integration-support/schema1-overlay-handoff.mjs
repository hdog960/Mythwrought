// Candidate-only bridge: supplied decoded snapshots are NOT evidence of actual persistence.
import { inspectSchema1EditIntent } from './schema1-edit-intent-contract.mjs';
import { verifyOverlayReload } from './overlay-reload-contract.mjs';
const fail = (reason) => Object.freeze({ok:false,status:'NOT_VERIFIED',reason,saveSchemaVerified:false,integrationVerified:false,browserVerified:false});
const key = p => `${p.x},${p.y},${p.z}`;
/** Fail closed if decoded schema-1 witnesses and replayed surface overlays disagree. */
export function inspectSchema1OverlayHandoff({before,after,ledger,seed,initial,reloaded,registry}={}) {
  const schema=inspectSchema1EditIntent({before,after,ledger,seed});
  if (!schema.ok) return fail(`schema1:${schema.reason}`);
  if (!Array.isArray(ledger) || !Array.isArray(before?.restoredNaturalKeys) || !Array.isArray(initial?.natural)) return fail('missing-provenance');
  const reload=verifyOverlayReload({seed,initial,reloaded,edits:ledger,registry});
  if (!reload.ok) return fail(`overlay:${reload.reason}`);
  const natural=new Map(initial.natural.map(c=>[key(c),c.blockId]));
  if (natural.size!==initial.natural.length) return fail('duplicate-natural-cell');
  const restored=new Set(before.restoredNaturalKeys);
  for (const edit of ledger) {
    const k=key(edit);
    if (!natural.has(k)) return fail('edit-not-in-natural-snapshot');
    if (restored.has(k) && natural.get(k)!==edit.blockId) return fail('false-natural-restoration');
  }
  for (const k of restored) if (!ledger.some(e=>key(e)===k)) return fail('restoration-without-edit');
  const beforeCells=new Map(before.cells.map(c=>[key(c),c.blockId]));
  if (beforeCells.size!==before.cells.length) return fail('duplicate-decoded-cell');
  for (const edit of ledger) if (beforeCells.get(key(edit))!==edit.blockId) return fail('decoded-edit-mismatch');
  return Object.freeze({ok:true,status:'CROSS_FIXTURE_MATCH_ONLY',restoredNaturalCount:restored.size,editCount:ledger.length,saveSchemaVerified:false,integrationVerified:false,browserVerified:false});
}
