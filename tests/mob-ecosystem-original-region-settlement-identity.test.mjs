// Original MYTHWROUGHT integration cases. Require the complete repository.
// The standalone witness tests run independently; these verify actual MobEngine
// ownership, natural-spawn candidate settlement and one-shot rejection.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../src/mobs/engine.mjs';
import {prepareOriginalMobPoll,settleOriginalMobPoll}
  from '../src/mobs/ecosystem-region-poll.mjs';

function physicalWorld(){
  return {revision(){return 0;},residentAt(){return true;},
    volume(point){return point[1]<4?'solid':'clear';},
    grounded(point){return point[1]>=4&&point[1]<4.04;},
    environment(){return {biome:'meadow',light:.8,hazard:false};},
    medium(){return 'air';},
    set(){throw Error('No original-world writes');},
    save(){throw Error('No Schema-1 writes');}};
}
function source(){
  const world=physicalWorld();
  const engine=new MobEngine(world,179,{maxEntities:32,maxActive:8});
  const region={cx:0,cz:0,section:0,feet:4},observer=[8,4,8];
  const args={engine,world,seed:179,region,observer,
    biome:'meadow',light:.8,now:10,spawnOnFirstVisit:false};
  return {world,engine,region,observer,args};
}

test('original regional cooldown cannot settle after observer walks away',()=>{
  const h=source(),plan=prepareOriginalMobPoll(h.args);
  assert.equal(plan.kind,'cooldown');
  h.observer[0]=100;
  assert.throws(()=>settleOriginalMobPoll(plan,{world:h.world}),
    /Original regional source inputs changed during poll/);
  assert.throws(()=>settleOriginalMobPoll(plan,{world:h.world}),
    /Invalid or stale original regional mob poll/);
  assert.equal(h.engine.counts().total,0);
  h.engine.dispose();
});

test('original regional cooldown cannot settle under a remapped source chunk',()=>{
  const h=source(),plan=prepareOriginalMobPoll(h.args);
  h.region.cx=1;
  assert.throws(()=>settleOriginalMobPoll(plan,{world:h.world}),
    /Original regional source inputs changed during poll/);
  assert.equal(h.engine.counts().total,0);
  h.engine.dispose();
});

test('observer mutation inside settlement world revision refuses claimed cooldown',()=>{
  const h=source(),plan=prepareOriginalMobPoll(h.args);
  h.world.revision=()=>{h.observer[2]=200;return 0;};
  assert.throws(()=>settleOriginalMobPoll(plan,{world:h.world}),
    /Original regional source inputs changed during poll/);
  assert.equal(h.engine.counts().total,0);
  h.engine.dispose();
});

test('source original unchanged cooldown settles with its existing .5 second wait',()=>{
  const h=source(),plan=prepareOriginalMobPoll(h.args);
  assert.equal(plan.kind,'cooldown');
  const settled=settleOriginalMobPoll(plan,{world:h.world});
  assert.equal(settled.next,10.5);
  assert.equal(settled.serial,0);
  assert.equal(h.engine.counts().total,0);
  h.engine.dispose();
});

test('late observer movement disallows an independently admitted newborn claim',()=>{
  const h=source();
  let candidate=null;
  for(let seed=1;seed<=256;seed++){
    const plan=prepareOriginalMobPoll({...h.args,seed,spawnOnFirstVisit:true});
    if(plan.proposal){candidate=plan;break;}
  }
  assert.ok(candidate,'Source meadow must have one physically eligible candidate');
  const id=h.engine.spawn(candidate.proposal.species.id,candidate.proposal.point,{
    homeChunk:'0,0,0',
    dormant:Math.hypot(...candidate.proposal.point.map((v,i)=>v-h.observer[i]))>18
  });
  assert.ok(id,'The original MobEngine independently admits a newborn');
  h.observer[0]=100;
  assert.throws(()=>settleOriginalMobPoll(candidate,{world:h.world,spawnedId:id}),
    /Original regional source inputs changed during poll/);
  assert.equal(h.engine.counts().total,1,
    'Read-only research rejection must not undo an independent engine admission');
  assert.throws(()=>settleOriginalMobPoll(candidate,{world:h.world,spawnedId:id}),
    /Invalid or stale original regional mob poll/);
  h.engine.dispose();
});

test('late region-floor change disallows newborn proof without changing original engine',()=>{
  const h=source();
  let candidate=null;
  for(let seed=1;seed<=256;seed++){
    const plan=prepareOriginalMobPoll({...h.args,seed,spawnOnFirstVisit:true});
    if(plan.proposal){candidate=plan;break;}
  }
  assert.ok(candidate);
  h.region.feet=12;
  assert.throws(()=>settleOriginalMobPoll(candidate,{world:h.world}),
    /Original regional source inputs changed during poll/);
  assert.equal(h.engine.counts().total,0);
  h.engine.dispose();
});
