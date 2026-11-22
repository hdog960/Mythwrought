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
const opts=(w,entities,seed=179)=>({
  world:w,seed,region,observer:[8,4,8],biome:'meadow',
  light:.8,now:10,spawnOnFirstVisit:true,entities
});

test('original first-visit cooldown prevents premature candidate evaluation',()=>{
  const w=world(),p=prepareOriginalMobPoll({
    ...opts(w,[]),spawnOnFirstVisit:false
  });
  assert.equal(p.kind,'cooldown');
  assert.equal(p.attempts,0);
  assert.equal(p.proposal,null);
  assert.equal(p.record.next,10.5);
  assert.equal(settleOriginalMobPoll(p,{world:w}).next,10.5);
});

test('source natural birth counts only after exact real engine admission proof',()=>{
  const w=world(),engine=new MobEngine(w,179,{maxEntities:32,maxActive:8});
  let found=null;
  for(let seed=1;seed<=256;seed++){
    const candidate=prepareOriginalMobPoll(opts(w,engine.all(),seed));
    if(candidate.proposal){found=candidate;break;}
  }
  assert.ok(found,'One deterministic original-species proposal must be eligible');
  const pre=settleOriginalMobPoll(found,{world:w});
  assert.equal(pre.serial,found.attempts);
  assert.equal(pre.next,10,'Candidate without actual admission is NOT a birth');
  const id=engine.spawn(found.proposal.species.id,found.proposal.point,{
    homeChunk:'0,0,0'
  });
  assert.ok(id,'The actual original MobEngine must admit the eligible candidate');
  const after=engine.all();
  const posted=settleOriginalMobPoll(found,{
    world:w,afterEntities:after,spawnedId:id
  });
  assert.equal(posted.next,11.5);
  assert.equal(posted.serial,found.attempts);
  assert.equal(new Map(posted.highWater).get(found.proposal.species.id),1);
  assert.equal(engine.counts().total,1,'The transaction helper does not spawn mobs');
  engine.dispose();
});

test('wrong species, mismatched origin or forged admission cannot prove a birth',()=>{
  const w=world();
  let candidate=null;
  for(let seed=1;seed<=256;seed++){
    const p=prepareOriginalMobPoll(opts(w,[],seed));
    if(p.proposal){candidate=p;break;}
  }
  assert.ok(candidate);
  const p=candidate.proposal;
  const forged={
    id:'forged',species:getSpecies('cow'),position:[...p.point],
    homeChunk:'0,0,0',important:false
  };
  assert.throws(()=>settleOriginalMobPoll(candidate,{
    world:w,afterEntities:[forged],spawnedId:'forged'
  }),/Original MobEngine admission proof mismatch/);
  assert.throws(()=>settleOriginalMobPoll(candidate,{
    world:w,afterEntities:[{
      ...forged,species:p.species,homeChunk:'1,0,0'
    }],spawnedId:'forged'
  }),/Original MobEngine admission proof mismatch/);
  assert.throws(()=>settleOriginalMobPoll(candidate,{
    world:w,afterEntities:[],spawnedId:'forged'
  }),/Original MobEngine admission proof mismatch/);
});

test('source world edits invalidate both proposal and subsequent admission',()=>{
  let revision=0;
  const w={...world(),revision(){return revision;}};
  let candidate;
  for(let seed=1;seed<=256;seed++){
    const result=prepareOriginalMobPoll(opts(w,[],seed));
    if(result.proposal){candidate=result;break;}
  }
  assert.ok(candidate);
  revision++;
  assert.throws(()=>settleOriginalMobPoll(candidate,{world:w}),
    /Invalid or stale original regional mob poll/);
});

test('poll refuses candidate admission while full or cooling down',()=>{
  const w=world();
  const first=prepareOriginalMobPoll({
    ...opts(w,[]),spawnOnFirstVisit:false
  });
  assert.throws(()=>settleOriginalMobPoll(first,{
    world:w,spawnedId:'mob-1',afterEntities:[]
  }),/No engine admission allowed during cooldown/);
});
