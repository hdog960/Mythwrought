import assert from 'node:assert/strict';
import test from 'node:test';
import {createCitizen} from '../src/citizens/entity.mjs';
import {PROFESSIONS} from '../src/citizens/registry.mjs';
import {createCitizenSimulation} from '../src/citizens/simulation.mjs';
import {MobEngine} from '../src/mobs/engine.mjs';
import {BehaviorController} from '../src/mobs/behavior.mjs';
import {MobCombat} from '../src/mobs/combat.mjs';
import {createWorldQuery} from '../src/mobs/world-query.mjs';
import {BLOCK} from '../src/voxel.mjs';

function fixture(occupation, monsterPosition=[2.5,0,.5], monster='briarlurker') {
  const terrain={get:(_x,y)=>y<0?BLOCK.STONE:BLOCK.AIR};
  const query=createWorldQuery(terrain,{resident:()=>true,observe:()=>({hazard:false,biome:'forest',dayPhase:'night'})});
  const engine=new MobEngine(query);
  const enemy=engine.spawn(monster,monsterPosition);
  assert(enemy);
  const simulation=createCitizenSimulation({query,settlement:{id:'stockade',
    regions:[{minX:-8,maxX:8,minZ:-8,maxZ:8}]},mobEngine:engine});
  const citizen=createCitizen({worldSeed:179,settlementId:'stockade',slot:0,race:'human',
    biome:'enchanted',style:'village',profession:occupation});
  simulation.add(citizen,[.5,0,.5]);
  return {engine,enemy,simulation,citizen,query};
}

test('the ordinary citizen and every civilian career flee a genuine hostile creature', () => {
  const occupations=Object.values(PROFESSIONS).filter(row=>row.threatResponse==='flee').map(row=>row.id);
  assert.equal(occupations.length,77);
  for (const occupation of [null,...occupations]) {
    const {engine,enemy,simulation}=fixture(occupation);
    const health=engine.get(enemy).health;
    let actor;
    for(let tick=0;tick<20;tick++) [actor]=simulation.step(.1);
    assert.equal(actor.state,'flee',String(occupation));
    assert(actor.position[0]<.2,String(occupation));
    assert.equal(engine.get(enemy).health,health);
    engine.transition(enemy,'dormant');
    for(let tick=0;tick<16;tick++) [actor]=simulation.step(.1);
    assert.notEqual(actor.state,'flee');
  }
});

test('only defenders damage the existing mob and attack cooldowns prevent per-tick damage', () => {
  for (const occupation of ['guard','watchman','soldier','ranger','gatekeeper']) {
    const {engine,enemy,simulation}=fixture(occupation);
    const initial=engine.get(enemy).health;
    let actor;
    for(let tick=0;tick<30;tick++) [actor]=simulation.step(.1);
    assert.equal(actor.state,'defend');
    const remaining=engine.get(enemy).health;
    assert(remaining<initial && remaining>0);
    assert(initial-remaining<=16);
    engine.transition(enemy,'dormant');
    for(let tick=0;tick<10;tick++) [actor]=simulation.step(.1);
    assert.notEqual(actor.state,'defend');
  }
});

test('passive or out-of-region creatures do not provoke attack', () => {
  const passive=fixture('guard',[2.5,0,.5],'horse');
  assert.notEqual(passive.simulation.step(.1)[0].state,'defend');
  const outside=fixture('guard',[8.4,0,.5]);
  const health=outside.engine.get(outside.enemy).health;
  for (let tick=0;tick<50;tick++) {
    const [actor]=outside.simulation.step(.1);
    assert(actor.position[0] <= 8);
  }
  assert.equal(outside.engine.get(outside.enemy).health,health);
});

test('existing monster combat can damage an in-world citizen target', () => {
  const {engine,simulation,citizen,query}=fixture('guard',[1.3,0,.5],'hollowbound');
  const behavior=new BehaviorController(engine,query);
  const combat=new MobCombat(engine,query,behavior);
  const target=simulation.combatTarget(citizen.id);
  const health=target.health;
  for(let tick=0;tick<90&&target.health===health;tick++) {
    combat.advance(1/30,target);
    simulation.step(1/30);
  }
  assert(target.health<health);
  assert.equal(simulation.step(.01)[0].action,'damage');
});
