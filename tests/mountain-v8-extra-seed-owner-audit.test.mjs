// Exact original-source cave-world mob roster claim preservation.
// Targeted read-only tests; no cave/engine/production source changes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mobSaveKey} from '../src/mobs/live-game.mjs';
import {loadWorldSafe} from '../src/persistence.mjs';
import {isUnclaimedWorldSeed} from '../src/manual-biomes/profile-storage.mjs';
import {auditMountainV8ExtraSeedOwners as extra}
  from '../src/manual-biomes/mountain-v8-extra-seed-owner-audit.mjs';
import {inspectMountainV8OptInSeed as inspect}
  from '../src/manual-biomes/mountain-v8-opt-in-seed-preflight.mjs';

function storage(){
  const map=new Map();
  return {get length(){return map.size;},
    key(i){return [...map.keys()][i]??null;},
    getItem(k){return map.has(k)?map.get(k):null;},
    setItem(k,v){map.set(k,v);},
    snapshot(){return JSON.stringify([...map])}};
}
function checkNoWrites(store,seed){
  const before=store.snapshot(),r=inspect(store,seed);
  assert.equal(store.snapshot(),before);
  assert.equal(r.safeToIntegrate,false);
  assert.equal(r.runtimeActivationAuthorized,false);
  return r;
}
test('source-authentic cave mob roster key is absent from original unclaimed-seed gate, V8 refuses anyway',()=>{
  for(const seed of [179,2026,-88]){
    const store=storage(),key=mobSaveKey(seed,'cave');
    store.setItem(key,'original-owner-content-preserved');
    assert.equal(isUnclaimedWorldSeed(store,seed,loadWorldSafe(store,seed)),true,
      'original M7 claim scan does not yet include cave mob sidecar alone');
    const out=checkNoWrites(store,seed);
    assert.equal(out.reason,'existing-cave-mob-roster-or-backup');
    assert.equal(out.knownStorageUnclaimed,false);
    assert.equal(extra(store,seed).claim,true);
  }
});
test('source-authentic cave mob backup alone also blocks seed reuse, byte-identical',()=>{
  const seed=2026,key=mobSaveKey(seed,'cave')+'.backup',store=storage();
  store.setItem(key,'only-surviving-cave-mob-backup');
  const result=checkNoWrites(store,seed);
  assert.equal(result.reason,'existing-cave-mob-roster-or-backup');
  assert.equal(store.getItem(key),'only-surviving-cave-mob-backup');
});
test('the same cave owner key for a DIFFERENT seed cannot falsely claim this seed',()=>{
  const store=storage(),seed=179;
  store.setItem(mobSaveKey(1790,'cave'),'foreign-seed');
  store.setItem(mobSaveKey(-179,'cave'),'different-sign');
  store.setItem(mobSaveKey(2026,'cave')+'.backup','different-seed');
  assert.equal(extra(store,seed).claim,false);
  assert.equal(checkNoWrites(store,seed).reason,'read-only-unclaimed-candidate');
});
test('original ordinary mob roster remains blocked by original source gate too',()=>{
  const store=storage(),seed=179;
  store.setItem(mobSaveKey(seed,'normal'),'ordinary-mob-owner');
  assert.equal(checkNoWrites(store,seed).reason,'existing-selected-seed-or-owner-sidecar');
});
test('unverifiable or duplicated key enumeration fails closed without writes',()=>{
  const key=mobSaveKey(179,'cave');
  const malformed={
    length:2,getItem(){return null;},
    key(){return key;}
  };
  const r=inspect(malformed,179);
  assert.equal(r.reason,'damaged-conflicting-or-unverifiable-original');
  assert.equal(r.safeToIntegrate,false);
  assert.throws(()=>extra({length:1,key(){return null;}},179),
    /Unverifiable original owner enumeration/);
});
test('extra source owner audit never grants new-world or gameplay integration permission',()=>{
  const store=storage(),a=extra(store,179);
  assert.equal(a.claim,false);
  assert.equal(a.requiresCrossOwnerStorageAudit,true);
  assert.equal(a.canCreateNewWorld,false);
  assert.equal(a.safeToIntegrate,false);
  assert.ok(Object.isFrozen(a));
  assert.throws(()=>extra(store,2**33),/Invalid original int32 seed/);
});

test('changing storage key-count during enumeration is not certified unclaimed',()=>{
  let changed=false;
  const race={
    get length(){return changed?2:1;},
    key(i){changed=true;return i===0?'unrelated-owner':'another-owner';},
    getItem(){return null;}
  };
  assert.throws(()=>extra(race,179),/Changed original owner enumeration length/);
  const r=inspect(race,179);
  assert.equal(r.safeToIntegrate,false);
  assert.equal(r.runtimeActivationAuthorized,false);
});
