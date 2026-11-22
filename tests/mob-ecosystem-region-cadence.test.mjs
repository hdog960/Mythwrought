import test from 'node:test';
import assert from 'node:assert/strict';
import {speciesRegistry} from '../src/mobs/species.mjs';
import {ORIGINAL_ECOLOGY_POLL_INTERVAL,ORIGINAL_ECOLOGY_REPLENISH_SECONDS,
  ORIGINAL_ECOLOGY_SUCCESS_COOLDOWN_SECONDS,ORIGINAL_ECOLOGY_MAX_TRIALS,
  createRegionalEcologySchedule,inspectRegionalEcologySchedule,
  settleRegionalEcologyPoll} from '../src/mobs/ecosystem-region-cadence.mjs';

const ids=speciesRegistry.filter(s=>s.implementation==='preview').map(s=>s.id);
const counts=()=>new Map(ids.map(id=>[id,0]));
const initial=opts=>createRegionalEcologySchedule({
  regionKey:'-32,0,0',now:10,localCounts:counts(),...opts
});
test('original first-visit cadence defers 0.5 second unless explicitly warm',()=>{
  assert.equal(ORIGINAL_ECOLOGY_POLL_INTERVAL,.5);
  assert.equal(ORIGINAL_ECOLOGY_REPLENISH_SECONDS,12);
  assert.equal(ORIGINAL_ECOLOGY_SUCCESS_COOLDOWN_SECONDS,1.5);
  assert.equal(ORIGINAL_ECOLOGY_MAX_TRIALS,6);
  const delayed=initial(),warm=initial({spawnOnFirstVisit:true});
  assert.equal(delayed.next,10.5);
  assert.equal(warm.next,10);
  assert.equal(inspectRegionalEcologySchedule(delayed,{
    now:10.25,localCounts:counts()
  }).ready,false);
  assert.equal(inspectRegionalEcologySchedule(warm,{
    now:10,localCounts:counts()
  }).ready,true);
  assert.equal(Object.isFrozen(delayed),true);
  assert.equal(Object.isFrozen(delayed.highWater),true);
  assert.equal(Object.isFrozen(delayed.highWater[0]),true);
});

test('original replenishment high-water enforces a fresh 12-second delay',()=>{
  const source=initial({spawnOnFirstVisit:true});
  const growing=counts();growing.set('deer',3);
  const higher=inspectRegionalEcologySchedule(source,{now:11,localCounts:growing});
  assert.equal(higher.ready,true);
  const falling=counts();falling.set('deer',2);
  const lower=inspectRegionalEcologySchedule(higher.record,{now:12,localCounts:falling});
  assert.equal(lower.ready,false);
  assert.equal(lower.record.next,24);
  const same=inspectRegionalEcologySchedule(lower.record,{now:13,localCounts:falling});
  assert.equal(same.record.next,24);
  assert.equal(inspectRegionalEcologySchedule(same.record,{
    now:24,localCounts:falling
  }).ready,true);
  assert.equal(source.highWater[ids.indexOf('deer')][1],0,'Immutable source record');
});

test('confirmed original engine birth alone starts 1.5-second cooldown',()=>{
  const record=initial({spawnOnFirstVisit:true});
  const noBirth=settleRegionalEcologyPoll(record,{
    now:10,attempts:6,successfulBirth:false
  });
  assert.equal(noBirth.next,10);
  assert.equal(noBirth.serial,6);
  const realBirth=settleRegionalEcologyPoll(noBirth,{
    now:10,attempts:3,successfulBirth:true,speciesId:'deer'
  });
  assert.equal(realBirth.serial,9);
  assert.equal(realBirth.next,11.5);
  assert.equal(realBirth.highWater[ids.indexOf('deer')][1],1);
  assert.equal(inspectRegionalEcologySchedule(realBirth,{
    now:11.4,localCounts:new Map(realBirth.highWater)
  }).ready,false);
  assert.equal(inspectRegionalEcologySchedule(realBirth,{
    now:11.5,localCounts:new Map(realBirth.highWater)
  }).ready,true);
});

test('candidate-only observation cannot falsely apply original birth cooldown',()=>{
  const record=initial({spawnOnFirstVisit:true});
  const proposedButNotBorn=settleRegionalEcologyPoll(record,{
    now:10,attempts:2,successfulBirth:false
  });
  assert.equal(proposedButNotBorn.next,10);
  assert.equal(proposedButNotBorn.serial,2);
  assert.throws(()=>settleRegionalEcologyPoll(record,{
    now:10,attempts:2,successfulBirth:false,speciesId:'deer'
  }),/Invalid original regional poll result/);
});

test('source cadence rejects stale clocks, missing counts, forged births and bad budgets',()=>{
  const record=initial({spawnOnFirstVisit:true});
  assert.throws(()=>createRegionalEcologySchedule({
    regionKey:'0,0,0',now:10,localCounts:new Map()
  }),/Incomplete original regional population counts/);
  assert.throws(()=>inspectRegionalEcologySchedule(record,{
    now:9,localCounts:counts()
  }),/Invalid original regional ecology schedule/);
  assert.throws(()=>settleRegionalEcologyPoll(record,{
    now:10,attempts:7
  }),/Invalid original regional poll result/);
  assert.throws(()=>settleRegionalEcologyPoll(record,{
    now:10,attempts:0
  }),/Invalid original regional poll result/);
  assert.throws(()=>settleRegionalEcologyPoll(record,{
    now:10,attempts:1,successfulBirth:true,speciesId:'not-a-source-species'
  }),/Invalid original regional poll result/);
  assert.throws(()=>settleRegionalEcologyPoll(record,{
    now:11,attempts:1
  }),/Invalid original regional poll result/);
});
