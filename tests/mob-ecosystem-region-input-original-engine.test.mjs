// Original MobEngine integration tests: requires the complete MYTHWROUGHT checkout.
// This source-only Mob Dev research does not alter live ecology or world state.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../src/mobs/engine.mjs';
import {prepareOriginalMobPoll,settleOriginalMobPoll}
  from '../src/mobs/ecosystem-region-poll.mjs';

const region=()=>({cx:0,cz:0,section:0,feet:4});
function sourceWorld(){
  return {
    revision(){return 0;},residentAt(){return true;},
    volume(p){return p[1]<4?'solid':'clear';},
    grounded(p){return p[1]>=4&&p[1]<4.04;},
    environment(){return {biome:'meadow',light:.8,hazard:false};},
    medium(){return 'air';},
    set(){throw Error('No original world write permitted');},
    save(){throw Error('No original save write permitted');}
  };
}
function harness(){
  const world=sourceWorld(),engine=new MobEngine(world,179,{maxEntities:32,maxActive:8});
  const options={engine,world,seed:179,region:region(),observer:[8,4,8],
    biome:'meadow',light:.8,kind:'surface',now:10,
    spawnOnFirstVisit:false};
  return {engine,world,options};
}

test('real regional poll rejects getter-backed chunk drift at source input capture',()=>{
  const {engine,options}=harness();
  let reads=0;
  const changing={get cx(){return ++reads===1?0:1;},
    cz:0,section:0,feet:4};
  assert.throws(()=>prepareOriginalMobPoll({...options,region:changing}),
    /Original regional source inputs changed during capture/);
  assert.equal(engine.counts().total,0);
  engine.dispose();
});

test('real regional poll rejects observer getter drift after original validPoint check',()=>{
  const {engine,options}=harness();
  const observer=[8,4,8];
  let reads=0;
  Object.defineProperty(observer,0,{get(){return ++reads<=2?8:100;}});
  assert.throws(()=>prepareOriginalMobPoll({...options,observer}),
    /Original regional source inputs changed during capture/);
  assert.equal(engine.counts().total,0);
  engine.dispose();
});

test('real regional poll preserves unchanged first-visit cooldown and zero births',()=>{
  const {engine,world,options}=harness();
  const plan=prepareOriginalMobPoll(options);
  assert.equal(plan.kind,'cooldown');
  assert.equal(plan.attempts,0);
  assert.equal(plan.proposal,null);
  assert.equal(settleOriginalMobPoll(plan,{world}).next,10.5);
  assert.equal(engine.counts().total,0);
  engine.dispose();
});
