// Detached Phase 2: atomic original MobEngine/global ecology preflight.
// No actual world/mob/save writes, no live PopulationManager replacement.
import {validPoint} from './world-query.mjs';
import {inspectOriginalReconcileReadiness}
  from './ecosystem-reconcile-readiness.mjs';
import {previewGlobalEcologyTick,advanceGlobalEcologyClock,
  commitGlobalEcologyRegion} from './ecosystem-global-clock.mjs';
import {prepareOriginalMobPoll,settleOriginalMobPoll}
  from './ecosystem-region-poll.mjs';

const tickets=new WeakMap();
const closed=new WeakSet();

export function prepareGlobalMobTick({
  clock,seconds,regions,engine,world,seed,observer,biome,light,
  kind='surface',isProtected,spawnOnFirstVisit=false
}={}){
  // Original PopulationManager rejects invalid observers BEFORE touching
  // its clock; the detached source must not silently advance time either.
  if(!validPoint(observer))
    throw new TypeError('Invalid original ecology observer');
  // Only the certified clock can preview a tick. #reconcile must refuse
  // BEFORE that clock is consumed, so the identical original tick can be
  // attempted after its rightful owner resolves wake/away obligations.
  const forecast=previewGlobalEcologyTick(clock,{seconds,regions});
  if(forecast.due){
    const checked=inspectOriginalReconcileReadiness({
      engine,world,observer,isProtected
    });
    if(!checked.ready)
      throw new TypeError('Original ecology reconciliation required');
  }
  const tick=advanceGlobalEcologyClock(clock,{seconds,regions});
  if(tick.selection===null){
    return Object.freeze({
      kind:'skipped',clock:tick.clock,reason:tick.reason,
      proposal:null,attempts:0,rejected:null
    });
  }
  const chosen=tick.selection;
  // The exact real-engine roster, original edit revision, source region and
  // local 12-second replenishment/cooldown all remain strictly checked here.
  const plan=prepareOriginalMobPoll({
    engine,world,seed,region:chosen.region,observer,
    biome,light,kind,isProtected,spawnOnFirstVisit,
    now:chosen.time,record:chosen.record
  });
  const result=Object.freeze({
    kind:plan.kind,clock:tick.clock,reason:'selected',
    regionKey:chosen.key,proposal:plan.proposal,attempts:plan.attempts,
    rejected:plan.rejected
  });
  tickets.set(result,Object.freeze({tick,plan,world}));
  return result;
}

// ONLY source-verifiable real MobEngine admission may produce birth cooldown.
// No arbitrary caller-supplied region/cadence record is accepted. A ticket is
// consumed even on an invalid settlement to prohibit an after-the-fact retry.
export function settleGlobalMobTick(ticket,{
  world,spawnedId=null
}={}){
  const own=ticket&&typeof ticket==='object'?tickets.get(ticket):null;
  if(!own||closed.has(ticket)||world!==own.world)
    throw new TypeError('Invalid or replayed source-global mob ticket');
  closed.add(ticket);
  const regional=settleOriginalMobPoll(own.plan,{world,spawnedId});
  return commitGlobalEcologyRegion(own.tick.clock,own.tick.selection,regional);
}
