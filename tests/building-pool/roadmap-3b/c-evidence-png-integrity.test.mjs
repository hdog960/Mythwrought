// Roadmap C native independent exact-head genuine Chromium evidence inspector.
// Run after browser CDP captures, never before. Never count missing artifacts.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const entries=[
 ['roadmap-c-3b-twinstone-gatehouse','r3:gatehouse:temperate:small:1'],
 ['roadmap-c-3b-fourwatch-city-wall','r3:city-wall:temperate:small:1'],
 ['roadmap-c-3b-sandglass-fork-barracks','r3:barracks:desert:medium:2']
];
const sizes=[[667,375],[844,390],[932,430]],views=['exterior','cutaway'];
const exactHead=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
test('C 3B three source-specific fortifications have 18 genuine real Chromium PNGs, exact same-head origin, decoded CRCs and unique SHA256',async()=>{
 let n=0,shaSet=new Set();
 for(const [dirname,id] of entries){
  const folder=resolve('artifacts',dirname,'chromium-webgl2-source');
  const acceptance=JSON.parse(await readFile(join(folder,'acceptance.json'),'utf8'));
  assert.equal(acceptance.exactSourceCommit,exactHead,'wrong capture checkout SHA '+dirname);
  assert.equal(acceptance.renderer,'CHROMIUM_WEBGL2_DIAGNOSTIC_CUBE_ENVELOPES');
  assert.equal(acceptance.physicalFamilyShapesRendered,false);
  assert.equal(acceptance.creatorArtApproved,false);
  assert.equal(acceptance.count,6);
  assert.equal(acceptance.reports?.length,6);
  const files=new Set();
  for(const [width,height] of sizes)for(const view of views){
   const item=acceptance.reports.find(r=>r.id===id&&r.view===view&&
    r.viewport?.[0]===width&&r.viewport?.[1]===height);
   assert.ok(item,'missing actual CDP screenshot '+id+' '+view+' '+width+'x'+height);
   assert.equal(item.gpuError,0);
   assert.ok(item.foreground>20,'empty actual source image');
   assert.ok(!files.has(item.filename),'duplicate image filename');
   files.add(item.filename);
   assert.match(item.sha256,/^[0-9a-f]{64}$/);
   assert.ok(!item.filename.includes('/')&&!item.filename.includes('\\'),'suspicious screenshot name');
   const bytes=await readFile(join(folder,item.filename));
   assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
   assert.equal(bytes.readUInt32BE(16),width);
   assert.equal(bytes.readUInt32BE(20),height);
   assert.equal(bytes.length,item.pngBytes);
   const hash=createHash('sha256').update(bytes).digest('hex');
   assert.equal(hash,item.sha256,'PNG hash mismatch for '+item.filename);
   assert.ok(!shaSet.has(hash),'identical source screenshot from different evidence view '+item.filename);
   shaSet.add(hash);
   const png=PNG.sync.read(bytes,{checkCRC:true});
   assert.equal(png.width,width);assert.equal(png.height,height);
   assert.equal(png.data.length,width*height*4);
   n++;
  }
  assert.equal(files.size,6);
 }
 assert.equal(shaSet.size,18);assert.equal(n,18);
 console.log('MYTHWROUGHT_ROADMAP_C_3B_EXACT_HEAD_REAL_PNG_CRC_SHA=18/18 '+exactHead);
});
