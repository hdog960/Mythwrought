import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,symlink,rm,realpath,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {verifyCheckoutProducers} from '../../src/auto-integration-support/producer-checkout-verifier.mjs';
const commit='a'.repeat(40);
const bytes='producer-source';
const digest=createHash('sha256').update(bytes).digest('hex');
const lanes=['surface','caves','objects'];
async function fixture(t){
 const root=await mkdtemp(join(tmpdir(),'mythwrought-12-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 await mkdir(join(root,'src'));
 await writeFile(join(root,'src','producer.mjs'),bytes);
 const manifest=Object.fromEntries(lanes.map(lane=>[lane,{checkout:root,path:'src/producer.mjs',commit,sha256:digest}]));
 const run=async(_cmd,args)=>({stdout:args.includes('rev-parse')?commit+'\n':''});
 return {root,manifest,run};
}
test('three exact clean producer checkouts are source matches, not integration proof',async t=>{
 const f=await fixture(t);
 const r=await verifyCheckoutProducers(f);
 assert.equal(r.status,'SOURCE_MATCH_ONLY');
 assert.deepEqual(r.results.map(x=>x.status),['SOURCE_MATCH','SOURCE_MATCH','SOURCE_MATCH']);
 assert.equal(r.integrationVerified,false);
 assert.equal(r.browserVerified,false);
});
test('HEAD mismatch and dirty producer are rejected',async t=>{
 const f=await fixture(t);
 const run=async(_cmd,args)=>({stdout:args.includes('rev-parse')?'b'.repeat(40):''});
 const r=await verifyCheckoutProducers({...f,run});
 assert.equal(r.status,'NOT_VERIFIED');
 assert.ok(r.results.every(x=>x.reason==='checkout HEAD mismatch'));
 const dirty=async(_cmd,args)=>({stdout:args.includes('status')?' M src/producer.mjs':commit});
 const d=await verifyCheckoutProducers({...f,run:dirty});
 assert.ok(d.results.every(x=>x.reason==='producer source has uncommitted changes'));
});
test('symlink escape and traversal are rejected before source reads',async t=>{
 const f=await fixture(t);
 const outside=await mkdtemp(join(tmpdir(),'mythwrought-outside-'));
 t.after(()=>rm(outside,{recursive:true,force:true}));
 await writeFile(join(outside,'external.mjs'),bytes);
 await symlink(join(outside,'external.mjs'),join(f.root,'src','linked.mjs'));
 f.manifest.surface.path='src/linked.mjs';
 f.manifest.caves.path='../external.mjs';
 const r=await verifyCheckoutProducers(f);
 assert.equal(r.status,'NOT_VERIFIED');
 assert.equal(r.results[0].reason,'producer path escapes checkout');
 assert.equal(r.results[1].reason,'invalid or absent producer declaration');
 assert.equal(r.results[2].status,'SOURCE_MATCH');
});
test('digest mismatch and missing lane fail closed',async t=>{
 const f=await fixture(t);
 f.manifest.objects.sha256='0'.repeat(64);
 delete f.manifest.caves;
 const r=await verifyCheckoutProducers(f);
 assert.equal(r.status,'NOT_VERIFIED');
 assert.equal(r.results[0].status,'SOURCE_MATCH');
 assert.equal(r.results[1].status,'NOT_VERIFIED');
 assert.equal(r.results[2].reason,'producer source digest mismatch');
});
