import test from 'node:test';
import assert from 'node:assert/strict';
import {makeSeedScopedForestFixture,FOREST_SIDECAR_GUARD_VERSION} from '../src/nonblock-scene48/forest-sidecar-guard.mjs';
const specs=[{sceneId:'scene48:exposed-root',anchor:[0,0,0]},{sceneId:'scene48:fallen-branch',anchor:[2,0,0]}];
test('forest sidecar guard preserves removal on same-seed reload without spawning',()=>{
 const f=makeSeedScopedForestFixture(71,specs);
 assert.equal(f.visible().length,2);
 const key=f.visible()[0].instanceKey;
 assert.equal(f.breakByKey(key),true);
 assert.equal(f.breakByKey(key),false);
 const saved=JSON.parse(JSON.stringify(f.snapshot()));
 assert.equal(saved.contract,FOREST_SIDECAR_GUARD_VERSION);
 const reload=makeSeedScopedForestFixture(71,specs,saved);
 assert.equal(reload.visible().length,1);
 assert.equal(reload.visible().some(o=>o.instanceKey===key),false);
 assert.equal(makeSeedScopedForestFixture(72,specs).visible().length,2);
});
test('forest sidecar guard rejects foreign seed, unknown tombstone and duplicates atomically',()=>{
 const f=makeSeedScopedForestFixture(71,specs);
 const saved=f.snapshot();
 assert.throws(()=>makeSeedScopedForestFixture(72,specs,saved),/foreign/);
 assert.throws(()=>makeSeedScopedForestFixture(71,specs,{...saved,removed:['scene48:fake']}),/invalid/);
 const key=f.visible()[0].instanceKey;
 assert.throws(()=>makeSeedScopedForestFixture(71,specs,{...saved,removed:[key,key]}),/invalid/);
 assert.throws(()=>makeSeedScopedForestFixture(71,[specs[0],specs[0]]),/duplicate/);
 assert.throws(()=>makeSeedScopedForestFixture(71,[{...specs[0],seed:72}]),/foreign/);
 assert.equal(f.visible().length,2);
});
