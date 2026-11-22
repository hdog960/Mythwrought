// Detached original-source global census fence; no live MobEngine/world edits.
// The FIRST region-selection getter runs after this source-state snapshot.
// Protect against world edits / MobEngine mutations between the original
// reconciliation and subsequent regional preflight baseline capture.
import {captureOriginalMobRoster,assertOriginalMobRosterUnchanged}
  from './ecosystem-roster-integrity.mjs';
import {captureOriginalWorldRevision,assertOriginalWorldRevisionUnchanged}
  from './ecosystem-world-revision-fence.mjs';

const certified=new WeakMap();

export function captureOriginalGlobalCensusFence({engine,world}={}){
  if(typeof engine?.all!=='function')
    throw new TypeError('Original global census requires MobEngine roster');
  // Capture source-engine roster before calling any external world revision.
  // Check both reads twice to reject mutation during either source callback.
  const roster=captureOriginalMobRoster(engine.all());
  const revision=captureOriginalWorldRevision(world);
  assertOriginalMobRosterUnchanged(roster,engine.all());
  assertOriginalWorldRevisionUnchanged(world,revision);
  const ticket=Object.freeze({revision});
  certified.set(ticket,Object.freeze({engine,world,revision,roster}));
  return ticket;
}

export function assertOriginalGlobalCensusFenceUnchanged(ticket,{
  engine,world
}={}){
  const own=ticket&&typeof ticket==='object'?certified.get(ticket):null;
  if(!own||own.engine!==engine||own.world!==world)
    throw new TypeError('Uncertified original global census fence');
  // A world edit may happen during the MobEngine roster read or vice versa:
  // bracket the source roster by authoritative world-revision reads.
  assertOriginalWorldRevisionUnchanged(world,own.revision);
  assertOriginalMobRosterUnchanged(own.roster,engine.all());
  assertOriginalWorldRevisionUnchanged(world,own.revision);
  return true;
}
