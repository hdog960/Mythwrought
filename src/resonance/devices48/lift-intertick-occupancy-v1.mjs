// Source-only conservative lift/actor intertick occupancy. Never authorizes motion.
import { preflightLiftStop } from './lift-stop-preflight-v1.mjs';
const ident = s => typeof s === 'string' && /^[a-z0-9_-]{1,48}$/.test(s);
const boxValid = b => b && ['minX','minY','minZ','maxX','maxY','maxZ'].every(k => Number.isFinite(b[k]) && Math.abs(b[k])<=4096) && b.minX<b.maxX && b.minY<b.maxY && b.minZ<b.maxZ;
const union = (a,b) => ({minX:Math.min(a.minX,b.minX),minY:Math.min(a.minY,b.minY),minZ:Math.min(a.minZ,b.minZ),maxX:Math.max(a.maxX,b.maxX),maxY:Math.max(a.maxY,b.maxY),maxZ:Math.max(a.maxZ,b.maxZ)});
export function preflightLiftIntertick({worldId,fromTick,toTick,platform,deltaY,previousActors,currentActors,obstacles,energyCandidate=false}={}) {
  if (!ident(worldId) || !Number.isSafeInteger(fromTick) || fromTick<0 || !Number.isSafeInteger(toTick) || toTick!==fromTick+1 ||
      !Array.isArray(previousActors) || !Array.isArray(currentActors) || previousActors.length>64 || currentActors.length>64 ||
      !Array.isArray(obstacles) || energyCandidate!==false) throw new TypeError('invalid intertick frame');
  function roster(entries) {
    const map=new Map();
    for (const e of entries) {
      if (!e || !ident(e.id) || map.has(e.id) || !boxValid(e.box)) throw new TypeError('invalid actor roster');
      map.set(e.id,e.box);
    }
    return map;
  }
  const before=roster(previousActors), after=roster(currentActors);
  const swept=[];
  for (const id of [...new Set([...before.keys(),...after.keys()])].sort()) {
    const a=before.get(id),b=after.get(id);
    const envelope=a&&b?union(a,b):(a||b);
    if (a&&b && ['X','Y','Z'].some(axis=>Math.abs((a['min'+axis]+a['max'+axis])-(b['min'+axis]+b['max'+axis]))>32)) throw new TypeError('unbounded actor displacement');
    swept.push({id,box:envelope});
  }
  if (swept.length>64) throw new TypeError('too many actors across snapshots');
  const result=preflightLiftStop({worldId,fromTick,toTick,platform,deltaY,actors:swept,obstacles,energyCandidate:false});
  return Object.freeze({...result,contract:'resonance48-lift-intertick-occupancy-v1',sampledActors:Object.freeze([...before.keys(),...after.keys()].filter((id,i,a)=>a.indexOf(id)===i).sort()),
    continuousCollisionProven:false,passengerTransportAuthorized:false,physicsBound:false,authoritativeDelivery:false,movementAuthorized:false,productionBound:false});
}
