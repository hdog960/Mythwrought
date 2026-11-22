// Detached original PopulationManager reconciliation readiness; NO mutations.
import {MobEngine} from './engine.mjs';
import {validPoint} from './world-query.mjs';
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
  const revision=world.revision();
  if(!Number.isSafeInteger(revision)||revision<0)
    throw new TypeError('Invalid original world revision');
  const mobs=engine.all(),required=[];
  for(const mob of mobs){
    if(!validPoint(mob.position)||typeof mob.state!=='string')
      throw new TypeError('Invalid original mob snapshot');
    const near=Math.hypot(...mob.position.map((v,i)=>v-observer[i]))
      <=ORIGINAL_ACTIVE_RADIUS;
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
  return Object.freeze({
    ready:required.length===0,inspected:mobs.length,revision,
    required:Object.freeze(required)
  });
}
