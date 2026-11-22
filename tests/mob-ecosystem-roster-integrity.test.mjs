import test from 'node:test';
import assert from 'node:assert/strict';
import {captureOriginalMobRoster,assertOriginalMobRosterUnchanged}
  from '../src/mobs/ecosystem-roster-integrity.mjs';

const species=Object.freeze({id:'deer'});
const snapshot=(id='mob-1')=>({
  id,species,yaw:0,state:'idle',health:10,grounded:true,
  homeChunk:'0,0,0',important:false,juvenile:false,motionMode:'walk',
  position:[8,4,8],velocity:[0,0,0],origin:[8,4,8]
});

test('authentic snapshot shape remains stable across fresh frozen source copies',()=>{
  const before=snapshot(),token=captureOriginalMobRoster([before]);
  assert.equal(Object.isFrozen(token),true);
  assert.equal(Object.isFrozen(token.entries[0].position),true);
  assert.equal(assertOriginalMobRosterUnchanged(token,[snapshot()]),true);
  before.position[0]=999;
  assert.throws(()=>assertOriginalMobRosterUnchanged(token,[before]),/roster changed/);
});

test('detects independent state, protection, species, home, health and movement edits',()=>{
  const ticket=captureOriginalMobRoster([snapshot()]);
  for(const change of [
    {state:'dormant'},{important:true},{species:{id:'deer'}},
    {homeChunk:'1,0,0'},{health:5},{yaw:.2},{grounded:false},
    {juvenile:true},{motionMode:'swim'},
    {position:[8,4,9]},{velocity:[0,-1,0]},{origin:[9,4,8]}
  ]){
    assert.throws(()=>assertOriginalMobRosterUnchanged(ticket,[{
      ...snapshot(),...change
    }]),/roster changed/);
  }
});

test('rejects additions, removals, reorders and duplicate source IDs',()=>{
  const original=captureOriginalMobRoster([snapshot('a'),snapshot('b')]);
  assert.throws(()=>assertOriginalMobRosterUnchanged(original,[snapshot('a')]),/roster changed/);
  assert.throws(()=>assertOriginalMobRosterUnchanged(original,[snapshot('b'),snapshot('a')]),/roster changed/);
  assert.throws(()=>assertOriginalMobRosterUnchanged(original,[snapshot('a'),snapshot('b'),snapshot('c')]),/roster changed/);
  assert.throws(()=>captureOriginalMobRoster([snapshot('a'),snapshot('a')]),/Duplicate/);
});

test('caps source scans to 128 and refuses malformed vectors or identities',()=>{
  assert.equal(captureOriginalMobRoster(Array.from({length:128},(_,i)=>snapshot(String(i)))).entries.length,128);
  assert.throws(()=>captureOriginalMobRoster(Array.from({length:129},(_,i)=>snapshot(String(i)))),/roster size/);
  assert.throws(()=>captureOriginalMobRoster([{...snapshot(),position:[NaN,4,8]}]),/position or motion/);
  assert.throws(()=>captureOriginalMobRoster([{...snapshot(),id:''}]),/snapshot identity/);
  assert.throws(()=>captureOriginalMobRoster([{...snapshot(),velocity:[0,0]}]),/position or motion/);
});

test('rejects caller-forged tickets without invalidating authentic certificates',()=>{
  const legitimate=captureOriginalMobRoster([]);
  assert.throws(()=>assertOriginalMobRosterUnchanged({entries:[]},[]),/Uncertified/);
  assert.equal(assertOriginalMobRosterUnchanged(legitimate,[]),true);
});
