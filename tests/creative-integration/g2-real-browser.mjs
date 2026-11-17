// Optional DETACHED G2A Chromium harness; production flight remains feature-off.
// Manual: start python3 -m http.server 4173 and run this script after installing Playwright.
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {chromium} from 'playwright';
const origin=process.env.G2_BROWSER_ORIGIN||'http://127.0.0.1:4173';
const sizes=[[568,320],[667,375],[844,390],[932,430],[956,440],[1180,520]];
const browser=await chromium.launch({headless:true,args:[
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 mkdirSync('artifacts',{recursive:true});
 for(const [width,height] of sizes){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,deviceScaleFactor:1});
  const page=await context.newPage();
  try{
   await page.goto(origin+'/',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.loadedChunks!==undefined,{timeout:30000});
   const before=await page.evaluate(()=>{
    const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();
      return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
    return {canvas:rect('#scene'),viewport:rect('.viewport'),left:rect('.grip.left'),
     right:rect('.grip.right'),mini:rect('#miniMapButton'),
     webgl:Boolean(document.querySelector('#scene').getContext('webgl2')),
     disabled:document.querySelector('[data-creative-flight-enabled]')===null};
   });
   assert.equal(before.webgl,true,'Real game WebGL2 unavailable');
   assert.equal(before.disabled,true,'G2A must not mount flight controls into production');
   assert.ok(before.left.right<=before.canvas.left+3,'Left grip invades viewport');
   assert.ok(before.right.left>=before.canvas.right-3,'Right grip invades viewport');
   assert.ok(before.mini.left>=before.viewport.left-3&&before.mini.right<=before.viewport.right+3,'Minimap escaped viewport');
   assert.ok(before.mini.top>=before.viewport.top-3,'Minimap overlapped bezel');
   assert.ok(before.mini.right>=before.viewport.right-30,'Minimap moved from upper-right');
   const detached=await page.evaluate(async()=>{
    const flight=await import('/src/creative-integration/g2-flight.mjs');
    const controls=await import('/src/creative-integration/g2-control-state.mjs');
    const state=flight.createG2FlightState({position:{x:0,y:6,z:0},
      heightBounds:{minFeet:-20,maxFeet:24},worldToken:'test:isolated'});
    const gated=flight.armG2Flight(state,{enabled:false});
    const input=controls.readG2ControlIntent(controls.createG2ControlState());
    return {profiles:Object.keys(flight.G2_FLIGHT_SPEEDS),mode:gated.mode,
      vertical:input.vertical,forward:input.forward,readOnly:Object.isFrozen(gated)};
   });
   assert.deepEqual(detached.profiles,['precision','normal','fast','travel']);
   assert.equal(detached.mode,'off');assert.equal(detached.vertical,0);
   assert.equal(detached.forward,0);assert.equal(detached.readOnly,true);
   await page.screenshot({path:'artifacts/mythwrought-g2a-feature-off-'+width+'x'+height+'.png'});
   await page.locator('#miniMapButton').click();
   assert.equal(await page.locator('#explorationOverlay').isVisible(),true,'Existing minimap must still expand');
   await page.locator('#closeExploration').click();
   assert.equal(await page.locator('#explorationOverlay').isVisible(),false);
   console.log('PASS G2A detached source and real WebGL2 layout '+width+'x'+height);
  }finally{await context.close();}
 }
}finally{await browser.close();}
