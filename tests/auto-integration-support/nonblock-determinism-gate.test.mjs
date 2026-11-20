import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyNonblockDeterminism} from '../../src/auto-integration-support/nonblock-determinism-gate.mjs';
const sha='a'.repeat(40),provenance={scene48:sha,environments24:sha,fittings36:sha,interaction00:sha};
function fixture({respawn=false,unstable=false}={}){
 const tombstones=new Set();let n=0;
 return {describe:({sceneId,seed,anchor})=>{const variant=unstable?Math.floor(n++/2)%2:0,key='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;return {contract:'nonblock-object-v1',sceneId,seed,anchor,variant,instanceKey:key,selectionAabbs:[{min:[0,0,0],max:[1,1,1]}],breakIntent:{action:'remove-object',targetKey:key}};},snapshot:()=>({tombstones:[...tombstones]}),remove:d=>{tombstones.add(d.instanceKey)},restore:s=>{tombstones.clear();for(const k of s.tombstones)tombstones.add(k)},visible:ds=>respawn?ds:ds.filter(d=>!tombstones.has(d.instanceKey))};
}
const run=(source,extra={})=>verifyNonblockDeterminism({provenance,source,seed:17,anchors:[[0,0,0],[2,0,0]],sceneIds:['scene48:low-grass'],...extra});
test('deterministic isolated lifecycle passes without claiming schema1',async()=>{const r=await run(fixture());assert.equal(r.ok,true);assert.match(r.status,/NOT_SCHEMA1/)});
test('missing source fails closed',async()=>assert.equal((await run(null)).ok,false));
test('missing provenance fails closed',async()=>assert.equal((await run(fixture(),{provenance:{}})).ok,false));
test('changing descriptors rejected',async()=>assert.ok((await run(fixture({unstable:true}))).errors.includes('NONDETERMINISTIC_DESCRIPTOR')));
test('respawn rejected',async()=>assert.ok((await run(fixture({respawn:true}))).errors.includes('REMOVED_OBJECT_RESPAWNED')));
test('duplicate anchors rejected',async()=>assert.ok((await run(fixture(),{anchors:[[0,0,0],[0,0,0]]})).errors.includes('DUPLICATE_INSTANCE')));
test('invalid fixture rejected',async()=>assert.ok((await run(fixture(),{seed:1.2})).errors.includes('INVALID_FIXTURE')));
