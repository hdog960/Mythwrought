// Mythwrought Roadmap 9 M5 — immutable, detached Creative transaction history.
// Applies ONLY to M4's in-memory build plans. No runtime, storage, or save imports.
import {BUILD_ABI,MAX_BATCH_EDITS,createBuildState,planBuildBatch} from './build-model.mjs';

export const HISTORY_ABI = 'mythwrought.creative.history.v1';
export const DEFAULT_HISTORY_LIMIT = 32;
export const MAX_HISTORY_LIMIT = 64;
const integer = Number.isSafeInteger;
const validRevision = x => integer(x) && x >= 0;
const vector = p => p && integer(p.x) && integer(p.y) && integer(p.z);
const clonePoint = p => Object.freeze({x:p.x,y:p.y,z:p.z});

// Stable, independent of array insertion order, but sensitive to every physical cell,
// typed ID, orientation and object/block distinction. Not a security signature.
export function buildFingerprint(state) {
  if (state?.abi !== BUILD_ABI || !Array.isArray(state.placements))
    throw TypeError('Invalid M4 build state for fingerprint');
  const records=state.placements.map(p => {
    if (!vector(p.at) || !Array.isArray(p.cells) || !['block','object'].includes(p.kind) ||
        !integer(p.rotation) || p.rotation<0 || p.rotation>3 ||
        !(typeof p.id==='string' || integer(p.id)) || !p.cells.every(vector))
      throw TypeError('Malformed placement fingerprint');
    return [typeof p.id,p.id,p.kind,p.at.x,p.at.y,p.at.z,p.rotation,
      p.cells.map(c=>[c.x,c.y,c.z]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2])];
  });
  records.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return JSON.stringify(records);
}
export function sealActions(actions) {
  if (!Array.isArray(actions) || actions.length<1 || actions.length>MAX_BATCH_EDITS)
    throw TypeError('Invalid bounded history actions');
  return Object.freeze(actions.map(action => {
    if (!action || !vector(action.at)) throw TypeError('Invalid action coordinate');
    if (action.type==='remove') return Object.freeze({type:'remove',at:clonePoint(action.at)});
    if (action.type!=='place' || !(typeof action.id==='string' || integer(action.id)) ||
        !integer(action.rotation??0) || (action.rotation??0)<0 || (action.rotation??0)>3)
      throw TypeError('Invalid placement history action');
    return Object.freeze({type:'place',id:action.id,at:clonePoint(action.at),rotation:action.rotation??0});
  }));
}
const freezeEntry = entry => Object.freeze({
  forward:sealActions(entry.forward),inverse:sealActions(entry.inverse),
  beforeFingerprint:entry.beforeFingerprint,afterFingerprint:entry.afterFingerprint
});
export function createHistorySession({state=createBuildState(),limit=DEFAULT_HISTORY_LIMIT}={}) {
  if (state?.abi!==BUILD_ABI || !validRevision(state.revision) || !Array.isArray(state.placements))
    throw TypeError('Invalid M4 state');
  if (!integer(limit) || limit<1 || limit>MAX_HISTORY_LIMIT)
    throw RangeError('Invalid history cap');
  buildFingerprint(state);
  return Object.freeze({abi:HISTORY_ABI,state,limit,past:Object.freeze([]),future:Object.freeze([])});
}
function assertSession(session) {
  if (session?.abi!==HISTORY_ABI || !validRevision(session.state?.revision) ||
      !integer(session.limit) || session.limit<1 || session.limit>MAX_HISTORY_LIMIT ||
      !Array.isArray(session.past) || !Array.isArray(session.future) ||
      session.past.length>session.limit || session.future.length>session.limit ||
      session.past.length+session.future.length>session.limit)
    throw TypeError('Invalid detached history session');
  buildFingerprint(session.state);
}
const fail=(session,reason)=>Object.freeze({ok:false,session,reason});
const success=(session,transaction,kind)=>Object.freeze({ok:true,session,transaction,kind});
function check(session,expectedRevision){
  assertSession(session);
  return validRevision(expectedRevision) && expectedRevision===session.state.revision;
}
// Execute a fresh M4 transaction only when the caller's revision is exact.
export function executeHistoryBatch(session,actions,ctx={},expectedRevision) {
  if (!check(session,expectedRevision))return fail(session,'revision-conflict');
  let forward;try{forward=sealActions(actions);}catch{return fail(session,'invalid-history-actions');}
  const result=planBuildBatch(session.state,forward,ctx);
  if (!result.ok)return fail(session,result.reason);
  const beforeFingerprint=buildFingerprint(session.state),afterFingerprint=buildFingerprint(result.state);
  if (beforeFingerprint===afterFingerprint)return fail(session,'no-op-transaction');
  const entry=freezeEntry({forward,inverse:result.transaction.undoCandidate.inverseActions,beforeFingerprint,afterFingerprint});
  const past=Object.freeze([...session.past,entry].slice(-session.limit));
  const next=Object.freeze({...session,state:result.state,past,future:Object.freeze([])});
  return success(next,result.transaction,'execute');
}
// Undo is NOT assignment of a stale snapshot: re-execute M4 inverse actions,
// enforce current physics/authority callbacks, and compare the exact footprint.
export function undoHistory(session,ctx={},expectedRevision) {
  if (!check(session,expectedRevision))return fail(session,'revision-conflict');
  if (!session.past.length)return fail(session,'nothing-to-undo');
  const entry=session.past.at(-1);
  if (buildFingerprint(session.state)!==entry.afterFingerprint)return fail(session,'history-diverged');
  const result=planBuildBatch(session.state,entry.inverse,ctx);
  if (!result.ok)return fail(session,'undo-'+result.reason);
  if (buildFingerprint(result.state)!==entry.beforeFingerprint)return fail(session,'undo-footprint-mismatch');
  const next=Object.freeze({...session,state:result.state,
    past:Object.freeze(session.past.slice(0,-1)),future:Object.freeze([...session.future,entry])});
  return success(next,result.transaction,'undo');
}
export function redoHistory(session,ctx={},expectedRevision) {
  if (!check(session,expectedRevision))return fail(session,'revision-conflict');
  if (!session.future.length)return fail(session,'nothing-to-redo');
  const entry=session.future.at(-1);
  if (buildFingerprint(session.state)!==entry.beforeFingerprint)return fail(session,'history-diverged');
  const result=planBuildBatch(session.state,entry.forward,ctx);
  if (!result.ok)return fail(session,'redo-'+result.reason);
  if (buildFingerprint(result.state)!==entry.afterFingerprint)return fail(session,'redo-footprint-mismatch');
  const next=Object.freeze({...session,state:result.state,
    past:Object.freeze([...session.past,entry]),future:Object.freeze(session.future.slice(0,-1))});
  return success(next,result.transaction,'redo');
}
// Internal use by the detached serializer after strict parsing and geometry replay.
export function rehydrateHistorySession(state,limit,past,future) {
  const base=createHistorySession({state,limit});
  if (!Array.isArray(past)||!Array.isArray(future)||past.length>limit||future.length>limit||past.length+future.length>limit)
    throw TypeError('Invalid restored history bounds');
  const seal=entries=>Object.freeze(entries.map(e=>{
    if (!e || typeof e.beforeFingerprint!=='string' || typeof e.afterFingerprint!=='string' ||
        e.beforeFingerprint===e.afterFingerprint)throw TypeError('Invalid history fingerprints');
    return freezeEntry(e);
  }));
  const restored=Object.freeze({...base,past:seal(past),future:seal(future)});
  const current=buildFingerprint(state);
  if (restored.past.length && restored.past.at(-1).afterFingerprint!==current)
    throw TypeError('Restored undo head does not match world');
  if (restored.future.length && restored.future.at(-1).beforeFingerprint!==current)
    throw TypeError('Restored redo head does not match world');
  return restored;
}
