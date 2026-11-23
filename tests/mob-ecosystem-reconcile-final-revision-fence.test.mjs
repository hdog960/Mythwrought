// Detached source-original reconcile revision-fence regression tests.
// These import the real MobEngine and source inspector in a full checkout.
// They do not call the private PopulationManager #away ledger or edit saves.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../src/mobs/engine.mjs';
import {inspectOriginalReconcileReadiness}
  from '../src/mobs/ecosystem-reconcile-readiness.mjs';

function fixture({spawn=true,dormant=false}={}){
  let revision=0,revisionReads=0;
  const world={
    revision(){revisionReads++;return revision;},
    residentAt(){return true;},
    volume(){return 'clear';},
    grounded(){return true;}
  };
  const engine=new MobEngine(world,179,{maxEntities:32,maxActive:8});
  const id=spawn?engine.spawn('deer',[9,4,8]):null;
  if(spawn)assert.ok(id,'Actual source MobEngine must admit a deer');
  if(dormant)assert.equal(engine.transition(id,'dormant'),true);
  const originalAll=engine.all.bind(engine);
  let rosterReads=0,afterRoster=null;
  engine.all=()=>{
    const entries=originalAll();
    rosterReads++;
    afterRoster?.(rosterReads);
    return entries;
  };
  return {world,engine,id,
    inspect:observer=>inspectOriginalReconcileReadiness({engine,world,observer}),
    edit(){revision++},revision:()=>revision,
    revisionReads:()=>revisionReads,rosterReads:()=>rosterReads,
    setRosterHook:fn=>afterRoster=fn,
    dispose(){engine.dispose()}
  };
}

test('second original MobEngine.all read editing world must not certify nearby ready',()=>{
  const h=fixture();
  h.setRosterHook(n=>{if(n===2)h.edit();});
  assert.throws(()=>h.inspect([8,4,8]),
    /World revision changed during reconcile inspection/);
  assert.equal(h.revision(),1);
  assert.equal(h.rosterReads(),3);
  assert.equal(h.engine.get(h.id)?.state,'idle',
    'Inspector does not transition the original engine');
  h.dispose();
});

test('same second-roster edit rejects a far-away pending six-second ledger',()=>{
  const h=fixture({dormant:true});
  h.setRosterHook(n=>{if(n===2)h.edit();});
  assert.throws(()=>h.inspect([100,4,8]),
    /World revision changed during reconcile inspection/);
  assert.equal(h.revision(),1);
  assert.equal(h.engine.get(h.id)?.state,'dormant');
  h.dispose();
});

test('an empty original MobEngine roster cannot hide late world edits',()=>{
  const h=fixture({spawn:false});
  h.setRosterHook(n=>{if(n===2)h.edit();});
  assert.throws(()=>h.inspect([8,4,8]),
    /World revision changed during reconcile inspection/);
  assert.equal(h.revision(),1);
  assert.equal(h.rosterReads(),3);
  h.dispose();
});

test('stable nearby original engine remains ready; exactly three revision reads',()=>{
  const h=fixture();
  const result=h.inspect([8,4,8]);
  assert.equal(result.ready,true);
  assert.equal(result.inspected,1);
  assert.deepEqual(result.required,[]);
  assert.equal(result.revision,0);
  assert.equal(h.rosterReads(),3);
  assert.equal(h.revisionReads(),3,
    'Initial read, post-reconcile check and two bounded roster readbacks');
  h.dispose();
});

test('last world-revision accessor change is rejected without a fake ready',()=>{
  const h=fixture();
  let reads=0,revision=0;
  h.world.revision=()=>{
    if(++reads===3)revision++;
    return revision;
  };
  assert.throws(()=>h.inspect([8,4,8]),
    /World revision changed during reconcile inspection/);
  assert.equal(reads,3);
  assert.equal(revision,1);
  h.dispose();
});

test('final world-revision callback moving player rejects before ready result',()=>{
  const h=fixture(),observer=[8,4,8];
  let reads=0;
  h.world.revision=()=>{if(++reads===3)observer[0]=100;return 0;};
  assert.throws(()=>h.inspect(observer),
    /Original reconcile observer changed during inspection/);
  assert.equal(reads,3);
  assert.equal(h.engine.get(h.id)?.state,'idle');
  h.dispose();
});

test('final original roster mutation still fails its existing strict roster fence',()=>{
  const h=fixture();
  h.setRosterHook(n=>{
    if(n===2)assert.equal(h.engine.transition(h.id,'dormant'),true);
  });
  assert.throws(()=>h.inspect([8,4,8]),
    /Original MobEngine roster changed during inspection/);
  assert.equal(h.engine.get(h.id)?.state,'dormant');
  h.dispose();
});

test('world edit during third original source roster read is rejected',()=>{
  const h=fixture();
  h.setRosterHook(n=>{if(n===3)h.edit();});
  assert.throws(()=>h.inspect([8,4,8]),
    /World revision changed during reconcile inspection/);
  assert.equal(h.revision(),1);
  assert.equal(h.rosterReads(),3);
  h.dispose();
});

test('newborn added just after second roster snapshot cannot forge a clean census',()=>{
  const h=fixture();
  let newborn=null;
  h.setRosterHook(n=>{
    if(n===2)newborn=h.engine.spawn('deer',[10,4,8]);
  });
  assert.throws(()=>h.inspect([8,4,8]),
    /Original MobEngine roster changed during inspection/);
  assert.ok(newborn,'Original MobEngine independently admitted the creature');
  assert.equal(h.engine.counts().total,2,
    'Read-only reconcile rejection must not undo the original engine');
  h.dispose();
});
