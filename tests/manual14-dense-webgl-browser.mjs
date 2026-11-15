// Real game WebGL2 512-piece construction at one iPhone landscape viewport.
// Uses the same Builder AI facade, separate authoritative saves and shader
// as the regular playable game. Software Chromium is NOT a physical iPhone.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const out='artifacts/manual14-live';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:[
 '--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--enable-unsafe-swiftshader','--disable-dev-shm-usage'
]});
const context=await browser.newContext({
 viewport:{width:956,height:440},deviceScaleFactor:1,isMobile:true,hasTouch:true
});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__mythwroughtTest?.snapshot&&
  Number(document.querySelector('#scene')?.dataset?.renderedFrames)>0,
  null,{timeout:45000});
 const placement=await page.evaluate(async()=>{
  const t=window.__mythwroughtTest;
  const {MANUAL_FIVE_PACK_CATALOG}=await import('./src/builder-assets/manual-five-pack.mjs');
  const p1=MANUAL_FIVE_PACK_CATALOG.find(x=>x.numericId===9),
        p4=MANUAL_FIVE_PACK_CATALOG.find(x=>x.numericId===159);
  if(!p1||!p4)throw Error('Source-authentic builder assets missing');
  // Keep the test player outside every placement; the sole game API is used.
  t.teleport(800,800);
  const perChunk=new Map(),rows=[];
  for(let i=0;i<4096&&rows.length<512;i++){
   const x=480+3*(i%48),z=480+3*Math.floor(i/48),at=[x,19,z],
         key=Math.floor(x/16)+','+Math.floor(z/16);
   if((perChunk.get(key)??0)>=16||t.block(...at)!==0)continue;
   const a=rows.length%2?p4:p1;
   rows.push({asset:a.symbol,numericId:a.numericId,at,orientation:rows.length%4});
   perChunk.set(key,(perChunk.get(key)??0)+1);
  }
  if(rows.length!==512)throw Error('No safe 512-cell high-air footprint in real seeded world');
  const result=t.placeManualBuilderBatch(rows);
  if(!result.ok)throw Error('Source-owned 512-cell batch rejected: '+result.reason);
  t.teleport(540,500);
  return {requested:rows.length,chunkSections:perChunk.size,maxPerChunk:Math.max(...perChunk.values()),
   result,first:rows[0].at,last:rows.at(-1).at};
 });
 await page.waitForFunction(()=>{
  const c=document.querySelector('#scene');
  return Number(c.dataset.manual14VisibleInstances)>=32&&
    Number(c.dataset.manual14MeshVertices)>1000;
 },null,{timeout:90000});
 await page.waitForTimeout(1000);
 const rendered=await page.evaluate(()=>{
  const t=window.__mythwroughtTest,c=document.querySelector('#scene'),
        s=t.snapshot(),l=document.querySelector('#movePad').getBoundingClientRect(),
        r=document.querySelector('#lookPad').getBoundingClientRect();
  const saved=JSON.parse(localStorage.getItem('mythwrought.manual14.seed.179'));
  return {worldSchema:1,sidecarCount:saved.entries.length,
   pack1and4:s.manual14PhysicalBlocks,
   gpuResidentInstances:Number(c.dataset.manual14VisibleInstances),
   gpuResidentVertices:Number(c.dataset.manual14MeshVertices),
   totalTerrainVertices:Number(c.dataset.renderedMeshVertices),
   loadedChunkSections:s.chunks.length,pendingChunkSections:s.pending.length,
   gpuRetries:s.gpuRetry.failures,
   frameDriver:s.frameDriver,frameCadence:s.meshCadence,
   separateThumbRails:l.right<r.left};
 });
 assert.equal(placement.requested,512);
 assert.equal(rendered.sidecarCount,512);
 assert.equal(rendered.pack1and4,512);
 assert.ok(rendered.gpuResidentInstances>=32);
 assert.ok(rendered.gpuResidentVertices>1000);
 assert.ok(rendered.totalTerrainVertices>0);
 assert.ok(rendered.loadedChunkSections<=25,'Surface load exceeded canonical 25 chunk window');
 assert.equal(rendered.gpuRetries,0,'Source-owned authored chunk caused GPU retries');
 assert.equal(rendered.separateThumbRails,true);
 await page.screenshot({path:out+'/manual14-dense-512-956x440.png'});
 // Reload from the authoritative sidecar, not an in-memory preview facade.
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__mythwroughtTest?.snapshot?.().manual14PhysicalBlocks===512,
  null,{timeout:60000});
 await page.evaluate(()=>window.__mythwroughtTest.teleport(540,500));
 await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.manual14VisibleInstances)>=32,
  null,{timeout:90000});
 const restored=await page.evaluate(()=>{
  const s=window.__mythwroughtTest.snapshot();
  return {count:s.manual14PhysicalBlocks,gpuResident:
   Number(document.querySelector('#scene').dataset.manual14MeshVertices),failures:s.gpuRetry.failures};
 });
 assert.equal(restored.count,512);
 assert.ok(restored.gpuResident>1000);
 assert.equal(restored.failures,0);
 assert.deepEqual(errors,[],'Browser exception in actual 512-piece game');
 console.log(JSON.stringify({placement,rendered,restored,pageErrors:errors.length}));
}finally{await context.close();await browser.close();}
