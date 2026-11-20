import test from 'node:test';
import assert from 'node:assert/strict';
import {probeNonblockLifecycle} from '../../src/auto-integration-support/nonblock-lifecycle-probe.mjs';
const sha='a'.repeat(40);
const obj={contract:'nonblock-object-v1',sceneId:'scene48:low-grass',seed:17,anchor:[0,0,0],variant:0,instanceKey:'nb1:scene48%3Alow-grass:17:0,0,0:0',selectionAabbs:[{min:[-.3,0,-.3],max:[.3,.5,.3]}],breakIntent:{action:'remove-object',targetKey:'nb1:scene48%3Alow-grass:17:0,0,0:0',requiresOwner:':00'},persistence:{kind:'schema1-external-tombstone-sidecar',key:'nb1:scene48%3Alow-grass:17:0,0,0:0'}};
function fixture(){let removed=false;return {pick:async o=>o.instanceKey,remove:async o=>(removed=true,{instanceKey:o.instanceKey,removed:true}),visible:async()=>!removed,snapshot:async()=>({seed:17,tombstones:removed?[obj.instanceKey]:[]}),reload:async()=>{removed=false},restore:async s=>{removed=s.tombstones.includes(obj.instanceKey)}}}
const run=(changes={},callbacks=fixture())=>probeNonblockLifecycle({descriptor:{...obj,...changes},seed:17,expectedNamespace:'scene48',sourceHeads:{producer:sha,core:sha},callbacks});
test('isolated lifecycle survives simulated reload',async()=>assert.equal((await run()).level,'ISOLATED_CALLBACK_FIXTURE_ONLY'));
test('rejects foreign namespace',async()=>assert.equal((await run({sceneId:'environment24:rock'})).ok,false));
test('rejects invalid selection box',async()=>assert.equal((await run({selectionAabbs:[]})).ok,false));
test('rejects unbreakable scenery',async()=>assert.equal((await run({breakIntent:null})).ok,false));
test('rejects missing callback',async()=>assert.equal((await run({},{})).ok,false));
test('rejects object respawn',async()=>{const c=fixture();c.restore=async()=>{};assert.equal((await run({},c)).ok,false)});
test('rejects duplicate tombstone',async()=>{const c=fixture();c.snapshot=async()=>({seed:17,tombstones:[obj.instanceKey,obj.instanceKey]});assert.equal((await run({},c)).ok,false)});
test('rejects wrong pick',async()=>{const c=fixture();c.pick=async()=>null;assert.equal((await run({},c)).ok,false)});
