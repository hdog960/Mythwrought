import test from 'node:test';
import assert from 'node:assert/strict';
import {auditRemovalTransaction} from '../../src/auto-integration-support/nonblock-transaction-audit.mjs';
const seed=17;
const make=(x,sceneId='scene48:low-grass')=>{const key='nb1:'+encodeURIComponent(sceneId)+':17:'+x+',0,0:0';return {contract:'nonblock-object-v1',sceneId,seed,anchor:[x,0,0],variant:0,instanceKey:key,breakIntent:{action:'remove-object',targetKey:key,requiresOwner:':00'},persistence:{key}};};
const objects=[make(0),make(2,'scene24:crystal-shard')];
const sourceProof={authenticated:true,':24':'a'.repeat(40),':36':'b'.repeat(40),':48':'c'.repeat(40)};
function fixture({wrongPick=false,noRemoval=false,noRestore=false}={}){
 let removed=new Set();
 return {pick:async target=>wrongPick?objects[1]:target,breakObject:async target=>{if(!noRemoval)removed.add(target.instanceKey);},visible:async list=>list.filter(o=>!removed.has(o.instanceKey)),snapshot:async()=>({tombstones:[...removed]}),restore:async snap=>{removed=noRestore?new Set():new Set(snap.tombstones)}};
}
const run=(extra={})=>auditRemovalTransaction({objects,seed,sourceProof,callbacks:fixture(),...extra});
test('isolated removal and tombstone roundtrip passes fixture, never claims live',async()=>{const r=await run();assert.equal(r.ok,true);assert.equal(r.live,false);assert.match(r.status,/FIXTURE_ONLY/);});
test('missing source authentication fails closed',async()=>assert.equal((await run({sourceProof:{...sourceProof,authenticated:false}})).ok,false));
test('missing producer SHA fails closed',async()=>assert.equal((await run({sourceProof:{...sourceProof,':36':'bad'}})).ok,false));
test('duplicate identities fail',async()=>assert.ok((await run({objects:[objects[0],objects[0]]})).errors.includes('DUPLICATE_KEY')));
test('wrong seed fails',async()=>assert.ok((await run({seed:18})).errors.includes('INVALID_INDIVIDUAL_OBJECT')));
test('wrong pick fails',async()=>assert.ok((await run({callbacks:fixture({wrongPick:true})})).errors.includes('PICK_WRONG_TARGET')));
test('unremoved target fails',async()=>assert.ok((await run({callbacks:fixture({noRemoval:true})})).errors.includes('REMOVAL_ISOLATION')));
test('lost tombstone on restore fails',async()=>assert.ok((await run({callbacks:fixture({noRestore:true})})).errors.includes('TOMBSTONE_RELOAD')));
test('missing callback fails closed',async()=>assert.ok((await run({callbacks:{}})).errors.includes('MISSING_REAL_CALLBACK_ADAPTER')));
test('unverified result cannot be live',async()=>assert.equal((await run({sourceProof:null})).live,false));
