// Detached Phase 2: atomic original MobEngine/global ecology preflight.
// No actual world/mob/save writes, no live PopulationManager replacement.
import {validPoint} from './world-query.mjs';
import {captureOriginalGlobalCensusFence,assertOriginalGlobalCensusFenceUnchanged}
  from './ecosystem-global-census-fence.mjs';
import {captureOriginalReconcileObserver,assertOriginalReconcileObserverUnchanged}
  from './ecosystem-reconcile-observer.mjs';
import {inspectOriginalReconcileReadiness}
  from './ecosystem-reconcile-readiness.mjs';
import {previewGlobalEcologyTick,previewGlobalEcologySelection,advanceGlobalEcologyClock,
  commitGlobalEcologyRegion} from './ecosystem-global-clock.mjs';
import {prepareOriginalMobPoll,settleOriginalMobPoll}
  from './ecosystem-region-poll.mjs';

const tickets=new WeakMap();
const closed=new WeakSet();

function unchangedSelection(a,b){
  return a.reason===b.reason&&a.time===b.time&&
    a.nextCursor===b.nextCursor&&a.key===b.key&&
    a.record===b.record&&a.evictKey===b.evictKey&&
    (a.region===null?b.region===null:
      b.region!==null&&['cx','cz','section','feet'].every(
        key=>Object.is(a.region[key],b.region[key])));
}

export function prepareGlobalMobTick({
  clock,seconds,regions,engine,world,seed,observer,biome,light,
  kind='surface',isProtected,spawnOnFirstVisit=false
}={}){
  // Original PopulationManager rejects invalid observers BEFORE touching
  // its clock; the detached source must not silently advance time either.
  if(!validPoint(observer))
    throw new TypeError('Invalid original ecology observer');
  // Certified source preview includes BOTH global due-ness and the
  // original first-64 region/capacity/oldest-stale selection. Nothing here
  // consumes clock identity or allocates an executable selection ticket.
  // One observer identity spans the complete global reconcile, selected
  // region preview, physical poll, and the final certified clock advance.
  // A callback may rewrite the caller's observer without editing the world.
  const observerCertificate=captureOriginalReconcileObserver(observer);
  // Predict due-ness without invoking region callbacks. On due original
  // ticks, retain authoritative source-engine roster and world revision
  // from BEFORE the first caller-owned region-selection access. The inner
  // reconcile / regional guards alone start their baselines too late.
  const due=previewGlobalEcologyTick(clock,{seconds,regions}).due;
  const globalSource=due?captureOriginalGlobalCensusFence({engine,world}):null;
  assertOriginalReconcileObserverUnchanged(observerCertificate,observer);
  const checkGlobalSource=()=>{
    if(globalSource)
      assertOriginalGlobalCensusFenceUnchanged(globalSource,{engine,world});
    assertOriginalReconcileObserverUnchanged(observerCertificate,observer);
  };
  const planned=previewGlobalEcologySelection(clock,{seconds,regions});
  checkGlobalSource();
  if(planned.reason!=='interval'){
    const checked=inspectOriginalReconcileReadiness({
      engine,world,observer,isProtected
    });
    if(!checked.ready)
      throw new TypeError('Original ecology reconciliation required');
  }
  const reconciledSelection=previewGlobalEcologySelection(clock,{seconds,regions});
  if(!unchangedSelection(planned,reconciledSelection))
    throw new TypeError('Original source selection changed during reconcile');
  checkGlobalSource();

  // Prepare the real original-engine roster and voxel/rarity/cooldown query
  // BEFORE global advance consumes the one-shot certified source clock.
  // Failed source residency, world revision, malformed roster, or an engine
  // mutation inside a protection callback now leaves that clock reusable.
  let plan=null;
  if(planned.reason==='selected'){
    plan=prepareOriginalMobPoll({
      engine,world,seed,region:planned.region,observer,
      biome,light,kind,isProtected,spawnOnFirstVisit,
      now:planned.time,record:planned.record
    });
  }
  const polledSelection=previewGlobalEcologySelection(clock,{seconds,regions});
  if(!unchangedSelection(planned,polledSelection))
    throw new TypeError('Original source selection changed during poll');
  checkGlobalSource();

  // Do not invoke caller-controlled region getters a fourth time AFTER the
  // final observer barrier. The clock authenticates this one-use preview.
  const tick=advanceGlobalEcologyClock(clock,{
    seconds,regions,certifiedSelection:polledSelection
  });
  if(tick.reason!==planned.reason||
     (tick.selection!==null&&
      (tick.selection.key!==planned.key||
       tick.selection.record!==planned.record||
       tick.selection.time!==planned.time)))
    throw new TypeError('Original source tick changed after preflight');
  if(tick.selection===null){
    return Object.freeze({
      kind:'skipped',clock:tick.clock,reason:tick.reason,
      proposal:null,attempts:0,rejected:null
    });
  }
  const result=Object.freeze({
    kind:plan.kind,clock:tick.clock,reason:'selected',
    regionKey:tick.selection.key,proposal:plan.proposal,
    attempts:plan.attempts,rejected:plan.rejected
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
