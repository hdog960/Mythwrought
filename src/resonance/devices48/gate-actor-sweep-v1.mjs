// :48 opt-in actor sweep. SOURCE ONLY; never grants motion.
import {preflightDynamicGateOccupancy} from './gate-dynamic-occupancy-v1.mjs';
const fail = s => { throw new TypeError(s); };
const validId = x => typeof x === 'string' && /^[a-z][a-z0-9_-]{0,47}$/.test(x);
function roster(snapshot) {
 if (!snapshot || !Array.isArray(snapshot.actors) || snapshot.actors.length > 64) fail('invalid roster');
 const map = new Map();
 for (const a of snapshot.actors) {
  const b = a?.bounds;
  if (!validId(a?.id) || map.has(a.id) || !b || !Array.isArray(b.min) || !Array.isArray(b.max) ||
   b.min.length !== 3 || b.max.length !== 3 || !b.min.every(Number.isSafeInteger) || !b.max.every(Number.isSafeInteger) ||
   !b.min.every((n,i) => n >= -1000000 && n < b.max[i] && b.max[i] <= 1000000 && b.max[i]-n <= 16)) fail('invalid actor');
  map.set(a.id,b);
 }
 return map;
}
export function preflightGateActorSweep(frame) {
 if (!frame || !frame.previous || !frame.current || frame.previous.worldId !== frame.current.worldId ||
  !Number.isSafeInteger(frame.previous.tick) || frame.previous.tick < 0 ||
  !Number.isSafeInteger(frame.current.tick) || frame.current.tick !== frame.previous.tick+1) fail('invalid sequence');
 const before=roster(frame.previous),after=roster(frame.current),swept=[];
 for (const [id,a] of before) {
  const b=after.get(id);
  if (!b) continue;
  const min=a.min.map((n,i)=>Math.min(n,b.min[i]));
  const max=a.max.map((n,i)=>Math.max(n,b.max[i]));
  if (min.some((n,i)=>max[i]-n>16)) fail('actor displacement exceeds safe sweep envelope');
  swept.push({id,bounds:{min,max}});
 }
 const baseline=preflightDynamicGateOccupancy(frame);
 const bridge=preflightDynamicGateOccupancy({...frame,
  previous:{...frame.previous,actors:swept},current:{...frame.current,actors:swept}});
 const results=baseline.results.map((r,i)=>{
  const s=bridge.results[i];
  if (!s || s.id!==r.id || s.requestedOpen!==r.requestedOpen) fail('gate roster mismatch');
  const blockers=[...new Set([...r.blockers,...s.blockers.filter(x=>x.startsWith('previous:actor:')).map(x=>'sweep:'+x.slice(9))])].sort();
  return Object.freeze({id:r.id,requestedOpen:r.requestedOpen,candidatePathClear:r.candidatePathClear&&s.candidatePathClear,
   blockers:Object.freeze(blockers),movementAuthorized:false,collisionCleared:false,authoritativeDelivery:false,
   physicsBound:false,productionBound:false,reason:blockers.length?'actor-sweep-or-occupancy-blocked':'awaiting-authoritative-live-physics-and-delivery'});
 });
 return Object.freeze({worldId:baseline.worldId,tick:baseline.tick,results:Object.freeze(results),
  movementAuthorized:false,physicsBound:false,productionBound:false,authoritativeDelivery:false});
}
