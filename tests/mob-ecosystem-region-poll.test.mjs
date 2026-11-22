import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../src/mobs/engine.mjs';
import {getSpecies} from '../src/mobs/species.mjs';
import {prepareOriginalMobPoll,settleOriginalMobPoll}
  from '../src/mobs/ecosystem-region-poll.mjs';

const region={cx:0,cz:0,section:0,feet:4};
function world(){
  return {
    revision(){return 0;},
    residentAt(){return true;},
    volume(point){return point[1]<4?'solid':'clear';},
    grounded(point){return point[1]>=4&&point[1]<4.04;},
    environment(){return {biome:'meadow',light:.8,hazard:false};},
    medium(){return 'air';}
  };
}
const engineOf=w=>new MobEngine(w,179,{maxEntities:32,maxActive:8});
const opts=(w,engine,seed=179)=>({
  engine,world:w,seed,region,observer:[8,4,8],biome:'meadow',
  light:.8,now:10,spawnOnFirstVisit:true
});

test('original first-visit cooldown prevents premature candidate evaluation',()=>{
  const w=world(),engine=engineOf(w),p=prepareOriginalMobPoll({
    ...opts(w,engine),spawnOnFirstVisit:false
  });
  assert.equal(p.kind,'cooldown');
  assert.equal(p.attempts,0);
  assert.equal(p.proposal,null);
  assert.equal(p.record.next,10.5);
  assert.equal(settleOriginalMobPoll(p,{world:w}).next,10.5);
});

test('source natural birth counts only after exact real engine admission proof',()=>{
  const w=world(),engine=engineOf(w);
  let found=null;
  for(let seed=1;seed<=256;seed++){
    const candidate=prepareOriginalMobPoll(opts(w,engine,seed));
    if(candidate.proposal){found=candidate;break;}
  }
  assert.ok(found,'One deterministic original-species proposal must be eligible');
  assert.equal(found.record.serial,0,'Only confirmed poll settlement consumes trials');
  assert.equal(found.record.next,10,'An eligible candidate is NOT yet a birth');
  const id=engine.spawn(found.proposal.species.id,found.proposal.point,{
    homeChunk:'0,0,0'
  });
  assert.ok(id,'The actual original MobEngine must admit the eligible candidate');
  const posted=settleOriginalMobPoll(found,{
    world:w,spawnedId:id
  });
  assert.equal(posted.next,11.5);
  assert.equal(posted.serial,found.attempts);
  assert.equal(new Map(posted.highWater).get(found.proposal.species.id),1);
  assert.equal(engine.counts().total,1,'The transaction helper does not spawn mobs');
  engine.dispose();
});

test('wrong species, mismatched origin or forged admission cannot prove a birth',()=>{
  const w=world(),engine=engineOf(w);
  let candidate=null;
  for(let seed=1;seed<=256;seed++){
    const p=prepareOriginalMobPoll(opts(w,engine,seed));
    if(p.proposal){candidate=p;break;}
  }
  assert.ok(candidate);
  assert.throws(()=>settleOriginalMobPoll(candidate,{
    world:w,spawnedId:'forged'
  }),/Original MobEngine admission proof mismatch/);
  const p=candidate.proposal;
  const wrong=engine.spawn(p.species.id,p.point,{
    homeChunk:'1,0,0'
  });
  assert.ok(wrong);
  assert.throws(()=>settleOriginalMobPoll(candidate,{
    world:w,spawnedId:wrong
  }),/Original MobEngine admission proof mismatch/);
});

test('source world edits invalidate both proposal and subsequent admission',()=>{
  let revision=0;
  const w={...world(),revision(){return revision;}};
  const engine=engineOf(w);
  let candidate;
  for(let seed=1;seed<=256;seed++){
    const result=prepareOriginalMobPoll(opts(w,engine,seed));
    if(result.proposal){candidate=result;break;}
  }
  assert.ok(candidate);
  revision++;
  assert.throws(()=>settleOriginalMobPoll(candidate,{world:w}),
    /Invalid or stale original regional mob poll/);
});

test('poll refuses candidate admission while full or cooling down',()=>{
  const w=world(),engine=engineOf(w);
  const first=prepareOriginalMobPoll({
    ...opts(w,engine),spawnOnFirstVisit:false
  });
  assert.throws(()=>settleOriginalMobPoll(first,{
    world:w,spawnedId:'mob-1'
  }),/No engine admission allowed during cooldown/);
});

test('original engine ownership rejects fabricated previews and double settlement',()=>{
  const w=world(),engine=engineOf(w);
  assert.throws(()=>prepareOriginalMobPoll({
    ...opts(w,engine),engine:{all:()=>[]}
  }),/Original MobEngine instance required/);
  const plan=prepareOriginalMobPoll({
    ...opts(w,engine),spawnOnFirstVisit:false
  });
  const forged=Object.freeze({...plan});
  assert.throws(()=>settleOriginalMobPoll(forged,{world:w}),
    /Invalid or stale original regional mob poll/);
  assert.equal(settleOriginalMobPoll(plan,{world:w}).next,10.5);
  assert.throws(()=>settleOriginalMobPoll(plan,{world:w}),
    /Invalid or stale original regional mob poll/);
});

test('original source protection mutation during prepare cannot produce stale plan',()=>{
  const w=world(),engine=new MobEngine(w,179,{maxEntities:32,maxActive:8});
  const id=engine.spawn('deer',[8,4,8],{homeChunk:'0,0,0'});
  assert.ok(id);
  assert.throws(()=>prepareOriginalMobPoll({
    ...opts(w,engine),
    isProtected:mob=>{
      engine.transition(mob.id,'dormant');
      return false;
    }
  }),/Original MobEngine roster changed during inspection/);
  assert.equal(engine.get(id).state,'dormant');
  engine.dispose();
});

test('original engine dormant transition after preparation invalidates no-birth settlement',()=>{
  const w=world(),engine=engineOf(w);
  const id=engine.spawn('deer',[8,4,8],{homeChunk:'0,0,0'});
  assert.ok(id);
  const proposed=prepareOriginalMobPoll({
    ...opts(w,engine),spawnOnFirstVisit:false
  });
  assert.equal(proposed.kind,'cooldown');
  assert.equal(engine.transition(id,'dormant'),true);
  assert.throws(()=>settleOriginalMobPoll(proposed,{world:w}),
    /Original MobEngine roster changed during inspection/);
  engine.dispose();
});
test('original engine health changes without moving invalidate source admission proof',()=>{
  const w=world(),engine=engineOf(w);
  const id=engine.spawn('deer',[8,4,8],{homeChunk:'0,0,0'});
  assert.ok(id);
  const proposed=prepareOriginalMobPoll({
    ...opts(w,engine),spawnOnFirstVisit:false
  });
  assert.equal(engine.damage(id,1),true);
  assert.throws(()=>settleOriginalMobPoll(proposed,{world:w}),
    /Original MobEngine roster changed during inspection/);
  engine.dispose();
});
