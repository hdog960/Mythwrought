// Liquid-only step admission; the host owns all other frame work and dirty delivery.
// Core v1 can change one origin plus at most five destinations per visit.
export const LIQUID_MAX_CHANGED_PER_VISIT=6;
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const empty=Object.freeze([]);

export function createLiquidWorkBudget({engine,maxVisitsPerStep=64,maxChangedPerStep=384}={}){
  if(typeof engine?.tick!=='function')throw new TypeError('Shared liquid engine required');
  if(!int(maxVisitsPerStep,1,4096)||!int(maxChangedPerStep,0,4096*LIQUID_MAX_CHANGED_PER_VISIT))
    throw new RangeError('Invalid liquid work budget');
  let active=false;
  // availableChanged is reserved by the host before entry. No dirty queue is
  // retained here and no elapsed-time catch-up or extra tick is performed.
  function step({requestedVisits=maxVisitsPerStep,availableChanged=maxChangedPerStep}={}){
    if(active)throw new Error('Reentrant liquid budget step');
    if(!int(requestedVisits,0,maxVisitsPerStep)||!int(availableChanged,0,maxChangedPerStep))
      throw new RangeError('Invalid liquid step admission');
    const visitLimit=Math.min(requestedVisits,Math.floor(availableChanged/LIQUID_MAX_CHANGED_PER_VISIT));
    if(!visitLimit)return Object.freeze({status:'deferred',visitLimit,visited:0,moved:0,changed:empty,pending:null});
    active=true;
    try{
      // Must be the authentic v1 engine, configured with at least this limit.
      // Its normal FIFO and exact dirty coordinates are preserved unchanged.
      const r=engine.tick(visitLimit);
      return Object.freeze({status:'advanced',visitLimit,visited:r.visited,moved:r.moved,changed:r.changed,pending:r.pending});
    }finally{active=false;}
  }
  return Object.freeze({step});
}
