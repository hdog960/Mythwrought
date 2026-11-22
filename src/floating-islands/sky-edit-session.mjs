// Isolated upper-world edit -> physical overlay -> mesh invalidation bridge.
// No changes to production Schema-1 save, world cell writer, renderer, or
// Codex's unknown island data. Caller stages/commits its own proposed edit.
import {createSkySidecar,planSkyCellEdit,readSkyEdit,exportSkySidecar,
  restoreSkySidecar} from './sky-sidecar.mjs';
import {planSkyIslandEditInvalidation} from './sky-edit-invalidation.mjs';
const fail=s=>{throw new TypeError('Sky edit session: '+s);};
const safe=Number.isSafeInteger;
const frozenResult=r=>Object.freeze(r);
const isSet=s=>s instanceof Set&&[...s].every(k=>typeof k==='string');
export function createSkyEditSession({seed,worldId,generatorFingerprint,
  naturalAt,validateId,rotationAllowed,maxEdits}={}){
  if([naturalAt,validateId,rotationAllowed].some(f=>typeof f!=='function'))
    fail('actual source reader, material authority and rotation check required');
  const state=createSkySidecar({seed,worldId,generatorFingerprint,maxEdits});
  return frozenResult({state,context:Object.freeze({naturalAt,validateId,rotationAllowed})});
}
export function createSkyEditSessionFromSnapshot(snapshot,opts={}){
  const ctx={naturalAt:opts.naturalAt,validateId:opts.validateId,
    rotationAllowed:opts.rotationAllowed};
  if(Object.values(ctx).some(f=>typeof f!=='function'))fail('original physical readers required');
  const state=restoreSkySidecar(snapshot,opts,ctx);
  return frozenResult({state,context:Object.freeze(ctx)});
}
export function planSkySessionEdit(session,{x,y,z,id,rotation=0,
  expectedRevision,worldId,generatorFingerprint},
  {loadedSkyKeys,loadedGroundKeys}={}){
  if(!session?.state||!session.context||!isSet(loadedSkyKeys)||!isSet(loadedGroundKeys))
    fail('authenticated edit source and resident key sets required');
  // A malformed invalidation is a hard error BEFORE the caller can adopt the
  // proposed new state. There is no partial save or renderer mutation.
  const next=planSkyCellEdit(session.state,{x,y,z,id,rotation,
    expectedRevision,worldId,generatorFingerprint},session.context);
  if(!next.ok||!next.changed)return frozenResult({ok:next.ok,changed:false,session,
    reason:next.reason,meshInvalidations:Object.freeze({skyKeys:Object.freeze([]),groundKeys:Object.freeze([])})});
  const meshInvalidations=planSkyIslandEditInvalidation({x,y,z,
    loadedSkyKeys,loadedGroundKeys});
  return frozenResult({ok:true,changed:true,reason:'Sky edit proposed; no world writes',
    session:frozenResult({...session,state:next.state}),
    meshInvalidations,cell:next.change});
}
export function skySessionOverlay(session){
  if(!session?.state||!session.context)fail('authenticated session required');
  const edits=new Map(),rotations=new Map();
  for(const [x,y,z,id,rotation] of session.state.edits){
    const key=x+','+y+','+z;
    edits.set(key,id);if(rotation)rotations.set(key,rotation);
  }
  return frozenResult({edits,rotations,revision:session.state.revision,
    worldId:session.state.worldId,generatorFingerprint:session.state.generatorFingerprint,
    // Copies only. Mutating these maps cannot mutate session's immutable ledger.
    sourceWrites:0,groundSaveWrites:0});
}
export function skySessionView(session){
  if(!session?.state||!session.context)fail('authenticated session required');
  return frozenResult({get:(x,y,z)=>readSkyEdit(session.state,x,y,z,session.context).id,
    rotationAt:(x,y,z)=>readSkyEdit(session.state,x,y,z,session.context).rotation,
    revision:session.state.revision,worldId:session.state.worldId});
}
export function exportSkyEditSession(session){
  if(!session?.state||!session.context)fail('authenticated session required');
  return exportSkySidecar(session.state,session.context);
}
