import test from 'node:test';
import assert from 'node:assert/strict';
import {speciesRegistry} from '../src/mobs/species.mjs';
import {MobEngine} from '../src/mobs/engine.mjs';
import {prepareOriginalMobPoll,settleOriginalMobPoll}
  from '../src/mobs/ecosystem-region-poll.mjs';
import {createRegionalEcologySchedule,inspectRegionalEcologySchedule,
  settleRegionalEcologyPoll}
  from '../src/mobs/ecosystem-region-cadence.mjs';
import {createGlobalEcologyClock,advanceGlobalEcologyClock,
  previewGlobalEcologyTick,commitGlobalEcologyRegion,ORIGINAL_MAX_REGION_RECORDS,
  ORIGINAL_MAX_TIME_ADVANCE} from '../src/mobs/ecosystem-global-clock.mjs';

const ids=speciesRegistry.filter(s=>s.implementation==='preview').map(s=>s.id);
const counts=()=>new Map(ids.map(id=>[id,0]));
const location=(cx,cz=0,section=0,feet=4)=>({cx,cz,section,feet});
const at=(state,seconds,regions)=>advanceGlobalEcologyClock(state,{seconds,regions});
const recordFor=(ticket,spawnOnFirstVisit=false)=>createRegionalEcologySchedule({
  regionKey:ticket.key,now:ticket.time,localCounts:counts(),spawnOnFirstVisit
});

test('source 0.5-second ticker skips premature polls, clamps time to one second',()=>{
  const start=createGlobalEcologyClock();
  assert.equal(start.time,0);
  assert.equal(start.next,.5);
  assert.equal(ORIGINAL_MAX_REGION_RECORDS,64);
  assert.equal(ORIGINAL_MAX_TIME_ADVANCE,1);
  const early=at(start,.49,[location(0)]);
  assert.equal(early.reason,'interval');
  assert.equal(early.selection,null);
  assert.equal(early.clock.cursor,0);
  const tick=at(early.clock,.02,[location(0)]);
  assert.equal(tick.reason,'selected');
  assert.equal(tick.selection.key,'0,0,0');
  assert.equal(tick.clock.cursor,1);
  assert.equal(tick.clock.next,1.01);
  const updated=commitGlobalEcologyRegion(tick.clock,tick.selection,recordFor(tick.selection));
  assert.equal(updated.entries.length,1);
  const big=at(updated,40,[location(0)]);
  assert.equal(big.clock.time,1.51);
  assert.equal(big.clock.next,2.01);
  assert.equal(big.clock.cursor,2);
  const again=commitGlobalEcologyRegion(big.clock,big.selection,
    inspectRegionalEcologySchedule(big.selection.record,{
      now:1.51,localCounts:counts()
    }).record);
  assert.equal(again.entries.length,1);
});

test('global rotation uses only first 64 source regions and consumes invalid slot',()=>{
  let state=createGlobalEcologyClock();
  const sites=[location(0),location(1),location(2)];
  const observed=[];
  for(let i=0;i<4;i++){
    const t=at(state,.5,sites);
    observed.push(t.selection?.key);
    state=commitGlobalEcologyRegion(t.clock,t.selection,recordFor(t.selection,true));
  }
  assert.deepEqual(observed,['0,0,0','1,0,0','2,0,0','0,0,0']);
  const many=Array.from({length:65},(_,i)=>location(i));
  state=createGlobalEcologyClock();
  for(let i=0;i<64;i++){
    const t=at(state,.5,many);
    assert.equal(t.selection.key,i+',0,0');
    state=commitGlobalEcologyRegion(t.clock,t.selection,recordFor(t.selection,true));
  }
  const next=at(state,.5,many);
  assert.equal(next.selection.key,'0,0,0',
    'Original manager intentionally limits considered regions to first 64');
  assert.equal(next.clock.entries.length,64);
  assert.equal(next.clock.cursor,65);
});

test('source half-second survey naturally evicts stale slots at 64-region capacity',()=>{
  let state=createGlobalEcologyClock();
  for(let i=0;i<64;i++){
    const t=at(state,.5,[location(i)]);
    state=commitGlobalEcologyRegion(t.clock,t.selection,recordFor(t.selection,true));
  }
  assert.equal(state.entries.length,64);
  const t=at(state,.5,[location(90)]);
  // Original strict ticker takes 32s to fill 64 regions. Its oldest
  // record is ALREADY stale by the time a 65th is selected.
  assert.equal(t.reason,'selected');
  assert.equal(t.selection.evictKey,'0,0,0');
  assert.equal(t.clock.cursor,65);
  state=commitGlobalEcologyRegion(t.clock,t.selection,recordFor(t.selection,true));
  assert.equal(state.entries.length,64);
  assert.equal(state.entries.some(([key])=>key==='0,0,0'),false);
  assert.equal(state.entries.some(([key])=>key==='90,0,0'),true);
});

test('original region eviction uses first entry with next at least 12s old',()=>{
  let state=createGlobalEcologyClock();
  for(let i=0;i<64;i++){
    const t=at(state,.5,[location(i)]);
    state=commitGlobalEcologyRegion(t.clock,t.selection,recordFor(t.selection,true));
  }
  // After 64 half-second ticks, region #0 was created at t=.5.
  // t=32.5 means it is sufficiently stale and must be evicted first.
  const t=at(state,.5,[location(999)]);
  assert.equal(t.selection.evictKey,'0,0,0');
  state=commitGlobalEcologyRegion(t.clock,t.selection,recordFor(t.selection,true));
  assert.equal(state.entries.length,64);
  assert.equal(state.entries.some(([key])=>key==='0,0,0'),false);
  assert.equal(state.entries.some(([key])=>key==='999,0,0'),true);
});

test('source selection and commit cannot be forged, skipped or replayed',()=>{
  const source=createGlobalEcologyClock();
  const t=at(source,.5,[location(0)]);
  assert.throws(()=>at(source,.5,[location(0)]),/Invalid original ecology global advance/);
  assert.throws(()=>at(t.clock,.5,[location(1)]),/Invalid original ecology global advance/);
  assert.throws(()=>commitGlobalEcologyRegion(t.clock,{...t.selection},recordFor(t.selection)),
    /Invalid original ecology global region commit/);
  assert.throws(()=>commitGlobalEcologyRegion(t.clock,t.selection,
    recordFor({...t.selection,key:'1,0,0'})),
    /Invalid original ecology global region commit/);
  const committed=commitGlobalEcologyRegion(t.clock,t.selection,recordFor(t.selection));
  assert.equal(committed.entries.length,1);
  assert.throws(()=>commitGlobalEcologyRegion(t.clock,t.selection,recordFor(t.selection)),
    /Invalid original ecology global region commit/);
});

test('original empty and invalid region slots advance ticker but not region ledger',()=>{
  const source=createGlobalEcologyClock();
  const empty=at(source,.5,[]);
  assert.equal(empty.reason,'empty');
  assert.equal(empty.clock.cursor,0);
  const invalid=at(empty.clock,.5,[location(0,0,-2,4)]);
  assert.equal(invalid.reason,'invalid-region');
  assert.equal(invalid.clock.cursor,1);
  assert.equal(invalid.clock.entries.length,0);
});

test('original Map insertion order survives region updates and respects 12s decline',()=>{
  let state=createGlobalEcologyClock();
  for(let i=0;i<64;i++){
    const t=at(state,.5,[location(i)]);
    let entry=recordFor(t.selection,true);
    if(i===0)entry=settleRegionalEcologyPoll(entry,{
      now:t.selection.time,attempts:1,successfulBirth:true,speciesId:'deer'
    });
    state=commitGlobalEcologyRegion(t.clock,t.selection,entry);
  }
  const renewed=at(state,.5,[location(0)]);
  assert.equal(renewed.selection.record.highWater[ids.indexOf('deer')][1],1);
  const decrease=inspectRegionalEcologySchedule(renewed.selection.record,{
    now:renewed.selection.time,localCounts:counts()
  });
  assert.equal(decrease.record.next,renewed.selection.time+12);
  state=commitGlobalEcologyRegion(renewed.clock,renewed.selection,decrease.record);
  assert.equal(state.entries[0][0],'0,0,0',
    'Updating Map existing key must NEVER change its insertion order');
  const newcomer=at(state,.5,[location(90)]);
  assert.equal(newcomer.selection.evictKey,'1,0,0',
    'Recently depleted first entry remains protected by original 12s delay');
  state=commitGlobalEcologyRegion(newcomer.clock,newcomer.selection,
    recordFor(newcomer.selection,true));
  assert.equal(state.entries.length,64);
  assert.equal(state.entries[0][0],'0,0,0');
  assert.equal(state.entries.some(([key])=>key==='1,0,0'),false);
});

test('original global tick and real MobEngine admission grant one birth cooldown',()=>{
  const region=location(0);
  const world={
    revision(){return 0;},
    residentAt(){return true;},
    volume(p){return p[1]<4?'solid':'clear';},
    grounded(p){return p[1]>=4&&p[1]<4.04;},
    environment(){return {biome:'meadow',light:.8,hazard:false};},
    medium(){return 'air';},
    set(){throw Error('No source terrain writes');},
    save(){throw Error('No source saves');}
  };
  let matching=null;
  for(let seed=1;seed<=256;seed++){
    const engine=new MobEngine(world,seed,{maxEntities:32,maxActive:8});
    const first=at(createGlobalEcologyClock(),.5,[region]);
    const planned=prepareOriginalMobPoll({
      engine,world,seed,region:first.selection.region,
      observer:[8,4,8],biome:'meadow',light:.8,kind:'surface',
      now:first.selection.time,spawnOnFirstVisit:true
    });
    if(planned.proposal){matching={engine,first,planned,seed};break;}
    engine.dispose();
  }
  assert.ok(matching,'Source original 40-species registry must have a real proposal');
  const {engine,first,planned,seed}=matching;
  const id=engine.spawn(planned.proposal.species.id,planned.proposal.point,{
    homeChunk:first.selection.key
  });
  assert.ok(id,'Real MobEngine must independently admit the proposed creature');
  const record=settleOriginalMobPoll(planned,{world,spawnedId:id});
  assert.equal(record.next,2);
  assert.equal(record.serial,planned.attempts);
  const global=commitGlobalEcologyRegion(first.clock,first.selection,record);
  assert.equal(global.entries.length,1);
  assert.equal(global.entries[0][0],'0,0,0');
  const second=at(global,.5,[region]);
  assert.equal(second.selection.record.next,2);
  const cooling=prepareOriginalMobPoll({
    engine,world,seed,region:second.selection.region,
    observer:[8,4,8],biome:'meadow',light:.8,kind:'surface',
    now:second.selection.time,record:second.selection.record
  });
  assert.equal(cooling.kind,'cooldown');
  assert.equal(cooling.attempts,0);
  const cold=settleOriginalMobPoll(cooling,{world});
  assert.equal(cold.next,2);
  const committed=commitGlobalEcologyRegion(second.clock,second.selection,cold);
  assert.equal(committed.entries.length,1);
  assert.equal(engine.counts().total,1,
    'A proposal-only adapter must not manufacture a second creature');
  engine.dispose();
});

test('certified global due preview does not consume original clock or issue region',()=>{
  const original=createGlobalEcologyClock(),regions=[location(0)];
  assert.deepEqual(previewGlobalEcologyTick(original,{seconds:.49,regions}),
    {time:.49,due:false});
  assert.deepEqual(previewGlobalEcologyTick(original,{seconds:.5,regions}),
    {time:.5,due:true});
  assert.deepEqual(previewGlobalEcologyTick(original,{seconds:.5,regions}),
    {time:.5,due:true});
  const actual=at(original,.5,regions);
  assert.equal(actual.reason,'selected');
  assert.equal(actual.selection.key,'0,0,0');
  assert.throws(()=>previewGlobalEcologyTick(original,{
    seconds:.5,regions
  }),/Invalid original ecology global advance/);
  commitGlobalEcologyRegion(actual.clock,actual.selection,recordFor(actual.selection));
});
test('untrusted clock or invalid input cannot claim a due source tick',()=>{
  assert.throws(()=>previewGlobalEcologyTick({
    time:0,next:.5
  },{seconds:.5,regions:[location(0)]}),/Invalid original ecology global advance/);
  assert.throws(()=>previewGlobalEcologyTick(createGlobalEcologyClock(),{
    seconds:-1,regions:[location(0)]
  }),/Invalid original ecology global advance/);
});
