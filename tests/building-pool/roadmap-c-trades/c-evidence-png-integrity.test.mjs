// Independent same-run PNG decode and CRC/SHA audit of all 6 C trade sources.
// This is an acceptance gate, NOT proof that a capture already exists.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const want=[
 ['roadmap-c-trade-desert-market','r2:market-square:desert:small:01','src/building-pool/roadmap-c-trades/wave1-desert-market.mjs'],
 ['roadmap-c-trade-riverbend-tailor','r2:tailor:temperate:small:03','src/building-pool/roadmap-c-trades/wave2-riverbend-tailor.mjs'],
 ['roadmap-c-trade-copperford-butcher','r2:butcher:temperate:small:02','src/building-pool/roadmap-c-trades/wave3-copperford-butcher.mjs'],
 ['roadmap-c-trade-silverfinch-jeweler','r2:jeweler:temperate:small:02','src/building-pool/roadmap-c-trades/wave4-silverfinch-jeweler.mjs'],
 ['roadmap-c-trade-wrenfield-bookshop','r2:bookshop:temperate:small:02','src/building-pool/roadmap-c-trades/wave5-wrenfield-bookshop.mjs'],
 ['roadmap-c-trade-winterglass-snow-market','r2:market-square:snow:small:03','src/building-pool/roadmap-c-trades/wave6-winterglass-snow-market.mjs']
];
const sizes=[[667,375],[844,390],[932,430]],views=['exterior','cutaway'];
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
test('Every real Roadmap C trade candidate has all six source-specific PNGs: decoded CRC, exact dimensions, authentic same-run SHA and distinct content',async()=>{
 let total=0,global=new Set();
 for(const [dir,id,sourcePath] of want){
  const base=resolve('artifacts',dir,'chromium-webgl2-source');
  const info=JSON.parse(await readFile(join(base,'acceptance.json'),'utf8'));
  assert.equal(info.exactSourceCommit,head,dir+' source checkout SHA not exact PR head');
  assert.equal(info.sourceModulePath,sourcePath,'different original blueprint source file');
  const recordedSourceHash=digest(await readFile(sourcePath));
  assert.equal(info.sourceModuleSha256,recordedSourceHash,'source blob revision mismatch');
  assert.equal(info.id,id,dir+' wrong C-owned original identity');
  assert.equal(info.sourceOnly,true);assert.equal(info.approved,false);
  assert.equal(info.captured,6);
  assert.equal(info.records?.length,6);
  const local=new Set();
  for(const [width,height] of sizes)for(const view of views){
   const record=info.records.find(r=>r.view===view&&
    r.viewport?.[0]===width&&r.viewport?.[1]===height);
   assert.ok(record,'missing real capture '+dir+' '+width+'x'+height+' '+view);
   assert.equal(record.id,id);
   assert.equal(record.webgl,'WebGL2');
   assert.equal(record.gpuError,0);
   assert.equal(record.canvasWidth,width);assert.equal(record.canvasHeight,height);
   assert.ok(record.coloredSamples>120,'blank GL source image');
   assert.ok(record.sourceVisibleCells>120);
   assert.equal(record.approval,'SOURCE-CUBE-DIAGNOSTIC-ONLY');
   assert.equal(record.producerMeshApproved,false);
   assert.match(record.sha256,/^[a-f0-9]{64}$/);
   assert.ok(!local.has(record.file),dir+' duplicate file name');
   local.add(record.file);
   assert.ok(!record.file.includes('/')&&!record.file.includes('\\'),'path traversal name');
   const bytes=await readFile(join(base,record.file));
   assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
   assert.equal(bytes.readUInt32BE(16),width);
   assert.equal(bytes.readUInt32BE(20),height);
   assert.equal(bytes.length,record.bytes);
   const sha=digest(bytes);
   assert.equal(sha,record.sha256,'PNG SHA mismatch '+record.file);
   assert.ok(!global.has(sha),'duplicate or copied content '+record.file);
   global.add(sha);
   const decoded=PNG.sync.read(bytes,{checkCRC:true});
   assert.equal(decoded.width,width);assert.equal(decoded.height,height);
   assert.equal(decoded.data.length,width*height*4);
   let changed=0;
   const first=decoded.data.slice(0,3).join(',');
   for(let pixel=0;pixel<decoded.data.length;pixel+=128){
    if(decoded.data.slice(pixel,pixel+3).join(',')!==first)changed++;
   }
   assert.ok(changed>80,'suspicious empty viewport '+record.file);
   total++;
  }
  assert.equal(local.size,6);
 }
 assert.equal(global.size,36);assert.equal(total,36);
 console.log('MYTHWROUGHT_ROADMAP_C_6_TRADE_PNG_CRC_SHA_REAL_EXACT_HEAD=36/36 '+head);
});
