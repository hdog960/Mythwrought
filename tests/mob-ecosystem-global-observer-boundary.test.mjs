import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../src/mobs/engine.mjs';
import {createGlobalEcologyClock,previewGlobalEcologySelection,
  advanceGlobalEcologyClock} from '../src/mobs/ecosystem-global-clock.mjs';
import {prepareGlobalMobTick,settleGlobalMobTick}
  from '../src/mobs/ecosystem-global-preflight.mjs';

function world(){
  return {
    revision(){return 0;},residentAt(){return true;},
    volume(p){return p[1]<4?'solid':'clear';},
    grounded(p){return p[1]>=4&&p[1]<4.04;},
    environment(){return {biome:'meadow',light:.8,hazard:false};},
    medium(){return 'air';}
  };
}
const plainRegion=()=>({cx:0,cz:0,section:0,feet:4});
function harness(){
  const w=world(),engine=new MobEngine(w,179,{maxEntities:32,maxActive:8});
  const id=engine.spawn('deer',[9,4,8]);
  assert.ok(id,'Original source engine must admit a nearby deer');
  const observer=[8,4,8],clock=createGlobalEcologyClock();
  const args=regions=>({clock,seconds:.5,regions,engine,world:w,
    seed:179,observer,biome:'meadow',light:.8});
  return {w,engine,id,observer,clock,args};
}

// The original previewSourceEcologyRegion reads cx FOUR times per selected
// preview: validity twice, key once and the immutable region copy once.
// A getter can change observer on the SECOND selection call without changing
// the selected region or source world revision.
test('global reconcile and region poll cannot see different observer positions',()=>{
  const h=harness();
  let reads=0;
  const region={get cx(){if(++reads===5)h.observer[0]=100;return 0;},
    cz:0,section:0,feet:4};
  assert.throws(()=>prepareGlobalMobTick(h.args([region])),
    /Original reconcile observer changed during inspection/);
  assert.equal(reads,8);
  assert.equal(h.engine.get(h.id).state,'idle',
    'Rejected read-only preflight must not change original engine state');
  h.observer[0]=8;
  const retry=prepareGlobalMobTick(h.args([plainRegion()]));
  assert.equal(retry.reason,'selected','Certified global clock must remain reusable');
  settleGlobalMobTick(retry,{world:h.w});
  h.engine.dispose();
});

test('first source selection callback observer mutation fails before reconciliation',()=>{
  const h=harness();
  let reads=0;
  const region={get cx(){if(++reads===1)h.observer[0]=100;return 0;},
    cz:0,section:0,feet:4};
  assert.throws(()=>prepareGlobalMobTick(h.args([region])),
    /Original reconcile observer changed during inspection/);
  assert.equal(reads,4);
  h.observer[0]=8;
  const retry=prepareGlobalMobTick(h.args([plainRegion()]));
  assert.equal(retry.reason,'selected');
  settleGlobalMobTick(retry,{world:h.w});
  h.engine.dispose();
});

test('global preflight never reenters a fourth region selection after last observer barrier',()=>{
  const h=harness();
  let reads=0;
  const region={get cx(){if(++reads===13)h.observer[0]=100;return 0;},
    cz:0,section:0,feet:4};
  const tick=prepareGlobalMobTick(h.args([region]));
  assert.equal(tick.reason,'selected');
  assert.equal(reads,12,'Three unchanged source selections; not a fourth');
  assert.equal(h.observer[0],8);
  settleGlobalMobTick(tick,{world:h.w});
  h.engine.dispose();
});

test('source clock refuses forged, mismatched and replayed selection certificates',()=>{
  const clock=createGlobalEcologyClock(),regions=[plainRegion()];
  assert.throws(()=>advanceGlobalEcologyClock(clock,{seconds:.5,regions,
    certifiedSelection:Object.freeze({reason:'selected',time:.5})}),/Uncertified/);
  const proof=previewGlobalEcologySelection(clock,{seconds:.5,regions});
  assert.throws(()=>advanceGlobalEcologyClock(clock,{seconds:.5,
    regions:[plainRegion()],certifiedSelection:proof}),/Uncertified/);
  assert.throws(()=>advanceGlobalEcologyClock(clock,{seconds:.6,
    regions,certifiedSelection:proof}),/Uncertified/);
  const actual=advanceGlobalEcologyClock(clock,{seconds:.5,regions,
    certifiedSelection:proof});
  assert.equal(actual.reason,'selected');
  assert.throws(()=>advanceGlobalEcologyClock(clock,{seconds:.5,regions,
    certifiedSelection:proof}),/Uncertified/);
});
