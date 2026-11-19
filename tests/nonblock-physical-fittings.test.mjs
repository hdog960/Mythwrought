import assert from 'node:assert/strict';
import test from 'node:test';
import {planOwnedFitting,OWNED_FITTING_IDS} from '../src/nonblock/physical-fittings.mjs';

test('matching roster slots resolve the physical owner and its approved geometry',()=>{
  const ids=[67,67,68,66,163,68,65,175,168,173,174];
  assert.equal(OWNED_FITTING_IDS.length,ids.length);
  for(const [index,id] of OWNED_FITTING_IDS.entries()) {
    const plan=planOwnedFitting(id,{anchor:[2,5,9],orientation:1});
    assert.equal(plan.placements[0].numericId,ids[index]);
    assert.equal(plan.blueprint.physicalAssets[0].numericId,ids[index]);
    assert.ok(plan.blueprint.physicalAssets[0].selection.length>0);
    assert.ok(plan.blueprint.physicalAssets[0].collision.length>0);
    assert.equal(plan.blueprint.physicalAssets[0].sourcePack,ids[index]<100?2:4);
  }
});

test('paired leaves have separated hinges and use only existing coordinate and state owners',()=>{
  const id='scene36:double-door-pair';
  const closed=planOwnedFitting(id,{anchor:[2,5,9],orientation:0});
  const open=planOwnedFitting(id,{anchor:[2,5,9],orientation:0,open:true});
  assert.deepEqual(open.placements.map(p=>[p.at,p.orientation]),[[[2,5,9],0],[[3,5,9],2]]);
  assert.ok(open.blueprint.physicalAssets[0].collision.every(b=>b[3]<2.29));
  assert.ok(open.blueprint.physicalAssets[1].collision.every(b=>b[0]>3.70));
  assert.ok(closed.blueprint.physicalAssets[0].collision.some(b=>b[3]-b[0]>.8));
  assert.equal(planOwnedFitting('scene36:trapdoor',{anchor:[0,2,0]}).placements[0].state.variant,'lower');
  assert.equal(planOwnedFitting('scene36:hinged-hatch',{anchor:[0,2,0]}).placements[0].state.variant,'upper');
  assert.throws(()=>planOwnedFitting('scene36:window-shutters',{anchor:[0,2,0],open:true}));
  assert.throws(()=>planOwnedFitting('scene36:hanging-lantern',{anchor:[0,2,0]}));
});
