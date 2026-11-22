import test from 'node:test';
import assert from 'node:assert/strict';
import {speciesRegistry} from '../src/mobs/species.mjs';
import {MobEngine} from '../src/mobs/engine.mjs';
import {PopulationManager} from '../src/mobs/ecology.mjs';
import {createGlobalEcologyClock} from '../src/mobs/ecosystem-global-clock.mjs';
import {prepareGlobalMobTick,settleGlobalMobTick}
  from '../src/mobs/ecosystem-global-preflight.mjs';

function flatWorld({blocked=false}={}){
  return {
    revision(){return 0;},
    residentAt(){return true;},
    volume(point){return blocked?'unknown':point[1]<4?'solid':'clear';},
    grounded(point){return !blocked&&point[1]>=4&&point[1]<4.04;},
    environment(){return {biome:'meadow',light:.8,hazard:false};},
    medium(){return 'air';},
    set(){throw Error('No original terrain writes permitted');},
    save(){throw Error('No original save writes permitted');}
  };
}
const region={cx:0,cz:0,section:0,feet:4};
const options=(clock,engine,world,seconds=.5,seed=179)=>({
  clock,engine,world,seconds,seed,regions:[region],observer:[8,4,8],
  biome:'meadow',light:.8
});

test('original global first-visit deferral and zero-birth poll are not bypassed',()=>{
  const world=flatWorld({blocked:true});
  const engine=new MobEngine(world,179,{maxEntities:32,maxActive:8});
  const first=prepareGlobalMobTick(options(createGlobalEcologyClock(),engine,world));
  assert.equal(first.kind,'cooldown');
  assert.equal(first.proposal,null);
  assert.equal(first.attempts,0);
  assert.equal(first.rejected,null);
  const next=settleGlobalMobTick(first,{world});
  assert.equal(next.entries.length,1);
  assert.equal(next.entries[0][1].next,1);
  const second=prepareGlobalMobTick(options(next,engine,world));
  assert.equal(second.kind,'evaluated');
  assert.equal(second.attempts,6);
  assert.equal(second.proposal,null);
  assert.equal(typeof second.rejected.physicalHabitat,'number');
  const after=settleGlobalMobTick(second,{world});
  assert.equal(after.entries[0][1].serial,6);
  assert.equal(after.entries[0][1].next,1);
  assert.equal(engine.counts().total,0);
  engine.dispose();
});

test('original MobEngine admission is required before the 1.5s birth cooldown',()=>{
  let winner;
  for(let seed=1;seed<=256;seed++){
    const world=flatWorld();
    const engine=new MobEngine(world,seed,{maxEntities:32,maxActive:8});
    const staged=prepareGlobalMobTick({
      ...options(createGlobalEcologyClock(),engine,world,.5,seed),
      spawnOnFirstVisit:true
    });
    if(staged.proposal &&
       Math.hypot(...staged.proposal.point.map((v,i)=>v-[8,4,8][i]))<=18){
      winner={staged,engine,world,seed};break;
    }
    engine.dispose();
  }
  assert.ok(winner,'Source registry must permit a grounded candidate');
  const {staged,engine,world,seed}=winner;
  assert.equal(staged.attempts>0,true);
  const id=engine.spawn(staged.proposal.species.id,staged.proposal.point,{
    homeChunk:staged.regionKey
  });
  assert.ok(id,'Real original engine must admit the creature separately');
  const after=settleGlobalMobTick(staged,{world,spawnedId:id});
  assert.equal(after.entries.length,1);
  assert.equal(after.entries[0][1].next,2);
  const second=prepareGlobalMobTick(options(after,engine,world,.5,seed));
  assert.equal(second.kind,'cooldown');
  assert.equal(second.attempts,0);
  const paused=settleGlobalMobTick(second,{world});
  assert.equal(paused.entries[0][1].next,2);
  assert.equal(engine.counts().total,1);
  engine.dispose();
});

test('uncommitted and forged source tickets cannot synthesize births or replay',()=>{
  const world=flatWorld(),engine=new MobEngine(world,179,{maxEntities:32,maxActive:8});
  const stage=prepareGlobalMobTick(options(createGlobalEcologyClock(),engine,world));
  assert.throws(()=>settleGlobalMobTick({...stage},{world}),
    /Invalid or replayed source-global mob ticket/);
  assert.throws(()=>settleGlobalMobTick(stage,{world:{...world}}),
    /Invalid or replayed source-global mob ticket/);
  const after=settleGlobalMobTick(stage,{world});
  assert.equal(after.entries.length,1);
  assert.throws(()=>settleGlobalMobTick(stage,{world}),
    /Invalid or replayed source-global mob ticket/);
  assert.throws(()=>settleGlobalMobTick(after,{world}),
    /Invalid or replayed source-global mob ticket/);
  engine.dispose();
});

test('original empty and invalid global slots skip a regional poll safely',()=>{
  const world=flatWorld(),engine=new MobEngine(world,179,{maxEntities:32,maxActive:8});
  const first=prepareGlobalMobTick({
    ...options(createGlobalEcologyClock(),engine,world),
    regions:[]
  });
  assert.equal(first.kind,'skipped');
  assert.equal(first.reason,'empty');
  assert.equal(first.clock.cursor,0);
  assert.equal(first.attempts,0);
  const invalid=prepareGlobalMobTick({
    ...options(first.clock,engine,world),
    regions:[{...region,section:-2}]
  });
  assert.equal(invalid.kind,'skipped');
  assert.equal(invalid.reason,'invalid-region');
  assert.equal(invalid.clock.cursor,1);
  assert.equal(engine.counts().total,0);
  engine.dispose();
});

test('original PopulationManager no-birth attempt cadence matches detached preflight',()=>{
  const originalWorld=flatWorld({blocked:true});
  const proposedWorld=flatWorld({blocked:true});
  const originalEngine=new MobEngine(originalWorld,179,{maxEntities:32,maxActive:8});
  const proposedEngine=new MobEngine(proposedWorld,179,{maxEntities:32,maxActive:8});
  const original=new PopulationManager(originalEngine,originalWorld,{
    seed:179,species:speciesRegistry.filter(s=>s.implementation==='preview')
      .map(s=>s.id),spawnOnFirstVisit:false
  });
  let clock=createGlobalEcologyClock();
  const observed=[];
  // The actual original manager and detached source clock use exactly the
  // same six real calls/seconds on independent source-like blocked worlds.
  for(const seconds of [.2,.3,.5,.5,.5,1]){
    const actual=original.advance(seconds,[8,4,8],[region]);
    const ticket=prepareGlobalMobTick(options(
      clock,proposedEngine,proposedWorld,seconds
    ));
    const proposalTrials=ticket.attempts;
    clock=ticket.kind==='skipped'?ticket.clock:
      settleGlobalMobTick(ticket,{world:proposedWorld});
    observed.push({seconds,original:actual.evaluated,
      detached:proposalTrials});
    assert.equal(proposalTrials,actual.evaluated,
      'Original no-birth 0.5s source cadence must match detached preflight');
    assert.equal(actual.spawned,null);
    assert.equal(originalEngine.counts().total,0);
    assert.equal(proposedEngine.counts().total,0);
  }
  assert.equal(observed.some(x=>x.original===6),true);
  originalEngine.dispose();
  proposedEngine.dispose();
});

test('original global preflight refuses to bypass nearby wake or distant dormancy',()=>{
  const world=flatWorld();
  const engine=new MobEngine(world,179,{maxEntities:32,maxActive:8});
  const id=engine.spawn('deer',[9,4,8]);
  assert.ok(id);
  assert.equal(engine.transition(id,'dormant'),true);
  const clock=createGlobalEcologyClock();
  assert.throws(()=>prepareGlobalMobTick(options(clock,engine,world)),
    /Original ecology reconciliation required/);
  assert.equal(engine.get(id).state,'dormant',
    'Read-only source preflight must never invoke original transition');
  // Because source reconciliation was refused BEFORE clock consumption,
  // a same-clock retry is possible after original manager resolves it.
  // This is an independent unconsumed research clock; the real manager alone
  // may wake the animal before another source tick is proposed.
  const original=new PopulationManager(engine,world);
  original.advance(.5,[8,4,8],[]);
  assert.equal(engine.get(id).state,'idle');
  const after=prepareGlobalMobTick(options(clock,engine,world));
  assert.equal(after.kind,'cooldown');
  settleGlobalMobTick(after,{world});
  engine.dispose();
});

test('original source far idle and away-ledger work blocks research tick',()=>{
  const world=flatWorld(),engine=new MobEngine(world,179,{maxEntities:32,maxActive:8});
  const id=engine.spawn('deer',[35,4,8]);
  assert.ok(id);
  assert.throws(()=>prepareGlobalMobTick(options(
    createGlobalEcologyClock(),engine,world
  )),/Original ecology reconciliation required/);
  assert.equal(engine.get(id).state,'idle');
  new PopulationManager(engine,world).advance(.5,[8,4,8],[]);
  assert.equal(engine.get(id).state,'dormant');
  assert.throws(()=>prepareGlobalMobTick(options(
    createGlobalEcologyClock(),engine,world
  )),/Original ecology reconciliation required/,
    'Source private away ledger must still be preserved');
  engine.dispose();
});

test('invalid original observer is rejected before global clock consumption',()=>{
  const world=flatWorld(),engine=new MobEngine(world,179,{maxEntities:32,maxActive:8});
  const clock=createGlobalEcologyClock();
  assert.throws(()=>prepareGlobalMobTick({
    ...options(clock,engine,world),observer:[Infinity,4,8]
  }),/Invalid original ecology observer/);
  const next=prepareGlobalMobTick(options(clock,engine,world));
  assert.equal(next.kind,'cooldown');
  settleGlobalMobTick(next,{world});
  engine.dispose();
});

test('refused due tick preserves original source clock, not just new replacement',()=>{
  const world=flatWorld(),engine=new MobEngine(world,179,{maxEntities:32,maxActive:8});
  const id=engine.spawn('deer',[9,4,8]);
  assert.ok(id);
  assert.equal(engine.transition(id,'dormant'),true);
  const clock=createGlobalEcologyClock();
  assert.throws(()=>prepareGlobalMobTick(options(clock,engine,world)),
    /Original ecology reconciliation required/);
  assert.equal(engine.transition(id,'idle'),true);
  const tick=prepareGlobalMobTick(options(clock,engine,world));
  assert.equal(tick.kind,'cooldown');
  assert.equal(tick.clock.time,.5);
  settleGlobalMobTick(tick,{world});
  engine.dispose();
});
