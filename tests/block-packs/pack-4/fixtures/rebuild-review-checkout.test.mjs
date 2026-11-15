// Pack 4-owned native Node tests for strict, standalone Git-blob recovery.
// Nested so the authoritative existing 16-suite / 181-case acceptance is unchanged.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {gitBlobSha,selectPackFiles,TESTS,REQUIRED_MAIN,buildReviewCheckout} from '../rebuild-review-checkout.mjs';
const hex='a'.repeat(40),other='b'.repeat(40);
const additional=['src/block-packs/pack-4/windows.mjs',
 'src/block-packs/pack-4/lighting.mjs','src/block-packs/pack-4/furnishings.mjs',
 'src/block-packs/pack-4/hearth-civic.mjs','src/block-packs/pack-4/fixture.mjs',
 'src/block-packs/pack-4/manifest.json','tests/block-packs/pack-4/gallery.html',
 'tests/block-packs/pack-4/gallery.mjs','tests/block-packs/pack-4/gallery-browser.mjs',
 'tests/block-packs/pack-4/verify-final.mjs','tests/block-packs/pack-4/current-main-loader.mjs',
 'src/block-packs/pack-4/preview-utils.mjs','src/block-packs/pack-4/interaction-handoff.mjs',
 'src/block-packs/pack-4/M5_ACCEPTANCE.md','src/block-packs/pack-4/INTEGRATION.md',
 'src/block-packs/pack-4/PROGRESS.md'];
const packPaths=[...TESTS,...additional];
assert.equal(packPaths.length,32);
function entry(path,bytes){return {path,type:'blob',size:bytes.length,sha:gitBlobSha(bytes)};}
function mock({corruptPath=null,missingMain=false}={}){
 const all=new Map();const main=REQUIRED_MAIN.filter(p=>!missingMain||p!==REQUIRED_MAIN[0]);
 for(const path of [...main,...packPaths])all.set(path,Buffer.from('content-for:'+path));
 const treeMain={tree:main.map(p=>entry(p,all.get(p))),truncated:false};
 const treePack={tree:packPaths.map(p=>entry(p,all.get(p))),truncated:false};
 const fetcher=async url=>{
  let payload;
  if(url.includes('/git/trees/'))payload=Buffer.from(JSON.stringify(url.includes('/trees/'+hex)?treeMain:treePack));
  else{
   const path=decodeURI(url.split('/').slice(6).join('/'));
   payload=all.get(path);
   if(!payload)throw Error('Unknown test fixture source '+url);
   if(corruptPath===path)payload=Buffer.from('corruption');
  }
  return {ok:true,status:200,async json(){return JSON.parse(payload.toString())},
   async arrayBuffer(){return payload}};
 };
 return {fetcher,all};
}
test('Git blob SHA is byte-exact, including unicode, NUL and size header',()=>{
 assert.equal(gitBlobSha(Buffer.alloc(0)), 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391');
 assert.notEqual(gitBlobSha('a'),gitBlobSha('a\n'));
 assert.notEqual(gitBlobSha('é'),gitBlobSha('e'));
});
test('all 16 native suites are required and incomplete/truncated trees fail closed',()=>{
 const {all}=mock();
 const t={tree:packPaths.map(p=>entry(p,all.get(p))),truncated:false};
 assert.equal(selectPackFiles(t).size,32);
 assert.throws(()=>selectPackFiles({...t,truncated:true}),/Incomplete/);
 assert.throws(()=>selectPackFiles({...t,tree:t.tree.filter(x=>x.path!==TESTS[3])}),/Unexpected|Missing/);
 const injected={...t,tree:[...t.tree.slice(1),entry('src/block-packs/pack-4/../escape.mjs',Buffer.from('x'))]};
 assert.throws(()=>selectPackFiles(injected),/Unsafe/);
});
test('reconstructs a pinned main plus pack with verified source files in isolated folder',async()=>{
 const output=await mkdtemp(join(tmpdir(),'pack4-review-test-'));
 try{
  const {fetcher,all}=mock();
  const result=await buildReviewCheckout({mainSha:hex,packSha:other,output,fetcher});
  assert.equal(result.verifiedFiles,36);
  assert.equal(result.sharedFiles,4);assert.equal(result.packFiles,32);
  assert.equal(result.suites,16);
  assert.deepEqual(await readFile(join(output,packPaths[0])),all.get(packPaths[0]));
  assert.deepEqual(await readFile(join(output,REQUIRED_MAIN[0])),all.get(REQUIRED_MAIN[0]));
  await assert.rejects(()=>buildReviewCheckout({mainSha:hex,packSha:other,output,fetcher}),/nonempty/);
 }finally{await rm(output,{recursive:true,force:true});}
});
test('rejects byte-modified responses instead of accepting a plausible source',async()=>{
 const output=await mkdtemp(join(tmpdir(),'pack4-review-test-'));
 try{
  await assert.rejects(()=>buildReviewCheckout({mainSha:hex,packSha:other,output,
   fetcher:mock({corruptPath:packPaths[0]}).fetcher,concurrency:1}),/MISMATCH/);
  assert.deepEqual(await readdir(output),[],'a failed review cannot leave misleading partial source');
 }finally{await rm(output,{recursive:true,force:true});}
});
test('does not silently fill missing main modules or accept floating refs',async()=>{
 await assert.rejects(()=>buildReviewCheckout({mainSha:'main',packSha:other}),/40-hex/);
 await assert.rejects(()=>buildReviewCheckout({mainSha:hex,packSha:other,
  fetcher:mock({missingMain:true}).fetcher}),/Missing or invalid main dependency/);
});
