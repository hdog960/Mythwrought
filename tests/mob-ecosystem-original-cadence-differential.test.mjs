// Isolated source-native regression against ORIGINAL ecology; no M7 worlds or mobs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {speciesRegistry} from '../src/mobs/species.mjs';
import {MobEngine} from '../src/mobs/engine.mjs';
import {PopulationManager} from '../src/mobs/ecology.mjs';
import {createGlobalEcologyClock,advanceGlobalEcologyClock,commitGlobalEcologyRegion}
  from '../src/mobs/ecosystem-global-clock.mjs';
import {createRegionalEcologySchedule,inspectRegionalEcologySchedule,
  settleRegionalEcologyPoll} from '../src/mobs/ecosystem-region-cadence.mjs';

const allSpecies=speciesRegistry.filter(s=>s.implementation==='preview');
const counts=()=>new Map(allSpecies.map(s=>[s.id,0]));
const region=cx=>({cx,cz:0,section:0,feet:4});
function world(){
  return {
    revision(){return 0;},residentAt(){return true;},
    volume(){return 'unknown';},grounded(){return false;},
    environment(){return {biome:'meadow',light:.8,hazard:false};},
    medium(){return 'air';},
    set(){throw Error('No source edits');},
    save(){throw Error('No source save writes');}
  };
}
function compare(steps,regions){
  const host=world(),engine=new MobEngine(host,179,{maxEntities:32,maxActive:8});
  const ecology=new PopulationManager(engine,host,{
    seed:179,species:allSpecies.map(s=>s.id),spawnOnFirstVisit:false
  });
  let clock=createGlobalEcologyClock();
  const results=[];
  for(const seconds of steps){
    const original=ecology.advance(seconds,[8,4,8],regions);
    const advanced=advanceGlobalEcologyClock(clock,{seconds,regions});
    let evaluated=0,key=null;
    if(!advanced.selection){
      clock=advanced.clock;
    }else{
      const ticket=advanced.selection;
      key=ticket.key;
      const record=ticket.record??createRegionalEcologySchedule({
        regionKey:key,now:ticket.time,localCounts:counts()
      });
      const inspected=inspectRegionalEcologySchedule(record,{
        now:ticket.time,localCounts:counts()
      });
      evaluated=inspected.ready?6:0;
      const settled=inspected.ready?settleRegionalEcologyPoll(inspected.record,{
        now:ticket.time,attempts:6,successfulBirth:false
      }):inspected.record;
      clock=commitGlobalEcologyRegion(advanced.clock,ticket,settled);
    }
    assert.equal(evaluated,original.evaluated,
      'Source PopulationManager and detached ticker must evaluate alike');
    assert.equal(original.spawned,null);
    assert.equal(engine.counts().total,0);
    results.push({key,original:original.evaluated,detached:evaluated});
  }
  engine.dispose();
  return results;
}
test('actual PopulationManager matches 12 blocked-world global scheduling calls',()=>{
  assert.equal(allSpecies.length,40);
  const r=compare([.2,.3,.5,.5,.5,.5,.5,.5,.5,1,.5,.5],
    [region(0),region(1),region(2)]);
  assert.deepEqual(r.map(x=>x.original),[0,0,0,0,6,6,6,6,6,6,6,6]);
  assert.deepEqual(r.slice(1,6).map(x=>x.key),[
    '0,0,0','1,0,0','2,0,0','0,0,0','1,0,0'
  ]);
});
test('actual original 64-region cap excludes invalid 65th region',()=>{
  const regions=Array.from({length:65},(_,i)=>
    i===64?{...region(i),section:-2}:region(i));
  const r=compare(Array.from({length:65},()=>.5),regions);
  assert.equal(r.length,65);
  assert.equal(r.every(x=>x.key!=='64,0,-2'),true);
  assert.equal(r.slice(0,64).every(x=>x.original===0),true);
  assert.equal(r[64].key,'0,0,0');
  assert.equal(r[64].original,6);
  assert.equal(r[64].detached,6);
});
