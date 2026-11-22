// :48 source-only dynamic occupancy preflight. Never grants movement.
import {preflightCandidateGateClearance} from './gate-clearance-preflight-v1.mjs';
const fail = message => { throw new TypeError(message); };
const validId = id => typeof id === 'string' && /^[a-z][a-z0-9_-]{0,47}$/.test(id);
const box = b => {
 if (!b || !Array.isArray(b.min) || !Array.isArray(b.max) || b.min.length !== 3 || b.max.length !== 3 ||
     !b.min.every(Number.isSafeInteger) || !b.max.every(Number.isSafeInteger) ||
     !b.min.every((n,i) => n >= -1000000 && n < b.max[i] && b.max[i] <= 1000000 && b.max[i]-n <= 16)) fail('invalid occupancy bounds');
 return {min:[...b.min],max:[...b.max]};
};
const canonicalActors = actors => {
 if (!Array.isArray(actors) || actors.length > 64) fail('invalid actor roster');
 const seen = new Set();
 return actors.map(actor => {
  if (!validId(actor?.id) || seen.has(actor.id)) fail('duplicate or invalid actor');
  seen.add(actor.id);
  return {id:actor.id,bounds:box(actor.bounds)};
 }).sort((a,b)=>a.id.localeCompare(b.id,'en'));
};
export function preflightDynamicGateOccupancy({previous,current,intents,paths,obstacles}) {
 if (!previous || !current || !validId(previous.worldId) || previous.worldId !== current.worldId ||
     !Number.isSafeInteger(previous.tick) || previous.tick < 0 ||
     !Number.isSafeInteger(current.tick) || current.tick !== previous.tick+1) fail('nonconsecutive or cross-world occupancy');
 const before=canonicalActors(previous.actors),after=canonicalActors(current.actors);
 // Both snapshots are potentially occupied; disappearance never grants clearance.
 const combined=[...before.map(a=>({...a,id:'before_'+a.id})),...after.map(a=>({...a,id:'after_'+a.id}))];
 if (combined.length > 128) {
  // Underlying preflight caps actors at 64: evaluate each snapshot separately.
  const a=preflightCandidateGateClearance({worldId:current.worldId,tick:current.tick,intents,paths,obstacles,actors:before});
  const b=preflightCandidateGateClearance({worldId:current.worldId,tick:current.tick,intents,paths,obstacles,actors:after});
  return join(a,b);
 }
 const a=preflightCandidateGateClearance({worldId:current.worldId,tick:current.tick,intents,paths,obstacles,actors:before});
 const b=preflightCandidateGateClearance({worldId:current.worldId,tick:current.tick,intents,paths,obstacles,actors:after});
 return join(a,b);
}
function join(a,b) {
 const results=a.results.map((prior,i)=>{
  const now=b.results[i];
  if (prior.id!==now.id) fail('mismatched gate roster');
  const blockers=[...new Set([...prior.blockers.map(x=>'previous:'+x),...now.blockers.map(x=>'current:'+x)])].sort();
  return Object.freeze({id:prior.id,requestedOpen:prior.requestedOpen,
   candidatePathClear:prior.candidatePathClear && now.candidatePathClear,
   blockers:Object.freeze(blockers),movementAuthorized:false,collisionCleared:false,
   authoritativeDelivery:false,physicsBound:false,productionBound:false,
   reason:blockers.length?'occupancy-observed':'awaiting-authoritative-live-physics-and-delivery'});
 });
 return Object.freeze({worldId:a.worldId,tick:a.tick,results:Object.freeze(results),
  movementAuthorized:false,physicsBound:false,productionBound:false,authoritativeDelivery:false});
}
