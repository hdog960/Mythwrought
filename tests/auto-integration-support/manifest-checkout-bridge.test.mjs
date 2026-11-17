import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyManifestCheckouts} from '../../src/auto-integration-support/manifest-checkout-bridge.mjs';

const SHA='a'.repeat(40), DIGEST='b'.repeat(64);
const manifest=()=>({producers:Object.fromEntries(['surface','caves','objects'].map((lane,i)=>[lane,{head:SHA,pr:100+i,files:[{path:'src/'+lane+'.mjs',sha256:DIGEST}]}]))});
const checkouts={surface:'/tmp/surface',caves:'/tmp/caves',objects:'/tmp/objects'};
const matching=async ({manifest:m})=>({results:Object.entries(m).map(([lane,p])=>({lane,status:'SOURCE_MATCH',commit:p.commit,path:p.path,sha256:p.sha256}))});

test('checks each producer and reports source-only, never integration evidence',async()=>{
 let calls=0;
 const r=await verifyManifestCheckouts({manifest:manifest(),checkouts,verify:async a=>{calls++;return matching(a);}});
 assert.equal(calls,3);
 assert.equal(r.status,'SOURCE_MATCH_ONLY');
 assert.equal(r.integrationVerified,false);
 assert.equal(r.browserVerified,false);
 assert.equal(r.results.length,3);
});

test('checks every file, not just first file in a producer',async()=>{
 const m=manifest();m.producers.surface.files.push({path:'src/second.mjs',sha256:DIGEST});
 let calls=0;
 const r=await verifyManifestCheckouts({manifest:m,checkouts,verify:async a=>{
  calls++;
  const p=Object.values(a.manifest)[0];
  return p.path==='src/second.mjs'?{results:[]}:matching(a);
 }});
 assert.equal(calls,4);
 assert.equal(r.status,'NOT_VERIFIED');
 assert.equal(r.results[0].files[1].status,'NOT_VERIFIED');
});

test('missing checkout fails closed without running its verifier',async()=>{
 let calls=0;
 const r=await verifyManifestCheckouts({manifest:manifest(),checkouts:{surface:'/tmp/surface',objects:'/tmp/objects'},verify:async a=>{calls++;return matching(a);}});
 assert.equal(calls,2);
 assert.equal(r.status,'NOT_VERIFIED');
 assert.match(r.errors.join(' '),/caves: missing checkout/);
});

test('rejects invalid declarations before any filesystem checks',async()=>{
 const m=manifest();m.producers.surface.files[0].path='../escape';
 let calls=0;
 const r=await verifyManifestCheckouts({manifest:m,checkouts,verify:async()=>{calls++;return {};}});
 assert.equal(calls,0);
 assert.equal(r.status,'NOT_VERIFIED');
 assert.ok(r.errors.some(e=>e.includes('unsafe source path')));
});

test('rejects mismatched commit, digest, and verifier errors',async()=>{
 const r=await verifyManifestCheckouts({manifest:manifest(),checkouts,verify:async a=>{
  const lane=Object.keys(a.manifest)[0],p=a.manifest[lane];
  if(lane==='surface')return {results:[{lane,status:'SOURCE_MATCH',commit:'c'.repeat(40),path:p.path,sha256:p.sha256}]};
  if(lane==='caves')throw Error('git unavailable');
  return {results:[{lane,status:'SOURCE_MATCH',commit:p.commit,path:p.path,sha256:'d'.repeat(64)}]};
 }});
 assert.equal(r.status,'NOT_VERIFIED');
 assert.equal(r.results.filter(x=>x.status==='NOT_VERIFIED').length,3);
});
