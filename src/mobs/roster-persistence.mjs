import { saveFingerprint } from '../persistence.mjs';
import { MobEngine } from './engine.mjs';
import { BehaviorController } from './behavior.mjs';
import { MobCombat } from './combat.mjs';
import { CompanionManager } from './companion.mjs';
import { AnimalInteractions } from './animal-interactions.mjs';

const SCHEMA = 1;
const MAX_LENGTH = 256_000;

export function serializeRoster({engine,companions,animals}) {
  const payload = JSON.stringify({
    engine:engine.checkpoint(), companions:companions.checkpoint(), tamed:animals.checkpoint()
  });
  const text=JSON.stringify({schema:SCHEMA,payload,checksum:saveFingerprint(payload)});
  if (text.length>MAX_LENGTH) throw RangeError('Mob snapshot exceeds staging bounds');
  return text;
}

export function restoreRoster(text,world,objectAccess=null) {
  if (typeof text!=='string' || text.length>MAX_LENGTH) throw TypeError('Invalid mob snapshot size');
  const envelope=JSON.parse(text);
  if (envelope?.schema!==SCHEMA) throw TypeError('Unsupported mob snapshot schema');
  if (typeof envelope.payload!=='string' || envelope.checksum!==saveFingerprint(envelope.payload))
    throw TypeError('Invalid mob snapshot checksum');
  const snapshot=JSON.parse(envelope.payload);
  const engine=MobEngine.fromCheckpoint(world,snapshot?.engine);
  const behavior=new BehaviorController(engine,world);
  const combat=new MobCombat(engine,world,behavior,objectAccess);
  const companions=CompanionManager.fromCheckpoint(engine,world,combat,snapshot.companions);
  const animals=AnimalInteractions.fromCheckpoint(engine,world,snapshot.tamed);
  return {engine,behavior,combat,companions,animals};
}
