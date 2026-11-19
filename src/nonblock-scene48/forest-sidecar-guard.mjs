// :48 opt-in forest sidecar guard. Never writes schema-1 or production world state.
import {FOREST_FIXTURE_VERSION,makeForestBreakFixture} from './forest-break-fixture.mjs';
import {createForestCandidate,FOREST_CANDIDATES} from './forest-phase1-candidates.mjs';
export const FOREST_SIDECAR_GUARD_VERSION='nonblock-forest-sidecar-guard-v1';
const integer=Number.isSafeInteger;
export function makeSeedScopedForestFixture(seed,specs,snapshot){
 if(!integer(seed)||!Array.isArray(specs)||specs.length>4096)throw new TypeError('invalid forest world scope');
 const resolved=specs.map(spec=>{
  if(!spec||!FOREST_CANDIDATES.includes(spec.sceneId)||!Array.isArray(spec.anchor)||
     spec.anchor.length!==3||!spec.anchor.every(integer)||
     (spec.seed!==undefined&&spec.seed!==seed))throw new TypeError('foreign forest specification');
  return {sceneId:spec.sceneId,seed,anchor:[...spec.anchor]};
 });
 const keys=new Set(resolved.map(s=>createForestCandidate(s.sceneId,seed,...s.anchor).instanceKey));
 if(keys.size!==resolved.length)throw new TypeError('duplicate forest placement');
 let sidecar={version:FOREST_FIXTURE_VERSION,removed:[]};
 if(snapshot!==undefined){
  if(!snapshot||snapshot.contract!==FOREST_SIDECAR_GUARD_VERSION||
     snapshot.seed!==seed||!Array.isArray(snapshot.removed)||
     snapshot.removed.length>keys.size)throw new TypeError('foreign forest sidecar');
  const removed=new Set();
  for(const key of snapshot.removed){
   if(typeof key!=='string'||!keys.has(key)||removed.has(key))throw new TypeError('invalid forest tombstone');
   removed.add(key);
  }
  sidecar={version:FOREST_FIXTURE_VERSION,removed:[...removed]};
 }
 const fixture=makeForestBreakFixture(resolved,sidecar);
 return Object.freeze({
  visible:fixture.visible,pickRay:fixture.pickRay,breakByKey:fixture.breakByKey,
  snapshot:()=>Object.freeze({contract:FOREST_SIDECAR_GUARD_VERSION,seed,
   removed:Object.freeze([...fixture.tombstoneSidecar().removed])})
 });
}
