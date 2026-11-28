import { saveFingerprint } from '../persistence.mjs';
import { MobEngine } from './engine.mjs';
import { BehaviorController } from './behavior.mjs';
import { MobCombat } from './combat.mjs';
import { CompanionManager } from './companion.mjs';
import { AnimalInteractions } from './animal-interactions.mjs';

const SCHEMA = 1;
const MAX_LENGTH = 256_000;

export function serializeRoster({engine,companions,animals,creativeSpawnIds=[]}) {
  if(!Array.isArray(creativeSpawnIds)||creativeSpawnIds.length>32||
      new Set(creativeSpawnIds).size!==creativeSpawnIds.length||
      creativeSpawnIds.some(id=>typeof id!=='string'||id.length>64))
    throw TypeError('Invalid Creative creature ownership');
  const state={
    engine:engine.checkpoint(), companions:companions.checkpoint(), tamed:animals.checkpoint()
  };
  const live=new Set(state.engine.entities.map(mob=>mob.id));
  if(creativeSpawnIds.some(id=>!live.has(id)))throw TypeError('Stale Creative creature identity');
  // Do not change bytes/schema for existing non-Creative snapshots.
  if(creativeSpawnIds.length)state.creativeSpawnIds=[...creativeSpawnIds].sort();
  const payload = JSON.stringify(state);
  const text=JSON.stringify({schema:SCHEMA,payload,checksum:saveFingerprint(payload)});
  if (text.length>MAX_LENGTH) throw RangeError('Mob snapshot exceeds staging bounds');
  return text;
}

export function restoreRoster(text,world,objectAccess=null,combatOptions=undefined) {
  if (typeof text!=='string' || text.length>MAX_LENGTH) throw TypeError('Invalid mob snapshot size');
  const envelope=JSON.parse(text);
  if (envelope?.schema!==SCHEMA) throw TypeError('Unsupported mob snapshot schema');
  if (typeof envelope.payload!=='string' || envelope.checksum!==saveFingerprint(envelope.payload))
    throw TypeError('Invalid mob snapshot checksum');
  const snapshot=JSON.parse(envelope.payload);
  const marked=snapshot?.creativeSpawnIds??[];
  if(!Array.isArray(marked)||marked.length>32||
     new Set(marked).size!==marked.length||
     marked.some(id=>typeof id!=='string'||id.length>64||
       !snapshot?.engine?.entities?.some(mob=>mob.id===id)))
    throw TypeError('Invalid saved Creative creature identities');
  const engine=MobEngine.fromCheckpoint(world,snapshot?.engine);
  const behavior=new BehaviorController(engine,world);
  const combat=new MobCombat(engine,world,behavior,objectAccess,combatOptions);
  const companions=CompanionManager.fromCheckpoint(engine,world,combat,snapshot.companions);
  const animals=AnimalInteractions.fromCheckpoint(engine,world,snapshot.tamed);
  return {engine,behavior,combat,companions,animals,creativeSpawnIds:Object.freeze([...marked])};
}
