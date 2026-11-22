import test from 'node:test';import assert from 'node:assert/strict';import {auditDescriptorBatch} from '../../src/auto-integration-support/nonblock-descriptor-gate.mjs';
const sha='a'.repeat(40);
function descriptor(){let key='nb1:scene48%3Alow-grass:17:0,0,0:0';return {contract:'nonblock-object-v1',sceneId:'scene48:low-grass',seed:17,anchor:[0,0,0],variant:0,instanceKey:key,breakIntent:{action:'remove-object',targetKey:key,requiresOwner:':00'},persistence:{kind:'schema1-external-tombstone-sidecar',key,defaultRespawn:'never-until-explicit-reset'},selectionAabbs:[{min:[0,0,0],max:[1,1,1]}],render:{triangleCount:1,maxInstancesPerBatch:512,instanced:true,mesh:{positions:new Float32Array(9),materials:new Uint8Array(1)}}};}
const run=(objects=[descriptor()],overrides={})=>auditDescriptorBatch({objects,expectedSeed:17,expectedSourceSha:sha,observedSourceSha:sha,...overrides});
test('declared fixture is not live',()=>{let r=run();assert.equal(r.ok,true);assert.match(r.status,/NOT_LIVE/)});
test('SHA mismatch',()=>assert.ok(run(undefined,{observedSourceSha:'b'.repeat(40)}).errors.includes('SOURCE_IDENTITY_NOT_AUTHENTICATED')));
test('duplicate identity',()=>assert.ok(run([descriptor(),descriptor()]).errors.includes('DUPLICATE_INSTANCE')));
test('orientation suffix rejected',()=>{let d=descriptor();d.instanceKey+=':r1';assert.ok(run([d]).errors.includes('IDENTITY_MISMATCH'))});
test('unbreakable scenery rejected',()=>{let d=descriptor();delete d.breakIntent;assert.ok(run([d]).errors.includes('NOT_INDIVIDUALLY_BREAKABLE'))});
test('missing tombstone handoff rejected',()=>{let d=descriptor();delete d.persistence;assert.ok(run([d]).errors.includes('PERSISTENCE_HANDOFF_MISSING'))});
test('invalid pick bounds rejected',()=>{let d=descriptor();d.selectionAabbs=[{min:[1,0,0],max:[0,1,1]}];assert.ok(run([d]).errors.includes('INVALID_PICK_AABB'))});
test('invalid mesh rejected',()=>{let d=descriptor();d.render.mesh.positions=[];assert.ok(run([d]).errors.includes('INVALID_RENDER_BUDGET_OR_MESH'))});
test('seed drift rejected',()=>assert.ok(run(undefined,{expectedSeed:18}).errors.includes('IDENTITY_MISMATCH')));
test('duplicate tombstones rejected',()=>assert.ok(run(undefined,{tombstones:['a','a']}).errors.includes('INVALID_TOMBSTONES')));
