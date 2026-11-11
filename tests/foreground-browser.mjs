// Gate A: actual Chromium foreground/background lifecycle and bounded GPU chunks.
// Mobile emulation is not a real iPhone, battery, thermal or Safari certification.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({
  viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true
});
const page=await context.newPage(),errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url());});
const state=()=>page.evaluate(()=>{
 const c=document.querySelector('#scene'),dev=window.__mythwroughtTest;
 return {rendered:Number(c.dataset.renderedFrames),center:c.dataset.chunkCenter,
   loaded:Number(c.dataset.loadedChunks),pending:Number(c.dataset.pendingChunks),
   pos:[Number(c.dataset.playerX),Number(c.dataset.playerZ)],
   driver:dev.snapshot().frameDriver,mesh:dev.snapshot().meshCadence};
});
const saved=()=>page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,
  null,{timeout:30000});
 const before=await state();
 assert.equal(before.driver.running,true);
 assert.ok(before.rendered>0);
 await page.evaluate(()=>window.__mythwroughtTest.placeFixture(15,18,-1,4));
 const original=await saved();assert.ok(original?.includes('[15,18,-1,4]'));

 // Hold a movement key, let it move, then simulate the real visibilitychange
 // handler in Chromium. CDP has no setPageVisibilityState command in this build.
 await page.locator('#scene').focus();
 await page.keyboard.down('w');
 await page.waitForFunction(old=>Math.hypot(
  Number(document.querySelector('#scene').dataset.playerX)-old[0],
  Number(document.querySelector('#scene').dataset.playerZ)-old[1])>.15,before.pos,{timeout:7000});
 const simulateVisibility=hidden=>page.evaluate(hidden=>{
   // Synthetic visibility input, real DOM event handlers/RAF/physics in Chromium.
   // Browser OS tab throttling and physical Safari require separate manual tests.
   if(!Object.prototype.hasOwnProperty.call(document,'hidden')){
     Object.defineProperty(document,'hidden',{configurable:true,
       get:()=>window.__testHidden});
   }
   window.__testHidden=hidden;
   document.dispatchEvent(new Event('visibilitychange'));
 },hidden);
 await simulateVisibility(true);
 const hidden=await page.evaluate(()=>({hidden:document.hidden,driver:window.__mythwroughtTest.snapshot().frameDriver}));
 assert.equal(hidden.hidden,true,'Chromium visibility override did not hide page');
 assert.equal(hidden.driver.running,false,'RAF remained scheduled in background');
 await page.waitForTimeout(350);
 const frozen=await state();
 await page.waitForTimeout(250);
 assert.equal((await state()).rendered,frozen.rendered,'Hidden world continued rendering frames');
 assert.equal(await saved(),original,'Background transition overwrote canonical world bytes');

 await simulateVisibility(false);
 await page.waitForFunction(()=>window.__mythwroughtTest.snapshot().frameDriver.running);
 await page.waitForFunction(base=>Number(document.querySelector('#scene').dataset.renderedFrames)>base,
  frozen.rendered,{timeout:9000});
 const awake=await state();
 assert.ok(awake.driver.wakeCount>before.driver.wakeCount);
 await page.waitForTimeout(260);
 const stopped=await state();
 assert.ok(Math.hypot(stopped.pos[0]-awake.pos[0],stopped.pos[1]-awake.pos[1])<.05,
   'Keyboard movement remained latched after tab hide/show');

 // BFCache-style pagehide/pageshow must not duplicate a render loop.
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
 assert.equal((await state()).driver.running,false);
 const afterHide=await state();
 await page.waitForTimeout(130);
 assert.equal((await state()).rendered,afterHide.rendered);
 await page.evaluate(()=>window.dispatchEvent(new Event('pageshow')));
 await page.waitForFunction(()=>window.__mythwroughtTest.snapshot().frameDriver.running);
 const afterShow=await state();
 assert.equal(afterShow.driver.wakeCount,before.driver.wakeCount+2);
 await page.waitForFunction(base=>Number(document.querySelector('#scene').dataset.renderedFrames)>base,
  afterShow.rendered,{timeout:7000});
 assert.equal(await saved(),original,'BFCache events rewrote valid world save');

 // Cross-chunk streaming remains bounded, non-starving and preserves edits.
 await page.evaluate(()=>window.__mythwroughtTest.teleport(-16.5,-.5));
 await page.waitForFunction(()=>document.querySelector('#scene').dataset.chunkCenter==='-2,-1',
  null,{timeout:7000});
 await page.waitForFunction(()=>Number(document.querySelector('#scene').dataset.loadedChunks)===25&&
  Number(document.querySelector('#scene').dataset.pendingChunks)===0,null,{timeout:35000});
 const streamed=await state();
 assert.equal(streamed.loaded,25);
 assert.equal(streamed.pending,0);
 assert.ok(streamed.mesh.meshes>=25);
 assert.ok(streamed.mesh.skipped>=0);
 assert.equal(await saved(),original,'Streaming unexpectedly modified saved blocks');

 await mkdir('artifacts',{recursive:true});
 await page.screenshot({path:'artifacts/mythwrought-v010-foreground-resume-landscape.png'});
 await page.locator('#menu').click();
 await page.locator('#runAudit').click();
 await page.waitForFunction(()=>document.querySelector('#auditReport').value.includes('mesh uploads'),null,{timeout:10000});
 const report=await page.locator('#auditReport').inputValue();
 assert.match(report,/mesh uploads \d+, deferred frames \d+/);
 assert.match(report,/MANUAL iPhone Safari/);
 assert.match(report,/geometry PASS/);
 await page.locator('#auditReport').screenshot({path:'artifacts/mythwrought-v010-mesh-lifecycle-audit.png'});
 await page.locator('#closeHelp').click();
 await page.screenshot({path:'artifacts/mythwrought-v010-foreground-grip-landscape.png'});
 assert.deepEqual(errors,[],'JavaScript errors after hidden/resume/streaming');
 assert.deepEqual(failed,[],'Missing resources');
 console.log('PASS v0.10 simulated visibility pause/RAF resume, no stuck movement, BFCache-style events, preserved schema-1 save, bounded meshing and diagnostic screenshot');
}finally{await browser.close();}
