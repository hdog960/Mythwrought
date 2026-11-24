import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createMountainV8CandidateWorld} from '../src/manual-biomes/mountain-v8-new-world-admission.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFileSync(path.join(root,p),'utf8');
test('candidate worker cache and release markers close all seven Mountain source dependencies',()=>{
 const worker=read('sw-m5.js'),index=read('index.html'),update=read('src/app-update.mjs');
 const release='20261124-mountain-v8-candidate-03';
 assert.ok(worker.includes("const ASSET_RELEASE='"+release+"'"));
 assert.ok(worker.includes("CACHE_PREFIX+'"+release+"'"));
 assert.ok(index.includes('data-mw-release="'+release+'"'));
 assert.ok(index.includes('src/main.mjs?mw-release='+release));
 assert.ok(index.includes('styles.css?mw-release='+release));
 assert.ok(update.includes("GAME_RELEASE='"+release+"'"));
 const assets=new Set([...worker.matchAll(/"\.\/([^"]+)"/g)].map(m=>m[1]));
 const paths=[...assets].filter(p=>p.startsWith('src/manual-biomes/mountain-v8-'));
 assert.equal(paths.length,7);
 for(const p of paths){
  assert.ok(existsSync(path.join(root,p)),p);
  const body=read(p);
  for(const m of body.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){
   const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(p),m[1]));
   assert.ok(assets.has(resolved),p+' -> '+resolved);
  }
 }
});
test('explicit confirmation, default seed and absent real Web Locks fail before storage access',async()=>{
 const storage={getItem(){throw Error('unexpected storage read')}};
 await assert.rejects(createMountainV8CandidateWorld('20801',{storage,confirmed:false}),/confirmation/);
 await assert.rejects(createMountainV8CandidateWorld('179',{storage,confirmed:true}),/non-default/);
 await assert.rejects(createMountainV8CandidateWorld('20801',{storage,confirmed:true,locks:null}),/Web Locks unavailable/);
});
