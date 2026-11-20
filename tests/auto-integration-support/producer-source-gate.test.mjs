import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyProducerSources} from '../../src/auto-integration-support/producer-source-gate.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const commit='a'.repeat(40);
const bytes=Buffer.from('real source fixture');
const manifest=()=>Object.fromEntries(['surface','caves','objects'].map(lane=>[lane,{commit,path:'src/'+lane+'.mjs',sha256:sha(bytes)}]));
const read=async()=>bytes;
test('matching content is SOURCE_MATCH_ONLY, never integration proof',async()=>{
 const result=await verifyProducerSources({root:'/repo',manifest:manifest(),read});
 assert.equal(result.status,'SOURCE_MATCH_ONLY');
 assert.equal(result.integrationVerified,false);
 assert.equal(result.browserVerified,false);
 assert.equal(result.results.length,3);
});
test('missing producer and digest mismatch fail closed',async()=>{
 const m=manifest();delete m.caves;m.objects.sha256='0'.repeat(64);
 const r=await verifyProducerSources({root:'/repo',manifest:m,read});
 assert.equal(r.status,'NOT_VERIFIED');
 assert.deepEqual(r.results.map(x=>x.status),['SOURCE_MATCH','NOT_VERIFIED','NOT_VERIFIED']);
});
test('path traversal is rejected without reading',async()=>{
 const m=manifest();m.surface.path='../secret';
 let count=0;
 const r=await verifyProducerSources({root:'/repo',manifest:m,read:async()=>{count++;return bytes;}});
 assert.equal(r.results[0].status,'NOT_VERIFIED');
 assert.equal(count,2);
});
test('unavailable producer never counts as verified',async()=>{
 const r=await verifyProducerSources({root:'/repo',manifest:manifest(),read:async()=>{const e=new Error('missing');e.code='ENOENT';throw e;}});
 assert.equal(r.status,'NOT_VERIFIED');
 assert.ok(r.results.every(x=>x.reason==='producer file unavailable'));
});
