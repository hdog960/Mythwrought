// Genuine G2B browser acceptance against actual playable WebGL2 source.
// Required localhost: http://127.0.0.1:4174 unless G2B_BROWSER_ORIGIN overrides.
// Test file lives strictly within G2B ownership; never replays real user saves.
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {chromium} from 'playwright';
const origin=process.env.G2B_BROWSER_ORIGIN||'http://127.0.0.1:4174';
const sizes=[[568,320],[667,375],[844,390],[932,430],[956,440],[1180,520]];
const browser=await chromium.launch({headless:true,args:['--enable-webgl',
 '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const touch=(id,x,y)=>({id,x:Math.round(x),y:Math.round(y)});
const center=rect=>({x:rect.x+rect.width/2,y:rect.y+rect.height/2});
mkdirSync('artifacts',{recursive:true});
try{
 for(const [width,height] of sizes){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,
    isMobile:true,deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>=25,
     undefined,{timeout:40000});
   const state=await page.evaluate(()=>{
     const r=id=>{const x=document.querySelector(id).getBoundingClientRect();
       return {left:x.left,right:x.right,top:x.top,bottom:x.bottom,width:x.width,height:x.height};};
     const el=document.querySelector('#scene'),world=r('.viewport'),map=r('#miniMapButton');
     return {left:r('.grip.left'),right:r('.grip.right'),world,map,
       canvas:r('#scene'),gl:!!el.getContext('webgl2'),off:el.dataset.g2bFlight,
       loaded:Number(el.dataset.loadedChunks),notice:document.querySelector('#notice').hidden,
       save:localStorage.getItem('mythwrought-v002-world-179')};
   });
   assert.ok(state.gl,'G2B requires actual WebGL2');
   assert.ok(state.notice,'G2B production renderer failed');
   assert.equal(state.off,'false','Flight must start disabled');
   assert.ok(state.left.right<=state.canvas.left+3&&
     state.right.left>=state.canvas.right-3,'Grip overlaps world');
   assert.ok(state.map.right<=state.world.right+3&&
     state.map.right>=state.world.right-30&&
     state.map.top>=state.world.top-3,'Minimap must remain upper-right');
   assert.equal(await page.locator('#dig').textContent(),'MINE');
   assert.equal(await page.locator('#place').textContent(),'PLACE');
   assert.equal(await page.locator('#jump').textContent(),'JUMP');
   await page.locator('#miniMapButton').click();
   assert.equal(await page.locator('#explorationOverlay').isVisible(),true);
   await page.locator('#closeExploration').click();
   assert.equal(await page.locator('#explorationOverlay').isVisible(),false);
   await page.locator('#menu').click();
   assert.equal(await page.locator('#g2bFlightEnable').isChecked(),false);
   await page.locator('#g2bFlightEnable').check();
   let info=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   assert.equal(info.active,true,'Flight failed to arm with real loaded body clearance: '+info.reason);
   assert.equal(info.bodyClear,true);
   assert.equal(info.resident,true);
   for(const profile of ['precision','normal','fast','travel']){
    await page.locator('#g2bFlightProfile').selectOption(profile);
    info=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
    assert.equal(info.profile,profile,'G2B profile not applied');
   }
   await page.locator('#g2bFlightProfile').selectOption('normal');
   await page.locator('#closeHelp').click();
   await page.waitForTimeout(250); // paused controls may resume only after the next safe GPU frame.
   assert.equal(await page.locator('#dig').textContent(),'DOWN');
   assert.equal(await page.locator('#place').textContent(),'UP');
   assert.equal(await page.locator('#jump').textContent(),'LAND');
   const before=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   await page.keyboard.down('w');await page.waitForTimeout(340);await page.keyboard.up('w');
   await page.waitForTimeout(120);
   const after=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   const moved=Math.hypot(after.position.x-before.position.x,
     after.position.z-before.position.z);
   assert.ok(moved>.025,'Source-driven flight did not move through resident world '+width);
   assert.equal(after.bodyClear,true,'Flight entered a real physical collision');
   assert.equal(after.resident,true,'Flight outran GPU-resident chunks');
   // Genuine independent three-touch CDP input: MOVE + LOOK + UP held together.
   const cdp=await context.newCDPSession(page);
   const left=center(await page.locator('#movePad').boundingBox());
   const right=center(await page.locator('#lookPad').boundingBox());
   const up=center(await page.locator('#place').boundingBox());
   const t1=touch(101,left.x,left.y-25),t2=touch(102,right.x+12,right.y+7);
   const t3=touch(103,up.x,up.y);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',
     touchPoints:[touch(101,left.x,left.y),touch(102,right.x,right.y)]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[t1,t2]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[t1,t2,t3]});
   await page.waitForTimeout(160);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[t1,t2]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   await page.waitForTimeout(100);
   const touched=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   assert.equal(touched.bodyClear,true);
   assert.equal(touched.resident,true);
   assert.ok(touched.pendingPlans<=6,'G2B exceeds six G2A prefetch proposals');
   assert.ok(touched.residentChunks<=34,'G2B expanded original GPU chunk limit');
   // Map must remain accessible while airborne and cancel held controls.
   await page.locator('#miniMapButton').click();
   assert.equal(await page.locator('#explorationOverlay').isVisible(),true);
   await page.locator('#closeExploration').click();
   await page.waitForTimeout(100);
   assert.equal(await page.locator('#scene').getAttribute('data-g2b-flight'),'true');
   // Returning to Explore never occurs without verified ground and clear body.
   await page.locator('#jump').click();
   await page.waitForTimeout(160);
   const landed=await page.evaluate(()=>window.__mythwroughtTest.flightInfo());
   if(!landed.active){
     assert.equal(landed.bodyClear,true);
     assert.equal(await page.locator('#jump').textContent(),'JUMP');
     const vy=Number(await page.locator('#scene').getAttribute('data-player-velocity-y'));
     assert.ok(!Number.isFinite(vy)||vy<3,'Landing tap synthesized a second Explore jump');
   }else{
     assert.equal(await page.locator('#jump').textContent(),'LAND');
     assert.match(landed.reason,/landing|safe|hover|ready|blocked/i);
   }
   await page.screenshot({path:'artifacts/mythwrought-g2b-'+width+'x'+height+'.png'});
   assert.deepEqual(errors,[],'Uncaught real-game runtime exceptions');
   const still=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
   assert.equal(still,state.save,'Flight changed the existing canonical world save bytes');
   console.log('PASS G2B real Chromium WebGL2 flight and two-thumb safety '+width+'x'+height+
     ' · moved '+moved.toFixed(3)+' · landing '+(landed.active?'safe refusal':'success'));
  }finally{await context.close();}
 }
}finally{await browser.close();}
