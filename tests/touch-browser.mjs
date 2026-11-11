// Two-thumb interaction contract: real Chrome-dispatched multitouch, not synthetic DOM clicks.
// Checks isolation of movement/look, sticky-input cancellation, precision and stick mode.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const v=async()=>page.evaluate(()=>{
  const c=document.getElementById('scene');
  return {x:Number(c.dataset.playerX),z:Number(c.dataset.playerZ),yaw:Number(c.dataset.cameraYaw),
    pitch:Number(c.dataset.cameraPitch),precision:c.dataset.precision,mode:c.dataset.lookMode,
    chunks:Number(c.dataset.loadedChunks)};
});
const center=box=>({x:Math.round(box.x+box.width/2),y:Math.round(box.y+box.height/2)});
const touch=(id,x,y)=>({id,x:Math.round(x),y:Math.round(y)});
const deltaYaw=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,{timeout:20000});
  const left=center(await page.locator('#movePad').boundingBox());
  const right=center(await page.locator('#lookPad').boundingBox());
  const cdp=await context.newCDPSession(page);
  const begin=await v();
  // Both thumbs down at once, then move independently while both remain held.
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch(1,left.x,left.y),touch(2,right.x,right.y)]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[touch(1,left.x,left.y-37),touch(2,right.x+32,right.y+40)]});
  await page.waitForTimeout(650);
  const moving=await v();
  assert.ok(Math.hypot(moving.x-begin.x,moving.z-begin.z)>.15,'Left thumb did not move hero while looking');
  assert.ok(Math.abs(deltaYaw(moving.yaw,begin.yaw))>.12,'Right thumb did not turn camera while moving');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForTimeout(90);
  const released=await v();
  await page.waitForTimeout(250);
  const stopped=await v();
  assert.ok(Math.hypot(stopped.x-released.x,stopped.z-released.z)<.035,'Movement continued after both thumbs lifted');
  assert.ok(Math.abs(deltaYaw(stopped.yaw,released.yaw))<.005,'Camera drifted after release');
  assert.equal(await page.evaluate(()=>window.scrollY),0,'Multi-touch gesture scrolled the game page');
  // Continuous stick mode must rotate only while held, using a radial dead zone.
  await page.locator('#menu').click();
  await page.locator('#lookMode').selectOption('stick');
  assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v004-look-mode')),'stick');
  await page.locator('#closeHelp').click();
  const beforeStick=await v();
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch(3,right.x+32,right.y)]});
  await page.waitForTimeout(500);
  const duringStick=await v();
  assert.equal(duringStick.mode,'stick');
  assert.ok(Math.abs(deltaYaw(duringStick.yaw,beforeStick.yaw))>.09,'Hold-to-turn stick mode failed');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForTimeout(80);
  const afterStick=await v();
  await page.waitForTimeout(250);
  assert.ok(Math.abs(deltaYaw((await v()).yaw,afterStick.yaw))<.005,'Stick continued turning after release');
  // Holding precision must be a distinct action, never a persistent toggle.
  const precision=center(await page.locator('#precision').boundingBox());
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch(4,precision.x,precision.y)]});
  await page.waitForTimeout(70);
  assert.equal((await v()).precision,'true','Precision button did not engage while pressed');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForTimeout(70);
  assert.equal((await v()).precision,'false','Precision button stuck after release');
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>0);
  await page.locator('#menu').click();
  assert.equal(await page.locator('#lookMode').inputValue(),'stick','Look mode not persisted after reload');
  await page.locator('#closeHelp').click();
  // Page blur must clear any active stick to prevent motion after app-switching.
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch(5,left.x,left.y-32)]});
  await page.waitForTimeout(160);
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
  const blur=await v();
  await page.waitForTimeout(240);
  const afterBlur=await v();
  assert.ok(Math.hypot(afterBlur.x-blur.x,afterBlur.z-blur.z)<.06,'Input remained held across app blur');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.deepEqual(errors,[],'Console/page errors during 2-thumb interaction');
  console.log('PASS dual-thumb touch camera/movement, mode persistence, precision hold, and input cancellation');
}finally{
  await browser.close();
}
