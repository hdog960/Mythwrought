// Detached Phase 2: atomic original MobEngine/global ecology preflight.
// No actual world/mob/save writes, no live PopulationManager replacement.
import {advanceGlobalEcologyClock,commitGlobalEcologyRegion}
  from './ecosystem-global-clock.mjs';
import {prepareOriginalMobPoll,settleOriginalMobPoll}
  from './ecosystem-region-poll.mjs';

const tickets=new WeakMap();
const closed=new WeakSet();

export function prepareGlobalMobTick({
  clock,seconds,regions,engine,world,seed,observer,biome,light,
  kind='surface',isProtected,spawnOnFirstVisit=false
}={}){
  // Source global interval and region rotation belong to the independent
  // original-world scheduler; this will never call engine.spawn().
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
