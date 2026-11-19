import test from 'node:test';
import assert from 'node:assert/strict';
import { saveFingerprint } from '../../src/persistence.mjs';
import { MobEngine, FIXED_STEP } from '../../src/mobs/engine.mjs';
import { BehaviorController } from '../../src/mobs/behavior.mjs';
import { MobCombat, DemoTarget } from '../../src/mobs/combat.mjs';
import { CompanionManager } from '../../src/mobs/companion.mjs';
import { AnimalInteractions } from '../../src/mobs/animal-interactions.mjs';
import { createWorldQuery } from '../../src/mobs/world-query.mjs';
import { serializeRoster, restoreRoster } from '../../src/mobs/roster-persistence.mjs';
import { createMobHostView } from '../../src/mobs/host-view.mjs';
import { arena } from './fixture.mjs';

function runtime(resident=()=>true) {
  const base = arena({floor:-3});
  const query = createWorldQuery(base,{
    resident, observe:()=>({biome:'meadow',light:.65,hazard:false})
  });
  const engine = new MobEngine(query,42);
  const control = new BehaviorController(engine,query);
  const combat = new MobCombat(engine,query,control);
  const companions = new CompanionManager(engine,query,combat);
  const animals = new AnimalInteractions(engine,query);
  return {base,query,engine,companions,animals};
}
const owner = new DemoTarget([-.5,-2,.5]);

test('a versioned mob snapshot restores identities, companions and tames without writing world saves',()=>{
  const first=runtime();
  const earlier=JSON.stringify(first.base.base.save());
  const glow=first.engine.spawn('glownewt',[.5,-2,.5]);
  const horse=first.engine.spawn('horse',[-.5,-2,1.5]);
  const voidmoth=first.engine.spawn('voidmoth',[2.5,-2,2.5],{dormant:true});
  assert.ok(first.companions.befriend(glow,owner));
  assert.ok(first.companions.command(glow,owner,'stay'));
  assert.ok(first.companions.hurt(glow,60));
  assert.ok(first.animals.tame(horse,owner));
  for(let i=0;i<38;i++) first.companions.advance(FIXED_STEP);
  const blob=serializeRoster(first);
  const resumed=restoreRoster(blob,first.query);
  assert.equal(resumed.engine.get(glow).state,'downed');
  assert.equal(resumed.engine.get(voidmoth).state,'dormant');
  assert.deepEqual(resumed.companions.slots(),first.companions.slots());
  assert.ok(resumed.animals.isTamed(horse,owner));
  assert.deepEqual(serializeRoster(resumed),blob);
  assert.ok(resumed.companions.rescue(glow,owner));
  assert.notEqual(resumed.engine.spawn('deer',[4,-2,2]),glow);
  assert.equal(JSON.stringify(first.base.base.save()),earlier);
});

test('bad version, damaged bytes and duplicate identities are rejected atomically',()=>{
  const fixture=runtime();
  fixture.engine.spawn('deer',[.5,-2,.5]);
  const bytes=serializeRoster(fixture);
  const original=JSON.parse(bytes);
  assert.throws(()=>restoreRoster(bytes.replace('deer','wolf'),fixture.query),/checksum/);
  assert.throws(()=>restoreRoster(JSON.stringify({...original,schema:99}),fixture.query),/schema/);
  const payload=JSON.parse(original.payload);
  payload.engine.entities.push({...payload.engine.entities[0]});
  const text=JSON.stringify(payload);
  assert.throws(()=>restoreRoster(JSON.stringify({schema:1,payload:text,checksum:saveFingerprint(text)}),fixture.query),/identity/);
  assert.equal(fixture.engine.counts().total,1);
});

test('restored bodies stay dormant when their chunk is not currently resident',()=>{
  const fixture=runtime();
  const id=fixture.engine.spawn('deer',[.5,-2,.5]);
  const unavailable=runtime(()=>false);
  const resumed=restoreRoster(serializeRoster(fixture),unavailable.query);
  assert.equal(resumed.engine.get(id).state,'dormant');
  assert.equal(resumed.engine.transition(id,'idle'),false);
});

test('future host view requires ready biome, sky and depth data and filters objects',()=>{
  const {base}=runtime();
  const loaded=()=>true;
  const point=[1,-2,1];
  const biomeAt=()=>({id:'forest',hazard:false});
  assert.equal(createMobHostView(base,{resident:loaded,biomeAt}).environment(point).hazard,true);
  const complete=createMobHostView(base,{
    resident:loaded,biomeAt,skyAt:()=>({light:.4,dayPhase:'dusk'}),
    caveAt:()=>({ready:true}),
    objectsAt:()=>[{id:'chest',kind:'container',position:point},{id:'door',kind:'door',position:point,permitted:true}]
  });
  assert.deepEqual(complete.environment(point).objects.map(object=>object.id),['door']);
  assert.equal(complete.environment(point).light,.4);
  assert.equal(complete.environment(point).hazard,false);
});
