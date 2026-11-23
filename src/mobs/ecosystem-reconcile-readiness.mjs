// Detached original PopulationManager reconciliation readiness; NO mutations.
import {MobEngine} from './engine.mjs';
import {validPoint} from './world-query.mjs';
import {captureOriginalReconcileObserver,assertOriginalReconcileObserverUnchanged}
  from './ecosystem-reconcile-observer.mjs';
import {captureOriginalMobRoster,assertOriginalMobRosterUnchanged}
  from './ecosystem-roster-integrity.mjs';
export const ORIGINAL_ACTIVE_RADIUS=18;
export const ORIGINAL_AWAY_GRACE=6;

// The source PopulationManager reconciles on every DUE global tick BEFORE
// region selection. Its private away ledger cannot be replaced by a proposal.
export function inspectOriginalReconcileReadiness({
  engine,world,observer,isProtected=()=>false
}={}){
  if(!(engine instanceof MobEngine)||!validPoint(observer)||
     typeof world?.residentAt!=='function'||
     typeof world?.revision!=='function'||
     typeof isProtected!=='function')
    throw new TypeError('Invalid original reconcile inputs');
  // Snapshot source observer BEFORE world revision/residency and protection
  // callbacks. Never classify distance using mutable caller-owned coordinates.
  const sourceObserver=captureOriginalReconcileObserver(observer);
  const revision=world.revision();
  if(!Number.isSafeInteger(revision)||revision<0)
    throw new TypeError('Invalid original world revision');
  assertOriginalReconcileObserverUnchanged(sourceObserver,observer);
  const mobs=engine.all(),required=[];
  const rosterCertificate=captureOriginalMobRoster(mobs);
  for(const mob of mobs){
    if(!validPoint(mob.position)||typeof mob.state!=='string')
      throw new TypeError('Invalid original mob snapshot');
    const near=Math.hypot(...mob.position.map(
      (v,i)=>v-sourceObserver.point[i]))<=ORIGINAL_ACTIVE_RADIUS;
    const resident=world.residentAt(mob.position);
    if(resident!==true&&resident!==false)
      throw new TypeError('Unknown original mob residency');
    if(near&&resident){
      if(mob.state==='dormant')
        required.push(Object.freeze({id:mob.id,kind:'wake-idle'}));
      continue;
    }
    if(mob.state==='active'||mob.state==='idle')
      required.push(Object.freeze({id:mob.id,kind:'sleep-dormant'}));
    const protectedMob=mob.important?true:isProtected(mob);
    if(typeof protectedMob!=='boolean')
      throw new TypeError('Unknown original mob protection');
    required.push(Object.freeze({id:mob.id,kind:protectedMob?
      'protected-away-state':'unprotected-away-ledger'}));
  }
  if(world.revision()!==revision)
    throw new TypeError('World revision changed during reconcile inspection');
  // Original world editRevision alone cannot detect MobEngine mutations
  // from a residency/protection callback. Re-read the source engine here.
  assertOriginalMobRosterUnchanged(rosterCertificate,engine.all());
  // A host can return an unchanged snapshot then mutate original MobEngine
  // immediately after materializing it. A second bounded readback catches
  // that one-shot late mutation before returning an apparently ready state.
  // Neither read writes to the source engine or claims private #away state.
  assertOriginalMobRosterUnchanged(rosterCertificate,engine.all());
  // The final MobEngine.all() call is still a host-controlled callback.
  // An edit made DURING that roster read must not be silently accepted as
  // the world whose residency and protection decisions were inspected.
  // This is a read-only barrier; it never rewinds or mutates the world.
  if(world.revision()!==revision)
    throw new TypeError('World revision changed during reconcile inspection');
  // Residency/protection may rewrite observer without touching MobEngine or
  // world revision; reject stale reconcile decisions before global clock use.
  assertOriginalReconcileObserverUnchanged(sourceObserver,observer);
  return Object.freeze({
    ready:required.length===0,inspected:mobs.length,revision,
    required:Object.freeze(required)
  });
}
